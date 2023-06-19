<template>
    <div class="body">
        <div class="searchTop">
            <el-form :inline="true" size="medium" class="demo-form-inline">
                <div class="content-search-normal">
                   
                    <el-form-item label="周期">
                        <el-select v-model="value" size="" style="width: 260px;" placeholder="请选择">
                              <el-option
                                v-for="item in timeArray"
                                :key="item.id"
                                :label="item.nowWeekChain"
                                :value="item.id">
                              </el-option>
											</el-select>
                    </el-form-item>
                    <el-form-item label="位置">
                        <el-select
                        id="sysname"
                        v-model="form.position"
                        placeholder=""
                        clearable
                        filterable
                        remote
                        reserve-keyword
                        maxlength="10"
                        style="width: 150px"
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
                    <el-form-item label="客户名称">
                        <el-select
                        id="sysname"
                        v-model="form.principalName"
                        placeholder="请输入客户名称"
                        clearable
                        filterable
                        remote
                        reserve-keyword
                        style="width: 200px"
                        >
                        <el-option
                            v-for="item in clientOrder"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name"
                        >
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="this.NumberType === ''?true:false" label="状态">
                        <el-select
                        id="sysname"
                        v-model="form.status"
                        placeholder=""
                        clearable
                        filterable
                        remote
                        reserve-keyword
                        maxlength="10"
                        style="width: 150px"
                        >
                        <el-option
                            v-for="item in statusArray"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-row>
                        <el-button @click="beforAgent" size="medium" type="primary" v-auth="['253000_B']">搜索 </el-button>
                        <!-- <el-button @click="restClick" size="medium" type="primary">清空</el-button> -->
                        </el-row>
                    </el-form-item>
                    <!-- <el-form-item style="float: right;margin-right: 0">
                        <el-row>
                        <el-button @click="newAdd(1)" size="medium">新增</el-button>
                        <el-button @click="downloadExecl" size="medium">导出列表</el-button>
                        </el-row>
                    </el-form-item> -->
                </div>
            </el-form>
        </div>
        <div class="tableBody">
            <Dialog :dialogVisible="dialogVisible"
            @changeDialogVisible='changeDialogVisible'
            :salesNameArray='salesNameArray'
            :principalArray='principalArray'
            :indexObj='indexObj'
            @colseDias="colseDias"
            :historyArr='historyArr'></Dialog>
            <Table :tableData='tableData' :zSizeNum='zSizeNum'
            @showDialogVisible='showDialogVisible'
            @tabChange='tabChange'></Table>
        </div>
        <el-dialog
          title=""
          :visible.sync="dialogShow"
          width="50%"
          @close="dialogChange(false)"
          :close-on-click-modal="false">
          <el-form :model="form" style="padding-top:20px">
                <el-form-item required="true" :label="messageTittle" :label-width="200">
                    <el-input v-model="contentText" maxlength="20"  autocomplete="off" show-word-limit placeholder="请输入理由" style="width:60%"></el-input>
                </el-form-item>
            </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogChange(false)">取 消</el-button>
            <el-button :disabled="(contentText.trim()).length==0" type="primary" @click="dialogChange(true)">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title=""
          :visible.sync="dialogShow2"
          width="50%"
          @close="dialogChange2(false)"
          :close-on-click-modal="false">
          <el-form :model="form" style="padding-top:20px">
                <el-form-item required="true" :label="messageTittle2" :label-width="200">
                    <el-input v-model="contentText2" maxlength="20"  autocomplete="off" show-word-limit placeholder="请输入理由" style="width:60%"></el-input>
                </el-form-item>
            </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogChange2(false)">取 消</el-button>
            <el-button :disabled="(contentText2.trim()).length==0" type="primary" @click="dialogChange2(true)">确 定</el-button>
          </span>
        </el-dialog>
        <div style="width:100%;display:flex;flex-direction: row;justify-content:center;">
          <div
            class="block"
            style="margin: 40px 100px; margin-left: 300px; margin-bottom: 20px"
          >
            <el-pagination
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
        <!-- 特价发布弹窗 -->
        <special-release-dialog
          ref="SpecialReleaseDialog"
          :timeArray = 'timeArrays'
          :jpObjz = 'jpObj'
          :numberzz = 'numberzz'
          :tableDataArr ="tableDataArr"
          v-if="showSpecialReleaseDialog"
          @colseDiaThing = 'colseDiaThing'
          @closeEv="showSpecialReleaseDialog = false"
        />
    </div>
