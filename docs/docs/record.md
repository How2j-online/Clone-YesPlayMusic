## 提取图片主题色

### 一、通过Canvas绘制图片

```typescript
const image = new Image();
image.src = 'https://www.baidu.com/img/bd_logo1.png';
image.onload = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
};
```

### 二、获取图片像素点

```typescript
const imageData = ctx.getImageData(0, 0, image.width, image.height);
const data = imageData.data;
```

### 三、计算图片主题色

```typescript
const colorArray = [];
for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const a = data[i + 3];
  if (a === 0) {
    continue;
  }
  const color = `rgba(${r},${g},${b},${a})`;
  if (color in colorArray) {
    colorArray[color] += 1;
  } else {
    colorArray[color] = 1;
  }
}
```
