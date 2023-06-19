<template>
  <div class="content-wrapper">
    <div class="content">
      <div class="pageTitle">
        <div style="position:absolute;left:0px;border-left:1px solid gray;width:6px;height:40px;border-left:3px solid gray"></div>
        <div class='titleLeft'>
          <div class="leftPartTwo" @click="changePage(0)" :class="titleActive==0?'active':''">待我处理({{boxCount}})</div>

          <div class="leftPartOne" @click="changePage(1)" :class="titleActive==1?'active':''"> 工单列表 </div>
            <el-select size="mini" v-model="pageType" :disabled="titleActive!=1 || ifDetail" style="width:100px;margin-left:5px;transform:translateY(-5px)">
              <el-option
                v-for="item in pageTypeChoice"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          <div class="leftPartTwo" @click="changePage(2)" :class="titleActive==2?'active':''">我的发布</div>
        </div>
        <div class="titleRight">
           <el-button @click="airlineIssue" size="mini" type="primary" style="border:1px solid rgb(245,154,35)!important; backgroundColor:rgb(245,154,35)!important" v-auth="['402004_B']">航线发布</el-button>
        </div>
          
      </div>
      <keep-alive v-if="needKeepAlive">
        <Table @jumpToDetail="jumpToDetail" v-if="pageShow == 'table'&& !ifDetail"  :versionType="pageType"></Table>
      </keep-alive>
      <template v-if="!needKeepAlive">
          <Table  @jumpToDetail="jumpToDetail" v-if="pageShow == 'table'&& !ifDetail"  :versionType="pageType"></Table>
      </template>

      <div v-if="pageShow == 'table'&& ifDetail">
        <span @click="returnTablePage" style="margin-left:20px;color:rgb(18, 183, 245);fontSize:17px;cursor:pointer"> 
          <img style="width:35px;height:35px" src="../../assets/orderRevert.svg" alt="">
          返回列表</span>
        <div style="display:flex;justifyContent:center;margin-top:20px;padding-bottom:20px">
           <chatRoom :biggerChat="true" :extraData="extraData" @closeChatRoom="ifDetail=false" :fromPageType="2" @getNewData="getNewData" :workOrderId="workOrderId" :titleNo="titleNo" :contentMessage.sync="contentMessage" :workOrderType="workOrderType"></chatRoom>
        </div>
       
      </div>
      <waitDeal :total="boxCount" v-if="pageShow == 'deal'"  ref="waitDeal"> </waitDeal>
      <issue ref="airlineIssue" v-if="pageShow == 'issue'"></issue>
    </div>
    <el-dialog 
      width="620px"
      :visible.sync="airIssueShow"
      title="航线发布"
    >
      <el-form style="padding:10px 0">
        <el-form-item label="有效时间至">
          <el-date-picker
            v-model="airIssue.effectiveTime"
            type="datetime"
            :picker-options="pickerBeginOption"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="航线内容">
          <el-input
            type="textarea"
            :rows="2"
            style="width:420px;margin-left:15px"
            placeholder="请输入航线内容"
            v-model="airIssue.content">
          </el-input>
        </el-form-item>
      </el-form>
         <!-- 底部按钮 -->
                <div slot="footer" class="dialog-footer">
                    <div style="text-align: center">
                      <el-button style="width:100px" size="medium" @click="workOrderDial = false">取消</el-button>
                      <el-button @click="issueConfirm" style="margin-left:150px;width:100px" size="medium" type="primary">提交</el-button>
                    </div>
                </div>
    </el-dialog>
  </div>
</template>

<script>
  import Table from "./components/airLineWorkTable";
  import chatRoom from './components/chatRoom'
  import waitDeal from "./components/airLineWaitDeal";
  import issue from './components/airlineIssue.vue'
  export default {
    components:{  
      Table,
      waitDeal,
      issue,
      chatRoom
    },
    data() {
      return {
        needKeepAlive:true,//是否需要keepAlive
        pageTypeChoice:[{label:'简单版',value:0},{label:'智能版',value:1}],
        pageType:0,
        titleActive:1,
        airIssueShow:false,
        airIssue:{effectiveTime:'',content:''},
        //旧
        pageRoleName:"",
        pageRoleId:"",
        workNumber:"",
        pageShow:"table",
        ifDetail:false,
         //聊天室
        //标题
        titleNo:'',
        //聊天成员及内容
        contentMessage:{},
        //询单或实单
        workOrderType:-1,
        workOrderId:'',
        boxCount:'',
        extraData:{},
         pickerBeginOption: {
          disabledDate: (time) => {
            return time.getTime() < Date.now()-1 * 24 * 60 * 60 * 1000
          }
  }
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
      this.getBoxCount()
    },
    mounted() {
      // //页面左上角人名、id
      // this.pageRoleName = JSON.parse(sessionStorage.getItem("userInfo")).name
      // this.pageRoleId = JSON.parse(sessionStorage.getItem("userInfo")).id
      // this.getPageRight()
    },
    methods: {
      //返回列表
      returnTablePage(){
        this.ifDetail = false
      },

      getBoxCount(){
        this.$http.get(this.$service.getBoxCount).then(res=>{
          if(res.code==200){
            this.boxCount = res.data
          }
          else{this.$message.error(res.message)}
        })
      },
      getNewData(val,ifTransfer){
        if(ifTransfer){
          this.ifDetail = false
          return
        }
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
      airlineIssue(){
        this.airIssue = {effectiveTime:'',content:''}
        this.airIssueShow = true
      },
     issueConfirm(){
       if(Object.values(this.airIssue).some(item=>!item)){
         return this.$message.warning("请输入全部信息后操作")
       }
       
        this.$http.post(this.$service.airlinePublish,this.airIssue).then(res=>{
          if(res.code==200){
            this.$message.success("航线发布成功")
            this.airIssueShow = false
            if(this.pageShow == 'issue'){
              this.$refs.airlineIssue.initData()
            }
          }else{
            this.$message.error(res.message)
          }
        })
     },
      changePage(val){
        this.titleActive = val
        if(val==0){
          this.pageShow = 'deal'
        }else if(val==1){
          this.pageShow = 'table'
        }else {
          this.pageShow = "issue"
        }
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
        pageShow(nv,ov){
          if(ov!="table" && nv == "table"){
            this.needKeepAlive = true
          } else {
            this.needKeepAlive = false
          }
        }
    },
    beforeDestroy() {
    },
  }
</script>

<style scoped lang="less">
  @import url("../../assets/icon/iconfont.css");
/deep/.el-dialog__footer{
  padding:0 20px 15px
}
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
       .pageTitle{
         cursor: text;
        display:flex;
        justify-content: space-between;
        align-items:center ;
        background: #f2f2f2;
        padding:25px 0 20px 0;
        position:relative;
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
            position: relative;
            margin-left: 15px;
            cursor: pointer;
          }
          .leftPartTwo{
            margin-left: 15px;
            cursor: pointer;
          }
        }
        .titleRight{
          margin-right: 15px;
        }
      }
      
      
      .content-search-normal {
        padding-top:10px;
        text-align: left;
      }
    }
  }

  
</style>
