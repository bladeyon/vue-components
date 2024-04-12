<template>
  <div style="height: 100%; overflow: auto"></div>
</template>
<script>
import { randomLenNum } from '@/util';

export default {
  name: 'OfficeEdit',
  props: {
    editorConfig: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      id: '',
      editor: null
    };
  },
  watch: {
    editorConfig: {
      deep: true,
      handler() {
        this.initEditor();
      }
    }
  },
  mounted() {
    this.initEditor();
  },
  methods: {
    initEditor() {
      // 初始化时清空 创建宿主元素
      this.$el.innerHTML = '';
      this.id = randomLenNum();
      const el = document.createElement('div');
      el.setAttribute('id', this.id);
      this.$el.appendChild(el);
      this.$nextTick(() => {
        this.editor = new DocsAPI.DocEditor(this.id, this.editorConfig);
      });
    }
  }
};
</script>
