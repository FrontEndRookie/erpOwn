<template>
  <!-- 进仓数据 -->
  <div class="inbound-data">
    <!-- 数据 -->
    <dc-primeval-table :data="computedList" :columns="computedColumns">
      <template #inboundPiece="{ row, index }">
        <div v-auth-field:[row.inboundPiece]="['103000_FC']">
          <input
            class="inbound-input"
            v-model="row.inboundPiece"
            :disabled="
              orderDisableds.inboundDataDisabled || orderDisableds.orderDisabled
            "
            @input="
              inputHandler({
                list: 'list',
                key: 'inboundPiece',
                index,
                val: row.inboundPiece,
              })
            "
            @change="
              changeHandler({
                list: 'list',
                key: 'inboundPiece',
                index,
                val: row.inboundPiece,
              })
            "
          />
        </div>
      </template>
      <template #inboundWeight="{ row, index }">
        <div v-auth-field:[row.inboundWeight]="['103000_FC']">
          <input
            class="inbound-input"
            v-model="row.inboundWeight"
            :disabled="
              orderDisableds.inboundDataDisabled ||
              orderDisableds.cancelOrderDisabled
            "
            @input="
              inputHandler({
                list: 'list',
                key: 'inboundWeight',
                index,
                val: row.inboundWeight,
              })
            "
            @change="
              changeHandler({
                list: 'list',
                key: 'inboundWeight',
                index,
                val: row.inboundWeight,
                isGetBillingWeight: true,
              })
            "
          />
        </div>
      </template>
      <template #inboundCbm="{ row, index }">
        <div v-auth-field:[row.inboundCbm]="['103000_FC']">
          <input
            class="inbound-input"
            v-model="row.inboundCbm"
            :disabled="
              orderDisableds.inboundDataDisabled ||
              orderDisableds.cancelOrderDisabled
            "
            @input="
              inputHandler({
                list: 'list',
                key: 'inboundCbm',
                index,
                val: row.inboundCbm,
              })
            "
            @change="
              changeHandler({
                list: 'list',
                key: 'inboundCbm',
                index,
                val: row.inboundCbm,
                isGetBillingWeight: true,
              })
            "
          />
        </div>
      </template>
      <template #inboundVwrText="{ row }">
        <div v-auth-field:[row.inboundVwrText]="['103000_FC']">
          {{ row.inboundVwrText }}
        </div>
      </template>
      <template #bubblePointText="{ row, index }">
        <div
          v-auth-field:[row.bubblePointText]="['103000_FC']"
          style="position: relative"
        >
          <el-select
            :class="{ 'show-bubble-point-warning': showBubblePointWarning }"
            v-model="row.bubblePoint"
            size="mini"
            placeholder="请选择分泡比例"
            :disabled="
              orderDisableds.bubblePointDisabled ||
              orderDisableds.inboundDataDisabled ||
              orderDisableds.cancelOrderDisabled
            "
            @change="
              (val) => {
                selectChange({ list: 'list', key: 'bubblePoint', val, index });
                changeHandler({
                  list: 'list',
                  key: 'bubblePoint',
                  index,
                  val: row.bubblePoint,
                  isGetBillingWeight: true,
                });
              }
            "
          >
            <el-option
              v-for="item in bubblePoints"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span class="bubble-point-warning">
            <el-alert
              v-show="showBubblePointWarning"
              title="该货物为重货，分泡比例异常"
              type="error"
              :closable="false"
              show-icon
            >
            </el-alert>
          </span>
        </div>
      </template>
      <template #inboundCw="{ row, index }">
        <div v-auth-field:[row.inboundCw]="['103010_FC']">
          <input
            class="inbound-input"
            style="width:100px"
            v-model="row.inboundCw"
            :disabled="
              orderDisableds.inboundCwDisabled ||
              orderDisableds.cancelOrderDisabled
            "
            @input="
              inputHandler({
                list: 'list',
                key: 'inboundCw',
                index,
                val: row.inboundCw,
              })
            "
            @change="
              changeHandler({
                list: 'list',
                key: 'inboundCw',
                index,
                val: row.inboundCw,
              })
            "
          />
        </div>
      </template>
      <template #inboundImg>
        <image-uploader
          :images="totalImages"
          :orderId="order.id"
          :disabled="
            orderDisableds.inboundDataDisabled ||
            orderDisableds.cancelOrderDisabled
          "
        />
      </template>
    </dc-primeval-table>
    <!-- 分数据 -->
    <dc-primeval-table
      :data="computedSubList"
      :columns="computedSubColumns"
      style="margin-top: 50px"
    >
      <template #piece="{ row, index }">
        <input
          class="inbound-input"
          v-model="row.piece"
          :disabled="
            orderDisableds.inboundDataDisabled ||
            orderDisableds.cancelOrderDisabled
          "
          @input="
            inputHandler({
              list: 'subList',
              key: 'piece',
              index,
              val: row.piece,
              formatKey: 'inboundSubPiece',
            })
          "
          @change="
            changeHandler({
              list: 'subList',
              key: 'piece',
              index,
              val: row.piece,
              isGetVolume: true,
            })
          "
        />
      </template>
      <template #weight="{ row, index }">
        <input
          class="inbound-input"
          v-model="row.weight"
          :disabled="
            orderDisableds.inboundDataDisabled ||
            orderDisableds.cancelOrderDisabled
          "
          @input="
            inputHandler({
              list: 'subList',
              key: 'weight',
              index,
              val: row.weight,
              formatKey: 'inboundSubWeight',
            })
          "
          @change="
            changeHandler({
              list: 'subList',
              key: 'weight',
              index,
              val: row.weight,
            })
          "
        />
      </template>
      <template #cbm="{ row, index }">
        <input
          class="inbound-input"
          v-model="row.cbm"
          :disabled="
            orderDisableds.inboundDataDisabled ||
            orderDisableds.cancelOrderDisabled
          "
          @input="
            inputHandler({
              list: 'subList',
              key: 'cbm',
              index,
              val: row.cbm,
              formatKey: 'inboundSubCbm',
            })
          "
          @change="
            changeHandler({
              list: 'subList',
              key: 'cbm',
              index,
              val: row.cbm,
            })
          "
        />
      </template>
      <template #length="{ row, index }">
        <input
          class="inbound-input"
          v-model="row.length"
          :disabled="
            orderDisableds.inboundDataDisabled ||
            orderDisableds.cancelOrderDisabled
          "
          @input="
            inputHandler({
              list: 'subList',
              key: 'length',
              index,
              val: row.length,
              formatKey: 'inboundSubLength',
            })
          "
          @change="
            changeHandler({
              list: 'subList',
              key: 'length',
              index,
              val: row.length,
              isGetVolume: true,
            })
          "
        />
      </template>
      <template #width="{ row, index }">
        <input
          class="inbound-input"
          v-model="row.width"
          :disabled="
            orderDisableds.inboundDataDisabled ||
            orderDisableds.cancelOrderDisabled
          "
          @input="
            inputHandler({
              list: 'subList',
              key: 'width',
              index,
              val: row.width,
              formatKey: 'inboundSubWidth',
            })
          "
          @change="
            changeHandler({
              list: 'subList',
              key: 'width',
              index,
              val: row.width,
              isGetVolume: true,
            })
          "
        />
      </template>
      <template #height="{ row, index }">
        <input
          class="inbound-input"
          v-model="row.height"
          :disabled="
            orderDisableds.inboundDataDisabled ||
            orderDisableds.cancelOrderDisabled
          "
          @input="
            inputHandler({
              list: 'subList',
              key: 'height',
              index,
              val: row.height,
              formatKey: 'inboundSubHeight',
            })
          "
          @change="
            changeHandler({
              list: 'subList',
              key: 'height',
              index,
              val: row.height,
              isGetVolume: true,
            })
          "
        />
      </template>
      <template #packing="{ row, index }">
        <el-select
          v-model="row.packing"
          :disabled="
            orderDisableds.inboundDataDisabled ||
            orderDisableds.cancelOrderDisabled
          "
          size="mini"
          placeholder="请选择包装方式"
          @change="
            (val) =>
              selectChange({ list: 'subList', key: 'packing', val, index })
          "
        >
          <el-option
            v-for="item in subInboundPackingTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </template>
      <template #outerBox="{ row, index }">
        <el-select
          v-model="row.outerBox"
          :disabled="
            orderDisableds.inboundDataDisabled ||
            orderDisableds.cancelOrderDisabled
          "
          size="mini"
          placeholder="请选择外箱情况"
          @change="
            (val) =>
              selectChange({ list: 'subList', key: 'outerBox', val, index })
          "
        >
          <el-option
            v-for="item in subInboundOuterBoxTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </template>
      <template #subInboundImg="{ row }">
        <image-uploader
          :images="row.orderAttachments"
          :orderId="order.id"
          :disabled="
            orderDisableds.inboundDataDisabled ||
            orderDisableds.cancelOrderDisabled
          "
        />
      </template>
      <template #actions="{ row, index }">
        <el-button
          type="text"
          size="mini"
          v-show="row.showAddBtn"
          @click="addSub"
          >新增</el-button
        >
        <el-button
          type="text"
          size="mini"
          style="color: #f56c6c"
          v-show="row.showDelBtn"
          @click="subList.splice(index, 1)"
          >删除</el-button
        >
      </template>
    </dc-primeval-table>
  </div>
