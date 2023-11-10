<template>
  <el-form
    ref="queryForm"
    class="query-form"
    :inline="true"
    :model="form"
    :label-width="query?.labelWidth ?? '80px'"
  >
    <!-- size="small" -->
    <template v-if="isShowFormItem">
      <el-form-item
        class="form-item"
        v-for="item in query.form"
        :key="item.field"
        :label="item.label"
        :label-width="item.labelWidth ?? '80px'"
      >
        <el-input
          v-if="!item.component || item.component === 'input'"
          v-model="form[item.field]"
        />
        <el-select
          v-else-if="item.component === 'select'"
          v-model="form[item.field]"
          filterable
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
    </template>
    <el-form-item class="form-item" v-if="isShowQueryBtn">
      <el-button
        v-for="btn in query.btns"
        :icon="btn.icon"
        :key="btn.text"
        :type="btn.type ?? 'primary'"
        @click="handleBtnClk(btn.event)"
      >
        {{ btn.text }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    query: {
      type: Object,
      default() {
        return {
          form: [],
          btns: []
        };
      }
    }
  },
  data() {
    return {
      form: {}
    };
  },
  computed: {
    isShowFormItem() {
      return this.query.form?.length > 0;
    },
    isShowQueryBtn() {
      return this.query.btns?.length > 0;
    },
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
    'query.form': {
      handler(newVal) {
        newVal?.forEach((f) => {
          this.$set(this.form, f.field, f.default || '');
        });
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  methods: {
    handleBtnClk(eType) {
      // 事件类型是 搜索时，需要传递form中表单的值；其他情况传{}
      this.$emit(eType, eType === 'search' ? this.form : {});
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
.query-form {
  .form-item {
    margin-right: 20px;
    margin-bottom: 10px;
  }
}
</style>
