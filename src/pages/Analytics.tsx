import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalyticsData } from '@/hooks/useAnalytics';
import { BarChart3, Users, Eye, Monitor, Globe, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PageViewData {
  path: string;
  count: number;
}

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<number>(30);
  const [totalViews, setTotalViews] = useState<number>(0);
  const [uniqueVisitors, setUniqueVisitors] = useState<number>(0);
  const [pageViews, setPageViews] = useState<PageViewData[]>([]);
  const [deviceStats, setDeviceStats] = useState<Record<string, number>>({});
  const [browserStats, setBrowserStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const analytics = useAnalyticsData();

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [views, visitors, pages, devices, browsers] = await Promise.all([
        analytics.getTotalPageViews(timeRange),
        analytics.getUniqueVisitors(timeRange),
        analytics.getPageViewsByPath(timeRange),
        analytics.getDeviceStats(timeRange),
        analytics.getBrowserStats(timeRange),
      ]);

      setTotalViews(views);
      setUniqueVisitors(visitors);
      setPageViews(pages || []);
      setDeviceStats(devices || {});
      setBrowserStats(browsers || {});
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description 
  }: { 
    title: string; 
    value: number | string; 
    icon: any; 
    description?: string;
  }) => (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{value}</div>
        {description && (
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Track your portfolio's performance and visitor insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === 7 ? 'default' : 'outline'}
            onClick={() => setTimeRange(7)}
            size="sm"
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === 30 ? 'default' : 'outline'}
            onClick={() => setTimeRange(30)}
            size="sm"
          >
            30 Days
          </Button>
          <Button
            variant={timeRange === 90 ? 'default' : 'outline'}
            onClick={() => setTimeRange(90)}
            size="sm"
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Page Views"
          value={totalViews.toLocaleString()}
          icon={Eye}
          description={`Last ${timeRange} days`}
        />
        <StatCard
          title="Unique Visitors"
          value={uniqueVisitors.toLocaleString()}
          icon={Users}
          description={`Last ${timeRange} days`}
        />
        <StatCard
          title="Avg. Views/Visitor"
          value={uniqueVisitors > 0 ? (totalViews / uniqueVisitors).toFixed(1) : '0'}
          icon={TrendingUp}
          description="Engagement metric"
        />
        <StatCard
          title="Top Page"
          value={pageViews[0]?.path || 'N/A'}
          icon={BarChart3}
          description={`${pageViews[0]?.count || 0} views`}
        />
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pages">Page Views</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="browsers">Browsers</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Most Visited Pages
              </CardTitle>
              <CardDescription>
                Pages ranked by number of views in the last {timeRange} days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pageViews.length > 0 ? (
                  pageViews.map((page, index) => {
                    const maxCount = pageViews[0]?.count || 1;
                    const percentage = (page.count / maxCount) * 100;
                    
                    return (
                      <div key={page.path} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              #{index + 1}
                            </span>
                            <span className="font-medium">{page.path}</span>
                          </div>
                          <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                            {page.count} views
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No page view data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Device Breakdown
              </CardTitle>
              <CardDescription>
                Visitor distribution by device type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.keys(deviceStats).length > 0 ? (
                  Object.entries(deviceStats)
                    .sort(([, a], [, b]) => b - a)
                    .map(([device, count]) => {
                      const total = Object.values(deviceStats).reduce((a, b) => a + b, 0);
                      const percentage = ((count / total) * 100).toFixed(1);
                      
                      return (
                        <div key={device} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium capitalize">{device}</span>
                            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No device data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="browsers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Browser Distribution
              </CardTitle>
              <CardDescription>
                Visitor distribution by browser
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.keys(browserStats).length > 0 ? (
                  Object.entries(browserStats)
                    .sort(([, a], [, b]) => b - a)
                    .map(([browser, count]) => {
                      const total = Object.values(browserStats).reduce((a, b) => a + b, 0);
                      const percentage = ((count / total) * 100).toFixed(1);
                      
                      return (
                        <div key={browser} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{browser}</span>
                            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No browser data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
