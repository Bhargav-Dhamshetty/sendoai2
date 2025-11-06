// TypeScript Types for Database Tables

export interface CallMetric {
  id: string;
  call_id: string;
  prospect_name: string;
  company_name: string;
  phone_number: string;
  call_duration: number;
  call_status: 'completed' | 'no_answer' | 'busy' | 'failed' | 'voicemail';
  pickup_status: 'picked_up' | 'not_picked_up';
  appointment_booked: boolean;
  sentiment_score: number;
  confidence_score: number;
  ai_summary: string;
  transcript?: string;
  created_at: string;
  updated_at: string;
}

export interface DailyCallMetric {
  id: string;
  date: string;
  total_calls: number;
  total_pickups: number;
  total_appointments: number;
  avg_call_duration: number;
  avg_sentiment_score: number;
  avg_confidence_score: number;
  success_rate: number;
  created_at: string;
}

export interface SystemLog {
  id: string;
  request_id: string;
  error_type: string;
  error_message: string;
  error_stack?: string;
  context?: any;
  severity: 'info' | 'warning' | 'error' | 'critical';
  timestamp: string;
  resolved: boolean;
}

export interface AnalyticsSummary {
  totalCalls: number;
  totalPickups: number;
  totalAppointments: number;
  avgDuration: number;
  avgSentiment: number;
  avgConfidence: number;
  successRate: number;
  pickupRate: number;
  appointmentRate: number;
}

export interface ChartDataPoint {
  date: string;
  calls: number;
  pickups: number;
  appointments: number;
  sentiment: number;
}
