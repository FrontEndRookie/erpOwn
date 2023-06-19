<template>
  <div>
    <div class="content">
      <el-form
        :inline="true"
        :model="selectResult"
        size="medium"
        class="demo-form-inline"
      >
        <div class="content-search-normal">
          <el-form-item label="目的港:" style="margin-left: 15px">
            <el-select
              v-model="selectResult.pod"
              id="pod"
              placeholder="目的港三字码"
              :remote-method="initAirportSearchByPage"
              ref="limitInput1"
              :loading="loading"
              @change="getCurrentData"
              clearable
              filterable
              remote
              reserve-keyword
            >
              <el-option
                v-for="item in podOpt"
                :disabled="pol == item.threeLetterCode"
                :key="item.threeLetterCode"
                :value="item.threeLetterCode"
              >
                <span>{{ item.threeLetterCode }}</span>
                <span style="margin-left: 5px">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="航线姓名" label-width="80px">
            <el-select
              v-model="selectResult.principalId"
              id="airlineName"
              ref="limitInput2"
              placeholder="请输入航线"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 210px"
            >
              <el-option
                v-for="item in airManger"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="提交时间" label-width="80px">
            <el-date-picker
              style="width: 150px"
              v-model="selectResult.startCommitDate"
              type="date"
              :picker-options="pickerOptionsStartOne"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker
            >-
            <el-date-picker
              style="width: 150px"
              v-model="selectResult.endCommitDate"
              type="date"
              :picker-options="pickerOptionsEndOne"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="是否实单:" label-width="80px">
            <el-select
              v-model="selectResult.workOrderType"
              style="width: 210px"
            >
              <el-option
                v-for="(item, index) in ifTrueOrder"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              @click="searchClick('default')"
              size="mini"
              type="primary"
              icon="el-icon-search"
              v-auth="['402000_B']"
              >查询</el-button
            >
          </el-form-item>
        </div>
        <div class="operateButton">
          <div class="operateLeft">
            <el-button
              :type="dateFlag == 1 ? 'primary' : ''"
              plain
              size="mini"
              @click="timeChoose(1)"
              >今天</el-button
            >
            <el-button
              :type="dateFlag == 2 ? 'primary' : ''"
              plain
              size="mini"
              @click="timeChoose(2)"
              >昨日</el-button
            >
            <el-button
              :type="dateFlag == 3 ? 'primary' : ''"
              plain
              size="mini"
              @click="timeChoose(3)"
              >上周</el-button
            >
            <el-button
              :type="dateFlag == '0' ? 'primary' : ''"
              plain
              size="mini"
              @click="timeChoose('0')"
              >全部</el-button
            >
          </div>
          <div class="operateRight">
            <el-button @click="exportFile" size="mini" type="primary" v-auth="['402002_B']"
              >导出列表</el-button
            >
            <div class="upFilter" @click="upFilter">
              <img
                style="width: 15px; height: 15px"
                src="../../../assets/workOrderFilter.svg"
                alt=""
              />
              高级筛选
            </div>
          </div>
        </div>
      </el-form>
      <!-- 高级筛选弹框 -->
      <el-dialog :visible.sync="upFilterDial" title="筛选" width="830px">
        <el-form class="upFilterForm" label-position="left">
          <el-form-item label="目的港" label-width="80px" style="width: 300px">
            <el-select
              v-model="selectResult.pod"
              id="pod1"
              placeholder="目的港三字码"
              :remote-method="podMethod"
              :loading="loading"
              @change="getCurrentData"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 210px"
            >
              <el-option
                v-for="item in podOpt"
                :disabled="pol == item.threeLetterCode"
                :key="item.threeLetterCode"
                :value="item.threeLetterCode"
              >
                <span>{{ item.threeLetterCode }}</span>
                <span style="margin-left: 5px">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="提交时间"
            label-width="70px"
            style="width: 420px; margin-left: 10px"
          >
            <el-date-picker
              style="width: 150px"
              v-model="selectResult.startCommitDate"
              type="date"
              :picker-options="pickerOptionsStartOne"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker
            >-
            <el-date-picker
              style="width: 150px"
              v-model="selectResult.endCommitDate"
              type="date"
              :picker-options="pickerOptionsEndOne"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="航线姓名"
            label-width="80px"
            style="width: 300px"
          >
            <el-select
              v-model="selectResult.principalId"
              placeholder="请输入航线"
              id="airlineName1"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 210px"
            >
              <el-option
                v-for="item in airManger"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="提交者"
            label-width="70px"
            style="width: 420px; margin-left: 10px"
          >
            <el-select
              v-model="selectResult.creatorId"
              placeholder="请输入提交者"
              id="commitPeople1"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 310px"
            >
              <el-option
                v-for="item in commitPeople"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="询单状态:"
            label-width="80px"
            style="width: 300px"
          >
            <el-select v-model="selectResult.status" style="width: 210px">
              <el-option
                v-for="(item, index) in workOrderStatus"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="询单编号"
            label-width="70px"
            style="width: 420px; margin-left: 10px"
          >
            <el-input
              id="workOrderNo1"
              v-model="selectResult.workOrderNo"
              style="width: 310px"
              size="medium"
              :maxlength="11"
              clearable
              placeholder="请输入询单编号"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="是否实单:"
            label-width="80px"
            style="width: 300px"
          >
            <el-select
              v-model="selectResult.workOrderType"
              style="width: 210px"
            >
              <el-option
                v-for="(item, index) in ifTrueOrder"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="upFilterFooter">
          <el-button type="info" @click="upFilterDial = false">取消</el-button>
          <el-button type="primary" @click="advanceFilter">确定</el-button>
        </div>
      </el-dialog>
      <el-table
        :data="tableData"
        border
        header
         :cell-style="tableRowStyle"
        :row-class-name="tableRowClassName"
        @row-click="rowClick"
        @sort-change="sortChange"
        ref="tableAirLine"
        class="finance-talbe"
        style="width: 100%"
      >
        <template slot="empty">
          <img class="data-pic" src="@/assets/kong-icon.png" />
          <p>暂无数据</p>
        </template>
        <el-table-column
          prop="createTime"
          label="提交时间"
          :sortable="versionType == '0' ? true : false"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="commitName"
          label="提交者"
          :sortable="versionType == '0' ? true : false"
          min-width="80"
        ></el-table-column>
        <el-table-column
          label="目的港"
          prop="pod"
          :sortable="versionType == '0' ? true : false"
          min-width="40"
        ></el-table-column>
        <el-table-column
          label="件/毛/体"
          prop="cargoInfo"
          min-width="80"
        ></el-table-column>
       
        <el-table-column label="回复内容" min-width="120" prop="lastMsgContent">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="询单详情"
          min-width="80"
          class="allColumn"
        >
          <template slot-scope="scope">
            <el-popover
              popper-class="chatRoom"
              placement="bottom"
              width="200"
              trigger="manual"
              :ref="`popover${scope.$index}`"

            >
              <chatRoom
                v-if="!scope.row.arrow"
                :scaleChat="true"
                style="transform: scale(0.6); transform-origin: -5%"
                :fromPageType="2"
                @getNewData="getNewData"
                :workOrderId="workOrderId"
                :extraData="extraData"
                :titleNo="titleNo"
                :contentMessage.sync="contentMessage"
                :workOrderType="workOrderTypeC"
                @closeChatRoom="closePopover(scope.$index)"
              ></chatRoom>
              <div
                slot="reference"
                style="color: #02a7f0"
                @click.stop="changeRows(scope.$index,scope.row.id,true)"
              >
                详情
                <img
                  :src="
                    scope.row.arrow
                      ? require('@/assets/xiajiantou.png')
                      : require('@/assets/shangjiantou.png')
                  "
                  alt=""
                  style="width: 10px; height: 10px"
                />
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="workOrderType"
          label="询单类型"
          :sortable="versionType == '0' ? true : false"
          min-width="80"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.workOrderType | getData(1) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="workOrderNo"
          label="询单编号"
          :sortable="versionType == '0' ? true : false"
          min-width="80"
        ></el-table-column>

        <el-table-column
          prop="statusStr"
          label="询单状态"
          :sortable="versionType == '0' ? true : false"
          min-width="80"
        >
        </el-table-column>
        <el-table-column
          prop="principalNames"
          label="航线人员"
          min-width="80"
        ></el-table-column>
      </el-table>

      <div class="footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import chatRoom from "./chatRoom";

