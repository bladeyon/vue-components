<template>
  <el-dialog
    v-dialog-drag
    class="file-preview"
    :visible="visible"
    :title="title"
    :width="width ?? '60%'"
    :close-on-click-modal="false"
    @close="reset"
  >
    <el-image
      :key="key"
      style="width: 100%; height: calc(100% - 32px)"
      :src="src"
      fit="contain"
      lazy
    />
    <div style="text-align: center">
      {{ name ?? '' }}
    </div>
    <template #footer>
      <el-button
        type="primary"
        @click="play"
      >
        重新播放
      </el-button>
      <el-button
        type="default"
        @click="reset"
      >
        关 闭
      </el-button>
    </template>
  </el-dialog>
</template>
<script>
import { randomLenNum } from '@/util';

export default {
  name: 'ImagesSlideDialog',
  props: {
    title: { type: String, default: '图片预览' },
    urls: { type: Array, default: () => [{ name: '', url: '' }] },
    duration: { type: Number, default: 3000 },
    width: { type: String, default: '' }
  },
  data() {
    return {
      key: randomLenNum(),
      visible: false,
      src: '',
      name: ''
    };
  },
  watch: {
    urls: {
      deep: true,
      handler() {
        this.urls?.length && this.play();
      }
    }
  },
  mounted() {
    this.play();
  },
  methods: {
    show() {
      this.visible = true;
    },
    reset() {
      this.visible = false;
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
    height: calc(100% - 40px);
  }
}
</style>
