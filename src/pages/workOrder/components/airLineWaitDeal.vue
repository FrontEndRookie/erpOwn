<template>
  <div class="content-wrapper">
    <div class="content">
      <div v-if="showPage" style="display:flex;overflow-x:hidden;">
      <div v-for="(item,index) in titleNo" :key="index" style="margin-left:-50px">
          <chatRoom style="transform:scale(0.8)" :extraData="extraData[index]" :isTop="isTop[index]" @closeChatRoom="getNewData" :moreChat="true" :fromPageType="2" @getNewData="getNewData" :workOrderId="workOrderId[index]" :titleNo="titleNo[index]" :contentMessage.sync="contentMessage[index]" :workOrderType="workOrderType[index]"></chatRoom>
      </div>
      </div>
    </div>
    <el-pagination
    style="margin-top:-25px"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[3]"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
  </div>
</template>
<script>
  import chatRoom from './chatRoom'
export default {
  props:{
    pageRoleId:{
      type:Number,
      default:0
    },
    total:{
      type:Number,
      default:0
    }
  },
  components:{
      chatRoom
  },
  data() {
    return {
      pageNum:1,
      pageSize:3,
      isTop:[],
      showPage:false,
        //聊天室
        //标题
        titleNo:[],
        //聊天成员及内容
        contentMessage:[],
        //询单或实单
        workOrderType:[],
        workOrderId:[],
        extraData:[],
        dataInterval:'',
    }
  },
  mounted() {
    this.getTotalData()
    this.dataInterval = setInterval(()=>{this.getTotalData()},180000)
  },
  methods: {
    getNewData(val,ifTransfer){
      if(ifTransfer){
        this.$parent.getBoxCount()
      }
      this.getTotalData()
    },
    getTotalData(){
         this.$http.get(this.$service.getChatBoxs+`?pageSize=3&pageNum=${this.pageNum}`).then(res=>{
        if(res.code==200){
          let request = res.data
          this.titleNo = []
          request && request.forEach((item,index)=>{
            this.isTop[index] = request[index].isTop==0?false:true
            this.titleNo[index]=Object.keys(request[index].mesList)[0]
              this.contentMessage[index] = {}
                this.$set(this.contentMessage[index],'chatMessage',Object.values(request[index].mesList)[0])  
                  this.contentMessage[index].chatMember =request[index].workOrderMember
                this.workOrderType[index] = request[index].workOrderType
                this.extraData[index] = {title:request[index].title,remark:request[index].remark,size:request[index].size,cargoReadyDate:request[index].cargoReadyDate}

                  this.workOrderId[index] = request[index].workOrderId
                  this.showPage=true
                  this.$forceUpdate()
                  // this.$parent.getBoxCount()
          })
        }
        else{this.$message.error(res.message)}
        })
    },
    handleCurrentChange(val){
      this.pageNum = val
      this.getTotalData()
    }
  },
  beforeDestroy() {
    clearInterval(this.dataInterval)
  },
};
</script>
<style scoped lang="less">

     
.content-wrapper {
    width: 100%;
    box-sizing: border-box;
    /*height: 100%;*/
    padding: 20px;
    overflow: hidden;
    background-color: #FFF!important;
}
.content {
  background: #fff;
  margin: -50px 20px 0 20px;
}




</style>


