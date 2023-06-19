<template>
  <div class="menu-item" slot="title" :style="{ color: meta.color }">
    <img v-if="meta.icon" :src="src" class="icon" />
    <template v-if="leftWidth || (!leftWidth && !isTop)">
      <span class="title">{{ meta.title }}</span>
      <span class="count-text" v-if="!dot">{{ countText }}</span>
      <span class="count-dot" v-if="dot && count">{{ count }}</span>
    </template>
  </div>
</template>
<script>
import Icons from "@/assets/menu-icon";
export default {
  name: "MenuItem",
  props: {
    meta: {
      type: Object,
      default: () => {
        return {
          title: "",
          icon: "",
        };
      },
    },
    leftWidth: {
      type: Boolean,
      default: () => false,
    },
    isTop: {
      type: Boolean,
      default: () => false,
    },
  },
  computed: {
    src() {
      return Icons[`${this.meta.icon}.svg`];
    },
    countText() {
      const { countInfo } = this.meta;
      if (countInfo) {
        const count = this.$store.state.common.countInfo[countInfo];
        return count && count > 0 ? `(${count})` : "";
      }
    },
    count() {
      const { countInfo } = this.meta;
      if (countInfo) {
        const count = this.$store.state.common.countInfo[countInfo];
        return count && count > 0 ? count : "";
      }
    },
    dot() {
      return this.meta.countDot;
    },
  },
};
</script>
<style lang="less" scoped>
.menu-item {
  .icon {
    margin-right: 12px;
    width: 20px;
    height: 20px;
  }
  .count-text {
  }
  .count-dot {
    box-sizing: border-box;
    display: inline-block;
    padding: 4px;
    border-radius: 10px;
    min-width: 20px;
    min-height: 20px;
    text-align: center;
    line-height: 1;
    font-size: 12px;
    color: #fff;
    background: #f56c6c;
    transform: scale(0.8);
  }
}
</style>

