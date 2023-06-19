<template>
  <!-- 顶部操作栏 -->
  <div class="action-bar">
    <!-- 状态 -->
    <div style="margin-right: 20px">
      <el-button disabled style="min-width: 160px">
        {{ statusDescText }}
      </el-button>
    </div>
    <!-- 操作栏 -->
    <div>
      <el-button
        :type="item.type || 'primary'"
        v-for="item in computedActions"
        v-show="item.show"
        :key="item.name"
        @click="$emit('actionHandler', item.action)"
        :disabled="item.disabled"
        >{{ item.label }}</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "ActionBar",
  props: {
    order: {
      type: Object,
      default: () => ({}),
    },
    actions: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    statusDescText() {
      return this.isFreezedOrder ? "冻结" : this.order.statusDesc;
    },
    isFreezedOrder() {
      return this.order.openStatus === 0;
    },
    computedActions() {
      return [
        ...this.actions
          .map((item) => {
            return {
              ...item,
              roleAuthCode: {
                saveOrder: ["152001_B"],
                resolveOrder: ["152002_B"],
                rejectOrder: ["152002_B"],
                cancelOrder: ["152002_B"],
                applyVoidOrder: ["152008_B"],
              }[item.action],
              disabled: (() => {
                return (
                  (item.action === "cancelOrder" &&
                    this.$utils.cancelOrderBtnDisabled(this.order)) ||
                  (item.action === "applyVoidOrder" &&
                    this.order.canInvalidate === 1)
                );
              })(),
              show: (() => {
                if (item.action === "applyVoidOrder") {
                  return this.order.canInvalidate !== 2;
                }
                return true;
              })(),
            };
          })
          .filter(
            (btn) =>
              this.$utils.authCheckHidden(btn.roleAuthCode) === "visible" &&
              !this.isFreezedOrder
          ),
        ...[
          {
            label: "发起解锁流程",
            action: "unlockFreezedOrder",
            show: true,
          },
          {
            label: "取消订单",
            type: "danger",
            action: "cancelOrder",
            roleAuthCode: ["152002_B"],
            disabled: this.$utils.cancelOrderBtnDisabled(this.order),
            show: true,
          },
        ].filter((btn) => this.isFreezedOrder),
      ];
    },
  },
};
</script>

<style lang="less" scoped>
.action-bar {
  display: flex;
  align-items: center;
  padding: 10px;
  background: #fff;
}
</style>
