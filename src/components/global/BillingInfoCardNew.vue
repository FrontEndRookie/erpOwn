<template>
  <div class="billing-info-card">
    <el-form
      size="mini"
      ref="form"
      :model="invoiceData"
      :rules="computedRules"
      label-position="left"
      :validate-on-rule-change="false"
      :disabled="disabled"
    >
      <table border="0" cellpadding="0" cellspacing="0">
        <tr>
          <th class="th2">
            <dc-select
              v-model="invoiceData.invoiceTitle"
              filterable
              placeholder="请选择"
              style="width: 40%"
              @change="invoiceChange"
            >
              <el-option
                v-for="item in invoices"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="disabledInvoiceIds.includes(item.value)"
              >
              </el-option>
            </dc-select>
            <!-- <span>上海傲晔物流科技有限公司  91310120MA1HU7KD02</span> -->
            <el-button
              size="mini"
              @click="openInvoiceDialog"
              round
              class="customBut"
              >录入新抬头</el-button
            >
          </th>
        </tr>
        <tr>
          <td class="th1">
            <span class="redxing">*</span><span> 开票金额：</span>
          </td>
          <td class="th2">
            <span class=""> {{ billingData.totalOrgn }} </span>&emsp;
            <span class="HF red">
              {{ billingData.currencyCode }}
            </span>
          </td>
        </tr>
        <tr>
          <td class="th1">
            <span class="redxing">*</span><span> 发票类型：</span>
          </td>
          <td class="th2">
            <el-form-item prop="invoiceType">
              <el-radio-group
                v-model="invoiceData.invoiceType"
                @change="invoiceTypeChange"
              >
                <el-radio :label="2">电子普票</el-radio>
                <el-radio :label="0">纸质普票</el-radio>
                <el-radio :label="1">纸质专票</el-radio>
              </el-radio-group>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td class="th1">
            <span class="redxing">*</span
            ><span> 货物或应税劳务、服务名称：</span>
          </td>
          <td class="th2">
            <el-form-item prop="taxableService">
              <el-radio-group v-model="invoiceData.taxableService">
                <el-radio
                  :label="item.value"
                  v-for="item in computedTaxableServices"
                  :key="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td class="th1">
            <span class="redxing">*</span><span> 开票备注：</span>
          </td>
          <td class="th2" v-show="invoiceData.remarkButtonType">
            <el-form-item style="min-width:50%" prop="invoiceRemark">
              <dc-select
                style="min-width:100%"
                v-model="invoiceData.invoiceRemark"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in [
                    { value: '', lable: '无' },
                    { value: '1', lable: '备注订单号' },
                    { value: '2', lable: '备注运单号' },
                    { value: '3', lable: '备注起始港、目的港' }
                  ]"
                  :key="item.value"
                  :label="item.lable"
                  :value="item.value"
                >
                </el-option>
              </dc-select>
            </el-form-item>
            <el-button
              size="mini"
              round
              class="customBut"
              @click="remarkInput('zdy')"
              >自定义输入</el-button
            >
          </td>
          <td class="th2" v-show="!invoiceData.remarkButtonType">
            <el-form-item style="min-width:50%" prop="invoiceRemark">
              <el-input
                placeholder="请输入内容"
                v-model="invoiceData.invoiceRemark"
                clearable
              >
              </el-input>
            </el-form-item>
            <el-button
              size="mini"
              round
              class="customBut"
              @click="remarkInput('qx')"
              >取消输入</el-button
            >
          </td>
        </tr>
        <tr v-show="showMailSelect">
          <td class="th1">
            <span class="redxing">*</span><span> 收件人信息：</span>
          </td>
          <td class="th2">
            <el-form-item
              prop="recipientText"
              v-show="showMailSelect"
              style="min-width:50%"
            >
              <dc-select
                v-model="invoiceData.recipientText"
                filterable
                placeholder="请选择"
                style="min-width:100%"
                @change="recipientChange"
              >
                <el-option
                  v-for="item in mails"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </dc-select>
            </el-form-item>
            <el-button
              size="mini"
              round
              class="customBut"
              @click="openMailDialog"
              >添加邮件地址</el-button
            >
          </td>
        </tr>
      </table>
    </el-form>
    <!-- <el-form
      size="mini"
      ref="form"
      :model="invoiceData"
      :rules="computedRules"
      label-position="left"
      :validate-on-rule-change="false"
      :disabled="disabled"
    >
      <div>
        <el-form-item label="发票类型" prop="invoiceType">
          <el-radio-group
            v-model="invoiceData.invoiceType"
            @change="invoiceTypeChange"
          >
            <el-radio :label="2">电子普票</el-radio>
            <el-radio :label="0">纸质普票</el-radio>
            <el-radio :label="1">纸质专票</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="货物或应税劳务、服务名称" prop="taxableService">
          <dc-select
            v-model="invoiceData.taxableService"
            filterable
            placeholder="请选择"
            style="width: 200px"
          >
            <el-option
              v-for="item in computedTaxableServices"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </dc-select>
        </el-form-item>
        <el-form-item label="发票抬头" prop="invoiceTitle">
          <dc-select
            v-model="invoiceData.invoiceTitle"
            filterable
            placeholder="请选择"
            style="width: 200px"
            @change="invoiceChange"
          >
            <el-option
              v-for="item in invoices"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="disabledInvoiceIds.includes(item.value)"
            >
            </el-option>
          </dc-select>
          <el-tooltip
            class="item"
            effect="light"
            placement="top"
            popper-class="invoice-tooltip"
          >
            <div slot="content" class="invoice-tooltip-content">
              <div class="row">
                <span class="row-title">发票抬头</span>
                <span>{{ invoiceData.invoiceTitle }}</span>
              </div>
              <div class="row">
                <span class="row-title">纳税人识别号</span>
                <span>{{ invoiceData.dutyParagraph }}</span>
              </div>
              <div class="row">
                <span class="row-title">公司地址</span>
                <span>{{ invoiceData.companyAddress }}</span>
              </div>
              <div class="row">
                <span class="row-title">公司电话</span>
                <span>{{ invoiceData.companyTel }}</span>
              </div>
              <div class="row">
                <span class="row-title">开户行</span>
                <span>{{ invoiceData.accountBank }}</span>
              </div>
              <div class="row">
                <span class="row-title">银行账号</span>
                <span>{{ invoiceData.bankAccount }}</span>
              </div>
            </div>
            <el-button type="text" style="margin-left: 20px"
              >抬头详情</el-button
            >
          </el-tooltip>

          <el-button type="text" @click="openInvoiceDialog">添加抬头</el-button>
        </el-form-item>
        <el-form-item label="发票金额" prop="applyAmountOrgn">
          <el-input
            placeholder="请输入发票金额"
            v-model="invoiceData.applyAmountOrgn"
            style="width: 200px"
          >
            <template slot="append">{{ billingData.currencyCode }}</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="邮寄信息"
          prop="recipientText"
          v-show="showMailSelect"
        >
          <dc-select
            v-model="invoiceData.recipientText"
            filterable
            placeholder="请选择"
            style="width: 200px"
            @change="recipientChange"
          >
            <el-option
              v-for="item in mails"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </dc-select>
          <el-button
            type="text"
            style="margin-left: 20px"
            @click="openMailDialog"
            >添加邮件地址</el-button
          >
        </el-form-item>
        <el-form-item label="开票备注" prop="invoiceRemark">
          <el-input
            v-model="invoiceData.invoiceRemark"
            type="textarea"
            placeholder="请输入开票备注"
            maxlength="100"
            show-word-limit
            style="width: 400px"
          >
          </el-input>
        </el-form-item>
      </div>
    </el-form> -->
    <!-- 编辑邮寄信息弹窗 -->
    <mail-dialog
      :companyDisabled="companyDisabled"
      v-if="showMailDialog"
      :form="mail"
      @closeEv="showMailDialog = false"
      @afterAdd="$emit('updateMails')"
    />
    <!-- 编辑抬头信息弹窗 -->
    <invoice-dialog
      :companyDisabled="companyDisabled"
      v-if="showInvoiceDialog"
      :form="invoice"
      @closeEv="showInvoiceDialog = false"
      @afterAdd="$emit('updateInvoices')"
    />
  </div>
