-- =====================================================
-- SENDORA AI - SUPABASE DATABASE SETUP
-- =====================================================
-- Copy this entire SQL and run in Supabase SQL Editor
-- https://supabase.com/dashboard/project/bmpteadatirqfaweykns/editor
-- =====================================================

-- Table 1: Call Metrics (stores individual call data)
CREATE TABLE IF NOT EXISTS call_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_name TEXT,
  company_name TEXT,
  phone_number TEXT,
  call_duration INTEGER,
  call_status TEXT,
  pickup_status TEXT,
  appointment_booked BOOLEAN DEFAULT false,
  sentiment_score DECIMAL(3,2),
  confidence_score DECIMAL(3,2),
  ai_summary TEXT,
  transcript TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table 2: Daily Call Metrics (aggregated daily stats)
CREATE TABLE IF NOT EXISTS daily_call_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE,
  total_calls INTEGER,
  total_pickups INTEGER,
  total_appointments INTEGER,
  avg_call_duration INTEGER,
  avg_sentiment_score DECIMAL(3,2),
  avg_confidence_score DECIMAL(3,2),
  success_rate DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table 3: System Logs (error tracking)
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT,
  error_type TEXT,
  error_message TEXT,
  error_stack TEXT,
  context JSONB,
  severity TEXT CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  timestamp TIMESTAMP DEFAULT NOW(),
  resolved BOOLEAN DEFAULT false
);

-- =====================================================
-- INSERT TEST DATA
-- =====================================================

-- Sample call records
INSERT INTO call_metrics (prospect_name, company_name, phone_number, call_duration, call_status, pickup_status, appointment_booked, sentiment_score, confidence_score, ai_summary)
VALUES 
  ('John Smith', 'Tech Corp', '+1234567890', 180, 'completed', 'picked_up', true, 0.85, 0.92, 'Successful call with high engagement'),
  ('Sarah Johnson', 'Innovation Labs', '+0987654321', 120, 'completed', 'picked_up', false, 0.65, 0.78, 'Initial contact, follow-up needed'),
  ('Mike Davis', 'Growth Ventures', '+1122334455', 200, 'completed', 'picked_up', true, 0.92, 0.95, 'Excellent conversation, meeting scheduled'),
  ('Emily White', 'Digital Solutions', '+5566778899', 90, 'completed', 'not_picked_up', false, 0.30, 0.40, 'No answer, voicemail left'),
  ('Robert Brown', 'Cloud Systems', '+9988776655', 250, 'completed', 'picked_up', true, 0.88, 0.90, 'Great discussion, demo scheduled');

-- Sample daily metrics
INSERT INTO daily_call_metrics (date, total_calls, total_pickups, total_appointments, avg_call_duration, avg_sentiment_score, avg_confidence_score, success_rate)
VALUES 
  (CURRENT_DATE, 25, 18, 12, 150, 0.75, 0.85, 72.00),
  (CURRENT_DATE - INTERVAL '1 day', 30, 22, 15, 165, 0.80, 0.88, 73.33),
  (CURRENT_DATE - INTERVAL '2 days', 28, 20, 14, 155, 0.78, 0.86, 71.43),
  (CURRENT_DATE - INTERVAL '3 days', 32, 24, 16, 170, 0.82, 0.89, 75.00),
  (CURRENT_DATE - INTERVAL '4 days', 27, 19, 13, 160, 0.76, 0.84, 68.42),
  (CURRENT_DATE - INTERVAL '5 days', 29, 21, 14, 158, 0.79, 0.87, 72.41),
  (CURRENT_DATE - INTERVAL '6 days', 31, 23, 15, 168, 0.81, 0.88, 74.19);

-- Sample system logs
INSERT INTO system_logs (request_id, error_type, error_message, severity, context)
VALUES 
  ('req_' || EXTRACT(EPOCH FROM NOW())::TEXT, 'INFO', 'System initialized successfully', 'info', '{"component": "dashboard"}'),
  ('req_' || (EXTRACT(EPOCH FROM NOW()) + 1)::TEXT, 'WARNING', 'High API usage detected', 'warning', '{"api": "gemini", "usage": "85%"}'),
  ('req_' || (EXTRACT(EPOCH FROM NOW()) + 2)::TEXT, 'ERROR', 'Failed to send email', 'error', '{"recipient": "test@example.com", "smtp_error": "timeout"}');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these after setup to verify:

-- SELECT COUNT(*) FROM call_metrics;
-- SELECT COUNT(*) FROM daily_call_metrics;
-- SELECT COUNT(*) FROM system_logs;
