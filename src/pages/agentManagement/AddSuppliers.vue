<template>
  <div class="add-suppliers">
    <dc-form size="mini" class="search-form dc-custom-shadow">
      <div class="table-search">
        <el-form-item>
          <el-select
            v-model="form.agentName"
            placeholder="供应商名称"
            filterable
            clearable
            remote
            :remote-method="(query) => (allAgentNameQuery = query)"
            @change="currentPageChange(1)"
          >
            <el-option
              v-for="item in computedAllAgentNames"
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
            v-model.trim="form.socialCreditCode"
            placeholder="统一信用代码"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form.type"
            placeholder="供应商类型"
            clearable
            @change="currentPageChange(1)"
          >
            <el-option
              v-for="item in supplierTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form.settlementName"
            placeholder="结算公司名称"
            filterable
            clearable
            @change="currentPageChange(1)"
          >
            <el-option
              v-for="item in allSettlementNames"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form.settlementWay"
            placeholder="结算方式"
            multiple
            clearable
            @change="currentPageChange(1)"
          >
            <el-option
              v-for="item in settlementWays"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form.responsible"
            placeholder="供应商负责人"
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
            v-model="form.branchName"
            placeholder="供应商负责人所在分公司"
            filterable
            clearable
            style="width: 200px"
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
            v-model="form.startDate"
            type="date"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            placeholder="新增起始日期"
            :picker-options="startDatePickerOptions"
            @change="currentPageChange(1)"
          />
          <span style="margin: 0 10px">-</span>
          <el-date-picker
            v-model="form.endDate"
            type="date"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            placeholder="新增结束日期"
            :picker-options="endDatePickerOptions"
            @change="currentPageChange(1)"
          />
        </el-form-item>
      </div>
      <div class="table-actions">
        <el-form-item>
          <el-button
            type="primary"
            @click="currentPageChange(1)"
            v-auth:none="['255000_B']"
            >搜索</el-button
          >
          <el-button type="primary" @click="resetSearch">清空</el-button>
          <el-button
            type="primary"
            @click="openSupplierDialog"
            v-auth:none="['255001_B']"
            >新增供应商</el-button
          >
          <el-button
            type="primary"
            @click="exportAgentExecl"
            v-auth:none="['255004_B']"
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
              v-auth:none="['255006_B']"
              >立即导入</el-button
            >
          </el-upload>
        </el-form-item>
      </div>
    </dc-form>
    <el-dialog
      title="删除供应商"
      :visible.sync="deleteShow"
      width="30%"
      :before-close="handleClose">
      <div class="deleDiv">确认删除该供应商吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteShow = false">取 消</el-button>
        <el-button type="primary" @click="deleteClient()">确 定</el-button>
      </span>
    </el-dialog>
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
            v-auth:none="['255007_B']"
            @click="deleteClientBefore(row)"
            >删除</el-button
          >
          <el-button
            type="text"
            @click="openSupplierDialog(row)"
            v-auth:none="['255002_B']"
            >编辑</el-button
          >
          <el-button
            type="text"
            @click="previewLicense(row)"
            v-auth:none="['255003_B']"
            >查看营业执照</el-button
          >
        </template>
      </dc-table>
    </main>
    <!-- 编辑供应商弹窗 -->
    <supplier-dialog
      v-if="showSupplierDialog"
      :form="supplier"
      :settlementWays="settlementWays"
      :supplierTypes="supplierTypes"
      :customerResponsibles="customerResponsibles"
      @closeEv="showSupplierDialog = false"
      @afterEdit="
        currentPageChange();
        getAllAgentNames();
        getAllSettlementNames();
      "
      @afterAdd="
        currentPageChange(1);
        getAllAgentNames();
        getAllSettlementNames();
      "
    />
  </div>
</template>

