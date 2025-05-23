/**
 * 获取缓存
 * @param key
 * @param value
 * @returns
 */
export const getStorage = (key) => {
    if (!key) Promise.reject("没有key！");
    if (!localStorage.getItem(key)) return null;
    const value = localStorage.getItem(key);
    if (value.includes("{")) return JSON.parse(value);
    return value;
  };
  
  /**
   * 保存缓存
   * @param key
   * @param value
   * @returns
   */
  export const setStorage = (key, value) => {
    if (!key) Promise.reject("没有key！");
    if (!value) Promise.reject("没有value！");
    localStorage.setItem(key, value);
  };
  
  /**
   * 清除指定的缓存
   * @param key
   * @returns
   */
  export const removeStorage = (key) => {
    if (!key) Promise.reject("没有key！");
    localStorage.removeItem(key);
  };
  
  /**
   * 清除所有缓存
   * @returns
   */
  export const clearStorage = () => {
    localStorage.clear();
  };
  
  /**
   * sessionStorage缓存缓存
   * @param key
   * @param value
   * @returns
   */
  export const getSessStorage = (key) => {
    if (!key) Promise.reject("没有key！");
    if (!sessionStorage.getItem(key)) return null;
    const value = sessionStorage.getItem(key);
    if (value.includes("{")) return JSON.parse(value);
    return value;
  };
  
  /**
   * sessionStorage缓存
   * @param key
   * @param value
   */
  export const setSessStorage = (key, value) => {
    if (!key) Promise.reject("没有key！");
    if (!value) Promise.reject("没有value！");
    sessionStorage.setItem(key, value);
  };
  
  /**
   * 清除指定的sessionStorage缓存
   * @param key
   * @returns
   */
  export const removeSessStorage = (key) => {
    if (!key) Promise.reject("没有key！");
    sessionStorage.removeItem(key);
  };
  
  /**
   * 清除所有sessionStorage缓存
   * @returns
   */
  export const clearSessStorage = () => {
    sessionStorage.clear();
  };
  