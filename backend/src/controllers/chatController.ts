import { Request, Response } from 'express';
import { ChatSession } from '../models/ChatSession';
import { ChatMessage } from '../models/ChatMessage';
import { AiChatService } from '../services/aiChatService';

/**
 * Create a new AI chat session
 */
export const createSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { title, contextType = 'general', role = req.user?.role || 'candidate', relatedEntityId } = req.body;

    const session = await ChatSession.create({
      userId,
      title: title || `AI ${contextType.replace('_', ' ').toUpperCase()} Session`,
      contextType,
      role: role === 'recruiter' ? 'recruiter' : 'candidate',
      relatedEntityId: relatedEntityId || undefined,
      messageCount: 0,
    });

    res.status(201).json({
      success: true,
      message: 'Chat session created successfully.',
      session,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to create chat session.',
    });
  }
};

/**
 * List all chat sessions for authenticated user
 */
export const getSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { contextType } = req.query;

    const filter: any = { userId };
    if (contextType) {
      filter.contextType = contextType;
    }

    const sessions = await ChatSession.find(filter).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to retrieve chat sessions.',
    });
  }
};

/**
 * Get single session by ID along with its full conversation history
 */
export const getSessionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id;

    const session = await ChatSession.findOne({ _id: sessionId, userId });
    if (!session) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Chat session not found or access denied.',
      });
      return;
    }

    const messages = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      session,
      messages,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to fetch session conversation.',
    });
  }
};

/**
 * Send user message and get streaming/context-aware AI response
 */
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'Message content cannot be empty.',
      });
      return;
    }

    let session = await ChatSession.findOne({ _id: sessionId, userId });
    if (!session) {
      // Auto-create session if not provided or valid
      session = await ChatSession.create({
        userId,
        title: content.slice(0, 35) + '...',
        role: req.user?.role === 'recruiter' ? 'recruiter' : 'candidate',
        contextType: 'general',
      });
    }

    // 1. Save user message to database
    const userMessage = await ChatMessage.create({
      sessionId: session._id,
      sender: 'user',
      content: content.trim(),
    });

    // 2. Fetch recent conversation history for multi-turn context
    const recentHistory = await ChatMessage.find({ sessionId: session._id })
      .sort({ createdAt: -1 })
      .limit(6);

    const formattedHistory = recentHistory.reverse().map((m) => ({
      sender: m.sender,
      content: m.content,
    }));

    // 3. Generate context-aware AI response
    const aiResult = await AiChatService.generateReply(content, {
      role: session.role,
      contextType: session.contextType,
      userName: req.user?.name,
      history: formattedHistory,
    });

    // 4. Save assistant response to database
    const assistantMessage = await ChatMessage.create({
      sessionId: session._id,
      sender: 'assistant',
      content: aiResult.content,
      promptTokens: aiResult.promptTokens,
      completionTokens: aiResult.completionTokens,
      modelUsed: aiResult.modelUsed,
    });

    // 5. Update session metadata
    await ChatSession.findByIdAndUpdate(session._id, {
      $inc: { messageCount: 2 },
      $set: { updatedAt: new Date() },
    });

    res.status(200).json({
      success: true,
      userMessage,
      assistantMessage,
      suggestedFollowUps: aiResult.suggestedFollowUps,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to process message.',
    });
  }
};

/**
 * Delete chat session and associated messages
 */
export const deleteSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id;

    const session = await ChatSession.findOneAndDelete({ _id: sessionId, userId });
    if (!session) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Chat session not found.',
      });
      return;
    }

    await ChatMessage.deleteMany({ sessionId });

    res.status(200).json({
      success: true,
      message: 'Chat session and message history deleted successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to delete chat session.',
    });
  }
};

/**
 * Submit user feedback on AI response
 */
export const submitFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params;
    const { isHelpful, comment } = req.body;

    const message = await ChatMessage.findByIdAndUpdate(
      messageId,
      { $set: { feedback: { isHelpful: Boolean(isHelpful), comment } } },
      { new: true }
    );

    if (!message) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Chat message not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Feedback recorded successfully.',
      feedback: message.feedback,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to submit feedback.',
    });
  }
};
