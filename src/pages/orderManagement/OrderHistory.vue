<template>
  <dc-page class="order-history">
    <template #search>
      <el-form-item>
        <el-date-picker
          v-model="form.createDate1"
          type="date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          placeholder="起始日期"
          :picker-options="createDate1PickerOptions"
        />
        <span style="margin: 0 10px">-</span>
        <el-date-picker
          v-model="form.createDate2"
          type="date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          placeholder="结束日期"
          :picker-options="createDate2PickerOptions"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="form.partiId" placeholder="操作人" clearable>
          <el-option
            v-for="item in orderHistoryPartis"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="form.statusLabel"
          placeholder="订单状态"
          clearable
          @change="statusChange"
        >
          <el-option
            v-for="item in statusList"
            :key="item.label"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="form.changeFlag" placeholder="颜色筛选" clearable>
          <el-option
            v-for="item in changeFlags"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="currentPageChange(1)">搜索</el-button>
      </el-form-item>
    </template>
    <template #table="{ height }">
      <dc-table
        v-loading="tableLoading"
        :max-height="height"
        :columns="computedColumns"
        :data="computedList"
        :total="total"
        :current-page="form.pageNum"
        :page-size="form.pageSize"
        @page-size-change="pageSizeChange"
        @current-page-change="currentPageChange"
        @selection-change="handleSelectionChange"
        border
        row-key="id"
        :cell-style="cellStyle"
      >
        <template #partiName="{ row }">
          <div v-if="row.showPrivacy">***</div>
          <div v-if="!row.showPrivacy">
            <i class="el-icon-s-custom" v-if="row.showPartiAvatar"></i
            >{{ row.partiName }}
          </div>
        </template>
        <template #statusDesc="{ row }">
          <div v-auth-field:[row.statusDesc]="['105135_FC']">
            {{ row.statusDesc }}
          </div>
        </template>
        <template #pol="{ row }">
          <div v-auth-field:[row.pol]="['101010_FC']">{{ row.pol }}</div>
        </template>
        <template #pod="{ row }">
          <div v-auth-field:[row.pod]="['101020_FC']">{{ row.pod }}</div>
        </template>
        <template #airCompanyCode="{ row }">
          <div v-auth-field:[row.airCompanyCode]="['101030_FC']">
            {{ row.airCompanyCode }}
          </div>
        </template>
        <template #departureDate="{ row }">
          <div v-auth-field:[row.departureDate]="['101040_FC']">
            {{ row.departureDate }}
          </div>
        </template>
        <template #bookingPrice="{ row }">
          <div v-auth-field:[row.bookingPrice]="['101140_FC']">
            {{ row.bookingPrice }}
          </div>
        </template>
        <template #bubblePointText="{ row }">
          <div v-auth-field:[row.bubblePointText]="['101150_FC']">
            {{ row.bubblePointText }}
          </div>
        </template>
        <template #costBubblePointText="{ row }">
          <div v-auth-field:[row.costBubblePointText]="['101530_FC']">
            {{ row.costBubblePointText }}
          </div>
        </template>
        <template #agentName="{ row }">
          <div v-auth-field:[row.agentName]="['101160_FC']">
            {{ row.agentName }}
          </div>
        </template>
        <template #inboundNo="{ row }">
          <div v-auth-field:[row.inboundNo]="['102000_FC']">
            {{ row.inboundNo }}
          </div>
        </template>
        <template #warehouseName="{ row }">
          <div v-auth-field:[row.warehouseName]="['102015_FC']">
            {{ row.warehouseName }}
          </div>
        </template>
        <template #customsAddress="{ row }">
          <div v-auth-field:[row.customsAddress]="['102022_FC']">
            {{ row.customsAddress }}
          </div>
        </template>
        <template #warehouseAddress="{ row }">
          <div v-auth-field:[row.warehouseAddress]="['102020_FC']">
            {{ row.warehouseAddress }}
          </div>
        </template>
        <template #inboundCw="{ row }">
          <div v-auth-field:[row.inboundCw]="['103010_FC']">
            {{ row.inboundCw }}
          </div>
        </template>
        <template #waybillNo="{ row }">
          <div v-auth-field:[row.waybillNo]="['102000_FC']">
            {{ row.waybillNo }}
          </div>
        </template>
        <template #mscsName="{ row }">
          <div v-auth-field:[row.mscsName]="['105035_FC']">
            {{ row.mscsName }}
          </div>
        </template>
      </dc-table>
    </template>
  </dc-page>
