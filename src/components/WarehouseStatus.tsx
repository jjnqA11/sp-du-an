import React from 'react';
import { Warehouse, Theme } from '../types';
import { 
  Warehouse as WarehouseIcon, 
  MapPin, 
  Package, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Activity
} from 'lucide-react';

interface WarehouseStatusProps {
  warehouses: Warehouse[];
  theme: Theme;
}

export default function WarehouseStatus({ warehouses, theme }: WarehouseStatusProps) {
  const isDark = theme === 'dark';

  const getStatusInfo = (status: Warehouse['status']) => {
    const statusMap = {
      available: {
        label: 'Có thể chứa',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-200'
      },
      full: {
        label: 'Đã đầy',
        icon: Package,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-200'
      },
      overloaded: {
        label: 'Quá tải',
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-200'
      }
    };
    return statusMap[status];
  };

  const getCapacityPercentage = (warehouse: Warehouse) => {
    return Math.round((warehouse.currentLoad / warehouse.capacity) * 100);
  };

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
  const totalLoad = warehouses.reduce((sum, w) => sum + w.currentLoad, 0);
  const averageUtilization = Math.round((totalLoad / totalCapacity) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${
          isDark ? 'bg-green-600' : 'bg-green-500'
        }`}>
          <WarehouseIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Trạng thái Kho
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Theo dõi tình trạng và công suất các kho
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`p-6 rounded-xl shadow-lg ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Tổng số kho
              </p>
              <p className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {warehouses.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <WarehouseIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Tổng công suất
              </p>
              <p className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {totalCapacity.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Đang sử dụng
              </p>
              <p className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {totalLoad.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <Package className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Tỷ lệ sử dụng
              </p>
              <p className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {averageUtilization}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-orange-100">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Warehouse Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {warehouses.map((warehouse) => {
          const statusInfo = getStatusInfo(warehouse.status);
          const percentage = getCapacityPercentage(warehouse);
          const StatusIcon = statusInfo.icon;

          return (
            <div
              key={warehouse.id}
              className={`rounded-xl shadow-lg border transition-all duration-300 hover:shadow-xl ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {warehouse.name}
                    </h3>
                    <div className="flex items-center space-x-1 mb-2">
                      <MapPin className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {warehouse.location}
                      </span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full border ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
                    <div className="flex items-center space-x-1">
                      <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                      <span className={`text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Capacity Info */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Công suất sử dụng
                      </span>
                      <span className={`text-sm font-bold ${
                        percentage >= 100 ? 'text-red-600' :
                        percentage >= 80 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {percentage}%
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className={`w-full rounded-full h-3 ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${getCapacityColor(percentage)}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Hiện tại
                      </p>
                      <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {warehouse.currentLoad.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Tối đa
                      </p>
                      <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {warehouse.capacity.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Container Count */}
                  <div className={`pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Số container
                      </span>
                      <div className="flex items-center space-x-1">
                        <Package className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {warehouse.containers.length} container
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Warning for overloaded warehouses */}
                  {warehouse.status === 'overloaded' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="text-sm font-medium text-red-800">
                            Cảnh báo quá tải
                          </p>
                          <p className="text-xs text-red-600">
                            Kho đang vượt quá công suất cho phép. Cần di chuyển container.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Legend */}
      <div className={`rounded-xl p-6 ${
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Chú thích trạng thái
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Có thể chứa
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Dưới 80% công suất
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg">
              <Package className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Đã đầy
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                80-100% công suất
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Quá tải
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Trên 100% công suất
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}