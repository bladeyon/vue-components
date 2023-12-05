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
    <FilePreview :key="key" :fileUrl="fileUrl" />
  </el-dialog>
</template>
<script>
import FilePreview from '@/components/office/FilePreview.vue';
import { randomLenNum } from '@/util';

export default {
  name: 'FilePreviewDialog',
  components: {
    FilePreview
  },
  props: {
    title: {
      type: String,
      default: '文件预览'
    },
    width: String,
    fileUrl: String,
    visible: Boolean
  },
  data() {
    return {
      key: randomLenNum()
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.key = randomLenNum();
      }
    }
  },
  methods: {
    reset() {
      this.$emit('update:visible', false);
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
