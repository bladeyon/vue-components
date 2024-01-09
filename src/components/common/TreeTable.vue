<template>
  <el-table
    :key="tableKey"
    :data="tableData"
    style="width: 100%"
    :max-height="tableHeight"
    :row-key="tableConfig.primaryKey"
    stripe
    fit
    highlight-current-row
    :lazy="tableConfig.isLazy"
    :load="load"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  >
    <TableColItem
      v-for="child in tableConfig.cols"
      :key="child.field"
      :col-opts="child"
    />
  </el-table>
</template>

<script>
import { merge } from 'lodash';
import TableColItem from '@/components/common/TableColItem.vue';

export default {
  name: 'TreeTable',
  props: {
    tableHeight: Number,
    tableOpts: {
      type: Object,
      default: () => ({
        primaryKey: 'id',
        cols: [],
        isLazy: false,
        params: {},
        getDataApi: () => {}
      })
    }
  },
  components: { TableColItem },
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
          cols: [],
          isLazy: false,
          params: {},
          getDataApi: () => {}
        };
        this.tableKey = Math.random().toString(16).slice(2, 10);
        this.tableConfig = merge(conf, this.tableOpts);
        this.fetchData();
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
      data.forEach((d) =>
        Object.assign(d, { children: [], hasChildren: true })
      );
      return data;
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
