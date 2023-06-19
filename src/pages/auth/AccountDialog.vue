<template>
  <el-dialog
    :title="computedTitle"
    class="account-dialog"
    :visible.sync="visible"
    append-to-body
    :close-on-click-modal="false"
    width="800px"
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
      <el-form-item label="账号" prop="loginName" style="width: 400px">
        <el-input
          v-model.trim="form.loginName"
          placeholder="请输入账号"
          maxlength="20"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name" style="width: 400px">
        <el-input
          v-model.trim="form.name"
          placeholder="请输入姓名"
          maxlength="10"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="tel" style="width: 400px">
        <el-input
          v-model.trim="form.tel"
          placeholder="请输入手机号"
          maxlength="11"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="QQ号" prop="qq" style="width: 400px">
        <el-input
          v-model.trim="form.qq"
          placeholder="请输入QQ号"
          maxlength="20"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="组织架构" prop="orgIds">
        <el-checkbox-group v-model="form.orgIds" style="display: none" />
        <el-tree
          style="margin-top: 6px"
          show-checkbox
          check-strictly
          :data="computedOrganizeTree"
          :props="defaultProps"
          :default-expanded-keys="form.orgIds"
          :default-checked-keys="form.orgIds"
          node-key="id"
          :expand-on-click-node="false"
          @check="handleCheck"
        />
      </el-form-item>
      <el-form-item label="角色" prop="roleIds">
        <el-checkbox-group v-model="form.roleIds" :max="10">
          <el-checkbox
            @mouseenter.native="item.showDisabledText = true"
            @mouseleave.native="item.showDisabledText = false"
            v-for="item in roleList"
            :key="item.id"
            :label="item.id"
            :disabled="item.disabled"
          >
            <el-tooltip
              effect="light"
              placement="top"
              manual
              :value="item.showDisabledText && item.disabled"
              :content="item.disabledText"
            >
              <span>{{ item.roleName }}</span>
            </el-tooltip>
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="设置密码"
        prop="password"
        style="width: 400px"
        v-if="!form.id"
      >
        <el-input
          v-model.trim="form.password"
          placeholder="请输入密码"
          type="password"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        label="校验密码"
        prop="repeatPassword"
        style="width: 400px"
        v-if="!form.id"
      >
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
  // 编辑账号弹窗
  name: "AccountDialog",
  props: {
    form: {
      type: Object,
      default: () => {},
    },
    organizeTree: {
      type: Array,
      default: () => [],
    },
    roles: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    this.visible = true;
    this.init();
  },
  data() {
    const rules = {
      loginName: [
        { required: true, message: "请输入账号", trigger: "blur" },
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
          min: 2,
          max: 20,
          message: "请输入2到20位字符",
          trigger: "blur",
        },
      ],
      name: [
        { required: true, message: "请输入姓名", trigger: "blur" },
        {
          min: 1,
          max: 10,
          message: "请输入1到20位字符",
          trigger: "blur",
        },
      ],
      tel: [
        { required: true, message: "请输入手机号", trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            if (value.length !== 11 || isNaN(value)) {
              callback(new Error("仅支持11位数字填写"));
            } else {
              callback();
            }
          },
          required: true,
          trigger: "blur",
        },
      ],
      qq: [
        { required: true, message: "请输入QQ号", trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            console.log(typeof value);
            if (value.length < 6 || value.length > 20 || isNaN(value)) {
              callback(new Error("仅支持6-20位数字填写"));
            } else {
              callback();
            }
          },
          required: true,
          trigger: "blur",
        },
      ],
      roleIds: [
        {
          type: "array",
          required: true,
          message: "请选择角色",
          trigger: "change",
        },
      ],
      orgIds: [
        {
          type: "array",
          required: true,
          message: "请选择组织架构",
          trigger: "change",
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
      defaultProps: {
        children: "children",
        label: "name",
      },
      roleList: [],
    };
  },
  computed: {
    computedOrganizeTree() {
      const orgIds = this.form.orgIds;
      function recursion(org) {
        if (orgIds.length >= 10) {
          org = {
            ...org,
            disabled: !orgIds.includes(org.id),
          };
        }
        if (org.children) {
          org.children = [
            ...org.children.map((item) => {
              return recursion(item);
            }),
          ];
        }
        return org;
      }
      const organizeTree = this.organizeTree.map((item) => {
        return recursion(item);
      });
      return organizeTree;
    },
    computedFormRef() {
      return this.$refs.form;
    },
    computedTitle() {
      return `${this.form.id ? "编辑" : "新建"}账号`;
    },
    computedSubmit() {
      return this.form.id
        ? {
            api: "editSysUser",
            text: "保存",
            emitEv: "afterEdit",
          }
        : {
            api: "addSysUser",
            text: "添加",
            emitEv: "afterAdd",
          };
    },
  },
  methods: {
    init() {
      this.roleList = this.roles.map((role) => {
        const { disabledText, disabled } = (() => {
          const { holdMscs, holdPrcp, holdPscs } = this.form;
          switch (role.roleName) {
            case "售前客服":
              return {
                disabledText: "该账户已关联客户/订单",
                disabled: holdPscs,
              };
            case "售中客服":
              return {
                disabledText: "该账户已关联代理/订单",
                disabled: holdMscs,
              };
            case "航线负责人":
              return {
                disabledText: "该账户已关联航线/订单",
                disabled: holdPrcp,
              };
            default:
              return {
                disabled: false,
              };
          }
        })();
        return {
          ...role,
          disabledText,
          disabled,
          showDisabledText: false,
        };
      });
    },
    handleCheck(currentData, treeData) {
      this.form.orgIds = treeData.checkedKeys;
    },
    submitForm() {
      this.computedFormRef &&
        this.computedFormRef.validate(async (valid) => {
          if (valid) {
            try {
              await this.editAccount();
              this.$emit(this.computedSubmit.emitEv);
              this.visible = false;
            } catch (error) {}
          } else {
            return false;
          }
        });
    },
    // 编辑|新建账号
    async editAccount() {
      const { id, loginName, name, orgIds, password, qq, roleIds, tel } =
        this.form;
      const apiData = {
        loginName,
        name,
        orgIds: orgIds.join(","),
        password,
        qq,
        roleIds: roleIds.join(","),
        tel,
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
  },
};
</script>

<style lang="less" scoped>
.account-dialog {
}
</style>