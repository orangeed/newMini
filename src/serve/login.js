import request from '../utils/request';

// 获取AI工具链接
export const getMenuList = () => request({ url: '/login/menu', method: 'GET' });
