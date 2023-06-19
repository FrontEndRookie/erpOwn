<template>
  <div class="field-auth-config">
    <aside class="aside-menu">
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
            v-for="item in computedRoles"
            :key="item.id"
            class="role-item"
            v-auth:disabled="['453000_B']"
            :class="{ active: activeRole.id === item.id }"
            @click="activeRole = item"
          >
            <span style="margin-right: 10px">{{ item.roleName }}</span>
            <i class="el-icon-edit edit" title="编辑"></i>
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
      </header>
      <div class="tab-bar" style="margin-top: 20px; padding-bottom: 20px">
        <el-radio-group v-model="activeTab">
          <el-radio-button label="字段权限"></el-radio-button>
          <el-radio-button label="按钮权限"></el-radio-button>
        </el-radio-group>
        <div style="margin-left: auto">
          <el-button
            type="primary"
            @click="saveRoleFieldAuth"
            v-show="activeTab === '字段权限'"
            v-auth="['453001_B']"
            >保存</el-button
          >
          <el-button
            type="primary"
            @click="saveRoleBtnAuth"
            v-show="activeTab === '按钮权限'"
            v-auth="['453002_B']"
            >保存</el-button
          >
          <el-button @click="getFieldAuthTreeByRole">取消</el-button>
        </div>
      </div>
      <el-checkbox-group
        v-model="activeAuthTreeLevels"
        @change="activeAuthTreeLevelsChange"
      >
        <!-- 字段权限 -->
        <section class="field-auth-tree" v-show="activeTab === '字段权限'">
          <div v-for="(dir, dirIndex) in fieldAuthTree" :key="dir.id">
            <table class="dir-table">
              <thead>
                <tr>
                  <th style="width: 160px">
                    <i
                      style="font-size: 20px"
                      :class="{
                        'el-icon-caret-bottom': !dir.hide,
                        'el-icon-caret-right': dir.hide,
                      }"
                      @click="
                        fieldAuthTree.splice(dirIndex, 1, {
                          ...dir,
                          hide: !dir.hide,
                        })
                      "
                    ></i>
                    <span>{{ dir.fieldName }}</span>
                  </th>
                  <th>查看权限</th>
                  <th>编辑权限</th>
                  <th>列表展示(显示/隐藏)</th>
                </tr>
              </thead>
            </table>
            <table
              v-for="(menu, menuIndex) in dir.children"
              :key="menu.id"
              v-show="!dir.hide"
              class="menu-table"
            >
              <thead>
                <tr>
                  <th style="width: 160px">
                    <i
                      style="font-size: 20px"
                      :class="{
                        'el-icon-caret-bottom': !menu.hide,
                        'el-icon-caret-right': menu.hide,
                      }"
                      @click="
                        dir.children.splice(menuIndex, 1, {
                          ...menu,
                          hide: !menu.hide,
                        })
                      "
                    ></i>
                    <el-checkbox
                      :indeterminate="
                        indeterminate({
                          code: menu.fieldCode,
                          mode: 'all',
                        })
                      "
                      class="check-all"
                      :label="`${menu.fieldCode}_all`"
                      @change="
                        (checked) =>
                          changeAll({
                            code: menu.fieldCode,
                            checked,
                            mode: 'all',
                          })
                      "
                      >{{ menu.fieldName }}</el-checkbox
                    >
                  </th>
                  <th>
                    <el-checkbox
                      :indeterminate="
                        indeterminate({
                          value: menu,
                          code: menu.fieldCode,
                          mode: 'view',
                        })
                      "
                      :label="`${menu.fieldCode}_all_view`"
                      class="check-all"
                      @change="
                        (checked) =>
                          changeAll({
                            code: menu.fieldCode,
                            checked,
                            mode: 'view',
                          })
                      "
                      >全部</el-checkbox
                    >
                  </th>
                  <th>
                    <el-checkbox
                      :disabled="
                        menu.children.every((i) => [3, 4].includes(i.confType))
                      "
                      :indeterminate="
                        indeterminate({
                          code: menu.fieldCode,
                          mode: 'edit',
                        })
                      "
                      :label="`${menu.fieldCode}_all_edit`"
                      class="check-all"
                      @change="
                        (checked) =>
                          changeAll({
                            code: menu.fieldCode,
                            checked,
                            mode: 'edit',
                          })
                      "
                      >全部</el-checkbox
                    >
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody v-show="!menu.hide">
                <tr v-for="field in menu.children" :key="field.id">
                  <td>{{ field.fieldName }}</td>
                  <td>
                    <el-checkbox
                      :label="`${field.fieldCode}_view`"
                      :disabled="
                        disabledLevels.includes(`${field.fieldCode}_view`)
                      "
                      >{{ "" }}</el-checkbox
                    >
                  </td>
                  <td>
                    <el-checkbox
                      :label="`${field.fieldCode}_edit`"
                      :disabled="
                        disabledLevels.includes(`${field.fieldCode}_edit`)
                      "
                      >{{ "" }}</el-checkbox
                    >
                  </td>
                  <td>
                    <el-checkbox
                      v-show="field.listEditFlag === 1"
                      :disabled="field.listEditFlag === 0"
                      :label="`${field.fieldCode}_list`"
                      >{{ "" }}</el-checkbox
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <!-- 按钮权限 -->
        <section class="btn-auth-tree" v-show="activeTab === '按钮权限'">
          <table v-for="dir in btnAuthTree" :key="dir.id">
            <tbody>
              <tr v-for="menu in dir.children" :key="menu.id">
                <td>
                  <el-checkbox
                    :indeterminate="
                      indeterminate({
                        code: menu.fieldCode,
                        mode: 'edit',
                      })
                    "
                    :label="`${menu.fieldCode}_all_edit`"
                    @change="
                      (checked) =>
                        changeAll({
                          code: menu.fieldCode,
                          checked,
                          mode: 'edit',
                        })
                    "
                    >{{ menu.fieldName }}
                  </el-checkbox>
                </td>
                <td v-for="btn in menu.children" :key="btn.id">
                  <el-checkbox :label="`${btn.fieldCode}_edit`">{{
                    btn.fieldName
                  }}</el-checkbox>
                </td>
                <td v-for="empty in 4 - menu.children.length" :key="empty"></td>
              </tr>
            </tbody>
          </table>
        </section>
      </el-checkbox-group>
    </main>
  </div>
