import request from "../utils/request";

// 创建一个短链接
export const createNewUrl = (data) =>
  request({ url: "/shorturl", method: "POST", data });
