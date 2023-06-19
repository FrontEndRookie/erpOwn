<template>
  <table class="booking-table">
    <thead>
      <tr>
        <th v-for="item in columns" :key="item">
          <slot :name="`${item}-header`"></slot>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td v-for="item in columns" :key="item">
          <slot :name="item"></slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "BookingTable",
  data() {
    return {
      columns: [
        "bookingPiece", // 订舱件数
        "bookingWeight", // 订舱毛重
        "bookingCbm", // 订舱体积
        "cargoName", // 货物品名
        "marks", // 唛头
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.booking-table {
  border: 1px #000 solid;
  background: #F5F7FA;
  th,
  td {
    padding: 5px;
    border: 1px #e7e8ec solid;
    width: 160px;
  }
  th {
    overflow: hidden;
  }
  /deep/.el-form-item {
    margin-bottom: 0 !important;
  }
  /deep/.el-form-item__label {
    width: 100%;
    padding: 0;
    text-align: center;
  }
  /deep/.el-input__inner {
    border: none !important;
    text-align: center;
  }
  /deep/.el-form-item__error {
    width: 100%;
    text-align: center;
    margin-top: 10px;
  }
  /deep/.el-input.is-disabled .el-input__inner {
    // background-color: #fff;
  }
}
</style>