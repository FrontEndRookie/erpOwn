<template>
<div>
     <el-dialog title="使用预付记录核销" :visible.sync="dialogFormVisibleThree" width= "1000px" style="margin:auto;">
        <el-table
          ref="multipleTable"
          :data ="ysTableData"
          style="width: 100%"
          :row-key="row=>row.id"
          @selection-change="ysSelectionChange"
          max-height="400"
          >
          <el-table-column
            type="selection"
            :reserve-selection="true"
            width="55">
          </el-table-column>
          <el-table-column
            prop="accountVoucherNo"
            label="会计凭证号"
            width="120">
          </el-table-column>
          <el-table-column
            prop="payDate"
            label="收款时间"
            width="120">
          </el-table-column>
          <el-table-column
            prop="payeeName"
            label="收款人名称"
            width="120"
           >
           <template slot-scope="scope">
             <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis" :title="scope.row.payeeName">
               {{scope.row.payeeName}}
             </div>
           </template>
          </el-table-column>
          <el-table-column
            prop="exchangeRate"
            label="汇率"
            width="120"
           >
          </el-table-column>
          <el-table-column
            prop="amount"
            label="付款金额"
            width="120"
           >
           <template slot-scope="scope">
             <div>
                {{ currencyLabel[chargeOffData.currency]+" "+scope.row.payAmount}}
             </div>
           </template>
          </el-table-column>
          <el-table-column
            prop="writeOffLeft"
            label="核销剩余金额"
            width="140"
           >
             <template slot-scope="scope">
             <div>
                {{ currencyLabel[chargeOffData.currency]+" "+scope.row.writeOffRemainAmount}}
             </div>
           </template>
          </el-table-column>
          <el-table-column
            prop="receiptType"
            label="实付类型"
            width="120"
           >
           <template slot-scope="scope">
             <div>
              {{scope.row.paidType ==1?"预付":""}}
             </div>
           </template>
          </el-table-column>
          <el-table-column
            prop="accountName"
            label="付款人名称"
            width="120"
           >
           <template slot-scope="scope">
             <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis" :title="scope.row.accountName">
               {{scope.row.accountName}}
             </div>
           </template>
          </el-table-column>
          <el-table-column
            prop="accountBank"
            label="付款人开户行"
            width="140"
           >
           <template slot-scope="scope">
             <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis" :title="scope.row.accountBank">
               {{scope.row.accountBank}}
             </div>
           </template>
          </el-table-column>
          <el-table-column
            prop="bankAccount"
            label="付款人账号"
            width="140"
           >
          </el-table-column>
        </el-table>
        <div style="text-align:center;color:silver;margin-top:20px">
          <span style="fontSize:14px;fontWeight:400">预付记录付款金额:{{currencyLabel[chargeOffData.currency]+" "+ysAmount}}</span>
          <span style="margin-left:30px;fontSize:14px;fontWeight:400">预付记录核销剩余金额:{{currencyLabel[chargeOffData.currency]+" "+ysWriteOffLeft}}</span>
        </div>
      <el-form style="display:flex;flex-wrap:wrap;justify-content:space-between;margin-top:20px" label-position="left">
         <el-form-item label="本次核销金额:" required label-width="130px">
            <el-input v-model="chargeOffData.writeOffAmount" placeholder="请输入核销金额" style="width:200px"  onkeyup="this.value= this.value.match(/^\d{0,10}(\.\d{0,2})?/)? this.value.match(/^\d{0,10}(\.\d{0,2})?/)[0] : ''" @blur="chargeOffData.writeOffAmount = $event.target.value"></el-input>
          </el-form-item>
          <el-form-item label="付款账户信息:"  required class="formItem" label-width="130px">
            <div style="width:300px;" 
            >
            <el-popover
              placement="bottom"
              width="200"
              trigger="hover"
              popper-class="orderNoReceive"
              >
              <div v-for="(item,index) in ysAllData.userInfo" :key="index" style="whiteSpace:nowrap;">{{item}}</div>
              <div style="width:260px;color:silver;fontSize:13px;whiteSpace:nowrap;overflow:hidden;textOverflow:ellipsis"  slot="reference">{{ysAllData.userInfo[0]}}</div>
              </el-popover>
            </div>
            
          </el-form-item>
          <el-form-item label="币种:" required label-width="130px">
            <el-select
              v-model="chargeOffData.currency"
              placeholder="请选择币种"
              @change= "changeCurrency"
              style="width: 200px"
            >
              <el-option
                v-for="(item,index) in chargeMoney"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收款方式:" required label-width="130px">
            <div style="width:300px;color:silver;fontSize:13px">银行转账</div>
          </el-form-item>
          <el-form-item label="付款时间:" required label-width="130px">
             <div style="width:260px;" 
            >
            <el-popover
              placement="bottom"
              width="200"
              trigger="hover"
              popper-class="orderNoReceiveS"
              >
              <div v-for="(item,index) in ysAllData.payDate" :key="index" style="whiteSpace:nowrap;">{{item}}</div>
              <div style="color:silver;fontSize:13px;display:inline-block" slot="reference">{{ysAllData.payDate[0]}}</div>
              </el-popover>
            </div>
          </el-form-item>
          <el-form-item label="结算方式:" label-width="120px">
            <div style="width:300px">
              <el-radio-group v-model="chargeOffData.payWay">
                <el-radio label="0">付款买单</el-radio>
                <el-radio label="1">月结</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
      </el-form>
      <div style="display:flex;flex-wrap:wrap;width:84%;margin:15px auto 0">
        <div style="flex:0 0 33%">订单应付总金额:{{totalApCny}}</div>
        <div style="flex:0 0 33%">未对账金额:{{currencyLabel[chargeOffData.currency]+" "}}{{totalApUnPayCheckAmounOrgn}} </div>
        <div style="flex:0 0 33%">已对账金额:{{currencyLabel[chargeOffData.currency]+" "}}{{totalApWoPayCheckAmountOrgn}} </div>
        <div style="flex:0 0 33%;margin-top:15px">未核销金额:{{currencyLabel[chargeOffData.currency]+" "}}{{totalApUnwoOrgn}} </div>
        <div style="flex:0 0 33%;margin-top:15px">已核销金额:{{currencyLabel[chargeOffData.currency]+" "}}{{totalApWoOrgn}} </div>
      </div>
        <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <div style="text-align: center;padding-top:20px;" class="footButton">
          <el-button size="medium" type="primary"
            @click="confirmReceive">确认核销</el-button>
          <el-button size="medium" @click="dialogFormVisibleThree = false">取 消
          </el-button>
        </div>
      </div>

    </el-dialog>
