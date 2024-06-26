<template>
  <el-dialog
    v-dialog-drag
    append-to-body
    :visible="visible"
    :title="getTitle"
    :width="formProps.width || '800px'"
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
      :label-width="formProps.labelWidth || '140px'"
    >
      <template v-for="item in formItems">
        <el-form-item
          v-if="item.canEdit ?? true"
          :key="item.field"
          class="form-item"
          :label="item.label"
          :prop="item.field"
          :style="item | setStyle"
          :label-width="item.labelWidth || formProps.labelWidth || '140px'"
        >
          <el-input
            v-if="!item.component || item.component === 'input'"
            v-model="dataForm[item.field]"
            :type="item | setType"
            clearable
            :readonly="item.componentProps?.readonly || false"
            :disabled="item.componentProps?.disabled || false"
            @input="(value) => handleFormItemEvent(value, item, 'input')"
            @change="(value) => handleFormItemEvent(value, item, 'change')"
            @focus="(value) => handleFormItemEvent(value, item, 'focus')"
          >
          </el-input>

          <el-input
            v-else-if="item.component === 'textarea'"
            v-model="dataForm[item.field]"
            :disabled="item.componentProps?.disabled || false"
            type="textarea"
            clearable
            :rows="item.componentProps?.rows || 3"
          >
          </el-input>

          <el-select
            v-else-if="item.component === 'select'"
            v-model="dataForm[item.field]"
            filterable
            collapse-tags
            :remote="item.componentProps?.remote ?? false"
            :remote-method="
              () => item.componentProps?.remoteMethod(item, dataForm)
            "
            :disabled="item.componentProps?.disabled ?? false"
            :clearable="item.componentProps?.clearable ?? true"
            :multiple="item.componentProps?.multiple"
            :allow-create="item.componentProps?.allowCreate"
            @change="(value) => handleFormItemEvent(value, item, 'change')"
            @focus="(value) => handleFormItemEvent(value, item, 'focus')"
          >
            <span
              v-if="item.componentProps?.multiple"
              style="line-height: 34px; padding: 0 20px"
            >
              <el-checkbox
                label="全选"
                :indeterminate="false"
                :value="
                  mulSelectStatus(item.field, item.componentProps?.options)
                "
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
            :type="item | setType"
            clearable
            :default-value="item.default"
            :disabled="item.componentProps?.disabled || false"
            :value-format="item.componentProps?.valueFormat || 'yyyy-MM-dd'"
            :format="item.componentProps?.format || 'yyyy-MM-dd'"
            :placeholder="item.componentProps?.placeholder"
          >
          </el-date-picker>

          <el-radio-group
            v-else-if="item.component === 'radioGroup'"
            v-model="dataForm[item.field]"
            :disabled="item.componentProps?.disabled || false"
            @input="(value) => handleFormItemEvent(value, item, 'input')"
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
            :disabled="item.componentProps?.disabled || false"
            :options="item.componentProps?.options"
            clearable
            filterable
            :show-all-levels="item.componentProps?.showAllLevels ?? true"
            :props="item.componentProps?.props"
            @change="(value) => handleFormItemEvent(value, item, 'change')"
          >
          </el-cascader>

          <el-upload
            v-else-if="item.component === 'upload'"
            :ref="'upload' + item.field"
            :disabled="item.componentProps?.disabled || false"
            name=""
            :action="item.componentProps?.action ?? ''"
            :http-request="item.componentProps?.httpRequest"
            :auto-upload="item.componentProps?.autoUpload ?? true"
            :multiple="item.componentProps?.multiple"
            :limit="item.componentProps?.limit"
            :before-remove="
              (file, fileList) => onBeforeRemove(file, fileList, item)
            "
            :on-remove="(file, fileList) => onRemove(file, fileList, item)"
            :on-exceed="(files, fileList) => onExceed(files, fileList, item)"
            :on-change="(file, fileList) => onChange(file, fileList, item)"
            :on-success="
              (response, file, fileList) =>
                onSuccess(response, file, fileList, item)
            "
            :show-file-list="item.componentProps?.showFileList"
            :file-list="dataForm['fileList_' + item.field]"
            :accept="item.componentProps?.accept"
          >
            <el-button slot="trigger" size="small" type="primary">
              选择文件
            </el-button>
            <el-button
              v-show="item.componentProps?.autoUpload === false"
              style="margin-left: 10px"
              size="small"
              type="success"
              @click="submitUpload('upload' + item.field)"
            >
              上传到服务器
            </el-button>
            <div slot="tip" class="el-upload__tip">
              {{ item.componentProps?.tip ?? '' }}
            </div>
          </el-upload>
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="reset">取 消</el-button>
      <el-button type="primary" @click="submit">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { cloneDeep, omit } from 'lodash';

