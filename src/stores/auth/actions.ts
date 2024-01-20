import { generateAPIAction } from '../redux';
import { types } from '../types';

export const login = generateAPIAction(types.LOGIN);
export const logout = generateAPIAction(types.LOGOUT);
export const registerAction = generateAPIAction(types.REGISTER);
