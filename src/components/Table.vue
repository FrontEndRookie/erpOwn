  <template>
  <div>
    <el-table
      :stripe="router=='routeManage'?false:true"
      ref="multipleTable"
      @sort-change="handleSort"
      @selection-change="handleSelect"
      :data="tableData"
      :row-style="rowClass"
      style="width: 100%;"
      :class="router=='routeManage'?'changTable':''"
      class="table-rowss"
    >
      <template slot="empty">
        <img class="data-pic" src="../assets/kong-icon.png"/>
        <p>{{messageTime?messageTime:'暂无数据'}}</p>
      </template>
      >
      <!-- 选择列 -->
      <el-table-column
       v-if="this.$route.query.time && (this.$route.fullPath).slice(-11) != 'routeManage'"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column 
      fixed="left"
       v-else-if="(this.$route.fullPath).slice(-11)=='routeManage'"
        type="selection"
        width="55">
      </el-table-column>
      <!--列-->
        <!-- :sortable="((this.$route.fullPath).slice(-11)=='routeManage')&&(index>0)?true:false" -->
      <el-table-column
        v-for="(column, index) in columns"
        v-if="column.show"
        :key="index"
        :sortable="column.sort"
        :prop="column.prop"
        :label="column.label"
        :label-class-name="(column.prop == 'importUnchangeTime') && (router=='routeManage')?'xing':''"
        :min-width="column.width"
        :show-overflow-tooltip="(column.label == '代理公司' || column.label == '航线负责人') && (router=='routeManage')?true:false"
        align="left"
      >
          <span style="width:100%" v-if="(column.label == '代理公司' || column.label == '航线负责人') && (router=='routeManage')?true:false">
            <!-- {{scope.row.agentName}} -->
            {{column.prop}}
          </span>
        <!-- :sort-method="column.show?sortChang(column.prop):''" -->
        <template slot-scope="scope">
          <span v-if="column.prop == 'airLinePersonName' && router=='routeManage' && scope.row.source===1" style="color:red;">*</span>
          <span @click="handleItemClick(column.handle, scope)">
            
            <span v-if="column.prop == 'status' && column.label == '状态'">
              <el-switch @change="switchChangeUser(scope)" v-model="scope.row.status == '0'"></el-switch>
            </span>
            <span v-else-if="column.prop == 'expenseType' && column.label == '费用类型'">
              {{
                          scope.row.expenseType === 0
                            ? "国内段"
                            : "国外段"
                        }}
            </span>
             <span v-else-if="column.prop == 'monthNo' && column.label == '有效期'">
              {{
                 scope.row.monthNo

               }}月
            </span>
            <span v-else v-html="getDataName(scope.row, column)"></span>

          </span>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column 
        fixed="right"
        v-if="operation.show && router!='routeManage'"
        :label="operation.label"
        :min-width="operation.width"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <a v-for="(item, index) in operation.options" @click.prevent="handleClick(item.method, scope.row, $event)" :key="index+'bj'" :style="{ visibility: $utils.authCheckHidden(item.auth) }">
<!--            <span style="color: #2273CE;">{{ item.label }}</span>-->
            <span :class="roleNameA && router=='agentList'?'gary':''"  :style="{'color':(checkEdit(scope.row)||item.method!=='editExpense'?'#2273CE':'#808080')}">{{ item.label }}</span>
          </a>
        </template>
      </el-table-column>
      <el-table-column 
        fixed="right"
        v-if="operation.show && router=='routeManage'"
        :label="operation.label"
        :min-width="operation.width"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <a v-for="(item, index) in operation.options" @click.prevent="handleClick(item.method, scope.row, $event)" :key="index+'bj'" :style="{ visibility: $utils.authCheckHidden(item.auth) }">
