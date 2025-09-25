export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
  name: string;
  createdAt: string;
  isActive: boolean;
}

export interface Container {
  id: string;
  code: string;
  type: string;
  status: 'in_transit' | 'arrived' | 'incident' | 'returning';
  warehouseId: string;
  notes: string;
  location: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: string;
  updatedAt: string;
  lastUpdatedBy: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentLoad: number;
  status: 'available' | 'full' | 'overloaded';
  containers: string[];
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  containerId?: string;
  message: string;
  type: 'general' | 'complaint' | 'suggestion';
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
  response?: string;
  respondedBy?: string;
  respondedAt?: string;
}

export type Theme = 'light' | 'dark';

export interface AppState {
  currentUser: User | null;
  theme: Theme;
  users: User[];
  containers: Container[];
  warehouses: Warehouse[];
  feedbacks: Feedback[];
}