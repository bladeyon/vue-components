<template>
  <el-table-column
    :prop="colOpts.field"
    :label="colOpts.label"
    :align="colOpts.align || 'center'"
    :width="colOpts.width"
    :sortable="colOpts.sort || false"
    :fixed="colOpts.fixed || false"
    :min-width="colOpts.minWidth || '80px'"
    show-overflow-tooltip
    header-align="center"
    :class="colOpts.children?.length > 0 ? 'is-group' : ''"
  >
    <template slot-scope="{ row }">
      <span v-if="colOpts.OperateBtn">
        <el-button
          v-for="btn in colOpts.OperateBtn"
          :key="btn.label"
          :icon="btn.icon"
          type="text"
          size="mini"
          @click="btn.handler($event, row)"
        >
          {{ btn.label }}
        </el-button>
      </span>
      <span v-else :style="colOpts.style">
        {{
          !colOpts.formatter ? row[colOpts.field] : colOpts.formatter(row[colOpts.field], row)
        }}
      </span>
    </template>
    <TableColItem v-for="col in colOpts.children" :key="colOpts.field" :colOpts="col" />
  </el-table-column>
</template>

<script>
export default {
  name: 'TableColItem',
  props: ['colOpts']
};
</script>

<style lang="scss" scoped></style>