</template>

<script>
import DcStatus from "@/status";
const PAGE_NUM = 1;
const PAGE_SIZE = 10;
export default {
  name: "OrderHistory",
  created() {
    this.init();
  },
  data() {
    return {
      tableLoading: false,
      form: {
        statusLabel: "",
        changeFlag: "",
        createDate1: "",
        createDate2: "",
        pageNum: PAGE_NUM,
        pageSize: PAGE_SIZE,
        partiId: "",
        status: "",
        activityCodeDoing: "",
        activityCodeDone: "",
      },
      list: [],
      total: 0,
      changeFlags: [
        {
          value: 0,
          label: "黑色",
        },
        {
          value: 1,
          label: "红色",
        },
      ],
      columns: [
        {
          prop: "createTime",
          label: "时间",
          "min-width": 160,
        },
        {
          prop: "partiName",
          label: "操作人",
          "min-width": 120,
        },
        {
          prop: "statusDesc",
          label: "订单状态",
          authFieldCodes: ["105135_FC"],
          "min-width": 120,
        },
        {
          prop: "pol",
          label: "起运港",
          authFieldCodes: ["101010_FC"],
        },
        {
          prop: "pod",
          label: "目的港",
          authFieldCodes: ["101020_FC"],
        },
        {
          prop: "airCompanyCode",
          label: "航司",
          authFieldCodes: ["101030_FC"],
        },
        {
          prop: "departureDate",
          label: "航班日期",
          authFieldCodes: ["101040_FC"],
          "min-width": 100,
        },
        {
          prop: "bookingPrice",
          label: "单价",
          authFieldCodes: ["101140_FC"],
        },
        {
          prop: "bubblePointText",
          label: "分泡",
          authFieldCodes: ["101150_FC"],
        },
        {
          prop: "costPrice",
          label: "成本单价",
          authFieldCodes: ["101525_FC"],
        },
        {
          prop: "costBubblePointText",
          label: "代理分泡",
          authFieldCodes: ["101530_FC"],
        },
        {
          prop: "agentName",
          label: "代理",
          authFieldCodes: ["101160_FC"],
          "min-width": 160,
        },
        {
          prop: "inboundNo",
          label: "进仓编号",
          authFieldCodes: ["102000_FC"],
          "min-width": 140,
        },
        {
          prop: "warehouseName",
          label: "仓库名称",
          authFieldCodes: ["102015_FC"],
        },
        {
          prop: "warehouseAddress",
          label: "仓库地址",
          authFieldCodes: ["102020_FC"],
          "min-width": 160,
        },
        {
          prop: "customsAddress",
          label: "寄单地址",
          authFieldCodes: ["102022_FC"],
          "min-width": 200,
        },
        {
          prop: "inboundCw",
          label: "计费重",
          authFieldCodes: ["103010_FC"],
        },
        {
          prop: "waybillNo",
          label: "运单号",
          authFieldCodes: ["102000_FC"],
          "min-width": 100,
        },
        {
          prop: "mscsName",
          label: "操作",
          authFieldCodes: ["105035_FC"],
          "min-width": 120,
        },
      ],
      statusList: [
        {
          label: "待分配航线",
          value: 2,
        },
        {
          label: "待平台审核",
          value: 3,
        },
        {
          label: "待进仓",
          value: 9,
        },
        {
          label: "待平台出进仓数据",
          value: 13,
        },
        {
          label: "进仓数据待确认",
          value: 17,
          activityCodeDoing: "CZ_SJQR",
          activityCodeDone: "CZ_JCSJ",
        },
        {
          label: "进仓数据重新测量中",
          value: 15,
        },
        {
          label: "进仓数据再次确认",
          value: 17,
          activityCodeDoing: "CZ_SJQR",
          activityCodeDone: "CZ_CXCL",
        },
        {
          label: "操作中,待完成",
          value: 21,
        },
        {
          label: "待海海关放行",
          value: 25,
        },
        {
          label: "海关查验中",
          value: 27,
        },
        {
          label: "查验异常,待处理",
          value: 29,
        },
        {
          label: "待机场安检",
          value: 31,
        },
        {
          label: "安检异常,待处理",
          value: 33,
        },
        {
          label: "飞机待起运",
          value: 37,
        },
        {
          label: "飞机待到达",
          value: 41,
        },
        {
          label: "飞机已到达",
          value: 43,
        },
        {
          label: "订单已取消",
          value: 39,
        },
      ],
      orderHistoryPartis: [],
    };
  },
  computed: {
    searchForm() {
      const {
        changeFlag,
        createDate1,
        createDate2,
        pageNum,
        pageSize,
        partiId,
        status,
        activityCodeDoing,
        activityCodeDone,
      } = this.form;
      return {
        changeFlag,
        createDate1,
        createDate2,
        pageNum,
        pageSize,
        partiId,
        status,
        activityCodeDoing,
        activityCodeDone,
      };
    },
    orderId() {
      return this.$route.query.id;
    },
    computedList() {
      return this.list.map((item) => {
        const { bubblePoint, partiType, partiId, costBubblePoint } = item;
        const currentBubblePoint =
          DcStatus.commonStatus.getStatus("bubblePoints", bubblePoint) || {};
        const currentCostBubblePoint =
          DcStatus.commonStatus.getStatus("bubblePoints", costBubblePoint) ||
          {};
        return {
          ...item,
          bubblePointText: currentBubblePoint.label,
          costBubblePointText: currentCostBubblePoint.label,
          showPartiAvatar: partiType === 1,
          showPrivacy: partiId === null, // 脱敏展示
        };
      });
    },
    computedColumns() {
      return this.columns
        .filter((item) => {
          // 留个筛选的口子
          // const authField = this.getAuthFieldListStatus(item.authFieldCodes);
          // return authField.view || authField.edit;
          return true;
        })
        .map((item) => {
          return {
            ...item,
          };
        });
    },
    createDate1PickerOptions() {
      return {
        disabledDate: (time) => {
          const createDate2 = new Date(this.form.createDate2).getTime();
          if (!createDate2) {
            return false;
          }
          return time.getTime() > createDate2;
        },
      };
    },
    createDate2PickerOptions() {
      return {
        disabledDate: (time) => {
          const createDate1 = new Date(this.form.createDate1).getTime();
          return time.getTime() < createDate1 - 60 * 60 * 1000 * 24;
        },
      };
    },
  },
  methods: {
    init() {
      if (!this.orderId) {
        return;
      }
      this.getList();
      this.getOrderHistoryPartis();
    },
    pageSizeChange(size) {
      this.form.pageSize = size;
      this.getList();
    },
    currentPageChange(page) {
      this.form.pageNum = page || this.form.pageNum;
      this.getList();
    },
    async getList() {
      this.tableLoading = true;
      try {
        const {
          data: {
            data: { records, total },
          },
        } = await this.$api.getOrderHistory({
          orderId: this.orderId,
          ...this.searchForm,
        });
        this.list = records;
        this.total = total;
      } catch (error) {
      } finally {
        this.tableLoading = false;
      }
    },
    async getOrderHistoryPartis() {
      try {
        const {
          data: { data },
        } = await this.$api.getOrderHistoryPartis({
          params: {
            orderId: this.orderId,
          },
        });
        this.orderHistoryPartis = data.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
      } catch (error) {}
    },
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
    cellStyle({ row, column, rowIndex, columnIndex }) {
      const changedFields = row.changedFields.map((item) => {
        switch (item) {
          case "bubblePoint":
            return "bubblePointText";
          case "costBubblePoint":
            return "costBubblePointText";
          default:
            return item;
        }
      });
      if (changedFields.includes(column.property)) {
        return {
          color: "red",
        };
      }
    },
    statusChange(label) {
      const status = this.statusList.find((item) => item.label === label);
      if (status) {
        const { value, activityCodeDoing, activityCodeDone } = status;
        this.form = {
          ...this.form,
          status: value,
          activityCodeDoing: activityCodeDoing || "",
          activityCodeDone: activityCodeDone || "",
        };
        return;
      }
      this.form = {
        ...this.form,
        status: "",
        activityCodeDoing: "",
        activityCodeDone: "",
      };
    },
  },
};
</script>

<style lang="less" scoped>
.order-history {
}
</style>