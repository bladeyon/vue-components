<template>
  <el-form
    ref="queryForm"
    :key="formKey"
    class="query-form"
    :inline="true"
    :model="dataForm"
    :label-width="query?.labelWidth ?? '80px'"
  >
    <!-- size="small" -->
    <template v-for="item in formItems">
      <el-form-item
        v-show="item.isShow ?? true"
        :key="item.field"
        class="form-item"
        :label="item.label"
        :label-width="item.labelWidth ?? query.labelWidth ?? '80px'"
      >
        <el-input
          v-if="!item.component || item.component === 'input'"
          v-model="dataForm[item.field]"
          clearable
          :readonly="item.componentProps?.readonly || false"
          :disabled="item.componentProps?.disabled || false"
          @input="(value) => handleFormItemEvent(value, item, 'input')"
          @change="(value) => handleFormItemEvent(value, item, 'change')"
          @focus="(value) => handleFormItemEvent(value, item, 'focus')"
        />
        <el-select
          v-else-if="item.component === 'select'"
          v-model="dataForm[item.field]"
          :filterable="item.componentProps?.filterable ?? true"
          :clearable="item.componentProps?.clearable ?? true"
          collapse-tags
          :style="item.style"
          :multiple="item.multiple ?? false"
          @change="(value) => handleFormItemEvent(value, item, 'change')"
        >
          <span
            v-if="item.multiple && item.componentProps.checkbox"
            style="line-height: 34px; padding: 0 20px"
          >
            <el-checkbox
              label="全选"
              :indeterminate="false"
              :value="mulSelectStatus(item.field, item.componentProps.options)"
              @change="
                handlerMulSelect(
                  $event,
                  item.field,
                  item.componentProps.options
                )
              "
            />
          </span>
          <el-option
            v-for="opt in item.componentProps.options"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <el-date-picker
          v-else-if="item.component === 'datepicker'"
          v-model="dataForm[item.field]"
          :type="item.componentProps?.type ?? 'date'"
          :default-value="item.default"
          :value-format="item.componentProps?.valueFormat ?? 'yyyy-MM-dd'"
          size="small"
          :placeholder="item.componentProps?.placeholder"
        />
        <!-- prettier-ignore -->
        <el-date-picker
          v-else-if="item.component === 'daterange'"
          v-model="dataForm[item.field]"
          :type="item.componentProps?.type ?? 'daterange'"
          :default-value="item.default"
          :range-separator="item.componentProps?.separator ?? '-'"
          :value-format="item.componentProps?.valueFormat ?? 'yyyy-MM-dd'"
          size="small"
          :start-placeholder="item.componentProps?.startPlaceholder ?? '开始时间'"
          :end-placeholder="item.componentProps?.endPlaceholder ?? '结束时间'"
        />

        <el-radio-group
          v-else-if="item.component === 'radioGroup'"
          v-model="dataForm[item.field]"
          @input="(value) => handleFormItemEvent(value, item, 'input')"
        >
          <el-radio
            v-for="opt in item.componentProps.options"
            :key="opt.value"
            :label="opt.value"
          >
            {{ opt.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </template>
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
import { randomLenNum } from '@/util';
import { cloneDeep, omit } from 'lodash';

export default {
  props: {
    query: {
      type: Object,
      required: true,
      default() {
        return {
          form: [],
          btns: [],
          params: {} // 固定和默认参数
        };
      }
    }
  },
  data() {
    return {
      dataForm: {},
      formItem: [],
      formKey: randomLenNum()
    };
  },
  computed: {
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
      const canEditColField = [];
      for (let index = 0; index < data.length; index++) {
        const { field, children } = data[index];
        if (children?.length) {
          this.generateDataForm(children);
        } else {
          this.$set(this.dataForm, field, this.query.params?.[field]);
          canEditColField.push(field);
        }
      }

      // 不可编辑字段加到 dataForm 中
      for (const key in omit(this.query.params, canEditColField)) {
        if (Object.prototype.hasOwnProperty.call(this.query.params, key)) {
          this.$set(this.dataForm, key, this.query.params?.[key]);
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
      // 事件类型是 搜索时，需要传递form中表单的值；其他情况传{}
      const data = {};
      Object.assign(data, this.query.params, this.dataForm);
      this.$emit(eType, eType === 'search' ? data : {});
    },
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
          this.formItems
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.query-form ::v-deep {
  .form-item {
    margin: 5px 20px;
    margin-left: 0;

    .el-input {
      width: 180px;
    }
  }
}
</style>
