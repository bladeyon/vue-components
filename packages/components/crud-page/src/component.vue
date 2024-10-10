<template>
  <div class="crud-page">
    <QueryForm
      :query="qFormOpts"
      @search="handleSearch"
      @add="handleAdd"
    />
    <DataTable
      :table-opts="dTableOpts"
      @changePage="handlePageChange"
    />
    <FormDialog
      ref="formDialog"
      :dialog-props="formOpts.dialogProps"
      :form-props="formOpts.formProps"
      :primary-key="primaryKey"
      :form-items="formItems"
      :form-data="formData"
      :form-rules="formOpts.formRules"
      @success="handleSuccess"
    />
  </div>
</template>

<script>
import { merge } from 'lodash';
import QueryForm from '~/components/query-form';
import DataTable from '~/components/data-table';
import FormDialog from '~/components/form-dialog';

export default {
  name: 'CRUDPage',
  components: { QueryForm, DataTable, FormDialog },
  props: {
    // 业务主键
    primaryKey: {
      type: String,
      default: 'id'
    },
    apiFn: {
      type: Object,
      required: true,
      default: () => ({
        // Promise
        getPage: (params) => {},
        post: (data) => {},
        put: (data) => {},
        deleteById: (id) => {}
      })
    },
    queryOpts: {
      type: Object,
      required: true,
      default: () => ({}) // 详情参考 QueryForm 组件
    },
    tableOpts: {
      type: Object,
      required: true,
      default: () => ({
        height: 500,
        fontSize: '12px',
        option: {
          rowNum: false,
          multiSelect: false,
          showPagination: true,
          highlightCurrentRow: false
        },
        data: [], // 数据
        cols: [{ label: '操作时间', field: 'operaTime', width: 150 }],
        total: 0,
        pages: {
          current: 1,
          size: 10
        }
      })
    },
    formOpts: {
      type: Object,
      default: () => ({
        dialogProps: {},
        formProps: {},
        formRules: {},
        formItems: []
      })
    }
  },
  data() {
    return {
      params: {},
      qFormOpts: {
        // 详情参考 QueryForm 组件
        form: [],
        btns: [
          { text: '查询', type: 'primary', event: 'search' },
          { text: '新增', type: 'success', event: 'add' }
        ]
      },
      dTableOpts: {
        // 详情参考 DataTable 组件
        height: 500,
        fontSize: '12px',
        option: {
          rowNum: false,
          showPagination: true,
          multiSelect: false,
          highlightCurrentRow: false
        },
        data: [], // 数据
        cols: [],
        total: 0,
        pages: {
          current: 1,
          size: 10
        }
      },
      formData: {},
      formItems: []
    };
  },
  computed: {},
  created() {
    this.init();
    this.getPageData();
  },
  methods: {
    init() {
      // 查询
      if (Object.keys(this.queryOpts).length) {
        Object.assign(this.qFormOpts, this.queryOpts);
      }

      merge(this.dTableOpts, this.tableOpts);
      this.dTableOpts.cols.push({
        label: '操作',
        field: 'operator-col',
        width: 180,
        fixed: 'right',
        operateBtns: [
          {
            label: '',
            icon: 'el-icon-edit',
            tips: '编辑',
            handler: this.handleEdit
          },
          {
            label: '',
            icon: 'el-icon-delete',
            tips: '删除',
            handler: this.handleDelete
          }
        ]
      });
      this.formItems =
        this.formOpts?.formItems && this.formOpts.formItems?.length
          ? this.formOpts.formItems
          : this.tableOpts.cols;
    },
    handlePageChange(page) {
      this.dTableOpts.pages = page;
      this.getPageData();
    },
    async getPageData() {
      const ret = await this.apiFn.getPage({
        ...this.params,
        ...this.dTableOpts.pages
      });
      const { data, total } = ret;
      this.dTableOpts.data = data;
      this.dTableOpts.total = total;
    },
    handleSearch(data) {
      this.params = data;
      this.getPageData();
    },
    handleAdd() {
      this.formData = { [this.primaryKey]: null };
      this.$refs.formDialog.open();
    },
    handleEdit(data) {
      this.formData = { ...data };
      this.$refs.formDialog.open();
    },
    handleDelete(rowData) {
      this.$confirm('是否确认删除?', '提示', {
        type: 'warning'
      })
        .then(async () => {
          const res = await this.apiFn.deleteById(rowData[this.primaryKey]);
          const { msg } = res;
          if (res) {
            this.$message({ message: '删除成功', type: 'success' });
            this.getPageData();
          } else {
            this.$message({ message: msg, type: 'error' });
          }
        })
        .catch(() => {
          this.$message({ message: '已取消', type: 'info' });
        });
    },
    async handleSuccess(formData) {
      let res;
      if (!formData[this.primaryKey]) {
        res = await this.apiFn.post(formData);
      } else {
        res = await this.apiFn.put(formData);
      }

      const { data, msg } = res;
      if (data) {
        this.$message({ message: '保存成功', type: 'success' });
        this.dTableOpts.pages = { ...this.dTableOpts.pages, current: 1 };
        this.$refs.formDialog.close();
        this.getPageData();
      } else {
        this.$message({ message: msg, type: 'error' });
      }
    }
  }
};
</script>

<style lang="scss">
.crud-page {
  .data-table {
    .el-table__row {
      button {
        // [class^='el-icon-'] {
        //   color: $color-primary;
        // }

        // .el-icon-delete {
        //   color: $color-danger;
        // }
      }
    }
  }
}
</style>
