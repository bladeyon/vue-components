<template>
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
    <TableColItem
      v-for="col in colOpts.children"
      :key="col.field"
      :col-opts="col"
    />
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
