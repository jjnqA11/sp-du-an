import React from 'react';
import { User, Container, Warehouse, Feedback, Theme } from '../types';
import { 
  Package, 
  Warehouse as WarehouseIcon, 
  Users, 
  MessageCircle, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';

interface DashboardProps {
  currentUser: User;
  containers: Container[];
  warehouses: Warehouse[];
  feedbacks: Feedback[];
  theme: Theme;
}

export default function Dashboard({ currentUser, containers, warehouses, feedbacks, theme }: DashboardProps) {
  const isDark = theme === 'dark';

  // Calculate statistics
  const containerStats = {
    total: containers.length,
    inTransit: containers.filter(c => c.status === 'in_transit').length,
    arrived: containers.filter(c => c.status === 'arrived').length,
    incident: containers.filter(c => c.status === 'incident').length,
    returning: containers.filter(c => c.status === 'returning').length,
  };

  const warehouseStats = {
    total: warehouses.length,
    available: warehouses.filter(w => w.status === 'available').length,
    full: warehouses.filter(w => w.status === 'full').length,
    overloaded: warehouses.filter(w => w.status === 'overloaded').length,
  };

  const feedbackStats = {
    total: feedbacks.length,
    pending: feedbacks.filter(f => f.status === 'pending').length,
    reviewed: feedbacks.filter(f => f.status === 'reviewed').length,
    resolved: feedbacks.filter(f => f.status === 'resolved').length,
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: {
    title: string;
    value: number;
    icon: any;
    color: string;
    subtitle?: string;
  }) => (
    <div className={`p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ${
      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
          {subtitle && (
            <p className={`text-sm mt-1 ${color}`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className={`rounded-xl p-6 ${
        isDark 
          ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-gray-700' 
          : 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Chào mừng, {currentUser.name}!
            </h1>
            <p className={`mt-1 ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
              Tổng quan hệ thống quản lý container
            </p>
          </div>
          <div className={`p-3 rounded-lg ${
            isDark ? 'bg-blue-600/20' : 'bg-blue-500/10'
          }`}>
            <BarChart3 className={`h-8 w-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
        </div>
      </div>

      {/* Container Statistics */}
      <div>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Thống kê Container
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Tổng Container"
            value={containerStats.total}
            icon={Package}
            color="text-blue-600"
          />
          <StatCard
            title="Đang vận chuyển"
            value={containerStats.inTransit}
            icon={Clock}
            color="text-yellow-600"
            subtitle="Trên đường"
          />
          <StatCard
            title="Đã cập bến"
            value={containerStats.arrived}
            icon={CheckCircle}
            color="text-green-600"
            subtitle="An toàn"
          />
          <StatCard
            title="Gặp sự cố"
            value={containerStats.incident}
            icon={AlertTriangle}
            color="text-red-600"
            subtitle="Cần xử lý"
          />
        </div>
      </div>

      {/* Warehouse Statistics */}
      <div>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Thống kê Kho
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Tổng số Kho"
            value={warehouseStats.total}
            icon={WarehouseIcon}
            color="text-purple-600"
          />
          <StatCard
            title="Sẵn sàng"
            value={warehouseStats.available}
            icon={CheckCircle}
            color="text-green-600"
            subtitle="Có thể chứa"
          />
          <StatCard
            title="Đã đầy"
            value={warehouseStats.full}
            icon={Package}
            color="text-yellow-600"
            subtitle="Hết chỗ"
          />
          <StatCard
            title="Quá tải"
            value={warehouseStats.overloaded}
            icon={AlertTriangle}
            color="text-red-600"
            subtitle="Nguy hiểm"
          />
        </div>
      </div>

      {/* Recent Activity & Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Containers */}
        <div className={`rounded-xl p-6 ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Container gần đây
          </h3>
          <div className="space-y-3">
            {containers.slice(0, 3).map((container) => (
              <div key={container.id} className={`flex items-center justify-between p-3 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    container.status === 'arrived' ? 'bg-green-500' :
                    container.status === 'in_transit' ? 'bg-yellow-500' :
                    container.status === 'incident' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {container.code}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {container.type}
                    </p>
                  </div>
                </div>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  container.status === 'arrived' ? 'bg-green-100 text-green-700' :
                  container.status === 'in_transit' ? 'bg-yellow-100 text-yellow-700' :
                  container.status === 'incident' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {container.status === 'arrived' ? 'Đã cập bến' :
                   container.status === 'in_transit' ? 'Đang vận chuyển' :
                   container.status === 'incident' ? 'Gặp sự cố' :
                   'Đang quay lại'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Summary */}
        <div className={`rounded-xl p-6 ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Phản hồi từ khách hàng
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Chờ xử lý
              </span>
              <span className={`px-2 py-1 rounded-full text-sm bg-orange-100 text-orange-700`}>
                {feedbackStats.pending}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Đã xem
              </span>
              <span className={`px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-700`}>
                {feedbackStats.reviewed}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Đã giải quyết
              </span>
              <span className={`px-2 py-1 rounded-full text-sm bg-green-100 text-green-700`}>
                {feedbackStats.resolved}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}