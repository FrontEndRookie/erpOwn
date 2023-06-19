<template>
    <div>
        <el-dialog
            title="应付核销信息"
            :visible.sync="dialogVisible"
            :before-close="handleClose"
            width= "1000px" 
            style="margin:auto;">
            <div class="contont">
                <div class="cont">
                    <div class="flex_line">
                        <div style="width:120px"><span style="color:red">*</span><span>本次核销金额:</span></div>
                        <div>
                            <el-input 
                                v-model="writeOffAmount" 
                                maxlength="10" 
                                onkeyup="this.value= this.value.match(/^-?\d{0,10}(\.\d{0,2})?/)? this.value.match(/^-?\d{0,10}(\.\d{0,2})?/)[0] : ''" 
                                @blur="writeOffAmount = $event.target.value"  
                                placeholder="请输入核销金额">
                            </el-input>
                        </div>
                    </div>
                    <div class="flex_line">
                        <div style="width:120px"><span style="color:red">*</span><span>付款账户信息:</span></div>
                        <div>
                            <el-select
                                v-model="bankAccount"
                                filterable
                                remote
                                
                                reserve-keyword
                                placeholder="请输入付款账户"
                                :remote-method="remoteMethod">
                                <el-option
                                    v-for="(item,index) in tempArray"
                                    :key="index"
                                    :label="item.accountBank + '-'+ item.userName + '-'+ item.bankAccount"
                                    :value="item.id">
                                    <span>{{item.accountBank}}</span>-
                                    <span>{{item.userName}}</span>-
                                    <span>{{item.bankAccount}}</span>
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <div class="cont">
                    <div class="flex_line">
                        <div style="width:120px"><span style="color:red">*</span><span>币种:</span></div>
                        <div>
                            <el-select v-model="currency"  placeholder="请选择">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="flex_line">
                        <div style="width:120px"><span style="color:red">*</span><span>付款方式:</span></div>
                        <div>
                            <el-select v-model="writeOffWay"  placeholder="请选择">
                                <el-option
                                v-for="item in writeOffWayArray"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <div class="cont">
                    <div class="flex_line">
                        <div style="width:120px"><span style="color:red">*</span><span>付款时间:</span></div>
                        <div>
                            <el-date-picker
                                v-model="paymentTime"
                                type="date"
                                
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                placeholder="选择日期"
                                :picker-options="$store.getters.tomorrowDisabledDatePickerOptions">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="flex_line">
                        <div style="width:120px"><span style="color:red">*</span><span>结算方式:</span></div>
                        <div style="width:220px">
                            <el-radio-group v-model="payWay">
                                    <el-radio label="0">付款买单</el-radio>
                                    <el-radio label="1">月结</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                </div>
                <div class="flex_line" style="justify-content:center;margin:20px 0 "> 
                    <div>订单应付总金额：{{totalApCny}}</div>
                    <div style="margin-left:20px">未对账金额：
                            <span>{{currencyArr[currency]}}</span>
                            <!-- <span v-if="currency == 1">￥</span>
                            <span v-if="currency == 2">HK$</span>
                            <span v-if="currency == 3">$</span>
                            <span v-if="currency == 4">€</span>
                            <span v-if="currency == 5">￡</span>    -->
                            {{totalApUnPayCheckAmounOrgn}} 
                    </div>
                    <div style="margin-left:20px">已对账金额：
                            <span>{{currencyArr[currency]}}</span>
                            {{totalApWoPayCheckAmountOrgn}} 
                    </div>
                    <div style="margin-left:20px">未核销金额：
                            <span>{{currencyArr[currency]}}</span>
                            {{totalApUnwoOrgn}} 
                    </div>
                    <div style="margin-left:20px">已核销金额：
                            <span>{{currencyArr[currency]}}</span>  
                            {{totalApWoOrgn}}  
                    </div>
                </div>
                <div class="fo" >
                    <el-button type="primary"  @click="onSubmit">确认核销</el-button>
                    <el-button   @click="cancle">取消</el-button>
                </div>
                
            </div>
        </el-dialog>
    </div>
</template>

