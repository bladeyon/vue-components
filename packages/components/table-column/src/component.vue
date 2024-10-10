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
    :show-overflow-tooltip="false"
    header-align="center"
    :class="colOpts.children?.length > 0 ? 'is-group' : ''"
  >
    <template slot-scope="{ row }">
      <span v-if="colOpts.operateBtns">
        <el-tooltip
          v-for="(btn, index) in colOpts.operateBtns"
          :key="'btn_' + index"
          :disabled="!btn.tips"
          :content="btn.tips"
          placement="top"
          effect="dark"
        >
          <el-button
            v-show="(btn.premCheck && btn.premCheck(row)) ?? true"
            :style="btn.style"
            :icon="btn.icon"
            :type="btn.type ?? 'text'"
            size="mini"
            @click="btn.handler(row)"
          >
            {{
              btn.label ||
                (!colOpts.formatter
                  ? row[colOpts.field]
                  : colOpts.formatter(row[colOpts.field], row))
            }}
          </el-button>
        </el-tooltip>
      </span>
      <template v-else-if="colOpts.columnEditable">
        <FormElement
          :data-form="row"
          :ele-opt="colOpts"
        />
      </template>
      <span
        v-else
        :style="generateColStyle(colOpts, row)"
        v-html="
          !colOpts.formatter
            ? row[colOpts.field]
            : colOpts.formatter(row[colOpts.field], row)
        "
      />
    </template>
    <!-- <template v-if="colOpts.children && colOpts.children?.length > 0">
      <TableCol
        v-for="col in colOpts.children"
        :key="col.field"
        :col-opts="col"
      />
    </template> -->
  </el-table-column>
</template>

<script>
import FormElement from '~/components/form-element/index';
export default {
  name: 'TableCol',
  components: {
    FormElement
  },
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
