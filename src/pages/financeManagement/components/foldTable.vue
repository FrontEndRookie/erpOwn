<template>
  <div class="comm-table-back">
    <div class="tb-table">
      <div class="tb-thead">
        <div class="tb-tr">
        
          <div
            class="tb-th"
            v-for="(item, index) in columns"
            :key="index"
            :style="{ flex: item.width ? `0 0 ${item.width + 'px'}` : '' }"
            v-show="checkedTable.indexOf(item.label) !== -1 ||item.checkBox"
          >
          <div v-if="item.checkBox">
               <el-checkbox
                  v-model="checkAll"
                  :disabled="pageSkipAll"
                  @change="check=>changeCheckAll(check)"
                ></el-checkbox>
          </div>
          <div v-else>
            {{ item.label }}
          </div>
          </div>
        </div>
      </div>
      <div class="tb-tbody" v-if="tableData && tableData.length > 0">
        <template v-for="(item2, index2) of tableData">
          <div class="tb-father" :key="index2" >
            <div
              class="tb-td"
              v-for="(item, index) in columns"
              :key="index"
              style="word-break:break-all"
              :style="{ 'flex': (item.width ? `0 0 ${item.width + 'px'}` : ''),'backgroundColor':(item2.abnormalFlag==1?'rgb(205, 92, 92)':'') }"
              v-show="checkedTable.indexOf(item.label) !== -1 ||item.checkBox"
            >
              <div v-if="item.checkBox == true">
                <el-checkbox
                  v-model="checked[index2]"
                  :disabled="pageSkipAll"
                  @change="check=>changeCheckBox(check,item2,index2)"
                ></el-checkbox>
              </div>
               <div v-else-if="item.key =='firstFinancialSeriesNo'">
                <div v-if="item2.orderInfos &&item2.orderInfos.length >0 ">
                     <el-popover
                        placement="bottom-start"
                        width="100"
                        trigger="hover"
                        popper-class="invoicePopper"
                        >
                        <div v-for="(item11,index11) in item2.orderInfos" :key ="index11">{{item11.financialSeriesNo}}</div>
                        <div slot="reference" @click="$emit('showOrderWayBill',item2)" style="color:skyblue;cursor:pointer">{{item2.firstFinancialSeriesNo}}</div>
                     </el-popover>
                  </div>
                    <div v-else>
                        <div @click="$emit('showOrderWayBill',item2)" style="color:skyblue;cursor:pointer">{{item2.firstFinancialSeriesNo}}</div>
                    </div>
              </div>
              <div v-else-if="item.key =='orderNo'">
                <div v-if="item2.orderInfos &&item2.orderInfos.length >0 ">
                     <el-popover
                        placement="bottom-start"
                        width="100"
                        trigger="hover"
                        popper-class="invoicePopper"
                        >
                        <div v-for="(item11,index11) in item2.orderInfos" :key ="index11">{{item11.orderNo}}</div>
                        <div slot="reference" @click="$emit('showOrderWayBill',item2)" style="color:skyblue;cursor:pointer">{{item2.orderNo}}</div>
                     </el-popover>
                  </div>
                    <div v-else>
                        <div @click="$emit('showOrderWayBill',item2)" style="color:skyblue;cursor:pointer">{{item2.orderNo}}</div>
                    </div>
              </div>
              <div v-else-if="item.key =='waybillNo'">
                <div v-if="item2.orderInfos &&item2.orderInfos.length >0 ">
                     <el-popover
                        placement="bottom-start"
                        width="100"
                        trigger="hover"
                        popper-class="invoicePopper"
                        >
                        <div v-for="(item11,index11) in item2.orderInfos" :key ="index11">{{item11.waybillNo}}</div>
                        <div slot="reference" @click="$emit('showOrderWayBill',item2)" style="color:skyblue;cursor:pointer">{{item2.waybillNo}}</div>
                     </el-popover>
                  </div>
                    <div v-else>
                        <div@click="$emit('showOrderWayBill',item2)" style="color:skyblue;cursor:pointer">{{item2.waybillNo}}</div>
                    </div>
              </div>
              <div v-else-if="item.key =='departureDate'">
                 <div v-if="item2.orderInfos &&item2.orderInfos.length >0">
                    <el-popover
                        placement="bottom-start"
                        width="60"
                        trigger="hover"
                        popper-class="invoicePopper"
                        >
                        <div v-for="(item11,index11) in item2.orderInfos" :key ="index11">{{item11.departureDate}}</div>
                        <div slot="reference">{{item2.departureDate}}</div>
                     </el-popover>
                  </div>
                  <div  v-else>
                      <div>{{item2.departureDate}}</div>
                  </div>
              </div>
              <div v-else-if="item.key =='presentationTime'">
                 <div v-if="item2.orderInfos &&item2.orderInfos.length >0">
                     <el-popover
                        placement="bottom-start"
                        width="60"
                        trigger="hover"
                        popper-class="invoicePopper"
                        >
                        <div v-for="(item11,index11) in item2.orderInfos" :key ="index11">{{item11.presentationTime}}</div>
                        <div slot="reference">{{item2.presentationTime}}</div>
                     </el-popover>
                  </div>
                  <div  v-else>
                      <div>{{item2.presentationTime}}</div>
                  </div>
              </div>
              <div v-else-if="item.key=='showInvoice'">
                <div @click="$emit('showInvoice',item2)" style="color:skyblue;cursor:pointer">查看</div>
              </div>
              <div v-else-if="item.key=='invoiceType'">
                <div>{{item2.invoiceType==0?"增值税普通发票":item2.invoiceType==1?"增值税专用发票":item2.invoiceType==2?"增值税电子普通发票":""}}</div>
              </div>
              <div v-else-if="item.key=='invoicingStatus'">
                <div>{{item2.invoicingStatus==0?"未开":item2.invoicingStatus==1?"部分开":item2.invoicingStatus==2?"已开":""}}</div>
              </div>
              <div v-else-if="item.key=='invoiceNum'">
                <el-popover
                              placement="bottom-start"
                              width="40"
                              trigger="hover"
                              popper-class="invoicePopper"
                              v-if="item2.invoiceInfos"
                              >
                              <div v-for="(item11,index11) in item2.invoiceInfos" :key ="index11">{{item11.invoiceNum}}</div>
                              <div slot="reference" @click="foldRow(item2, index2)" :style="{'color':item2.hasChild?'skyblue':'black'}" > 
                                {{item2.invoiceNum}}
                                <template v-if="item2.hasChild">
    <img
                  src="../../../assets/shangjiantou.png"
                  class="foldImg"
                  v-if="item2.ifFold"
                />
                <img
                  src="../../../assets/xiajiantou.png"
                  class="foldImg"
                  v-else
                />
  </template>
  
               
                              </div>
                              
                          </el-popover>
                          <div v-else>{{item2.invoiceNum}}</div>
              </div>
              <div v-else-if="item.key=='invoicingTime'">
                <div>
                         <el-popover
                              placement="bottom-start"
                              width="40"
                              popper-class="invoicePopper"
                              trigger="hover"
                               v-if="item2.invoiceInfos"
                              >
                              <div v-for="(item11,index11) in item2.invoiceInfos" :key ="index11">{{item11.invoicingTime}}</div>
                              <div slot="reference">{{item2.invoicingTime}}</div>
                          </el-popover>
                          <div v-else>{{item2.invoicingTime}}</div>
                       </div>
              </div>
              <div v-else-if="item.key=='expressInfo'">
                <div v-html="dealExpress(item2.expressInfo)" style="white-space:pre-line;text-align:left!important;width:100%"></div>
              </div>
              <div v-else-if="item.key=='expressStatus'">
                <div v-if="item2.invoiceType != 2" @click="$emit('openPost',item2)" :style="{'color':item2.expressStatus=='未寄出'? 'skyblue':'black','cursor':item2.expressStatus=='未寄出'? 'pointer':''}">
                    {{item2.expressStatus}}
                  </div>
                 </div>
              <div v-else-if="item.key=='applyAmount'" :style="styleObject(item, item2)" class="tb-span" >
                {{currencyLabel[item2.applyCurrency]}}{{item2.applyCurrency ==1?item2.applyAmount : item2.applyAmountOrgn }}
              </div>
              <div v-else-if="item.key=='applicant'">{{ item2.applicant }}</div>
              <div v-else :style="styleObject(item, item2)" class="tb-span" >
                {{item.unit?item.unit+" ":''}}{{ item2[item.key] }}
              </div>
            </div>
          </div>
          <div v-if="item2.ifFold && item2.hasChild" class="tb-son">
          <template v-for="(item3, key) in item2.invoiceInfos" id="fold">
            <div class="tb-tr" v-show="item2.ifFold && item2.hasChild" :key="key + '' + index2">
              <div
                class="tb-td"
              style="word-break:break-all"
                v-for="(item, index4) of columns"
                :key="index4"
                v-show="checkedTable.indexOf(item.label) !== -1 ||item.checkBox"
                :style="{ flex: item.width ? `0 0 ${item.width + 'px'}` : ''}"
              >
                <div v-if="item.checkBox == true" style="opacity:0">
                  <el-checkbox
                    @change=""
                  ></el-checkbox>
                </div>
                  <div v-else-if="item.key == 'invoicingStatus'">
                  <el-checkbox
                    @change="check=>changeCheckBox(check,item3)"
                  ></el-checkbox>
                </div>
                <div v-else-if="item.key=='expressInfo'">
                <div v-html="dealExpress(item3.expressInfo)" style="white-space:pre-line;text-align:left!important;width:100%"></div>
              </div>
                <div v-else-if="item.key=='invoiceType'"></div>
                <div v-else-if="item.key=='invoicedAmount'"  class="tb-span">{{item3.invoiceAmount}}</div>
                <div v-else :style="styleObject(item, item3)" class="tb-span">
                  {{ item3[item.key] }}
                </div>
                 
              </div>
            </div>
          </template>
          </div>
         
        </template>
      </div>
      <div v-else class="no-data">暂无数据</div>
    </div>
  </div>
