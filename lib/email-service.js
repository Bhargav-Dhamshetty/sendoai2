// Email Service for Daily Summaries
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendDailySummary(data) {
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
    .stat-card { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #667eea; }
    .stat-value { font-size: 32px; font-weight: bold; color: #667eea; }
    .stat-label { color: #666; font-size: 14px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .success { color: #10b981; }
    .warning { color: #f59e0b; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📊 Sendora AI Daily Report</h1>
    <p>${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>
  
  <div class="content">
    <h2>Performance Summary</h2>
    
    <div class="stat-card">
      <div class="stat-value">${data.totalCalls}</div>
      <div class="stat-label">Total Calls Made</div>
    </div>
    
    <div class="stat-card">
      <div class="stat-value class="success">${data.totalAppointments}</div>
      <div class="stat-label">Appointments Booked</div>
      <p style="margin-top: 10px; font-size: 14px;">Conversion Rate: <strong>${data.appointmentRate}%</strong></p>
    </div>
    
    <div class="stat-card">
      <div class="stat-value">${Math.floor(data.avgDuration / 60)}m ${data.avgDuration % 60}s</div>
      <div class="stat-label">Average Call Duration</div>
    </div>
    
    <div class="stat-card">
      <div class="stat-value">${data.pickupRate}%</div>
      <div class="stat-label">Pickup Rate</div>
      <p style="margin-top: 10px; font-size: 14px;">${data.totalPickups} of ${data.totalCalls} calls answered</p>
    </div>
    
    <div class="stat-card">
      <div class="stat-value">${data.avgSentiment.toFixed(1)}</div>
      <div class="stat-label">Average Sentiment Score</div>
      <p style="margin-top: 10px; font-size: 14px;">Confidence: <strong>${data.avgConfidence.toFixed(1)}</strong></p>
    </div>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
    
    <h3>Key Insights</h3>
    <ul>
      <li><strong>Success Rate:</strong> ${data.successRate}% of calls resulted in appointments</li>
      <li><strong>Performance:</strong> ${data.totalAppointments > 5 ? '✅ Exceeding targets' : '⚠️ Below target'}</li>
      <li><strong>Call Quality:</strong> ${data.avgSentiment > 0.6 ? '😊 Positive sentiment' : '😐 Neutral sentiment'}</li>
    </ul>
  </div>
  
  <div class="footer">
    <p>This is an automated daily report from Sendora AI</p>
    <p>View full analytics at your <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}">dashboard</a></p>
    <p>Powered by Sendora AI | ${new Date().getFullYear()}</p>
  </div>
</body>
</html>
    `;

    try {
      const info = await this.transporter.sendMail({
        from: `"Sendora AI" <${process.env.EMAIL_FROM}>`,
        to: process.env.EMAIL_TO,
        subject: `📊 Sendora AI Daily Report - ${new Date().toLocaleDateString()}`,
        html: emailHTML,
      });

      console.log('✅ Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw error;
    }
  }
}

module.exports = EmailService;
