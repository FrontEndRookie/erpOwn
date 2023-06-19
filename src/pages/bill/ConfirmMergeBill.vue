<template>
  <!-- 确认合并对账并开票 -->
  <dc-universal-page class="confirm-merge-bill" v-cloak>
    <div class="bodyC">
      <div class="box">
        <div class="litle1">
          <span class="HF">
            结算对象：
          </span>
          <span>
            {{ billDetail.companyName }}
          </span>
        </div>
        <div class="textLine">
          <span class="HF"
            >待申请开票订单数量：{{ billDetail.orderCount }}单</span
          >
        </div>
        <div class="textLine">
          <span class="HF">合计： </span>
          <span
            class="HF"
            v-for="item in summationInfos"
            :key="item.currencyCode"
          >
            {{ item.currencyName }}
            {{ item.totalOrgn }}
            {{ item.currencyCode }}
            &emsp;
          </span>
        </div>
        <div class="textLine">
          <span class="HF red"
            >合计人民币总费用：<span> {{ billDetail.totalCny }}CNY</span>
          </span>
        </div>
      </div>
      <div class="box">
        <div class="litle1">
          <span class="HF">
            收款信息
          </span>
        </div>
        <div class="textLine">
          <span
            >公司开户名:
            <span class="HF">{{ orderCollectionInfo.companyName }}</span></span
          >
          <span style="margin-left:40px"
            >开户行:
            <span class="HF">{{ orderCollectionInfo.bankName }}</span></span
          >
        </div>
        <div class="textLine">
          <span
            >人民币账号:
            <span class="HF red">{{
              orderCollectionInfo.chineseBank
            }}</span></span
          >
          <span style="margin-left:40px"
            >美金账号:
            <span class="HF red">{{
              orderCollectionInfo.americaBank
            }}</span></span
          >
        </div>
      </div>
      <div class="box">
        <div class="warnTag felx_row">
          <i class="el-icon-warning-outline red"></i>
          <span>注意：批量申请开票不支持同一币种开多个抬头的发票！</span>
        </div>
      </div>
      <div class="box">
        <div class="litle1">
          <span class="HF">
            开票申请
          </span>
          <table border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td class="th1">
                <span class="redxing">*</span><span> 申请类型：</span>
              </td>
              <td class="th2">
                <el-radio-group v-model="applyBilling.merge">
                  <el-radio :label="0">月结开票</el-radio>
                  <el-radio :label="1">单独开票</el-radio>
                  <!-- <el-radio :label="2">DEBIT NOTE</el-radio> -->
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <td class="th1">
                <span class="redxing">*</span><span> 开票方式：</span>
              </td>
              <td class="th2">
                <el-radio-group
                  @change="billingMethodChange(applyBilling.applyType)"
                  v-model="applyBilling.applyType"
                >
                  <el-radio :label="0">不同币种分开开票</el-radio>
                  <!-- <el-radio :label="1">多币种一起开票</el-radio> -->
                </el-radio-group>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div
        class="box"
        v-for="(item, index) in summationInfos"
        :key="item.currencyCode"
      >
        <div class="litle2">
          <span class="HF">
            {{ item.currencyName }}
          </span>
          <span class="HF red">
            {{ item.totalOrgn }}
          </span>
          <span class="HF">
            {{ item.currencyCode }}
          </span>
        </div>
        <div
          v-for="(subItem, subIndex) in item.list"
          :key="subIndex"
          class="card-item"
        >
          <p class="card-index">
            <!-- <span>开票信息{{ subIndex + 1 }}</span> -->
            <i
              class="el-icon-delete"
              style="cursor: pointer; color: #f56c6c"
              v-show="item.list.length > 1"
              @click="delInvoiceItem(index, item, subIndex)"
            ></i>
          </p>
          <billing-info-card-new
            :company="{
              companyId: companyId,
              companyName: billDetail.companyName
            }"
            ref="bill"
            :disabled="false"
            :billingData="item"
            :invoiceData="subItem"
            :mails="mails"
            :invoices="invoices"
            :applyType="applyBilling.applyType"
            @updateMails="getAllMails"
            @updateInvoices="getAllInvoices"
            @editInvoiceItem="
              newSubItem =>
                editInvoiceItem({ index, subIndex, item, newSubItem })
            "
          ></billing-info-card-new>
        </div>
      </div>
    </div>
    <div class="confirm-merge-bill-wrap dc-custom-shadow">
      <section class="bill-info">
        <div class="info-total">
          <p class="title">申请开票金额汇总</p>
          <template v-if="applyBilling.applyType == '0'">
            <div
              v-for="(item, index) in currencyApplyInfos"
              :key="index"
              class="total-item"
            >
              <span style="color: red">{{ item.invoicesTotal }}</span>
              <span>{{ item.currencyCode }}</span>
            </div>
          </template>
          <template v-else-if="applyBilling.applyType == 1">
            <div>
              <span style="color: red">{{ billDetail.totalCny }}</span>
              <span>CNY</span>
            </div>
          </template>
        </div>
        <div style="margin-top: 10px; color: #e6a23c">
          提示：请在账单金额与申请开票金额一致后提交
        </div>
      </section>
      <footer class="page-footer">
        <el-button type="primary" @click="invoiceApply"
          >确认对账并提交开票</el-button
        >
      </footer>
    </div>
  </dc-universal-page>
