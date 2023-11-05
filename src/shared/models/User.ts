export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: string;
  avatar: string;
  online: boolean;
  gender: 'male' | 'female';
  dob: string;
  phone: string;
  password?: string;
  refreshToken?: string;
}
