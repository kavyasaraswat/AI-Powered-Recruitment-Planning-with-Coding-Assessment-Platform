import { Request, Response } from 'express';
import { Notification } from '../models/Notification';

export const getMyNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { isRead, limit = 30 } = req.query;

    const filter: any = { recipientId: userId };
    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to fetch notifications.',
    });
  }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipientId: userId },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Notification not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to update notification.',
    });
  }
};

export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    await Notification.updateMany({ recipientId: userId, isRead: false }, { $set: { isRead: true } });

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to mark all as read.',
    });
  }
};

export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const unreadCount = await Notification.countDocuments({ recipientId: userId, isRead: false });

    res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to get unread count.',
    });
  }
};
