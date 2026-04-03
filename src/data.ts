import type { Delivery, LoginAttempt, Customer, DigitalProduct } from './types';

function generateTrackingNumber(): string {
  const prefix = 'DP';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

const CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Sarah Mitchell', email: 'sarah.m@email.com', phone: '(555) 123-4567', createdAt: '2026-03-15T10:00:00Z' },
  { id: 'c2', name: 'James Rodriguez', email: 'james.r@email.com', phone: '(555) 234-5678', createdAt: '2026-03-18T14:30:00Z' },
  { id: 'c3', name: 'Emily Chen', email: 'emily.c@email.com', phone: '(555) 345-6789', createdAt: '2026-03-20T09:15:00Z' },
  { id: 'c4', name: 'Marcus Thompson', email: 'marcus.t@email.com', phone: '(555) 456-7890', createdAt: '2026-03-22T16:45:00Z' },
  { id: 'c5', name: 'Priya Patel', email: 'priya.p@email.com', phone: '(555) 567-8901', createdAt: '2026-03-25T11:20:00Z' },
  { id: 'c6', name: 'David Kim', email: 'david.k@email.com', phone: '(555) 678-9012', createdAt: '2026-03-28T08:00:00Z' },
];

const PRODUCTS: DigitalProduct[] = [
  { id: 'p1', name: 'Health Club Membership', description: 'Full access to the Internet Health Club platform', type: 'membership' },
  { id: 'p2', name: 'Figure Design Blueprint', description: 'Complete guide to designing your ideal figure', type: 'ebook' },
  { id: 'p3', name: 'Home Workout Video Series', description: '12-week progressive workout program', type: 'course' },
  { id: 'p4', name: 'Meal Planning Templates', description: 'Customizable weekly meal plan templates', type: 'template' },
  { id: 'p5', name: 'Nutrition Tracker Pro', description: 'Digital nutrition tracking software', type: 'software' },
];

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();

export const MOCK_DELIVERIES: Delivery[] = [
  {
    id: 'd1', trackingNumber: 'DP-M1K9X2-AB3C4D', customerId: 'c1', customerName: 'Sarah Mitchell',
    customerEmail: 'sarah.m@email.com', productId: 'p1', productName: 'Health Club Membership',
    productType: 'membership', deliveryMethod: 'portal', status: 'accessed',
    createdAt: daysAgo(7), shippedAt: daysAgo(7), deliveredAt: daysAgo(7), accessedAt: hoursAgo(2),
    accessCount: 14, ipAddress: '192.168.1.45', userAgent: 'Chrome/120 (Windows)',
  },
  {
    id: 'd2', trackingNumber: 'DP-N2L8Y3-EF5G6H', customerId: 'c2', customerName: 'James Rodriguez',
    customerEmail: 'james.r@email.com', productId: 'p3', productName: 'Home Workout Video Series',
    productType: 'course', deliveryMethod: 'email', status: 'delivered',
    createdAt: daysAgo(5), shippedAt: daysAgo(5), deliveredAt: daysAgo(4),
    accessCount: 3, ipAddress: '10.0.0.22', userAgent: 'Safari/17 (macOS)',
  },
  {
    id: 'd3', trackingNumber: 'DP-O3M7Z4-IJ7K8L', customerId: 'c3', customerName: 'Emily Chen',
    customerEmail: 'emily.c@email.com', productId: 'p2', productName: 'Figure Design Blueprint',
    productType: 'ebook', deliveryMethod: 'download_link', status: 'accessed',
    createdAt: daysAgo(3), shippedAt: daysAgo(3), deliveredAt: daysAgo(3), accessedAt: hoursAgo(8),
    accessCount: 7, ipAddress: '172.16.0.100', userAgent: 'Firefox/121 (Linux)',
  },
  {
    id: 'd4', trackingNumber: 'DP-P4N6A5-MN9O0P', customerId: 'c4', customerName: 'Marcus Thompson',
    customerEmail: 'marcus.t@email.com', productId: 'p4', productName: 'Meal Planning Templates',
    productType: 'template', deliveryMethod: 'email', status: 'in_transit',
    createdAt: daysAgo(1), shippedAt: hoursAgo(12),
    accessCount: 0,
  },
  {
    id: 'd5', trackingNumber: 'DP-Q5O5B6-QR1S2T', customerId: 'c5', customerName: 'Priya Patel',
    customerEmail: 'priya.p@email.com', productId: 'p1', productName: 'Health Club Membership',
    productType: 'membership', deliveryMethod: 'portal', status: 'accessed',
    createdAt: daysAgo(10), shippedAt: daysAgo(10), deliveredAt: daysAgo(10), accessedAt: hoursAgo(1),
    accessCount: 22, ipAddress: '192.168.2.88', userAgent: 'Chrome/120 (iPhone)',
  },
  {
    id: 'd6', trackingNumber: 'DP-R6P4C7-UV3W4X', customerId: 'c6', customerName: 'David Kim',
    customerEmail: 'david.k@email.com', productId: 'p5', productName: 'Nutrition Tracker Pro',
    productType: 'software', deliveryMethod: 'download_link', status: 'pending',
    createdAt: hoursAgo(3),
    accessCount: 0,
  },
];

