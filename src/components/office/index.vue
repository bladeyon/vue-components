<template>
  <div style="height:100%">
    <div id="placeholder"></div>
  </div>
</template>

<script>
import store from "@/store";
import { baseUrl, previewFileUrl } from "@/config/env";

export default {
  props: {
    fileValue:Object,
  },
  data() {
    return {
      userInfo: null,
    };
  },
  watch: {},
  mounted() {
    this.previewFile();
  },
  methods: {
    previewFile() {
      const row = this.fileValue;
      const userInfo = store.getters.userInfo;
      const fileType = row.name.split('.')[1];
      let docType = '';
      console.log('row==',row);
      console.log('fileType==',typeof fileType)
      if(fileType == 'doc' || fileType =='docx' || fileType =='pdf' || fileType =='txt' ||  fileType =='jpg'){
        docType = 'word';
      }else if(fileType == 'xls'|| fileType =='xlsx' || fileType =='csv'){
        docType = 'cell'
      }else if(fileType == 'ppt'|| fileType =='pptx' || fileType =='pptm'){
        docType = 'slide'
      }
      this.docDialogVisible = true;
      const Base64 = require("js-base64").Base64;
      //const url = `${baseUrl}/temp/docinfo/download/${row.docId}?fullfilename=${row.docId}${row.name}`;
      const url = `${baseUrl}/temp/docinfo/download/${row.docId}`;
      const saveUrl = `${baseUrl}/temp/docinfo/saveDoc`;
      const randomValue = new Date().valueOf();
      const config = {
        //token: "wOr3Qr79NRnnNHdO0F3D8Lg1FC87t6",
        document: {
          fileType: fileType,
          key: row.docId + "@" + randomValue,
          title: row.name,
          url: url,
        },
        documentType: docType,
        editorConfig: {
          callbackUrl: saveUrl,
          user: {
            // id: this.userInfo.userId,
            id: userInfo.username,
            name: userInfo.username,
          },
          // 设置语言
          lang: "zh-CN",
        },
        height: "100%",
        width: "100%",
      };
      console.log(config)
      //const docEditor = new DocsAPI.DocEditor("placeholder", config);
      setTimeout(() => {
        const docEditor = new DocsAPI.DocEditor("placeholder", config);
      }, 1000);
      // window.open(
      //   `${previewFileUrl}/onlinePreview?url=${encodeURIComponent(
      //     Base64.encode(url)
      //   )}`
      // );
    },
  },
};
</script>

<style scoped></style>
