<template>
  <!-- 通用页面 -->
  <div class="dc-universal-page">
    <section class="page-main">
      <slot></slot>
    </section>
  </div>
</template>

<script>
export default {
  name: "DcUniversalPage",
};
</script>

<style lang="less" scoped>
.dc-universal-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 81px);
  background: #f3f6f9;
  .page-main {
    padding: 20px;
    flex: 1;
    min-height: 0;
    overflow: auto;
  }
}
</style>