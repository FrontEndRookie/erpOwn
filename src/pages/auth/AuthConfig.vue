<template>
  <div class="auth-config">
    <aside class="aside-menu">
      <header>
        <h1>角色创建</h1>
        <i
          class="el-icon-circle-plus-outline"
          @click="openAddPrompt"
          v-auth="['452001_B']"
        ></i>
      </header>
      <div style="margin-top: 10px">
        <el-input
          placeholder="请输入角色名称"
          v-model="search"
          class="input-with-select"
          size="small"
        >
          <el-button
            style="width: auto"
            slot="append"
            icon="el-icon-search"
            size="small"
            type="primary"
          />
        </el-input>
      </div>
      <div class="role-wrap">
        <ul class="role-list">
          <li
            v-for="(item, index) in computedRoles"
            :key="item.id"
            class="role-item"
          >
            <div class="name" :class="{ active: activeRole.id === item.id }">
              <span
                v-show="!item.showEdit"
                style="cursor: pointer"
                @click="activeRole = item"
                >{{ item.roleName }}</span
              >
              <el-input
                size="small"
                v-model.trim="item.roleNameCopy"
                maxlength="15"
                v-show="item.showEdit"
                @blur="editRole(item, index)"
              />
            </div>
            <i
              class="el-icon-edit edit"
              title="编辑"
              @click="showEditInput(item, index)"
              v-auth="['452003_B']"
            ></i>
            <i
              class="el-icon-delete del"
              title="删除"
              @click="delRole(item)"
              v-auth="['452002_B']"
            ></i>
          </li>
        </ul>
      </div>
    </aside>
    <main class="auth-wrap" v-show="activeRole.id">
      <header>
        <h1>
          <span style="font-size: 20px">权限配置</span>
          <el-tag style="margin-left: 10px" size="small">{{
            activeRole.roleName
          }}</el-tag>
        </h1>
        <div style="margin-left: auto">
          <el-button type="primary" @click="saveRoleAuth" v-auth="['452004_B']"
            >保存</el-button
          >
          <el-button @click="getAuthByRole">取消</el-button>
        </div>
      </header>
      <div class="auth-tree">
        <el-tree
          class="tree"
          ref="tree"
          :data="authTree"
          show-checkbox
          node-key="id"
          check-strictly
          default-expand-all
          :default-checked-keys="activeAuthTree"
          :expand-on-click-node="false"
          :props="defaultProps"
          @check="handleCheck"
        >
          <span
            :class="{
              'tree-leaf_B': data.authCode.includes('_B'),
              'tree-leaf_M': data.authCode.includes('_M'),
              'tree-leaf_D': data.authCode.includes('_D'),
            }"
            slot-scope="{ node, data }"
          >
            {{ node.label }}
          </span>
        </el-tree>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  // 权限配置
  name: "AuthConfig",
  created() {
    this.init();
  },
  data() {
    return {
      search: "",
      roles: [],
      activeRole: {},
      activeAuthTree: [],
      authTree: [],
      defaultProps: {
        children: "children",
        label: "authName",
      },
    };
  },
  computed: {
    computedRoles() {
      return this.roles.filter((item) => {
        return item.roleName.includes(this.search);
      });
    },
  },
  methods: {
    init() {
      this.getRoles();
      this.getAuthTree();
    },
    async getRoles() {
      try {
        const {
          data: { data },
        } = await this.$api.getRoles();
        this.roles = data.map((item) => {
          return {
            ...item,
            roleNameCopy: item.roleName,
            showEdit: false,
          };
        });
      } catch (error) {}
    },
    async getAuthTree() {
      const {
        data: { data },
      } = await this.$api.getAuthTree();
      this.authTree = data;
    },
    async openAddPrompt() {
      try {
        const { value } = await this.$prompt("请输入角色名", "新增角色", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputValidator: (val) => {
            if (!val || !val.trim()) {
              return "不能为空";
            }
            if (val.trim().length > 15) {
              return "最多15个字符";
            }
          },
        });
        await this.$api.addRole({ roleName: value.trim() });
        this.getRoles();
        this.$message.success("添加成功");
      } catch (error) {}
    },
    showEditInput(role, index) {
      this.roles.splice(index, 1, {
        ...role,
        showEdit: !role.showEdit,
      });
    },
    async editRole(role, index) {
      const { id, roleNameCopy: roleName } = role;
      try {
        await this.$api.editRole({ id, roleName });
        this.showEditInput(
          {
            ...role,
            roleName,
          },
          index
        );
        await this.getRoles();
        this.$message.success("修改成功");
      } catch (error) {}
    },
    async delRole(role) {
      try {
        const { id, roleName } = role;
        await this.$confirm(`确认删除“${roleName}”吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        await this.$api.delRole({
          params: {
            id,
          },
        });
        this.getRoles();
        this.activeRole = {};
        this.$message.success("删除成功");
      } catch (error) {}
    },
    async getAuthByRole() {
      const { id: roleId } = this.activeRole;
      if (!roleId) {
        this.activeAuthTree = [];
        return;
      }
      const {
        data: { data },
      } = await this.$api.getAuthByRole({
        params: {
          roleId,
        },
      });
      this.activeAuthTree = data;
    },
    handleCheck(currentData, treeData) {
      this.activeAuthTree = treeData.checkedKeys;
    },
    async saveRoleAuth() {
      const {
        activeRole: { id },
        activeAuthTree,
      } = this;
      try {
        await this.$api.saveRoleAuth({
          [id]: activeAuthTree,
        });
        this.$message.success("保存成功");
      } catch (error) {}
    },
  },
  watch: {
    activeRole(newVal) {
      this.getAuthByRole();
    },
    activeAuthTree(newVal) {
      this.$refs.tree.setCheckedKeys(newVal);
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/styles/variable.less";
.auth-config {
  display: flex;
  padding: 20px 20px 50px;
  box-sizing: border-box;
  height: 100%;
  background: #f3f6f9;
  .aside-menu,
  .auth-wrap {
    min-height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
  .aside-menu {
    background: @white;
    padding: 20px;
    width: 240px;
    header {
      display: flex;
      align-items: center;
      font-size: 16px;
      i {
        margin-left: 10px;
        color: @primary;
        cursor: pointer;
      }
    }
    .role-wrap {
      margin-top: 10px;
      flex: 1;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .role-item {
      display: flex;
      align-items: center;
      vertical-align: top;
      padding: 10px;
      margin-bottom: -1px;
      border: 1px solid #d3dce6;
      border-left: none;
      border-right: none;
      font-size: 14px;
      line-height: 32px;
      .name {
        position: relative;
        flex: 1;
        &.active {
          color: @primary;
          font-weight: bold;
        }
      }
      .edit,
      .del {
        font-size: 16px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
  .auth-wrap {
    margin-left: 10px;
    flex: 1;
    padding: 20px;
    header {
      display: flex;
      align-items: center;
    }
    .auth-tree {
      flex: 1;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .tree {
        margin-top: 20px;
        background: transparent;
        /deep/.el-tree-node__content {
          padding: 10px;
          font-size: 16px;
        }
        /deep/.el-tree-node {
          // 一级
          &.is-current .el-tree-node__content,
          &.is-focusable .el-tree-node__content,
          .el-tree-node__content:hover {
            background-color: transparent;
          }
          .el-tree-node {
            // 二级
            background: @white;
            .el-tree-node__children {
              display: flex;
              flex-wrap: wrap;
              border: none;
            }
            .el-tree-node {
              // 三级
            }
          }
        }
      }
    }
  }
}
</style>