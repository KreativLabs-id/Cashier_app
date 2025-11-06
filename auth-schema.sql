-- ================================================
-- AUTH SCHEMA UNTUK ROLE-BASED ACCESS CONTROL
-- ================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'kasir')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SESSIONS TABLE (untuk tracking login sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- INDEXES
-- ================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

-- ================================================
-- SEED DATA - DEFAULT USERS
-- ================================================
-- Password untuk semua user default: "password123"
-- Hash dibuat dengan bcrypt rounds=10

INSERT INTO users (email, password_hash, name, role, is_active) VALUES
  ('admin@tiptop.com', '$2b$10$dJs4vJUiPaIBEhqoB/WqPesImp2Oer/xdcu/.yCmCHb44z1EmIZXS', 'Admin Tip Top', 'admin', true),
  ('kasir@tiptop.com', '$2b$10$dJs4vJUiPaIBEhqoB/WqPesImp2Oer/xdcu/.yCmCHb44z1EmIZXS', 'Kasir Tip Top', 'kasir', true)
ON CONFLICT (email) DO NOTHING;

-- ================================================
-- FUNCTION: Clean expired sessions
-- ================================================
CREATE OR REPLACE FUNCTION clean_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- DONE! 🎉
-- ================================================
