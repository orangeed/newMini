import request from "../utils/request";


// 新增假期
export const createVacation = (data) =>
  request({ url: "/holiday", method: "POST", data });

// 查询当年的假期
export const getVacationList = (params) =>
  request({ url: "/holiday", method: "GET", params });
