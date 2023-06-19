<template>
  <img :src="computedSrc" v-bind="$attrs" v-on="$listeners" />
</template>

<script>
import Imgs from "@/assets/imgs";
export default {
  name: "DcImg",
  props: {
    name: {
      type: String,
      default: "transparent",
    },
    type: {
      type: String,
      default: "png",
    },
  },
  computed: {
    computedSrc() {
      const { name, type } = this;
      return Imgs[`${name}.${type}`];
    },
  },
};
</script>
