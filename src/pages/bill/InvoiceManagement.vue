<template>
  <!-- 发票管理 -->
  <dc-page class="invoice-management">
    <template #search>
      <el-form-item>
        <dc-select
          v-model="form.companyId"
          filterable
          remote
          placeholder="结算对象"
          clearable
        >
          <el-option
            v-for="item in customers"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </dc-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="form.invoiceTitle"
          placeholder="发票抬头"
          clearable
        />
      </el-form-item>
      <!-- xin -->
      <el-form-item>
        <el-select
          v-model="form.invoicingStatus"
          placeholder="发票类型"
          clearable
        >
          <el-option
            v-for="item in invoicingStatusList1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="form.invoicingStatus"
          placeholder="开票状态"
          clearable
        >
          <el-option
            v-for="item in invoicingStatusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="form.applyCurrency"
          placeholder="开票币种"
          clearable
        >
          <el-option
            v-for="item in currencyTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
        <dc-select
          v-model="form.applicantId"
          filterable
          remote
          placeholder="申请人"
          clearable
          popper-class="applicant-select"
        >
          <el-option
            v-for="item in applicants"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <p class="text-overflow">{{ item.label }}</p>
          </el-option>
        </dc-select>
      </el-form-item>
      <!-- xin -->
      <!-- <el-form-item>
        <el-input placeholder="订单号" v-model="form.orderNo"></el-input
      ></el-form-item>
      <el-form-item>
        <el-input placeholder="运单号" v-model="form.waybillNos"></el-input
      ></el-form-item> -->
      <!-- xin -->
      <!-- <el-form-item>
        <dc-select
          v-model="form.customerResponsibleId"
          filterable
          placeholder="销售"
          clearable
          popper-class="applicant-select"
        >
          <el-option
            v-for="item in customerResponsibles"
            :key="item.value"
            :label="item.longLabel"
            :value="item.value"
          >
            <p class="text-overflow">{{ item.longLabel }}</p>
          </el-option>
        </dc-select>
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="primary"
          @click="currentPageChange(1)"
          v-auth:none="['172000_B']"
          >查询</el-button
        >
        <el-button
          type="primary"
          @click="resetSearch"
          v-auth:none="['172000_B']"
          >清空</el-button
        >
      </el-form-item>
    </template>
    <template #table="{ height }">
      <dc-table
        v-loading="tableLoading"
        :max-height="height"
        :columns="columns"
        :data="computedList"
        :total="total"
        :current-page="form.pageNum"
        :page-size="form.pageSize"
        :page-sizes="[50, 200, 500]"
        @page-size-change="pageSizeChange"
        @current-page-change="currentPageChange"
        border
      >
        <template #actions="{ row }">
          <el-button
            type="text"
            @click="
              $router.push({ name: 'InvoiceDetail', query: { id: row.iaId } })
            "
            >详情</el-button
          >
          <el-button
            type="text"
            :disabled="row.invoiceTypeText == '电子普票'"
            @click="downloadInvoiceZip(row)"
            v-auth:none="['172001_B']"
            >下载发票</el-button
          >
        </template>
      </dc-table>
    </template>
  </dc-page>
</template>

