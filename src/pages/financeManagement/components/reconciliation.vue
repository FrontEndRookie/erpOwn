<template>
<div>
    <el-dialog
        title="应付对账信息"
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        top="20vh"
        width="50%">
            <el-dialog
                width="70%"
                title="匹配结果"
                :visible.sync="innerVisible"
                append-to-body>
                <el-table
                    :data="tableData"
                    border
                    stripe
                    :cell-style='backStyle'
                    max-height="350"
                    style="width: 100%;margin-top:20px;">
                    <el-table-column
                        prop="waybillNumber"
                        label="对账单运单号" >
                    </el-table-column>
                    <el-table-column
                        prop="sysWaybillNumber"
                        label="系统运单号" >
                    </el-table-column>
                    <el-table-column
                     
                        label="对账单金额">
                        <template slot-scope="scope">
                            <!-- <span  v-if="scope.row.difference =='R'">已对账，不能重复对账</span> -->
                            <span>{{scope.row.cost}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="sysCost"
                        label="未对账金额" >
                    </el-table-column>
                    <el-table-column
                        label="差异" >
                        <template slot-scope="scope">
                           <span class="text_color_red" v-if="scope.row.difference =='R'">已对账，不能重复对账</span>
                           <span class="text_color_red" v-else-if="scope.row.difference =='N'">未找到</span>
                           <span class="text_color_red" v-else-if="scope.row.difference > 0 ">+{{scope.row.difference}}</span>
                           <span class="text_color_yellow" v-else-if="scope.row.difference < 0 ">{{scope.row.difference}}</span>
                           <span v-else-if="scope.row.difference == 0 ">{{scope.row.difference}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="customer"
                        label="应付对象">
                    </el-table-column>
                    <el-table-column
                        prop="orderNo"
                        width="180"
                        label="订单号" >
                    </el-table-column>
                    <el-table-column
                        prop="mscsName"
                        label="操作">
                    </el-table-column>
                </el-table>
                <div class="cont">
                    <div>对账单费用总额：{{dialogData.expenseTotal}}</div>
                    <div>匹配成功{{dialogData.count}}条，金额：{{dialogData.expenseTotalSuccess}}</div>
                    <div>匹配失败{{dialogData.countErr}}条，金额：{{dialogData.expenseTotalError}} </div>
                    <div class="text_color_blue" style="cursor:pointer" @click="exportErrExcel">导出全部对账单</div>
                </div>
                <div class="footer"  slot="footer" >
                    <el-button type="primary" style="width:210px" @click="btnInsert">确认对账并导出全部对账单</el-button>
                    <el-button  @click="btnCancle">取消</el-button>
                </div>
                 
            </el-dialog>
        <div class="cont">
            <div class="flex_line">
                <div> <span style="color:red">*</span><span>对账金额：</span></div>
                <div>  
                    <el-input
                        
                        type="number"
                        @change='getNumberLength'
                        maxlength="10"
                        placeholder="请输入数字"
                        v-model="input3">
                    </el-input> 
                </div>
            </div>
            <div class="flex_line">
                <div>
                    <span style="color:red">*</span><span>币种：</span>
                </div>
                <div>
                    <el-select v-model="value" placeholder="请选择">
                        <el-option
                        v-for="item in options"
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
                <div> <span style="color:red">*</span><span>应付对象：</span></div>
                <div>  
                    <el-input
                        
                        disabled
                        placeholder="请输入内容"
                        v-model="expenseUnitName">
                    </el-input> 
                </div>
            </div>
            <!-- <div class="flex_line" style="justify-content:flex-start">

               <el-upload
                      class="upload-demo"
                      ref="uploadExcle"
                      :before-upload="beforeAvatarUpload"
                      :limit="1"
                    >
                    <el-button slot="trigger"  type="primary">导入对账单</el-button>
                </el-upload>
                 
            </div> -->
        </div>
        <div class="cont" style="justify-content:center">
            <div>订单应付总金额：{{totalApCny}}  </div>
            <div style="margin-left:20px">未对账金额：
                <span>{{currencyArr[value]}}</span>
                {{unreconciledAmount?unreconciledAmount:0}} 
            </div>
            <div style="margin-left:20px">已对账金额：
                <span>{{currencyArr[value]}}</span>
                <!-- <span v-if="value == 1">￥</span>
                <span v-if="value == 2">HK$</span>
                <span v-if="value == 3">$</span>
                <span v-if="value == 4">€</span>
                <span v-if="value == 5">￡</span>  -->
                {{payCheckAmount?payCheckAmount:0}}   
             </div>
        </div>
        <div class=" footer"  slot="footer">
            <el-button type="primary" @click="comfire">确认对账</el-button>
            <el-button @click="cancle">取 消</el-button>
            
        </div>
  
    </el-dialog>
</div>
    
</template>

<script>

import { postImage ,exportFile} from '../../../util/util'
export default {
    name:'reconciliation',
    props:['childPropsObj','selectResult','idsArray',"slectAllDataStatic","woStatus"],
    data() {
        return {
            moneyList: this.$store.getters.getCurrencyAddValCode,
            dialogVisible: false,
            input3:'', //对账金额
            expenseUnitName:'', //应付对象 
            value: '1', // 默认选择CNY
            totalApCny:0,// 应付总金额
            unreconciledAmount:0,// 未对账金额
            payCheckAmount:0,// 已对账金额
            options: [],
            file:'',//附件
            innerVisible: false,// 内层模态框
            tableData:[],//
            dialogData:{},//
            opIds:[] ,// 确认对账的参数 
            totalApUnwoOrgnString:"",// 返回未对账金额 jsonArray
            totalApWoOrgnString:"",// 返回对账金额显示 jsonArray
            currencyArr:{},
        };
    },
    async mounted() {
        var array = this.$store.getters.getCurrencyIdObjArr
        this.currencyArr = array[1] // {1："¥", "HK$", "$", "€", "￡"}
    },
    watch:{
        value(newValue){
            this.unreconciledAmount = this.setOne(this.totalApUnwoOrgnString)
            this.payCheckAmount = this.setOne(this.totalApWoOrgnString)
        },
        childPropsObj:{
            deep:true,
            immediate:true,
            handler(newValue,oldValue){
                let {totalApCny,totalApUnwoOrgn,totalApWoOrgn,expenseUnitName,ids} = newValue ;
                // console.log(expenseUnitName,"newValue")
                if(totalApCny){      
                    this.opIds = ids
                    this.expenseUnitName = expenseUnitName
                    this.totalApCny = totalApCny
                    this.totalApUnwoOrgnString = totalApUnwoOrgn
                    this.totalApWoOrgnString = totalApWoOrgn
                    this.options = this.setOptionArray(totalApUnwoOrgn)
                    this.value = this.setOptionArray(totalApUnwoOrgn)[0].value
                    this.unreconciledAmount = this.setOne(this.totalApUnwoOrgnString)
                    this.payCheckAmount = this.setOne(this.totalApWoOrgnString)
                }
            }
        }
    },
    methods: {
        async handleClose(){
            await this.cancle()
        },
        getNumberLength(e){
            // console.log(e.length)
            if(e.length > 10){
                this.$message.error('最多输入10位数字')
                this.input3 = ''
            }
        },
        setOne(t){
            // 获取 当前币种下的未对账金额
            let tempArray = JSON.parse(t)
            let a = ''
            for(let u in tempArray){
                if(tempArray[u].currency == this.value){
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
            // console.log(temp)
            return temp
        },
        showModal(){
            this.dialogVisible = true
        },
        beforeAvatarUpload(file){
            // console.log(file)
            this.file = file
            let reader = new FileReader();
            reader.readAsDataURL(file);
            let that = this;
            reader.onload = function() {
                that.upLoad()
            };
        },
        upLoad(){
            let fileFormData = new FormData();
            fileFormData.append('excel', this.file)
            let copyResult = JSON.parse(JSON.stringify(this.selectResult))
            copyResult.expenseUnitName = this.expenseUnitName
            if(!this.slectAllDataStatic) {
                copyResult.ids = this.idsArray
            }   
            if(copyResult.payWriteOffStatusList[0]=="") {
                copyResult.payWriteOffStatusList = []
            }
            // console.log(this.idsArray)
            fileFormData.append('financePageDTO', JSON.stringify(copyResult))                                                                                        
            // fileFormData.append('ids',JSON.stringify(this.idsArray))
            // fileFormData.append('expenseUnitName', this.expenseUnitName)                                                                                        
            postImage(this.$service.importExcel,fileFormData).then((res)=>{     
                if(res.code == 200){
                    this.tableData = res.data.orderPaymentBillList
                    this.dialogData = res.data
                    this.innerVisible = true
                    this.$message({
                        message: '导入成功',
                        type: 'success'
                    });
                }else{
                    this.$message({
                        message: '导入失败',
                        type: 'error'
                    });
                }
            })
        },
        async cancle(){
                this.dialogVisible = false
                this.$emit('farhersearch');
        },
        comfire(){
            let { input3 , unreconciledAmount } = this 
            // console.log(input3)
            // console.log(unreconciledAmount)
            if(Number(input3) == ''){
                this.$message({
                        message: '对账金额不能为空',
                        type: 'warning'
                    });
               return ;
            }
            if(Number(input3)  > unreconciledAmount){
                this.$message({
                        message: '对账金额> 未对账金额，请重新输入',
                        type: 'warning'
                    });
                this.input3 = ''    
            }else{
                let params ={
                    currency:this.value,
                    expenseUnitName:this.expenseUnitName,
                    inputCheck:input3,
                    opIds:this.opIds,
                    
                }
                if(this.slectAllDataStatic){
                    delete params.opIds
                    params.financePageDTO = this.selectResult
                    params.financePageDTO.woStatus = this.woStatus
                    if(params.financePageDTO.payWriteOffStatusList.indexOf("") != -1){
                        params.financePageDTO.payWriteOffStatusList = []
                    }
                }
                // console.log(params)
                this.$http.post(this.$service.toEnterReconciliation,params).then((res)=>{
                    // console.log(res)
                    if(res.code == 200){
                        this.$message({
                            message: '对账成功',
                            type: 'success'
                        });
                        this.cancle()
                    }
                })
            }
        },
        btnCancle(){
            this.innerVisible = false
        },
        async btnInsert(){

            let res = await this.$http.post(this.$service.toReconciliation,{orderPaymentBills:this.tableData})
            if(res.code == 200){
                this.exportErrExcel()
            }
            
            this.dialogVisible = false
            this.innerVisible = false 
        },
        backStyle({row, columnIndex}){
 
            if(columnIndex == 2 || columnIndex == 3){
                if(row.difference == 'R'){
                    // console.log(row.difference)
                    return 'background: #62a0ed'
                }else if(row.difference > 0){
                    return 'background: #e55f5f '
                }else if(row.difference < 0){
                    return 'background: #eddc62'
                }   
            }
        },
        async exportErrExcel(){
            if(this.expenseUnitName == ''){
                this.$message.error('应付对象不能为空')
            }else{
                let res = await this.$http.post(this.$service.exportErrExcel,{orderPaymentBills:this.tableData},{responseType: 'arraybuffer'})
                exportFile(res,"application/vnd.ms-excel",'全部对账单')
            }
            
        },
        

    },
}
</script>
<style scoped>
.el-dialog__footer{
    padding: 0 45px 30px;
}
.cont{
    display: flex;
    margin-top: 15px;
    justify-content: space-between;
}
.flex_line{
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}
.footer{
    margin: 40px 0 0 0;
    display: flex;
    justify-content: center;
}
.text_color_yellow{
    color: #eddc62;
}
.text_color_red{
    color: #e55f5f;
}
.text_color_blue{
    color: #62a0ed;
}
</style>