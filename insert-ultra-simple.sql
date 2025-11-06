-- =====================================================
-- ULTRA SIMPLE INSERT - Just names
-- =====================================================

-- Insert into call_metrics (just basic data)
INSERT INTO call_metrics (prospect_name, company_name)
VALUES 
  ('John Smith', 'Tech Corp'),
  ('Sarah Johnson', 'Innovation Labs'),
  ('Mike Davis', 'Growth Ventures'),
  ('Emily White', 'Digital Solutions'),
  ('Robert Brown', 'Cloud Systems'),
  ('Alex Turner', 'StartupXYZ'),
  ('Maria Garcia', 'Innovate Inc'),
  ('Chris Lee', 'Tech Solutions');

-- Insert into system_logs
INSERT INTO system_logs (request_id, error_type, error_message, severity)
VALUES 
  ('req_001', 'INFO', 'Dashboard initialized', 'info'),
  ('req_002', 'WARNING', 'High API usage', 'warning'),
  ('req_003', 'ERROR', 'Connection timeout', 'error'),
  ('req_004', 'INFO', 'System healthy', 'info');

-- Check what we inserted
SELECT COUNT(*) as call_count FROM call_metrics;
SELECT COUNT(*) as log_count FROM system_logs;
