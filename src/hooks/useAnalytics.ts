import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Generate a unique session ID that persists for the browser session
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Detect device type
const getDeviceType = (): string => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

// Detect browser
const getBrowser = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  return 'Other';
};

// Detect OS
const getOS = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Other';
};

let globalLastTrackedPath: string | null = null;

export const useAnalytics = (pagePath: string, pageTitle?: string) => {
  useEffect(() => {
    if (globalLastTrackedPath === pagePath) return;
    globalLastTrackedPath = pagePath;

    const trackPageView = async () => {
      try {
        const sessionId = getSessionId();
        const deviceType = getDeviceType();
        const browser = getBrowser();
        const os = getOS();
        const referrer = document.referrer || 'direct';
        const userAgent = navigator.userAgent;

        // Insert analytics data
        const { error } = await supabase.from('analytics').insert({
          page_path: pagePath,
          page_title: pageTitle || document.title,
          referrer,
          user_agent: userAgent,
          session_id: sessionId,
          device_type: deviceType,
          browser,
          os,
        });

        if (error) {
          console.error('Analytics tracking error:', error);
        }
      } catch (err) {
        console.error('Failed to track page view:', err);
      }
    };

    // Track the page view
    trackPageView();
  }, [pagePath, pageTitle]);
};

export interface YearlyStats {
  year: number;
  totalViews: number;
  uniqueVisitors: number;
  avgViewsPerVisitor: number;
  topPage?: string;
  monthlyBreakdown: { month: string; monthIndex: number; views: number; visitors: number }[];
}

// Hook to get analytics data (for admin dashboard)
export const useAnalyticsData = () => {
  const applyDateFilter = (query: any, days?: number, targetYear?: number) => {
    if (targetYear) {
      const startOfYear = new Date(targetYear, 0, 1).toISOString();
      const endOfYear = new Date(targetYear + 1, 0, 1).toISOString();
      return query.gte('created_at', startOfYear).lt('created_at', endOfYear);
    }
    if (days && days > 0) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      return query.gte('created_at', startDate.toISOString());
    }
    return query; // All-time when days === 0 or undefined
  };

  const getPageViews = async (days: number = 30, targetYear?: number) => {
    let query = supabase
      .from('analytics')
      .select('*')
      .order('created_at', { ascending: false });

    query = applyDateFilter(query, days, targetYear);
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }

    return data;
  };

  const getPageViewsByPath = async (days: number = 30, targetYear?: number) => {
    let query = supabase.from('analytics').select('page_path');
    query = applyDateFilter(query, days, targetYear);
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }

    // Count views by page
    const viewsByPage: Record<string, number> = {};
    data?.forEach((item) => {
      viewsByPage[item.page_path] = (viewsByPage[item.page_path] || 0) + 1;
    });

    return Object.entries(viewsByPage)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getUniqueVisitors = async (days: number = 30, targetYear?: number) => {
    let query = supabase.from('analytics').select('session_id');
    query = applyDateFilter(query, days, targetYear);
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching analytics:', error);
      return 0;
    }

    // Count unique sessions
    const uniqueSessions = new Set(data?.map((item) => item.session_id));
    return uniqueSessions.size;
  };

  const getDeviceStats = async (days: number = 30, targetYear?: number) => {
    let query = supabase.from('analytics').select('device_type');
    query = applyDateFilter(query, days, targetYear);
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }

    // Count by device type
    const deviceCounts: Record<string, number> = {};
    data?.forEach((item) => {
      deviceCounts[item.device_type] = (deviceCounts[item.device_type] || 0) + 1;
    });

    return deviceCounts;
  };

  const getBrowserStats = async (days: number = 30, targetYear?: number) => {
    let query = supabase.from('analytics').select('browser');
    query = applyDateFilter(query, days, targetYear);
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }

    // Count by browser
    const browserCounts: Record<string, number> = {};
    data?.forEach((item) => {
      browserCounts[item.browser] = (browserCounts[item.browser] || 0) + 1;
    });

    return browserCounts;
  };

  const getTotalPageViews = async (days: number = 30, targetYear?: number) => {
    let query = supabase.from('analytics').select('*', { count: 'exact', head: true });
    query = applyDateFilter(query, days, targetYear);
    const { count, error } = await query;

    if (error) {
      console.error('Error fetching analytics:', error);
      return 0;
    }

    return count || 0;
  };

  const getYearlyAnalytics = async (): Promise<YearlyStats[]> => {
    const { data, error } = await supabase
      .from('analytics')
      .select('created_at, session_id, page_path')
      .order('created_at', { ascending: true });

    if (error || !data) {
      console.error('Error fetching yearly analytics:', error);
      return [];
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Group by year
    const byYear: Record<number, {
      totalViews: number;
      sessions: Set<string>;
      pageCounts: Record<string, number>;
      months: Record<number, { views: number; sessions: Set<string> }>;
    }> = {};

    data.forEach((item) => {
      if (!item.created_at) return;
      const date = new Date(item.created_at);
      const year = date.getFullYear();
      const month = date.getMonth();

      if (!byYear[year]) {
        byYear[year] = {
          totalViews: 0,
          sessions: new Set<string>(),
          pageCounts: {},
          months: {},
        };
        for (let m = 0; m < 12; m++) {
          byYear[year].months[m] = { views: 0, sessions: new Set<string>() };
        }
      }

      byYear[year].totalViews += 1;
      if (item.session_id) {
        byYear[year].sessions.add(item.session_id);
        byYear[year].months[month].sessions.add(item.session_id);
      }
      if (item.page_path) {
        byYear[year].pageCounts[item.page_path] = (byYear[year].pageCounts[item.page_path] || 0) + 1;
      }
      byYear[year].months[month].views += 1;
    });

    const currentYear = new Date().getFullYear();
    if (!byYear[currentYear]) {
      byYear[currentYear] = {
        totalViews: 0,
        sessions: new Set<string>(),
        pageCounts: {},
        months: {},
      };
      for (let m = 0; m < 12; m++) {
        byYear[currentYear].months[m] = { views: 0, sessions: new Set<string>() };
      }
    }

    return Object.entries(byYear).map(([yearStr, val]) => {
      const year = parseInt(yearStr, 10);
      const uniqueVisitors = val.sessions.size;
      const avgViewsPerVisitor = uniqueVisitors > 0 ? Number((val.totalViews / uniqueVisitors).toFixed(1)) : 0;
      
      const topPageEntry = Object.entries(val.pageCounts).sort((a, b) => b[1] - a[1])[0];
      const topPage = topPageEntry ? `${topPageEntry[0]} (${topPageEntry[1]})` : 'N/A';

      const monthlyBreakdown = Object.entries(val.months).map(([mIndex, mVal]) => ({
        month: monthNames[parseInt(mIndex, 10)],
        monthIndex: parseInt(mIndex, 10),
        views: mVal.views,
        visitors: mVal.sessions.size,
      }));

      return {
        year,
        totalViews: val.totalViews,
        uniqueVisitors,
        avgViewsPerVisitor,
        topPage,
        monthlyBreakdown,
      };
    }).sort((a, b) => b.year - a.year);
  };

  return {
    getPageViews,
    getPageViewsByPath,
    getUniqueVisitors,
    getDeviceStats,
    getBrowserStats,
    getTotalPageViews,
    getYearlyAnalytics,
  };
};
