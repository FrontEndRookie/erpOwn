<template>
  <div class="content-wrapper">
    <div class="content">
      <div class="pageTitle" style="position:relative" v-if="!ifDetail">
        <div style="position:absolute;left:0px;border-left:1px solid gray;width:6px;height:40px;border-left:3px solid gray"></div>
         <img v-if="titleActive==0&& !ifDetail && airLineData.length>0" src="../../assets/workOrderBanner.svg" style="width:25px;height:25px;position:absolute;left:18%;transform:translateY(40px)" alt="">
        <div class='titleLeft'>
          <div class="leftPartOne" @click="titleActive=0;ifDetail=false" :class="titleActive==0?'active':''"> 我的询单 </div>
            <el-select size="mini" :disabled="titleActive!=0 || ifDetail" v-model="pageType" style="width:100px;margin-left:5px;transform:translateY(-5px)">
              <el-option
                v-for="item in pageTypeChoice"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          <div class="leftPartTwo"  @click="titleActive=1;getAirLineTotal()" :class="titleActive==1?'active':''">航线动态({{airLineTotal}})
          </div>
        </div>
        <div style="width:30%;transform:translateY(-15px);">
           <scrollNotice 
              v-if="titleActive==0"
              :textArr ="noticeData" 
              :styleObject="{'fontSize':14+'px','color':'#000'}" 
              >
            </scrollNotice>
        </div>
          
      </div>
      <div class="airReport"  v-if="titleActive==0&& !ifDetail">
         <div style="position: relative">
                  <div id="airReportWord">{{bannerContent}}</div>
                </div>
      </div>
      <keep-alive v-if="needKeepAlive">
        <Table @jumpToDetail="jumpToDetail"  v-if="titleActive==0 && !ifDetail" :versionType="pageType"></Table>
      </keep-alive>
      <template v-if="!needKeepAlive">
        <Table @jumpToDetail="jumpToDetail"  v-if="titleActive==0 && !ifDetail" :versionType="pageType"></Table>
      </template>
      <div v-if="titleActive==0 && ifDetail" style="margin-top:-15px">
        <span @click="ifDetail=false" style="margin-left:20px;color:rgb(18, 183, 245);fontSize:17px;cursor:pointer">
          <img style="width:35px;height:35px" src="../../assets/orderRevert.svg" alt="">
          返回列表</span>
        <div style="display:flex;justifyContent:center;padding-bottom:20px">
           <chatRoom :biggerChat="true" :extraData="extraData" @closeChatRoom="ifDetail=false" :fromPageType="1" @getNewData="getNewData" :workOrderId="workOrderId" :titleNo="titleNo" :contentMessage.sync="contentMessage" :workOrderType="workOrderType"></chatRoom>
        </div>
       
      </div>
      <workConfirm v-if="titleActive==1" ></workConfirm>
    </div>
  </div>
</template>

