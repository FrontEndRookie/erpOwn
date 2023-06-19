<template>
  <!-- 合并对账 -->
  <dc-page class="merge-reconciliation">
    <template #search>
      <el-form-item>
        <el-input v-model.trim="form.orderNo" placeholder="订单号" clearable />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="form.waybillNo"
          placeholder="输入运单号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <dc-select
          v-model="form.companyId"
          filterable
          remote
          placeholder="输入结算对象"
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
        <el-input
          v-model.trim="form.contactor"
          placeholder="输入订单联系人"
          clearable
        />
      </el-form-item>
      <!-- <el-form-item>
        <el-select v-model="form.invoiceApplyStatus" placeholder="对账状态" clearable>
          <el-option
            v-for="item in checkStatusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-date-picker
          v-model="departureDates"
          type="daterange"
          unlink-panels
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          range-separator="——"
          start-placeholder="航班起始日期"
          end-placeholder="航班截止日期"
          style="width: 364px"
        />
      </el-form-item>
      <el-form-item>
        <!-- <el-select v-model="form.payWay" placeholder="付款方式" clearable> -->
        <el-select v-model="form.payWay" placeholder="结算方式" clearable>
          <el-option
            v-for="item in payWays"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="form.invoiceApplyStatus"
          placeholder="申请开票状态"
          clearable
        >
          <el-option
            v-for="item in checkStatusList2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <dc-select
          v-model="form.customerResponsibleId"
          placeholder="销售"
          filterable
          clearable
        >
          <el-option
            v-for="item in customerResponsibles"
            :key="item.value"
            :label="item.longLabel"
            :value="item.value"
          />
        </dc-select>
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
            :label="item.longLabel"
            :value="item.value"
          />
        </dc-select>
      </el-form-item>
      <el-form-item>
        <el-select
          filterable
          v-model="form.orgId"
          placeholder="订单所属分公司"
          clearable
        >
          <el-option
            v-for="item in principalCompanyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="currentPageChange(1)"
          v-auth:none="['171000_B']"
          >查询</el-button
        >
        <el-button
          type="primary"
          @click="resetSearch"
          v-auth:none="['171000_B']"
          >清空</el-button
        >
        <el-button
          type="primary"
          @click="checkMergeBill"
          v-auth:none="['171001_B']"
          >申请开票</el-button
        >
        <!-- <el-button type="primary" @click="exportMergeBill" v-auth:none="['171002_B']">拉账单</el-button> -->
      </el-form-item>
    </template>
    <template #table="{ height }">
      <dc-table
        useVirtual
        v-loading="tableLoading"
        :height="height"
        :columns="columns"
        :data="computedList"
        :total="total"
        :rowKey="'newId'"
        :current-page="form.pageNum"
        :page-size="form.pageSize"
        @page-size-change="pageSizeChange"
        @current-page-change="currentPageChange"
        @selection-change="handleSelectionChange"
        :page-sizes="[100, 200, 300, 400, 500]"
        :cell-style="cellStyle"
        :header-cell-style="cellStyle"
        border
      >
        <template #toCheckOrgn="{ row }">
          <p v-for="(item, index) in row.toCheckOrgnList" :key="index">
            {{ item.label }}
          </p>
        </template>
        <template #amountOrgn="{ row }">
          <p v-for="(item, index) in row.totalArOrgnList" :key="index">
            {{ item.label }}
          </p>
        </template>
      </dc-table>
    </template>
  </dc-page>
</template>

