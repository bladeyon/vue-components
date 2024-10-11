# ImageSlideDialog

图片轮播弹窗

## 属性

| 属性     | 说明     | 类型   | 默认值                      | 可选值 |
| -------- | -------- | ------ | --------------------------- | ------ |
| title    | 弹窗标题 | string | -                           | -      |
| urls     | 图片地址 | array  | \[\{ name: '', url: '' \}\] | -      |
| duration | 持续时间 | number | 3000                        | -      |
| width    | 弹窗宽度 | string | '60%'                       | -      |

## 示例

```vue
<template>
  <ImageSlideDialog
    ref="image-slide-dialog"
    :title="title"
    :urls="urls"
    :duration="duration"
    :width="width"
  />
</template>

<script>
import { ImageSlideDialog } from 'vue-components';
export default {
  name: 'ImageSlideDialogUI',
  components: { ImageSlideDialog },
  data() {
    return {
      title: '图片轮播',
      urls: [
        { name: '图片1', url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg' },
        { name: '图片2', url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941172jpeg.jpeg' },
      ],
      duration: 3000,
      width: '60%'
    }
  },
  mounted() {
    this.$refs['image-slide-dialog'].show();
  }
}
```
