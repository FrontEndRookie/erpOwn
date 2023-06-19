<template>
  <div class="pageBody">
    <div class="pageLeft">
      <img class="headerLogo" src="@/assets/inquiry/g.png" alt="" />
      <div class="accountName">{{ userName }}</div>
      <div class="tabList">
        <el-button
          v-auth="['404702_B']"
          type="warning"
          @click="createInquiryDial = true"
          >+新建询盘</el-button
        >
        <div
          @click="changeChatRoom(2)"
          :class="{ activeBTitle: pageType == 2 }"
        >
          询盘会话
          <!-- ({{ airLineDataTotal }}) -->
        </div>
        <div
          @click="returnList(activeTitle)"
          :class="{ activeBTitle: pageType == 1 }"
        >
          询盘列表
        </div>

        <div @click="outClick">
          <!-- <img src="@/assets/inquiry/xunpanout.svg" /> -->
          返回系统
        </div>
      </div>
    </div>
    <div
      class="pageRight"
      v-show="pageType == 1"
      style="position:relative;overflow-y: auto;"
    >
      <el-form :inline="true" size="medium">
        <el-form-item>
          <el-button
            @click="changeDataType(index)"
            style="padding: 7px 10px"
            v-for="(item, index) in dataType"
            :key="index"
            size="mini"
            :type="activeDataType == index ? 'primary' : 'info'"
            >{{ item }}</el-button
          >
        </el-form-item>
        <el-form-item label="起运区域">
          <el-select
            v-model="startArea"
            placeholder="请选择起运区域"
            clearable
            remote
            reserve-keyword
            multiple
            style="width: 170px"
          >
            <el-option
              v-for="item in polArea"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目的港">
          <el-select
            v-model="pod"
            id="pod"
            placeholder="请输入目的港"
            clearable
            filterable
            remote
            reserve-keyword
            style="width: 140px"
          >
            <el-option
              v-for="(item, index) in podOpt"
              :key="item.threeLetterCode"
              :value="item.threeLetterCode"
            >
              <span>{{ item.threeLetterCode }}</span>
              <span style="margin-left: 5px">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提交时间" label-width="70px">
          <el-date-picker
            style="width: 140px"
            v-model="startCommitDate"
            type="date"
            :picker-options="pickerOptionsStartOne"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker
          >-
          <el-date-picker
            style="width: 140px"
            v-model="endCommitDate"
            type="date"
            :picker-options="pickerOptionsEndOne"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="询盘状态">
          <el-select
            v-model="cwoStatus"
            placeholder="请选择询盘状态"
            clearable
            remote
            reserve-keyword
            style="width: 170px"
          >
            <el-option
              v-for="item in inquiryStatus"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 10px">
          <el-button
            @click="buttonSearch"
            type="primary"
            size="mini"
            style="border-radius: 7px"
            >搜索</el-button
          >
        </el-form-item>
        <!-- <el-form-item style="margin-left: 8px;">
          <el-button
            @click="exportChat"
            type="primary"
            size="mini"
            style="border-radius: 7px"
            >导出会话</el-button
          >
          <span
            style="font-size:15px;color:#aaa;margin-left: 5px;transform: translateY(3px);display: inline-block;"
          >
            <i class="el-icon-warning" style="color:#ea9518;font-size:17px"></i
            >系统仅支持导出最大会话数10w条
          </span>
        </el-form-item> -->
      </el-form>
      <div class="order-list-table" style="line-height: normal">
        <div class="table-body">
          <div
            v-if="tableData.length == '0'"
            style="text-align:center;padding:100px 0"
          >
            <img
              class="data-pic"
              src="@/assets/kong-icon.png"
              style="width:300px;height:210px"
            />
            <p
              style="font-size: 14px;
                        color: #5e6d82;
                        margin-top:20px"
            >
              暂无数据
            </p>
          </div>
          <div
            v-else
            class="table-tr"
            v-for="(item, index) in tableData"
            :key="index"
            @click="enterSingleChat(item)"
            style="cursor:pointer"
          >
            <div
              class="table-td"
              v-for="(itemD, indexD) in tableHead"
              :key="indexD"
              style="padding: 10px 0; font-size: 12px"
            >
              <div
                class="td-body"
                v-if="itemD.value == 'customMes'"
                style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
              >
                <el-badge
                  :value="item.unreadCount"
                  :hidden="item.unreadCount < 1"
                >
                  <div class="headerImg">
                    <span>{{ item.pod }}</span>
                    <div class="headerArea">{{ item.startArea }}</div>
                  </div>
                </el-badge>
                <div
                  style="
                      text-align: left;
                      margin-left:15px;
                      flex:3;
                      /* white-space: nowrap; */
                    "
                >
                  <div style="word-wrap:break-word;white-space:normal;">
                    {{ item.customerName }}
                    <!-- <span style="color:orange;"> {{ item.userLabel }}</span> -->
                  </div>
                  <div style="font-weight: normal">
                    提交时间:{{ item.lastAskTime }}
                  </div>
                </div>
              </div>
              <div
                class="td-body"
                v-if="itemD.value == 'inuquiryCont'"
                style="
                    text-decoration: underline;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  "
              >
                {{
                  JSON.parse(item.value)[0] && JSON.parse(item.value)[0].src
                }}
              </div>
              <div
                class="td-body"
                v-if="itemD.value == 'replyStatus'"
                :style="{
                  color:
                    item.isRevoke == 1
                      ? '#FF7700'
                      : item.isReply == 1
                      ? '#333333'
                      : '#999999'
                }"
              >
                {{
                  item.isRevoke == 1
                    ? "已撤销"
                    : item.isReply == 1
                    ? "已回复"
                    : "待回复"
                }}
              </div>
              <div class="td-body" v-if="itemD.value == 'startArea'">
                {{ item.startArea }}
              </div>
              <div
                class="td-body"
                v-if="itemD.value == 'lastMes'"
                style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
              >
                {{ item.customerName }}:{{ item.lastAsk ? item.lastAsk : "" }}
              </div>
              <div
                class="td-body"
                v-if="itemD.value == 'pod'"
                style="text-align:center"
              >
                {{ item.pod }}
              </div>
              <div
                class="td-body"
                v-if="itemD.value == 'reminder'"
                style="position:relative"
              >
                <el-button
                  v-if="item.isReminder == 1"
                  disabled
                  :type="item.isReminder == 1 ? 'warning' : 'primary'"
                  size="mini"
                  >{{
                    item.isReminder == 1
                      ? `已催单${
                          item.reminderCount > 0 ? item.reminderCount : ""
                        }`
                      : ""
                  }}</el-button
                >
                <i
                  class="el-icon-d-arrow-right"
                  style="position:absolute;right:5%;transform:translateY(9px);color:#cdcdcd"
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-pagination
        background
        :current-page="pageNum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="text-align:right;margin:15px 10px 0 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <extensionChat
      v-if="pageType == 2"
      ref="airLineChat"
      :singleId="singleId"
      :ifVocation.sync="ifVocation"
      @goSingleChat="enterSingleChat"
      @clearSingle="singleId = -1"
      @returnList="returnList"
    ></extensionChat>
    <createInquiry v-if="createInquiryDial"></createInquiry>
    <!-- 聊天室新消息提示  -->
    <audio id="noticeMusics" controls style="position:fixed;top:0;display:none">
      <source src="@/assets/inquiry/inquiry.wav" />
    </audio>
  </div>
