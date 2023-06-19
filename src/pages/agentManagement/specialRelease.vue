<template>
  <div class="body">
    <div class="searchTop">
      <el-form :inline="true" size="medium" class="demo-form-inline">
        <div class="content-search-normal">
          <el-form-item label="日期">
            <div class="block" style="display: inline-block">
              <el-date-picker
                v-model="form.startDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptionsStart"
                placeholder="起始日期"
              >
              </el-date-picker>
            </div>
            ——
            <div class="block" style="display: inline-block">
              <el-date-picker
                v-model="form.endDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptionsEnd"
                placeholder="结束日期"
              >
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="发布者">
            <el-select
              id="sysname"
              v-model="form.applicantName"
              placeholder="请输入发布者名称"
              clearable
              filterable
              remote
              reserve-keyword
              maxlength="10"
              style="width: 200px"
            >
              <el-option
                v-for="item in agentOpt"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              id="sysname"
              v-model="form.status"
              placeholder=""
              clearable
              filterable
              remote
              reserve-keyword
              maxlength="10"
              style="width: 150px"
            >
              <el-option
                v-for="item in statusArray"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-button
                @click="beforAgent"
                size="medium"
                type="primary"
                v-auth="['254000_B']"
                >搜索
              </el-button>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button
              class="special-release-btn"
              size="medium"
              type="primary"
              @click="openSpecialReleaseDialog"
              v-auth="['254002_B']"
              >我要发布</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-radio-group class="type-tab" v-model="tabType">
      <el-radio-button label="供应商发布"></el-radio-button>
      <el-radio-button label="后台发布"></el-radio-button>
    </el-radio-group>
    <div class="tableBody" style="margin-top: 20px">
      <Dialog
        :dialogVisible="dialogVisible"
        @clearHistroy="clearHistroy"
        :indexObj="indexObj"
        :historyArr="historyArr"
      ></Dialog>
      <Table
        v-if="tabType === '供应商发布'"
        :tableData="list"
        @showDialogVisible="showDialogVisible"
        @refreshList="refreshList"
        @openSpecialReleaseDialog="openSpecialReleaseDialog"
      ></Table>
      <Table
        v-if="tabType === '后台发布'"
        :tableData="sysList"
        @showDialogVisible="showDialogVisible"
        @refreshList="refreshList"
        @openSpecialReleaseDialog="openSpecialReleaseDialog"
        showActions
      ></Table>
    </div>
    <el-dialog
      title=""
      :visible.sync="dialogShow"
      width="50%"
      :close-on-click-modal="false"
      :lock-scroll="false"
    >
      <el-form :model="form" style="padding-top: 20px">
        <el-form-item required="true" :label="messageTittle" :label-width="200">
          <el-input
            v-model="dialogMessage"
            style="width: 60%"
            maxlength="20"
            show-word-limit
            autocomplete="off"
            placeholder="请输入理由"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChange(false)">取 消</el-button>
        <el-button
          type="primary"
          :disabled="dialogMessage.trim().length == 0"
          @click="dialogChange(true)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <div
      style="
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
      "
    >
      <div
        class="block"
        style="margin: 40px 100px; margin-left: 300px; margin-bottom: 20px"
      >
        <el-pagination
          v-show="tabType === '供应商发布'"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
        <el-pagination
          v-show="tabType === '后台发布'"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="sysPageNum"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="sysPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="sysTotal"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 特价发布弹窗 -->
    <special-release-dialog
      ref="SpecialReleaseDialog"
      :form="activeSpecialRelease"
      v-if="showSpecialReleaseDialog"
      @closeEv="showSpecialReleaseDialog = false"
      @afterAdd="afterRelease"
      @afterEdit="afterEditRelease"
    />
  </div>
