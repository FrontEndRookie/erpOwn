<template>
  <div class="add-clients">
    <dc-form size="mini" class="search-form dc-custom-shadow">
      <div class="table-search">
        <el-form-item>
          <el-select
            v-model="form.companyName"
            placeholder="客户名称"
            filterable
            clearable
            remote
            :remote-method="(query) => (companyNameQuery = query)"
            @change="currentPageChange(1)"
          >
            <el-option
              v-for="item in computedCompanyNames"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
              <span>{{ item.label }}</span>
              <span style="color: red" v-if="item.disabled"
                >没有权限</span
              ></el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model.trim="form.creditCode"
            placeholder="统一信用代码"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form.customerMode"
            placeholder="客户类型"
            clearable
            @change="currentPageChange(1)"
          >
            <el-option
              v-for="item in customerModes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form.customerTypes"
            placeholder="客户类别"
            multiple
            clearable
            @change="currentPageChange(1)"
          >
            <el-option
              v-for="item in customerTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form.settlementCompany"
            placeholder="结算公司名称"
            filterable
            clearable
            @change="currentPageChange(1)"
          >
            <el-option
              v-for="item in settlementCompanyNames"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form.payWays"
            placeholder="结算方式"
            multiple
            clearable
            @change="currentPageChange(1)"
          >
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
            v-model="form.customerResponsibleId"
            placeholder="客户负责人"
            filterable
            clearable
            @change="currentPageChange(1)"
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
          <el-select
            v-model="form.branchOrgId"
            placeholder="客户负责人所在分公司"
            filterable
            clearable
            style="width: 190px"
            @change="currentPageChange(1)"
          >
            <el-option
              v-for="item in branchOrgs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="form.createTime1"
            type="date"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            placeholder="新增起始日期"
            :picker-options="createTime1PickerOptions"
            @change="currentPageChange(1)"
          />
          <span style="margin: 0 10px">-</span>
          <el-date-picker
            v-model="form.createTime2"
            type="date"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            placeholder="新增结束日期"
            :picker-options="createTime2PickerOptions"
            @change="currentPageChange(1)"
          />
        </el-form-item>
      </div>
      <div class="table-actions">
        <el-form-item>
          <el-button
            type="primary"
            @click="currentPageChange(1)"
            v-auth:none="['653000_B']"
            >搜索</el-button
          >
          <el-button type="primary" @click="resetSearch">清空</el-button>
          <el-button
            type="primary"
            @click="openClientDialog"
            v-auth:none="['653001_B']"
            >新增客户</el-button
          >
          <el-button
            type="primary"
            @click="exportCompanyExecl"
            v-auth:none="['653004_B']"
            >导出列表</el-button
          >
          <el-upload
            style="display: inline-block; margin-left: 10px"
            class="upload-demo"
            action="#"
            :on-change="handleChange"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :show-file-list="false"
            :auto-upload="false"
          >
            <el-button
              type="primary"
              @click="type = 1"
              size="mini"
              v-auth:none="['653006_B']"
              >立即导入</el-button
            >
          </el-upload>
        </el-form-item>
      </div>
    </dc-form>
    <main
      ref="main"
      class="main-table dc-custom-shadow"
      style="margin-top: 20px"
    >
      <dc-table
        v-loading="tableLoading"
        :max-height="tableHeight"
        :columns="columns"
        :data="computedList"
        :total="total"
        :current-page="form.pageNum"
        :page-size="form.pageSize"
        @page-size-change="pageSizeChange"
        @current-page-change="currentPageChange"
        @selection-change="handleSelectionChange"
        border
      >
        <template #actions="{ row }">
          <el-button
            type="text"
            v-auth:none="['653007_B']"
            @click="deleteClientBefore(row)"
            >删除</el-button
          >
          <el-button
            type="text"
            @click="openClientDialog(row)"
            v-auth:none="['653002_B']"
            >编辑</el-button
          >
          <el-button
            type="text"
            v-auth:none="['653003_B']"
            @click="previewLicense(row)"
            >查看营业执照</el-button
          >
        </template>
      </dc-table>
    </main>
    <el-dialog
      title="删除客户"
      :visible.sync="deleteShow"
      width="30%"
      :before-close="handleClose">
      <div class="deleDiv">确认删除该客户吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteShow = false">取 消</el-button>
        <el-button type="primary" @click="deleteClient()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑客户弹窗 -->
    <client-dialog
      v-if="showClientDialog"
      :form="client"
      :payWays="payWays"
      :customerModes="customerModes"
      :customerTypes="customerTypes"
      :customerResponsibles="customerResponsibles"
      @closeEv="showClientDialog = false"
      @afterEdit="
        currentPageChange();
        getClientQueryList(1);
        getClientQueryList(2);
      "
      @afterAdd="
        currentPageChange(1);
        getClientQueryList(1);
        getClientQueryList(2);
      "
    />
  </div>
