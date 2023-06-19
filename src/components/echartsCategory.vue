<template>
  <div class="chartDom" style="width:60%;position:relative">
      <div style="display:flex;justify-content:space-between;" v-if="titleType == 1">
          <div style="fontSize:16px;fontWeight:bolder;position:absolute;top:20px;z-index:10;left:40px">{{chartTitle[0]}}</div>
          <div style="fontSize:16px;fontWeight:bolder;position:absolute;top:20px;z-index:10;right:50px">{{chartTitle[1]}}</div>
      </div>
      <div :id="cid" class="echart" style="height: 400px"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";

export default {
  props: {
      titleType:{
          type:Number,
          default:1
      },
      chartTitle:{
          type:Array,
          default:()=>{
              return ['周排名-目的港轮播滚动','周查询量/次']
          }
      },
    cid: {
      type: String,
      default: "chart",
    },
    
    chartColor:{
        type:String,
        default:"skyblue"
    },
    series:{
        type:Object,
        default:()=>{
            return [{data:[19785,16064,14319,13100,12054]},{ data: [19785,19785,19785,19785,19785]}]
        }
    },
    yAxis:{
        type:Object,
        default:()=>{
            return [{data:["LAX","DXB","XXX","DDD","AAA"]},{data:[19785,16064,14319,13100,12054]}]
        }
    }
  },
  mounted() {
      this.$nextTick(()=>{
        document.getElementById(this.cid).style.height = 400 + "px";
        this.drawChart();
      })
  },
  methods: {
    drawChart() {
      const myChart = echarts.init(document.getElementById(this.cid));
      const option = {
        backgroundColor: "#fff",
        animationDuration: 0,
        animationDurationUpdate: 3000,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear',
        tooltip: {
          show: true,
          backgroundColor: "#000", //背景颜色（此时为默认色）
          textStyle: {
            fontSize: 16,
          },
        }
        ,
        color: [this.chartColor],
        xAxis: {
          type: "value",

          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: [
          //左侧数据
          {
            type: "category",
            animationDuration: 3000,
            animationDurationUpdate: 3000,
            inverse: true,
            max:4,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: "#000",
                fontSize: "20",
              },
            },
            data: this.yAxis[0].data,
          },
          //右侧数据
          {
            type: "category",
            inverse: true,
            animationDuration: 3000,
            animationDurationUpdate: 3000,
            max:4,
            axisTick: "none",
            axisLine: "none",
            show: true,
            axisLabel: {
              textStyle: {
                color: "#000",
                fontSize: "20",
              },
            },
            data: this.yAxis[1].data,
          },
        ],
        series: [
          //数据柱
          {
            realtimeSort: true,
            zlevel: 1,
            name: "",
            type: "bar",
            barWidth: "26px",
            animationDuration: 1500,
            barGap:'0%',
            data: this.series[0].data,
            align: "center",
            itemStyle: {
              normal: {
                barBorderRadius: 13,
              },
            },
          },
          //背景柱
          {
            name: "",
            type: "bar",
            barWidth: "26px",
            barGap: "-100%", //背景柱数据柱合并
            margin: "20",
            data: this.series[1].data,
            textStyle: {
              //图例文字的样式
              fontSize: 10,
              color: "#fff",
            },
            tooltip:{
              show:false
            },
            itemStyle: {
              normal: {
                borderColor: "rgba(200, 196, 196, 1)",
                barBorderRadius: 13,
                color: "#fff",
                borderWidth: 2,
                fontSize: 10,
              },
            },
          },
        ],
      };
      myChart.setOption(option); //重新绘制
    },
  },
  watch: {
    yAxis: {
     handler(){ 
         this.drawChart();
     },
     deep:true
    },
    
  },
};
</script>

