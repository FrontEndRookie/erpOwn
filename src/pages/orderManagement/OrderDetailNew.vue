<template>
  <!-- 订单详情(新) -->
  <div class="order-detail-new" v-if="order" :key="timestampKey">
    <div class="order-detail-wrap">
      <!-- 顶部浮动 -->
      <header class="detail-header">
        <!-- 操作栏 -->
        <action-bar
          :order="order"
          :actions="orderActions"
          @actionHandler="actionHandler"
        />
        <!-- 基本信息 -->
        <base-info
          style="margin-top: 10px"
          ref="baseInfo"
          :order="order"
          :pols="pols"
          :pods="pods"
          :payWays="computedPayWays"
          :getPols="
            (keyWord) => getThreeLetterCodes({ keyWord, listName: 'pols' })
          "
          :getPods="
            (keyWord) => getThreeLetterCodes({ keyWord, listName: 'pods' })
          "
          :pscsList="pscsList"
          :mscsList="mscsList"
          :principalList="principalList"
          :airCompanys="airCompanys"
          :agentList="agentList"
          :getAirCompanysByKeyWord="getAirCompanysByKeyWord"
          :getAgentList="getAgentList"
          :orderDisableds="orderDisableds"
          :currencyTypes="computedCurrencyTypes"
          @orderAirCompanyChange="orderAirCompanyChange"
          @orderPolChange="orderPolChange"
          @orderPodChange="orderPodChange"
          @orderBookingPriceChange="orderBookingPriceChange"
          @orderInboundNoChange="orderInboundNoChange"
          @orderAgentChange="orderAgentChange"
          @orderPayWayChange="orderPayWayChange"
          @orderAgentPayWayChange="orderAgentPayWayChange"
          @orderCostPriceChange="orderCostPriceChange"
          @orderOwnRoteChange="orderOwnRoteChange"
          @orderMiscellaneousFeesChange="orderMiscellaneousFeesChange"
          @orderPrincipalChange="orderPrincipalChange"
          @orderCostCurrencyChange="orderCostCurrencyChange"
          @orderBookingCurrencyChange="orderBookingCurrencyChange"
        />
      </header>
      <!-- 页面主体 -->
      <main class="detail-main" style="margin-top: 10px">
        <!-- tab切换 -->
        <order-tabs :active.sync="activeTab">
          <order-tab-pane class="paneLine" label="订舱信息">
            <order-section-container title="订舱数据">
              <section class="booking-data-row">
                <div>
                  <p class="title">客户订舱数据</p>
                  <booking-data-table
                    :order="order"
                    ref="customerBookingDataTable"
                  />
                </div>
                <div v-if="false" style="margin-left: 20px">
                  <p class="title">代理订舱数据</p>
                  <agent-booking-data-table
                    :order="order"
                    ref="agentBookingDataTable"
                    @orderCostBubblePointChange="orderCostBubblePointChange"
                  />
                </div>
              </section>
            </order-section-container>
            <booking-form
              style="margin-top: 10px"
              ref="bookingForm"
              :order="order"
              :pols="pols"
              :pods="pods"
              :getPols="
                (keyWord) => getThreeLetterCodes({ keyWord, listName: 'pols' })
              "
              :getPods="
                (keyWord) => getThreeLetterCodes({ keyWord, listName: 'pods' })
              "
              :airCompanys="airCompanys"
              :payWays="computedPayWays"
              :principalList="principalList"
              :getAirCompanysByKeyWord="getAirCompanysByKeyWord"
              :orderDisableds="orderDisableds"
              :currencyTypes="computedCurrencyTypes"
              @orderAirCompanyChange="orderAirCompanyChange"
              @orderPolChange="orderPolChange"
              @orderPodChange="orderPodChange"
              @orderExpectedInboundTimeChange="orderExpectedInboundTimeChange"
              @orderBookingPriceChange="orderBookingPriceChange"
              @orderBookingDataChange="orderBookingDataChange"
              @orderInboundCwChange="orderInboundCwChange"
              @orderCostCwChange="orderCostCwChange"
              @orderPayWayChange="orderPayWayChange"
              @orderOwnRoteChange="orderOwnRoteChange"
              @orderMiscellaneousFeesChange="orderMiscellaneousFeesChange"
              @orderCostPriceChange="orderCostPriceChange"
              @orderPrincipalChange="orderPrincipalChange"
              @orderCostBubblePointChange="orderCostBubblePointChange"
              @orderCostCurrencyChange="orderCostCurrencyChange"
              @orderBookingCurrencyChange="orderBookingCurrencyChange"
            />
          </order-tab-pane>
          <order-tab-pane class="paneLine" label="进仓指引" :visible="showInboundGuideTab">
            <order-section-container title="进仓指引">
              <inbound-guide
                ref="inboundGuide"
                :warehouses="warehouses"
                :order="order"
                :orderDisableds="orderDisableds"
                @orderInboundNoChange="orderInboundNoChange"
                @orderExpectedInboundTimeChange="orderExpectedInboundTimeChange"
              />
            </order-section-container>
            <order-section-container title="订舱数据">
              <booking-data-table :order="order" ref="bookingDataTable" />
            </order-section-container>
            <order-section-container title="进仓数据">
              <template #title-append>
                <span
                  style="
                    margin-left: 20px;
                    cursor: pointer;
                    text-decoration: underline;
                    color: #000;
                    font-size: 14px;
                  "
                  v-if="
                    order.orderCargoDetailLogList &&
                    order.orderCargoDetailLogList.length > 0
                  "
                  @click="showInboundRecordsDialog = true"
                  >查看确认记录</span
                >
              </template>
              <inbound-data
                ref="inboundData"
                :order="order"
                :orderDisableds="orderDisableds"
                @orderInboundCwChange="orderInboundCwChange"
                @orderCostCwChange="orderCostCwChange"
                @orderBubblePointChange="orderBubblePointChange"
              />
            </order-section-container>
          </order-tab-pane>
          <order-tab-pane class="paneLine" label="账单">
            <bill-section
              style="margin-top: 10px"
              ref="billSection"
              :order="order"
              :exchangeRates="exchangeRates"
              :currencyTypes="computedCurrencyTypes"
              :billOperateRecords="billOperateRecords"
              :agentList="agentList"
              :getAgentList="getAgentList"
              :payWays="computedPayWays"
              :orderDisableds="orderDisableds"
              :saveOrder="saveOrder"
              :settlementWarningText="settlementWarningText"
              @getOrderDetail="getOrderDetail"
              @getBillOperateRecords="getBillOperateRecords"
              @orderPayWayChange="orderPayWayChange"
              @orderAgentPayWayChange="orderAgentPayWayChange"
            />
          </order-tab-pane>
        </order-tabs>
      </main>
    </div>
    <!-- 进仓数据确认记录弹窗 -->
    <inbound-records-dialog
      v-if="showInboundRecordsDialog"
      @closeEv="showInboundRecordsDialog = false"
      :records="order.orderCargoDetailLogList"
    />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import DcStatus from "@/status";
