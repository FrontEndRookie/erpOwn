<template>
  <!-- 账单部分 -->
  <div
    class="bill-section"
    :class="{ 'void-order-disbaled': voidOrderDisabled }"
  >
    <!-- 应收账单 -->
    <order-section-container title="应收账单">
      <div class="flex-row" style="font-size: 16px">
        <span>结算方式</span>
        <div v-auth-field:[payWayText]="['104000_FC']" style="margin: 0 20px">
          <el-select
            v-model="form.payWay"
            :disabled="orderDisableds.orderDisabled"
            placeholder="请选择结算方式"
            style="margin: 0 20px; width: 120px"
            size="small"
            @change="$emit('orderPayWayChange', form.payWay)"
          >
            <el-option
              v-for="item in payWays"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              v-show="item.show"
            >
            </el-option>
          </el-select>
        </div>
        <div class="warning-text">
          <span style="margin-right: 20px" v-if="settlementWarningText">{{
            settlementWarningText
          }}</span>
          <span>应收核销金额: {{ order.totalRcWoCny }}</span>
        </div>
      </div>
      <bill-table
        v-for="(item, index) in arOrderPriceList"
        :ref="`arPriceTable-${index}`"
        :order="order"
        :expenseType="1"
        :data="item.list"
        :bill="item"
        :key="index"
        :index="index"
        :exchangeRates="exchangeRates"
        :agentList="agentList"
        :getAgentList="getAgentList"
        :apOrderPriceList="apOrderPriceList"
        :arOrderPriceList="arOrderPriceList"
        :saveOrder="saveOrder"
        @delRowEv="
          (delIndex) => {
            arOrderPriceList[index].list.splice(delIndex, 1);
          }
        "
        @changeRowEv="
          ({ changeRow, changeIndex }) => {
            arOrderPriceList[index].list.splice(changeIndex, 1, changeRow);
          }
        "
        @addRowEv="
          (addRow) => {
            arOrderPriceList[index].list.push(addRow);
          }
        "
        @getOrderDetail="$emit('getOrderDetail')"
      />
      <div style="margin-top: 20px">
        <el-button
          type="primary"
          size="mini"
          v-if="showNewBillBtn"
          @click="addBill"
          v-auth:none="['152007_B']"
          >新建账单</el-button
        >
      </div>
    </order-section-container>
    <!-- 应付账单 -->
    <order-section-container title="应付账单">
      <div class="flex-row" style="font-size: 16px">
        <span>代理结算方式</span>
        <div
          v-auth-field:[agentPayWayText]="['104001_FC']"
          style="margin: 0 20px"
        >
          <el-select
            v-model="form.agentPayWay"
            :disabled="
              agentPayWayDisabled || orderDisableds.cancelOrderDisabled
            "
            placeholder="请选择结算方式"
            style="margin: 0 20px; width: 120px"
            size="small"
            @change="$emit('orderAgentPayWayChange', form.agentPayWay)"
          >
            <el-option
              v-for="item in computedAgentPayWays"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <bill-table
        ref="apPriceTable"
        :order="order"
        :expenseType="2"
        :data="apOrderPriceList"
        :exchangeRates="exchangeRates"
        :agentList="agentList"
        :getAgentList="getAgentList"
        :apOrderPriceList="apOrderPriceList"
        :arOrderPriceList="arOrderPriceList"
        @delRowEv="
          (delIndex) => {
            apOrderPriceList.splice(delIndex, 1);
          }
        "
        @changeRowEv="
          ({ changeRow, changeIndex }) => {
            apOrderPriceList.splice(changeIndex, 1, changeRow);
          }
        "
        @addRowEv="
          (addRow) => {
            apOrderPriceList.push(addRow);
          }
        "
        @getOrderDetail="$emit('getOrderDetail')"
      />
      <div class="flex-row large-text" style="margin-top: 20px">
        <span style="margin-right: 20px">{{ financeStatusText }}</span>
        <el-button
          type="primary"
          size="mini"
          v-if="showPresentationBtn"
          @click="presentSavePresentLog('presentation')"
          v-auth="['152005_B']"
          >交单</el-button
        >
        <el-button
          type="primary"
          size="mini"
          v-if="showApplyUnlockBtn"
          @click="presentSavePresentLog('applyUnlock')"
          v-auth="['152006_B']"
          >申请解锁</el-button
        >
        <el-button
          type="text"
          v-if="billOperateRecords.length > 0"
          @click="
            $emit('getBillOperateRecords');
            showBillOperateRecordsDialog = true;
          "
          >账单操作记录</el-button
        >
      </div>
    </order-section-container>
    <!-- 账单操作记录弹窗 -->
    <bill-operate-records-dialog
      v-if="showBillOperateRecordsDialog"
      @closeEv="showBillOperateRecordsDialog = false"
      :records="billOperateRecords"
    />
  </div>
