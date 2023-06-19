<template>
  <!-- 发票详情 -->
  <dc-universal-page class="invoice-detail" v-cloak v-if="detail">
    <div class="invoice-detail-wrap dc-custom-shadow">
      <section>
        <header>
          <h1>
            <span>结算对象: </span>
            <span>{{ computedDetail.companyName }}</span>
          </h1>
          <h1>
            <span>发票抬头: </span>
            <span>{{ computedDetail.invoiceTitle }}</span>
            <el-tooltip
              class="item"
              effect="light"
              placement="right"
              popper-class="invoice-tooltip"
            >
              <div slot="content" class="invoice-tooltip-content">
                <div class="row">
                  <span class="row-title">发票抬头</span>
                  <span>{{ computedDetail.invoiceTitle }}</span>
                </div>
                <div class="row">
                  <span class="row-title">纳税人识别号</span>
                  <span>{{ computedDetail.dutyParagraph }}</span>
                </div>
                <div class="row">
                  <span class="row-title">公司地址</span>
                  <span>{{ computedDetail.companyAddress }}</span>
                </div>
                <div class="row">
                  <span class="row-title">公司电话</span>
                  <span>{{ computedDetail.companyTel }}</span>
                </div>
                <div class="row">
                  <span class="row-title">开户行</span>
                  <span>{{ computedDetail.accountBank }}</span>
                </div>
                <div class="row">
                  <span class="row-title">银行账号</span>
                  <span>{{ computedDetail.bankAccount }}</span>
                </div>
              </div>
              <el-button type="text">抬头详情</el-button>
            </el-tooltip>
          </h1>
        </header>
        <h3>
          <span>开票状态: </span>
          <span>{{ computedDetail.invoicingStatusText }}</span>
        </h3>
        <h3>
          <span>申请开票金额: </span>
          <span class="warning-text">{{
            computedDetail.applyAmountOrgnText
          }}</span>
        </h3>
        <h3>
          <span>已开票金额: </span>
          <span class="warning-text"
            >{{ computedDetail.invoicedAmount }} CNY</span
          >
        </h3>
      </section>
      <section>
        <header>
          <h1>
            <span>发票信息</span>
            <el-button
              type="primary"
              size="mini"
              style="margin-left: 20px"
              @click="downloadInvoiceZip"
              >下载电子发票</el-button
            >
          </h1>
        </header>

        <h3>
          <span>发票金额: </span>
          <span class="warning-text">{{
            computedDetail.applyAmountOrgnText
          }}</span>
        </h3>
        <h3>
          <span>发票类型: </span>
          <span>{{ computedDetail.invoiceTypeText }}</span>
        </h3>
        <!-- <h3>
          <span>发票币种: </span>
          <span class="warning-text">{{
            computedDetail.applyCurrencyText
          }}</span>
        </h3> -->
        <dc-primeval-table
          style="margin-top: 20px"
          :data="computedInvoiceList"
          :columns="invoiceColumns"
        />
      </section>
      <section>
        <header>
          <h1>账单信息</h1>
        </header>
        <dc-primeval-table
          :data="computedOrderInfoList"
          :columns="billColumns"
        />
      </section>
    </div>
  </dc-universal-page>
</template>

<script>
import DcStatus from "@/status";
export default {
  name: "InvoiceDetail",
  created() {
    this.init();
  },
  data() {
    return {
      detail: null,
      invoiceColumns: [
        {
          prop: "invoiceNum",
          label: "发票号",
          width: "100px"
        },
        {
          prop: "invoiceAmountText",
          label: "发票金额",
          width: "100px"
        },
        {
          prop: "createTime",
          label: "开票时间",
          width: "150px"
        },
        {
          prop: "invoiceStatusText",
          label: "发票状态",
          width: "100px"
        }
      ],
      billColumns: [
        {
          prop: "orderNo",
          label: "订单号",
          width: "150px"
        },
        {
          prop: "waybillNo",
          label: "运单号",
          width: "150px"
        },
        {
          prop: "airline",
          label: "航线",
          width: "100px"
        },
        {
          prop: "departureDate",
          label: "航班日期",
          width: "100px"
        },
        {
          prop: "amountOrgnText",
          label: "账单金额",
          width: "100px"
        }
      ],
      invoicingStatusList: [
        { value: 0, label: "未开票" },
        { value: 1, label: "部分开票" },
        { value: 2, label: "已开票" }
      ]
      // currencyArray: this.$store.getters.getCurrencyAddValue,
    };
  },
  computed: {
    currencyArray() {
      return this.$store.getters.getCurrencyAddValue;
    },
    applyId() {
      return this.$route.query.id;
    },
    computedDetail() {
      const { getStatus, getStatusNew } = DcStatus.commonStatus;
      const {
        invoicingStatus,
        applyAmountOrgn,
        applyCurrency,
        invoiceType
      } = this.detail;
      const currentCurrency =
        getStatusNew(this.currencyArray, applyCurrency) || {};
      return {
        ...this.detail,
        invoicingStatusText: (
          this.invoicingStatusList.find(i => i.value === invoicingStatus) || {}
        ).label,
        applyCurrencyText: currentCurrency.code,
        invoiceTypeText: (getStatus("invoiceTypes", Number(invoiceType)) || {})
          .shortName,
        applyAmountOrgnText: `${applyAmountOrgn} ${currentCurrency.label}`
      };
    },
    computedInvoiceList() {
      return this.detail.invoiceList.map(item => {
        const { invoiceStatus, invoiceAmount } = item;
        return {
          ...item,
          invoiceStatusText: {
            0: "已开票",
            1: "已作废"
          }[invoiceStatus],
          invoiceAmountText: `￥${invoiceAmount}`
        };
      });
    },
    computedOrderInfoList() {
      return this.detail.orderInfoList.map(item => {
        const { getStatus, getStatusNew } = DcStatus.commonStatus;
        const { pol, pod, amountOrgn, currency } = item;
        const currentCurrency =
          getStatusNew(this.currencyArray, currency) || {};
        return {
          ...item,
          airline: `${pol}-${pod}`,
          amountOrgnText: `${currentCurrency.symbol}${amountOrgn}`
        };
      });
    }
  },
  methods: {
    init() {
      this.getInvoiceManageDetail();
    },
    async getInvoiceManageDetail() {
      if (!this.applyId) {
        return;
      }
      try {
        const {
          data: { data }
        } = await this.$api.getInvoiceManageDetail({
          params: {
            applyId: this.applyId
          },
          loading: true
        });
        this.detail = data;
      } catch (error) {
        console.error(error);
      }
    },
    async downloadInvoiceZip() {
      try {
        const { data } = await this.$api.downloadInvoiceZip(
          {},
          {
            params: {
              applyId: this.applyId
            },
            responseType: "arraybuffer",
            loading: true
          }
        );
        this.$utils.exportBuffer({
          buffer: data,
          exportName: "发票.zip"
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.invoice-detail {
  &-wrap {
    box-sizing: border-box;
    padding: 20px;
    background: #fff;
    // min-height: 100%;
  }
  h1 {
    padding: 10px 0;
    font-size: 20px;
    font-weight: bold;
  }
  h3 {
    padding: 4px 0;
    font-size: 14px;
    font-weight: bold;
  }
  /deep/.dc-primeval-table {
    background: #f6f6f6;
    table-layout: fixed;
    thead {
      color: #333;
      background: #f5f7fa;
    }
  }
  .warning-text {
    color: #e6a23c;
  }
}
</style>
