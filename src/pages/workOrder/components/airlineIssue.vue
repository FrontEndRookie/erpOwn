<template>
<div>
    <div class="content">
        <div style="text-align:right;margin-bottom:10px;margin-right:50px;fontSize:14px;color:#02A7F0;cursor:pointer" @click="filterData">
            <img style="width:15px;height:15px" src="../../../assets/workOrderFilter.svg" alt="">
          筛选</div>
        <el-table
            :data="issueTableData"
              border
              header
              center
              style="width: 100%">
              <template slot="empty">
                <img class="data-pic" src="@/assets/kong-icon.png"/>
                <p>暂无数据</p>
              </template>
              <el-table-column prop="createTimeStr" label="发布时间" min-width="100"></el-table-column>
              <el-table-column prop="effectiveTimeStr" label="有效时间至" min-width="100"></el-table-column>
              <el-table-column prop="creatorName" label="发布者" min-width="80"></el-table-column>
              <el-table-column prop="effectiveFlag" label="是否有效" min-width="80">
                <template slot-scope="scope">
                  <span>{{scope.row.effectiveFlag=='0'?"有效":scope.row.effectiveFlag=='1'?"无效":''}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="content" label="发布内容" min-width="140"></el-table-column>
              <el-table-column label="操作" min-width="30">
                  <template slot-scope="scope">
                      <div @click="deleteAirLine(scope.row.id)" style="color:#02A7F0;cursor:pointer">
                          删除
                      </div>
                  </template>
              </el-table-column>
              
            
            </el-table>
        <div class="tablePagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
    :visible.sync="fiterDataDial"
    width="500px"
    title="筛选"
    >
    <el-form label-position="left">
    <el-form-item label="提交时间"  label-width="80px" style="width:420px">
             <el-date-picker
             style="width:150px"
              v-model="filterResult.startCommitDate"
              type="date"
              :picker-options="pickerOptionsStartOne"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker >-
             <el-date-picker
             style="width:150px"
              v-model="filterResult.endCommitDate"
              type="date"
              :picker-options="pickerOptionsEndOne"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        <el-form-item label="发布内容" label-width="80px" style="width:420px">
              <el-input style="width: 310px;" v-model="filterResult.content"></el-input>
          </el-form-item>
           <el-form-item label="提交者" label-width="80px"  style="width:420px">
             <el-select
              v-model="filterResult.creatorId"
              id="airlineName"
              ref="limitInput2"
              placeholder="请选择提交者"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 210px"
            >
              <el-option
                v-for="item in airManger"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select> </el-form-item>
          <el-form-item label="是否有效" label-width="80px" style="width:420px">
            <el-select v-model="filterResult.effectiveFlag"  >
              <el-option
                v-for="(item,index) in ifEffect"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          </el-form>
          <div class="filterFooter">
              <el-button type="info" @click="fiterDataDial=false">取消</el-button>
              <el-button type="primary" @click="normalFilter">确定</el-button>
          </div>
    </el-dialog>
</div>

</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
        airManger:[],
        issueTableData:[],
        total:0,
        pageNum:1,
        pageSize:10,
        fiterDataDial:false,
        filterResult:{
          startCommitTime:'',
          endCommitTime:'',
          content:'',
          creatorId:'',
          effectiveFlag:'',
          dateFlag:''
        },
        ifEffect:[{label:"全部",value:''},{label:'有效',value:0},{label:'已失效',value:1}],
          // 限制结束日期大于开始日期
            pickerOptionsStartOne: {
                disabledDate: time => {
                    let endDateVal = this.filterResult.endCommitDate
                    if (endDateVal) {
                    return time.getTime() > new Date(endDateVal).getTime()
                    }
                }
                },
            pickerOptionsEndOne: {
             disabledDate: time => {
                let beginDateVal = this.filterResult.startCommitDate
                if (beginDateVal) {
                return time.getTime() < new Date(beginDateVal).getTime()- 8.64e7
                }
             }
            },
    }
  },
  watch:{},
  computed:{},
  methods:{
    //普通筛选
    normalFilter(){
      this.fiterDataDial = false
      this.initData()
    },
    //数据初始化
    initData(){
      let result = JSON.parse(JSON.stringify(this.filterResult))
      result.pageNum = this.pageNum
      result.pageSize = this.pageSize
      this.$http.post(this.$service.searchByPage4Prcp,result).then(res=>{
        if(res.code==200){
          this.issueTableData = res.data.records
          this.total = res.data.total
        }
        else {
          this.$message.error(res.message)
        }
      })
    },
      //筛选弹框
      filterData(){
          this.filterResult = {
              startCommitTime:'',
              endCommitTime:'',
              content:'',
              creatorId:'',
              effectiveFlag:'',
            }
          this.fiterDataDial = true
      },
      //删除
      deleteAirLine(id){
          this.$confirm('客服将无法查看该航线,是否删除', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center:true
        })
          .then(() => {
            this.$http.post(this.$service.airlineDeleteIssue+'?workOrderAirlineId='+id).then(res=>{
              if(res.code==200){
                this.$message.success("删除成功")
                this.initData()
              }else{
                this.$message.error(res.message)
              }
            })
          })
          .catch(action => {});
      },
       handleCurrentChange(e){
        this.pageNum = e
        this.initData()
      },
      handleSizeChange(e){
        this.pageSize=e
        this.pageNum =1
        this.initData()
      },
  },
  created(){},
  mounted(){
     this.$http.post(this.$service.searchCstUserByPage,{pageNum:1,pageSize:5000}).then(data=>{
          this.airManger = data.data.records
        })
    this.initData()
  }
}
</script>

<style scoped lang='less'>
.content {
  background: #fff;
  margin: 20px 20px 0 20px;
}
.tablePagination{
    text-align: right;
}
.filterFooter{
    text-align: right;
}
/deep/.el-dialog__body{
    padding:15px 30px;
}
</style>