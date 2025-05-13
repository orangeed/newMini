import request from "../utils/request";

// 去除水印
export const removeWaterMark = (params) =>
  request({ url: "/remove-water-maker", method: "GET", params });
