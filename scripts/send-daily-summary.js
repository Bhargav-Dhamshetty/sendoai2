// Send Daily Summary Email Script
const { createClient } = require('@supabase/supabase-js');
const EmailService = require('../lib/email-service');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getDailySummary() {
  try {
    // Get today's metrics
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('call_metrics')
      .select('*')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);

    if (error) throw error;

    const metrics = data || [];
    const totalCalls = metrics.length;
    const totalPickups = metrics.filter(m => m.pickup_status === 'picked_up').length;
    const totalAppointments = metrics.filter(m => m.appointment_booked).length;
    const avgDuration = totalCalls > 0
      ? Math.round(metrics.reduce((sum, m) => sum + m.call_duration, 0) / totalCalls)
      : 0;
    const avgSentiment = totalCalls > 0
      ? metrics.reduce((sum, m) => sum + m.sentiment_score, 0) / totalCalls
      : 0;
    const avgConfidence = totalCalls > 0
      ? metrics.reduce((sum, m) => sum + m.confidence_score, 0) / totalCalls
      : 0;

    return {
      totalCalls,
      totalPickups,
      totalAppointments,
      avgDuration,
      avgSentiment,
      avgConfidence,
      successRate: totalCalls > 0 ? Math.round((totalAppointments / totalCalls) * 100) : 0,
      pickupRate: totalCalls > 0 ? Math.round((totalPickups / totalCalls) * 100) : 0,
      appointmentRate: totalPickups > 0 ? Math.round((totalAppointments / totalPickups) * 100) : 0,
    };
  } catch (error) {
    console.error('Error fetching daily summary:', error);
    throw error;
  }
}

async function sendDailyEmail() {
  try {
    console.log('📧 Generating daily summary...');
    const summary = await getDailySummary();
    
    console.log('📊 Summary data:', summary);
    
    const emailService = new EmailService();
    await emailService.sendDailySummary(summary);
    
    console.log('✅ Daily summary email sent successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to send daily summary:', error);
    process.exit(1);
  }
}

sendDailyEmail();
