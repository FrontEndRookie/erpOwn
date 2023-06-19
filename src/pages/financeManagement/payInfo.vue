<template>
  <div>
    <el-form :inline="true" class="form">
      <el-form-item label="分公司">
        <el-select v-model="selectResult.orgMes">
          <el-option 
            v-for="(item,index) in fgsList"
            :key="item.id"
            :label="item.name"
            :value="`${item.id}-${item.name}`"
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公司开户名">
        <el-input
          v-model="selectResult.name"
          clearable
          placeholder="请输入开户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="开户行">
        <el-input
          v-model="selectResult.bank"
          clearable
          placeholder="请输入开户行"
        ></el-input>
      </el-form-item>
      <el-form-item label="账号">
        <el-input v-model="selectResult.chineseAccount" clearable placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchClick">查询</el-button>
        <el-button type="primary" @click="openDial(1)" v-auth="['110001_B']">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" max-height="500px">
      <el-table-column
        v-for="(item, index) in columnLabel"
        :key="item.label"
        :label="item.label"
      >
        <template slot-scope="{ row }">
          <div
            v-if="item.label == '操作'"
            style="display: flex;flex-wrap: wrap;"
          >
            <el-button type="primary" size="mini" @click="openDial(2,row)" v-auth="['110002_B']" >编辑</el-button>
            <el-button type="primary" size="mini" @click="delSysSpecial(row)" v-auth="['110003_B']" 
              >删除</el-button
            >
          </div>
          <div v-else>
            {{ row[item.value] }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[10, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="float:right;margin-top:30px"
    >
    </el-pagination>
    <payInfoDial ref="payInfoDial" :dialType="dialType" :fgsList="fgsList" v-if="showDial"></payInfoDial>
  </div>
</template>
<script>
import payInfoDial from './components/payInfoDial.vue'
export default {
  components:{payInfoDial},
  created() {
    this.init();
  },
  mounted() {},
  data() {
    return {
      selectResult: {
        orgMes: "",
        chineseAccount:'',
        orgName:'',
        name:'',
        bank:''
      },
      columnLabel: [
        { value: "orgName", label: "分公司" },
        { value: "address", label: "地址" },
        { value: "name", label: "公司开户名" },
        { value: "englishName", label: "公司英文名" },
        { value: "bank", label: "开户行" },
        { value: "chineseAccount", label: "人民币账号" },
        { value: "americaAccount", label: "美金账号" },
        { value: "payeeBank", label: "PAYEE’S BANK" },
        { value: "swiftAddress", label: "SWIFT ADDRESS" },
        { value: "payeeName", label: "PAYEE’S NAME" },
        { value: "payeeAc", label: "PAYEE’S A/C" },
        { value: "updateTime", label: "更新时间" },
        { value: "", label: "操作" }
      ],
      totalTableData:[],
      pageNum: 1,
      pageSize: 10,
      total: 0,

      dialType:1,
      showDial:false,

      fgsList:[],
    };
  },
  methods: {
    init(){
      this.getFgsList()
      this.searchClick()
    },
    getFgsList(){
      this.$http.get(this.$service.OrgsWithPaymentInfo).then(res=>{
        if(res.code == 200) {
          this.fgsList = res.data
        }
      })
    },
    searchClick(){
      let request = {...this.selectResult}
      if(request.orgMes){
        let res = request.orgMes.split('-')
        request.orgId = res[0]
        request.orgName = res[1]
      }
      this.$http.post(this.$service.paymentList ,request).then(res=>{
        if(res.code == 200) {
          this.totalTableData = res.data.records
          this.total = res.data.total
        }
        else {
          return this.$message.error(res.message)
        }
      })
    },
    async delSysSpecial(row) {
      const { id } = row;
      try {
        await this.$confirm("确定要进行删除操作吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        this.$http.post(this.$service.deletePayment ,[id]).then(res=>{
          if(res.code == 200) {
            this.$message.success('删除成功')
            this.getFgsList()
            this.searchClick()
          }
        })
      } catch (error) {}
    },
    handleSizeChange(e) {
      this.pageSize = e;
    },
    handleCurrentChange(e) {
      this.pageNum = e;
    },
    async openDial(type,value){
        this.dialType = type
        this.showDial = true
        await this.$nextTick();
        if(!value) return
        this.$refs.payInfoDial.formResult.id = value.id
        Object.keys(this.$refs.payInfoDial.formResult).forEach((item)=>{
          if(item == 'orgMes'){
            this.$refs.payInfoDial.formResult.orgMes = value.orgId+'-'+value.orgName
          }
          else {
            this.$refs.payInfoDial.formResult[item] = value[item]
          }
        })
    }
  },

  computed: {
    tableData(){
      return this.totalTableData.slice((this.pageNum-1)*this.pageSize,this.pageSize)
    }
  }
};
</script>
<style scoped lang="less">
.form {
  padding: 30px;
  background-color: #fff;
}
</style>
