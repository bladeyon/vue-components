<template>
  <!-- 因为el-table中包含原生html元素会出现类顺序混乱问题，这里用el-table-column再包一层, 然后渲染时隐藏掉 -->
  <el-table-column>
    <el-table-column
      v-for="col in columns"
      :key="col.field"
      :column-key="col.field"
      :prop="col.field"
      :label="col.label"
      :align="col.align || 'center'"
      :width="col.width"
      :sortable="col.sort || false"
      :fixed="col.fixed || false"
      :min-width="col.minWidth || '80px'"
      show-overflow-tooltip
      header-align="center"
      :class="!!col.children && col.children.length > 0 ? 'is-group' : ''"
    >
      <TableColItem
        v-if="!!col.children && col.children.length > 0"
        :columns="col.children"
      />
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
            !col.formatter ? row[col.field] : col.formatter(row[col.field], row)
          }}
        </span>
      </template>
    </el-table-column>
  </el-table-column>
</template>

<script>
export default {
  name: 'TableColItem',
  props: ['columns']
};
</script>

<style lang="scss" scoped></style>
