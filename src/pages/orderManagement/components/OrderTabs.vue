<template>
  <!-- 订单tab页 -->
  <div class="order-tabs">
    <el-radio-group v-model="tab">
      <el-radio-button
        v-for="item in tabs"
        :key="item.uid"
        :label="item.label"
        >{{ item.label }}</el-radio-button
      >
    </el-radio-group>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "OrderTabs",
  created() {
    this.init();
  },
  props: {
    active: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      tabs: [],
      tab: "",
    };
  },
  methods: {
    async init() {
      this.tab = this.active;
      this.getTabs();
    },
    async getTabs() {
      await this.$nextTick();
      this.tabs = this.$children
        .filter((item) => item.$options.name === "OrderTabPane" && item.visible)
        .map((item) => {
          return {
            label: item.$attrs.label,
            name: item.$attrs.name,
            uid: item._uid,
            vnode: item,
          };
        });
      this.updateTab();
    },
    updateTab() {
      this.tabs.forEach((item) => {
        item.vnode.show = item.label === this.tab;
      });
    },
  },
  watch: {
    tab(newVal) {
      this.updateTab();
      this.$emit("update:active", newVal);
      const { name, query, params } = this.$route;
      this.$router.replace({
        name,
        query: {
          ...query,
          tab: {
            订舱信息: 1,
            进仓指引: 3,
            账单: 2,
          }[newVal],
        },
        params,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.order-tabs {
  /deep/.el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: #2273ce;
    border-color: #2273ce;
  }
  /deep/.el-radio-group {
    display: flex;
    width: 100%;
    .el-radio-button {
      flex: 1;
      .el-radio-button__inner {
        width: 100%;
        border-color: #2273ce;
      }
    }
  }
}
</style>