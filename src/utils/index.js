/**
 * 获取静态资源
 */
export const getAssetsFile = (url) => {
  return new URL(`/src/assets/${url}`, import.meta.url).href;
};

/**
 * 将文本生成图片
 * @param {*} text
 * @returns
 */
export const getImageByText = (text) => {
  const canvas = document.getElementById("imgCanvas");
  const ctx = canvas.getContext("2d");

  // // 设置阴影效果
  // ctx.shadowColor = "rgba(0, 0, 0, 0.1)";  // 阴影颜色
  // ctx.shadowOffsetX = 2; // 阴影水平偏移
  // ctx.shadowOffsetY = 2; // 阴影垂直偏移
  // ctx.shadowBlur = 2; // 阴影模糊度

  // 设置圆角背景
  const cornerRadius = 20; // 圆角半径
  ctx.fillStyle = "#FDFDFD"; // 背景颜色
  ctx.beginPath();

  // 从左上角开始绘制
  ctx.moveTo(cornerRadius, 0);
  // 绘制上边
  ctx.lineTo(canvas.width - cornerRadius, 0);
  // 右上角圆弧
  ctx.arcTo(canvas.width, 0, canvas.width, canvas.height, cornerRadius);
  // 绘制右边
  ctx.lineTo(canvas.width, canvas.height - cornerRadius);
  // 右下角圆弧
  ctx.arcTo(canvas.width, canvas.height, 0, canvas.height, cornerRadius);
  // 绘制下边
  ctx.lineTo(0, canvas.height);
  // 左下角圆弧
  ctx.arcTo(0, canvas.height, 0, 0, cornerRadius);
  // 绘制左边
  ctx.lineTo(0, cornerRadius);
  // 左上角圆弧
  ctx.arcTo(0, 0, canvas.width, 0, cornerRadius);

  ctx.closePath();
  ctx.fill(); // 填充背景

  // 设置文本样式
  ctx.font = "20px Arial";
  ctx.fillStyle = "orange"; // 文字颜色
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // 计算文本的起始位置（使其居中）
  const x = canvas.width / 2;
  const y = canvas.height / 2;

  // 在canvas上绘制文本
  ctx.fillText(text, x, y); // 绘制文字

  // 转换为图片
  const imgData = canvas.toDataURL("image/png");
  return imgData;
};
