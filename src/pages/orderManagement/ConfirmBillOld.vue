<template>
  <dc-universal-page class="confirm-bill" v-cloak>
    <div class="confirm-bill-wrap dc-custom-shadow">
      <section style="width: 800px">
        <header>
          <h1 style="padding-top: 0">
            订舱客户: {{ checkInfo.reconciliationUnit }}
          </h1>
        </header>
        <dc-primeval-table
          :columns="orderInfoColumns"
          :data="computedOrderInfoList"
          style="width: 100%"
        ></dc-primeval-table>
      </section>
      <section style="width: 800px">
        <header>
          <h1 style="text-align: center">费用明细单</h1>
        </header>
        <dc-primeval-table
          :columns="feeColumns"
          :data="computedFees"
          style="width: 100%"
        ></dc-primeval-table>
        <footer style="margin-top: 20px; font-size: 16px; font-weight: bold">
          <span>合计: </span>
          <span
            v-for="(item, index) in summationInfos"
            :key="index"
            style="margin-right: 20px"
          >
            <span>{{ item.currencyName }}: </span>
            <span>{{ item.totalOrgn }}</span>
            <span>{{ item.currencyCode }}</span>
          </span>
          <span style="color: red">合计人民币总费用: {{ totalCnyText }}</span>
        </footer>
      </section>
      <section class="billing-message-wrap">
        <header>
          <h1>收款信息</h1>
        </header>
        <ul style="font-size: 16px; line-height: 30px">
          <li>
            <span>公司开户名: </span>
            <span style="font-weight: bold"
              >{{collectionInfo.companyName}}</span
            >
            <span style="margin-left: 20px">开户行: </span>
            <span style="font-weight: bold">{{collectionInfo.bankName}}</span>
          </li>
          <li>
            <span>人民币账号: </span>
            <span style="font-weight: bold; color: red">{{collectionInfo.chineseBank}}</span>
            <span v-if="collectionInfo.americaBank" style="margin-left: 20px">美金账号: </span>
            <span v-if="collectionInfo.americaBank" style="font-weight: bold; color: red">{{collectionInfo.americaBank}}</span>
          </li>
        </ul>
      </section>
      <section>
        <header>
          <h1 style="text-align: center">开票申请</h1>
        </header>
        <dc-form size="mini" ref="form" :disabled="formDisabled">
          <div>
            <el-form-item>
              <template #label>
                <h1>开票方式</h1>
              </template>
              <el-radio-group v-model="order.merge" style="padding: 25px 0">
                <el-radio :label="0">月结开票</el-radio>
                <el-radio :label="1">单独开票</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="warning-tips">
            <i class="el-icon-warning-outline"></i>
            <ul>
              <li>
                1、一个币种最多可申请5个不同企业抬头的发票，发票金额可以自定义分配。
              </li>
              <li>2、不同币种需分开填写开票申请，不支持合并开票。</li>
              <li>3、请根据填写的发票信息对应付款。</li>
            </ul>
          </div>
          <h1>开票信息填写</h1>
          <section
            v-for="(item, index) in summationInfos"
            :key="index"
            class="currency-wrap"
          >
            <header class="wrap-header">
              <span>{{ item.currencyName }}账单</span>
              <span style="color: red; font-weight: bold">
                {{ item.totalOrgn }}
              </span>
              <span>{{ item.currencyCode }}</span>
            </header>
            <div
              v-for="(subItem, subIndex) in item.list"
              :key="subIndex"
              class="card-item"
            >
              <p class="card-index">
                <span>开票信息{{ subIndex + 1 }}</span>
                <i
                  class="el-icon-delete"
                  style="cursor: pointer; color: #f56c6c"
                  v-show="item.list.length > 1"
                  @click="delInvoiceItem(index, item, subIndex)"
                ></i>
              </p>
              <billing-info-card
                :company="{
                  companyId: $route.query.companyId,
                  companyName: checkInfo.reconciliationUnit,
                }"
                :disabled="formDisabled"
                ref="bill"
                :billingData="item"
                :invoiceData="subItem"
                :mails="mails"
                :invoices="invoices"
                @updateMails="getAllMails"
                @updateInvoices="getAllInvoices"
                @editInvoiceItem="
                  (newSubItem) =>
                    editInvoiceItem({ index, subIndex, item, newSubItem })
                "
              ></billing-info-card>
            </div>
            <el-form-item>
              <el-button
                type="primary"
                @click="addInvoiceItem({ index, item })"
                v-show="item.list.length < 5"
                >添加发票抬头</el-button
              >
            </el-form-item>
          </section>
        </dc-form>
      </section>
      <section class="bill-info">
        <div class="info-total">
          <p class="title">申请开票金额汇总</p>
          <div
            v-for="(item, index) in currencyApplyInfos"
            :key="index"
            class="total-item"
          >
            <span style="color: red">{{ item.invoicesTotal }}</span>
            <span>{{ item.currencyCode }}</span>
          </div>
        </div>
        <div style="margin-top: 10px; color: #e6a23c">
          提示：请在账单金额与申请开票金额一致后提交
        </div>
      </section>
      <footer class="page-footer">
        <el-button @click="exportBill">导出账单</el-button>
        <el-button
          type="primary"
          @click="invoiceApply"
          :disabled="invoiceApplyBtn.disabled"
          >{{ invoiceApplyBtn.text }}</el-button
        >
      </footer>
    </div>
  </dc-universal-page>
