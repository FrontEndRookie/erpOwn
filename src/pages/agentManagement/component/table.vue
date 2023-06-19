<template>
  <div style="width: 100%; height: 100%">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="一代" name="first" v-if="$utils.authCheckHidden(['252000_B']) === 'visible'">
        <el-table :data="tableData" :stripe="true" border style="width: 100%">
          <el-table-column
            v-for="(item, index) in computedColumns1"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :key="index"
            :fixed="item.fixed"
          >
              <!-- <div>{{scope.row.item.prop}}</div> -->
              <!-- <template slot-scope="scope" v-if="item.label == '一代资格' || item.label == '申请账号'"> -->
              <template slot-scope="scope">

                <div v-if="item.label == '一代资格'">
                   <el-switch
                    v-model="scope.row.primaryAgent"
                    @change="changeStatus(scope.$index, scope.row)" v-auth="['252007_B']">
                    </el-switch> 
                </div>
                <div v-else-if="item.label == '申请账号'">
                  <div v-auth-field:html-readonly="['401000_FC']">
                    <!-- <span style="color: #606266;cursor:default;" v-if="scope.row.accountName">{{scope.row.accountName}}</span>
                    <span style="color:#0385ff;cursor:pointer" v-else @click.stop="cellClick(scope.$index, scope.row,'申请账号')" v-auth="['252008_B']">去创建</span> -->
                    {{scope.row.userAccount}}
                  </div>
                </div>
                <div v-else-if="item.label == '序号'"> {{zSizeNum + scope.$index+1}}</div>
                <div v-else-if="item.label == '供应商类型'"> {{scope.row.typeName}}</div>
                <div v-else-if="item.label == '新增时间'"> {{scope.row.createTime}}</div>
                <div v-else-if="item.label == '是否入驻'"> {{scope.row.isSettledName}}</div>
                <div v-else-if="item.label == '是否合作'"> {{scope.row.isCooperationName}}</div>
                <div v-else-if="item.label == '是否有合同'"> {{scope.row.isContractName}}</div>
                <div v-else-if="item.label == '结算方式'"> {{scope.row.settlementWayName}}</div>
                <div v-else-if="item.label == '结算账期'"> {{scope.row.settlementDays}}</div>
                <div v-else-if="item.label == '授信额度'"> {{scope.row.creditLimit}}</div>
                <div v-else-if="item.label == '总票数'"> {{scope.row.totalCount}}</div>
                <div v-else-if="item.label == '总金额'"> {{scope.row.totalAmount}}</div>
                <div v-else-if="item.label == '超期票数'"> {{scope.row.overdueCount}}</div>
                <div v-else-if="item.label == '超期欠款'"> {{scope.row.overdueArrears}}</div>
                <div v-else-if="item.label == '总欠款'"> {{scope.row.totalArrears}}</div>
                <div v-else-if="item.label == '剩余额度'"> {{scope.row.leftAmount}}</div>
                <div v-else-if="item.label == '账期额度状态'"> {{scope.row.isOverdueAndExcessName}}</div>
                <div v-else-if="item.label == '统一社会信用代码'"> {{scope.row.socialCreditCode}}</div>
                <div v-else-if="item.label == '供应商名称'"> {{scope.row.agentName}}</div>
                <div v-else-if="item.label == '供应商简称'"> {{scope.row.agentCode}}</div>
                <div v-else-if="item.label == '供应商名称首字母'"> {{scope.row.namePy}}</div>
                <div v-else-if="item.label == '航线信息'"> {{scope.row.airlineComment}}</div>
                <div v-else-if="item.label == '供应商等级'">
                  <span style="color:#606266;cursor:pointer" @click.stop="cellClick(scope.$index, scope.row,'等级')"> {{scope.row.level+"星"}}</span></div>
                <div v-else-if="item.label == '航线负责人'"> {{scope.row.principalName}}</div>
                <div v-else-if="item.label == '一代操作'"> {{scope.row.salesName}}</div>
                <div v-else-if="item.label == '提交方式'"> {{scope.row.applyMethod}}</div>
                <div v-else-if="item.label == '已禁用标签'">
                  <!-- <span style="display: inline-block;"><a> {{scope.row.label}}</a></span> -->
                  <span>
                    <span style="color:#0385ff;cursor:pointer" @click="cellClick(scope.$index, scope.row,'标签',items)" v-for="(items, indexs) in (scope.row.label)" :key="indexs">{{items}}</span>
                  </span>
                  <!-- <span style="color: #606266;cursor:default;" v-else  v-auth="['252008_B']"></span> -->
                </div>
                <div v-else-if="item.label == '企业联系人'">
                  <div v-auth-field:[scope.row.busName]="['401005_FC']">{{ scope.row.busName }}</div>
                </div>
                <div v-else-if="item.label == '联系电话'">
                  <div v-auth-field:[scope.row.busPhone]="['401010_FC']">{{ scope.row.busPhone }}</div>
                </div>
                <div v-else-if="item.label == '代理联系人'">
                  <div v-auth-field:[scope.row.contactsName]="['401015_FC']">{{ scope.row.contactsName }}</div>
                </div>
                <div v-else-if="item.label == '代理联系电话'">
                  <div v-auth-field:[scope.row.phoneNum]="['401020_FC']">{{ scope.row.phoneNum }}</div>
                </div>
              </template>
          </el-table-column>
          <!-- <el-table-column label="操作" fixed="right" width="200px"> -->
          <el-table-column label="操作" width="200px" v-if="getAuthFieldListStatus(['401025_FC']).list">
            <template slot-scope="scope">
              <div v-auth-field:html-readonly="['401025_FC']">
                <a
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row, '编辑')"
                  v-auth="['252001_B']"
                  >编辑</a
                >
                <a
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row, '查看资质')"
                  >查看资质</a
                >
                <a
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row, '历史')"
                  >历史</a
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="待审核" name="second" v-if="$utils.authCheckHidden(['252009_B']) === 'visible'">
        <el-table :data="tableData" :stripe="true" border style="width: 100%">
          <el-table-column
            v-for="(item, index) in columns2"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :key="index"
          >
          <template slot-scope="scope">
                <div v-if="item.label == '申请账号'">
                  {{scope.row.userAccount}}
                   <!-- <span style="color: #606266;cursor:default;" v-if="scope.row.accountName">{{scope.row.accountName}}</span>
                  <span style="color:#0385ff;cursor:pointer" v-else @click.stop="cellClick(scope.$index, scope.row,'申请账号')" v-auth="['252008_B']">去创建</span> -->
                </div>
                <div v-else-if="item.label == '序号'"> {{zSizeNum + scope.$index+1}}</div>
                <div v-else-if="item.label == '申请时间'"> {{scope.row.createTime}}</div>
                <!-- <div v-else-if="item.label == '是否入驻'"> {{scope.row.isSettledName}}</div> -->
                <div v-else-if="item.label == '统一社会信用代码'"> {{scope.row.socialCreditCode}}</div>
                <div v-else-if="item.label == '供应商名称'"> {{scope.row.agentName}}</div>
                <div v-else-if="item.label == '提交方式'"> {{scope.row.applyMethod}}</div>
                <div v-else-if="item.label == '企业联系人'"> {{scope.row.busName}}</div>
                <div v-else-if="item.label == '联系电话'"> {{scope.row.busPhone}}</div>
              </template>
            <span v-if="index == 0">{{ index }} </span>
          </el-table-column>
          <el-table-column label="详情" width="100px">
            <template slot-scope="scope">
              <a
                size="mini"
                @click="handleEdit(scope.$index, scope.row, '查看申请')"
                >查看申请</a
              >
            </template>
          </el-table-column>
          <!-- <el-table-column label="确认意见" fixed="right" width="200px"> -->
          <el-table-column label="确认意见" width="200px">
            <template slot-scope="scope">
              <a
                size="mini"
                @click="handleEdit(scope.$index, scope.row, '审核通过')"
                v-auth="['252004_B']"
                >审核通过</a
              >
              <a
                size="mini"
                @click="handleEdit(scope.$index, scope.row, '驳回')"
                v-auth="['252005_B']"
                >驳回</a
              >
              <a
                size="mini"
                @click="handleEdit(scope.$index, scope.row, '历史')"
                >历史</a
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="不通过" name="third" v-if="$utils.authCheckHidden(['252010_B']) === 'visible'">
        <el-table :data="tableData" :stripe="true" border style="width: 100%">
          <el-table-column
            v-for="(item, index) in columns3"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :key="index"
          >
            <template slot-scope="scope">
                <div v-if="item.label == '申请账号'">
                  {{scope.row.userAccount}}
                    <!-- <span style="color: #606266;cursor:default;" v-if="scope.row.accountName">{{scope.row.accountName}}</span>
                  <span style="color:#0385ff;cursor:pointer" v-else @click.stop="cellClick(scope.$index, scope.row,'申请账号')" v-auth="['252008_B']">去创建</span> -->
                </div>
                <div v-else-if="item.label == '序号'"> {{zSizeNum + scope.$index+1}}</div>
                <div v-else-if="item.label == '申请时间'"> {{scope.row.createTime}}</div>
                <div v-else-if="item.label == '是否入驻'"> {{scope.row.isSettledName}}</div>
                <div v-else-if="item.label == '统一社会信用代码'"> {{scope.row.socialCreditCode}}</div>
                <div v-else-if="item.label == '供应商名称'"> {{scope.row.agentName}}</div>
                <div v-else-if="item.label == '提交方式'"> {{scope.row.applyMethod}}</div>
                <div v-else-if="item.label == '联系电话'"> {{scope.row.phoneNum}}</div>
              </template>
          </el-table-column>
           <el-table-column label="详情" width="100px">
            <template slot-scope="scope">
              <a
                size="mini"
                @click="handleEdit(scope.$index, scope.row, '查看申请')"
                >查看申请</a
              >
            </template>
          </el-table-column>
          <el-table-column label="确认意见" width="200px">
            <template slot-scope="scope">
              <a
                size="mini"
                @click="handleEdit(scope.$index, scope.row, '修改')"
                v-auth="['252006_B']"
                >修改</a
              >
              <a
                size="mini"
                @click="handleEdit(scope.$index, scope.row, '历史')"
                >历史</a
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- <embed src="/image/excel/admin20220325102031227LX_XX.xls" style="width:100px;height:100px;" alt=""> -->

  </div>