</template>

<script>
export default {
  name: "FieldAuthConfig",
  created() {
    this.init();
  },
  data() {
    return {
      search: "",
      roles: [],
      activeRole: {},
      fieldAuthTree: [],
      btnAuthTree: [],
      activeTab: "字段权限",
      activeAuthTree: [],
      activeAuthTreeLevels: [],
    };
  },
  computed: {
    activeFieldAuthTree() {
      return this.activeAuthTree.filter((item) => item.fieldType === 1);
    },
    activeBtnAuthTree() {
      return this.activeAuthTree.filter((item) => item.fieldType === 12);
    },
    computedRoles() {
      return this.roles.filter((item) => {
        return item.roleName.includes(this.search);
      });
    },
    allLevels() {
      return this.activeAuthTree.reduce((levels, item) => {
        levels.push(`${item.fieldCode}_edit`, `${item.fieldCode}_view`);
        return levels;
      }, []);
    },
    disabledLevels() {
      return this.activeAuthTree.reduce((levels, item) => {
        switch (item.confType) {
          case 2:
            levels.push(`${item.fieldCode}_view`);
            break;
          case 3:
            levels.push(`${item.fieldCode}_edit`);
            break;
          case 4:
            levels.push(`${item.fieldCode}_edit`, `${item.fieldCode}_view`);
            break;
          default:
            break;
        }
        return levels;
      }, []);
    },
  },
  methods: {
    init() {
      this.getRoles();
      this.getFieldAuthTree();
      this.getBtnAuthTree();
    },
    async getRoles() {
      try {
        const {
          data: { data },
        } = await this.$api.getRoles();
        this.roles = data;
      } catch (error) {}
    },
    async getFieldAuthTree() {
      const {
        data: { data },
      } = await this.$api.getFieldAuthTree();
      this.fieldAuthTree = data;
    },
    async getBtnAuthTree() {
      const {
        data: { data },
      } = await this.$api.getBtnAuthTree();
      this.btnAuthTree = data;
    },
    async getFieldAuthTreeByRole() {
      const { id: roleId } = this.activeRole;
      if (!roleId) {
        this.activeAuthTree = [];
        this.activeAuthTreeLevels = [];
        return;
      }
      const {
        data: { data: authTree },
      } = await this.$api.getFieldAuthTreeByRole({
        params: {
          roleId,
        },
      });
      this.activeAuthTree = authTree;
      this.activeAuthTreeLevels = authTree.reduce((levels, item) => {
        if (item.listFlag === 1) {
          levels.push(`${item.fieldCode}_list`);
        }
        if (item.level === 0) {
          return levels;
        }
        switch (item.level) {
          case 1:
            levels.push(`${item.fieldCode}_view`);
            break;
          case 2:
            levels.push(`${item.fieldCode}_view`, `${item.fieldCode}_edit`);
            break;
          default:
            break;
        }
        return levels;
      }, []);
      this.allSelectInitHander();
    },
    async saveRoleFieldAuth() {
      const fieldAuths = this.activeFieldAuthTree.reduce((auths, item) => {
        const edit = this.activeAuthTreeLevels.includes(
          `${item.fieldCode}_edit`
        );
        const view = this.activeAuthTreeLevels.includes(
          `${item.fieldCode}_view`
        );
        const list = this.activeAuthTreeLevels.includes(
          `${item.fieldCode}_list`
        );
        if (edit || view || list) {
          auths.push({
            fieldCode: item.fieldCode,
            authFieldId: item.id,
            level: (() => {
              if (edit) {
                return 2;
              }
              if (!edit && view) {
                return 1;
              }
              return 0;
            })(),
            listFlag: list ? 1 : 0,
          });
        }
        return auths;
      }, []);
      const fieldAuthCodes = fieldAuths.map((item) => item.fieldCode);
      const warningFieldAuths = [
        {
          fieldCode: "106025_FC",
          warning: "只有勾选应收账单才可以勾选应收总计",
          requireCode: "104010_FR",
        },
        {
          fieldCode: "106030_FC",
          warning: "只有勾选应付账单才可以勾选应付总计",
          requireCode: "104020_FR",
        },
        {
          fieldCode: "106040_FC",
          warning: "只有勾选应收账单才可以勾选应收已核销统计",
          requireCode: "104010_FR",
        },
        {
          fieldCode: "106051_FC",
          warning: "只有勾选应收账单才可以勾选应收未核销总计",
          requireCode: "104010_FR",
        },
      ];
      const isWarning = warningFieldAuths.some((item) => {
        if (
          fieldAuthCodes.includes(item.fieldCode) &&
          !fieldAuthCodes.includes(item.requireCode)
        ) {
          this.$message.error(item.warning);
          return true;
        }
      });
      if (isWarning) {
        return;
      }
      const roleId = this.activeRole.id;
      await this.$api.saveRoleFieldAuth({
        [roleId]: fieldAuths.map((item) => {
          return {
            ...item,
            roleId: roleId,
          };
        }),
      });
      this.$message.success("保存成功");
      this.getFieldAuthTreeByRole();
    },
    async saveRoleBtnAuth() {
      const btnAuths = this.activeBtnAuthTree.reduce((auths, item) => {
        const edit = this.activeAuthTreeLevels.includes(
          `${item.fieldCode}_edit`
        );
        if (edit) {
          auths.push({
            authFieldId: item.id,
            level: 2,
          });
        }
        return auths;
      }, []);
      const roleId = this.activeRole.id;
      await this.$api.saveRoleBtnAuth({
        [roleId]: btnAuths.map((item) => {
          return {
            ...item,
            roleId: roleId,
          };
        }),
      });
      this.$message.success("保存成功");
      this.getFieldAuthTreeByRole();
    },
    activeAuthTreeLevelsChange(levels) {
      this.allSelectHander();
    },
    changeAll({ code, mode = "all", checked }) {
      const { levels, viewLevels, editLevels } =
        this.getAuthLevelsByParentCode(code);
      if (mode === "view") {
        if (checked) {
          this.activeAuthTreeLevels.push(...viewLevels);
        } else {
          this.activeAuthTreeLevels = this.activeAuthTreeLevels.filter(
            (level) => {
              return !viewLevels.includes(level);
            }
          );
          this.deduplicatedLevels();
        }
        return;
      }
      if (mode === "edit") {
        if (checked) {
          this.activeAuthTreeLevels.push(...editLevels);
        } else {
          this.activeAuthTreeLevels = this.activeAuthTreeLevels.filter(
            (level) => {
              return !editLevels.includes(level);
            }
          );
          this.deduplicatedLevels();
        }
        return;
      }
      if (mode === "all") {
        if (checked) {
          this.activeAuthTreeLevels.push(...levels);
        } else {
          this.activeAuthTreeLevels = this.activeAuthTreeLevels.filter(
            (level) => {
              return !levels.includes(level);
            }
          );
          this.deduplicatedLevels();
        }
      }
    },
    getAuthLevelsByParentCode(parentCode) {
      const levels = this.activeAuthTree
        .filter((item) => item.parentCode === parentCode)
        .reduce((levels, item) => {
          const viewLevel = `${item.fieldCode}_view`;
          const editLevel = `${item.fieldCode}_edit`;
          if (!this.disabledLevels.includes(viewLevel)) {
            levels.push(viewLevel);
          }
          if (!this.disabledLevels.includes(editLevel)) {
            levels.push(editLevel);
          }
          return levels;
        }, []);
      const viewLevels = levels.filter((item) => item.includes("_view"));
      const editLevels = levels.filter((item) => item.includes("_edit"));
      return {
        levels,
        viewLevels,
        editLevels,
      };
    },
    getAllAuthLevelsByParentCode(parentCode) {
      const levels = this.activeAuthTree
        .filter((item) => item.parentCode === parentCode)
        .reduce((levels, item) => {
          const viewLevel = `${item.fieldCode}_view`;
          const editLevel = `${item.fieldCode}_edit`;
          levels.push(viewLevel, editLevel);
          return levels;
        }, []);
      const viewLevels = levels.filter((item) => item.includes("_view"));
      const editLevels = levels.filter((item) => item.includes("_edit"));
      return {
        levels,
        viewLevels,
        editLevels,
      };
    },
    indeterminate({ code, mode = "all", value }) {
      const { levels, viewLevels, editLevels } =
        this.getAllAuthLevelsByParentCode(code);
      if (mode === "view") {
        if (viewLevels.length === 0) {
          return false;
        }
        return (
          viewLevels.some((item) => this.activeAuthTreeLevels.includes(item)) &&
          !viewLevels.every((item) => this.activeAuthTreeLevels.includes(item))
        );
      }
      if (mode === "edit") {
        if (editLevels.length === 0) {
          return false;
        }
        return (
          editLevels.some((item) => this.activeAuthTreeLevels.includes(item)) &&
          !editLevels.every((item) => this.activeAuthTreeLevels.includes(item))
        );
      }
      if (mode === "all") {
        if (levels.length === 0) {
          return false;
        }
        return (
          levels.some((item) => this.activeAuthTreeLevels.includes(item)) &&
          !levels.every((item) => this.activeAuthTreeLevels.includes(item))
        );
      }
    },
    allSelectInitHander() {
      const authTree = this.activeAuthTree;
      authTree.forEach((item) => {
        if ([0, 11].includes(item.fieldType)) {
          const auth = this.getAuthDetail(
            item.fieldCode,
            {
              0: "field",
              11: "btn",
            }[item.fieldType]
          );
          const children = authTree.filter(
            (i) => i.parentCode === item.fieldCode
          );
          const views = children.filter((i) => i.level === 1 || i.level === 2);
          const edits = children.filter((i) => i.level === 2);
          const codeAllView = `${item.fieldCode}_all_view`;
          const codeAllEdit = `${item.fieldCode}_all_edit`;
          const codeAll = `${item.fieldCode}_all`;
          if (auth.children.length === views.length) {
            this.activeAuthTreeLevels.push(codeAllView);
          }
          if (auth.children.length === edits.length) {
            this.activeAuthTreeLevels.push(codeAllView, codeAllEdit);
            this.activeAuthTreeLevels.push(codeAll);
          }
          if (edits.length <= 0) {
            this.activeAuthTreeLevels = this.activeAuthTreeLevels.filter(
              (i) => {
                return ![codeAllEdit, codeAll].includes(i);
              }
            );
            this.deduplicatedLevels();
          }
          if (edits.length <= 0 && views.length <= 0) {
            this.activeAuthTreeLevels = this.activeAuthTreeLevels.filter(
              (i) => {
                return ![codeAllView, codeAllEdit, codeAll].includes(i);
              }
            );
            this.deduplicatedLevels();
          }
        }
      });
    },
    allSelectHander() {
      const authTree = this.activeAuthTree;
      authTree.forEach((item) => {
        if ([0, 11].includes(item.fieldType)) {
          const { viewLevels, editLevels } = this.getAuthLevelsByParentCode(
            item.fieldCode
          );
          const codeAllView = `${item.fieldCode}_all_view`;
          const codeAllEdit = `${item.fieldCode}_all_edit`;
          const codeAll = `${item.fieldCode}_all`;
          if (
            viewLevels.every((i) => this.activeAuthTreeLevels.includes(i)) &&
            viewLevels.length > 0
          ) {
            this.activeAuthTreeLevels.push(codeAllView);
          }
          if (
            editLevels.every((i) => this.activeAuthTreeLevels.includes(i)) &&
            editLevels.length > 0
          ) {
            this.activeAuthTreeLevels.push(codeAllEdit);
          }
          if (
            [codeAllView, codeAllEdit].every((i) =>
              this.activeAuthTreeLevels.includes(i)
            )
          ) {
            this.activeAuthTreeLevels.push(codeAll);
          }
          if (!viewLevels.every((i) => this.activeAuthTreeLevels.includes(i))) {
            this.activeAuthTreeLevels = this.activeAuthTreeLevels.filter(
              (i) => {
                return ![codeAllView].includes(i);
              }
            );
            this.deduplicatedLevels();
          }
          if (!editLevels.every((i) => this.activeAuthTreeLevels.includes(i))) {
            this.activeAuthTreeLevels = this.activeAuthTreeLevels.filter(
              (i) => {
                return ![codeAllEdit].includes(i);
              }
            );
            this.deduplicatedLevels();
          }
          if (
            ![codeAllView, codeAllEdit].every((i) =>
              this.activeAuthTreeLevels.includes(i)
            )
          ) {
            this.activeAuthTreeLevels = this.activeAuthTreeLevels.filter(
              (i) => {
                return ![codeAll].includes(i);
              }
            );
            this.deduplicatedLevels();
          }
        }
      });
    },
    getAuthDetail(code, type) {
      const authTree = (() => {
        return {
          btn: this.btnAuthTree,
          field: this.fieldAuthTree,
        }[type];
      })();
      let result = null;
      function getDetail(arr) {
        arr.forEach((item) => {
          if (item.fieldCode === code) {
            result = item;
          } else {
            getDetail(item.children);
          }
        });
      }
      getDetail(authTree);
      return result;
    },
    deduplicatedLevels() {
      this.activeAuthTreeLevels = [...new Set(this.activeAuthTreeLevels)];
    },
  },
  watch: {
    activeRole(newVal) {
      this.getFieldAuthTreeByRole();
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/styles/variable.less";
.field-auth-config {
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
    background: @white;
  }
  .aside-menu {
    padding: 20px;
    width: 240px;
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
      padding: 10px;
      margin-bottom: -1px;
      border: 1px solid #d3dce6;
      border-left: none;
      border-right: none;
      font-size: 14px;
      line-height: 32px;
      cursor: pointer;
      &.active {
        color: @primary;
        font-weight: bold;
      }
    }
  }
  .auth-wrap {
    margin-left: 10px;
    flex: 1;
    padding: 20px;
    min-width: 0;
    .tab-bar {
      display: flex;
    }
    .el-checkbox-group {
      flex: 1;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
        color: #409eff !important;
      }
      /deep/.el-checkbox__input.is-checked .el-checkbox__inner,
      /deep/.el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #409eff !important;
        border-color: #409eff !important;
      }
      /deep/.el-checkbox__input.is-disabled .el-checkbox__inner {
        background-color: #d7d7d7 !important;
        border-color: #797979 !important;
        &::after {
          border-color: #797979 !important;
          border-width: 2px;
        }
      }
      /deep/.el-checkbox__inner {
        width: 14px !important;
        height: 14px !important;
      }
    }
    .field-auth-tree,
    .btn-auth-tree {
      table {
        border-collapse: collapse;
        margin-top: -1px;
        background: @white;
        &:nth-of-type(1) {
          margin-top: 0;
        }
        &.dir-table {
          position: sticky;
          top: 0;
          background: @primary;
          z-index: 3;
          th {
            color: @white;
          }
        }
        th,
        td {
          min-width: 160px;
          padding: 10px;
          border: 1px solid #000;
          font-size: 12px !important;
          text-align: center;
        }
        th {
          font-size: 14px !important;
          color: #409eff;
        }
        th {
          &:nth-of-type(1) {
            text-align: left;
          }
        }
        &.menu-table {
          thead {
            position: sticky;
            top: 41px;
            background: #ecf5ff;
            z-index: 2;
          }
          th {
            &:nth-of-type(1) {
            }
          }
        }
      }
      /deep/.check-all:not(.is-disabled) .el-checkbox__label {
        color: #409eff;
      }
    }
    .btn-auth-tree {
      table {
        td {
          min-width: 100px;
          text-align: left;
          /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
            color: #606266 !important;
          }
        }
      }
    }
  }
}
</style>