<template>
  <div>
    <el-table
      stripe
      ref="multipleTable"
      @sort-change="handleSort"
      @selection-change="handleSelect"
      :data="tableData"
      :cell-style="cellStyle"
      :header-cell-style="{textAlign:'center'}"
      

      style="width: 100% ;"
    >
      <template slot="empty">
        <img class="data-pic" src="../assets/kong-icon.png"/>
        <p>暂无数据</p>
      </template>
      <el-table-column type="selection" width="50" v-if="showSelection"></el-table-column>
      <!-- <el-table-column
        v-if="checkbox"
        type="selection"
        width="55">
      </el-table-column> -->
      <!--列-->
      <el-table-column
        v-for="(column, index) in columns"
        v-if="column.show"
        :key="index"
        :sortable="column.sort"
        :prop="column.prop"
        :label="column.label"
        :min-width="column.width"
        align="left"
      >
        <el-table-column v-if="column.label == '应收金额'" prop="totalArCny" label="人民币" min-width="80"></el-table-column>
        <el-table-column v-if="column.label == '应收金额'" label="原币" min-width="80">
          <template slot-scope="scope">
            {{ getOrgn(scope.row.totalArOrgn) }}
          </template>
        </el-table-column>
        <el-table-column v-if="column.label == '应付金额'" prop="totalApCny" label="人民币" min-width="80"></el-table-column>
        <el-table-column v-if="column.label == '应付金额'" label="原币" min-width="80">
          <template slot-scope="scope">
            {{ getOrgn(scope.row.totalApOrgn) }}
          </template>
        </el-table-column>
        <template slot-scope="scope">
          <span @click="handleItemClick(column.handle, scope)">
            <span v-if=" column.label == '序号'">
           {{ scope.$index + 1 }}
            </span>
            <span v-else-if="column.prop == 'expenseType' && column.label == '费用类型'">
              {{ scope.row.expenseType === 0 ? "国内段" : "国外段" }}
            </span>
            <span v-else-if="column.prop == 'operationType' && column.label == '操作类型'">
              {{
                scope.row.operationType === 0 ? "交单" :
                  scope.row.operationType === 1 ? "解锁申请" :
                    scope.row.operationType === 2 ? "解锁通过" :
                      scope.row.operationType === 3 ? "解锁驳回" :
                          scope.row.operationType === 4 ? "审核通过" :
                            scope.row.operationType === 5 ? "审核驳回" : ""
              }}
            </span>
             <span v-else-if="column.prop == 'cargoInfo' && column.label == '货物信息'">
              <div>{{ scope.row.cargoInfo.split(",")[0] }}</div>
                <div>{{ scope.row.cargoInfo.split(",")[1] }}PCS</div>
                <div>{{ scope.row.cargoInfo.split(",")[2] }}CBM</div>
                <div>{{ scope.row.cargoInfo.split(",")[3] }}KGS</div>
                <div>1:{{ scope.row.cargoInfo.split(",")[4] }}</div>
            </span>
             <span v-else-if="column.prop == 'operator' && column.label == '操作人员'">
               <div>客服：{{ scope.row.operator.split(",")[1] }}</div>
                <div>销售：{{ scope.row.operator.split(",")[0] }}</div>
                <div>航线：{{ scope.row.operator.split(",")[2] }}</div>
            </span>
             <span v-else-if="column.prop == 'operation' && column.label == '操作人员'" style="text-align:left">
               <div>售前：{{ scope.row.operation.split(",")[0] }}</div>
                <div>售中：{{ scope.row.operation.split(",")[1] }}</div>
                <div>航线：{{ scope.row.operation.split(",")[2] }}</div>
                <div>客户负责人：{{ scope.row.operation.split(",")[3] }}</div>
            </span>
            <span v-else-if="column.label == '汇率' && column.prop == 'exchangeRateOnly'">
              {{currencyType[scope.row.currency]+":"+scope.row.exchangeRate}}
            </span>
              <span v-else-if=" column.label == '汇率'">
              {{ getExchangeRate(scope.row.exchangeRate) }}
            </span>
              <span v-else-if=" column.label == '开票进度'">
               {{
                  scope.row.invoicingStatus == 0 ?
                    '未开票' : scope.row.invoicingStatus == 1 ?
                    '已开票' : scope.row.invoicingStatus == 2 ? '部分开票' : ''
                }}
            </span>
              <span v-else-if=" column.label == '订单状态'">
                 {{
                  scope.row.financeStatus == 0 ?
                    '未交单' : scope.row.financeStatus == 1 ?
                    '已交单' : scope.row.financeStatus == 2 ?
                      '申请解锁' : scope.row.financeStatus == 3 ?
                        '交单待审核' : scope.row.financeStatus == 4 ?
                          '异常' : scope.row.financeStatus == 5 ?
                            '修改中' : ''
                }}
            </span>
             <!-- <span v-else-if=" column.label == '币种'">
                 {{
                  scope.row.currency == 1 ?
                    '人民币' : scope.row.currency == 2 ?
                    '港币' : scope.row.currency == 3 ?
                      '美元' : scope.row.currency == 4 ?
                        '欧元' : scope.row.currency == 5 ?
                          '英镑' :  ''
                }}
            </span> -->
             <span v-else-if=" column.label == '币种'">
                 {{currencyArrC[scope.row.currency]}}
            </span>
            <!--              <span v-else-if="column.prop=='orderNo'&& column.label == '订单号'">-->
              <a v-else-if="column.prop=='orderNo'&& column.label == '订单号'"
                 @click="showFees(scope.row.id,scope.row.payWay,scope.row.financeStatus)"
                 style="font-size: 12px;">{{ scope.row.orderNo }}</a>
            <!--            </span>-->
            <!--            <div v-else >{{// scope[column.prop]}}</div>-->
            <span v-else v-html="getDataName(scope.row, column)"></span>
          </span>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column
        fixed="right"
        v-if="operation.show"
        :label="operation.label"
        :min-width="operation.width"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <a v-for="(item, index) in operation.options" @click.prevent="handleClick(item.method, scope.row, $event)">
            <span style="color: #2273CE;">{{ item.label }}</span>
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
      type: 'index',
      // 表格数据源
      tableData: {
        type: Array,
        default: () => []
      },
      cellStyle:{
        type:Object,
        default:()=>{
          return {textAlign:'center',fontSize:'12px'}
        }
      },
      //显示选择框
      showSelection:{
        type:Boolean,
        default:true
      },
      //选择
      xuanzhong: {
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
        default: () => {
        }
      },
      // 总条数
      total: {
        type: Number,
        default: () => 0
      },
      biaoshishu: {
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
        currencyType:{},
        currencyArrC:{},
        seletArr: [],
        userName: '',
        arr: [],
        UserID: '',
        currencyArray: this.$store.getters.getCurrencyFinance,
      }
    },
    mounted() {
      var array = this.$store.getters.getCurrencyIdObjArr
      this.currencyType = array[0] // ['CNY','HKD','USD','EUR','GBP']
      this.currencyArrC = array[2] // ['人民币','港币','美金','欧元','英镑']
      this.UserID = !sessionStorage.getItem('userInfo') ? '' : JSON.parse(sessionStorage.getItem('userInfo')).UserID
      this.userName = !sessionStorage.getItem('userInfo') ? '' : JSON.parse(sessionStorage.getItem('userInfo')).UserName
    },
    watch: {
      tableData(idx) {
        var that = this
        this.arr = []
        that.$nextTick(() => {
          if (that.$refs.multipleTable) {
            that.$refs.multipleTable.clearSelection();
          }
          if (!idx) {
            return
          }
          idx.forEach(row => {
            for (var i = 0; i < this.xuanzhong.length; i++) {
              if (this.xuanzhong[i].code == row.code) {
                that.$refs.multipleTable.toggleRowSelection(
                  row,
                  true
                )
              }
            }
          })
        })
      }
    },
    methods: {
      // 排序
      handleSort(column) {
        this.$emit('sortChange', column)
      },
      // 操作，将操作类型和当前row数据作为参数传递
      handleClick(method, row, e) {
        // 置灰不可点击
        if (e.target.className === 'gary') {
          return
        }
        this.$emit('handleClick', {
          method: method,
          row: row
        })
      },
      // 某一列点击事件
      handleItemClick(method, scope) {
        if (method) {
          this.$emit(method, scope)
        }
      },
      // getExchangeRate(exchangeRate) {
      //   if (typeof (exchangeRate) == "undefined") {
      //     return "";
      //   }
      //   var totalOrgn = ''
      //   var value1 = 0
      //   var value2 = 0
      //   var value3 = 0
      //   var value4 = 0
      //   var value5 = 0
      //   for (var i = 0; i < exchangeRate.length; i++) {
      //     if (exchangeRate[i].currency == '1') {
      //       value1 += exchangeRate[i].exchangeRate
      //     } else if (exchangeRate[i].currency == '2') {
      //       value2 += exchangeRate[i].exchangeRate
      //     } else if (exchangeRate[i].currency == '3') {
      //       value3 += exchangeRate[i].exchangeRate
      //     } else if (exchangeRate[i].currency == '4') {
      //       value4 += exchangeRate[i].exchangeRate
      //     } else if (exchangeRate[i].currency == '5') {
      //       value5 += exchangeRate[i].exchangeRate
      //     }
      //   }  
      //   totalOrgn = ''
      //   totalOrgn += value1 || value1 == 0 ? 'CNY:' + value1 + '+' : ''
      //   totalOrgn += value2 ? 'HKD:' + value2 + '+' : ''
      //   totalOrgn += value3 ? 'USD:' + value3 + '+' : ''
      //   totalOrgn += value4 ? 'EUR:' + value4 + '+' : ''
      //   totalOrgn += value5 ? 'GBP:' + value5 : ''
      //   totalOrgn = totalOrgn.substring(0, totalOrgn.length - 1)
      //   return totalOrgn;
      // },
      getExchangeRate(exchangeRate) {
        // if (typeof (exchangeRate) == "undefined") {
        //   return "";
        // }
        var orgn = exchangeRate
        var totalOrgn = "";
        orgn = JSON.parse(orgn)
        if(orgn && (orgn.length > 0)){
          for (var i = 0; i < orgn.length; i++) {
            var obj = this.currencyArray.filter((item)=>{return (item.id == orgn[i].currency)})
            totalOrgn = totalOrgn + obj[0]["code"] + ":" + Number(orgn[i].exchangeRate)
            if(i < (orgn.length - 1)){
              totalOrgn = totalOrgn + '+'
            }
          }
        }
        return totalOrgn;
      },
      // getOrgn(orgn) {
      //   if (!orgn) {
      //     return;
      //   }
      //   orgn = JSON.parse(orgn);
      //   var totalOrgn = ''
      //   var value1 = 0
      //   var value2 = 0
      //   var value3 = 0
      //   var value4 = 0
      //   var value5 = 0
      //   // HK$ $ € ￡
      //   for (var i = 0; i < orgn.length; i++) {
      //     if (orgn[i].currency == '1') {
      //       value1 += orgn[i].amount
      //     } else if (orgn[i].currency == '2') {
      //       value2 += orgn[i].amount
      //     } else if (orgn[i].currency == '3') {
      //       value3 += orgn[i].amount
      //     } else if (orgn[i].currency == '4') {
      //       value4 += orgn[i].amount
      //     } else if (orgn[i].currency == '5') {
      //       value5 += orgn[i].amount
      //     }
      //   }
      //   totalOrgn = ''
      //   totalOrgn += value1 || value1 == 0 ? value1 + 'CNY' + '+' : ''
      //   totalOrgn += value2 ? value2 + 'HKD' + '+' : ''
      //   totalOrgn += value3 ? value3 + 'USD' + '+' : ''
      //   totalOrgn += value4 ? value4 + 'EUR' + '+' : ''
      //   totalOrgn += value5 ? value5 + 'GBP' : ''
      //   totalOrgn = totalOrgn.substring(0, totalOrgn.length - 1)
      //   return totalOrgn;
      // },
      getOrgn(orgn) {
        if (!orgn) {
          return;
        }
        orgn = JSON.parse(orgn);
        var totalOrgn = "";
        if(orgn && (orgn.length > 0)){
          for (var i = 0; i < orgn.length; i++) {
            var obj = this.currencyArray.filter((item)=>{return (item.id == orgn[i].currency)})
            totalOrgn = totalOrgn  + Number(orgn[i].amount)+ obj[0]["code"]
            if(i < (orgn.length - 1)){
              totalOrgn = totalOrgn + '+'
            }
          }
        }
        return totalOrgn;
      },
      showFees(val) {
        this.$emit('showFees', val)
      },
      // 页码跳转
      handleCurrent(val) {
        // this.rowSelect()
        this.$emit('currentChange', val)
      },
      // 展示条数
      handleSize(val) {
        this.$emit('sizeChange', val)
      },
      // 复选框选择
      handleSelect(val) {
        this.$emit('handleSelect', val)
      },
      //开关
      switchChangeUser(val) {
        this.$emit('switchChangeUser', val)
      },
      //去重
      unique1(arr) {
        var hash = [];
        for (var i = 0; i < arr.length; i++) {
          if (hash.indexOf(arr[i]) == -1) {
            hash.push(arr[i]);
          }
        }
        return hash;
      },
      getDataName(scope, items) {
        return scope[items.prop]
      }
    }
  }
</script>
<style lang="less" scoped>
  a {
    padding: 0;
  }

  span {
    padding-right: 0px;
  }

  span.cursor {
    cursor: pointer;
    color: #3985ca;
  }

  span.gary {
    color: #bcbcbc;
  }

  .caiwu {
    color: #bcbcbc;

    font-size: 12px;
  }

  .tupian {
    width: 30px;
    height: auto;
  }
//   /deep/.el-table__body-wrapper .el-table__body tr:hover>td{
//   background-color: #CCC !important;
// }
//   /deep/.el-table__body-wrapper .el-table__body tbody .hover-row td{
//   background-color: #CCC !important;
// }
</style>
