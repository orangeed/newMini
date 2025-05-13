import request from "../utils/request";

// 获取短剧链接
export const getDuanju = (params) =>
  request({ url: "/duanju", method: "GET", params });

// 给短剧添加num
export const patchNum = (data) =>
  request({ url: `/duanju/${data.id}`, method: "PATCH", data });

// 获取点击次数
export const getDuanjuSearchNum = () =>
  request({ url: "/duanju/clickNum", method: "GET" });

// 获取所有的短剧查询次数
export const getDuanjuAllSearchNum = () =>
  request({ url: "/duanju/searchNum", method: "GET" });

// 存访问次数
export const saveLookTime = () =>
  request({ url: "/duanju/saveFang", method: "GET" });

// 获取访问次数
export const getLookTime = () =>
  request({ url: "/duanju/lookNum", method: "GET" });

// 获取所有短剧数量
export const getDuanjuAllNum = () =>
  request({ url: "/duanju/allTV", method: "GET" });

// 分页查询短剧
export const getDuanjuPage = (params) =>
  request({ url: "/duanju/allTVPage", method: "GET", params });
