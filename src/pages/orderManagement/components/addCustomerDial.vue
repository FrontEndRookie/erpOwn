<template>
    <div>
        <el-dialog
            title="添加结算对象"
            :visible.sync="dialogVisible"
            width="fit-content"
            >
            <el-form style="padding:50px 30px">
                <el-select v-model="customerName" filterable clearable>
                    <el-option v-for="(item,index) in selectOpt" :disabled="tableExistedObj.includes(item.companyName)" :key="item.id" :label="item.companyName" :value="item.companyName+'-'+item.id"></el-option>
                </el-select>
            </el-form>
            <span slot="footer" class="dialog-footer" style="margin-top: 60px;">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmChoose">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                dialogVisible:false,
                selectOpt:[],
                customerName:''
            }
        },
        created(){
            this.dialogVisible = true
            this.getSelectOpt()
    },
    computed: {
        tableExistedObj() { 
            return this.$parent.arOrderPriceList.map(i=>i.list[0].expenseUnitName)
        }
    },
        methods:{
            confirmChoose(){
                if(this.customerName){
                    this.$emit('getCustomer',this.customerName)
                    this.dialogVisible = false

                }
                else {
                    this.$message.warning('请选择结算对象')
                }
            },
            getSelectOpt(){
                this.$http.get(this.$service.listCompanyByCustomerResponsibleId+`?orderId=${this.$parent.order.id}`).then(res=>{
                if(res.code == 200) {
                    this.selectOpt = res.data
                }
            })
        }
    },
        watch:{
            dialogVisible(nv){
                if(!nv){
                    this.$parent.showAddCustomer = false
                }
            }
        }
    }
</script>
<style lang="less" scoped>
</style>