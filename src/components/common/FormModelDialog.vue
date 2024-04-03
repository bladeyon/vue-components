<template>
  <el-dialog
    v-dialog-drag
    append-to-body
    :visible="visible"
    :title="getTitle"
    width="800"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="reset"
  >
    <el-form
      :key="formKey"
      ref="dataForm"
      :model="dataForm"
      :rules="rules"
      :inline="true"
      label-width="180px"
    >
      <el-form-item
        v-for="item in formItems"
        :key="item.field"
        class="form-item"
        :label="item.label"
        :prop="item.field"
        :style="{ width: item.component === 'textarea' ? '90%' : '45%' }"
      >
        <el-input
          v-if="!item.component || item.component === 'input'"
          v-model="dataForm[item.field]"
          :type="item.componentProps?.type || 'text'"
          :readonly="item.componentProps?.readonly || false"
          @change="(value) => handleFormItemChange(value, item)"
        >
        </el-input>
        <el-input
          v-else-if="item.component === 'textarea'"
          v-model="dataForm[item.field]"
          type="textarea"
          :rows="item.componentProps?.rows || 3"
          style="width: 100%"
        >
        </el-input>
        <el-select
          v-else-if="item.component === 'select'"
          v-model="dataForm[item.field]"
          filterable
          collapse-tags
          :multiple="item.componentProps?.multiple"
        >
          <span
            v-if="item.componentProps?.multiple"
            style="line-height: 34px; padding: 0 20px"
          >
            <el-checkbox
              label="全选"
              :indeterminate="false"
              :value="mulSelectStatus(item.field, item.componentProps?.options)"
              @change="
                handlerMulSelect(
                  $event,
                  item.field,
                  item.componentProps?.options
                )
              "
            ></el-checkbox>
          </span>
          <el-option
            v-for="opt in item.componentProps?.options"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          ></el-option>
        </el-select>
        <el-date-picker
          v-else-if="item.component === 'datepicker'"
          v-model="dataForm[item.field]"
          :type="item.componentProps?.type || 'date'"
          :default-value="item.default"
          :value-format="item.componentProps?.valueFormat || 'yyyy-MM-dd'"
          :format="item.componentProps?.format || 'yyyy-MM-dd'"
          size="small"
          :placeholder="item.componentProps?.placeholder"
        >
        </el-date-picker>

        <el-radio-group
          v-else-if="item.component === 'radioGroup'"
          v-model="dataForm[item.field]"
        >
          <el-radio
            v-for="opt in item.componentProps?.options"
            :key="opt.value"
            :label="opt.value"
          >
            {{ opt.label }}
          </el-radio>
        </el-radio-group>

        <el-cascader
          v-else-if="item.component === 'cascader'"
          v-model="dataForm[item.field]"
          :options="item.componentProps?.options"
          clearable
          filterable
          :show-all-levels="item.componentProps?.showAllLevels ?? true"
          :props="item.componentProps?.props"
        >
        </el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="reset">取 消</el-button>
      <el-button type="primary" @click="submit">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { cloneDeep } from 'lodash';

export default {
  name: 'FormModelDialog',
  props: {
    visible: Boolean,
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
    fieldItems: {
      type: Array,
      default: () => [
        {
          label: '',
          field: '',
          default: '', // 默认值
          components: '', // 表单类型
          componentProps: {
            // 表单属性
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
      formKey: '',
      dataForm: {},
      rules: {},
      formItems: []
    };
  },
  computed: {
    getTitle() {
      return this.dataForm[this.primaryKey] ? '编辑' : '新增';
    },
    mulSelectStatus() {
      return (field, options) => {
        let status = false;
        if (options?.length === this.dataForm[field]?.length) {
          status = true;
        }
        return status;
      };
    }
  },
  watch: {
    visible: {
      handler(value) {
        if (value) {
          this.formKey = Math.random().toString(16).slice(2, 10);
          this.dataForm = cloneDeep(this.formData);
        }
      }
    },
    formRules: {
      deep: true,
      handler(value) {
        this.rules = {};
        this.generateFormRules(value);
      }
    },
    fieldItems: {
      deep: true,
      handler(value) {
        this.formItems = [];
        this.generateFormItems(this.formData, value);
      }
    }
  },
  methods: {
    handlerMulSelect(e, field, options) {
      if (e) {
        this.dataForm[field] = options.map((opt) => opt.value);
      } else {
        this.dataForm[field] = [];
      }
    },
    handleFormItemChange(value, cfg) {
      const change = cfg.componentProps?.change;
      if (typeof change === 'function') {
        cfg.componentProps.change(value, cfg.field, this.dataForm);
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
    generateFormItems(form, cols, parent) {
      const columns = cloneDeep(cols);
      // const items = [];
      for (let index = 0; index < columns.length; index++) {
        const it = columns[index];

        if (it.canEdit === false) {
          continue;
        } else {
          if (it.children?.length) {
            this.generateFormItems(form, it.children, it);
          } else {
            if (parent) {
              it.label = `${parent.label}${it.label}`;
            }
            // 默认值
            this.dataForm[it.field] = form[it.field] ?? it.default;
            this.formItems.push(it);
          }
        }
      }
      // return items;
    },
    async submit() {
      delete this.dataForm?.randomKey;
      const result = await this.$refs.dataForm.validate();
      if (result) {
        this.$emit('success', this.dataForm);
      }
    },
    reset() {
      this.$refs.dataForm.resetFields();
      this.dataForm = {};
      this.$emit('update:visible', false);
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
          width: 45%;

          &__content {
            width: calc(100% - 180px);
          }

          .el-input .el-input__inner,
          .el-date-editor.el-input__inner {
            width: 220px;
          }
        }
      }
    }
  }
}
</style>
