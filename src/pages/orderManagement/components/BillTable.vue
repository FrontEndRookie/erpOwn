<template>
  <!-- 账单表格 -->
  <div class="bill-table">
    <div class="table-title">
      <p v-if="showTotalWoCny">
        {{ computedTitle }}核销金额：{{ computedTotalWoCny }}
      </p>
      <p>
        原币合计：<span>{{ computedTotalOrgnsStr }}</span>
      </p>
      <p>
        人民币合计：<span>{{ computedTotalCnys }}</span>
      </p>
    </div>
    <div style="overflow-x: auto">
      <dc-primeval-table
        :data="computedData"
        :columns="computedColumns"
        style="margin-top: 10px"
      >
        <template #index="{ index }">
          {{ index + 1 }}
        </template>
        <template #expense="{ row, index }">
          <el-select
            v-model="row.expenseName"
            size="mini"
            placeholder="费用名称"
            @change="(val) => expenseNameChange({ val, index })"
            :disabled="editDisabled(row, '费用名称')"
            filterable
            :filter-method="dataListFilter"
            default-first-option
            @focus="dataListFilter(row.expenseName)"
          >
            <el-option
              v-for="item in expenseNameList"
              :key="item.id"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </template>
        <template #receivingUnit="{ row }">
          {{ row.expenseUnitName }}
        </template>
        <template #paymentUnit="{ row, index }">
          <dc-select
            v-model="row.expenseUnitName"
            filterable
            remote
            :remote-method="getAgentList"
            placeholder="付款单位"
            size="mini"
            @change="(val) => agentChange({ val, index })"
            :disabled="editDisabled(row, '付款单位')"
          >
            <el-option
              v-for="item in agentList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </dc-select>
        </template>
        <template #feePayWay="{ row, index }">
          <el-select
            v-model="row.feePayWay"
            size="mini"
            :disabled="editDisabled(row, '结算方式')"
            placeholder="请选择结算方式"
            @change="(val) => feePayWayChange({ val, index })"
          >
            <el-option
              v-for="item in row.computedAgentPayWays"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
            </el-option>
          </el-select>
        </template>
        <template #quantity="{ row, index }">
          <el-input
            v-model.trim="row.quantity"
            size="mini"
            :disabled="editDisabled(row, '数量')"
            @input="
              inputHandler({
                key: 'quantity',
                index,
                val: row.quantity,
                formatKey: 'billQuantity',
              })
            "
            @change="
              changeHandler({
                key: 'quantity',
                index,
                val: row.quantity,
              })
            "
          />
        </template>
        <template #price="{ row, index }">
          <div v-if="showStaticPrice(row)">
            <span>{{ row.price }}</span>
            <el-tooltip
              effect="light"
              content="应付的空运单价为订单的成本单价"
              placement="top"
            >
              <i class="el-icon-warning-outline" style="color: #f56c6c"></i>
            </el-tooltip>
          </div>
          <el-input
            v-else
            v-model.trim="row.price"
            size="mini"
            :disabled="editDisabled(row)"
            @input="
              inputHandler({
                key: 'price',
                index,
                val: row.price,
                formatKey: 'billPrice',
              })
            "
            @change="
              changeHandler({
                key: 'price',
                index,
                val: row.price,
              })
            "
          />
        </template>
        <template #currency="{ row, index }">
          <el-select
            v-model="row.currency"
            size="mini"
            :disabled="editDisabled(row) || showStaticCurrency(row)"
            placeholder="请选择币种"
            @change="(val) => currencyChange({ val, index })"
          >
            <el-option
              v-for="item in computedCurrencyTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
              <span>{{ item.label }}</span>
              <span style="font-size: 12px; color: red" v-if="item.disabled"
                >暂未设置当月汇率，请联系管理员</span
              >
            </el-option>
          </el-select>
        </template>
      
        <template #actions="{ row, index }">
          <el-button
            type="text"
            size="mini"
            class="del-btn"
            :disabled="delBtnDisabled(row)"
            @click="$emit('delRowEv', index)"
            >删除</el-button
          >
        </template>
        <template #remark="{ row, index }">
          <el-input
            placeholder="请填写备注"
            v-model.trim="row.remark"
            :disabled="editDisabled(row)"
            size="mini"
            @input="remarkInput({ val: row.remark, index })"
          />
        </template>
      </dc-primeval-table>
    </div>
    <div style="margin-top: 20px" v-if="showAddExpenseBtn">
      <el-button size="mini" @click="addListItem">添加费用</el-button>
    </div>
    <div class="flex-row" style="margin-top: 20px" v-if="showArActions">
      <p style="margin-right: 20px" class="large-text">
        <span>{{ reconciliationStatusText }}</span>
        <span
          v-if="showInvoiceAmount"
          :style="{ color: invoiceError ? '#d53116' : '' }"
          >￥{{ bill.invoiceAmount }}</span
        >
      </p>
      <el-button
        type="primary"
        size="mini"
        style="margin-left: 10px"
        v-if="showReconciliationBtn"
        @click="jump2confirmBill"
        v-auth="['152010_B']"
        >确认账单并提交开票申请</el-button
      >
      <el-button
        type="primary"
        size="mini"
        v-if="showArEditBillBtn"
        @click="jump2confirmBill(false)"
        v-auth="['152011_B']"
        >费用已确认，点击查看申请记录</el-button
      >
      <el-button
        type="primary"
        size="mini"
        v-if="showArEditBillBtn"
        v-auth="['152004_B']"
        @click="modifyBill"
        >修改账单</el-button
      >
      <el-button
        type="text"
        :style="{ color: invoiceError ? '#d53116' : '' }"
        v-if="showBillingRecordsBtn"
        @click="showBillingRecordsDialog = true"
        >{{ invoiceError ? "开票异常" : "开票记录" }}</el-button
      >
      <el-button
        type="text"
        v-if="showBillRecordsBtn"
        @click="showBillRecordsDialog = true"
        >账单记录</el-button
      >
    </div>
    <div class="flex-row" style="margin-top: 20px" v-if="showApActions">
      <p style="margin-right: 20px" class="large-text">
        <span>{{ apFeeStatusText }}</span>
      </p>
      <el-button
        type="primary"
        size="mini"
        style="margin-left: 10px"
        v-if="showConfirmApBillBtn"
        @click="confirmApBill"
        v-auth:none="['152012_B']"
        >确认应付账单</el-button
      >
      <el-button
        type="primary"
        size="mini"
        v-if="showApEditBillBtn"
        @click="modifyApBill"
        v-auth:none="['152013_B']"
        >修改账单</el-button
      >
    </div>
    <!-- 开票记录弹窗 -->
    <billing-records-dialog
      v-if="showBillingRecordsDialog"
      :invoiceError="invoiceError"
      @closeEv="showBillingRecordsDialog = false"
      :records="computedBillInvoiceApplyInfos"
    />
    <!-- 账单记录弹窗 -->
    <bill-records-dialog
      v-if="showBillRecordsDialog"
      @closeEv="showBillRecordsDialog = false"
      :records="bill.billCheckRecordInfos"
    />
  </div>
