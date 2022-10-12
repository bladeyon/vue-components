<template>
  <div class="data-table">
    <el-table
      :data="tableOpts.data"
      :max-height="tableHeight"
      :default-sort="tableOpts.sort"
      stripe
      fit
      highlight-current-row
      style="width: 100%"
    >
      <template v-for="col in tableOpts.cols">
        <el-table-column
          v-if="col.isShow !== false"
          :prop="col.field"
          :label="col.label"
          :key="col.field"
          :align="col.align || 'center'"
          :width="col.width"
          :sortable="col.sort || false"
          :fixed="col.fixed || false"
          min-width="80px"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span v-if="!col.OperateBtn">
              {{
                !col.formatter ? row[col.field] : col.formatter(row[col.field])
              }}
            </span>
            <span v-else>
              <el-button
                v-for="btn in col.OperateBtn"
                :key="btn.label"
                :icon="btn.icon"
                type="text"
                size="mini"
                @click="btn.handler(row)"
              >
                {{ btn.label }}
              </el-button>
            </span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <pagination
      v-show="tableOpts.total > 0"
      :total="tableOpts.total"
      :page.sync="tableOpts.pages.current"
      :limit.sync="tableOpts.pages.size"
      class="pagination"
      style="margin-top: 10px"
      @pagination="changePage"
    />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  props: {
    tableHeight: Number,
    tableOpts: {
      type: Object,
      default() {
        return {
          data: [], // 数据
          cols: [{ label: "操作时间", field: "operaTime", width: 150 }],
          total: 0,
          pages: {
            current: 1,
            size: 20
          }
        };
      }
    }
  },
  watch: {
    tableOpts: {
      handler: (nVal) => {
        console.log(nVal);
      },
      deep: true
    }
  },
  methods: {
    changePage(pages) {
      const { page: current, limit: size } = pages;
      this.$emit("changePage", {
        current,
        size
      });
    }
  }
};
</script>
<style lang=""></style>
