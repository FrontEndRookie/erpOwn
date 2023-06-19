<template>
  <div class="chartDom" style="text-align:left;position:relative">
    <div class="chartTitle">{{chartTitle}}</div>
    <div :id="cid" class="echart" style="width:360px;height: 300px"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";

export default {
  data(){
    return {
      activeIndex: 0,
      myChart:null
    }
  },
  props: {
    chartTitle:{
          type:String,
          default:"标题信息"
    },
    animation:{
      type:Boolean,
      default:true
    },
    cid: {
      type: String,
      default: "chart",
    },
    tooltip:{
      type:Object,
      default:()=>{
        return {
          show:true,
          trigger:'item',
          position: 'right',
          backgroundColor: 'rgb(255,255,255,0.8)',
          textStyle :{
            color:"black"
          }
        }
      }
    },
    data: {
      type: Array,
      default: () => {
        return [
          { value: 100, name: "已处理", color: "#eecb5f" },
          { value: 100, name: "待处理", color: "#61a5e8" },
          { value: 100, name: "超时", color: "#7ecf51" },
        ];
      },
    },
    centerTitle:{
        type:Array,
        default:`{name| 今日}\n{name| 11-15}\n {value|XXX}`
    },
    series: {
      type: Object,
      default: () => {
        return {
          label: {
            color: "white",
            position: "inner",
            formatter: function (params) {
              return params.name;
            },
          },
          title: {
            value: {
              color: "gray",
              fontSize: 25,
              align:"center",
            },
              name: { 
                color: "gray",
                fontSize: 25 ,
                align:"center",
                padding:[10,0,0,0]
               },
            },
        };
      },
    },
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      this.myChart = echarts.init(document.getElementById(this.cid));
      const option = {
        title: [
          {
            text: this.centerTitle,
            top: "center",
            left: "center",
            textStyle: {
              rich: {
                name: this.series.title.name,
                value:this.series.title.value
              },
            },
          },
        ],
        tooltip: this.tooltip,
        series: [
          {
            type: "pie",
            minAngle:30,
            radius: ["47%", "78%"],
            center: ["50%", "50%"],
            hoverAnimation: true,
            animation:true,
            z: 10,
            itemStyle: {
              normal: {
                label: {
                  formatter: this.series.label.formatter,
                },
                borderWidth: 1,
                borderColor: "#fff",
              },
            },
            label: {
              normal: {
                color: this.series.label.color,
                position: this.series.label.position,
              },
            },
            data: this.data,
            color: this.data.map((item) => item.color),
            labelLine: {
              show: false,
            },
          },
        ],
      };
      this.myChart.setOption(option); //重新绘制
      this.animation && !this.interval ? this.highlightInterval() : "";
    },
    // 定时高亮数据
    highlightInterval() {
      // 设置定时器
      this.interval = setInterval(() => {
        this.myChart.dispatchAction({
          type: "downplay",
          seriesIndex: 0
        });
        this.data.length == this.activeIndex + 1
          ? (this.activeIndex = 0)
          : this.activeIndex++;
        // 定时加载高亮区
        this.myChart.dispatchAction({
          type: "highlight",
          dataIndex: this.activeIndex
        });
        this.myChart.dispatchAction({
          type: "showTip",
          seriesIndex: 0,
          dataIndex: this.activeIndex
        });
      }, 4000);
    },
  },
 watch: {
    data:{
        handler(){
            this.drawChart();
        }
    },
    centerTitle:{
        handler(){
            this.drawChart();
        }
    }
  },
   beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>
<style lang="less" scoped>
.chartDom {
  text-align:left;
  position:relative;
}
.chartTitle {
  position: absolute;
  top:20px;
  left:25px;
  font-weight: 900;
  z-index: 10;
  font-size:20px;
}
  .echart {
    background-image: url("../../src/assets/background.png");
    background-size: contain;
  }


</style>