</template>

<script>
import ClientDialog from "./components/ClientDialog.vue";
const PAGE_NUM = 1;
const PAGE_SIZE = 10;
export default {
  // 新增客户列表
  name: "AddClients",
  components: {
    ClientDialog,
  },
  created() {
    this.init();
  },
  async mounted() {
    window.addEventListener("resize", this.getTableHeight);
    this.getTableHeight();
  },
  activated() {
    if (!this.isRunActivated) {
      this.isRunActivated = true;
      return;
    }
    window.addEventListener("resize", this.getTableHeight);
  },
  deactivated() {
    window.removeEventListener("resize", this.getTableHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getTableHeight);
  },
  data() {
    return {
      nextButton: true, // 避免删除连续点击触发
      deleteId:'', // 要删除对象ID
      excelInfo: "",
      isRunActivated: false,
      tableHeight: 200,
      showClientDialog: false,
      deleteShow: false,
      form: {
        branchOrgId: "", // 分公司组织ID
        companyName: "", // 企业名称
        createTime1: "", // 新增时间-开始
        createTime2: "", // 新增时间-结束
        creditCode: "", // 企业信用代码
        customerMode: "", // 客户类型：0=直客，1=同行
        customerResponsibleId: "", // 客户负责人ID
        customerTypes: [], // 客户类别：0=客服客户，1=销售客服，2=公共客户，3=航线操作客户
        pageNum: PAGE_NUM,
        pageSize: PAGE_SIZE,
        payWays: [],
        settlementCompany: "",
      },
      companyIds: [], // 勾选
      tableLoading: false,
      columns: [
        {
          type: "selection",
          fixed: "left",
        },
        {
          prop: "companyName",
          label: "客户名称",
          "min-width": 160,
          fixed: "left",
        },
        {
          prop: "creditCode",
          label: "统一社会信用代码",
          "min-width": 170,
        },
        {
          prop: "customerModeStr",
          label: "客户类型",
        },
        {
          prop: "customerTypeStr",
          label: "客户类别",
        },
        {
          prop: "payWayStr",
          label: "结算方式",
        },
        {
          prop: "accountingPeriod",
          label: "账期",
        },
        {
          prop: "quota",
          label: "额度",
        },
        {
          prop: "customerResponsibleName",
          label: "客户负责人",
          "min-width": 100,
        },
        {
          prop: "responsibleBranchName",
          label: "客户负责人所在分公司",
          "min-width": 120,
        },
        {
          prop: "settlementCompany",
          label: "结算公司名称",
          "min-width": 120,
        },
        {
          prop: "officeAddress",
          label: "办公地址",
          "min-width": 160,
        },
        {
          prop: "licenseDurationText",
          label: "营业执照有效期",
          "min-width": 180,
        },
        {
          label: "业务联系人",
          children: [
            {
              prop: "businessContactName",
              label: "姓名",
            },
            {
              prop: "businessContactPosition",
              label: "职位",
            },
            {
              prop: "businessContactTel",
              label: "手机号码",
            },
            {
              prop: "businessContactQq",
              label: "QQ",
            },
            {
              prop: "businessContactWechat",
              label: "微信",
            },
            {
              prop: "businessContactMail",
              label: "邮箱",
            },
          ],
        },
        {
          label: "财务联系人",
          children: [
            {
              prop: "financialContactName",
              label: "姓名",
            },
            {
              prop: "financialContactTel",
              label: "手机号码",
            },
            {
              prop: "financialContactQq",
              label: "QQ",
            },
            {
              prop: "financialContactWechat",
              label: "微信",
            },
            {
              prop: "financialContactMail",
              label: "邮箱",
            },
          ],
        },
        {
          prop: "createTimeStr",
          // label: "客户新增时间",
          label: "新增时间",
          "min-width": 160,
        },
        {
          prop: "actions",
          label: "操作",
          "min-width": 200,
          fixed: "right",
        },
      ],
      list: [],
      total: 0,
      client: {},
      payWays: [
        {
          value: 0,
          label: "付款买单",
        },
        {
          value: 1,
          label: "月结买单",
        },
        {
          value: 2,
          label: "固定天数",
        },
      ],
      customerModes: [
        {
          value: 0,
          label: "直客",
        },
        {
          value: 1,
          label: "同行",
        },
      ],
      customerTypes: [
        {
          value: 0,
          label: "客服客户",
        },
        {
          value: 1,
          label: "销售客户",
        },
        {
          value: 2,
          label: "公共客户",
        },
        {
          value: 3,
          label: "航线操作客户",
        },
      ],
      customerResponsibles: [],
      companyNames: [],
      settlementCompanyNames: [],
      companyNameQuery: "",
    };
  },
  computed: {
    computedCompanyNames({ companyNameQuery }) {
      return this.companyNames
        .filter((item) => {
          return (
            companyNameQuery !== "" &&
            companyNameQuery.trim() !== "" &&
            item.label.toUpperCase().includes(companyNameQuery.toUpperCase())
          );
        })
        .slice(0, 10);
    },
    searchForm() {
      const {
        branchOrgId,
        companyName,
        createTime1,
        createTime2,
        creditCode,
        customerMode,
        customerResponsibleId,
        customerTypes,
        pageNum,
        pageSize,
        payWays,
        settlementCompany,
      } = this.form;
      return {
        branchOrgId,
        companyName,
        createTime1,
        createTime2,
        creditCode,
        customerMode,
        customerResponsibleId,
        customerTypes,
        pageNum,
        pageSize,
        payWays,
        settlementCompany,
      };
    },
    computedList() {
      return this.list.map((item) => {
        const { licenseDuration1, licenseDuration2 } = item;
        return {
          ...item,
          licenseDurationText:
            !licenseDuration1 && !licenseDuration2
              ? ""
              : `${licenseDuration1 || "不约定期限"}至${
                  licenseDuration2 || "不约定期限"
                }`,
        };
      });
    },
    createTime1PickerOptions() {
      return {
        disabledDate: (time) => {
          const createTime2 = new Date(this.form.createTime2).getTime();
          if (!createTime2) {
            return false;
          }
          return time.getTime() > createTime2;
        },
      };
    },
    createTime2PickerOptions() {
      return {
        disabledDate: (time) => {
          const createTime1 = new Date(this.form.createTime1).getTime();
          return time.getTime() < createTime1 - 60 * 60 * 1000 * 24;
        },
      };
    },
  },
  methods: {
    // 删除客户预检
    deleteClientBefore(row){
      if(!this.nextButton){
        return
      }else{
        this.nextButton = false
      }
      var array = [row.id]
      this.$http.post(this.$service.checkCompanyHasOrder,array).then(res=>{
        if(res.code==200){
          this.deleteId = row.id
          this.deleteShow = true
        }else {
          this.$message.error('该客户存在关联订单，不能删除')
        }
      }).catch((err)=>{
        console.log("错误：" + err);
      }).finally(()=>{
        this.nextButton = true
      })
    },
    // 删除客户
    deleteClient(){
      var array = [this.deleteId]
      this.$http.post(this.$service.deleteClient,array).then(res=>{
        if(res.code==200){
          this.$message.success("该客户已删除")
          this.currentPageChange()
        }else {
          this.$message.error('该客户存在关联订单，不能删除')
        }
      }).catch((err)=>{
        console.log("错误：" + err);
      }).finally(()=>{
        this.deleteShow = false
        this.deleteId = ''
      })
    },
    // 删除文件
    handleRemove(file) {
      this.excelInfo = "";
    },
    // 预览文件
    handlePreview(file) {
      window.location.href = URL.createObjectURL(file.raw);
    },
    // 导入文件的上传
    handleChange(file) {
      this.excelInfo = file.raw;
      console.log(file.raw.type);
      const isExcel =
        file.raw.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.raw.type === "application/vnd.ms-excel";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isExcel) {
        this.$message.error("只能上传Excel文件!");
        return;
      }
      if (!isLt2M) {
        this.$message.error("上传Excel文件不能超过 2MB!");
        return;
      }
      this.importExcel();
    },
    importExcel() {
      const formdate = new FormData();
      formdate.append("file", this.excelInfo);
      axios
        .post(this.$service.companyDataImport, formdate, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          let enc = new TextDecoder("utf-8");
          let uint8_msg = new Uint8Array(res);
          let str = enc.decode(uint8_msg);
          if (str.indexOf("code") !== -1) {
            let data = JSON.parse(enc.decode(uint8_msg));
            if (data.code == 200) {
              this.$message.success("导入成功");
            } else {
              this.$message.error(data.message);
            }
            return;
          }
          this.$message.error("导入失败,请查看失败文件");
          const aLink = document.createElement("a");
          let blob = new Blob([res], {
            type: "application/vnd.ms-excel",
          });
          aLink.href = URL.createObjectURL(blob);
          aLink.setAttribute("download", "导入失败文件" + ".xlsx");
          aLink.click();
          document.body.appendChild(aLink);
        });
    },
    init() {
      this.getFirstLevelOrgs();
      this.getUsersAndBranchOrg();
      this.getClientQueryList(1);
      this.getClientQueryList(2);
      this.getList();
    },
    pageSizeChange(size) {
      this.companyIds = [];
      this.form.pageSize = size;
      this.getList();
    },
    currentPageChange(page) {
      this.companyIds = [];
      this.form.pageNum = page || this.form.pageNum;
      this.getList();
      this.companyNameQuery = "";
    },
    async getList() {
      this.tableLoading = true;
      try {
        const {
          data: {
            data: { records, total },
          },
        } = await this.$api.getAddClients({
          ...this.searchForm,
        });
        this.list = [...records];
        this.total = total;
      } catch (error) {
      } finally {
        this.tableLoading = false;
      }
    },
    openClientDialog(client = {}) {
      if (client.id) {
        this.client = {
          ...client,
        };
      } else {
        this.client = {
          licenseDuration1: "",
          licenseDuration2: "",
          creditCode: "",
          companyName: "",
          businessLicensePath: "",
          officeAddress: "",
          customerMode: "",
          customerType: "",
          settlementCompany: "",
          payWay: 0,
          accountingPeriod: "",
          quota: "",
          businessContactName: "",
          businessContactPosition: "",
          businessContactTel: "",
          businessContactQq: "",
          businessContactWechat: "",
          businessContactMail: "",
          financialContactName: "",
          financialContactTel: "",
          financialContactQq: "",
          financialContactWechat: "",
          financialContactMail: "",
        };
      }
      this.showClientDialog = true;
    },
    resetSearch() {
      Object.keys(this.form).forEach((key) => {
        switch (key) {
          case "pageNum":
            this.form[key] = PAGE_NUM;
            break;
          case "pageSize":
            this.form[key] = PAGE_SIZE;
            break;
          case "companyIds":
          case "customerTypes":
          case "payWays":
            this.form[key] = [];
            break;
          default:
            this.form[key] = "";
            break;
        }
      });
      this.currentPageChange(1);
    },
    async getFirstLevelOrgs() {
      try {
        const {
          data: { data },
        } = await this.$api.getFirstLevelOrgs();
        this.branchOrgs = data.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
      } catch (error) {}
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
    async exportCompanyExecl() {
      try {
        const { data } = await this.$api.exportCompanyExecl(
          {
            ...this.searchForm,
            companyIds: this.companyIds,
          },
          {
            responseType: "arraybuffer",
          }
        );
        this.$utils.exportBuffer({
          buffer: data,
          exportName: "新增客户列表.xlsx",
        });
      } catch (error) {}
    },
    handleSelectionChange(rows) {
      this.companyIds = rows.map((item) => item.id);
    },
    previewLicense(row) {
      const { businessLicensePath: url } = row;
      const type = String(url.split(".").slice(-1)[0]).toLowerCase();
      switch (type) {
        case "pdf":
          this.$utils.previewEmbeddableFile({ url });
          break;
        case "jpeg":
        case "jpg":
        case "png":
        case "bmp":
          this.$utils.previewImage({ url });
          break;
        case "":
          this.$message.error("营业执照未上传");
          break;
        default:
          this.$message.error("该格式不支持预览");
          break;
      }
    },
    // 1=查询企业名称列表,2=查询结算公司名称列表
    async getClientQueryList(type = 1) {
      try {
        const {
          data: { data },
        } = await this.$api.getClientQueryList({
          params: {
            type,
          },
        });
        const list = data.map((item) => {
          return {
            value: item.name,
            label: item.name,
            disabled: !item.view,
          };
        });
        switch (type) {
          case 1:
            this.companyNames = list;
            break;
          case 2:
            this.settlementCompanyNames = list;
            break;
          default:
            break;
        }
      } catch (error) {}
    },
    async getTableHeight() {
      await this.$nextTick();
      this.tableHeight = this.$refs.main.offsetHeight - 72;
    },
  },
};
</script>

<style lang="less" scoped>
.add-clients {
  display: flex;
  flex-direction: column;
  padding: 20px 20px 0 20px;
  height: calc(100vh - 101px);
  background: #f3f6f9;
  .search-form {
    padding: 10px;
    background: #fff;
  }
  .table-search {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    padding-right: 30px;
    /deep/.el-form-item__content {
      margin-right: 20px;
      min-width: 170px;
    }
  }
  .table-actions {
    display: flex;
    margin-bottom: -15px;
    // justify-content: flex-end;
    /deep/.el-form-item__content {
      margin-right: 20px;
    }
  }
  .deleDiv{
    padding: 40px ;
    text-align: center;
    font-size: 20px;
  }
  .main-table {
    flex: 1;
    min-height: 0;
  }
}
</style>