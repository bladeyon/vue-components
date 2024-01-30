<template>
  <el-dialog
    class="file-preview"
    v-dialog-drag
    :visible="visible"
    :title="title"
    :width="width ?? '60%'"
    :close-on-click-modal="false"
    @close="reset"
  >
    <el-image
      style="width: 100%; height: calc(100% - 32px)"
      :key="key"
      :src="src"
      fit="contain"
      lazy
    >
    </el-image>
    <div style="text-align: center">{{ name ?? '' }}</div>
    <template #footer>
      <el-button type="primary" @click="play">重新播放</el-button>
      <el-button type="default" @click="reset">关 闭</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { randomLenNum } from '@/util';

export default {
  name: 'ImagesSlideDialog',
  props: {
    title: { type: String, default: '图片预览' },
    urls: { type: Array, default: () => ({ name: '', url: '' }) },
    duration: { type: Number, default: 1000 },
    width: String,
    visible: Boolean
  },
  data() {
    return {
      key: randomLenNum(),
      src: '',
      name: ''
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.key = randomLenNum();
      }
    },
    urls() {
      this.urls?.length && this.play();
    }
  },
  mounted() {
    this.play();
  },
  methods: {
    reset() {
      this.$emit('update:visible', false);
    },
    play() {
      for (let index = 0; index < this.urls.length; index++) {
        const { name, url } = this.urls[index];

        let timer = setTimeout(() => {
          this.name = name;
          this.src = url;
          clearTimeout(timer);
          timer = null;
        }, index * this.duration);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.file-preview ::v-deep {
  .el-dialog .el-dialog__body {
    height: calc(100vh - 165px - 54px - 40px);
  }
}
</style>
