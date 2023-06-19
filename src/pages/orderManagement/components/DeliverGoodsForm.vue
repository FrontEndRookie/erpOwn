<template>
  <div class="deliver-goods-form">
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      label-width="100px"
      size="small"
    >
      <el-form-item label="送货地址" prop="deliveryAddress">
        <el-input
          v-model="form.deliveryAddress"
          placeholder="请输入送货地址"
          @input="() => $emit('update:deliveryAddress', form.deliveryAddress)"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="deliveryTel">
        <el-input
          v-model="form.deliveryTel"
          placeholder="请输入联系电话"
          @input="() => $emit('update:deliveryTel', form.deliveryTel)"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="送货联系人" prop="deliveryContacts">
        <el-input
          v-model="form.deliveryContacts"
          @input="() => $emit('update:deliveryContacts', form.deliveryContacts)"
          placeholder="请输入送货联系人"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
const rules = {
  deliveryAddress: [
    {
      required: true,
      type: "string",
      message: "请输入送货地址",
      trigger: "blur",
    },
  ],
  deliveryTel: [
    {
      required: true,
      type: "string",
      message: "请输入联系电话",
      trigger: "blur",
    },
  ],
  deliveryContacts: [
    {
      required: true,
      type: "string",
      message: "请输入送货联系人",
      trigger: "blur",
    },
  ],
};
export default {
  // 送货信息表单
  name: "DeliverGoodsForm",
  props: ["deliveryAddress", "deliveryContacts", "deliveryTel"],
  data() {
    return {
      rules,
      form: {
        deliveryAddress: this.deliveryAddress,
        deliveryContacts: this.deliveryContacts,
        deliveryTel: this.deliveryTel,
      },
    };
  },
  computed: {
    pickerOptions() {
      return {
        disabledDate(time) {
          return time.getTime() < new Date().getTime() - 24 * 60 * 60 * 1000;
        },
      };
    },
  },
};
</script>

<style lang="less" scoped>
.deliver-goods-form {
  .el-form {
    background: transparent !important;
  }
  margin-left: -20px;
  padding: 20px 0;
  width: 360px;
}
</style>