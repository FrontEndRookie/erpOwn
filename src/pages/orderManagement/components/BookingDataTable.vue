<template>
  <dc-primeval-table
    :data="computedList"
    :columns="columns"
    style="width: 500px"
  />
</template>

<script>
import DcStatus from "@/status";
// 需要父子通信的数据
const OrderKeys = [
  "bookingPiece", // 件数
  "bookingWeight", // 毛重
  "bookingCbm", // 体积
  "bookingVwr", // 比重
  "bubblePoint", // 分泡比例
  "bookingCw", // 计费重
];
export default {
  name: "BookingDataTable",
  created() {
    this.init();
  },
  props: {
    order: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      form: {},
      columns: [
        {
          prop: "bookingPiece",
          label: "件数",
        },
        {
          prop: "bookingWeight",
          label: "毛重",
        },
        {
          prop: "bookingCbm",
          label: "体积",
        },
        {
          prop: "bookingVwrText",
          label: "比重",
        },
        {
          prop: "bubblePointText",
          label: "分泡比例",
        },
        {
          prop: "bookingCw",
          label: "计费重",
        },
      ],
    };
  },
  computed: {
    computedList() {
      const {
        bookingPiece,
        bookingWeight,
        bookingCbm,
        bookingVwr,
        bubblePoint,
        bookingCw,
      } = this.form;
      const currentBubblePoint =
        DcStatus.commonStatus.getStatus("bubblePoints", bubblePoint) || {};
      return [
        {
          bookingPiece: bookingPiece || "***",
          bookingWeight: bookingWeight || "***",
          bookingCbm: bookingCbm || "***",
          bookingVwr: bookingVwr || "***",
          bubblePoint: bubblePoint || "***",
          bookingCw: bookingCw || "***",
          bubblePointText: currentBubblePoint.label || "***",
          bookingVwrText: bookingVwr ? `1: ${bookingVwr}` : "***",
        },
      ];
    },
  },
  methods: {
    init() {
      const form = this.$utils.copyDataByKeys(this.order, OrderKeys);
      const {} = form;
      this.form = {
        ...form,
      };
    },
  },
};
</script>

<style lang="less" scoped>
.booking-table {
  border: 1px #000 solid;
  background: #fff;
  th,
  td {
    padding: 5px;
    border: 1px #e7e8ec solid;
    width: 160px;
  }
  /deep/.el-form-item {
    margin-bottom: 0;
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
}
</style>