</template>

<script>
import DcStatus from "@/status";
export default {
  name: "ConfirmBill",
  created() {
    this.init();
  },
  data() {
    return {
      orderInfoColumns: [
        {
          prop: "waybillNo",
          label: "主单号",
        },
        {
          prop: "departureDate",
          label: "航班日期",
        },
        {
          prop: "fullLeg",
          label: "航线",
        },
        {
          prop: "jmt",
          label: "实际数据 (件 / 毛 / 体)",
        },
        {
          prop: "inboundCw",
          label: "计费重",
        },
      ],
      feeColumns: [
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
        {
          prop: "remark",
          label: "备注",
        },
      ],
      fees: [], // 费用列表
      order: {},
      summationInfos: [],
      checkInfo: {},
      collectionInfo:{},
      mails: [],
      invoices: [],
      currencyArray: this.$store.getters.getCurrencyAddValue,
    };
  },
  computed: {
    formDisabled() {
      return this.order.status === 1;
    },
    invoiceApplyBtn() {
      if (this.order.status !== 1) {
        return {
          text: "费用已确认，并提交开票",
          disabled: false,
        };
      } else {
        return {
          text: "费用已确认",
          disabled: true,
        };
      }
    },
    totalCnyText() {
      const { totalCny } = this.order;
      return `${totalCny}CNY`;
    },
    computedFees() {
      return this.fees.map((item) => {
        const { currency } = item;
        return {
          ...item,
          currencyText: DcStatus.commonStatus.getStatusNew(
            this.currencyArray,
            currency
          ).code,
        };
      });
    },
    orderInfoList() {
      return [this.checkInfo];
    },
    computedOrderInfoList() {
      return this.orderInfoList.map((item) => {
        const { inboundPiece, inboundWeight, inboundCbm } = item;
        return {
          ...item,
          jmt: `${inboundPiece} / ${inboundWeight} / ${inboundCbm}`,
        };
      });
    },
    computedInvoiceInfos() {
      const { orderId } = this.$route.query;
      return this.summationInfos
        .reduce((arr, item, index) => {
          arr.push(...item.list);
          return arr;
        }, [])
        .map((item) => {
          const {
            relaBiIaId,
            applyCurrency,
            applyAmountOrgn,
            invoiceType,
            invoiceTitle,
            invoiceInfoId,
            dutyParagraph,
            companyAddress,
            companyTel,
            accountBank,
            bankAccount,
            expressInfoId,
            recipient,
            recipientAddress,
            recipientEmail,
            recipientTel,
            id,
            invoiceRemark,
            taxableService,
          } = item;
          return {
            id,
            merge: this.order.merge,
            departureDate: this.checkInfo.departureDate,
            relaBiIaId,
            orderId,
            applyAmountOrgn,
            applyCurrency,
            invoiceType,
            invoiceTitle,
            invoiceInfoId,
            dutyParagraph,
            companyAddress,
            companyTel,
            accountBank,
            bankAccount,
            expressInfoId,
            recipient,
            recipientAddress,
            recipientEmail,
            recipientTel,
            invoiceRemark,
            taxableService,
          };
        });
    },
    currencyApplyInfos() {
      return this.summationInfos.map((item) => {
        const list = this.computedInvoiceInfos.filter(
          (invoice) => invoice.applyCurrency === item.currency
        );
        const invoicesTotal = list.reduce(
          (t, i) => (t += Number(i.applyAmountOrgn)),
          0
        );
        return {
          ...item,
          invoicesTotal,
        };
      });
    },
    isAllInvoiceMatch() {
      return this.currencyApplyInfos.every((item) => {
        return item.invoicesTotal === item.totalOrgn;
      });
    },
  },
  methods: {
    async init() {
      await this.getAllMails();
      await this.getAllInvoices();
      this.getBillDetail();
    },
    async getBillDetail() {
      const { billId, orderId } = this.$route.query;
      if ((!billId && Number(billId) !== 0) || !orderId) {
        this.$message.error("无效billId、orderId");
        return;
      }
      try {
        const {
          data: {
            data: {
              fees,
              checkInfo,
              apply,
              orderNo,
              status,
              summationInfos,
              totalCny,
              collectionInfo
            },
          },
        } = await this.$api.getBillDetail({
          billId,
          orderId,
        });
        this.order = {
          merge: 0,
          billId,
          orderId,
          orderNo,
          status,
          totalCny,
        };
        this.fees = fees;
        this.checkInfo = checkInfo;
        this.collectionInfo = collectionInfo || {};
        const mail = this.mails[0] || {};
        const invoice = this.invoices[0] || {};
        this.summationInfos = summationInfos.map((item) => {
          const { currency, totalOrgn } = item;
          const { name: currencyName, code: currencyCode } =
            DcStatus.commonStatus.getStatusNew(this.currencyArray, currency);
          const list = (() => {
            if (apply.length > 0) {
              return apply
                .filter((a) => a.applyCurrency === item.currency)
                .map((a) => {
                  const { recipient, recipientAddress, recipientTel } = a;
                  const recipientText = `${recipient}/${recipientTel}/${recipientAddress}`;
                  return {
                    ...a,
                    recipientText,
                  };
                });
            } else {
              return [
                {
                  invoiceType: 2,
                  taxableService: 0,
                  applyAmountOrgn: totalOrgn,
                  applyCurrency: currency,
                  ...invoice,
                  ...mail,
                },
              ];
            }
          })();
          return {
            ...item,
            currencyName,
            currencyCode,
            list,
          };
        });
      } catch (error) {}
    },
    editInvoiceItem({ index, subIndex, item, newSubItem }) {
      const list = item.list;
      list.splice(subIndex, 1, {
        ...newSubItem,
      });
      this.summationInfos.splice(index, 1, {
        ...item,
        list,
      });
    },
    addInvoiceItem({ index, item }) {
      const list = item.list;
      list.push({
        invoiceType: 2,
        taxableService: 0,
        applyAmountOrgn: "",
        applyCurrency: item.currency,
        invoiceTitle: "",
        invoiceInfoId: "",
        dutyParagraph: "",
        companyAddress: "",
        companyTel: "",
        accountBank: "",
        bankAccount: "",
        expressInfoId: "",
        recipient: "",
        recipientAddress: "",
        recipientEmail: "",
        recipientTel: "",
      });
      this.summationInfos.splice(index, 1, {
        ...item,
        list,
      });
    },
    delInvoiceItem(index, item, subIndex) {
      const list = item.list;
      list.splice(subIndex, 1);
      this.summationInfos.splice(index, 1, {
        ...item,
        list,
      });
    },
    async getAllMails() {
      const { companyId } = this.$route.query;
      if (!companyId) {
        this.$message.error("无效companyId");
        return;
      }
      try {
        const {
          data: { data },
        } = await this.$api.getAllMails({
          companyId,
        });
        this.mails = data.map((item) => {
          const { id, recipient, recipientAddress, recipientTel } = item;
          const recipientText = `${recipient}/${recipientTel}/${recipientAddress}`;
          delete item.id;
          return {
            ...item,
            expressInfoId: id,
            label: recipientText,
            value: id,
            recipientText,
          };
        });
      } catch (error) {}
    },
    async getAllInvoices() {
      const { companyId } = this.$route.query;
      if (!companyId) {
        this.$message.error("无效companyId");
        return;
      }
      try {
        const {
          data: { data },
        } = await this.$api.getAllInvoices({
          companyId,
        });
        this.invoices = data.map((item) => {
          const { id, invoiceTitle, remark } = item;
          delete item.id;
          return {
            ...item,
            invoiceInfoId: id,
            label: invoiceTitle,
            value: id,
            invoiceRemark: remark,
          };
        });
      } catch (error) {}
    },
    async invoiceApply() {
      if (!this.isAllInvoiceMatch) {
        this.$message.error(`开票金额与账单不符，开票提交失败`);
        return;
      }
      try {
        const billRefs = this.$refs.bill;
        for (let index = 0; index < billRefs.length; index++) {
          const billRef = billRefs[index];
          await billRef.submitForm();
        }
        const { billId, orderId } = this.$route.query;
        await this.$api.invoiceApply({
          billId,
          orderId,
          invoiceInfos: this.computedInvoiceInfos,
        });
        this.$message.success("提交成功");
        this.$bus.$emit("close-current-page");
      } catch (error) {}
    },
    async exportBill() {
      const { billId, orderId } = this.$route.query;
      try {
        const {
          data: { data },
        } = await this.$api.createBillPdf({
          billId,
          orderId,
        });
        this.$utils.downloadFile({ url: data, name: "开票账单" });
      } catch (error) {}
    },
  },
};
</script>

