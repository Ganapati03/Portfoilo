import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalyticsData, YearlyStats } from '@/hooks/useAnalytics';
import { BarChart3, Users, Eye, Monitor, Globe, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';
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
  Legend,
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
        {payload.map((entry: any, index: number) => (
          <p key={index} className="font-bold text-sm" style={{ color: entry.color || '#ff6b35' }}>
            {entry.name || 'Value'}: <span className="font-black text-white text-base">{entry.value}</span>
          </p>
        ))}
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
  const [yearlyStats, setYearlyStats] = useState<YearlyStats[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const analytics = useAnalyticsData();

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [views, visitors, pages, devices, browsers, yearly] = await Promise.all([
        analytics.getTotalPageViews(timeRange),
        analytics.getUniqueVisitors(timeRange),
        analytics.getPageViewsByPath(timeRange),
        analytics.getDeviceStats(timeRange),
        analytics.getBrowserStats(timeRange),
        analytics.getYearlyAnalytics(),
      ]);

      setTotalViews(views);
      setUniqueVisitors(visitors);
      setPageViews(pages || []);
      setDeviceStats(devices || {});
      setBrowserStats(browsers || {});
      setYearlyStats(yearly || []);
      if (yearly && yearly.length > 0 && !selectedYear) {
        setSelectedYear(yearly[0].year);
      }
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

  const timeRangeOptions = [
    { label: '7 Days', value: 7 },
    { label: '30 Days', value: 30 },
    { label: '90 Days', value: 90 },
    { label: '1 Year', value: 365 },
    { label: 'All Time', value: 0 },
  ];

  const activeYearData = yearlyStats.find(y => y.year === selectedYear) || yearlyStats[0];

  return (
    <div className="space-y-8 text-white pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black font-display tracking-tight text-white uppercase">
            Analytics
          </h2>
          <p className="text-white/50 mt-1 font-medium tracking-wide">
            Track your portfolio's performance, yearly traffic, and visitor insights
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 p-1 bg-white/5 border border-white/10 rounded-2xl md:rounded-full backdrop-blur-md w-fit">
          {timeRangeOptions.map((opt) => (
            <button
              key={opt.value}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                timeRange === opt.value 
                  ? 'bg-[#ff6b35] text-black shadow-[0_0_15px_rgba(255,107,53,0.4)]' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setTimeRange(opt.value)}
            >
              {opt.label}
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
          description={timeRange === 0 ? 'All-time total views' : `Last ${timeRange} days`}
        />
        <StatCard
          title="Unique Visitors"
          value={uniqueVisitors.toLocaleString()}
          icon={Users}
          description={timeRange === 0 ? 'All-time unique visitors' : `Last ${timeRange} days`}
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
      <Tabs defaultValue="yearly" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white/5 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md">
          <TabsTrigger 
            value="yearly" 
            className="data-[state=active]:bg-[#ff6b35] data-[state=active]:text-black rounded-xl uppercase tracking-widest text-xs font-bold transition-all py-2.5 text-white/70 flex items-center justify-center gap-2"
          >
            <Calendar className="w-3.5 h-3.5" />
            Yearly Overview
          </TabsTrigger>
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

        {/* Yearly Overview Tab */}
        <TabsContent value="yearly" className="space-y-6 outline-none">
          {/* Yearly Comparison Chart */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-white/10 bg-white/5 px-8 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-3 text-xl font-display font-black text-white uppercase tracking-wider">
                    <Calendar className="h-6 w-6 text-[#ff6b35]" />
                    Year-Wise Traffic & Unique Visitors
                  </CardTitle>
                  <CardDescription className="text-white/50 font-medium mt-1">
                    Side-by-side comparison of total visits vs unique visitors per calendar year
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {yearlyStats.length > 0 ? (
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={[...yearlyStats].reverse()} 
                      margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis 
                        dataKey="year" 
                        stroke="rgba(255,255,255,0.5)" 
                        tick={{ fill: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 'bold' }}
                      />
                      <YAxis 
                        stroke="rgba(255,255,255,0.5)" 
                        tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                      <Legend 
                        wrapperStyle={{ paddingTop: '20px' }} 
                        formatter={(value) => <span className="text-white/80 font-bold text-xs uppercase tracking-wider">{value}</span>}
                      />
                      <Bar 
                        dataKey="totalViews" 
                        name="Total Visits" 
                        fill="#ff6b35" 
                        radius={[6, 6, 0, 0]} 
                      />
                      <Bar 
                        dataKey="uniqueVisitors" 
                        name="Unique Visitors" 
                        fill="#38bdf8" 
                        radius={[6, 6, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-white/40">
                  <Calendar className="h-16 w-16 mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-sm">No yearly data available yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Yearly Breakdown Table */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-white/10 bg-white/5 px-8 py-6">
              <CardTitle className="text-lg font-display font-black text-white uppercase tracking-wider">
                Yearly Statistics Summary
              </CardTitle>
              <CardDescription className="text-white/50 font-medium">
                Detailed metrics for every year your portfolio has been online
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-widest text-white/50">
                      <th className="py-4 px-6">Year</th>
                      <th className="py-4 px-6">Total Visits</th>
                      <th className="py-4 px-6">Unique Count</th>
                      <th className="py-4 px-6">Avg. Views / Person</th>
                      <th className="py-4 px-6">Top Page</th>
                      <th className="py-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {yearlyStats.map((item) => (
                      <tr 
                        key={item.year}
                        className={`transition-colors hover:bg-white/5 ${selectedYear === item.year ? 'bg-white/[0.04]' : ''}`}
                      >
                        <td className="py-4 px-6 font-display font-bold text-white text-base">
                          {item.year}
                        </td>
                        <td className="py-4 px-6 font-bold text-[#ff6b35]">
                          {item.totalViews.toLocaleString()}
                        </td>
                        <td className="py-4 px-6 font-bold text-sky-400">
                          {item.uniqueVisitors.toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-white/80 font-medium">
                          {item.avgViewsPerVisitor}
                        </td>
                        <td className="py-4 px-6 text-white/60 font-mono text-xs max-w-xs truncate">
                          {item.topPage}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedYear(item.year)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                              selectedYear === item.year
                                ? 'bg-[#ff6b35] text-black'
                                : 'bg-white/10 text-white/80 hover:bg-white/20'
                            }`}
                          >
                            {selectedYear === item.year ? 'Viewing' : 'Inspect'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trajectory for Selected Year */}
          {activeYearData && (
            <Card className="bg-white/5 border-white/10 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-white/10 bg-white/5 px-8 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <span>Monthly Breakdown for {activeYearData.year}</span>
                      <span className="text-xs font-normal text-white/50 bg-white/10 px-2.5 py-0.5 rounded-full">
                        {activeYearData.totalViews} views • {activeYearData.uniqueVisitors} unique
                      </span>
                    </CardTitle>
                    <CardDescription className="text-white/50 font-medium">
                      Month-by-month progress during {activeYearData.year}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {yearlyStats.map((y) => (
                      <button
                        key={y.year}
                        onClick={() => setSelectedYear(y.year)}
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          selectedYear === y.year ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {y.year}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activeYearData.monthlyBreakdown} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        stroke="rgba(255,255,255,0.5)" 
                        tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                      />
                      <YAxis 
                        stroke="rgba(255,255,255,0.5)" 
                        tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                      <Legend wrapperStyle={{ paddingTop: '15px' }} />
                      <Bar dataKey="views" name="Visits" fill="#ff6b35" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="visitors" name="Unique Visitors" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Page Views Tab */}
        <TabsContent value="pages" className="space-y-4 outline-none">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-white/10 bg-white/5 px-8 py-6">
              <CardTitle className="flex items-center gap-3 text-xl font-display font-black text-white uppercase tracking-wider">
                <BarChart3 className="h-6 w-6 text-[#ff6b35]" />
                Most Visited Pages
              </CardTitle>
              <CardDescription className="text-white/50 font-medium">
                Pages ranked by number of views ({timeRange === 0 ? 'All Time' : `Last ${timeRange} days`})
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
