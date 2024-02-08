export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const API_DOMAIN = `${BASE_URL}/api/`;

export const VALIDATE_LENGTH = {
  MIN_LENGTH: 6,
  MAX_NAME: 30,
  MAX_PASSWORD: 32,
  MAX_EMAIL: 128,
};

export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
