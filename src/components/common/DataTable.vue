<template>
  <div class="data-table">
    <el-table
      :data="optionsLatest.data"
      :max-height="tableHeight"
      :default-sort="optionsLatest.sort"
      stripe
      fit
      highlight-current-row
      :style="{ width: '100%', fontSize: optionsLatest.fontSize }"
      :filtered-value="[1, 2, 3]"
      @cell-click="cellClick"
      :cell-style="optionsLatest.cellStyle"
    >
      <el-table-column
        v-if="optionsLatest.option.multiSelect"
        type="selection"
        width="50"
      >
      </el-table-column>
      <el-table-column
        v-if="optionsLatest.option.rowNum"
        type="index"
        width="50"
        label="序号"
        align="center"
      >
      </el-table-column>
      <TableColItem
        v-if="!!optionsLatest.cols && optionsLatest.cols.length > 0"
        :columns="optionsLatest.cols"
      />
    </el-table>
    <el-pagination
      style="margin-top: 6px"
      background
      v-show="optionsLatest.showPagination && optionsLatest.total > 0"
      @size-change="changeSize"
      @current-change="changePage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size.async="size"
      :current-page.async="current"
      layout="total, sizes, prev, pager, next, jumper"
      :total="optionsLatest.total"
    >
    </el-pagination>
  </div>
</template>
<script>
import { merge } from 'lodash';
import TableColItem from './TableColItem.vue';

export default {
  components: { TableColItem },
  props: {
    tableHeight: Number,
    tableOpts: {
      type: Object,
      default() {
        return {
          fontSize: '12px',
          option: {
            rowNum: false,
            multiSelect: false
          },
          data: [], // 数据
          cols: [{ label: '操作时间', field: 'operaTime', width: 150 }],
          showPagination: true,
          total: 0,
          pages: {
            current: 1,
            size: 10
          }
        };
      }
    }
  },
  data() {
    return {
      current: 1,
      size: 10
    };
  },
  computed: {
    optionsLatest() {
      const defValue = {
        fontSize: '12px',
        option: {
          rowNum: false,
          multiSelect: false
        },
        data: [], // 数据
        cols: [],
        showPagination: true,
        total: 0,
        pages: {
          current: 1,
          size: 10
        }
      };
      const newOpts = merge(defValue, this.tableOpts);
      this.current = newOpts.pages.current;
      this.size = newOpts.pages.size;
      return newOpts;
    }
  },
  methods: {
    changePage(page) {
      this.current = page;
      this.changePagination();
    },
    changeSize(size) {
      this.size = size;
      this.changePagination();
    },
    changePagination() {
      this.$emit('changePage', {
        current: this.current,
        size: this.size
      });
    },
    cellClick(row, column, cell, event) {
      this.$emit('cellClick', {
        row,
        column,
        cell,
        event
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.data-table {
  .el-table ::v-deep {
    .is-group > tr:nth-child(odd) { // 存在叶子节点时, 隐藏空白列
      display: none;
    }
  }
  & > .el-pagination {
    text-align: right;
  }
}
</style>
