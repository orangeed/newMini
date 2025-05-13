import request from '../utils/request';

// 获取微信公众号连接
export const getWeiXinLink = (data) => request({ url: '/wx-content', method: 'POST', data });

