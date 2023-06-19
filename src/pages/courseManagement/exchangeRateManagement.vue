<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" size="medium" class="demo-form-inline" style="padding:10px 0 10px 10px;display:flex; align-items: center;">
        <el-button type="success" round @click="dialogVisibleChange()" style="margin-right:20px;"> 添加币种 </el-button>
        <el-form-item label="年份">
          <el-select v-model="form.recentYear" @change="yearChange" placeholder="请选择" clearable>
            <el-option
              v-for="item in years"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-dialog
        class="dialog_tjbz"
        title="添加币种"
        :visible.sync="dialogVisible"
        :show-close="false"
        width="440px"
        @close="resetForm('currencyForm')">
        <div style="position: relative;">
          <i class="closeIcon el-icon-circle-close" @click="resetForm('currencyForm')"></i>
          <el-form :model="currencyForm" ref="currencyForm" label-width="100px" class="demo-ruleForm">
            <el-form-item
              label="货币代码"
              prop="code"
              :rules="[
                { required: true, message: '货币代码不能为空'}
              ]"
            >
              <el-input maxlength="10" v-model="currencyForm.code" placeholder="货币代码" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item
              label="名称"
              prop="name"
              :rules="[
                { required: true, message: '名称不能为空'}
              ]"
            >
              <el-input maxlength="20" v-model="currencyForm.name" placeholder="名称" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item
              label="货币符号"
              prop="symbol"
              :rules="[
                { required: true, message: '货币符号不能为空'}
              ]"
            >
              <el-input maxlength="10" v-model="currencyForm.symbol" placeholder="货币符号" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item
              label="汇率"
              prop="exchangeRate"
              :rules="[
                { required: true, message: '汇率不能为空'}
              ]"
            >
              <el-input @input="currencyForm.exchangeRate = $utils.changW(currencyForm.exchangeRate,'cbm')" v-model="currencyForm.exchangeRate" placeholder="汇率" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="success" round @click="submitForm('currencyForm')">确 定</el-button>
          <el-button type="primary" round @click="resetForm('currencyForm')">取 消</el-button>
        </span>
      </el-dialog>
      <Table
        :tableData='tableData'
        :columns='columns'
        :operation='operation'
        :total='total'
        :currentPage='pageNum'
        :pageSize='pageSize'
        @sizeChange='handleSizeChange'
        @currentChange='handleCurrentChange'
        @handleClick='handleClick'>
      </Table>
    </div>

    <el-dialog v-if="showDialog" :title="dialogTitle" :visible.sync="dialogFormVisible" @close='closeDialog' width="500px">
      <el-form :model="ruleForm" ref="ruleForm" :label-position="labelPosition" label-width="80px"
               size="medium" class="demo-form-inline" style="padding-left: 20px;padding-top:20px;" label="请编辑汇率信息">
        
        <div v-for="item in currencyArray" :key="item.id">
          <el-form-item :prop="''+item.id" :label="item.name"
          :rules="[
            { required: true, message: '请输入'+item.name+'汇率', trigger: 'blur'}, {validator: sortNo, trigger: 'blur'}
          ]">
            <el-input style="width: 280px;" v-model="ruleForm[''+item.id]" clearable :placeholder="'请输入'+item.name+'汇率'"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <!-- 底部按钮 -->
      <div style="text-align: center;">提示: 汇率设置后24小时内支持修改</div>
      <div slot="footer" class="dialog-footer">
        <div style="text-align: center;padding-top:20px;">
          <el-button size="medium" type="primary"
                     @click="dialogComfirm('ruleForm')">确定
          </el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Table from '@/components/Table'
  import {
    toData
  } from '@/util/assist'

  export default {
    data() {
      return {
        sortNo : (rule, value, callback) => {
          var reg = /(^[1-9][0-9]{0,3}$)|(^[0-9]{0,3}[\.][0-9]{1,4}$)/
          if (!reg.test(value)) {
            callback(new Error('汇率范围是整数最大四位数，小数保留四位'));
          } else {
            callback();
          }
        },
        //table
        /*   monthArr: [
             '有效期','1月','2月','3月','4月'
             ,'5月','6月','7月','8月','9月','10月','11月',
             '12月'
           ],*/
        years: [],
        form: {
          recentYear: ''
        },
        currencyForm:{
          code:'',
          name:'',
          symbol:'',
          exchangeRate:'',
        },
        dialogVisible:false,
        showDialog:false,
        tableData: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        currencyArray:[], // api获取的当前货币数组
        // 列
        columns: [],
        // 操作
        operation: {
          show: true,
          label: '操作',
          width: '160',
          options: [{
            label: '编辑',
            method: 'editExpense',
            auth: ['352001_B'],
          }
          ]
        },
        agentId: '',
        ruleForm: {
          monthNo: ''
        },
        // rules: {
        //   currencyUsd: [{required: true, message: '请输入美元汇率', trigger: 'blur'}, {validator: sortNo, trigger: 'blur'}],
        //   currencyHkd: [{required: true, message: '请输入港币汇率', trigger: 'blur'}, {validator: sortNo, trigger: 'blur'}],
        //   currencyEur: [{required: true, message: '请输入欧元汇率', trigger: 'blur'}, {validator: sortNo, trigger: 'blur'}],
        //   currencyGbp: [{required: true, message: '请输入英镑汇率', trigger: 'blur'}, {validator: sortNo, trigger: 'blur'}],
        // },
        labelPosition: 'left',
        id: null,
        agentCode: '',
        dialogTitle: '',
        dialogFormVisible: false,

      }
    },
    computed: {
      isEdit2() {
        return this.$store.state.common.currencyTypes; //需要监听的数据
      },
    },
    mounted() {
      // console.log(this.$store.state.common.currencyTypes);
      this.currencyArray = this.$store.getters.getCurrencyExceptChina
      this.getTableHeader()
      this.init();
      this.initExchangeRateSearch()
    },
    methods: {
      getTableHeader(){
        var currencyArr = [
          {
            label: '有效期',
            prop: 'monthNo',
            show: true,
            width: '160'
          }]
        var ruleForm= {
          monthNo: ''
        }
        var array = this.currencyArray
        for (let i = 0; i < array.length; i++) {

          var obj = {
            label: '',
            prop: '',
            show: true,
            width: '160'}
          obj.label = array[i].name + "(" + array[i].code + '/' + array[i].symbol +")"
          obj.prop = array[i].id
          currencyArr.push(JSON.parse(JSON.stringify(obj))) // 更新table表头
          this.$set(ruleForm,array[i].id,'') // 更新弹框表单
          // this.$set(this.ruleForm,array[i].id,'') // 更新弹框表单
        }
        this.ruleForm = JSON.parse(JSON.stringify(ruleForm))
        this.showDialog = true
        currencyArr.push({
            label: '添加时间',
            prop: 'createTime',
            show: true,
            width: '160'
          })
        this.columns = JSON.parse(JSON.stringify(currencyArr))
        // console.log(this.columns,this.ruleForm);
      },
      submitForm(formName) {
        this.$refs[formName].validate(async(valid) => {
          if (valid) {
            var obj = JSON.parse(JSON.stringify(this.currencyForm))
            var data = await this.$http.post(this.$service.exchangeRateAdd,obj)
            if(data.code == 200){
              this.$message.success("添加币种成功")
              this.$store.dispatch("getCurrencyTypes");
              this.dialogVisible = false
            }else{
              this.$message.error(data.message)
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.dialogVisible = false
        this.$refs[formName].resetFields();
      },
      dialogVisibleChange(){
        this.dialogVisible = !this.dialogVisible
      },
      init() {
        var myDate = new Date();
        var year = myDate.getFullYear();//获取当前年
        this.initSelectYear(year)
        this.form.recentYear = year;
      },
      initSelectYear(year) {
        this.years = [];
        for (let i = 0; i < 30; i++) {
          this.years.unshift({value: (year + i-1), label: (year + i-1) + "年"});

        }
      },
      yearChange(value) {
        this.form.recentYear = value
        this.initExchangeRateSearch()
      },
      //获取代理列表
      initExchangeRateSearch() {
        this.$http.post(this.$service.searchByYear + "?yearNo=" + this.form.recentYear).then(data => {
          this.tableData = []
          if (data.code == 200) {
            let month = 1;
            for (let i = 0; month < 13;) {
              if (data.data[i] != undefined && data.data[i].monthNo == month) {
                var obj1 = JSON.parse(data.data[i].exchangeRates)
                var obj2 = data.data[i]
                var obj = {...obj2,...obj1}
                this.tableData.push(JSON.parse(JSON.stringify(obj)))
                i++;
              } else {
                this.tableData.push(
                {
                  yearNo: this.form.recentYear,
                  monthNo: month
                }
                )
              }
              month++;
            }
          } else {
            this.$message.error(data.message)
          }
        })
      },

      dialogComfirm(ruleForm) {
        console.log(this.ruleForm);
        this.$refs[ruleForm].validate((valid, object) => {
          if (valid) {
            if (this.dialogTitle == '请编辑汇率信息') {
              var array = this.currencyArray
              var data = {
                id: this.id,
                monthNo: this.ruleForm.monthNo,
                yearNo: this.form.recentYear,
                exchangeRates:{}
              }
              for (let i = 0; i < array.length; i++) {
                this.$set(data.exchangeRates,array[i].id,Number(this.ruleForm[array[i].id])) // 更新弹框表单
              }
              data.exchangeRates = JSON.stringify(data.exchangeRates)
              this.$http.post(this.$service.editByYearAndMonth, data).then(data => {
                if (data.code == 200) {
                  this.$message.success('编辑成功')
                  this.initExchangeRateSearch()
                  this.dialogFormVisible = false
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
        let cheResult=this.checkEdit(scope.row);
        if (cheResult!=true){
          this.$message.error(cheResult)
          return;
        }
        if (scope.method == 'editExpense') {
          if (this.$refs["ruleForm"]) {
            this.$refs["ruleForm"].resetFields();
          }
          this.dialogTitle = '请编辑汇率信息'
          this.dialogFormVisible = true
          var array = this.currencyArray
          for (let i = 0; i < array.length; i++) {
            this.ruleForm[array[i].id] = scope.row[array[i].id]
          }
          this.ruleForm.monthNo = scope.row.monthNo
          this.id = scope.row.id
        }
      },
      checkEdit(row) {
        var today = new Date();
        var date = new Date(row.createTime)
        var oneDay=1000*60*60*24;
        var currentMonth=row.monthNo;
        var start=new Date(new Date(row.yearNo,currentMonth-1,1)-7*oneDay);
        var end=new Date(new Date(row.yearNo,currentMonth,1)-oneDay);
        date.setDate(date.getDate()+1)
        if (today > date) {
          return '汇率设置已超过24小时';
        }else if(!(today>=start&&today<=end)){
          return '该月汇率暂不能设置';
        } else {
          return true;
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
      isEdit2: {
        handler(newObj,oldObj){
          this.currencyArray = this.$store.getters.getCurrencyExceptChina
          this.getTableHeader()
          this.init();
          this.initExchangeRateSearch()
        },
        // immediate: true,
        deep:true
      },
      tableData(idx) {
        return idx
      }
    },
    components: {
      Table
    }
  }
</script>
<style scoped lang="less">
  @import url("../../assets/icon/iconfont.css");
  /deep/.dialog_tjbz .closeIcon{
    font-size: 24px;
    position: absolute;
    right: -10px;
    top: -54px;
    cursor: pointer;
    color: #acacac;;
  }
  /deep/.dialog_tjbz .closeIcon:hover{
    color: #414141;
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

  .wrapper, .content {
    width: 100%;
    background-color: #fff;
  }
  /deep/.is-round{
    background-color:rgba(115, 216, 151, 1);
    border: 1px solid rgba(115, 216, 151, 1);
    width: 112px;
    height: 32px;
    display:flex;
    align-items: center;
    flex-direction: row;
    span{
      font-weight: 700;
      font-style: normal;
      font-size: 15px;
      color: #555555;
    }
  }
  /deep/.dialog_tjbz {
    .el-dialog{
      border-radius: 12px;
      .el-dialog__header{
        span{
          border-left:0px !important;
        }
      }
      .el-dialog__body{
        padding:20px 40px 20px 0px;
      }
      .el-dialog__footer{
        padding:0px 40px;
        padding-bottom: 20px;
        .dialog-footer{
          display:flex; 
          align-items: center;
          flex-direction: row;
          justify-content: flex-end;
          .is-round{
            width:82px;
          }
          .el-button--primary{
            background-color: rgba(215, 215, 215, 1) !important;
            border: 1px solid rgba(215, 215, 215, 1) !important;
          }
        }
      }
    }
  }
  .content-search-normal {
    padding: 20px !important;
    background: #fff;
  }
  .el-dialog {
    width: 300px;
    min-width: 500px !important;
  }
</style>
