const config = {
  PROJECT_TITLE: process.env.REACT_APP_PROJECT_TITLE || 'Project',
  BLOCKCHAIN_API: process.env.REACT_APP_BLOCKCHAIN_API || 'ws://localhost:8080/ws',
  DAM_API: process.env.REACT_APP_DAM_API || 'http://localhost:4001',
  EMAIL_API: process.env.REACT_APP_EMAIL_API || 'http://localhost:4444',
  ACCOUNT_INITIALIZER: process.env.REACT_APP_ACCOUNT_INITIALIZER || 'http://localhost:4445',
  GIT_SHA: process.env.REACT_APP_GIT_SHA,
  VERSION: process.env.REACT_APP_VERSION,
  MAX_UPLOAD_FILE_SIZE: Number(process.env.REACT_APP_MAX_UPLOAD_FILE_SIZE || 10000000),
  MAX_TIMED_TRANSFER_FILE_SIZE: Number(process.env.REACT_APP_MAX_TIMED_TRANSFER_FILE_SIZE || 200000000),
  AUTH0_DOMAIN: process.env.REACT_APP_AUTH0_DOMAIN || 'fallback',
  AUTH0_CLIENT_ID: process.env.REACT_APP_AUTH0_CLIENT_ID || 'fallback',
  ITEMS_PER_PAGE: Number(process.env.REACT_APP_ITEMS_PER_PAGE || 10),
  DERIVATION_PATH: "m/44'/134'/0'",
};

export default config;
