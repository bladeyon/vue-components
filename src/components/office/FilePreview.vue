<template>
  <div style="height: 100%">
    <VueOfficeDocx
      v-if="suffix.doc.includes(ext)"
      :src="src"
      style="height: 100%"
      @rendered="rendered"
    />
    <VueOfficeExcel
      v-if="suffix.excel.includes(ext)"
      :src="src"
      style="height: 100%"
      @rendered="rendered"
    />
    <VueOfficePdf
      v-if="suffix.pdf.includes(ext)"
      :src="src"
      style="height: 100%"
      @rendered="rendered"
    />
    <el-image
      v-if="suffix.image.includes(ext)"
      style="width: 100%; height: 100%"
      :src="src"
      fit="contain"
      lazy
    >
    </el-image>
  </div>
</template>
<script>
import request from '@/router/axios';
//引入VueOffice组件
import VueOfficeDocx from '@vue-office/docx';
import VueOfficeExcel from '@vue-office/excel';
import VueOfficePdf from '@vue-office/pdf';
//引入相关样式
import '@vue-office/docx/lib/index.css';
import '@vue-office/excel/lib/index.css';

export default {
  name: 'FilePreview',
  props: {
    fileUrl: String
  },
  components: {
    VueOfficeDocx,
    VueOfficeExcel,
    VueOfficePdf
  },
  data() {
    return {
      src: null,
      suffix: {
        doc: ['doc', 'docx'],
        excel: ['xls', 'xlsx'],
        pdf: ['pdf'],
        image: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp']
      }
    };
  },
  computed: {
    ext() {
      return this.fileUrl.split('.').pop().toLowerCase();
    },
    height() {
      return this.getMainHeight();
    }
  },
  mounted() {
    this.downloadFile();
  },
  methods: {
    rendered() {
      // console.log('渲染完成');
    },
    reset() {
      this.$emit('update:visible', false);
      this.src = null;
    },
    fileExtCheck(ext) {
      const exts = Object.values(this.suffix).flat(Infinity);
      return exts.includes(this.ext);
    },
    async downloadFile() {
      // 验证支持的文件格式
      if (!this.fileExtCheck(this.ext)) {
        this.$message.error('不支持的文件格式');
        this.reset();
        return;
      }
      const r = await request({
        url: this.fileUrl,
        method: 'get',
        responseType: 'blob'
      });
      const blob = new Blob([r.data], {
        type: 'octet-stream',
        responseType: 'arraybuffer'
      });

      if (this.suffix.image.includes(this.ext)) {
        this.src = URL.createObjectURL(blob);
        setTimeout(() => {
          URL.revokeObjectURL(this.src);
        });
      } else {
        this.src = blob;
      }
    }
  }
};
</script>
