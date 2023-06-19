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
         
          <el-form-item label="日期" >
            <el-date-picker
              style="width: 150px"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @change="selectResult.dateFlag=0"
              v-model="selectResult.startDate"
              type="date"
              :picker-options="pickerOptionsStartOne"
              placeholder="选择日期"
            >
            </el-date-picker
            >-
            <el-date-picker
              style="width: 150px"
              v-model="selectResult.endDate"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              @change="selectResult.dateFlag=0"

              :picker-options="pickerOptionsEndOne"
              placeholder="选择日期"
            >
            </el-date-picker>
            <el-form-item style="margin-left:20px">
              <el-button :type="selectResult.dateFlag ==1?'primary':''" plain size="mini" @click="fastSelect(1)"
                >今天</el-button
              >
              <el-button :type="selectResult.dateFlag ==2?'primary':''" plain size="mini" @click="fastSelect(2)"
                >昨天</el-button
              >
              <el-button :type="selectResult.dateFlag ==3?'primary':''" plain size="mini" @click="fastSelect(3)"
                >本周</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button @click="searchClick" type="primary" v-auth="['404000_B']" style="margin-left:50px">搜索</el-button>
            </el-form-item>
          </el-form-item>
        </div>
      </el-form>
   
      <div class="staticsBox" style="margin-top:15px">
        <div v-for="(item,index) in numStatics" :key="index" class="staticsNum">
          <div class="title">{{item.title}}</div>
          <div class='num'>{{item.num}}</div>
        </div>
      </div>
      <div class="tableTitle" >客服询单
         <el-button v-auth="['404000_B']" type="primary" size="mini" style="margin-left:10px" @click="exportFile(1)"
            >导出列表
          </el-button>
      </div>
      <el-table
        border
        stripe
        header
        ref="tableCst"
        @sort-change="(val)=>sortChange(val,1)"
        max-height="500px"
        :data="cstmData"
        class="finance-talbe"
        style="width:70%;margin-top:10px"
      >
        <template slot="empty">
          <img class="data-pic" src="../../assets/kong-icon.png" />
          <p>暂无数据</p>
        </template>
        <el-table-column
          label="日期"
          :sortable="$utils.authCheckDisabled(['404002_B']) ? false : 'custom'"
          prop="createTime"
        ></el-table-column>
        <el-table-column
          label="角色"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          label="姓名"
          :sortable="$utils.authCheckDisabled(['404002_B']) ? false : 'custom'"
          prop="userName"
        ></el-table-column>
        <el-table-column
          label="提交询单"
          prop="quantity"
          :sortable="$utils.authCheckDisabled(['404002_B']) ? false : 'custom'"
        ></el-table-column>
        <el-table-column
          label="参与航线负责人"
          prop="prcpCount"
          :sortable="$utils.authCheckDisabled(['404002_B']) ? false : 'custom'"
        ></el-table-column>
        <el-table-column
          label="已发消息数"
          :sortable="$utils.authCheckDisabled(['404002_B']) ? false : 'custom'"
          prop="cstmMsgCount"
        ></el-table-column>
      </el-table>
      <div class="footer">
        <el-pagination
          @size-change="(val)=>handleSizeChange(val,1)"
          @current-change="(val)=>handleCurrentChange(val,1)"
          :current-page="selectResult.cstmPageNum"
          :page-sizes="[30, 50]"
          :page-size="selectResult.cstmPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="cstmTotal"
        >
        </el-pagination>
      </div>
         <div class="tableTitle" >航线询单
         <el-button type="primary" size="mini" style="margin-left:10px" @click="exportFile(2)"
            >导出列表
          </el-button>
        </div>
      <el-table
        border
        stripe
        header
        ref="tablePrcp"
        max-height="500px"
        @sort-change="(val)=>sortChange(val,2)"
        :data="prcpData"
        class="finance-talbe"
        style="width: 70%;margin-top:10px"
      >
        <template slot="empty">
          <img class="data-pic" src="../../assets/kong-icon.png" />
          <p>暂无数据</p>
        </template>
        <el-table-column
          label="日期"
          :sortable="$utils.authCheckDisabled(['404002_B']) ? false : 'custom'"
          prop="createTime"
        ></el-table-column>
        <el-table-column
          label="角色"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          label="姓名"
          :sortable="$utils.authCheckDisabled(['404002_B']) ? false : 'custom'"
          prop="userName"
        ></el-table-column>
        <el-table-column
          label="我的询单"
          :sortable="$utils.authCheckDisabled(['404002_B']) ? false : 'custom'"
          prop="quantity"
        ></el-table-column>
        <el-table-column
          label="回复次数"
          :sortable="$utils.authCheckDisabled(['404002_B']) ? false : 'custom'"
          prop="respCount"
        ></el-table-column>
      </el-table>
      <div class="footer">
        <el-pagination
          @size-change="(val)=>handleSizeChange(val,2)"
          @current-change="(val)=>handleCurrentChange(val,2)"
          :current-page="selectResult.prcpPageNum"
          :page-sizes="[30, 50]"
          :page-size="selectResult.prcpPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="prcpTotal"
        >
        </el-pagination>
      </div>

      <div class="workOrderList">
        <div class="workOrderBox" v-for="(item,index) in dealService" :key="index">
          <div class="boxTitle">客服询单</div>
          <el-table
          :data="item"
          max-height="400px"
        border
        stripe
        header
        class="finance-talbe"
        style="width: 90%;margin-top:10px"
      >
        <template slot="empty">
          <img class="data-pic" src="../../assets/kong-icon.png" />
          <p>暂无数据</p>
        </template>
        <el-table-column
          label="姓名"
          prop="userName"
        ></el-table-column>
        <el-table-column
          label="全部询单"
          prop="total"
        ></el-table-column>
        <el-table-column
          label="已处理"
          prop="processedCount"
        ></el-table-column>
        <el-table-column
          label="未处理"
          prop="unProcessedCount"
        ></el-table-column>
       
      </el-table>
        </div>
      </div>

      <div class="workOrderList" style="margin-top:30px">
        <div class="workOrderBox" v-for="(item,index) in dealAirline" :key="index">
          <div class="boxTitle">航线询单</div>

          <el-table
        border
        stripe
        header
        :data="item"
        class="finance-talbe"
        style="width: 90%;margin-top:10px"
      >
        <template slot="empty">
          <img class="data-pic" src="../../assets/kong-icon.png" />
          <p>暂无数据</p>
        </template>
        <el-table-column
          label="姓名"
          prop="userName"
        ></el-table-column>
        <el-table-column
          label="全部询单"
          prop="total"
        ></el-table-column>
        <el-table-column
          label="已处理"
          prop="processedCount"
        ></el-table-column>
        <el-table-column
          label="未处理"
          prop="unProcessedCount"
        ></el-table-column>
       
      </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      numStatics:[{title:"客服提交询单",num:100},{title:"已处理",num:1},{title:"未处理",num:10}],
      serviceWorkOrder:[],
      airlineWorkOrder:[],
      cstmData:[],
      prcpData:[],

      // 搜索框结果
      selectResult: {
        dateFlag: 1,
        cstmPageNum:1,//客服分页
        cstmPageSize:30,
        prcpPageNum:1,//航线分页
        prcpPageSize:30,
        startDate: "",
        endDate: "",
      },
      cstmSortBy:'',
      cstmSortPath:'',
      prcpSortBy:'',
      prcpSortPath:'',
     cstmTotal:0,
     prcpTotal:0,
      // 限制航班日期
      pickerOptionsStartOne: {
        disabledDate: (time) => {
          let endDateVal = this.selectResult.endDate;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime() ;
          }
        },
      },
      pickerOptionsEndOne: {
        disabledDate: (time) => {
          let beginDateVal = this.selectResult.startDate;
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime()- 8.64e7;
          }
        },
      },
    };
  },
  mounted() {
    this.searchClick();
    // window.addEventListener("beforeunload", (e) => {
    //   var obj = JSON.stringify({ pageNum: this.pageNum });
    //   sessionStorage.setItem("lastPageNum", obj);
    // });
  },
  methods: {
    // 排序
    sortChange(column,types) {
      let res = JSON.parse(JSON.stringify(this.selectResult))
      res.cstmSortBy = this.cstmSortBy
      res.cstmSortPath = this.cstmSortPath
      res.prcpSortBy = this.prcpSortBy
      res.prcpSortPath = this.prcpSortPath
      // console.log(column,types)
      var pr = column.prop;
      var type = column.order;
      if(!type) {
        if(types==1){
          res.cstmSortBy = ''
          res.cstmSortPath = ''
        }else if(type==2){
          res.prcpSortBy = ''
          res.prcpSortPath = ''
        }
        this.initData(res)
        return
      }
       if(types==1){
          switch (pr) {
            case "createTime":
              this.cstmSortBy = "0";
              break;
            case "userName":
              this.cstmSortBy = "1";
              break;
            case "quantity":
              this.cstmSortBy = "2";
              break;
            case "prcpCount":
              this.cstmSortBy = "3";
              break;
            case "cstmMsgCount":
              this.cstmSortBy = "4";
              break;
          }
          if (type == "descending") {
            this.cstmSortPath = "1";
          } else {
            this.cstmSortPath = "0";
          }
          res.cstmSortBy = this.cstmSortBy
          res.cstmSortPath = this.cstmSortPath
      }
      else if(types==2){
              switch (pr) {
            case "createTime":
              this.prcpSortBy = "0";
              break;
            case "userName":
              this.prcpSortBy = "1";
              break;
            case "quantity":
              this.prcpSortBy = "2";
              break;
            case "respCount":
              this.prcpSortBy = "3";
              break;
           
          }
          if (type == "descending") {
            this.prcpSortPath = "1";
          } else {
            this.prcpSortPath = "0";
          }
          res.prcpSortBy = this.prcpSortBy
          res.prcpSortPath = this.prcpSortPath
      }
      this.initData(res);
    },
    fastSelect(type){
      this.selectResult.startDate=''
      this.selectResult.endDate=''
      this.selectResult.dateFlag=type
      this.initData()
    },
    // 初始化数据
    initData(params = this.selectResult) {
      this.$http.post(this.$service.orderStatistics, params).then((data) => {
        if (data.code == 200) {
          let request = data.data
          this.numStatics[0].num = request.userWorkSum.total
          this.numStatics[1].num = request.userWorkSum.processedCount
          this.numStatics[2].num = request.userWorkSum.unProcessedCount
          this.cstmData = request.cstmSumPage.records
          this.cstmTotal = request.cstmSumPage.total
          this.prcpData = request.prcpSumPage.records
          this.prcpTotal = request.prcpSumPage.total
          this.serviceWorkOrder = request.cstmWorkList
          this.airlineWorkOrder = request.prcpWorkList
        } else {
          this.$message.error(data.message);
        }
      });
    },
    // 查询
    searchClick() {
      this.selectResult.cstmPageNum=1
      this.selectResult.cstmPageSize=30
      this.selectResult.prcpPageNum=1
      this.selectResult.prcpPageSize=30
      this.$refs.tableCst.clearSort();
      this.$refs.tablePrcp.clearSort();
      this.initData();
    },
 
    // 页面大小
    handleSizeChange(e,type) {
      if(type==1){
        this.selectResult.cstmPageSize=e
        this.selectResult.cstmPageNum=1
      }else {
        this.selectResult.prcpPageSize=e
        this.selectResult.prcpPageNum=1
      }
      this.initData();
    },
    // 分页
    handleCurrentChange(e,type) {
       if(type==1){
        this.selectResult.cstmPageNum=e
      }else {
        this.selectResult.prcpPageNum=e
      }
      this.initData();
    },
    // 导出文件
    exportFile(val) {
      let json = JSON.parse(JSON.stringify(this.selectResult))
      json.typeCode = val-1
      this.$http
        .post(this.$service.exportList, json, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          const aLink = document.createElement("a");
          let blob = new Blob([res], {
            type: "application/vnd.ms-excel",
          });
          aLink.href = URL.createObjectURL(blob);
          aLink.setAttribute("download", "统计" + ".xlsx");
          aLink.click();
          document.body.appendChild(aLink);
        });
    },
  },
  computed:{
    dealAirline(){
      let result = []
      let copy = JSON.parse(JSON.stringify(this.airlineWorkOrder))
      if(this.airlineWorkOrder.length>0&&this.airlineWorkOrder.length<=40){
        for(let i =0;i<Math.ceil(this.airlineWorkOrder.length/10);i++){
          result.push(copy.splice(0,10))
        }
      }else if(this.airlineWorkOrder.length>40&&this.airlineWorkOrder.length<=80) {
        for(let i =0;i<Math.ceil(this.airlineWorkOrder.length/20);i++){
          result.push(copy.splice(0,20))
        }
      }else if(this.airlineWorkOrder.length>80){
        let spliceData = Math.ceil(this.airlineWorkOrder/4)
        for(let i =0;i<4;i++){
          result.push(copy.splice(0,spliceData))
        }
      }else if(this.airlineWorkOrder.length==0) {
        result=[[]]
      }
      return result
    },
    dealService(){
      let result = []
      let copy = JSON.parse(JSON.stringify(this.serviceWorkOrder))
      if(this.serviceWorkOrder.length>0&&this.serviceWorkOrder.length<=40){
        for(let i =0;i<Math.ceil(this.serviceWorkOrder.length/10);i++){
          result.push(copy.splice(0,10))
        }
      }else if(this.serviceWorkOrder.length>40&&this.serviceWorkOrder.length<=80) {
        for(let i =0;i<Math.ceil(this.serviceWorkOrder.length/20);i++){
          result.push(copy.splice(0,20))
        }
      }else if(this.serviceWorkOrder.length>80){
        let spliceData = Math.ceil(this.serviceWorkOrder/4)
        for(let i =0;i<4;i++){
          result.push(copy.splice(0,spliceData))
        }
      }else if(this.serviceWorkOrder.length==0) {
        result=[[]]
      }
      return result
    },
  },
  beforeDestroy() {
  },
};
</script>
<style scoped lang="less">
.staticsBox {
  display:flex;
  .staticsNum{
    border: 1px solid silver;
    margin-left:20px;
    display: flex;
    padding:25px 15px;
    .title{
      font-size: 16px;
    }
    .num{
      margin-left:20px;
      font-size: 20px;
      font-weight: bold;
      line-height: 10px;
    }
  }
}
.tableTitle {
  margin-left:20px;
  margin-top:30px;
  font-size:15px
}
.finance-talbe{
  margin-left:20px
}
.workOrderList{
  width: 100%;
  padding-bottom: 15px;
  overflow-y:auto;
  display: flex;
  .workOrderBox{
    padding-top: 10px;
    padding-bottom: 15px;
    border: 1px solid silver;
    margin-left:30px;
    flex:0 0 450px;
    .boxTitle{
      font-size: 16px;
      margin-left: 20px;
    }
  }
}

.content {
  background: #fff;
  margin: 20px 20px 0 20px;
}
.content-search {
  padding: 20px 20px 0 20px !important;
}
.buttonList {
  margin-left: 20px;
  margin-bottom: 20px;
}
.button-right {
  float: right;
  margin-right: 20px;
}
.footer {
  display: flex;
  height: 100px;
  justify-content: center;
  align-items: center;
}
.el-pagination {
  padding: 2px 60px;
}
</style>
