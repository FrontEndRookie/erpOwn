<template>
  <!-- 账单操作记录弹窗 -->
  <el-dialog
    title="账单操作记录"
    class="bill-operate-records-dialog"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="1000px"
    @closed="$emit('closeEv')"
  >
    <div style="padding: 20px 0">
      <dc-primeval-table
        :data="computedRecords"
        :columns="columns"
        style="width: 100%"
      />
    </div>
  </el-dialog>
</template>

<script>
import DcStatus from "@/status";
export default {
  name: "BillOperateRecordsDialog",
  props: {
    records: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    this.visible = true;
  },
  data() {
    return {
      visible: false,
      columns: [
        {
          prop: "operationTypeText",
          label: "操作类型",
        },
        {
          prop: "createTime",
          label: "操作时间",
        },
        {
          prop: "operationInfo",
          label: "说明",
        },
        {
          prop: "operator",
          label: "操作人",
        },
      ],
    };
  },
  computed: {
    computedRecords() {
      return this.records.map((item) => {
        const { operationType } = item;
        return {
          ...item,
          operationTypeText: DcStatus.commonStatus.getStatus(
            "billOperationTypes",
            operationType
          ).label,
        };
      });
    },
  },
};
</script>

<style lang="less" scoped>
.bill-operate-records-dialog {
}
</style>