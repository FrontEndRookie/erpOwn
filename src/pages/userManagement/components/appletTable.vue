<template>
  <div>
    <el-table
      stripe
      ref="multipleTable"
      :data="tableData"
      style="width: 100%;"
      >
      <template slot="empty">
        <img class="data-pic" src="../../../assets/kong-icon.png" />
        <p>暂无数据</p>
      </template>
      >
    
      <el-table-column
        v-for="(column, index) in columns"
        v-if="column.show"
        :fixed="column.fixed"
        :key="index"
        :sortable="column.sort"
        :prop="column.prop"
        :label="column.label"
        :min-width="column.width"
        align="center"
        >
        <template slot-scope="scope">
          <div>
            {{scope.row[column.prop]}}
          </div>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column
        fixed="right"
        v-if="operation && operation.show"
        :label="operation.label"
        :min-width="operation.width"
        :show-overflow-tooltip="true"
        >
        <template slot-scope="scope">
          <a v-for="(item, index) in operation.options" :key="index">
            <!-- <span :style="{color:scope.row.status==4?'#2273CE':'#cccccc',cursor:scope.row.status==4?'pointer':'not-allowed'}" @click="editMessage(scope.row)">{{item.label}}</span> -->
            <el-button type="text" :disabled="scope.row.status !== 4 || $utils.authCheckDisabled(item.auth)" @click="editMessage(scope.row)">{{item.label}}</el-button>
          </a>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div v-show="total > 10">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handleCurrent"
        @size-change="handleSize"
        style="text-align: right;padding: 19px 30px 18px 0;background: #fff">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  
  props: {
   
    // 表格数据源
    tableData: {
      type: Array,
      default: () => []
    },
    // 表格的字段展示
    columns: {
      type: Array,
      default: () => []
    },
    // 表格操作
    operation: {
      type: Object,
      default: () => {}
    },
    // 总条数
    total: {
      type: Number,
      default: () => 0
    },
    
    // 当前页
    currentPage: {
      type: Number,
      default: () => 0
    },
    // 每页条数
    pageSize: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
   
    }
  },
  mounted() {
  
   },
  watch: {
   
  },
  methods: {
  
  
    // 页码跳转
    handleCurrent (val) {
      // this.rowSelect()
      this.$emit('currentChange', val)
    },
    // 展示条数
    handleSize (val) {
      this.$emit('sizeChange', val)
    },
    
    
  }
}
</script>
<style lang="less" scoped>
/deep/.el-table td{
    text-align: center;
}
/deep/.el-table th{
    text-align: center;
}
/deep/.el-dialog__footer{
    padding-bottom: 20px;
}
/deep/.el-dialog__body{
  .tab1,.tab5{
    .el-input{
        width: 300px;
    }
  }
  .tab2{
    width: 150px;
  }
  .tab3,.tab4{
    width: 150px;
  }
}
/deep/.el-table__body .el-table__row  td{
    border-right: 1px solid rgb(215, 210, 210) !important;
    border-bottom: 1px solid rgb(215, 210, 210) !important;
  }
  /deep/ .el-table__body tr:hover>td {
  background-color: #CCC !important;
}
</style>