</template>
<script>
// import Tools from '@/utils/tools'
// import anime from '../../utils/anime.es'
export default {
  props: {
    
    //显示表格列
    checkedTable:{
      type:Array,
      default:()=>{
        return ['序号','订单号', '运单号', '订舱公司','航班日期','交单时间','发票抬头','开票备注','开票信息','申请开票金额','发票种类','申请时间','开票进度','已开票金额','发票号码','开票日期','快递信息','邮寄状态','发票状态','是否上传', '申请人']
      }
    },
    //列配置
    columns: {
      type: Array,
      default: () => {
        return [
            { checkBox: true, width: 50 },
          { label: "财务系列号", width: 140, key: "firstFinancialSeriesNo" },
          { label: "订单号", width: 140, key: "orderNo" },
          { label: "运单号", width: 110, key: "waybillNo" },
          { label: "结算对象", width: 220, key: "customerName" },
          { label: "发票抬头", width: 220, key: "invoiceTitle" },
          { label: "开票信息", width: 60, key: "showInvoice" },
          { label: "发票种类", width: 140, key: "invoiceType" },
          {
            label: "申请开票金额",
            width: 120,
            key: "applyAmount",
            unit: "¥",
          },
          { label: "已开票金额", width: 100, key: "invoicedAmount",unit:"¥"},
          { label: "备注", width: 80, key: "remark" },
          { label: "开票进度", width: 80, key: "invoicingStatus" },
          { label: "发票号码", width: 160, key: "invoiceNum" },
          { label: "发票状态", width: 100, key: "invoiceStatus" },
          { label: "是否上传", width: 100, key: "upload" },
          { label: "开票日期", width: 160, key: "invoicingTime" },
          { label: "航班日期", width: 110, key: "departureDate" },
          { label: "交单时间", width: 110, key: "presentationTime" },
          { label: "申请时间", width: 120, key: "applyTime" },
         
          // { label: "应收费用总金额", width: 100, key: "totalArCny" },
        
          { label: "快递信息", width: 160, key: "expressInfo" },
          { label: "邮寄状态", width: 100, key: "expressStatus" },
          { label: "申请人", width: 100, key: "applicant" },
        ];
      },
    },
    styleObject: {
      type: Function,
      default: function () {},
    },
    //表格数据
    tableData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    //跨页全选
    pageSkipAll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currencyLabel:{},
      //选中表格数据
      selectResult: [],
      //表格行选中
      checked: [],
      //表头全选
      checkAll: false,
    };
  },
  mounted() {
    var array = this.$store.getters.getCurrencyIdObjArr
    this.currencyLabel = array[1] // {1："¥", "HK$", "$", "€", "￡"}
  },
  watch: {
    tableData() {
      // console.log();
      this.selectResult = [];
      for (let i = 0; i < this.tableData.length; i++) {
        this.$set(this.checked, i, false);
        if (this.pageSkipAll == true) {
          this.$set(this.checked, i, true);
          this.checkAll = true;
        } else {
          this.$set(this.checked, i, false);
          this.checkAll = false;
        }
      }
        
    },
    pageSkipAll() {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.pageSkipAll == true) {
          this.$set(this.checked, i, true);
          this.checkAll = true;
        } else {
          this.$set(this.checked, i, false);
          this.checkAll = false;
        }
      }
    },
  },
  computed: {},
  methods: {
    //控制快递信息列显示内容
    dealExpress(express) {
      if (!express) {
        express = "";
        return "";
      }
      let data = express.split(",");
      return `<div>公司:${data[0] ? data[0] : ""}\n单号:${
        data[1] ? data[1] : ""
      }\n日期:${data[2] ? data[2] : ""}</div>`;
    },
    //表格头全选事件
    changeCheckAll(e) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (e == true) {
          this.$set(this.checked, i, true);
        } else {
          this.$set(this.checked, i, false);
        }
      }
      if (e == true) {
        this.$emit("changeCheckBox", this.tableData);
      } else {
        this.$emit("changeCheckBox", []);
        this.selectResult = []
      }
    },
    //表格选择列选中事件
    changeCheckBox(e, i, index) {
      // console.log(i);
      if (index != undefined) {
        this.checked[index] = e;
      }
      if (e == true) {
        this.selectResult.push(i);
      } else {
        let index = this.selectResult.findIndex((item) => (item.id == i.id));
        this.selectResult.splice(index, 1);
      }
      // console.log(this.checked);
      this.$emit("changeCheckBox", this.selectResult);
    },
    //展开箭头点击事件
    foldRow(item2, index2) {
      // console.log(item2.ifFold,"FOLD1")
      // debugger
      // console.log(item2.ifFold);
      item2.ifFold = !item2.ifFold;
    },
  },
};
</script>
<style lang="less"  scoped>
/deep/.el-table {
  th {
    // background-color: #fff;
    border-right: 1px solid silver;
    border-bottom: 1px solid silver;
    &:first-child {
      border-left: 1px solid silver;
    }
  }
  td {
    // background-color: #fff;
    border-right: 1px solid silver;
    border-bottom: 1px solid silver;
    &:first-child {
      border-left: 1px solid silver;
    }
  }
}
.comm-table-back {
  .tb-table {
    max-height:560px;
    overflow: scroll;
    margin: 0 auto;
    .tb-thead {
      border-collapse: collapse;
      position:sticky;
      top: 0;
      z-index: 100;
      
      .tb-tr {
        display: flex;
         
        .tb-th {
          flex: 1;
          background-color: #5b95ff;
          padding: 0.375rem 0;
          font-size: 8px;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          border-right: 1px solid silver;
          border-bottom: 1px solid silver;
          &:first-child {
            background-color: #5b95ff;
            position: sticky;
            left: 0;
            z-index: 10;
            border-left: 1px solid silver;

          }
        }
      }
    }
    .tb-tbody {
      .tb-father {
        display: flex;
        &:nth-child(odd) {
          // background-color: #ffffff;
          .tb-td {
          background-color: #ffffff;
             border-right: 1px solid silver;
          border-bottom: 1px solid silver;
            &:first-child {
              background-color: #ffffff;
              position: sticky;
              left: 0;
              z-index: 10;
              border-left: 1px solid silver;

            }
          }
        }
        &:nth-child(even) {
          // background-color: #f2f6ff;

          .tb-td {
          background-color: #f2f6ff;
          border-right: 1px solid silver;
          border-bottom: 1px solid silver;
            &:first-child {
              background-color: #f2f6ff;
              position: sticky;
              left: 0;
              z-index: 10;
              border-left: 1px solid silver;
            }
          }
        }
        .tb-td,
        .tb-th {
          flex: 1;
          padding: 0.375rem 0;
          color: #343434;
          font-size: 10px;
          font-weight: 400;
          display: flex;
          justify-content: center;
          text-align: center !important;
          align-items: center;
          // position:relative;
          // &:first-child{
          //   .foldContent{
          //     position:absolute;
          //     left:10px;
          // }
          // }

          &:first-child {
            .tb-span {
              width: 3.5rem;
              overflow: auto;
              text-align: center;
              white-space: nowrap;
              // margin-right:5px;
              img {
                // position:absolute;
                // left:3.5rem;
                margin-left: 5px;
                width: 12px;
                height: 12px;
                // position:fixed;
                // padding:0 5px;
              }
            }
          }
          .foldImg {
            width: 10px;
            height: 10px;
            margin-right: 5px;
            transform: translateY(-1px);
          }
          &:first-child {
            font-weight: bolder !important;
          }
          .tb-span {
          }
        }
      }
      .tb-son {
         max-height:300px;
         overflow-y:scroll;
         min-width:2615px;
        .tb-tr {
          display: flex;
          &:nth-child(odd) {
            .tb-td {
              background-color: #ffffff;
              border-right: 1px solid silver;
          border-bottom: 1px solid silver;
              &:first-child {
                background-color: #ffffff;
                position: sticky;
                left: 0;
                z-index: 10;
              border-left: 1px solid silver;

              }
            }
          }
          &:nth-child(even) {
            .tb-td {
              background-color: #f2f6ff;
              border-right: 1px solid silver;
          border-bottom: 1px solid silver;
              &:first-child {
                background-color: #f2f6ff;
                position: sticky;
                left: 0;
                z-index: 10;
              border-left: 1px solid silver;

              }
            }
          }
          .tb-td,
          .tb-th {
            flex: 1;
            padding: 0.375rem 0;
            color: #343434;
            font-size: 10px;
            font-weight: 400;
            display: flex;
            justify-content: center;
            text-align: center !important;
            align-items: center;
            // position:relative;
            // &:first-child{
            //   .foldContent{
            //     position:absolute;
            //     left:10px;
            // }
            // }

            &:first-child {
              .tb-span {
                width: 3.5rem;
                overflow: auto;
                text-align: center;
                white-space: nowrap;
                // margin-right:5px;
                img {
                  // position:absolute;
                  // left:3.5rem;
                  margin-left: 5px;
                  width: 12px;
                  height: 12px;
                  // position:fixed;
                  // padding:0 5px;
                }
              }
            }
            .foldImg {
              width: 10px;
              height: 10px;
              margin-right: 5px;
              transform: translateY(-1px);
            }
            &:first-child {
              font-weight: bolder !important;
            }
            .tb-span {
            }
          }
        }
      }
    }
    .no-data {
      font-size: 10px;
      color: #b9b9b9;
      padding: 30px 0;
      text-align: center;
    }
  }
}
// /deep/ .tb-tbody .tb-father:hover .tb-td {
//   background-color: #CCC !important;
// }
</style>
