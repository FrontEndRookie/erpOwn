<template>
    <div class="historySearch">
        <div class="historySearchBox">
            <div class="searchArea">
                <div class="closeSearch" @click="closeSearchHis">X</div>
                <!-- <i class="el-icon-zoom-in" style="font-size:20px"></i> -->
                <img src="@/assets/inquiry/inquirySearch.png" style="width:25px;height:25px;transform: translateY(2px);" alt="">
                <el-input size="mini" v-model="searchKeyWords" style="margin-left:10px" class="searchAreaInput" maxlength="500"></el-input>
                <span class="cClear" @click="searchKeyWords='';resultChatBox=[];resultChatContentBox=[];noneKeyWord=true" :style="{visibility:searchKeyWords?'visible':'hidden'}">清除</span>
                <el-button type="primary" size="mini" style="margin-left:-10px" @click="searchResult">搜索</el-button>
            </div>
            <div class="searchResult">
                <template v-if="resultChatBox.length != 0">
                    <div class="resultChat" infinite-scroll-disabled="busy" v-infinite-scroll="loadMoreData" infinite-scroll-throttle-delay="600" infinite-scroll-distance="20">
                        <div v-for="(item,index) in resultChatBox" :key="index" class="orderMes" @click="changeChatRoom(item);chatRoomTitleBox=item"  :style="{ backgroundColor: currentIndex == item.id ? '#E3EEF9' : ''}">
                            <div class="mesBox" style="position:relative">
                               
                               <div
                                class="headerImg"
                              >  <span>{{item.pod}}</span>
                                  <div class="headerArea">{{item.startArea}}</div>
                                </div>
                                <div class="mesWord" >
                                <div>{{ item.customerName }} </div>
                                <div>{{ JSON.parse(item.value)[0] && JSON.parse(item.value)[0].src }}</div>
                            </div>
                            </div>
                            </div>
                </div>
                    <div class="resultChatContent">
                        <div class="resultStatics">{{this.resultChatContentBox.length}}条与
                            <span :title="this.resultChatContentBox[0] && this.resultChatContentBox[0].mesSearchValue" style="display:inline-block;max-width: 200px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">'{{searchKeyWordsCopy}}'</span>
                            相关的聊天记录</div>
                        <div class="resultMessage" v-for="(item,index) in resultChatContentBox" :key="index"  @click="showDetailChat(item)">
                            <div style="display:flex;width: 100%;" >
                                <!-- <img v-if="item.status == 1 || item.status == 2" src="@/assets/inquiry/defaultHeader.png" alt=""> -->
                                <div v-if="item.status == 1 || item.status == 2" class="headerImg">{{chatRoomUtil.headerNameShow(chatRoomTitleBox)}}</div>
                                <img v-if="item.status == 3" src="@/assets/inquiry/header.png" alt="">
                                <img v-if="item.status == 6" src="@/assets/inquiry/header.png" alt="">
                                <img v-if="item.status == 9" src="@/assets/inquiry/header.png" alt="">
                                <div style="width:100%">
                                    <div style="display:flex;justify-content: space-between;">
                                        <div>{{item.sysSendName}}<span style="color:#e6a23c">{{item.userLabel}}</span></div> 
                                        <div>{{item.createTime}}</div>
                                    </div>
                                    <div style="margin-top:10px" >
                                        <template v-for="(items,indexs) in item.content" >
                                          <span v-if="items.type == 'text'" v-html="items.src" :key="indexs" style="word-break:break-word;"></span>
                                          <viewer v-if="items.type == 'image'" :images="items.src" :key="indexs"> 
                                            <img :src="items.src" />
                                          </viewer>
                                        </template>
                                    </div>
                                </div>
                            </div>
                            <i class="el-icon-warning" style="font-size:20px;position:absolute;right:-20px;top:20px" @click="showDetailChat(item)"></i>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="noneResult" v-if="getResultData">
                        {{noneKeyWord?'输入关键字搜索':'没有找到相关结果'}}
                    </div>
                </template>
            </div>
        </div>  
        <div class="targetSingleChat" id="targetSingleChat" :style="{visibility:detailChat?'visible':'hidden'}" >
       <div class="boxMiddle" v-if="detailChat">
        <div class="chatContent" id="chatContent">
          <div class="chatCTitle">
            <div class="titleLeft">
             
                <div class="headerImg">{{chatRoomUtil.headerNameShow(chatRoomTitleBox)}}</div>
                <div style="margin-left:5px">
                  <!-- <div style="min-height:28px">{{chatMessageExtra.certificationBody?chatMessageExtra.certificationBody:'未认证'}}</div> -->
                  <div>{{ chatRoomTitleBox.customerName }} {{chatRoomTitleBox.userLabel?`(${chatRoomTitleBox.userLabel})`:''}}</div>
                </div>
            </div>
          </div>
          <div id="singleChat">
          <div
            class="contentWord"
            v-for="(item, index) in chatRoomContent"
            :key="index"
            style="position: relative"
          >
            <!-- 文件 -->
            <div v-if="item.fileUrl" >
              <div style="display: flex" :style="{'justify-content':(item.status==3||item.status==9)?'flex-end':''}">
                
                <div v-if="item.status == 1 || item.status == 2" class="headerImg">
                  {{chatRoomUtil.headerNameShow(chatRoomTitleBox)}}
                </div>
                <div>
                  <div style="color: #333333; font-size: 13px" :style="{'text-align':(item.status==3||item.status==9)?'right':''}">
                     {{ (item.status==3||item.status==9) ? (item.sysSendName?item.sysSendName:"飞啊网") : "" }}
                    <span style="color: #999; font-size: 12px" :style="{'margin-left':(item.status==3||item.status==9)?'5px':''}">{{
                      item.createTime
                    }}</span>
                  </div>
                  <div
                style="
                  display: inline-block;
                  margin-top: 10px;
                  margin-bottom: 20px;
                  border: 1px solid silver;
                  border-radius: 5px;
                "
              >
                <div style="display: flex">
                  <img
                    style="width: 60px; height: 60px"
                    :src="chatFileShow(item.fileUrl)"
                    alt=""
                  />
                  <div>
                    <div
                      style="
                        margin-top: 10px;
                        font-size: 14px;
                        padding-right: 5px;
                      "
                    >
                      {{ item.fileName }}
                    </div>
                    <div style="margin-top: 20px">{{ item.fileSize }}</div>
                  </div>
                </div>
                <hr />
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    padding: 5px;
                  "
                >
                  <span
                    style="font-size: 12px; color: #7ec6ec; cursor: pointer"
                    @click="
                      $utils.downloadFile({
                        url: item.fileUrl,
                        name: item.fileName,
                      })
                    "
                    >下载</span
                  >
                  <span
                    style="font-size: 12px; cursor: pointer"
                    @click="$utils.previewOffice({xpath:item.fileUrl})"
                    >预览</span
                  >
                </div>
              </div>
                  </div>
                <img v-if="(item.status==3||item.status==9)" src="@/assets/inquiry/header.png" alt="" style="width: 50px; height: 50px; margin-left: 12px">
              </div>
                </div>
              
            <!-- 系统消息 -->
            <div
              v-else-if="item.content && (item.status == 4 || item.status == 5 || item.status == 7 || item.status == 8)"
              class="systemWord"
            >
              <div
                style="flex: 0 0 100px; border-bottom: 2px solid #e3e7e7;margin-right:12px"
              ></div>
                    {{(item.status == 7 || item.status == 8) ? item.createTime :''}} {{ item.content[0].src }}
              <div
                style="flex: 0 0 100px; border-bottom: 2px solid #e3e7e7;margin-left:12px"
              ></div>
            </div>
            <div v-else>
              <div style="display: flex" :style="{'justify-content':(item.status==3||item.status==9)?'flex-end':''}">
              
                 <div v-if="item.status == 1 || item.status == 2" class="headerImg">
                  {{chatRoomUtil.headerNameShow(chatRoomTitleBox)}}
                </div>
                  <img
                  v-if="item.status ==6"
                  src="@/assets/inquiry/header.png"
                  alt=""
                  style="width: 50px; height: 50px; margin-right: 12px"
                />
                <div >
                  <div style="color: #333333; font-size: 13px" :style="{'text-align':(item.status==3||item.status==9)?'right':'',color:item.status == 6?'#df2f45':''}">
                     {{ (item.status==3||item.status==9) ? (item.sysSendName?item.sysSendName:"飞啊网") : "" }}
                    <span style="color: #999; font-size: 12px" :style="{'margin-left':(item.status==3||item.status==9)?'5px':'',color:item.status == 6?'#df2f45':''}">
                      <span style="margin-right:3px;font-size:15px">{{item.status == 6 ? item.fileName :''}} {{item.status == 6 ? '('+item.agentUserAccount+')' :''}}</span> 
                      {{
                      item.createTime
                    }}</span>
                  </div>
                  <div
                    :id="item.id"
                    class="sendWord"
                    :style="{backgroundColor:(item.status==3||item.status==9)?'#cce2ff':'',color:(item.status==3||item.status==9)?'#666':''}"
                    style="position: relative; word-break: break-word"
                  >
                    <div style="display:inline-block;line-height:24px" v-for="(items,indexs) in item.content" :key="indexs">
                  <viewer :images="items.src" v-if="items.type=='image'"> 
                       <img v-if="items.type=='image'" :src="items.src" alt="" style="max-width:200px;max-height:200px" >
                  </viewer>
                      <span v-else-if="item.status==6" v-html="'报价：'+items.src" style="white-space:pre-wrap;color:#df2f45" ></span>
                      
                      <span v-else v-html="items.src" style="white-space:pre-wrap" :style="{color:item.status == 6?'#df2f45':''}"></span>
                    </div>
                    <div
                      v-if="item.status==1 || item.status==2 || item.status==6"
                      style="
                        position: absolute;
                        top: 5px;
                        border: 1px solid #000;
                        height: 0;
                        width: 0;
                        border-left: 6px solid rgba(0, 0, 0, 0);
                        border-right: 6px solid #fff;
                        border-top: 6px solid rgba(0, 0, 0, 0);
                        border-bottom: 6px solid rgba(0, 0, 0, 0);
                        left: -12px;
                      "
                      class="contentArrow"
                    ></div>
                    <div
                      v-if="(item.status==3||item.status==9)"
                      style="
                        position: absolute;
                        top: 5px;
                        border: 1px solid #000;
                        height: 0;
                        width: 0;
                        border-left: 6px solid #cce2ff;
                        border-right: 6px solid rgba(0, 0, 0, 0);
                        border-top: 6px solid rgba(0, 0, 0, 0);
                        border-bottom: 6px solid rgba(0, 0, 0, 0);
                        right: -12px;
                      "
                      class="contentArrow"
                    ></div>
                  </div>
                </div>
                <img v-if="(item.status==3||item.status==9)" src="@/assets/inquiry/header.png" alt="" style="width: 50px; height: 50px; margin-left: 12px">
              </div>
            </div>
          </div>
        </div>
        </div>
       
      </div>
      <el-button type="primary" @click="getSingleChat" style="position:absolute;left:50%;transform: translateX(-50%);bottom:3px" size="mini" v-if="detailChat">进入聊天</el-button>
   
        </div>
    </div>