<script>
import DcStatus from "@/status";
const PAGE_NUM = 1;
const PAGE_SIZE = 100;
export default {
  name: "MergeReconciliation",
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
    const { payWays } = DcStatus.commonStatus;
    return {
      isRunActivated: false,
      tableLoading: false,
      form: {
        companyId: "",
        orderNo: "",
        waybillNo: "",
        pageNum: PAGE_NUM,
        pageSize: PAGE_SIZE,
        invoiceApplyStatus: "",
        payWay: "",
        contactor: "",
        pscsId: "",
        customerResponsibleId: "",
        orgId: ""
      },
      departureDates: ["", ""],
      selectRows: [],
      list: [],
      total: 0,
      columns: [
        {
          prop: "selection",
          type: "selection",
          "class-name": "virtual-fixed"
        },
        {
          prop: "orderNo",
          label: "订单号",
          width: 140
        },
        {
          prop: "waybillNo",
          label: "运单号",
          width: 140
        },
        {
          prop: "expenseUnitName",
          label: "结算对象",
          width: 150
        },
        {
          prop: "departureDate",
          label: "航班日期",
          width: 100
        },
        {
          prop: "airline",
          label: "航线",
          width: 100
        },
        // {
        //   prop: "toCheckOrgn",
        //   label: "待对账金额",
        // },
        // {
        //   prop: "totalArOrgn",
        //   label: "账单总金额",
        // },
        {
          prop: "amountOrgn",
          label: "账单金额"
        },
        // {
        //   prop: "payWayText",
        //   label: "付款方式",
        // },
        {
          prop: "payWayText",
          label: "结算方式"
        },
        // {
        //   prop: "checkStatusText",
        //   label: "对账状态",
        // },
        {
          prop: "checkStatusText",
          label: "申请开票状态"
        },
        // {
        //   prop: "statusStr",
        //   label: "订单状态",
        //   width: 140,
        // },
        // {
        //   prop: "contactor",
        //   label: "订单联系人",
        // },
        // {
        //   prop: "sysOrgName",
        //   label: "订单所属公司",
        // },
        {
          prop: "customerResponsibleName",
          label: "销售"
        },
        {
          prop: "pscsName",
          label: "售前客服"
        },
        {
          prop: "sysOrgName",
          label: "订单所属分公司"
        }
      ],
      checkStatusList: [
        { value: 0, label: "未对账" },
        { value: 1, label: "部分对账" },
        { value: 2, label: "已对账" }
      ], // 对账
      checkStatusList1: [
        { value: 0, label: "未申请开票" },
        { value: 2, label: "已申请开票" }
      ], // 对账
      checkStatusList2: [
        // { value: 0, label: "申请开票状态" },
        { value: 0, label: "未申请开票" },
        { value: 2, label: "已申请开票" }
      ], // 对账
      payWays,
      portalUsers: [],
      pscsList: [],
      customerResponsibles: [],
      principalCompanyList: ""
    };
  },
  computed: {
    currencyArray() {
      return this.$store.getters.getCurrencyAddValue;
    },
    selectExpenseUnitIds() {
      return this.selectRows.map(item => item.expenseUnitId);
    },
    rcvRecordIdList() {
      return this.selectRows.map(item => item.id);
    },
    expenseUnitNameList() {
      return this.selectRows.map(item => item.expenseUnitName);
    },

    selectOrderIds() {
      return this.selectRows.map(item => item.orderId);
    },
    computedList() {
      var that = this;
      return this.list.map(item => {
        // const { pol, pod, payWay, invoiceApplyStatus, toCheckOrgn, totalArOrgn } =
        //   item;
        const {
          orderId,
          expenseUnitName,
          pol,
          pod,
          payWay,
          invoiceApplyStatus,
          toCheckOrgn,
          amountOrgn
        } = item;
        const { getStatus, getStatusNew } = DcStatus.commonStatus;
        function getArr(json) {
          return JSON.parse(json).map(j => {
            // const currencyObj = getStatus("currencyTypes", j.currency);
            const currencyObj =
              getStatusNew(that.currencyArray, j.currency) || {};
            return {
              ...j,
              label: `${currencyObj.symbol}${j.amount}`
            };
          });
        }
        return {
          ...item,
          airline: `${pol}-${pod}`,
          payWayText: getStatus("payWays", payWay).label,
          checkStatusText:
            this.checkStatusList1.find(s => s.value === invoiceApplyStatus) &&
            this.checkStatusList1.find(s => s.value === invoiceApplyStatus)
              .label,
          newId: expenseUnitName + "_" + orderId,
          toCheckOrgnList: getArr(toCheckOrgn),
          totalArOrgnList: getArr(amountOrgn)
        };
      });
    },
    startDepartureDate() {
      return this.departureDates ? this.departureDates[0] : "";
    },
    endDepartureDate() {
      return this.departureDates ? this.departureDates[1] : "";
    },
    searchForm() {
      const { form, startDepartureDate, endDepartureDate } = this;
      return {
        ...form,
        departureDate1: startDepartureDate,
        departureDate2: endDepartureDate,
        expenseUnitName: form.invoiceApplyStatus
      };
    }
  },
  methods: {
    cellStyle({ column }) {
      return {
        left: {
          selection: 0
        }[column.property]
      };
    },
    init() {
      this.selectCompanyListByThisUser();
      this.searchBranchUsers({
        roleName: "售前客服",
        listName: "pscsList"
      });
      this.searchBranchUsers({
        roleName: "",
        listName: "customerResponsibles"
      });
      this.getList();
      this.getFirstLevelOrgs();
    },
    getFirstLevelOrgs() {
      this.$http.get(this.$service.searchFirstLevelOrgs).then(data => {
        this.principalCompanyList = data.data;
      });
    },

    resetSearch() {
      Object.keys(this.form).forEach(key => {
        switch (key) {
          case "pageNum":
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
      this.selectRows = [];
      this.currentPageChange(1);
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
            data: { records, total }
          }
        } = await this.$api.getMergeBills({
          ...this.searchForm
        });
        this.list = records;
        this.total = total;
      } catch (error) {
        console.error(error);
      } finally {
        this.tableLoading = false;
      }
    },
    async selectCompanyListByThisUser(certificationBody = "") {
      try {
        const {
          data: { data }
        } = await this.$api.selectCompanyListByThisUser();
        this.portalUsers = data.map(item => {
          return {
            value: item.id,
            label: item.companyName
          };
        });
      } catch (error) {}
    },
    async searchBranchUsers({ roleName = "", listName }) {
      try {
        const {
          data: { data }
        } = await this.$api.searchBranchUsers(
          {},
          {
            params: {
              roleName
            }
          }
        );
        this[listName] = data.map(item => {
          return {
            value: item.id,
            label: item.name,
            longLabel: `${item.name} ${item.branchNames}`
          };
        });
      } catch (error) {}
    },
    handleSelectionChange(rows) {
      this.selectRows = rows;
    },
    resetSearch() {
      Object.keys(this.form).forEach(key => {
        switch (key) {
          case "pageNum":
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
      this.currentPageChange(1);
    },
    async checkMergeBill() {
      if (this.selectOrderIds.length <= 0) {
        this.$message.warning("请至少选择一条数据");
        return;
      }
      // console.log(this.selectOrderIds);
      try {
        const {
          data: {
            data: { companyId }
          }
        } = await this.$api.getMergeBillDetail({
          orderIds: this.selectOrderIds,
          expenseUnitIdList: this.selectExpenseUnitIds,
          rcvRecordIdList: this.rcvRecordIdList,
          expenseUnitNameList: this.expenseUnitNameList
        });
        sessionStorage.setItem(
          "dc_merge_expense_unitName",
          JSON.stringify(this.expenseUnitNameList)
        );
        sessionStorage.setItem(
          "dc_merge_bill_ids",
          JSON.stringify(this.selectOrderIds)
        );
        sessionStorage.setItem(
          "dc_merge_expense_ids",
          JSON.stringify(this.selectExpenseUnitIds)
        );
        sessionStorage.setItem(
          "dc_merge_record_ids",
          JSON.stringify(this.rcvRecordIdList)
        );
        this.$router.push({ name: "ConfirmMergeBill", query: { companyId } });
      } catch (error) {
        console.error(error);
      }
    },
    async exportMergeBill() {
      if (this.selectOrderIds.length <= 0) {
        this.$message.warning("请至少选择一条数据");
        return;
      }
      try {
        await this.$api.exportMergeBill({
          orderIds: this.selectOrderIds
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.merge-reconciliation {
}
</style>