</template>
<script>
  import Table from './component/table2.vue'
  import Dialog from './component/dialog2.vue'
  import SpecialReleaseDialog from "./component/dialog3.vue";
  import { toData } from '@/util/assist'
  export default {
    components: {
      Table,
      Dialog,
      SpecialReleaseDialog
    },
    data() {
      return {
        numberzz:0,
        jpObj:{},
        coordinateArr:[{id:1,name:'(1,1)'},{id:2,name:'(1,2)'},{id:3,name:'(1,3)'},{id:4,name:'(2,1)'},{id:5,name:'(2,2)'},{id:6,name:'(2,3)'}],
        tableDataArr:[{},{},{},{},{},{}],
        showSpecialReleaseDialog: false,
        value:0,
        timeArrays:[],
        timeArray:[
					{	id:0,
						nowWeekChain:"",
						nowWeeekEnglish:''
					},
					{	id:1,
						nowWeekChain:"",
						nowWeeekEnglish:''
					},
					{	id:2,
						nowWeekChain:"",
						nowWeeekEnglish:''
					},
				],
        contentText2:'',
        dialogShow2:false,
        messageTittle2:'',
        clientOrder:[],
        dialogId:'',
        dialogShow:false,
        messageTittle:'',
        //table
        historyArr:[],
        indexObj:'',
        NumberType:'', //
        principalArray:[],//航线负责人id
        salesNameArray:[],//  一代操作人员id 可以为null
        coordinateArr:[{id:1,name:'(1,1)'},{id:2,name:'(1,2)'},{id:3,name:'(1,3)'},{id:4,name:'(2,1)'},{id:5,name:'(2,2)'},{id:6,name:'(2,3)'}],
        hasAccountArr:[{id:'',name:'全部'},{id:'(1,1)',name:'(1,1)'},{id:'(1,2)',name:'(1,2)'},{id:'(1,3)',name:'(1,3)'},{id:'(2,1)',name:'(2,1)'},{id:'(2,2)',name:'(2,2)'},{id:'(2,3)',name:'(2,3)'}],
        statusArray:[{id:'',name:'全部'},{id:1,name:'待上架'},{id:2,name:'展示中'},{id:3,name:'已下架'},{id:-1,name:'未抢占'}],
        dialogVisible:false,
        tableData: [],
        pageSize: 10,
        pageNum: 1,
        pageNumber: 1,
        zSizeNum:0,
        total: 0,
        agentOpt:[],
        contentText:'',
        form:{
            status:'',
            position:'',
            principalName: "",		      	 // 航线人员名称
            startDate: ""		,		           // 开始时间
            endDate: ""				           // 结束时间
        },
        dialogType:'',
        agentName: '',
        agentCode: '',
        dialogTitle: '',
        sysname:'', // 新加售中客服
        dialogFormVisible: false,
      }
    },
    mounted() {
      this.getId()
      this.getTimeList()
      this.getlistPrimaryAgent()
    },
     watch: {
        NumberType: {
            handler(newName, oldName) {
              this.getlistPrimaryAgent()
            },
            immediate: true,
            deep: true
        },
    },
    methods: {
      colseDias(){
        this.dialogVisible = 0
        this.indexObj = {}
      },
      getTimeList(){//获取周期列表
        this.$http.get(this.$service.goodWeeks).then(res=>{
          if(res.code == 200){
							var endTime0 = res.data[0].end
							var endTime1 = res.data[1].end
							var startTime0 = res.data[0].start
							var startTime1 = res.data[1].start
							var leftDay0 = res.data[0].left
							var leftDay1 = Number(leftDay0) + 14
							// nowWeek0C+'—'+nowWeek6C
							// sh=nowWeek0E+' '+nowWeek6E
							var endTime0Arr = endTime0.split('-')
							var endTime1Arr = endTime1.split('-')
							var startTime0Arr = startTime0.split('-')
							var startTime1Arr = startTime1.split('-')
							this.timeArray = [
                {	id:0,
									nowWeekChain:'全部',
									nowWeeekEnglish:null+' '+null,
								},
								{	id:1,
									nowWeekChain:Number(startTime0Arr[0])+'年'+Number(startTime0Arr[1])+'月'+Number(startTime0Arr[2])+'日'+'—'+Number(endTime0Arr[0])+'年'+Number(endTime0Arr[1])+'月'+Number(endTime0Arr[2])+'日',
									nowWeeekEnglish:startTime0+' '+endTime0,
								},
								{	id:2,
									nowWeekChain:Number(startTime1Arr[0])+'年'+Number(startTime1Arr[1])+'月'+Number(startTime1Arr[2])+'日'+'—'+Number(endTime1Arr[0])+'年'+Number(endTime1Arr[1])+'月'+Number(endTime1Arr[2])+'日',
									nowWeeekEnglish:startTime1+' '+endTime1,
								},
							]
							this.timeArrays=[
								{	id:0,
									nowWeekChain:Number(startTime0Arr[0])+'年'+Number(startTime0Arr[1])+'月'+Number(startTime0Arr[2])+'日'+'—'+Number(endTime0Arr[0])+'年'+Number(endTime0Arr[1])+'月'+Number(endTime0Arr[2])+'日',
									nowWeeekEnglish:startTime0+' '+endTime0,
								},
								{	id:1,
									nowWeekChain:Number(startTime1Arr[0])+'年'+Number(startTime1Arr[1])+'月'+Number(startTime1Arr[2])+'日'+'—'+Number(endTime1Arr[0])+'年'+Number(endTime1Arr[1])+'月'+Number(endTime1Arr[2])+'日',
									nowWeeekEnglish:startTime1+' '+endTime1,
								},
							]
              // this.getArrs()
						}else{
							this.$message.error(res.message)
						}
        })
      },
      dialogChange2(type){
        this.dialogShow2 = false
        if(type){
          this.auditStatus(this.dialogId,2)
        }else{
          this.messageTittle2 = ''
          this.contentText2 = ''
          this.getlistPrimaryAgent();
        }
      },
      dialogChange(type){
        this.dialogShow = false
        if(type){
          this.auditStatus(this.dialogId)
        }else{
          this.messageTittle = ''
          this.contentText = ''
          this.getlistPrimaryAgent();
        }
      },
      //编辑
      showDialogVisible(obj){
        this.indexObj = this.tableData[obj.index]
        console.log(obj,this.indexObj);
        this.dialogType = obj.type
        if(obj.type == 2){
          this.history(this.tableData[obj.index].id)
        }else if(obj.type == 3 || obj.type == 4){
          this.dialogShow = true
          this.dialogId = this.tableData[obj.index].id
          if (obj.type == 3) {
            this.messageTittle = '审核通过理由'
          }else{
            this.messageTittle = '驳回理由'
          }
        }else if(obj.type == 5){
          var status = this.tableData[obj.index].statusZ
          this.dialogId = this.tableData[obj.index].id
          if(status){
            this.messageTittle2 = '上架理由'
          }else{
            this.messageTittle2 = '下架理由'
          }
          this.dialogShow2 = true
        }
        this.newAdd(obj.type)
      },
      handleSizeChange(e) {
        this.pageSize = e;
        // this.zSizeNum = this.pageSize * (this.pageNumber - 1)
        this.getlistPrimaryAgent();
      },
      handleCurrentChange(e) {
        this.pageNumber = e;
        // this.zSizeNum = this.pageSize * (this.pageNumber - 1)
        this.getlistPrimaryAgent();
      },
      tabChange(e){
        this.form.status = e
        this.NumberType = e
        this.pageNumber= 1
        // console.log(e);
      },
      async colseDiaThing(e){
        var data =  await this.$http.post(this.$service.goodRouterUpdatePreDomain,e)
          if (data.code == 200) {
            this.$message.success('编辑成功')
            this.getlistPrimaryAgent()
          }else{
            this.$message.error(data.message)
          }
      },
      // 获取航线负责人id与一代操作人员id
      getId(){
         //客户名称下拉
         this.$http.post(this.$service.goodRouterListApplicantName,'').then((data) => {
        // this.loading = false;/
        if (data.code == 200) {
          var array = [];
          for (let index = 0; index < data.data.length; index++) {
            array[index] = {name:data.data[index]}
          }
          this.clientOrder = array
          } else {
            this.$message.error(data.message);
          }
        });
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
      beforAgent(){ // 初始化页数
        this.pageSize = 10
        this.pageNumber = 1
        this.getlistPrimaryAgent()
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
      var endDate = null
          if(this.value == '0'){
            endDate = null
          }else{
            endDate = (this.timeArray[Number(this.value)].nowWeeekEnglish).split(' ')[1]
          }
        var json = {
            "agentName":          this.form.agentName,	 // 	代理名称 eg:广东速捷国际物
            "endDate":            endDate ,			   //   结束时间 eg:2021-12-29
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
        json = toData(json)
        this.$http.get(this.$service.downloadExeclAgent+'?'+json, {
            responseType: 'arraybuffer'
          }).then(res=>{
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

          var obj = {
            'accountId': from.accountId?from.accountId:null,				//用户企业账户的id  新增为null
            "agentCode": from.agentCode?from.agentCode:'',		       //代理简称
            "agentName": from.agentName?from.agentName:'',            //  代理名称
            "applyMethod": from.applyMethod?from.applyMethod:'平台',          //  提交方式：	平台，后台 
            "contactsName": from.contactsName?from.contactsName:'',         //  联系人名称
            "createTime": from.createTime?from.createTime:null,           //  申请时间，可以为null
            "dominantRoute":from.dominantRoute?from.dominantRoute:null,        //  优势航线 可以为null
            "fileUrl":from.fileUrl?from.fileUrl:'',              //  营业执照全路径地址
            "id": from.id?from.id:null,                   //  				新增为null
            "isSettled": from.isSettled?from.isSettled:0,            //  是否入驻0否,1是		新增为0
            isSettledName: from.isSettledName?from.isSettledName:'否',            //  是否入驻0否,1是		新增为0
            "level": from.level?from.level:null,                //  供应商级别            新增为null
            "namePy": from.namePy?from.namePy:'',               //  名称首字母拼音
            "phoneNum": from.phoneNum?from.phoneNum:'',             //  联系人电话
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
            "updateTime": from.updateTime?from.updateTime:''            //  更新时间，可以为null
          }
          var data =  await this.$http.post(this.$service.saveOrUpdateAgent,obj)
          if(data.code == 200){
              this.$message.success(data.message)
              this.getlistPrimaryAgent()
            }else{
              this.$message.error(data.message)
            }
        },
        // 精品航线审核
        async auditStatus(id,type){
          if(this.dialogType == 3){
            var rejectFlag = ''
            var message = this.contentText
          }else{
            var rejectFlag = 1
            var message = this.contentText
          }
          if(type === 2){
            var rejectFlag = ''
             var message = this.contentText2
          }
          var obj =  {
              "id": id, //id
              "message": message,
              'rejectFlag': rejectFlag,
            }
            var data =  await this.$http.post(this.$service.goodRouterStatus,obj, {
              headers: {
                diffFlag: {
                  3: 1,
                  4: 2,
                  5: 3,
                }[this.dialogType],
              }
            })
            if(data.code == 200){
             this.$message.success(data.message)
             this.getlistPrimaryAgent()
             this.contentText = ''
             this.contentText2 = ''
            }else{
              this.$message.error(data.message)
              this.contentText = ''
              this.contentText2 = ''
            }
        },
        // 获取精品航线详情
        async getlistPrimaryAgent(){
          var endDate = null
          if(this.value == '0'){
            endDate = null
          }else{
            endDate = (this.timeArray[Number(this.value)].nowWeeekEnglish).split(' ')[1]
          }
          var obj =  {
              "applicantName": this.form.principalName, //客户名称
              "pageNum": this.pageNumber,
              "pageSize": this.pageSize,
              "position": this.form.position,  //位置
              "endDate": endDate ,  //结束日期  如果无值，请不传改字段
              "startDate": (this.form.startDate)?(this.form.startDate):null, //开始日期	  如果无值，请不传改字段	2022-05-01
              "status": this.form.status		//状态
            }
            var data =  await this.$http.post(this.$service.goodRouterList,obj)
            if(data.code == 200){
              this.total = data.data.total
               var array = JSON.parse(JSON.stringify(data.data.records))
               var valData = ['未抢占','待审核','待上架', '展示中','已下架','展示失败','审核未通过']
               for (let i = 0; i < array.length; i++) {
                 array[i].statusName = valData[Number(array[i].status)+1]
                 var status = Number(array[i].status)
                 if( status === 0 || status === 5){
                   array[i].statusZ = false
                 }else if(status === 1 || status === 2){
                   array[i].statusZ = true
                 }else{
                   array[i].statusZ = 'undefined'
                 }
               }
               this.tableData = array
            }else{
              this.$message.error(data.message)
            }
        },
        // 查看操作历史
        async history(agentdid){
            var data =  await this.$http.get(this.$service.goodRouterlistLog+'?id='+agentdid)
            if(data.code == 200){
              this.historyArr = data.data
            }else{
              this.$message.error(data.message)
            }
        } ,
        // 清空
        restClick(){
          this.form = {
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
                "id": from.id,				                 //   供应商id
                "status": 1,				               //   状态 1 为通过
                "level" : from.level?from.level:'',				               //   代理等级
                "principalId":from.principalId?from.principalId:"",			             // 	航线负责人id
                "salesId":from.salesId?from.salesId:'',			                 // 	一代操作人id
                "examineMassage": from.examineMassage?from.examineMassage:''	 // 	审核信息，
              }
            }
            // console.log(obj);
            var data =  await this.$http.post(this.$service.examine,obj)
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
          if(number == 8 || number == 9){
            this.getDataLists(this.indexObj,number)
          }else{
           this.dialogVisible = number
          }
        },
        // 获取航线数组
        async getDataLists(newObj,numberzz){
          var endDate1 = newObj.endDate
          var obj1 = {"endDate": endDate1}
          var data =  await this.$http.post(this.$service.goodRouterList,obj1)
          if(data.code == 200){
              for (let j = 0; j < this.tableDataArr.length; j++) {
                this.tableDataArr[j] = {
                  startDate:'',
                  endDate: '',   //只需要传一个周六的作为结束日期就可以，
                  position: this.coordinateArr[j].id,  //位置
                  showAirline: "",		//航线
                  showFile: "",		//文件地址
                  showName: "",		//展示名称
                  showRemark: "",		//详情页面
                  showLable: "" ,        	//航线特色
                  status:'-1',
                  createTime: "",  	//申请时间
                }
              }
              var arr = JSON.parse(JSON.stringify(data.data.records)) 
              for (let i = 0; i < arr.length; i++) {
                if(Number(arr[i].status) === -1){continue}
                this.coordinateArr.filter((item,index)=>{
                  if(arr[i].position == item.name){
                    this.tableDataArr[index].position = arr[i].position
                    this.tableDataArr[index].showAirline = arr[i].showAirline
                    this.tableDataArr[index].showFile = arr[i].showFile
                    this.tableDataArr[index].showName = arr[i].showName
                    this.tableDataArr[index].showRemark =  this.htmlDecodeByRegExp(arr[i].showRemark)
                    // this.tableDataArr[index].showLable = arr[i].showLabel?arr[i].showLabel.split(','):arr[i].showLabel
                    this.tableDataArr[index].showLable = arr[i].showLabel?arr[i].showLabel.split('||'):arr[i].showLabel
                    // this.tableDataArr[index].showLable = arr[i].showLabel
                    this.tableDataArr[index].status = arr[i].status
                    this.tableDataArr[index].endDate = arr[i].endDate
                    this.tableDataArr[index].createTime = arr[i].createTime
                  }
                })
              }
          }else{
            this.$message.error(data1.message)
          }
          var jpObj = JSON.parse(JSON.stringify(newObj))
          var positionId = this.forArr(1,jpObj.position)
          jpObj.showLable =  jpObj.showLabel? jpObj.showLabel.split('||'): jpObj.showLabel
          var dateId = this.forTime(1,jpObj.endDate)
          // this.xzbqarr = this.jpObj.showLabel?this.jpObj.showLabel.split('||'):this.jpObj.showLabel
          var showRemark = this.htmlDecodeByRegExp(jpObj.showRemark)
          this.$set(jpObj,'date',dateId)
          this.$set(jpObj,'position',positionId)
          this.$set(jpObj,'showRemark',showRemark)
          // console.log('1',jpObj);
          this.jpObj = jpObj
          this.showSpecialReleaseDialog = true
          this.numberzz = numberzz
        },
        forArr(num,name){
          if(num == 1){
            for (let i = 0; i < this.coordinateArr.length; i++) {
              if(this.coordinateArr[i].name == name){
                return this.coordinateArr[i].id
              }
            }
          }else{
            for (let i = 0; i < this.coordinateArr.length; i++) {
              if(this.coordinateArr[i].id == name){
                return this.coordinateArr[i].name
              }
            }
          }
        },
        forTime(num,name){
          if(num == 1){
            for (let i = 0; i < this.timeArrays.length; i++) {
              if(this.timeArrays[i].nowWeeekEnglish.split(' ')[1] == name){
                return i
              }
            }
          }else{
            var endate = this.timeArrays[name].nowWeeekEnglish.split(' ')[1]
            return endate
          }
        },
        /*4.用正则表达式实现html解码*/
				htmlDecodeByRegExp:function (str){  
						var s = "";
						if(str == null || str.length == 0) return "";
						s = str.replace(/&amp;/g,"&");
						s = s.replace(/&lt;/g,"<");
						s = s.replace(/&gt;/g,">");
						s = s.replace(/&nbsp;/g," ");
						s = s.replace(/&#39;/g,"\'");
						s = s.replace(/&quot;/g,"\"");
						return s;  
				},
        closeChange(){
          this.tableDataArr = [{},{},{},{},{},{}]
          this.jpObj ={}
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
 
</style>