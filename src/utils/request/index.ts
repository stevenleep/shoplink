// import axios from 'axios';

export const createShoplineUrl = (handle: string) => {
  return `https://${handle}.myshopline.com`;
};

// export const request = axios.create({
//   timeout: 30 * 1000, // 30s
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// request.interceptors.request.use(
//   (config) => {
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// request.interceptors.response.use(
//   (response) => {
//     return response.data;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );
