# Sendora AI Dashboard - Part 3

## 📊 Features

### 1. Real-Time Analytics Dashboard
- **Overview Metrics**: Total calls, appointments, pickup rate, avg duration
- **Trend Charts**: Visualize calls, pickups, appointments over time
- **Sentiment Analysis**: Track average sentiment and confidence scores
- **Recent Calls Table**: View latest call details with status indicators

### 2. System Logs Viewer
- **Severity Filtering**: Filter by info, warning, error, critical
- **Pagination**: Navigate through large log datasets
- **Color Coding**: Visual severity indicators
- **Stack Traces**: Expandable error details

### 3. Email Automation
- **Daily Summaries**: Automated HTML email reports
- **Key Metrics**: Calls, appointments, sentiment, conversion rates
- **Performance Insights**: AI-driven recommendations
- **Scheduled Delivery**: Configurable timing via cron

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- Supabase account with tables: `call_metrics`, `daily_call_metrics`, `system_logs`
- Brevo SMTP credentials

### Installation

```bash
cd dashboard
npm install
```

### Environment Configuration

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Brevo Email
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=your_brevo_smtp_user
EMAIL_PASSWORD=your_brevo_smtp_password
EMAIL_FROM=mechconect18@gmail.com
EMAIL_TO=godbhargav@gmail.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Database Schema

Ensure these tables exist in Supabase:

```sql
-- call_metrics table
CREATE TABLE call_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_id TEXT,
  prospect_name TEXT,
  company_name TEXT,
  phone_number TEXT,
  call_duration INTEGER,
  call_status TEXT,
  pickup_status TEXT,
  appointment_booked BOOLEAN DEFAULT false,
  sentiment_score DECIMAL,
  confidence_score DECIMAL,
  ai_summary TEXT,
  transcript TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- daily_call_metrics table
CREATE TABLE daily_call_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE,
  total_calls INTEGER,
  total_pickups INTEGER,
  total_appointments INTEGER,
  avg_call_duration INTEGER,
  avg_sentiment_score DECIMAL,
  avg_confidence_score DECIMAL,
  success_rate DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- system_logs table
CREATE TABLE system_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id TEXT,
  error_type TEXT,
  error_message TEXT,
  error_stack TEXT,
  context JSONB,
  severity TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  resolved BOOLEAN DEFAULT false
);
```

### Run Development Server

```bash
npm run dev
```

Access at: http://localhost:3001

## 📧 Email Automation

### Test Email
```bash
npm run email:test
```

### Manual Daily Summary
```bash
npm run email:daily
```

### Setup Cron Job (Production)

**Linux/Mac** - Add to crontab:
```bash
0 9 * * * cd /path/to/dashboard && npm run email:daily
```

**Windows** - Use Task Scheduler or n8n workflow

**n8n Workflow** (Recommended):
1. Create Schedule Trigger (daily at 9 AM)
2. Execute Command node: `npm run email:daily`
3. Email notification on success/failure

## 🎨 Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Email**: Brevo SMTP via Nodemailer
- **TypeScript**: Full type safety

## 📂 Project Structure

```
dashboard/
├── pages/
│   ├── index.tsx          # Analytics dashboard
│   ├── logs.tsx           # System logs viewer
│   └── _app.tsx           # App wrapper
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── types.ts           # TypeScript types
│   ├── analytics-service.ts
│   ├── logs-service.ts
│   └── email-service.js
├── scripts/
│   └── send-daily-summary.js
├── styles/
│   └── globals.css
└── package.json
```

## 🚀 Deployment

### Vercel Deployment

```bash
vercel --prod
```

### Environment Variables (Vercel)
Add all `.env.local` variables in Vercel dashboard

### Post-Deployment
1. Update `NEXT_PUBLIC_APP_URL` to production URL
2. Setup cron for email automation
3. Configure Supabase Row Level Security (RLS)

## 📊 API Routes (Future Enhancement)

Create `pages/api/`:
- `/api/analytics` - Fetch summary data
- `/api/logs` - Get filtered logs
- `/api/send-summary` - Trigger email manually

## 🔒 Security Checklist

- ✅ Environment variables for all credentials
- ✅ Supabase RLS policies
- ✅ Input validation with Zod
- ✅ Error boundaries in React
- ✅ HTTPS only in production
- ✅ Rate limiting (add middleware)

## 📝 Usage Examples

### Fetch Analytics Programmatically
```typescript
import { AnalyticsService } from '@/lib/analytics-service';

const summary = await AnalyticsService.getAnalyticsSummary();
console.log(summary.totalCalls); // 150
```

### Custom Email Templates
Edit `lib/email-service.js` to customize HTML layout

## 🐛 Troubleshooting

**Charts not loading**
- Check Recharts installation: `npm install recharts`
- Verify data format matches `ChartDataPoint` interface

**Email not sending**
- Verify Brevo SMTP credentials
- Check firewall allows port 587
- Test with `npm run email:test`

**Supabase connection failed**
- Verify environment variables
- Check Supabase project is active
- Verify table names match schema

## 📈 Next Steps (Part 4)

- Add call recordings playback
- Real-time WebSocket updates
- Advanced filters (date range, company, status)
- Export data to CSV
- User authentication
- Multi-tenant support

## 📞 Support

For issues or questions:
- GitHub: https://github.com/Bhargav-Dhamshetty/sendoai1
- Email: godbhargav@gmail.com

---

**Built with ❤️ by Sendora AI Team**
