-- =====================================================
-- DROP AND RECREATE daily_call_metrics with date column
-- =====================================================

-- Drop existing table
DROP TABLE IF EXISTS daily_call_metrics CASCADE;

-- Create with correct structure
CREATE TABLE daily_call_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  total_calls INTEGER DEFAULT 0,
  total_pickups INTEGER DEFAULT 0,
  total_appointments INTEGER DEFAULT 0,
  avg_call_duration INTEGER DEFAULT 0,
  avg_sentiment_score DECIMAL(3,2) DEFAULT 0,
  avg_confidence_score DECIMAL(3,2) DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data for last 7 days
INSERT INTO daily_call_metrics (date, total_calls, total_pickups, total_appointments, avg_call_duration, avg_sentiment_score, avg_confidence_score, success_rate)
VALUES 
  (CURRENT_DATE, 8, 6, 4, 168, 0.75, 0.85, 50.00),
  (CURRENT_DATE - INTERVAL '1 day', 12, 9, 6, 175, 0.80, 0.88, 50.00),
  (CURRENT_DATE - INTERVAL '2 days', 10, 7, 5, 160, 0.78, 0.86, 50.00),
  (CURRENT_DATE - INTERVAL '3 days', 15, 11, 8, 180, 0.82, 0.89, 53.33),
  (CURRENT_DATE - INTERVAL '4 days', 9, 6, 4, 155, 0.76, 0.84, 44.44),
  (CURRENT_DATE - INTERVAL '5 days', 11, 8, 6, 165, 0.79, 0.87, 54.55),
  (CURRENT_DATE - INTERVAL '6 days', 13, 10, 7, 170, 0.81, 0.88, 53.85);

-- Verify data
SELECT date, total_calls, total_pickups, total_appointments 
FROM daily_call_metrics 
ORDER BY date DESC;
