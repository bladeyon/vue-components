<template>
  <el-form class="query-form" :inline="true" :model="form" label-width="80px">
    <template v-if="isShowFormItem">
      <el-form-item
        class="form-item"
        v-for="item in query.form"
        :key="item.field"
        :label="item.label"
      >
        <el-input
          v-if="item.component === 'input'"
          v-model="form[item.field]"
        ></el-input>
        <el-select
          v-else-if="item.component === 'select'"
          v-model="form[item.field]"
          filterable
          collapse-tags
          :multiple="item.componentProps.multiple"
        >
          <span
            v-if="item.componentProps.multiple"
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
            ></el-checkbox>
          </span>
          <el-option
            v-for="opt in item.componentProps.options"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          ></el-option>
        </el-select>
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
        :key="btn.text"
        :type="btn.type || 'primary'"
        @click="handleBtnClk(btn.event)"
      >
        {{ btn.text }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: ["query"],
  data() {
    return {
      form: {},
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
      return function (field, options) {
        let status = false;
        if (options?.length === this.form[field]?.length) {
          status = true;
        }
        return status;
      };
    },
  },
  watch: {
    "query.form": {
      handler(newVal) {
        newVal.forEach((f) => {
          this.$set(this.form, f.field, f.default || "");
        });
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  methods: {
    handleBtnClk(eType) {
      this.$emit(eType, this.form);
    },
    handlerMulSelect(e, field, options) {
      if (e) {
        this.form[field] = options.map((opt) => opt.value);
      } else {
        this.form[field] = [];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.query-form {
  // .form-item + .form-item {
  .form-item {
    margin-right: 20px;
  }
}
</style>
