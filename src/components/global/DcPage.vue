<template>
  <div class="dc-page">
    <dc-form
      size="mini"
      class="search-form dc-custom-shadow"
      v-if="showSearchForm"
    >
      <div class="table-search">
        <dc-img
          v-if="searchExpand"
          class="all-search-icon"
          :name="allSearchIcon"
          @click="showAllSearch = !showAllSearch"
        />
        <template>
          <slot name="search"></slot>
        </template>
        <template v-if="showAllSearch">
          <slot name="search-append"></slot>
        </template>
      </div>
      <div class="table-actions">
        <slot name="search-actions"></slot>
      </div>
    </dc-form>
    <slot name="table-prepend"></slot>
    <main ref="main" class="main-table" v-if="showMainTable">
      <section class="dc-custom-shadow">
        <slot name="table" :height="tableHeight"></slot>
      </section>
    </main>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "DcPage",
  props: {
    searchExpand: {
      type: Boolean,
      default: false,
    },
    showSearchForm: {
      type: Boolean,
      default: true,
    },
    showMainTable: {
      type: Boolean,
      default: true,
    },
  },
  async mounted() {
    window.addEventListener("resize", this.getTableHeight);
    this.getTableHeight();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getTableHeight);
  },
  data() {
    return {
      showAllSearch: false,
      tableHeight: 200,
    };
  },
  computed: {
    allSearchIcon() {
      return this.showAllSearch ? "double-arrow-up" : "double-arrow-down";
    },
  },
  methods: {
    async getTableHeight() {
      await this.$nextTick();
      this.tableHeight = this.$refs.main && this.$refs.main.offsetHeight - 72;
    },
  },
};
</script>

<style lang="less" scoped>
.dc-page {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 20px 20px 0 20px;
  height: calc(100vh - 81px);
  background: #f3f6f9;
  .search-form {
    position: relative;
    padding: 10px;
    background: #fff;
    padding-right: 30px;
    .all-search-icon {
      position: absolute;
      top: 0;
      right: 0;
      width: 30px;
      height: 30px;
    }
  }
  .table-search {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    padding-right: 30px;
    /deep/.el-form-item__content {
      margin-right: 20px;
      min-width: 170px;
    }
  }
  .table-actions {
    display: flex;
    margin-bottom: -15px;
    // justify-content: flex-end;
    /deep/.el-form-item__content {
      margin-right: 20px;
    }
  }
  .main-table {
    margin-top: 20px;
    flex: 1;
    min-height: 0;
  }
}
</style>