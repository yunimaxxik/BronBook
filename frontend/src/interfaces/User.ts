export interface User {
  id: number;
  email: string;
  name: string;
  contactPhone?: string;
  role: 'client' | 'admin' | 'manager';
}
