<template>
  <div style="width: 100%; height: 100%">
    <el-tabs v-if="router=='goodAirRoute'?true:false"  v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="精品航线展示记录" name="first">
        <el-table :data="tableData" :stripe="true" border style="width: 100%">
          <el-table-column
            v-for="(item, index) in columns1"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :key="index"
          >
              <template slot-scope="scope">
                <div v-if="item.label == '操作'" style="display:flex;flex-direction: row;justify-content: space-around;">
                   <el-switch v-if="scope.row.statusZ == 'undefined'?false:true"
                    :disabled="$utils.authCheckDisabled(['253003_B'])"
                    v-model="scope.row.statusZ"
                    @change="handleEdit(scope.$index, scope.row, '上下架')">
                    </el-switch>
                    <div v-else style="width:40px;height:20px;"></div>
                    <a style="width:40px;height:20px;line-height:20px;text-align: center;cursor: pointer;font-size:14px;"
                      @click="handleEdit(scope.$index, scope.row, '编辑精品航线')">
                      编辑
                    </a>
                </div>
                <div v-else-if="item.label == '展示起始日期'"> {{scope.row.startDate}}</div>
                <div v-else-if="item.label == '展示结束日期'"> {{scope.row.endDate}}</div>
                <div v-else-if="item.label == '位置'"> {{scope.row.position}}</div>
                <div v-else-if="item.label == '客户名称'"> {{scope.row.applicantName}}</div>
                <div v-else-if="item.label == '状态'"> {{scope.row.statusName}}</div>
              </template>
          </el-table-column>
          <el-table-column label="查看" width="200px">
            <template slot-scope="scope">
              <a style="display: inline-block;width: 90px;"
                size="mini"
                @click="handleEdit(scope.$index, scope.row, '查看申请')"
                
                >查看申请</a
              >
              <a style="display: inline-block;width: 90px;"
                size="mini"
                @click="handleEdit(scope.$index, scope.row, '历史')"
                >历史</a
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="待审核" :stripe="true" name="second">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column
            v-for="(item, index) in columns2"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :key="index"
          >
          <template slot-scope="scope">
                <div v-if="item.label == '操作'">
                   <a style="display: inline-block;width: 60px;"
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row, '审核通过')"
                    v-auth="['253001_B']"
                    >审核通过</a>
                  <a style="display: inline-block;width: 60px;"
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row, '驳回')"
                    v-auth="['253002_B']"
                    >驳回</a>
                </div>
                <div v-if="item.label == '申请时间'"> {{scope.row.createTime}}</div>
                <div v-else-if="item.label == '展示起始日期'"> {{scope.row.startDate}}</div>
                <div v-else-if="item.label == '展示结束日期'"> {{scope.row.endDate}}</div>
                <div v-else-if="item.label == '位置'"> {{scope.row.position}}</div>
                <div v-else-if="item.label == '客户名称'"> {{scope.row.applicantName}}</div>
                
              </template>
            <span v-if="index == 0">{{ index }} </span>
          </el-table-column>
          <el-table-column label="查看" width="200px">
            <template slot-scope="scope">
              <a style="display: inline-block;width: 90px;"
                size="mini"
                @click="handleEdit(scope.$index, scope.row, '查看申请')"
                
                >查看申请</a
              >
              <a style="display: inline-block;width: 90px;"
                size="mini"
                @click="handleEdit(scope.$index, scope.row, '历史')"
                >历史</a
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="不通过" name="third">
        <el-table :data="tableData" :stripe="true" border style="width: 100%">
          <el-table-column
            v-for="(item, index) in columns3"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :key="index"
          >
            <template slot-scope="scope">
                <div v-if="item.label == '申请时间'"> {{scope.row.createTime}}</div>
                <div v-else-if="item.label == '展示起始日期'"> {{scope.row.startDate}}</div>
                <div v-else-if="item.label == '展示结束日期'"> {{scope.row.endDate}}</div>
                <div v-else-if="item.label == '位置'"> {{scope.row.position}}</div>
                <div v-else-if="item.label == '客户名称'"> {{scope.row.applicantName}}</div>
              </template>
          </el-table-column>
           <el-table-column label="查看" width="200px">
            <template slot-scope="scope">
              <a style="display: inline-block;width: 90px;"
                size="mini"
                @click="handleEdit(scope.$index, scope.row, '查看申请')"
                
                >查看申请</a
              >
              <a style="display: inline-block;width: 90px;"
                size="mini"
                @click="handleEdit(scope.$index, scope.row, '历史')"
                >历史</a
              >
            </template>
          </el-table-column>
           <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <a v-if="(new Date().getTime() < new Date(scope.row.endDate).getTime() + 86400000)" style="display: inline-block;width: 90px;"
                size="mini"
                @click="handleEdit(scope.$index, scope.row, '编辑精品航线2')"
                
                >编辑</a
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
 
        <el-table v-else rules='rows' :data="tableData" :stripe="true" :border='true' style="width: 100%">
          
          <!-- 特价列表 -->
          <el-table-column
            v-for="(item, index) in columns4"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :key="index"
          >
              <template slot-scope="scope">
                <div v-if="item.label == '操作'&&scope.row.statusName!='已失效'">
                   <el-switch
                    :disabled="$utils.authCheckDisabled(['254001_B'])"
                    v-model="scope.row.primaryAgent"
                    @change="changeStatus(scope.$index, scope.row)">
                    </el-switch> 
                </div>
                <div v-else-if="item.label == '时间'"> {{scope.row.createTime}}</div>
                <div v-else-if="item.label == '有效期'"> {{scope.row.endDate}}</div>
                <div v-else-if="item.label == '发布标题'"> <span  @click="showInfo(scope.row)" class="blockInfo" style="display:block;cursor: pointer;width:auto;height:100%;">{{scope.row.discountHeader}}</span> </div>
                <div v-else-if="item.label == '发布内容'"> {{scope.row.discountInfo}}</div>
                <div v-else-if="item.label == '发布者'"> {{scope.row.applicantName}}</div>
                <div v-else-if="item.label == '状态'"> {{scope.row.statusName}}</div>
              </template>
          </el-table-column>
          <!-- <el-table-column label="操作" fixed="right" width="200px"> -->
          <el-table-column label="查看" width="200px">
            <template slot-scope="scope">
              <el-button type="text" :disabled="scope.row.selfInfo !== 1 && !isAdmin" @click="$emit('openSpecialReleaseDialog', scope.row)" v-if="showActions">编辑</el-button>
              <el-button type="text" :disabled="scope.row.selfInfo !== 1 && !isAdmin" @click="delSysSpecial(scope.row)" v-if="showActions">删除</el-button>
              <el-button type="text" @click="handleEdit(scope.$index, scope.row, '历史')">历史</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 特价弹出框 -->
          <el-dialog title="特价发布"  :visible.sync="showInfoType" @closed="colsedThing" @open="opendThing">
             <el-form>
              <el-form-item style="padding:10px 0;" label="特价标题" label-width="100">
                <el-input style="width:70%"  v-model="Info.tip" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item style="padding:10px 0;" label="特价内容" label-width="100">
                <div style="margin-left:68px" id="box-body-content"></div>
              </el-form-item>
            </el-form>
          </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    showActions: {
      type: Boolean,
      default: false,
    },
    // 表格数据源
    tableData: {
      type: Array,
      default: () => [],
    },
    zSizeNum:{
      type: Number,
      default: () => 0,
    }
    // //选择
    // xuanzhong: {
    //   type: Array,
    //   default: () => [],
    // },
    // // 表格的字段展示
    // columns: {
    //   type: Array,
    //   default: () => [],
    // },
    // // 表格操作
    // operation: {
    //   type: Object,
    //   default: () => {},
    // },
    // // 总条数
    // total: {
    //   type: Number,
    //   default: () => 0,
    // },
    // biaoshishu: {
    //   type: Number,
    //   default: () => 0,
    // },
    // // 当前页
    // currentPage: {
    //   type: Number,
    //   default: () => 0,
    // },
    // // 每页条数
    // pageSize: {
    //   type: Number,
    //   default: () => 0,
    // },
  },
  data() {
    return {
      router:'',
      value:false,
      activeName: "first",
      // total: 10,
      // pageNumber: 1,
      // pageSize: 10,
      // pages: 1,
      lists: [],
      tableData2: [
        {
          createTime: "",
          fileName: "",
          principalName: "",
          agentNames: "",
          successFlag: "",
        },
      ],
      tableData3: [
        {
          createTime: "",
          fileName: "",
          principalName: "",
          agentNames: "",
          successFlag: "",
        },
      ],
      showInfoType:false,
      columns1: [
        {
          label: "展示起始日期",
          prop: "startDate",
          show: true,
          sort: true,
          // width: "220",
        },
        {
          label: "展示结束日期",
          prop: "endDate",
          show: true,
          sort: true,
          // width: "220",
        },
        {
          label: "位置",
          prop: "position",
          show: true,
          sort: true,
          width: "150",
        },
        {
          label: "客户名称",
          prop: "applicantName",
          show: true,
          sort: true,
          // width: "200",
        },
        {
          label: "状态",
          prop: "statusName",
          show: true,
          sort: true,
          width: "100",
        },
        {
          label: "操作",
          prop: "statusZ",
          show: true,
          sort: true,
          width: "150",
        },
        
      ],
      columns2: [
        {
          label: "申请时间",
          prop: "createTime",
          show: true,
          sort: true,
          // width: "220",
        },
        {
          label: "展示起始日期",
          prop: "startDate",
          show: true,
          sort: true,
          // width: "220",
        },
        {
          label: "展示结束日期",
          prop: "endDate",
          show: true,
          sort: true,
          // width: "220",
        },
        {
          label: "位置",
          prop: "position",
          show: true,
          sort: true,
          width: "150",
        },
        {
          label: "客户名称",
          prop: "applicantName",
          show: true,
          sort: true,
          // width: "200",
        },
        {
          label: "操作",
          prop: "statusZ",
          show: true,
          sort: true,
          width: "150",
        },
      ],
      columns3: [
        {
          label: "申请时间",
          prop: "createTime",
          show: true,
          sort: true,
          // width: "220",
        },
        {
          label: "展示起始日期",
          prop: "startDate",
          show: true,
          sort: true,
          // width: "220",
        },
        {
          label: "展示结束日期",
          prop: "endDate",
          show: true,
          sort: true,
          // width: "220",
        },
        {
          label: "位置",
          prop: "position",
          show: true,
          sort: true,
          width: "150",
        },
        {
          label: "客户名称",
          prop: "applicantName",
          show: true,
          sort: true,
          // width: "200",
        },
      ],
      Info:{
        tip:'',
        tittle:'',
      },
      columns4: [
        {
          label: "时间",
          prop: "createTime",
          show: true,
          sort: true,
          // width: "220",
        },
        // {
        //   label: "有效期",
        //   prop: "endDate",
        //   show: true,
        //   sort: true,
        //   width: "220",
        // },
        {
          label: "发布者",
          prop: "applicantName",
          show: true,
          sort: true,
          // width: "200",
        },
        {
          label: "发布标题",
          prop: "discountHeader",
          show: true,
          sort: true,
          // width: "150",
        },
        // {
        //   label: "发布内容",
        //   prop: "discountInfo",
        //   show: true,
        //   sort: true,
        //   width: "150",
        // },
        {
          label: "状态",
          prop: "statusName",
          show: true,
          sort: true,
          width: "100",
        },
        {
          label: "操作",
          prop: "primaryAgent",
          show: true,
          sort: true,
          width: "150",
        },
      ],
    };
  },
  computed: {
    isAdmin() {
      return JSON.parse(sessionStorage.getItem("userInfo")).name === 'admin'
    },
  },
  watch:{
    // $route:{
    //   handler(val,oldval){
    //     console.log(val);//新路由信息
    //     console.log(oldval);//老路由信息
    //   },
    //   // 深度观察监听
    //   deep: true
    // }
  },
  mounted() {
    //   this.UserID = !sessionStorage.getItem('userInfo') ? '' : JSON.parse(sessionStorage.getItem('userInfo')).UserID
    //   this.userName = !sessionStorage.getItem('userInfo') ? '' : JSON.parse(sessionStorage.getItem('userInfo')).UserName
      this.router = (this.$route.path).slice((this.$route.path).lastIndexOf('/')+1)
      // console.log(this.router);
    //   var nameA = JSON.parse(sessionStorage.getItem('userInfo')).loginName
    //   if((nameA == 'admin')||(nameA == '13918289152')){
    //     this.roleNameA = false
    //   }else{
    //     this.roleNameA = true
    //   }
    // this.gethistory();
    // console.log(this.tableData);
  },
  watch: {
    // NumberType: {
    //   handler(newName, oldName) {
    //     this.changeColmen(newName);
    //   },
    //   immediate: true,
    //   deep: true,
    // },
  },
  methods: {
    async delSysSpecial(row) {
      const { id } = row
      try {
        await this.$confirm('确定要进行删除操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await this.$api.delSysSpecial({ id })
        this.$message.success('删除成功')
        this.$emit('refreshList')
      } catch (error) {}
    },
    //展示详情
    showInfo(data){
      this.Info.tip = data.discountHeader
      this.Info.tittle = data.discountInfo
      this.showInfoType = true
    },
    //给内容绑定HTML
    opendThing(){
      var tittle = this.htmlDecodeByRegExp(this.Info.tittle)
      setTimeout(() => {
							var set = document.getElementById('box-body-content')
							set.innerHTML = tittle
						}, 0);
    },
    colsedThing(){
      this.showInfoType = false
      this.Info.tip = ''
      this.Info.tittle = ''
    },
    //解析Html乱码
    /*4.用正则表达式实现html解码*/
				htmlDecodeByRegExp:function (str){  
						var s = "";
						if(str.length == 0) return "";
						s = str.replace(/&amp;/g,"&");
						s = s.replace(/&lt;/g,"<");
						s = s.replace(/&gt;/g,">");
						s = s.replace(/&nbsp;/g," ");
						s = s.replace(/&#39;/g,"\'");
						s = s.replace(/&quot;/g,"\"");
						return s;  
				},
    // 改变一代资格
    async changeStatus(index,row){
      // console.log(row);
       var obj={
            type: 5,
            index: index,
            status: row.primaryAgent,
          }
          this.$emit('showDialogVisible',obj)
    },
    // 
      cellClick(index,row,type){
        // console.log(index,row,type);
        if(type == '申请账号'){
          return this.$message.warning('该功能暂未开放')
          var obj={
            type: 2,
            index: index
          }
          this.$emit('showDialogVisible',obj)
        }else if(type == '等级'){
          var obj={
            type: 6,
            index: index
          }
          this.$emit('showDialogVisible',obj)
        }
          // console.log(a,b);
      },
    handleClick(tab) {
      if (tab.name == "first") {
        this.$emit('tabChange','')//全部0
      } else if (tab.name == "second") {
        this.$emit('tabChange',0)//待审核1
      } else if (tab.name == "third") {
        this.$emit('tabChange',5)//审核未通过2
      }
      //审核通过1
    },
    handleEdit(index,row,type){
      if(type == '查看申请'){
        var obj={
          type: 1,
          index: index
        }
        this.$emit('showDialogVisible',obj)
        this.$store.commit('changeUserManageType',1)//mutations
      }else  if(type == '历史'){
        var obj={
          type: 2,
          index: index
        }
        this.$emit('showDialogVisible',obj)
        this.$store.commit('changeUserManageType',2)//mutations
      }else  if(type == '审核通过'){
        var obj={
          type: 3,
          index: index
        }
        this.$emit('showDialogVisible',obj)
        // this.$store.commit('changeUserManageType',3)//mutations
      }else  if(type == '上下架'){
        var obj={
          type: 5,
          index: index
        }
        this.$emit('showDialogVisible',obj)
        // this.$store.commit('changeUserManageType',3)//mutations
      }else  if(type == '驳回'){
        var obj={
          type: 4,
          index: index
        }
        this.$emit('showDialogVisible',obj)
        // this.$store.commit('changeUserManageType',4)//mutations
      }else if(type == '编辑精品航线'){
        var obj={
          type: 8,
          index: index,

        }
        this.$emit('showDialogVisible',obj)
      }else if(type == '编辑精品航线2'){
        var obj={
          type: 9,
          index: index,
        }
        this.$emit('showDialogVisible',obj)
      }
    },
  },
};
</script>
<style lang="less" scoped>
    a {
        padding: 0;
        color: #0385ff;
    }
    a:hover{
        color:#ff5900;
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
    .accountClass{
      color: #606266;
      cursor:default;
    }
    .blockInfo:hover{
      color: #0385ff;
    }
    #box-body-content{
      width: 70%;
      height: auto;
      min-height: 40px;
      border: #e5e5e5 1px solid;
    }
    #box-body-content h1{
					font-size: 2em !important;
					font-weight: bold !important;
			}
			#box-body-content h2{
					font-size: 1.5em !important;
					font-weight: bold !important;
					line-height: 40px !important;
			}
			#box-body-content h3{
					font-size: 1.17em !important;
					font-weight: bold !important;
			}
			#box-body-content h4{
					font-size: 1em !important;
					font-weight: bold !important;
			}
			#box-body-content h5{
					font-size: 0.83em !important;
					font-weight: bold !important;
			}
			#box-body-content span{
					font-size: 1em !important;
					line-height: 1.5 !important;
					line-height: 40px !important;
			}
			#box-body-content p{
					font-size: 1em !important;
					line-height: 1.5 !important;
					line-height: 20px !important;
			}
			#box-body-content em{
					font-size: 1em !important;
					line-height: 1.5 !important;
					line-height: 20px !important;
					font-style:oblique !important
			}
			#box-body-content strong{
					font-size: 1em !important;
					line-height: 1.5 !important;
					line-height: 20px !important;
					font-weight: bold !important;
			}
			#box-body-content u{
					font-size: 1em !important;
					line-height: 1.5 !important;
					line-height: 20px !important;
					text-decoration: underline !important
			}
			#box-body-content s{
					font-size: 1em !important;
					line-height: 1.5 !important;
					line-height: 20px !important;
					text-decoration: line-through !important
			}
			#box-body-content a{
					font-size: 1em !important;
					line-height: 1.5 !important;
					line-height: 20px !important;
					color: #0000EE !important;
			}
      /deep/ tr.el-table__row--striped td{
        // background: #c3cddc !important;
      }
      /deep/ .el-table__row td{
        border-right: 1px solid rgb(215, 210, 210);
        border-bottom: 1px solid rgb(215, 210, 210);
      }
    /deep/ .el-table__row td:nth-child(0){
        border-left: 1px solid rgb(215, 210, 210);
      }
			// .dialog2Sty .el-dialog__close{
			// 	font-size: 40px;
			// }
</style>