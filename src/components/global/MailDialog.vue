<template>
  <el-dialog
    :title="computedInfo.title"
    class="mail-dialog"
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
      label-width="80px"
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
      <el-form-item label="收件人" prop="recipient">
        <el-input
          v-model.trim="form.recipient"
          placeholder="请输入收件人"
          maxlength="30"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="recipientTel">
        <el-input
          v-model.trim="form.recipientTel"
          placeholder="请输入联系电话"
          maxlength="18"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="recipientEmail">
        <el-input
          v-model.trim="form.recipientEmail"
          placeholder="请输入邮箱"
          maxlength="50"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="收件地址" prop="recipientAddress">
        <el-input
          v-model.trim="form.recipientAddress"
          type="textarea"
          placeholder="请输入收件地址"
          maxlength="100"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
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
  // 编辑邮寄信息弹窗
  name: "MailDialog",
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
        recipient: [
          {
            required: true,
            message: "请输入收件人",
          },
        ],
        recipientTel: [
          {
            required: true,
            message: "请输入联系电话",
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
        recipientEmail: [
          {
            required: true,
            message: "请输入邮箱",
          },
        ],
        recipientAddress: [
          {
            required: true,
            message: "请输入收件地址",
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
        title: `${id ? "编辑" : "新增"}邮寄信息`,
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
          companyId: "",
          companyName: "",
          recipient: "",
          recipientAddress: "",
          recipientEmail: "",
          recipientTel: "",
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
              await this.editMail();
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
    async editMail() {
      const {
        id,
        companyId,
        companyName,
        recipient,
        recipientAddress,
        recipientEmail,
        recipientTel,
      } = this.form;
      const apiData = {
        companyId,
        companyName,
        recipient,
        recipientAddress,
        recipientEmail,
        recipientTel,
      };
      if (id) {
        apiData.id = id;
      }
      try {
        await this.$api.editMail(apiData);
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
.mail-dialog {
  /deep/.el-dialog__footer {
    padding-bottom: 20px;
  }
}
</style>