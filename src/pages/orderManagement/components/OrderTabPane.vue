<template>
  <!-- 订单tab-pane -->
  <div class="order-tab-pane" v-show="show">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "OrderTabPane",
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
  },
  created() {
    this.show = this.visible;
  },
  data() {
    return {
      show: false,
    };
  },
};
</script>

<style lang="less" scoped>
.order-tab-pane {
}
</style>