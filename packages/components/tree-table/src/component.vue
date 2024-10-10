<template>
  <el-table
    :key="tableKey"
    :data="tableData"
    style="width: 100%"
    :max-height="tableConfig.height"
    :row-key="tableConfig.primaryKey"
    stripe
    fit
    highlight-current-row
    :lazy="tableConfig.isLazy ?? false"
    :load="load"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  >
    <el-table-column
      v-if="tableConfig.multiSelect"
      type="selection"
      width="50"
      align="center"
    />

    <el-table-column
      v-if="tableConfig.rowNum"
      type="index"
      width="50"
      label="序号"
      align="center"
    />

    <TableColItem
      v-for="child in tableConfig.cols"
      :key="child.field"
      :col-opts="child"
    />
  </el-table>
</template>

<script>
import { merge } from 'lodash';
import TableColItem from '~/components/table-column/index';

export default {
  name: 'TreeTable',
  components: { TableColItem },
  props: {
    tableOpts: {
      type: Object,
      default: () => ({
        primaryKey: 'id',
        height: 500,
        rowNum: false,
        multiSelect: false,
        data: [],
        cols: [],
        isLazy: false,
        params: {},
        getDataApi: () => {}
      })
    }
  },
  data() {
    return {
      tableKey: '',
      tableData: [],
      tableConfig: {}
    };
  },
  watch: {
    tableOpts: {
      deep: true,
      immediate: true,
      handler() {
        const conf = {
          primaryKey: 'id',
          height: 500,
          rowNum: false,
          multiSelect: false,
          data: [],
          cols: [],
          isLazy: false,
          params: {},
          getDataApi: () => {}
        };
        this.tableKey = Math.random().toString(16).slice(2, 10);
        this.tableConfig = merge(conf, this.tableOpts);
        if (this.tableConfig.isLazy) {
          this.fetchData();
        } else {
          this.tableData = this.tableConfig.data;
        }
      }
    }
  },
  methods: {
    async getNodeTreeData(id) {
      const res = await this.tableConfig.getDataApi({
        ...this.tableConfig.params,
        [this.tableConfig.primaryKey]: id
      });
      const { data } = res.data;

      // 默认都有子节点
      this.updateChild(data);
      return data;
    },
    updateChild(data) {
      data.forEach((d) => {
        Object.assign(d, {
          hasChildren: d.children?.length ? false : true
        });

        if (d.children?.length) {
          this.updateChild(d.children);
        }
      });
    },
    async fetchData() {
      const data = await this.getNodeTreeData();
      this.tableData = data;
    },
    async load(row, treeNode, resolve) {
      const data = await this.getNodeTreeData(row[this.tableConfig.primaryKey]);
      resolve(data);
    }
  }
};
</script>

<style lang="scss" scoped></style>
