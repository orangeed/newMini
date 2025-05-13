import request from "../utils/request";

// 创建一个软件
export const createSoft = (data) =>
  request({ url: "/soft", method: "POST", data });

// 获取软件列表

export const getSoftList = (params) =>
  request({ url: "/soft", method: "GET", params });
