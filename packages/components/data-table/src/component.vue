<template>
  <div class="data-table">
    <el-table
      ref="dataTable"
      :key="tableKey"
      :data="optionsLatest.data"
      :max-height="
        optionsLatest.height - (optionsLatest.options.showPagination ? 40 : 0)
      "
      :default-sort="optionsLatest.sort"
      stripe
      fit
      :highlight-current-row="optionsLatest.options.highlightCurrentRow"
      :style="{ width: '100%', fontSize: optionsLatest.fontSize }"
      :cell-style="optionsLatest.cellStyle"
      :row-class-name="optionsLatest.rowClassName"
      @cell-click="cellClick"
      @selection-change="handleSelectionChange"
      @expand-change="handleExpandChange"
      @cell-mouse-enter="handleCellMouseEnter"
      @cell-mouse-leave="handleCellMouseLeave"
    >
      <el-table-column
        v-if="optionsLatest.options.expand"
        type="expand"
        width="50"
      >
        <template #default="slotScope">
          <slot
            name="expandContent"
            :row="slotScope.row"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="optionsLatest.options.multiSelect"
        type="selection"
        width="50"
        align="center"
      />
      <el-table-column
        v-if="optionsLatest.options.rowNum"
        type="index"
        width="50"
        label="序号"
        align="center"
      />
      <TableColumn
        v-for="col in optionsLatest.cols"
        :key="col.field"
        :col-opts="col"
      />
    </el-table>
    <el-pagination
      v-show="optionsLatest.options.showPagination"
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
    <el-tooltip
      ref="tooltip"
      placement="top"
      effect="dark"
    >
      <!-- content to trigger tooltip here -->
      <template #content>
        <span v-html="tooltipContent" />
      </template>
    </el-tooltip>
  </div>
</template>
<script>
import { merge, debounce } from 'lodash';
import TableColumn from '~/components/table-column/index';
import { randomLenNum, getStyle } from '#/index';

export default {
  name: 'DataTable',
  components: { TableColumn },
  props: {
    tableOpts: {
      type: Object,
      default() {
        return {
          height: 500,
          fontSize: '12px',
          options: {
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
        };
      }
    }
  },
  data() {
    return {
      tableKey: randomLenNum(), // 修改key 强制重新渲染
      optionsLatest: {
        height: 500,
        fontSize: '12px',
        options: {
          rowNum: false,
          multiSelect: false,
          showPagination: true,
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
      current: 1,
      size: 10,
      tooltipContent: ''
    };
  },
  watch: {
    tableOpts: {
      deep: true,
      handler() {
        this.mergeTableOpts();
      }
    },
    'optionsLatest.pages': {
      deep: true,
      handler(pages) {
        const { current, size } = pages;
        this.current = current;
        this.size = size;
      }
    }
  },
  beforeCreate() {},
  created() {
    this.mergeTableOpts();
    this.activateTooltip = debounce(
      (tooltip) => tooltip.handleShowPopper(),
      50
    );
  },
  methods: {
    mergeTableOpts() {
      const defValue = {
        height: 500,
        fontSize: '12px',
        options: {
          rowNum: false,
          multiSelect: false,
          showPagination: true,
          highlightCurrentRow: false
        },
        data: [], // 数据
        cols: [],
        total: 0,
        pages: {
          current: 1,
          size: 10
        }
      };
      this.optionsLatest = merge(defValue, this.tableOpts);
    },
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
    },
    // CellMouseEnter 和 CellMouseLeave 是为了解决 latex 公式显示的问题
    handleCellMouseEnter(row, column, cell, event) {
      // 判断是否text-overflow, 如果是就显示tooltip
      const cellChild = event.target.querySelector('.cell');
      // if (!(hasClass(cellChild, 'el-tooltip') && cellChild.childNodes.length)) {
      //   return;
      // }
      // use range width instead of scrollWidth to determine whether the text is overflowing
      // to address a potential FireFox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1074543#c3
      const range = document.createRange();
      range.setStart(cellChild, 0);
      range.setEnd(cellChild, cellChild.childNodes.length);
      const rangeWidth = range.getBoundingClientRect().width;
      const padding =
        (parseInt(getStyle(cellChild, 'paddingLeft'), 10) || 0) +
        (parseInt(getStyle(cellChild, 'paddingRight'), 10) || 0);
      if (
        (rangeWidth + padding > cellChild.offsetWidth ||
          cellChild.scrollWidth > cellChild.offsetWidth) &&
        this.$refs.tooltip
      ) {
        const tooltip = this.$refs.tooltip;
        // this.tooltipContent = cell.textContent;
        // 判断是否含LaTeX公式，本项目中格式为：$$...$；如：”$$a^2$“
        const latexRegex = /\$\$([^\$]+)\$/g;
        this.tooltipContent = latexRegex.test(row[column.property])
          ? cell.innerHTML
          : cell.textContent;
        tooltip.referenceElm = cell;
        tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none');
        tooltip.doDestroy();
        tooltip.setExpectedState(true);
        this.activateTooltip(tooltip);
      }
    },
    handleCellMouseLeave(row, column, cell, event) {
      const tooltip = this.$refs.tooltip;
      if (tooltip) {
        tooltip.setExpectedState(false);
        tooltip.handleClosePopper();
      }
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

    .cell {
      white-space: nowrap;
    }
  }
}
</style>
