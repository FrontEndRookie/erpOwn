<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" size="medium" class="demo-form-inline" label-position="left">
        <div class="content-search-normal" style="position:relative">
          <div style="position:absolute;right:10px;top:10px">
              <div style="cursor:pointer;display:inline-block;" @click="shiftSelectControl">
            <img v-if="selectControl"  src="../../assets/doubleArrowUp.png" alt="" style="width:30px;height:30px;margin:0 0 18px 0;transform:translateY(7px)">
            <img v-if="!selectControl" src="../../assets/doubleArrowDown.png" alt="" style="width:30px;height:30px;margin:0 0 18px 0;transform:translateY(7px)">
          </div>
          </div>
          <el-form-item label="订单号:" class="formItem">
            <el-input v-model="orderNo" style="width: 200px;" size="medium" :maxlength="inputMax" clearable
                      placeholder="请输入订单号"></el-input>
          </el-form-item>

          <el-form-item label="运单号:" class="formItem">
            <el-input v-model="waybillNo" style="width: 210px;" size="medium"  clearable
                      placeholder="请输入运单号"></el-input>
          </el-form-item>
         <el-form-item label="财务系列号:">
            <el-input
              v-model="financialSeriesNo"
              style="width: 180px"
              @change="setLimit($event)"
              size="medium"
              maxlength="12"
              clearable
              placeholder="请输入财务系列号"
            ></el-input>
          </el-form-item>
          <el-form-item label="应付对象:" class="formItem">
             <el-select
              v-model="reconciliationUnit"
              placeholder="请输入应付对象"
              :remote-method="expenseUnitMethod"
              clearable
              remote
              filterable
              reserve-keyword
              style="width: 235px"
            >
              <el-option
                v-for="(item, index) in expenseUnitArray"
                :key="index"
                :value="item.agentName"
                :label="item.agentName"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="核销状态:" class="formItem" >
            <el-select v-model="rcvWriteOffStatus" placeholder="核销状态" multiple collapse-tags @change="dealAllChange"
                       :loading="loading"
                       clearable filterable remote reserve-keyword style="width: 230px;">
              <el-option
                v-for="item in rcvWriteOffStatusOpt"
                :key="item.value"
                :label="item.rcvWriteOffStatus"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="核销日期:"
            style="width: 465px"
            v-if="this.selectControl"
          >
            <el-date-picker
              style="width: 185px"
              value-format="yyyy-MM-dd"
              v-model="startWriteOffTime"
              type="date"
              @change="getCurrentChange"
              :picker-options="pickerOptionsStartTwo"
              placeholder="选择日期"
            >
            </el-date-picker
            >
            -
            <el-date-picker
              style="width: 185px"
              value-format="yyyy-MM-dd"
              v-model="endWriteOffTime"
              @change="getCurrentChange"
              type="date"
              :picker-options="pickerOptionsEndTwo"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
           <el-form-item
            label="付款日期:"
            style="width: 445px"
           
            v-if="this.selectControl"
          >
            <el-date-picker
              style="width: 175px"
              value-format="yyyy-MM-dd"
              v-model="startPayTime"
              @change="getCurrentChange"
              type="date"
              :picker-options="pickerOptionsStartOne"
              placeholder="选择日期"
            >
            </el-date-picker
            >
            -
            <el-date-picker
              style="width: 175px"
              value-format="yyyy-MM-dd"
              v-model="endPayTime"
              @change="getCurrentChange"
              type="date"
              :picker-options="pickerOptionsEndOne"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="开户行:" class="formItem" v-if="this.selectControl"> 
            <el-input v-model="accountBank" style="width: 200px;" size="medium" :maxlength="inputMax" clearable
                      placeholder="请输入开户行"></el-input>
          </el-form-item>
          <el-form-item label="户名:" class="formItem"  v-if="this.selectControl">
            <el-input v-model="accountName" style="width: 200px;" size="medium" :maxlength="inputMax" clearable
                      placeholder="请输入户名"></el-input>
          </el-form-item>
          <el-form-item label="付款方式:" class="formItem" v-if="this.selectControl">
            <el-select v-model="writeOffWay" placeholder="付款方式" :loading="loading" clearable filterable remote
              @change="getCurrentChange"
               reserve-keyword style="width: 180px;">
              <el-option
                v-for="item in writeOffWayOpt"
                :key="item.id"
                :label="item.writeOffWay"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结算方式:" class="formItem" v-if="this.selectControl">
            <el-select v-model="payWay" placeholder="结算方式" :remote-method="agentMethod" :loading="loading" clearable
              @change="getCurrentChange"
              filterable 
              remote 
              reserve-keyword 
              style="width: 180px;">
              <el-option
                v-for="item in payWayOpt"
                :key="item.value"
                :label="item.payWay"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否作废:">
            <el-select
              @change="getCurrentChange"
              v-model="fettle"
              style="width: 120px"
              clearable
            >
              <el-option
                v-for="item in fettleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请选择分公司">
            <dc-select
              v-model="orgId"
              placeholder="订单所属公司"
              clearable
              filterable
            >
              <el-option
                v-for="item in sysOrgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </dc-select>
          </el-form-item>
          <div class="operateButton">
            <el-button
              @click="searchClick"
              size="mini"
              type="primary"
              icon="el-icon-search"
              v-auth="['107000_B']"
            >查询
            </el-button
            >
            <el-button @click="restClick" size="mini" type="primary"
            >清空
            </el-button
            >
          </div>
