export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface DigitalProduct {
  id: string;
  name: string;
  description: string;
  type: 'course' | 'ebook' | 'software' | 'membership' | 'template' | 'other';
  fileUrl?: string;
}

export type DeliveryStatus = 'pending' | 'shipped' | 'in_transit' | 'delivered' | 'accessed';

export interface Delivery {
  id: string;
  trackingNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productName: string;
  productType: DigitalProduct['type'];
  deliveryMethod: 'email' | 'portal' | 'download_link' | 'api';
  status: DeliveryStatus;
  createdAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  accessedAt?: string;
  accessCount: number;
  ipAddress?: string;
  userAgent?: string;
  notes?: string;
}

export interface LoginAttempt {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  deliveryId?: string;
  trackingNumber?: string;
}

export interface AdminUser {
  email: string;
  password: string;
  name: string;
}