<style lang="less" scoped>
.confirm-bill {
  &-wrap {
    box-sizing: border-box;
    padding: 20px;
    background: #fff;
    // min-height: 100%;
  }
  /deep/.dc-primeval-table {
    background: #f6f6f6;
    table-layout: fixed;
    thead {
      color: #333;
      background: #f5f7fa;
    }
  }
  h1 {
    padding: 20px 0;
    font-size: 20px;
    font-weight: bold;
  }
  .warning-tips {
    position: relative;
    border-radius: 5px;
    padding: 20px 60px;
    font-size: 14px;
    line-height: 30px;
    color: #96792d;
    background: #f4edd6;
    i {
      position: absolute;
      left: 16px;
      top: 20px;
      font-size: 30px;
      color: #f56c6c;
    }
  }
  .billing-message-wrap {
  }
  .currency-wrap {
    margin-top: 20px;
    border: 1px solid #000;
    border-radius: 5px;
    padding: 20px;
    .wrap-header {
      display: inline-block;
      vertical-align: top;
      border-radius: 5px;
      padding: 10px 20px;
      background: #ddd;
    }
    .card-index {
      color: #e6a23c;
    }
    .card-item {
      margin-top: 10px;
      font-size: 16px;
      line-height: 30px;
    }
  }
  .bill-info {
    margin-top: 20px;
    font-weight: bold;
    font-size: 14px;
    .info-total {
      display: flex;
      .title {
        margin-right: 20px;
      }
      .total-item {
        &::after {
          margin: 0 5px;
          content: "+";
        }
        &:nth-last-of-type(1) {
          &::after {
            content: "";
          }
        }
      }
    }
  }
  .page-footer {
    margin-top: 20px;
    display: flex;
    align-items: center;
  }
}
</style>