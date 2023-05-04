<template>
  <div v-if="columns">
    <el-table-column
      v-for="(child, cIdx) in columns"
      :key="child.field"
      :prop="child.field"
      :label="child.label"
      :width="child.width"
      header-align="center"
      show-overflow-tooltip
    >
      <TableColItem :columns="child.children" />
    </el-table-column>
  </div>
</template>

<script>
export default {
  name: 'TableColItem',
  props: ['columns']
};
</script>

<style lang="scss" scoped></style>
