import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalyticsData } from '@/hooks/useAnalytics';
import { BarChart3, Users, Eye, Monitor, Globe, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface PageViewData {
  path: string;
  count: number;
}

const COLORS = ['#ff6b35', '#ff8b5f', '#ffaa8a', '#ffcaba', '#ffeadd', '#ffffff'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111] border border-white/10 p-4 rounded-xl shadow-2xl">
        <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
        <p className="text-[#ff6b35] font-black text-xl">
          {payload[0].value} {payload[0].name === 'Views' || !payload[0].name ? 'views' : payload[0].name}
        </p>
      </div>
    );
  }
  return null;
};

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
    <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl transition-all hover:bg-white/10 hover:border-[#ff6b35]/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-white/60">{title}</CardTitle>
        <Icon className="h-5 w-5 text-[#ff6b35]" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-black font-display text-white">{value}</div>
        {description && (
          <p className="text-xs text-white/40 mt-2 font-bold uppercase tracking-wider">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-[#ff6b35]"></div>
      </div>
    );
  }

  // Format data for Recharts
  const deviceData = Object.entries(deviceStats).map(([name, value]) => ({ name, value }));
  const browserData = Object.entries(browserStats).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-8 text-white pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black font-display tracking-tight text-white uppercase">
            Analytics
          </h2>
          <p className="text-white/50 mt-1 font-medium tracking-wide">
            Track your portfolio's performance and visitor insights
          </p>
        </div>
        <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md w-fit">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                timeRange === days 
                  ? 'bg-[#ff6b35] text-black shadow-[0_0_15px_rgba(255,107,53,0.4)]' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setTimeRange(days)}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Views"
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
      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md">
          <TabsTrigger 
            value="pages" 
            className="data-[state=active]:bg-[#ff6b35] data-[state=active]:text-black rounded-xl uppercase tracking-widest text-xs font-bold transition-all py-2.5 text-white/70"
          >
            Page Views
          </TabsTrigger>
          <TabsTrigger 
            value="devices" 
            className="data-[state=active]:bg-[#ff6b35] data-[state=active]:text-black rounded-xl uppercase tracking-widest text-xs font-bold transition-all py-2.5 text-white/70"
          >
            Devices
          </TabsTrigger>
          <TabsTrigger 
            value="browsers" 
            className="data-[state=active]:bg-[#ff6b35] data-[state=active]:text-black rounded-xl uppercase tracking-widest text-xs font-bold transition-all py-2.5 text-white/70"
          >
            Browsers
          </TabsTrigger>
        </TabsList>

        {/* Page Views Tab */}
        <TabsContent value="pages" className="space-y-4 outline-none">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-white/10 bg-white/5 px-8 py-6">
              <CardTitle className="flex items-center gap-3 text-xl font-display font-black text-white uppercase tracking-wider">
                <BarChart3 className="h-6 w-6 text-[#ff6b35]" />
                Most Visited Pages
              </CardTitle>
              <CardDescription className="text-white/50 font-medium">
                Pages ranked by number of views in the last {timeRange} days
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {pageViews.length > 0 ? (
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pageViews} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis 
                        dataKey="path" 
                        stroke="rgba(255,255,255,0.5)" 
                        tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tickMargin={20}
                      />
                      <YAxis 
                        stroke="rgba(255,255,255,0.5)" 
                        tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                      <Bar 
                        dataKey="count" 
                        fill="#ff6b35" 
                        radius={[6, 6, 0, 0]} 
                        animationDuration={1500}
                      >
                        {pageViews.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-white/40">
                  <BarChart3 className="h-16 w-16 mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-sm">No page view data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Devices Tab */}
        <TabsContent value="devices" className="space-y-4 outline-none">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-white/10 bg-white/5 px-8 py-6">
              <CardTitle className="flex items-center gap-3 text-xl font-display font-black text-white uppercase tracking-wider">
                <Monitor className="h-6 w-6 text-[#ff6b35]" />
                Device Breakdown
              </CardTitle>
              <CardDescription className="text-white/50 font-medium">
                Visitor distribution by device type
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {deviceData.length > 0 ? (
                <div className="h-[400px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={140}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth={2}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={{ stroke: 'rgba(255,255,255,0.3)', strokeWidth: 1 }}
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-white/40">
                  <Monitor className="h-16 w-16 mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-sm">No device data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Browsers Tab */}
        <TabsContent value="browsers" className="space-y-4 outline-none">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-white/10 bg-white/5 px-8 py-6">
              <CardTitle className="flex items-center gap-3 text-xl font-display font-black text-white uppercase tracking-wider">
                <Globe className="h-6 w-6 text-[#ff6b35]" />
                Browser Distribution
              </CardTitle>
              <CardDescription className="text-white/50 font-medium">
                Visitor distribution by browser
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {browserData.length > 0 ? (
                <div className="h-[400px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={browserData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={140}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth={2}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={{ stroke: 'rgba(255,255,255,0.3)', strokeWidth: 1 }}
                      >
                        {browserData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-white/40">
                  <Globe className="h-16 w-16 mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-sm">No browser data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