</template>

<script>
export default {
  props: {
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
  created(){
    const firstAuth = this.$utils.authCheckHidden(['252000_B']) === 'visible';
    const secondAuth = this.$utils.authCheckHidden(['252009_B']) === 'visible';
    const thirdAuth = this.$utils.authCheckHidden(['252010_B']) === 'visible';
    if (firstAuth) {
      this.activeName = 'first'
      this.handleClick({name:'first'})
    }
    if (!firstAuth && secondAuth) {
      this.activeName = 'second'
      this.handleClick({name:'second'})
    }
    if (!firstAuth && !secondAuth && thirdAuth) {
      this.activeName = 'third'
      this.handleClick({name:'third'})
    }
    if(this.$route.query.tab == 2){
      if (secondAuth) {
        this.activeName = 'second'
        this.handleClick({name:'second'})
      } else {
        this.$message.error('无权访问')
      }
    }
  },
  data() {
    return {
      value:false,
      activeName: "",
      oldAgentId:null,
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
      columns1: [
        {
          label: "序号",
          prop: "",
          show: true,
          sort: false,
          width: "40",
          fixed: 'left',
        },
        {
          label: "供应商名称",
          prop: "agentName",
          show: true,
          sort: true,
          width: "200",
          fixed: 'left',
        },
        {
          label: "统一社会信用代码",
          prop: "socialCreditCode",
          show: true,
          sort: true,
          width: "200",
        },
        {
          label: "供应商类型",
          prop: "typeName",
          // prop: 'filePath',
          show: true,
          sort: true,
          width: "100",
        },
        {
          label: "新增时间",
          prop: "createTime",
          show: true,
          sort: true,
          width: "200",
        },
        {
          label: "是否入驻",
          prop: "isSettledName",
          show: true,
          sort: true,
          width: "100",
        },
        {
          label: "是否合作",
          prop: "isCooperationName",
          show: true,
          sort: true,
          width: "100",
        },
        {
          label: "是否有合同",
          prop: "isContractName",
          show: true,
          sort: true,
          width: "100",
        },
        // 
        {
          label: "结算方式",
          prop: " settlementWayName", //1付款买单 2月结买单 3固定天数
          show: true,
          sort: true,
          width: "100",
        },{
          label: "结算账期",
          prop: "settlementDays",
          show: true,
          sort: true,
          width: "100",
        },{
          label: "授信额度",
          prop: "creditLimit",
          show: true,
          sort: true,
          width: "100",
        },{
          label: "总票数",
          prop: "totalCount",
          show: true,
          sort: true,
          width: "100",
        },{
          label: "总金额",
          prop: "totalAmount",
          show: true,
          sort: true,
          width: "100",
        },{
          label: "超期票数",
          prop: "overdueCount", 
          show: true,
          sort: true,
          width: "100",
        },{
          label: "超期欠款",
          prop: "overdueArrears",
          show: true,
          sort: true,
          width: "100",
        },{
          label: "总欠款", 
          prop: "totalArrears",
          show: true,
          sort: true,
          width: "100",
        },{
          label: "剩余额度",
          prop: "leftAmount",
          show: true,
          sort: true,
          width: "100",
        },{
          label: "账期额度状态",
          prop: "isOverdueAndExcessName", //1超额，2超期，3超额，超期
          show: true,
          sort: true,
          width: "100",
        },
        {
          label: "供应商简称",
          prop: "agentCode",
          show: true,
          sort: true,
          width: "100",
        },
        {
          label: "供应商名称首字母",
          prop: "namePy",
          show: true,
          sort: true,
          width: "250",
        },
        {
          label: "供应商等级",
          prop: "level",
          show: true,
          sort: true,
          width: "100",
        },
        {
          label: "航线负责人",
          prop: "principalName",
          show: true,
          sort: true,
          width: "100",
        },
        {
          label: "一代操作",
          prop: "salesName",
          show: true,
          sort: true,
          width: "100",
        },
        {
          label: "一代资格",
          prop: "primaryAgentStatus",
          show: true,
          sort: true,
          width: "100",
        },
        {
          label: "提交方式",
          prop: "applyMethod",
          show: true,
          sort: true,
          width: "100",
        },
        {
          label: "已禁用标签",
          prop: "label",
          show: true,
          sort: true,
          width: "240",
        },
        //航线信息airlineComment
        {
          label: "航线信息",
          prop: "airlineComment",
          show: true,
          sort: true,
          width: "120",
        },
        {
          label: "申请账号",
          prop: "userAccount",
          show: true,
          sort: true,
          width: "120",
          authFieldCodes: ["401000_FC"],
        },
        {
          label: "企业联系人",
          prop: "busName",
          show: true,
          sort: true,
          width: "100",
          authFieldCodes: ["401005_FC"],
        },
        {
          label: "联系电话",
          prop: "busPhone",
          show: true,
          sort: true,
          width: "120",
          authFieldCodes: ["401010_FC"],
        },
        {
          label: "代理联系人",
          prop: "contactsName",
          show: true,
          sort: true,
          width: "100",
          authFieldCodes: ["401015_FC"],
        },
        {
          label: "代理联系电话",
          prop: "phoneNum",
          show: true,
          sort: true,
          width: "120",
          authFieldCodes: ["401020_FC"],
        },
      ],
      columns2: [
        {
          label: "序号",
          prop: "",
          show: true,
          sort: false,
          width: "40",
          fixed: 'left',
        },
        {
          label: "供应商名称",//
          prop: "agentName",
          show: true,
          sort: true,
          // width: "200",
          fixed: 'left',
        },
        {
          label: "统一社会信用代码",
          prop: "socialCreditCode",
          show: true,
          sort: true,
          width: "200",
        },
        {
          label: "申请时间",
          prop: "createTime",
          // prop: 'filePath',
          show: true,
          sort: true,
          // width: "200",
        },
        // {
        //   label: "是否入驻",
        //   prop: "isSettledName",
        //   show: true,
        //   sort: true,
        //   width: "100",
        // },
        {
          label: "提交方式",
          prop: "applyMethod",
          show: true,
          sort: true,
          width: "100",
        },
        {
          label: "申请账号",//
          prop: "userAccount",
          show: true,
          sort: true,
          // width: "120",
        },
        {
          label: "企业联系人",
          prop: "busName",
          show: true,
          sort: true,
          width: "100",
        },
        {
          label: "联系电话",
          prop: "busPhone",
          show: true,
          sort: true,
          width: "120",
        },
      ],
      columns3: [
        {
          label: "序号",
          prop: "",
          show: true,
          sort: false,
          width: "40",
          fixed: 'left',
        },
        {
          label: "供应商名称",//
          prop: "agentName",
          show: true,
          sort: true,
          // width: "200",
          fixed: 'left',
        },
        {
          label: "统一社会信用代码",
          prop: "socialCreditCode",
          show: true,
          sort: true,
          width: "200",
        },
        {
          label: "申请时间",
          prop: "createTime",
          // prop: 'filePath',
          show: true,
          sort: true,
          // width: "200",
        },
        {
          label: "是否入驻",
          prop: "isSettledName",
          show: true,
          sort: true,
          width: "100",
        },
        {
          label: "提交方式",
          prop: "applyMethod",
          show: true,
          sort: true,
          width: "100",
        },
        {
          label: "申请账号",
          prop: "userAccount",
          show: true,
          sort: true,
          // width: "120",
        },
        {
          label: "联系电话",
          prop: "phoneNum",
          show: true,
          sort: true,
          // width: "120",
        },
      ],
    };
  },
  computed: {
    computedColumns1() {
      return this.columns1.filter((item) => {
        return this.getAuthFieldListStatus(item.authFieldCodes).list;
      });
    },
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
    // this.gethistory();
    // console.log(this.tableData);
  },
  watch: {
    NumberType: {
      handler(newName, oldName) {
        this.changeColmen(newName);
      },
      immediate: true,
      deep: true,
    },
    '$route.query.time'(){
        if(this.$route.query.tab == 2){
        this.activeName = 'second'
        this.handleClick({name:'second'})
      }
    }
  },
  methods: {
    getAuthFieldListStatus(authFieldCodes = []) {
      const {
        validEditAuthFieldCodes,
        validViewAuthFieldCodes,
        validListAuthFieldCodes,
      } = this.$store.getters;
      const edit = authFieldCodes.every((code) =>
        validEditAuthFieldCodes.includes(code)
      );
      const view = authFieldCodes.every((code) =>
        validViewAuthFieldCodes.includes(code)
      );
      const list = authFieldCodes.every((code) =>
        validListAuthFieldCodes.includes(code)
      );
      return {
        edit,
        view,
        list,
      };
    },
    // 改变一代资格
    changeStatus(index,row){
      // console.log(row.primaryAgentStatus);
       var obj={
            type: 9,
            index: index,
            status: row.primaryAgentStatus,
          }
          this.$emit('showDialogVisible',obj)
    },
    // 
      cellClick(index,row,type,item){
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
        }else if(type == '标签'){
          var obj={
            type: 11,
            index: index,
            // indexs: indexs,
            item: item,
          }
          // return console.log(obj);
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
        this.$emit('tabChange',2)//审核未通过2
      }
      //审核通过1
    },
    handleEdit(index,row,type){
      // console.log(index,row,type);
      if(type == '编辑'){
        var obj={
          type: 5,
          index: index
        }
        this.$emit('showDialogVisible',obj)
      }else  if(type == '历史'){
        var obj={
          type: 3,
          index: index
        }
        this.$emit('showDialogVisible',obj)
      }else  if(type == '查看资质'){
        var obj={
          type: 10,
          index: index 
        }
        this.$emit('showDialogVisible',obj)
      }else  if(type == '审核通过'){
        var obj={
          type: 4,
          index: index,
          oldAgentId:this.oldAgentId
        }
        this.$emit('showDialogVisible',obj)
      }else  if(type == '驳回'){
        var obj={
          type: 7,
          index: index
        }
        this.$emit('showDialogVisible',obj)
      }else  if(type == '修改'){
        var obj={
          type: 8,
          index: index
        }
        this.$emit('showDialogVisible',obj)
      }else  if(type == '查看申请'){
        var obj={
          type: 10,
          index: index
        }
        this.$emit('showDialogVisible',obj)
      }
    },
    // 下载
    handleEdits(index, row, typeName) {
      if (typeName == "") return;
      // console.log(index);
      var res = this.$service + this.tableData[index].filePath;
      // console.log(res);
      this.$utils.downloadFile({
        url: this.tableData[index].filePath,
        name: this.tableData[index].fileName,
      });
      return;
      const aLink = document.createElement("a");
      let blob = new Blob([res], {
        type: "application/vnd.ms-excel",
      });
      aLink.href = URL.createObjectURL(blob);
      aLink.setAttribute(this.tableData[index].filePath); // 设置下载文件名称
      aLink.click();
      document.body.appendChild(aLink);
    },
    // 获取列表详情
    // gethistory() {
    //   var pageNumber = this.pageNumber;
    //   var pageSize = this.pageSize;
    //   var dataObj = {
    //     pageNum: pageNumber,
    //     pageSize: pageSize,
    //   };
    //   this.$http.post(this.$service.historyPage, dataObj).then((data) => {
    //     if (data.code == 200) {
    //       //   this.currentPage4 = data.data.pages
    //       //   console.log(data.data);
    //       this.total = data.data.total;
    //       this.pages = data.data.pages;
    //       this.lists = data.data.records;
    //       var array = JSON.parse(JSON.stringify(data.data.records));
    //       for (let index = 0; index < array.length; index++) {
    //         if (array[index].successFlag == "1") {
    //           array[index].successFlag = "导入失败";
    //         } else if (array[index].successFlag == "0") {
    //           array[index].successFlag = "导入成功";
    //         } else {
    //           array[index].successFlag = "";
    //         }
    //       }
    //       this.tableData = array;
    //       console.log(this.tableData);
    //     } else {
    //       this.$message.error(data.message);
    //     }
    //   });
    // },
    changeColmen() {
      //   if(this.NumberType == 1){
      //     this.columns = columns1
      //   }else if(this.NumberType == 2){
      //     this.columns = columns2
      //   }else if(this.NumberType == 3){
      //     this.columns = columns3
      //   }
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
    /deep/ tr.el-table__row--striped td{
      // background: #c3cddc !important;
    }
    /deep/ .el-table__row td{
        border-right: 1px solid rgb(215, 210, 210);
        border-bottom: 1px solid rgb(215, 210, 210);
      }
    /deep/ .el-table__row td:first-child{
        border-left: 1px solid rgb(215, 210, 210);
      }
</style>