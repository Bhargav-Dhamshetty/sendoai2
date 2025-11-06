-- =====================================================
-- Find out what columns your n8n tables actually have
-- =====================================================

-- Check call_metrics columns
SELECT 'call_metrics' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'call_metrics'
ORDER BY ordinal_position;

-- Check daily_call_metrics columns  
SELECT 'daily_call_metrics' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'daily_call_metrics'
ORDER BY ordinal_position;

-- Check system_logs columns
SELECT 'system_logs' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'system_logs'
ORDER BY ordinal_position;
