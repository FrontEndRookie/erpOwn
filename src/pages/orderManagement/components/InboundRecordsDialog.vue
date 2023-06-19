<template>
  <!-- 进仓数据确认记录弹窗 -->
  <el-dialog
    title="进仓数据确认记录"
    class="inbound-records-dialog"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="700px"
    @closed="$emit('closeEv')"
  >
    <ul class="inbound-records-list">
      <li
        v-for="(record, recordIndex) in computedRecords"
        :key="`${record}-${recordIndex}`"
        class="inbound-records-item"
      >
        <div>
          <span>{{ record.commitTime }} 第{{ record.batchNo }}次提交</span>
          <el-tag size="mini" style="margin-left: 10px">{{
            record.statusText
          }}</el-tag>
        </div>
        <dc-primeval-table
          :data="record.list"
          :columns="columns"
          style="margin-top: 10px"
          class="inbound-records-table"
        />
        <dc-primeval-table
          :data="record.subList"
          :columns="subColumns"
          style="margin-top: 10px"
          class="inbound-records-table"
        />
      </li>
    </ul>
  </el-dialog>
</template>

<script>
import DcStatus from "@/status";
export default {
  name: "InboundRecordsDialog",
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
          prop: "orderPiece",
          label: "件数 PCS",
        },
        {
          prop: "orderWeight",
          label: "毛重 KGS",
        },
        {
          prop: "orderCbm",
          label: "体积 CBM",
        },
        {
          prop: "orderVwrText",
          label: "比重",
        },
        {
          prop: "orderCw",
          label: "计费重",
        },
        {
          prop: "orderBubblePointText",
          label: "分泡比例",
        },
      ],
      subColumns: [
        {
          prop: "piece",
          label: "件数 PCS",
        },
        {
          prop: "weight",
          label: "重量 KGS",
        },
        {
          prop: "cbm",
          label: "体积 CBM",
        },
        {
          prop: "length",
          label: "长 CM",
        },
        {
          prop: "width",
          label: "宽 CM",
        },
        {
          prop: "height",
          label: "高 CM",
        },
        {
          prop: "packingText",
          label: "包装方式",
        },
        {
          prop: "outerBoxText",
          label: "外箱情况",
        },
      ],
    };
  },
  computed: {
    computedRecords() {
      return this.records.map((item) => {
        const {
          orderPiece,
          orderWeight,
          orderVwr,
          orderCbm,
          orderCw,
          orderBubblePoint,
          status,
        } = item;
        return {
          ...item,
          list: [
            {
              orderPiece,
              orderWeight,
              orderCbm,
              orderCw,
              orderVwrText: `1:${orderVwr}`,
              orderBubblePointText: DcStatus.commonStatus.getStatus(
                "bubblePoints",
                orderBubblePoint
              ).label,
            },
          ],
          subList: item.logDetails.map((subItem) => {
            const { outerBox, packing } = subItem;
            return {
              ...subItem,
              packingText: DcStatus.commonStatus.getStatus(
                "subInboundPackingTypes",
                packing
              ).label,
              outerBoxText: DcStatus.commonStatus.getStatus(
                "subInboundOuterBoxTypes",
                outerBox
              ).label,
            };
          }),
          statusText: {
            0: "待确认",
            1: "未确认",
            2: "已确认",
          }[status],
        };
      });
    },
  },
};
</script>

<style lang="less" scoped>
.inbound-records-dialog {
  .inbound-records-list {
    padding: 30px 0;
  }
  .inbound-records-item {
    margin-top: 30px;
    &:nth-of-type(1) {
      margin-top: 0;
    }
  }
}
</style>