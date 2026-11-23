import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Preconfigured demonstration users for instant testing across all 3 roles
export const DEMO_USERS: Record<UserRole, User> = {
  candidate: {
    id: 'user-cand-1',
    name: 'Aditya Sharma',
    email: 'aditya@hiregenius.ai',
    role: 'candidate',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    isEmailVerified: true,
    currentSubscription: {
      planCode: 'CANDIDATE_PRO',
      status: 'active',
      validUntil: '2027-12-31T23:59:59Z',
      billingCycle: 'monthly',
    },
    createdAt: '2026-01-15T09:00:00Z',
  },
  recruiter: {
    id: 'user-rec-1',
    name: 'Rohit Deshmukh (CloudScale Tech)',
    email: 'rohit.deshmukh@cloudscale.io',
    role: 'recruiter',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    isEmailVerified: true,
    currentSubscription: {
      planCode: 'RECRUITER_PRO',
      status: 'active',
      validUntil: '2027-12-31T23:59:59Z',
      billingCycle: 'monthly',
    },
    createdAt: '2026-02-10T14:30:00Z',
  },
  admin: {
    id: 'user-admin-1',
    name: 'HireGenius Administrator',
    email: 'admin@hiregenius.ai',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
    isEmailVerified: true,
    currentSubscription: {
      planCode: 'ENTERPRISE',
      status: 'active',
      validUntil: '2030-01-01T00:00:00Z',
      billingCycle: 'yearly',
    },
    createdAt: '2026-01-01T00:00:00Z',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hiregenius_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default to candidate demo user for immediate rich testing
    return DEMO_USERS.candidate;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('hiregenius_token') || 'demo_mock_jwt_token_for_hiregenius';
  });

  const role = user?.role || null;
  const isAuthenticated = Boolean(user && token);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('hiregenius_token', newToken);
    localStorage.setItem('hiregenius_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('hiregenius_token');
    localStorage.removeItem('hiregenius_user');
  };

  const switchDemoRole = (newRole: UserRole) => {
    const demoUser = DEMO_USERS[newRole];
    login(`demo_mock_jwt_token_for_${newRole}`, demoUser);
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (!user) return;
    const merged = { ...user, ...updatedUser };
    setUser(merged);
    localStorage.setItem('hiregenius_user', JSON.stringify(merged));
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('hiregenius_user', JSON.stringify(user));
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated,
        login,
        logout,
        switchDemoRole,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