<script>
  import chatRoom from './components/chatRoom'
  import scrollNotice from '@/components/scrollNotice'
  import Table from "./components/serviceWorkTable";
  import workConfirm from "./components/serviceWaitConfirm";
  export default {
    components:{  
      Table,
      workConfirm,
      scrollNotice,
      chatRoom
    },
    data() {
      return {
        needKeepAlive:true,
        ifDetail:false,
        pageTypeChoice:[{label:'简单版',value:0},{label:'智能版',value:1}],
        pageType:0,
        titleActive:0,
        airLineData:[],
        bannerContent:'',
        //滚动公告栏
        noticeTimer:null,//公告定时器
        stopNotice:true,//公告显示一轮重新开始
        noticeData:[],
        pageRoleName:"",
        workNumber:"",
        airLineRollIndex:0,
        airLineRollInterval:'',
        airLineTimer:'',
        extraData:{},
        //聊天室
        //标题
        titleNo:'',
        //聊天成员及内容
        contentMessage:{},
        //询单或实单
        workOrderType:-1,
        workOrderId:'',
        airLineTotal:''
      }
    },
    created(){
      if(this.$route.query.id) {
          this.ifDetail = true
          this.jumpToDetail(this.$route.query.id)
      } else if (this.$route.params.orderId) {
          this.ifDetail = true
          this.jumpToDetail(this.$route.params.orderId)
      } 
    },
    mounted() {
      this.getAilineRoll()
      // 公告定时器 10s请求一次数据
      // this.noticeTimer = setInterval(()=>{this.getRollListData()},10000)
      // this.airLineTimer = setInterval(()=>{this.getAilineRoll()},50000)
      // 滚动公告数据
      this.getRollListData()
      this.getAirLineTotal()
    },
    methods: {
      getAirLineTotal(){
        this.$http.post(this.$service.countAirline4Cst,{
          startCommitTime:'',
          endCommitTime:'',
          content:'',
          creatorId:'',
          effectiveFlag:'',
          dataFlag:''
        }).then(res=>{
        if(res.code==200){
          this.airLineTotal = res.data
        }
        else{this.$message.error(res.message)}
        })
      },
      getNewData(val){
        this.jumpToDetail(val)
      },
      jumpToDetail(id){
        this.$http.get(this.$service.getSingleChatBox+'?workId='+id).then(res=>{
          if(res.code==200){
            this.titleNo=Object.keys(res.data.mesList)[0]
           this.$set(this.contentMessage,'chatMessage',Object.values(res.data.mesList)[0])  
            this.contentMessage.chatMember =res.data.workOrderMember
            this.workOrderType = res.data.workOrderType
            this.workOrderId = res.data.workOrderId
            this.extraData = {title:res.data.title,remark:res.data.remark}
            this.ifDetail = true

          }
          else{
            this.$message.error(res.message)
          }
        })
      },
        //循环播报
        airLineShow(){
          this.airLineRollInterval=setInterval(()=>{
            this.bannerContent=this.airLineData[this.airLineRollIndex]
            this.airLineRollIndex++
            if(this.airLineRollIndex==this.airLineData.length){
              this.airLineRollIndex = 0
            }
          },7000)
        },
     
      getAilineRoll(){
        this.$http.get(this.$service.searchAirlineRol).then(res=>{
          if(res.code==200){
            this.airLineData = res.data
            this.airLineRollIndex=0
             this.bannerContent=this.airLineData[0]
            this.airLineShow()
          }
          else {
            this.$message.error(res.message)
          }
        })
      },
      getRollListData(){
        this.$http.get(this.$service.searchRollList+"?size=20").then(res=>{
          if(res.code==200) {
            this.noticeData = res.data.map(item=>item.msgDesc)
            this.$forceUpdate()
          } else {
            this.$message.error(res.message)
          }
        })
      },
    },
    watch:{
         '$route.query.id'(newValue){
            this.ifDetail = true
            this.jumpToDetail(this.$route.query.id)
        },
         '$route.query.time'(newValue){
            this.ifDetail = true
            this.jumpToDetail(this.$route.params.orderId)
        },
         '$route.params.orderId'(newValue){
            this.ifDetail = true
            this.jumpToDetail(this.$route.params.orderId)
        },
        titleActive(nv,ov){
          if(nv=='0' && ov!=0){
            this.needKeepAlive = true
          }else{
            this.needKeepAlive = false
          }
        }
    },
    beforeDestroy() {
      // clearInterval(this.noticeTimer)
      clearInterval(this.airLineRollInterval)
      // clearInterval(this.airLineTimer)
    },
  }
</script>

<style scoped lang="less">
  @import url("../../assets/icon/iconfont.css");

  .content-wrapper {
    width: 100%;
    box-sizing: border-box;
    height: 100%;
    padding: 20px;
    overflow: hidden;
    background-color: #f3f6f9 !important;
    .content {
      background-color: #fff;
      padding-top:20px;
      .airReport {
        width: 60%;
        text-align: center;
        overflow: hidden;
        margin: 5px auto;
        height: 20px;
        // background-color: pink;
  #airReportWord {
    font-size: 14px;
    white-space: nowrap; /* 文字不折行 */
    position: absolute;
    // left:-100%;
    animation: 7s move infinite linear;
    z-index: 2;
  }
  @keyframes move {
    0% {
      left: 100%;
    }
    100% {
      left: -100%;
    }
  }
}
      .pageTitle{
        cursor: text;
        display:flex;
        justify-content: space-between;
        align-items:center ;
        background: #f2f2f2;
        padding:15px 0 10px 0;
        .titleLeft{
          display: flex;
          color: #12B7F5;
          font-size: 20px;
          font-weight: 700;
          padding-left: 20px;
           .active {
              position: relative;
            }
            
            .active::before {
              position: absolute;
              bottom: 0;
              left: 50%;
              transform: translateX(-50%);
              content: '';
              width: 80px;
              height: 3px;
              border-radius: 5rpx;
              background-color: #12B7F5;
            }
          .leftPartOne{
            cursor: pointer;
            position: relative;
          }
          .leftPartTwo{
            cursor: pointer;
            margin-left: 15px;
          }
        }
      }
      
      .content-search-normal {
        padding-top:10px;
        text-align: left;
      }
    }
  }

  
</style>