</template>

<script>
import DcStatus from "@/status";
import BillTable from "./BillTable";
import BillOperateRecordsDialog from "./BillOperateRecordsDialog";
// 需要父子通信的数据
const OrderKeys = [
  "apOrderPriceList", // 应付账单列表
  "arOrderPriceList", // 应付账单列表
  "payWay", // 结算方式
  "agentPayWay", // 代理结算方式
];
export default {
  name: "BillSection",
  components: {
    BillTable,
    BillOperateRecordsDialog,
  },
  created() {
    this.init();
  },
  props: {
    order: {
      type: Object,
      default: () => ({}),
    },
    exchangeRates: {
      type: Object,
      default: () => ({}),
    },
    billOperateRecords: {
      type: Array,
      default: () => [],
    },
    agentList: {
      type: Array,
      default: () => [],
    },
    getAgentList: {
      type: Function,
      default: () => {},
    },
    saveOrder: {
      type: Function,
      default: () => {},
    },
    orderDisableds: {
      type: Object,
      default: () => ({}),
    },
    payWays: {
      type: Array,
      default: () => [],
    },
    settlementWarningText: {
      type: String,
      default: "",
    },
  },
  data() {
    const { agentPayWays } = DcStatus.commonStatus;
    return {
      form: {},
      apOrderPriceList: [],
      arOrderPriceList: [],
      agentPayWays,
      showBillOperateRecordsDialog: false,
    };
  },
  computed: {
    computedAgentPayWays() {
      const { computedAgent, agentPayWays } = this;
      if (computedAgent) {
        const agentPayWay = this.$utils.getAgentPayWayBySettlementWay(
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
    },
    computedApAirFreight() {
      return this.apOrderPriceList.find(
        (item) => item.expenseName === "空运费"
      );
    },
    computedAgent() {
      const { computedApAirFreight } = this;
      if (computedApAirFreight) {
        return this.agentList.find(
          (item) => item.id === computedApAirFreight.expenseUnitId
        );
      }
    },
    agentPayWayDisabled() {
      const { computedAgent } = this;
      if (computedAgent) {
        const agentPayWay = this.$utils.getAgentPayWayBySettlementWay(
          computedAgent.settlementWay
        );
        return agentPayWay === 0;
      }
      return true;
    },
    voidOrderDisabled() {
      return this.order.fettle !== 0;
    },
    payWayText() {
      const payWay = DcStatus.commonStatus.getStatus(
        "payWays",
        this.form.payWay
      );
      return (payWay || {}).label || "";
    },
    agentPayWayText() {
      const agentPayWay = DcStatus.commonStatus.getStatus(
        "agentPayWays",
        this.form.agentPayWay
      );
      return (agentPayWay || {}).label || "";
    },
    // 交单状态
    financeStatus() {
      return this.order.financeStatus;
    },
    // 交单状态文字
    financeStatusText() {
      const { statusText, label } = DcStatus.commonStatus.getStatus(
        "apOrderPresentationStatusList",
        this.financeStatus
      );
      return statusText || label;
    },
    showNewBillBtn() {
      const { financeStatus, arOrderPriceList } = this;
      // 交单状态【未交单】【修改中】
      // 对账状态【开票已申请】【开票开具】
      return (
        [0, 4].includes(financeStatus) &&
        arOrderPriceList.every((item) => [3, 4].includes(item.status))
      );
    },
    showApplyUnlockBtn() {
      return this.financeStatus === 1;
    },
    showPresentationBtn() {
      const { financeStatus, arOrderPriceList } = this;
      return (
        [0, 4].includes(financeStatus) &&
        arOrderPriceList.every((item) => [3, 4].includes(item.status)) &&
        this.order.fettle === 0
      );
    },
    computedApOrderPriceList() {
      return this.apOrderPriceList.map((item) => {
        const {
          billId,
          currency,
          exchangeRate,
          expenseName,
          expenseType,
          expenseUnitId,
          expenseUnitName,
          id,
          orderId,
          orderNo,
          payWay,
          price,
          quantity,
          remark,
          waybillNo,
          feePayWay,
        } = item;
        return {
          billId,
          currency,
          exchangeRate,
          expenseName,
          expenseType,
          expenseUnitId,
          expenseUnitName,
          id,
          orderId,
          orderNo,
          payWay,
          price,
          quantity,
          remark,
          waybillNo,
          feePayWay,
        };
      });
    },
    computedArOrderPriceList() {
      return this.arOrderPriceList.map((item) => {
        return {
          ...item,
          list: item.list.map((sub) => {
            const {
              billId,
              currency,
              exchangeRate,
              expenseName,
              expenseType,
              expenseUnitId,
              expenseUnitName,
              id,
              orderId,
              orderNo,
              payWay,
              price,
              quantity,
              remark,
              waybillNo,
            } = sub;
            return {
              billId,
              currency,
              exchangeRate,
              expenseName,
              expenseType,
              expenseUnitId,
              expenseUnitName,
              id,
              orderId,
              orderNo,
              payWay,
              price,
              quantity,
              remark,
              waybillNo,
            };
          }),
        };
      });
    },
    orderPriceList() {
      return [
        ...this.computedApOrderPriceList,
        ...this.computedArOrderPriceList.reduce((arr, item) => {
          arr.push(...item.list);
          return arr;
        }, []),
      ].map((item) => {
        const {
          billId,
          currency,
          exchangeRate,
          expenseName,
          expenseType,
          expenseUnitId,
          expenseUnitName,
          id,
          orderId,
          orderNo,
          payWay,
          price,
          quantity,
          remark,
          waybillNo,
          feePayWay,
        } = item;
        return {
          billId,
          currency,
          exchangeRate,
          expenseName,
          expenseType,
          expenseUnitId,
          expenseUnitName,
          id,
          orderId,
          orderNo,
          payWay,
          price,
          quantity,
          remark,
          waybillNo,
          feePayWay,
        };
      });
    },
  },
  methods: {
    init() {
      const form = this.$utils.copyDataByKeys(this.order, OrderKeys);
      const { apOrderPriceList, arOrderPriceList } = form;
      this.form = {
        ...form,
      };
      if (apOrderPriceList) {
        this.apOrderPriceList = apOrderPriceList.map((item) => item);
      }
      if (arOrderPriceList) {
        this.arOrderPriceList = arOrderPriceList.map((item) => item);
      }
    },
    formValidate(isValidate = true) {
      const formData = this.getFormData();
      if (!isValidate) {
        return Promise.resolve(formData);
      }
      return new Promise((resolve, reject) => {
        resolve(formData);
        return;
        reject();
      });
    },
    getFormData() {
      const {
        form: { payWay },
        computedApOrderPriceList: apOrderPriceList,
        computedArOrderPriceList: arOrderPriceList,
        orderPriceList,
      } = this;
      const form = {
        apOrderPriceList,
        arOrderPriceList,
        billPriceList: orderPriceList,
        payWay: payWay === this.order.payWay ? null : payWay,
      };
      return form;
    },
    async presentSavePresentLog(type) {
      try {
        const { operationType, diffFlag, info, successText } =
          await this.getPresentSavePresentLogFormData(type);
        const { financeStatus, id: orderId } = this.order;
        if (type === "presentation") {
          await this.saveOrder({ isRefresh: false, showSuccessMsg: false });
        }
        await this.$api.presentSavePresentLog(
          {
            financeStatus,
            operationType,
            orderId,
            info,
          },
          {
            headers: {
              diffFlag,
            },
          }
        );
        this.$message.success(successText);
        this.$emit("getOrderDetail");
      } catch (error) {}
    },
    async getPresentSavePresentLogFormData(type) {
      switch (type) {
        // 交单
        case "presentation":
          return {
            successText: "交单成功",
            diffFlag: 1,
            operationType: 0,
          };
        // 申请解锁
        case "applyUnlock":
          try {
            const { value } = await this.$prompt("请输入解锁理由", "申请解锁", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              inputValidator: (val) => {
                if (!val || !val.trim()) {
                  return "不能为空";
                }
                if (val.length > 200) {
                  return "限制200字";
                }
              },
            });
            return {
              successText: "申请成功",
              diffFlag: 2,
              operationType: 1,
              info: value,
            };
          } catch (error) {}
      }
    },
    addBill() {
      this.arOrderPriceList.push({
        list: [],
        status: 0,
        canCheckFlag: 0,
        isNewBill: true,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.bill-section {
  .flex-row {
    display: flex;
    align-items: center;
  }
  .large-text {
    color: #409eff;
    font-size: 20px;
    font-weight: bold;
  }
  &.void-order-disbaled {
    pointer-events: none;
  }
  .warning-text {
    font-weight: bold;
    color: #d53116;
  }
}
</style>