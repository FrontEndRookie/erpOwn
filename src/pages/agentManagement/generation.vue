<template>
    <div class="body">
        <div class="searchTop">
            <el-form :inline="true" size="medium" class="demo-form-inline">
                <div class="content-search-normal">
                   
                    <el-form-item label="供应商名称">
                        <el-select
                        id="sysname"
                        v-model="form.agentName"
                        placeholder="请输入供应商名称"
                        clearable
                        filterable
                        remote
                        reserve-keyword
                        maxlength="100"
                        style="width: 200px"
                        >
                        <el-option
                            v-for="item in agentOpt"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name"
                        >
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="统一社会信用代码">
                      <el-input
                      id="sysname"
                        v-model="form.socialCreditCode"
                        @input="form.socialCreditCode=$utils.pureNumber(form.socialCreditCode,2)"
                        clearable
                        maxlength="18"
                        style="width: 200px"
                        placeholder="请输入统一社会信用代码"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="日期">
                        <div class="block" style="display: inline-block;">
                          <el-date-picker
                            style="width:171px"
                            v-model="form.startDate"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptionsStart"
                            placeholder="起始日期">
                          </el-date-picker>
                        </div>
                        ——
                        <div class="block"  style="display: inline-block;">
                          <el-date-picker
                            v-model="form.endDate"
                            type="date"
                            style="width:171px"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptionsEnd"
                            placeholder="结束日期">
                          </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="航线负责人">
                        <el-select
                        id="sysname"
                        v-model="form.principalName"
                        placeholder="请输入航线负责人"
                        clearable
                        filterable
                        remote
                        reserve-keyword
                        maxlength="10"
                        style="width: 200px"
                        >
                        <!-- <el-option
                            v-for="item in principalArray"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        > -->
                        <el-option
                            v-for="item in principalArray"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name"
                        >
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="一代操作">
                        <el-select
                        id="sysname"
                        v-model="form.operatorName"
                        placeholder="请输入一代操作"
                        clearable
                        filterable
                        remote
                        reserve-keyword
                        maxlength="10"
                        style="width: 200px"
                        >
                        <el-option
                            v-for="item in salesNameArray"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name"
                        >
                        <!-- <el-option
                            v-for="item in salesNameArray"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        > -->
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="账期额度状态">
                        <el-select
                        id="sysname"
                        v-model="form.isOverdueAndExcess"
                        placeholder=""
                        clearable
                        filterable
                        remote
                        reserve-keyword
                        maxlength="10"
                        style="width: 150px"
                        >
                        <el-option
                            v-for="item in overdueAndExcessArr"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="结算方式">
                        <el-select
                        id="sysname"
                        v-model="form.settlementWay"
                        placeholder=""
                        clearable
                        filterable
                        remote
                        reserve-keyword
                        maxlength="10"
                        style="width: 150px"
                        >
                        <el-option
                            v-for="item in buyWayArr"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否入驻">
                        <el-select
                        id="sysname"
                        v-model="form.hasAccountId"
                        placeholder=""
                        clearable
                        filterable
                        remote
                        reserve-keyword
                        maxlength="10"
                        style="width: 100px"
                        >
                        <el-option
                            v-for="item in hasAccountArr"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否合作">
                        <el-select
                        id="sysname"
                        v-model="form.isCooperation"
                        placeholder=""
                        clearable
                        filterable
                        remote
                        reserve-keyword
                        maxlength="10"
                        style="width: 100px"
                        >
                        <el-option
                            v-for="item in contractArr"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否有合同">
                        <el-select
                        id="sysname"
                        v-model="form.isContract"
                        placeholder=""
                        clearable
                        filterable
                        remote
                        reserve-keyword
                        maxlength="10"
                        style="width: 100px"
                        >
                        <el-option
                            v-for="item in contractArr"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-row>
                        <el-button @click="getlistPrimaryAgent" size="medium" type="primary" v-auth="['252000_B', '252009_B', '252010_B']">搜索 </el-button>
                        <el-button @click="restClick" size="medium" type="primary" v-auth="['252000_B', '252009_B', '252010_B']">清空</el-button>
                        </el-row>
                    </el-form-item>
                    <el-form-item style="float: right;margin-right: 0">
                        <el-row>
                        <el-button @click="newAdd(1)" style="background-color: #E6A23C;color:#FFFFFF;border-color: #E6A23C" size="medium" v-auth="['252002_B']">新增</el-button>
                        <el-button @click="downloadExecl" style="background-color: #2273ce;color:#FFFFFF;border-color: #2273ce;" size="medium" v-auth="['252003_B']">导出列表</el-button>
                        </el-row>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="tableBody">
            <Dialog :dialogVisible="dialogVisible"
            @changeDialogVisible='changeDialogVisible'
            :salesNameArray='salesNameArray'
            :principalArray='principalArray'
            :indexObj='indexObj'
            :historyArr='historyArr'></Dialog>
            <Table :tableData='tableData' :zSizeNum='zSizeNum'
            @showDialogVisible='showDialogVisible'
            @tabChange='tabChange'></Table>
        </div>
        <el-dialog
          title="提示"
          :visible.sync="dialogShow"
          width="30%"
          @close="dialogChange(false)"
          :close-on-click-modal="false">
          <span style="display:inline-block;height:60px;line-height: 60px;">{{messageTittle}}</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogChange(false)">取 消</el-button>
            <el-button type="primary" @click="dialogChange(true)">确 定</el-button>
          </span>
        </el-dialog>
        <div style="width:100%;display:flex;flex-direction: row;justify-content:center;">
          <div
            class="block"
            style="margin: 40px 100px; margin-left: 300px; margin-bottom: 20px"
          >
            <el-pagination
              v-if="$utils.authCheckHidden(['252000_B', '252009_B', '252010_B']) === 'visible'"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNumber"
              :page-sizes="[10, 20, 30, 40, 50]"
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
  import Table from './component/table.vue'
  import Dialog from './component/dialog.vue'
  import { toData } from '@/util/assist'
  export default {
    components: {
      Table,
      Dialog
    },
    data() {
      return {
        pickerOptionsStart: {
          disabledDate: time => {
            const endDateVal = new Date(this.form.endDate).getTime()
            if (endDateVal) {
              return time.getTime() > endDateVal - 0
            }
          }
        },
        pickerOptionsEnd: {
          disabledDate: time => {
            const beginDateVal = new Date(this.form.startDate).getTime()
            if (beginDateVal) {
              return time.getTime() < beginDateVal - 0
            }
          }
        },
        labelName:'',
        dialogId:'',
        dialogShow:false,
        messageTittle:'',
        //table
        historyArr:[],
        indexObj:null,
        indexId:'',
        NumberType:'初始占位',
        principalArray:[],//航线负责人id
        salesNameArray:[],//  一代操作人员id 可以为null
        gridData:[],
        hasAccountArr:[{id:1,name:'是'},{id:2,name:'否'},{id:3,name:'全部'}],
        contractArr:[{id:1,name:'是'},{id:0,name:'否'},{id:null,name:'全部'}],
        overdueAndExcessArr:[{id:1,name:'超额'},{id:2,name:'超期'},{id:3,name:'超额，超期'},{id:null,name:'全部'}],
        buyWayArr:[{id:1,name:'付款买单'},{id:2,name:'月结买单'},{id:3,name:'固定天数'},{id:null,name:'全部'}],
        dialogVisible:false,
        roleNameA:'',
        paying:[],
        tableData: [],
        pageSize: 10,//
        pageNum: 1,
        pageNumber: 1,//
        zSizeNum:0,
        total: 0,//
        agentOpt:[],
        form:{
            isOverdueAndExcess:null, //账期额度状态 1超额，2超期，3超额，超期
            settlementWay:null, //结算方式 1付款买单 2月结买单 3固定天数
            isCooperation:null, // 合作 null为全部 1是 0否"
            isContract:null, // 合同 null为全部 1是 0否"
            agentName: "",	 // 	代理名称 eg:广东速捷国际物
            endDate: "",			   //   结束时间 eg:2021-12-29
            hasAccountId: 3,			         // 是否入驻   1,是，2无，3全部
            operatorName: "",			         // 操作人员名称
            date:'',
            // pageNum: 1,				             // 分页
            // pageSize: 20,  
            principalName: "",		      	 // 航线人员名称
            socialCreditCode: "",		    	 // 社会统一信用代码
            startDate: ""				           // 开始时间
        },
        fromObj:{},
        labelPosition: 'right',
        agentName: '',
        agentCode: '',
        dialogTitle: '',
        sysname:'', // 新加售中客服
        dialogFormVisible: false,
        // dialogFormVisibleFFF: false, //是否显示售中客服
      }
    },
    mounted() {
    //   this.initAgentSearch()
    //   this.operateData()
    //   var nameA = JSON.parse(sessionStorage.getItem('userInfo')).loginName
    //   if((nameA == 'admin')||(nameA == '13918289152')){
    //     this.roleNameA = true
    //   }else{
    //     this.roleNameA = false
    //   }
      this.getId()
      // this.getlistPrimaryAgent()
    },
     watch: {
        NumberType: {
            handler(newName, oldName) {
              this.getlistPrimaryAgent()
            },
            // immediate: true,
            deep: true
        },
        // from1:{
        //     handler(newName, oldName) {
        //         this.showEdf(1,newName)
        //     },
        //     immediate: true,
        //     deep: true
        // }
    },
    methods: {
      // pickData(){
      //   // return time.getTime() > this.form.startDate;
      //         if(this.form.startDate){
      //           return(
      //             time.getTime()<new Data(this.form.startDate).getTime()
      //           )
      //         }
      // },
      
      // pickerOptions: {
      //   disabledDate(time) {
      //     console.log(new Data(this.form.startDate).getTime());
      //       // return time.getTime() > this.form.startDate;
      //       if(this.form.startDate){
      //         return(
      //           time.getTime()<new Data(this.form.startDate).getTime()
      //         )
      //       }
      //   },
      // },
      // 
      dialogChange(type){
        this.dialogShow = false
        if(this.messageTittle.indexOf('一代资格') > -1){
          console.log("改变资格");
          if(type){
            this.changePrimaryAgentStatus(this.dialogId) //改变状态 执行请求改变
          }else{
            this.getlistPrimaryAgent();  //不改变状态 获取原始数据初始化
          }
        }else if(this.messageTittle.indexOf('标签资格') > -1){
          console.log("改变标签");
          if(type){
          this.changeLabelStatus(this.dialogId) //改变状态 执行请求改变
          }else{
            this.getlistPrimaryAgent();  //不改变状态 获取原始数据初始化
          }
        }
      },
      //编辑
      showDialogVisible(obj){
        this.indexObj = this.tableData[obj.index]
        if(obj.type == 3){
          // this.history(this.tableData[obj.index].accountId)
          this.history(this.tableData[obj.index].id)
        }else if(obj.type == 9){
          this.dialogShow = true
          this.dialogId = this.tableData[obj.index].id
          if (obj.status == 1) {
            this.messageTittle = '是否确认取消一代资格？'
          }else{
            this.messageTittle = '是否确认恢复一代资格？'
          }
          // this.changePrimaryAgentStatus(this.tableData[obj.index].id)
        }else if(obj.type == 11){
          this.dialogShow = true
          this.dialogId = this.tableData[obj.index].id
          this.labelName = obj.item
          this.messageTittle = '是否恢复该标签资格？'
        }
        this.newAdd(obj.type)
      },
      handleSizeChange(e) {
        this.pageSize = e;
        this.zSizeNum = this.pageSize * (this.pageNumber - 1)
        this.getlistPrimaryAgent();
        // console.log(this.pageSize, this.pageNumber);
      },
      handleCurrentChange(e) {
        this.pageNumber = e;
        this.zSizeNum = this.pageSize * (this.pageNumber - 1)
        this.getlistPrimaryAgent();
      },
      tabChange(e){
        this.NumberType = e
        this.pageNumber = 1
        // console.log(e);
      },
      // 获取航线负责人id与一代操作人员id
      getId(){
        // 航线负责人id
        this.$http.get(this.$service.userSearchNoAuth+'?roleName=航线负责人&pageSize=50000').then(data=>{
          this.principalArray = data.data.records
          // console.log(this.principalArray);
        })
        // 一代操作人员id 可以为null 售中
        this.$http.get(this.$service.userSearchNoAuth+'?roleName=售中客服&pageSize=50000').then(data=>{
          this.salesNameArray = data.data.records
          // console.log(this.salesNameArray);
        })
        // 获取代理列表
        // var obj1 = {
        //   agentName: '',
        // };
        this.$http.post(this.$service.getlistAgent,'').then((data) => {
        // this.loading = false;/
        if (data.code == 200) {
          var array = [];
          for (let index = 0; index < data.data.length; index++) {
            array[index] = {name:data.data[index]}
          }
          this.agentOpt = array
        } else {
          this.$message.error(data.message);
        }
      });
      },
      // 修改供应商级别
      async changeLevel (objct,from){
          // console.log(objct,from);
          var obj ={id : objct.id,
            level:from.level}
          var data =  await this.$http.post(this.$service.changeLevel,obj)
          if (data.code == 200) {
          this.$message.success(data.message)
          this.getlistPrimaryAgent()
          // console.log(data);
        } else {
          this.$message.error(data.message);
        }
      },
      // 导出列表
      downloadExecl(){//downloadExeclAgent
        var json = {
            'isOverdueAndExcess':this.form.isOverdueAndExcess , //账期额度状态 1超额，2超期，3超额，超期
            'settlementWay':this.form.settlementWay , //结算方式 1付款买单 2月结买单 3固定天数
            'isCooperation':this.form.isCooperation , // 合作 null为全部 1是 0否"
            'isContract':this.form.isContract , // 合同 null为全部 1是 0否"
            "agentName":          this.form.agentName,	 // 	代理名称 eg:广东速捷国际物
            "endDate":            this.form.endDate        ,			   //   结束时间 eg:2021-12-29
            "hasAccountId":       this.form.hasAccountId,			         // 是否入驻   1,是，2无，3全部
            "operatorName":       this.form.operatorName,			         // 操作人员名称
            "pageNum":            this.pageNumber,			             // 分页
            "pageSize":           this.pageSize,
            "principalName":      this.form.principalName,		      	 // 航线人员名称
            "socialCreditCode":   this.form.socialCreditCode,		    	 // 社会统一信用代码
            "startDate":          this.form.startDate,    				           // 开始时间
            'status':             this.NumberType,                       //0待审核 1审核通过 2审核未通过 ''为全部，及一代
            // 'status':             '',                       //0待审核 1审核通过 2审核未通过 ''为全部，及一代
          }
          if(json.isOverdueAndExcess == null || json.isOverdueAndExcess ===""){
            delete json.isOverdueAndExcess
          }
          if(json.settlementWay == null || json.settlementWay ===""){
            delete json.settlementWay
          }
          if(json.isCooperation == null || json.isCooperation ===""){
            delete json.isCooperation
          }
          if(json.isContract == null || json.isContract ===""){
            delete json.isContract
          }
        json = toData(json)
        this.$http.get(this.$service.downloadExeclAgent+'?'+json, {
            responseType: 'arraybuffer'
          }).then(res=>{
          // this.$http.post(this.$service.downloadExeclAgent, json,{
          //   responseType: 'arraybuffer'
          // }).then(res=>{
            const aLink = document.createElement("a");
            let blob = new Blob([res], {
              type: "application/vnd.ms-excel"
            })
            aLink.href = URL.createObjectURL(blob)
            aLink.setAttribute('download', '一代入驻列表' + '.xlsx') // 设置下载文件名称
            aLink.click()
            document.body.appendChild(aLink)
        })
      },
      // 保存或更新代理 
        async saveUpdateAgent(objct,from){
          // return
          // console.log('保存或更新代理：'+from.primaryAgentStatus );
          // console.log(from);
          var obj = {
            'isCooperation': from.isCooperation===''?null:from.isCooperation, //
            'isContract': from.isContract===''?null:from.isContract, //
            'airlineComment': from.airlineComment?from.airlineComment:null, //
            'settlementWay': from.settlementWay?from.settlementWay:null, //
            'settlementDays': from.settlementDays===''||from.settlementDays==='/'?null:from.settlementDays, //
            'creditLimit': from.creditLimit===''||from.creditLimit==='/'?null:from.creditLimit, //
            'accountId': from.accountId?from.accountId:null,				//用户企业账户的id  新增为null
            "agentCode": from.agentCode?from.agentCode:'',		       //代理简称
            "agentName": from.agentName?from.agentName:'',            //  代理名称
            "applyMethod": from.applyMethod?from.applyMethod:'平台',          //  提交方式：	平台，后台 
            "contactsName": from.contactsName?from.contactsName:'',         //  代理联系人
            "createTime": from.createTime?from.createTime:null,           //  申请时间，可以为null
            "dominantRoute":from.dominantRoute?from.dominantRoute:null,        //  优势航线 可以为null
            "fileUrl":from.fileUrl?from.fileUrl:'',              //  营业执照全路径地址
            "id": from.id?from.id:null,                   //  				新增为null
            "isSettled": from.isSettled?from.isSettled:0,            //  是否入驻0否,1是		新增为0
            isSettledName: from.isSettledName?from.isSettledName:'否',            //  是否入驻0否,1是		新增为0
            "level": from.level?from.level:null,                //  供应商级别            新增为null
            "namePy": from.namePy?from.namePy:'',               //  名称首字母拼音
            "phoneNum": from.phoneNum?from.phoneNum:'',             //  代理联系电话
            "primaryAgentStatus":(from.primaryAgentStatus === 0||from.primaryAgentStatus === 1)?from.primaryAgentStatus:1,   //  一代资格     		一代资格,1：已有，0：没有  新增都是0
            primaryAgent:from.primaryAgent?from.primaryAgent:false,
            "principalId": from.principalId?from.principalId:null,          //  航线负责人id 可以null
            principalName:from.principalName?from.principalName:'',
            "salesId": from.salesId?from.salesId:null,              //  一代操作人员id 可以为null
            salesName:from.salesName?from.salesName:'',
            "socialCreditCode": from.socialCreditCode?from.socialCreditCode:'',     //  统一社会信用代码 使用名称调用接口获取
            "status": from.status?from.status:0,               //  供应商状态 -1删除 0待审核 1审核通过 2审核未通过 ，新增都是0
            "type": from.type?from.type:'',                 //  供应商类型:1:一代,2:刻章,3:磁检,4:报关行,5:其他
            typeName:from.typeName?from.typeName:'',
            "updateTime": from.updateTime?from.updateTime:'' ,           //  更新时间，可以为null
            "busName": from.busName?from.busName:''  ,          //  企业联系人
            "busPhone": from.busPhone?from.busPhone:''    ,        //  联系电话
          }   
          // console.log(obj);
          // 新增时以下为必填字段，其他可以无
          // {
          //   "agentCode": "",
          //   "agentName": objct.from.agentName,
          //   "applyMethod": "平台",
          //   "contactsName": objct.from.contactsName,
          //   "fileUrl":  objct.from.fileUrl,
          //   "isSettled": 0,
          //   "namePy": objct.from.namePy,
          //   "phoneNum": objct.from.phoneNum,
          //   "primaryAgentStatus": 0,
          //   "socialCreditCode": objct.from.socialCreditCode,
          //   "status": 0,
          //   "type": 0,
          // }
          var data =  await this.$http.post(this.$service.saveOrUpdateAgent,obj, {
            headers: {
              diffFlag: obj.accountId ? 1 : 2,
            },
          })
          if(data.code == 200){
              this.$message.success(data.message)
              this.getlistPrimaryAgent()
              this.getId()
            }else{
              this.$message.error(data.message)
            }
          // console.log(data);
        },
        // 一代管理查询&&获取详情
        async getlistPrimaryAgent(){
          var obj = {
            'isOverdueAndExcess': this.form.isOverdueAndExcess , //账期额度状态 1超额，2超期，3超额，超期
            'settlementWay':      this.form.settlementWay , //结算方式 1付款买单 2月结买单 3固定天数
            'isCooperation':      this.form.isCooperation , // 合作 null为全部 1是 0否"
            'isContract':         this.form.isContract , // 合同 null为全部 1是 0否"
            "agentName":          this.form.agentName,	 // 	代理名称 eg:广东速捷国际物
            "endDate":            this.form.endDate        ,			   //   结束时间 eg:2021-12-29
            "hasAccountId":       this.form.hasAccountId,			         // 是否入驻   1,是，2无，3全部
            "operatorName":       this.form.operatorName,			         // 操作人员名称
            "pageNum":            this.pageNumber,			             // 分页
            "pageSize":           this.pageSize,
            "principalName":      this.form.principalName,		      	 // 航线人员名称
            "socialCreditCode":   this.form.socialCreditCode,		    	 // 社会统一信用代码
            "startDate":          this.form.startDate,    				           // 开始时间
            'status':             this.NumberType,                       //0待审核 1审核通过 2审核未通过 ''为全部，及一代
            // 'status':             '',                       //0待审核 1审核通过 2审核未通过 ''为全部，及一代
          }
          // console.log(obj);
            var data =  await this.$http.post(this.$service.listPrimaryAgent,obj, {
              headers: {
                diffFlag: {
                  '': 1,
                  0: 2,
                  2: 3,
                }[this.NumberType]
              },
            })
            if(data.code == 200){
              this.total = data.data.total
              var primaryAgentArray = [false,true]
              // var principalArray = []//航线负责人id 
              // var salesNameArray = []//  一代操作人员id 可以为null agentOpt
              var isSettledArray = ['否','是']
              var typeArray=['','一代','刻章','磁检','报关行','其他']      //  供应商类型:1:一代,2:刻章,3:磁检,4:报关行,5:其他
              var isOverdueAndExcessArr = ['','超额','超期','超额，超期',]
              var settlementWayArr = ['','付款买单','月结买单','固定天数',]
              var yOrNArr = ['否','是']
              var array = JSON.parse(JSON.stringify(data.data.records))
              for (let i = 0; i < array.length; i++) {
                if(array[i].label !== null){
                  array[i].label = (array[i].label).split(',')
                  var arrItem = ['',"保仓",'锁价']
                  for (let j = 0; j < array[i].label.length; j++) {
                    array[i].label[j] = arrItem[Number(array[i].label[j])]
                  }
                }else{
                }
                if(array[i].isOverdueAndExcess !== null){
                  array[i].isOverdueAndExcessName = isOverdueAndExcessArr[Number(array[i].isOverdueAndExcess)]
                }
                if(Number(array[i].isOverdue)=== 1){
                  array[i].isOverdueAndExcessName = '超期'
                }
                if(Number(array[i].isExcess)=== 1){
                  array[i].isOverdueAndExcessName = '超额'
                }
                if(Number(array[i].isExcess)=== 1 && Number(array[i].isOverdue)=== 1){
                  array[i].isOverdueAndExcessName = '超期，超额'
                }
                if(array[i].settlementWay !== null){
                  array[i].settlementWayName = settlementWayArr[Number(array[i].settlementWay)]
                }
                if(array[i].isCooperation !== null){
                  array[i].isCooperationName = yOrNArr[Number(array[i].isCooperation)]
                }
                if(array[i].settlementDays==null){
                  array[i].settlementDays='/'
                }
                if(array[i].creditLimit==null){
                  array[i].creditLimit='/'
                }
                if(array[i].isContract !== null){
                  array[i].isContractName = yOrNArr[Number(array[i].isContract)]
                }
                var salesNamea='' ,principalIda=''
                array[i].primaryAgent = primaryAgentArray[Number(array[i].primaryAgentStatus)]
                // array[i].principalName = primaryAgentArray[array[i].primaryAgentStatus]
                array[i].typeName = typeArray[Number(array[i].type)]
                array[i].isSettledName = isSettledArray[Number(array[i].isSettled)]
                for (let j = 0; j < this.salesNameArray.length; j++) {
                  if(this.salesNameArray[j].name == array[i].salesName){
                    salesNamea = this.salesNameArray[j].id
                    break
                  }
                }
                for (let j = 0; j < this.principalArray.length; j++) {
                  if(this.principalArray[j].name == array[i].principalName){
                    principalIda = this.principalArray[j].id
                    break
                  }
                }
                array[i].salesId = salesNamea
                array[i].principalId = principalIda
              }
              this.tableData = ''
              this.tableData = array
              // console.log(array);
            }else{
              this.$message.error(data.message)
            }
            // console.log(data);
        },
        // 查看操作历史
        async history(agentdid){
            var obj = agentdid
           var data =  await this.$http.post(this.$service.ydHistory,obj, {
              headers: {
                diffFlag: obj.accountId ? 2 : 1,
              },
            })
            if(data.code == 200){
              this.historyArr = data.data
            }else{
              this.$message.error(data.message)
            }
        } ,
        // 清空
        restClick(){
          this.form = {
            isOverdueAndExcess:null, //账期额度状态 1超额，2超期，3超额，超期
            settlementWay:null, //结算方式 1付款买单 2月结买单 3固定天数
            isCooperation:null, // 合作 null为全部 1是 0否"
            isContract:null, // 合同 null为全部 1是 0否"
            agentName: "",	 // 	代理名称 eg:广东速捷国际物
            endDate: "",			   //   结束时间 eg:2021-12-29
            hasAccountId: 3,			         // 是否入驻   1,是，2无，3全部
            operatorName: "",			         // 操作人员名称
            // pageNum: 1,				             // 分页
            // pageSize: 20,  
            principalName: "",		      	 // 航线人员名称
            socialCreditCode: "",		    	 // 社会统一信用代码
            startDate: ""				           // 开始时间
          }
          this.getlistPrimaryAgent()
        },
        // 修改一代资格
        async changePrimaryAgentStatus(id){
            var obj ={id : id}
            var data =  await this.$http.post(this.$service.changePrimaryAgentStatus,obj)
             if(data.code == 200){
              this.$message.success(data.message)
              this.getlistPrimaryAgent()
            }else{
              this.$message.error(data.message)
            }
            // console.log(data);
        },
        // 标签资格
        async changeLabelStatus(id){
            var arrItem = ['',"保仓",'锁价']
            var index = ''+arrItem.indexOf(this.labelName)
            var obj ={id : id,
                      label:index}
            var data =  await this.$http.put(this.$service.deleteLable,obj)
             if(data.code == 200){
              this.$message.success(data.message)
              this.getlistPrimaryAgent()
            }else{
              this.$message.error(data.message)
            }
            // console.log(data);
        },
        // 资格审核
        async examine (object,from){
          if(from.status == 2){
              // 不通过调用
              var obj={
                "id": from.id,				                 // 供应商id
                "status": 2,				               // 状态 2 为不通过
                "examineMassage": from.examineMassage?from.examineMassage:''	//	  审核信息，
              }
            }else if(from.status == 1){
              // 审核通过的调用//
              var obj={
                'oldAgentId':from.oldAgentId,     //oldid
                "id": from.id,				                 //   供应商id
                "status": 1,				               //   状态 1 为通过
                "level" : from.level?from.level:'',				               //   代理等级
                "principalId":from.principalId?from.principalId:"",			             // 	航线负责人id
                "salesId":from.salesId?from.salesId:'',			                 // 	一代操作人id
                "examineMassage": from.examineMassage?from.examineMassage:'',	 // 	审核信息，
                "fileUrl": from.fileUrl?from.fileUrl:''	, // 	图片
                "agentName": from.agentName?from.agentName:''	, // 	公司名称
                "socialCreditCode": from.socialCreditCode?from.socialCreditCode:'',	 // 信用代码	
                "namePy": from.namePy?from.namePy:'',	 // 首字母
              }
            }
            // console.log(obj);
            var data =  await this.$http.post(this.$service.examine,obj, {
              headers: {
                diffFlag: {
                  1: 1, // 审核通过
                  2: 2, // 驳回
                }[from.status]
              }
            })
            if(data.code == 200){
              this.$message.success(data.message)
              this.getlistPrimaryAgent()
            }else{
              this.$message.error(data.message)
            }
        },
        changeDialogVisible(e){
          // console.log(e);
            this.dialogVisible = 0
            var obj = JSON.parse(JSON.stringify(this.indexObj))
            if(e.type === 1 && e.save == true ){
             this.saveUpdateAgent(obj,e.from)
              // this.dialogVisible1 = false
            }else if(e.type === 2 && e.save == true ){
              if(e.from.account.length != 11){
                this.$message.error('请输入十一位手机号')
              }else{

              }
            }else if(e.type === 3 && e.save == true ){
              // this.dialogVisible3 = false/
            }else if(e.type === 4 && e.save == true ){
              this.examine(obj,e.from)
            }else if(e.type === 5 && e.save == true ){
              if(e.from.phoneNum.length != 11){
                this.$message.error('请输入十一位手机号')
              }else{
                this.saveUpdateAgent(obj,e.from)
              }
            }else if(e.type === 6 && e.save == true ){
              this.changeLevel(obj,e.from)
            }else if(e.type === 7 && e.save == true ){ //驳回
              this.examine(obj,e.from)
            }else if(e.type === 8 && e.save == true ){  //审核通过
              this.examine(obj,e.from)
            }else if(e.type === 10 && e.save == true ){
              // this.changeLevel(obj,e.from)
            }
        },
        newAdd(number){
          // console.log(number);
           this.dialogVisible = number
          // if(number == 1){
          //   setTimeout(()=>{
          //     this.dialogVisible1 = true
          //   },0)
          // }else if(number == 2){
          //   this.dialogVisible2 = true
          // }else if(number == 3){
          //   this.dialogVisible3 = true
          // }else if(number == 4){
          //   this.dialogVisible4 = true
          // }
        }
    }
  }
</script>
<style scoped>
    .body{
        width:100%;
        height:100%;
        overflow:scroll;
    }
    .searchTop{
        margin: 20px;
        margin-bottom: 0;
    }
    .tableBody{
        width: 100%;
    }
    .el-form-item {
      margin-bottom: 22px !important;
    }
</style>