-- =====================================================
-- STEP 1: Check what columns exist in your table
-- =====================================================
-- Run this first to see the actual columns:

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'call_metrics'
ORDER BY ordinal_position;
