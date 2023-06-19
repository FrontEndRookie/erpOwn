<template>
  <!-- CMS管理 -->
  <dc-page
    class="CMS-management"
    :showSearchForm="false"
    :showMainTable="false"
  >
    <main class="CMS-management-content">
      <!-- 产品列表 -->
      <section class="product-section CMS-section dc-custom-shadow">
        <h2 class="section-title">cms列表</h2>
        <dc-form size="mini" inline style="margin-top: 20px">
          <el-form-item>
            <el-button type="primary" @click="jump2addCMSProduct"
              >添加cms</el-button
            >
          </el-form-item>
        </dc-form>
        <dc-table
          v-loading="productLoading"
          :columns="productColumns"
          :data="computedProductTableData"
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @page-size-change="pageSizeChange"
          @current-page-change="currentPageChange"
          border
        >
          <template #image="{row}">
            <el-image
              style="width: 100px; height: 100px"
              :src="row.image"
              :preview-src-list="[row.image]"
            >
            </el-image>
          </template>
          <template #operate="{ row }">
            <el-button type="text" size="mini" @click="previewCMSProduct(row)"
              >预览</el-button
            >
            <el-button type="text" size="mini" @click="jump2productDetail(row)"
              >编辑</el-button
            >
            <el-button type="text" size="mini" @click="delCMSProduct(row)"
              >删除</el-button
            >
          </template>
        </dc-table>
      </section>
    </main>
  </dc-page>
</template>

<script>
export default {
  name: "CMSManagement",
  created() {
    this.init();
  },
  activated() {
   
    this.getCMSProducts();
  },
  data() {
    return {
      productLoading: false,
      productColumns: [
        {
          prop: "title",
          label: "标题"
        },
        {
          prop: "categoryId",
          label: "分类"
        },
        {
          prop: "image",
          label: "图片"
        },
        {
          prop: "publishSource",
          label: "发布源"
        },
        {
          prop: "description",
          label: "说明"
        },
        {
          prop: "status",
          label: "状态"
        },
        {
          prop: "top",
          label: "置顶"
        },
        {
          prop: "remarks",
          label: "备注"
        },

        {
          prop: "operate",
          label: "操作"
        }
      ],
      productTableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10
    };
  },
  computed: {
   
    computedProductTableData() {
      return this.productTableData.map((item, index, arr) => {
        const { status, top, categoryId } = item;
        return {
          ...item,
          categoryId: {
            1: "集团新闻",
            2: "品牌宣传",
            3: "业务指导",
            4: "行业咨询",
            5: "现场实景",
            6: "货代知识"
          }[categoryId],
          status: {
            0: "展示",
            1: "隐藏"
          }[status],
          top: {
            0: "不置顶",
            1: "置顶"
          }[top]
        };
      });
    },
   
  },
  methods: {
    init() {
      this.getCMSProducts();
    },
  
    async getCMSProducts() {
      this.productLoading = true;
      try {
        const {
          data: {
            data: { records, total }
          }
        } = await this.$api.cmsPage({
          pageNum: this.pageNum,
          pageSize: this.pageSize
        });
        this.productTableData = records;
        this.total = total;
      } catch (error) {
      } finally {
        this.productLoading = false;
      }
    },
  
    async delCMSProduct({ id }) {
      try {
        await this.$confirm("确认删除该产品？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        await this.$api.cmsDelete([id]);
        this.getCMSProducts();
        this.$message.success("操作成功");
      } catch (error) {}
    },
    jump2addCMSProduct() {
      this.$router.push({ name: "AddCMSProduct" });
    },
    jump2productDetail(row) {
      this.$router.push({ name: "EditCMSProduct", query: { id: row.id } });
    },
    async previewCMSProduct({ content, title }) {
      this.$utils.previewFbaProduct({ content, title });
    },
    pageSizeChange(size) {
      this.pageSize = size;
      this.getCMSProducts();
    },
    currentPageChange(page) {
      this.pageNum = page;
      this.getCMSProducts();
    }
  },
  watch: {
    "activeSpecialLine.id"() {
      this.getCMSProducts();
    }
  }
};
</script>
<style lang="less">
.image-preview-message-box {
  max-width: 60vw !important;
  img {
    max-width: 80%;
  }
}
</style>
<style lang="less" scoped>
.CMS-management {
  padding: 20px !important;
  overflow-y: auto;
  &-content {
    display: flex;
  }
  .CMS-section {
    padding: 20px;
    min-width: 0;
    background: #fff;
    margin-bottom: auto;
    &.special-line-section {
      width: 500px;
    }
    &.product-section {
      margin-left: 20px;
      flex: 1;
    }
    .section-title {
      font-size: 20px;
      color: #2273ce;
    }
  }
}
</style>
