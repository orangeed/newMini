import request from '../utils/request';

// 获取AI工具链接
export const getAITools = (params = { category: '1' }) => request({ url: '/aiTools', method: 'GET', params });

// 新增AI工具
export const addAITools = (data) => request({ url: '/aiTools', method: 'POST', data });
