<template>
  <aside class="organize-menu">
    <div class="organize-menu-wrap">
      <header>
        <h1>部门管理</h1>
        <div class="move-tools">
          <p
            :class="{ disabled: currentMoveStatus.moveUpDisabled }"
            @click="organizeMove('up')"
            v-auth="['451005_B']"
          >
            <i class="el-icon-top"></i>
            <span>上移</span>
          </p>
          <p
            :class="{ disabled: currentMoveStatus.moveDownDisabled }"
            @click="organizeMove('down')"
            v-auth="['451006_B']"
          >
            <i class="el-icon-bottom"></i>
            <span>下移</span>
          </p>
        </div>
      </header>
      <div class="tree-list">
        <el-tree
          ref="tree"
          :data="organizeTree"
          :props="defaultProps"
          @current-change="handleNodeChange"
          default-expand-all
          highlight-current
          node-key="id"
          :expand-on-click-node="false"
          :current-node-key="currentNodeKey"
        >
          <span
            slot-scope="{ node, data }"
            style="font-size: 14px"
            :style="{ color: data.disabled ? '#DCDFE6' : '' }"
          >
            {{ node.label }}
          </span>
        </el-tree>
      </div>
      <div class="tools">
        <el-button
          type="primary"
          size="mini"
          :disabled="addSameDisabled"
          @click="openOrganizePrompt({ action: 'add', level: 'same' })"
          v-auth="['451001_B']"
          >添加平级</el-button
        >
        <el-button
          type="primary"
          size="mini"
          :disabled="addChildDisabled"
          @click="openOrganizePrompt({ action: 'add', level: 'child' })"
          v-auth="['451002_B']"
          >添加子级</el-button
        >
        <el-button
          type="primary"
          size="mini"
          :disabled="editDisabled"
          @click="openOrganizePrompt({ action: 'edit' })"
          v-auth="['451003_B']"
          >编辑名称</el-button
        >
        <el-button
          type="primary"
          size="mini"
          :disabled="delDisabled"
          @click="delOrganize"
          v-auth="['451004_B']"
          >删除部门</el-button
        >
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  // 部门管理菜单
  name: "OrganizeMenu",
  props: {
    organizeTree: {
      type: Array,
      default: () => [],
    },
    defaultShowOrgId: {
      type: [Number, String],
      default: "",
    },
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name",
      },
      currentNodeKey: "",
      currentNode: null,
    };
  },
  computed: {
    computedTreeRef() {
      return this.$refs.tree;
    },
    parentNode() {
      const { currentNode, currentNodeData } = this;
      return currentNode && currentNode.parent;
    },
    currentMoveStatus() {
      const {
        currentNodeKey,
        isCurrentTop,
        isCurrentBottom,
        currentNodeDisabled,
      } = this;
      if (!currentNodeKey) {
        return {
          moveUpDisabled: true,
          moveDownDisabled: true,
        };
      }
      return {
        moveUpDisabled: isCurrentTop || currentNodeDisabled,
        moveDownDisabled: isCurrentBottom || currentNodeDisabled,
      };
    },
    isCurrentTop() {
      const { currentNode } = this;
      if (!currentNode) {
        return false;
      }
      const parent = currentNode.parent;
      const firstChild = parent.childNodes[0];
      if (!firstChild) {
        return false;
      }
      if (firstChild.id === currentNode.id) {
        return true;
      }
      return false;
    },
    isCurrentBottom() {
      const { currentNode } = this;
      if (!currentNode) {
        return false;
      }
      const parent = currentNode.parent;
      const lastChild = parent.childNodes[parent.childNodes.length - 1];
      if (!lastChild) {
        return false;
      }
      if (lastChild.id === currentNode.id) {
        return true;
      }
      return false;
    },
    currentNodeData() {
      const { currentNode } = this;
      return currentNode ? currentNode.data : {};
    },
    currentNodeDisabled() {
      const { currentNodeData } = this;
      return currentNodeData.disabled;
    },
    delDisabled() {
      const { currentNode, currentNodeDisabled } = this;
      return (
        !currentNode || currentNode.childNodes.length > 0 || currentNodeDisabled
      );
    },
    addSameDisabled() {
      const { currentNode, currentNodeData, currentNodeDisabled } = this;
      return !currentNode || !currentNodeData.parentId || currentNodeDisabled;
    },
    addChildDisabled() {
      const { currentNode, currentNodeDisabled } = this;
      return !currentNode || currentNodeDisabled;
    },
    editDisabled() {
      const { currentNode, currentNodeData, currentNodeDisabled } = this;
      return !currentNode || !currentNodeData.parentId || currentNodeDisabled;
    },
  },
  methods: {
    getOrgTree() {
      this.$emit("getOrgTree", async () => {
        await this.$nextTick();
        this.setCurrentNode();
      });
    },
    handleNodeChange(data) {
      this.currentNodeKey = data.id;
    },
    // 部门上下移动
    async organizeMove(direction = "") {
      if (!direction) {
        return;
      }
      const directions = {
        up: 0,
        down: 1,
      };
      try {
        await this.$api.moveOrg(
          {},
          {
            params: {
              direction: directions[direction],
              orgId: this.currentNodeData.id,
            },
            headers: {
              diffFlag: {
                up: 1,
                down: 2,
              }[direction],
            },
          }
        );
        this.$message.success("移动成功");
        this.getOrgTree();
      } catch (error) {}
    },
    // 删除部门
    async delOrganize() {
      try {
        await this.$confirm(`是否删除该部门？`, "提示", {
          type: "warning",
        });
        await this.$api.delOrg({
          params: {
            orgId: this.currentNodeData.id,
          },
        });
        this.$message.success("删除成功");
        this.currentNodeKey = "";
        this.getOrgTree();
      } catch (error) {}
    },
    // 打开部门Prompt
    async openOrganizePrompt({ action, level }) {
      const inputValue = action === "edit" ? this.currentNodeData.name : null;
      try {
        const { value } = await this.$prompt(`请输入部门名称`, "部门名称", {
          closeOnClickModal: false,
          inputPlaceholder: "最大输入10个字符，支持数字及中英文",
          inputValue,
          inputValidator: (val) => {
            val = val && val.trim();
            if (!val) {
              return "不能为空";
            }
            if (val.length > 10) {
              return "最大输入10个字符";
            }
          },
        });
        const levels = {
          same: 0, // 平级
          child: 1, // 子级
        };
        const orgName = value.trim();
        switch (action) {
          case "add":
            try {
              await this.$api.addOrg(
                {},
                {
                  params: {
                    level: levels[level],
                    orgName,
                    refOrgId: this.currentNodeData.id,
                  },
                  headers: {
                    diffFlag: {
                      same: 1,
                      child: 2,
                    }[level],
                  },
                }
              );
              this.getOrgTree();
            } catch (error) {}
            break;
          case "edit":
            try {
              await this.$api.editOrg({
                id: this.currentNodeData.id,
                name: orgName,
              });
              this.getOrgTree();
            } catch (error) {}
            break;
          default:
            break;
        }
      } catch (error) {}
    },
    setCurrentNode() {
      const currentNodeKey = this.currentNodeKey;
      this.currentNode = this.computedTreeRef.getNode(currentNodeKey);
      this.computedTreeRef.setCurrentKey(currentNodeKey);
      if (this.currentNodeDisabled) {
        this.$emit("organizeTab", {});
        return;
      }
      this.$emit("organizeTab", this.currentNodeData);
    },
  },
  watch: {
    currentNodeKey() {
      this.setCurrentNode();
    },
    async defaultShowOrgId(newVal) {
      await this.$nextTick()
      this.currentNodeKey = newVal
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/styles/variable.less";
.organize-menu {
  width: 370px;
  &-wrap {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 10px;
    height: 100%;
    header {
      display: flex;
      align-items: center;
      h1 {
        font-size: 16px;
      }
      .move-tools {
        display: flex;
        align-items: center;
        margin-left: auto;
        p {
          display: flex;
          align-items: center;
          margin-left: 8px;
          cursor: pointer;
          font-weight: bold;
          i {
            font-weight: bold;
            font-size: 14px;
            color: @primary;
          }
          &.disabled {
            cursor: not-allowed;
            color: @disabled;
            i {
              color: @disabled;
            }
          }
        }
      }
    }
    .tree-list,
    .tools {
      margin-top: 20px;
    }
    .tools {
      display: flex;
    }
    .tree-list {
      flex: 1;
      overflow-y: auto;
      background: #fff;
      /deep/.el-tree-node.is-current > .el-tree-node__content {
        background-color: @primary;
        color: #fff;
      }
    }
  }
}
</style>