</template>
<script>
import { Loading } from "element-ui";
import extensionChat from "./components/extensionChat.vue";
import createInquiry from "./components/createInquiry.vue";
import { mapMutations } from "vuex";
export default {
  components: {
    extensionChat,
    createInquiry
  },
  data() {
    return {
      pageType: 1, // 1- 询盘列表 2-询盘会话 3-货盘列表
      startArea: [],
      cwoStatus: "",
      ifVocation: false, //是否休假
      userName: "", //账户名字
      flag: false,
      principalArray: [], //航线负责人列表
      principalId: "", //航线负责人id
      singleId: "", //聊天室单独请求的id
      polArea: [
        {
          //起运区域
          label: "华东",
          value: "华东"
        },
        {
          label: "华南",
          value: "华南"
        },
        {
          label: "华中/华北",
          value: "华中华北"
        }
      ],
      inquiryStatus: [
        //询盘状态
        { label: "全部", value: 0 },
        { label: "已回复", value: 1 },
        { label: "待回复", value: 2 },
        { label: "已撤销", value: 3 }
      ],
      PDObj: { pod: "", pol: "" },
      activeTitle: 1,
      airLineDataTotal: 0,
      customDataTotal: 0,
      requestData: "",
      noData: false,
      dataType: ["今日", "昨日", "上周", "全部"],
      activeDataType: 0,
      pod: "",
      //表格分页
      pageNum: 1,
      pageSize: 10,
      total: "",

      podOpt: [],
      startCommitDate: `${new Date().getFullYear()}-${
        new Date().getMonth() + 1 < 10
          ? "0" + (new Date().getMonth() + 1)
          : new Date().getMonth() + 1
      }-${
        new Date().getDate() < 10
          ? "0" + new Date().getDate()
          : new Date().getDate()
      }`,
      endCommitDate: `${new Date().getFullYear()}-${
        new Date().getMonth() + 1 < 10
          ? "0" + (new Date().getMonth() + 1)
          : new Date().getMonth() + 1
      }-${
        new Date().getDate() < 10
          ? "0" + new Date().getDate()
          : new Date().getDate()
      }`,
      pickerOptionsStartOne: {
        // 限制航班日期
        disabledDate: time => {
          let endDateVal = this.endCommitDate;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        }
      },
      pickerOptionsEndOne: {
        disabledDate: time => {
          let beginDateVal = this.startCommitDate;
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime() - 8.64e7;
          }
        }
      },
      tableData: [],
      tableHead: [
        { value: "customMes" },
        { value: "startArea" },
        { value: "pod" },
        { value: "inuquiryCont" },
        { value: "replyStatus" },
        { value: "lastMes" },
        { value: "reminder" }
      ],
      createInquiryDial: false
    };
  },
  methods: {
    ...mapMutations("chatRoom", ["setChatRoomTitleBox"]),

    getId() {
      // 航线负责人id
      this.$http
        .get(
          this.$service.userSearchNoAuth + "?roleName=航线负责人&pageSize=50000"
        )
        .then(data => {
          this.principalArray = data.data.records;
        });
    },

    //进入指定聊天室
    enterSingleChat(val) {
      this.singleId = val.id;
      this.pageType = 2;
    },
    //退出系统
    outClick() {
      this.$confirm("确定返回系统？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$router.push({
            path: "/orderManagement/orderManageNew"
          });
        })
        .catch(() => {});
    },
    //分页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.searchByPageSys();
    },
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.searchByPageSys();
    },
    //导出会话
    async exportChat() {
      let loadingInstance = Loading.service({
        fullscreen: true,
        text: "文件下载中"
      });
      this.$message.success("导出会话提交成功,正在下载");

      const { dayjs } = this.$utils;
      const data = await this.$http.post(
        this.$service.exportCwoF,
        this.requestData,
        {
          responseType: "arraybuffer"
        }
      );
      setTimeout(() => {
        loadingInstance.close();
      }, 500);
      this.$utils.exportBuffer({
        buffer: data,
        exportName: `接待会话记录--${dayjs().format("YYYY-MM-DD")}.xlsx`
      });
    },
    changeActTitle(val) {
      Object.assign(this.$data, this.$options.data(this), {
        pickerOptionsStartOne: this.pickerOptionsStartOne,
        pickerOptionsEndOne: this.pickerOptionsEndOne,
        podOpt: this.podOpt,
        airLineDataTotal: this.airLineDataTotal,
        customDataTotal: this.customDataTotal,
        userName: this.userName
      });
      this.activeTitle = val;
      this.searchByPageSys();
    },
    changeChatRoom(val) {
      // if(val){
      //   this.activeTitle = val
      // }
      window.chatType = val;
      this.singleId = -1;
      this.pageType = val;
    },
    returnList() {
      this.pageType = 1;
      this.searchByPageSys();
    },
    buttonSearch() {
      this.pageNum = 1;
      this.searchByPageSys();
    },

    //询单查询
    searchByPageSys() {
      this.requestData = {
        startTime: this.startCommitDate,
        endTime: this.endCommitDate,
        pod: this.pod,
        memType: this.activeTitle,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchType: 1,
        cwoStatus: this.cwoStatus,
        startArea: this.startArea.join()
      };
      this.$http
        .post(this.$service.searchByPageSys, this.requestData)
        .then(res => {
          if (res.code == 200) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
        });
    },

    changeActiveDataType(nv) {
      let date = new Date();
      if (nv == 0) {
        let today = `${date.getFullYear()}-${this.dateFormat(
          date.getMonth() + 1
        )}-${this.dateFormat(date.getDate())}`;
        this.startCommitDate = today;
        this.endCommitDate = today;
      } else if (nv == 1) {
        let time = date.getTime();
        let oneday = 1000 * 60 * 60 * 24;
        let lastDay = new Date(time - oneday);
        let lastDayDate = `${lastDay.getFullYear()}-${this.dateFormat(
          lastDay.getMonth() + 1
        )}-${this.dateFormat(lastDay.getDate())}`;
        this.startCommitDate = lastDayDate;
        this.endCommitDate = lastDayDate;
      } else if (nv == 2) {
        this.startCommitDate = this.getWeekSE()[0];
        this.endCommitDate = this.getWeekSE()[1];
      } else if (nv == 3) {
        this.startCommitDate = "";
        this.endCommitDate = "";
      }
    },
    //表格数据快捷筛选
    changeDataType(idx) {
      this.activeDataType = idx;
      this.changeActiveDataType(idx);
      this.searchByPageSys();
      // });
    },
    //目的港
    podMethod(val) {
      if (this.lastVal == val) {
        return;
      }
      this.lastVal = val;
      this.initAirportSearchByPage(val);
    },
    initAirportSearchByPage(keyWord) {
      if (!keyWord) {
        keyWord = "";
      }
      this.$http
        .get(this.$service.airportSearchByPage + "?keyWord=" + keyWord)
        .then(data => {
          this.loading = false;
          if (data.code == 200) {
            this.podOpt = data.data.records;
          }
        });
    },
    judgeIfVocation() {
      this.$http
        .post(
          this.$service.checkIsLeaving +
            "?sysUserId=" +
            JSON.parse(sessionStorage.getItem("userInfo")).id
        )
        .then(res => {
          if (res.code == 200) {
            this.ifVocation = res.data == 1 ? false : true;
          }
        });
    },
    isToday(str) {
      if (!str) return "";
      let d = new Date(str).setHours(0, 0, 0, 0);
      let today = new Date().setHours(0, 0, 0, 0);
      let obj = {
        "-86400000": "昨天",
        0: "今天",
        86400000: "明天"
      };
      if (d - today < -86400000) {
        return "昨天之前";
      }
      return obj[d - today];
    },
    //获取周一到周日
    getWeekSE() {
      var now = new Date();
      var nowTime = now.getTime();
      var day = now.getDay();
      day == 0 ? (day = 7) : "";
      var oneDayTime = 24 * 60 * 60 * 1000;
      //显示周一
      var MondayTime = nowTime - (day + 6) * oneDayTime;
      //显示周日
      var SundayTime = nowTime - day * oneDayTime;
      //初始化日期时间
      var monday = new Date(MondayTime);
      var sunday = new Date(SundayTime);

      function format(shijianchuo) {
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        return `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`;
      }
      return [format(monday), format(sunday)];
    },
    dateFormat(val) {
      return val < 10 ? "0" + val : val;
    }
  },

  created() {
    this.userName = JSON.parse(sessionStorage.getItem("userInfo")).loginName;
    this.pageType = JSON.parse(sessionStorage.getItem("chatRoom")) || 1;
    if (this.pageType == 2) {
      window.chatType = 1;
    } else {
      window.chatType = 2;
    }
    document.title = "接待会话";
    this.judgeIfVocation();
    this.initAirportSearchByPage();
    this.searchByPageSys();
  },
  mounted() {
    document.addEventListener("compositionstart", e => {
      console.log(111);
      this.flag = true;
    });
    document.addEventListener("compositionend", e => {
      console.log(222);
      this.flag = false;
    });

    sessionStorage.removeItem("chatRoom");
    const input1 = document.querySelector("#pod");
    input1.setAttribute("maxLength", 3);
    let that = this;
    input1.onkeyup = () => {
      if (!that.flag) {
        setTimeout(() => {
          input1.value = input1.value.replace(/[^a-zA-Z]/gi, "");
          that.podMethod(input1.value);
        });
      }
    };
  },
  watch: {
    startCommitDate(nv, ov) {
      if (
        this.isToday(nv) == "今天" &&
        this.isToday(this.endCommitDate) == "今天"
      ) {
        this.activeDataType = 0;
      } else if (
        this.isToday(nv) == "昨天" &&
        this.isToday(this.endCommitDate) == "昨天"
      ) {
        this.activeDataType = 1;
      } else if (
        nv == this.getWeekSE()[0] &&
        this.endCommitDate == this.getWeekSE()[1]
      ) {
        this.activeDataType = 2;
      } else if (!nv && !this.endCommitDate) {
        this.activeDataType = 3;
      } else {
        this.activeDataType = -1;
      }
    },
    endCommitDate(nv, ov) {
      console.log(this.isToday(nv), nv);
      if (
        this.isToday(nv) == "今天" &&
        this.isToday(this.startCommitDate) == "今天"
      ) {
        this.activeDataType = 0;
      } else if (
        this.isToday(nv) == "昨天" &&
        this.isToday(this.startCommitDate) == "昨天"
      ) {
        this.activeDataType = 1;
      } else if (
        this.startCommitDate == this.getWeekSE()[0] &&
        nv == this.getWeekSE()[1]
      ) {
        this.activeDataType = 2;
      } else if (!nv && !this.startCommitDate) {
        this.activeDataType = 3;
      } else {
        this.activeDataType = -1;
      }
    },

    pageType() {
      sessionStorage.setItem("chatRoom", this.pageType);
    }
  },
  destroyed() {
    setTimeout(()=>{
      document.title = "罗新国际后台系统";
    },500)
  }
};
</script>
<style lang="less">
.myConfirm {
  border-radius: 8px;
  border: 1px solid silver;
  width: 430px !important;
  padding-bottom: 20px !important;
  .el-message-box__header {
    background-color: #2173d0e6;
    font-size: 18px;
    padding-top: 8px;
    .el-message-box__title {
      font-size: 18px;
      padding: 9px 0 4px;
      color: #fff;
      font-weight: 500;
    }
  }
  .el-message-box__content {
    padding: 25px 0 20px;
  }
  .el-message-box__btns {
    margin-top: 15px;
    button {
      border-radius: 7px !important;
      &:first-child {
        border-radius: 5;
        color: #fff !important;
        background: #bbbdbf !important;
        margin-right: 15px;
        &:hover {
          color: #fff !important;
        }
      }
    }
    // button {
    //   border: 1px solid silver !important;
    //   padding: 10px 5px !important;
    //   background-color: #f5f7fa !important;
    //   color: #606266 !important;
    //   &:hover {
    //     // display: none!important;
    //     border: 1px solid silver !important;
    //     padding: 10px 5px !important;
    //     background-color: #f5f7fa !important;
    //     color: #606266 !important;
    //   }
    // }
  }
}
</style>
<style lang="less" scoped>
/deep/.el-badge__content.is-fixed {
  position: absolute;
  top: 8px;
  right: 24px;
}
.accountName {
  font-size: 13px;
  color: #fff;
  margin-top: 10px;
  text-align: center;
}
.el-icon-d-arrow-right {
  cursor: pointer;
  color: gray;
  transform: translateY(5px);
  font-size: 26px;
  font-weight: 700;
}
.fqDiv {
  width: 1200px;
  height: 70%;
  position: absolute;
  top: 0;
  left: calc(50% - 600px);
  // transform: translateX(-50%);
}
.loadMore {
  cursor: pointer;
  &:hover {
    color: #2273cb;
    text-decoration: underline;
  }
}
.pageBody {
  display: flex;
  height: 100vh;
  background-color: #fff;
  .pageLeft {
    flex: 0 0 140px;
    text-align: center;
    background-color: #0038a7;
    .headerLogo {
      width: 50px;
      height: 50px;
      margin-top: 15px;
    }
    .tabList {
      margin-top: 20px;
      div {
        text-align: center;
        font-size: 15px;
        margin-top: 8px;
        color: #fff;
        padding: 14px 0;
        cursor: pointer;
        line-height: 13px;
        img {
          width: 20px;
          height: 20px;
          transform: translateY(-2px);
        }
        &:hover {
          background: #f3f3f3;
          color: #333;
          .hoverImg {
            content: url("../../assets/inquiry/xunpanlogo.svg");
          }
        }
      }
      .activeBTitle {
        // border-radius:12px 0 0 12px;
        background-color: #fff;
        color: #000;
        .hoverImg {
          content: url("../../assets/inquiry/xunpanlogo.svg");
        }
      }
    }
  }
  .pageRight {
    width: calc(100vw - 140px);
    .el-form {
      padding: 20px 0 0 20px;
    }
  }
}
.order-list-search,
.order-list-table {
  max-height: 75vh;
  overflow-y: auto;
  line-height: 40px;
  font-size: 14px;
  color: #333;
  font-weight: bold;
  border: 1px solid #efefef;
  padding: 10px;
  margin-top: 20px;
}
.el-button--primary {
  background-color: #2273cb !important;
  border-color: #2273cb;
}
.el-button--primary:visited {
  background-color: #2273cb !important;
  border-color: #2273cb;
}
.table-thead {
  display: flex;
}
.table-th {
  padding: 10px 10px;
  font-size: 16px;
  font-weight: 600;
  flex: 1;
  text-align: center;
}
.table-body {
  /* padding:0 10px ; */
}
.table-tr {
  display: flex;
  align-items: center;
  margin-top: 12px;
  background-color: #f7fbfe;

  /* background-color: #0f0; */
}
.table-tr:hover {
  background-color: silver;
}
.table-td {
  /* padding:10px 15px; */
  font-size: 14px;
  flex: 1;
  text-align: center;
  overflow: hidden;
}
.td-body {
  height: 45px;
  line-height: 45px;
  border-right: 2px solid #eaf2f7;
  text-align: center;
  padding: 0 6px;
  .headerImg {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 12px;
    color: white;
    background-color: #0038a7;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .headerArea {
      color: #f59a23;
      font-size: 12px;
      margin-top: 10px;
    }
  }
}
.table-td:nth-child(1) .td-body {
  line-height: normal;
}
.table-td:nth-child(6) .td-body {
  border-right: 0;
}
.table-td:nth-child(1) {
  flex: 2.5;
}
.table-td:nth-child(2) {
  flex: 1;
}
.table-td:nth-child(3) {
  flex: 1;
}
.table-td:nth-child(4) {
  flex: 4;
}
.table-td:nth-child(5) {
  flex: 1;
}
.table-td:nth-child(6) {
  flex: 3;
}
.table-td:nth-child(7) {
  flex: 2;
}
.leftBTitle {
  font-size: 14px;
  border-bottom: 2px solid #2273ce;
  background-color: #eef4fb;
  display: flex;
  div {
    box-sizing: border-box;
    text-align: center;
    padding: 5px 30px;
    border: 1px solid #c0c0c09e;
    cursor: pointer;
  }
  .activeTitle {
    color: #fff;
    background-color: rgba(92, 150, 255);
  }
}
</style>
