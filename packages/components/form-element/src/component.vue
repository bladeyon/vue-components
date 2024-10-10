<template>
  <el-input
    v-if="!eleOpt.component || eleOpt.component === 'input'"
    v-model="dataForm[eleOpt.field]"
    :type="eleOpt | setType"
    clearable
    :readonly="eleOpt.componentProps?.readonly || false"
    :disabled="eleOpt.componentProps?.disabled || false"
    @input="(value) => handleFormItemEvent(value, eleOpt, 'input')"
    @change="(value) => handleFormItemEvent(value, eleOpt, 'change')"
    @focus="(value) => handleFormItemEvent(value, eleOpt, 'focus')"
  />

  <el-input
    v-else-if="eleOpt.component === 'textarea'"
    v-model="dataForm[eleOpt.field]"
    :readonly="eleOpt.componentProps?.readonly || false"
    :disabled="eleOpt.componentProps?.disabled || false"
    type="textarea"
    clearable
    :rows="eleOpt.componentProps?.rows || 3"
    @change="(value) => handleFormItemEvent(value, eleOpt, 'change')"
  />

  <el-select
    v-else-if="eleOpt.component === 'select'"
    v-model="dataForm[eleOpt.field]"
    filterable
    collapse-tags
    :remote="eleOpt.componentProps?.remote ?? false"
    :remote-method="() => eleOpt.componentProps?.remoteMethod(eleOpt, dataForm)"
    :disabled="eleOpt.componentProps?.disabled ?? false"
    :clearable="eleOpt.componentProps?.clearable ?? true"
    :multiple="eleOpt.componentProps?.multiple"
    :allow-create="eleOpt.componentProps?.allowCreate"
    @change="(value) => handleFormItemEvent(value, eleOpt, 'change')"
    @focus="(value) => handleFormItemEvent(value, eleOpt, 'focus')"
  >
    <span
      v-if="
        eleOpt.componentProps?.multiple && eleOpt.componentProps?.isShowMulBtn
      "
      style="
        line-height: 34px;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      "
    >
      <el-checkbox
        label="全选"
        :indeterminate="false"
        :value="mulSelectStatus(eleOpt.field, eleOpt.componentProps?.options)"
        @change="
          handlerMulSelect($event, eleOpt.field, eleOpt.componentProps?.options)
        "
      />

      <el-button
        type="text"
        @click="handlerOtherSelect('other')"
      >
        反选
      </el-button>
      <el-button
        type="text"
        @click="handlerOtherSelect('none')"
      >
        全不选
      </el-button>
    </span>
    <el-option
      v-for="opt in eleOpt.componentProps?.options"
      :key="opt.value"
      :label="opt.label"
      :value="opt.value"
    >
      <span
        v-if="eleOpt.componentProps?.hasLaTeX"
        v-html="laTeXConvert(opt.label)"
      />
    </el-option>
  </el-select>

  <el-popover
    v-else-if="eleOpt.component === 'selectTree'"
    v-model="selectTreeVisible"
    trigger="click"
    :append-to-body="false"
    popper-class="popover-select-tree"
  >
    <el-tree
      ref="tree"
      :data="eleOpt.componentProps?.data"
      :current-node-key="dataForm[eleOpt.field]"
      :node-key="eleOpt.componentProps?.nodeKey ?? 'id'"
      :props="
        eleOpt.componentProps?.props ?? { label: 'label', children: 'children' }
      "
      :show-checkbox="eleOpt.componentProps?.showCheckbox ?? false"
      :accordion="eleOpt.componentProps?.accordion ?? true"
      :highlight-current="true"
      @node-click="
        (data, node, _this) => selectTreeClick(data, eleOpt, node, _this)
      "
      @current-change="(value) => handleFormItemEvent(value, eleOpt, 'change')"
    />
    <div
      slot="reference"
      class="el-select"
    >
      <el-input
        v-model="dataForm['selectTree_' + eleOpt.field]"
        placeholder="请选择"
        readonly
        @clear="handleSelectTreeClear(eleOpt)"
        @click="handleSelectTreeFocus"
      >
        <template slot="suffix">
          <i
            slot="suffix"
            class="el-select__caret el-input__icon el-icon-arrow-up"
            :class="{ 'is-reverse': selectTreeVisible }"
          />
        </template>
      </el-input>
    </div>
  </el-popover>

  <el-date-picker
    v-else-if="eleOpt.component === 'datepicker'"
    v-model="dataForm[eleOpt.field]"
    :type="eleOpt | setType"
    clearable
    :default-value="eleOpt.default"
    :disabled="eleOpt.componentProps?.disabled || false"
    :value-format="eleOpt.componentProps?.valueFormat || 'yyyy-MM-dd'"
    :format="eleOpt.componentProps?.format || 'yyyy-MM-dd'"
    :placeholder="eleOpt.componentProps?.placeholder"
    @change="(value) => handleFormItemEvent(value, eleOpt, 'change')"
  />

  <el-radio-group
    v-else-if="eleOpt.component === 'radioGroup'"
    v-model="dataForm[eleOpt.field]"
    :disabled="eleOpt.componentProps?.disabled || false"
    @input="(value) => handleFormItemEvent(value, eleOpt, 'change')"
  >
    <el-radio
      v-for="opt in eleOpt.componentProps?.options"
      :key="opt.value"
      :label="opt.value"
    >
      {{ opt.label }}
    </el-radio>
  </el-radio-group>

  <el-switch
    v-else-if="eleOpt.component === 'switch'"
    v-model="dataForm[eleOpt.field]"
    :disabled="eleOpt.componentProps?.disabled || false"
    :active-value="eleOpt.componentProps?.active ?? 1"
    :active-color="eleOpt.componentProps?.activeColor ?? '#409EFF'"
    :inactive-value="eleOpt.componentProps?.inactive ?? 0"
    :inactive-color="eleOpt.componentProps?.inactiveColor ?? '#C0CCDA'"
    @change="(value) => handleFormItemEvent(value, eleOpt, 'change')"
  />

  <el-cascader
    v-else-if="eleOpt.component === 'cascader'"
    v-model="dataForm[eleOpt.field]"
    :disabled="eleOpt.componentProps?.disabled || false"
    :options="eleOpt.componentProps?.options"
    clearable
    filterable
    :show-all-levels="eleOpt.componentProps?.showAllLevels ?? true"
    :props="eleOpt.componentProps?.props"
    @change="(value) => handleFormItemEvent(value, eleOpt, 'change')"
  />

  <el-upload
    v-else-if="eleOpt.component === 'upload'"
    :ref="'upload' + eleOpt.field"
    :disabled="eleOpt.componentProps?.disabled || false"
    name=""
    :action="eleOpt.componentProps?.action ?? ''"
    :http-request="eleOpt.componentProps?.httpRequest"
    :auto-upload="eleOpt.componentProps?.autoUpload ?? true"
    :multiple="eleOpt.componentProps?.multiple"
    :limit="eleOpt.componentProps?.limit"
    :before-remove="(file, fileList) => onBeforeRemove(file, fileList, eleOpt)"
    :on-remove="(file, fileList) => onRemove(file, fileList, eleOpt)"
    :on-exceed="(files, fileList) => onExceed(files, fileList, eleOpt)"
    :on-change="(file, fileList) => onChange(file, fileList, eleOpt)"
    :on-success="
      (response, file, fileList) => onSuccess(response, file, fileList, eleOpt)
    "
    :show-file-list="eleOpt.componentProps?.showFileList"
    :file-list="dataForm['fileList_' + eleOpt.field]"
    :accept="eleOpt.componentProps?.accept"
  >
    <el-button
      slot="trigger"
      size="small"
      type="primary"
    >
      选择文件
    </el-button>
    <el-button
      v-show="eleOpt.componentProps?.autoUpload === false"
      style="margin-left: 10px"
      size="small"
      type="success"
      @click="submitUpload('upload' + eleOpt.field)"
    >
      上传到服务器
    </el-button>
    <div
      slot="tip"
      class="el-upload__tip"
    >
      {{ eleOpt.componentProps?.tip ?? '' }}
    </div>
  </el-upload>
