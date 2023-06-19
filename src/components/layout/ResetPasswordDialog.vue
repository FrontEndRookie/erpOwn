<template>
  <el-dialog
    title="密码重置"
    class="reset-password-dialog"
    :visible.sync="visible"
    append-to-body
    :close-on-click-modal="false"
    width="500px"
    z-index="1000"
    @closed="$emit('closeEv')"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      style="padding-top: 20px"
    >
      <el-form-item label="原密码" prop="oldPassword" style="width: 400px">
        <el-input
          v-model.trim="form.oldPassword"
          placeholder="请输入原密码"
          type="password"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="设置密码" prop="password" style="width: 400px">
        <el-input
          v-model.trim="form.password"
          placeholder="请输入密码"
          type="password"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="校验密码" prop="repeatPassword" style="width: 400px">
        <el-input
          v-model.trim="form.repeatPassword"
          placeholder="请输入校验密码"
          type="password"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">保 存</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  // 重置密码弹窗
  name: "ResetPasswordDialog",
  created() {
    this.visible = true;
  },
  data() {
    const rules = {
      oldPassword: [
        { required: true, message: "密码不能为空", trigger: "blur" },
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
        {
          min: 6,
          max: 20,
          message: "请输入6到20位字符",
          trigger: "blur",
        },
      ],
      password: [
        { required: true, message: "密码不能为空", trigger: "blur" },
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
        {
          min: 6,
          max: 20,
          message: "请输入6到20位字符",
          trigger: "blur",
        },
      ],
      repeatPassword: [
        { required: true, message: "密码不能为空", trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            if (value !== this.form.password) {
              callback(new Error("两次输入密码不一致"));
            } else {
              callback();
            }
          },
          required: true,
          trigger: "blur",
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
        {
          min: 6,
          max: 20,
          message: "请输入6到20位字符",
          trigger: "blur",
        },
      ],
    };
    return {
      rules,
      visible: false,
      form: {
        oldPassword: "",
        password: "",
        repeatPassword: "",
      },
    };
  },
  computed: {
    computedFormRef() {
      return this.$refs.form;
    },
  },
  methods: {
    submitForm() {
      this.computedFormRef &&
        this.computedFormRef.validate(async (valid) => {
          if (valid) {
            try {
              const { oldPassword: oldPwd, password: newPwd } = this.form;
              await this.$api.resetPassword({
                oldPwd,
                newPwd,
              });
              this.visible = false;
              this.$message.success("密码重置成功，请重新登录");
              this.$router.push({ path: "/login" });
            } catch (error) {}
          } else {
            return false;
          }
        });
    },
  },
};
</script>