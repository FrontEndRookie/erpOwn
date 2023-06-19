<template>
  <el-dialog
    :title="computedInfo.title"
    class="supplier-dialog"
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
      <el-form-item label="统一信用代码" prop="socialCreditCode">
        <div class="flex-row">
          <el-input
            v-model.trim="form.socialCreditCode"
            placeholder="请输入18位的统一社会信用代码"
            :disabled="computedInfo.editDisabled"
            maxlength="30"
            show-word-limit
            clearable
            @input="
              form.agentName = '';
              form.namePy = '';
            "
          ></el-input>
          <el-button
            type="text"
            style="margin-left: 20px"
            v-if="computedInfo.showCreditCodeSearch"
            @click="getCompanyByCreditCode"
            >查询</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="供应商名称" prop="agentName">
        <div class="flex-row">
          <el-input
              v-model.trim="form.agentName"
              placeholder="请输入供应商名称"
              :disabled="computedInfo.editDisabled"
              maxlength="100"
              show-word-limit
              clearable
            ></el-input>
            <el-button
              type="text"
              style="margin-left: 20px"
              v-if="computedInfo.showCreditCodeSearch"
              @click="duplicateNameQuery"
              >查询</el-button
            >
          </div>
      </el-form-item>
      <el-form-item label="供应商名称首字母" prop="namePy">
        <el-input
          v-model.trim="form.namePy"
          placeholder="请输入供应商首字母"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="供应商类型" prop="types">
        <el-select
          v-model="form.types"
          placeholder="请选择供应商类型"
          multiple
          clearable
        >
          <el-option
            v-for="item in supplierTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="供应商负责人" prop="responsible">
        <el-select
          v-model="form.responsible"
          placeholder="供应商负责人"
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
      <el-form-item label="结算方式" prop="settlementWay">
        <el-radio-group v-model="form.settlementWay">
          <el-radio
            v-for="item in settlementWays"
            :key="item.value"
            :label="item.value"
            @change="settlementWayChange"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <div class="flex-row pay-way-wrap">
        <el-form-item label="结算账期" prop="settlementDays">
          <div class="flex-row">
            <el-input
              :value="'/'"
              disabled
              v-if="[1].includes(form.settlementWay)"
            ></el-input>
            <el-select
              v-model="form.settlementDays"
              placeholder="请选择"
              v-if="[2].includes(form.settlementWay)"
            >
              <el-option
                v-for="item in [15, 25, 30, 45, 60]"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <el-input
              v-model.trim="form.settlementDays"
              :disabled="settlementDaysDisabled"
              v-if="[3].includes(form.settlementWay)"
              clearable
              @change="
                () => {
                  form.settlementDays =
                    form.settlementDays === '0' ? '' : form.settlementDays;
                }
              "
            ></el-input>
            <span style="margin-left: 10px">天</span>
          </div>
        </el-form-item>
        <el-form-item label="授信额度" prop="creditLimit">
          <div class="flex-row">
            <el-input
              :value="'/'"
              disabled
              v-if="[1].includes(form.settlementWay)"
            ></el-input>
            <el-input
              v-model.trim="form.creditLimit"
              :disabled="creditLimitDisabled"
              v-if="[2, 3].includes(form.settlementWay)"
              clearable
              @change="
                () => {
                  form.creditLimit =
                    form.creditLimit === '0' ? '' : form.creditLimit;
                }
              "
            ></el-input>
            <span style="margin-left: 10px">元</span>
          </div>
        </el-form-item>
      </div>
      <el-form-item label="结算公司名称" prop="settlementName">
        <el-input
          v-model.trim="form.settlementName"
          placeholder="请输入结算公司名称"
          maxlength="100"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="办公地址" prop="address">
        <el-input
          v-model.trim="form.address"
          placeholder="请输入办公地址"
          maxlength="500"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="营业执照附件" prop="fileUrl">
        <el-input type="text" v-model="form.fileUrl" v-show="false" />
        <div class="license-wrap">
          <div class="license-img" @click="loadFile">
            <div class="img-empty" v-show="!showLicense">
              <dc-img name="license" style="width: 60px" />
              <p style="margin-top: 10px">点击上传图片</p>
            </div>
            <img
              class="license"
              :src="form.fileUrl"
              v-show="showLicense"
              v-if="!isPdf"
            />
            <embed
              class="license"
              :src="`${form.fileUrl}#scrollbars=0&toolbar=0&statusbar=0`"
              v-if="isPdf"
            />
            <i
              class="el-icon-error del-btn"
              v-show="showLicense"
              @click.stop="form.fileUrl = ''"
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
      <el-form-item label="供应商备注" prop="remarke" style="margin-top: 20px">
        <el-input
          type="textarea"
          v-model.trim="form.remarke"
          placeholder="请输入供应商备注"
          maxlength="150"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <div class="contact-row">
        <div class="contact-list">
          <p class="contact-title">业务联系人</p>
          <el-form-item label="姓名" prop="busName">
            <el-input
              v-model.trim="form.busName"
              placeholder="请输入姓名"
              maxlength="10"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="职位" prop="busJob">
            <el-input
              v-model.trim="form.busJob"
              placeholder="请输入职位"
              maxlength="20"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="busPhone">
            <el-input
              v-model.trim="form.busPhone"
              placeholder="请输入手机号码"
              maxlength="50"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="QQ" prop="busQQ">
            <el-input
              v-model.trim="form.busQQ"
              placeholder="请输入QQ"
              maxlength="15"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="微信" prop="busWechat">
            <el-input
              v-model.trim="form.busWechat"
              placeholder="请输入微信"
              maxlength="30"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="busMail">
            <el-input
              v-model.trim="form.busMail"
              placeholder="请输入邮箱"
              maxlength="50"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
        </div>
        <div class="contact-list">
          <p class="contact-title">财务联系人</p>
          <el-form-item label="姓名" prop="finName">
            <el-input
              v-model.trim="form.finName"
              placeholder="请输入姓名"
              maxlength="10"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="finPhone">
            <el-input
              v-model.trim="form.finPhone"
              placeholder="请输入手机号码"
              maxlength="50"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="QQ" prop="finQQ">
            <el-input
              v-model.trim="form.finQQ"
              placeholder="请输入QQ"
              maxlength="15"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="微信" prop="finWechat">
            <el-input
              v-model.trim="form.finWechat"
              placeholder="请输入微信"
              maxlength="30"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="finMail">
            <el-input
              v-model.trim="form.finMail"
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
    </footer>
  </el-dialog>
