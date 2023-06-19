<template>
  <dc-page class="order-drafts">
    <template #search>
      <el-form-item>
        <el-select v-model="form.sysOrgId" placeholder="订单所属公司" clearable>
          <el-option
            v-for="item in sysOrgs"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="form.ownRote"
          placeholder="是否为自有航线"
          clearable
        >
          <el-option
            v-for="item in ownRotes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <dc-select
          v-model="form.companyId"
          filterable
          remote
          placeholder="客户"
          clearable
        >
          <el-option
            v-for="item in portalUsers"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </dc-select>
      </el-form-item>
      <el-form-item>
        <dc-select
          v-model="form.pol"
          filterable
          remote
          clearable
          placeholder="起运港"
          :remote-method="
            (keyWord) => getThreeLetterCodes({ keyWord, listName: 'pols' })
          "
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
      </el-form-item>
      <el-form-item>
        <dc-select
          v-model="form.pod"
          filterable
          remote
          clearable
          placeholder="目的港"
          :remote-method="
            (keyWord) => getThreeLetterCodes({ keyWord, listName: 'pods' })
          "
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
      </el-form-item>
      <el-form-item>
        <dc-select
          v-model="form.airCompanyCode"
          filterable
          remote
          placeholder="航司"
          clearable
          :remote-method="getAirCompanysByKeyWord"
        >
          <el-option
            v-for="item in airCompanys"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </dc-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="form.customerResponsibleId"
          placeholder="客户负责人"
          filterable
          clearable
        >
          <el-option
            v-for="item in customerResponsibles"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <dc-select
          v-model="form.pscsId"
          filterable
          clearable
          placeholder="售前客服"
        >
          <el-option
            v-for="item in pscsList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </dc-select>
      </el-form-item>
      <el-form-item>
        <dc-select
          v-model="form.principalId"
          filterable
          clearable
          placeholder="航线"
        >
          <el-option
            v-for="item in principalList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </dc-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="departureDates"
          type="daterange"
          unlink-panels
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="航班起始日期"
          end-placeholder="航班截止日期"
          style="width: 364px"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="orderTimes"
          type="daterange"
          unlink-panels
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="下单起始日期"
          end-placeholder="下单截止日期"
          style="width: 364px"
        />
      </el-form-item>
    </template>
    <template #search-actions>
      <el-form-item>
        <el-button
          type="primary"
          @click="currentPageChange(1)"
          v-auth:none="['151006_B']"
          >查询</el-button
        >
        <el-button type="primary" @click="resetSearch">清空</el-button>
      </el-form-item>
    </template>
    <template #table="{ height }">
      <dc-table
        v-loading="tableLoading"
        :max-height="height"
        :columns="computedColumns"
        :data="computedList"
        :total="total"
        :current-page="form.currentPage"
        :page-size="form.pageSize"
        @page-size-change="pageSizeChange"
        @current-page-change="currentPageChange"
        border
      >
        <template #actions="{ row }">
          <el-button type="text" @click="jump2addOrder(row)">编辑</el-button>
          <el-button type="text" @click="delOrderDraft(row)">删除</el-button>
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
  name: "OrderDrafts",
  created() {
    this.init();
  },
  activated() {
    if (!this.isRunActivated) {
      this.isRunActivated = true;
      return;
    }
    this.currentPageChange();
  },
  data() {
    const { ownRotes } = DcStatus.commonStatus;
    return {
      isRunActivated: false,
      ownRotes,
      tableLoading: false,
      list: [],
      total: 0,
      form: {
        currentPage: PAGE_NUM,
        pageSize: PAGE_SIZE,
        customerResponsibleId: "",
        companyId: "",
        pol: "",
        pod: "",
        airCompanyCode: "",
        ownRote: "",
        sysOrgId: "",
        pscsId: "",
        principalId: "",
      },
      departureDates: ["", ""],
      orderTimes: ["", ""],
      columns: [
        {
          prop: "index",
          label: "序号",
          type: "index",
          fixed: "left",
        },
        {
          prop: "pol",
          label: "起运港",
          "min-width": "100",
        },
        {
          prop: "pod",
          label: "目的港",
          "min-width": "100",
        },
        {
          prop: "departureDate",
          label: "航班日期",
          "min-width": "140",
        },
        {
          prop: "companyName",
          label: "订舱客户",
          "min-width": "150",
        },
        {
          prop: "sysOrgName",
          label: "订单所属公司",
          "min-width": "150",
        },
        {
          prop: "customerResponsibleName",
          label: "客户负责人",
          "min-width": "150",
        },
        {
          prop: "pscsName",
          label: "售前客服",
          "min-width": "120",
        },
        {
          prop: "principalName",
          label: "航线",
          "min-width": "120",
        },
        {
          prop: "createTime",
          label: "创建时间",
          "min-width": "160",
        },
        {
          prop: "airCompanyCode",
          label: "航司",
          "min-width": "80",
        },
        {
          prop: "costPrice",
          label: "成本价 (航线报价)",
          "min-width": "130",
        },
        {
          prop: "ownRoteText",
          label: "是否为自有航线",
          "min-width": "120",
        },
        {
          prop: "costBubblePointText",
          label: "分泡 (成本)",
          "min-width": "100",
        },
        {
          prop: "cargoName",
          label: "品名",
          "min-width": "100",
        },
        {
          prop: "jmt",
          label: "件.毛.体",
          "min-width": "100",
        },
        {
          prop: "bookingPrice",
          label: "单价 (卖价)",
          "min-width": "100",
        },
        {
          prop: "bubblePointText",
          label: "分泡比例 (卖价)",
          "min-width": "120",
        },
        {
          prop: "payWayText",
          label: "单票结算方式",
          "min-width": "120",
        },
        {
          prop: "actions",
          label: "操作",
          fixed: "right",
          "min-width": "100",
        },
      ],
      customerResponsibles: [],
      sysOrgs: [],
      principalList: [], // 航线负责人列表
      pscsList: [], // 售前列表
      mscsList: [], // 售中列表
      pols: [],
      pods: [],
      airCompanys: [],
    };
  },
  computed: {
    startDepartureDate() {
      return this.departureDates ? this.departureDates[0] : "";
    },
    endDepartureDate() {
      return this.departureDates ? this.departureDates[1] : "";
    },
    startOrderTime() {
      return this.orderTimes ? this.orderTimes[0] : "";
    },
    endOrderTime() {
      return this.orderTimes ? this.orderTimes[1] : "";
    },
    searchForm() {
      const {
        form,
        startDepartureDate,
        endDepartureDate,
        startOrderTime,
        endOrderTime,
      } = this;
      return {
        ...form,
        startDepartureDate,
        endDepartureDate,
        startOrderTime,
        endOrderTime,
      };
    },
    computedList() {
      return this.list.map((item) => {
        const {
          ownRote,
          costBubblePoint,
          bubblePoint,
          bookingPiece,
          bookingWeight,
          bookingCbm,
          payWay,
        } = item;
        return {
          ...item,
          ownRoteText: (() => {
            const ownRoteObj = DcStatus.commonStatus.getStatus(
              "ownRotes",
              ownRote
            );
            return (ownRoteObj || {}).label;
          })(),
          costBubblePointText: (() => {
            const bubblePointObj = DcStatus.commonStatus.getStatus(
              "bubblePoints",
              costBubblePoint
            );
            return (bubblePointObj || {}).label;
          })(),
          bubblePointText: (() => {
            const bubblePointObj = DcStatus.commonStatus.getStatus(
              "bubblePoints",
              bubblePoint
            );
            return (bubblePointObj || {}).label;
          })(),
          jmt: `${bookingPiece || "-"} / ${bookingWeight || "-"} / ${
            bookingCbm || "-"
          }`,
          payWayText: (() => {
            const payWayObj = DcStatus.commonStatus.getStatus(
              "payWays",
              payWay
            );
            return (payWayObj || {}).label;
          })(),
        };
      });
    },
    computedColumns() {
      return this.columns.map((item) => item);
    },
  },
  methods: {
    init() {
      this.findThisUserAndBranchOrg();
      this.getUsersAndBranchOrg();
      this.getCompanyList();
      this.getThreeLetterCodes({ listName: "pols" });
      this.getThreeLetterCodes({ listName: "pods" });
      this.getAirCompanysByKeyWord();
      this.getSystemUsersByRoleName({
        roleName: "售前客服",
        listName: "pscsList",
      });
      this.getSystemUsersByRoleName({
        roleName: "航线负责人",
        listName: "principalList",
      });
      this.getList();
    },
    pageSizeChange(size) {
      this.form.pageSize = size;
      this.getList();
    },
    currentPageChange(page) {
      this.form.currentPage = page || this.form.currentPage;
      this.getList();
    },
    async getList() {
      this.tableLoading = true;
      try {
        const {
          data: {
            data: { records, total },
          },
        } = await this.$api.getOrderDrafts({
          ...this.searchForm,
        });
        this.list = records;
        this.total = total;
      } catch (error) {
      } finally {
        this.$store.dispatch("getOrderCountInfo");
        this.tableLoading = false;
      }
    },
    async delOrderDraft(row) {
      try {
        await this.$confirm("确认要进行该操作吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        await this.$api.delOrderDraft({
          params: {
            id: row.id,
          },
        });
        this.currentPageChange();
      } catch (error) {}
    },
    jump2addOrder(row) {
      this.$router.push({ name: "AddOrder", query: { id: row.id } });
    },
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
    async getUsersAndBranchOrg() {
      try {
        const {
          data: { data },
        } = await this.$api.getUsersAndBranchOrg();
        this.customerResponsibles = data.map((item) => {
          return {
            value: item.id,
            label: item.name,
            longLabel: `${item.name} ${item.branchNames}`,
          };
        });
      } catch (error) {}
    },
    async getCompanyList(certificationBody = "") {
      try {
        const {
          data: { data },
        } = await this.$api.getCompanyList(
          {},
          {
            params: {
              typeCode: 0,
            },
          }
        );
        this.portalUsers = data.map((item) => {
          return {
            label: item.companyName,
            value: item.id,
          };
        });
      } catch (error) {}
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
        };
      });
    },
    resetSearch() {
      Object.keys(this.form).forEach((key) => {
        switch (key) {
          case "currentPage":
            this.form[key] = PAGE_NUM;
            break;
          case "pageSize":
            this.form[key] = PAGE_SIZE;
            break;
          default:
            this.form[key] = "";
            break;
        }
      });
      this.departureDates = ["", ""];
      this.orderTimes = ["", ""];
      this.currentPageChange(1);
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
          delFlag: 0,
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
  },
};
</script>

<style lang="less" scoped>
.order-drafts {
}
</style>