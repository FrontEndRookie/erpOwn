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
      <div>
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

          <el-button type="text" @click="openInvoiceDialog">录入新抬头</el-button>
        </el-form-item>
        <el-form-item label="发票金额" prop="applyAmountOrgn">
          <el-input
            placeholder="请输入发票金额"
            v-model="invoiceData.applyAmountOrgn"
            style="width: 200px"
          >
            <template slot="append">{{multiplyInvo?'CNY': billingData.currencyCode }}</template>
          </el-input>
        </el-form-item>
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
       
        <el-form-item
          label="收件人信息"
          prop="recipientText"
          v-show="showMessSelect"
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
        <el-form-item
          label="开户行及账号"
          v-show="showMailSelect"
          required
        >
          <div>{{invoiceData.accountBank}}/{{ invoiceData.bankAccount }}</div>
          <span style="color:red;margin-left:100px" v-if="!invoiceData.invoiceTitle">请先选择发票抬头</span>
        </el-form-item>
        <el-form-item label="开票备注" prop="invoiceRemark">
          <el-input
            v-model="invoiceData.invoiceRemark"
            placeholder="请输入开票备注"
            maxlength="100"
            show-word-limit
            style="width: 200px"
            v-if="invoiceData.selfDefine"
          >
          </el-input>
          <el-select
            v-model="invoiceData.invoiceRemark"
            placeholder="请选择开票备注"
            style="width: 200px"
            v-if="!invoiceData.selfDefine"
          >
          <el-option label="无" value="无"></el-option>
          <el-option label="备注订单号" value="备注订单号"></el-option>
          <el-option label="备注提单号" value="备注提单号"></el-option>
          <el-option label="备注起运港,目的港" value="备注起运港,目的港"></el-option>
          </el-select>
          <el-button size="mini" type="primary" @click="changeInputType">{{invoiceData.selfDefine?'取消输入':'自定义输入'}}</el-button>
        </el-form-item>
      </div>
    </el-form>
    <!-- 编辑邮寄信息弹窗 -->
    <mail-dialog
      :companyDisabled="companyDisabled"
      v-if="showMailDialog"
      :form="mail"
      @closeEv="showMailDialog = false"
      @afterAdd="$emit('updateMails')"
    />
    <!-- 编辑抬头信息弹窗 -->
    <invoice-dialog-new
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
  created(){
    console.log(this.invoiceData)
  },
  props: {
    multiplyInvo:{
      type:Boolean,
      default:false
    },
    company: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: true,
    },
    invoices: {
      type: Array,
      default: () => [],
    },
    mails: {
      type: Array,
      default: () => [],
    },
    billingData: {
      type: Object,
      default: () => ({}),
    },
    invoiceData: {
      type: Object,
      default: () => ({}),
    },
   
  },
  data() {
    const { taxableServices } = DcStatus.commonStatus;
    return {
      showInvoiceDialog: false,
      showMailDialog: false,
      mail: {},
      invoice: {},
      taxableServices,
    };
  },
  computed: {
    computedTaxableServices() {
      return this.taxableServices.filter((item) => {
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
            trigger: "change",
          },
        ],
        taxableService: [
          {
            required: true,
            message: "请选择货物或应税劳务、服务名称",
            trigger: "change",
          },
        ],
        invoiceTitle: [
          {
            required: true,
            message: "请选择发票抬头",
            trigger: "change",
          },
        ],
        applyAmountOrgn: [
          {
            required: true,
            message: "请输入发票金额",
          },
        ],
        recipientText: [
          {
            required: this.showMailSelect,
            message: "请选择邮寄信息",
            trigger: "change",
          },
        ],
          invoiceRemark:[
          {
            required: true,
            message: "请选择开票备注",
            trigger: "change",
          },
        ]
      };
    },
    showMessSelect() { 
      return [0,1].includes(this.invoiceData.invoiceType);
    },
    showMailSelect() {
      return [1].includes(this.invoiceData.invoiceType);
    },
    disabledInvoiceIds() {
      return this.billingData.list ? this.billingData.list
        .map((item) => item.invoiceInfoId)
        .filter((item) => item !== this.invoiceData.invoiceInfoId) : [];
    },
  },
  methods: {
    changeInputType(){
      if(this.invoiceData.selfDefine){
        this.invoiceData.invoiceRemark = '无'
      }else{
        this.invoiceData.invoiceRemark = ''
      }
      this.invoiceData.selfDefine = !this.invoiceData.selfDefine

    },
    openMailDialog() {
      const { companyId, companyName } = this.company;
      this.mail = {
        companyId: companyId || "",
        companyName: companyName || "",
      };
      this.showMailDialog = true;
    },
    openInvoiceDialog() {
      const { companyId, companyName } = this.company;
      this.invoice = {
        companyId: companyId || "",
        companyName: companyName || "",
      };
      this.showInvoiceDialog = true;
    },
    submitForm() {
      return new Promise((resolve, reject) => {
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
        invoiceTitle,
        invoiceRemark,
      } = this.invoices.find((item) => item.value === val);
      if(this.multiplyInvo){
        this.$emit('multpleEditInvo',{  
          accountBank,
          bankAccount,
          companyAddress,
          companyTel,
          dutyParagraph,
          invoiceInfoId,
          invoiceTitle,
        })
        return
      }
      this.$emit("editInvoiceItem", {
        ...this.invoiceData,
        accountBank,
        bankAccount,
        companyAddress,
        companyTel,
        dutyParagraph,
        invoiceInfoId,
        invoiceTitle,
        invoiceRemark,
      });
    },
    recipientChange(val) {
      const {
        recipient,
        recipientAddress,
        recipientText,
        recipientEmail,
        recipientTel,
        expressInfoId,
      } = this.mails.find((item) => item.value === val);
      if(this.multiplyInvo){
        this.$emit('multpleEditInvo',{ expressInfoId,
          recipient,
          recipientAddress,
          recipientText,
          recipientEmail,
          recipientTel})
        return
      }
      this.$emit("editInvoiceItem", {
        ...this.invoiceData,
        expressInfoId,
        recipient,
        recipientAddress,
        recipientText,
        recipientEmail,
        recipientTel,
      });
    },
    invoiceTypeChange(val) {
      if (this.computedTaxableServices.length === 1) {
        this.invoiceData.taxableService = this.computedTaxableServices[0].value;
      } else {
        this.invoiceData.taxableService = "";
      }
    },
  },
  watch: {
    "invoiceData.applyAmountOrgn"(newVal, oldVal) {
      if (![null, "null"].includes(newVal)) {
        this.invoiceData.applyAmountOrgn = this.$utils.getValidNumber({
          format: DcStatus.numberFormat.applyAmountOrgn,
          newVal,
          oldVal,
        });
      }
      if (newVal == 0) { 
        this.invoiceData.applyAmountOrgn = ''
      }
    },
  },
  
};
</script>

<style lang="less" scoped>
.billing-info-card {
}
</style>