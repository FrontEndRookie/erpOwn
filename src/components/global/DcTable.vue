<template>
  <!-- 简易封装el-table -->
  <div class="dc-table" :class="{ 'virtual-table': useVirtual }">
    <component
      :is="tableComponentName"
      :use-virtual="useVirtual"
      v-bind="$attrs"
      v-on="$listeners"
      :stripe="stripe"
      style="width: 100%"
      :row-key="rowKey"
      :big-data-checkbox="bigDataCheckbox"
    >
      <component
        :is="tableColumnComponentName"
        v-for="item in columns"
        v-bind="item"
        :key="item.prop"
        align="center"
        header-align="center"
      >
        <template
          #default="{ $index, row }"
          v-if="!['selection', 'index'].includes(item.type)"
        >
          <el-tooltip
            effect="light"
            :content="row[item.prop] || emptyCellText"
            placement="top"
            popper-class="ellipsis-row-popper"
            v-if="item.showEllipsis && !row.showEdit"
          >
            <div class="ellipsis-row">
              <slot :name="item.prop" :row="row" :index="$index">{{
                row[item.prop] || emptyCellText
              }}</slot>
            </div>
          </el-tooltip>
          <slot :name="item.prop" :row="row" :index="$index" v-else>{{
            row[item.prop] || emptyCellText
          }}</slot>
        </template>
        <component
          :is="tableColumnComponentName"
          v-for="child in item.children || []"
          v-bind="child"
          :key="child.prop"
          align="center"
          header-align="center"
        >
          <template #default="{ $index, row }">
            <slot :name="child.prop" :row="row" :index="$index">{{
              row[child.prop] || emptyCellText
            }}</slot>
          </template>
        </component>
      </component>
      <template slot="empty">
        <img :src="emptyImg" />
        <p>暂无数据</p>
      </template>
    </component>
    <footer class="footer" v-if="showPagination">
      <el-pagination
        v-bind="$attrs"
        v-on="$listeners"
        @current-change="(val) => $emit('current-page-change', val)"
        @size-change="(val) => $emit('page-size-change', val)"
        :layout="layout"
        :page-sizes="pageSizes"
      />
    </footer>
  </div>
</template>

<script>
const emptyImg = require(`@/assets/kong-icon.png`);
export default {
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper",
    },
    "page-sizes": {
      type: Array,
      default: () => [10, 20, 30, 40, 50],
    },
    showPagination: {
      type: Boolean,
      default: true,
    },
    stripe: {
      type: Boolean,
      default: true,
    },
    emptyCellText: {
      type: String,
      default: "",
    },
    rowKey: {
      type: String,
      default: "id",
    },
    // 使用虚拟表格
    useVirtual: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      emptyImg,
    };
  },
  computed: {
    tableComponentName() {
      return this.useVirtual ? "u-table" : "el-table";
    },
    tableColumnComponentName() {
      return this.useVirtual ? "u-table-column" : "el-table-column";
    },
    bigDataCheckbox() {
      return this.useVirtual;
    },
  },
};
</script>

<style lang="less" scoped>
.dc-table {
  &.virtual-table {
    /deep/.el-table__header-wrapper {
      .virtual-fixed {
        position: sticky;
      }
    }
    /deep/.el-table__row {
      .virtual-fixed {
        position: sticky;
      }
      &:not(.el-table__row--striped, :hover) {
        .virtual-fixed {
          background: #fff;
        }
      }
    }
  }
  .footer {
    padding: 20px;
    display: flex;
    justify-content: flex-end;
    background: #fff;
  }
  /deep/.el-table__fixed-right::before,
  /deep/.el-table__fixed::before {
    display: none;
  }
  /deep/.el-table--border {
    th,
    td {
      border-right: 1px solid silver;
      border-bottom: 1px solid silver;
      &:nth-last-of-type(1) {
        border-right: none;
      }
    }
  }
  /deep/.is-center {
    .cell {
      text-align: center;
    }
  }
  /deep/.cell {
    padding: 5px;
  }
  /deep/ td {
    height: auto;
  }
  /deep/.hover-row td {
    background: #ccc !important;
  }
  .ellipsis-row {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
/deep/.el-table{
  .el-table__body-wrapper {
    z-index: 1;
  }
}

</style>
