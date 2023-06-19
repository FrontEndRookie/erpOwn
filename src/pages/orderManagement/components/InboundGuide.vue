<template>
  <!-- 进仓指引(新) -->
  <div class="inbound-guide">
    <div class="guide-content">
      <dc-form
        ref="form"
        :model="form"
        label-width="120px"
        size="mini"
        :rules="computedRules"
        :disabled="
          orderDisableds.inboundGuideDisabled || orderDisableds.orderDisabled
        "
      >
        <el-form-item label="进仓编号">
          <div v-auth-field:[form.inboundNo]="['102000_FC']">
            <el-input
              v-model.trim="form.inboundNo"
              placeholder="进仓编号"
              style="width: 180px"
              maxlength="20"
              show-word-limit
              @change="$emit('orderInboundNoChange', form.inboundNo)"
            />
            <el-button
              type="text"
              @click="
                form.inboundNo = computedInboundNo;
                $emit('orderInboundNoChange', form.inboundNo);
              "
              >获取进仓编号</el-button
            >
          </div>
        </el-form-item>
        <el-form-item label="预计进仓时间">
          <div v-auth-field:[form.expectedInboundTime]="['101180_FC']">
            <el-date-picker
              v-model="form.expectedInboundTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm"
              placeholder="选择预计进仓时间"
              style="width: 180px"
              :clearable="false"
              :picker-options="expectedInboundTimePickerOptions"
              @change="
                $emit(
                  'orderExpectedInboundTimeChange',
                  form.expectedInboundTime
                )
              "
            />
          </div>
        </el-form-item>
        <el-form-item label="最晚进仓时间">
          <div v-auth-field:[form.latestInboundDate]="['102010_FC']">
            <el-date-picker
              v-model="form.latestInboundDate"
              disabled
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择最晚进仓时间"
              style="width: 180px"
              :clearable="false"
            />
          </div>
        </el-form-item>
        <el-form-item label="寄单地址">
          <div
            v-auth-field:[form.customsAddress]="['102022_FC']"
            style="width: 300px"
          >
            <el-input
              type="textarea"
              v-model="form.customsAddress"
              placeholder="寄单地址"
              maxlength="150"
              show-word-limit
            />
          </div>

          <span style="color: #aaa; font-size: 12px"
            >注：寄单地址中请不要输入“（）”</span
          >
          <el-dropdown
            placement="bottom-start"
            class="customs-address-dropdown"
            @command="(val) => (form.customsAddress = val)"
          >
            <el-button type="text">快速选择上海报关行</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in customsAddressList"
                :key="item.value"
                :command="item.value"
                >{{ item.label }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item label="仓库名称">
          <div v-auth-field:[form.warehouseName]="['102015_FC']">
            <dc-select
              popper-class="warehouse-name-select"
              v-model.trim="form.warehouseName"
              placeholder="选择仓库名称"
              filterable
              @change="warehouseChange"
            >
              <el-option
                v-for="item in warehouses"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </dc-select>
          </div>
        </el-form-item>
        <el-form-item label="仓库地址">
          <div v-auth-field:[form.warehouseAddress]="['102020_FC']">
            <el-input
              v-model.trim="form.warehouseAddress"
              type="textarea"
              placeholder="填写仓库地址"
              maxlength="200"
              show-word-limit
              clearable
            />
          </div>
        </el-form-item>
        <el-form-item label="仓库电话">
          <div v-auth-field:[form.warehouseTel]="['102025_FC']">
            <el-input
              v-model.trim="form.warehouseTel"
              type="textarea"
              placeholder="填写仓库电话"
              maxlength="200"
              show-word-limit
              clearable
            />
          </div>
        </el-form-item>
        <el-form-item label="仓库备注">
          <div v-auth-field:[form.warehouseRemark]="['102030_FC']">
            <el-input
              type="textarea"
              v-model.trim="form.warehouseRemark"
              placeholder="填写仓库留言"
              maxlength="100"
              show-word-limit
              clearable
            />
          </div>
        </el-form-item>
        
      </dc-form>
      <el-form inline style="position:absolute;bottom:0px;left:23px;">
        <el-form-item label="交货资料下载">
          <el-select v-model="deliveryDataType" multiple placeholder="可选择多份文件同时下载" clearable collapse-tags style="width:320px">
            <el-option
              v-for="item in deliveryDataList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <img src="../../../assets/downloadLogo.png" alt="" style="width:30px;margin:0 10px;">
          <el-button type="primary" size="mini" @click="downLoadDelivery">确认下载</el-button>
        </el-form-item>
      </el-form>
   
      <aside class="aside">
        <div class="map-download" v-if="mapData.xpath">
          <img
            src="@/assets/inbound-guide_map-download.png"
            style="width: 40px"
            @click="
              $utils.downloadFile({
                url: mapData.xpath,
                name: mapData.attachmentName,
              })
            "
          />
          <el-button
            type="text"
            style="margin-top: 10px"
            @click="$utils.previewOffice({ xpath: mapData.xpath })"
            >{{ mapData.attachmentName }}</el-button
          >
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import DcStatus from "@/status";
// 需要父子通信的数据
const OrderKeys = [
  "orderNo", // 订单号
  "inboundNo", // 进仓编号
  "pod", // 目的港
  "expectedInboundTime", // 预计进仓时间
  "latestInboundDate", // 最晚进仓时间
  "customsAddress", // 寄单地址
  "warehouseId", // 仓库ID
  "warehouseName", // 仓库名称
  "warehouseAddress", // 仓库地址
  "warehouseTel", // 仓库电话
  "warehouseRemark", // 仓库备注
  "orderAttachmentList", // 附件列表
  "mapModulePath", // 进仓地图路径
  "warehouseType", // 进仓地图类型
];
export default {
  name: "InboundGuide",
  created() {
    this.init();
  },
  props: {
    order: {
      type: Object,
      default: () => ({}),
    },
    warehouses: {
      type: Array,
      default: () => [],
    },
    orderDisableds: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const { customsAddressList } = DcStatus.commonStatus;
    return {
      form: {},
      mapData: {}, // 进仓地图数据
      customsAddressList, // 寄单地址列表
      deliveryDataList:[
        {value:0,label:'物流新版保函 普货 (盖公章正本两份)',url:'/image/template/wuliu.doc'},
        {value:1,label:'安检清单 (仅盖公章正本两份)',url:'/image/template/anjian.doc'},
        {value:2,label:'货站保函 (盖公章正本两份)',url:'/image/template/huozhan.doc '},
        {value:3,label:'化工品交货资料',url:'/image/template/huagong.rar'},
      ],
      deliveryDataType:[]
    };
  },
  computed: {
    // 获取进仓编号
    computedInboundNo() {
      const { orderNo, pod } = this.form;
      return `LXC${orderNo.slice(-6)}${pod}`;
    },
    computedRules() {
      return {};
    },
    expectedInboundTimePickerOptions() {
      return {
        disabledDate: (time) => {
          const yesterday = new Date().getTime() - 24 * 60 * 60 * 1000;
          return time.getTime() < yesterday;
        },
      };
    },
  },
  methods: {
    downLoadDelivery(){
      if(this.deliveryDataType.length == 0){
        return this.$message.warning("请选择交货资料")
      }
      this.deliveryDataList.forEach(item=>{
        if(this.deliveryDataType.includes(item.value)){
            this.$utils.downloadFile({
              url: item.url,
              name: `${item.label}${item.value == 3?'.rar':''}`,
            });
        }
      })
      this.deliveryDataType = []
    },
    init() {
      const form = this.$utils.copyDataByKeys(this.order, OrderKeys);
      const { orderAttachmentList } = form;
      this.mapData =
        orderAttachmentList.find((item) => {
          return item.attachmentType === 5;
        }) || {};
      this.form = {
        ...form,
      };
    },
    warehouseChange(val) {
      const warehouse = this.warehouses.find((item) => item.value === val);
      if (!warehouse) {
        return;
      }
      const {
        id: warehouseId,
        name: warehouseName,
        address: warehouseAddress,
        remark: warehouseRemark,
        tel: warehouseTel,
        type: warehouseType,
        mapModulePath,
      } = warehouse;
      this.form = {
        ...this.form,
        warehouseId,
        warehouseName,
        warehouseAddress,
        warehouseTel,
        warehouseRemark,
        mapModulePath,
        warehouseType,
      };
    },
    formValidate(isValidate = true) {
      const formData = this.getFormData();
      if (!isValidate) {
        return Promise.resolve(formData);
      }
      return new Promise((resolve, reject) => {
        this.$refs.form.form.validate((valid, errorKeys) => {
          if (valid) {
            resolve(formData);
          } else {
            Object.entries(errorKeys).find(([key, val]) => {
              if (val[0]) {
                this.$message.error(val[0].message);
                return true;
              }
            });
            reject();
            return false;
          }
        });
      });
    },
    getFormData() {
      const order = this.$utils.copyDataByKeys(this.order, OrderKeys);
      const form = Object.entries(order).reduce((obj, [key, val]) => {
        if (
          val !== this.form[key] &&
          val !== Number(this.form[key]) &&
          this.form[key] !== "null" &&
          this.form[key] !== null
        ) {
          obj = {
            ...obj,
            [key]: this.form[key],
          };
        }
        return obj;
      }, {});
      return form;
    },
  },
};
</script>

<style lang="less" scoped>
.inbound-guide {
  .guide-content {
    padding-bottom: 60px;
    position: relative;
    display: flex;
    .aside {
      margin-top: auto;
      margin-left: 20px;
      .map-download {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
    }
  }
  .customs-address-dropdown {
    position: absolute;
    right: -10px;
    top: 0;
    transform: translate(100%, 0);
  }
}
</style>