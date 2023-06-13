<template>
  <div style="height: 100%">
    <div id="placeholder"></div>
  </div>
</template>

<script>
import {getOnlyOfficeConfig} from "@/api/doccataloginfo";
import store from "@/store";
import { baseUrl, previewFileUrl } from "@/config/env";

export default {
  props: {
    fileValue: Object,
    token: String,
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
      getOnlyOfficeConfig(row.docId).then(res => {
        console.log("res==", res);
        const config = res.data.data;
         setTimeout(() => {
            console.log(config)
        const docEditor = new DocsAPI.DocEditor("placeholder", config);
      }, 1000);
      })
    //   const userInfo = store.getters.userInfo;
    //   const fileType = row.name.split(".")[1];
    //   let docType = "";
    //   console.log("row==", row);
    //   console.log("fileType==", typeof fileType);
    //   if (
    //     fileType == "doc" ||
    //     fileType == "docx" ||
    //     fileType == "pdf" ||
    //     fileType == "txt" ||
    //     fileType == "jpg"
    //   ) {
    //     docType = "word";
    //   } else if (fileType == "xls" || fileType == "xlsx" || fileType == "csv") {
    //     docType = "cell";
    //   } else if (
    //     fileType == "ppt" ||
    //     fileType == "pptx" ||
    //     fileType == "pptm"
    //   ) {
    //     docType = "slide";
    //   }
    //   this.docDialogVisible = true;
    //   const Base64 = require("js-base64").Base64;
    //   //const url = `${baseUrl}/temp/docinfo/download/${row.docId}?fullfilename=${row.docId}${row.name}`;
    //   const url = `${baseUrl}/temp/docinfo/download/${row.docId}`;
    //   const saveUrl = `${baseUrl}/temp/docinfo/saveDoc`;
    //   const randomValue = new Date().valueOf();
    //   const config = {
    //     token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImZpbGV0eXBlIjoiZG9jeCIsIm91dHB1dHR5cGUiOiJkb2N4IiwidGl0bGUiOiLnn7PmlodBSeW5s-WPsOaxh-aAuzA3LeWJr-acrC5kb2N4Iiwia2V5IjoiNzUzZTU4YzRmYTQ5NGJkMjk2MjFhOTdhZGEwMDgyNTZAbnZPSjFDIn19.-j3fKlPZ00_F4KfkFjwE7nGv9H-796EPMGKyPuPZDqQ',
    //     document: {
    //       fileType: fileType,
    //       key: row.docId + "@" + randomValue,  //randomValue 是时间戳
    //       title: row.name,
    //       url: url,
    //       permissions: {
    //         download: true,
    //         // 启用编辑
    //         edit: true,
    //         // 启用导出
    //         print: true,
    //         // 启用预览
    //         review: true,
    //       },
    //     },
    //     documentType: docType,
    //     editorConfig: {
    //       callbackUrl: saveUrl,
    //       user: {
    //         // id: this.userInfo.userId,
    //         id: userInfo.username,
    //         name: userInfo.username,
    //       },
    //       // 设置语言
    //       lang: "zh-CN",
    //     },
    //     height: "100%",
    //     width: "100%",
    //   };
    //   console.log(config);
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
