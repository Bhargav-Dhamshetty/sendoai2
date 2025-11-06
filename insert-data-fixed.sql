-- =====================================================
-- FIX: Insert data without phone_number column
-- =====================================================
-- Run this in Supabase SQL Editor
-- =====================================================

-- Sample call records (without phone_number)
INSERT INTO call_metrics (prospect_name, company_name, call_duration, call_status, pickup_status, appointment_booked, sentiment_score, confidence_score, ai_summary)
VALUES 
  ('John Smith', 'Tech Corp', 180, 'completed', 'picked_up', true, 0.85, 0.92, 'Successful call with high engagement'),
  ('Sarah Johnson', 'Innovation Labs', 120, 'completed', 'picked_up', false, 0.65, 0.78, 'Initial contact, follow-up needed'),
  ('Mike Davis', 'Growth Ventures', 200, 'completed', 'picked_up', true, 0.92, 0.95, 'Excellent conversation, meeting scheduled'),
  ('Emily White', 'Digital Solutions', 90, 'completed', 'not_picked_up', false, 0.30, 0.40, 'No answer, voicemail left'),
  ('Robert Brown', 'Cloud Systems', 250, 'completed', 'picked_up', true, 0.88, 0.90, 'Great discussion, demo scheduled');

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
  ('req_123456', 'INFO', 'System initialized successfully', 'info', '{"component": "dashboard"}'),
  ('req_123457', 'WARNING', 'High API usage detected', 'warning', '{"api": "gemini", "usage": "85%"}'),
  ('req_123458', 'ERROR', 'Failed to send email', 'error', '{"recipient": "test@example.com", "smtp_error": "timeout"}');

-- Verify data
SELECT 'call_metrics' as table_name, COUNT(*) as row_count FROM call_metrics
UNION ALL
SELECT 'daily_call_metrics', COUNT(*) FROM daily_call_metrics
UNION ALL
SELECT 'system_logs', COUNT(*) FROM system_logs;