</template>

<script>
import DcStatus from "@/status";
import BillingRecordsDialog from "./BillingRecordsDialog";
import BillRecordsDialog from "./BillRecordsDialog";
import Big from "big.js";
export default {
  name: "BillTable",
  components: {
    BillingRecordsDialog,
    BillRecordsDialog,
  },
  props: {
    order: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Array,
      default: () => [],
    },
    bill: {
      type: Object,
      default: () => ({}),
    },
    exchangeRates: {
      type: Object,
      default: () => ({}),
    },
    agentList: {
      type: Array,
      default: () => [],
    },
    getAgentList: {
      type: Function,
      default: () => {},
    },
    // 1 应收 | 2 应付
    expenseType: {
      type: Number,
    },
    arOrderPriceList: {
      type: Array,
      default: () => [],
    },
    apOrderPriceList: {
      type: Array,
      default: () => [],
    },
    saveOrder: {
      type: Function,
      default: () => {},
    },
  },
 created(){
    this.dealExchangeRate(this.order.exchangeRates)
  },
  data() {
    const { currencyTypes, agentPayWays } = DcStatus.commonStatus;
    return {
      arExchangeRates:'',
      apExchangeRates:'',
      expenseNameList:[],
      currencyTypes:this.$store.getters.getCurrencyAddValue,
      agentPayWays,
      columns: [
        {
          prop: "index",
          label: "序号",
          width: "30px",
        },
        {
          prop: "expense",
          label: "费用名称",
          width: "90px",
        },
        {
          prop: "receivingUnit",
          label: "收款单位",
          width: "120px",
          expenseType: 1,
        },
        {
          prop: "paymentUnit",
          label: "付款单位",
          width: "120px",
          expenseType: 2,
        },
        {
          prop: "feePayWay",
          label: "结算方式",
          width: "120px",
          expenseType: 2,
        },
        {
          prop: "quantity",
          label: "数量",
          width: "100px",
        },
        {
          prop: "price",
          label: "单价",
          width: "100px",
        },
        {
          prop: "currency",
          label: "币种",
          width: "80px",
        },
        {
          prop: "totalOrgnText",
          label: "原币合计",
          width: "60px",
        },
        {
          prop: "exchangeRate",
          label: "汇率",
          width: "40px",
        },
        {
          prop: "totalCnyText",
          label: "人民币合计",
          width: "60px",
        },
        {
          prop: "actions",
          label: "操作",
          width: "40px",
        },
        {
          prop: "remark",
          label: "备注",
          width: "150px",
        },
        {
          prop: "executorName",
          label: "执行人",
          width: "100px",
          expenseType: 2,
        },
        {
          prop: "payCheckAmount",
          label: "对账金额",
          width: "80px",
          expenseType: 2,
        },
        {
          prop: "payWriteOffAmount",
          label: "核销金额",
          width: "80px",
          expenseType: 2,
        },
      ],
      showBillingRecordsDialog: false,
      showBillRecordsDialog: false,
      currencyArray: this.$store.getters.getCurrencyAddValue,
    };
  },
  computed: {
    computedCurrencyTypes() {
      return this.currencyTypes.map((item,idx) => {
        return {
          ...item,
          disabled: 
            !this.arOrderPriceList.some(i=>i.list.some(s=>s.currency == item.value)) && 
            !this.apOrderPriceList.some(i=>i.currency == item.value) && 
            !this.exchangeRates[item.value],
        };
      });
    },
    computedData() {
      const {
        agentList,
        $utils: { getAgentPayWayBySettlementWay },
        agentPayWays,
      } = this;
      return this.data.map((item) => {
        const { price, quantity, exchangeRate, expenseUnitId } = item;
        const computedAgent = agentList.find((a) => a.value === expenseUnitId);
        const computedAgentPayWays = (() => {
          if (computedAgent) {
            const agentPayWay = getAgentPayWayBySettlementWay(
              computedAgent.settlementWay
            );
            return agentPayWays.map((item) => {
              const disabled =
                ([1, 2].includes(item.value) && agentPayWay === 0) ||
                (item.value === 1 && agentPayWay === 2) ||
                (item.value === 2 && agentPayWay === 1) ||
                ([1, 2].includes(item.value) && agentPayWay === undefined);
              return {
                ...item,
                disabled,
              };
            });
          }
          return agentPayWays;
        })();
        return {
          ...item,
          totalOrgnText: parseFloat(
            new Big(price * 1).times(quantity * 1)
          ).toFixed(2),
          totalCnyText: parseFloat(
            new Big(price * 1).times(quantity * 1).times(exchangeRate * 1)
          ).toFixed(2),
          computedAgent,
          computedAgentPayWays,
        };
      });
    },
    // 交单状态
    financeStatus() {
      return this.order.financeStatus;
    },
    // 对账状态
    reconciliationStatus() {
      return this.bill.status;
    },
    // 对账状态文字
    reconciliationStatusText() {
      const reconciliationStatus =
        DcStatus.commonStatus.getStatus(
          "arOrderReconciliationStatusList",
          this.reconciliationStatus
        ) || {};
      return reconciliationStatus.label;
    },
    apFeeStatusText() {
      const apFeeStatus =
        DcStatus.commonStatus.getStatus(
          "apFeeStatusList",
          this.order.apFeeStatus
        ) || {};
      return apFeeStatus.label;
    },
    computedExpenseType() {
      return DcStatus.commonStatus.getStatus("expenseTypes", this.expenseType);
    },
    computedTitle() {
      return this.computedExpenseType.label;
    },
    showApActions() {
      return this.expenseType === 2;
    },
    showArActions() {
      return this.expenseType === 1;
    },
    computedColumns() {
      return this.columns.filter((item) => {
        return !item.expenseType || item.expenseType === this.expenseType;
      });
    },
    computedExpenseCodes() {
      return this.$store.state.common.expenseCodeOpt.map((item) => {
        return {
          ...item,
          value: item.id,
          label: item.expenseName,
        };
      });
    },
    // 表格总的原币合计对象
    computedTotalOrgns() {
      return this.computedData.reduce((obj, item) => {
        if (obj[item.currency]) {
          obj[item.currency] = parseFloat(
            new Big(obj[item.currency]).plus(Number(item.totalOrgnText))
          );
        } else {
          obj[item.currency] = Number(item.totalOrgnText);
        }
        return obj;
      }, {});
    },
    computedTotalAuthFieldCode() {
      return {
        1: ["104040_FC"],
        2: ["104055_FC"],
      }[this.expenseType];
    },
    // 表格总的原币合计字符串
    computedTotalOrgnsStr() {
      return Object.entries(this.computedTotalOrgns)
        .map(([key, value]) => {
          const symbol = DcStatus.commonStatus.getStatusNew(
            this.currencyArray,
            Number(key)
          ).symbol;
          return `${symbol}${value}`;
        })
        .join("+");
    },
    // 表格总的人民币合计
    computedTotalCnys() {
      return this.computedData.reduce((total, item) => {
        return parseFloat(new Big(Number(item.totalCnyText * 1)).plus(total));
      }, 0);
    },
    // 核销金额
    computedTotalWoCny() {
      return this.order[this.computedExpenseType.totalWoCnyField];
    },
    showTotalWoCny() {
      return this.expenseType === 2;
    },
    showReconciliationBtn() {
      return (
        this.reconciliationStatus === 0 &&
        this.order.canCheckFlag === 1 &&
        !this.bill.isNewBill &&
        this.data.length > 0
      );
    },
    showConfirmApBillBtn() {
      return [0, 2].includes(this.order.apFeeStatus);
    },
    showArEditBillBtn() {
      const { financeStatus, reconciliationStatus } = this;
      return [0, 4].includes(financeStatus) && reconciliationStatus !== 0;
    },
    showApEditBillBtn() {
      return [1].includes(this.order.apFeeStatus);
    },
    showBillRecordsBtn() {
      const { billCheckRecordInfos } = this.bill;
      return billCheckRecordInfos && billCheckRecordInfos.length > 1;
    },
    showBillingRecordsBtn() {
      const { billInvoiceApplyInfos } = this.bill;
      return billInvoiceApplyInfos && billInvoiceApplyInfos.length > 0;
    },
    showInvoiceAmount() {
      return this.reconciliationStatus === 4;
    },
    showAddExpenseBtn() {
      const { expenseType, financeStatus, reconciliationStatus } = this;
      switch (expenseType) {
        case 1:
          return [0, 4].includes(financeStatus) && reconciliationStatus === 0;
        case 2:
          return [0, 4].includes(financeStatus);
      }
    },
    computedBillId() {
      const list = this.bill.list;
      return list && list[0] ? list[0].billId : 0;
    },
    invoiceError() {
      return this.computedBillInvoiceApplyInfos.find(
        (item) => item.invoiceError
      );
    },
    computedBillInvoiceApplyInfos() {
      return this.bill.billInvoiceApplyInfos.map((item) => {
        const { applyAmountOrgn, applyCurrency, invoicedAmountCny } = item;
        const invoiceError =
          applyAmountOrgn * (this.expenseType == 1?this.arExchangeRates[applyCurrency]:this.apExchangeRates) <
          invoicedAmountCny;
        return {
          ...item,
          invoiceError,
        };
      });
    },
  },
  methods: {
    dealExchangeRate(target){
      let val = target && target.slice(1,-1).split(',')
      let res = {}
      val.map((item,idx)=>{
        let key = item.split(':')[0]
        let val = item.split(':')[1]
        res[key] = Number(val)
      })
      this.expenseType == 1 ? (this.arExchangeRates = res) : (this.apExchangeRates = res)
    },
    getResultExchangeRate(val,index){
      //遍历应收和应付账单是否存在新增汇率
      let res = null;
      for(let i=0;i<this.arOrderPriceList.length;i++){
        let searchData = this.arOrderPriceList[i].list
        res = searchData.find((item,idx)=>item.currency == val)
        if(res) break;
      }
      if(!res){
        for(let i=0;i<this.apOrderPriceList.length;i++){
          let searchData = [this.apOrderPriceList[i]]
          res = searchData.find((item,idx)=>item.currency == val)
          if(res) break;
        }
      }
      return res ? res.exchangeRate :this.exchangeRates[val]
    },

    dataListFilter(val){
      // console.log(val,this.computedExpenseCodes);
      if(val){
        this.expenseNameList = this.computedExpenseCodes.filter((item,index)=>{
          if(item.expenseName.indexOf(val)>-1 || item.pinyin.indexOf(val.toLowerCase())>-1 || item.pinyinInitial.indexOf(val.toLowerCase())>-1){
            return true
          }
        })
      }else{
        this.expenseNameList = this.computedExpenseCodes
      }
      
    },
    llll(){
      console.log("00");
    },
    agentChange({ val, index }) {
      const row = this.data[index];
      const {
        value: expenseUnitId,
        label: expenseUnitName,
        settlementWay,
      } = this.agentList.find((item) => item.value === val) || {};
      const feePayWay =
        this.$utils.getAgentPayWayBySettlementWay(settlementWay) || 0;
      this.$emit("changeRowEv", {
        changeRow: {
          ...row,
          expenseUnitId,
          expenseUnitName,
          feePayWay,
        },
        changeIndex: index,
      });
    },
    expenseNameChange({ val, index }) {
      const row = this.data[index];
      this.$emit("changeRowEv", {
        changeRow: {
          ...row,
          expenseName: val,
        },
        changeIndex: index,
      });
    },
    feePayWayChange({ val, index }) {
      const row = this.data[index];
      this.$emit("changeRowEv", {
        changeRow: {
          ...row,
          feePayWay: val,
        },
        changeIndex: index,
      });
    },
    currencyChange({ val, index }) {
      const row = this.data[index];
      this.$emit("changeRowEv", {
        changeRow: {
          ...row,
          currency: val,
          exchangeRate: this.getResultExchangeRate(val,index)
        },
        changeIndex: index,
      });
    },
    remarkInput({ val, index }) {
      const row = this.data[index];
      this.$emit("changeRowEv", {
        changeRow: {
          ...row,
          remark: val,
        },
        changeIndex: index,
      });
    },
    // formatKey 查表用的字段名
    inputHandler({ key, index, val: newVal, formatKey }) {
      formatKey = formatKey || key;
      const listItem = this.data[index];
      const oldVal = listItem[key];
      const val = this.$utils.getValidNumber({
        format: DcStatus.numberFormat[formatKey],
        newVal,
        oldVal,
      });
      this.$emit("changeRowEv", {
        changeRow: {
          ...listItem,
          [key]: val,
        },
        changeIndex: index,
      });
    },
    changeHandler({ key, index, val }) {
      const listItem = this.data[index];
      if (Number(val) === 0) {
        this.$emit("changeRowEv", {
          changeRow: {
            ...listItem,
            [key]: "",
          },
          changeIndex: index,
        });
        return;
      }
    },
    addListItem() {
      const {
        order: {
          id: orderId,
          orderNo,
          payWay,
          waybillNo,
          companyId,
          companyName,
        },
        expenseType,
        computedBillId,
      } = this;
      this.$emit("addRowEv", {
        billId: computedBillId,
        currency: 1,
        exchangeRate: 1,
        expenseName: "",
        expenseType,
        expenseUnitId: expenseType === 1 ? companyId : "",
        expenseUnitName: expenseType === 1 ? companyName : "",
        orderId,
        orderNo,
        payWay,
        price: "",
        quantity: "",
        remark: "",
        waybillNo,
        feePayWay: null,
      });
    },
    async reconciliation() {
      try {
        await this.saveOrder({ isRefresh: false });
        const {
          order: { orderNo, departureDate, waybillNo, id },
          apOrderPriceList,
        } = this;
        await this.$api.priceSendBill({
          departureDate: departureDate,
          orderNo,
          waybillNo,
          orderId: id,
          userId: sessionStorage.getItem("userId"),
          prices: [
            ...this.computedData.map((item) => {
              const { totalOrgnText, totalCnyText } = item;
              return {
                ...item,
                totalOrgn: totalOrgnText,
                totalCny: totalCnyText,
              };
            }),
            ...apOrderPriceList,
          ],
        });
        this.$emit("getOrderDetail");
      } catch (error) {
      } finally {
      }
    },
    async confirmApBill() {
      try {
        await this.saveOrder({ isRefresh: false });
        const {
          order: { id },
        } = this;
        await this.$api.confirmApBill(
          {},
          {
            params: {
              orderId: id,
            },
          }
        );
        this.$emit("getOrderDetail");
      } catch (error) {}
    },
    async modifyBill() {
      if (this.bill.invoiceAmount > 0) {
        try {
          await this.$alert("该账单已开票，请联系财务处理后修改。", "提示", {
            confirmButtonText: "确定",
          });
        } catch (error) {}
        return;
      }
      try {
        await this.$api.modifyBill({
          billId: this.computedBillId,
        });
        this.$emit("getOrderDetail");
      } catch (error) {
      } finally {
      }
    },
    async modifyApBill() {
      try {
        await this.$api.modifyApBill(
          {},
          {
            params: {
              orderId: this.order.id,
            },
          }
        );
        this.$emit("getOrderDetail");
      } catch (error) {
      } finally {
      }
    },
    showStaticPrice(price) {
      const { expenseType } = this;
      return price.expenseName === "空运费" && expenseType === 2;
    },
    showStaticCurrency(price) {
      const { expenseType } = this;
      return price.expenseName === "空运费" && expenseType === 2;
    },
    editDisabled(price, columnLabel) {
      const { expenseType, reconciliationStatus, financeStatus } = this;
      // 新账单
      if (!price.id) {
        return false;
      }
      if (
        ["费用名称", "收款单位", "付款单位", "结算方式"].includes(
          columnLabel
        ) &&
        ["空运费", "杂费（航线报价）"].includes(price.expenseName)
      ) {
        return true;
      }
      if (["费用名称", "收款单位", "付款单位", "币种"].includes(columnLabel)) {
        // 有对账金额或者核销金额的时候不可编辑费用名称和币种
        if (price.payCheckAmount !== 0 || price.payWriteOffAmount !== 0) {
          return true;
        }
      }
      switch (expenseType) {
        case 1:
          // 应收
          // 交单状态【未交单】【修改中】且【未发起客户对账】可编辑
          // 应收空运费不可编辑
          return (
            !(
              [0, 4].includes(financeStatus) &&
              [0].includes(reconciliationStatus)
            ) ||
            (price.expenseName === "空运费" && columnLabel !== "数量")
          );
        case 2:
          // 应付
          // 交单状态【未交单】【修改中】可编辑
          return ![0, 4].includes(financeStatus);
        default:
          return true;
      }
    },
    delBtnDisabled(price) {
      const { expenseType, reconciliationStatus } = this;
      // 新账单
      if (!price.id) {
        return false;
      }
      // 有对账金额或者核销金额的时候不可删除
      if (price.payCheckAmount !== 0 || price.payWriteOffAmount !== 0) {
        return true;
      }
      // 空运费
      if (price.expenseName === "空运费") {
        return true;
      }
      switch (expenseType) {
        case 1:
          // 应收
          // 【未发起客户对账】可删除
          return (
            ![0].includes(reconciliationStatus) || this.editDisabled(price)
          );
        case 2:
          // 应付
          return this.editDisabled(price);
        default:
          return true;
      }
    },
    async jump2confirmBill(isSave = true) {
      try {
        if (isSave) {
          await this.saveOrder({ isRefresh: false });
        }
        const {
          order: { id: orderId, companyId },
          computedBillId: billId,
        } = this;
        this.$router.push({
          name: "ConfirmBill",
          query: { billId, orderId, companyId },
        });
      } catch (error) {}
    },
  },
};
</script>

<style lang="less" scoped>
.bill-table {
  margin-top: 30px;
  .table-title {
    display: flex;
    font-size: 16px;
    color: #d53116;
    font-weight: bold;
    & > * {
      margin-right: 30px;
    }
  }
  .flex-row {
    display: flex;
    align-items: center;
  }
  .del-btn {
    &:not(.is-disabled) {
      color: #f56c6c;
    }
  }
  .large-text {
    color: #409eff;
    font-size: 20px;
    font-weight: bold;
  }
}
</style>