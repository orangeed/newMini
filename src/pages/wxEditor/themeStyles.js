// 主题样式配置
export const themeStyles = {
  default: {
    h1: 'font-size: 24px; font-weight: bold; color: orange;',
    h2: 'font-size: 20px; font-weight: bold;color:orange',
    h3: 'font-size: 18px; font-weight: bold;',
    h4: 'font-size: 16px; font-weight: bold;',
    p: 'font-size: 16px; line-height: 1.5;',
    ul: 'font-size: 16px; line-height: 1.5; padding-left: 20px;',
    ol: 'font-size: 16px; line-height: 1.5; padding-left: 20px;',
    li: 'margin-bottom: 5px;',
    code: 'background-color: #f2f2f2; padding: 2px 4px; border-radius: 4px; font-family: Consolas, Monaco, monospace;',
    pre: 'background-color: #f2f2f2; padding: 10px; border-radius: 4px; overflow-x: auto; margin: 10px 0;',
    blockquote: 'border-left: 4px solid #ccc; margin-left: 0; padding-left: 10px; color: #666;',
    a: 'color: #1e88e5; text-decoration: none;',
    img: 'max-width: 100%; height: auto; display: block; margin: 10px auto;',
    table: 'border-collapse: collapse; width: 100%; margin: 10px 0;',
    th: 'border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;',
    td: 'border: 1px solid #ddd; padding: 8px; text-align: left;',
    hr: 'border: none; height: 1px; background-color: #ddd; margin: 20px 0;',
    strong: 'font-weight: bold;',
    em: 'font-style: italic;',
  },
  dark: {
    h1: 'font-size: 24px; font-weight: bold; color: #42b983;',
    h2: 'font-size: 20px; font-weight: bold; color: #42b983;',
    h3: 'font-size: 18px; font-weight: bold; color: #42b983;',
    h4: 'font-size: 16px; font-weight: bold; color: #42b983;',
    p: 'font-size: 16px; line-height: 1.5; color: #e0e0e0;',
    ul: 'font-size: 16px; line-height: 1.5; padding-left: 20px; color: #e0e0e0;',
    ol: 'font-size: 16px; line-height: 1.5; padding-left: 20px; color: #e0e0e0;',
    li: 'margin-bottom: 5px; color: #e0e0e0;',
    code: 'background-color: #2d2d2d; padding: 2px 4px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #e0e0e0;',
    pre: 'background-color: #2d2d2d; padding: 10px; border-radius: 4px; overflow-x: auto; margin: 10px 0; color: #e0e0e0;',
    blockquote: 'border-left: 4px solid #555; margin-left: 0; padding-left: 10px; color: #aaa;',
    a: 'color: #42b983; text-decoration: none;',
    img: 'max-width: 100%; height: auto; display: block; margin: 10px auto;',
    table: 'border-collapse: collapse; width: 100%; margin: 10px 0;',
    th: 'border: 1px solid #555; padding: 8px; text-align: left; background-color: #2d2d2d; color: #e0e0e0;',
    td: 'border: 1px solid #555; padding: 8px; text-align: left; color: #e0e0e0;',
    hr: 'border: none; height: 1px; background-color: #555; margin: 20px 0;',
    strong: 'font-weight: bold; color: #42b983;',
    em: 'font-style: italic; color: #e0e0e0;',
  },
  elegant: {
    h1: 'font-size: 26px; font-weight: bold; color: #333; font-family: "Georgia", serif; padding-bottom: 10px;',
    h2: 'font-size: 22px; font-weight: bold; color: #333; font-family: "Georgia", serif; padding-bottom: 5px;',
    h3: 'font-size: 18px; font-weight: bold; color: #333; font-family: "Georgia", serif;',
    h4: 'font-size: 16px; font-weight: bold; color: #333; font-family: "Georgia", serif;',
    p: 'font-size: 16px; line-height: 1.6; color: #333; font-family: "Georgia", serif;',
    ul: 'font-size: 16px; line-height: 1.6; padding-left: 20px; color: #333; font-family: "Georgia", serif;',
    ol: 'font-size: 16px; line-height: 1.6; padding-left: 20px; color: #333; font-family: "Georgia", serif;',
    li: 'margin-bottom: 8px; color: #333;',
    code: 'background-color: #f8f8f8; padding: 2px 4px; border-radius: 3px; font-family: Consolas, Monaco, monospace; color: #333; border: 1px solid #eee;',
    pre: 'background-color: #f8f8f8; padding: 15px; border-radius: 3px; overflow-x: auto; margin: 15px 0; color: #333; border: 1px solid #eee;',
    blockquote:
      'border-left: 4px solid #ddd; margin-left: 0; padding: 10px 15px; color: #666; background-color: #f9f9f9; font-style: italic;',
    a: 'color: #1a0dab; text-decoration: none; border-bottom: 1px dotted #1a0dab;',
    img: 'max-width: 100%; height: auto; display: block; margin: 15px auto; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);',
    table: 'border-collapse: collapse; width: 100%; margin: 15px 0;',
    th: 'border: 1px solid #eee; padding: 12px; text-align: left; background-color: #f8f8f8; color: #333;',
    td: 'border: 1px solid #eee; padding: 12px; text-align: left; color: #333;',
    hr: 'border: none; height: 1px; background-color: #eee; margin: 25px 0;',
    strong: 'font-weight: bold; color: #333;',
    em: 'font-style: italic; color: #333;',
  },
};

// 辅助函数：将样式对象转换为CSS字符串
export function generateCssFromTheme(themeName, themeStyles) {
  if (!themeStyles[themeName]) {
    console.error(`主题 "${themeName}" 不存在`);
    return '';
  }

  const theme = themeStyles[themeName];
  let css = '';

  // 为每个元素生成CSS
  for (const [element, style] of Object.entries(theme)) {
    css += `${element} { ${style} }\n`;
  }

  return css;
}

// 辅助函数：动态应用样式到元素
export function applyStylesToElement(element, themeName, themeStyles) {
  if (!element || !themeStyles[themeName]) {
    return false;
  }

  const theme = themeStyles[themeName];

  // 清除现有样式
  element.removeAttribute('style');

  // 为每个子元素应用样式
  for (const [selector, style] of Object.entries(theme)) {
    const elements = element.querySelectorAll(selector);
    elements.forEach((el) => {
      el.setAttribute('style', style);
    });
  }

  return true;
}

export const themeList = [
  { label: '默认', value: 'default' },
  { label: '黑暗', value: 'dark' },
  { label: '优雅', value: 'elegant' },
];