</template>
<script>
  import { Loading } from 'element-ui';
  import chatRoomUtil from '@/util/chatRoom.js'

    export default{
        props:['chatList'],
        created(){
            this.searchKeyWords = this.chatList
            this.searchKeyWordsCopy = this.chatList
            if(!this.chatList){
                this.noneKeyWord = true
                this.getResultData = true
            }
        },
        data(){
            return{
              chatRoomUtil,
              busy:false,
              getResultData:false,
                noneKeyWord:false, //首次进入无关键字
                searchKeyWords:'',//搜索数据
                searchKeyWordsCopy:'',//搜索数据备份
                resultChatData:[],
                detailChat:false,//指定聊天室
                resultChatBox:[],//搜索结果-聊天框
                resultChatContentBox:[],//搜索结果-聊天框内容
                currentIndex:'',//当前显示聊天框内容id
                pageSize:10,
                noMoreData:false,
                chatRoomContent:'',//简易聊天室内容
                chatMessageExtra:'',//简易聊天室顶部
                chatRoomTitleBox:'',//简易聊天室顶部
                lastChatId:''
            }
        },
        mounted(){
            
            document.addEventListener("click", (e) => clickOutSide(e));
            //判断点击元素外部时关闭弹框
                const clickOutSide = (e) => {
                let box = document.getElementById("targetSingleChat");
                let canvas = document.getElementsByClassName('viewer-container') && document.getElementsByClassName('viewer-container') [0]
                let msgbox = document.getElementsByClassName('el-message-box') && document.getElementsByClassName('el-message-box') [0]
                let resultBox = document.getElementsByClassName('resultMessage')
                // 判断鼠标点击到触发按钮和弹出框外的区域
                if (box && !box.contains(e.target)) {
                    if(canvas && canvas.contains(e.target)) {
                        return 
                    }
                     if(msgbox && msgbox.contains(e.target)) {
                        return 
                    }
                    if(e.target.className != "el-icon-warning" ) {
                      if(resultBox) {
                        for(let i of resultBox){
                          if(i.contains(e.target)){
                            return
                          }
                        }
                      }
                        this.detailChat=false; 
                    }
                    // this.detailChat=false;
                }
            };
            if(this.searchKeyWords){
                this.getMesData(this.chatList)
            }
            // setTimeout(() => {
            //     let dom = document.querySelectorAll('.resultChat')
            // dom[0] && dom[0].addEventListener('scroll',(val)=>{
            //     if(!this.noMoreData) {
            //         if(Math.ceil(dom[0].scrollTop)+dom[0].clientHeight >= dom[0].scrollHeight){
            //             this.pageSize += 10
            //             this.getMesData(this.searchKeyWordsCopy,true)
            //         }
            //     }
                
            // })
            // }, 1000);
         
        },
        methods:{
         
          loadMoreData(){
            this.busy = true
            if(!this.noMoreData) {
                    this.pageSize += 10
                    this.getMesData(this.searchKeyWordsCopy,true)
                }
          },
            //进入单独聊天室
            getSingleChat(){
              let chatNum 
                if(document.getElementsByClassName("activeBTitle")[0] && document.getElementsByClassName("activeBTitle")[0].innerHTML){
                  let targetRoom = document.getElementsByClassName("activeBTitle")[0].innerHTML
                  targetRoom.includes("客服")? (chatNum=2):(chatNum=1)
                }
                if(this.chatMessageExtra.chatUserFlag == chatNum){
                    this.$emit('goSameChat',this.lastCwoId)
                }else {
                    this.$emit("goSingleChat",{id:this.lastCwoId,chatUserFlag:this.chatMessageExtra.chatUserFlag})
                }
                this.$parent.historyDial = false
            },
              //聊天室消息显示文件图标
            chatFileShow(fileType) {
            if (fileType.includes("xls") || fileType.includes("xlsx")) {
                return require("@/assets/inquiry/excelIcon.svg");
            } else if (fileType.includes("docx") || fileType.includes("doc")) {
                return require("@/assets/inquiry/wordIcon.svg");
            } else if (fileType.includes("pdf")) {
                return require("@/assets/inquiry/pdfIcon.svg");
            }
            },
            //点击左侧聊天框
            changeChatRoom(data){
                let request = {
                    "cwoId": data.id, //询单ID 一级菜单内搜索出来的ID字段
                    "endTime": "", //timeType为4时   自定义结束时间
                    "mesType": 0, //消息类型 0:全部 1:新建询单 2:客户再询 3:航线回复 6:供应商报价信息 9:客服回复
                    "startTime": "", //timeType为4时 自定义选取的开始时间
                    "timeType": 0, //选取的时间范围类型 0:全部 1:今天 2:本周 3:本月 4:自定义
                    "value": this.searchKeyWordsCopy //关键字
                }
                this.$http.post(this.$service.searchCwoFlow,request).then(res=>{
                    if(res.code == 200){
                        this.detailChat = false
                        this.currentIndex = data.id
                        this.resultChatContentBox = res.data
                        this.resultChatContentBox.forEach((item,index)=>{item.content = JSON.parse(item.content)})
                    }
                 
                })
            },
            searchResult(){
                if(!this.searchKeyWords) {
                  return this.$message.warning("当前输入值为空，请输入后搜索")
                }
                let subStr=/[0-9a-zA-Z\u4e00-\u9fa5]+/
                if(!subStr.test(this.searchKeyWords)){
                  return this.$message.warning("当前输入值全为标点符号，请重新输入")
                }
                this.getMesData(false)
            },
            //获取左侧聊天框数据
            getMesData(val,ifSeletMore){
              let loadingInstance = Loading.service({ fullscreen: true, text: '加载中', });
              this.getResultData = false
                this.noneKeyWord = false
                this.searchKeyWordsCopy = this.searchKeyWords
                let request = {
                    mesType:0,
                    timeType:0,
                    pageSize: this.pageSize,
                    pageNum: 1
                }
                val?(request.value=val):(request.value=this.searchKeyWordsCopy)
                this.$http.post(this.$service.searchCwoMenu,request).then(res=>{
                  this.getResultData = true
                  this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    setTimeout(()=>{
                      loadingInstance.close();
                    },500)
                  });
                    if(res.code==200){
                        this.resultChatBox = (res.data && res.data.records) ? res.data.records : []
                        //搜索或首次进入打开第一个聊天框
                        if(!ifSeletMore){
                            this.noMoreData = false
                            this.changeChatRoom(this.resultChatBox[0])
                            this.chatRoomTitleBox = this.resultChatBox[0]
                        } else{
                             //滑动到底后搜索更多数据
                            if(this.pageSize == this.resultChatBox.length){
                            }else {
                                this.noMoreData = true
                            }
                        }
                       }
                  
                        this.busy = false
                    })
                    .catch(() => {})
            },
            //关闭聊天记录查找
            closeSearchHis(){
                this.$emit("close")
            },
            //打开指定聊天室
            showDetailChat(val){
                // if(val.id != this.lastChatId){
                //     this.detailChat = false
                // }
                this.getChatMessage(val)
            },
            async onAllImgLoaded(root) {
                const imgNodes = root instanceof HTMLImageElement ? [root] : root.querySelectorAll('img'); 
                let imgArr = Array.prototype.slice.call(imgNodes);   
                    return await Promise.all( imgArr.map(img=> {new Promise(resolve=>{
                         img.addEventListener('load',()=> resolve(img))                             
                       })                       
                    })                    
                    ) 
                },
            getChatMessage(val) {
                this.$http.get(this.$service.getCwoBox + val.cwoId).then((res) => {
                    if (res.code == 200) {
                        this.lastCwoId = val.cwoId
                        if(document.getElementById(this.lastChatId)){
                            document.getElementById(this.lastChatId).style.backgroundColor = this.lastChatBackground 
                            for(var item of document.getElementById(this.lastChatId).childNodes){
                                if(item.className == 'contentArrow'){
                                    item.style.borderColor = this.lastChatColor
                                }
                            }
                        }
                        this.chatMessageExtra = {chatName:res.data.chatName,sqName:res.data.sqName,certificationBody:res.data.certificationBody,chatUserFlag:res.data.chatUserFlag}
                        this.chatRoomContent = res.data.cwoFlowVOS;
                        this.chatRoomContent.forEach((item) => {
                            item.content = JSON.parse(item.content);
                        });
                        this.detailChat = true
                        this.$nextTick(()=>{
                        let arrow = ''
                        this.lastChatBackground = document.getElementById(val.id) && document.getElementById(val.id).style.backgroundColor
                        for(var item of document.getElementById(val.id).childNodes){
                                if(item.className == 'contentArrow'){
                                    arrow = item
                                    this.lastChatId = val.id
                                    this.lastChatColor = arrow.style.borderColor
                                }
                        }
                        
                        let cssArray = arrow.style.borderColor.split(")")
                        cssArray.splice(-1)
                        for(let index in cssArray){
                            cssArray[index] += ")"
                            if(!cssArray[index].includes('rgba') ){
                                cssArray[index]='#f59a23'
                            }
                        }
                        arrow.style.borderColor = cssArray.join(" ")
                        document.getElementById(val.id).style.backgroundColor = '#f59a23'
                        this.onAllImgLoaded(document.getElementById("singleChat")).then((datas)=>{
                          setTimeout(() => {
                            var id = val.id;
                            document.getElementById(id).scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }, 50);
                        })
                    })
                    } 
                });
                },
        },
  
        computed:{}
    }