</template>

<script>
import DcStatus from "@/status";
export default {
  name: "ConfirmMergeBill",
  created() {
    this.init();
  },
  data() {
    return {
      orderCollectionInfo: {},
      applyBilling: {
        merge: 0, // 开票方式不得为空
        applyType: 0 // 申请开票方式
      },
      billDetail: {
        companyName: "",
        totalOrgn: "[]",
        orderCount: 0
      },
      summationInfosAll: [],
      summationInfosOne: [],
      summationInfos: [],
      mails: [],
      invoices: [],
      currencyArray: this.$store.getters.getCurrencyAddValue
    };
  },
  computed: {
    companyId() {
      return this.$route.query.companyId;
    },
    billIds() {
      return JSON.parse(sessionStorage.getItem("dc_merge_bill_ids")) || [];
    },
    expenseUnitIdList() {
      return JSON.parse(sessionStorage.getItem("dc_merge_expense_ids")) || [];
    },
    rcvRecordIdList() {
      return JSON.parse(sessionStorage.getItem("dc_merge_record_ids")) || [];
    },
    expenseUnitNameList() {
      return (
        JSON.parse(sessionStorage.getItem("dc_merge_expense_unitName")) || []
      );
    },
    totalOrgnText() {
      const { getStatus, getStatusNew } = DcStatus.commonStatus;
      return JSON.parse(this.billDetail.totalOrgn)
        .map(item => {
          const currencyObj = getStatusNew(this.currencyArray, item.currency);
          return `<span style="color: red;">${item.amount}</span> <span>${currencyObj.code}</span>`;
        })
        .join(" + ");
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
            invoiceTitleCopy, // 新增
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
            relaBiIaId,
            orderId,
            applyAmountOrgn,
            applyCurrency,
            invoiceType,
            invoiceTitle,
            invoiceTitleCopy,
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
    async init() {
      if (this.billIds.length <= 0) {
        this.$message.error("无效的账单id");
        return;
      }
      if (!this.companyId) {
        this.$message.error("无效companyId");
        return;
      }

      this.getMergeBillDetail();
    },
    async getMergeBillDetail() {
      try {
        const {
          data: { data }
        } = await this.$api.getMergeBillDetail(
          {
            orderIds: this.billIds,
            expenseUnitIdList: this.expenseUnitIdList,
            rcvRecordIdList: this.rcvRecordIdList,
            expenseUnitNameList: this.expenseUnitNameList
          },
          {
            loading: true
          }
        );
        await this.getAllMails();
        await this.getAllInvoices();
        this.billDetail = data;
        this.orderCollectionInfo = data.collectionInfo;
        const mail = this.mails[0] || {};
        const invoice = this.invoices[0] || {};
        this.summationInfos = JSON.parse(data.totalOrgn).map(item => {
          const { currency, amount: totalOrgn } = item;
          const {
            name: currencyName,
            code: currencyCode
          } = DcStatus.commonStatus.getStatusNew(this.currencyArray, currency);
          const list = [
            {
              remarkButtonType: true,
              invoiceRemark: "",
              invoiceType: 2,
              taxableService: 0,
              applyAmountOrgn: totalOrgn,
              applyCurrency: currency,
              ...invoice,
              ...mail
            }
          ];
          return {
            ...item,
            currencyName,
            currencyCode,
            list,
            totalOrgn
          };
        });
        this.summationInfosAll = JSON.parse(
          JSON.stringify(this.summationInfos)
        );
        this.summationInfosOne = JSON.parse(
          JSON.stringify(this.summationInfos)
        ).slice(0, 1);
        this.summationInfosOne[0].currencyName = "人民币";
        this.summationInfosOne[0].currencyCode = "CNY";
        // console.log(this.summationInfosAll,"列表详情");
      } catch (error) {
        console.error(error);
      }
    },
    billingMethodChange(value) {
      // console.log("------",value);
      if (value === 0) {
        this.summationInfos = this.summationInfosAll;
        this.summationInfos.forEach(i => (i.list[0].invoiceTitle = ""));
      } else if (value === 1) {
        this.summationInfos = this.summationInfosOne;
        this.summationInfos[0].list[0].invoiceTitle = "";
        this.summationInfos[0].totalOrgn = this.billDetail.totalCny;
        this.summationInfos[0].invoicesTotal = this.billDetail.totalCny;
      }
    },
    async getAllMails() {
      const { companyId } = this;
      try {
        const {
          data: { data }
        } = await this.$api.getAllMails({
          companyId
        });
        this.mails = data.map(item => {
          const { id, recipient, recipientAddress, recipientTel } = item;
          const recipientText = `${recipient}/${recipientTel}/${recipientAddress}`;
          delete item.id;
          return {
            ...item,
            expressInfoId: id,
            label: recipientText,
            value: id,
            recipientText
          };
        });
        // console.log(this.mails,"mails");
      } catch (error) {}
    },
    async getAllInvoices() {
      const { companyId } = this;
      try {
        const {
          data: { data }
        } = await this.$api.getAllInvoices({
          companyId
        });
        this.invoices = data.map(item => {
          // const { id, invoiceTitle, remark } = item;
          const { id, invoiceTitle, companyName, dutyParagraph } = item;
          delete item.id;
          delete item.invoiceTitle; // 新加
          return {
            ...item,
            invoiceInfoId: id,
            label:
              invoiceTitle + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + dutyParagraph,
            // value: invoiceTitle,
            value: id,
            invoiceTitleCopy: invoiceTitle,
            invoiceTitle: id
            // invoiceRemark: remark,
          };
        });
        // console.log(this.invoices,"invoices");
      } catch (error) {}
    },
    async invoiceApply() {
      if (!this.isAllInvoiceMatch && this.applyBilling.applyType != 1) {
        this.$message.error(`开票金额与账单不符，开票提交失败`);
        return;
      }
      try {
        const billRefs = this.$refs.bill;
        for (let index = 0; index < billRefs.length; index++) {
          const billRef = billRefs[index];
          await billRef.submitForm();
        }
        const { orderIds, orderPrices } = this.billDetail;
        let mergeApplyInfos = JSON.parse(
          JSON.stringify(this.computedInvoiceInfos)
        );
        mergeApplyInfos.map(item => {
          // console.log(item);

          for (let i = 0; i < this.invoices.length; i++) {
            if (this.invoices[i].invoiceInfoId == item.invoiceInfoId) {
              item.invoiceTitle = item.invoiceTitleCopy;
            }
          }
          return item;
        });
        // console.log(mergeApplyInfos,"======");
        const { applyType, merge } = this.applyBilling;
        await this.$api.invoiceApplyMerge({
          mergeApplyInfos,
          orderIds,
          orderPrices:
            this.applyBilling.applyType == 1
              ? this.summationInfos[0].list
              : orderPrices,
          applyType,
          merge,
          rcvRecordIdList: this.rcvRecordIdList,
          expenseUnitIdList: this.expenseUnitIdList,
          expenseUnitNameList: this.expenseUnitNameList
        });
        this.$message.success("提交成功");
        this.$bus.$emit("close-current-page");
      } catch (error) {}
    },
    editInvoiceItem({ index, subIndex, item, newSubItem }) {
      // console.log(index, subIndex, item, newSubItem,"------------");
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
    }
  }
};
</script>

<style lang="less" scoped>
.bodyC * {
  font-family: "Arial Negreta", "Arial Normal", "Arial", sans-serif;
  box-sizing: border-box;
  color: #333;
}
.bodyC {
  box-sizing: border-box;
  padding: 20px;
  background: #fff;
  .felx_col {
    display: flex;
    flex-direction: column;
  }
  .felx_row {
    display: flex;
    flex-direction: row;
  }
  .box {
    margin: 10px 0;
  }
  .red {
    color: #d9001b !important;
  }
  .redxing {
    color: #d9001b !important;
    margin-right: 4px;
  }
  .litle1 {
    font-size: 22px;
    line-height: 40px;
    .HF {
      font-weight: 700;
      color: #000000;
    }
  }
  .litle2 {
    font-size: 20px;
    line-height: 50px;
    .HF {
      font-weight: 700;
      color: #000000;
      font-style: normal;
    }
  }
  .textLine {
    // display: flex;
    font-style: normal;
    font-size: 15px;
    line-height: 24px;
    .HF {
      font-weight: 700;
      color: #333333;
    }
  }
  .warnTag {
    width: 100%;
    height: 41px;
    align-content: center;
    padding: 10px;
    background-color: rgba(250, 205, 145, 0.541176470588235);
    i {
      font-size: 24px;
      line-height: 20px;
    }
    span {
      color: #555555;
      margin-left: 15px;
      line-height: 22px;
    }
  }
}
table {
  font-size: 15px;
  border-top: 1px solid #d1d1d1;
  border-left: 1px solid #d1d1d1;
  width: 100%;
  max-width: 1200px;
}
table tr {
  display: flex;
  flex-direction: row;
  width: 100%;
}
table tr td,
table tr th {
  border-right: 1px solid #d1d1d1;
  border-bottom: 1px solid #d1d1d1;
  padding: 5px 10px;
  display: flex;
  line-height: 18px;
  flex-direction: row;
  align-items: center;
  /* 字母换行： */
  /* word-wrap: break-word;  */
  /* 单词换行： */
  word-break: break-all;
  min-height: 40px;
  /* 文字换行： */
  /* white-space:pre-wrap;   */
}
table tr th {
  text-align: center;
  // justify-content: center;
  background: #fff8f5 !important;
  border-bottom: 2px solid #fc6f3d;
}
.th {
  flex: 1;
}
.th1 {
  width: 20%;
  justify-content: end;
}
.th2 {
  flex: 1;
}
// table tr:nth-child(2n+1) td{
//   background-color: #F6F6F6;
// }

.confirm-merge-bill {
  &-wrap {
    box-sizing: border-box;
    padding: 20px;
    background: #fff;
    // min-height: 100%;
  }
  h1 {
    padding: 20px 0;
    font-size: 20px;
    font-weight: bold;
  }
  h3 {
    padding: 6px 0;
    font-size: 16px;
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
  .page-footer {
    margin-top: 20px;
    display: flex;
    align-items: center;
  }
}
</style>
