<template>
  <el-dialog
    :title="computedInfo.title"
    class="invoice-dialog"
    :visible.sync="visible"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    width="600px"
    @closed="$emit('closeEv')"
  >
    <el-form
      size="small"
      ref="form"
      :model="form"
      :rules="computedRules"
      label-width="110px"
      style="padding-top: 20px"
      :validate-on-rule-change="false"
    >
      <el-form-item label="客户名称" prop="companyName">
        <dc-select
          v-model="form.companyName"
          filterable
          remote
          placeholder="客户"
          :disabled="companyDisabled"
          @change="companyChange"
        >
          <el-option
            v-for="item in companyList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </dc-select>
      </el-form-item>
      <el-form-item label="发票抬头" prop="invoiceTitle">
        <el-input
          v-model.trim="form.invoiceTitle"
          placeholder="请输入发票抬头"
          maxlength="100"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="纳税人识别号" prop="dutyParagraph">
        <el-input
          v-model.trim="form.dutyParagraph"
          placeholder="请输入纳税人识别号"
          maxlength="18"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="公司地址" prop="companyAddress">
        <el-input
          v-model="form.companyAddress"
          type="textarea"
          placeholder="请输入公司地址"
          maxlength="100"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="公司电话" prop="companyTel">
        <el-input
          v-model.trim="form.companyTel"
          placeholder="请输入公司电话"
          maxlength="30"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="开户行" prop="accountBank">
        <el-input
          v-model.trim="form.accountBank"
          placeholder="请输入开户行"
          maxlength="100"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="银行账号" prop="bankAccount">
        <el-input
          v-model.trim="form.bankAccount"
          placeholder="请输入银行账号"
          maxlength="30"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="开票备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          placeholder="请输入开票备注"
          maxlength="100"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item> -->
    </el-form>
    <footer slot="footer" class="dialog-footer">
      <div class="btns">
        <el-button type="primary" @click="submitForm">确 认</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  // 编辑抬头信息弹窗
  name: "InvoiceDialog",
  props: {
    form: {
      type: Object,
      default: () => {},
    },
    companyDisabled: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.visible = true;
    this.init();
  },
  data() {
    return {
      visible: false,
      companyList: [],
    };
  },
  computed: {
    computedRules() {
      return {
        companyName: [
          {
            required: true,
            message: "请选择客户",
            trigger: "change",
          },
        ],
        invoiceTitle: [
          {
            required: true,
            message: "请输入发票抬头",
          },
        ],
        dutyParagraph: [
          {
            required: true,
            message: "请输入纳税人识别号",
          },
          {
            validator: (rule, value, callback) => {
              if (!/^[A-Za-z0-9]+$/.test(value)) {
                callback(new Error("仅支持字母和数字"));
              } else {
                callback();
              }
            },
            required: true,
            trigger: "blur",
          },
        ],
        companyAddress: [
          {
            required: true,
            message: "请输入公司地址",
          },
        ],
        companyTel: [
          {
            required: true,
            message: "请输入公司电话",
          },
          {
            validator: (rule, value, callback) => {
              if (!/^([0-9]|-)+$/.test(value)) {
                callback(new Error("仅支持数字和【-】"));
              } else {
                callback();
              }
            },
            required: true,
            trigger: "blur",
          },
        ],
        accountBank: [
          {
            required: true,
            message: "请输入开户行",
          },
        ],
        bankAccount: [
          {
            required: true,
            message: "请输入银行账号",
          },
          {
            validator: (rule, value, callback) => {
              if (!/^[0-9]+$/.test(value)) {
                callback(new Error("仅支持数字"));
              } else {
                callback();
              }
            },
            required: true,
            trigger: "blur",
          },
        ],
      };
    },
    computedFormRef() {
      return this.$refs.form;
    },
    computedInfo() {
      const { id } = this.form;
      return {
        title: `${id ? "编辑" : "新增"}发票抬头`,
      };
    },
    computedSubmit() {
      return this.form.id
        ? {
            text: "保存",
            emitEv: "afterEdit",
          }
        : {
            text: "添加",
            emitEv: "afterAdd",
          };
    },
  },
  methods: {
    init() {
      if (!this.form.id) {
        this.form = {
          accountBank: "",
          bankAccount: "",
          companyAddress: "",
          companyId: "",
          companyName: "",
          companyTel: "",
          dutyParagraph: "",
          invoiceTitle: "",
          // remark: "",
          ...this.form,
        };
      }
      this.getCompanyList();
    },
    submitForm() {
      this.computedFormRef &&
        this.computedFormRef.validate(async (valid, errorKeys) => {
          if (valid) {
            try {
              await this.editInvoice();
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
    // 编辑|新建
    async editInvoice() {
      const {
        id,
        accountBank,
        bankAccount,
        companyAddress,
        companyId,
        companyName,
        companyTel,
        dutyParagraph,
        invoiceTitle,
        // remark,
      } = this.form;
      const apiData = {
        accountBank,
        bankAccount,
        companyAddress,
        companyId,
        companyName,
        companyTel,
        dutyParagraph,
        invoiceTitle,
        // remark,
      };
      if (id) {
        apiData.id = id;
      }
      try {
        await this.$api.editInvoice(apiData);
      } catch (error) {}
    },
    async getCompanyList() {
      try {
        const {
          data: { data },
        } = await this.$api.getCompanyList(
          {},
          {
            params: {
              typeCode: 1,
            },
          }
        );
        this.companyList = data.map((item) => {
          return {
            label: item.companyName,
            value: item.id,
          };
        });
      } catch (error) {}
    },
    companyChange(val) {
      const { value: companyId, label: companyName } = this.companyList.find(
        (item) => item.value === val
      );
      this.form = {
        ...this.form,
        companyId,
        companyName,
      };
    },
  },
  watch: {},
};
</script>

<style lang="less" scoped>
.invoice-dialog {
  /deep/.el-dialog__footer {
    padding-bottom: 20px;
  }
}
</style>