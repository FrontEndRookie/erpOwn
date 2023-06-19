<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" size="medium" class="demo-form-inline">
        <div class="content-search-normal">
          <el-form-item label="认证企业">
          <el-select
            clearable
            filterable
            remote
            :remote-method="(query) => (companyNameQuery = query)"
            @change="sousuo()"
              v-model="id"
              placeholder="请输入认证企业"
              style="min-width: 240px;width: auto;"
            >
              <el-option
                v-for="item in computedCompanyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                :disabled="!item.view"
              >
              <span>{{ item.name }}</span>
              <span style="color: red" v-if="!item.view"
                >没有权限</span
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业信用代码">
            <el-input style="width: 200px;" size="medium" maxlength="30" v-model="creditCode" clearable
              placeholder="请输入企业信用代码"></el-input>
          </el-form-item>
          <el-form-item label="账期额度状态">
            <el-select multiple
            clearable
              v-model="accountPeriodLimitStatusName"
              placeholder="请输入账期额度状态"
              style="min-width: 340px;width: auto;"
              @change="changeDX(1)"
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
          <el-form-item label="结算方式">
            <el-select multiple 
              id="payWayStr"
              v-model="payWayStr"
              placeholder="请输入结算方式"
              clearable
              @change="changeDX(2)"
              style="width: 300px;"
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
          <el-form-item label="客户负责人" v-auth:none="['654003_B']">
            <el-select  
              filterable
              id="pscsId"
              @change="sousuo()"
              v-model="pscsId"
              placeholder="请输入客户负责人"
              clearable
              style="min-width: 160px;width: auto;"
              maxlength="10"
            >
              <el-option
                v-for="item in principalList"
                :key="item.id"
                :label="item.name+ ' ' +item.branchNames"
                :value="item.id"
              >
                <span>{{ item.name +"&nbsp; "+ item.branchNames}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户负责人所在分公司" v-auth:none="['654003_B']">
            <el-select  filterable
              @change="sousuo()"
              v-model="sysOrgId"
              placeholder=""
              clearable
              style="min-width: 160px;width: auto;"
              maxlength="10"
            >
              <el-option
                v-for="item in principalCompanyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否自定义配置" v-auth:none="['654002_B']">
            <el-select 
              @change="sousuo()"
              id="overDueOrExcessLimitStrategy"
              v-model="overDueOrExcessLimitStrategy"
              placeholder="请选择"
              clearable
              style="width: 80px;"
            >
              <el-option
                v-for="item in typeArr3"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户开放状态" v-auth:none="['654006_B']">
            <el-select 
            @change="sousuo()"
              id="openStatus"
              v-model="openStatus"
              placeholder=""
              clearable
              style="width: 80px;"
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
          <el-form-item>
            <el-row>
              <el-button @click="getUserInfo(3)" size="medium" type="primary" v-auth="['654000_B']">搜索 </el-button>
              <el-button @click="restClick" size="medium" type="primary">清空</el-button>
            </el-row>
          </el-form-item>
          <!-- <el-form-item style="float: right;margin-right: 0">
            <el-row>
              <el-button v-if="roleNameA" @click="newAdd" size="medium">新增</el-button>
            </el-row>
          </el-form-item> -->
        </div>
        <!-- <div style="padding-bottom:20px">
            
        </div> -->
      </el-form>
      <Table class="tableFlex"
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
        @handleClick='handleClick'>
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
          <el-select multiple 
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
import { payWayArray } from '../../util/util'
import { toData } from '@/util/assist'
  export default {
    data() {
      return {
        //table
        userObj:{},
        inputMax:30,
        roleNameA:'',
        paying:[],
        payBefore:[], // 售前客服
        principalList:[], // 客户负责人列表
        principalCompanyList:[], // 客户负责人所在分公司（查询一级分公司名称）
        tableData: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        // 列
        typeArr1: [
        { id: '', name: "全部" },
        { id: 0, name: "正常" },
        { id: 1, name: "超期未超额" },
        { id: 2, name: "超额未超期" },
        { id: 3, name: "超期、超额"}
        ],
        typeArr2: [
        { id: '', name: "全部" },
        { id: 0, name: "付款买单" },
        { id: 1, name: "月结买单" },
        { id: 2, name: "固定天数"}
        ],
        typeArr3: [
        { id: '', name: "全部" },
        { id: 1, name: "否" },
        { id: 2, name: "是" }
        ],
        typeArr4: [
        { id: '', name: "全部" },
        { id: 0, name: "冻结" },
        { id: 1, name: "正常" },
        ],
        columns: [{
            label: '认证企业',
            prop: 'companyName',
            show: true,
            width: '160',
            flexd:true
          },
          {
            label: '企业信用代码',
            prop: 'creditCode',
            show: true,
            width: '160'
          },
          {
            label: '信用等级',
            prop: 'creditGradeName',
            show: true,
            width: '160'
          },
          {
            label: '结算方式', //['付款买单','月结买单','固定天数']
            prop: 'payWayName',
            show: true,
            width: '160'
          },
          {
            label: '总票数',
            prop: 'totalVotes',
            show: true,
            width: '160'
          },
          {
            label: '总营业额（元）',
            prop: 'totalTurnover',
            show: true,
            width: '160'
          },{
            label: '结算账期',
            prop: 'accountingPeriod',
            show: true,
            width: '160'
          },
          {
            label: '超期票数',
            prop: 'overDueVotes',
            show: true,
            width: '160'
          },{
            label: '超期欠款（元）',
            prop: 'overDueArrears',
            show: true,
            width: '160'
          },
          {
            label: '授信额度（元）',
            prop: 'quota',
            show: true,
            width: '160'
          },
          {
            label: '临时额度（元）',
            prop: 'poraryQuota',
            show: true,
            width: '160'
          },{
            label: '临时额度期限',
            prop: 'temporaryQuotaPeriod',
            show: true,
            width: '160'
          },
          {
            label: '总欠款',
            prop: 'totalArrears',
            show: true,
            width: '160'
          },
          {
            label: '剩余额度（元）',
            prop: 'remainingQuota',
            show: true,
            width: '160'
          },
          // {
          //   label: '客户开放状态', //1-开放 0-冻结
          //   prop: 'openStatusName',
          //   show: true,
          //   width: '160'
          // },
          {
            label: '账期额度状态', //1-超期  2-超额
            prop: 'accountPeriodLimitStatusName',
            show: true,
            width: '160'
          },{
            label: '是否自定义配置', //1-否  2-是
            prop: 'overDueOrExcessLimitStrategyName',
            show: true,
            width: '160'
          },{
            label: '新增时间', //1-否  2-是
            prop: 'createTime',
            show: true,
            width: '160'
          },
          // {
          //   label: '售前客服',
          //   prop: 'sysName',
          //   show: true,
          //   width: '160'
          // },
          {
            label: '客户负责人',
            prop: 'customerResponsibleName',
            show: true,
            width: '160'
          },
          {
            label: '客户负责人所在分公司',
            prop: 'orgNames',
            show: true,
            width: '160'
          },
          {
            label: '客户负责人系电话',
            prop: 'sysTel',
            show: true,
            width: '160'
          },{
            label: '企业联系人电话',
            prop: 'businessContactTel',
            show: true,
            width: '160'
          },
          {
            label: '企业联系人邮箱',
            prop: 'businessContactMail',
            show: true,
            width: '160'
          },
          {
            label: '企业联系人QQ号',
            prop: 'businessContactQq',
            show: true,
            width: '160'
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
        companyList:[],
        labelPosition: 'right',
        agentName: '',
        agentCode: '',
        dialogTitle: '',
        sysname:'', // 新加售中客服
        dialogFormVisible: false,
        // ---------------
        companyName:'', //企业名称
        id :  '', // 企业名称id
        accountPeriodLimitStatusName:[''], //账期额度状态
        creditCode:  '',                    // 企业信用代码
        payWayStr :  [''],                              // 结算方式 0:付款买单 1：月结买单 2-固定时间
        pscsId :  '',                              // 售前客服id=>客户负责人
        sysOrgId :  '',                              // 客户负责人所在分公司id
        overDueOrExcessLimitStrategy :  '',        //  自定义配置 1-否  2-是
        openStatus :  '',                          // 客户开放状态 1-开放 0-冻结
        // dialogFormVisibleFFF: false, //是否显示售中客服
        companyNameQuery: '',
      }
    },
    computed: {
      computedCompanyList({ companyNameQuery }) {
      return this.companyList
        .filter((item) => {
          return (
            companyNameQuery !== "" &&
            companyNameQuery.trim() !== "" &&
            item.name.toLowerCase().includes(companyNameQuery.toLowerCase())
          );
        })
        .slice(0, 10);
    },
    },
    mounted() {
      // this.initAgentSearch()
      this.operateData()
      this.getUserInfo()
      var nameA = JSON.parse(sessionStorage.getItem('userInfo')).loginName
      if((nameA == 'admin')||(nameA == '13918289152')){
        this.roleNameA = true
      }else{
        this.roleNameA = false
      }
    },
    methods: {
      // 编辑弹出框初始内容
      changUserObj(obj){
        this.userObj = JSON.parse(JSON.stringify(obj))
      },
      // 控制弹框
      changType(){
        this.$store.commit('changeUserManageType',10) //mutations
      },
       //售前售中客服、航线负责人数据
      operateData (){
        this.$http.get(this.$service.userSearchNoAuth+'?roleName=售前客服&pageSize=50000').then(data=>{
          this.payBefore = data.data.records
        })
        this.$http.get(this.$service.userSearchNoAuth+'?roleName=售中客服&pageSize=50000').then(data=>{
          this.paying = data.data.records
        })
        // var obj = {"companyName":""}
        // this.$http.post(this.$service.getUserCompanyList,obj).then(data=>{
        //   this.companyList = data.data
        // })
        this.$http.get(this.$service.getCompanyListAboutClient).then(data=>{
          this.companyList = data.data
          console.log(this.companyList);
        })
        this.$http.get(this.$service.findUsersAndBranchOrg).then(data=>{
          this.principalList = data.data
          // console.log(this.principalList,"1111111");
        })
        this.$http.get(this.$service.searchFirstLevelOrgs).then(data=>{
          this.principalCompanyList = data.data
          // console.log(this.principalCompanyList,"2222222");
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
          if(this.payWayStr[this.payWayStr.length-1] === ''){
            this.payWayStr = ['']
          }else if(this.payWayStr.indexOf('')>-1){
            this.payWayStr.splice(this.payWayStr.indexOf(''), 1)
          }else{
            if(this.payWayStr.length == 3){
              this.payWayStr = ['']
            }
          }
        }
        this.sousuo()
      },
      //  搜索条件改变的搜索
      sousuo(){
        this.getUserInfo()
      },
      // 弹出框部分
      changeDialogVisible(obj){
        if(obj.type == 2){
          if(!obj.save){
            return
          }
          var params = obj
         console.log(params,12312231);
          this.$http.post(this.$service.userSetUpdata, params).then(data => {
          if (data.code == 200) {
              console.log(data.data);
              this.$message.success('编辑成功')
              this.getUserInfo()
            }
          }).catch((e) => {
            console.log(e)
          })
        }
      },
      // 获取用户管理列表
      getUserInfo(type){
        if(type === 3){
          this.pageNum = 1
          this.pageSize = 10
        }
        var params = {
          "currentPage":this.pageNum,
          "pageSize":this.pageSize,
          "id": this.id != ''?(this.id):null, //63
          'accountPeriodLimitStatus':this.accountPeriodLimitStatusName != ''?(this.accountPeriodLimitStatusName).join(','):null,  //账期额度状态
          "creditCode": this.creditCode !== ''?(this.creditCode):null,        // 企业信用代码
          "payWayStr": this.payWayStr !== ''?(this.payWayStr).join(','):null,   // 结算方式 0:付款买单 1：月结买单 2-固定时间
          // "pscsId": this.pscsId !== ''?(this.pscsId):null,      // 售前客服id
          "customerResponsibleId": this.pscsId !== ''?(this.pscsId):null,      // 客户负责人id
          "sysOrgId": this.sysOrgId !== ''?(this.sysOrgId):null,      // 客户负责人所在分公司id
          "overDueOrExcessLimitStrategy": this.overDueOrExcessLimitStrategy != ''?(this.overDueOrExcessLimitStrategy):null,          // 自定义配置 1-否  2-是
          "openStatus": this.openStatus !== ''?(this.openStatus):null  // 客户开放状态 1-开放 0-冻结
        }
        // return console.log('信息：',params)
        this.$http.post(this.$service.getUserInfoList, params).then(data => {
          if (data.code == 200) {
            var payWayArray = ['付款买单','月结买单','固定天数']
            var overDueArray = ['','基础设置','自定义']
            var openStatusArray = ['冻结','开放']
            // var overDueOrExcessLimitStrategyArray = ['','基础设置','自定义']
            var overDueOrExcessLimitStrategyArray = ['','否','是']
            var accountPeriodLimitStatusArray = ['','超期','超额']
            // var creditGradeArray = ['','A级','B级','C级','D级','E级']
            var creditGradeArray = ['','A','B','C','D','E']
            var array = JSON.parse(JSON.stringify(data.data.   records))
            for (let i = 0; i < array.length; i++) {
              array[i].payWayName = payWayArray[Number(array[i].payWay)]
              array[i].openStatusName = openStatusArray[Number(array[i].openStatus)]
              array[i].overDueOrExcessLimitStrategyName = overDueOrExcessLimitStrategyArray[Number(array[i].overDueOrExcessLimitStrategy)]
              // array[i].accountPeriodLimitStatusName = accountPeriodLimitStatusArray[Number(array[i].accountPeriodLimitStatus)]
              array[i].temporaryQuotaPeriod = array[i].poraryStart?((array[i].poraryStart).split('-').join('/'))+'-'+(array[i].poraryEnd).split('-').join('/'):''
              array[i].creditGradeName = array[i].creditGrade?creditGradeArray[Number(array[i].creditGrade)]:''
              console.log('超额：',array[i].isOverDue , '超期：',array[i].isExcess);
              if(array[i].isOverDue && array[i].isExcess){
                array[i].accountPeriodLimitStatusName = '超期、超额'
              }else if(array[i].isExcess && !array[i].isOverDue){
                array[i].accountPeriodLimitStatusName = '超额未超期'
              }else if(array[i].isOverDue && !array[i].isExcess){
                array[i].accountPeriodLimitStatusName = '超期未超额'
              }else{
                array[i].accountPeriodLimitStatusName = '正常'
              }
            }
            this.tableData = array
            this.total = data.data.total
          } else {
            this.$message.error(data.message)
          }
        }).catch((e) => {
          console.log(e)
        })
      },
      //获取代理列表
      initAgentSearch() {
        var fn = ''
        if(this.sysname){
          for(let i=0;i<this.paying.length;i++){
            if(this.paying[i].id == this.sysname){
                fn = this.paying[i].name
            }
            if(this.paying[i].name == this.sysname){
                fn =this.paying[i].id
            }
          }
        }
        var params = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          agentName: this.agentName,
          agentCode: this.agentCode,
          mscsName: fn, // 新增sysname 售中客服
          sceneFlag: 0,
        }
        this.$http.post(this.$service.agentList, params).then(data => {
          if (data.code == 200) {
            this.total = data.data.total
            this.tableData = data.data.records
          } else {
            this.$message.error(data.message)
          }
        })
      },
      //清空
      restClick() {
        this.companyName = ''
        this.id = ''
        this.creditCode = ''
        this.accountPeriodLimitStatusName = ['']
        this.payWayStr = ['']
        this.pscsId = ''
        this.overDueOrExcessLimitStrategy = ''
        this.pageSize = 10
        this.pageNum = 1
        this.openStatus= ''
        this.getUserInfo(3)
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
      // 获取公司名称
      // inputCompany(companyName){
      //   if(companyName == [] || companyName == ''){
      //     return
      //   }
      //   var obj = {"companyName":companyName}
      //   this.$http.post(this.$service.getUserCompanyList,obj).then(data=>{
      //     this.companyList = data.data
      //   })
      // },
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
        this.getUserInfo()
      },
      handleSizeChange(e) {
        this.pageSize = e
        this.getUserInfo()
      },
      closeDialog() {
        this.dialogFormVisible = false
        this.agentId = ''
      },
      handledcButton(e){
        if(e.obj.length>0){
          var json = e.obj
          this.$http.post(this.$service.exportUserListAll,json, {
              responseType: 'arraybuffer'
            }).then(res=>{
              let enc = new TextDecoder("utf-8");
              let uint8_msg = new Uint8Array(res);  // 也可能是res.data
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
              aLink.setAttribute('download', '用户管理列表' + '.xlsx') // 设置下载文件名称
              aLink.click()
              document.body.appendChild(aLink)
          })
        }else{
          var json = {
            "currentPage":this.pageNum,
            "pageSize":this.pageSize,
            "id": this.id != ''?(this.id):null, //63
            'accountPeriodLimitStatusName':this.accountPeriodLimitStatusName != ''?(this.accountPeriodLimitStatusName).join(','):null,  //账期额度状态
            "creditCode": this.creditCode != ''?(this.creditCode):null,        // 企业信用代码
            "payWayStr": this.payWayStr != ''?(this.payWayStr).join(','):null,   // 结算方式 0:付款买单 1：月结买单 2-固定时间
            "pscsId": this.pscsId != ''?(this.pscsId):null,      // 售前客服id
            "overDueOrExcessLimitStrategy": this.overDueOrExcessLimitStrategy != ''?(this.overDueOrExcessLimitStrategy):null,          // 自定义配置 1-否  2-是
            "openStatus": this.openStatus != ''?(this.openStatus):null  // 客户开放状态 1-开放 0-冻结
          }
          this.$http.post(this.$service.exportUserList,json, {
              responseType: 'arraybuffer'
            }).then(res=>{
              let enc = new TextDecoder("utf-8");
              let uint8_msg = new Uint8Array(res);  // 也可能是res.data
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
              aLink.setAttribute('download', '用户管理列表' + '.xlsx') // 设置下载文件名称
              aLink.click()
              document.body.appendChild(aLink)
          })
        }
    }
    },
    watch: {//exportUserList
      tableData(idx) {
        return idx
      }
    },
    components: {
      Table,UserDialog
    }
  }
</script>

<style scoped lang="less">
  @import url("../../assets/icon/iconfont.css");

  .content-wrapper {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    padding-bottom: 0px;
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
  .content{
    display: flex;
    flex-direction: column;
  }
  .tableFlex{
    flex: 1;
    height: 1;
    overflow: scroll;
  }
  /deep/ .el-form-item{
    margin-bottom: 8px !important;
    margin-right: 30px !important;
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