import ActionBar from "./components/ActionBar";
import BaseInfo from "./components/BaseInfo";
import OrderTabs from "./components/OrderTabs";
import OrderTabPane from "./components/OrderTabPane";
import BookingDataTable from "./components/BookingDataTable";
import AgentBookingDataTable from "./components/AgentBookingDataTable.vue";
import BookingForm from "./components/BookingForm";
import InboundGuide from "./components/InboundGuide";
import InboundData from "./components/InboundData";
import BillSection from "./components/BillSectionNew";
import InboundRecordsDialog from "./components/InboundRecordsDialog";
export default {
  name: "OrderDetailNew",
  components: {
    ActionBar,
    BaseInfo,
    OrderTabs,
    OrderTabPane,
    BookingForm,
    InboundGuide,
    InboundData,
    BillSection,
    BookingDataTable,
    InboundRecordsDialog,
    AgentBookingDataTable,
  },
  created() {
    this.init();
    if (this.$route.query.tab == 2) {
      this.activeTab = "账单";
    }
    if (this.$route.query.tab == 3) {
      this.activeTab = "进仓指引";
    }
  },
  data() {
    const { payWays, currencyTypes } = DcStatus.commonStatus;
    return {
      currencyTypes:this.$store.getters.getCurrencyAddValue,
      payWays,
      order: null,
      airCompanys: [], // 航空公司列表
      agentList: [], // 代理列表
      principalList: [], // 航线负责人列表
      pscsList: [], // 售前列表
      mscsList: [], // 售中列表
      activeTab: "订舱信息", // tab
      warehouses: [], // 仓库列表
      exchangeRates: {}, // 汇率表
      pols: [], // 起运港列表
      pods: [], // 目的港列表
      billOperateRecords: [], // 账单操作记录
      timestampKey: 0,
      showInboundRecordsDialog: false, // 显示进仓数据提交记录
      settlementTypes: [],
      settlementWarningText: "",
      priceList: [],
    };
  },
  computed: {
    ...mapState({
      userOrderPayways:state=>state.orderModule.userOrderPayways,
    }),
    informOrderNo() {
      return this.$store.state.warnOrderNo;
    },
    computedCurrencyTypes() {
      return this.currencyTypes.map((item) => {
        return {
          ...item,
          disabled: !this.exchangeRates[item.value],
          label: `${item.value === 1 ? "元" : item.label} / KG`,
        };
      });
    },
    computedPayWays() {
      return this.payWays.map((item) => {
        return {
          ...item,
          show: this.settlementTypes.includes(item.value),
        };
      });
    },
    orderId() {
      return this.$route.query.id;
    },
    // 订单操作必传字段
    requiredOrderParams() {
      const { activityCodeDoing, activityCodeDone, status, id } = this.order;
      return {
        activityCodeDoing,
        activityCodeDone,
        status,
        id,
      };
    },
    orderActions() {
      if (!this.order.status) {
        return [];
      }
      const orderStatus = DcStatus.orderStatus[this.order.status];
      const _actions = Array.isArray(orderStatus.actions)
        ? orderStatus.actions
        : orderStatus.actions[this.order.activityCodeDone];
      if (!orderStatus || !_actions) {
        return [];
      }
      const { validEditAuthFieldCodes } = this.$store.getters;
      const actions = _actions.filter((item) => {
        if (!item.fieldAuth) {
          return true;
        }
        return item.fieldAuth.every((code) =>
          validEditAuthFieldCodes.includes(code)
        );
      });
      return actions;
    },
    orderDisableds() {
      return this.$utils.getOrderDisableds(this.order);
    },
    showInboundGuideTab() {
      // return ![1, 2, 3].includes(this.order.status);
      return true;
    },
  },
  methods: {
    ...mapMutations("orderModule", ["setOrderPayways"]),
    // 页面初始化
    async init() {
      if (!this.orderId) {
        return;
      }
      this.$store.dispatch("getExpenseCodeOpt");
      this.getAirCompanysByKeyWord();
      this.getSettlementMethod();
      this.getThreeLetterCodes({ listName: "pols" });
      this.getThreeLetterCodes({ listName: "pods" });
      this.getAgentList();
      this.getSystemUsersByRoleName({
        roleName: "售前客服",
        listName: "pscsList",
      });
      this.getSystemUsersByRoleName({
        roleName: "售中客服",
        listName: "mscsList",
      });
      this.getLineRoleName({
        roleName: "航线负责人",
        listName: "principalList",
      });
      this.getOrderDetail();
    },
    // 获取订单详情
    async getOrderDetail() {
      try {
        const {
          data: { data: order },
        } = await this.$api.getOrderDetail({
          params: {
            orderId: this.orderId,
          },
          loading: true,
        });
        if (!order) {
          this.$message.error("订单不存在");
          return;
        }
        this.setOrderPayways(order.payWays && JSON.parse(order.payWays))
        this.priceList = JSON.parse(
          JSON.stringify([
            ...(order.apOrderPriceList || []),
            ...(order.arOrderPriceList || []).reduce((list, item) => {
              list.push(...(item.list || []));
              return list;
            }, []),
          ])
        );
        this.order = {
          ...order,
        };
        this.$store.commit("changeUserOrder", this.order);
       await this.getExchangeRatesForOrder();
        await this.getWarehousesByAirport();
        await this.getBillOperateRecords();
        this.$route.meta.title = `订单详情-${order.statusDesc}`;
        this.timestampKey = new Date().getTime();
      } catch (error) {
        // if (error.code === -1) {
        //   this.$router.go(-1);
        // }
      }
    },
    // 查询航空公司 by keyWord (航司二字码/航司中文名称/数字码)
    async getAirCompanysByKeyWord(keyWord = "") {
      const {
        data: {
          data: { records },
        },
      } = await this.$api.getAirCompanysByKeyWord({
        params: {
          keyWord,
        },
      });
      this.airCompanys = records.map((item) => {
        return {
          ...item,
          label: `${item.airCompanyCode}-${item.name}`,
          value: item.airCompanyCode,
          airCompany: `${item.airCompanyCode}-${item.name}`,
        };
      });
    },
    // 查询系统用户
    async getSystemUsersByRoleName({ roleName, listName }) {
      const {
        data: {
          data: { records },
        },
      } = await this.$api.getSystemUsersByRoleName({
        params: {
          roleName,
          pageSize: 9999,
        },
      });
      this[listName] = records.map((item) => {
        return {
          ...item,
          label: item.name,
          value: item.id,
        };
      });
    },
    //  获取航线人员
    async getLineRoleName({ roleName, listName }) {
      const data = await this.$http.get(
        this.$service.userSearchNoAuth + "?roleName=航线负责人&pageSize=9999"
      );
      this[listName] = data.data.records.map((item) => {
        return {
          ...item,
          label: item.name,
          value: item.id,
        };
      });
    },
    // 代理列表查询
    async getAgentList(agentName = "") {
      if (agentName === "" || agentName.trim() === "") {
        this.agentList = [];
        return;
      }
      const {
        data: {
          data: { records },
        },
      } = await this.$api.getAgentList({
        agentName,
        pageSize: 10,
      });
      this.agentList = records.map((item) => {
        return {
          ...item,
          label: item.agentName,
          value: item.id,
        };
      });
    },
    // 根据机场查询仓库
    async getWarehousesByAirport() {
      const {
        data: { data },
      } = await this.$api.getWarehousesByAirport({
        params: {
          airportCode: this.order.pol || "",
        },
      });
      this.warehouses = data.map((item) => {
        return {
          ...item,
          value: item.id,
          label: item.name,
        };
      });
    },
    async getExchangeRatesForOrder() {
      const { departureDate } = this.order;
      if(!departureDate) return 
      try {
        const {
          data: { data },
        } = await this.$api.getCurrencyRatesNew({
          params: {
            departureDate,
            orderId:this.orderId
          },
        });
          this.exchangeRates = data;
        }catch (error) {}
    },
    // 操作栏事件
    async actionHandler(action) {
      switch (action) {
        case "saveOrder":
          try {
            await this.$confirm("确认要保存此次编辑?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "放弃",
              type: "warning",
            });
            await this.saveOrder();
          } catch (error) {}
          break;
        case "retestOrder":
          try {
            await this.$confirm("确认要保存此次编辑?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "放弃",
              type: "warning",
            });
            this.executeOrder({ ctrlFlag: 3 });
          } catch (error) {}
          break;
        case "resolveOrder":
          try {
            if (this.order.status === 25 && this.order.pol === "PVG") {
              // 卡口放行 且 起运港为PVG
              await this.$confirm("请确认抹香鲸状态为二次放行", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              });
            } else {
              await this.$confirm("是否确认本次操作?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "放弃",
                type: "warning",
              });
            }
            this.executeOrder({ ctrlFlag: 1 });
          } catch (error) {}
          break;
        case "cancelOrder":
          try {
            await this.$confirm("确认要取消订单?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "放弃",
              type: "warning",
            });
            this.executeOrder({ ctrlFlag: 2 });
          } catch (error) {}
          break;
        case "rejectOrder":
          try {
            await this.$confirm("确认要进行该操作?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "放弃",
              type: "warning",
            });
            this.executeOrder({ ctrlFlag: 2 });
          } catch (error) {}
          break;
        case "applyVoidOrder":
          try {
            await this.$confirm("确认要作废订单?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "放弃",
              type: "warning",
            });
            this.applyVoidOrder();
          } catch (error) {}
          break;
        case "unlockFreezedOrder":
          try {
            await this.$alert(
              "该功能暂未上线，请直接联系管理员说明情况并解锁！",
              "提示",
              {
                confirmButtonText: "确定",
              }
            );
          } catch (error) {}

          break;
        default:
          this.$message.error("未定义操作事件");
          break;
      }
    },
    async getOrderFormData(isValidate = false) {
      try {
        const baseInfo = await this.$refs.baseInfo.formValidate(isValidate);
        const bookingForm = await this.$refs.bookingForm.formValidate(
          isValidate
        );
        const inboundGuide = await this.$refs.inboundGuide.formValidate(
          isValidate
        );
        const inboundData = await this.$refs.inboundData.formValidate(
          isValidate
        );
        const billSection = await this.$refs.billSection.formValidate(
          isValidate
        );
        const data = {
          ...baseInfo,
          ...bookingForm,
          ...inboundGuide,
          ...inboundData,
          ...billSection,
        };
        const form = Object.entries(data).reduce(
          (obj, [key, val]) => {
            if (this.order.hasOwnProperty(key)) {
              obj.order[key] = val;
            } else {
              obj[key] = val;
            }
            return obj;
          },
          { order: {} }
        );
        const {
          order,
          inboundSubList: orderCargoDetailList,
          inboundTotalImages,
          billPriceList,
        } = form;
        const orderAttachmentList = (() => {
          if (inboundTotalImages) {
            return [
              ...this.order.orderAttachmentList.filter(
                (item) => item.attachmentType !== 1
              ),
              ...inboundTotalImages,
            ];
          } else {
            return null;
          }
        })();
        const formData = {
          order: {
            ...order,
            // orderAttachmentList,
            apOrderPriceList: undefined,
            arOrderPriceList: undefined,
          },
          orderAttachmentList,
          orderCargoDetailList,
          orderPriceList: (() => {
            // 判断是否有费用变化
            const isPriceChange =
              billPriceList.length !== this.priceList.length ||
              !billPriceList.every((item, index) => {
                const price = this.priceList.find((p) => p.id === item.id);
                if (price) {
                  // 用以下几个key值判断单条费用是否变化
                  const isValueChange = !Object.entries(item)
                    .filter(([key]) =>
                      [
                        "currency",
                        "exchangeRate",
                        "expenseName",
                        "expenseType",
                        "expenseUnitId",
                        "expenseUnitName",
                        "feePayWay",
                        "payWay",
                        "price",
                        "quantity",
                        "remark",
                      ].includes(key)
                    )
                    .every(([key, value]) => {
                      if (
                        item[key] === price[key] ||
                        (item[key] === undefined && price[key] === null) ||
                        (item[key] === null && price[key] === null)
                      ) {
                        return true;
                      }
                    });
                  if (!isValueChange) {
                    return true;
                  }
                }
              });
            if (isPriceChange) {
              return billPriceList;
            }
          })(),
        };
        return formData;
      } catch (error) {}
    },
    // 保存订单
    async saveOrder({ isRefresh = true, showSuccessMsg = true } = {}) {
      try {
        const formData = await this.getOrderFormData();
        const {
          data: {
            data: { excessInfo },
          },
        } = await this.$api.saveOrder(
          {
            ...formData,
            order: {
              ...this.requiredOrderParams,
              ...formData.order,
              payWays:JSON.stringify(this.userOrderPayways)
            },
          },
          {
            errorCatch: true,
          }
        );
        if (excessInfo) {
          try {
            await this.$confirm(excessInfo.message, `提示`, {
              confirmButtonText: "联系客户",
              cancelButtonText: "确认",
            });
            const tagA = document.createElement("a");
            tagA.href = `tencent://message/?uin=${excessInfo.customerQq}&Menu=yes&Service=300&sigT=42a1e5347953b64c5ff3980f8a6e644d4b31456cb0b6ac6b27663a3c4dd0f4aa14a543b1716f9d45`;
            tagA.click();
          } catch (error) {}
        } else {
          showSuccessMsg && this.$message.success("保存成功");
        }
        isRefresh && await this.getOrderDetail();
      } catch (error) {
        if (!error.code) {
          return;
        }
        switch (error.code) {
          case -100:
            try {
              await this.$confirm(error.message, `提示`, {
                confirmButtonText: "联系客户",
                cancelButtonText: "确认",
              });
              const tagA = document.createElement("a");
              tagA.href = `tencent://message/?uin=${error.data}&Menu=yes&Service=300&sigT=42a1e5347953b64c5ff3980f8a6e644d4b31456cb0b6ac6b27663a3c4dd0f4aa14a543b1716f9d45`;
              tagA.click();
            } catch (error) {}
            break;
          default:
            this.$message.error(error.message);
            break;
        }
        return Promise.reject();
      } finally {
      }
    },
    // 推进订单状态 ctrlFlag 正常分支1 | 异常分支2 | 复测分支3
    async executeOrder({ ctrlFlag }) {
      try {
        const formData = await this.getOrderFormData();
        const {
          data: {
            data: { excessInfo },
          },
        } = await this.$api.executeOrder(
          {
            ...formData,
            order: {
              ...this.requiredOrderParams,
              ...formData.order,
            },
            ctrlMap: {
              ctrlFlag,
            },
          },
          {
            errorCatch: true,
          }
        );
        if (excessInfo) {
          try {
            await this.$confirm(excessInfo.message, `提示`, {
              confirmButtonText: "联系客户",
              cancelButtonText: "确认",
            });
            const tagA = document.createElement("a");
            tagA.href = `tencent://message/?uin=${excessInfo.customerQq}&Menu=yes&Service=300&sigT=42a1e5347953b64c5ff3980f8a6e644d4b31456cb0b6ac6b27663a3c4dd0f4aa14a543b1716f9d45`;
            tagA.click();
          } catch (error) {}
        } else {
          this.$message.success("操作成功");
        }
        if (![2, 3].includes(this.order.status)) {
          this.getOrderDetail();
        }
      } catch (error) {
        switch (error.code) {
          case -100:
            try {
              await this.$confirm(error.message, `提示`, {
                confirmButtonText: "联系客户",
                cancelButtonText: "确认",
              });
              const tagA = document.createElement("a");
              tagA.href = `tencent://message/?uin=${error.data}&Menu=yes&Service=300&sigT=42a1e5347953b64c5ff3980f8a6e644d4b31456cb0b6ac6b27663a3c4dd0f4aa14a543b1716f9d45`;
              tagA.click();
            } catch (error) {}
            break;
          default:
            this.$message.error(error.message);
            break;
        }
      } finally {
      }
    },
    async applyVoidOrder() {
      try {
        await this.saveOrder({ showSuccessMsg: false });
        await this.$api.applyVoidOrder(
          {},
          {
            params: {
              orderId: this.order.id,
            },
          }
        );
        this.$message.success("操作成功");
        this.getOrderDetail();
      } catch (error) {
      } finally {
      }
    },
    async getThreeLetterCodes({ keyWord = "", listName }) {
      const {
        data: {
          data: { records },
        },
      } = await this.$api.getThreeLetterCodes({
        params: {
          keyWord,
        },
      });
      this[listName] = records.map((item) => {
        const { threeLetterCode, name, city, country } = item;
        return {
          ...item,
          label: threeLetterCode,
          value: threeLetterCode,
          detailText: `${threeLetterCode} - ${name} - ${city} - ${country}`,
        };
      });
    },
    async getBillOperateRecords() {
      const {
        data: { data },
      } = await this.$api.getBillOperateRecords({
        params: {
          orderId: this.orderId,
        },
      });
      this.billOperateRecords = data;
    },
    orderAirCompanyChange({ airCompanyCode, airCompanyName }) {
      const airCompany = `${airCompanyCode}-${airCompanyName}`;
      const baseInfo = this.$refs.baseInfo;
      if (baseInfo) {
        baseInfo.form.airCompanyCode = airCompanyCode;
        baseInfo.form.airCompanyName = airCompanyName;
        baseInfo.form.airCompany = airCompany;
      }
      const bookingForm = this.$refs.bookingForm;
      if (bookingForm) {
        bookingForm.form.airCompanyCode = airCompanyCode;
        bookingForm.form.airCompanyName = airCompanyName;
        bookingForm.form.airCompany = airCompany;
      }
    },
    orderPolChange(pol) {
      const baseInfo = this.$refs.baseInfo;
      if (baseInfo) {
        baseInfo.form.pol = pol;
      }
      const bookingForm = this.$refs.bookingForm;
      if (bookingForm) {
        bookingForm.form.pol = pol;
      }
    },
    orderPodChange(pod) {
      const baseInfo = this.$refs.baseInfo;
      if (baseInfo) {
        baseInfo.form.pod = pod;
      }
      const bookingForm = this.$refs.bookingForm;
      if (bookingForm) {
        bookingForm.form.pod = pod;
      }
      const inboundGuide = this.$refs.inboundGuide;
      if (inboundGuide) {
        inboundGuide.form.pod = pod;
      }
      if (this.order.status === 9) {
        // 待进仓状态
        this.$message.warning("目的港的修改可能影响进仓编号变化，请您校验。");
      }
    },
    orderPrincipalChange({ principalId, principalName }) {
      const baseInfo = this.$refs.baseInfo;
      if (baseInfo) {
        baseInfo.form.principalId = principalId;
        baseInfo.form.principalName = principalName;
      }
      const bookingForm = this.$refs.bookingForm;
      if (bookingForm) {
        bookingForm.form.principalId = principalId;
        bookingForm.form.principalName = principalName;
      }
    },
    orderDepartureDateChange(departureDate) {
      const baseInfo = this.$refs.baseInfo;
      if (baseInfo) {
        baseInfo.form.departureDate = departureDate;
      }
      const bookingForm = this.$refs.bookingForm;
      if (bookingForm) {
        bookingForm.form.departureDate = departureDate;
      }
      const inboundGuide = this.$refs.inboundGuide;
      if (inboundGuide) {
        if ([1, 2, 3, 9].includes(this.order.status)) {
          const time = this.$utils
            .dayjs(departureDate)
            .subtract(36, "hours")
            .format("YYYY-MM-DD HH:mm:ss");
          inboundGuide.form.latestInboundDate = time;
        }
      }
    },
    orderExpectedInboundTimeChange(expectedInboundTime) {
      const bookingForm = this.$refs.bookingForm;
      if (bookingForm) {
        bookingForm.form.expectedInboundTime = expectedInboundTime;
      }
      const inboundGuide = this.$refs.inboundGuide;
      if (inboundGuide) {
        inboundGuide.form.expectedInboundTime = expectedInboundTime;
      }
    },
    orderBookingPriceChange(bookingPrice) {
      if ([null, "null"].includes(bookingPrice)) {
        return;
      }
      const baseInfo = this.$refs.baseInfo;
      if (baseInfo) {
        baseInfo.form.bookingPrice = bookingPrice;
      }
      const bookingForm = this.$refs.bookingForm;
      if (bookingForm) {
        bookingForm.form.bookingPrice = bookingPrice;
      }
      const billSection = this.$refs.billSection;
      if (billSection) {
        const arOrderPriceList = billSection.arOrderPriceList;
        if (arOrderPriceList) {
          const arAirFreightListIndex = arOrderPriceList.findIndex(
            (listItem) => {
              return listItem.list.find(
                (item) => item.expenseName === "空运费"
              );
            }
          );
          if (arAirFreightListIndex >= 0) {
            let arAirFreightList = arOrderPriceList[arAirFreightListIndex].list;
            const arAirFreightIndex = arAirFreightList.findIndex(
              (item) => item.expenseName === "空运费"
            );
            if (arAirFreightIndex >= 0) {
              arAirFreightList.splice(arAirFreightIndex, 1, {
                ...arAirFreightList[arAirFreightIndex],
                price: bookingPrice,
              });
            }
            billSection.arOrderPriceList.splice(arAirFreightListIndex, 1, {
              ...billSection.arOrderPriceList[arAirFreightListIndex],
              list: arAirFreightList,
            });
          }
        }
      }
    },
    orderCostPriceChange(costPrice) {
      if ([null, "null"].includes(costPrice)) {
        return;
      }
      const baseInfo = this.$refs.baseInfo;
      if (baseInfo) {
        baseInfo.form.costPrice = costPrice;
      }
      const bookingForm = this.$refs.bookingForm;
      if (bookingForm) {
        bookingForm.form.costPrice = costPrice;
      }
      const billSection = this.$refs.billSection;
      if (billSection) {
        const apOrderPriceList = billSection.apOrderPriceList;
        if (apOrderPriceList) {
          const apAirFreightIndex = apOrderPriceList.findIndex(
            (item) => item.expenseName === "空运费"
          );
          if (apAirFreightIndex >= 0) {
            billSection.apOrderPriceList.splice(apAirFreightIndex, 1, {
              ...apOrderPriceList[apAirFreightIndex],
              price: costPrice,
            });
          }
        }
      }
    },
    orderMiscellaneousFeesChange(miscellaneousFees) {
      if ([null, "null"].includes(miscellaneousFees)) {
        return;
      }
      const baseInfo = this.$refs.baseInfo;
      if (baseInfo) {
        baseInfo.form.miscellaneousFees = miscellaneousFees;
      }
      const bookingForm = this.$refs.bookingForm;
      if (bookingForm) {
        bookingForm.form.miscellaneousFees = miscellaneousFees;
      }
      const billSection = this.$refs.billSection;
      if (billSection) {
        const apOrderPriceList = billSection.apOrderPriceList;
        if (apOrderPriceList) {
          const apAirFreightIndex = apOrderPriceList.findIndex(
            (item) => item.expenseName === "杂费（航线报价）"
          );
          if (apAirFreightIndex >= 0) {
            billSection.apOrderPriceList.splice(apAirFreightIndex, 1, {
              ...apOrderPriceList[apAirFreightIndex],
              price: miscellaneousFees,
            });
          }
        }
      }
    },
    orderAgentChange({ agentId, agentName, agentPayWay }) {
      const baseInfo = this.$refs.baseInfo;
      if (baseInfo) {
        baseInfo.form.agentId = agentId;
        baseInfo.form.agentName = agentName;
      }
      const billSection = this.$refs.billSection;
      if (billSection) {
        const apOrderPriceList = billSection.apOrderPriceList;
        if (apOrderPriceList) {
          const apAirFreightIndex = apOrderPriceList.findIndex(
            (item) => item.expenseName === "空运费"
          );
          if (apAirFreightIndex >= 0) {
            billSection.apOrderPriceList.splice(apAirFreightIndex, 1, {
              ...apOrderPriceList[apAirFreightIndex],
              expenseUnitId: agentId,
              expenseUnitName: agentName,
            });
          }
          const miscellaneousFeesIndex = apOrderPriceList.findIndex(
            (item) => item.expenseName === "杂费（航线报价）"
          );
          if (miscellaneousFeesIndex >= 0) {
            billSection.apOrderPriceList.splice(miscellaneousFeesIndex, 1, {
              ...apOrderPriceList[miscellaneousFeesIndex],
              expenseUnitId: agentId,
              expenseUnitName: agentName,
            });
          }
        }
      }
      this.orderAgentPayWayChange(agentPayWay);
    },
    orderInboundNoChange(inboundNo) {
      const baseInfo = this.$refs.baseInfo;
      if (baseInfo) {
        baseInfo.form.inboundNo = inboundNo;
      }
      const inboundGuide = this.$refs.inboundGuide;
      if (inboundGuide) {
        inboundGuide.form.inboundNo = inboundNo;
      }
    },
    orderInboundCwChange(inboundCw) {
      // apLinkFlag 应收费用（空运费）联动标志，0=联动，1=不联动
      if (this.order.arLinkFlag === 1) {
        return;
      }
      const billSection = this.$refs.billSection;
      if (billSection) {
        const arOrderPriceList = billSection.arOrderPriceList;
        if (arOrderPriceList) {
          const arAirFreightListIndex = arOrderPriceList.findIndex(
            (listItem) => {
              return listItem.list.find(
                (item) => item.expenseName === "空运费"
              );
            }
          );
          if (arAirFreightListIndex >= 0) {
            let arAirFreightList = arOrderPriceList[arAirFreightListIndex].list;
            const arAirFreightIndex = arAirFreightList.findIndex(
              (item) => item.expenseName === "空运费"
            );
            if (arAirFreightIndex >= 0) {
              arAirFreightList.splice(arAirFreightIndex, 1, {
                ...arAirFreightList[arAirFreightIndex],
                quantity: inboundCw,
              });
            }
            billSection.arOrderPriceList.splice(arAirFreightListIndex, 1, {
              ...billSection.arOrderPriceList[arAirFreightListIndex],
              list: arAirFreightList,
            });
          }
        }
      }
    },
    async orderCostCwChange() {
      const billSection = this.$refs.billSection;
      const bookingForm = this.$refs.bookingForm;
      const inboundData = this.$refs.inboundData;
      if (!bookingForm || !billSection || !inboundData) {
        return;
      }
      let {
        order: {
          bookingWeight,
          bookingCbm,
          inboundWeight,
          inboundCbm,
          costBubblePoint,
        },
      } = await this.getOrderFormData();
      bookingWeight = bookingWeight || this.order.bookingWeight;
      bookingCbm = bookingCbm || this.order.bookingCbm;
      inboundWeight = inboundWeight || this.order.inboundWeight;
      inboundCbm = inboundCbm || this.order.inboundCbm;
      costBubblePoint = costBubblePoint || this.order.costBubblePoint;
      const weight =
        inboundWeight && inboundCbm ? inboundWeight : bookingWeight;
      const volume = inboundWeight && inboundCbm ? inboundCbm : bookingCbm;
      const costCw = this.$utils.getBillingWeight({
        bubblePoint: costBubblePoint,
        weight,
        volume,
      });
      const apOrderPriceList = billSection.apOrderPriceList;
      // apLinkFlag 应付费用（空运费）联动标志，0=联动，1=不联动
      if (this.order.apLinkFlag === 1) {
        return;
      }
      if (apOrderPriceList) {
        const apAirFreightIndex = apOrderPriceList.findIndex(
          (item) => item.expenseName === "空运费"
        );
        if (apAirFreightIndex >= 0) {
          billSection.apOrderPriceList.splice(apAirFreightIndex, 1, {
            ...apOrderPriceList[apAirFreightIndex],
            quantity: costCw,
          });
        }
      }
    },
    orderBookingDataChange({
      bookingCbm,
      bookingCw,
      bookingVwr,
      bookingWeight,
      bubblePoint,
      bookingPiece,
    }) {
      const bookingDataTable = this.$refs.bookingDataTable;
      if (bookingDataTable) {
        bookingDataTable.form.bookingCbm = bookingCbm;
        bookingDataTable.form.bookingCw = bookingCw;
        bookingDataTable.form.bookingVwr = bookingVwr;
        bookingDataTable.form.bookingWeight = bookingWeight;
        bookingDataTable.form.bubblePoint = bubblePoint;
        bookingDataTable.form.bookingPiece = bookingPiece;
      }
      const customerBookingDataTable = this.$refs.customerBookingDataTable;
      if (customerBookingDataTable) {
        customerBookingDataTable.form.bookingCbm = bookingCbm;
        customerBookingDataTable.form.bookingCw = bookingCw;
        customerBookingDataTable.form.bookingVwr = bookingVwr;
        customerBookingDataTable.form.bookingWeight = bookingWeight;
        customerBookingDataTable.form.bubblePoint = bubblePoint;
        customerBookingDataTable.form.bookingPiece = bookingPiece;
      }
      const agentBookingDataTable = this.$refs.agentBookingDataTable;
      if (agentBookingDataTable) {
        agentBookingDataTable.form.bookingCbm = bookingCbm;
        agentBookingDataTable.form.bookingVwr = bookingVwr;
        agentBookingDataTable.form.bookingWeight = bookingWeight;
        agentBookingDataTable.form.bubblePoint = bubblePoint;
        agentBookingDataTable.form.bookingPiece = bookingPiece;
      }
    },
    orderBubblePointChange(bubblePoint) {
      const bookingForm = this.$refs.bookingForm;
      if (bookingForm) {
        bookingForm.form.bubblePoint = bubblePoint;
      }
    },
    orderCostBubblePointChange(costBubblePoint) {
      const bookingForm = this.$refs.bookingForm;
      if (bookingForm) {
        bookingForm.form.costBubblePoint = costBubblePoint;
      }
      const agentBookingDataTable = this.$refs.agentBookingDataTable;
      if (agentBookingDataTable) {
        agentBookingDataTable.form.costBubblePoint = costBubblePoint;
      }
      this.orderCostCwChange();
    },
    orderPayWayChange(payWay) {
      const baseInfo = this.$refs.baseInfo;
      if (baseInfo) {
        baseInfo.form.payWay = payWay;
      }
      const billSection = this.$refs.billSection;
      if (billSection) {
        billSection.form.payWay = payWay;
      }
      const bookingForm = this.$refs.bookingForm;
      if (bookingForm) {
        bookingForm.form.payWay = payWay;
      }
    },
    orderOwnRoteChange(ownRote) {
      const baseInfo = this.$refs.baseInfo;
      if (baseInfo) {
        baseInfo.form.ownRote = ownRote;
      }
      const bookingForm = this.$refs.bookingForm;
      if (bookingForm) {
        bookingForm.form.ownRote = ownRote;
      }
    },
    orderAgentPayWayChange(agentPayWay) {
      const baseInfo = this.$refs.baseInfo;
      if (baseInfo) {
        baseInfo.form.agentPayWay = agentPayWay || 0;
      }
      const billSection = this.$refs.billSection;
      if (billSection) {
        billSection.form.agentPayWay = agentPayWay || 0;
        const apOrderPriceList = billSection.apOrderPriceList;
        if (apOrderPriceList) {
          const apAirFreightIndex = apOrderPriceList.findIndex(
            (item) => item.expenseName === "空运费"
          );
          if (apAirFreightIndex >= 0) {
            billSection.apOrderPriceList.splice(apAirFreightIndex, 1, {
              ...apOrderPriceList[apAirFreightIndex],
              feePayWay: agentPayWay || 0,
            });
          }
        }
      }
    },
    async getSettlementMethod() {
      try {
        const {
          data: {
            data: { payWayEnumList, message },
          },
        } = await this.$api.getSettlementMethod(
          {},
          {
            params: {
              orderId: this.orderId,
            },
          }
        );
        this.settlementTypes = payWayEnumList.map((item) => Number(item.key));
        this.settlementWarningText = message;
      } catch (error) {}
    },
    orderCostCurrencyChange(costCurrency) {
      const baseInfo = this.$refs.baseInfo;
      if (baseInfo) {
        baseInfo.form.costCurrency = costCurrency;
      }
      const bookingForm = this.$refs.bookingForm;
      if (bookingForm) {
        bookingForm.form.costCurrency = costCurrency;
      }
      const billSection = this.$refs.billSection;
      if (billSection) {
        const apOrderPriceList = billSection.apOrderPriceList;
        if (apOrderPriceList) {
          const apAirFreightIndex = apOrderPriceList.findIndex(
            (item) => item.expenseName === "空运费"
          );
          if (apAirFreightIndex >= 0) {
            billSection.$refs["apPriceTable"].currencyChange({
              val: costCurrency,
              index: apAirFreightIndex,
            });
          }
        }
      }
    },
    orderBookingCurrencyChange(bookingCurrency) {
      const baseInfo = this.$refs.baseInfo;
      if (baseInfo) {
        baseInfo.form.bookingCurrency = bookingCurrency;
      }
      const bookingForm = this.$refs.bookingForm;
      if (bookingForm) {
        bookingForm.form.bookingCurrency = bookingCurrency;
      }
      const billSection = this.$refs.billSection;
      if (billSection) {
        const arOrderPriceList = billSection.arOrderPriceList;
        if (arOrderPriceList) {
          const arAirFreightListIndex = arOrderPriceList.findIndex(
            (listItem) => {
              return listItem.list.find(
                (item) => item.expenseName === "空运费"
              );
            }
          );
          if (arAirFreightListIndex >= 0) {
            let arAirFreightList = arOrderPriceList[arAirFreightListIndex].list;
            const arAirFreightIndex = arAirFreightList.findIndex(
              (item) => item.expenseName === "空运费"
            );
            if (arAirFreightIndex >= 0) {
              billSection.$refs[
                `arPriceTable-${arAirFreightListIndex}`
              ][0].currencyChange({
                val: bookingCurrency,
                index: arAirFreightIndex,
              });
            }
          }
        }
      }
    },
  },
  watch: {
    
    informOrderNo: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.init();
          this.$store.commit("changeWarnOrderNo", "");
        }
      },
      deep: true,
      immediate: true, //立即执行
    },
    // "$route.query.tab"() {
    //   this.init();
    // },
    "$route.query.id"() {
      this.init();
      if (this.$route.query.tab == 2) {
        this.activeTab = "账单";
      } else if (this.$route.query.tab == 3) {
        this.activeTab = "进仓指引";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.order-detail-new {
  height: calc(100vh - 81px);
  background: #f3f6f9;
  .order-detail-wrap {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
    height: 100%;
    .detail-header {
      // box-shadow: 0 0 3px red;
    }
    .detail-main {
      margin-right: -10px;
      flex: 1;
      // box-shadow: 0 0 3px blue;
      overflow: auto;
    }
  }
  /deep/.dc-primeval-table {
    background: #f6f6f6;
    thead {
      color: #333;
      background: #f5f7fa;
    }
  }
  /deep/.el-input__inner,
  /deep/.el-textarea__inner,
  /deep/.el-input__count-inner,
  /deep/.el-input__count {
    background: #fff;
    &:disabled {
      background: #f5f7fa;
    }
  }
  /deep/.el-input__suffix {
    height: auto;
  }
  .booking-data-row {
    display: flex;
    .title {
      font-weight: bold;
      line-height: 30px;
    }
    /deep/.dc-primeval-table {
      td {
        line-height: 30px;
      }
    }
  }
  /deep/.order-tabs{
    position: relative;
    .el-radio-group{
      position: -webkit-sticky; /* Safari */
      position: sticky;
      top: 0;
      left: 0;
      z-index: 99;
      // transform: translateX(50%);
    }
    .order-tab-pane{
      margin-top: 16px;
    }
  }
  /deep/ .paneLine{
    .el-radio-group{
      position: relative !important;
      z-index: auto !important;
    }
  }
}
</style>