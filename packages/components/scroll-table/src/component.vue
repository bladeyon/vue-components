<template>
  <div class="scroll-table">
    <div class="header row">
      <div
        v-for="(item, index) in colOptions"
        :key="`header-${index}`"
        :style="item.style ?? ''"
      >
        {{ item.label }}
      </div>
    </div>
    <vue-seamless-scroll
      v-if="data.length"
      :data="data"
      :class-option="scrollOption"
      class="main"
    >
      <div
        v-for="(item, index) in data"
        :key="`dr-${index}`"
        class="row"
        :style="
          stripeColor
            ? { backgroundColor: index & 1 ? 'transparent' : stripeColor }
            : ''
        "
      >
        <div
          v-for="(col, idx) in colOptions"
          :key="`col-${idx}_${index}`"
          :style="col.style ?? ''"
        >
          {{ item[col.field] }}
        </div>
      </div>
    </vue-seamless-scroll>
  </div>
</template>

<script>
import VueSeamlessScroll from 'vue-seamless-scroll';

export default {
  name: 'ScrollTable',
  components: {
    VueSeamlessScroll
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    colOptions: {
      type: Array,
      default: () => []
    },
    scrollParams: {
      type: Object,
      default: () => ({
        step: 1, // 数值越大速度滚动越快
        limitMoveNum: 3, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
      })
    },
    stripeColor: { type: String, default: '' } // 表示颜色的 css
  },
  data() {
    return {
      scrollOption: {}
    };
  },
  watch: {
    scrollParams: {
      immediate: true,
      deep: true,
      handler(params) {
        const defOpt = {
          step: 1,
          limitMoveNum: 3,
          hoverStop: true,
          direction: 1, //
          openWatch: true,
          singleHeight: 0,
          singleWidth: 0,
          waitTime: 1000
        };
        this.scrollOption = Object.assign({}, defOpt, params);
      }
    }
  },
  methods: {}
};
</script>

<style scoped lang="scss">
// 滚动表格
.scroll-table {
  .row {
    padding: 12px 8px;
    width: 100%;
    display: flex;
    align-items: center;
    text-align: center;

    & div,
    & > div > span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    & > div {
      flex: 1;
    }

    & > div:nth-child(1) {
      display: flex;
      align-items: center;
      text-align: left;
    }
  }

  .header {
    background: transparent;
    // color: #498fff;
  }
  .main {
    width: 100%;
    height: calc(100% - 42px);
    overflow: hidden;

    // .row {
    //   &:nth-child(even) {
    //     background-color: rgba(3, 36, 89, 0.4);
    //   }
    // }
  }
}
</style>
