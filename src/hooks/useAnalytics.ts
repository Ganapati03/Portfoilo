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

export const useAnalytics = (pagePath: string, pageTitle?: string) => {
  useEffect(() => {
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

// Hook to get analytics data (for admin dashboard)
export const useAnalyticsData = () => {
  const getPageViews = async (days: number = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }

    return data;
  };

  const getPageViewsByPath = async (days: number = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('analytics')
      .select('page_path')
      .gte('created_at', startDate.toISOString());

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

  const getUniqueVisitors = async (days: number = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('analytics')
      .select('session_id')
      .gte('created_at', startDate.toISOString());

    if (error) {
      console.error('Error fetching analytics:', error);
      return 0;
    }

    // Count unique sessions
    const uniqueSessions = new Set(data?.map((item) => item.session_id));
    return uniqueSessions.size;
  };

  const getDeviceStats = async (days: number = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('analytics')
      .select('device_type')
      .gte('created_at', startDate.toISOString());

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

  const getBrowserStats = async (days: number = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('analytics')
      .select('browser')
      .gte('created_at', startDate.toISOString());

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

  const getTotalPageViews = async (days: number = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { count, error } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString());

    if (error) {
      console.error('Error fetching analytics:', error);
      return 0;
    }

    return count || 0;
  };

  return {
    getPageViews,
    getPageViewsByPath,
    getUniqueVisitors,
    getDeviceStats,
    getBrowserStats,
    getTotalPageViews,
  };
};