const componentDefCfg = {
  textarea: {
    type: 'textarea'
  },
  datepicker: {
    type: 'date'
  }
};

export default {
  name: 'FormModelDialog',
  filters: {
    setStyle(item) {
      const cssObj = {
        width: item.component === 'textarea' ? '90%' : `48%`
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
    },
    setType(item) {
      return (
        item.componentProps?.type ??
        (componentDefCfg[item.component]?.type || 'text')
      );
    }
  },
  props: {
    visible: Boolean,
    title: { type: String, default: '' },
    formProps: {
      type: Object,
      default: () => ({ width: '800px', labelWidth: '140px' })
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
    fieldItems: {
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
      return this.title || (this.dataForm[this.primaryKey] ? '编辑' : '新增');
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

          // 生成 dataForm 响应式数据
          this.$set(
            this.dataForm,
            this.primaryKey,
            this.formData[this.primaryKey]
          ); // 主键

          this.generateDataForm(this.fieldItems);

          this.formItems = [];
          this.generateFormItems(cloneDeep(this.fieldItems));
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
    handlerMulSelect(e, field, options) {
      if (e) {
        this.dataForm[field] = options.map((opt) => opt.value);
      } else {
        this.dataForm[field] = [];
      }
    },
    handleFormItemEvent(value, cfg, eventType) {
      const eventFn = cfg.componentProps?.[eventType];
      if (typeof eventFn === 'function') {
        cfg.componentProps?.[eventType](
          value,
          cfg.field,
          this.dataForm,
          this.formItems,
          this.$refs['dataForm']
        );
      }
    },
    generateDataForm(data) {
      const canEditColField = [];
      for (let index = 0; index < data.length; index++) {
        const { field, children } = data[index];
        if (children?.length) {
          this.generateDataForm(children);
        } else {
          this.$set(this.dataForm, field, this.formData[field]);
          canEditColField.push(field);
        }
      }

      // 不可编辑字段加到 dataForm 中
      for (const key in omit(this.formData, canEditColField)) {
        if (Object.prototype.hasOwnProperty.call(this.formData, key)) {
          this.$set(this.dataForm, key, this.formData[key]);
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
          }
          this.$set(this.dataForm, it.field, defVal);
        }
      }
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
    },
    submitUpload(refName) {
      this.$refs[refName].submit();
    },
    onExceed(files, fileList, item) {
      this.$message.error(`只能上传${item.componentProps?.limit}个文件`);
    },
    onChange(file, fileList, item) {
      item.componentProps?.onChange?.(file, fileList, this.dataForm);
    },
    onSuccess(response, file, fileList, item) {
      item.componentProps?.onSuccess?.(response, file, fileList, this.dataForm);
    },
    onBeforeRemove(file, fileList, item) {
      return item.componentProps?.onBeforeRemove?.(
        file,
        fileList,
        this.dataForm
      );
    },
    onRemove(file, fileList, item) {
      item.componentProps?.onRemove?.(file, fileList, this.dataForm);
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