export default {
  props: {
    pageRoleId: {
      type: Number,
      default: 0,
    },
    versionType: {
      type: String,
      default: "0",
    },
  },
  components: {
    chatRoom,
  },
  data() {
    return {
      clickAthor:false,
      //聊天室
      //标题
      titleNo: "",
      //聊天成员及内容
      contentMessage: {},
      //询单或实单
      workOrderTypeC: -1,
      workOrderId: "",
      extraData:'',
      flag: false,
      //日期选择按钮
      dateFlag: 1,
      //高级筛选弹框
      upFilterDial: false,
      podOpt: [],
      ifTrueOrder: [
        { value: "", label: "全部" },
        { value: "1", label: "实单" },
        { value: "0", label: "询价" },
      ],
      workOrderStatus: [
        { value: "", label: "全部" },
        { value: "2", label: "已回复" },
        { value: "0", label: "待回复" },
      ],
      //判断查询的类型
      searchType: "fast",
      airManger: [],
      commitPeople: [],
      //旧
      //搜索框结果
      selectResult: {
        pod: "",
        workOrderNo: "",
        endCommitDate: "",
        startCommitDate: "",
        principalId: "",
        status: "",
        workOrderType: "",
        creatorId: "",
      },
      // nameList: [],
      details: [],
      // dataTimer: "", //数据请求定时器
      //询单倒计时数字
      // timer: "10:00",
      //询单倒计时定时器
      // timerInterval: "",

      text: "", //反馈内容
      setText: "", //转单选项
      statuShow: "true",
      pageSize: 10,
      pageNum: 1,
      total: "",
      tableData: [],
      pickerOptionsStartOne: {
        // 限制航班日期
        disabledDate: (time) => {
          let endDateVal = this.selectResult.endCommitDate;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        },
      },
      pickerOptionsEndOne: {
        disabledDate: (time) => {
          let beginDateVal = this.selectResult.startCommitDate;
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime() - 8.64e7;
          }
        },
      },
      //导出列表请求数据
      exportListData: [],
    };
  },
  created() {
    // if (
    //   sessionStorage.getItem("lastPageNum") &&
    //   JSON.parse(sessionStorage.getItem("lastPageNum")).pageNum
    // ) {
    //   this.pageNum = Number(
    //     JSON.parse(sessionStorage.getItem("lastPageNum")).pageNum
    //   );
    // }
    this.$http
      .post(this.$service.searchPrcpUserByPage, { pageNum: 1, pageSize: 5000 })
      .then((data) => {
        this.airManger = data.data.records;
      });
    this.$http
      .post(this.$service.searchCstUserByPage, { pageNum: 1, pageSize: 5000 })
      .then((data) => {
        this.commitPeople = data.data.records;
      });
  },
  mounted() {
    this.limitInput();
    // this.getId();
    this.initAirportSearchByPage();
    document.addEventListener("compositionstart", (e) => {
      this.flag = true;
    });
    document.addEventListener("compositionend", (e) => {
      this.flag = false;
    });
    this.initData("fast");
    // let thisS = this
    // document.querySelectorAll('.content-wrapper')[0].onclick = function(e) {
    //     if((document.getElementsByClassName("el-table")[0] && document.getElementsByClassName("el-table")[0].contains(e.target))) {
    //     }else {
    //       thisS.clickAthor = true
    //     }
    //   }
  },
  activated() {
      this.$http.post(this.$service.airOrder, this.exportListData).then((data) => {
        if (data.code == 200) {
          let copyData = data.data.records;
          copyData.forEach((item) => (item.arrow = true));

          this.tableData = copyData;
          this.total = data.data.total;
          
          for (let i = 0; i < this.pageSize; i++) {
            this.$refs["popover" + i] &&
              (this.$refs["popover" + i].showPopper = false);
          }
        } else {
          this.$message.error(data.message);
        }
      });
  },
  methods: {
    
    //聊天室获取新数据
    getNewData(id) {
      this.$http
        .get(this.$service.getSingleChatBox + "?workId=" + id)
        .then((res) => {
          if (res.code == 200) {
            this.titleNo = Object.keys(res.data.mesList)[0];
            this.$set(
              this.contentMessage,
              "chatMessage",
              Object.values(res.data.mesList)[0]
            );
            this.contentMessage.chatMember = res.data.workOrderMember;
            this.workOrderType = res.data.workOrderType;
            this.workOrderId = res.data.workOrderId;
            this.extraData = {title:res.data.title,remark:res.data.remark,size:res.data.size,cargoReadyDate:res.data.cargoReadyDate}
            
          } else {
            this.$message.error(res.message);
          }
        });
    },
     // 把每一行的索引放进row
    tableRowClassName({ row, rowIndex }) {
      row.cIndex = rowIndex;
    },
    rowClick(row,column){
      // this.hidePop = false
      
      if(column.label!="询单详情" && this.tableData.some(item=>!item.arrow)){
       return this.tableData.forEach((item,index)=>{
          if(!item.arrow){
              this.tableData[index].arrow = !this.tableData[index].arrow;
              this.$refs["popover" + index].showPopper = false
          }
        })
      }
      else if(column.label=="询单详情"){
        // this.clickAthor = false
        //关闭之前打开的详情
        // this.tableData.forEach((item,index)=>{
        //   if(index!=row.cIndex && !item.arrow){
        //       this.tableData[index].arrow = !this.tableData[index].arrow;
        //       this.$refs["popover" + index].showPopper =
        //       !this.$refs["popover" + index].showPopper;
        //   }
        // })
        this.changeRows(row.cIndex,row.id)
      }else{
        this.jumpToDetail(row)
      }
    },
    //打开详情popover
    changeRows(index, id,tableClick) {
      // if(tableClick){
      //   this.clickAthor = false
      // }
      this.$http
        .get(this.$service.getSingleChatBox + "?workId=" + id)
        .then((res) => {
          if (res.code == 200) {
            this.titleNo = Object.keys(res.data.mesList)[0];
            this.$set(
              this.contentMessage,
              "chatMessage",
              Object.values(res.data.mesList)[0]
            );
            this.contentMessage.chatMember = res.data.workOrderMember;
            this.workOrderTypeC = res.data.workOrderType;
            this.workOrderId = res.data.workOrderId;
            this.extraData = {title:res.data.title,remark:res.data.remark,size:res.data.size,cargoReadyDate:res.data.cargoReadyDate}
          this.tableData.forEach((items,indexs)=>{
          if(indexs!=index && !items.arrow){
              this.tableData[indexs].arrow = !this.tableData[indexs].arrow;
              this.$refs["popover" + indexs].showPopper =
              !this.$refs["popover" + indexs].showPopper;
          }
        })
        // console.log(this.hidePop)
        //   if(!this.hidePop){
        //     this.$set(
        //       this.tableData[index],
        //       "arrow",
        //       !this.tableData[index].arrow
        //     );
        //   }
        //   this.hidePop = false
              this.tableData[index].arrow = !this.tableData[index].arrow;

           this.$refs["popover" + index].showPopper  = !this.$refs["popover" + index].showPopper

          } else {
            this.$message.error(res.message);
          }
        });
    },
  //  hidePopover(index){
  //     this.$set(
  //             this.tableData[index],
  //             "arrow",
  //             true
  //           );
  //           if(!this.clickAthor){
  //             this.hidePop = true
  //           }
  //   },
    //订单详情弹框右上角X关闭
    closePopover(index) {
       this.$set(
              this.tableData[index],
              "arrow",
              !this.tableData[index].arrow
            );
       this.$refs["popover" + index].showPopper =
              !this.$refs["popover" + index].showPopper;
              this.clickAthor = true
    },
    jumpToDetail(val) {
      this.$emit("jumpToDetail", val.id);
    },
    // 排序
    sortChange(column) {
      var pr = column.prop;
      var type = column.order;
      switch (pr) {
        case "createTime":
          this.sortBy = "0";
          break;
        case "userName":
          this.sortBy = "1";
          break;
        case "pod":
          this.sortBy = "2";
          break;
        case "workOrderType":
          this.sortBy = "3";
          break;
        case "workOrderNo":
          this.sortBy = "4";
          break;
        case "status":
          this.sortBy = "5";
          break;
      }
      if (type == "descending") {
        this.sortPath = "1";
      } else if (type == "ascending") {
        this.sortPath = "0";
      } else {
        this.sortBy = "";
        this.sortPath = "";
        this.searchClick(this.searchType);
        return;
      }
      this.initData(this.searchType, {
        sortBy: this.sortBy,
        sortPath: this.sortPath,
      });
    },
    //普通筛选 限制
    limitInput() {
      const input1 = document.querySelector("#pod");
      input1.setAttribute("maxLength", 3);
      input1.oninput = function () {
        input1.value = input1.value.replace(/[^a-zA-Z]/gi, "");
      };
      const input2 = document.querySelector("#airlineName");
      input2.setAttribute("maxLength", 10);
      input2.onkeydown = () => {
        if (!this.flag) {
          setTimeout(() => {
            input2.value = input2.value.replace(
              /[^\u4e00-\u9fa5a-zA-Z0-9]/gi,
              ""
            );
          });
        }
      };
    },
    //高级筛选弹框 限制
    upFilterInput() {
      const input1 = document.querySelector("#pod1");
      input1.setAttribute("maxLength", 3);
      input1.oninput = function () {
        input1.value = input1.value.replace(/[^a-zA-Z]/gi, "");
      };
      const input2 = document.querySelector("#airlineName1");
      input2.setAttribute("maxLength", 10);
      input2.keydown = () => {
        if (!this.flag) {
          setTimeout(() => {
            input2.value = input2.value.replace(
              /[^\u4e00-\u9fa5a-zA-Z0-9]/gi,
              ""
            );
          });
        }
      };
      const input3 = document.querySelector("#commitPeople1");
      input3.setAttribute("maxLength", 10);
      input3.onkeydown = () => {
        if (!this.flag) {
          setTimeout(() => {
            input3.value = input3.value.replace(
              /[^\u4e00-\u9fa5a-zA-Z0-9]/gi,
              ""
            );
          });
        }
      };
      const input4 = document.querySelector("#workOrderNo1");
      input4.setAttribute("maxLength", 11);
      input4.oninput = function () {
        input4.value = input4.value.replace(/[^a-zA-Z0-9]/gi, "");
      };
    },
    timeChoose(type) {
      this.dateFlag = type;
      this.searchClick("fast");
    },
    upFilter() {
      this.upFilterDial = true;
      this.$nextTick(() => {
        this.upFilterInput();
      });
    },
    //目的港三字码
    initAirportSearchByPage(keyWord) {
      if (!keyWord) {
        keyWord = "";
      }
      this.$http
        .get(this.$service.airportSearchByPage + "?keyWord=" + keyWord)
        .then((data) => {
          if (data.code == 200) {
            this.podOpt = data.data.records;
          } else {
            this.$message.error(data.message);
          }
        });
    },

    //旧
    //表格样式
    tableRowStyle({ row }) {
      if (row.needReply == 0) {
        return "background-color:rgba(250, 128, 114,0.8);";
      }
    },
    //客服姓名数据
    // getId() {
    //   this.$http
    //     .get(
    //       this.$service.userSearchNoAuth +
    //         "?roleName=" +
    //         this.selectResult.roleName
    //     )
    //     .then((data) => {
    //       this.nameList = data.data.records;
    //     });
    // },
    //高级筛选
    advanceFilter() {
      this.initData("advance");
    },
    //数据查询
    initData(val, sortData) {
      let request = {};
      if (val == "fast") {
        this.selectResult = {
          pod: "",
          workOrderNo: "",
          endCommitDate: "",
          startCommitDate: "",
          principalId: "",
          status: "",
          workOrderType: "",
          creatorId: "",
        };
      }
      let copy = JSON.parse(JSON.stringify(this.selectResult));
      if (val == "default") {
        this.dateFlag = "";
        this.searchType = "default";
        delete copy.workOrderNo;
        delete copy.status;
        delete copy.creatorId;
        request = copy;
      } else if (val == "fast") {
        this.searchType = "fast";
        request = copy;
        request.dateFlag = this.dateFlag;
      } else if (val == "advance") {
        this.dateFlag = "";
        this.searchType = "advance";
        request = copy;
      }
      if (sortData) {
        request = { ...sortData, ...request };
      } else {
        //非排序则清空排序
        this.$refs.tableAirLine.clearSort();
      }
      request.pageSize = this.pageSize;
      request.pageNum = this.pageNum;
      request.versionType = this.versionType
      this.exportListData = request;
      this.$http.post(this.$service.airOrder, request).then((data) => {
        if (data.code == 200) {
          let copyData = data.data.records;
          copyData.forEach((item) => (item.arrow = true));

          this.tableData = copyData;
          this.total = data.data.total;

          if (val == "advance") {
            this.upFilterDial = false;
          }
          for (let i = 0; i < this.pageSize; i++) {
            this.$refs["popover" + i] &&
              (this.$refs["popover" + i].showPopper = false);
          }
        } else {
          this.$message.error(data.message);
        }
      });
    },
    searchClick(val) {
      this.initData(val);
    },
    // restClick() {
    //   this.selectResult.workOrderNo = "";
    //   this.selectResult.startCommitDate = "";
    //   this.selectResult.endCommitDate = "";
    //   this.selectResult.status = "";
    //   this.selectResult.roleName = "";
    //   this.initData();
    // },
    //分页切换
    handleSizeChange(e) {
      this.pageSize = e;
      this.pageNum = 1;
      this.initData(this.searchType);
    },
    handleCurrentChange(e) {
      this.pageNum = e;
      this.initData(this.searchType);
    },

    //导出文件
    exportFile() {
      this.$http
        .post(this.$service.airOrderExport, this.exportListData, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          const aLink = document.createElement("a");
          let blob = new Blob([res], {
            type: "application/vnd.ms-excel",
          });
          aLink.href = URL.createObjectURL(blob);
          aLink.setAttribute("download", "航线审核询单" + ".xlsx");
          aLink.click();
          document.body.appendChild(aLink);
        });
    },

    
  },
  filters: {
    getData(value, type) {
      if (type == 1) {
        return value == 0 ? "询价" : value == 1 ? "实单" : "";
      } else if (type == 2) {
        return value == 0
          ? "低"
          : value == 1
          ? "中等"
          : value == 2
          ? "紧急"
          : "";
      } else if (type == 3) {
        return value == 0 ? "未超时" : value == 1 ? "超时" : "";
      } else if (type == 4) {
        return value == 0 ? "待回复" : value == 2 ? "已回复" : "";
      }
    },
  },
  destroyed() {
    // sessionStorage.setItem("lastPageNum", "");
    // clearInterval(this.dataTimer);
  },
  watch: {
    versionType(){
      this.dateFlag=1
      this.initData("fast")
    }
  },
};
</script>
<style lang="">
.chatRoom {
  width: 350px !important;
  height: 325px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
<style scoped lang="less">
.upFilterForm {
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
}
.upFilterFooter {
  text-align: right;
  padding-bottom: 15px;
}
.operateButton {
  display: flex;
  justify-content: space-between;
  margin-bottom: -10px;
  .operateLeft {
    button {
      margin: 0px 0px 20px 15px;
    }
  }
  .operateRight {
    display: flex;
    align-items: center;
    .upFilter {
      cursor: pointer;
      color: #02a7f0;
      font-size: 15px;
      margin-left: 25px;
      margin-bottom: 20px;
    }
    button {
      margin: 0px 5px 20px 5px;
    }
  }
}
/deep/.el-table {
  th {
    // background-color: #fff;
    border-right: 1px solid silver;
    border-bottom: 1px solid silver;
    &:first-child {
      border-left: 1px solid silver;
    }
  }
  td {
    // background-color: #fff;
    border-right: 1px solid silver;
    border-bottom: 1px solid silver;
    &:first-child {
      border-left: 1px solid silver;
    }
  }
}
  .content-search-normal {
     text-align: left;
      padding-left:0!important;
  }

.content {
  background: #fff;
  margin: 20px 20px 0 20px;
}
.content-search {
  padding: 20px 20px 0 20px !important;
}
.export {
  float: right;
  margin-right: 20px;
  margin-bottom: 20px;
}
.footer {
  display: flex;
  height: 100px;
  justify-content: flex-end;
  margin-right: 20px;
}

.head {
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.head :first-child {
  font-size: 22px;
  margin-right: 10px;
}

.warn {
  color: red;
}
.sad {
  height: 2px;
  background-color: rgb(121, 121, 121);
}
.items {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}
.inputarea {
  margin: 10px;
}
.footer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  height: auto;
  padding-bottom: 15px;
}
.select {
  margin-top: 10px;
  margin-left: 10px;
}
.footerFirst {
  width: 110px;
  height: 40px !important;
  background-color: orange;
}
.footerEnd {
  width: 95px;
  height: 40px;
}
.time {
  display: flex;
}

.delete {
  font-size: 20px;
  margin-right: 8px;
  cursor: pointer;
}
.timi {
  margin-left: -5px;
  padding-bottom: 5px;
  margin-top: 2px;
}
.text {
  height: 150px;
  border: 1px solid rgb(193, 193, 193);
  overflow: auto;
  overflow-x: hidden;
}
.textItem {
  font-size: 15px;
  padding-top: 10px;
}
</style>


