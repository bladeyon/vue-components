<template>
<<<<<<< HEAD
  <el-table-column
    v-if="colOpts.isShow !== false"
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
        <el-tooltip
          v-for="(btn, index) in colOpts.OperateBtn"
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
              (!colOpts.formatter
                ? row[colOpts.field]
                : colOpts.formatter(row[colOpts.field]))
            }}
          </el-button>
        </el-tooltip>
      </span>
      <span v-else :style="generateColStyle(colOpts, row)">
        {{
          !colOpts.formatter
            ? row[colOpts.field]
            : colOpts.formatter(row[colOpts.field], row)
        }}
      </span>
    </template>
<<<<<<< HEAD
    <TableColItem v-for="col in colOpts.children" :key="colOpts.field" :colOpts="col" />
=======
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
>>>>>>> 30052b2a (修复多级时,叶子列排序混乱的问题)
=======
    <TableColItem
      v-for="col in colOpts.children"
      :key="col.field"
      :col-opts="col"
    />
>>>>>>> 2dccd24b (列支持是否显示配置)
  </el-table-column>
</template>

<script>
export default {
  name: 'TableColItem',
  props: ['colOpts'],
  methods: {
    generateColStyle(colOpts = {}, row) {
      if (colOpts.style) {
        if (typeof colOpts.style === 'function') {
          return colOpts.style(row[colOpts.field], row);
        } else {
          return colOpts.style;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
