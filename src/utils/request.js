/*
 * @Author: chenjie
 * @Date: 2025-01-16 09:17:18
 * @LastEditors: chenjie chenjie@i2value.com
 * @LastEditTime: 2025-05-12 16:24:00
 * @FilePath: \some-project\src\utils\request.js
 * @Description: 
 */
import axios from "axios";
import { Message } from "@arco-design/web-vue";
console.log("import.meta.env.VITE_BASE_API", import.meta.env.VITE_BASE_API);
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 300000,
});

service.interceptors.request.use(
  //   (config: AxiosRequestConfig) => {
  (config) => {
    // config.headers["Authorization"] = `Bearer ${handleGetToken()}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    if (response.data.code === 200) {
      return Promise.resolve(response.data.data);
    } else {
      Message.error(response.data.message);
      return Promise.reject(response.data.message);
    }
  },
  (error) => {
    console.log('error',error);
    Message.error(error.response.data.message);
    return Promise.reject(error);
  }
);

export default service;
