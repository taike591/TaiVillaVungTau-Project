'use client';

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Building2, 
  FileText, 
  CalendarCheck,
  Home,
  TrendingUp,
  Users,
  Eye,
  Star
} from "lucide-react";
import { useAdminStats, useTopProperties, useMonthlyStats } from "@/lib/hooks";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

// Stat Card Component matching reference design style
interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  iconBgColor: string;
  isLoading?: boolean;
  isError?: boolean;
}

function StatCard({ label, value, icon, iconBgColor, isLoading, isError }: StatCardProps) {
  return (
    <Card className="p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-12" />
          ) : isError ? (
            <p className="text-xl font-bold text-red-500">--</p>
          ) : (
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          )}
        </div>
        <div className={`w-11 h-11 ${iconBgColor} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

// Summary Stat for bottom of chart
interface SummaryStatProps {
  icon: React.ReactNode;
  iconColor: string;
  label: string;
  value: string | number;
}

function SummaryStat({ icon, iconColor, label, value }: SummaryStatProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${iconColor}`}></div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-lg font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

// Vietnamese month names
const monthNames = ['', 'Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useAdminStats();
  const { data: topProperties, isLoading: topPropertiesLoading } = useTopProperties(5);
  const { data: monthlyStats, isLoading: monthlyLoading } = useMonthlyStats();

  // Prepare chart data from monthly stats - Yêu cầu tư vấn theo tháng
  const requestChartData = monthlyStats?.map(item => ({
    name: monthNames[item.month] || `T${item.month}`,
    requests: item.requestCount,
  })) || [];

  // Fill empty months if data is sparse
  const fullYearData = Array.from({length: 12}, (_, i) => {
    const month = i + 1;
    const existing = requestChartData.find(d => d.name === monthNames[month]);
    return existing || { name: monthNames[month], requests: 0 };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Thống Kê</h1>
        <p className="text-sm text-gray-500 mt-1">Tổng quan hệ thống quản lý Villa TaiVillaVungTau</p>
      </div>

      {/* Overview Summary Card */}
      <Card className="p-6 bg-white border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Xin chào, Admin</p>
            <p className="text-lg font-semibold text-gray-700">Tổng số Yêu Cầu Tư Vấn</p>
          </div>
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Tất cả</option>
            <option>Hôm nay</option>
            <option>Tuần này</option>
            <option>Tháng này</option>
          </select>
        </div>
        
        <div className="flex items-baseline gap-2 mb-2">
          {statsLoading ? (
            <Skeleton className="h-10 w-24" />
          ) : (
            <>
              <span className="text-4xl font-bold text-gray-800">{stats?.totalRequests ?? 0}</span>
              <span className="text-base font-normal text-gray-500">yêu cầu</span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Home className="w-4 h-4" />
            <span>{stats?.totalProperties ?? 0} Villa</span>
          </span>
          <span className="flex items-center gap-1">
            <Building2 className="w-4 h-4 text-green-500" />
            <span>{stats?.activeProperties ?? 0} đang hoạt động</span>
          </span>
        </div>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors">
            XEM YÊU CẦU
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            QUẢN LÝ VILLA
          </button>
        </div>
      </Card>

      {/* Stats Grid - 4 metrics from backend */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Tổng số Villa" 
          value={stats?.totalProperties ?? 0}
          icon={<Building2 className="h-5 w-5 text-yellow-600" />}
          iconBgColor="bg-yellow-100"
          isLoading={statsLoading}
          isError={!!statsError}
        />
        <StatCard 
          label="Yêu Cầu Hôm Nay" 
          value={stats?.newRequestsToday ?? 0}
          icon={<CalendarCheck className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-100"
          isLoading={statsLoading}
          isError={!!statsError}
        />
        <StatCard 
          label="Tổng Yêu Cầu" 
          value={stats?.totalRequests ?? 0}
          icon={<FileText className="h-5 w-5 text-orange-600" />}
          iconBgColor="bg-orange-100"
          isLoading={statsLoading}
          isError={!!statsError}
        />
        <StatCard 
          label="Villa Đang Hoạt Động" 
          value={stats?.activeProperties ?? 0}
          icon={<Home className="h-5 w-5 text-green-600" />}
          iconBgColor="bg-green-100"
          isLoading={statsLoading}
          isError={!!statsError}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Yêu cầu theo tháng (Dark Theme like reference) */}
        <Card className="p-6 bg-slate-800 border-0">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-white">Yêu Cầu Tư Vấn Theo Tháng</h3>
            <p className="text-xs text-gray-400">Thống kê số lượng yêu cầu trong năm</p>
          </div>
          
          {monthlyLoading ? (
            <div className="h-48 flex items-center justify-center">
              <Skeleton className="h-full w-full bg-slate-700" />
            </div>
          ) : requestChartData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400">
              <p>Chưa có dữ liệu thống kê</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={requestChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff' 
                  }}
                  formatter={(value: number) => [`${value} yêu cầu`, 'Số lượng']}
                />
                <Bar dataKey="requests" fill="#60A5FA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-700">
            <SummaryStat icon={<Building2 />} iconColor="bg-yellow-500" label="Tổng Villa" value={stats?.totalProperties ?? 0} />
            <SummaryStat icon={<FileText />} iconColor="bg-blue-500" label="Tổng Yêu Cầu" value={stats?.totalRequests ?? 0} />
            <SummaryStat icon={<CalendarCheck />} iconColor="bg-orange-500" label="Hôm Nay" value={stats?.newRequestsToday ?? 0} />
            <SummaryStat icon={<Home />} iconColor="bg-green-500" label="Hoạt Động" value={stats?.activeProperties ?? 0} />
          </div>
        </Card>

        {/* Area Chart - Xu hướng yêu cầu (Light Theme like reference) */}
        <Card className="p-6 bg-white border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-700">Xu Hướng Yêu Cầu</h3>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                Biểu đồ yêu cầu tư vấn theo thời gian
              </p>
            </div>
          </div>
          
          {monthlyLoading ? (
            <div className="h-64 flex items-center justify-center">
              <Skeleton className="h-full w-full" />
            </div>
          ) : requestChartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <p>Chưa có dữ liệu thống kê</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={requestChartData}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E5E7EB', 
                    borderRadius: '8px' 
                  }}
                  formatter={(value: number) => [`${value} yêu cầu`, 'Số lượng']}
                />
                <Area 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRequests)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Top Properties Table */}
      <Card className="p-6 bg-white border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Top Villa Được Quan Tâm</h2>
            <p className="text-sm text-gray-500">Danh sách villa có nhiều yêu cầu tư vấn nhất</p>
          </div>
          <Star className="w-5 h-5 text-yellow-500" />
        </div>
        
        {topPropertiesLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div>
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : !topProperties || topProperties.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Chưa có dữ liệu villa</p>
          </div>
        ) : (
          <div className="space-y-0">
            {topProperties.map((property, index) => (
              <div key={property.propertyCode} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors rounded-lg px-2 -mx-2">
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-50 text-gray-500'
                  }`}>
                    #{index + 1}
                  </div>
                  
                  {/* Thumbnail */}
                  {property.thumbnailUrl ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      <Image 
                        src={property.thumbnailUrl} 
                        alt={property.propertyName}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Info */}
                  <div>
                    <p className="font-medium text-gray-800">{property.propertyName}</p>
                    <p className="text-sm text-gray-400">{property.propertyCode}</p>
                  </div>
                </div>
                
                {/* Request Count */}
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                  {property.requestCount} yêu cầu
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