<script>
import SupplierDialog from "./component/SupplierDialog.vue";
import DcStatus from "@/status";
const PAGE_NUM = 1;
const PAGE_SIZE = 10;
export default {
  // 新增供应商列表
  name: "AddSuppliers",
  components: {
    SupplierDialog,
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
    const { settlementWays, supplierTypes } = DcStatus.commonStatus;
    return {
      nextButton: true, // 避免删除连续点击触发
      deleteId:'', // 要删除对象ID
      excelInfo: "", // 上传文件
      isRunActivated: false,
      tableHeight: 200,
      showSupplierDialog: false,
      deleteShow: false,
      form: {
        agentName: "", // 企业名称
        socialCreditCode: "", // 统一社会信用代码
        type: "", // 供应商类型
        settlementWay: [], // 结算方式
        settlementName: "", // 结算公司名称
        responsible: "", // 负责人
        branchName: "", // 子公司名称
        startDate: "", // 起始日期
        endDate: "", // endDate
        pageNum: PAGE_NUM,
        pageSize: PAGE_SIZE,
      },
      ids: [], // 勾选
      tableLoading: false,
      columns: [
        {
          type: "selection",
          fixed: "left",
        },
        {
          prop: "agentName",
          label: "供应商名称",
          "min-width": 160,
          fixed: "left",
        },
        {
          prop: "namePy",
          label: "供应商名称首字母",
          "min-width": 160,
        },
        {
          prop: "socialCreditCode",
          label: "统一社会信用代码",
          "min-width": 170,
        },
        {
          prop: "typeText",
          label: "供应商类型",
          "min-width": 90,
        },
        {
          prop: "settlementWayText",
          label: "结算方式",
        },
        {
          prop: "settlementDays",
          label: "账期",
        },
        {
          prop: "creditLimit",
          label: "额度",
        },
        {
          prop: "sysname",
          label: "供应商负责人",
          "min-width": 100,
        },
        {
          prop: "branchName",
          label: "供应商负责人所在分公司",
          "min-width": 120,
        },
        {
          prop: "remarke",
          label: "供应商备注",
          "min-width": 100,
        },
        {
          prop: "settlementName",
          label: "结算公司名称",
          "min-width": 110,
        },
        {
          prop: "address",
          label: "办公地址",
          "min-width": 160,
        },
        {
          prop: "validDateText",
          label: "营业执照有效期",
          "min-width": 180,
        },
        {
          label: "业务联系人",
          children: [
            {
              prop: "busName",
              label: "姓名",
            },
            {
              prop: "busJob",
              label: "职位",
            },
            {
              prop: "busPhone",
              label: "手机号码",
            },
            {
              prop: "busQQ",
              label: "QQ",
            },
            {
              prop: "busWechat",
              label: "微信",
            },
            {
              prop: "busMail",
              label: "邮箱",
            },
          ],
        },
        {
          label: "财务联系人",
          children: [
            {
              prop: "finName",
              label: "姓名",
            },
            {
              prop: "finPhone",
              label: "手机号码",
            },
            {
              prop: "finQQ",
              label: "QQ",
            },
            {
              prop: "finWechat",
              label: "微信",
            },
            {
              prop: "finMail",
              label: "邮箱",
            },
          ],
        },
        {
          prop: "createTime",
          // label: "供应商新增时间",
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
      supplier: {},
      settlementWays,
      supplierTypes,
      customerResponsibles: [],
      branchOrgs: [],
      allAgentNames: [],
      allSettlementNames: [],
      allAgentNameQuery: "",
    };
  },
  computed: {
    computedAllAgentNames({ allAgentNameQuery }) {
      return this.allAgentNames
        .filter((item) => {
          return (
            allAgentNameQuery !== "" &&
            allAgentNameQuery.trim() !== "" &&
            item.label.toUpperCase().includes(allAgentNameQuery.toUpperCase())
          );
        })
        .slice(0, 10);
    },
    searchForm() {
      const {
        agentName,
        socialCreditCode,
        type,
        settlementWay,
        settlementName,
        responsible,
        branchName,
        startDate,
        endDate,
        pageNum,
        pageSize,
      } = this.form;
      return {
        agentName,
        socialCreditCode,
        type,
        settlementWay,
        settlementName,
        responsible,
        branchName,
        startDate,
        endDate,
        pageNum,
        pageSize,
      };
    },
    computedList() {
      return this.list.map((item) => {
        const { type, settlementWay, validDate } = item;
        const { getStatus } = DcStatus.commonStatus;
        const validDateArr = validDate ? validDate.split(",") : ["", ""];
        const [licenseDuration1, licenseDuration2] = validDateArr;
        return {
          ...item,
          typeText: type
            .split(",")
            .map((t) => (getStatus("supplierTypes", Number(t)) || {}).label)
            .join(","),
          settlementWayText: (getStatus("settlementWays", settlementWay) || {})
            .label,
          validDateText:
            !licenseDuration1 && !licenseDuration2
              ? ""
              : `${licenseDuration1 || "不约定期限"}至${
                  licenseDuration2 || "不约定期限"
                }`,
        };
      });
    },
    startDatePickerOptions() {
      return {
        disabledDate: (time) => {
          const endDate = new Date(this.form.endDate).getTime();
          if (!endDate) {
            return false;
          }
          return time.getTime() > endDate;
        },
      };
    },
    endDatePickerOptions() {
      return {
        disabledDate: (time) => {
          const startDate = new Date(this.form.startDate).getTime();
          return time.getTime() < startDate - 60 * 60 * 1000 * 24;
        },
      };
    },
  },
  methods: {
    // 删除供应商预检
    deleteClientBefore(row){
      if(!this.nextButton){
        return
      }else{
        this.nextButton = false
      }
      var array = [row.id]
      this.$http.post(this.$service.checkAgentHasOrder,array).then(res=>{
        if(res.code==200){
          this.deleteId = row.id
          this.deleteShow = true
        }else {
          this.$message.error('该供应商存在关联订单，不能删除')
        }
      }).catch((err)=>{
        console.log("错误：" + err);
      }).finally(()=>{
        this.nextButton = true
      })
    },
    // 删除供应商
    deleteClient(){
      var array = [this.deleteId]
      this.$http.post(this.$service.deleteSupplier,array).then(res=>{
        if(res.code==200){
          this.$message.success("该供应商已删除")
          this.currentPageChange()
        }else {
          this.$message.error('该供应商存在关联订单，不能删除')
        }
      }).catch((err)=>{
        console.log("错误：" + err);
      }).finally(()=>{
        this.deleteId = ''
        this.deleteShow = false
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
        .post(this.$service.agentDataImport, formdate, {
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
      this.getAllAgentNames();
      this.getAllSettlementNames();
      this.getList();
    },
    pageSizeChange(size) {
      this.ids = [];
      this.form.pageSize = size;
      this.getList();
    },
    currentPageChange(page) {
      this.ids = [];
      this.form.pageNum = page || this.form.pageNum;
      this.getList();
      this.allAgentNameQuery = "";
    },
    async getList() {
      this.tableLoading = true;
      try {
        const {
          data: {
            data: { records, total },
          },
        } = await this.$api.getAddSuppliers({
          ...this.searchForm,
        });
        this.list = [...records];
        this.total = total;
      } catch (error) {
      } finally {
        this.tableLoading = false;
      }
    },
    openSupplierDialog(supplier = {}) {
      if (supplier.id) {
        const { validDate, type } = supplier;
        const validDateStr = (validDate || "").split(",");
        this.supplier = {
          ...supplier,
          licenseDuration1: validDateStr[0] || "",
          licenseDuration2: validDateStr[1] || "",
          types: type.split(",").map((t) => Number(t)),
        };
      } else {
        this.supplier = {
          licenseDuration1: "",
          licenseDuration2: "",
          responsible: "",
          socialCreditCode: "",
          agentName: "",
          namePy: "",
          fileUrl: "",
          address: "",
          types: [],
          settlementName: "",
          settlementWay: 1,
          settlementDays: "",
          creditLimit: "",
          busName: "",
          busJob: "",
          busPhone: "",
          busQQ: "",
          busWechat: "",
          busMail: "",
          finName: "",
          finPhone: "",
          finQQ: "",
          finWechat: "",
          finMail: "",
          remarke: "",
        };
      }
      this.showSupplierDialog = true;
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
    resetSearch() {
      Object.keys(this.form).forEach((key) => {
        switch (key) {
          case "pageNum":
            this.form[key] = PAGE_NUM;
            break;
          case "pageSize":
            this.form[key] = PAGE_SIZE;
            break;
          case "settlementWay":
            this.form[key] = [];
            break;
          default:
            this.form[key] = "";
            break;
        }
      });
      this.currentPageChange(1);
    },
    previewLicense(row) {
      const { fileUrl: url } = row;
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
    async getAllAgentNames() {
      try {
        const {
          data: { data },
        } = await this.$api.getAllAgentNames();
        this.allAgentNames = data.map((item) => {
          return {
            value: item.name,
            label: item.name,
            disabled: !item.view,
          };
        });
      } catch (error) {}
    },
    async getAllSettlementNames() {
      try {
        const {
          data: { data },
        } = await this.$api.getAllSettlementNames();
        this.allSettlementNames = data.map((item) => {
          return {
            value: item,
            label: item,
          };
        });
      } catch (error) {}
    },
    handleSelectionChange(rows) {
      this.ids = rows.map((item) => item.id);
    },
    async exportAgentExecl() {
      try {
        const { data } = await this.$api.exportAgentExecl({
          params: {
            ...this.searchForm,
            ids: this.ids.join(","),
          },
          responseType: "arraybuffer",
        });
        this.$utils.exportBuffer({
          buffer: data,
          exportName: "新增供应商列表.xlsx",
        });
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
.add-suppliers {
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