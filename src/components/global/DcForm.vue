<template>
  <!-- 简易封装el-form -->
  <el-form ref="form" class="dc-form" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </el-form>
</template>

<script>
export default {
  name: "DcForm",
  computed: {
    form() {
      return this.$refs.form;
    },
  },
};
</script>

<style lang="less" scoped>
.dc-form {
  background: transparent;
  /deep/.el-form-item {
    margin-bottom: 20px;
    vertical-align: middle;
    &__label,
    &__content {
      vertical-align: middle;
    }
  }
  &.form-label-auto {
    /deep/.el-form-item {
      display: inline-flex;
      &__label,
      &__content {
        vertical-align: middle;
      }
      &__label {
        width: auto !important;
      }
      &__content {
        flex: 1;
        min-width: 0;
        .el-select,
        .el-date-editor {
          width: 100%;
        }
      }
    }
  }
}
</style>