export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const AUTH_URL = import.meta.env.VITE_AUTH_URL;
export const API_DOMAIN = `${BASE_URL}/api/`;

export const VALIDATE_LENGTH = {
  MIN_LENGTH: 6,
  MAX_NAME: 30,
  MAX_PASSWORD: 32,
  MAX_EMAIL: 128,
  LIMIT_IMAGES: 4,
};

export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

export const REACTIONS: {
  [key: number]: {
    text: string;
    value: number;
  }
} = {
  1: {
    text: '👍',
    value: 1,
  },
  2: {
    text: '❤️',
    value: 2,
  },
  3: {
    text: '🤣',
    value: 3,
  },
  4: {
    text: '😥',
    value: 4,
  },
  5: {
    text: '😮',
    value: 5,
  },
  6: {
    text: '😡',
    value: 6,
  },
};

export const WHITELIST_FILES = ".jpg,.jpeg,.png,.webp,.gif,.bmp,.svg,.tiff,.ico,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.odt,.rtf,.mp3,.wav,.aac,.flac,.ogg,.m4a,.mp4,.avi,.mkv,.mov,.wmv,.flv,.webm,.zip,.rar,.7z,.tar,.gz,.bz2,.csv,.json,.xml,.yaml,.yml,.xlsm,.ods,.stl,.obj,.fbx,.dwg,.dxf,.skp,.psd,.ai,.eps,.svg";
export const VALID_IMAGE_TYPES = ['.jpeg', '.jpg', '.webp', '.png'];
