import { combineReducers } from 'redux';
import { createReducer } from '../redux';
import { User } from '@/shared/models/User';

const userInitialState: User = new User({});
const setUser = (state: any, payload: User) => {
  return {
    ...state,
    ...payload,
  };
};

const updateUser = (state: any, payload: any) => ({ ...state, ...payload });

const clearUser = () => userInitialState;

const userStrategies = {
  SET_USER: setUser,
  UPDATE_USER: updateUser,
  CLEAR_USER: clearUser,
  __default__: (state: any) => state,
};

export const user = createReducer(userStrategies, userInitialState);

const sidebarInitialState = {
  allUsers: [],
};
const saveAllUsers = (state: any, payload: User[]) => {
  return {
    ...state,
    allUsers: [...payload],
  };
};

const sidebarStrategies = {
  SAVE_ALL_USERS: saveAllUsers,
  __default__: (state: any) => state,
};

export const sidebar = createReducer(sidebarStrategies, sidebarInitialState);

export const userReducer = combineReducers({
  user,
  userManagement: sidebar,
});
