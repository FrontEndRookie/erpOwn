<template>
<div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" size="medium" class="demo-form-inline">
        <div class="content-search-normal">
          <el-form-item>
            <el-input style="width: 200px;" size="medium"  v-model="selectResult.customerName" clearable
                      placeholder="请输入客户名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input style="width: 200px;" size="medium"  v-model="selectResult.companyName" clearable
                      placeholder="请输入企业名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input style="width: 200px;" size="medium" onkeyup="this.value=this.value.replace(/[^\d]/g,'') " @blur="selectResult.tel = $event.target.value"  v-model="selectResult.tel" clearable
                      placeholder="请输入手机号"></el-input>
          </el-form-item>
             <el-form-item>
            <el-input style="width: 200px;" size="medium"   v-model="selectResult.companyContact" clearable
                      maxlength="20" placeholder="请输入企业联系人"></el-input>
          </el-form-item>
             <el-form-item>
            <el-input style="width: 200px;" size="medium" onkeyup="this.value=this.value.replace(/[^\d-]/g,'') " @blur="selectResult.companyTel = $event.target.value"  v-model="selectResult.companyTel" clearable
                      maxlength="20" placeholder="请输入企业联系电话"></el-input>
          </el-form-item>
             <el-form-item>
            <el-input style="width: 200px;" size="medium"  v-model="selectResult.companyEmail" clearable
                    maxlength="50" placeholder="请输入企业邮箱"></el-input>
          </el-form-item>
             <el-form-item>
            <el-input style="width: 200px;" size="medium" onkeyup="this.value=this.value.replace(/[^\d]/g,'') " @blur="selectResult.companyQq = $event.target.value"  v-model="selectResult.companyQq" clearable
                     maxlength="20"   placeholder="请输入QQ号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select placeholder="请选择认证状态" size="medium" v-model="selectResult.status" clearable style="width: 200px;">
              <el-option
                v-for="item in certifyStatus"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
 <el-form-item>
            <el-select placeholder="请选择客户标签" size="medium" v-model="selectResult.isAgent" clearable style="width: 200px;">
              <el-option
                v-for="item in customLabel"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-button @click="searchClick" size="medium" type="primary" icon="el-icon-search" v-auth="['652000_B']">搜索</el-button>
              <el-button  size="medium" type="primary" @click="exportExcel" v-auth="['652004_B']">导出</el-button>
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
    </div>
    
  </div>
</template>

<script>
import Table from './components/clientTable.vue'
export default {
  components:{
      Table
  },
  props:{},
  data(){
    return {
        //认证状态
        certifyStatus:[
            {name:'待审核',value:1  },
            // {name:'待客户验证',value:3},
            {name:'审核失败',value:2},
            // {name:'验证失败',value:5},
            {name:'已认证',value:4}
        ],
        //客户标签
        customLabel:[
          {name:"代理",value:1}
        ],
        //搜索条件
        selectResult:{
            customerName:'',
            companyName:'',
            tel:'',
            status:'',
            companyContact:'',
            companyTel:'',
            companyEmail:'',
            companyQq:'',

        },
        //table
        tableData: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        // 列
        columns: [
          {label: '企业名称', prop: 'companyName', show: true, width: '150', fixed: 'left'},
          {label: '统一信用代码', prop: 'creditCode', show: true, width: '150', fixed: 'left'},
          {label: '客户标签', prop: 'isAgent', show: true, width: '70'},

          {label: '企业管理员', prop: 'customerName', show: true, width: '100'},
          {label: '管理员手机号', prop: 'tel', show: true, width: '150'},
          {label: '企业联系人', prop: 'companyContact', show: true, width: '150'},
          {label: '企业联系电话', prop: 'companyTel', show: true, width: '150'},
          {label: '企业邮箱', prop: 'companyEmail', show: true, width: '150'},
          {label: 'QQ号', prop: 'companyQq', show: true, width: '150'},
          {label: '营业执照', prop: 'businessLicensePath', show: true, width: '90'},
          // {label: '开户账号', prop: 'payWay', show: true, width: '90'},
          {label: '认证时间', prop: 'createTime', show: true, width: '160'},
          {label: '认证状态', prop: 'status', show: true, width: '150'},
          // {label: '打款金额', prop: 'paymentAmount', show: true, width: '100'},
          // {label: '结算方式', prop: 'payWay', show: true, width: '100'},
          {label:'售前客服',prop:'pcscName',show:true,width:'150'},
          // {label: '账期', prop: 'accountingPeriod', show: true, width: '100'},
          // {label: '额度(元)', prop: 'quota', show: true, width: '100'},

        ],
        // 操作
        operation: {
          show: true,
          label: '操作',
          width: '120',
          options: [{
            label: '编辑',
            method: 'binding',
            auth: ['652003_B']
          }
          ]
        },
    }
  },
  watch:{
    '$route.query.companyName'(nv,ov){
        this.selectResult.companyName = this.$route.query.companyName
        this.searchClick()
    }
  },
  computed:{},
  methods:{
    
    //十六进制转中文
     hToC(data){
        if(data.length%2) return ''
        var tmp = ''
        for(let i =0;i<data.length;i+=2){
            tmp+='%'+data.charAt(i)+data.charAt(i+1);
        }
        return decodeURI(tmp)
    },
      exportExcel(){
        let requestData=JSON.parse(JSON.stringify(this.selectResult))
        delete requestData.status
           this.$http.post(this.$service.customerExport,requestData, {
            responseType: 'arraybuffer',
          }).then(res=>{
          
            const aLink = document.createElement("a");
            let blob = new Blob([res], {
              type: "application/vnd.ms-excel"
            })
            aLink.href = URL.createObjectURL(blob)
            aLink.setAttribute('download', '客户列表' + '.xlsx') // 设置下载文件名称
            aLink.click()
            document.body.appendChild(aLink)
        })
      },
      searchClick(){
        let result = JSON.parse(JSON.stringify(this.selectResult))
        result.pageSize = this.pageSize
        result.pageNum = this.pageNum
        this.$http.post(this.$service.authenticationSearch,result).then(res=>{
          this.total = res.data && res.data.total
          this.tableData = res.data && res.data.records || []
          if(this.tableData.length>0){
            this.tableData.forEach(item=>{
              if(item.payWay == 0){
                item.accountingPeriod = '/'
                item.quota = '/'
              }
            })
          }
          console.log(this.tableData)
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
  },
  created(){
       if(this.$route.query.companyName){
         if(this.$route.query.ifPage){
           this.selectResult.companyName = this.$route.query.companyName
         }else {
           this.selectResult.companyName = this.hToC(this.$route.query.companyName)
         }
      }
  },
  mounted(){
      this.searchClick()
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