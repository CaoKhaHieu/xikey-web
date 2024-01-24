import { types } from '../types';
import { User } from '@/shared/models/User';
import { generateAPIAction } from '../redux';

export const getAllUsers = generateAPIAction(types.GET_ALL_USER);

export const getUser = generateAPIAction(types.GET_USER);

export const setUser = (payload: User) => ({
  type: types.SET_USER,
  payload,
});

export const saveAllUsers = (payload: User[]) => ({
  type: types.SAVE_ALL_USERS,
  payload,
});
