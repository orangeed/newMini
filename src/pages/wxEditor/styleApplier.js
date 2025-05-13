/*
 * @Author: chenjie
 * @Date: 2025-04-22 11:35:10
 * @LastEditors: chenjie chenjie@i2value.com
 * @LastEditTime: 2025-04-22 11:41:40
 * @FilePath: \some-project\src\views\wxEditor\styleApplier.js
 * @Description: 样式应用工具，用于动态应用主题样式到DOM元素
 */

// 将样式对象应用到DOM元素
export function applyStyles(element, styles) {
  if (!element || !styles) return false;

  // 遍历样式对象中的每个选择器
  Object.entries(styles).forEach(([selector, styleString]) => {
    // 查找元素中匹配选择器的所有元素
    const targetElements = element.querySelectorAll(selector);

    // 应用样式到每个匹配的元素
    targetElements.forEach((el) => {
      // 解析样式字符串为对象
      const styleObj = parseStyleString(styleString);

      // 应用每个样式属性
      Object.entries(styleObj).forEach(([prop, value]) => {
        el.style[prop] = value;
      });
    });
  });

  return true;
}

// 解析CSS样式字符串为对象
function parseStyleString(styleString) {
  const result = {};

  // 分割样式字符串为单独的属性
  const properties = styleString.split(';').filter((prop) => prop.trim());

  // 解析每个属性
  properties.forEach((prop) => {
    const [name, value] = prop.split(':').map((part) => part.trim());
    if (name && value) {
      // 转换CSS属性名为驼峰式
      const camelCaseName = name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelCaseName] = value;
    }
  });

  return result;
}

// 创建样式表
export function createStyleSheet(themeName, styles) {
  // 创建样式元素
  const styleElement = document.createElement('style');
  styleElement.id = `theme-${themeName}`;

  // 生成CSS内容
  let cssContent = '';
  Object.entries(styles).forEach(([selector, styleString]) => {
    cssContent += `.${themeName}-theme ${selector} { ${styleString} }\n`;
  });

  // 设置样式内容
  styleElement.textContent = cssContent;

  // 添加到文档头部
  document.head.appendChild(styleElement);

  return styleElement;
}

// 移除样式表
export function removeStyleSheet(themeName) {
  const styleElement = document.getElementById(`theme-${themeName}`);
  if (styleElement) {
    styleElement.remove();
    return true;
  }
  return false;
}
