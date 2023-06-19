<template>
  <!-- 航线审核 -->
  <div class="route-audit">
    <div class="route-audit-wrap">
      <dc-table
        :columns="columns"
        :data="list"
        :current-page="pageNum"
        :total="total"
        :page-size="pageSize"
        @page-size-change="pageSizeChange"
        @current-page-change="currentPageChange"
        border
      >
        <template #table="{ row }">
          <i class="el-icon-document"></i>
          <span>{{ row.orgnName }}</span>
        </template>
        <template #actions="{ row }">
          <el-button
            type="text"
            @click="
              $utils.downloadFile({ url: row.downloadPath, name: row.orgnName })
            "
            >下载</el-button
          >
        </template>
        <template #labelTexts="{ row }">
          <div>
            <el-tag
              v-for="item in row.labelTexts"
              :key="item"
              size="mini"
              style="margin: 0 3px"
              >{{ item }}</el-tag
            >
          </div>
        </template>
        <template #audit="{ row }">
          <template v-if="row.result === 0">
            <el-button type="text" @click="resolveAudit(row)">通过</el-button>
            <el-button
              type="text"
              style="color: #f56c6c"
              @click="rejectAudit(row)"
              >不通过</el-button
            >
          </template>
          <span v-if="row.result === 2" style="color: #67c23a">已通过</span>
          <el-popover
            :key="row.id"
            placement="top"
            width="200"
            trigger="hover"
            :content="row.message"
          >
            <span
              v-if="row.result === 1"
              slot="reference"
              style="color: #909399"
              >未通过</span
            >
          </el-popover>
        </template>
      </dc-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "RouteAudit",
  created() {
    this.init();
  },
  data() {
    return {
      columns: [
        {
          prop: "createTime",
          label: "上传时间",
        },
        {
          prop: "table",
          label: "运价表格",
        },
        {
          prop: "principalNameText",
          label: "航线负责人",
        },
        {
          prop: "agentNames",
          label: "代理公司",
        },
        {
          prop: "actions",
          label: "操作",
        },
        {
          prop: "labelTexts",
          label: "标签",
        },
        {
          prop: "audit",
          label: "审核",
        },
      ],
      list: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
    };
  },
  methods: {
    init() {
      this.getList();
    },
    // 审核通过
    async resolveAudit({ id: impId }) {
      try {
        await this.$confirm("是否要通过该航线", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        this.auditAirline({ impId, isPass: 2 });
      } catch (error) {}
    },
    // 审核不通过
    async rejectAudit({ id: impId }) {
      try {
        const { value } = await this.$prompt("请输入航线不通过原因", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          inputValidator: (val) => {
            if (!val || !val.trim()) {
              return "不能为空";
            }
          },
        });
        this.auditAirline({ impId, isPass: 1, message: value.trim() });
      } catch (error) {}
    },
    async getList() {
      const { pageSize, pageNum } = this;
      const {
        data: {
          data: { pageInfo, totalCount },
        },
      } = await this.$api.getAuditAirlines({
        params: {
          pageSize,
          pageNum,
        },
      });
      this.list = (pageInfo || []).map((item) => {
        const { label, principalName, fileName } = item;
        const { EXCEL_PATH } = process.env;
        return {
          ...item,
          labelTexts: (label || "")
            .split(",")
            .map((i) => {
              return {
                1: "保仓",
                2: "锁价",
              }[i];
            })
            .filter((item) => item),
          principalNameText: principalName || "无",
          downloadPath: `${EXCEL_PATH}${fileName}`,
        };
      });
      this.total = totalCount;
    },
    async auditAirline({ impId, isPass, message = "" }) {
      try {
        const { data } = await this.$api.auditAirline(
          {},
          {
            params: {
              impId,
              isPass,
              message,
            },
            responseType: "arraybuffer",
          }
        );
        const enc = new TextDecoder("utf-8");
        const uint8_msg = new Uint8Array(data);
        const json = enc.decode(uint8_msg);
        if (json.includes("code")) {
          const { code, message } = JSON.parse(json);
          if (code === 200) {
            this.$message.success("操作成功");
            this.getList();
          } else {
            this.$message.error(message);
          }
        } else {
          this.$message.error("操作失败，请查看失败文件");
          const aLink = document.createElement("a");
          let blob = new Blob([data], {
            type: "application/vnd.ms-excel",
          });
          aLink.href = URL.createObjectURL(blob);
          aLink.setAttribute("download", `审核失败文件.xlsx`);
          aLink.click();
          document.body.appendChild(aLink);
        }
      } catch (error) {}
    },
    pageSizeChange(size) {
      this.pageSize = size;
      this.getList();
    },
    currentPageChange(page) {
      this.pageNum = page || this.pageNum;
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
.route-audit {
  padding: 20px;
  overflow: auto;
  height: calc(100vh - 121px);
  background: #f3f6f9;
  &-wrap {
    background: #fff;
  }
}
</style>
