import { UserRoles } from 'src/ability/roles/roles.eum';

export interface IUser {
  id: string;
  login: string;
  password: string;
  refreshToken: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  role: UserRoles;
}
