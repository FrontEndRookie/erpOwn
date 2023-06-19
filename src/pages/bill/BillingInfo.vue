<template>
  <!-- 开票抬头 -->
  <dc-page class="billing-info">
    <template #search>
      <el-form-item>
        <dc-select
          v-model="companyId"
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
        <el-button type="primary" @click="searchAll">查询</el-button>
        <el-button type="primary" @click="openInvoiceDialog"
          >新增发票抬头</el-button
        >
        <el-button type="primary" @click="openMailDialog"
          >新增邮寄信息</el-button
        >
      </el-form-item>
    </template>
    <template #table-prepend>
      <el-button-group style="margin-top: 20px">
        <el-button
          :type="tab === 'invoice' ? 'primary' : ''"
          @click="tab = 'invoice'"
        >
          <span>抬头信息</span>
          <span>({{ invoiceTotal }})</span>
        </el-button>
        <el-button
          :type="tab === 'mail' ? 'primary' : ''"
          @click="tab = 'mail'"
        >
          <span>邮寄信息</span>
          <span>({{ mailTotal }})</span>
        </el-button>
      </el-button-group>
    </template>
    <template #table="{ height }">
      <section>
        <dc-table
          v-show="tab === 'invoice'"
          v-loading="invoiceLoading"
          :max-height="height"
          :columns="computedInvoiceColumns"
          :data="computedInvoices"
          :total="invoiceTotal"
          :current-page="invoiceForm.pageNum"
          :page-size="invoiceForm.pageSize"
          @page-size-change="
            (size) => pageSizeChange({ size, type: 'invoice' })
          "
          @current-page-change="
            (page) => currentPageChange({ page, type: 'invoice' })
          "
          border
        >
          <template #actions="{ row }">
            <el-button type="text" @click="openInvoiceDialog(row)"
              >编辑</el-button
            >
            <el-button type="text" @click="delInvoice(row)">删除</el-button>
          </template>
        </dc-table>
        <dc-table
          v-show="tab === 'mail'"
          v-loading="mailLoading"
          :max-height="height"
          :columns="computedMailColumns"
          :data="computedMails"
          :total="mailTotal"
          :current-page="mailForm.pageNum"
          :page-size="mailForm.pageSize"
          @page-size-change="(size) => pageSizeChange({ size, type: 'mail' })"
          @current-page-change="
            (page) => currentPageChange({ page, type: 'mail' })
          "
          border
        >
          <template #actions="{ row }">
            <el-button type="text" @click="openMailDialog(row)">编辑</el-button>
            <el-button type="text" @click="delMail(row)">删除</el-button>
          </template>
        </dc-table>
      </section>
    </template>
    <!-- 编辑邮寄信息弹窗 -->
    <mail-dialog
      v-if="showMailDialog"
      :form="mail"
      @closeEv="showMailDialog = false"
      @afterEdit="currentPageChange({ type: 'mail' })"
      @afterAdd="
        tab = 'mail';
        currentPageChange({ page: 1, type: 'mail' });
      "
    />
    <!-- 编辑抬头信息弹窗 -->
    <invoice-dialog
      v-if="showInvoiceDialog"
      :form="invoice"
      @closeEv="showInvoiceDialog = false"
      @afterEdit="currentPageChange({ type: 'invoice' })"
      @afterAdd="
        tab = 'invoice';
        currentPageChange({ page: 1, type: 'invoice' });
      "
    />
  </dc-page>
</template>

