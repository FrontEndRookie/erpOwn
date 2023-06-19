<template>
    <div class="content-wrapper">
        <div class="content">
          <el-tabs v-model="userType" type="card" @tab-click="handleClick">
            <el-tab-pane label="老系统用户" name="2"></el-tab-pane>
            <el-tab-pane label="新系统用户" name="1"></el-tab-pane>
          </el-tabs>
          <el-form :inline="true" size="medium" class="demo-form-inline">
            <div class="content-search-normal">
              <el-form-item>
                <el-input style="width: 200px;" size="medium"  v-model="selectResult.phone" clearable
                          placeholder="请输入手机号"></el-input>
              </el-form-item>
              
              <el-form-item>
                <el-input style="width: 200px;" size="medium"  v-model="selectResult.cName" clearable
                          placeholder="请输入客户名称"></el-input>
              </el-form-item>
   
              <el-form-item>
                <el-row>
                  <el-button size="medium" type="primary" @click="searchClick">搜索</el-button>
                  <el-button size="medium" type="primary" @click="addNew">新建</el-button>
                </el-row>
              </el-form-item>
    
            </div>
          </el-form>
          
           <Table
            :tableData='tableData'
            :columns='columns'
            :operation='operation'
            :total='total'
            :currentPage='pageNum'
            :pageSize='pageSize'
            @sizeChange='handleSizeChange'
            @currentChange='handleCurrentChange'
            @reSearch='searchClick'
          >
          </Table>
          <Dial v-if="showNewUser" :userType="userType"></Dial>
        </div>
        
      </div>
    </template>
    
    <script>
    import Table from './components/appletTable.vue'
    import Dial from './components/newUser.vue'
    export default {
      components:{
          Table,
          Dial
      },
      props:{},
      data(){
        return {
          userType:'2',
          showNewUser:false,
            //搜索条件
            selectResult:{
              phone:'',
              cName:'',
            },
            //table
            tableData: [],
            pageSize: 10,
            pageNum: 1,
            total: 0,
            // 列
            columns: [
              {label: '企业名称', prop: 'cname', show: true, width: '150'},
              {label: '用户id', prop: 'portalUserId', show: true, width: '150'},
              {label: '用户名称', prop: 'nickName', show: true, width: '150'},
              {label: '用户手机号', prop: 'phone', show: true, width: '150'},
              {label: '创建人名称', prop: 'createUserName', show: true, width: '150'},
              {label: '创建时间', prop: 'createTime', show: true, width: '150'},
            ]
        }
      },
   
      computed:{},
      methods:{
          searchClick(){
            let result = JSON.parse(JSON.stringify(this.selectResult))
            if(this.userType == 1){
              result.companyName = result.cName;
              delete result.cName
            }
            let requestApi = (this.userType == 2 ? this.$service.palletOldUserSearch : this.$service.searchCompanyPage)
            result.pageSize = this.pageSize
            result.pageNum = this.pageNum
            this.$http.post(requestApi,result).then(res=>{
              this.total = res.data && res.data.total
              this.tableData = res.data && res.data.records || []
            })
          },
          //分页跳转
          handleCurrentChange(e) {
            this.pageNum = e
            this.searchClick()
          },
          handleSizeChange(e) {
            this.pageSize = e
            this.searchClick()
          },

          handleClick(e){
            this.userType = e.name;
            this.pageNum = 1;
            this.pageSize = 10;
            this.selectResult = {
              phone:'',
              cName:'',
            }
            this.searchClick();
          },
          addNew(){
            this.showNewUser = true
          }
      },
      created(){
        this.searchClick()
      },
      mounted(){
      },
      watch:{
        userType(nv){
          if(nv == 2){
            this.columns[0].prop = 'cname'
          } else {
            this.columns[0].prop = 'companyName'
          }
      }
    }
    }
    </script>
    
    <style scoped lang='less'>
    
      .content-wrapper {
        width: 100%;
        box-sizing: border-box;
        /*height: 100%;*/
        padding: 20px;
        overflow: hidden;
        background-color: #f3f6f9 !important;
        .content {
            width: 100%;
            .content-search-normal {
                padding: 20px;
                background: #fff;
            }
        }
      }
    </style>