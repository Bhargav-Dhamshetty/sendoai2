-- Find out what columns exist in daily_call_metrics
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'daily_call_metrics'
ORDER BY ordinal_position;
