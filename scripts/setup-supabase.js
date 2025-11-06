require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🔧 Setting up Supabase database...\n');

  try {
    // Create call_metrics table
    console.log('Creating call_metrics table...');
    const { error: error1 } = await supabase.rpc('exec_sql', {
      query: `
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
      `
    });

    // Create daily_call_metrics table
    console.log('Creating daily_call_metrics table...');
    const { error: error2 } = await supabase.rpc('exec_sql', {
      query: `
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
      `
    });

    // Create system_logs table
    console.log('Creating system_logs table...');
    const { error: error3 } = await supabase.rpc('exec_sql', {
      query: `
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
      `
    });

    // Insert test data
    console.log('\nInserting test data...');
    
    const { error: insertError } = await supabase
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
        }
      ]);

    if (insertError) {
      console.log('Note: Test data may already exist');
    }

    // Insert daily metrics
    const today = new Date().toISOString().split('T')[0];
    const { error: dailyError } = await supabase
      .from('daily_call_metrics')
      .insert([
        {
          date: today,
          total_calls: 25,
          total_pickups: 18,
          total_appointments: 12,
          avg_call_duration: 150,
          avg_sentiment_score: 0.75,
          avg_confidence_score: 0.85,
          success_rate: 72.00
        }
      ]);

    if (dailyError) {
      console.log('Note: Daily metrics may already exist for today');
    }

    console.log('\n✅ Database setup complete!');
    console.log('🎉 Visit http://localhost:3001 to see your dashboard\n');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n📝 Manual setup required:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Copy the SQL from DEPLOYMENT_GUIDE.md');
    console.log('5. Run the CREATE TABLE statements\n');
  }
}

setupDatabase();
