<template>
  <div class="chat">
    <div class="chatBox" v-show="leftOrderMes.length > 0">
      <div class="boxLeft">
        <div class="boxSearchBox">
          <div
            class="searchBoxContent"
            v-if="showSearchContent"
            @click="enterHistoryDial"
          >
            <div style="margin-left:20px">
              <img
                src="@/assets/inquiry/moreSearch.svg"
                alt=""
                style="width:40px;height:40px"
              />
              进入全局搜索
            </div>
            <i
              class="el-icon-arrow-right"
              style="font-size:20px;margin-right:15px"
            ></i>
          </div>
          <el-input
            class="chatList"
            size="medium"
            placeholder="搜索内容"
            clearable
            maxlength="500"
            style="flex:1;margin:0 3%"
            prefix-icon="el-icon-search"
            @focus="showSearchContent = true"
            @blur="searchBlur"
            v-model="chatList"
          >
          </el-input>
          <div class="searchButton" v-if="singleSearch" @click="clearSingle">
            <span style="border-right: 1px solid #0e0e0e14;padding:3px"
              >取消查找</span
            >
            <span style="padding:3px">x</span>
          </div>
          <!-- <div>查找</div> -->
        </div>
        <div class="vocationTab" v-if="ifVocation">
          休假中
        </div>
        <div
          :style="{
            height: ifVocation ? 'calc(100% - 70px)' : 'calc(100% - 50px)'
          }"
          style="overflow-y: auto"
          class="chatRoomBox"
          infinite-scroll-disabled="busy"
          v-infinite-scroll="loadMoreData"
          infinite-scroll-throttle-delay="500"
          infinite-scroll-distance="20"
        >
          <div
            v-for="(item, index) in leftOrderMes"
            @contextmenu.prevent="rightKeyOperate($event,item)"
            @click="
              changeChatRoom(
                item
              );
              serviceId = item.serviceId;
              setChatRoomTitleBox(item);
            "
            :key="index"
            class="orderMes"
            :style="{
              backgroundColor: activeIndex == item.id ? '#E3EEF9' : ''
            }"
          >
            <div class="mesBox" style="position:relative">
              <img v-if="item.isTop==1" src="@/assets/inquiry/toTop.svg" alt="" class="toTopIcon">
              <el-badge
                :value="unReadChoice(item)"
                :hidden="unReadChoice(item) < 1"
                style="margin-top: 15px; margin-right: 20px"
              >
                <div
                  class="headerImg"
                >  <span>{{item.pod}}</span>
                    <div class="headerArea">{{item.startArea}}</div>
                  </div>
              </el-badge>
            <div class="mesWord">
              <div v-show="false"></div>
                <div>
                  {{ item.customerName }}
                </div>
                <div>{{ JSON.parse(item.value)[0] && JSON.parse(item.value)[0].src }}</div>
                <div style="line-height:17px">
                  <span v-show="!$chat.isChatDraft(item.id, activeIndex)">{{
                    item.lastMes
                  }}</span>
                  <span v-show="$chat.isChatDraft(item.id, activeIndex)">
                    <span style="color: red;">[草稿]</span>
                    <span>{{
                      $chat.isChatDraft(item.id, activeIndex) &&
                        $chat.isChatDraft(item.id, activeIndex).listDraftText
                    }}</span>
                  </span>
                </div>
                <div>{{ chatRoomUtil.lastTimeShow(item.lastMesTime) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="boxMiddle">
        <chatRoomContent></chatRoomContent>
        <chatRoomInput ref="chatInput" :quickAllLanguage="quickAllLanguage"></chatRoomInput>
      </div>
      <chatRoomRight></chatRoomRight>
    </div>
    <div
      v-if="leftOrderMes.length == '0'"
      style="text-align:center;padding:60px 0"
    >
      <img
        class="data-pic"
        src="@/assets/kong-icon.png"
        style="width:200px;height:140px;margin-top:100px"
      />
      <p
        style="font-size: 14px;
                        color: #5e6d82;
                        margin-top:20px"
      >
        暂无数据
      </p>
    </div>
    <historySearch
      v-on="$listeners"
      @goSameChat="goSameChat"
      @close="closeHistory"
      v-if="historyDial"
      :chatList="chatListC"
    ></historySearch>
    <newPalletInfo
      :palletPod="palletPod"
      :palletObj="palletObj"
      ref="palletInfo"
      :cwoId="cwoId"
      @confirmPallet="confirmPallet"
    ></newPalletInfo>
     <div
      v-if="historyDial"
      style="position:fixed;width:100vw;height:100vh;z-index:100;background: rgba(0, 0, 0, .5);left: 0;right: 0;top: 0;bottom: 0;"
    ></div>
    <wsRequest></wsRequest>
    <rightKey ref="rightKeys" @removeChat="removeChat" @setToTop="setToTop"></rightKey>
  </div>
</template>

<script>
import historySearch from "./historySearch.vue";
import rightKey from './rightKey.vue'
import wsRequest from './wsRequest.vue'
import chatRoomUtil from '@/util/chatRoom.js'
import chatRoomInput from './chatRoomInput.vue'
import chatRoomContent from './chatRoomContent.vue'
import chatRoomRight from './chatRoomRight.vue'
import newPalletInfo from "./newPalletInfo.vue";

import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  components: {
    historySearch,
    rightKey,
    wsRequest,
    chatRoomInput,
    chatRoomContent,
    chatRoomRight,
    newPalletInfo
  },
  props: {
    allDataTotal: {
      type: Number,
      default: 0
    },
    enter: {
      type: Boolean,
      default: true
    },
   
    singleId: {
      type: Number,
      default: -1
    },
    ifVocation: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chatRoomUtil,
      busy: false,
      singleSearch: false, //指定查找
      chatList: "", //查找聊天记录
      chatListC: "",
      showSearchContent: false, //显示全局搜索
      historyDial: false, //查找聊天记录显示
      dataIdArray: [],
      // wsRequset:'',
      palletPod: "",
      palletId: "", //货盘信息id
      lastReply: "", //是否回复信息
      palletObj: "", //货盘信息数据
      cwoId: "", //货盘信息调接口
      serviceId: "",
      chatRevoke: false, //聊天框是否被撤销
      pageNum: 1,
      pageSize: 15,
      noMoreData: false,
      overTime: 0,
      overTimeShow: "",
      overTimer: "",
  
      
      showPlacehoder: true,
      
      fileUrl: "",
      fileName: "",
      fileSize: "",
      datas: "",
      blowPic: "",
      msgList: [],
      loading: false,
      dialInput: "",

      
      newInquiryData: [],
    };
  },
  created() {
  },
  mounted() {
    if(this.singleId>0){
      this.singleSearch = true;
      this.singChatRoom()
    } else {
      this.getChatRoomLeftData(true);
    }
    document.addEventListener("click", val => {
      this.$refs.rightKeys && this.$refs.rightKeys.hideContextMenu()
      document.getElementsByClassName('chatRoomBox')[0] && (document.getElementsByClassName('chatRoomBox')[0].style.overflowY='auto')
    });
  },
  methods: {
    ...mapMutations('chatRoom', ['SetOrderMes','spliceOrderMes','unShiftOrderMes','setChatMessageExtra','setChatRoomTitleBox','setChatRoomContent','setActiveIndex']),
    getNewPallet() {
      if (this.palletId) {
        this.$http
          .post(this.$service.getPalletById + this.palletId)
          .then(res => {
            if (res.code == 200) {
              this.palletObj = res.data;
              this.$refs.palletInfo.palletShow = true;
            } else {
              this.$message.error(res.message);
            }
          });
      } else {
        this.palletObj = "";
        this.$refs.palletInfo.palletShow = true;
      }
    },
    confirmPallet(e){
      this.getNewData(e[0])
      const {startArea,pod,piece,weight,cbm,cargoReadyDate,expectPrice,remark} = e[1]
      this.$refs.chatInput.sendMessageCommon({type: "text", src: `起始区域：${startArea}<br>目的港：${pod}<br>件毛体：${piece+'/'+weight+'/'+cbm+''}<br>货好时间:${cargoReadyDate?cargoReadyDate:''}<br>报价：${expectPrice}<br>备注：${remark}`})
    },
    unReadChoice(val){
      let {customerId,customerUnreadCount,serviceUnreadCount} = val
      return sessionStorage.getItem('userId') == customerId?customerUnreadCount:serviceUnreadCount
    },
    //右键相关操作 ----
    //打开右键
    rightKeyOperate(e,val){
      // console.log(this.$refs.rightKeys)
      document.getElementsByClassName('chatRoomBox')[0].style.overflowY='hidden'
      this.$refs.rightKeys.onContextMenu(e,val)
    },
   
    //置顶取消置顶刷新数据
    setToTop(val){
      let idx = this.leftOrderMes.findIndex(item=>item.id==val.id)
      let copys = this.leftOrderMes[idx]
      this.spliceOrderMes([idx,1])
      if(val.isTop==1){
        //取消置顶-删除数据后刷新
        this.getChatRoomLeftData(true);
      } else {
          copys.isTop = 1
          this.unShiftOrderMes(copys)
        }
    },
   //计算置顶数据数量
    spliceUnTopData(){
      let num = 0
      for(let i=0;i<5;i++) {
        if(this.leftOrderMes[i] && this.leftOrderMes[i].isTop==1 ){
          num++
        }else {
          break
        }
      }
      return num
    },
    //移除会话
    titleRemoveChat(val){
      this.$http.post(this.$service.toHideCw+val).then(res=>{
        if(res.code == 200) {
          this.$message.success('移除会话成功')
          this.removeChat(val)
        }
      
      })
    },
    dealRemove(idx){
      if(this.leftOrderMes.length == 1){
        this.SetOrderMes([])
        return ''
      } else if(idx == this.leftOrderMes.length-1){
        return this.leftOrderMes[idx-1]
      } else {
        return this.leftOrderMes[idx+1]
      }
    },
    removeChat(val){
      let idx = this.leftOrderMes.findIndex(item=>item.id==val)
      if(this.activeIndex != val){
        return
      }
      let item = this.dealRemove(idx)
      this.setChatRoomTitleBox(item) 
      this.changeChatRoom(item)
      this.spliceOrderMes([idx,1])
    },
   //----


    loadMoreData() {
      if (!this.noMoreData && !this.singleSearch) {
        this.busy = true;
        this.pageSize += 10;
        this.getChatRoomLeftData();
      }
    },
    goSameChat(val) {
      this.singleSearch = true;
      this.spliceOrderMes([0]);
      this.$http
        .get(this.$service.getCwoById + val + "&memType=1")
        .then(res => {
          if (res.code == 200) {
            this.SetOrderMes([res.data]);
            this.changeChatRoom(res.data);
            this.setChatRoomTitleBox(res.data);
          }
        });
    },
    clearSingle() {
      this.singleSearch = false;
      this.spliceOrderMes([0]);

      this.$emit("clearSingle");
      this.getChatRoomLeftData(true);
    },
    //进入特定聊天室
    singChatRoom() {
      this.$http
        .get(this.$service.getCwoById + this.singleId + "&memType=1")
        .then(res => {
          if (res.code == 200) {
            this.SetOrderMes([res.data]);
            this.setChatRoomTitleBox(res.data);
            this.changeChatRoom(res.data);
            // console.log(this.leftOrderMes)
          }
        });
    },
    searchBlur() {
      setTimeout(() => {
        this.showSearchContent = false;
      }, 500);
    },
    //进入聊天记录
    enterHistoryDial() {
      // if(!this.chatList) {
      //   return this.$message.warning("当前输入值为空，请输入后搜索")
      // }
      let subStr = /[0-9a-zA-Z\u4e00-\u9fa5]+/;
      if (this.chatList != "" && !subStr.test(this.chatList)) {
        return this.$message.warning("当前输入值全为标点符号，请重新输入");
      }
      this.chatListC = this.chatList;
      this.historyDial = true;
      this.chatList = "";
    },
    //关闭聊天记录
    closeHistory() {
      this.historyDial = false;
    },

    //返回询盘列表
    returnList() {
      clearInterval(window.titleTimer);
      document.title = "接待会话";
      this.$emit("returnList", 1);
    },
 
    //数据发生变化后获取变化数据
    getNewData(idx = this.activeIndex, ifUnshift) {
      this.$http
        .get(this.$service.getCwoById + idx + "&memType=1")
        .then(res => {
          if (res.code == 200) {
            if (ifUnshift) {
              if (this.leftOrderMes.length == 0) {
                clearInterval(window.titleTimer);
                this.getChatRoomLeftData(true, true);
              } else {
                let unTopIndex = this.spliceUnTopData()
                this.spliceOrderMes([unTopIndex,0,res.data])
                this.allDataTotal += 1;
              }
            } else {
              let targetData = res.data
               let indexs = this.leftOrderMes.findIndex(item => item.id == idx);
              if(targetData.isTop == 1){
                this.spliceOrderMes([indexs, 1]);
                this.unShiftOrderMes(targetData);
              }else {
                this.spliceOrderMes([indexs, 1]);
                let unTopIndex = this.spliceUnTopData()
                this.spliceOrderMes([unTopIndex,0,res.data])
              }
              if (res.data.id == this.activeIndex) {
                this.setChatRoomTitleBox(res.data);
                this.changeChatRoom({ifWS:true,...res.data});
              }
            }
          }
        });
    },
  
    //聊天框消息内容
    getChatMessage(id) {
      this.$http.get(this.$service.getCwoBox + id).then(res => {
        if (res.code == 200) {
          this.setChatMessageExtra({
            chatName: res.data.chatName,
            sqName: res.data.sqName,
            certificationBody: res.data.certificationBody
          })
          this.setActiveIndex(id);
          res.data.cwoFlowVOS.forEach(item => {
            item.content = JSON.parse(item.content);
          });
          this.setChatRoomContent(res.data.cwoFlowVOS)
        }
      });
    },

    //聊天室左边聊天框数据
    getChatRoomLeftData(firstGet, reconnection) {
      let request = {
        time: 4,
        memType: 1,
        pageNum: 1,
        pageSize: this.pageSize,
        searchType: 2
      };
      this.$http
        .post(
          reconnection
            ? this.$service.searchByPageSysRec
            : this.$service.searchByPageSys,
          request
        )
        .then(res => {
          if (res.code == 200) {
            this.spliceOrderMes([0]);
            this.SetOrderMes(res.data.records);
            if (firstGet && this.leftOrderMes.length > 0) {
              this.setChatRoomTitleBox(this.leftOrderMes[0]);
              this.changeChatRoom(res.data.records[0]);
              this.serviceId = res.data.records[0].serviceId;
            }

            if (res.data.total <= this.pageSize) {
              this.noMoreData = true;
            }
          }
          this.busy = false;
        });
    },
  
    //聊天框切换聊天室
    changeChatRoom(val) {
      let {id:idx, leftTime, ifRevoke, palletId, lastReply, pod, ifWS} = val
      this.$refs.chatInput.getFile = false;
      //取消页面闪动定时器
        clearInterval(window.titleTimer);
        document.title = "接待会话";
      palletId ? (this.palletId = palletId) : (this.palletId = "");
      lastReply ? (this.lastReply = lastReply) : (this.lastReply = "");
      pod ? (this.palletPod = pod) : (this.palletPod = "");
      this.cwoId = idx;
      if (ifRevoke) {
        this.chatRevoke = true;
      } else {
        this.chatRevoke = false;
      }
      this.leftOrderMes.forEach(item => {
        if (item.id == idx) {
          item.customerUnreadCount = 0;
          item.serviceUnreadCount = 0;
        }
      });
      this.getChatMessage(idx);
      if (!ifWS) {
        this.getCurrentChatDraft(idx);
      }
    },
   
    async getCurrentChatDraft(chatId) {
      let editor = document.getElementById('editor')
      editor.innerHTML = "";
      const currentChatDraft = await this.$chat.getChatDraftById(chatId);
      if (currentChatDraft) {
        const { nodes, msgs, files } = currentChatDraft;
        nodes.forEach(item => {
          if (item.indexOf("<img") === 0) {
            const div = document.createElement("div");
            div.innerHTML = item;
            const img = div.childNodes[0];
            img.src = img.dataset.src;
            editor.innerHTML += img.outerHTML;
          } else {
            editor.innerHTML += item;
          }
        });
        this.msgList = [...msgs];
        const { fileUrl, fileName, fileSize, getFile } = files[0];
        this.fileUrl = fileUrl;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.$refs.chatInput.getFile = getFile;
        if (nodes.length > 0) {
          this.$refs.chatInput.showPlacehoder = false;
        }
      }
    }
  },

  watch: {
   
  },
  computed: {
    ...mapState({
      leftOrderMes:state=>state.chatRoom.leftOrderMes,
      targetChatContent:state=>state.chatRoom.targetChatContent,
      quickAllLanguage:state=>state.chatRoom.quickAllLanguage,
      activeIndex:state=>state.chatRoom.activeIndex,
      chatRoomTitleBox:state=>state.chatRoom.chatRoomTitleBox,
      chatMessageExtra:state=>state.chatRoom.chatMessageExtra,
    }),
  },
  destroyed() {
    this.$notify.closeAll();
  }
};
</script>

