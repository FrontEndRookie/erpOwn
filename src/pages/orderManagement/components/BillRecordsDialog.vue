<template>
  <!-- 账单记录弹窗 -->
  <el-dialog
    title="账单修改记录"
    class="bill-records-dialog"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="1000px"
    @closed="$emit('closeEv')"
  >
    <ul style="padding: 20px 0">
      <li
        v-for="(record, recordIndex) in computedRecords"
        :key="`${record}-${recordIndex}`"
        class="bill-records-item"
      >
        <div style="font-weight: bold; color: #02aff0">
          {{ record.checkTime }}
        </div>
        <dc-primeval-table
          :data="record.list"
          :columns="columns"
          style="margin-top: 10px; width: 100%"
        />
        <div style="margin-top: 20px; font-weight: bold">
          <span>合计: </span>
          <template v-for="(to, toIndex) in record.totalOrgns">
            <span :key="toIndex" style="margin-right: 10px">
              <span>{{ to.currencyName }}</span>
              <span style="color: red">{{ `${to.amount}${to.currencyCode}` }}</span>
            </span>
          </template>
          <span>合计人民币总费用: </span>
          <span style="color: red">{{ record.totalCny }}CNY</span>
        </div>
      </li>
    </ul>
  </el-dialog>
</template>

<script>
import DcStatus from "@/status";
export default {
  name: "BillRecordsDialog",
  props: {
    records: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    this.visible = true;
  },
  data() {
    return {
      visible: false,
      columns: [
        {
          prop: "expenseName",
          label: "费用项目",
        },
        {
          prop: "price",
          label: "单价",
        },
        {
          prop: "quantity",
          label: "数量",
        },
        {
          prop: "exchangeRate",
          label: "汇率",
        },
        {
          prop: "totalOrgn",
          label: "总费用",
        },
        {
          prop: "currencyText",
          label: "币种",
        },
      ],
      currencyArray: this.$store.getters.getCurrencyAddValue,
    };
  },
  computed: {
    computedRecords() {
      return this.records.map((item) => {
        const { billCheckRecords, totalOrgn } = item;
        return {
          ...item,
          totalOrgns: JSON.parse(totalOrgn).map(to => {
            const { name: currencyName, code: currencyCode } = DcStatus.commonStatus.getStatusNew(
              this.currencyArray,
              to.currency
            );
            return {
              ...to,
              currencyName,
              currencyCode,
            }
          }),
          list: billCheckRecords.map((record) => {
            const { currency } = record;
            const { code: currencyText } = DcStatus.commonStatus.getStatusNew(
              this.currencyArray,
              currency
            );
            return {
              ...record,
              currencyText,
            };
          }),
        };
      });
    },
  },
};
</script>

<style lang="less" scoped>
.bill-records-dialog {
  .bill-records-item {
    margin-top: 20px;
    &:nth-of-type(1) {
      margin-top: 0;
    }
  }
}
</style>