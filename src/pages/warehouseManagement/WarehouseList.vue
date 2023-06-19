<template>
  <div class="warehouse-list-wrap">
    <div class="warehouse-list-content">
      <!-- 工具栏 -->
      <header class="tools-bar">
        <el-form :inline="true">
          <el-form-item label="仓库名称:">
            <el-autocomplete
              v-model="warehouseName"
              :fetch-suggestions="
                (query, cb) => querySearch(query, cb, 'warehouseNames')
              "
              placeholder="请输入仓库名称"
              clearable
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="是否自有:">
            <el-select
              clearable
              v-model="warehouseType"
              placeholder="请选择是否自有"
            >
              <el-option
                v-for="item in warehouseTypes"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="城市:">
            <el-input
              v-model="city"
              clearable
              type="text"
              :maxlength="30"
              placeholder="请输入城市名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="仓库所属:">
            <el-autocomplete
              v-model="belong"
              :fetch-suggestions="
                (query, cb) => querySearch(query, cb, 'belongs')
              "
              placeholder="请输入仓库所属"
              clearable
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="提交者:">
            <el-autocomplete
              v-model="userName"
              :fetch-suggestions="
                (query, cb) => querySearch(query, cb, 'userNames')
              "
              placeholder="请输入提交者"
              clearable
            ></el-autocomplete>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="currentPageChange(1)"
              v-auth="['551000_B']"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
        <div style="text-align: right">
          <el-button
            type="primary"
            @click="openWarehouseDialog()"
            v-auth="['551003_B']"
            >添加仓库</el-button
          >
        </div>
      </header>
      <!-- 表格 -->
      <dc-table
        style="margin-top: 20px"
        :columns="columns"
        :data="warehouses"
        :total="total"
        :current-page="pageNum"
        :page-size="pageSize"
        @page-size-change="pageSizeChange"
        @current-page-change="currentPageChange"
        border
      >
        <template #tools="{ row }">
          <el-button
            type="text"
            @click="openWarehouseDialog(row)"
            v-auth="['551001_B']"
            >编辑</el-button
          >
          <el-button
            type="text"
            @click="delWarehouse(row)"
            v-auth="['551002_B']"
            >删除</el-button
          >
        </template>
        <template #map="{ row }">
          <div style="display: flex; align-items: center">
            <img
              :src="mapIcon"
              style="width: 30px; cursor: zoom-in"
              @click="$utils.previewOffice({ xpath: row.xpath })"
            />
            <i
              class="el-icon-download"
              style="margin-left: 10px; cursor: pointer; font-size: 24px"
              @click="
                $utils.downloadFile({ url: row.xpath, name: row.mapModuleName })
              "
            ></i>
          </div>
        </template>
      </dc-table>
      <!-- 编辑|新建弹窗 -->
      <warehouse-dialog
        v-if="showDialog"
        :form.sync="form"
        @closeEv="showDialog = false"
        @afterEdit="
          currentPageChange();
          searchCondList();
        "
        @afterAdd="
          currentPageChange(1);
          searchCondList();
        "
      />
    </div>
  </div>
</template>

<script>
import WarehouseDialog from "./WarehouseDialog";
const mapIcon = require("@/assets/map.svg");
const warehouseTypes = [
  {
    value: "",
    label: "全部",
  },
  {
    value: 0,
    label: "自有",
  },
  {
    value: 1,
    label: "第三方",
  },
];
export default {
  name: "WarehouseList",
  components: {
    WarehouseDialog,
  },
  data() {
    return {
      showDialog: false,
      form: {},
      mapIcon,
      city: "",
      belong: "",
      warehouseType: "",
      warehouseTypes,
      warehouseName: "",
      userName: "",
      columns: [
        {
          prop: "createTime",
          label: "新增时间",
          width: "160",
        },
        {
          prop: "updateTime",
          label: "更新时间",
          width: "160",
        },
        {
          prop: "userName",
          label: "提交者",
        },
        {
          prop: "typeText",
          label: "自有/第三方",
        },
        {
          prop: "name",
          label: "仓库名称",
        },
        {
          prop: "belong",
          label: "仓库所属",
        },
        {
          prop: "city",
          label: "城市",
        },
        {
          prop: "contact",
          label: "仓库联系人",
        },
        {
          prop: "tel",
          label: "仓库电话",
        },
        {
          prop: "address",
          label: "仓库地址",
          width: "400",
        },
        {
          prop: "tools",
          label: "操作",
        },
        {
          prop: "map",
          label: "地图",
        },
      ],
      warehouses: [], // 仓库列表
      belongs: [], // 所属列表
      warehouseNames: [], // 仓库名称列表
      userNames: [], // 提交者列表
      pageSize: 10,
      pageNum: 1,
      total: 0,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getWarehouses();
      this.searchCondList();
    },
    async getWarehouses() {
      const {
        belong,
        city,
        pageNum,
        pageSize,
        warehouseName,
        warehouseType,
        userName,
      } = this;
      const {
        code,
        data: { records, total },
        message,
      } = await this.$http.post(this.$service.getWarehouses, {
        belong,
        city,
        pageNum,
        pageSize,
        warehouseName,
        warehouseType,
        userName,
      });
      if (code === 200) {
        this.warehouses = records.map((item) => {
          return {
            ...item,
            typeText: warehouseTypes.find((type) => type.value === item.type)
              .label,
          };
        });
        this.total = total;
      } else {
        this.$message.error(message);
      }
    },
    pageSizeChange(size) {
      this.pageSize = size;
      this.getWarehouses();
    },
    currentPageChange(page) {
      this.pageNum = page || this.pageNum;
      this.getWarehouses();
    },
    // 删除仓库
    delWarehouse(warehouse = {}) {
      this.$confirm("是否确认删除?", "提示", {
        type: "warning",
      })
        .then(async () => {
          const { code, message } = await this.$http.post(
            this.$service.delWarehouse,
            {
              id: warehouse.id,
            }
          );
          if (code === 200) {
            this.currentPageChange();
            this.searchCondList();
          } else {
            this.$message.error(message);
          }
        })
        .catch(() => {});
    },
    // 打开编辑|新建仓库弹窗
    openWarehouseDialog(warehouse = {}) {
      if (warehouse.id) {
        this.form = {
          ...warehouse,
        };
      } else {
        this.form = {
          address: "",
          belong: "自有仓库",
          city: "",
          contact: "",
          mapModuleName: "",
          mapModulePath: "",
          name: "",
          tel: "",
          type: 0,
        };
      }
      this.showDialog = true;
    },
    // 查询筛选栏列表
    async searchCondList() {
      const { code, data, message } = await this.$http.get(
        this.$service.searchCondList,
        {
          params: {
            typeCode: "0,1,2", // 0=仓库名称，1=仓库所属，2=提交者
          },
        }
      );
      if (code === 200) {
        this.warehouseNames = data[0].map((item) => ({ value: item }));
        this.belongs = data[1].map((item) => ({ value: item }));
        this.userNames = data[2].map((item) => ({ value: item }));
      } else {
        this.$message.error(message);
      }
    },
    querySearch(query, cb, attr) {
      const results = this[attr].filter((item) => {
        return item.value.includes(query);
      });
      cb(results);
    },
  },
};
</script>


<style scoped lang="less">
.warehouse-list-wrap {
  padding: 20px;
  overflow: auto;
  height: calc(100vh - 121px);
  background: #f3f6f9;
  .warehouse-list-content {
    padding: 20px;
    background: #fff;
  }
}
</style>
