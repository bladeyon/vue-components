<template>
  <el-dialog
    v-dialog-drag
    append-to-body
    :visible="visible"
    :title="getTitle"
    :width="dialogProps.width || '800px'"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="close"
  >
    <el-form
      :key="formKey"
      ref="dataForm"
      :model="dataForm"
      :rules="rules"
      :inline="true"
      :label-width="formProps.labelWidth || '140px'"
    >
      <template v-for="item in fItems">
        <el-form-item
          v-if="item.canEdit ?? true"
          :key="item.field"
          class="form-item"
          :label="item.label"
          :prop="item.field"
          :style="item | setStyle"
          :label-width="item.labelWidth || formProps.labelWidth || '140px'"
        >
          <FormElement
            :ele-opt="item"
            :form-items="fItems"
            :data-form="dataForm"
          />
        </el-form-item>
      </template>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        v-for="(btn, index) in footerBtns"
        :key="btn.event + index"
        :type="btn.type"
        :icon="btn.icon"
        @click="handleFooterBtnClick(btn.event, btn.isValid)"
      >
        {{ btn.text }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { cloneDeep } from 'lodash';
import FormElement from '~/components/form-element/index';
import { randomLenNum, findTreeNode } from '#/index';

export default {
  name: 'FormDialog',
  components: { FormElement },
  filters: {
    setStyle(item) {
      const cssObj = {
        width:
          item.component === 'textarea'
            ? '90%'
            : item.componentProps?.style?.width ?? `48%`
      };
      if (typeof item.style === 'string') {
        item.style.split(';').reduce((acc, cur) => {
          const [key, value] = cur.split(':');
          acc[key] = value;
          return acc;
        }, cssObj);
      } else if (typeof item.style === 'object') {
        Object.assign(cssObj, item.style);
      }
      return cssObj;
    }
  },
  props: {
    title: { type: String, default: '' },
    dialogProps: {
      type: Object,
      default: () => ({
        width: '800px'
        // footerBtns: [
        //   { type: 'default', text: '取 消', event: 'close' },
        //   { type: 'primary', text: '保 存', event: 'success', isValid: true // 是否校验}
        // ]
      })
    },
    formProps: {
      type: Object,
      default: () => ({ labelWidth: '140px' })
    },
    formData: {
      type: Object,
      default: () => ({ id: 1 })
    },
    formRules: {
      type: Object,
      default: () => ({
        a: true, // generateFormRules 中自动处理
        b: [{ require: true }] // 与 element-ui 表单校验规则一致
      })
    },
    primaryKey: {
      type: String,
      default: 'id'
    },
    formItems: {
      type: Array,
      default: () => [
        {
          label: '',
          field: '',
          style: '', // 样式 string 或者 object
          default: '', // 默认值
          components: '', // 表单类型
          componentProps: {
            // 表单属性
            style: {},
            type: '', // input type
            options: [], // select options
            format: '', // datepicker 显示值格式化
            valueFormat: '', // datepicker 值格式化
            readonly: false,
            rows: 3, // 文本域 rows
            multiple: false, // select 多选
            props: {}, // cascader 级联选择器配置
            showAllLevels: false, // cascader 仅显示最后一级
            change: () => {} // chang事件
          }
        }
      ]
    }
  },
  data() {
    return {
      visible: false,
      formKey: '',
      dataForm: {},
      rules: {},
      fItems: [],
      footerBtns: [
        { type: 'default', text: '取 消', event: 'close' },
        { type: 'primary', text: '保 存', event: 'success', isValid: true }
      ]
    };
  },
  computed: {
    getTitle() {
      return this.title || (this.dataForm[this.primaryKey] ? '编辑' : '新增');
    }
  },
  watch: {
    visible: {
      handler(value) {
        if (value) {
          this.formKey = randomLenNum();

          // footerBtns
          if (this.dialogProps.footerBtns) {
            this.footerBtns = this.footerBtns.concat(
              this.dialogProps.footerBtns
            );
          }

          // 生成 dataForm 响应式数据
          this.$set(
            this.dataForm,
            this.primaryKey,
            this.formData?.[this.primaryKey]
          ); // 主键

          this.generateDataForm(this.formItems);

          this.fItems = [];
          this.generateFormItems(cloneDeep(this.formItems));
          this.setDefaultValue();
          this.rules = {};
          this.generateFormRules(this.formRules);
        }
      }
    },
    rules: {
      deep: true,
      handler() {
        this.$refs['dataForm']?.clearValidate();
      }
    }
  },
  methods: {
    generateDataForm(data) {
      for (let index = 0; index < data.length; index++) {
        const { field, children } = data[index];
        if (field?.canEdit === false) continue;
        if (children?.length) {
          this.generateDataForm(children);
        } else {
          this.$set(this.dataForm, field, this.formData[field]);
        }
      }
    },
    generateFormRules(source = {}) {
      for (const key in source) {
        const value = source[key];
        if (Array.isArray(value)) {
          this.rules[key] = value;
        } else {
          // 存 触发方式 默认 blur
          this.rules[key] = [
            {
              required: true,
              message: '不能为空',
              trigger: ['blur', 'change'].includes(value) ? value : 'blur'
            }
          ];
        }
      }
    },
    generateFormItems(columns, parent) {
      for (let index = 0; index < columns.length; index++) {
        const it = columns[index];
        if (it.children?.length) {
          this.generateFormItems(it.children, it);
        } else {
          if (parent) {
            it.label = `${parent.label}${it.label}`;
          }
          this.fItems.push(it);
        }
      }
    },
    setDefaultValue() {
      for (let idx = 0; idx < this.fItems.length; idx++) {
        const it = this.fItems[idx];
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
          it.componentProps.init(it, this.dataForm, this.fItems);
        }

        if (this.dataForm[it.field] != null) {
          continue;
        } else {
          // 默认值
          let defVal = null;
          if (typeof it.default === 'function') {
            defVal = it.default(it, this.dataForm, this.fItems);
          } else if (it.default != null) {
            defVal = it.default;
          }
          this.$set(this.dataForm, it.field, defVal);
        }
      }
    },
    async formValidate() {
      return await this.$refs.dataForm.validate();
    },
    async handleFooterBtnClick(type, isValid = true) {
      if (type === 'close') {
        this.close();
      } else if (type === 'reset') {
        this.reset();
      } else if (isValid && (await this.formValidate())) {
        this.$emit(type, cloneDeep(this.dataForm));
      } else {
        this.$emit(type, cloneDeep(this.dataForm));
      }
    },
    reset() {
      this.$refs.dataForm.resetFields();
    },
    close() {
      this.dataForm = {};
      this.fItems = [];
      this.footerBtns = [
        { type: 'default', text: '取 消', event: 'close' },
        { type: 'primary', text: '保 存', event: 'success', isValid: true }
      ];
      this.reset();
      this.visible = false;
    },
    open() {
      this.visible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-dialog__wrapper ::v-deep {
  .el-dialog {
    &__body {
      .el-form {
        display: flex;
        flex-wrap: wrap;

        &-item {
          display: inline-flex;

          &:not(:has(.el-upload)) {
            align-items: center;
          }

          &__label {
            flex-shrink: 0;
            line-height: 22px;
            word-break: break-word;
          }

          &__content {
            flex: 1;
          }

          .el-select,
          .el-date-editor,
          .el-cascader {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
