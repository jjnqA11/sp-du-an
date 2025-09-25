import React, { useState } from 'react';
import { Feedback, User, Container, Theme } from '../types';
import { 
  MessageCircle, 
  Plus, 
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Eye,
  MessageSquare,
  User as UserIcon
} from 'lucide-react';

interface FeedbackProps {
  feedbacks: Feedback[];
  containers: Container[];
  onCreateFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => void;
  onUpdateFeedback: (id: string, updates: Partial<Feedback>) => void;
  currentUser: User;
  theme: Theme;
}

export default function FeedbackComponent({ 
  feedbacks, 
  containers,
  onCreateFeedback, 
  onUpdateFeedback, 
  currentUser,
  theme 
}: FeedbackProps) {
  const isDark = theme === 'dark';
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | Feedback['status']>('all');
  const [filterType, setFilterType] = useState<'all' | Feedback['type']>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [response, setResponse] = useState('');

  const [formData, setFormData] = useState({
    containerId: '',
    message: '',
    type: 'general' as Feedback['type']
  });

  const canRespond = currentUser.role === 'admin' || currentUser.role === 'staff';

  const resetForm = () => {
    setFormData({
      containerId: '',
      message: '',
      type: 'general'
    });
    setShowCreateForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onCreateFeedback({
      userId: currentUser.id,
      userName: currentUser.name,
      containerId: formData.containerId || undefined,
      message: formData.message,
      type: formData.type,
      status: 'pending'
    });
    
    resetForm();
  };

  const handleRespond = (feedbackId: string) => {
    if (!response.trim()) return;
    
    onUpdateFeedback(feedbackId, {
      status: 'resolved',
      response,
      respondedBy: currentUser.username,
      respondedAt: new Date().toISOString()
    });
    
    setResponse('');
    setSelectedFeedback(null);
  };

  const markAsReviewed = (feedbackId: string) => {
    onUpdateFeedback(feedbackId, {
      status: 'reviewed'
    });
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesStatus = filterStatus === 'all' || feedback.status === filterStatus;
    const matchesType = filterType === 'all' || feedback.type === filterType;
    return matchesStatus && matchesType;
  });

  const getStatusInfo = (status: Feedback['status']) => {
    const statusMap = {
      pending: {
        label: 'Chờ xử lý',
        icon: Clock,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        borderColor: 'border-orange-200'
      },
      reviewed: {
        label: 'Đã xem',
        icon: Eye,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        borderColor: 'border-blue-200'
      },
      resolved: {
        label: 'Đã giải quyết',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-200'
      }
    };
    return statusMap[status];
  };

  const getTypeInfo = (type: Feedback['type']) => {
    const typeMap = {
      general: { label: 'Chung', color: 'bg-gray-100 text-gray-700' },
      complaint: { label: 'Khiếu nại', color: 'bg-red-100 text-red-700' },
      suggestion: { label: 'Đề xuất', color: 'bg-blue-100 text-blue-700' }
    };
    return typeMap[type];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            isDark ? 'bg-blue-600' : 'bg-blue-500'
          }`}>
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Phản hồi & Tương tác
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Quản lý phản hồi từ người dùng
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Gửi phản hồi</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <Filter className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Lọc theo:
          </span>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            isDark 
              ? 'bg-gray-800 border-gray-700 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ xử lý</option>
          <option value="reviewed">Đã xem</option>
          <option value="resolved">Đã giải quyết</option>
        </select>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            isDark 
              ? 'bg-gray-800 border-gray-700 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">Tất cả loại</option>
          <option value="general">Chung</option>
          <option value="complaint">Khiếu nại</option>
          <option value="suggestion">Đề xuất</option>
        </select>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedbacks.map((feedback) => {
          const statusInfo = getStatusInfo(feedback.status);
          const typeInfo = getTypeInfo(feedback.type);
          const StatusIcon = statusInfo.icon;
          const relatedContainer = feedback.containerId ? containers.find(c => c.id === feedback.containerId) : null;

          return (
            <div
              key={feedback.id}
              className={`rounded-xl border transition-all duration-300 hover:shadow-lg ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      feedback.userId === currentUser.id ? 'bg-blue-500' : 'bg-gray-500'
                    }`}>
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {feedback.userName}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(feedback.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
                      <StatusIcon className={`h-3 w-3 mr-1 ${statusInfo.color}`} />
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Related Container */}
                {relatedContainer && (
                  <div className={`mb-3 p-3 rounded-lg ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Liên quan đến container: <span className="font-medium">{relatedContainer.code}</span>
                    </p>
                  </div>
                )}

                {/* Message */}
                <div className="mb-4">
                  <p className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {feedback.message}
                  </p>
                </div>

                {/* Response */}
                {feedback.response && (
                  <div className={`border-l-4 border-blue-500 pl-4 py-2 mb-4 ${
                    isDark ? 'bg-blue-900/20' : 'bg-blue-50'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                        Phản hồi từ {feedback.respondedBy}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {feedback.respondedAt && new Date(feedback.respondedAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <p className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {feedback.response}
                    </p>
                  </div>
                )}

                {/* Actions */}
                {canRespond && feedback.status !== 'resolved' && (
                  <div className="flex items-center space-x-3">
                    {feedback.status === 'pending' && (
                      <button
                        onClick={() => markAsReviewed(feedback.id)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          isDark 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                        }`}
                      >
                        Đánh dấu đã xem
                      </button>
                    )}
                    
                    <button
                      onClick={() => setSelectedFeedback(feedback)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        isDark 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-green-100 hover:bg-green-200 text-green-700'
                      }`}
                    >
                      Phản hồi
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredFeedbacks.length === 0 && (
          <div className={`text-center py-12 ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          } rounded-xl`}>
            <MessageCircle className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Chưa có phản hồi nào
            </p>
            <p className={`${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Các phản hồi sẽ hiển thị ở đây
            </p>
          </div>
        )}
      </div>

      {/* Create Feedback Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-lg rounded-xl shadow-2xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Gửi phản hồi mới
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Loại phản hồi
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Feedback['type'] })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="general">Phản hồi chung</option>
                  <option value="complaint">Khiếu nại</option>
                  <option value="suggestion">Đề xuất cải thiện</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Container liên quan (tùy chọn)
                </label>
                <select
                  value={formData.containerId}
                  onChange={(e) => setFormData({ ...formData, containerId: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Không liên quan đến container cụ thể</option>
                  {containers.map((container) => (
                    <option key={container.id} value={container.id}>
                      {container.code} - {container.type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Nội dung phản hồi *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Nhập nội dung phản hồi của bạn..."
                  required
                />
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
                  Gửi phản hồi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-lg rounded-xl shadow-2xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Phản hồi cho {selectedFeedback.userName}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong>Nội dung gốc:</strong>
                </p>
                <p className={`mt-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {selectedFeedback.message}
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Phản hồi của bạn *
                </label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Nhập phản hồi của bạn..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    isDark 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleRespond(selectedFeedback.id)}
                  disabled={!response.trim()}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <Send className="h-4 w-4" />
                  <span>Gửi phản hồi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}