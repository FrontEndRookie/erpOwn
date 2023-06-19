<template>
  <div class="order-section-container">
    <header class="header">
      <span class="title">{{ title }}</span>
      <slot name="title-append"></slot>
    </header>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderSectionContainer",
  props: {
    title: {
      type: String,
      default: "我是标题",
    },
  },
};
</script>

<style lang="less" scoped>
.order-section-container {
  margin-top: 20px;
  .header {
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    align-items: center;
    background: #3d8bdd;
    .title {
      color: #fff;
      font-weight: bold;
      font-size: 16px;
    }
  }
  .content {
    box-sizing: border-box;
    padding: 20px 10px;
    background: #fff;
  }
}
</style>