<style scoped lang="less">
/deep/.el-input {
  input::-webkit-input-placeholder{
    color:#222;
    font-size:15px;
  }
}
/deep/.el-badge{
  .el-badge__content{
    width: 23px;
    height: 23px;
  }
  .el-badge__content.is-fixed{
    top: 5px;
    right: 25px;
  }
}
.chatList {
  /deep/.el-input__inner {
    border-radius: 10px !important;
  }
}
::-webkit-scrollbar {
  width: 8px;
  height: 6px;
  background-color: #f5f5f5;
}
::-webkit-scrollbar-thumb:vertical {
  height: 12px;
  -webkit-border-radius: 6px;
}


.chat {
  width: calc(100vw - 140px);
  max-width: calc(100vw - 140px);
  .chatBox {
    // border: 1px solid #fff;
    display: flex;
    .boxMiddle {
      width: 65%;
    }
    .boxLeft {
      width: 19%;
      max-width: 19%;
      border: 1px solid #dcdfe6;
      font-size: 14px;
      // margin-right: 4px;
      height: 100vh;
      box-sizing: border-box;
      max-height: 100vh;
      // overflow-y: auto;
      .vocationTab {
        text-align: center;
        height: 20px;
        background-color: #4996ef;
        color: #fff;
        line-height: 20px;
      }
      .boxSearchBox {
        display: flex;
        align-items: center;
        position: relative;
        height: 50px;
        .searchBoxContent {
          position: absolute;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          bottom: -54px;
          background-color: #fff;
          border-bottom: 1px solid #99a8b454;
          width: 100%;
          padding: 8px 0;
          cursor: pointer;
        }
      }
      .searchButton {
        min-width: 74px;
        cursor: pointer;
        margin-right: 10px;
        border-radius: 5px;
        font-size: 12px;
        padding: 6px 0;
        color: #fff;
        background-color: rgb(92, 184, 92);
      }
      .orderMes {
        background-color: #fff;
        border-bottom: 1px solid #f4f9fe;
        cursor: default;

        &:hover {
          background-color: #f3f3f3;
        }
        .mesBox {
          display: flex;
          overflow: hidden;
          .toTopIcon{
                width: 35px;
                height: 35px;
                position: absolute;
          }
           .headerImg {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              margin-right: 12px;
              color:white;
              background-color: #0038a7;
              font-size: 14px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              .headerArea{
                color:#F59A23;
                font-size: 12px;
                margin-top: 10px;
              }
            }
          .mesWord {
            flex: 3;
            font-size: 16px;
            color: #6a7681;
            padding-bottom: 5px;
            position: relative;
            overflow: hidden;
            .timeLeft {
              width: 76px;
              height: 20px;
              color: #fff;
              font-size: 12px;
              background: #007af6;
              border-radius: 12px;
              position: absolute;
              top: 5px;
              right: 0px;
              display: flex;
              align-items: center;
              justify-content: center;
              .timeImg {
                width: 15px;
                height: 15px;
              }
            }
            div {
              &:nth-child(2) {
                margin-top: 15px;
                font-size: 12px;
              }
              &:nth-child(3) {
                margin-top: 5px;
                line-height: 18px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
              &:nth-child(4) {
                color: #333;
                margin-top: 12px;
                max-width: 160px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              &:nth-child(5) {
                text-align: right;
                margin-right: 5px;
                color: #999;
                font-size: 14px;
              }
            }
          }
        }
      }
      .title {
        display: inline-block;
        width: 80px;
        text-align: left;
        margin-bottom: 8px;
        span {
          display: inline-block;
        }
      }
      .memberList {
        width: 100px;
        text-align: left;
        display: inline-block;
        span {
          font-size: 12px;
        }
      }
    }
  }
}
/deep/.el-dialog {
  width: 500px;
}
.el-input {
  .el-input__inner {
    // border-radius: 10px !important;
  }
  .el-input__suffix {
    .el-input__suffix-inner {
      .el-icon-search {
        &::before {
          position: absolute;
          right: 5px;
          top: 10px;
          font-size: 20px;
        }
      }
    }
  }
}

/deep/.el-table {
  tr {
    &:first-child {
      td {
        border-top: 1px solid #f3f3f3;
      }
    }
  }
  td {
    border-right: 1px solid #f3f3f3;
    border-bottom: 1px solid #f3f3f3;
    &:first-child {
      border-left: 1px solid #f3f3f3;
    }
  }
}
.el-button--primary:not(.is-disabled) {
  background-color: #5c96ff !important;
  border-color: #5c96ff !important;
}
</style>
