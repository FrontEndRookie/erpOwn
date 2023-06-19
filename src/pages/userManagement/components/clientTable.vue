<template>
  <div>
    <el-table
      stripe
      ref="multipleTable"
      @sort-change="handleSort"
      @selection-change="handleSelect"
      :data="tableData"
      style="width: 100%;"
      >
      <template slot="empty">
        <img class="data-pic" src="../../../assets/kong-icon.png" />
        <p>暂无数据</p>
      </template>
      >
      <!-- <el-table-column
        v-if="checkbox"
        type="selection"
        width="55">
      </el-table-column> -->
      <!--列-->
      <el-table-column
        v-for="(column, index) in columns"
        v-if="column.show"
        :fixed="column.fixed"
        :key="index"
        :sortable="column.sort"
        :prop="column.prop"
        :label="column.label"
        :min-width="column.width"
        align="center"
        >
        <template slot-scope="scope">
          <div v-if="column.label=='营业执照'" style="color:#2273CE;cursor:pointer" @click="showMessage(1,scope.row)">
              查看
          </div>
          <div v-else-if="column.label=='开户账号'" style="color:#2273CE;cursor:pointer" @click="showMessage(2,scope.row)"> 
              查看
          </div>
          <div v-else-if="column.label=='客户标签'" > 
              {{scope.row.isAgent==1?'代理':''}}
          </div>
           <div v-else-if="column.label=='结算方式'" > 
              {{scope.row.payWay==0?'付款买单':scope.row.payWay==1?'月结买单':''}}
          </div>
           <div v-else-if="column.label=='认证状态'" :style="{color:(scope.row.status==1 ||scope.row.status==6)?'#2273CE':'',cursor:(scope.row.status==1 ||scope.row.status==6)?'pointer':''}"  @click="cerShowMessage(scope.row.status,scope.row)" v-auth:disabled="{ 1: ['652001_B'], 6: ['652002_B'] }[scope.row.status]" :key="`${scope.row.id}-${scope.row.status}`">
              {{cerStatus[scope.row.status]}}
          </div>
          <div v-else>
            {{scope.row[column.prop]}}
          </div>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column
        fixed="right"
        v-if="operation.show"
        :label="operation.label"
        :min-width="operation.width"
        :show-overflow-tooltip="true"
        >
        <template slot-scope="scope">
          <a v-for="(item, index) in operation.options" :key="index">
            <!-- <span :style="{color:scope.row.status==4?'#2273CE':'#cccccc',cursor:scope.row.status==4?'pointer':'not-allowed'}" @click="editMessage(scope.row)">{{item.label}}</span> -->
            <el-button type="text" :disabled="scope.row.status !== 4 || $utils.authCheckDisabled(item.auth)" @click="editMessage(scope.row)">{{item.label}}</el-button>
          </a>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div v-show="total > 10">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handleCurrent"
        @size-change="handleSize"
        style="text-align: right;padding: 19px 30px 18px 0;background: #fff">
      </el-pagination>
    </div>
    <!--营业执照 开户账号 查看弹框 -->
    <el-dialog
     :title="dialTitle"
     :visible.sync="dialogVisible"
     width="300px"
     center
     >
     
<viewer :images="[picSrc]" v-if="dialType==1 && dialogVisible"> 
        <img  :src="picSrc" alt="" style="width:100%;height:100%"  @click="viewShow">
