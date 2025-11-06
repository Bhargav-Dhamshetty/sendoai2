require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔧 Creating Supabase tables...\n');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

async function createTables() {
  try {
    // Insert test data directly (tables might exist)
    console.log('Inserting test data into call_metrics...');
    
    const { data: callData, error: callError } = await supabase
      .from('call_metrics')
      .insert([
        {
          prospect_name: 'John Smith',
          company_name: 'Tech Corp',
          phone_number: '+1234567890',
          call_duration: 180,
          call_status: 'completed',
          pickup_status: 'picked_up',
          appointment_booked: true,
          sentiment_score: 0.85,
          confidence_score: 0.92,
          ai_summary: 'Successful call with high engagement'
        },
        {
          prospect_name: 'Sarah Johnson',
          company_name: 'Innovation Labs',
          phone_number: '+0987654321',
          call_duration: 120,
          call_status: 'completed',
          pickup_status: 'picked_up',
          appointment_booked: false,
          sentiment_score: 0.65,
          confidence_score: 0.78,
          ai_summary: 'Initial contact, follow-up needed'
        },
        {
          prospect_name: 'Mike Davis',
          company_name: 'Growth Ventures',
          phone_number: '+1122334455',
          call_duration: 200,
          call_status: 'completed',
          pickup_status: 'picked_up',
          appointment_booked: true,
          sentiment_score: 0.92,
          confidence_score: 0.95,
          ai_summary: 'Excellent conversation, meeting scheduled'
        }
      ])
      .select();

    if (callError) {
      console.error('❌ Error inserting call_metrics:', callError.message);
      console.log('\n📋 Tables need to be created first!');
      console.log('\n🔗 Go to: https://supabase.com/dashboard/project/bmpteadatirqfaweykns/editor');
      console.log('\n📝 Run this SQL:\n');
      console.log(`
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
      `);
      return;
    }

    console.log('✅ Inserted', callData.length, 'call records');

    // Insert daily metrics
    console.log('\nInserting daily metrics...');
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    const { data: dailyData, error: dailyError } = await supabase
      .from('daily_call_metrics')
      .upsert([
        {
          date: today,
          total_calls: 25,
          total_pickups: 18,
          total_appointments: 12,
          avg_call_duration: 150,
          avg_sentiment_score: 0.75,
          avg_confidence_score: 0.85,
          success_rate: 72.00
        },
        {
          date: yesterday,
          total_calls: 30,
          total_pickups: 22,
          total_appointments: 15,
          avg_call_duration: 165,
          avg_sentiment_score: 0.80,
          avg_confidence_score: 0.88,
          success_rate: 73.33
        }
      ], { onConflict: 'date' })
      .select();

    if (dailyError) {
      console.error('❌ Error inserting daily_call_metrics:', dailyError.message);
    } else {
      console.log('✅ Inserted', dailyData.length, 'daily metric records');
    }

    // Insert sample logs
    console.log('\nInserting system logs...');
    const { data: logsData, error: logsError } = await supabase
      .from('system_logs')
      .insert([
        {
          request_id: 'req_' + Date.now(),
          error_type: 'API_ERROR',
          error_message: 'Test log entry',
          severity: 'info',
          context: { test: true }
        }
      ])
      .select();

    if (logsError) {
      console.error('❌ Error inserting system_logs:', logsError.message);
    } else {
      console.log('✅ Inserted', logsData.length, 'log records');
    }

    console.log('\n🎉 Database setup complete!');
    console.log('✨ Refresh your dashboard at http://localhost:3001\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createTables();
