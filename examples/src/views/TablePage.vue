<template>
  <div>
    <Greeting />
    <QueryForm
      :query="queryCfg"
      @search="handleSearch"
      @add="handleAdd"
    />
    <DataTable
      :table-height="tableHeight"
      :table-opts="tableOpts"
      @changePage="handlePageChange"
    />

    <FormDialog
      ref="form-dialog"
      :form-items="tableOpts.cols"
      :form-data="formData"
      @success="handleSuccess"
    />

    <ScrollTable
      style="width: 50%; height: 300px"
      :data="scrollTab.data"
      :col-options="scrollTab.colOptions"
      stripe-color="#cccccc7f"
    />
  </div>
</template>

<script>
const tableAllData = [
  {
    id: '18dd17c283f17b27c8d6acfe6a6ba703',
    department: '地测部22',
    title: '图件更新22',
    startDate: '2023-05-01',
    endDate: '2023-07-07',
    progress: 22,
    handleDept: 'awefga22'
  },
  {
    id: '18dd17c283f17b27c8d6acfe6a6ba703',
    department: '地测部22',
    title: '图件更新22',
    startDate: '2023-05-01',
    endDate: '2023-07-07',
    progress: 22,
    handleDept: 'awefga22'
  },
  {
    id: '3aadfd656ca0e0c770c03854275fa24c',
    department: '地测部',
    title: '防治水6月重点工作',
    startDate: '2023-06-01',
    endDate: '2023-06-30',
    progress: 100,
    handleDept: 'awfa'
  },
  {
    id: '5cab0b4e57cfb69ac806c2b314eeda69',
    department: '地测部',
    title: '台账编制',
    startDate: '2023-06-01',
    endDate: '2023-06-28',
    progress: 100,
    handleDept: '3452'
  },
  {
    id: '64b4bb75e36b631150d957f794cdd241',
    department: '地测部',
    title: '感知数据上传',
    startDate: '2023-06-01',
    endDate: '2023-06-30',
    progress: 100,
    handleDept: '34567'
  },
  {
    id: 'fbec80371e32c2d9d6e72c6ad8f32fdc',
    department: '信息部',
    title: '信息管理系统对接',
    startDate: '2023-06-16',
    endDate: '2023-06-30',
    progress: 91,
    handleDept: '2345'
  },
  {
    id: 'd8fc5c4991894f91b7adabb51c6ce89e',
    department: '运维部',
    title: '监测系统数据对接网络维护',
    startDate: '2023-06-15',
    endDate: '2023-06-23',
    progress: 100,
    handleDept: null
  },
  {
    id: '3e9884e9e6e3d81482239920f0f783a9',
    department: '地测部',
    title: '信息报告图件编制',
    startDate: '2023-05-31',
    endDate: '2023-06-27',
    progress: 97,
    handleDept: '123424'
  },
  {
    id: 'f9026fc10606266612abf817551a5b51',
    department: '地测部',
    title: '季度工作报告',
    startDate: '2023-06-01',
    endDate: '2023-06-30',
    progress: 100,
    handleDept: 'ertggs'
  },
  {
    id: 'a72901ecff46852d85f2059d4c2103b7',
    department: '部门',
    title: '这个是标题',
    startDate: '1983-05-02',
    endDate: '2003-07-28',
    progress: 6,
    handleDept: '实施单位'
  },
  {
    id: '2f23bc3f83d37a92895f289ff4eb0a6a',
    department: '信息部',
    title: '灾害数据推送系统维护',
    startDate: '2023-05-11',
    endDate: '2023-06-30',
    progress: 85,
    handleDept: '2345'
  }
];
export default {
  data() {
    return {
      queryCfg: {
        form: [
          {
            label: '部门',
            field: 'department',
            component: 'select',
            componentProps: {
              options: [
                { label: '信息部', value: '信息部' },
                { label: '地测部', value: '地测部' }
              ]
              // multiple: true
            }
          },
          {
            label: '名称',
            field: 'title',
            default: '信息'
          }
        ],
        btns: [
          { text: '查询', type: 'primary', event: 'search' },
          { text: '新增', type: 'success', event: 'add' }
        ]
      },
      tableHeight: 300,
      tableOpts: {
        // fontSize: '12px',
        option: {
          rowNum: false,
          multiSelect: false,
          highlightCurrentRow: false
        },
        data: [], // 数据
        cols: [
          { label: '部门', field: 'department' },
          { label: '名称', field: 'title' },
          { label: '开始时间', field: 'startDate', component: 'datepicker' },
          {
            label: '进度(%)',
            field: 'progress',
            componentProps: { type: 'number' }
          },
          { label: '结束时间', field: 'endDate', component: 'datepicker' }
        ],
        total: 0,
        pages: {
          current: 1,
          size: 10
        }
      },
      formData: null,
      scrollTab: {
        data: tableAllData.slice(0, 6),
        colOptions: [
          { label: '部门', field: 'department' },
          { label: '名称', field: 'title' },
          { label: '开始时间', field: 'startDate' },
          {
            label: '进度(%)',
            field: 'progress',
            componentProps: { type: 'number' }
          },
          { label: '结束时间', field: 'endDate' }
        ]
      }
    };
  },
  watch: {
    // 'tableOpts.data': {
    //   handler() {
    //     this.tableOpts.total = this.tableOpts.data.length;
    //   }
    // },
    'tableOpts.pages': {
      deep: true,
      handler(pages) {
        this.init(pages);
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    init({ current = 1, size = this.tableOpts.pages.size } = {}, tableData) {
      if (!tableData) {
        tableData = tableAllData;
      }
      this.tableOpts.total = tableData.length;
      this.tableOpts.data = tableData.slice(
        (current - 1) * size,
        current * size
      );
    },
    handleSearch(data) {
      console.log(data);
      const filterData = tableAllData.filter((item) =>
        item.department.includes(data.department)
      );
      this.init({}, filterData);
    },
    handleAdd() {
      this.formData = {};
      this.$refs['form-dialog'].open();
    },
    handleSuccess(data) {
      tableAllData.push(data);
      this.$refs['form-dialog'].close();
      this.init();
    },
    handlePageChange(pages) {
      this.tableOpts.pages = pages;
    }
  }
};
</script>

<style lang="sass" scoped></style>
