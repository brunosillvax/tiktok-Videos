-- AutoReel Database Schema

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create TikTok credentials table
CREATE TABLE tiktok_credentials (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_in INTEGER NOT NULL,
    open_id VARCHAR(255) UNIQUE NOT NULL,
    scope VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create monitored profiles table
CREATE TABLE monitored_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    instagram_username VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    profile_picture_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_checked_at TIMESTAMPTZ,
    last_posted_at TIMESTAMPTZ,
    check_interval_minutes INTEGER DEFAULT 60,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, instagram_username)
);

-- Create posted reels table
CREATE TABLE posted_reels (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL REFERENCES monitored_profiles(id) ON DELETE CASCADE,
    instagram_reel_code VARCHAR(50) NOT NULL UNIQUE,
    instagram_reel_url TEXT,
    tiktok_post_id VARCHAR(255),
    tiktok_post_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    error_message TEXT,
    video_file_path TEXT,
    caption TEXT,
    hashtags TEXT[],
    posted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create application logs table
CREATE TABLE application_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    context JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create user sessions table for JWT management
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create proxy configurations table
CREATE TABLE proxy_configurations (
    id SERIAL PRIMARY KEY,
    proxy_url TEXT NOT NULL,
    proxy_type VARCHAR(20) NOT NULL DEFAULT 'http',
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMPTZ,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_tiktok_credentials_user_id ON tiktok_credentials(user_id);
CREATE INDEX idx_monitored_profiles_user_id ON monitored_profiles(user_id);
CREATE INDEX idx_monitored_profiles_active ON monitored_profiles(is_active);
CREATE INDEX idx_monitored_profiles_last_checked ON monitored_profiles(last_checked_at);
CREATE INDEX idx_posted_reels_profile_id ON posted_reels(profile_id);
CREATE INDEX idx_posted_reels_status ON posted_reels(status);
CREATE INDEX idx_posted_reels_instagram_code ON posted_reels(instagram_reel_code);
CREATE INDEX idx_application_logs_user_id ON application_logs(user_id);
CREATE INDEX idx_application_logs_timestamp ON application_logs(timestamp);
CREATE INDEX idx_application_logs_level ON application_logs(level);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX idx_proxy_configurations_active ON proxy_configurations(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tiktok_credentials_updated_at BEFORE UPDATE ON tiktok_credentials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monitored_profiles_updated_at BEFORE UPDATE ON monitored_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posted_reels_updated_at BEFORE UPDATE ON posted_reels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
