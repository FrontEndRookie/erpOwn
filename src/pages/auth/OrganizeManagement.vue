<template>
  <div class="organize-management custom-wrapper">
    <organize-menu
      @organizeTab="organizeTab"
      @getOrgTree="getOrgTree"
      :organizeTree="menuOrganizeTree"
      :defaultShowOrgId="defaultShowOrgId"
    />
    <main class="organize-management-wrap" v-if="computedOrg.show">
      <header class="organize-management-header">
        {{ computedOrg.title }}
      </header>
      <dc-form :inline="true" size="medium">
        <el-form-item>
          <el-input
            v-model.trim="loginName"
            clearable
            type="text"
            placeholder="搜索账号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model.trim="name"
            clearable
            type="text"
            placeholder="搜索姓名"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model.trim="tel"
            clearable
            type="text"
            placeholder="搜索手机号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="roleId"
            placeholder="选择角色"
            filterable
            clearable
          >
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div style="float: right">
          <el-form-item>
            <el-button
              type="primary"
              @click="currentPageChange(1)"
              v-auth="['451000_B']"
              >搜索</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="showSuperiorDialog = true"
              v-auth="['451007_B']"
              >设置负责人</el-button
            >
          </el-form-item>
          <el-form-item style="margin-right: 0">
            <el-button
              type="primary"
              @click="openAccountDialog()"
              v-auth="['451008_B']"
              >新建账号</el-button
            >
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary">关系转移</el-button>
          </el-form-item> -->
        </div>
      </dc-form>
      <!-- 表格 -->
      <dc-table
        :columns="columns"
        :data="list"
        :total="total"
        :current-page="pageNum"
        :page-size="pageSize"
        @page-size-change="pageSizeChange"
        @current-page-change="currentPageChange"
        border
      >
        <template #status="{ row }">
          <el-switch
            :active-value="0"
            :inactive-value="1"
            v-model="row.status"
            @change="changeForbidden(row)"
            :disabled="$utils.authCheckDisabled(['451009_B'])"
          ></el-switch>
        </template>
        <template #tools="{ row }">
          <el-button
            type="text"
            @click="openAccountDialog(row)"
            v-auth="['451010_B']"
            >编辑</el-button
          >
          <!-- <el-button type="text" style="color: #f56c6c" @click="delAccount"
            v-auth="['451011_B']"
            >移出</el-button
          > -->
          <el-button
            type="text"
            @click="openPasswordDialog(row)"
            v-auth="['451012_B']"
            >重置密码</el-button
          >
        </template>
      </dc-table>
    </main>
    <!-- 设置部门上级弹窗 -->
    <superior-dialog
      :organize="currentOrganize"
      ref="superiorDialog"
      v-if="showSuperiorDialog"
      @closeEv="showSuperiorDialog = false"
      @afterEdit="currentPageChange()"
    />
    <!-- 编辑账号弹窗 -->
    <account-dialog
      ref="accountDialog"
      :form="form"
      :organizeTree="organizeTree"
      :roles="roles"
      @closeEv="showAccountDialog = false"
      v-if="showAccountDialog"
      @afterEdit="currentPageChange()"
      @afterAdd="currentPageChange(1)"
    />
    <el-dialog
      title="禁用提醒"
      :visible.sync="forbiddenDialog"
      width="30%"
      @close="closeForbiddenDialog(false)">
      <div class="dialog-text">禁用账号将解除已有企业微信绑定，被禁用账号会被强制下线</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeForbiddenDialog(false)">取 消</el-button>
        <el-button type="primary" @click="closeForbiddenDialog(true)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑密码弹窗 -->
    <password-dialog
      ref="passwordDialog"
      :form="form"
      @closeEv="showPasswordDialog = false"
      v-if="showPasswordDialog"
    />
  </div>
</template>

