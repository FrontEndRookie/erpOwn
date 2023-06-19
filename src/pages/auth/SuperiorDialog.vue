<template>
  <el-dialog
    title="设置部门上级"
    class="superior-dialog"
    :visible.sync="visible"
    append-to-body
    :close-on-click-modal="false"
    width="400px"
    @closed="$emit('closeEv')"
  >
    <div class="dialog-wrap">
      <div class="select-row">
        <el-select
          v-model="selects"
          multiple
          filterable
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in computedOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
        <span style="margin-left: 20px">已选择 {{ selectedCount }}</span>
      </div>
    </div>
    <footer slot="footer" style="text-align: left">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="setSuper">保 存</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  // 设置部门上级弹窗
  name: "SuperiorDialog",
  props: {
    organize: {
      type: Object,
      default: () => ({}),
    },
  },
  created() {
    this.visible = true;
    this.init();
  },
  data() {
    return {
      visible: false,
      selects: [],
      max: 10,
      options: [],
    };
  },
  computed: {
    selectedCount() {
      return `${this.selects.length} / ${this.max}`;
    },
    computedOptions() {
      const selects = this.selects;
      return this.options.map((item) => {
        return {
          ...item,
          disabled: selects.length >= this.max && !selects.includes(item.id),
        };
      });
    },
  },
  methods: {
    init() {
      this.getDirectUsers();
    },
    async getDirectUsers() {
      const {
        organize: { id: orgId },
      } = this;
      if (!orgId) {
        return;
      }
      try {
        const {
          data: { data },
        } = await this.$api.getDirectUsers({
          params: {
            orgId,
          },
        });
        this.options = data.map((item) => {
          return {
            ...item,
            value: item.id,
            label: item.name,
          };
        });
        this.selects = data
          .filter((item) => {
            return item.superFlag === 0;
          })
          .map((item) => item.id);
      } catch (error) {}
    },
    async setSuper() {
      const {
        organize: { id },
        selects,
      } = this;
      try {
        await this.$api.setSuper({
          [id]: selects,
        });
        this.$message.success("保存成功");
        this.$emit("afterEdit");
        this.visible = false;
      } catch (error) {}
    },
  },
};
</script>

<style lang="less" scoped>
.superior-dialog {
  .dialog-wrap {
    padding: 20px 0;
    .select-row {
      display: flex;
      align-items: center;
    }
  }
}
</style>