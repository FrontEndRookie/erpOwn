<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" size="medium" class="demo-form-inline">
        <div class="content-search-normal">
          <el-form-item style="float:left">
            开户行:
            <el-input v-model="searchParm.accountBank" style="width: 200px;" size="medium" :maxlength="30" clearable placeholder="请输入开户行"></el-input>
          </el-form-item>
          <el-form-item style="float:left;margin-left:20px">
            户名：
            <el-input v-model="searchParm.userName" style="width: 200px;" size="medium" :maxlength="30" clearable placeholder="请输入户名"></el-input>
          </el-form-item>
          <el-form-item style="float:right">
            <el-row>
              <el-button @click="searchBankAccount" size="medium" type="primary" v-auth="['109000_B']">搜索</el-button>
              <el-button @click="editAccount(1)" size="medium" type="primary" v-auth="['109001_B']">新增</el-button>
            </el-row>
          </el-form-item>
        </div>
      </el-form>
          <el-table
              :data="tableData"
              border
              stripe
              header
              class="finance-talbe"
              style="width: 100%">
              <template slot="empty">
                <img class="data-pic" src="../../assets/kong-icon.png"/>
                <p>暂无数据</p>
              </template>
              <el-table-column type="index" label="序号" min-width="40"></el-table-column>
              <el-table-column prop="userName" label="户名" min-width="80"></el-table-column>
              <el-table-column prop="accountBank" label="开户行" min-width="80"></el-table-column>
              <el-table-column prop="bankAccount" label="银行账号" min-width="80"></el-table-column>
              <el-table-column prop="createTime" label="添加时间" min-width="80"></el-table-column>
              <el-table-column  label="操作" min-width="80">
                 <template slot-scope="scope">
                  <el-button @click="editAccount(2,scope.row)" type="text" size="small" v-auth="['109002_B']">编辑</el-button>
                  <el-button @click="deleteBankAccount(scope.row)" type="text" size="small" v-auth="['109003_B']">删除</el-button>
                </template>  
              </el-table-column>  
            </el-table>
    </div>
   
    <el-dialog :title="this.buttonType==1 ? '新增银行账户':'修改银行账户'" :visible.sync="dialogFormVisible" style="margin-left:20%">
      
      <div slot="footer" class="dialog-footer">
        <el-form label-position="left" :inline="true" size="medium" class="dialog-demo">
        <div class="rest-style" style="margin-top: 20px;">
          <el-form-item label="开户行" label-width="120px" required>
            <el-input v-model.trim="bankMessage.accountBank" placeholder="请选择开户行" style="width:300px" maxlength="30">
            </el-input>
          </el-form-item>
          <el-form-item label="户名" label-width="120px" required>
            <el-input size="medium"  v-model.trim="bankMessage.userName" placeholder="请输入户名" maxlength="30"  style="width:300px">
            </el-input>
          </el-form-item>
          <el-form-item label="账号" label-width="120px" required>
            <el-input size="medium"  v-model.trim="bankMessage.bankAccount" placeholder="请输入账号" maxlength="30" style="width:300px">
            </el-input>
          </el-form-item>
        </div>
      </el-form>
        <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <div style="text-align: center;padding-top:20px;">
          <el-button size="medium" type="primary"
            @click="dialogComfirm">确 定</el-button>
          <el-button size="medium" @click="dialogFormVisible = false">取 消
          </el-button>
        </div>
      </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //判断新增和编辑按钮
        buttonType:1,
        //新增和编辑按钮弹框的信息
        bankMessage:{
          bankAccount:"",
          accountBank:"",
          userName:"",
        },
        //搜索参数
        searchParm:{
          accountBank:"",
          userName:""
        },
        //删除操作参数
        deleteId:{id:0},
        dialogFormVisible: false,
        //table
        tableData: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        orderNo: '',
        waybillNo: '',
        inboundNo: '',
        agentId: '',
        agentOpt: [],
        customerName: '',
        pol: '',
        polOpt: [],
        pod: '',
        podOpt: [],
        typeCode: '全部',
        orderCount: 0
      }
    },
    mounted() {
      this.searchBankAccount()
    },
    methods: {
      //银行账号列表-查询
      searchBankAccount() {
        this.$http.post(this.$service.searchBankAccount+`?accountBank=${this.searchParm.accountBank}&userName=${this.searchParm.userName}`).then((data) => {
          this.loading = false
          if (data.code == 200) {
            let getData = JSON.parse(JSON.stringify(data.data))
            this.tableData = getData
            // this.$forceUpdate()
          } else {
            this.$message.error(data.message)
          }
        })
      },
         //银行账号列表-编辑&新增
      editAccount(add,message){
        if(add == '1'){
          this.bankMessage = {
            bankAccount:"",
            accountBank:"",
            userName:"",
          }
        }else{
          this.bankMessage = {
            bankAccount:message.bankAccount,
            accountBank:message.accountBank,
            userName:message.userName,
          }
        }
        if(message) { 
          this.bankMessage.id = message.id
        } 
        this.buttonType = add
        this.dialogFormVisible = true
      },
      //编辑弹框确认
       dialogComfirm(){
         if(this.bankMessage.bankAccount == "" || this.bankMessage.accountBank == "" || this.bankMessage.userName == "") {
           this.$message({
             type:"warning",
             message:"开户行、户名、账号不能为空"
           })
           return
         }
        
        // this.bankMessage.bankAccount = this.bankMessage.bankAccount.replace(/[^\d.]/g,'')
        this.$http.post(this.$service.editBankAccount,this.bankMessage, {
          headers: {
            // key 新增1|编辑2 value diffFlag 同key
            diffFlag: {
              1: 1,
              2: 2,
            }[this.buttonType]
          },
        }).then(
          data =>{
            if(data.code == 200) {
              this.$message.success('编辑成功')
              this.searchBankAccount()
            } else {
                this.$message.error(data.message)
                // console.log(data.message);
              }
          }
        ).catch(() => {
            console.log('取消')
          })
        this.dialogFormVisible = false
      },
      //银行账号列表-删除
      deleteBankAccount(parm){
        this.$confirm("确定删除这条数据?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            // console.log(typeof(parm.id))
            this.$http.post(this.$service.deleteBankAccount,{id:parm.id}).then(data => {
              if (data.code == 200) {
                this.searchBankAccount()
                this.$message.success('删除成功')
              } else {
                this.$message.error(data.message)
              }
            })
          }).catch(() => {
            console.log('取消')
          })
        
      },
    }
  }
