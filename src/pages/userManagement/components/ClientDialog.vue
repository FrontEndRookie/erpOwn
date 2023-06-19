<template>
  <el-dialog
    :title="computedInfo.title"
    class="client-dialog"
    :visible.sync="visible"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    width="730px"
    @closed="$emit('closeEv')"
  >
    <el-form
      size="small"
      ref="form"
      :model="form"
      :rules="computedRules"
      label-width="140px"
      style="padding-top: 20px"
      :validate-on-rule-change="false"
    >
      <el-form-item label="统一信用代码" prop="creditCode">
        <div class="flex-row">
          <el-input
            v-model.trim="form.creditCode"
            placeholder="请输入18位的统一社会信用代码"
            :disabled="computedInfo.editDisabled"
            maxlength="30"
            show-word-limit
            clearable
            @input="form.companyName = ''"
          ></el-input>
          <el-button
            type="text"
            style="margin-left: 20px"
            v-if="computedInfo.showCreditCodeSearch"
            @click="getUniqCompanyInfo"
            >查询</el-button
          >
        </div>
      </el-form-item>
       <el-form-item label="客户名称" prop="companyName">
        <div class="flex-row">
          <el-input
            v-model.trim="form.companyName"
            placeholder="请输入客户名称"
            :disabled="computedInfo.editDisabled"
            maxlength="100"
            show-word-limit
            clearable
          ></el-input>
          <el-button
            v-if="computedInfo.showCreditCodeSearch"
            type="text"
            style="margin-left: 20px"
            @click="duplicateNameQuery"
            >查询</el-button
          >    
        </div>
      </el-form-item>
      <el-form-item label="客户类型" prop="customerMode">
        <el-select v-model="form.customerMode" placeholder="客户类型">
          <el-option
            v-for="item in customerModes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客户类别" prop="customerType">
        <el-select v-model="form.customerType" placeholder="客户类别">
          <el-option
            v-for="item in customerTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客户负责人" prop="customerResponsibleId">
        <el-select
          v-model="form.customerResponsibleId"
          placeholder="客户负责人"
          filterable
        >
          <el-option
            v-for="item in customerResponsibles"
            :key="item.value"
            :label="item.longLabel"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="结算方式" prop="payWay">
        <el-radio-group v-model="form.payWay">
          <el-radio
            v-for="item in payWays"
            :key="item.value"
            :label="item.value"
            @change="payWayChange"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <div class="flex-row pay-way-wrap">
        <el-form-item label="结算账期" prop="accountingPeriod">
          <div class="flex-row">
            <el-input
              :value="'/'"
              disabled
              v-show="[0].includes(form.payWay)"
            ></el-input>
            <el-select
              v-model="form.accountingPeriod"
              placeholder="请选择"
              v-show="[1].includes(form.payWay)"
            >
              <el-option
                v-for="item in [15, 25, 30, 45, 60]"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <el-input
              v-model.trim="form.accountingPeriod"
              :disabled="accountingPeriodDisabled"
              @change="
                () => {
                  form.accountingPeriod =
                    form.accountingPeriod === '0' ? '' : form.accountingPeriod;
                }
              "
              v-show="[2].includes(form.payWay)"
              clearable
            ></el-input>
            <span style="margin-left: 10px">天</span>
          </div>
        </el-form-item>
        <el-form-item label="授信额度" prop="quota">
          <div class="flex-row">
            <el-input
              :value="'/'"
              disabled
              v-show="[0].includes(form.payWay)"
            ></el-input>
            <el-input
              v-model.trim="form.quota"
              :disabled="quotaDisabled"
              v-show="[1, 2].includes(form.payWay)"
              @change="
                () => {
                  form.quota = form.quota === '0' ? '' : form.quota;
                }
              "
              clearable
            ></el-input>
            <span style="margin-left: 10px">元</span>
          </div>
        </el-form-item>
      </div>
      <el-form-item label="结算公司名称" prop="settlementCompany">
        <el-input
          v-model.trim="form.settlementCompany"
          placeholder="请输入结算公司名称"
          maxlength="100"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="办公地址" prop="officeAddress">
        <el-input
          v-model.trim="form.officeAddress"
          placeholder="请输入办公地址"
          maxlength="500"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="营业执照附件" prop="businessLicensePath">
        <el-input v-model="form.businessLicensePath" v-show="false" />
        <div class="license-wrap">
          <div class="license-img" @click="loadFile">
            <div class="img-empty" v-show="!showLicense">
              <dc-img name="license" style="width: 60px" />
              <p style="margin-top: 10px">点击上传图片</p>
            </div>
            <img
              class="license"
              :src="form.businessLicensePath"
              v-show="showLicense"
              v-if="!isPdf"
            />
            <embed
              class="license"
              :src="`${form.businessLicensePath}#scrollbars=0&toolbar=0&statusbar=0`"
              v-if="isPdf"
            />
            <i
              class="el-icon-error del-btn"
              v-show="showLicense"
              @click.stop="form.businessLicensePath = ''"
            ></i>
          </div>
          <div class="license-text">
            <p>请上传清晰彩色完整的原件照片，证件各项信息清晰可见容易识别</p>
            <p style="margin-top: 10px">
              仅支持jpg、jpeg、pdf、png文件格式，文件大小不超过10M。
            </p>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="营业执照有效期">
        <el-date-picker
          v-model="form.licenseDuration1"
          type="date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          placeholder="起始时间"
          :picker-options="licenseDuration1PickerOptions"
          style="width: 140px"
        />
        <span style="margin: 0 10px">-</span>
        <el-date-picker
          v-model="form.licenseDuration2"
          type="date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          placeholder="结束时间"
          :picker-options="licenseDuration2PickerOptions"
          style="width: 140px"
        />
      </el-form-item>
      <div class="contact-row">
        <div class="contact-list">
          <p class="contact-title">业务联系人</p>
          <el-form-item label="姓名" prop="businessContactName">
            <el-input
              v-model.trim="form.businessContactName"
              placeholder="请输入姓名"
              maxlength="10"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="职位" prop="businessContactPosition">
            <el-input
              v-model.trim="form.businessContactPosition"
              placeholder="请输入职位"
              maxlength="20"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="businessContactTel">
            <el-input
              v-model.trim="form.businessContactTel"
              placeholder="请输入手机号码"
              maxlength="50"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="QQ" prop="businessContactQq">
            <el-input
              v-model.trim="form.businessContactQq"
              placeholder="请输入QQ"
              maxlength="15"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="微信" prop="businessContactWechat">
            <el-input
              v-model.trim="form.businessContactWechat"
              placeholder="请输入微信"
              maxlength="30"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="businessContactMail">
            <el-input
              v-model.trim="form.businessContactMail"
              placeholder="请输入邮箱"
              maxlength="50"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
        </div>
        <div class="contact-list">
          <p class="contact-title">财务联系人</p>
          <el-form-item label="姓名" prop="financialContactName">
            <el-input
              v-model.trim="form.financialContactName"
              placeholder="请输入姓名"
              maxlength="10"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="financialContactTel">
            <el-input
              v-model.trim="form.financialContactTel"
              placeholder="请输入手机号码"
              maxlength="50"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="QQ" prop="financialContactQq">
            <el-input
              v-model.trim="form.financialContactQq"
              placeholder="请输入QQ"
              maxlength="15"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="微信" prop="financialContactWechat">
            <el-input
              v-model.trim="form.financialContactWechat"
              placeholder="请输入微信"
              maxlength="30"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="financialContactMail">
            <el-input
              v-model.trim="form.financialContactMail"
              placeholder="请输入邮箱"
              maxlength="50"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <footer slot="footer" class="dialog-footer">
      <div class="btns">
        <el-button type="primary" @click="submitForm">{{
          computedInfo.submitText
        }}</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
      <div class="tips" v-if="computedInfo.showAddTips">
        确认新增后，【企业统一信用代码】不可更改，请仔细检查！
      </div>
    </footer>
  </el-dialog>
