<template>
  <div class="data-table">
    <el-table
      ref="dataTable"
      :key="tableKey"
      :data="optionsLatest.data"
      :max-height="
        tableHeight -
          (optionsLatest.showPagination && optionsLatest.total > 0 ? 40 : 0)
      "
      :default-sort="optionsLatest.sort"
      stripe
      fit
      :highlight-current-row="optionsLatest.option.highlightCurrentRow"
      :style="{ width: '100%', fontSize: optionsLatest.fontSize }"
      :cell-style="optionsLatest.cellStyle"
      :row-class-name="optionsLatest.rowClassName"
      @cell-click="cellClick"
      @selection-change="handleSelectionChange"
      @expand-change="handleExpandChange"
    >
      <el-table-column
        v-if="optionsLatest.option.expand"
        type="expand"
        width="50"
      >
        <template #default="slotScope">
          <slot name="expandContent" :row="slotScope.row"></slot>
        </template>
      </el-table-column>
      <el-table-column
        v-if="optionsLatest.option.multiSelect"
        type="selection"
        width="50"
        align="center"
      />
      <el-table-column
        v-if="optionsLatest.option.rowNum"
        type="index"
        width="50"
        label="序号"
        align="center"
      />
      <template v-for="col in optionsLatest.cols">
        <el-table-column
          v-if="col.isShow !== false"
          :key="col.field"
          :prop="col.field"
          :label="col.label"
          :align="col.align || 'center'"
          :width="col.width"
          :sortable="col.sort || false"
          :fixed="col.fixed || false"
          :min-width="col.minWidth || '80px'"
          :class-name="col.className"
          show-overflow-tooltip
          header-align="center"
          :class="col.children?.length > 0 ? 'is-group' : ''"
        >
          <template slot-scope="{ row }">
            <span v-if="col.OperateBtn">
              <el-tooltip
                v-for="(btn, index) in col.OperateBtn"
                :key="'btn_' + index"
                :disabled="!btn.tips"
                :content="btn.tips"
                placement="top"
                effect="dark"
              >
                <el-button
                  v-if="(btn.premCheck && btn.premCheck(row)) ?? true"
                  :icon="btn.icon"
                  type="text"
                  size="mini"
                  @click="btn.handler(row)"
                >
                  {{
                    btn.label ||
                      (!col.formatter
                        ? row[col.field]
                        : col.formatter(row[col.field]))
                  }}
                </el-button>
              </el-tooltip>
            </span>
            <span v-else :style="generateColStyle(col, row)">
              {{
                !col.formatter
                  ? row[col.field]
                  : col.formatter(row[col.field], row)
              }}
            </span>
          </template>
          <TableColItem
            v-for="child in col.children"
            :key="child.field"
            :col-opts="child"
          />
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      v-show="optionsLatest.showPagination && optionsLatest.total > 0"
      style="margin-top: 6px"
      background
      :page-sizes="[10, 20, 50, 100]"
      :page-size.sync="size"
      :current-page.sync="current"
      layout="total, sizes, prev, pager, next, jumper"
      :total="optionsLatest.total"
      @size-change="changeSize"
      @current-change="changePage"
    />
  </div>
</template>
<script>
import { merge } from 'lodash';
import TableColItem from './TableColItem.vue';
import { randomLenNum } from '@/util/index';
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
      tableKey: randomLenNum(), // 修改key 强制重新渲染
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
          multiSelect: false,
          highlightCurrentRow: false
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
      this.tableKey = randomLenNum();
      return newOpts;
    }
  },
  methods: {
    generateColStyle(colOpts = {}, row) {
      if (colOpts.style) {
        if (typeof colOpts.style === 'function') {
          return colOpts.style(row[colOpts.field], row);
        } else {
          return colOpts.style;
        }
      }
    },
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
    },
    handleSelectionChange(row) {
      this.$emit('rowSelection', row);
    },
    handleExpandChange(row, expanded) {
      this.$emit('expandRow', { row, expanded });
    }
  }
};
</script>
<style lang="scss" scoped>
.data-table ::v-deep {
  & > .el-pagination {
    text-align: right;
  }

  .el-table {
    .is-center .cell .el-checkbox {
      margin: 0;
    }
  }
}
</style>