</div>
</template>

<script>
// import { moneyList} from '../../../util/util'
export default {
  components:{},
  props:[
    'childPropsObj','slectAllDataStatic','selectResult','woStatus','verificationArr','selectTableData'
  ],
  methods:{
    changeCurrency(){
      this.$refs.multipleTable.clearSelection()
        this.ysSelectData = ''
        this.ysAmount = 0
        this.ysWriteOffLeft = 0
       this.$http.post(this.$service.toGetPaid,{currency:this.chargeOffData.currency,name:this.selectTableData[0].expenseUnitName}).then(res=>{
        if(res.code==200){
          this.ysTableData = res.data.paidRecords
        }
        else{this.$message.error(res.message)}
        })
    },
      //确认核销
      confirmReceive(){
        if(!this.ysSelectData || this.ysSelectData.length == 0){
          this.$message.error('请选择预付记录后进行核销')
          return
        }
         let {  currency ,writeOffAmount , writeOffWay ,payWay} = this.chargeOffData;
         let { ysWriteOffLeft, totalApUnwoOrgn} = this
        //  console.log(writeOffAmount,)
            if(! writeOffAmount || writeOffAmount == '0') {
                this.$message.error('核销金额不得为0')
                return ;
            }
            if(writeOffAmount > ysWriteOffLeft){
                this.$message.error('输入的核销金额>预付记录剩余核销金额,请重新输入')
                return ;
            }
            if(writeOffAmount > totalApUnwoOrgn ){
                this.$message.error('核销金额>未核销金额,请重新输入')
                return ;
            }
           let params ={
                currency:currency,
                payWay:payWay,
                writeOffAmount:writeOffAmount,
                writeOffWay:writeOffWay,
                orderPaymentVOS:this.verificationArr
            }
            if(this.slectAllDataStatic) {
                delete params.orderPaymentVOS
                 params.financePageDTO = this.selectResult
                params.financePageDTO.woStatus = this.woStatus
                if(params.financePageDTO.payWriteOffStatusList.indexOf("") != -1){
                        params.financePageDTO.payWriteOffStatusList = []
                    }
            }
            params.tprIds = this.ysSelectData.map(item=>item.id)
            // console.log(params)
            // return
            this.$http.post(this.$service.toPrepaymentWriteOff,params).then(res=>{
            if(res.code==200){
              this.$message.success("核销成功")
              this.dialogFormVisibleThree= false
              this.$emit("reSearch")
            }
            else{this.$message.error(res.message)}
            })
      },
      //预收核销表格选中事件
      ysSelectionChange(e) {
        this.ysSelectData = e
        //弹框表格下-预收记录累加计算
        this.ysAmount = this.ysSelectData.reduce((s,v)=>s+v.payAmount,0)
        this.ysWriteOffLeft = this.ysSelectData.reduce((s,v)=>s+v.writeOffRemainAmount,0)

        //收款账户信息及到账时间
        this.ysAllData.userInfo = this.ysSelectData.map(item=>item.accountBank+"-"+item.accountName+"-"+item.bankAccount)
        this.ysAllData.payDate = this.ysSelectData.map(item=>item.payDate)
      },
      openDial(val){
        this.ysSelectData = []
        this.chargeOffData.writeOffAmount=''
        this.ysAllData = {userInfo:[],payDate:[]}
        this.ysAmount = 0
        this.ysWriteOffLeft = 0
        this.$http.post(this.$service.toGetPaid,{currency:this.chargeMoney[0].value,name:val}).then(res=>{
        if(res.code==200){
          this.ysTableData = res.data.paidRecords
        }
        else{this.$message.error(res.message)}
        })
        this.dialogFormVisibleThree = true
        this.$refs.multipleTable.clearSelection()
        
      },
       setOne(t){
            // 获取 当前币种下的金额
            let tempArray = JSON.parse(t)
            let a = 0
            for(let u in tempArray){
                if(tempArray[u].currency == this.chargeOffData.currency){
                    a = tempArray[u].amount  
                }
            }
            return a 
        },
        setOptionArray(tempJsonArray){
            let tempArray = JSON.parse(tempJsonArray)
            let temp = []
            for(let i in tempArray){
                for(let j in this.moneyList){
                    if(tempArray[i].currency == this.moneyList[j].value){
                        temp.push(this.moneyList[j])
                    }
                }
            }
            return temp
        },
  },
  created(){},
  mounted(){},
  data(){
    return {
      
      moneyList: this.$store.getters.getCurrencyAddValCode,
          chargeMoney:[], //币种
          currencyLabel:{},// ['¥','HK$','$','€','￡']
          ysSelectData:[],
          dialogFormVisibleThree:false,
          ysTableData:[],
          ysAmount:0,
          ysWriteOffLeft:0,
          ysAllData:{
              userInfo:[],payDate:[]
            },
          moneyData:[],
        chargeOffData:{writeOffAmount:"",writeOffWay:"0",payWay:"0",currency:"",userInfo:"",payDate:""},
        
        totalApCny:'',
        totalApWoOrgnString:'',
        totalApUnwoOrgnString:'',
        totalApUnPayCheckAmounOrgnString:'',
        totalApWoPayCheckAmountOrgnString:'',
        totalApWoOrgn:'',
        totalApUnwoOrgn:'',
        totalApUnPayCheckAmounOrgn:'',
        totalApWoPayCheckAmountOrgn:''
    }
  },
  mounted() {
    var array = this.$store.getters.getCurrencyIdObjArr
    this.currencyLabel = array[1] // {1："¥", "HK$", "$", "€", "￡"}
  },
  watch:{
       'chargeOffData.currency'(){
           this.totalApWoOrgn = this.setOne( this.totalApWoOrgnString)
            this.totalApUnwoOrgn  = this.setOne(this.totalApUnwoOrgnString)
            this.totalApUnPayCheckAmounOrgn  = this.setOne(this.totalApUnPayCheckAmounOrgnString)
            this.totalApWoPayCheckAmountOrgn  = this.setOne(this.totalApWoPayCheckAmountOrgnString)
       },
       childPropsObj:{
            deep:true,
            immediate:true,
            handler(newValue,oldValue){
                let {totalApCny,totalApUnwoOrgn,totalApWoOrgn,totalApUnPayCheckAmounOrgn,totalApWoPayCheckAmountOrgn} = newValue
                if(totalApCny){              
                    this.totalApCny = totalApCny
                    this.totalApWoOrgnString = totalApWoOrgn
                    this.totalApUnwoOrgnString = totalApUnwoOrgn
                    this.totalApUnPayCheckAmounOrgnString = totalApUnPayCheckAmounOrgn
                    this.totalApWoPayCheckAmountOrgnString = totalApWoPayCheckAmountOrgn
                    this.chargeMoney = this.setOptionArray(totalApUnwoOrgn)
                    this.chargeOffData.currency = this.setOptionArray(totalApUnwoOrgn)[0].value
                    this.totalApWoOrgn = this.setOne(totalApWoOrgn)
                    this.totalApUnwoOrgn  = this.setOne(totalApUnwoOrgn)
                    this.totalApUnPayCheckAmounOrgn  = this.setOne(totalApUnPayCheckAmounOrgn)
                    this.totalApWoPayCheckAmountOrgn  = this.setOne(totalApWoPayCheckAmountOrgn)
                }
            }
        }
  },
  computed:{},
}
</script>

<style scoped lang='less'>
</style>