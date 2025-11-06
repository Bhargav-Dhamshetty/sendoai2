// System Logs Service
import { supabase } from './supabase';
import type { SystemLog } from './types';

export class LogsService {
  /**
   * Get system logs with pagination
   */
  static async getLogs(
    page: number = 1,
    pageSize: number = 20,
    severity?: string
  ): Promise<{ logs: SystemLog[]; total: number }> {
    try {
      let query = supabase
        .from('system_logs')
        .select('*', { count: 'exact' });

      if (severity && severity !== 'all') {
        query = query.eq('severity', severity);
      }

      const { data, error, count } = await query
        .order('timestamp', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) throw error;

      return {
        logs: data as SystemLog[],
        total: count || 0,
      };
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  }

  /**
   * Get error statistics
   */
  static async getErrorStats(): Promise<{
    total: number;
    bySeverity: Record<string, number>;
    recentErrors: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('system_logs')
        .select('severity, timestamp');

      if (error) throw error;

      const logs = data as SystemLog[];
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const bySeverity = logs.reduce((acc, log) => {
        acc[log.severity] = (acc[log.severity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const recentErrors = logs.filter(
        log => new Date(log.timestamp) > oneDayAgo
      ).length;

      return {
        total: logs.length,
        bySeverity,
        recentErrors,
      };
    } catch (error) {
      console.error('Error fetching error stats:', error);
      throw error;
    }
  }

  /**
   * Mark log as resolved
   */
  static async resolveLog(logId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('system_logs')
        .update({ resolved: true })
        .eq('id', logId);

      if (error) throw error;
    } catch (error) {
      console.error('Error resolving log:', error);
      throw error;
    }
  }
}