export const MOCK_LOGIN_ATTEMPTS: LoginAttempt[] = [
  { id: 'la1', customerId: 'c1', customerEmail: 'sarah.m@email.com', customerName: 'Sarah Mitchell', timestamp: hoursAgo(2), ipAddress: '192.168.1.45', userAgent: 'Chrome/120 (Windows)', success: true, deliveryId: 'd1', trackingNumber: 'DP-M1K9X2-AB3C4D' },
  { id: 'la2', customerId: 'c1', customerEmail: 'sarah.m@email.com', customerName: 'Sarah Mitchell', timestamp: hoursAgo(26), ipAddress: '192.168.1.45', userAgent: 'Chrome/120 (Windows)', success: true, deliveryId: 'd1', trackingNumber: 'DP-M1K9X2-AB3C4D' },
  { id: 'la3', customerId: 'c3', customerEmail: 'emily.c@email.com', customerName: 'Emily Chen', timestamp: hoursAgo(8), ipAddress: '172.16.0.100', userAgent: 'Firefox/121 (Linux)', success: true, deliveryId: 'd3', trackingNumber: 'DP-O3M7Z4-IJ7K8L' },
  { id: 'la4', customerId: 'c5', customerEmail: 'priya.p@email.com', customerName: 'Priya Patel', timestamp: hoursAgo(1), ipAddress: '192.168.2.88', userAgent: 'Chrome/120 (iPhone)', success: true, deliveryId: 'd5', trackingNumber: 'DP-Q5O5B6-QR1S2T' },
  { id: 'la5', customerId: 'c2', customerEmail: 'james.r@email.com', customerName: 'James Rodriguez', timestamp: daysAgo(4), ipAddress: '10.0.0.22', userAgent: 'Safari/17 (macOS)', success: true, deliveryId: 'd2', trackingNumber: 'DP-N2L8Y3-EF5G6H' },
  { id: 'la6', customerId: 'c4', customerEmail: 'unknownemail@test.com', customerName: 'Unknown', timestamp: hoursAgo(5), ipAddress: '45.33.22.11', userAgent: 'Chrome/119 (Android)', success: false },
  { id: 'la7', customerId: 'c5', customerEmail: 'priya.p@email.com', customerName: 'Priya Patel', timestamp: hoursAgo(25), ipAddress: '192.168.2.88', userAgent: 'Chrome/120 (iPhone)', success: true, deliveryId: 'd5', trackingNumber: 'DP-Q5O5B6-QR1S2T' },
  { id: 'la8', customerId: 'c6', customerEmail: 'wrong@email.com', customerName: 'Unknown', timestamp: hoursAgo(10), ipAddress: '98.76.54.32', userAgent: 'Firefox/120 (Windows)', success: false },
];

export const MOCK_CUSTOMERS = CUSTOMERS;
export const MOCK_PRODUCTS = PRODUCTS;
export { generateTrackingNumber };