<script>
// import { moneyList} from '../../../util/util'
export default {
    props:['childPropsObj','verificationArr',"selectResult","slectAllDataStatic","woStatus"],
    data() {
        return {
            moneyList: this.$store.getters.getCurrencyAddValCode,
            dialogVisible: false,
            bankAccount: '', // 付款账户信息
            currency:'1',// 默认选择CNY
            writeOffAmount:'',//输入的核销金额
            writeOffWay:'0', //核销方式 0=银行转账 1=应付对冲
            paymentTime:'',
            payWay:'1', //0=付款买单 1=月结
            totalApCny:0,// 应付总金额
            totalApUnPayCheckAmounOrgn:0, //未对账金额
            totalApUnPayCheckAmounOrgnString:0,
            totalApWoPayCheckAmountOrgn:0, //已对账金额
            totalApWoPayCheckAmountOrgnString:0,
            totalApUnwoOrgn:0,// 未核销金额
            totalApUnwoOrgnString:0,// 未核销金额 jsonArray
            totalApWoOrgn:0,// 已核销金额
            totalApWoOrgnString:0,// 已核销金额jsonArray
            payWayArray:[{
                    value:'0',
                    label:"付款买单"
                },{
                    value:"1",
                    label:'月结'
                }
            ],
            writeOffWayArray:[
                {
                    value:'0',
                    label:'银行转账'
                },{
                    value:'1',
                    label:"应付对冲"
                }
            ],
            options: [],
            tempArray:[],
            allData:this.getArray(),
            currencyArr: {},
        };
    },
    mounted() {
        var array = this.$store.getters.getCurrencyIdObjArr
        this.currencyArr = array[1] // {1："¥", "HK$", "$", "€", "￡"}
    },

    watch:{
        currency(newValue){
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
                    this.options = this.setOptionArray(totalApUnwoOrgn)
                    this.currency = this.setOptionArray(totalApUnwoOrgn)[0].value
                    this.totalApWoOrgn = this.setOne(totalApWoOrgn)
                    this.totalApUnwoOrgn  = this.setOne(totalApUnwoOrgn)
                    this.totalApUnPayCheckAmounOrgn  = this.setOne(totalApUnPayCheckAmounOrgn)
                    this.totalApWoPayCheckAmountOrgn  = this.setOne(totalApWoPayCheckAmountOrgn)
                }
            }
        }

    },
    methods:{
        getArray(){
            return this.verificationArr
        },
        async handleClose(){
            this.dialogVisible = false
            this.$parent.showVerification = false
            // await this.cancle()
        },
        setOne(t){
            // 获取 当前币种下的金额
            let tempArray = JSON.parse(t)
            let a = 0
            for(let u in tempArray){
                if(tempArray[u].currency == this.currency){
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
        // 输入收款账户信息的返回值
        async remoteMethod(e){
            if (e !== '') {
                let res =  await this.$http.post(this.$service.searchBankAccount + `?userName=${e}`)
                this.tempArray = res.data
            } else {
                let res =  await this.$http.post(this.$service.searchBankAccount)
                // console.log(res)
                this.tempArray = res.data
            }
        },
        showModal(){
            this.dialogVisible = true
        },
        async cancle(){
            this.dialogVisible = false
            this.$parent.showVerification = false
            this.$emit('farhersearch2');
        },
        async onSubmit(){
            let { bankAccount, currency ,writeOffAmount , totalApUnwoOrgn , writeOffWay ,paymentTime,payWay} = this;
            if(writeOffAmount == '0') {
                this.$message.error('核销金额不得为0')
                return ;
            }
            if(writeOffAmount > totalApUnwoOrgn ){
                this.$message.error('核销金额>未核销金额,请重新输入')
                return ;
            }
            if(bankAccount == ''){
                this.$message.error('请输入付款账户信息')
                return ;
            }
            if(paymentTime == ''){
                this.$message.error('请选择付款时间')
                return ;
            }
            let params ={
                bankAccount:this.tempArray.filter(item=>item.id == bankAccount)[0],
                currency:currency,
                payWay:payWay,
                paymentTime:paymentTime,
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
            let res = await this.$http.post(this.$service.writeOff,params);
            if(res.code == 200){
                this.$message.success("核销成功")
                await this.cancle()
            } else {
                this.$message.error(res.message)
            }
        }
    }
}
</script>

<style scoped >
.contont{
   
    margin-top: 15px;
}
.fo{
display: flex;
justify-content: center;
padding-bottom: 20px;

}

.cont{
    display: flex;
    justify-content: space-between;
}
.flex_line{
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}
.flex_line>span{
    flex: 1;
}
</style>