<script>
const PAGE_NUM = 1;
const PAGE_SIZE = 10;
export default {
  name: "BillingInfo",
  created() {
    this.init();
  },
  activated() {
    if (!this.isRunActivated) {
      this.isRunActivated = true;
      return;
    }
    this.currentPageChange({ type: "mail" });
    this.currentPageChange({ type: "invoice" });
  },
  data() {
    return {
      isRunActivated: false,
      showMailDialog: false,
      mail: {},
      showInvoiceDialog: false,
      invoice: {},
      tab: "invoice",
      companyId: "",
      mailLoading: false,
      invoiceLoading: false,
      mailForm: {
        pageNum: PAGE_NUM,
        pageSize: PAGE_SIZE,
      },
      mails: [],
      mailColumns: [
        {
          prop: "companyName",
          label: "客户名称",
        },
        {
          prop: "recipient",
          label: "收件人",
        },
        {
          prop: "recipientTel",
          label: "联系电话",
        },
        {
          prop: "recipientEmail",
          label: "邮箱",
        },
        {
          prop: "recipientAddress",
          label: "收件地址",
        },
        {
          prop: "createTime",
          label: "添加时间",
        },
        {
          prop: "actions",
          label: "操作",
        },
      ],
      mailTotal: 0,
      invoiceForm: {
        pageNum: PAGE_NUM,
        pageSize: PAGE_SIZE,
      },
      invoices: [],
      invoiceColumns: [
        {
          prop: "companyName",
          label: "客户名称",
        },
        {
          prop: "invoiceTitle",
          label: "发票抬头",
        },
        {
          prop: "dutyParagraph",
          label: "纳税人识别号",
        },
        {
          prop: "company",
          label: "公司地址及电话",
        },
        {
          prop: "bank",
          label: "开户行及账号",
        },
        {
          prop: "createTime",
          label: "添加时间",
        },
        {
          prop: "remark",
          label: "开票备注",
        },
        {
          prop: "actions",
          label: "操作",
        },
      ],
      invoiceTotal: 0,
      portalUsers: [],
    };
  },
  computed: {
    computedMails() {
      return this.mails.map((item) => item);
    },
    computedMailColumns() {
      return this.mailColumns.map((item) => item);
    },
    computedInvoices() {
      return this.invoices.map((item) => {
        const { companyAddress, companyTel, accountBank, bankAccount } = item;
        return {
          ...item,
          company: `${companyAddress} / ${companyTel}`,
          bank: `${accountBank} / ${bankAccount}`,
        };
      });
    },
    computedInvoiceColumns() {
      return this.invoiceColumns.map((item) => item);
    },
  },
  methods: {
    init() {
      this.getCompanyList();
      this.searchAll();
    },
    searchAll() {
      this.currentPageChange({ page: 1, type: "mail" });
      this.currentPageChange({ page: 1, type: "invoice" });
    },
    pageSizeChange({ size, type }) {
      if (!type) {
        this.$message.error("type参数缺失");
        return;
      }
      switch (type) {
        case "mail":
          this.mailForm.pageSize = size;
        case "invoice":
          this.invoiceForm.pageSize = size;
        default:
          this.getList(type);
          break;
      }
    },
    currentPageChange({ page, type }) {
      if (!type) {
        this.$message.error("type参数缺失");
        return;
      }
      switch (type) {
        case "mail":
          this.mailForm.pageNum = page || this.mailForm.pageNum;
        case "invoice":
          this.invoiceForm.pageNum = page || this.invoiceForm.pageNum;
        default:
          this.getList(type);
          break;
      }
    },
    getList(type) {
      switch (type) {
        case "mail":
          this.getMails();
          break;
        case "invoice":
          this.getInvoices();
          break;
      }
    },
    async getMails() {
      this.mailLoading = true;
      try {
        const {
          companyId,
          mailForm: { pageNum, pageSize },
        } = this;
        const {
          data: {
            data: { records, total },
          },
        } = await this.$api.getMails({
          companyId,
          pageNum,
          pageSize,
        });
        this.mails = records;
        this.mailTotal = total;
      } catch (error) {
      } finally {
        this.mailLoading = false;
      }
    },
    async getInvoices() {
      this.invoiceLoading = true;
      try {
        const {
          companyId,
          invoiceForm: { pageNum, pageSize },
        } = this;
        const {
          data: {
            data: { records, total },
          },
        } = await this.$api.getInvoices({
          companyId,
          pageNum,
          pageSize,
        });
        this.invoices = records;
        this.invoiceTotal = total;
      } catch (error) {
      } finally {
        this.invoiceLoading = false;
      }
    },
    async getCompanyList() {
      try {
        const {
          data: { data },
        } = await this.$api.getCompanyList(
          {},
          {
            params: {
              typeCode: 1,
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
    async delMail(row) {
      try {
        await this.$confirm("确认要进行该操作吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        await this.$api.delMail({
          params: {
            id: row.id,
          },
        });
        this.currentPageChange({ type: "mail" });
      } catch (error) {}
    },
    async delInvoice(row) {
      try {
        await this.$confirm("确认要进行该操作吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        await this.$api.delInvoice({
          params: {
            id: row.id,
          },
        });
        this.currentPageChange({ type: "invoice" });
      } catch (error) {}
    },
    openMailDialog(row) {
      if (row.id) {
        this.mail = {
          ...row,
        };
      } else {
        this.mail = {};
      }
      this.showMailDialog = true;
    },
    openInvoiceDialog(row) {
      if (row.id) {
        this.invoice = {
          ...row,
        };
      } else {
        this.invoice = {};
      }
      this.showInvoiceDialog = true;
    },
  },
};
</script>

<style lang="less" scoped>
.billing-info {
}
</style>