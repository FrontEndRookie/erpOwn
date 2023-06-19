<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" size="medium" class="demo-form-inline">
        <div class="content-search-normal">
          <el-form-item label="订单号">
            <el-input maxlength="15" style="width: 200px;" size="medium" 
            @input="orderNo = $utils.pureNumber(orderNo,2)" v-model="orderNo" clearable
              placeholder="请输入订单号"></el-input>
          </el-form-item>
          <el-form-item label="运单号">
            <el-input @input="waybillNo = $utils.pureNumber(waybillNo,4)" style="width: 200px;" size="medium" maxlength="12" v-model="waybillNo" clearable
              placeholder="请输入运单号"></el-input>
          </el-form-item>
          <el-form-item label="认证企业">
            <el-select
              maxlength="30"
              clearable filterable 
              v-model="customerId"
              placeholder="请输入认证企业"
              style="min-width: 240px;width: auto;"
              @input="inputCompany(customerId)"
              @change="sousuo()"
            >
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.companyName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结算方式">
            <el-select multiple
              id="payWay"
              v-model="payWay"
              placeholder="请选择结算方式"
              clearable
              filterable
              maxlength="10"
              @change="changeDX(2)"
              style="width: 240px;"
            >
              <el-option
                v-for="item in typeArr2"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="售前客服" v-auth:none="['655002_B']">
            <el-select
              id="pscsId"
              v-model="pscsId"
              placeholder="请输入售前客服"
              clearable
              filterable
              maxlength="10"
              style="width: 160px;margin-right: 26px;"
              @change="sousuo()"
            >
              <el-option
                v-for="item in payBefore"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单开放状态">
            <el-select 
              id="openStatus"
              v-model="openStatus"
              placeholder="请输入订单开放状态"
              clearable
              filterable
              style="width: 100px;margin-right: 58px;"
              @change="sousuo()"
            >
              <el-option
                v-for="item in typeArr4"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
            <el-form-item label="订单超期状态">
            <el-select 
              id="overDueStatus"
              v-model="overDueStatus"
              placeholder=""
              clearable
              filterable
              maxlength="10"
              style="width: 100px;margin-right: 12px"
              @change="sousuo()"
            >
              <el-option
                v-for="item in typeArr1"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="航班日期:">
            <el-date-picker
              v-model="departureStartTime"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @change="departureEndTime = '';sousuo()"
              placeholder="选择日期"
              style="width: 150px">
            </el-date-picker>
            ——
            <el-date-picker
              v-model="departureEndTime"
              type="date"
              @change="sousuo()"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :picker-options="pickerOptions1"
              style="width: 150px">
            </el-date-picker>
            <!-- <el-date-picker
            v-model="departure"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="——"
            start-placeholder="起始日期"
            end-placeholder="结束日期">
            </el-date-picker> -->
          </el-form-item>
          <el-form-item label="付款截止日期:">
            <el-date-picker
              v-model="payDeadlineStartTime"
              @change="payDeadlineEndTime = '';sousuo()"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              style="width: 150px">
            </el-date-picker>
            ——
            <el-date-picker
              v-model="payDeadlineEndTime"
              type="date"
              @change="sousuo()"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :picker-options="pickerOptions2"
              style="width: 150px">
            </el-date-picker>
            <!-- <el-date-picker
            v-model="payDead"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="——"
            start-placeholder="起始日期"
            end-placeholder="结束日期">
            </el-date-picker> -->
          </el-form-item>
          <el-form-item label="特批截止日期:">
            <el-date-picker
              v-model="specialApprovalDeadlineStartTime"
              @change="specialApprovalDeadlineEndTime = '';sousuo()"
              type="date"
              style="width: 150px"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
            ——
            <el-date-picker
              v-model="specialApprovalDeadlineEndTime"
              type="date"
              @change="sousuo()"
              format="yyyy-MM-dd"
              style="width: 150px"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :picker-options="pickerOptions3">
            </el-date-picker>
            <!-- <el-date-picker
            v-model="specialApproval"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="——"
            start-placeholder="起始日期"
            end-placeholder="结束日期">
            </el-date-picker> -->
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-button @click="searchClick" size="medium" type="primary" v-auth="['655000_B']">搜索 </el-button>
              <el-button @click="restClick" size="medium" type="primary">清空</el-button>
            </el-row>
          </el-form-item>
          <!-- <el-form-item style="float: right;margin-right: 0">
            <el-row>
              <el-button v-if="roleNameA" @click="newAdd" size="medium">新增</el-button>
            </el-row>
          </el-form-item> -->
        </div>
        <!-- <div><el-button>全部</el-button></div> -->
      </el-form>
      <Table
        :tableData='tableData'
        :columns='columns'
        :operation='operation'
        :total='total'
        :currentPage='pageNum'
        :pageSize='pageSize'
        @dcButton = 'handledcButton'
        @changUserObj = 'changUserObj'
        @sizeChange='handleSizeChange'
        @currentChange='handleCurrentChange'
        @handleClick='handleClick'
        @speciaChange="speciaChange">
      </Table>
      <UserDialog :userObj = 'userObj' @changeDialogVisible="changeDialogVisible"></UserDialog>
      
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close='closeDialog' width="200px">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" :label-position="labelPosition" label-width="80px"
        size="medium" class="demo-form-inline" style="padding-left: 20px;padding-top:20px;">
        <el-form-item prop="agentName" label="代理名称">
          <el-input style="width: 280px;" v-model="ruleForm.agentName" clearable placeholder="请输入代理名称"
            :maxlength="inputMax"></el-input>
        </el-form-item>
        <el-form-item prop="agentCode" label="代理简称">
          <el-input style="width: 280px;" v-model="ruleForm.agentCode" clearable placeholder="请输入代理简称"
            :maxlength="inputMax"></el-input>
        </el-form-item>
        <el-form-item prop="sysname" label="售中客服">
          <el-select
              id="sysname"
              v-model="ruleForm.sysname"
              placeholder="请输入售中客服"
              clearable
              filterable
              remote
              reserve-keyword
              maxlength="10"
              style="width: 280px"
            >
              <el-option
                v-for="item in payBefore"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          <!-- <el-input style="width: 280px;" v-model="ruleForm.agentCode" clearable placeholder="请输入售中客服"
            :maxlength="inputMax"></el-input> -->
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <div style="text-align: center;padding-top:20px;">
          <el-button size="medium" type="primary"
            @click="dialogComfirm('ruleForm')">确定</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Table from './components/ManageTable.vue'
  import UserDialog from './components/userDialog.vue'
  import {
    toData
  } from '@/util/assist'
  export default {
    data() {
      return {
        //table
        userObj:'',
        historyData:'',
        // departure:'',
        // payDead:'',
        // specialApproval:'',
        orderNo:'', //  订单号
        waybillNo:'', // 运单号
        customerId:'',  //认证企业(公司id)
        payWay:[''], //结算方式
        pscsId:'', //售前
        openStatus:'', // 订单开放状态
        overDueStatus:'', // 订单超期状态
        departureStartTime:'', //航班日期
        departureEndTime:'', // 
        payDeadlineStartTime:'', // 付款截止日期
        payDeadlineEndTime:'',
        specialApprovalDeadlineStartTime:'', // 特批截止日期
        specialApprovalDeadlineEndTime:'',
        roleNameA:'',
        companyList:[],
        paying:[],
        payBefore:[],
        tableData: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        // 列
        typeArr1: [
        { id: '', name: "全部" },
        { id: 1, name: "超期" },
        { id: 0, name: "未超期" },
        ],
        typeArr2: [
        { id: '', name: "全部" },
        { id: 0, name: "付款买单" },
        { id: 1, name: "月结买单" },
        { id: 2, name: "固定天数"}
        ],
        typeArr3: [
        { id: '', name: "全部" },
        { id: 1, name: "是" },
        { id: 2, name: "否" }
        ],
        typeArr4: [
        { id: 0, name: "冻结" },
        { id: 1, name: "正常" },
        { id: '', name: "全部" }
        ],
        columns: [{
            label: '订单号',
            prop: 'orderNo',
            show: true,
            width: '160',
            flexd:true,
          },
          {
            label: '运单号',
            prop: 'waybillNo',
            show: true,
            width: '160',
            flexd:true,
          },
          {
            label: '认证企业',
            prop: 'companyName',
            show: true,
            width: '160',
            flexd:true,
          },
          {
            label: '结算方式',
            prop: 'payWayName',
            show: true,
            width: '160'
          },
          // {
          //   label: '结算账期',
          //   prop: 'accountingPeriod',
          //   show: true,
          //   width: '160'
          // },
          {
            label: '航班日期',
            prop: 'departureDate',
            show: true,
            width: '160'
          },{
            label: '付款截止日期',
            prop: 'payDeadline',
            show: true,
            width: '160'
          },
          {
            label: '逾期天数',
            prop: 'overDueDays',
            show: true,
            width: '160'
          },
          {
            label: '订单超期状态',
            prop: 'overDueStatusName',
            show: true,
            width: '160'
          },
          {
            label: '订单总金额（元）',
            prop: 'totalArCny',
            show: true,
            width: '160'
          },
          {
            label: '订单未核销总金额（元）',
            prop: 'arrears',
            show: true,
            width: '160'
          },
          {
            label: '超期滞纳金（元）',
            prop: 'overDueLatePaymentFee',
            show: true,
            width: '160'
          },{
            label: '特批截止日期',
            prop: 'specialApprovalDeadline',
            show: true,
            width: '160'
          },
          {
            label: '操作',
            prop: 'sysname',
            show: true,
            width: '160'
          },{
            label: '售前客服',
            prop: 'pscsName', // pscsId
            show: true,
            width: '160'
          },
          {
            label: '联系电话',
            prop: 'pscsTel',
            show: true,
            width: '160'
          },
          {
            label: '开放状态',
            prop: 'openStatusZJ',
            show: true,
            width: '160',
            flexd:'right',
          },
        ],
        // 操作
        operation: {
          show: true,
          label: '操作',
          width: '160',
          options: [{
              label: '编辑',
              method: 'edit',
              auth: ['251001_B'],
            },
            {
              label: '查看历史',
              method: 'del'
            },
          ]
        },
        agentId: '',
        ruleForm: {
          agentName: '',
          agentCode: '',
          sysname:'' // 新加售中客服
        },
        rules: {
          agentName: [{required: true, message: '请输入代理名称', trigger: 'blur'}],
          sysname: [{required: true, message: '请输入售中客服', trigger: 'blur'}],

          // agentCode: [{required: true, message: '请输入代理简称', trigger: 'blur'}]
        },
        labelPosition: 'right',
        agentName: '',
        agentCode: '',
        dialogTitle: '',
        sysname:'', // 新加售中客服
        dialogFormVisible: false,

        // dialogFormVisibleFFF: false, //是否显示售中客服
      }
    },
    computed:{
      pickerOptions1(){
                 var _this = this
                 return {
                     disabledDate(time) {
                         let licenseStart = new Date(_this.departureStartTime)
                         licenseStart.setDate(licenseStart.getDate()-1)
                         return time.getTime() < licenseStart.getTime()
                     }
                 }
             },
      pickerOptions2(){
                 var _this = this
                 return {
                     disabledDate(time) {
                         let licenseStart = new Date(_this.payDeadlineStartTime)
                         licenseStart.setDate(licenseStart.getDate()-1)
                         return time.getTime() < licenseStart.getTime()
                     }
                 }
             },
      pickerOptions3(){
                 var _this = this
                 return {
                     disabledDate(time) {
                         let licenseStart = new Date(_this.specialApprovalDeadlineStartTime)
                         licenseStart.setDate(licenseStart.getDate()-1)
                         return time.getTime() < licenseStart.getTime()
                     }
                 }
             },
    },
    mounted() {
      this.initAgentSearch()
      this.operateData()
      var nameA = JSON.parse(sessionStorage.getItem('userInfo')).loginName
      if((nameA == 'admin')||(nameA == '13918289152')){
        this.roleNameA = true
      }else{
        this.roleNameA = false
      }
    },
    methods: {
      // 改变搜索条件的搜索
      sousuo(){
        this.searchClick()
      },
      // table 列表触发弹框数据改变
      changUserObj(e){
        if(e.type === 0){
          this.initAgentSearch()
        }else if(e.type == 2){
          this.getorderHistory(e.id)
        }else if(e.type == 3){
          this.statusChange(e)
        }
      },
      //开启时间选择弹窗
        changeDialogS(type){
            if(type==1){
                    this.$store.commit('changeDogShow',1)//mutations
                }
        },
      // 控制弹框
      changType(){
        this.$store.commit('changeUserManageType',10) //mutations
      },
       //售前售中客服、航线负责人数据
      operateData(){
        this.$http.get(this.$service.userSearchNoAuth+'?roleName=售前客服&pageSize=50000').then(data=>{
          this.payBefore = data.data.records
        })
        this.$http.get(this.$service.userSearchNoAuth+'?roleName=售中客服&pageSize=50000').then(data=>{
          this.paying = data.data.records
        })
        var obj = {"companyName":""}
        this.$http.post(this.$service.getUserCompanyList,obj).then(data=>{
          this.companyList = data.data
        })
      },
      //获取订单管理列表
      initAgentSearch() {
        // if(this.departure){
        //   var departureStartTime = this.departure[0]
        //   var departureEndTime = this.departure[1]
        // }else{
        //   var departureStartTime = ''
        //   var departureEndTime = ''
        // }
        // if(this.payDead){
        //   var payDeadlineStartTime = this.payDead[0]
        //   var payDeadlineEndTime = this.payDead[1]
        // }else{
        //   var payDeadlineStartTime = ''
        //   var payDeadlineEndTime = ''
        // }
        // if(this.specialApproval){
        //   var specialApprovalDeadlineStartTime = this.specialApproval[0]
        //   var specialApprovalDeadlineEndTime = this.specialApproval[1]
        // }else{
        //   var specialApprovalDeadlineStartTime = ''
        //   var specialApprovalDeadlineEndTime = ''
        // }
        // console.log(this.overDueStatus);
        var waybillNo = this.$utils.pureNumber(this.waybillNo)
        var params = {
          "orderNo":this.orderNo,
          "waybillNo":waybillNo,
          "customerId":this.customerId,
          "payWay":this.payWay!=''?this.payWay.join(','):null,
          "openStatus":this.openStatus!==''?Number(this.openStatus):null,
          "pscsId":this.pscsId,
          "overDueStatus":this.overDueStatus!==''?this.overDueStatus:null,
          "departureStartTime":this.departureStartTime,
          "departureEndTime":this.departureEndTime,
          "payDeadlineStartTime":this.payDeadlineStartTime,
          "payDeadlineEndTime":this.payDeadlineEndTime,
          "specialApprovalDeadlineStartTime":this.specialApprovalDeadlineStartTime,
          "specialApprovalDeadlineEndTime":this.specialApprovalDeadlineEndTime,
          "currentPage":this.pageNum,
          "pageSize":this.pageSize,
          sceneFlag: 0,
        }
        this.$http.post(this.$service.selectOrderManagePage, params).then(data => {
          if (data.code == 200) {
            this.total = data.data.total
            var payWayArray = ['付款买单','月结买单','固定天数']
            // var overDueArray = ['','基础设置','自定义']
            var openStatusArray = ['冻结','开放']
            var overDueStatusArr = ['正常','已超期']
            // var overDueOrExcessLimitStrategyArray = ['','否','是']
            // var accountPeriodLimitStatusArray = ['','超期','超额']
            // var creditGradeArray = ['','A级','B级','C级','D级','E级']
            // var creditGradeArray = ['','A','B','C','D','E']
            var array = JSON.parse(JSON.stringify(data.data.records))
            for (let i = 0; i < array.length; i++) {
              array[i].payWayName = payWayArray[Number(array[i].payWay)]
              array[i].openStatusName = openStatusArray[Number(array[i].openStatus)]
              array[i].overDueStatusName = overDueStatusArr[Number(array[i].overDueStatus)]
              array[i].openStatusZJ = Number(array[i].openStatus)===1?true:false
              // array[i].overDueOrExcessLimitStrategyName = overDueOrExcessLimitStrategyArray[Number(array[i].overDueOrExcessLimitStrategy)]
              // // array[i].accountPeriodLimitStatusName = accountPeriodLimitStatusArray[Number(array[i].accountPeriodLimitStatus)]
              // array[i].temporaryQuotaPeriod = array[i].poraryStart?((array[i].poraryStart).split('-').join('/'))+'-'+(array[i].poraryEnd).split('-').join('/'):''
              // array[i].creditGradeName = array[i].creditGrade?creditGradeArray[Number(array[i].creditGrade)]:''
              // if(array[i].isOverDue || array[i].isOverDue){
              //   array[i].accountPeriodLimitStatusName = '超期、超额'
              // }else if(array[i].isOverDue || !array[i].isOverDue){
              //   array[i].accountPeriodLimitStatusName = '超期未超额'
              // }else if(!array[i].isOverDue || array[i].isOverDue){
              //   array[i].accountPeriodLimitStatusName = '超额未超期'
              // }else{
              //   array[i].accountPeriodLimitStatusName = '正常'
              // }
            }
            this.tableData = array
          } else {
            this.$message.error(data.message)
          }
        })
      },
      // 导出列表2
    handledcButton(obj){
      if(obj.obj.length>0){
        var json = obj.obj
        this.$http.post(this.$service.orderManageListExport,json, {
          responseType: 'arraybuffer'
        }).then(res=>{
           let enc = new TextDecoder("utf-8");
            let uint8_msg = new Uint8Array(res);
            let str=enc.decode(uint8_msg);
            if(str.indexOf("code")>-1) {
                    let copyStr = JSON.parse(str)
                    if(copyStr.code == 200) {
                    }
                    else {
                    this.$message.error(copyStr.message)
                    }
                    return
            }
          const aLink = document.createElement("a");
          let blob = new Blob([res], {
            type: "application/vnd.ms-excel"
          })
          aLink.href = URL.createObjectURL(blob)
          aLink.setAttribute('download', '订单管理列表' + '.xlsx') // 设置下载文件名称
          aLink.click()
          document.body.appendChild(aLink)
        })
      }else{
        // if(this.departure){
        //   var departureStartTime = this.departure[0]
        //   var departureEndTime = this.departure[1]
        // }else{
        //   var departureStartTime = ''
        //   var departureEndTime = ''
        // }
        // if(this.payDead){
        //   var payDeadlineStartTime = this.payDead[0]
        //   var payDeadlineEndTime = this.payDead[1]
        // }else{
        //   var payDeadlineStartTime = ''
        //   var payDeadlineEndTime = ''
        // }
        // if(this.specialApproval){
        //   var specialApprovalDeadlineStartTime = this.specialApproval[0]
        //   var specialApprovalDeadlineEndTime = this.specialApproval[1]
        // }else{
        //   var specialApprovalDeadlineStartTime = ''
        //   var specialApprovalDeadlineEndTime = ''
        // }
        var waybillNo = this.$utils.pureNumber(this.waybillNo)
        var json = {
          "orderNo":this.orderNo,
          "waybillNo":waybillNo,
          "customerId":this.customerId,
          "payWay":this.payWay!=''?this.payWay.join(','):null,
          "openStatus":this.openStatus!=''?Number(this.openStatus):null,
          "pscsId":this.pscsId,
          "overDueStatus":this.overDueStatus!==''?this.overDueStatus:null,
          "departureStartTime":this.departureStartTime,
          "departureEndTime":this.departureEndTime,
          "payDeadlineStartTime":this.payDeadlineStartTime,
          "payDeadlineEndTime":this.payDeadlineEndTime,
          "specialApprovalDeadlineStartTime":this.specialApprovalDeadlineStartTime,
          "specialApprovalDeadlineEndTime":this.specialApprovalDeadlineEndTime,
          "currentPage":this.pageNum,
          "pageSize":this.pageSize
        }
        this.$http.post(this.$service.orderManageExport,json, {
          responseType: 'arraybuffer'
        }).then(res=>{
          let enc = new TextDecoder("utf-8");
            let uint8_msg = new Uint8Array(res);
            let str=enc.decode(uint8_msg);
            if(str.indexOf("code")>-1) {
                    let copyStr = JSON.parse(str)
                    if(copyStr.code == 200) {
                    }
                    else {
                    this.$message.error(copyStr.message)
                    }
                    return
            }
          const aLink = document.createElement("a");
          let blob = new Blob([res], {
            type: "application/vnd.ms-excel"
          })
          aLink.href = URL.createObjectURL(blob)
          aLink.setAttribute('download', '订单管理列表' + '.xlsx') // 设置下载文件名称
          aLink.click()
          document.body.appendChild(aLink)
        })
      }
    },
    // 更改特批截至日期
    speciaChange(e){
      if(e.type == 'array'){
        var params = e.arr
        this.$http.post(this.$service.specialEndUpdateAll, params, {
          headers: {
            diffFlag: 2,
          },
        }).then(data => {
          if (data.code == 200) {
            this.$message.success('批量设置特批截止日期更改成功')
            this.initAgentSearch()
          }else{
            this.$message.error(data.message)
          }
          }).catch(err=>{
            console.log(err);
          })
      }else{
        if(e.specialApprovalDeadline == null){
          var params = "?orderId="+e.id
          this.$http.get(this.$service.specialEndUpdateClear+params, {
            headers: {
              diffFlag: 1,
            },
          }).then(data => {
            if (data.code == 200) {
              this.$message.success('特批截止日期清除成功')
              this.initAgentSearch()
            }else{
              this.$message.error(data.message)
            }
          }).catch(err=>{
            console.log(err);
          })
        }else{
          var params = e
          this.$http.post(this.$service.specialEndUpdate, params, {
            headers: {
              diffFlag: 1,
            },
          }).then(data => {
            if (data.code == 200) {
              this.$message.success('特批截止日期更改成功')
              this.initAgentSearch()
            }else{
              this.$message.error(data.message)
            }
            }).catch(err=>{
              console.log(err);
            })
        }
      }
      
    },
    // 更改开放状态
    statusChange(e){
      if(e.lx == 'Array'){
        var params = e.obj
        this.$http.post(this.$service.specialEndUpdateAll, params, {
          headers: {
            diffFlag: 1,
          },
        }).then(data => {
          if (data.code == 200) {
            this.$message.success('批量解锁订单成功')
            this.initAgentSearch()
          }else{
            this.$message.error(data.message)
            this.initAgentSearch()
          }
          }).catch(err=>{
            console.log(err);
          })
      }else{
        var params = e.obj
        this.$http.post(this.$service.specialEndUpdate, params, {
          headers: {
            diffFlag: 2,
          },
        }).then(data => {
          if (data.code == 200) {
            if(Number(e.obj.openStatus) === 1){
              this.$message.success('解锁订单成功')
            }else{
              this.$message.success('冻结订单成功')
            }
            this.initAgentSearch()
          }else{
            this.$message.error(data.message)
            this.initAgentSearch()
          }
          }).catch(err=>{
            console.log(err);
          })
      }
      
    },
    // 订单历史查询
    getorderHistory(id){
      var params = {
        orderId:id
      }
        this.$http.post(this.$service.orderHistoryData, params).then(data => {
          if (data.code == 200) {
            this.userObj = data.data
            console.log('变得',this.userObj);
          }else{
            this.$message.error(data.message)
          }
          }).catch(err=>{
            console.log(err);
          })
    },
      changeDX(type){
        if (type === 1) {
          if(this.accountPeriodLimitStatusName[this.accountPeriodLimitStatusName.length-1] === ''){
            this.accountPeriodLimitStatusName = ['']
          }else if(this.accountPeriodLimitStatusName.indexOf('')>-1){
            this.accountPeriodLimitStatusName.splice(this.accountPeriodLimitStatusName.indexOf(''), 1)
          }else{
            if(this.accountPeriodLimitStatusName.length == 4){
              this.accountPeriodLimitStatusName = ['']
            }
          }
        }else if (type === 2) {
          if(this.payWay[this.payWay.length-1] === ''){
            this.payWay = ['']
          }else if(this.payWay.indexOf('')>-1){
            this.payWay.splice(this.payWay.indexOf(''), 1)
          }else{
            if(this.payWay.length == 3){
              this.payWay = ['']
            }
          }
        }else if (type === 4) {
          if(this.overDueStatus[this.overDueStatus.length-1] === ''){
            this.overDueStatus = ['']
          }else if(this.overDueStatus.indexOf('')>-1){
            this.overDueStatus.splice(this.overDueStatus.indexOf(''), 1)
          }else{
            if(this.overDueStatus.length == 2){
              this.overDueStatus = ['']
            }
          }
        }else if (type === 3) {
          if(this.openStatus[this.openStatus.length-1] === ''){
            this.openStatus = ['']
          }else if(this.openStatus.indexOf('')>-1){
            this.openStatus.splice(this.openStatus.indexOf(''), 1)
          }else{
            if(this.openStatus.length == 2){
              this.openStatus = ['']
            }
          }
        }
        this.sousuo()
      },
      //查询
      searchClick() {
        // this.pageSize = 10
        // this.pageNum = 1
        this.initAgentSearch()
      },
      //清空
      restClick() {
        this.orderNo = ''
        this.waybillNo = ''
        this.customerId = '' 
        this.payWay = '' 
        this.pscsId = '' 
        this.openStatus = '' 
        this.overDueStatus = '' 
        // this.departure = ''
        // this.payDead = ''
        // this.specialApproval = ''
        this.departureStartTime='' //航班日期
        this.departureEndTime='' // 
        this.payDeadlineStartTime='' // 付款截止日期
        this.payDeadlineEndTime=''
        this.specialApprovalDeadlineStartTime='' // 特批截止日期
        this.specialApprovalDeadlineEndTime=''
        this.pageSize = 10
        this.pageNum = 1
        this.initAgentSearch()
      },

      //新增
      newAdd() {
        this.dialogFormVisible = true
        // this.dialogFormVisibleFFF = false
        this.dialogTitle = '新增代理'
        this.ruleForm = {
          agentName: '',
          agentCode: '',
          sysname: '', // 新加售中客服
        }
      },
      dialogComfirm(ruleForm) {
        this.$refs[ruleForm].validate((valid, object) => {
          if (valid) {
            if (this.dialogTitle == '新增代理') {
              this.$http.post(this.$service.agentSave, this.ruleForm).then(data => {
                if (data.code == 200) {
                 var data1 = {
                    sysUserId:  this.ruleForm.sysname, // 新加售中客服 - 需要
                    agentId: data.data,
                  }
                  this.$http.post(this.$service.saveMscs, data1).then(data2 => {
                    if (data2.code == 200) {
                      this.$message.success('新增成功')
                      this.initAgentSearch()
                      this.dialogFormVisible = false
                    } else {
                      this.$message.error(data2.message)
                    }
                  })
                } else {
                  this.$message.error(data.message)
                }
              })
            } else if (this.dialogTitle == '编辑代理') {
              var data = {
                agentCode: this.ruleForm.agentCode,
                agentName: this.ruleForm.agentName,
                id: this.agentId,
                status: '0'
              }
              this.$http.put(this.$service.agentUpdate, data).then(data => {
                if (data.code == 200) {
                  var fn = ''
                  for(let i=0;i<this.paying.length;i++){
                    if(this.paying[i].id == this.ruleForm.sysname){
                       fn = this.ruleForm.sysname
                    }
                    if(this.paying[i].name == this.ruleForm.sysname){
                       fn =this.paying[i].id
                    }
                  }
                 var data1 = {
                    sysUserId:  fn, // 新加售中客服 - 需要
                    agentId: this.agentId,
                  }
                  this.$http.post(this.$service.saveMscs, data1).then(data2 => {
                    if (data2.code == 200) {
                      this.$message.success('编辑成功')
                      this.initAgentSearch()
                      this.dialogFormVisible = false
                    } else {
                      this.$message.error(data2.message)
                    }
                  })
                } else {
                  this.$message.error(data.message)
                }
              })
            }
          } else {
            setTimeout(() => {
              var isError = document.getElementsByClassName("is-error");
              if (isError[0].querySelector('input')) {
                isError[0].querySelector('input').focus()
              } else if (isError[0].querySelector('textarea')) {
                isError[0].querySelector('textarea').focus()
              }
            }, 100);
            return false;
          }
        })
      },
      //操作
      handleClick(scope) {
        if (scope.method == 'edit') {
          this.dialogTitle = '编辑代理'
          this.dialogFormVisible = true
          // this.dialogFormVisibleFFF = true
          this.ruleForm.agentName = scope.row.agentName
          this.ruleForm.agentCode = scope.row.agentCode
          this.ruleForm.sysname = scope.row.sysname // 新加售中客服
          this.agentId = scope.row.id
        } else if (scope.method == 'del') {
            this.$confirm(scope.type, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }).then(() => {
                this.$http.put(this.$service.agentDelete + '?id=' + scope.row.id).then(data => {
                  if (data.code == 200) {
                    this.initAgentSearch()
                    this.$message.success('删除成功')
                  } else {
                    this.$message.error(data.message)
                  }
                })
              })
          return
          this.$http.put(this.$service.agentDelete + '?id=' + scope.row.id+"&check="+true).then(data => {
            if (data.code == 200) {
              this.$confirm(scope.type, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }).then(() => {
                this.$http.put(this.$service.agentDelete + '?id=' + scope.row.id+"&check="+false).then(data => {
                  if (data.code == 200) {
                    this.initAgentSearch()
                    this.$message.success('删除成功')
                  } else {
                    this.$message.error(data.message)
                  }
                })
              })
            } else {
              this.$message.error(data.message)
            }
          }).catch(() => {
            console.log('取消')
          })
/*          this.$confirm("确定删除这条数据?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$http.put(this.$service.agentDelete + '?id=' + scope.row.id).then(data => {
              if (data.code == 200) {
                this.initAgentSearch()
                this.$message.success('删除成功')
              } else {
                this.$message.error(data.message)
              }
            })
          }).catch(() => {
            console.log('取消')
          })*/
        }
      },

      handleCurrentChange(e) {
        this.pageNum = e
        this.initAgentSearch()
      },
      handleSizeChange(e) {
        this.pageSize = e
        this.initAgentSearch()
      },
      closeDialog() {
        this.dialogFormVisible = false
        this.agentId = ''
      },
    },
    watch: {
      tableData(idx) {
        return idx
      }
    },
    components: {
      Table,UserDialog
    }
  }
</script>

<style  scoped lang="less">
  @import url("../../assets/icon/iconfont.css");
  /deep/.content-search-normal .el-form-item{
    margin-bottom: 8px !important;
    margin-right: 30px !important;
  }
  .content-wrapper {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    overflow: hidden;
    background-color: #f3f6f9 !important;
  }

  .el-form {
    background-color: #FFF;
  }

  .el-form--inline .el-form-item {
    margin-bottom: 0;
    vertical-align: bottom;
  }

  .wrapper,.content {
    width: 100%;
    background-color: #fff;
  }

  .content-search-normal {
    padding: 10px !important;
    background: #fff;
  }

  .el-dialog {
    width: 300px;
    min-width: 500px !important;
  }
</style>
