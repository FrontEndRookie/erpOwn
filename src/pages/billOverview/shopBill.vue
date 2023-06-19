<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" :model="selectResult" class="demo-form-inline">
        <div class="content-search">
          <el-form-item label="供应商">
            <el-input
              clearable
              :maxlength="inputMax"
              v-model="selectResult.agentName"
              placeholder="请输入供应商"
            ></el-input>
          </el-form-item>
          <el-form-item label="结算方式">
            <el-select
              clearable
              v-model="selectResult.payWay"
              placeholder="请选择结算方式"
            >
              <el-option label="全部" value="null"></el-option>
              <el-option label="付款买单" value="0"></el-option>
              <el-option label="月结" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="航班日期" label-width="80px">
            <el-date-picker
              style="width: 150px"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="selectResult.startDepartureDate"
              type="date"
              :picker-options="pickerOptionsStartOne"
              placeholder="选择日期"
            >
            </el-date-picker
            >-
            <el-date-picker
              style="width: 150px"
              v-model="selectResult.endDepartureDate"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              :picker-options="pickerOptionsEndOne"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
      <div class="export">
        <el-button type="primary" size="mini" @click="searchClick" v-auth="['132000_B']"
          >查询</el-button
        >
        <el-button type="primary" size="mini" @click="restClick"
          >清空</el-button
        >
        <el-button
          type="primary"
          size="mini"
          style="width: 80px"
          @click="exportList"
          >导出列表</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        header
        class="finance-talbe"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <template slot="empty">
          <img class="data-pic" src="../../assets/kong-icon.png" />
          <p>暂无数据</p>
        </template>
        
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          prop="agentName"
          label="供应商"
          min-width="40"
        ></el-table-column>
        <el-table-column
          prop="turnoverAmount"
          label="流水总额"
          min-width="40"
        ></el-table-column>
        <el-table-column
          prop="paidAmount"
          label="已付"
          min-width="40"
        ></el-table-column>
        <el-table-column
          prop="unpaidAmount"
          label="未付"
          min-width="40"
        ></el-table-column>
        <el-table-column
          prop="payWay"
          label="结算方式"
          min-width="40"
        ></el-table-column>
        <el-table-column
          prop="orderCount"
          label="订单数量"
          min-width="40"
        ></el-table-column>
      </el-table>
      <div class="footer">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[10, 20, 30]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
        <div class="page">
          <span>总额:{{ totalTurnoverAmount }}</span>
          <span>总已付:{{ totalPaidAmount }}</span>
          <span>总未付:{{ totalUnpaidAmount }}</span>
          <span>总订单数量:{{ totalOrderCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pageSize: 10,
      pageNum: 1,
      // 表格数据初始化
      tableData: [],
      // 选中表格的数据
      selectTableData: [],
      // 搜索框结果
      selectResult: {
        agentName: "",
        payWay: "",
        startDepartureDate: "",
        endDepartureDate: "",
      },
      // 总额
      totalTurnoverAmount: "",
      // 总已付
      totalPaidAmount: "",
      // 总未付
      totalUnpaidAmount: "",
      // 总订单数量
      totalOrderCount: "",
      // 数据总条数
      total: "",
      // 限制航班日期
      pickerOptionsStartOne: {
        disabledDate: (time) => {
          let endDateVal = this.selectResult.endDepartureDate;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        },
      },
      pickerOptionsEndOne: {
        disabledDate: (time) => {
          let beginDateVal = this.selectResult.startDepartureDate;
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime() - 8.64e7;
          }
        },
      },
    };
  },
  mounted() {
    this.initAgent();
  },
  methods: {
    // 初始化供应商数据
    initAgent() {
      var params = {
        agentName: this.selectResult.agentName,
        endDepartureDate: this.selectResult.endDepartureDate,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        payWay: this.selectResult.payWay,
        startDepartureDate: this.selectResult.startDepartureDate,
      };
      this.$http.post(this.$service.agentBill, params).then((data) => {
        if (data.code == 200) {
          this.tableData = data.data.pageInfo.records;
          this.total = data.data.total;
          this.totalTurnoverAmount = data.data.totalTurnoverAmount;
          this.totalPaidAmount = data.data.totalPaidAmount;
          this.totalUnpaidAmount = data.data.totalUnpaidAmount;
          this.totalOrderCount = data.data.totalOrderCount;
          for (var item in this.tableData) {
            if (this.tableData[item].payWay == 0) {
              this.tableData[item].payWay = "付款买单";
            } else if (this.tableData[item].payWay == 1) {
              this.tableData[item].payWay = "月结";
            } else {
              this.tableData[item].payWay = "付款&月结";
            }
          }
        } else {
          this.$message.error(data.message);
        }
      });
    },
    // 页面大小
    handleSizeChange(e) {
      this.pageSize = e;
      this.initAgent();
    },
    // 跳转页面
    handleCurrentChange(e) {
      this.pageNum = e;
      this.initAgent();
    },
    // 搜素
    searchClick() {
      this.pageNum = 1;
      this.pageSize = 10;
      this.initAgent();
    },
    // 重置搜素框数据
    restClick() {
      this.pageSize = 10;
      this.pageNum = 1;
      (this.selectResult.agentName = ""),
        (this.selectResult.payWay = ""),
        (this.selectResult.startDepartureDate = ""),
        (this.selectResult.endDepartureDate = ""),
        this.initAgent();
    },
    handleSelectionChange(val) {
      this.selectTableData = val;
    },
    exportList() {
      if (this.selectTableData.length == 0) {
        this.$message.error("请至少选择一个账单进行导出");
        return;
      }
      let agent = [];
      // this.selectTableData.forEach(element => {

      // });
      let tempArray = this.selectTableData;
      for (var i = 0; i < tempArray.length; i++) {
        agent.push(tempArray[i].agentName);
      }
      let params = {
        agentName: this.selectResult.agentName,
        endDepartureDate: this.selectResult.endDepartureDate,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        startDepartureDate: this.selectResult.startDepartureDate,
        agentNames: agent,
        payWay: this.selectResult.payWay,
      };
      this.$http
        .post(this.$service.agentListExport, params, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          const aLink = document.createElement("a");
          let blob = new Blob([res], {
            type: "application/vnd.ms-excel",
          });
          aLink.href = URL.createObjectURL(blob);
          aLink.setAttribute("download", "供应商账单" + ".xlsx");
          aLink.click();
          document.body.appendChild(aLink);
        });
    },
  },
};
</script>
<style scoped lang="less">
.content {
  background: #fff;
  margin: 20px 20px 0 20px;
}
.content-search {
  padding: 20px 20px 0 20px !important;
}
.export {
  float: right;
  margin-bottom: 20px;
  margin-right: 50px;
}
.footer {
  height: 80px;
}
.page span {
  display: inline-block;
  line-height: 40px;
  height: 40px;
  color: #999999;
  width: 150px;
  padding-top: 24px;
}
.page span:last-child {
  padding-right: 50px;
}
.page {
  display: inline-block;
  float: right;
}
.block {
  display: inline-block;
  padding-top: 20px;
  float: right;
  padding-right: 20px;
}
/deep/.el-table__body .el-table__row  td{
    border-right: 1px solid rgb(215, 210, 210) !important;
    border-bottom: 1px solid rgb(215, 210, 210) !important;
  }
</style>
