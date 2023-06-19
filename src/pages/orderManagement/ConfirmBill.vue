<template>
  <dc-universal-page class="confirm-bill" v-cloak>
    <div class="confirm-bill-wrap dc-custom-shadow">
      <section style="width: 800px">
        <header>
          <h1 style="padding-top: 0">
            结算对象: {{ checkInfo.reconciliationUnit }}
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
          <h1>费用明细单</h1>
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
            <span style="font-weight: bold">{{
              collectionInfo.companyName
            }}</span>
            <span style="margin-left: 20px">开户行: </span>
            <span style="font-weight: bold">{{ collectionInfo.bankName }}</span>
          </li>
          <li>
            <span>人民币账号: </span>
            <span style="font-weight: bold; color: red">{{
              collectionInfo.chineseBank
            }}</span>
            <span v-if="collectionInfo.americaBank" style="margin-left: 20px"
              >美金账号:
            </span>
            <span
              v-if="collectionInfo.americaBank"
              style="font-weight: bold; color: red"
              >{{ collectionInfo.americaBank }}</span
            >
          </li>
        </ul>
      </section>
      <section>
        <header>
          <h1 style="text-align: center">开票申请</h1>
        </header>
        <h1>开票方式</h1>
        <dc-form size="mini" ref="form" :disabled="formDisabled">
          <div
            style="border: 1px solid #000;border-radius: 5px;padding:20px 10px;"
          >
            <el-form-item label="申请类型" required>
              <el-radio-group v-model="order.merge">
                <el-radio :label="0">月结开票</el-radio>
                <el-radio :label="1">单独开票</el-radio>
                <!-- <el-radio :label="2">DEBIT NOTE</el-radio> -->
              </el-radio-group>
            </el-form-item>
            <el-form-item label="开票方式" required>
              <el-radio-group
                v-model="order.applyType"
                @change="changeApplyType"
              >
                <el-radio :label="0">不同币种分开开票</el-radio>
                <el-radio :label="1">多币种一起开票 </el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <h1>开票信息填写</h1>
          <template v-if="order.applyType == 0">
            <section
              v-for="(item, index) in summationInfos"
              :key="index"
              class="currency-wrap"
            >
              <header class="wrap-header">
                <span>{{ item.currencyName }}</span>
                <span style="color: red; font-weight: bold">
                  {{ item.totalOrgn }}
                </span>
                <span>{{ item.currencyCode }}</span>
              </header>
              <el-button
                type="primary"
                size="mini"
                round
                @click="addInvoiceItem({ index, item })"
                v-show="item.list.length < 5"
                >添加另一抬头发票</el-button
              >
              <div
                v-for="(subItem, subIndex) in item.list"
                :key="subIndex"
                class="card-item"
              >
                <p class="card-index">
                  <span>开票信息{{ subIndex + 1 }}</span>
                  <i
                    class="el-icon-delete"
                    style="cursor: pointer; color: #409eff"
                    v-show="item.list.length > 1"
                    @click="delInvoiceItem(index, item, subIndex)"
                  ></i>
                </p>
                <billing-info-card
                  :company="{
                    companyId: $route.query.companyId,
                    companyName: checkInfo.reconciliationUnit
                  }"
                  :disabled="formDisabled"
                  ref="bill"
                  :targetIdx="subIndex + 1"
                  :billingData="item"
                  :invoiceData="subItem"
                  :mails="mails"
                  :invoices="invoices"
                  @updateMails="getAllMails"
                  @updateInvoices="getAllInvoices"
                  @editInvoiceItem="
                    newSubItem =>
                      editInvoiceItem({ index, subIndex, item, newSubItem })
                  "
                ></billing-info-card>
              </div>
            </section>
          </template>
          <template v-else>
            <section :key="index" class="currency-wrap">
              <header class="wrap-header">
                <span>合计人民币总费用:</span>
                <span style="color: red; font-weight: bold">
                  {{ totalCnyText.slice(0, -3) }}
                </span>
                <span>CNY</span>
              </header>
              <div class="card-item">
                <billing-info-card
                  :company="{
                    companyId: $route.query.companyId,
                    companyName: checkInfo.reconciliationUnit
                  }"
                  :disabled="formDisabled"
                  ref="bill"
                  :multiplyInvo="true"
                  :invoiceData="multplyInvoMes"
                  :mails="mails"
                  :invoices="invoices"
                  @updateMails="getAllMails"
                  @updateInvoices="getAllInvoices"
                  @multpleEditInvo="multpleEditInvo"
                ></billing-info-card>
              </div>
            </section>
          </template>
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
          @click="invoiceStatus == 2 ? invoiceApply() : revokeApply()"
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
          label: "主单号"
        },
        {
          prop: "departureDate",
          label: "航班日期"
        },
        {
          prop: "fullLeg",
          label: "航线"
        },
        {
          prop: "jmt",
          label: "实际数据 (件 / 毛 / 体)"
        },
        {
          prop: "inboundCw",
          label: "计费重"
        }
      ],
      feeColumns: [
        {
          prop: "expenseName",
          label: "费用项目"
        },
        {
          prop: "price",
          label: "单价"
        },
        {
          prop: "quantity",
          label: "数量"
        },
        {
          prop: "exchangeRate",
          label: "汇率"
        },
        {
          prop: "totalOrgn",
          label: "总费用"
        },
        {
          prop: "currencyText",
          label: "币种"
        },
        {
          prop: "remark",
          label: "备注"
        }
      ],
      fees: [], // 费用列表
      order: {},
      summationInfos: [],
      checkInfo: {},
      collectionInfo: {},
      mails: [],
      invoices: [],
      currencyArray: this.$store.getters.getCurrencyAddValue,
      invoiceStatus: 2,
      multplyInvoMes: {}
    };
  },
  computed: {
    formDisabled() {
      return this.invoiceStatus === 3 || this.invoiceStatus === 4;
    },
    invoiceApplyBtn() {
      if (this.invoiceStatus == 2) {
        return {
          text: "费用已确认，并提交开票"
        };
      } else {
        return {
          text: "撤回申请"
        };
      }
    },
    totalCnyText() {
      const { totalCny } = this.order;
      return `${totalCny}CNY`;
    },
    computedFees() {
      return this.fees.map(item => {
        const { currency } = item;
        return {
          ...item,
          currencyText: DcStatus.commonStatus.getStatusNew(
            this.currencyArray,
            currency
          ).code
        };
      });
    },
    orderInfoList() {
      return [this.checkInfo];
    },
    computedOrderInfoList() {
      return this.orderInfoList.map(item => {
        const { inboundPiece, inboundWeight, inboundCbm } = item;
        return {
          ...item,
          jmt: `${inboundPiece} / ${inboundWeight} / ${inboundCbm}`
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
        .map(item => {
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
            taxableService
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
            taxableService
          };
        });
    },
    currencyApplyInfos() {
      return this.summationInfos.map(item => {
        const list = this.computedInvoiceInfos.filter(
          invoice => invoice.applyCurrency === item.currency
        );
        const invoicesTotal = list.reduce(
          (t, i) => (t += Number(i.applyAmountOrgn)),
          0
        );
        return {
          ...item,
          invoicesTotal
        };
      });
    },
    isAllInvoiceMatch() {
      return this.currencyApplyInfos.every(item => {
        return item.invoicesTotal === item.totalOrgn;
      });
    }
  },
  methods: {
    revokeApply() {
      this.$confirm("确认撤回申请？")
        .then(_ => {
          this.$http
            .post(
              this.$service.cancelInvoiceApply +
                `?billId=${this.$route.query.billId}`
            )
            .then(res => {
              if (res.code == 200) {
                this.$message.success("成功撤回申请");
                this.$router.go(-1);
              }
            });
        })
        .catch(_ => {});
    },
    multpleEditInvo(val) {
      Object.assign(this.multplyInvoMes, val);
    },
    changeApplyType(v) {
      if (v == 1) {
        this.multplyInvoMes = {
          applyAmountOrgn: this.order.totalCny,
          applyCurrency: 1,
          invoiceRemark: "无",
          invoiceType: 2,
          selfDefine: false,
          taxableService: 0
        };
      } else {
        this.multplyInvoMes = {};
      }
    },
    async init() {
      await this.getAllMails();
      await this.getAllInvoices();
      this.getBillDetail();
    },
    async getBillDetail() {
      const { billId, orderId, companyId, invoStatus } = this.$route.query;
      this.invoiceStatus = invoStatus;
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
            }
          }
        } = await this.$api.getBillDetail({
          billId,
          orderId,
          settlementCompanyId: companyId
        });
        this.order = {
          merge: 0,
          billId,
          orderId,
          orderNo,
          status,
          totalCny,
          applyType: apply[0] && apply[0].applyType ? apply[0].applyType : 0
        };
        this.fees = fees;
        this.checkInfo = checkInfo;
        this.collectionInfo = collectionInfo || {};
        const mail = {};
        const invoice = {};
        this.summationInfos = summationInfos.map(item => {
          const { currency, totalOrgn } = item;
          const {
            name: currencyName,
            code: currencyCode
          } = DcStatus.commonStatus.getStatusNew(this.currencyArray, currency);
          const list = (() => {
            if (apply.length > 0) {
              return apply
                .filter(a => a.applyCurrency === item.currency)
                .map(a => {
                  const { recipient, recipientAddress, recipientTel } = a;
                  const recipientText = `${recipient}/${recipientTel}/${recipientAddress}`;
                  return {
                    ...a,
                    recipientText,
                    selfDefine: false
                  };
                });
            } else {
              return [
                {
                  invoiceType: 2,
                  taxableService: 0,
                  applyAmountOrgn: totalOrgn,
                  applyCurrency: currency,
                  selfDefine: false,
                  ...invoice,
                  ...mail,
                  invoiceRemark: "无"
                }
              ];
            }
          })();
          return {
            ...item,
            currencyName,
            currencyCode,
            list
          };
        });
      } catch (error) {}
      if (this.order.applyType == 1) {
        this.multplyInvoMes = this.summationInfos[0].list[0];
      }
    },
    editInvoiceItem({ index, subIndex, item, newSubItem }) {
      const list = item.list;
      list.splice(subIndex, 1, {
        ...newSubItem
      });
      this.summationInfos.splice(index, 1, {
        ...item,
        list
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
        recipientTel: ""
      });
      this.summationInfos.splice(index, 1, {
        ...item,
        list
      });
    },
    delInvoiceItem(index, item, subIndex) {
      const list = item.list;
      list.splice(subIndex, 1);
      this.summationInfos.splice(index, 1, {
        ...item,
        list
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
          data: { data }
        } = await this.$api.getAllMails({
          companyId
        });
        this.mails = data.map(item => {
          const {
            id,
            recipient,
            recipientAddress,
            recipientTel,
            recipientEmail
          } = item;
          const recipientText = `${recipient}/${recipientTel}/${recipientEmail}/${recipientAddress}`;
          delete item.id;
          return {
            ...item,
            expressInfoId: id,
            label: recipientText,
            value: id,
            recipientText
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
          data: { data }
        } = await this.$api.getAllInvoices({
          companyId
        });
        this.invoices = data.map(item => {
          const { id, invoiceTitle, remark, dutyParagraph } = item;
          delete item.id;
          return {
            ...item,
            invoiceInfoId: id,
            label: invoiceTitle + "/" + dutyParagraph,
            value: id,
            invoiceRemark: remark
          };
        });
      } catch (error) {}
    },
    async invoiceApply() {
      if (!this.isAllInvoiceMatch) {
        this.$message.error(`填写的开票金额与账单金额必须相等，请重新填写`);
        return;
      }
      try {
        const billRefs = this.$refs.bill;
        for (let index = 0; index < billRefs.length; index++) {
          const billRef = billRefs[index];
          await billRef.submitForm();
        }
        const { billId, orderId, companyId } = this.$route.query;
        await this.$api.invoiceApply({
          applyType: this.order.applyType,
          billId,
          orderId,
          settlementCompanyId: companyId,
          invoiceInfos:
            this.order.applyType == 0
              ? this.computedInvoiceInfos
              : [
                  Object.assign({}, this.multplyInvoMes, {
                    orderId,
                    merge: this.order.merge
                  })
                ]
        });
        this.$message.success("提交成功");
        // this.$bus.$emit("close-current-page");
        this.$router.go(-1);
      } catch (error) {}
    },
    async exportBill() {
      const { billId, orderId, companyId } = this.$route.query;
      try {
        const {
          data: { data }
        } = await this.$api.createBillPdf({
          billId,
          orderId,
          settlementCompanyId: companyId
        });
        this.$utils.downloadFile({ url: data, name: "开票账单" });
      } catch (error) {}
    }
  }
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
      line-height: 10px;
      padding: 10px 0;
      margin-right: 20px;
      font-size: 19px;
      font-weight: bold;
    }
    .card-index {
      color: #409eff;
      margin: 10px 0;
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
