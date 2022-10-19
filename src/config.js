export const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:4000 ',
  CLOUDINARY_CLOUD_NAME: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
    ? process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
    : null,
  CLOUDINARY_PRESET: process.env.REACT_APP_CLOUDINARY_PRESET
    ? process.env.REACT_APP_CLOUDINARY_PRESET
    : null,
};
