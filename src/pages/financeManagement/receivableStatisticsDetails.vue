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
        <el-form-item label="订单号:">
            <el-input v-model="orderNo" style="width: 170px;" size="medium" :maxlength="inputMax" clearable
                      placeholder="请输入订单号"></el-input>
          </el-form-item>

          <el-form-item label="运单号:">
            <el-input v-model="waybillNo" style="width: 170px;" size="medium"  clearable
                      placeholder="请输入运单号"></el-input>
          </el-form-item>
          <el-form-item label="财务系列号:">
            <el-input
              v-model="financialSeriesNo"
              @change="setLimit($event)"
              style="width: 180px"
              size="medium"
              maxlength="12"
              clearable
              placeholder="请输入财务系列号"
            ></el-input>
          </el-form-item>
          <el-form-item label="结算对象:">
             <el-select
              v-model="companyId"
              placeholder="请输入结算对象"
              clearable
              remote
              filterable
              reserve-keyword
              style="width: 230px"
            >
              <el-option
                v-for="(item, index) in customerNameArray"
                :key="index"
                :value="item.value"
                :label="item.label"
              >
              </el-option>
            </el-select>
          </el-form-item>
  <el-form-item label="开票抬头:" class="formItem">
            <el-input
              v-model="invoiceTitle"
              style="width: 180px"
              size="medium"
              maxlength="30"
              clearable
              placeholder="请输入开票抬头"
            ></el-input>
          </el-form-item>
            <el-form-item label="核销状态:" class="formItem" >
            <el-select v-model="rcvWriteOffStatus" multiple collapse-tags placeholder="核销状态" @change="dealAllChange"
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
            label="到账日期:"
            v-if="this.selectControl"
          >
            <el-date-picker
              style="width: 185px"
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
              style="width: 185px"
              value-format="yyyy-MM-dd"
              v-model="endPayTime"
              @change="getCurrentChange"
              type="date"
              :picker-options="pickerOptionsEndOne"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="开户行:"  v-if="this.selectControl">
            <el-input v-model="accountBank" style="width: 195px;" size="medium" :maxlength="inputMax" clearable
                      placeholder="请输入开户行"></el-input>
          </el-form-item>
          <el-form-item label="户名:"  v-if="this.selectControl">
            <el-input v-model="accountName" style="width: 190px;" size="medium" :maxlength="inputMax" clearable
                      placeholder="请输入户名"></el-input>
          </el-form-item>
          
       


         

          <!--          <el-form-item>
                      <el-date-picker
                        v-model="payTime"
                        type="daterange"
                        range-separator="至"
                        value-format="yyyy-MM-dd"
                        start-placeholder="付款开始日期"
                        end-placeholder="付款结束日期">
                      </el-date-picker>
                    </el-form-item>-->

          <!--          <el-form-item>
                      <el-date-picker
                        v-model="writeOffTime"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="核销开始日期"
                        end-placeholder="核销结束日期">
                      </el-date-picker>
                    </el-form-item>-->


          <el-form-item label="付款方式:"  v-if="this.selectControl">
            <el-select v-model="writeOffWay" 
            placeholder="付款方式"
              @change="getCurrentChange"
             :loading="loading" clearable filterable remote
              reserve-keyword 
              style="width: 130px;">
              <el-option
                v-for="item in writeOffWayOpt"
                :key="item.id"
                :label="item.writeOffWay"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结算方式:" v-if="this.selectControl">
            <el-select v-model="payWay" placeholder="结算方式" :remote-method="agentMethod" :loading="loading" clearable
              @change="getCurrentChange"
               filterable remote reserve-keyword style="width: 140px;">
              <el-option
                v-for="item in payWayOpt"
                :key="item.value"
                :label="item.payWay"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="是否作废:" class="formItem" >
            <el-select
              v-model="fettle"
              @change="getCurrentChange"
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
          <el-form-item label="请选择分公司" class="formItem">
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
              v-auth="['105000_B']"
            >查询
            </el-button
            >
            <el-button @click="restClick" size="mini" type="primary"
            >清空
            </el-button
            >
          </div>
        </div>
      </el-form>
      <el-tabs class="nth9_class" v-model="woStatus" type="border-card" @tab-click="tabClickData">
        <el-tab-pane :label="'可操作'+'('+countAuth+')'" name="0">
          <Table
            ref="child"
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
            @showFees='showFees'
            @ifDisabled="ifDisabled"
            @handleSelect='handleSelect'
            @currentChange='handleCurrentChange'>
          </Table>
        </el-tab-pane>
        <el-tab-pane :label="'业务修改中'+'('+countNoAuth+')'" name="1">
          <Table
            :tableData='tableData'
            ref="childS"
            :checkedTable='checkedTable'
            :selectionTable="true"
            :pageSkipChecked="pageSkipChecked"
            :columns='columns'
            :operation='operation'
            :total='total'
            :currentPage='pageNum'
            :pageSize='pageSize'
            @sizeChange='handleSizeChange'
            @handleSelect='handleSelect'
            @showWOLogs='showWOLogs'
            @showFees='showFees'
            @currentChange='handleCurrentChange'>
          </Table>
        </el-tab-pane>
        <el-tab-pane :label="'异常'+'('+countErr+')'" name="2">
          <Table
            ref="childSs"
            :tableData='tableData'
            :checkedTable='checkedTable'
            :selectionTable="true"
            :pageSkipChecked="pageSkipChecked"
            :columns='columns'
            :operation='operation'
            :total='total'
            :currentPage='pageNum'
            :pageSize='pageSize'
            @handleSelect='handleSelect'
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
            :current-page="currentPage"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            style="text-align: right;padding: 19px 30px 18px 0;background: #fff">
          </el-pagination>
        </div>
      </div>
         <div v-if="statistDataShow" style="padding-left:15px;background:rgb(255,255,255)" >
                <div style="display:flex;" class="allStatist">
                  <div class="statists">应收总金额:{{statistData.totalArCny?statistData.totalArCny.toLocaleString('en-US'):0}}</div>
                  <div class="statists" style="white-space:pre-wrap;display:flex"><div>应收原币:</div><div style="margin-left:5px"  v-html="dealOrgnS(statistData.totalArOrgn)"></div></div>
                  <div class="statists" style="white-space:pre-wrap;display:flex"><div>申请开票金额:</div><div style="margin-left:5px"  v-html="dealOrgnS(statistData.applyAmountOrgn)"></div></div>
                  <div class="statists" style="white-space:pre-wrap;display:flex"><div>已开票金额:</div><div style="margin-left:5px"  v-html="dealOrgnS(statistData.invoicedAmountOrgn)"></div></div>
                  <div class="statists">利润:{{statistData.orderProfit?statistData.orderProfit.toLocaleString('en-US'):0}}</div>
                  <div class="statists" v-if="statistData.hasAbNormal" style="color:red;fontSize:14px;fontWeight:bold;transform:translateY(10px)">存在异常订单!</div>
                </div>
                <div style="display:flex;padding-bottom:15px" class="allStatist">
                  <div class="statists" style="white-space:pre-wrap;display:flex"><div>已核销原币:</div><div style="margin-left:5px"  v-html="dealOrgnS(statistData.totalArWoOrgn)"></div></div>
                  <div class="statists" style="white-space:pre-wrap;display:flex"><div>已核销人民币:</div><div style="margin-left:5px">{{statistData.totalArWoCny?statistData.totalArWoCny.toLocaleString('en-US'):0}}</div></div>
                  <div class="statists" style="white-space:pre-wrap;display:flex"><div>未核销原币:</div><div style="margin-left:5px"  v-html="dealOrgnS(statistData.totalArUnWoOrgn)"></div></div>
                  <div class="statists" style="white-space:pre-wrap;display:flex"><div>未核销人民币:</div><div style="margin-left:5px">{{statistData.totalArUnWoCny?statistData.totalArUnWoCny.toLocaleString('en-US'):0}}</div></div>
                </div>
              </div>
    </div>
    <el-dialog title="应收核销操作记录" :visible.sync="logDialogVisible" width="80%">
      <Table
        :tableData='logData'
        :columns='columns1'
        :selectionTable="false"
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
        :columns='columns2'
        :selectionTable="false"
        :select=1
        :operation='operation'
        :currentPage='pageNum'
        :pageSize='pageSize'
        @sizeChange='handleSizeChange'
        @currentChange='handleCurrentChange'>
      </Table>

      <td style="font-size: 18px;font-weight: 100;color: #169BD5;padding: 10px 0px 10px 20px;">{{ orderNoTab }}</td>
      <td style="font-size: 18px;font-weight: 100;color: #333333;padding: 10px 20px 10px 0px;">应收账单</td>
      <Table
        :tableData='arData'
        :columns='columns3'
        :selectionTable="false"
        :select=1
        :operation='operation'
        :currentPage='pageNum'
        :pageSize='pageSize'
        @orderDetails="orderDetails"
        @sizeChange='handleSizeChange'
        @currentChange='handleCurrentChange'>
      </Table>

      <div class="finance-table-price">
        <div>账单合计：{{ getOrgn(this.totalArOrgn) }}</div>
        <div>人民币合计：￥{{ this.totalArCny }}</div>
        <div>结算方式:{{this.dialogPayWay == 0?'付款买单':this.dialogPayWay == 1?'月结买单':''}}</div>
        <!--        <div>订单利润：{{ this.orderProfit }}</div>-->
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
      selectControl:false,
      dialogFormVisible: false,
      logDialogVisible: false,
      statistDataShow: false,
      financialSeriesNo:'',
      invoiceTitle:"",
      //表格控制列drawer
      drawer: false,
      direction: "rtl",
      isIndeterminate: true,
      checkAll: false,
      checkedTable: [
        "财务系列号",
        "订单号",
        "运单号",
        "开票抬头",
        "申请开票金额",
        "已开票金额",
        // "开票备注",
        "核销金额",
        "开户行",
        "户名",
        "银行账户",
        "汇率",
        "收款方式",
        "到账时间",
        "核销时间",
        "结算方式",
        "核销次数",
        "核销状态",
      ],
      tableOptions:  [
        "财务系列号",
        "订单号",
        "运单号",
        "开票抬头",
        "申请开票金额",
        "已开票金额",
        // "开票备注",
        "核销金额",
        "开户行",
        "户名",
        "银行账户",
        "汇率",
        "收款方式",
        "到账时间",
        "核销时间",
        "结算方式",
        "核销次数",
        "核销状态",
      ],
      //table
      tableData: [],
      arData: [],
      orderLogs: [],
      orderProfit: 0,
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
      statistData: {
      },
      pageSize: 10,
      pageNum: 1,
      total: 0,
      // 列
      columns: [
        {label: 'id', prop: "id", show: false, width: '50'},
        {label: '财务系列号', prop: 'financialSeriesNo', show: true, width: '150'},
        {label: '订单号', prop: 'orderNo', show: true, width: '150'},
        {label: '运单号', prop: 'waybillNo', show: true, width: '150'},
        {label: '结算对象', prop: 'reconciliationUnit', show: true, width: '160'},
        {label: '开票抬头', prop: 'invoiceTitle', show: true, width: '220'},
        {label: '申请开票金额',prop:'applyAmountOrgn', show: true, width: '100'},
        {label: '已开票金额', prop: 'invoicedAmountOrgn', show: true, width: '80'},
        // {label: '开票备注', prop: 'invoiceRemark', show: true, width: '160'},
        {label: '核销金额', prop: 'writeOffAmount', show: true, width: '100'},
        {label: '开户行', prop: 'accountBank', show: true, width: '150'},
        {label: '户名', prop: 'accountName', show: true, width: '150'},
        {label: '银行账户', prop: 'bankAccount', show: true, width: '200'},
        {label: '汇率', prop: 'exchangeRate', show: true, width: '70'},
        {label: '收款方式', prop: 'writeOffWay', show: true, width: '100'},
        {label: '到账时间', prop: 'legCount', show: true, width: '100'},
        {label: '核销时间', prop: 'writeOffTime', show: true, width: '150'},
        {label: '结算方式', prop: 'payWay', show: true, width: '100'},
        {label: '核销次数', prop: 'rcvWriteOffCount', show: true, width: '100'},
        {label: '核销状态', prop: 'rcvWriteOffStatus', show: true, width: '130'},
      ],
      columns1: [
        {label: '序号', show: true, width: '50'},
        {label: '订单号', prop: 'orderNo', show: true, width: '100'},
        {label: '运单号', prop: 'waybillNo', show: true, width: '100'},
        {label: '应收对象', prop: 'reconciliationUnit', show: true, width: '160'},
        {label: '应收金额', prop: 'totalArCny', show: true, width: '100'},
        {label: '记录', prop: 'log', show: true, width: '500'},
        {label: '操作', prop: 'revoke', show: true, width: '100'},

      ],
      columns2: [
        {label: '结算对象', prop: 'customerName', show: true, width: '100'},
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
        {label: '收款单位', prop: 'expenseUnitName', show: true, width: '150'},
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
      rcvTitles: [],
      select: 0,
      waybillNo: '',
      companyId: '',
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
            return time.getTime() < new Date(beginDateVal).getTime() - 8.64e7
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
            return time.getTime() < new Date(beginDateVal).getTime() - 8.64e7
          }
        }
      },
      startWriteOffTime: null,
      endWriteOffTime: null,
      payWay: '',
      fettle:'',
      payWayTab: '',
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
      rcvWriteOffStatusOpt: [{
        rcvWriteOffStatus: '全部',
        value: ''
      },
        //应收核销状态 0=未对账未核销,1=部分对账未核销,2=已对账未核销,3=未对账部分核销,4=部分对账部分核销,5=已对账部分核销,6=未对账已核销,7=部分对账已核销,8=已对账已核销
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
        /*      {
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
        /* {
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
      overPageCheck: false,
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
      countNoAuth: 0,
      countAuth: 0,
      countErr: 0,
      copySelectJSON:[],
      dialogPayWay:'',
      dialogTitle:'',
      customerNameArray:''
    }
  },
  mounted() {
    this.findThisUserAndBranchOrg()
    this.initData()
    this.initAgentList()
    this.rcvWriteOffStatus = [""]
    this.customerNameMethod()
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
     customerNameMethod(certificationBody){
      if (!certificationBody) {
        certificationBody = "";
      }
      var data = {
        certificationBody: certificationBody,
      };
      this.$http.post(this.$service.searchViews, data, {
        params: {
          typeCode: 1,
        }
      }).then((data) => {
        if (data.code == 200) {
          this.customerNameArray = data.data.map(item => {
            return {
              label: item.companyName,
              value: item.id,
            };
          });
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
    ifDisabled(row) {
      if (this.overPageCheck == true) {
        return false
      } else {
        return true
      }
    },
    //tab切换
    tabClickData() {
      this.pageNum = 1
      this.pageSkipChecked = false
      this.selectAllTable()
      this.initData()
    },
    //选择框值改变直接查询 
      getCurrentChange(){
        this.searchClick()
      },
    dealAllChange() {
      if (this.rcvWriteOffStatus.indexOf('') == this.rcvWriteOffStatus.length - 1) {
        this.rcvWriteOffStatus = ['']
      } else if (this.rcvWriteOffStatus.indexOf('') != -1 && this.rcvWriteOffStatus.length > 1) {
        let index = this.rcvWriteOffStatus.indexOf("")
        this.rcvWriteOffStatus.splice(index, 1)
      }
      this.searchClick()
    },
    selectAllTable() {
      this.overPageCheck = this.pageSkipChecked
      if(this.woStatus == 0) {
         this.$refs.child.selectAllTable(this.pageSkipChecked, this.tableData);
      } 
      else if (this.woStatus == 1) {
          this.$refs.childS.selectAllTable(this.pageSkipChecked, this.tableData);
      }
      else {
           this.$refs.childSs.selectAllTable(this.pageSkipChecked, this.tableData);
      }
      this.rcvTitles = []
    },
    getSearchArgument(argument) {
      var result = ''
      argument.forEach(x => result += x + ',')
      result = result.substring(0, result.length - 1)
      return result
    },
    exportList() {
       var json = {
        overPageCheck: this.overPageCheck,
        rcvTitles: this.rcvTitles.length>0?this.rcvTitles:null,
        financePageDTO:this.useRequest()
      }
      axios.post(this.$service.exportWoDetailExcel, json, {
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
        aLink.setAttribute('download', '订单核销列表' + '.xlsx') // 设置下载文件名称

        /*  if ([...new Set(value.split(","))].filter((x)=>x!=='').length > 1) {
            aLink.setAttribute('download', '航线价格表' + '.zip') // 设置下载文件名称
          } else {
          }*/
        aLink.click()
        document.body.appendChild(aLink)
      })
    },
    showFees(row) {
      this.dialogTitle = row.orderNo
      this.dialogFormVisible = true;
      this.$http.get(this.$service.searchOrderDetail + '?orderId=' + row.orderId).then(data => {
        if (data.code == 200) {
          this.arData = data.data.arOrderPriceList
          this.orderNoTab = data.data.orderNo
          this.orderLogs = data.data.orderPresentLogs
          this.totalArOrgn = data.data.totalArOrgn.toLocaleString('en-US')
          this.totalArCny = data.data.totalArCny.toLocaleString('en-US')
          this.orderProfit = data.data.orderProfit.toLocaleString('en-US')
          this.orderId = data.data.orderId
          this.dialogPayWay = data.data.payWay
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
    handleSelect(val) {
      this.rcvTitles = []
      if (!this.overPageCheck) {
        val.forEach(x => {
          this.rcvTitles.push(`${x.id}@@${x.invoiceTitle}@@${x.orderId}`)
        })
      }
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
      this.$http.get(this.$service.searchArList + '?rcvId=' + row.id+'&invoiceTitle='+row.invoiceTitle, {
        headers: {
          diffFlag: 2,
        },
      }).then(data => {
        if (data.code == 200) {
          this.logData[0].log = data.data
          // this.logData[0].log.forEach(item=>item.invoiceTitle.row.invoiceTitle)
          this.logData[0].id = row.id
          this.logData[0].orderNo = row.orderNo
          this.logData[0].waybillNo = row.waybillNo
          this.logData[0].reconciliationUnit = row.reconciliationUnit
          this.logData[0].totalArCny = row.totalArCny
          this.logData[0].invoiceTitle = row.invoiceTitle
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
    //航线列表
    initData() {

      var json = {
        orderNos: this.orderNo,
        waybillNos: this.waybillNo.replace(/-/g,''),
        financialSeriesNo:this.financialSeriesNo,
        companyId: this.companyId,
        invoiceTitle:this.invoiceTitle,
        accountBank: this.accountBank,
        accountName: this.accountName,
        startPayTime: this.startPayTime,
        endPayTime: this.endPayTime,
        startWriteOffTime: this.startWriteOffTime,
        endWriteOffTime: this.endWriteOffTime,
        writeOffWay: this.writeOffWay,
        payWay: this.payWay,
        fettle:this.fettle,
        rcvWriteOffStatusList: this.rcvWriteOffStatus.length == 0 || this.rcvWriteOffStatus.indexOf("") != -1 ? null : this.rcvWriteOffStatus,
        woStatus: this.woStatus,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orgId: this.orgId,
      }
      return this.$http.post(this.$service.searchWoDetailByPage, json).then(data => {
        if (data.code == 200) {
          this.total = data.data.page.total
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
    //航线列表
    revoke(index, id, row) {
      this.$confirm(`确定核销"操作${index + 1}"`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.post(this.$service.arRevoke + "?woIds=" + id, {}, {
          headers: {
            diffFlag: 2
          },
        }).then(data => {
          if (data.code == 200) {
            this.showWOLogs(row)
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
    searchClick() {
      this.statistDataShow = false
      this.pageNum = 1
      this.initData()
    },
    //重置
    restClick() {
      this.orderNo = ''
      this.waybillNo = ''
      this.reconciliationUnit = ''
      this.invoiceTitle = ''
      this.financialSeriesNo = ''
      this.accountBank = ''
      this.accountName = ''
      this.startPayTime = null
      this.endPayTime = null
      this.startWriteOffTime = null
      this.endWriteOffTime = null
      this.writeOffWay = ''
      this.payWay = ''
      this.fettle = ""
      this.rcvWriteOffStatus = [""]
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
    //请求数据用
    useRequest(){
      return {
        orderNo:this.orderNo,
      waybillNo:this.waybillNo.replace(/-/g,''),
      reconciliationUnit:this.reconciliationUnit,
      accountBank:this.accountBank,
      accountName:this.accountName,
      startPayTime:this.startPayTime,
      endPayTime:this.endPayTime,
      startWriteOffTime:this.startWriteOffTime,
      endWriteOffTime:this.endWriteOffTime,
      writeOffWay:this.writeOffWay ,
      payWay:this.payWay,
      rcvWriteOffStatusList:this.rcvWriteOffStatus[0]==""?null:this.rcvWriteOffStatus,
      woStatus: this.woStatus,
      orgId: this.orgId,

      }
    },
    //数据统计按钮
    getStatistData() {
      if (this.statistDataShow) {
        this.statistDataShow = !this.statistDataShow
        return;
      }
      var json = {
        overPageCheck: this.overPageCheck,
        rcvTitles: this.rcvTitles.length>0?this.rcvTitles:null,
        financePageDTO:this.useRequest()
      }
      this.$http.post(this.$service.sumWoDetail, json).then(data => {
        if (data.code == 200) {
          //        statistData:{hasAbNormal:true,totalArCny:0,totalArOrgn:'',totalRcUnwoCny:0,totalRcUnwoOrgn:'',totalRcWoCny:0,totalRcWoOrgn:''},
          this.statistData = data.data
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
/deep/ .el-table{
  max-height: 550px;
  overflow:auto ;
  th {
    height: auto;
    padding: 15px 0 !important;
  }
}
 .el-button--primary{
      width:100px;
      // text-align: center;
  }
/deep/ .pageSkip {
  padding: 3px 5px !important
}
/deep/.el-tabs--top .el-tabs__item.is-top:last-child{
  color:red;
  
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
/deep/.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active:last-child{
  color:red!important;

}
/deep/.el-tabs--border-card>.el-tabs__header .el-tabs__item:last-child:hover{
  color: red !important;
}
/deep/ .el-table tbody tr:hover > td {
  background-color: transparent;
}

.content-wrapper {
   width:100% ;
  height: 95%;
  box-sizing: border-box;
  /*height: 100%;*/
  padding: 20px;
  overflow: hidden;
  background-color: #f3f6f9 !important;
}

.el-form {
  background-color: #FFF;
}

.el-form--inline .el-form-item {
  margin-bottom: 20px;
  vertical-align: bottom;
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
  padding-bottom: 15px;
  .statists {
    margin-top:10px;
  }
}
/deep/ .el-dialog {
  min-width: 480px;
  border-radius: 6px;
}
.el-form--inline .el-form-item {
  margin-bottom: 10px;
  margin-right: 20px;
  vertical-align: bottom;
}

 .allStatist {
    .statists {
      flex:0 0 170px;
      margin-right:15px;
    }
  }
</style>
