页面代码
<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form
        :inline="true"
        :model="selectResult"
        class="demo-form-inline"
        size="medium"
      >
        <div class="content-search">
          <el-form-item label="用户:">
            <el-input
              v-model="selectResult.userName"
              clearable
              :maxlength="inputMax"
              style="width: 200px"
              placeholder="请输入用户名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="认证企业:">
            <el-input
              v-model="selectResult.certificationBod"
              :maxlength="inputMax"
              clearable
              style="width: 200px"
              placeholder="请输入认证企业"
            ></el-input>
          </el-form-item>
          <el-form-item label="结算方式:">
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
          <el-form-item>
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
          </el-form-item>
        </div>
      </el-form>
      <div class="export">
        <el-button type="primary" size="mini" @click="searchClick" v-auth="['131000_B']"
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
          prop="userName"
          label="用户"
          min-width="40"
        ></el-table-column>
        <el-table-column
          prop="certificationBody"
          label="认证企业"
          min-width="40"
        ></el-table-column>
        <el-table-column
          prop="turnoverAmount"
          label="流水总额"
          min-width="40"
        ></el-table-column>
        <el-table-column
          prop="receivedAmount"
          label="已收"
          min-width="40"
        ></el-table-column>
        <el-table-column
          prop="uncollectedAmount"
          label="未收"
          min-width="40"
        ></el-table-column>
        <el-table-column prop="payWay" label="结算方式" min-width="40">
          <template slot-scope="scope">
            <div>
              {{ scope.row.payWay | getPayWay }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="orderCount"
          label="订单数量"
          min-width="40"
        ></el-table-column>
        <el-table-column prop="creditTerm" label="账期" min-width="40">
        </el-table-column>
        <el-table-column
          prop="quota"
          label="额度"
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
          <span>总已收:{{ totalReceivedAmount }}</span>
          <span>总未收:{{ totalUncollectedAmount }}</span>
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
      // 表格数据
      tableData: [],
      // 选中表格数据
      selectTableData: [],
      // 搜索框结果
      selectResult: {
        userName: "",
        certificationBod: "",
        startDepartureDate: "",
        endDepartureDate: "",
        payWay: "",
      },
      // 总额
      totalTurnoverAmount: "",
      // 总已收
      totalReceivedAmount: "",
      // 总未收
      totalUncollectedAmount: "",
      // 总订单数量
      totalOrderCount: "",
      pageNum: 1,
      pageSize: 10,
      // 数据总条数
      total: "",
      pickerOptionsStartOne: {
        // 限制航班日期
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
            return time.getTime() < new Date(beginDateVal).getTime()- 8.64e7;
          }
        },
      },
    };
  },
  mounted() {
    this.initUser();
  },
  methods: {
    // 初始化用户账单数据
    initUser() {
      var json = {
        certificationBody: this.selectResult.certificationBod,
        endDepartureDate: this.selectResult.endDepartureDate,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        payWay: this.selectResult.payWay,
        startDepartureDate: this.selectResult.startDepartureDate,
        userName: this.selectResult.userName,
      };
      this.$http.post(this.$service.userList, json).then((data) => {
        if (data.code == 200) {
          this.tableData = data.data.pageInfo.records;
          this.total = data.data.total;
          this.totalTurnoverAmount = data.data.totalTurnoverAmount;
          this.totalReceivedAmount = data.data.totalReceivedAmount;
          this.totalUncollectedAmount = data.data.totalUncollectedAmount;
          this.totalOrderCount = data.data.totalOrderCount;
          for (var item in this.tableData) {
              this.tableData[item].creditTerm = this.tableData[item].creditTerm ? `${this.tableData[item].creditTerm}天` : '未设置'
              this.tableData[item].quota =this.tableData[item].quota?this.tableData[item].quota:'未设置'
          }
        } else {
          this.$message.error(data.message);
        }
      });
    },
    getCreditTerm(creditTerm){
      if (typeof (creditTerm)=='undefined'||creditTerm==null){

        return '未设置'
      }
      creditTerm= JSON.parse(creditTerm)
      if (creditTerm.creditTerm==''){
        return '未设置'
      }
      var unit=creditTerm.unit == 0?"天":"个月";
      return creditTerm.creditTerm+unit;
    },
    // 页面大小
    handleSizeChange(e) {
      this.pageSize = e;
      this.initUser();
    },
    //跳转页码
    handleCurrentChange(e) {
      this.pageNum = e;
      this.initUser();
    },
    // 查询
    searchClick() {
      this.pageSize = 10;
      this.pageNum = 1;
      this.initUser();
    },
    // 清空搜索框
    restClick() {
      this.pageSize = 10;
      this.pageNum = 1;
      this.selectResult.payWay = "";
      this.selectResult.userName = "";
      this.selectResult.certificationBod = "";
      this.selectResult.endDepartureDate = "";
      this.selectResult.startDepartureDate = "";
      this.initUser();
    },
    // 选中状态变化
    handleSelectionChange(val) {
      this.selectTableData = val;
    },
    exportList() {
      if (this.selectTableData.length == 0) {
        this.$message.error("请至少选择一个账单进行导出");
        return;
      }
      let userIds = [];
      for (var item of this.selectTableData) {
        userIds.push(item.userId);
      }
      var params = {
        certificationBody: this.selectResult.certificationBod,
        endDepartureDate: this.selectResult.endDepartureDate,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        payWay: this.selectResult.payWay,
        startDepartureDate: this.selectResult.startDepartureDate,
        userName: this.selectResult.userName,
        userIds: userIds,
      };
      this.$http
        .post(this.$service.userListExport, params, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          const aLink = document.createElement("a");
          let blob = new Blob([res], {
            type: "application/vnd.ms-excel",
          });
          aLink.href = URL.createObjectURL(blob);
          aLink.setAttribute("download", "用户账单" + ".xlsx");
          aLink.click();
          document.body.appendChild(aLink);
          console.log("取消");
        });
    },
  },
  filters: {
    getPayWay(res) {
      return res == 0 ? "付款买单" : res == 1 ? "月结" : "";
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
  padding-top: 24px;
  margin-right: 10px;
}
.page span:last-child {
  padding-right: 50px;
}
.page {
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