</viewer>
        <div v-if="dialType==2" >
            <div>开户名称:{{messArray[0]}}</div>
            <div style="margin-top:15px">开户银行:{{messArray[1]}}</div>
            <div style="margin-top:15px">开户账号:{{messArray[2]}}</div>
        </div>
    </el-dialog>
    <!-- 认证状态弹框 -->
    <el-dialog
    :title="cerDialTitle"
     :visible.sync="cerDialogVisible"
     center
     width="30%"
     >
        <div style="text-align:center" v-if="cerDialType == 1">
            “{{customerName}}”的认证申请是否审核通过？
        </div>
        <div style="text-align:center" v-if="cerDialType == 2">
            是否成功向“{{customerName}}”打款？
        </div>
        <div style="text-align:center"  v-else-if="cerDialType == 11">
            审核通过，等待财务打款验证。
        </div>
        <div style="text-align:center"  v-else-if="cerDialType == 12">
             <el-select v-model="refuseResult" placeholder="请选择">
                <el-option
                v-for="item in refuseChoice"
                :key="item.value"
                :label="item.label"
                :value="item.label">
                </el-option>
            </el-select>
        </div>
        <span slot="footer" class="dialog-footer" v-if="cerDialType == 1">
            <el-button type="primary" @click="vertifySuccess ">通过</el-button>
            <el-button  @click="cerDialType = 12,cerDialTitle='请选择驳回理由'">驳回</el-button>
        </span>
        <span slot="footer" class="dialog-footer" v-if="cerDialType == 2">
            <el-button type="primary" @click="payAmount(1) ">打款成功</el-button>
            <el-button  @click="payAmount(2)">打款失败</el-button>
        </span>
        <span slot="footer" class="dialog-footer" v-if="cerDialType == 11">
            <el-button type="primary" @click="cerDialogVisible = false">确定</el-button>
        </span>
        <span slot="footer" class="dialog-footer" v-if="cerDialType == 12">
            <el-button type="primary" @click="rejectApply">确定</el-button>
            <el-button  @click="cerDialType = 1">取消</el-button>
        </span>
     </el-dialog>
     <!-- 编辑弹框 -->
     <el-dialog
      title="编辑"
      center
     :visible.sync="editDialogVisible"
     width="600px"
     >
     <el-form label-position="left" style="padding:20px 0">
         <el-form-item label="售前客服" required label-width="100px" class="tab1">
             <el-select v-model="clientEdit.pscsId" placeholder="请选择" >
                <el-option
                    v-for="item in pcscArray"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
         </el-form-item>
         
         <el-form-item class="tab5" label="企业联系人" required label-width="100px" >
             <el-input  v-model="clientEdit.companyContact"  maxlength="20">
             </el-input>
         </el-form-item>
         <el-form-item class="tab5" label="联系电话" required label-width="100px" >
             <el-input  v-model="clientEdit.companyTel"  onkeyup="this.value=this.value.replace(/[^\d-]/g,'') " @blur="clientEdit.companyTel = $event.target.value" maxlength="20">
             </el-input>
         </el-form-item>
         <el-form-item class="tab5" label="企业邮箱" required label-width="100px" >
             <el-input  v-model="clientEdit.companyEmail"   maxlength="50">
             </el-input>
         </el-form-item>
         <el-form-item class="tab5" label="QQ号" required label-width="100px" >
             <el-input  v-model="clientEdit.companyQq"  onkeyup="this.value=this.value.replace(/[^\d]/g,'') " @blur="clientEdit.companyQq = $event.target.value" maxlength="20">
             </el-input>
         </el-form-item>
     </el-form>
     <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirmEdit">确定</el-button>
            <el-button @click="editDialogVisible=false">取消</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  
  props: {
   
    // 表格数据源
    tableData: {
      type: Array,
      default: () => []
    },
    // 表格的字段展示
    columns: {
      type: Array,
      default: () => []
    },
    // 表格操作
    operation: {
      type: Object,
      default: () => {}
    },
    // 总条数
    total: {
      type: Number,
      default: () => 0
    },
    
    // 当前页
    currentPage: {
      type: Number,
      default: () => 0
    },
    // 每页条数
    pageSize: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      //认证状态
     cerStatus: ['未认证', '审核中', '审核失败', '待客户验证', '验证成功', '验证失败', '待财务打款'],
     //查看弹框
      dialogVisible:false,
      dialType:0,
      dialTitle:'',
      picSrc:'',
      messArray:[],

     //认证弹框
      cerDialogVisible:false,
      cerDialType:0,
      cerDialTitle:'',
      
      //认证驳回理由
      refuseResult: '',
      //弹框 客户名字显示
      customerName:'',
      //弹框 客户id及userid-后续调接口
      vertifyId:'',
      vertifyUserId:'',
      //驳回理由选项
      refuseChoice:[{value:1,label:'您的资质未达标,认证审核失败'},{value:2,label:'企业信息不完善'}],

    //  编辑弹框
    editDialogVisible:false,
    clientEdit:{accountingPeriod:'',pscsId:'',companyContact:'',companyTel:'',companyEmail:'',companyQq:''}, //monthWay:'',payWay:'',quota:'',
    billWay:[{name:'月结',value:"0"},{name:'固定天数(暂未上线)',value:1,disabled:true}],
    monthPayChoice:[{name:'15天',value:15},{name:'30天',value:30},{name:'45天',value:45},{name:'60天',value:60},],
      seletArr: [],
      userName: '',
      arr: [],
      UserID: ''
    }
  },
  mounted() {
    console.log(this.test,111111111)
     this.$http.get(this.$service.userSearchNoAuth+'?roleName=售前客服&pageSize=50000').then(data=>{
          this.pcscArray = data.data.records
        })
   },
  watch: {
   
  },
  methods: {
  
    //
    changePayWay(val){
      if(val==0){
        this.clientEdit.monthWay = ''
        this.clientEdit.accountingPeriod = ''
        this.clientEdit.quota = ""
      }
      if(val==1){
        this.clientEdit.monthWay = '0'
        this.clientEdit.accountingPeriod = '15'
        this.clientEdit.quota = 30000

      }
    },
    changeBillDate(val){
     if(val=='0'){
        this.clientEdit.accountingPeriod = '15'
     }
    },
    //编辑
    confirmEdit(){
      console.log(this.clientEdit)
      if(this.clientEdit.payWay==1){
        if(!this.clientEdit.companyQq ||!this.clientEdit.companyTel ||!this.clientEdit.companyEmail ||!this.clientEdit.companyContact ||!this.clientEdit.accountingPeriod || !this.clientEdit.monthWay||!this.clientEdit.quota){
            return this.$message.warning("请输入全部信息")
        }
      }
      let request = {}
      if(this.clientEdit.payWay==0){
        request.id=this.clientEdit.id
        request.payWay=0
        request.pscsId = this.clientEdit.pscsId
        request.companyContact = this.clientEdit.companyContact
        request.companyTel = this.clientEdit.companyTel
        request.companyEmail = this.clientEdit.companyEmail
        request.companyQq = this.clientEdit.companyQq
      }else {
        request = this.clientEdit
      }
      console.log(request)
      this.$http.post(this.$service.editPeriodInfo,request).then(res=>{
        if(res.code==200){
          this.$message.success("编辑成功")
          this.editDialogVisible =false
          this.$emit('reSearch')
        }else {
          this.$message.error(res.message)
        }
      })
    },
    //财务打款
    payAmount(type){
      this.$http.post(this.$service.toPayment+"?id="+this.vertifyId+"&type="+type).then((res)=>{
        if(res.code==200){
          this.$message.success('操作成功')
          this.cerDialogVisible = false
          this.$emit('reSearch')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //审核驳回
    rejectApply(){
      if(!this.refuseResult){
        return this.$message.warning("请选择驳回理由")
      }
      this.$http.post(this.$service.toRejection+"?id="+this.vertifyId+"&mes="+this.refuseResult).then(res=>{
        if(res.code == 200){
          this.$message.success("审核驳回成功")
          this.cerDialogVisible = false
          this.$emit('reSearch')
        }
        else {
          this.$message.error(res.message)
        }
      })
    },
    //审核通过
    vertifySuccess(){
      this.$http.post(this.$service.toExamine+"?id="+this.vertifyId+"&userId="+this.vertifyUserId).then(res=>{
        if(res.code==200){
          // this.cerDialType = 11
          // this.cerDialTitle='审核通过'
          this.cerDialogVisible = false
          this.$message.success("审核通过")
          this.$emit('reSearch')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //编辑
      editMessage(data){
        if(data.status ==4){
          this.clientEdit = {
            id:data.id,
            accountingPeriod:data.accountingPeriod==0?data.accountingPeriod.toString():data.accountingPeriod,
            monthWay:data.monthWay==0?data.monthWay.toString():'',
            payWay:data.payWay.toString(),
            quota:data.quota==0?data.quota.toString():data.quota,
            pscsId:data.pscsId,
            companyContact:data.companyContact,
            companyTel:data.companyTel,
            companyEmail:data.companyEmail,
            companyQq:data.companyQq,
            }
  
          this.editDialogVisible = true
          
        }
      },
      
    //   认证状态弹框
    cerShowMessage(type,data){
      this.refuseResult = ''
      this.customerName = ''
      this.vertifyId = ''

      this.customerName = data.customerName
      this.vertifyId = data.id
      this.vertifyUserId = data.userId
      this.cerDialType = (type == 1?1:type==6?2:'')
      if(type==1 || type==6){
        this.cerDialogVisible = true
      }
      type==1?this.cerDialTitle ='审核':type==6?this.cerDialTitle ='财务打款':''
    },
    // 营业执照开户行查看
    showMessage(type,item){
      console.log(item)
        this.dialType = type
        type == 2?this.dialTitle ='开户账号':this.dialTitle =''
        if(type == 2){
          this.messArray = [item.accountName,item.accountBank,item.corporateAccount]
        } else if(type == 1) {
          this.picSrc = item.businessLicensePath
        }
        this.dialogVisible = true
    },
    // 页码跳转
    handleCurrent (val) {
      // this.rowSelect()
      this.$emit('currentChange', val)
    },
    // 展示条数
    handleSize (val) {
      this.$emit('sizeChange', val)
    },
    
    
  }
}
</script>
<style lang="less" scoped>
/deep/.el-table td{
    text-align: center;
}
/deep/.el-table th{
    text-align: center;
}
/deep/.el-dialog__footer{
    padding-bottom: 20px;
}
/deep/.el-dialog__body{
  .tab1,.tab5{
    .el-input{
        width: 300px;
    }
  }
  .tab2{
    width: 150px;
  }
  .tab3,.tab4{
    width: 150px;
  }
}
/deep/.el-table__body .el-table__row  td{
    border-right: 1px solid rgb(215, 210, 210) !important;
    border-bottom: 1px solid rgb(215, 210, 210) !important;
  }
  /deep/ .el-table__body tr:hover>td {
  background-color: #CCC !important;
}
</style>
