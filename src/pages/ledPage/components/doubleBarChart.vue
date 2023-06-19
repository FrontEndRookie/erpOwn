<template>
  <div style="width: 90%;height:94%;margin:auto 0;position:relative" >
    <div style="fontSize:14px;fontWeight:bolder;color:#fff;position:absolute;top:20px;left:20px"><img src="../../../assets/LED/titleSign.png" alt="" style="width:25px;height:25px"><span style="display:inline-block;transform:translateY(-30%)">航线下单TOP10</span> </div>
    <div id="doubleBar" style="width: 100%; margin: auto; height:100%"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";
export default {
  mounted() {
    this.$nextTick(() => {
      this.drawCharts();
    });
  },
  methods: {
    drawCharts() {
      const option = {
        // backgroundColor: "#091C3D",
        animationDuration: 0,
        animationDurationUpdate: 3000,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear',
        tooltip: {
          //提示框组件
          trigger: "axis",
          backgroundColor: "RGB(106,121,133,0.5)",
          // formatter: "{b}<br />{a0}: {c0}<br />{a1}: {c1}",
          axisPointer: {
            type: "shadow",
            label: {
              backgroundColor: "RGB(106,121,133,0.5)",
            },
          },
          textStyle: {
            color: "silver",
            fontStyle: "normal",
            fontFamily: "微软雅黑",
            fontSize: 10,
            fontWeight:200
          },
        },
        grid: {
          left: "10%",
          right: "10%",
          bottom: "10%",
          top: "10%",
          height:"80%",
          //	padding:'0 0 10 0',
          containLabel: true,
        },
        legend: {
          //图例组件，颜色和名字
          right: "30%",
          bottom: "0%",
          itemGap: 16,
          itemWidth: 18,
          itemHeight: 10,
          data: this.seriesData.map(item=>item.name),
          textStyle: {
            color: "#a8aab0",
            fontStyle: "normal",
            fontFamily: "微软雅黑",
            fontSize: 12,
          },
        },
         
        xAxis: [
          {
            type: "value",
            splitNumber: 5,
            axisLabel: {
              textStyle: {
                color: "#a8aab0",
                fontStyle: "normal",
                fontFamily: "微软雅黑",
                fontSize: 12,
              },
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ["#fff"],
                opacity: 0.06,
                type:"dashed"
              },
            },
          },
        ],
        yAxis: [
             {
            type: "category",
            //	boundaryGap: true,//坐标轴两边留白
            data: this.chartData.map(item=>item.name),
            axisTick:{
                show:true,
                alignWithLabel:true,
                lineStyle:{
                    color:"#fff",
                    opacity: 0.2,
                }
            },
            axisLabel: {
              //坐标轴刻度标签的相关设置。
              interval: 0,//设置为 1，表示『隔一个标签显示一个标签』
              margin:15,
              textStyle: {
                color: "silver",
                fontStyle: "normal",
                fontFamily: "微软雅黑",
                fontSize: 10,
              },
            //   rotate: 50,
            },
          
            axisLine: {
              //坐标轴轴线相关设置
              lineStyle: {
                color: "#fff",
                opacity: 0.2,
              },
            },
            splitLine: {
              //坐标轴在 grid 区域中的分隔线。
              show: false,
            },
            max:9,
            animationDuration: 300,
            animationDurationUpdate: 300,
          },
         
        ],
        series: this.seriesData.map((item,index)=>{
          return  {
            name: item.name,
            type: "bar",
            data: this.chartData.map(item=>item["value"+(index+1)]),
            barWidth: item.barWidth,
            barGap: '-100%', //柱间距离
            barCategoryGap:item.barCategoryGap,
            // label: {//图形上的文本标签
            //     normal: {
            //       show: true,
            //       position: 'top',
            //       textStyle: {
            //           color: '#a8aab0',
            //           fontStyle: 'normal',
            //           fontFamily: '微软雅黑',
            //           fontSize: 12,
            //       },
            //     },
            // },
            itemStyle: {
              normal: {
                show: true,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: item.itemColor,
                  },
                  {
                    offset: 1,
                    color: item.itemColor,
                  },
                ]),
                barBorderRadius: 0,
                borderWidth: 0,
              },
            },
          }
        })
         
      };
      let dom = document.getElementById("doubleBar");
      this.myChart = echarts.init(dom);
      this.myChart.setOption(option);
      this.highlightInterval()
    },
     highlightInterval() {
      // 设置定时器
      if(this.interval) {
          clearInterval(this.interval)
      }
        this.interval = setInterval(() => {
          this.myChart.dispatchAction({
            type: "hideTip"
          });
          0 == this.activeIndex + 1
            ? (this.activeIndex = 10)
            : this.activeIndex--;
          // 定时加载高亮区
          this.myChart.dispatchAction({
            type: "showTip",
            seriesIndex: 0,
            dataIndex: this.activeIndex
            // position:['30%','2%']
          });
        }, 2000);
    },
  },
  data(){
      return {
         myChart:null, //echarts
         interval:null,//tooltip定时器
         activeIndex:10,
      }
  },
  props:{
      chartData:Array,
      seriesData:{
        type:Array,
        default:()=>{
         return [{
            name:"货量",
            barWidth:15,
            barCategoryGap:'80%',
            itemColor:"rgb(21,126,227)"
          },{
            name:"购买数",
            barWidth:15,
            barCategoryGap:'80%',
            itemColor:"rgb(42,168,84)"
          }]
        }
      }
  },
   watch: {
    chartData() {
      this.drawCharts();
    }
  },
  beforeDestory(){
      clearInterval(this.interval)
  }
};
</script>