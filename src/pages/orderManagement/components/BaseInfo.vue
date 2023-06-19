<template>
  <!-- 订单基本信息 -->
  <div class="base-info dc-custom-shadow"  :class="minHeightYn?'dc-custom-shadow-minHeight':''">
    <div class="switchoverButton" style="cursor: pointer;" @click="$store.commit('changeInfoHeadFromZoom',!minHeightYn)">
      <i class="el-icon-d-arrow-left"></i>
    </div>
    <dc-form
      :rules="computedRules"
      :disabled="orderDisableds.orderDisabled"
      ref="form"
      inline
      :model="form"
      size="mini"
      class="base-info-form form-label-auto"
      label-width="100px"
    >
      <div class="form-row">
        <el-form-item label="订单号" prop="orderNo">
          <span id="infoOrderNoId" v-auth-field:[form.orderNo]="['105010_FC']"></span>
        </el-form-item>
        <el-form-item label="客户" prop="companyName">
          <span v-auth-field:[form.companyName]="['101000_FC']"></span>
        </el-form-item>
        <el-form-item label="进仓编号" prop="inboundNo">
          <div v-auth-field:[form.inboundNo]="['102000_FC']">
            <el-input
              v-model.trim="form.inboundNo"
              :disabled="orderDisableds.inboundGuideDisabled"
              placeholder="进仓编号"
              maxlength="20"
              show-word-limit
              clearable
              @change="$emit('orderInboundNoChange', form.inboundNo)"
            />
          </div>
        </el-form-item>
        <el-form-item label="运单号" prop="waybillNo">
          <template #label>
            <dc-img
              name="orderNo"
              type="svg"
              style="width: 15px; cursor: pointer"
              v-auth:none="['152700_M']"
              @click="
                $router.push({
                  name: 'ladingBillDownLoad',
                  params: { orderNo: order.orderNo },
                })
              "
            />
            <span>运单号</span>
          </template>
          <div v-auth-field:[form.waybillNo]="['105000_FC']">
            <el-input
              v-model.trim="form.waybillNo"
              maxlength="30"
              placeholder="运单号"
              show-word-limit
              clearable
            />
          </div>
        </el-form-item>
        <el-form-item label="分单号" prop="subWaybillNo">
          <div v-auth-field:[form.subWaybillNo]="['105005_FC']">
            <el-input
              v-model.trim="form.subWaybillNo"
              maxlength="100"
              placeholder="英文逗号隔开"
              show-word-limit
              clearable
            />
          </div>
        </el-form-item>
      </div>
      <div class="form-row">
        <el-form-item label="起运港" prop="pol">
          <div v-auth-field:[form.pol]="['101010_FC']">
            <dc-select
              v-model="form.pol"
              filterable
              remote
              placeholder="起运港"
              :remote-method="getPols"
              :disabled="orderDisableds.polDisabled"
              @change="$emit('orderPolChange', form.pol)"
            >
              <el-option
                v-for="item in pols"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span>{{ item.detailText }}</span>
              </el-option>
            </dc-select>
          </div>
        </el-form-item>
        <el-form-item label="目的港" prop="pod">
          <div v-auth-field:[form.pod]="['101020_FC']">
            <dc-select
              v-model="form.pod"
              filterable
              remote
              placeholder="目的港"
              :remote-method="getPods"
              :disabled="orderDisableds.podDisabled"
              @change="$emit('orderPodChange', form.pod)"
            >
              <el-option
                v-for="item in pods"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span>{{ item.detailText }}</span>
              </el-option>
            </dc-select>
          </div>
        </el-form-item>
        <el-form-item label="航司" prop="airCompany">
          <div v-auth-field:[form.airCompany]="['101030_FC']">
            <dc-select
              v-model="form.airCompany"
              :disabled="orderDisableds.airCompanyDisabled"
              filterable
              remote
              :remote-method="getAirCompanysByKeyWord"
              @change="airCompanyChange"
            >
              <el-option
                v-for="item in airCompanys"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </dc-select>
          </div>
        </el-form-item>
        <el-form-item label="航班日期" prop="departureDate">
          <div v-auth-field:[form.departureDate]="['101040_FC']">
            <el-date-picker
              v-model="form.departureDate"
              :disabled="orderDisableds.departureDateDisabled"
              type="datetime"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              placeholder="选择航班日期"
              :clearable="false"
            />
          </div>
        </el-form-item>
        <el-form-item label="航班号" prop="flightNo">
          <div v-auth-field:[form.flightNo]="['105050_FC']">
            <el-input
              v-model.trim="form.flightNo"
              :disabled="orderDisableds.flightNoDisabled"
              placeholder="航班号"
              maxlength="30"
              show-word-limit
              clearable
            />
          </div>
        </el-form-item>
      </div>
      <div class="form-row">
        <el-form-item label="订舱单价" prop="bookingPrice">
          <div v-auth-field:[form.bookingPrice]="['101140_FC']">
            <el-input
              v-model.trim="form.bookingPrice"
              :disabled="orderDisableds.bookingPriceDisabled"
              placeholder="订舱单价"
              clearable
              @change="
                changeZeroHandler({
                  key: 'bookingPrice',
                })
              "
            >
              <template slot="append">
                <el-select
                  v-model="form.bookingCurrency"
                  placeholder="币种"
                  style="width: 100px"
                  :disabled="orderDisableds.bookingPriceDisabled"
                  @change="
                    $emit('orderBookingCurrencyChange', form.bookingCurrency)
                  "
                >
                  <el-option
                    v-for="item in currencyTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  >
                    <span>{{ item.label }}</span>
                    <span
                      style="font-size: 12px; color: red"
                      v-if="item.disabled"
                      >暂未设置航班日期所在月份的汇率</span
                    >
                  </el-option>
                </el-select>
              </template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="订单利润" prop="orderProfit">
          <span v-auth-field:[form.orderProfit]="['104030_FC']"></span>
        </el-form-item>
        <el-form-item label="代理" prop="agentName">
          <div v-auth-field:[form.agentName]="['101160_FC']">
            <dc-select
              v-model="form.agentName"
              filterable
              remote
              :remote-method="getAgentList"
              placeholder="请选择代理"
              :disabled="orderDisableds.agentDisabled"
              @change="agentChange"
            >
              <el-option
                v-for="item in agentList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </dc-select>
          </div>
        </el-form-item>
        <el-form-item label="成本价" prop="costPrice">
          <div v-auth-field:[form.costPrice]="['101525_FC']">
            <el-input
              v-model.trim="form.costPrice"
              :disabled="orderDisableds.costPriceDisabled"
              placeholder="成本价"
              clearable
              @change="
                changeZeroHandler({
                  key: 'costPrice',
                })
              "
            >
              <template slot="append">
                <el-select
                  v-model="form.costCurrency"
                  placeholder="币种"
                  style="width: 100px"
                  :disabled="orderDisableds.costPriceDisabled"
                  @change="$emit('orderCostCurrencyChange', form.costCurrency)"
                >
                  <el-option
                    v-for="item in currencyTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  >
                    <span>{{ item.label }}</span>
                    <span
                      style="font-size: 12px; color: red"
                      v-if="item.disabled"
                      >暂未设置航班日期所在月份的汇率</span
                    >
                  </el-option>
                </el-select>
              </template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="杂费(航线报价)" prop="miscellaneousFees">
          <div v-auth-field:[form.miscellaneousFees]="['101527_FC']">
            <el-input
              v-model.trim="form.miscellaneousFees"
              :disabled="orderDisableds.miscellaneousFeesDisabled"
              placeholder="杂费"
              clearable
              @change="
                changeZeroHandler({
                  key: 'miscellaneousFees',
                })
              "
              ><template slot="prepend">￥</template></el-input
            >
          </div>
        </el-form-item>
        <el-form-item label="是否为自有航线" prop="ownRote">
          <div v-auth-field:[ownRoteText]="['101529_FC']">
            <dc-select
              v-model="form.ownRote"
              filterable
              placeholder="是否为自有航线"
              :disabled="orderDisableds.ownRoteDisabled"
              @change="$emit('orderOwnRoteChange', form.ownRote)"
            >
              <el-option
                v-for="item in ownRotes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </dc-select>
          </div>
        </el-form-item>
        <!-- <el-form-item label="单票结算方式" prop="payWay">
          <div v-auth-field:[payWayText]="['104000_FC']">
            <el-select
              v-model="form.payWay"
              placeholder="单票结算方式"
              @change="$emit('orderPayWayChange', form.payWay)"
            >
              <el-option
                v-for="item in payWays"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-show="item.show"
              />
            </el-select>
          </div>
        </el-form-item> -->
        <el-form-item label="代理结算方式" prop="payWay">
          <div v-auth-field:[agentPayWayText]="['104001_FC']">
            <el-select
              v-model="form.agentPayWay"
              placeholder="代理结算方式"
              :disabled="agentPayWayDisabled"
              @change="$emit('orderAgentPayWayChange', form.agentPayWay)"
            >
              <el-option
                v-for="item in computedAgentPayWays"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </div>
        </el-form-item>
      </div>
      <div class="form-row">
        <el-form-item label="售前客服" prop="pscsName">
          <div v-auth-field:[form.pscsName]="['105020_FC']">
            <dc-select
              v-model="form.pscsName"
              filterable
              placeholder="请选择售前客服"
              @change="pscsChange"
            >
              <el-option
                v-for="item in pscsList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </dc-select>
          </div>
        </el-form-item>
        <el-form-item label="航线" prop="principalName">
          <div v-auth-field:[form.principalName]="['105030_FC']">
            <dc-select
              v-model="form.principalName"
              filterable
              placeholder="请选择航线"
              @change="principalChange"
            >
              <el-option
                v-for="item in principalList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </dc-select>
          </div>
        </el-form-item>
        <el-form-item label="操作" prop="mscsName">
          <div v-auth-field:[form.mscsName]="['105035_FC']">
            <dc-select
              v-model="form.mscsName"
              filterable
              placeholder="请选择操作"
              @change="mscsChange"
            >
              <el-option
                v-for="item in mscsList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </dc-select>
          </div>
        </el-form-item>
        <el-form-item label="客户负责人" prop="customerResponsibleName">
          <div
            v-auth-field:[form.customerResponsibleName]="['101535_FC']"
          ></div>
        </el-form-item>
        <el-form-item label="订单所属公司" prop="sysOrgName">
          <div v-auth-field:[form.sysOrgName]="['101531_FC']"></div>
        </el-form-item>
      </div>
    </dc-form>
  </div>
