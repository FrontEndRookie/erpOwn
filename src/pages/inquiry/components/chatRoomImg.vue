<template>
  <span>
    <el-image
      v-show="imgLoading"
      style="max-width: 250px; max-height: 250px"
      :src="imgSrc"
      :preview-src-list="[imgSrc]"
      @load="imageLoad"
    >
    </el-image>
    <span
      v-if="!imgLoading"
      style="
        display: inline-block;
        width: 250px;
        height: 250px;
        position: relative;
      "
    >
      <i
        class="el-icon-loading"
        style="font-size: 25px; position: absolute; left: 110px; top: 110px"
      ></i>
    </span>
  </span>
</template>
<script>
export default {
  props: {
    imgSrc: {
      type: String,
      default: 'xxx',
    },
  },
  data() {
    return {
      imgLoading: false,
    }
  },
  mounted() {},
  methods: {
    imageLoad() {
      this.imgLoading = true
    },
  },
}
</script>
