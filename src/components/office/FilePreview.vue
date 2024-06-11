<template>
  <div style="height: 100%">
    <div v-if="!src" style="text-align: center">正在加载，请稍等...</div>
    <template v-else>
      <VueOfficeDocx
        v-if="suffix.doc.includes(ext)"
        :src="src"
        style="height: 100%"
        @rendered="rendered"
      />
      <VueOfficeExcel
        v-else-if="suffix.excel.includes(ext)"
        :src="src"
        style="height: 100%"
        @rendered="rendered"
      />
      <VueOfficePdf
        v-else-if="suffix.pdf.includes(ext)"
        :src="src"
        style="height: 100%"
        @rendered="rendered"
      />
      <el-image
        v-else
        style="width: 100%; height: 100%"
        :src="src"
        fit="contain"
        lazy
      >
      </el-image>
    </template>
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
  components: {
    VueOfficeDocx,
    VueOfficeExcel,
    VueOfficePdf
  },
  props: {
    fileUrl: Object,
    fileType: String
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
      if (!this.fileType && typeof this.fileUrl === 'string') {
        const ext = this.fileUrl?.match(/(?:\.([^.]+))?$/)?.[1] ?? null;
        return ext?.toLowerCase() ?? null;
      }
      return this.fileType;
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
    fileExtCheck(ext) {
      const exts = Object.values(this.suffix).flat(Infinity);
      return exts.includes(this.ext);
    },
    async downloadFile() {
      // 验证支持的文件格式 没有后缀的不需要验证
      if (this.ext && !this.fileExtCheck(this.ext)) {
        this.$message.error('不支持的文件格式');
        this.reset();
        return;
      }

      let fileBlob = null;
      if (Object.prototype.toString.call(this.fileUrl) === '[object Blob]') {
        fileBlob = this.fileUrl;
      } else {
        const r = await request({
          url: this.fileUrl,
          method: 'get',
          responseType: 'blob'
        });

        fileBlob = new Blob([r.data], {
          type: 'application/force-download; charset=UTF-8'
        });
      }

      if (this.ext && !this.suffix.image.includes(this.ext)) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(fileBlob);
        reader.onload = (loadEvent) => {
          const arrayBuffer = loadEvent.target.result;
          this.src = arrayBuffer;
        };
      } else {
        this.src = URL.createObjectURL(fileBlob);
      }
    },
    revokeURL() {
      if (typeof this.src === 'string' && this.src.includes('blob:')) {
        URL.revokeObjectURL(this.src);
      }
    }
  }
};
</script>
<style scoped></style>
