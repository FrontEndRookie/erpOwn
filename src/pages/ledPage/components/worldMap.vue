<template>
  <div style="width: 95%; height: 95%; position: relative">
    <div
      style="
        fontsize: 14px;
        fontweight: bolder;
        color: #fff;
        position: absolute;
        top: 30px;
        left: 30px;
      "
    >
      <img
        src="../../../assets/LED/titleSign.png"
        alt=""
        style="width: 20px; height: 20px"
      /><span style="display: inline-block; transform: translateY(-13%)">{{
        worldMapName
      }}</span>
    </div>
    <div id="worldMaps" style="width: 100%; margin: auto; height: 100%"></div>
  </div>
</template>
<script>
import "../../../util/world";
import * as echarts from "echarts";
import geoCoordMap from "../../../util/airports"
export default {
  props:{
    //重要机场点位
    importantPoint:{
      type:Array,
      default:()=>{
        return [
        { name: "马里恩县布朗菲尔德机场", value: [-85.5852966309, 35.0606994629] },
        { name: "阿雷基帕国际机场", value: [-71.5830993652, -16.3411006927] },
        { name: "奥格斯堡机场", value: [10.9316673279, 48.42527771]},
        { name: "艾图塔基机场", value: [-159.7640075684, -18.8309001923]},
        { name: "阿瓦巴机场", value: [142.748352051, -8.0061101914]},
        { name: "阿特巴萨尔机场", value: [-95.6167, 34.2333]},
        { name: "阿尔法机场", value: [146.5839996338, -23.6460990906]},
        { name: "纳舒厄机场", value:[-71.5148010254, 42.7817001343]},
      ]
      }
    },
    //到港数据
    DGDataCopy:{
      type:Array,
      default:()=>{
        return[
        [
          {
            name: "兴义万峰林机场",
            value: 9100,
          },
          {
            name: "阿姆斯特丹斯希普霍尔机场",
          },
        ],
        [
          {
            name: "楠普拉机场",
            value: 9200,
          },
          {
            name: "阿姆斯特丹斯希普霍尔机场",
          },
        ],
        [
          {
            name: "阿布-德亚机场",
            value: 9300,
          },
          {
            name: "阿姆斯特丹斯希普霍尔机场",
          },
        ],
        [
          {
            name: "哈里温机场",
            value: 9300,
          },
          {
            name: "阿姆斯特丹斯希普霍尔机场",
          },
        ],
        [
          {
            name: "安曼民航机场",
            value: 9300,
          },
          {
            name: "阿姆斯特丹斯希普霍尔机场",
          },
        ],
         [
          {
            name: "安道尔机场",
            value: 9300,
          },
          {
            name: "阿姆斯特丹斯希普霍尔机场",
          },
        ],
            [
          {
            name: "圣玛丽亚机场",
            value: 9300,
          },
          {
            name: "阿姆斯特丹斯希普霍尔机场",
          },
        ],
             [
          {
            name: "阿纳科机场",
            value: 9300,
          },
          {
            name: "阿姆斯特丹斯希普霍尔机场",
          },
        ],
               [
          {
            name: "艾德茵机场",
            value: 9300,
          },
          {
            name: "阿姆斯特丹斯希普霍尔机场",
          },
        ],
                [
          {
            name: "阿纳机场",
            value: 9300,
          },
          {
            name: "阿姆斯特丹斯希普霍尔机场",
          },
        ],
                    [
          {
            name: "阿尔塔机场",
            value: 9300,
          },
          {
            name: "阿姆斯特丹斯希普霍尔机场",
          },
        ],
      ]
      }
    },
    //热门数据
    RMDataCopy:{
      type:Array,
      default:()=>{
        return [
        [
          {
            name: "阿伦克尔机场",
            value: 9100,
          },
          {
            name: "奥克兰机场",
          },
        ],
        [
          {
            name: "侯赛因国王国际机场",
            value: 2370,
          },
          {
            name: "奥克兰机场",
          },
        ],
        [
          {
            name: "亚丁国际机场",
            value: 3130,
          },
          {
            name: "奥克兰机场",
          },
        ],
        [
          {
            name: "奥胡斯机场",
            value: 2350,
          },
          {
            name: "奥克兰机场",
          },
        ],
        [
          {
            name: "阿里普阿南机场",
            value: 5120,
          },
          {
            name: "奥克兰机场",
          },
        ],
      ]
      }
    },
    //在途数据
    ZTDataCopy:{
      type:Array,
      default:()=>{
        return [
        [
          {
            name: "艾卜哈支线机场",
            value: 9100,
          },
          {
            name: "布兀港机场",
          },
        ],
        [
          {
            name: "奥尔堡机场",
            value: 2370,
          },
          {
            name: "布兀港机场",
          },
        ],
        [
          {
            name: "兰萨罗特机场",
            value: 3130,
          },
          {
            name: "布兀港机场",
          },
        ],
        [
          {
            name: "科迪亚克机场",
            value: 2350,
          },
          {
            name: "布兀港机场",
          },
        ],
        [
          {
            name: "月河机场",
            value: 5120,
          },
          {
            name: "布兀港机场",
          },
        ],
        [
          {
            name: "阿尔利机场",
            value: 9100,
          },
          {
            name: "布兀港机场",
          },
        ],
         [
          {
            name: "安格斯唐斯机场",
            value: 9100,
          },
          {
            name: "布兀港机场",
          },
        ],
           [
          {
            name: "阿达卡机场",
            value: 9100,
          },
          {
            name: "布兀港机场",
          },
        ],
           [
          {
            name: "安巴托机场",
            value: 9100,
          },
          {
            name: "布兀港机场",
          },
        ],
           [
          {
            name: "旭川机场",
            value: 9100,
          },
          {
            name: "布兀港机场",
          },
        ],
             [
          {
            name: "奥斯汀机场",
            value: 9100,
          },
          {
            name: "布兀港机场",
          },
        ],
           [
          {
            name: "阿马鲁机场",
            value: 9100,
          },
          {
            name: "布兀港机场",
          },
        ],
      ]
      }
    },
    //起点数据
    startPoint:{
      type:Array,
      default:()=>{
        return ["奥克兰机场", "阿姆斯特丹斯希普霍尔机场", "布兀港机场"]
      }
    }
  },
  data() {
    return {
      myMap: "", //地图echarts
      mapTimer: "", //地图定时器
      worldMapName: "实时交易全部地图", //地图类型切换，对应标题
      mapType:2, //显示地图类型
      DGData:"",
      RMData:"",
      ZTData:""
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.DGData = this.DGDataCopy
      this.RMData = this.RMDataCopy
      this.ZTData = this.ZTDataCopy
      this.drawCharts();
    });
    this.mapTimer = setInterval(()=>{
      this.mapType == 1 ? this.mapType = 2 : this.mapType = 1
      if(this.mapType == 2) {
      this.DGData = this.DGDataCopy
      this.RMData = this.RMDataCopy
      this.ZTData = this.ZTDataCopy
      this.worldMapName = "实时交易全部地图"
      } else {
        let copyDG = JSON.parse(JSON.stringify(this.DGDataCopy))
        let copyZT = JSON.parse(JSON.stringify(this.ZTDataCopy))
        this.DGData = copyDG.splice(0,5)
        this.RMData = this.RMDataCopy
        this.ZTData = copyZT.splice(0,5)
        this.worldMapName = "实时交易热门地图"
      }
      this.drawCharts();
    },30000)
  },
  methods: {
    drawCharts() {
      
      var planePath =
        "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";
      var importantPoint = this.importantPoint;
      var DGData = this.DGData;
      var RMData = this.RMData;
      var ZTData = this.ZTData;
      //echarts线数据控制
      var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var dataItem = data[i];
          var toCoord = geoCoordMap[dataItem[0].name];
          var fromCoord = geoCoordMap[dataItem[1].name];
          if (fromCoord && toCoord) {
            res.push({
              fromName: dataItem[0].name,
              toName: dataItem[1].name,
              coords: [fromCoord, toCoord],
              value: dataItem[0].value,
            });
          }
        }
        return res;
      };
      var colorList = ["yellow", "#7FFF00", "rgb(0,222,229)"];
      var series = [];
      [
        [this.startPoint[0], RMData, "热门"],
        [this.startPoint[1], DGData, "到港"],
        [this.startPoint[2], ZTData, "在途"],
      ].forEach(function (item, index) {
        series.push(
          {
            name: item[2],
            type: "lines",
            zlevel: 1,
            effect: {
              show: true,
              // //飞机的速度  这里是s单位
              period: 10,
              trailLength: 0.7,
              //   symbol: planePath,
              // 飞机大小
              symbolSize: 5,
            },
            lineStyle: {
              normal: {
                color: colorList[index],
                // 线条宽度
                width: 0,
                curveness: 0.2,
              },
            },
            data: convertData(item[1]),
          },
          {
            name: item[2],
            type: "lines",
            zlevel: 2,
            effect: {
              show: true,
              // //飞机的速度  这里是s单位
              period: 10,
              trailLength: 0,
              symbol: planePath,
              // 飞机大小
              symbolSize: 16,
            },
            lineStyle: {
              normal: {
                color: colorList[index],
                // 线条宽度
                width: 1,
                opacity: 1,
                curveness: 0.2,
              },
            },
            label: {
              normal: {
                show: false,
                position: "middle",
                formatter: "{b}",
              },
            },
            data: convertData(item[1]),
          },
          {
            name: item[2],
            type: "effectScatter",
            coordinateSystem: "geo",
            zlevel: 2,
            rippleEffect: {
              //涟漪特效
              period: 4, //动画时间，值越小速度越快
              brushType: "stroke", //波纹绘制方式 stroke, fill
              scale: 4, //波纹圆环最大限制，值越大波纹越大
            },
            label: {
              normal: {
                show: false,
                position: "right", //显示位置
                offset: [5, 0], //偏移设置
                formatter: "{b}", //圆环显示文字
                textStyle: {
                  color: colorList[index],
                },
              },
              emphasis: {
                show: true,
              },
            },
            symbol: "circle",
            symbolSize: function (val) {
              return 4 + val[2] / 1000; //圆环大小
            },
            itemStyle: {
              normal: {
                show: true,
                color: colorList[index],
              },
            },
            data: item[1].map(function (dataItem) {
              return {
                name: dataItem[0].name,
                value: geoCoordMap[dataItem[0].name].concat([
                  dataItem[0].value,
                ]),
              };
            }),
          },
          //被攻击点
          {
            name: item[0] + " AirlINE",
            type: "scatter",
            coordinateSystem: "geo",
            zlevel: 2,
            rippleEffect: {
              period: 4,
              brushType: "stroke",
              scale: 4,
            },
            label: {
              normal: {
                show: false,
                position: "right",
                // color: "#00ffff",
                formatter: "{b}",
                textStyle: {
                  color: colorList[index],
                },
              },
              emphasis: {
                show: true,
              },
            },
            symbol: "pin",
            symbolSize: 20,
            itemStyle: {
              normal: {
                show: true,
                color: colorList[index],
              },
            },
            data: [
              {
                name: item[0],
                value: geoCoordMap[item[0]].concat([10]),
              },
            ],
          }
        );
      });
      series.push({
        name: " ImportantAirlINE",
        type: "scatter",
        coordinateSystem: "geo",
        zlevel: 10,
        rippleEffect: {
          brushType: "fill",
        },
        label: {
          normal: {
            show: true,
            position: "right",
            color: "#fff",
            textStyle: {
              color: "rgba(255,255,255,0.7)",
              fontSize:11,
            },
            formatter: "{b}",
          },
        },
        symbol:"circle",
        symbolSize:5,
        itemStyle: {
          normal: {
            color: "#fff",
          },
        },
        data: importantPoint,
      });
      const option = {
        // backgroundColor: "#1B2631",
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            if (params.seriesType == "effectScatter") {
              return (
                params.marker + params.data.name + "" + params.data.value[2]
              );
            } else if (params.seriesType == "lines") {
              return (
                params.data.fromName +
                " -> " +
                params.data.toName +
                "<br />" +
                params.data.value
              );
            } else {
              return params.name;
            }
          },
        },
        legend: {
          orient: "vertical",
          top: "bottom",
          left: "right",
          data: ["热门", "到港", "在途"],
          textStyle: {
            color: "#fff",
          },
          // selectedMode: 'single'
        },
        geo: {
          map: "world",
          label: {
            // show:true,
            emphasis: {
              show: false,
            },
          },
          roam: true, //是否允许缩放
          // layoutCenter: ["50%", "50%"], //地图位置
          // layoutSize: "100%",
          zoom: 1.2,
          tooltip: {
            show: false,
          },
          itemStyle: {
            normal: {
              color: "rgba(48,97,186,0.3)", //地图背景色
              borderColor: "rgba(0, 0, 0, 0)", //省市边界线
            },
            emphasis: {
              color: "rgba(48,97,186,0.3)", //悬浮背景
            },
          },
        },
        series: series,
      };
      let dom = document.getElementById("worldMaps");
      this.myMap = echarts.init(dom);
      this.myMap.setOption(option);
    },
  },

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if(this.mapTimer) {
      clearInterval(this.mapTimer)
    }
  },
};
</script>