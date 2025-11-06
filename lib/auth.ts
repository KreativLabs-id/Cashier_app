import { sql } from './db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

export type UserRole = 'admin' | 'kasir';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-change-this'
);
const SESSION_EXPIRY = parseInt(process.env.SESSION_EXPIRY || '86400'); // 24 hours

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Create JWT token
export async function createToken(userId: string, role: UserRole): Promise<string> {
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_EXPIRY}s`)
    .sign(JWT_SECRET);
  
  return token;
}

// Verify JWT token
export async function verifyToken(token: string): Promise<{ userId: string; role: UserRole } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      role: payload.role as UserRole,
    };
  } catch (error) {
    return null;
  }
}

// Login user
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User; token: string } | null> {
  try {
    // Find user by email
    const users = await sql`
      SELECT * FROM users 
      WHERE email = ${email} AND is_active = true
    `;

    if (users.length === 0) {
      return null;
    }

    const user = users[0] as User & { password_hash: string };

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return null;
    }

    // Create token
    const token = await createToken(user.id, user.role);

    // Save session to database
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY * 1000);
    await sql`
      INSERT INTO sessions (user_id, token, expires_at)
      VALUES (${user.id}, ${token}, ${expiresAt.toISOString()})
    `;

    // Remove password_hash from response
    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

// Logout user
export async function logoutUser(token: string): Promise<boolean> {
  try {
    await sql`
      DELETE FROM sessions WHERE token = ${token}
    `;
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}

// Get current user from token
export async function getCurrentUser(token: string): Promise<User | null> {
  try {
    // Verify token
    const payload = await verifyToken(token);
    if (!payload) {
      return null;
    }

    // Check if session exists and not expired
    const sessions = await sql`
      SELECT * FROM sessions 
      WHERE token = ${token} AND expires_at > NOW()
    `;

    if (sessions.length === 0) {
      return null;
    }

    // Get user
    const users = await sql`
      SELECT id, email, name, role, is_active, created_at, updated_at 
      FROM users 
      WHERE id = ${payload.userId} AND is_active = true
    `;

    if (users.length === 0) {
      return null;
    }

    return users[0] as User;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

// Get session token from cookies
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token');
  return token?.value || null;
}

// Set session token in cookies
export async function setSessionToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_EXPIRY,
    path: '/',
  });
}

// Clear session token from cookies
export async function clearSessionToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session_token');
}

// Require authentication middleware
export async function requireAuth(): Promise<User | null> {
  const token = await getSessionToken();
  if (!token) {
    return null;
  }

  return getCurrentUser(token);
}

// Require specific role
export async function requireRole(allowedRoles: UserRole[]): Promise<User | null> {
  const user = await requireAuth();
  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return user;
}

// Clean expired sessions (should be called periodically)
export async function cleanExpiredSessions(): Promise<void> {
  try {
    await sql`DELETE FROM sessions WHERE expires_at < NOW()`;
  } catch (error) {
    console.error('Clean expired sessions error:', error);
  }
}
