<template>
  <el-form
    ref="queryForm"
    :key="formKey"
    class="query-form"
    :inline="true"
    :model="form"
    :label-width="query?.labelWidth ?? '80px'"
  >
    <!-- size="small" -->
    <el-form-item
      v-for="item in query.form"
      :key="item.field"
      class="form-item"
      :label="item.label"
      :label-width="item.labelWidth ?? query.labelWidth ?? '80px'"
    >
      <el-input
        v-if="!item.component || item.component === 'input'"
        v-model="form[item.field]"
      />
      <el-select
        v-else-if="item.component === 'select'"
        v-model="form[item.field]"
        :filterable="item.componentProps?.filterable ?? true"
        :clearable="item.componentProps?.clearable ?? true"
        collapse-tags
        :style="item.style"
        :multiple="item.multiple ?? false"
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
              handlerMulSelect($event, item.field, item.componentProps.options)
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
        v-model="form[item.field]"
        :type="item.componentProps?.type ?? 'date'"
        :default-value="item.default"
        :value-format="item.componentProps?.valueFormat ?? 'yyyy-MM-dd'"
        size="small"
        :placeholder="item.componentProps?.placeholder"
      />
      <!-- prettier-ignore -->
      <el-date-picker
        v-else-if="item.component === 'daterange'"
        v-model="form[item.field]"
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
        v-model="form[item.field]"
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
export default {
  props: {
    query: {
      type: Object,
      required: true,
      default() {
        return {
          form: [],
          btns: [],
          params: {} // 固定参数
        };
      }
    }
  },
  data() {
    return {
      form: {},
      formKey: randomLenNum()
    };
  },
  computed: {
    mulSelectStatus() {
      return (field, options) => {
        let status = false;
        if (options?.length === this.form[field]?.length) {
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
        this.generateForm(newVal.form);
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  methods: {
    reset() {
      this.generateForm(this.query.form);
    },
    generateForm(form) {
      form?.forEach((f) => {
        let defVal = '';
        if (f.default !== undefined) {
          defVal = f.default;
          if (f.component === 'select' && f.default.indexOf('options') > -1) {
            const idx = f.default.match(/\[(\d+)\]/)[1];
            defVal = f.componentProps.options?.[idx]?.value;
          }
        }
        this.$set(this.form, f.field, defVal);
      });
    },
    handleBtnClk(eType) {
      // 事件类型是 搜索时，需要传递form中表单的值；其他情况传{}
      const data = {};
      Object.assign(data, this.query.params, this.form);
      this.$emit(eType, eType === 'search' ? data : {});
    },
    handlerMulSelect(e, field, options) {
      if (e) {
        this.form[field] = options.map((opt) => opt.value);
      } else {
        this.form[field] = [];
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