<!--            <span style="color: #2273CE;">{{ item.label }}</span>-->
            <span :class="item.label=='编辑'&&scope.row.source===1?'gary':''"  :style="{'color':(checkEdit(scope.row)||item.method!=='editExpense'?'#2273CE':'#808080')}">{{ item.label }}</span>
          </a>
        </template>
      </el-table-column>
    </el-table>
    <!-- 整体操作 -->
    <div v-if="router=='routeManage'" style="display:flex;">
        <div v-show="showEle" style="widht:100%;margin:5px 10px 0 0">
          <el-button size="mini" type="primary" @click="showFees(false)" style="height:28px;margin-top:19px">删除</el-button>
          <!-- <el-button size="mini" type="primary" @click="showFees(false)" style="height:28px;margin-top:19px">导出</el-button> -->
          <el-button size="mini" type="primary" @click="showFees(true)" style="height:28px;margin-top:19px">取消操作</el-button>
        </div>
    </div>
    <!-- 分页 -->
    <div v-show="columns[0].label == '航线ID'?true:total > 10">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handleCurrent"
        @size-change="handleSize"
        style="text-align: right;padding: 19px 30px 18px 0;background: #fff">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      messageTime:{
        type:String,
        default: () => '暂无数据'
      },
      // 表格数据源
      tableData: {
        type: Array,
        default: () => []
      },
      //选择
      xuanzhong: {
        type: Array,
        default: () => []
      },
      // 表格的字段展示
      columns: {
        type: Array,
        default: () => []
      },
      // 表格操作
      operation: {
        type: Object,
        default: () => {
        }
      },
      // 总条数
      total: {
        type: Number,
        default: () => 0
      },
      biaoshishu: {
        type: Number,
        default: () => 0
      },
      // 当前页
      currentPage: {
        type: Number,
        default: () => 0
      },
      // 每页条数
      pageSize: {
        type: Number,
        default: () => 0
      },
    },
    data() {
      return {
        selectRow: [],
        multipleSelection:[],
        showEle:false,
        seletArr: [],
        userName: '',
        arr: [],
        UserID: '',
        roleNameA:false,
        router:'',
        selectVal:[],
      }
    },
    mounted() {
      this.UserID = !sessionStorage.getItem('userInfo') ? '' : JSON.parse(sessionStorage.getItem('userInfo')).UserID
      this.userName = !sessionStorage.getItem('userInfo') ? '' : JSON.parse(sessionStorage.getItem('userInfo')).UserName
      this.router = (this.$route.path).slice((this.$route.path).lastIndexOf('/')+1)
      // if(this.router == 'routeManage'){
      //   this.xingTag()
      // }
      // console.log(this.router);
      var nameA = JSON.parse(sessionStorage.getItem('userInfo')).loginName
      if((nameA == 'admin')||(nameA == '13918289152')){
        this.roleNameA = false
      }else{
        this.roleNameA = true
      }
    },
    watch: {
      // messageTime: {
      //   handler(newVal) {
      //     this.messageChange(newVal)
      //   },
      //   deep: true,
      // 　immediate: false,
      //   },
      multipleSelection(data) {  //存储选中的row
        this.selectRow = [];
        if (data.length > 0) {
          data.forEach((item, index) => {
            this.selectRow.push(item.id);
          });
        }
      },
      tableData(idx) {
        var that = this
        this.arr = []
        that.$nextTick(() => {
          if (that.$refs.multipleTable) {
            that.$refs.multipleTable.clearSelection();
          }
          if (!idx) {
            return
          }
          idx.forEach(row => {
            for (var i = 0; i < this.xuanzhong.length; i++) {
              if (this.xuanzhong[i].code == row.code) {
                that.$refs.multipleTable.toggleRowSelection(
                  row,
                  true
                )
              }
            }
          })
        })
      }
    },
    methods: {
/*      checkEdit(row) {
        var today = new Date();
        var date = new Date(row.createTime)
        var oneDay=1000*60*60*24;
        var currentMonth=row.monthNo;
        var start=new Date(new Date(row.yearNo,currentMonth-1,1)-7*oneDay);
        var end=new Date(new Date(row.yearNo,currentMonth,1)-oneDay);
        date.setDate(date.getDate()+1)
        if (today > date) {
          return false;
        }else if(!(today>=start&&today<=end)){
          return false;
        } else {
          return true;
        }
      },*/
      // messageChange(){
      //   let cass =(document.getElementsByClassName('el-table__empty-text'))
      //   var cassC = [].slice.call(cass)
      //   // var cassC = Array.prototype.slice.call(cass)
      //   // cass.forEach(item=>{
      //   //   console.log(item);
      //   // })
      //   console.log(cass,cassC);

      // },
      // 排序
      handleSort(column) {
        this.$emit('sortChange', column)
        if(column.prop == "updateTime" && this.router=='routeManage'){
          this.$emit('sortChangeA', column.order)
          // console.log(column.order);
        }
      },
      // xingTag(){
      //  var xingstyle = document.getElementsByClassName("xing")
      //  var span=document.createElement("p"); 
      //  span.id="spanid";  
      //   span.style.color="red"; 
      //   span.innerHTML="*"
      // },
      checkEdit(row) {
        var today = new Date();
        var date = new Date(row.createTime)
        var oneDay=1000*60*60*24;
        var currentMonth=row.monthNo;
        var start=new Date(new Date(row.yearNo,currentMonth-1,1)-7*oneDay);
        var end=new Date(new Date(row.yearNo,currentMonth,1)-oneDay);
        date.setDate(date.getDate()+1)
        if (today > date) {
          return false;
        }else if(!(today>=start&&today<=end)){
          return false;
        } else {
          return true;
        }
      },
      // 操作，将操作类型和当前row数据作为参数传递
      handleClick(method, row, e) {
        // 置灰不可点击
        if (e.target.className === 'gary') {
          return
        }
        if(this.router == 'agentList'){ 
          this.$http.get(this.$service.isAlineAgent + '?id=' + row.id).then(data => {
            if(data.code == 200){
              // console.log(data);
              var typeStr = '确定删除这条数据?'
              if(data.data != "0"){
                typeStr="该代理绑定了"+data.data+"条航线,是否确定删除？"
              }
               this.$emit('handleClick', {
                  method: method,
                  row: row,
                  type: typeStr,
                })
                console.log('执行2:'+typeStr);
            }else{
              this.$message.error(data.message)
            }
          })
        }else{
          // console.log(method, row);
          this.$emit('handleClick', {
            method: method,
            row: row,
          })
        }
      },
      showFees(sty){
        if(!sty){
          this.$emit('handleClick', {
            method: 'routeDel',
            row: this.selectVal
          })
        }else{
          this.$refs.multipleTable.clearSelection()
        }
      },
      // 某一列点击事件
      handleItemClick(method, scope) {
        if (method) {
          this.$emit(method, scope)
        }
      },
      // 页码跳转
      handleCurrent(val) {
        // this.rowSelect()
        this.$emit('currentChange', val)
      },
      // 展示条数
      handleSize(val) {
        this.$emit('sizeChange', val)
      },
      rowClass({ row, rowIndex }) {    //对所选行进行样式设置，最终效果就看这里了
        if (this.selectRow.includes(row.id)) {
          return { "background-color": "rgba(185, 221, 249, 0.75) !important"};
        }
      },
      // handleclick(row) {                           //实现点击多选
      //   this.$refs.equtable.toggleRowSelection(row);
      // },
      // 复选框选择
      handleSelect(val) {
        // console.log(val);
        if(val.length>0){
          this.showEle = true
          this.selectVal = val
        }else{
          this.showEle = false
        }
        this.multipleSelection = val
        this.$emit('selectChange', val)
      },
      //开关
      switchChangeUser(val) {
        this.$emit('switchChangeUser', val)
      },
      //去重
      unique1(arr) {
        var hash = [];
        for (var i = 0; i < arr.length; i++) {
          if (hash.indexOf(arr[i]) == -1) {
            hash.push(arr[i]);
          }
        }
        return hash;
      },
      getDataName(scope, items) {
        return scope[items.prop]
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
  .changTable{
    /deep/ .cell {
      text-overflow: ellipsis  !important;
    }
  }
  /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
   background: #00bbee;
   color: #ffffff;
 }
 /deep/ .el-table__body tr.current-row > td {
   background-color: #00bbee !important;
 }
  // /deep/.has-gutter .tr:nth-child(10):first-letter{
  //   color: red;
  // }
  /deep/.is-left .xing:before{
    content:'*';
    color: red;
    font-size: 20px;
    display:inline-block;
    height: 30px;
    line-height: 30px;
    padding-right: 10px;
  }
  /deep/.table-rowss .el-table__row  td{
    border-right: 1px #ebeef5 solid !important;
    border-bottom: 1px #ebeef5 solid !important;
  }
  /deep/.table-rowss .el-table__row  td:nth-child(0){
    border-left: 1px #ebeef5 solid !important;
  }
  /deep/.table-rowss .el-table__row:nth-child(2n+1){
    background-color: #f4f4f4 !important;
  }
  /deep/ .el-table__body tr:hover>td {
  background-color: #CCC !important;
}
</style>