</template>
<script>
import Table from "./component/table2.vue";
import Dialog from "./component/dialog2.vue";
import SpecialReleaseDialog from "./component/SpecialReleaseDialog.vue";
export default {
  components: {
    Table,
    Dialog,
    SpecialReleaseDialog,
  },
  data() {
    return {
      activeSpecialRelease: {},
      showSpecialReleaseDialog: false,
      tabType: "供应商发布",
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = new Date(this.form.endDate).getTime();
          if (endDateVal) {
            return time.getTime() > endDateVal - 0;
          }
        },
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = new Date(this.form.startDate).getTime();
          if (beginDateVal) {
            return time.getTime() < beginDateVal - 0;
          }
        },
      },
      dialogMessage: "", // 理由
      dialogId: "",
      dialogShow: false,
      messageTittle: "",
      //table
      historyArr: [],
      indexObj: "",
      indexId: "",
      // principalArray:[],//航线负责人id
      // salesNameArray:[],//  一代操作人员id 可以为null
      statusArray: [
        { id: null, name: "全部" },
        { id: 1, name: "有效" },
        { id: 3, name: "失效" },
      ],
      dialogVisible: false,
      list: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      sysList: [],
      sysPageSize: 10,
      sysPageNum: 1,
      sysTotal: 0,
      agentOpt: [],
      form: {
        discountInfo: "", //特价信息
        applicantName: "", //客户名称
        endDate: null, //结束日期  如果无值，请传null
        startDate: null, //开始日期	  如果无值，请传nul	2022-05-01
        status: "", //状态
      },
    };
  },
  computed: {
    httpData() {
      return {
        供应商发布: {
          apiName: "getSpecialList",
          listName: "list",
          pageSizeName: "pageSize",
          pageNumName: "pageNum",
          totalName: "total",
        },
        后台发布: {
          apiName: "getSysSpecialList",
          listName: "sysList",
          pageSizeName: "sysPageSize",
          pageNumName: "sysPageNum",
          totalName: "sysTotal",
        },
      }[this.tabType];
    },
    computedSearchData() {
      const {
        form: { discountInfo, applicantName, endDate, startDate, status },
        httpData: { pageNumName, pageSizeName },
      } = this;
      return {
        discountInfo, //特价信息
        pageNum: this[pageNumName],
        pageSize: this[pageSizeName],
        applicantName, //客户名称
        endDate, //结束日期  如果无值，请传null
        startDate, //开始日期	  如果无值，请传nul	2022-05-01
        status, //状态
      };
    },
  },
  mounted() {
    this.getId();
    this.getList();
  },
  methods: {
    beforAgent() {
      const { pageSizeName, pageNumName } = this.httpData;
      // 初始化页数
      this[pageSizeName] = 10;
      this[pageNumName] = 1;
      this.getList();
    },
    dialogChange(type) {
      this.dialogShow = false;
      if (type) {
        this.changePrimaryAgentStatus(this.dialogId);
      } else {
        this.getList();
        this.dialogMessage = "";
      }
    },
    //编辑
    showDialogVisible(obj) {
      const { listName } = this.httpData;
      this.indexObj = this[listName][obj.index];
      if (obj.type == 2) {
        this.history(this[listName][obj.index].id);
      }
      if (obj.type == 5) {
        this.dialogShow = true;
        this.dialogId = this[listName][obj.index].id;
        if (obj.status == true) {
          this.messageTittle = "上架理由";
        } else {
          this.messageTittle = "下架理由";
        }
      }
      this.newAdd(obj.type);
    },
    handleSizeChange(e) {
      const { pageSizeName } = this.httpData;
      this[pageSizeName] = e;
      this.getList();
    },
    handleCurrentChange(e) {
      const { pageNumName } = this.httpData;
      this[pageNumName] = e;
      this.getList();
    },
    refreshList() {
      const { pageNumName } = this.httpData;
      const page = this[pageNumName];
      this.handleCurrentChange(page);
    },
    // 获取航线负责人id与一代操作人员id
    getId() {
      this.$http
        .post(this.$service.specialListApplicantName, "")
        .then((data) => {
          // this.loading = false;/
          if (data.code == 200) {
            var array = [];
            for (let index = 0; index < data.data.length; index++) {
              array[index] = { name: data.data[index] };
            }
            this.agentOpt = array;
          } else {
            this.$message.error(data.message);
          }
        });
    },
    // 清空
    clearHistroy(e) {
      this.historyArr = "";
    },
    async getList() {
      const { apiName, listName, totalName } = this.httpData;
      const {
        data: {
          data: { total, records },
        },
      } = await this.$api[apiName]({
        ...this.computedSearchData,
      });
      this[totalName] = total;
      this[listName] = records.map((item) => {
        var statusArr = ["待审核", "有效", "有效", "已失效", ""];
        return {
          ...item,
          statusName: statusArr[item.status],
          primaryAgent: (() => {
            switch (item.status) {
              case 1:
                return true;
              case 0:
              case 2:
                return false;
            }
          })(),
        };
      });
    },
    // 查看操作历史
    async history(agentdid) {
      var data = await this.$http.get(
        this.$service.specialListLog + "?id=" + agentdid
      );
      if (data.code == 200) {
        this.historyArr = data.data;
      } else {
        this.$message.error(data.message);
      }
    },
    // 修改一代资格
    async changePrimaryAgentStatus(id) {
      var obj = { id: id, message: this.dialogMessage };
      var data = await this.$http.post(this.$service.specialStatus, obj);
      if (data.code == 200) {
        this.$message.success(data.message);
        this.getList();
        this.dialogMessage = "";
      } else {
        this.$message.error(data.message);
        this.dialogMessage = "";
      }
    },
    afterRelease() {
      this.getId();
      this.handleCurrentChange(1);
      this.tabType = "后台发布";
    },
    afterEditRelease() {
      this.getId();
      this.refreshList()
    },
    newAdd(number) {
      // console.log(number);
      this.dialogVisible = number;
      // if(number == 1){
      //   setTimeout(()=>{
      //     this.dialogVisible1 = true
      //   },0)
      // }else if(number == 2){
      //   this.dialogVisible2 = true
      // }else if(number == 3){
      //   this.dialogVisible3 = true
      // }else if(number == 4){
      //   this.dialogVisible4 = true
      // }
    },
    openSpecialReleaseDialog(row = {}) {
      this.showSpecialReleaseDialog = true;
      if (row.id) {
        this.activeSpecialRelease = {
          ...row,
          discountInfo: htmlDecodeByRegExp(row.discountInfo),
        };
      } else {
        this.activeSpecialRelease = {
          discountHeader: "",
          discountInfo: "",
        };
      }
      /*4.用正则表达式实现html解码*/
      function htmlDecodeByRegExp(str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&amp;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "'");
        s = s.replace(/&quot;/g, '"');
        return s;
      }
    },
  },
  watch: {
    tabType() {
      this.getList();
    },
  },
};
</script>
<style lang="less" scoped>
.body {
  width: 100%;
  height: 100%;
  overflow: scroll;
}
.searchTop {
  margin: 20px;
  margin-bottom: 0;
}
.tableBody {
  padding: 0 20px;
  width: 100%;
}
.type-tab {
  margin-top: 20px;
  padding: 0 20px;
  /deep/.el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: #2273ce !important;
  }
}
/deep/.special-release-btn:not(.is-disabled) {
  border-color: #f59a23 !important;
  background-color: #f59a23 !important;
  &:hover {
    border-color: #f59a23 !important;
    background-color: #f59a23 !important;
  }
}
</style>