</template>

<script>
import { laTeX2HtmlString } from '#/laTeX';
const componentDefCfg = {
  textarea: {
    type: 'textarea'
  },
  datepicker: {
    type: 'date'
  }
};

export default {
  name: 'FormElement',
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
    eleOpt: {
      type: Object,
      default: () => ({
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
      })
    },
    formItems: { type: Array, default: () => [] },
    dataForm: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      selectTreeVisible: false
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
  methods: {
    handlerMulSelect(e, field, options) {
      if (e) {
        this.dataForm[field] = options.map((opt) => opt.value);
      } else {
        this.dataForm[field] = [];
      }
    },
    handlerOtherSelect(type) {
      if (type === 'none') {
        this.dataForm[this.eleOpt.field] = [];
      } else if (type === 'other') {
        const otherValue = this.eleOpt.componentProps.options.filter(
          (it) => !this.dataForm[this.eleOpt.field].includes(it.value)
        );
        this.dataForm[this.eleOpt.field] = otherValue.map((opt) => opt.value);
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
    },
    laTeXConvert(value) {
      return laTeX2HtmlString(value);
    },
    handleSelectTreeFocus() {
      this.selectTreeVisible = true;
    },
    handleSelectTreeClear(eleOpt) {
      this.dataForm[eleOpt.field] = null;
    },
    selectTreeFilter(value) {},
    selectTreeClick(data, eleOpt, node, _this) {
      this.dataForm[eleOpt.field] =
        data[eleOpt.componentProps?.nodeKey ?? 'id'];
      this.dataForm['selectTree_' + eleOpt.field] =
        node[eleOpt.componentProps?.props?.label ?? 'label'];
      this.selectTreeVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped></style>