</template>

<script>
import DcStatus from "@/status";
export default {
  name: "BillingInfoCard",
  props: {
    company: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: true
    },
    invoices: {
      type: Array,
      default: () => []
    },
    mails: {
      type: Array,
      default: () => []
    },
    billingData: {
      type: Object,
      default: () => ({})
    },
    invoiceData: {
      type: Object,
      default: () => ({})
    },
    applyType: {
      type: Number,
      default: 0
    }
  },
  created() {
    if (!this.disabled) {
      this.clearData();
    }
  },
  data() {
    const { taxableServices } = DcStatus.commonStatus;
    return {
      showInvoiceDialog: false,
      showMailDialog: false,
      mail: {},
      invoice: {},
      taxableServices
    };
  },
  computed: {
    computedTaxableServices() {
      return this.taxableServices.filter(item => {
        return (
          item.invoiceTypes.includes(this.invoiceData.invoiceType) ||
          !item.invoiceTypes
        );
      });
    },
    companyDisabled() {
      const { companyId, companyName } = this.company;
      return companyId && companyName;
    },
    computedFormRef() {
      return this.$refs.form;
    },
    computedRules() {
      return {
        invoiceType: [
          {
            required: true,
            message: "请选择发票类型",
            trigger: "change"
          }
        ],
        taxableService: [
          {
            required: true,
            message: "请选择货物或应税劳务、服务名称",
            trigger: "change"
          }
        ],
        invoiceTitle: [
          {
            required: true,
            message: "请选择发票抬头",
            trigger: "change"
          }
        ],
        applyAmountOrgn: [
          {
            required: false,
            message: "请输入发票金额"
          }
        ],
        recipientText: [
          {
            required: this.showMailSelect,
            message: "请选择邮寄信息",
            trigger: "change"
          }
        ]
      };
    },
    showMailSelect() {
      return [0, 1].includes(this.invoiceData.invoiceType);
    },
    disabledInvoiceIds() {
      return this.billingData.list
        .map(item => item.invoiceInfoId)
        .filter(item => item !== this.invoiceData.invoiceInfoId);
    }
  },
  methods: {
    clearData() {
      this.invoiceData.invoiceTitle = "";
      this.invoiceData.invoiceRemark = "";
    },
    remarkInput(type, index) {
      if (type == "qx") {
        this.invoiceData.remarkButtonType = true;
      } else if (type == "zdy") {
        this.invoiceData.remarkButtonType = false;
      }
      this.invoiceData.invoiceRemark = "";
    },
    openMailDialog() {
      const { companyId, companyName } = this.company;
      this.mail = {
        companyId: companyId || "",
        companyName: companyName || ""
      };
      this.showMailDialog = true;
    },
    openInvoiceDialog() {
      const { companyId, companyName } = this.company;
      this.invoice = {
        companyId: companyId || "",
        companyName: companyName || ""
      };
      this.showInvoiceDialog = true;
    },
    submitForm() {
      return new Promise((resolve, reject) => {
        if (!this.invoiceData.invoiceTitle) {
          this.$message.warning("请选择抬头信息");
          reject();
        }
        this.computedFormRef &&
          this.computedFormRef.validate(async (valid, errorKeys) => {
            if (valid) {
              resolve();
            } else {
              Object.entries(errorKeys).find(([key, val]) => {
                if (val[0]) {
                  this.$message.error(val[0].message);
                  return true;
                }
              });
              reject();
              return false;
            }
          });
      });
    },
    invoiceChange(val) {
      const {
        accountBank,
        bankAccount,
        companyAddress,
        companyTel,
        dutyParagraph,
        invoiceInfoId,
        invoiceTitleCopy,
        invoiceTitle
        // invoiceRemark,
      } = this.invoices.find(item => item.value === val);
      this.$emit("editInvoiceItem", {
        ...this.invoiceData,
        accountBank,
        bankAccount,
        companyAddress,
        companyTel,
        dutyParagraph,
        invoiceInfoId,
        invoiceTitleCopy,
        invoiceTitle
        // invoiceRemark,
      });
    },
    recipientChange(val) {
      const {
        recipient,
        recipientAddress,
        recipientText,
        recipientEmail,
        recipientTel,
        expressInfoId
      } = this.mails.find(item => item.value === val);
      this.$emit("editInvoiceItem", {
        ...this.invoiceData,
        expressInfoId,
        recipient,
        recipientAddress,
        recipientText,
        recipientEmail,
        recipientTel
      });
    },
    invoiceTypeChange(val) {
      if (this.computedTaxableServices.length === 1) {
        this.invoiceData.taxableService = this.computedTaxableServices[0].value;
      } else {
        this.invoiceData.taxableService = "";
      }
    }
  },
  watch: {
    applyType() {
      this.$nextTick(() => {
        this.clearData();
      });
    },
    "invoiceData.applyAmountOrgn"(newVal, oldVal) {
      if (![null, "null"].includes(newVal)) {
        this.invoiceData.applyAmountOrgn = this.$utils.getValidNumber({
          format: DcStatus.numberFormat.applyAmountOrgn,
          newVal,
          oldVal
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.billing-info-card {
}
.customBut {
  margin-left: 20px;
  background: rgba(250, 205, 145, 1);
  color: #555555;
  font-size: 13px;
  line-height: 20px;
  padding: 1px 15px;
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
/deep/ .th2 {
  flex: 1;
  .el-form-item {
    margin-bottom: 0px;
  }
}
.redxing {
  color: #d9001b !important;
  margin-right: 4px;
}
</style>
