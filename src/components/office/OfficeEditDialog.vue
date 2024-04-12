<template>
  <el-dialog
    v-dialog-drag
    class="office-edit"
    :title="officeConf?.document?.title ?? ''"
    :visible="visible"
    :destroy-on-close="false"
    :close-on-click-modal="false"
    width="80%"
    @close="handleClose"
  >
    <OfficeEdit :editor-config="officeConf" />
  </el-dialog>
</template>
<script>
import OfficeEdit from './OfficeEdit.vue';
import { randomLenNum } from '@/util';

export default {
  name: 'OfficeEditDialog',
  components: { OfficeEdit },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    officeConf: {
      type: Object,
      default: () => ({})
    }
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
    handleClose() {
      this.$emit('update:visible', false);
    }
  }
};
</script>
<style lang="scss" scoped>
.office-edit ::v-deep {
  .el-dialog .el-dialog__body {
    height: calc(100vh - 165px - 54px - 40px);
  }
}
</style>