<script>
import OrganizeMenu from "./OrganizeMenu";
import SuperiorDialog from "./SuperiorDialog";
import AccountDialog from "./AccountDialog";
import PasswordDialog from "./PasswordDialog";
export default {
  // 部门管理
  name: "OrganizeManagement",
  components: {
    OrganizeMenu,
    SuperiorDialog,
    AccountDialog,
    PasswordDialog,
  },
  created() {
    this.init();
  },
  data() {
    return {
      showAccountDialog: false,
      forbiddenDialog: false,
      forbiddenInfo: {},
      showPasswordDialog: false,
      showSuperiorDialog: false,
      loginName: "",
      name: "",
      tel: "",
      roleId: "",
      roles: [],
      form: {},
      organizeTree: [],
      visibleOrganizeIds: [],
      columns: [
        {
          prop: "id",
          label: "用户id",
          width: "60",
        },
        {
          prop: "loginName",
          label: "账号",
        },
        {
          prop: "name",
          label: "姓名",
        },
        {
          prop: "tel",
          label: "手机号",
        },
        {
          prop: "qq",
          label: "QQ号",
        },
        {
          prop: "roleNames",
          label: "角色",
        },
        {
          prop: "orgNames",
          label: "部门",
          width: "160",
        },
        {
          prop: "superFlagText",
          label: "负责人显示",
        },
        {
          prop: "status",
          label: "状态",
          width: "60",
        },
        {
          prop: "createTime",
          label: "注册时间",
          width: "160",
        },
        {
          prop: "tools",
          label: "操作",
          width: "170",
          fixed: "right",
        },
      ],
      list: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      currentOrganize: {},
      defaultShowOrgId: "",
    };
  },
  computed: {
    computedOrg() {
      const {
        currentOrganize: { name, id },
        total,
      } = this;
      return {
        title: `${name}（ ${total} ）`,
        show: Boolean(id),
      };
    },
    computedOrganizeTree() {
      return organizeTree;
    },
    menuOrganizeTree() {
      const { organizeTree, visibleOrganizeIds } = this;
      function recursion(org) {
        org = {
          ...org,
          disabled: !visibleOrganizeIds.includes(org.id),
        };
        if (org.children) {
          org.children = [
            ...org.children.map((item) => {
              return recursion(item);
            }),
          ];
        }
        return org;
      }
      return organizeTree.map((item) => {
        return recursion(item);
      });
    },
  },
  methods: {
    init() {
      this.getOrgTree();
      this.getRoles();
    },
    // 部门菜单切换，列表重新渲染
    organizeTab(organize) {
      this.currentOrganize = organize;
      this.currentPageChange(1);
    },
    async getList() {
      const {
        pageNum,
        pageSize,
        currentOrganize: { id: orgId },
        loginName,
        name,
        tel,
        roleId,
      } = this;
      if (!orgId) {
        return;
      }
      try {
        const {
          data: {
            data: { records, total },
          },
        } = await this.$api.getOrgMems({
          params: {
            pageSize,
            pageNum,
            orgId,
            loginName,
            name,
            tel,
            roleId: roleId || null,
          },
        });
        this.list = records.map((item) => {
          const { superFlag } = item;
          return {
            ...item,
            superFlagText: superFlag === 0 ? "负责人" : "",
          };
        });
        this.total = total;
      } catch (error) {}
    },
    async getOrgTree(callback = () => {}) {
      const {
        data: { data },
      } = await this.$api.getOrgTree();
      this.organizeTree = data ? [data] : [];
      this.findVisibleOrgs();
      callback && callback();
    },
    async getRoles() {
      try {
        const {
          data: { data },
        } = await this.$api.getRoles();
        this.roles = data.map((item) => {
          return {
            ...item,
            value: item.id,
            label: item.roleName,
          };
        });
      } catch (error) {}
    },
    pageSizeChange(size) {
      this.pageSize = size;
      this.getList();
    },
    currentPageChange(page) {
      this.pageNum = page || this.pageNum;
      this.getList();
    },
    changeStatus(row) {
      console.log(row);
    },
    // 删除账号
    async delAccount() {
      try {
        await this.$confirm(`是否删除该账号？`, "提示", {
          type: "warning",
          lockScroll: false,
        });
      } catch (error) {}
    },
    // 打开编辑|新建账号弹窗
    openAccountDialog(account = {}) {
      if (account.id) {
        const { roleIds, orgIdList } = account;
        this.form = {
          ...account,
          roleIds: roleIds
            ? roleIds.split(",").map((item) => Number(item))
            : [],
          orgIds: orgIdList,
        };
      } else {
        this.form = {
          orgIds: [],
          roleIds: [],
        };
      }
      this.showAccountDialog = true;
    },
    // 打开编辑密码弹窗
    openPasswordDialog(account = {}) {
      this.form = {
        id: account.id,
      };
      this.showPasswordDialog = true;
    },
    changeForbidden(row){
      if(row.status === 0){
        this.editOrgMemStatus(row)
      }else{
        this.forbiddenInfo = row
        this.forbiddenDialog = true
      }
    },
    closeForbiddenDialog(type){
      if(type){
        this.editOrgMemStatus(this.forbiddenInfo)
      }else{
        this.forbiddenInfo = {}
        this.forbiddenDialog = false
        this.currentPageChange()
      }
    },
    // 修改用户状态 -1删除 0启用 1禁用
    async editOrgMemStatus(account = {}) {
      const { id, status } = account;
      try {
        var data = await this.$api.editSysUser(
          {
            id,
            status,
          },
          {
            headers: {
              diffFlag: 1,
            },
          }
        );
        if(data.data.code == 200){
          this.$message.success("操作成功")
        }else{
          this.$message.error(data.data.message)
        }
        this.forbiddenInfo = {}
        this.forbiddenDialog = false
        this.currentPageChange();
      } catch (error) {}
    },
    async findVisibleOrgs() {
      const {
        data: { data },
      } = await this.$api.findVisibleOrgs();
      this.visibleOrganizeIds = data;
      this.defaultShowOrgId = data[0];
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/styles/variable.less";
.organize-management {
  display: flex;
  padding: 20px 20px 50px;
  box-sizing: border-box;
  height: 100%;
  background: #f3f6f9;
  &-wrap {
    box-sizing: border-box;
    background: #fff;
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    padding: 10px;
    overflow-y: auto;
  }
  &-header {
    padding: 16px 0;
    font-size: 20px;
  }
}
/deep/ .el-dialog__header{
    background: #fff;
    .el-dialog__title{
      font-size:24px;
      font-weight: bold;
      line-height: 60px;
      color: #333;
    }
  }
  .dialog-text{
    font-size:24px;
    line-height: 30px;
    padding: 20px 0   ;
  }
  .dialog-footer{
    display: flex;
    justify-content: space-around;
    padding: 0 30px;
    .el-button{
      width: 140px;
    }
  }
</style>