<!--          <div class="operateButton">
            <el-button size='mini' type="primary" @click="exportList">导出列表</el-button>
            <el-button @click="drawer = true" type="primary" size="mini"
            >选择表格列
            </el-button>
          </div>-->
        </div>
      </el-form>
      <el-tabs class="nth9_class" v-model="woStatus" type="border-card" @tab-click="tabClickData">
        <el-tab-pane :label="'可操作'+'('+countAuth+')'" name="0">
          <Table
            ref="child"
            :tableData='tableData'
            :checkedTable="checkedTable"
            :selectionTable="true"
            :pageSkipChecked="pageSkipChecked"
            :columns='columns'
            :operation='operation'
            :total='total'
            :currentPage='pageNum'
            :pageSize='pageSize'
            @sizeChange='handleSizeChange'
            @showWOLogs='showWOLogs'
            @showFees='showFees'
            @handleSelect='handleSelect'
            @currentChange='handleCurrentChange'>
          </Table>
        </el-tab-pane>
        <el-tab-pane :label="'业务修改中'+'('+countNoAuth+')'" name="1">
          <Table
            ref='childS'
            :tableData='tableData'
            :checkedTable='checkedTable'
            :selectionTable="true"
            :pageSkipChecked="pageSkipChecked"
            :columns='columns'
            :operation='operation'
            :total='total'
            :currentPage='pageNum'
            :pageSize='pageSize'
            @sizeChange='handleSizeChange'
            @showWOLogs='showWOLogs'
            @handleSelect='handleSelect'
            @showFees='showFees'
            @currentChange='handleCurrentChange'>
          </Table>
        </el-tab-pane>
        <el-tab-pane :label="'异常'+'('+countErr+')'" name="2">
          <Table
            ref='childSs'
            :tableData='tableData'
            :checkedTable='checkedTable'
            :selectionTable="true"
            :pageSkipChecked="pageSkipChecked"
            :columns='columns'
            :operation='operation'
            :total='total'
            :currentPage='pageNum'
            @handleSelect='handleSelect'
            :pageSize='pageSize'
            @sizeChange='handleSizeChange'
            @showWOLogs='showWOLogs'
            @showFees='showFees'
            @currentChange='handleCurrentChange'>
          </Table>
        </el-tab-pane>
      </el-tabs>

      <el-drawer
        title="表格列控制"
        :visible.sync="drawer"
        size="200px"
        :direction="direction"
      >
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          style="margin: 0 0 20px 20px"
        >全选
        </el-checkbox
        >
        <el-checkbox-group v-model="checkedTable" :min="0" :max="20">
          <el-checkbox
            v-for="choose in tableOptions"
            :label="choose"
            :key="choose"
            style="display: block; margin-left: 20px"
          >{{ choose }}
          </el-checkbox
          >
        </el-checkbox-group>
      </el-drawer>
      <div style="display:flex;justify-content:space-between ;background: rgb(255, 255, 255)">
        <div>
          <el-button size="mini" class="pageSkip">
            <el-checkbox v-model="pageSkipChecked" @change="selectAllTable">跨页全选</el-checkbox>
          </el-button>
          <el-button type="primary" size="mini" @click="getStatistData">数据统计</el-button>
       
        </div>


        <div style="display:flex;">
          <div style="widht:100%;margin:5px 10px 0 0">
            <el-button size='mini' type="primary" @click="exportList" style="height:28px;margin-top:19px">导出列表</el-button>
            <el-button @click="drawer = true" type="primary" size="mini" style="height:28px;margin-top:19px"
            >选择表格列
            </el-button>
          </div>

          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="pageSize"
            :current-page="pageNum"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            style="text-align: right;padding: 19px 30px 18px 0;background: #fff">
          </el-pagination>
        </div>
        
      </div>
         <div style="display:flex;font-size:12px;background: rgb(255, 255, 255);padding-bottom:15px" v-if="statistDataShow">
            <div class="statist">
              <div>应付总金额:{{ statistData.totalApCny }}</div>
              <div  style="white-space:pre-wrap;display:flex"
                   class="statists">
                   <div>应付原币:</div>
                   <div v-html="dealOrgnS(statistData.totalApOrgn)"></div></div>
            </div>
            <div class="statist">
              <div>已核销总金额:{{ statistData.totalApWoCny }}</div>
              <div style="white-space:pre-wrap;display:flex"
                   class="statists">
                   <div>已核销原币:</div>
                   <div v-html="dealOrgnS(statistData.totalApWoOrgn)" ></div></div>
            </div>
            <div class="statist">
              <div>未核销总金额:{{ statistData.totalApUnwoCny }}</div>
              <div  style="white-space:pre-wrap;display:flex"
                   class="statists">
                   <div>未核销原币:</div>
                   <div v-html="dealOrgnS(statistData.totalApUnwoOrgn)"></div></div>
            </div>
            <div class="statist">
              <div>利润:{{ statistData.orderProfit?statistData.orderProfit:0 }}</div>
            </div>
            <div class="statist" style="color:red;font-size:20px" v-if="statistData.hasAbNormal">
              <div>存在异常订单！</div>
            </div>
          </div>
    </div>
    <el-dialog title="应付核销操作记录" :visible.sync="logDialogVisible" width="80%">
      <Table
        :tableData='logData'
        :selectionTable="false"
        :columns='columns1'
        :operation='operation1'
        :select=1
        :currentPage='pageNum'
        :pageSize='pageSize'
        @sizeChange='handleSizeChange'
        @revoke='revoke'
        @currentChange='handleCurrentChange'>
      </Table>
    </el-dialog>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="80%">
      <td style="font-size: 18px;font-weight: 100;color: #169BD5;padding: 10px 0px 10px 20px;">{{ orderNoTab }}</td>
      <td style="font-size: 18px;font-weight: 100;color: #333333;padding: 10px 20px 10px 0px;">订单详情</td>
      <Table
        :tableData='orderData'
        :selectionTable="false"
        :columns='columns2'
        :select=1
        :operation='operation'
        :currentPage='pageNum'
        :pageSize='pageSize'
        @sizeChange='handleSizeChange'
        @currentChange='handleCurrentChange'>
      </Table>

      <td style="font-size: 18px;font-weight: 100;color: #169BD5;padding: 10px 0px 10px 20px;">{{ orderNoTab }}</td>
      <td style="font-size: 18px;font-weight: 100;color: #333333;padding: 10px 20px 10px 0px;">应付账单</td>
      <Table
        :tableData='arData'
        :selectionTable="false"
        :columns='columns3'
        :select=1
        :operation='operation'
        :currentPage='pageNum'
        :pageSize='pageSize'
        @sizeChange='handleSizeChange'
        @currentChange='handleCurrentChange'>
      </Table>

      <div class="finance-table-price">
        <div>账单合计：{{ getOrgn(this.totalApOrgn) }}</div>
        <div>人民币合计：￥{{ this.totalApCny }}</div>
        <div>结算方式:{{this.dialogPayWay == 0?'付款买单':this.dialogPayWay == 1?'月结买单':''}}</div>
      </div>
      <div style="font-size: 18px;font-weight: 100;color: #333;padding: 10px 20px 10px 20px;">修改记录</div>
      <Table
        :tableData='orderLogs'
        :columns='columns4'
        :selectionTable="false"
        :select=1
        :operation='operation'
        :currentPage='pageNum'
        :pageSize='pageSize'
        @sizeChange='handleSizeChange'
        @currentChange='handleCurrentChange'>
      </Table>

    </el-dialog>
  </div>
