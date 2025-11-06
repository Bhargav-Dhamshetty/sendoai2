-- =====================================================
-- QUICK FIX: Insert data with minimal columns
-- =====================================================
-- This should work with the n8n table structure
-- =====================================================

-- Sample call records (only basic columns)
INSERT INTO call_metrics (prospect_name, company_name)
VALUES 
  ('John Smith', 'Tech Corp'),
  ('Sarah Johnson', 'Innovation Labs'),
  ('Mike Davis', 'Growth Ventures'),
  ('Emily White', 'Digital Solutions'),
  ('Robert Brown', 'Cloud Systems');

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
