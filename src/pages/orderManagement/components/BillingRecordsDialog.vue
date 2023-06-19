<template>
  <!-- 开票记录弹窗 -->
  <el-dialog
    class="billing-records-dialog"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="1000px"
    @closed="$emit('closeEv')"
  >
    <template slot="title">
      <span class="el-dialog__title">开票记录</span>
      <span v-if="invoiceError" :style="{ color: invoiceError ? '#d53116' : '' }">（标红为开票异常数据，请处理）</span>
    </template>
    <div style="padding: 20px 0">
      <dc-primeval-table
        :data="computedRecords"
        :columns="columns"
        style="width: 100%"
      />
    </div>
  </el-dialog>
</template>

<script>
import DcStatus from "@/status";
export default {
  name: "BillingRecordsDialog",
  props: {
    records: {
      type: Array,
      default: () => [],
    },
    invoiceError: {
      type: Boolean,
      default: false,
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
          prop: "invoiceTitle",
          label: "开票抬头",
        },
        {
          prop: "invoiceTypeText",
          label: "开票类型",
        },
        {
          prop: "applyCurrencyText",
          label: "开票币种",
        },
        {
          prop: "mergeText",
          label: "开票方式",
        },
        {
          prop: "applyAmountOrgnText",
          label: "申请开票金额",
        },
        {
          prop: "invoicedAmountCnyText",
          label: "已开票金额",
        },
      ],
      currencyArray: this.$store.getters.getCurrencyAddValue,
    };
  },
  computed: {
    computedRecords() {
      return this.records.map((item) => {
        const {
          invoiceType,
          applyCurrency,
          merge,
          applyAmountOrgn,
          invoicedAmountCny,
          invoiceError,
        } = item;
        const { code: applyCurrencyText, symbol: currencySymbol } =
          DcStatus.commonStatus.getStatusNew(this.currencyArray, applyCurrency);
        return {
          ...item,
          invoiceTypeText: DcStatus.commonStatus.getStatus(
            "invoiceTypes",
            invoiceType
          ).shortName,
          applyCurrencyText,
          mergeText: DcStatus.commonStatus.getStatus("merges", merge)
            .billingRecordsName,
          applyAmountOrgnText: `${currencySymbol}${applyAmountOrgn}`,
          invoicedAmountCnyText: `￥${invoicedAmountCny}`,
          style: invoiceError && `background-color: #d53116; color: #fff;`,
        };
      });
    },
  },
};
</script>

<style lang="less" scoped>
.billing-records-dialog {
}
</style>