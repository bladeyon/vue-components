<template>
  <el-dialog
    class="file-manage"
    v-dialog-drag
    :visible="visible"
    :title="title"
    :width="width ?? '60%'"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <DataTable :tableHeight="tableHeight" :tableOpts="tableCfg" />

    <FilePreview :visible.sync="filePreviewVisible" :fileUrl="fileUrl" />
  </el-dialog>
</template>
<script>
import DataTable from '@/components/common/DataTable.vue';
import FilePreview from '@/components/office/FilePreview.vue';
import { downloadFile } from '@/api/commonApi';
import fileSizeConvert from '@/util/fileSizeConvert';

export default {
  name: 'FileManageDialog',
  components: {
    DataTable,
    FilePreview
  },
  props: {
    visible: Boolean,
    title: {
      type: String,
      default: '文件列表'
    },
    width: String,
    option: {
      type: Object,
      default: () => ({
        parentId: null,
        query: () => {},
        del: () => {}
      })
    }
  },
  data() {
    return {
      filePreviewVisible: false,
      fileUrl: '',
      tableCfg: {
        option: {
          rowNum: true,
          multiSelect: false
        },
        data: [], // 数据
        cols: [
          {
            label: '文件名称',
            field: 'fileName',
            minWidth: 120
          },
          {
            isShow: false,
            label: '文件路径',
            field: 'filePath',
            minWidth: 120
          },
          {
            label: '文件类型',
            field: 'fileType',
            width: 120
          },
          {
            label: '文件大小',
            field: 'fileSize',
            width: 120,
            formatter(value) {
              return fileSizeConvert(value);
            }
          },
          {
            label: '上传时间',
            field: 'dateTime',
            width: 160
          },
          {
            label: '操作',
            field: 'operator',
            width: 140,
            OperateBtn: [
              {
                label: '',
                tips: '下载',
                icon: 'el-icon-download',
                // premCheck: (row) => {
                //   return !!row.filePath;
                // },
                handler: this.downloadFile
              },
              {
                label: '',
                tips: '预览',
                icon: 'el-icon-reading',
                // premCheck: (row) => {
                //   return !!row.filePath;
                // },
                handler: this.filePreview
              },
              {
                label: '',
                tips: '删除',
                icon: 'el-icon-delete',
                handler: this.removeFile
              }
            ]
          }
        ],
        total: 0,
        pages: {
          current: 1,
          size: 10
        }
      }
    };
  },
  watch: {
    'option.parentId': {
      handler(id) {
        id && this.getFileList();
      }
    }
  },
  computed: {
    tableHeight() {
      return this.getMainHeight();
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false);
    },
    downloadFile(row) {
      downloadFile('', { url: encodeURIComponent(row.filePath) }, row.fileName);
    },
    filePreview(row) {
      this.filePreviewVisible = true;
      this.fileUrl = `/temp/file/download?url=${encodeURI(row.filePath)}`;
    },
    async getFileList() {
      const res = await this.option.query(this.option.parentId);
      const records = res.data?.data;
      this.tableCfg.data = records.fileList;
    },
    async removeFile(row) {
      const { fileId } = row;
      const res = await this.option.del(fileId);
      if (!!res.data?.data) {
        this.$message.success('删除成功');
        this.getFileList();
      } else {
        this.$message.error(res.data?.msg);
      }
    }
  }
};
</script>
