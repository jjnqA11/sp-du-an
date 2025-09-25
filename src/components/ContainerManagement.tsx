import React, { useState } from 'react';
import { Container, User, Theme } from '../types';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter,
  MapPin,
  Weight,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Truck,
  RotateCcw,
  FileText
} from 'lucide-react';

interface ContainerManagementProps {
  containers: Container[];
  onCreateContainer: (container: Omit<Container, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateContainer: (id: string, updates: Partial<Container>) => void;
  onDeleteContainer: (id: string) => void;
  currentUser: User;
  theme: Theme;
}

export default function ContainerManagement({ 
  containers, 
  onCreateContainer, 
  onUpdateContainer, 
  onDeleteContainer, 
  currentUser,
  theme 
}: ContainerManagementProps) {
  const isDark = theme === 'dark';
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingContainer, setEditingContainer] = useState<Container | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Container['status']>('all');
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    type: '20ft Standard',
    status: 'in_transit' as Container['status'],
    warehouseId: '1',
    notes: '',
    location: '',
    weight: 0,
    dimensions: { length: 6, width: 2.4, height: 2.6 }
  });

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'staff';
  const canCreate = currentUser.role === 'admin';
  const canDelete = currentUser.role === 'admin';

  const resetForm = () => {
    setFormData({
      code: '',
      type: '20ft Standard',
      status: 'in_transit',
      warehouseId: '1',
      notes: '',
      location: '',
      weight: 0,
      dimensions: { length: 6, width: 2.4, height: 2.6 }
    });
    setShowCreateForm(false);
    setEditingContainer(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingContainer) {
      onUpdateContainer(editingContainer.id, { 
        ...formData,
        lastUpdatedBy: currentUser.username
      });
    } else {
      onCreateContainer({ 
        ...formData,
        lastUpdatedBy: currentUser.username
      });
    }
    
    resetForm();
  };

  const handleEdit = (container: Container) => {
    if (!canEdit) return;
    
    setFormData({
      code: container.code,
      type: container.type,
      status: container.status,
      warehouseId: container.warehouseId,
      notes: container.notes,
      location: container.location,
      weight: container.weight,
      dimensions: container.dimensions
    });
    setEditingContainer(container);
    setShowCreateForm(true);
  };

  const handleStatusUpdate = (containerId: string, newStatus: Container['status']) => {
    if (!canEdit) return;
    onUpdateContainer(containerId, { 
      status: newStatus,
      lastUpdatedBy: currentUser.username
    });
  };

  const filteredContainers = containers.filter(container => {
    const matchesSearch = container.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         container.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         container.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || container.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusInfo = (status: Container['status']) => {
    const statusMap = {
      in_transit: { 
        label: 'Đang vận chuyển', 
        icon: Truck, 
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        dot: 'bg-yellow-500'
      },
      arrived: { 
        label: 'Đã cập bến', 
        icon: CheckCircle, 
        color: 'bg-green-100 text-green-700 border-green-200',
        dot: 'bg-green-500'
      },
      incident: { 
        label: 'Gặp sự cố', 
        icon: AlertTriangle, 
        color: 'bg-red-100 text-red-700 border-red-200',
        dot: 'bg-red-500'
      },
      returning: { 
        label: 'Đang quay lại kho', 
        icon: RotateCcw, 
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        dot: 'bg-blue-500'
      }
    };
    return statusMap[status];
  };

  const StatusButton = ({ status, containerId }: { status: Container['status'], containerId: string }) => {
    const statusInfo = getStatusInfo(status);
    const Icon = statusInfo.icon;
    
    if (!canEdit) {
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
          <Icon className="h-3 w-3 mr-1" />
          {statusInfo.label}
        </span>
      );
    }

    const statusOptions: Container['status'][] = ['in_transit', 'arrived', 'incident', 'returning'];
    
    return (
      <div className="relative group">
        <button className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color} hover:opacity-80 transition-opacity`}>
          <Icon className="h-3 w-3 mr-1" />
          {statusInfo.label}
        </button>
        
        <div className={`absolute top-full left-0 mt-1 w-48 rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {statusOptions.map((option) => {
            const optionInfo = getStatusInfo(option);
            const OptionIcon = optionInfo.icon;
            return (
              <button
                key={option}
                onClick={() => handleStatusUpdate(containerId, option)}
                className={`w-full flex items-center px-3 py-2 text-sm hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'} transition-colors ${
                  option === status ? 'font-medium' : ''
                } ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
              >
                <div className={`w-2 h-2 rounded-full mr-2 ${optionInfo.dot}`}></div>
                <OptionIcon className="h-4 w-4 mr-2" />
                {optionInfo.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            isDark ? 'bg-blue-600' : 'bg-blue-500'
          }`}>
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Quản lý Container
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Theo dõi và quản lý container hàng hóa
            </p>
          </div>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Thêm container</span>
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
            isDark ? 'text-gray-400' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Tìm kiếm container..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className={`px-3 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="in_transit">Đang vận chuyển</option>
            <option value="arrived">Đã cập bến</option>
            <option value="incident">Gặp sự cố</option>
            <option value="returning">Đang quay lại kho</option>
          </select>
        </div>
      </div>

      {/* Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredContainers.map((container) => (
          <div
            key={container.id}
            className={`rounded-xl shadow-lg border transition-all duration-300 hover:shadow-xl cursor-pointer ${
              isDark ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedContainer(container)}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {container.code}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {container.type}
                  </p>
                </div>
                <StatusButton status={container.status} containerId={container.id} />
              </div>

              {/* Info Grid */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {container.location}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Weight className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {container.weight.toLocaleString()} kg
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {new Date(container.updatedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                {container.notes && (
                  <div className="flex items-start space-x-2">
                    <FileText className={`h-4 w-4 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {container.notes.substring(0, 60)}{container.notes.length > 60 ? '...' : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              {(canEdit || canDelete) && (
                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {canEdit && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEdit(container); }}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark 
                          ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteContainer(container.id); }}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark 
                          ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' 
                          : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                      }`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Container Detail Modal */}
      {selectedContainer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-2xl rounded-xl shadow-2xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Chi tiết Container {selectedContainer.code}
                </h3>
                <button
                  onClick={() => setSelectedContainer(null)}
                  className={`text-gray-400 hover:text-gray-600`}
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>Mã Container</label>
                  <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedContainer.code}
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>Loại Container</label>
                  <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedContainer.type}
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>Trạng thái</label>
                  <StatusButton status={selectedContainer.status} containerId={selectedContainer.id} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>Trọng lượng</label>
                  <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedContainer.weight.toLocaleString()} kg
                  </p>
                </div>
                <div className="col-span-2">
                  <label className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>Vị trí hiện tại</label>
                  <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedContainer.location}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>Kích thước (D x R x C)</label>
                  <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedContainer.dimensions.length}m × {selectedContainer.dimensions.width}m × {selectedContainer.dimensions.height}m
                  </p>
                </div>
                {selectedContainer.notes && (
                  <div className="col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>Ghi chú</label>
                    <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {selectedContainer.notes}
                    </p>
                  </div>
                )}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>Cập nhật lần cuối</label>
                  <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {new Date(selectedContainer.updatedAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>Được cập nhật bởi</label>
                  <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedContainer.lastUpdatedBy}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-2xl rounded-xl shadow-2xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } max-h-[90vh] overflow-y-auto`}>
            <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {editingContainer ? 'Chỉnh sửa container' : 'Thêm container mới'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Mã Container *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="CONT-001"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Loại Container
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="20ft Standard">20ft Standard</option>
                    <option value="40ft Standard">40ft Standard</option>
                    <option value="40ft High Cube">40ft High Cube</option>
                    <option value="45ft High Cube">45ft High Cube</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Container['status'] })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="in_transit">Đang vận chuyển</option>
                    <option value="arrived">Đã cập bến</option>
                    <option value="incident">Gặp sự cố</option>
                    <option value="returning">Đang quay lại kho</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Trọng lượng (kg) *
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="15000"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Vị trí hiện tại *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Đang trên đường từ Hải Phòng"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Kích thước (mét)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Dài"
                      value={formData.dimensions.length}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        dimensions: { ...formData.dimensions, length: Number(e.target.value) }
                      })}
                      className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Rộng"
                      value={formData.dimensions.width}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        dimensions: { ...formData.dimensions, width: Number(e.target.value) }
                      })}
                      className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Cao"
                      value={formData.dimensions.height}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        dimensions: { ...formData.dimensions, height: Number(e.target.value) }
                      })}
                      className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Ghi chú
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Ghi chú về container..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    isDark 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editingContainer ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}