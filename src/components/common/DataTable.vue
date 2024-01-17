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
      highlight-current-row
      :style="{ width: '100%', fontSize: optionsLatest.fontSize }"
      @cell-click="cellClick"
      :cell-style="optionsLatest.cellStyle"
      :row-class-name="optionsLatest.rowClassName"
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
<<<<<<< HEAD
      >
      </el-table-column>
<<<<<<< HEAD
<<<<<<< HEAD
      <el-table-column
        v-for="col in optionsLatest.cols"
        :key="col.field"
        :prop="col.field"
        :label="col.label"
        :align="col.align || 'center'"
        :width="col.width"
        :sortable="col.sort || false"
        :fixed="col.fixed || false"
        :min-width="col.minWidth || '80px'"
        show-overflow-tooltip
        header-align="center"
        :class="col.children?.length > 0 ? 'is-group' : ''"
      >
        <template slot-scope="{ row }">
          <span v-if="col.OperateBtn">
            <el-button
              v-for="btn in col.OperateBtn"
              :key="btn.label"
              :icon="btn.icon"
              type="text"
              size="mini"
              @click="btn.handler($event, row)"
            >
              {{ btn.label }}
            </el-button>
          </span>
          <span v-else :style="col.style">
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
          :colOpts="child"
        />
      </el-table-column>
=======
      <TableColItem
        v-if="!!optionsLatest.cols && optionsLatest.cols.length > 0"
        :columns="optionsLatest.cols"
      />
>>>>>>> 30052b2a (修复多级时,叶子列排序混乱的问题)
=======
=======
      />
>>>>>>> 03c53457 (对部分文件进行 lint)
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
                  v-show="(btn.premCheck && btn.premCheck(row)) ?? true"
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
>>>>>>> 2dccd24b (列支持是否显示配置)
    </el-table>
    <el-pagination
      style="margin-top: 6px"
      background
      v-show="optionsLatest.showPagination && optionsLatest.total > 0"
      @size-change="changeSize"
      @current-change="changePage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size.sync="size"
      :current-page.sync="current"
      layout="total, sizes, prev, pager, next, jumper"
      :total="optionsLatest.total"
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
<<<<<<< HEAD
.data-table {
<<<<<<< HEAD
=======
  .el-table ::v-deep {
    .is-group > tr:nth-child(odd) { // 存在叶子节点时, 隐藏空白列
      display: none;
    }
  }
>>>>>>> 30052b2a (修复多级时,叶子列排序混乱的问题)
=======
.data-table ::v-deep {
<<<<<<< HEAD
  .el-table__row {
    .el-table__cell {
      .el-button.el-button--text {
        i[class*='el-icon-'] {
          font-size: $font-size-m;

          // 删除图标
          &[class*='delete'] {
            color: $color-danger;
          }

          // 编辑、预览图标
          &[class*='edit'],
          &[class*='reading'] {
            color: $color-success;
          }
        }
      }
    }
  }

>>>>>>> 8dc9c8dd (表格公共组件增加嵌套子表格功能；设定常用的行间按钮样式)
=======
>>>>>>> 164c7064 (style: 表格中操作列的按钮统一设置样式)
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
