import { User, Container, Warehouse, Feedback } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@container.com',
    role: 'admin',
    name: 'Quản trị viên',
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
  },
  {
    id: '2',
    username: 'staff1',
    email: 'staff1@container.com',
    role: 'staff',
    name: 'Nguyễn Văn A',
    createdAt: '2024-01-02T00:00:00Z',
    isActive: true
  },
  {
    id: '3',
    username: 'user1',
    email: 'user1@container.com',
    role: 'user',
    name: 'Trần Thị B',
    createdAt: '2024-01-03T00:00:00Z',
    isActive: true
  }
];

export const mockContainers: Container[] = [
  {
    id: '1',
    code: 'CONT-001',
    type: '20ft Standard',
    status: 'in_transit',
    warehouseId: '1',
    notes: 'Hàng hóa điện tử, cần bảo quản khô ráo',
    location: 'Đang trên đường từ Hải Phòng',
    weight: 15000,
    dimensions: { length: 6, width: 2.4, height: 2.6 },
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    lastUpdatedBy: 'staff1'
  },
  {
    id: '2',
    code: 'CONT-002',
    type: '40ft High Cube',
    status: 'arrived',
    warehouseId: '1',
    notes: 'Container thực phẩm, đã kiểm tra nhiệt độ',
    location: 'Kho A - Vị trí A1-01',
    weight: 25000,
    dimensions: { length: 12, width: 2.4, height: 2.9 },
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    lastUpdatedBy: 'staff1'
  },
  {
    id: '3',
    code: 'CONT-003',
    type: '20ft Standard',
    status: 'incident',
    warehouseId: '2',
    notes: 'Gặp sự cố trên đường, cần kiểm tra hàng hóa',
    location: 'Km 45 Quốc lộ 1A',
    weight: 18000,
    dimensions: { length: 6, width: 2.4, height: 2.6 },
    createdAt: '2024-01-13T06:00:00Z',
    updatedAt: '2024-01-15T11:45:00Z',
    lastUpdatedBy: 'staff1'
  }
];

export const mockWarehouses: Warehouse[] = [
  {
    id: '1',
    name: 'Kho Trung tâm Hà Nội',
    location: 'Km 8, Quốc lộ 5, Hà Nội',
    capacity: 100,
    currentLoad: 75,
    status: 'available',
    containers: ['1', '2']
  },
  {
    id: '2',
    name: 'Kho Hải Phòng',
    location: 'Cảng Hải Phòng, Hải Phòng',
    capacity: 150,
    currentLoad: 140,
    status: 'full',
    containers: ['3']
  },
  {
    id: '3',
    name: 'Kho TP.HCM',
    location: 'Khu Công nghiệp Tân Thuận, TP.HCM',
    capacity: 80,
    currentLoad: 85,
    status: 'overloaded',
    containers: []
  }
];

export const mockFeedbacks: Feedback[] = [
  {
    id: '1',
    userId: '3',
    userName: 'Trần Thị B',
    containerId: '1',
    message: 'Container CONT-001 đã quá thời gian dự kiến, xin cập nhật thông tin.',
    type: 'complaint',
    status: 'pending',
    createdAt: '2024-01-15T13:30:00Z'
  },
  {
    id: '2',
    userId: '3',
    userName: 'Trần Thị B',
    message: 'Đề xuất cải thiện hệ thống thông báo real-time cho khách hàng.',
    type: 'suggestion',
    status: 'reviewed',
    createdAt: '2024-01-14T16:20:00Z',
    response: 'Cảm ơn góp ý, chúng tôi sẽ xem xét cải thiện.',
    respondedBy: 'admin',
    respondedAt: '2024-01-15T09:00:00Z'
  }
];