<script>
import DcStatus from "@/status";
const PAGE_NUM = 1;
const PAGE_SIZE = 50;
export default {
  name: "InvoiceManagement",
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
    // const { currencyTypes } = DcStatus.commonStatus;
    // const currencyTypes = this.$store.getters.getCurrencyAddValue
    return {
      isRunActivated: false,
      tableLoading: false,
      form: {
        applicantId: "",
        companyId: "",
        pageNum: PAGE_NUM,
        pageSize: PAGE_SIZE,
        invoiceTitle: "",
        invoicingStatus: "",
        applyCurrency: ""
        // customerResponsibleId: "", // xin
        // waybillNos: "",
        // orderNo: ""
      },
      customerResponsibles: [], // xin
      departureDates: ["", ""],
      list: [],
      total: 0,
      columns: [
        {
          prop: "companyName",
          label: "结算对象"
        },
        {
          prop: "invoiceTitle",
          label: "发票抬头"
        },
        {
          prop: "invoiceTypeText",
          label: "发票类型"
        },
        {
          prop: "applyCurrencyText",
          label: "发票币种"
        },
        {
          prop: "applyAmountOrgnText",
          label: "申请开票金额" // xin
        },
        {
          prop: "invoicingStatusText",
          label: "开票状态"
        },
        {
          prop: "invoiceNumbers",
          label: "发票号"
        },
        {
          prop: "customerResponsibleNames",
          label: "销售" // xin
        },
        {
          prop: "orderNos",
          label: "订单号" // xin
        },
        {
          prop: "waybillNos",
          label: "运单号"
        },
        // {
        //   prop: "departureDate",
        //   label: "航班日期" // xin
        // },
        {
          prop: "applicant",
          label: "申请人"
        },
        {
          prop: "createTime",
          label: "申请时间"
        },
        {
          prop: "actions",
          label: "操作",
          width: 120
        }
      ],
      invoicingStatusList: [
        { value: 0, label: "未开票" },
        { value: 1, label: "部分开票" },
        { value: 2, label: "已开票" }
      ], // 开票
      invoicingStatusList1: [
        { value: 2, label: "电子普票" },
        { value: 0, label: "纸质普票" },
        { value: 1, label: "纸质专票" }
      ], // 开票
      // currencyTypes: this.$store.getters.getCurrencyAddValue,
      customers: [],
      applicants: []
      // currencyArray: this.$store.getters.getCurrencyAddValue
    };
  },
  computed: {
    currencyTypes() {
      return this.$store.getters.getCurrencyAddValue;
    },
    currencyArray() {
      return this.$store.getters.getCurrencyAddValue;
    },
    computedList() {
      return this.list.map(item => {
        const { getStatus, getStatusNew } = DcStatus.commonStatus;
        const {
          invoicingStatus,
          applyCurrency,
          invoiceType,
          applyAmountOrgn
        } = item;
        // const currentCurrency = getStatus("currencyTypes", applyCurrency) || {};
        const currentCurrency =
          getStatusNew(this.currencyArray, applyCurrency) || {};
        return {
          ...item,
          invoiceTypeText: getStatus("invoiceTypes", Number(invoiceType))
            .shortName,
          invoicingStatusText: (
            this.invoicingStatusList.find(i => i.value === invoicingStatus) ||
            {}
          ).label,
          applyCurrencyText: currentCurrency.code,
          applyAmountOrgnText: `${currentCurrency.symbol}${applyAmountOrgn}`
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
        startDepartureDate,
        endDepartureDate
      };
    }
  },
  methods: {
    init() {
      this.getCustomers();
      this.searchBranchUsers();
      this.getList();
      this.searchBranchUsersOther({
        roleName: "",
        listName: "customerResponsibles"
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
      try {
        this.tableLoading = true;
        const {
          data: {
            data: { records, total }
          }
        } = await this.$api.getInvoiceManage({
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
    async getCustomers() {
      try {
        const {
          data: { data }
        } = await this.$api.selectCompanyListByThisUser();
        this.customers = data.map(item => {
          return {
            ...item,
            value: item.id,
            label: item.companyName
          };
        });
      } catch (error) {
        console.error(error);
      }
    },
    async searchBranchUsersOther({ roleName = "", listName }) {
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
    async searchBranchUsers() {
      try {
        const {
          data: { data }
        } = await this.$api.searchBranchUsers();
        this.applicants = data.map(item => {
          const { id, name, branchNames } = item;
          return {
            value: id,
            label: `${name}-${branchNames}`
          };
        });
      } catch (error) {}
    },
    async downloadInvoiceZip(row) {
      try {
        const { data } = await this.$api.downloadInvoiceZip(
          {},
          {
            params: {
              applyId: row.iaId
            },
            responseType: "arraybuffer",
            loading: true
          }
        );
        this.$utils.exportBuffer({
          buffer: data,
          exportName: "发票.zip"
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.invoice-management {
}
</style>
