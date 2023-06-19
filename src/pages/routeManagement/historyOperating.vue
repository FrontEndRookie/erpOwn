<template>
  <div style="width:100%;height:100%;overflow:scroll;">
    <!-- <embed src="/image/excel/admin20220325102031227LX_XX.xls" style="width:100px;height:100px;" alt=""> -->
    <el-table
        :data="tableData"
        border
        style="width: 100%">
            <el-table-column 
            v-for="(item, index) in columns"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :key="index">
               <!-- <span v-if="index == 4">{{item.prop == '1'?'导入失败':'导入成功'}} </span> -->
            </el-table-column>
            <el-table-column label="操作" width="80px">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">下载</el-button>
                </template>
        </el-table-column>
    </el-table>
    <div class="block" style="margin:40px 100px;margin-left:300px;">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNumber"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
          total:10,
          pageNumber: 1,
          pageSize: 10,
          pages: 1,
          lists: [],
          columns:[
            {
                label: '上传时间',
                prop: 'createTime',
                show: true,
                sort:false,
                width: '200'
            },
            {
                label: '运价表格',
                prop: 'fileName',
                // prop: 'filePath',
                show: true,
                sort:true,
                width: ''
            },
            {
                label: '航线负责人',
                prop: 'principalName',
                show: true,
                sort: true,
                width: '140'
            },
            {
                label: '代理公司',
                prop: 'agentNames',
                show: true,
                sort: true,
                width: '300'
            },
            // {
            //     label: '操作',
            //     prop: 'continent',
            //     show: true,
            //     sort: true,
            //     width: '100'
            // },
            {
                label: '导入结果',
                prop: 'successFlag',
                show: true,
                sort: true,
                width: '100'
            },
          ],
        tableData: [
            {
            createTime: '',
            fileName: '',
            principalName: '',
            agentNames:'',
            successFlag: '',
            }
            ]
      }
    },
    mounted() {
    //   this.UserID = !sessionStorage.getItem('userInfo') ? '' : JSON.parse(sessionStorage.getItem('userInfo')).UserID
    //   this.userName = !sessionStorage.getItem('userInfo') ? '' : JSON.parse(sessionStorage.getItem('userInfo')).UserName
    //   this.router = (this.$route.path).slice((this.$route.path).lastIndexOf('/')+1)
    //   // console.log(this.router);
    //   var nameA = JSON.parse(sessionStorage.getItem('userInfo')).loginName
    //   if((nameA == 'admin')||(nameA == '13918289152')){
    //     this.roleNameA = false
    //   }else{
    //     this.roleNameA = true
    //   }
    this.gethistory()
    },
    methods: {
        handleSizeChange(e){
            this.pageSize = e
            this.gethistory()
        },
        handleCurrentChange(e){
            this.pageNumber = e
            this.gethistory()
        },
        // 下载
        handleEdit(index){
            console.log(index);
            var res = this.$service+this.tableData[index].filePath
            console.log(res);
            this.$utils.downloadFile({ url: this.tableData[index].filePath, name: this.tableData[index].fileName })
            return
            const aLink = document.createElement("a");
            let blob = new Blob([res], {
              type: "application/vnd.ms-excel"
            })
            aLink.href = URL.createObjectURL(blob)
            aLink.setAttribute(this.tableData[index].filePath) // 设置下载文件名称
            aLink.click()
            document.body.appendChild(aLink)
        },
        // 获取列表详情
      gethistory(){
          var pageNumber = this.pageNumber
          var pageSize = this.pageSize
          var dataObj = {
               'pageNum': pageNumber,
               'pageSize':pageSize,
          }
          this.$http.post(this.$service.historyPage,dataObj).then((data) => {
          if (data.code == 200){
            //   this.currentPage4 = data.data.pages
            //   console.log(data.data);
            this.total = data.data.total
              this.pages = data.data.pages
              this.lists = data.data.records
              var array = JSON.parse(JSON.stringify(data.data.records))
              for (let index = 0; index < array.length; index++) {
                if(array[index].successFlag == '1'){
                  array[index].successFlag = "导入失败"
                }else if(array[index].successFlag == '0'){
                  array[index].successFlag = "导入成功"
                }else{
                  array[index].successFlag = ""
                }
              }
              this.tableData = array
              console.log(this.tableData);
          }else{
            this.$message.error(data.message)
           }
        })
      }
    }
}
</script>
<style lang="less" scoped>
  a {
    padding: 0;
  }

  span {
    padding-right: 10px;
  }

  span.cursor {
    cursor: pointer;
    color: #3985ca;
  }

  .gary {
    color: #bcbcbc !important; 
  }

  .tupian {
    width: 30px;
    height: auto;
  }
</style>