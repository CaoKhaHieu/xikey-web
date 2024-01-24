import { User } from '@/shared/models/User';
import { generateAPIAction } from '../redux';
import { types } from '../types';

export const login = generateAPIAction(types.LOGIN);
export const logout = generateAPIAction(types.LOGOUT);
export const registerAction = generateAPIAction(types.REGISTER);

// export const getUser = generateAPIAction(types.GET_USER);

// export const setUser = (payload: User) => ({
//   type: types.SET_USER,
//   payload,
// });
