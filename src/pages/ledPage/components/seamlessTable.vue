<template>
      <!-- 无限滚动表格 -->
  <div class="comm-table-back">
    <div style="fontSize:14px;fontWeight:bolder;color:#fff;height:10%;margin-top:10px"><img src="../../../assets/LED/titleSign.png" alt="" style="width:25px;height:25px"><span style="display:inline-block;transform:translateY(-30%)">业绩排行榜</span> </div>
    <div class="tb-table">
      <div class="tb-thead">
        <div class="tb-tr">
          <div
            class="tb-th"
            v-for="(item, index) in columns"
            :key="index"
            :style="{ flex: item.width ? item.width : '' }"
          >
         
            {{ item.label }}
          </div>
        </div>
      </div>
      <div class="tb-tbody" ref="tb-tbody" v-if="tableData && tableData.length > 0">
        <vue-seamless-scroll
              :data="tableData"
              :class-option="classOption"
              :style="{
                overflow: 'hidden',
                height:tableScrollHeight
              }"
            >
        <template v-for="(item2, index2) of tableData">
          <div class="tb-father" :key="index2">
            <div
              class="tb-td"
              v-for="(item, index) in columns"
              :key="index"
              :ref="'tr' + index2"
              :style="{ flex: item.width ? item.width : '' }"
            > 
              <div class="tb-span" v-if="item.key == 'rank'">
                <img src="../../../assets/LED/tableIndex3.svg" alt="" v-if="index2 == 0" style="width:17px;height:17px">
                <img src="../../../assets/LED/tableIndex2.svg" alt="" v-else-if="index2 == 1" style="width:17px;height:17px">
                <img src="../../../assets/LED/tableIndex1.svg" alt="" v-else-if="index2 == 2" style="width:17px;height15px">
                <span v-else>{{index2+1}}{{item.unit?item.unit:""}}</span>
              </div>
              <div  class="tb-span" v-else>
                {{ item2[item.key] }}{{item.unit?item.unit:''}}
              </div>
            </div>
          </div>
        </template>
        </vue-seamless-scroll>
      </div>
      <div v-else class="no-data">暂无数据</div>
    </div>
  </div>
</template>
<script>
import vueSeamlessScroll from 'vue-seamless-scroll'
export default {
    props:{
       // 滚动布局
      scroll: {
        type: Boolean,
        default: true
      },
      // 滚动布局显示的条数
        scrollNum: {
          type: Number,
          default: 5
        },
        tableData:{
            type:Array,
            default:()=>{
                return [
                  {preSaleService:"XXXX",ordersNum:40,stock:12000},
                  {preSaleService:"XXXX",ordersNum:42,stock:11000},
                  {preSaleService:"XXXX",ordersNum:44,stock:13000},
                  {preSaleService:"XXXX",ordersNum:47,stock:11000},
                  {preSaleService:"XXXX",ordersNum:49,stock:14000},
                  {preSaleService:"XXXX",ordersNum:40,stock:12000},
                  {preSaleService:"XXXX",ordersNum:42,stock:11000},
                  {preSaleService:"XXXX",ordersNum:44,stock:13000},
                  {preSaleService:"XXXX",ordersNum:47,stock:11000},
                  {preSaleService:"XXXX",ordersNum:49,stock:14000},
                   {preSaleService:"XXXX",ordersNum:40,stock:12000},
                  {preSaleService:"XXXX",ordersNum:42,stock:11000},
                  {preSaleService:"XXXX",ordersNum:44,stock:13000},
                  {preSaleService:"XXXX",ordersNum:47,stock:11000},
                  {preSaleService:"XXXX",ordersNum:49,stock:14000},
                  {preSaleService:"XXXX",ordersNum:40,stock:12000},
                  {preSaleService:"XXXX",ordersNum:42,stock:11000},
                  {preSaleService:"XXXX",ordersNum:44,stock:13000},
                  {preSaleService:"XXXX",ordersNum:47,stock:11000},
                  {preSaleService:"XXXX",ordersNum:49,stock:14000},
                   {preSaleService:"XXXX",ordersNum:40,stock:12000},
                  {preSaleService:"XXXX",ordersNum:42,stock:11000},
                  {preSaleService:"XXXX",ordersNum:44,stock:13000},
                  {preSaleService:"XXXX",ordersNum:47,stock:11000},
                  {preSaleService:"XXXX",ordersNum:49,stock:14000},
                  {preSaleService:"XXXX",ordersNum:40,stock:12000},
                  {preSaleService:"XXXX",ordersNum:42,stock:11000},
                  {preSaleService:"XXXX",ordersNum:44,stock:13000},
                  {preSaleService:"XXXX",ordersNum:47,stock:11000},
                  {preSaleService:"XXXX",ordersNum:49,stock:14000},
                ]
            }
        },
        columns:{
            type:Array,
            default:()=>{
                return [ 
          { label: "排名", width:2, key: "rank" },
          { label: "售前客服", width: 3, key: "preSaleService" },
          { label: "订单数", width: 3, key: "ordersNum" },
          { label: "存货(KG)", width: 3, key: "stock",unit:"KG"},]
            }
        }
    },
    components:{
        vueSeamlessScroll
    },
    mounted(){
      //设置滚动区域高度
      this.setMaxHeight()
    },
    data(){
        return {
          tableScrollHeight:"auto",
          //无限滚动插件配置
          classOption: {
            step: 0.3, // 数值越大速度滚动越快
            isSingleRemUnit: true,
            limitMoveNum: 6, // 开始无缝滚动的数据量 this.dataList.length
            hoverStop: true, // 是否开启鼠标悬停stop
            direction: 1, // 0向下 1向上 2向左 3向右
            openWatch: true, // 开启数据实时监控刷新dom
            singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
            singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
            waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
          }
        }
    },
    methods:{
      // 设置最大高度
    setMaxHeight() {
      this.$nextTick(() => {
        if (this.scroll && this.tableData && this.tableData.length > this.scrollNum) {
          let heigth = 0;
          //设置滚动区域高度为tbody高度
            heigth += this.$refs["tb-tbody"].clientHeight;
          this.tableScrollHeight = heigth + "px";
        } else {
          this.tableScrollHeight = "auto";
        }
      });
    },
    }
}
</script>
<style lang="less" scoped>
 .comm-table-back {
    // width: 525px;
    width:94%;
    height:95%;
    margin-top:5px;
    overflow:hidden;
  .tb-table {
    // max-height:450px;
    height:90%;
    margin-top:6px;
    // overflow: scroll;
    // margin: 0 auto;
    .tb-thead {
      height: 15%;
      // border-collapse: collapse;
      .tb-tr {
        display: flex;
        height: 100%;
        .tb-th {
          // flex: 1;
          text-align: center;
          background-color: #1e408a;
          padding: 0.375rem 0;
          font-size: 14px;
          font-weight: bold;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    .tb-tbody {
      height: 78%;
      .tb-father {
        display: flex;
          .tb-td {
              background-color: #081535;
          }
        .tb-td,
        .tb-th {
          flex: 1;
          padding: 0.15rem 0;
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

          .tb-span {
            color:#fff;
            padding:3px 0;
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
</style>