</template>

<script>
import DcStatus from "@/status";
// 需要父子通信的数据
const OrderKeys = [
  "orderNo", // 订单号
  "pol", // 起运港
  "pod", // 目的港
  "airCompanyCode", // 航司代码
  "airCompanyName", // 航司名
  "flightNo", // 航班号
  "bookingPrice", // 订舱单价
  "costPrice", // 订舱价格(成本)
  "miscellaneousFees", // 杂费(航线报价)
  "ownRote", // 是否为自有航线
  "waybillNo", // 运单号
  "subWaybillNo", // 分单号
  "departureDate", // 航班日期
  "orderProfit", // 订单利润
  "companyName", // 认证主体名
  "agentId", // 代理id
  "agentName", // 代理名
  "inboundNo", // 进仓编号
  "principalId", // 航线id
  "principalName", // 航线负责人
  "pscsId", // 售前id
  "pscsName", // 售前
  "mscsId", // 售中id
  "mscsName", // 售中
  "payWay", // 结算方式
  "agentPayWay", // 代理结算方式
  "customerResponsibleName", // 客户负责人
  "sysOrgName", // 订单所属公司
  "costCurrency", // 成本币种
  "bookingCurrency", // 售价币种
];
export default {
  name: "BaseInfo",
  created() {
    this.init();
  },
  props: {
    order: {
      type: Object,
      default: () => ({}),
    },
    pscsList: {
      type: Array,
      default: () => [],
    },
    mscsList: {
      type: Array,
      default: () => [],
    },
    principalList: {
      type: Array,
      default: () => [],
    },
    agentList: {
      type: Array,
      default: () => [],
    },
    airCompanys: {
      type: Array,
      default: () => [],
    },
    getAgentList: {
      type: Function,
      default: () => {},
    },
    getAirCompanysByKeyWord: {
      type: Function,
      default: () => {},
    },
    getPols: {
      type: Function,
      default: () => {},
    },
    getPods: {
      type: Function,
      default: () => {},
    },
    pols: {
      type: Array,
      default: () => [],
    },
    pods: {
      type: Array,
      default: () => [],
    },
    payWays: {
      type: Array,
      default: () => [],
    },
    currencyTypes: {
      type: Array,
      default: () => [],
    },
    orderDisableds: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const { agentPayWays, ownRotes } = DcStatus.commonStatus;
    return {
      minHeightYn:false,
      form: {},
      agentPayWays,
      ownRotes,
    };
  },
  computed: {
    heightYn(){
			return this.$store.state.infoHeadFromZoom
		},
    computedAgent() {
      const { agentList, form } = this;
      return agentList.find((item) => item.id === form.agentId);
    },
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
    ownRoteText() {
      const ownRote = DcStatus.commonStatus.getStatus(
        "ownRotes",
        this.form.ownRote
      );
      return (ownRote || {}).label;
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
    computedRules() {
      return {
        bookingPrice: [
          {
            required: true,
            message: "请填写订舱单价",
          },
        ],
        costPrice: [
          {
            required: true,
            message: "请填写成本价(航线报价)",
          },
        ],
        ownRote: [
          {
            required: true,
            message: "请填写成本价(航线报价)",
            trigger: "change",
          },
        ],
        pscsName: [
          {
            required: true,
            message: "请选择售前客服",
            trigger: "change",
          },
        ],
        mscsName: [
          {
            required: ![1, 2].includes(this.order.status),
            message: "请选择操作",
            trigger: "change",
          },
        ],
        principalName: [
          {
            required: ![1].includes(this.order.status),
            message: "请选择航线负责人",
            trigger: "change",
          },
        ],
        agentName: [
          {
            required: ![1, 2].includes(this.order.status),
            message: "请选择代理公司",
            trigger: "change",
          },
        ],
        flightNo: [
          {
            required: [37, 41, 43].includes(this.order.status),
            message: "请填写航班号",
          },
        ],
        waybillNo: [
          {
            required: ![1, 2, 3, 9, 13, 15, 17].includes(this.order.status),
            message: "请填写运单号",
          },
          (() => {
            const required = ![1, 2, 3, 9, 13, 15, 17].includes(
              this.order.status
            );
            return {
              required,
              validator: (rule, value, callback) => {
                const waybillNoTest = /^[A-Za-z0-9\-]{1,30}$/.test(value);
                if (!waybillNoTest && required) {
                  this.$message.error(`运单号应由字母，数字和字符"-"组成`);
                  callback(new Error("运单号格式错误"));
                }
                callback();
              },
              trigger: "blur",
            };
          })(),
        ],
        airCompany: [
          {
            required: [37, 41, 43].includes(this.order.status),
            message: "请选择航司",
            trigger: "change",
          },
        ],
      };
    },
    departureDatePickerOptions() {
      return {
        disabledDate: (time) => {
          return time.getTime() < new Date().getTime() - 24 * 60 * 60 * 1000;
        },
      };
    },
  },
  methods: {
    init() {
      const form = this.$utils.copyDataByKeys(this.order, OrderKeys);
      this.form = {
        ...form,
        airCompany: `${form.airCompanyCode}-${form.airCompanyName}`,
      };
    },
    airCompanyChange(val) {
      const {
        value: airCompanyCode,
        name: airCompanyName,
        airCompany,
      } = this.airCompanys.find((item) => item.value === val);
      this.form = {
        ...this.form,
        airCompanyCode,
        airCompanyName,
        airCompany,
      };
      this.$emit("orderAirCompanyChange", {
        airCompanyCode,
        airCompanyName,
      });
    },
    agentChange(val) {
      const {
        value: agentId,
        label: agentName,
        settlementWay,
      } = this.agentList.find((item) => item.value === val);
      const agentPayWay =
        this.$utils.getAgentPayWayBySettlementWay(settlementWay);
      this.form = {
        ...this.form,
        agentId,
        agentName,
        agentPayWay,
      };
      this.$emit("orderAgentChange", {
        agentId,
        agentName,
        agentPayWay,
      });
    },
    pscsChange(val) {
      const { value: pscsId, label: pscsName } = this.pscsList.find(
        (item) => item.value === val
      );
      this.form = {
        ...this.form,
        pscsId,
        pscsName,
      };
    },
    mscsChange(val) {
      const { value: mscsId, label: mscsName } = this.mscsList.find(
        (item) => item.value === val
      );
      this.form = {
        ...this.form,
        mscsId,
        mscsName,
      };
    },
    principalChange(val) {
      const { value: principalId, label: principalName } =
        this.principalList.find((item) => item.value === val);
      this.form = {
        ...this.form,
        principalId,
        principalName,
      };
      this.$emit("orderPrincipalChange", {
        principalId,
        principalName,
      });
    },
    // formatKey 查表用的字段名
    inputHandler({ key, newVal, oldVal, formatKey }) {
      formatKey = formatKey || key;
      const val = this.$utils.getValidNumber({
        format: DcStatus.numberFormat[formatKey],
        newVal,
        oldVal,
      });
      this.form[key] = val;
    },
    formValidate(isValidate = true) {
      const formData = this.getFormData();
      if (!isValidate) {
        return Promise.resolve(formData);
      }
      return new Promise((resolve, reject) => {
        this.$refs.form.form.validate((valid, errorKeys) => {
          if (valid) {
            resolve(formData);
          } else {
            Object.entries(errorKeys).find(([key, val]) => {
              if (val[0]) {
                this.$message.error(val[0].message);
                return true;
              }
            });
            reject();
            return false;
          }
        });
      });
    },
    getFormData() {
      const order = this.$utils.copyDataByKeys(this.order, OrderKeys);
      const form = Object.entries(order).reduce((obj, [key, val]) => {
        if (
          val !== this.form[key] &&
          val !== Number(this.form[key]) &&
          this.form[key] !== "null" &&
          this.form[key] !== null
        ) {
          obj = {
            ...obj,
            [key]: this.form[key],
          };
        }
        return obj;
      }, {});
      return form;
    },
    changeZeroHandler({ key }) {
      const newVal = Number(this.form[key]);
      if (newVal === 0) {
        this.form[key] = "";
        this.orderChange(key, "");
        return;
      }
      this.orderChange(key, newVal);
    },
    orderChange(key, val) {
      switch (key) {
        case "bookingPrice":
          this.$emit("orderBookingPriceChange", val);
          break;
        case "costPrice":
          this.$emit("orderCostPriceChange", val);
          break;
        case "miscellaneousFees":
          this.$emit("orderMiscellaneousFeesChange", val);
          break;
        default:
          break;
      }
    },
  },
  watch: {
    heightYn:{
      handler(newVal, oldVal){
        this.minHeightYn = newVal
      },
      deep:true,
      immediate: true,//立即执行
    },
    "form.bookingPrice"(newVal, oldVal) {
      if (![null, "null"].includes(newVal)) {
        this.inputHandler({ key: "bookingPrice", newVal, oldVal });
      }
    },
    "form.costPrice"(newVal, oldVal) {
      if (![null, "null"].includes(newVal)) {
        this.inputHandler({ key: "costPrice", newVal, oldVal });
      }
    },
    "form.miscellaneousFees"(newVal, oldVal) {
      if (![null, "null"].includes(newVal)) {
        this.inputHandler({ key: "miscellaneousFees", newVal, oldVal });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.dc-custom-shadow-minHeight{
  height: 100px;
  overflow: scroll;
  margin-right: -10px;

}
.dc-custom-shadow-minHeight::-webkit-scrollbar-track-piece{
  opacity: 0;
  background-color: rgba(1, 1, 1, 0)
}
.dc-custom-shadow-minHeight::-webkit-scrollbar{
  opacity: 0;
  background-color: #f3f6f9;
}
.dc-custom-shadow-minHeight::-webkit-scrollbar-corner{
  opacity: 0 !important;
  background-color: #f3f6f9;
}
.dc-custom-shadow{
  position: relative;
}
.dc-custom-shadow .switchoverButton .el-icon-d-arrow-left{
  font-size: 30px;
  font-weight: bold;
  color: rgb(64, 158, 255);
}
.dc-custom-shadow .switchoverButton{
  position: absolute;
  top: 12px;
  right: 12px;
  
  // width: 40px;
  // height: 40px;
  transition: transform 0.5s ease;
  -webkit-transition:transform 0.5s ease; /* Safari */
  transform:rotate(90deg);
  -ms-transform:rotate(90deg); /* IE 9 */
  -webkit-transform:rotate(90deg); /* Safari and Chrome */
}
.dc-custom-shadow-minHeight .switchoverButton{
  transform:rotate(270deg);
  -ms-transform:rotate(270deg); /* IE 9 */
  -webkit-transform:rotate(270deg); /* Safari and Chrome */
}
.base-info {
  background: #fff;
  .base-info-form {
    margin-right: 10px;
    padding: 10px;
    padding-bottom: 0;
    .form-row {
      &:nth-of-type(1) {
        margin-top: 0;
      }
    }
    .el-form-item {
      margin-bottom: 14px !important;
      margin-right: 40px;
      width: 280px;
      color: #02aff0;
      /deep/&__label {
        color: #02aff0;
      }
    }
    /deep/.el-form-item__error {
      min-width: 172px;
      transform: translateY(1px);
    }
    /deep/.auth-field-none + .el-form-item__error {
      display: none;
    }
  }
}
</style>