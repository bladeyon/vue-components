<template>
  <div class="data-table">
    <el-table
      v-loading="loading"
      :data="tableOpts.data"
      border
      fit
      highlight-current-row
      :max-height="tableHeight"
      style="width: 100%;"
    >
      <template v-for="col in tableOpts.cols">
        <el-table-column
          :label="col.label"
          :key="col.field"
          min-width="120px"
          :align="col.align || 'center'"
          :width="col.width"
        >
          <template slot-scope="{ row }">
            <span>{{ row[col.field] }}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <pagination
      class="pagination"
      style="margin-top: 10px;"
      v-show="tableOpts.total > 0"
      :total="tableOpts.total"
      :page.sync="tableOpts.pages.current"
      :limit.sync="tableOpts.pages.size"
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
      default: {
        data: [], // 数据
        cols: [{ label: "操作时间", field: "operaTime", width: 150 }],
        total: 0,
        pages: {
          current: 1,
          size: 20,
        },
      },
    },
  },
  methods: {
    changePage(pages) {
      let { page: current, limit: size } = pages;
      this.$emit("changePage", {
        current,
        size,
      });
    },
  },
};
</script>
<style lang=""></style>