</template>

<script>
import DcStatus from "@/status";
export default {
  // 编辑客户弹窗
  name: "ClientDialog",
  props: {
    form: {
      type: Object,
      default: () => {},
    },
    payWays: {
      type: Array,
      default: () => [],
    },
    customerModes: {
      type: Array,
      default: () => [],
    },
    customerTypes: {
      type: Array,
      default: () => [],
    },
    customerResponsibles: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    this.visible = true;
    this.init();
  },
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    licenseDuration1PickerOptions() {
      return {
        disabledDate: (time) => {
          const licenseDuration2 = new Date(
            this.form.licenseDuration2
          ).getTime();
          if (!licenseDuration2) {
            return false;
          }
          return time.getTime() > licenseDuration2 - 60 * 60 * 1000 * 24;
        },
      };
    },
    licenseDuration2PickerOptions() {
      return {
        disabledDate: (time) => {
          const licenseDuration1 = new Date(
            this.form.licenseDuration1
          ).getTime();
          return time.getTime() < licenseDuration1;
        },
      };
    },
    computedRules() {
      return {
        creditCode: {
          required: false,
          message: "请输入统一信用代码",
        },
        companyName: {
          required: true,
          message: "请输入客户名称",
        },
        businessLicensePath: {
          required: false,
          message: "请上传营业执照附件",
        },
        officeAddress: {
          required: false,
          message: "请输入办公地址",
        },
        customerMode: {
          required: true,
          message: "请选择客户类型",
          trigger: "change",
        },
        customerType: {
          required: true,
          message: "请选择客户类别",
          trigger: "change",
        },
        customerResponsibleId: {
          required: true,
          message: "请选择客户负责人",
          trigger: "change",
        },
        settlementCompany: {
          required: false,
          message: "请输入结算公司名称",
        },
        payWay: {
          required: true,
          message: "请选择结算方式",
          trigger: "change",
        },
        accountingPeriod: {
          required: [1, 2].includes(this.form.payWay),
          message: "请输入结算账期",
        },
        quota: {
          required: [1, 2].includes(this.form.payWay),
          message: "请输入授信额度",
        },
        businessContactName: {
          required: false,
          message: "请输入姓名",
        },
        businessContactPosition: {
          required: false,
          message: "请输入职位",
        },
        businessContactTel: {
          required: false,
          message: "请输入手机号码",
        },
        businessContactQq: {
          required: false,
          message: "请输入QQ",
        },
        businessContactWechat: {
          required: false,
          message: "请输入微信",
        },
        businessContactMail: {
          required: false,
          message: "请输入邮箱",
        },
        financialContactName: {
          required: false,
          message: "请输入姓名",
        },
        financialContactTel: {
          required: false,
          message: "请输入手机号码",
        },
        financialContactQq: {
          required: false,
          message: "请输入QQ",
        },
        financialContactWechat: {
          required: false,
          message: "请输入微信",
        },
        financialContactMail: {
          required: false,
          message: "请输入邮箱",
        },
      };
    },
    computedFormRef() {
      return this.$refs.form;
    },
    computedInfo() {
      const { id } = this.form;
      return {
        title: `${id ? "编辑" : "新增"}客户`,
        submitText: id ? "保 存" : "确认新增",
        showCreditCodeSearch: id ? false : true,
        editDisabled: id ? true : false,
        showAddTips: id ? false : true,
      };
    },
    computedSubmit() {
      return this.form.id
        ? {
            api: "editClient",
            text: "保存",
            emitEv: "afterEdit",
          }
        : {
            api: "addClient",
            text: "添加",
            emitEv: "afterAdd",
          };
    },
    accountingPeriodDisabled() {
      const { payWay } = this.form;
      return payWay === 0;
    },
    quotaDisabled() {
      const { payWay } = this.form;
      return payWay === 0;
    },
    showLicense() {
      return this.form.businessLicensePath;
    },
    isPdf() {
      const type = String(
        this.form.businessLicensePath.split(".").slice(-1)[0]
      ).toLowerCase();
      return type === "pdf";
    },
  },
  methods: {
    init() {},
    submitForm() {
      this.computedFormRef &&
        this.computedFormRef.validate(async (valid, errorKeys) => {
          if (valid) {
            try {
              await this.editClient();
              this.$emit(this.computedSubmit.emitEv);
              this.visible = false;
            } catch (error) {}
          } else {
            Object.entries(errorKeys).find(([key, val]) => {
              if (val[0]) {
                this.$message.error(val[0].message);
                return true;
              }
            });
            return false;
          }
        });
    },
    // 编辑|新建账号
    async editClient() {
      const {
        id,
        creditCode,
        companyName,
        businessLicensePath,
        officeAddress,
        customerMode,
        customerResponsibleId,
        customerType,
        settlementCompany,
        payWay,
        accountingPeriod,
        quota,
        businessContactName,
        businessContactPosition,
        businessContactTel,
        businessContactQq,
        businessContactWechat,
        businessContactMail,
        financialContactName,
        financialContactTel,
        financialContactQq,
        financialContactWechat,
        financialContactMail,
        licenseDuration1,
        licenseDuration2,
      } = this.form;
      const apiData = {
        creditCode,
        companyName,
        businessLicensePath,
        officeAddress,
        customerMode,
        customerResponsibleId,
        customerType,
        settlementCompany,
        payWay,
        accountingPeriod,
        quota,
        businessContactName,
        businessContactPosition,
        businessContactTel,
        businessContactQq,
        businessContactWechat,
        businessContactMail,
        financialContactName,
        financialContactTel,
        financialContactQq,
        financialContactWechat,
        financialContactMail,
        licenseDuration1: licenseDuration1 || "",
        licenseDuration2: licenseDuration2 || "",
      };
      if (id) {
        apiData.id = id;
      }
      try {
        await this.$api[this.computedSubmit.api](apiData);
        this.$message.success(`${this.computedSubmit.text}成功`);
      } catch (error) {
        return Promise.reject();
      }
    },
    payWayChange(payWay) {
      this.form.accountingPeriod = "";
      this.form.quota = "";
      if (payWay === 0) {
        this.computedFormRef &&
          this.computedFormRef.clearValidate(["accountingPeriod", "quota"]);
      }
      if (payWay === 1) {
        this.form.accountingPeriod = 15;
      }
    },
    async loadFile() {
      if (this.showLicense) {
        return;
      }
      const files = await this.$utils.loadFile({
        accept: ".jpg,.jpeg,.png,.pdf",
      });
      const file = files[0];
      const maxSize = 10;
      if (file.size > 1024 * 1024 * maxSize) {
        this.$message.error(`文件大小不能超过${maxSize}M`);
        return;
      }
      const fileFormData = new FormData();
      fileFormData.append("file", file);
      try {
        const {
          data: { data },
        } = await this.$api.uploadBusinessLicense(fileFormData);
        this.form.businessLicensePath = data;
      } catch (error) {}
    },
    async getUniqCompanyInfo() {
      const { creditCode } = this.form;
      if (!creditCode) {
        this.$message.error("暂未输入统一信用代码，请先输入");
        return;
      }
      const {
        data: {
          data: { message, name },
        },
      } = await this.$api.getUniqCompanyInfo(creditCode);
      if (message) {
        this.$message.error(message);
        return;
      }
      this.$message.success("查询成功");
      this.form.companyName = name;
    },
    // 名称重复性校验
    duplicateNameQuery() {
      const { companyName } = this.form;
      if (!companyName) {
        this.$message.error("暂未输入客户名称，请先输入");
        return;
      }
      this.$http.post(this.$service.checkCompanyNameIsRepeat+"?companyName="+companyName).then(res=>{
        if(res.code==200){
          this.$message.success("该客户暂未录入系统，可以新增")
        }else {
          this.$message.error(res.message)
        }
      })
    },
  },
  watch: {
    // "form.businessContactTel"(newVal, oldVal) {
    //   this.form.businessContactTel = this.$utils.getValidNumber({
    //     format: DcStatus.numberFormat.businessContactTel,
    //     newVal,
    //     oldVal,
    //   });
    // },
    "form.businessContactQq"(newVal, oldVal) {
      this.form.businessContactQq = this.$utils.getValidNumber({
        format: DcStatus.numberFormat.businessContactQq,
        newVal,
        oldVal,
      });
    },
    // "form.financialContactTel"(newVal, oldVal) {
    //   this.form.financialContactTel = this.$utils.getValidNumber({
    //     format: DcStatus.numberFormat.financialContactTel,
    //     newVal,
    //     oldVal,
    //   });
    // },
    "form.financialContactQq"(newVal, oldVal) {
      this.form.financialContactQq = this.$utils.getValidNumber({
        format: DcStatus.numberFormat.financialContactQq,
        newVal,
        oldVal,
      });
    },
    "form.accountingPeriod"(newVal, oldVal) {
      this.form.accountingPeriod = this.$utils.getValidNumber({
        format: DcStatus.numberFormat.accountingPeriod,
        newVal,
        oldVal,
      });
    },
    "form.quota"(newVal, oldVal) {
      this.form.quota = this.$utils.getValidNumber({
        format: DcStatus.numberFormat.quota,
        newVal,
        oldVal,
      });
    },
  },
};
</script>
<style>
.el-message{
  z-index: 9999!important ;
}
</style>
<style lang="less" scoped>
.client-dialog {
  .flex-row {
    display: flex;
  }
  .pay-way-wrap {
    /deep/.el-form-item__content {
      width: 140px;
    }
    /deep/.el-input__inner {
      text-align: center;
    }
  }
  .contact-row {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    display: flex;
    .contact-list {
      padding: 10px 20px 0;
      &:nth-of-type(1) {
        border-right: 1px solid #ccc;
      }
      .contact-title {
        padding: 10px 0;
        font-weight: bold;
        font-size: 16px;
      }
      /deep/.el-form-item__label {
        width: 80px !important;
      }
      /deep/.el-form-item__content {
        margin-left: 80px !important;
      }
    }
  }
  .dialog-footer {
    .btns {
      margin-top: 20px;
      padding: 0 100px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .tips {
      margin-top: 20px;
      color: #f56c6c;
      text-align: center;
    }
  }
  /deep/.el-dialog__footer {
    padding-bottom: 20px;
  }
  /deep/.el-form-item__content {
    // max-width: 400px;
  }
  .license-wrap {
    margin-left: -100px;
    padding-top: 32px;
    display: flex;
    .license-img {
      box-sizing: border-box;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #e5e5e5;
      width: 240px;
      height: 160px;
      cursor: pointer;
      .license {
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
      }
      .img-empty {
        text-align: center;
      }
      .del-btn {
        display: none;
        position: absolute;
        right: 0;
        top: 0;
        color: #f56c6c;
        font-size: 20px;
      }
      &:hover .del-btn {
        display: block;
      }
    }
    .license-text {
      flex: 1;
      min-width: 0;
      margin-left: 20px;
      padding-top: 10px;
      font-size: 12px;
      color: #aaa;
    }
  }
}
</style>