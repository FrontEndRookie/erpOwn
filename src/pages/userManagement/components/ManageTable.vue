<template>
  <div style="position: relative;">
    <el-table
      stripe
      height="470"
      ref="multipleTable"
      @sort-change="handleSort"
      @selection-change="handleSelect"
      :data="tableData"
      style="width: 100%;"
      >
      <template slot="empty">
        <img class="data-pic" src="../../../assets/kong-icon.png" />
        <p>暂无数据</p>
      </template>
      >
      <el-table-column
        fixed="left"
        type="selection"
        width="55">
      </el-table-column>
      <!--列 -->
      <el-table-column
        v-for="(column, index) in columns"
        :key="index"
        :sortable="column.sort"
        :prop="column.prop"
        :label="column.label"
        :min-width="column.width"
        :fixed="column.flexd"
        align="center"
        >
        <template slot-scope="scope">
          <div v-if="column.label=='特批截止日期' && routerName=='userOrderManagement'" style="color:#2273CE;"> 
              <span v-if="scope.row.specialApprovalDeadline" style="cursor:pointer" @click="changeDialog(scope.$index, scope.row,3)" v-auth:disabled="['655003_B']">{{scope.row.specialApprovalDeadline}}</span>
              <span v-else  style="cursor:pointer" @click="changeDialog(scope.$index, scope.row,3)" v-auth:none="['655003_B']">点击设置</span>
          </div>
          <div v-else-if="routerName=='userOrderManagement' && column.label=='操作'" style="color:#2273CE;cursor:pointer"> 
              <span @click="changeDialog(scope.$index, scope.row,2)">查看历史</span>
          </div>
          <div v-else-if="column.label=='逾期天数' && routerName=='userOrderManagement'"> 
              <span v-if="scope.row.overDueDays">{{scope.row.overDueDays}}天</span>
              <span v-else>/</span>
          </div>
          <div v-else-if="column.label=='信用等级'">
              <span v-if="scope.row.creditGradeName && scope.row.creditGradeName!=0">{{scope.row.creditGradeName}}</span>
              <span v-else>/</span>
          </div>
          <div v-else-if="column.label=='超期欠款（元）'"> 
              <span v-if="scope.row.overDueArrears && scope.row.overDueArrears!=0">{{scope.row.overDueArrears}}</span>
              <span v-else>/</span>
          </div>
          <!-- <div v-else-if="column.label=='临时额度期限'"> 
              <span v-if="scope.row.temporaryQuotaPeriod">{{scope.row.temporaryQuotaPeriod}}</span>
              <span v-else>/</span>
          </div> -->
          <div v-else-if="column.label=='总欠款'"> 
              <span v-if="scope.row.totalArrears && scope.row.totalArrears!=0">{{scope.row.totalArrears}}</span>
              <span v-else>/</span>
          </div>
          <div v-else-if="column.label=='剩余额度（元）'"> 
              <span v-if="(scope.row.payWayName == '付款买单')">/</span>
              <span v-else-if="(scope.row.remainingQuota && scope.row.remainingQuota!=0)">{{scope.row.remainingQuota}}</span>
              <span v-else>/</span>
          </div>
          <div v-else-if="column.label=='授信额度（元）'"> 
              <span v-if="scope.row.quota && scope.row.quota!=0">{{scope.row.quota}}</span>
              <span v-else>/</span>
          </div>
          <div v-else-if="column.label=='临时额度（元）'"> 
              <span v-if="scope.row.poraryQuota && scope.row.poraryQuota!=0">{{scope.row.poraryQuota}}</span>
              <span v-else>/</span>
          </div>
          <div v-else-if="column.label=='结算账期'"> 
              <span v-if="scope.row.accountingPeriod && scope.row.accountingPeriod!=0">{{scope.row.accountingPeriod}}</span>
              <span v-else>/</span>
          </div>
          <div v-else-if="column.label=='开放状态' && routerName=='userOrderManagement'" style="color:#2273CE;"> 
              <el-switch
                    v-model="scope.row.openStatusZJ"
                    @change="changeDialog(scope.$index, scope.row,4)"
                    :disabled="$utils.authCheckDisabled(['655004_B'])"
                    >
              </el-switch> 
          </div>
          <div v-else-if="column.label=='售前客服' && routerName=='userOrderManagement'" > 
              <span v-if="scope.row.pscsName">{{scope.row.pscsName}}</span>
              <span v-else style="color:red">暂未绑定</span>
          </div>
          <div v-else-if="column.label=='售前客服' && routerName=='customerManagementMasterList'" > 
              <span v-if="scope.row.sysName">{{scope.row.sysName}}</span>
              <span v-else style="color:red">暂未绑定</span>
          </div>
          <div v-else-if="column.label=='企业联系人邮箱'" > 
              <span v-if="scope.row.userEmail">{{scope.row.userEmail}}</span>
              <span v-else style="color:red">未设置</span>
          </div>
          <div v-else-if="column.label=='总票数'" > 
              <!-- <span v-if="Number(scope.row.totalVotes)>0"  style="cursor: pointer;color:#2273CE;display: block;width: 100%;" @click="listData = scope.row.overDueOrderList;dialogVisible = true">{{scope.row.totalVotes}}</span> -->
              <span v-if="Number(scope.row.totalVotes)>0"  >{{scope.row.totalVotes}}</span>
              <span v-else>/</span>
          </div>
          <div v-else-if="column.label=='超期票数'" > 
              <span v-if="Number(scope.row.overDueVotes)>0"  style="cursor: pointer;color:#2273CE;display: block;width: 100%;" @click="listData = scope.row.overDueOrderList;dialogVisible = true">{{scope.row.overDueVotes}}</span>
              <span v-else>/</span>
          </div>
          <div v-else-if="column.label=='订单超期状态'" > 
              <span v-if="scope.row.overDueStatusName == '已超期'"  style="color:red;">{{scope.row.overDueStatusName}}</span>
              <span v-else>{{scope.row.overDueStatusName}}</span>
          </div>
          <div v-else-if="column.label=='临时额度期限'" > 
              <span v-if="scope.row.temporaryQuotaPeriod == '9999/01/01-9999/01/01' || scope.row.temporaryQuotaPeriod == '' || scope.row.temporaryQuotaPeriod == null " >/</span>
              <span v-else>{{scope.row.temporaryQuotaPeriod}}</span>
          </div>
          <div v-else-if="column.label=='企业联系人QQ号'" > 
              <span v-if="scope.row.userEmail">{{scope.row.userEmail}}</span>
              <span v-else style="color:red">未设置</span>
          </div>
          <div v-else-if="column.label=='客服联系电话'" > 
              <span v-if="scope.row.sysTel">{{scope.row.sysTel}}</span>
              <span v-else >/</span>
          </div>
          <div v-else>
            {{scope.row[column.prop]}}
          </div>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column
        v-if="routerName=='customerManagementMasterList'"
        fixed="right"
        :label="'操作'"
        min-width="160"
        :show-overflow-tooltip="true"
        >
        <template slot-scope="scope">
          <div style="color:#2273CE;cursor:pointer">
            <span class="column-line-itemL" @click="changeDialog(scope.$index, scope.row,1)" v-auth:none="['654004_B']">编辑</span>
            <span @click="changeDialog(scope.$index, scope.row,2)" v-auth:none="['654005_B']">查看历史</span>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        v-for="(column, index) in columns"
        v-if="column.label=='开放状态' && routerName=='userOrderManagement'"
        :key="index"
        :prop="column.prop"
        align="center"
        fixed="right"
        :label="'开放状态'"
        min-width="160"
        :show-overflow-tooltip="true"
        >
        <template slot-scope="scope">
          <div style="color:#2273CE;"> 
              <el-switch
                    v-model="scope.row.openStatusZJ"
                    @change="changeDialog(scope.$index, scope.row,4)">
              </el-switch> 
          </div>
        </template>
      </el-table-column> -->
    </el-table>
    <el-dialog
      class="dialog1"
      title="超期订单详情"
      :visible.sync="dialogVisible"
      width="80%">
      <div class="buttonDC" @click="daochu(listData)">导出列表</div>
      <el-table
      stripe
      :data="listData"
      style="width: 100%;padding: 30px 0; "
      >
      <template slot="empty">
        <img class="data-pic" src="../../../assets/kong-icon.png" />
        <p>暂无数据</p>
      </template>
      >
      <!-- <el-table-column
        v-if="checkbox"
        type="selection"
        width="55">
      </el-table-column> -->
      <!--列-->
      <el-table-column
        v-for="(column, index) in columns2"
        :key="index"
        :sortable="column.sort"
        :prop="column.prop"
        :label="column.label"
        :min-width="column.width"
        align="center"
        >
        <template slot-scope="scope">
          <div v-if="column.label=='订单状态'">
            <span :style="scope.row.openStatus==1?'color:#03B915':'color:#D9001B'">{{scope.row.openStatus==1?'正常':'冻结'}}</span>
          </div>
          <div v-else-if="column.label=='结算方式'">
            <span> {{payWayArray[Number(scope.row.payWay)]}} </span>
          </div>
         
          <div v-else>
            {{scope.row[column.prop]}}
          </div>
        </template>
      </el-table-column>
    </el-table>
    </el-dialog>
    <el-dialog
      title="选择时间"
      :visible="DogShow == 1 ? true : false"
      width="600px"
      @open="handleOpen()"
      @close="handleClose(1)"
    >
      <el-calendar
        v-model="valueTime"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
        style="border-top: 1px rgb(26, 26, 26) solid"
      >
        <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
        <template slot="dateCell" slot-scope="{ date, data }">
          <div
            :class="
              new Date(data.day) < new Date(payDeadlineDate) ? 'is-selecteds' : ''
            "
            style="height: 100%"
          >
            <p
              :class="data.isSelected ? 'is-selected' : ''"
              style="
                height: 50px;
                font-size: 16px;
                line-height: 50px;
                text-align: center;
              "
            >
              <!-- {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}} -->
              {{ Number(data.day.split("-").slice(2).join("")) }}
              {{ data.isSelected ? "✔️" : "" }}
            </p>
          </div>
        </template>
      </el-calendar>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="clearButtom" @click="handleClose(3)">清除</el-button>
        <el-button type="primary" @click="handleClose(2)">确 定</el-button>
      </span>
    </el-dialog>
    <div style="height:65px;width:100%"></div>
    <div class="bottomDiv">
      <div class="buttons" v-show="routerName === 'userOrderManagement'" style="padding:20px;padding-bottom:0px">
        <el-button @click="dcButton2" v-auth:none="['655001_B']">导出列表</el-button>
        <el-button @click="changeDialog(-1, multipleSelection,5)" v-auth:none="['655005_B']">批量解锁</el-button>
        <el-button @click="changeDialog(-1, multipleSelection,6)" v-auth:none="['655006_B']">批量设置特批截止日期</el-button>
      </div>
      <div class="buttons" style="padding:20px;padding-bottom:0px" v-show="routerName === 'customerManagementMasterList'">
        <el-button @click="dcButton" v-auth:none="['654001_B']">导出列表</el-button>
      </div>
      <!-- 分页 -->
      <div v-show="total > 10" style="margin-right:140px">
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
    
   <el-dialog
      :title="showMessage == '确认解锁所有订单吗？'?'批量解锁':'解锁与冻结'"
      :visible.sync="showTag1"
      width="400px"
      @close = 'statusChange(objShow,false)'>
      <span style="display:block;padding:20px;font-size:20px;font-weight:600px;">{{showMessage}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="statusChange(objShow,false)">取 消</el-button>
        <el-button type="primary" @click="statusChange(objShow,true)">确 定</el-button>
      </span>
    </el-dialog>
   <el-dialog
      title="批量设置特批截止日期"
      :visible.sync="showTag2"
      width="538px"
      @close = 'showTag2 = false'>
      <div style="display:flex; flex-direction: row; align-items: center;">
        <span style="display:block;padding:20px 0;font-size:20px;font-weight:600px;">特批截止日期：</span>
        <el-date-picker
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          v-model="plTime"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose2(objShow,false)">取 消</el-button>
        <el-button type="primary" @click="handleClose2(objShow,true)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import App from '../../../App.vue';
import { toData } from '@/util/assist'
export default {
  components: { App },
  props: {
    // 表格数据源
    tableData: {
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
      default: () => {}
    },
    // 总条数
    total: {
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
    }
  },
  data() {
    return {
      showMessage:'',
      objShow:{},
      clearButtom:true,
      showTag1:false,
      showTag2:false,
      id:'',
      plTime:new Date(),
      valueTime: new Date(),
      payDeadlineDate: new Date(),
      DogShow:0,
      specialApprovalDeadline:'',
      multipleSelection:[],
      pcscArray:[],
      payWayArray:['付款买单','月结买单','固定天数'],
      //认证状态
      dialogVisible:false,
      listData:[],
     cerStatus: ['未认证', '审核中', '审核失败', '待客户验证', '验证成功', '验证失败', '待财务打款'],
     routerName:'',
        columns2: [{
          label: '订单号',
          prop: 'orderNo',
          show: true,
          width: '200'
        },{
          label: '运单号',
          prop: 'waybillNo',
          show: true,
          width: '200'
        },{
          label: '结算方式', //0= 付款买单 1=月结买单
          prop: 'payWay',
          show: true,
          width: '100'
        },
        // {
        //   label: '账期', //==
        //   prop: 'companyName',
        //   show: true,
        //   width: '100'
        // },
        {
          label: '航班日期',
          prop: 'departureDate',
          show: true,
          width: '160'
        },{
          label: '最晚付款日期',
          prop: 'payDeadline',
          show: true,
          width: '160'
        },{
          label: '特批截止日期',
          prop: 'specialApprovalDeadline',
          show: true,
          width: '160'
        },{
          label: '逾期天数',
          prop: 'overDueDays',
          show: true,
          width: '60'
        },{
          label: '应收总金额（元）',
          prop: 'totalArCny',
          show: true,
          width: '100'
        },{
          label: '未收总金额（元）',
          prop: 'arrears',
          show: true,
          width: '100'
        },{
          label: '售前客服',
          prop: 'pscsName',
          show: true,
          width: '140'
        },{
          label: '订单状态',
          prop: 'openStatus',
          show: true,
          width: '80'
        }],
    }
  },
  mounted() {
    this.routerName = (this.$route.path).slice((this.$route.path).lastIndexOf('/')+1)
    // console.log(this.routerName);//customerManagementMasterList//userOrderManagement
     this.$http.get(this.$service.userSearchNoAuth+'?roleName=售前客服&pageSize=50000').then(data=>{
          this.pcscArray = data.data.records
        })
      var newData = new Date()
     this.payDeadlineDate = newData.getFullYear() + "-" + (newData.getMonth() + 1) + "-" + newData.getDate();
   },
  watch: {
    valueTime: {
      handler(newName, oldName) {
        this.calendarChang(newName, oldName);
        console.log(newName);
      },
      immediate: true,
      deep: true
    },
  },
  methods: {
    handleOpen(){
      if(this.payDeadlineDate){
        this.valueTime = this.payDeadlineDate
      }else{
        var newData = new Date()
        var valueTime = newData.getFullYear() + "-" + (newData.getMonth() + 1) + "-" + newData.getDate();
        this.valueTime = this.bzgs(valueTime)
      }
      // var dom = document.getElementsByClassName('el-button--plain')
      // console.log(dom);
      // dom = [].slice.apply(dom)
    },
    calendarChang(newda, oldda) {
      var newData = new Date(this.payDeadlineDate);
      var valueTime =
        newData.getFullYear() +
        "-" +
        (newData.getMonth() + 1) +
        "-" +
        newData.getDate();
      var aa = new Date(newda);
      var cc =
        aa.getFullYear() + "-" + (aa.getMonth() + 1) + "-" + aa.getDate();
      var bb = new Date(oldda);
      var dd =
        bb.getFullYear() + "-" + (bb.getMonth() + 1) + "-" + bb.getDate();
      if (aa < newData) {
        setTimeout(() => {
          this.valueTime = valueTime;
        });
      } else {
        // setTimeout(()=>{
        //   this.valueTime = cc
        // })
      }
    },
    //关闭时间选择弹窗
    handleClose(type) {
      if (type == 1) {
        this.DogShow = 0
      }else if(type == 3){
        this.DogShow = 0
        var val = {
            specialApprovalDeadline: null,
            id: this.id,
            payDeadline:this.payDeadlineDate
          }
        this.$emit('speciaChange', val)
        this.id = ''
        this.payDeadlineDate = ''
      } else {
          this.DogShow = 0
          var newData = new Date(this.valueTime);
          var valueTime =
          newData.getFullYear() +
          "-" +
          (newData.getMonth() + 1) +
          "-" +
          newData.getDate();
          valueTime = this.bzgs(valueTime)
          var val = {
            specialApprovalDeadline: valueTime,
            id: this.id,
            payDeadline:this.payDeadlineDate
          }
          this.$emit('speciaChange', val)
          this.id = ''
          this.payDeadlineDate = ''
      }
    },
    bzgs(array) {
        var aa = new Date(array);
      var cc =
      aa.getFullYear() + "-" + (aa.getMonth() + 1) + "-" + aa.getDate();
      var arr = cc.split("-");
      var str = "" + arr[0];
      for (let i = 1; i < arr.length; i++) {
        if (arr[i].split("").length == 1) {
          str = str + "-0" + arr[i];
        } else {
          str = str + "-" + arr[i];
        }
      }
      return str;
    },
    //选中选择框
    handleSelect(val){
      this.multipleSelection = val
      console.log(val);
    },
    //弹窗编辑
    changeDialog(index,item,type){
      if(this.routerName == 'customerManagementMasterList'){
        if(type==1){
          this.$store.commit('changeUserManageType',1)
          this.$emit('changUserObj', item)
        }else if(type==2){
          this.$emit('changUserObj', item)
          this.$store.commit('changeUserManageType',2)
        }else if(type==3){
          this.$store.commit('changeUserManageType',3)
        }else if(type==4){
          this.$store.commit('changeUserManageType',4)
        }
      }else if(this.routerName == 'userOrderManagement'){
        if(type==1){
          this.$store.commit('changeUserManageType',1) //mutations
        }else if(type==2){
          var obj = {
            id:item.id,
            type:2,
          }
          this.$emit('changUserObj', obj)
          this.$store.commit('changeUserManageType',2)
        }else if(type==3){
          // this.$store.commit('changeDogShow',1)
          console.log(item.payDeadline ,'付款日期',item.specialApprovalDeadline);
          if(!Boolean(item.specialApprovalDeadline)){
            this.clearButtom = false
          }else{
            this.clearButtom = true
          }
          this.DogShow = 1
          this.payDeadlineDate = item.payDeadline // 最晚付款日期
          this.id = item.id
        }else if(type==4){
          console.log(item);
          if(item.openStatusZJ){
            this.showMessage = '确认解锁该订单吗？'
            this.objShow={
              id:item.id,
              status : item.status,
              fettle : item.fettle,
              openStatus: item.openStatus == 0 || item.openStatus == null?1:0,
            }
          }else{
            this.showMessage = '确认冻结该订单吗？'
            this.objShow={
              id:item.id,
              status : item.status,
              fettle : item.fettle,
              openStatus: item.openStatus == 0 || item.openStatus == null?1:0,
            }
          }
          
          this.showTag1 = true
        }else if(type==5){
          // if(item.openStatusZJ){
          //   this.showMessage = '确认解锁所有订单吗？'
            
          // }else{
          //   this.showMessage = '确认冻结所有订单吗？'
          // }
          this.showMessage = '确认解锁所有订单吗？'
          var array = []
          if(item.length == 0){
            return  this.$message.warning('请先勾选数据再进行此操作')
          }
          for (let i = 0; i < item.length; i++) {
            var obj = {
              id:item[i].id,
              status : item[i].status,
              openStatus: item[i].openStatus == 0 || item[i].openStatus == null?1:1,
            }
            array.push(obj)
          }
          this.objShow = array
          this.showTag1 = true
        }else if(type==6){
          if(item.length == 0){
            return this.$message.warning('请先勾选数据再进行此操作')
          }else{
            this.showTag2 = true
          }
        }
      }
    },
    //批量时间选择2
    handleClose2(type) {
      if (type == 1) {
        this.showTag2 = false
      } else {
          this.DogShow = 0
          var newData = new Date(this.plTime);
          var valueTime =
          newData.getFullYear() +
          "-" +
          (newData.getMonth() + 1) +
          "-" +
          newData.getDate();
          valueTime = this.bzgs(valueTime)
          var arr = []
          for (let i = 0; i < this.multipleSelection.length; i++) {
            arr.push(
              {
                id:this.multipleSelection[i].id,
                specialApprovalDeadline:valueTime,
                payDeadline:this.multipleSelection[i].payDeadline,
              }
            )
          }
          var val = {
            type:'array',
            arr:arr
          }
          this.showTag2 = false
          this.$emit('speciaChange', val)
          this.id = ''
          this.plTime = ''
      }
    },
    // 
    statusChange(obj,TF){
      this.showTag1 = false
      if(this.isArrayFn(obj)){ // 是数组
        if(TF){
          var object = {
            type: 3,
            obj:obj,
            lx:'Array'
          }
        }else{
          var object = {
            type: 0,
            obj:obj,
            lx:'Array'
          }
        }
      }else{
        if(TF){
          var object = {
            type: 3,
            obj:obj,
            lx:'object'
          }
        }else{
          var object = {
            type: 0,
            obj:obj,
            lx:'object'
          }
        }
      }
      this.$emit('changUserObj', object)
    },
    // 判断是否是数组
    isArrayFn(value){
      if (typeof Array.isArray === "function") {
        return Array.isArray(value);
      }else{
        return Object.prototype.toString.call(value) === "[object Array]";
      }
    },

    // 批量设置截止日期
    changeDialogS(){
      // for (let i = 0; i < this.multipleSelection.length; i++) {
      //   this.multipleSelection[i].
      // }
      this.DogShow = 1
      var newData = new Date()
      var valueTime = newData.getFullYear() + "-" + (newData.getMonth() + 1) + "-" + newData.getDate()
      this.payDeadlineDate = this.bzgs(valueTime)
    },
    // 页码跳转
    handleCurrent (val) {
      // this.rowSelect()
      this.multipleSelection = []
      this.$emit('currentChange', val)
    },
    // 展示条数
    handleSize (val) {
      this.multipleSelection = []
      this.$emit('sizeChange', val)
    },
    // 导出列表
    dcButton () {
      console.log(this.multipleSelection.length);
      if(this.multipleSelection.length === 0){
        var val = {
          obj:this.multipleSelection
        }
      }else{
        var val = {
            obj:this.multipleSelection
          }
      }
      this.$emit('dcButton',val)
      // this.multipleSelection = []
    },
    dcButton2 () {
        var val = {
          obj:this.multipleSelection
        }
      this.$emit('dcButton', val)
      // this.multipleSelection = []
    },
    daochu(Arr){
      var newArr = []
      Arr.forEach(item=>{
        newArr.push(item.id)
      })
      var json = {
          newArr
        }
        this.$http.post(this.$service.overDueOrderExportList, newArr,{
            responseType: 'arraybuffer'
          }).then(res=>{
            let enc = new TextDecoder("utf-8");
            let uint8_msg = new Uint8Array(res);  // 也可能是res.data
            let str=enc.decode(uint8_msg);
            if(str.indexOf("code")>-1) {
                    let copyStr = JSON.parse(str)
                    if(copyStr.code == 200) {

                    }
                    else {
                      this.$message.error(copyStr.message)
                      return
                    }
            }
            const aLink = document.createElement("a");
            let blob = new Blob([res], {
              type: "application/vnd.ms-excel"
            })
            aLink.href = URL.createObjectURL(blob)
            aLink.setAttribute('download', '超期订单列表' + '.xlsx') // 设置下载文件名称
            aLink.click()
            document.body.appendChild(aLink)
        })
    }
    
  }
}
</script>
<style lang="less" scoped>
.column-line-itemL{
  display: inline-block;
  margin-right: 16px;
}
/deep/.el-table td{
    text-align: center;
}
/deep/.el-table th{
    text-align: center;
}
/deep/.el-dialog__footer{
    padding-bottom: 20px;
}
// /deep/.dialog1{
//   position: relative;
// }
/deep/.dialog1 .el-dialog__header .el-dialog__title{
  font-weight: 800;
}
/deep/.dialog1 .buttonDC{
  position: absolute;
  top: 16px;
  left: 188px;
  font-size: 15px;
  color: #169BD5;
  font-weight: 800;
  cursor: pointer;
}
.bottomDiv{
  width: 100%;
  height: auto;
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
  background: #FFFFFF;
}
/deep/.el-dialog__body{
  .tab1,.tab5{
    .el-input{
        width: 300px;
    }
  }
  .tab2{
    width: 150px;
  }
  .tab3,.tab4{
    width: 150px;
  }
}
  .dcButton{
    width: 93px;
    height: 27px;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(121, 121, 121, 1);
    color: #2273CB;
    font-size: 13px;
    text-align: center;
    line-height: 27px;
    border-radius: 3px;
    cursor: pointer;
  }
  .is-selected {
  color: #f3f6f9;
  background: #1989fa;
}
.is-selecteds {
  cursor: not-allowed;
  color: #c0c4cc;
}
/deep/.el-table__body .el-table__row  td{
    border-right: 1px solid rgb(215, 210, 210) !important;
    border-bottom: 1px solid rgb(215, 210, 210) !important;
  }
  /deep/ .el-table__body tr:hover>td {
  background-color: #CCC !important;
}
</style>
