<template>
  <!-- 建议封装 el-select -->
  <!-- 主要为了解决ios下输入框无法调起键盘问题 -->
  <el-select
    ref="select"
    v-bind="$attrs"
    v-on="$listeners"
    @hook:mounted="cancalReadOnly"
    @visible-change="cancalReadOnly"
  >
    <slot></slot>
  </el-select>
</template>

<script>
export default {
  name: "",
  methods: {
    cancalReadOnly(onOff) {
      this.$nextTick(() => {
        if (!onOff) {
          const reference = this.$refs.select.$refs.reference;
          if (reference) {
            const input = reference.$el.querySelector(".el-input__inner");
            input.removeAttribute("readonly");
          }
        }
      });
    },
  },
};
</script>