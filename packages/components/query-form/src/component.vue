<template>
  <el-form
    ref="queryForm"
    :key="formKey"
    class="query-form"
    :inline="true"
    :model="dataForm"
    :label-width="query?.labelWidth ?? '80px'"
  >
    <el-form-item
      v-for="item in formItems"
      v-show="item.isShow ?? true"
      :key="item.field"
      class="form-item"
      :label="item.label"
      :label-width="item.labelWidth ?? query.labelWidth ?? '80px'"
    >
      <form-element
        :ele-opt="item"
        :form-items="formItems"
        :data-form="dataForm"
      />
    </el-form-item>

    <el-form-item class="form-item">
      <el-button
        v-for="btn in query.btns"
        v-show="btn.isShow ?? true"
        :key="btn.text"
        :icon="btn.icon"
        :type="btn.type ?? 'primary'"
        @click="handleBtnClk(btn.event)"
      >
        {{ btn.text }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { randomLenNum, findTreeNode } from '#/index';
import { cloneDeep } from 'lodash';
import FormElement from '~/components/form-element/index';

export default {
  name: 'QueryForm',
  components: { FormElement },
  props: {
    query: {
      type: Object,
      required: true,
      default() {
        return {
          form: [],
          btns: []
          // params: {} // 固定和默认参数
        };
      }
    }
  },
  data() {
    return {
      dataForm: {},
      formItems: [],
      formKey: randomLenNum()
    };
  },
  watch: {
    query: {
      handler(newVal) {
        this.formKey = randomLenNum();
        this.generateDataForm(newVal.form);

        this.formItems = [];
        this.generateFormItems(cloneDeep(newVal.form));
        this.setDefaultValue();
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  methods: {
    reset() {
      this.generateDataForm(this.query.form);
    },
    generateDataForm(data) {
      for (let index = 0; index < data?.length; index++) {
        const { field, children } = data[index];
        if (field.canEdit === false) continue;
        if (children?.length) {
          this.generateDataForm(children);
        } else {
          this.$set(this.dataForm, field, field.default);
        }
      }
    },
    generateFormItems(columns, parent) {
      for (let index = 0; index < columns?.length; index++) {
        const it = columns[index];
        if (it.children?.length) {
          this.generateFormItems(it.children, it);
        } else {
          if (parent) {
            it.label = `${parent.label}${it.label}`;
          }
          this.formItems.push(it);
        }
      }
    },
    setDefaultValue() {
      for (let idx = 0; idx < this.formItems.length; idx++) {
        const it = this.formItems[idx];
        if (it.component === 'upload') {
          this.dataForm['fileList_' + it.field] =
            it.componentProps?.getFileList(this.dataForm);
        } else if (it.component === 'selectTree') {
          this.dataForm['selectTree_' + it.field] = null;
          if (this.dataForm[it.field] != null) {
            const node = findTreeNode(
              this.dataForm[it.field],
              it.componentProps.data,
              it.componentProps.nodeKey ?? 'id',
              it.componentProps?.props?.children ?? 'children'
            );
            this.dataForm['selectTree_' + it.field] =
              node?.[it.componentProps?.props?.label ?? 'label'];
          }
        }

        // 执行初始化
        if (typeof it.componentProps?.init === 'function') {
          it.componentProps.init(it, this.dataForm, this.formItems);
        }

        if (this.dataForm[it.field] != null) {
          continue;
        } else {
          // 默认值
          let defVal = null;
          if (typeof it.default === 'function') {
            defVal = it.default(it, this.dataForm, this.formItems);
          } else if (it.default != null) {
            defVal = it.default;
            if (it.default.indexOf?.('options') > -1) {
              const idx = it.default.match(/\[(\d+)\]/)[1];
              defVal = it.componentProps.options?.[idx]?.value;
            }
          }
          this.$set(this.dataForm, it.field, defVal);
        }
      }
    },
    handleBtnClk(eType) {
      // 事件出发时，传递form表单的值
      this.$emit(eType, cloneDeep(this.dataForm));
    }
  }
};
</script>

<style lang="scss" scoped>
.query-form :v-deep {
  .form-item {
    margin: 5px 20px;
    margin-left: 0;

    .el-input {
      width: 180px;
    }
  }
}
</style>