</template>

<script>
import Table from '@/components/receivableStatisticsDetailsTable'
import {toData} from '@/util/assist'
import axios from "axios";

export default {
  data() {
    return {
      currencyArray: this.$store.getters.getCurrencyFinance,
      orgId: '',
      sysOrgs: [],
      fettleList:[{id:'',name:"全部"},{id:0,name:"正常"},{id:1,name:'作废'}],
      dialogPayWay:'',
      dialogTitle:'',
      selectControl:false,
      dialogFormVisible: false,
      logDialogVisible: false,
      statistDataShow: false,
      //表格控制列drawer
      drawer: false,
      direction: "rtl",
      isIndeterminate: true,
      checkAll: false,
      //table
      tableData: [],
      arData: [],
      orderLogs: [],
      orderProfit: 0,
      fettle:'',
      pageSkipChecked: false,
      orderData: [
        {
          customerName: "",
          agentName: "",
          airCompanyCode: "",
          pol: "",
          pod: "",
          cargoName: "",
          inboundPiece: "",
          inboundCbm: "",
          inboundWeight: "",
          inboundVwr: "",
          pscsName: "",
          principalName: "",
          mscsName: "",

        }
      ],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      financialSeriesNo:"",
      // 列
      columns: [
        {label: 'id', prop: "id", show: false, width: '50'},
        {label: '财务系列号', prop: 'financialSeriesNo', show: true, width: '150'},
        {label: '订单号', prop: 'orderNo', show: true, width: '150'},
        {label: '运单号', prop: 'waybillNo', show: true, width: '150'},
        {label: '应付对象', prop: 'expenseUnitName', show: true, width: '250'},
        {label: '应付费用名称', prop: 'expenseName', show: true, width: '100'},
        {label: '应付金额', show: true, width: '100'},
        {label: '已对账金额', prop: 'payCheckAmounts', show: true, width: '100'},
        {label: '核销金额', prop: 'writeOffAmount', show: true, width: '100'},
        {label: '开户行', prop: 'accountBank', show: true, width: '100'},
        {label: '户名', prop: 'accountName', show: true, width: '100'},
        {label: '银行账户', prop: 'bankAccount', show: true, width: '200'},
        {label: '汇率', prop: 'exchangeRate', show: true, width: '70'},
        {label: '付款方式', prop: 'writeOffWay', show: true, width: '100'},
        {label: '付款日期', prop: 'legCount', show: true, width: '100'},
        {label: '核销时间', prop: 'writeOffTime', show: true, width: '150'},
        {label: '结算方式', prop: 'payWay', show: true, width: '100'},
        {label: '核销次数', prop: 'payWriteOffCount', show: true, width: '100'},
        {label: '核销状态', prop: 'payWriteOffStatus', show: true, width: '130'},
      ],
      columns1: [
        {label: '序号', show: true, width: '50'},
        {label: '订单号', prop: 'orderNo', show: true, width: '100'},
        {label: '运单号', prop: 'waybillNo', show: true, width: '100'},
        {label: '应付对象', prop: 'expenseUnitName', show: true, width: '160'},
        {label: '应付金额', prop: 'totalArCny', show: true, width: '100'},
        {label: '记录', prop: 'payLog', show: true, width: '500'},
        {label: '操作', prop: 'revoke', show: true, width: '100'},

      ],
      columns2: [
        {label: '订舱客户', prop: 'customerName', show: true, width: '100'},
        {label: '代理上家', prop: 'agentName', show: true, width: '100'},
        {label: '航司', prop: 'airCompanyCode', show: true, width: '50'},
        {label: '起运港', prop: 'pol', show: true, width: '60'},
        {label: '目的港', prop: 'pod', show: true, width: '60'},
        {label: '货物信息', prop: 'cargoInfo', show: true, width: '80'},
        {label: '操作人员', prop: 'operator', show: true, width: '80'},
      ],
      columns3: [
        {label: '序号', show: true, width: '50'},
        {label: '费用名称', prop: 'expenseName', show: true, width: '100'},
        {label: '付款单位', prop: 'expenseUnitName', show: true, width: '150'},
        {label: '单价', prop: 'price', show: true, width: '100'},
        {label: '数量', prop: 'quantity', show: true, width: '100'},
        {label: '币种', prop: 'currency', show: true, width: '100'},
        {label: '原币合计', prop: 'totalOrgn', show: true, width: '100'},
        {label: '汇率', prop: 'exchangeRateNum', show: true, width: '100'},
        {label: '人民币合计', prop: 'totalCny', show: true, width: '100'},
        {label: '备注', prop: 'remark', show: true, width: '50'}
      ],
      columns4: [
        {label: '操作类型', prop: 'operationType', show: true, width: '150'},
        {label: '说明', prop: 'operationInfo', show: true, width: '100'},
        {label: '操作时间', prop: 'createTime', show: true, width: '150'},
        {label: '操作人', prop: 'operator', show: true, width: '100'}
      ],
      // 操作
      operation: {
        show: false,
        label: '操作',
        width: '180',
        options: [
          {label: '撤销', method: 'routeEdit'}
        ]
      },
      operation1: {
        show: false,
        label: '操作',
        width: '180',
        options: [
          {label: '撤销', method: 'routeEdit'}
        ]
      },
      orderNo: '',
      orderNoTab: '',
      select: 0,
      waybillNo: '',
      reconciliationUnit: '',
      accountBank: '',
      accountName: '',
      writeOffWay: '',
      writeOffWayOpt: [
        {
          writeOffWay: '应付对冲',
          value: '1'
        },
        {
          writeOffWay: '银行转账',
          value: '0'
        },
      ],
      startPayTime: null,
      endPayTime: null,
      startWriteOffTime: null,
      endWriteOffTime: null,
      // 限制结束日期大于开始日期
      pickerOptionsStartOne: {
        disabledDate: time => {
          let endDateVal = this.endPayTime
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      pickerOptionsEndOne: {
        disabledDate: time => {
          let beginDateVal = this.startPayTime
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime()-8.64e7
          }
        }
      },
      pickerOptionsStartTwo: {
        disabledDate: time => {
          let endDateVal = this.endWriteOffTime
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      pickerOptionsEndTwo: {
        disabledDate: time => {
          let beginDateVal = this.startWriteOffTime
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime()-8.64e7
          }
        }
      },
      payWay: '',
      rcvWriteOffStatus: '',
      payWayOpt: [
        //0=付款买单,1=月结买单
        {
          payWay: '全部',
          value: ''
        },
        {
          payWay: '付款买单',
          value: '0'
        },
        {
          payWay: '月结买单',
          value: '1'
        },
      ],
      rcvWriteOffStatusOpt: [
        //应收核销状态 0=未对账未核销,1=部分对账未核销,2=已对账未核销,3=未对账部分核销,4=部分对账部分核销,5=已对账部分核销,6=未对账已核销,7=部分对账已核销,8=已对账已核销
        {
          rcvWriteOffStatus: '全部',
          value: ''
        },
        {
          rcvWriteOffStatus: '未对账未核销',
          value: '0'
        },
        {
          rcvWriteOffStatus: '部分对账未核销',
          value: '1'
        },
        {
          rcvWriteOffStatus: '已对账未核销',
          value: '2'
        },
        /*    {
              rcvWriteOffStatus: '未对账部分核销',
              value: '3'
            },*/
        {
          rcvWriteOffStatus: '部分对账部分核销',
          value: '4'
        },
        {
          rcvWriteOffStatus: '已对账部分核销',
          value: '5'
        },
        /*     {
               rcvWriteOffStatus: '未对账已核销',
               value: '6'
             },
             {
               rcvWriteOffStatus: '部分对账已核销',
               value: '7'
             },*/
        {
          rcvWriteOffStatus: '已对账已核销',
          value: '8'
        },
      ],
      statistData: {
        hasAbNormal: true,
        totalApCny: 0,
        totalApOrgn: '',
        totalApUnwoCny: 0,
        totalApUnwoOrgn: '',
        totalApWoCny: 0,
        totalApWoOrgn: '',
        orderProfit:''
      },
      woStatus: '0',
      totalArOrgn: '',
      totalArCny: 0,
      logData: [{
        log: [],
        orderNo: '',
        id: '',
        waybillNo: '',
        reconciliationUnit: '',
        totalArCny: '',

      }],
      checkedTable: [
        '财务系列号',
        "订单号",
        "运单号",
        "应付对象",
        "应付费用名称",
        "应付金额",
        "已对账金额",
        "核销金额",
        "开户行",
        "户名",
        "银行账户",
        "汇率",
        "付款方式",
        "付款日期",
        "核销时间",
        "结算方式",
        "核销次数",
        "核销状态",
      ],
      tableOptions: [
        '财务系列号',
        "订单号",
        "运单号",
        "应付对象",
        "应付费用名称",
        "应付金额",
        "已对账金额",
        "核销金额",
        "开户行",
        "户名",
        "银行账户",
        "汇率",
        "付款方式",
        "付款日期",
        "核销时间",
        "结算方式",
        "核销次数",
        "核销状态",
      ],
      countNoAuth: 0,
      countAuth: 0,
      countErr: 0,
      copySelectJSON:{},
      expenseUnitArray:''
    }
  },
  mounted() {
    this.findThisUserAndBranchOrg()
    this.initData()
    this.initAgentList()
    this.rcvWriteOffStatus = [""]
    this.expenseUnitMethod()
  },
  methods: {
    async findThisUserAndBranchOrg() {
      const {
        data: { data },
      } = await this.$api.findThisUserAndBranchOrg();
      this.sysOrgs = data.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    },
    expenseUnitMethod(agentName){
      if (!agentName) {
        agentName = "";
      }
      var data = {
        agentName: agentName,
        sceneFlag: 0,
      };
      this.$http.post(this.$service.agentList, data).then((data) => {
        if (data.code == 200) {
          this.expenseUnitArray = data.data.records;
        }
      });
    },
     setLimit(e){
      this.financialSeriesNo = e.replace(/[\W]/g,'')
    },
    shiftSelectControl(){
      this.selectControl = !this.selectControl
    },
    //表格选择列显示drawer -全选
    handleCheckAllChange(val) {
      this.checkedTable = val ? this.tableOptions : [];
      this.isIndeterminate = false;
    },
    //tab切换
    tabClickData() {
      this.pageNum = 1
      this.pageSkipChecked = false
      this.selectAllTable()
      this.initData()
    },
    selectAllTable() {
      this.$refs.child.selectAllTable(this.pageSkipChecked, this.tableData);
      this.$refs.childS.selectAllTable(this.pageSkipChecked, this.tableData);
      this.$refs.childSs.selectAllTable(this.pageSkipChecked, this.tableData);
    },
    dealOrgnS(orgn, extraWord) {
      if (!orgn) {
        return "¥ "+0;
      }
      orgn = JSON.parse(orgn);
      var totalOrgn = "";
      if(orgn && (orgn.length > 0)){
        for (var i = 0; i < orgn.length; i++) {
          var obj = this.currencyArray.filter((item)=>{return (item.id == orgn[i].currency)})
          totalOrgn = totalOrgn + obj[0]["symbol"] + Number(orgn[i].amount).toLocaleString('en-US')
          if(i < (orgn.length - 1)){
            totalOrgn = totalOrgn + '\n'
          }
        }
      }else{
        totalOrgn = "¥ " +0
      }
      return (extraWord?extraWord+":":"") +totalOrgn;;
    },
    showFees(row) {
      this.dialogTitle = row.orderNo
      this.dialogFormVisible = true;
      this.$http.post(this.$service.search + "?orderId=" + row.orderId).then(data => {
        if (data.code == 200) {
          this.arData = data.data.arOrderPriceList
          this.orderNoTab = data.data.orderNo
          this.orderLogs = data.data.orderPresentLogs
          this.totalApOrgn = data.data.totalApOrgn
          this.totalApCny = data.data.totalApCny.toLocaleString('en-US')
          this.orderProfit = data.data.orderProfit
          this.dialogPayWay = data.data.payWay
          this.orderId = data.data.orderId
          this.orderData[0].customerName = data.data.customerName
          this.orderData[0].agentName = data.data.agentName
          this.orderData[0].airCompanyCode = data.data.airCompanyCode
          this.orderData[0].pol = data.data.pol
          this.orderData[0].pod = data.data.pod
          this.orderData[0].cargoName = data.data.cargoName
          this.orderData[0].inboundPiece = data.data.inboundPiece
          this.orderData[0].inboundCbm = data.data.inboundCbm
          this.orderData[0].inboundWeight = data.data.inboundWeight
          this.orderData[0].inboundVwr = data.data.inboundVwr
          this.orderData[0].pscsName = data.data.pscsName
          this.orderData[0].principalName = data.data.principalName
          this.orderData[0].mscsName = data.data.mscsName
          this.orderData[0].customerResponsibleName = data.data.customerResponsibleName

        } else {
          this.$message.error(data.message)
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    exportList() {
      let idsResult = []
      if(this.detailTabs && this.detailTabs.length>0) {
        let ids = this.detailTabs.map(item=>item.ids)
        ids.forEach(item=>{
          idsResult.push(...JSON.parse(item))
        })
      }else {
        return this.$message.error("请勾选数据后进行操作")
      }
      let json = {
        overPageCheck: this.overPageCheck,
        rcvIds: this.rcvIds,
        orderNo: this.orderNo.trim(),
        waybillNo: this.waybillNo.replace(/-/g,''),
        ids:idsResult,
        expenseUnitName: this.reconciliationUnit,
        accountBank: this.accountBank,
        accountName: this.accountName,
        startPayTime: this.startPayTime,
        endPayTime: this.endPayTime,
        startWriteOffTime: this.startWriteOffTime,
        endWriteOffTime: this.endWriteOffTime,
        writeOffWay: this.writeOffWay,
        payWay: this.payWay,
        payWriteOffStatusList: this.rcvWriteOffStatus.length == 0 || this.rcvWriteOffStatus.indexOf("") != -1 ? null : this.rcvWriteOffStatus,
        woStatus: this.woStatus,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orgId: this.orgId,
      }
        if(this.pageSkipChecked) {
        delete json.ids
      }
      axios.post(this.$service.exportWriteOffExcel,json , {
        responseType: 'arraybuffer'
      }).then((res) => {
        let enc = new TextDecoder("utf-8");
        let uint8_msg = new Uint8Array(res);
        let str = enc.decode(uint8_msg);
        if (str.indexOf("code") !== -1) {
          let data = JSON.parse(enc.decode(uint8_msg));
          this.$message.error(data.message)
          return;
        }
        // if(res.status == "200") {
        const aLink = document.createElement("a");
        let blob = new Blob([res], {
          type: "application/vnd.ms-excel"
        })
        aLink.href = URL.createObjectURL(blob)
        aLink.setAttribute('download', '应付核销明细列表' + '.xlsx') // 设置下载文件名称

        aLink.click()
        document.body.appendChild(aLink)
      })
    },

    handleSelect(val) {
      this.detailTabs = val;
      // console.log(this.detailTabs)
    },
    //代理公司
    initAgentList(agentName) {
      if (!agentName) {
        agentName = ''
      }
      var data = {
        agentName: agentName,
        sceneFlag: 0,
      }
      this.$http.post(this.$service.agentList, data).then((data) => {
        this.loading = false
        if (data.code == 200) {
          this.agentOpt = data.data.records
        }
      })
    },
    showWOLogs(row) {
      this.logDialogVisible = true;
    
      var data = {
        ids: row.ids.substring(1, row.ids.length - 1).replaceAll(" ", "")
      }
      
      
      this.$http.post(this.$service.searchRecords, data, {
        headers: {
          diffFlag: 2
        }
      }).then(data => {
        if (data.code == 200) {
          this.logData[0].log = data.data
          this.logData[0].id = row.id
          this.logData[0].orderNo = row.orderNo
          this.logData[0].waybillNo = row.waybillNo
          this.logData[0].expenseUnitName = row.expenseUnitName
          this.logData[0].totalArCny = row.totalArCny
          this.logData[0].ids = row.ids

          /*        for(var i=0;i<data.data.length;i++){
                    var log="操作"+(i+1)+"："+data.data[i].writeOffOperator+"核销该订单,核销金额："+data.data[i].writeOffAmount+"CNY" +data.data[i].writeOffTime
                  }*/

        } else {
          this.$message.error(data.message)
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    // getOrgn(orgn) {
    //   if (!orgn) {
    //     return;
    //   }
    //   orgn = JSON.parse(orgn);
    //   var totalOrgn = ''
    //   var value1 = 0
    //   var value2 = 0
    //   var value3 = 0
    //   var value4 = 0
    //   var value5 = 0
    //   // HK$ $ € ￡
    //   for (var i = 0; i < orgn.length; i++) {
    //     if (orgn[i].currency == '1') {
    //       value1 += orgn[i].amount
    //     } else if (orgn[i].currency == '2') {
    //       value2 += orgn[i].amount
    //     } else if (orgn[i].currency == '3') {
    //       value3 += orgn[i].amount
    //     } else if (orgn[i].currency == '4') {
    //       value4 += orgn[i].amount
    //     } else if (orgn[i].currency == '5') {
    //       value5 += orgn[i].amount
    //     }
    //   }
    //   totalOrgn = ''

    //   totalOrgn += value1 || value1 == 0 ?"¥ " +  value1.toLocaleString('en-US')  + '+' : ''
    //   totalOrgn += value2 ? "HK$ "+value2.toLocaleString('en-US')  + '+' : ''
    //   totalOrgn += value3 ? "$ " + value3.toLocaleString('en-US') + '+' : ''
    //   totalOrgn += value4 ? "€ " + value4.toLocaleString('en-US')  + '+' : ''
    //   totalOrgn += value5 ? "￡ " + value5.toLocaleString('en-US') : ''
    //   totalOrgn = totalOrgn.substring(0, totalOrgn.length - 1)
    //   return totalOrgn;
    // },
    getOrgn(orgn) {
      if (!orgn) {
        return;
      }
      orgn = JSON.parse(orgn);
      var totalOrgn = "";
      if(orgn && (orgn.length > 0)){
        for (var i = 0; i < orgn.length; i++) {
          var obj = this.currencyArray.filter((item)=>{return (item.id == orgn[i].currency)})
          totalOrgn = totalOrgn + obj[0]["symbol"]+ " " + Number(orgn[i].amount).toLocaleString('en-US')
          if(i < (orgn.length - 1)){
            totalOrgn = totalOrgn + '+'
          }
        }
      }
      return totalOrgn;
    },
    checkSplit(value) {

      let splitChars = [",", "，", " ", "、", "\\n", "\\r\\n", "/",'\\t'];
      for (let i = 0; i < splitChars.length; i++) {
        value = value.replaceAll(splitChars[i], ",");
      }
      return value.split(",");


    },
    //航线列表
    initData() {
      let orderNoFlag=this.checkSplit(this.orderNo);
      let waybillNoFlag=this.checkSplit(this.waybillNo);
      var json = {
        fettle:this.fettle,
        orderNo: orderNoFlag.length>1 ? null : this.orderNo,
        orderArrNosList: orderNoFlag.length>1 ? orderNoFlag : null,
        waybillNoList: waybillNoFlag.length>1 ? waybillNoFlag.map(i=>i.replace(/-/g,'')) : null,
        waybillNo: waybillNoFlag.length>1 ? null : this.waybillNo.replace(/-/g,''),
        expenseUnitName: this.reconciliationUnit,
        financialSeriesNo:this.financialSeriesNo,
        accountBank: this.accountBank,
        accountName: this.accountName,
        startPayTime: this.startPayTime,
        endPayTime: this.endPayTime,
        startWriteOffTime: this.startWriteOffTime,
        endWriteOffTime: this.endWriteOffTime,
        writeOffWay: this.writeOffWay,
        payWay: this.payWay,
        payWriteOffStatusList: this.rcvWriteOffStatus.length == 0 || this.rcvWriteOffStatus.indexOf("") != -1 ? null : this.rcvWriteOffStatus,
        woStatus: this.woStatus,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orgId: this.orgId,
      }
      return this.$http.post(this.$service.writeOffSearch, json).then(data => {
        if (data.code == 200) {
          this.total = this.woStatus == 0 ? data.data.countAuth : this.woStatus == 1 ? data.data.countNoAuth : data.data.countErr
          /*            data.data.page.records.forEach(x=>{
                        var writeOffList=[]
                      if (x.writeOffList!=null){
                        x.writeOffList.forEach(y=>{
                          if (y.payWay!=null){
                            writeOffList.push(y)
                          }
                        })
                        x.writeOffList=writeOffList;
                      }
                      })*/
          this.tableData = data.data.page.records
          this.countNoAuth = data.data.countNoAuth
          this.countAuth = data.data.countAuth
          this.countErr = data.data.countErr
        } else {
          this.$message.error(data.message)
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    getSearchArgument(argument) {
      var result = ''
      argument.forEach(x => result += x + ',')
      result = result.substring(0, result.length - 1)
      return result
    },
    //航线列表
    revoke(index, id, row) {
      this.$confirm(`确定核销"操作${index + 1}"`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.post(this.$service.revokeRecords + "?id=" + id, {}, {
          headers: {
            diffFlag: 2
          }
        }).then(data => {
          if (data.code == 200) {
            // this.showWOLogs(row)
            this.logDialogVisible = false;
            this.initData()
            this.$message.success("撤销成功")
          } else {
            this.$message.error(data.message)
          }
        }).catch((e) => {
          console.log(e)
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    //查询
    async searchClick() {
      this.statistDataShow = false
      this.pageNum = 1
      await this.initData()
      this.pageSkipChecked = false
      this.selectAllTable()
    },
    //下拉框值改变直接查询
    getCurrentChange(){
      this.searchClick()
    },
    dealAllChange() {
      if (this.rcvWriteOffStatus.indexOf('') == this.rcvWriteOffStatus.length-1){
        this.rcvWriteOffStatus = ['']
      }
     else if (this.rcvWriteOffStatus.indexOf('') != -1&&this.rcvWriteOffStatus.length>1) {
        let index = this.rcvWriteOffStatus.indexOf("")
        this.rcvWriteOffStatus.splice(index,1)
      }
      this.searchClick()
    },
    //重置
    restClick() {
      this.orderNo = ''
      this.waybillNo = ''
      this.financialSeriesNo = ''
      this.reconciliationUnit = ''
      this.accountBank = ''
      this.accountName = ''
      this.startWriteOffTime = null
      this.endWriteOffTime = null
      this.startPayTime = null
      this.endPayTime = null
      this.writeOffWay = ''
      this.payWay = ''
      this.fettle = ''
      this.rcvWriteOffStatus = ['']
      // this.woStatus=''
      this.pageNum = 1
      this.pageSize = 10
      this.initData()

    },
   async handleCurrentChange(e) {
      this.pageNum = e
      await this.initData()
      this.selectAllTable()
    },
    handleSizeChange(e) {
      this.pageSize = e
      this.initData()
    },
    //数据统计按钮
    getStatistData() {
      if (this.statistDataShow) {
        this.statistDataShow = !this.statistDataShow
        return;
      }
      let idsResult = []
      if(this.detailTabs && this.detailTabs.length>0) {
        let ids = this.detailTabs.map(item=>item.ids)
        ids.forEach(item=>{
          idsResult.push(...JSON.parse(item))
        })
      }
      
      var json = {
        orderNo: this.orderNo,
        waybillNo: this.waybillNo.replace(/-/g,''),
        expenseUnitName: this.reconciliationUnit,
        accountBank: this.accountBank,
        accountName: this.accountName,
        startPayTime: this.startPayTime,
        endPayTime: this.endPayTime,
        startWriteOffTime: this.startWriteOffTime,
        endWriteOffTime: this.endWriteOffTime,
        writeOffWay: this.writeOffWay,
        payWay: this.payWay,
        ids:idsResult,
        payWriteOffStatusList: this.rcvWriteOffStatus.length == 0 || this.rcvWriteOffStatus.indexOf("") != -1 ? null : this.rcvWriteOffStatus,
        woStatus: this.woStatus,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orgId: this.orgId,
      }
      if(this.pageSkipChecked) {
        delete json.ids
      }
      this.$http.post(this.$service.dataStatistics, json).then(data => {
        if (data.code == 200) {

          this.statistData.hasAbNormal = data.data.hasAbNormal;
          this.statistData.totalApCny = data.data.totalApCny?data.data.totalApCny.toLocaleString('en-US'):0;
          this.statistData.totalApOrgn = data.data.totalApOrgn?data.data.totalApOrgn.toLocaleString('en-US'):0;
          this.statistData.totalApUnwoCny = data.data.totalApUnwoCny?data.data.totalApUnwoCny.toLocaleString('en-US'):0;
          this.statistData.totalApUnwoOrgn = data.data.totalApUnwoOrgn?data.data.totalApUnwoOrgn.toLocaleString('en-US'):0;
          this.statistData.totalApWoCny = data.data.totalApWoCny?data.data.totalApWoCny.toLocaleString('en-US'):0;
          this.statistData.totalApWoOrgn = data.data.totalApWoOrgn?data.data.totalApWoOrgn.toLocaleString('en-US'):0;
          this.statistData.orderProfit = data.data.orderProfit?data.data.orderProfit.toLocaleString('en-US'):0;
          this.statistDataShow = !this.statistDataShow
        } else {
          this.$message.error(data.message)
        }
      }).catch((e) => {
        console.log(e)
      })
    },

  },
  watch: {
    tableData(idx) {
      return idx
    }
  },
  components: {
    Table
  }
}
</script>


<style scoped lang="less">
@import url("../../assets/icon/iconfont.css");
/deep/.el-tabs--top .el-tabs__item.is-top:last-child{
  color:red;
  
}
/deep/.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active:last-child{
  color:red!important;

}
/deep/.el-tabs--border-card>.el-tabs__header .el-tabs__item:last-child:hover{
  color: red !important;
}
 .el-button--primary{
      width:100px;
      // text-align: center;
  }
/deep/ .pageSkip {
  padding: 3px 5px !important
}

.content-wrapper {
     width:100%;
  height: 95%;
  box-sizing: border-box;
  /*height: 100%;*/
  padding: 20px;
  overflow: hidden;
  background-color: #f3f6f9 !important;
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
.el-form {
  background-color: #FFF;
}

.el-form--inline .el-form-item {
  margin-bottom: 8px;
  // vertical-align: bottom;
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

.wrapper, .content {
  width: 100%;
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

.operateButton {
  display: flex;
  justify-content: center;
  margin-bottom: -10px;

  button {
    margin: 0px 10px 20px 10px;
  }
}
.statist {
  margin-left:15px;
  .statists {
    margin-top:10px;
  }
}
/deep/ .el-dialog {
  min-width: 480px;
  border-radius: 6px;
}
</style>
