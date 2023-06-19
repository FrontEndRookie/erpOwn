<template>
    <div class="page">
      <el-form class="pageSearch" :inline="true">
        <el-form-item
            label="提交时间"
          >
            <el-date-picker
              style="width: 190px"
              value-format="yyyy-MM-dd"
              v-model="selectResult.createStartTime"
              type="date"
              :picker-options="pickerOptionsStartOne"
              placeholder="起始日期"
            >
            </el-date-picker
            >-
            <el-date-picker
              style="width: 180px"
              value-format="yyyy-MM-dd"
              v-model="selectResult.createEndTime"
              type="date"
              :picker-options="pickerOptionsEndOne"
              placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="休假人">
            <el-select
              v-model="selectResult.askForLeaveId"
              placeholder="请选择休假人"
              filterable
              clearable
              remote
              reserve-keyword
            >
              <el-option
                v-for="item in vocationList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="pageNum=1;searchResult()">搜索</el-button>
          <el-button type="warning" @click="setLeave" v-auth:none="['422003_B']">发起请假分配</el-button>
     </el-form>
     <el-table
        row-key="id"
        :data="vocationTable"
        style="width: 98%;margin:auto">
        <el-table-column
            prop="createTime"
            label="提交时间"
            >
        </el-table-column>
        <el-table-column
            prop="createUserName"
            label="提交人"
            >
        </el-table-column>
        <el-table-column
            prop="askForLeaveName"
            label="休假人">
        </el-table-column>
        <el-table-column
            prop="startTime"
            label="休假开始时间">
        </el-table-column>
        <el-table-column
            prop="endTime"
            label="休假结束时间">
        </el-table-column>
        <el-table-column
            prop="receiveName"
            label="询盘接替人">
        </el-table-column>
        <el-table-column
            prop="status"
            label="操作">
            <template v-slot="{row}">
                <span v-if="row.status == 1" style="color:skyblue;cursor:pointer" @click="revokeVocation(row.id,row.endTime)" v-auth:none="['422004_B']"> 撤销</span>
                <span v-else-if="row.status == 2" style="cursor:not-allowed">已撤销</span>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[10, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog
        :visible.sync="setLeaveDial"
        width="700px"
        class="vocationSetting"
        center>
        <el-form label-position="left">
            <el-form-item required label="休假人" label-width="77px">
                    <el-select
                    v-model="leaveDial.askForLeaveId"
                    placeholder="请选择休假人"
                    filterable
                    remote
                    clearable
                    reserve-keyword
                    >
                        <el-option
                            v-for="item in allocationLeavePerson"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            :disabled="item.id === leaveDial.receiverId"
                        >
                        </el-option>
                    </el-select>
            </el-form-item>
            <el-form-item required label="开始时间">
                <el-date-picker
                    v-model="leaveDial.startTimeDay"
                    :picker-options="pickerOptionsStartTwo"
                    value-format="yyyy-MM-dd"
                    size="medium"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
                <el-time-picker
                popper-class="timePicker"
                style="margin-left:30px"
                v-model="leaveDial.startTimeMinute"
                value-format="HH:mm:00"
                size="medium"
                format='HH:mm'
                placeholder="选择时间">
            </el-time-picker>
            </el-form-item>
            <el-form-item required label="结束时间" style="position:relative">
                <el-date-picker
                    v-model="leaveDial.endTimeDay"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptionsEndTwo"
                    size="medium"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
                <el-time-picker
                popper-class="timePicker"
                style="margin-left:30px"
                v-model="leaveDial.endTimeMinute"
                value-format="HH:mm:00"
                size="medium"
                format='HH:mm'
                placeholder="选择时间">
            </el-time-picker>
            <span style="position:absolute;color:red;bottom:-33px;left:300px;white-space: nowrap;" v-if="errorTime">结束时间必须大于开始时间</span>
            </el-form-item>
            <el-form-item required label="询盘接替">
                <el-select
                    v-model="leaveDial.receiverId"
                    placeholder="请选择休假人"
                    clearable
                    filterable
                    remote
                    reserve-keyword
                    >
                        <el-option
                            v-for="item in allocationGetPerson"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            :disabled="item.id === leaveDial.askForLeaveId"
                        >
                        </el-option>
                    </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setLeaveDial = false">取 消</el-button>
            <el-button type="primary" @click="saveLeaveAllocation">保 存</el-button>
        </span>
    </el-dialog>
    </div>
     
  </template>
  <script>
  export default {
    data() {
      return {
       

        vocationList:[],//休假人列表
        vocationTable:[],//表格数据
        //分页
        pageNum:1,
        pageSize:10,
        total:0,

        selectResult:{ createStartTime:'',createEndTime:'',askForLeaveId:'' },
        
          // 限制结束日期大于开始日期
        pickerOptionsStartOne: {
            disabledDate: (time) => {
            let endDateVal = this.selectResult.createEndTime;
            if (endDateVal) {
                return time.getTime() > new Date(endDateVal).getTime() ;
            }
            },
        },
        pickerOptionsEndOne: {
            disabledDate: (time) => {
            let beginDateVal = this.selectResult.createStartTime;
            if (beginDateVal) {
                return time.getTime() < new Date(beginDateVal).getTime() -8.64e7;
            }
            },
        },
        setLeaveDial:false,//发起休假分配
         //发起请假分配 -请假人/接替人
         allocationLeavePerson:[],
        allocationGetPerson:[],
        errorTime:false,
        leaveDial:{startTimeDay:'',startTimeMinute:"",endTimeDay:'',endTimeMinute:'',askForLeaveId:'',receiverId:''}, //休假分配弹框数据

        pickerOptionsStartTwo: {
            disabledDate: (time) => {
            let endDateVal = this.leaveDial.endTimeDay;
            if (endDateVal) {
                return time.getTime() > new Date(endDateVal).getTime() ;
            }
            },
        },
        pickerOptionsEndTwo: {
            disabledDate: (time) => {
            let beginDateVal = this.leaveDial.startTimeDay;
            if (beginDateVal) {
                return time.getTime() < new Date(beginDateVal).getTime() -8.64e7;
            }
            },
        },
       
      };
    },
    created() {},
    mounted() {
        this.getVocationList()
        this.searchResult()
        window.addEventListener('beforeunload',this.dealUnload)
    },
    methods: {
        dealUnload(){
            sessionStorage.setItem('leavePage',true)
        },
        //表格数据
        searchResult(){
            let request = JSON.parse(JSON.stringify(this.selectResult))
            request.currentPage = this.pageNum
            request.pageSize = this.pageSize
            let { createStartTime,createEndTime,askForLeaveId } = request
            createStartTime ? (request.createStartTime += " 00:00:00") : (request.createStartTime = '')
            createEndTime ? (request.createEndTime += " 23:59:59") : (request.createEndTime = '')
            askForLeaveId ? (request.askForLeaveId = Number(request.askForLeaveId)) : (delete request.askForLeaveId)
            this.$http.post(this.$service.sessionSettingSearch,request).then(res=>{
               if(res.code == 200) {
                this.vocationTable = res.data.records
                console.log(this.vocationTable)
                this.total = res.data.total
               }
            })
        },
        //获取休假人列表
    getVocationList(){
        this.$http.post(this.$service.selectUserListByRoleName+'?roleName=航线负责人').then(res=>{
            if(res.code == 200) {
                this.vocationList = res.data
                this.allocationGetPerson = res.data
                this.allocationLeavePerson = res.data
            }
        })
    },
    revokeVocation(id,time){
        if(new Date().getTime()-new Date(time).getTime()>=0){
            return this.$message.warning("请假已过期,不允许撤销.即不允许对过往的请假申请发起撤销")
        }
        this.$confirm('撤销后,询盘将恢复正常坐席,确定是否于请假系统销假？', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
            this.$http.post(this.$service.revokeLeaveForm ,[id]).then(res=>{
                if(res.code == 200) {
                    this.$message.success("撤销成功")
                    this.searchResult()
                }
             
            })

        }).catch(() => {
        
        });
    },
        //发起休假分配
        setLeave(){
            this.setLeaveDial = true
            this.leaveDial = {startTimeDay:'',startTimeMinute:"",endTimeDay:'',endTimeMinute:'',askForLeaveId:'',receiverId:''}
        },
            //保存请假分配
            saveLeaveAllocation(){
            console.log(this.leaveDial)
            if(Object.values(this.leaveDial) && Object.values(this.leaveDial).some(item=>!item)){
                return this.$message.warning("请填写所有信息后保存")
            }
            if(this.errorTime){
                return this.$message.warning("结束时间必须大于开始时间")
            }
            let {startTimeDay,startTimeMinute,endTimeDay,endTimeMinute,askForLeaveId,receiverId} = this.leaveDial
            let request = {
                "askForLeaveId": askForLeaveId,
                "askForLeaveName":  this.vocationList.find(item=>item.id ==askForLeaveId).name,
                "startTime": startTimeDay+" "+startTimeMinute,
                "endTime": endTimeDay+ " " +endTimeMinute,
                "receiverId": receiverId,
                "receiveName": this.vocationList.find(item=>item.id ==receiverId).name
            }
            this.$http.post(this.$service.cwoLeaveFrom ,request).then(res=>{
                if(res.code == 200) {
                    this.setLeaveDial = false
                    if(res.data.leaveFormMessage.code == 1) {
                        this.$message.warning(res.data.leaveFormMessage.message)
                    }else {
                        this.$message.success("保存成功")
                    }
                    this.searchResult()
                }
              
            })

        },
        handleSizeChange(val){
            this.pageSize = val
            this.pageNum = 1
            this.searchResult()
        },
        handleCurrentChange(val){
            this.pageNum = val
            this.searchResult()
        }
    },
    watch:{
        leaveDial:{
            handler(){
                // this.leaveDial:{startTimeDay:'',startTimeMinute:"",endTimeDay:'',endTimeMinute:'',askForLeaveId:'',receiverId:''}
                let start = this.leaveDial.startTimeDay + " "+this.leaveDial.startTimeMinute
                let end = this.leaveDial.endTimeDay + " "+this.leaveDial.endTimeMinute
                if(!(this.leaveDial.startTimeDay && this.leaveDial.startTimeMinute && this.leaveDial.endTimeDay && this.leaveDial.endTimeMinute)) {
                    return
                }
                if(new Date(end).getTime()-new Date(start).getTime()<=0){
                    this.errorTime = true
                } else {
                    this.errorTime = false
                }
            },
            deep:true
        }
    },
    destroyed(){
        window.removeEventListener('beforeunload',this.dealUnload)
    }
  };
  </script>
  <style lang="less">
    .timePicker{
        width:210px;
       .el-time-panel__content{
             .el-time-spinner__item{
                font-size: 14px;
             }
             .active{
                font-size: 15px;
                background: #409eff;
                padding:0 6px;
                background-clip: content-box;
                color:#fff;
            }
        }
       
    }
  </style>
  <style lang="less" scoped>
    .vocationSetting{
        /deep/.el-dialog__body{
            padding:30px 0 0 70px;
        }
    }
    /deep/.el-form-item{
        margin-bottom:22px!important
    }
    /deep/.el-pagination{
        text-align: right;
        margin-top: 10px;
    }
    /deep/.el-dialog__header{
        border-bottom:0;
        .el-dialog__title{
            display: none;
        }
    }
    /deep/.el-dialog__footer{
        padding-bottom: 15px;
    }
    /deep/.el-table{ 
        border-right:1px solid silver;
        border-bottom:1px solid silver;
        th {
            text-align: center;
            border-right: 1px solid silver;
            border-bottom: 1px solid silver;
            border-top: 1px solid silver;
            &:first-child {
                 border-left: 1px solid silver;
            }
        }
        td {
            text-align: center;
            background-color: #fff;
            border-right: 1px solid silver;
            border-bottom: 1px solid silver;
            &:first-child {
                border-left: 1px solid silver;
            }
        }
       
    }
    .page{
        background-color: #fff;
        margin-top: 10px;
        min-height: 700px;
        &Search{
            padding: 15px 0 0 15px;
            display: flex;
            align-items: flex-start;
        }
    }
        /deep/input::selection{
            background: transparent;
        }
        /deep/el-time-panel{
            color:pink;
            .el-time-spinner__item .active {
                background: #409eff;
            }
        }
            
  </style>