</template>

<script>
import DcStatus from "@/status";
export default {
  // 编辑供应商弹窗
  name: "SupplierDialog",
  props: {
    form: {
      type: Object,
      default: () => {},
    },
    settlementWays: {
      type: Array,
      default: () => [],
    },
    supplierTypes: {
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
        socialCreditCode: {
          required: false,
          message: "请输入统一信用代码",
        },
        agentName: {
          required: true,
          message: "请输入供应商名称",
        },
        namePy: {
          required: true,
          message: "供应商名称首字母",
        },
        fileUrl: {
          required: false,
          message: "请上传营业执照附件",
        },
        address: {
          required: false,
          message: "请输入办公地址",
        },
        types: {
          required: true,
          message: "请选择供应商类型",
          trigger: "change",
        },
        responsible: {
          required: true,
          message: "请选择供应商负责人",
          trigger: "change",
        },
        settlementName: {
          required: false,
          message: "请输入结算公司名称",
        },
        settlementWay: {
          required: true,
          message: "请选择结算方式",
          trigger: "change",
        },
        settlementDays: {
          required: [2, 3].includes(this.form.settlementWay),
          message: "请输入结算账期",
        },
        creditLimit: {
          required: [2, 3].includes(this.form.settlementWay),
          message: "请输入授信额度",
        },
        busName: {
          required: false,
          message: "请输入姓名",
        },
        busJob: {
          required: false,
          message: "请输入职位",
        },
        busPhone: {
          required: false,
          message: "请输入手机号码",
        },
        busQQ: {
          required: false,
          message: "请输入QQ",
        },
        busWechat: {
          required: false,
          message: "请输入微信",
        },
        busMail: {
          required: false,
          message: "请输入邮箱",
        },
        finName: {
          required: false,
          message: "请输入姓名",
        },
        finPhone: {
          required: false,
          message: "请输入手机号码",
        },
        finQQ: {
          required: false,
          message: "请输入QQ",
        },
        finWechat: {
          required: false,
          message: "请输入微信",
        },
        finMail: {
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
        title: `${id ? "编辑" : "新增"}供应商`,
        submitText: id ? "保 存" : "确认新增",
        showCreditCodeSearch: id ? false : true,
        editDisabled: id ? true : false,
      };
    },
    computedSubmit() {
      return this.form.id
        ? {
            api: "editSupplier",
            text: "保存",
            emitEv: "afterEdit",
          }
        : {
            api: "addSupplier",
            text: "添加",
            emitEv: "afterAdd",
          };
    },
    settlementDaysDisabled() {
      const { settlementWay } = this.form;
      return settlementWay === 1;
    },
    creditLimitDisabled() {
      const { settlementWay } = this.form;
      return settlementWay === 1;
    },
    showLicense() {
      return this.form.fileUrl;
    },
    isPdf() {
      if(!this.form.fileUrl){
        return false
      }
      const type =  String(
        this.form.fileUrl.split(".").slice(-1)[0]
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
              await this.editSupplier();
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
    async editSupplier() {
      const {
        id,
        licenseDuration1,
        licenseDuration2,
        responsible,
        socialCreditCode,
        agentName,
        namePy,
        fileUrl,
        address,
        types,
        settlementName,
        settlementWay,
        settlementDays,
        creditLimit,
        busName,
        busJob,
        busPhone,
        busQQ,
        busWechat,
        busMail,
        finName,
        finPhone,
        finQQ,
        finWechat,
        finMail,
        remarke,
      } = this.form;
      const apiData = {
        validDate: [licenseDuration1, licenseDuration2].join(","),
        responsible,
        socialCreditCode,
        agentName,
        namePy,
        fileUrl,
        address,
        type: types.join(","),
        settlementName,
        settlementWay,
        settlementDays,
        creditLimit,
        busName,
        busJob,
        busPhone,
        busQQ,
        busWechat,
        busMail,
        finName,
        finPhone,
        finQQ,
        finWechat,
        finMail,
        remarke,
      };
      if (id) {
        apiData.id = id;
      }
      try {
        await this.$api[this.computedSubmit.api](apiData, {
          headers: {
            diffFlag: id ? 2 : undefined,
          },
        });
        this.$message.success(`${this.computedSubmit.text}成功`);
      } catch (error) {
        return Promise.reject();
      }
    },
    settlementWayChange(settlementWay) {
      this.form.settlementDays = "";
      this.form.creditLimit = "";
      if (settlementWay === 1) {
        this.computedFormRef &&
          this.computedFormRef.clearValidate(["settlementDays", "creditLimit"]);
      }
      if (settlementWay === 2) {
        this.form.settlementDays = 15;
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
      fileFormData.append("image", file);
      try {
        const { data } = await this.$api.uploadAgentBusinessLicense(
          fileFormData
        );
        this.form.fileUrl = data;
      } catch (error) {}
    },
    async getCompanyByCreditCode() {
      const { socialCreditCode } = this.form;
      if (!socialCreditCode) {
        this.$message.error("暂未输入统一信用代码，请先输入");
        return;
      }
      const {
        data: {
          data: { message, name, namePy },
        },
      } = await this.$api.getCompanyByCreditCode(socialCreditCode);
      if (message) {
        this.$message.error(message);
        return;
      }
      this.$message.success("查询成功");
      this.form.namePy = namePy;
      this.form.agentName = name;
    },
    // 名称重复性校验
    duplicateNameQuery() {
      const { agentName } = this.form;
      if (!agentName) {
        this.$message.error("暂未输入供应商名称，请先输入");
        return;
      }
      this.$http.post(this.$service.checkAgentNameIsRepeat+"?agentName="+agentName).then(res=>{
        if(res.code==200){
          this.$message.success("该供应商暂未录入系统，可以新增")
        }else {
          this.$message.error(res.message)
        }
      })
    },
  },
  watch: {
    // "form.busPhone"(newVal, oldVal) {
    //   this.form.busPhone = this.$utils.getValidNumber({
    //     format: DcStatus.numberFormat.busPhone,
    //     newVal,
    //     oldVal,
    //   });
    // },
    "form.busQQ"(newVal, oldVal) {
      this.form.busQQ = this.$utils.getValidNumber({
        format: DcStatus.numberFormat.busQQ,
        newVal,
        oldVal,
      });
    },
    // "form.finPhone"(newVal, oldVal) {
    //   this.form.finPhone = this.$utils.getValidNumber({
    //     format: DcStatus.numberFormat.finPhone,
    //     newVal,
    //     oldVal,
    //   });
    // },
    "form.finQQ"(newVal, oldVal) {
      this.form.finQQ = this.$utils.getValidNumber({
        format: DcStatus.numberFormat.finQQ,
        newVal,
        oldVal,
      });
    },
    "form.settlementDays"(newVal, oldVal) {
      this.form.settlementDays = this.$utils.getValidNumber({
        format: DcStatus.numberFormat.settlementDays,
        newVal,
        oldVal,
      });
    },
    "form.creditLimit"(newVal, oldVal) {
      this.form.creditLimit = this.$utils.getValidNumber({
        format: DcStatus.numberFormat.creditLimit,
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


.supplier-dialog {
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