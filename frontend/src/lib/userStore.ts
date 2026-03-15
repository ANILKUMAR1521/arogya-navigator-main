// Simple client-side state store for the app flow (will be replaced by Lovable Cloud later)
export interface UserData {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Transgender';
  phone?: string;
  authMethod: 'phone' | 'google';
}

let currentUser: UserData | null = null;

export const setUser = (user: UserData) => { currentUser = user; };
export const getUser = (): UserData | null => currentUser;
export const clearUser = () => { currentUser = null; };