</template>

<script>
import DcStatus from "@/status";
import ImageUploader from "./ImageUploader";
// 需要父子通信的数据
const OrderKeys = [
  "orderCargoDetailList", // 订单货物列表
  "inboundPiece", // 进仓件数
  "inboundWeight", // 进仓毛重
  "inboundCbm", // 进仓体积
  "inboundVwr", // 进仓比重
  "bubblePoint", // 分泡比例
  "inboundCw", // 进仓计费重
  "orderAttachmentList", // 附件列表
];
export default {
  name: "InboundData",
  components: {
    ImageUploader,
  },
  created() {
    this.init();
  },
  props: {
    order: {
      type: Object,
      default: () => ({}),
    },
    orderDisableds: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const { subInboundPackingTypes, subInboundOuterBoxTypes, bubblePoints } =
      DcStatus.commonStatus;
    return {
      list: [],
      columns: [
        {
          prop: "inboundPiece",
          label: "件数",
        },
        {
          prop: "inboundWeight",
          label: "毛重",
        },
        {
          prop: "inboundCbm",
          label: "体积",
        },
        {
          prop: "inboundVwrText",
          label: "比重",
          width: "60px",
        },
        {
          prop: "bubblePointText",
          label: "分泡比例",
          width: "90px",
        },
        {
          prop: "inboundCw",
          label: "计费重",
        },
        {
          prop: "inboundImg",
          label: "进仓图片",
          width: "280px",
        },
      ],
      subList: [],
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
          label: "体积 CBM(m³)",
        },
        {
          prop: "length",
          label: "长(cm)",
        },
        {
          prop: "width",
          label: "宽(cm)",
        },
        {
          prop: "height",
          label: "高(cm)",
        },
        {
          prop: "packing",
          label: "包装方式",
          width: "90px",
        },
        {
          prop: "outerBox",
          label: "外箱情况",
          width: "90px",
        },
        {
          prop: "subInboundImg",
          label: "进仓图片",
          width: "170px",
        },
        {
          prop: "actions",
          label: "操作",
          width: "80px",
        },
      ],
      subInboundPackingTypes,
      subInboundOuterBoxTypes,
      bubblePoints,
      totalImages: [],
    };
  },
  computed: {
    showBubblePointWarning() {
      const { bubblePoint, inboundVwr } = this.list[0];
      const { status } = this.order;
      return (
        bubblePoint !== 10 && inboundVwr >= 167 && [13, 15].includes(status)
      );
    },
    computedSubColumns() {
      return this.subColumns.filter((item) => {
        return !(
          this.orderDisableds.inboundDataDisabled && item.prop === "actions"
        );
      });
    },
    computedSubList() {
      return this.subList.map((item, index, list) => {
        return {
          ...item,
          showAddBtn: index === list.length - 1,
          showDelBtn: list.length !== 1,
        };
      });
    },
    computedColumns() {
      return this.columns.filter((item) => item);
    },
    computedList() {
      return this.list.map((item) => {
        const currentBubblePoint =
          DcStatus.commonStatus.getStatus("bubblePoints", item.bubblePoint) ||
          {};
        return {
          ...item,
          inboundVwrText: item.inboundVwr ? `1:${item.inboundVwr}` : "",
          bubblePointText: currentBubblePoint.label,
        };
      });
    },
  },
  methods: {
    init() {
      const {
        orderCargoDetailList,
        inboundPiece,
        inboundWeight,
        inboundCbm,
        inboundVwr,
        bubblePoint,
        inboundCw,
        orderAttachmentList,
      } = this.$utils.copyDataByKeys(this.order, OrderKeys);
      this.list = [
        {
          inboundPiece,
          inboundWeight,
          inboundCbm,
          inboundVwr,
          bubblePoint,
          inboundCw,
        },
      ];
      this.totalImages = orderAttachmentList.filter(
        (item) => item.attachmentType === 1
      );
      if (orderCargoDetailList) {
        if (orderCargoDetailList.length <= 0) {
          this.addSub();
        } else {
          this.subList = orderCargoDetailList.map((item) => {
            const { orderAttachments } = item;
            return {
              ...item,
              orderAttachments: orderAttachments
                ? orderAttachments.map((i) => i)
                : [],
            };
          });
        }
      }
    },
    addSub() {
      const sub = {
        piece: "",
        weight: "",
        cbm: "",
        length: "",
        width: "",
        height: "",
        packing: 1,
        outerBox: 1,
        orderAttachments: [],
      };
      this.subList.push(sub);
    },
    // formatKey 查表用的字段名
    inputHandler({ list, key, index, val: newVal, formatKey }) {
      formatKey = formatKey || key;
      const listItem = this[list][index];
      const oldVal = listItem[key];
      const val = this.$utils.getValidNumber({
        format: DcStatus.numberFormat[formatKey],
        newVal,
        oldVal,
      });
      this[list].splice(index, 1, {
        ...listItem,
        [key]: String(val).trim(),
      });
    },
    /**
     * input change事件
     * 处理输入0的问题，计算计费重，计算体积
     * @param {Boolean}} isGetBillingWeight 是否需要计算计费重比重
     * @param {Boolean}} isGetVolume 是否需要计算体积
     */
    changeHandler({
      list,
      key,
      index,
      val,
      isGetBillingWeight = false,
      isGetVolume = false,
    }) {
      const listItem = this[list][index];
      if (Number(val) === 0) {
        this[list].splice(index, 1, {
          ...listItem,
          [key]: "",
        });
        this.orderChange(key, "");
        return;
      }
      this.orderChange(key, val);
      if (isGetBillingWeight) {
        const listItem = this.list[index];
        const {
          bubblePoint,
          inboundWeight: weight,
          inboundCbm: volume,
        } = listItem;
        const inboundCw = this.$utils.getBillingWeight({
          bubblePoint,
          weight,
          volume,
        });
        this.list.splice(index, 1, {
          ...listItem,
          inboundCw,
          inboundVwr: volume ? Math.round(weight / volume) : "",
        });
        this.orderChange("inboundCw", inboundCw);
        this.orderChange("bubblePoint", bubblePoint);
      }
      if (isGetVolume) {
        const listItem = this.subList[index];
        const { length, width, height, piece, cbm } = listItem;
        if (length && width && height && piece && !cbm) {
          this.subList.splice(index, 1, {
            ...listItem,
            cbm: Math.max(
              Math.round(
                ((length * 100 * (width * 100) * (height * 100) * piece) /
                  10 ** 12) *
                  100
              ) / 100,
              0.01
            ),
          });
        }
      }
    },
    orderChange(key, val) {
      switch (key) {
        case "inboundCw":
          this.$emit("orderInboundCwChange", val);
          this.$emit("orderCostCwChange");
          break;
        case "bubblePoint":
          this.$emit("orderBubblePointChange", val);
          break;
        default:
          break;
      }
    },
    selectChange({ list, key, val, index }) {
      const listItem = this[list][index];
      this[list].splice(index, 1, {
        ...listItem,
        [key]: val,
      });
    },
    formValidate(isValidate = true) {
      return new Promise((resolve, reject) => {
        const validateList = [
          {
            key: "inboundPiece",
            warningText: "请填写进仓件数",
          },
          {
            key: "inboundWeight",
            warningText: "请填写进仓毛重",
          },
          {
            key: "inboundCbm",
            warningText: "请填写进仓体积",
          },
          {
            key: "inboundVwr",
            warningText: "请填写进仓比重",
          },
          {
            key: "bubblePoint",
            warningText: "请选择分泡比例",
          },
          {
            key: "inboundCw",
            warningText: "请填写进仓计费重",
          },
        ];
        const isStatusValidate = ![1, 2, 3, 9].includes(this.order.status);
        if (isValidate && isStatusValidate) {
          const isAllFinished = validateList.every((item) => {
            if (!this.list[0][item.key]) {
              this.$message.error(item.warningText);
              return false;
            }
            return true;
          });
          if (!isAllFinished) {
            reject();
            return;
          }
          const isAllSubFinished = this.subList.every((item) => {
            const { cbm, height, piece, weight, width, length } = item;
            if (!cbm || !height || !piece || !weight || !width || !length) {
              this.$message.error("请填写进仓分数据");
              return false;
            }
            return true;
          });
          if (!isAllSubFinished) {
            reject();
            return;
          }
          const isPieceEqual =
            this.subList.reduce((total, item) => {
              return (total += Number(item.piece));
            }, 0) === Number(this.list[0].inboundPiece);
          if (!isPieceEqual) {
            this.$message.error("总件数与分件数不匹配");
            reject();
            return;
          }
        }
        const {
          inboundPiece,
          inboundWeight,
          inboundCbm,
          inboundVwr,
          bubblePoint,
          inboundCw,
        } = this.list[0];
        const data = {
          inboundPiece,
          inboundWeight,
          inboundCbm,
          inboundVwr,
          bubblePoint,
          inboundCw,
        };
        const form = Object.entries(data).reduce((obj, [key, val]) => {
          if (val !== this.order[key] && val !== Number(this.order[key])) {
            obj = {
              ...obj,
              [key]: val,
            };
          }
          return obj;
        }, {});
        const {
          order: { orderAttachmentList, orderCargoDetailList },
          totalImages,
          subList,
          $utils: { comparedJSON },
        } = this;
        resolve({
          ...form,
          inboundSubList: (() => {
            if (comparedJSON(subList, orderCargoDetailList)) {
              return null;
            }
            return subList;
          })(),
          inboundTotalImages: (() => {
            // if (
            //   comparedJSON(
            //     totalImages,
            //     orderAttachmentList.filter((item) => item.attachmentType === 1)
            //   )
            // ) {
            //   return null;
            // }
            return this.totalImages;
          })(),
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.inbound-data {
  .inbound-input {
    box-sizing: border-box;
    padding: 2px 10px;
    border: 1px solid #e5e5e5;
    width: 80px;
    text-align: center;
    font-size: 12px;
    background: #fff;
    &:disabled {
      background: #f5f7fa;
      cursor: not-allowed;
    }
  }
  /deep/.show-bubble-point-warning {
    .el-input__inner {
      border-color: #f56c6c !important;
    }
  }
  .bubble-point-warning {
    position: absolute;
    width: 240px;
    left: 50%;
    top: 0;
    transform: translate(-50%, 52px);
  }
}
</style>
