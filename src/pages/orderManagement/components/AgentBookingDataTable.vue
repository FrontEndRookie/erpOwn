<template>
  <dc-primeval-table
    :data="computedList"
    :columns="columns"
    style="width: 400px"
  >
    <template #costBubblePoint="{ row }">
      <div v-auth-field:[row.costBubblePointText]="['101530_FC']">
        <el-select
          size="mini"
          v-model="form.costBubblePoint"
          placeholder="请选择分泡比例"
          style="width: 100px"
          @change="(val) => $emit('orderCostBubblePointChange', val)"
        >
          <el-option
            v-for="item in bubblePoints"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </template>
  </dc-primeval-table>
</template>

<script>
import DcStatus from "@/status";
// 需要父子通信的数据
const OrderKeys = [
  "bookingPiece", // 件数
  "bookingWeight", // 毛重
  "bookingCbm", // 体积
  "bookingVwr", // 比重
  "costBubblePoint", // 成本分泡比例
];
export default {
  name: "AgentBookingDataTable",
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
    const { bubblePoints } = DcStatus.commonStatus;
    return {
      bubblePoints,
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
          prop: "costBubblePoint",
          label: "代理分泡",
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
        costBubblePoint,
      } = this.form;
      const currentBubblePoint =
        DcStatus.commonStatus.getStatus("bubblePoints", costBubblePoint) || {};
      return [
        {
          bookingPiece: bookingPiece || "***",
          bookingWeight: bookingWeight || "***",
          bookingCbm: bookingCbm || "***",
          bookingVwr: bookingVwr || "***",
          costBubblePoint: costBubblePoint || "***",
          costBubblePointText: currentBubblePoint.label || "***",
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
    formValidate() {
      const formData = this.getFormData();
      return Promise.resolve(formData);
    },
    getFormData() {
      const order = this.$utils.copyDataByKeys(this.order, OrderKeys);
      const form = Object.entries(order).reduce((obj, [key, val]) => {
        if (
          val !== this.form[key] &&
          val !== Number(this.form[key]) &&
          this.form[key] !== "null" &&
          this.form[key] !== null
        ) {
          obj = {
            ...obj,
            [key]: this.form[key],
          };
        }
        return obj;
      }, {});
      return form;
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