</script>
<style lang="less" scoped>
    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: #f5f5f5;
    }
    .el-icon-warning:before{
        color:#0000001a;
    }
    .historySearch{
        position: fixed;
        z-index:101;
        top:10vh;
        left: calc( 50vw + 50px );
        transform: translateX(-50%);
        display: flex;
        .historySearchBox{
            width:950px;
            border: 1px solid #0000001a;
            background-color: #fff;
            .searchArea{
                position: relative;
                display: flex;
                padding:10px;
                .closeSearch{
                    position: absolute;
                    top:3px;
                    right: 6px;
                    cursor: pointer;
                    font-size: 22px;
                    color:silver;
                }
                .cClear{
                    transform: translateX(-28px);
                    white-space: nowrap;
                    line-height: 30px;
                    color:silver;
                    cursor: pointer;
                }
                .searchAreaInput{
                    width:70%;
                    /deep/.el-input__inner{
                        padding-right: 28px;
                        border-radius: 10px!important;
                    }
                }
            }
            .orderMes {
                background-color: #fff;
                padding:10px 0;
                border-bottom: 1px solid #f4f9fe;
                cursor: default;
            
                &:hover{
                background-color: #f3f3f3;
                }
            }
            .searchResult{
                display: flex;
                height:600px;
                .noneResult{
                    flex: 0 0 100%;
                    align-self: center;
                    text-align: center;
                    font-size: 18px;
                }
                .resultChat{
                    overflow-y: scroll;
                    flex:0 0 30%;
                }
                .resultChatContent{
                    overflow-y: scroll;
                    flex:0 0 70%;
                    background-color: #f3f3f3;
                    box-sizing: border-box;
                    padding-left: 5px;
                    .resultStatics{
                        width: 95%;
                        border-bottom: 1px solid #0000001a;
                        box-sizing: border-box;
                        padding:5px;
                        padding-top:20px ;
                    }
                    .resultMessage{
                        width: 95%;
                        border-bottom: 1px solid #0000001a;
                        box-sizing: border-box;
                        padding:8px;
                        display: flex;
                        justify-content: space-between;
                        position:relative;
                        &:hover{
                          background-color: #e3eef9;
                        }
                        img{
                            width:40px;
                            height: 40px;
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
                    }
                 
                }
            }
        }
        .targetSingleChat{
            position: relative;
            width: 500px;
            border: 1px solid #0000001a;
            border-left:0;
            background-color: #e6e9eb;
        }
    }   
   
    .mesBox {
          display: flex;
          overflow: hidden;
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
            font-size: 14px;
            color: #6a7681;
            padding-bottom: 5px;
            position: relative;
            overflow: hidden;
            margin-left:5px;
         
            div {
              &:nth-child(1) {
                margin-top: 5px;
                font-size: 12px;
              }
              &:nth-child(2) {
                margin-top: 8px;
                line-height: 18px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
         
            }
          }
        }

    .boxMiddle {
      width: 100%;
      .chatContent {
        box-sizing: border-box;
        padding-bottom: 20px;
        border: 1px solid #dcdfe6;
        // margin-bottom: 5px;
        background-color: #f5f8fb;
        // border-radius: 5px;
        height: 650px;
        max-height:650px;
        overflow-y: auto;
        .chatCTitle{
          position:sticky;
          top:0;
          display:flex;
          justify-content: space-between;
          align-items: center;
          border-bottom:1px solid silver;
          margin-bottom: 10px;
          padding: 10px 0;
          background-color: #f5f8fb;
          z-index: 10;
          .titleLeft{
            display:flex;
            margin-left: 10px;
            img{
              width: 40px;
              height:40px;
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
          }
      
        }
        .contentWord {
          padding:0 8px;
          margin-bottom: 5px;
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
          span {
            font-size: 16px;
          }
          .systemWord {
            color: #99a8b4;
            font-size: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .sendWord {
            color: #7f7f7f;
            font-size: 14px;
            margin: 10px 0;
            min-height: 12px;
            max-width: 280px;
            padding: 10px;
            background-color: #fff;
            border-radius: 5px;
            //   word-break: break-all;
            //   webkit-box-shadow: 0px 2px 9px rgb(0 0 0 / .15);
            box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.15);
            &::after {
              position: absolute;
              content: "";
              border-right: 10px solid pink;
            }
          }
        }
      }

    }
</style>