</script>

<style scoped lang="less">
  @import url("../../assets/icon/iconfont.css");
/deep/ .el-table{
  max-height: 550px;
  overflow:auto ;
 .el-table__body-wrapper {
  max-height: 480px;
  overflow-y: auto;
}
}
  .content-wrapper {
    width: 100%;
    box-sizing: border-box;
    /*height: 100%;*/
    padding: 20px;
    overflow: hidden;
    background-color: #f3f6f9 !important;
  }

  .el-form {
    background-color: #FFF;
    text-align: center;
  }

  .el-form--inline .el-form-item {
    margin-bottom: 20px;
    vertical-align: bottom;
  }

  .parimary_btn {
    background-color: #9ac143 !important;
    border-color: #9ac143 !important;

    &:hover {
      color: #f1e3d5 !important;
      background-color: #7f9e3c !important;
      border-color: #7f9e3c !important;
    }
  }

  .icon-shouqi {
    color: #3985ca;
    margin-right: 2px;
    font-size: 14px;
    margin-left: 15px;
  }

  .shouqi {
    cursor: pointer;
    color: #3985ca;
    position: relative;
  }

  .shouqi .iconfont {
    font-size: 2px;
    position: absolute;
    height: 20px;
    line-height: 20px;
    margin-top: 7px;
    margin-left: 10px;
  }

  .wrapper,.content {
    width: 100%;
  }
/deep/.el-table {
  th {
    // background-color: #fff;
    border-right: 1px solid silver;
    border-bottom: 1px solid silver;
    &:first-child {
      border-left: 1px solid silver;
    }
  }
  td {
    // background-color: #fff;
    border-right: 1px solid silver;
    border-bottom: 1px solid silver;
    &:first-child {
      border-left: 1px solid silver;
    }
  }
}
  .el-table .sort-caret.ascending {
    border-bottom-color: #FFF;
  }

  .content-search-normal {
    padding: 20px 20px 0 20px !important;
    background: #fff;
  }

  .content-search-high {
    padding: 0 0 20px 30px;
  }

  /deep/ .el-dialog {
    width: 650px!important;
    border-radius: 6px;
  }
</style>
