<template>
  <resizeContainer style="height: 100vh; width: 100vw">
    <div
      style="background: #000; width: 100%; height: 100%"
      v-if="ifShowLed == 1"
    >
    <!-- led大屏页面顶部 -->
      <div class="LedTop">
        <div class="ledTimeShow">
          <img src="../../assets/LED/clock.svg" alt="" />{{
            new Date().format("yyyy年MM月dd日 hh:mm:ss")
          }}
        </div>
        <div class="ledTitle">17DC 运营数据实况</div>
        <div class="dcLogo">
          <img src="../../assets/LED/dcLogo.png" alt="" />
        </div>
      </div>
      <div>
        <!-- led大屏页面内容 -->
        <div class="ledPageBody">
          <!-- led大屏页面左 -->
          <div class="ledPBLeft">
            <div class="ledPBLTop">
              <div class="ledPBLTopTitle">今日下单货量累计 (KG)</div>
              <div class="bannerBox">
                <div style="position: relative">
                  <div id="banner">热烈庆贺17订舱今日成交货量突破100,000!</div>
                </div>
              </div>
              <!-- 滚动数字展示 -->
              <div class="newFont">
                <div
                  v-for="(item, index) in this.numArray"
                  :key="index"
                  class="real-time-num"
                  :style="{
                    background: index == 3 || index == 7 ? 'none' : '',
                    width: index == 3 || index == 7 ? '2%' : '',
                  }"
                >
                  <div
                    v-if="index == 3 || index == 7"
                    style="
                      height: 10vh;
                      display: flex;
                      align-items: flex-end;
                      justify-content: center;
                    "
                  >
                    <span>,</span>
                  </div>
                  <div
                    v-else
                    class="real-time-num-item"
                    :style="{ transform: `translateY(-${item * 10}vh)` }"
                  >
                    <div><p>0</p></div>
                    <div><p>1</p></div>
                    <div><p>2</p></div>
                    <div><p>3</p></div>
                    <div><p>4</p></div>
                    <div><p>5</p></div>
                    <div><p>6</p></div>
                    <div><p>7</p></div>
                    <div><p>8</p></div>
                    <div><p>9</p></div>
                  </div>
                </div>
              </div>
              <div class="PBLTopMessage">
                <div
                  v-for="(item, index) in PBLTopMessage"
                  :key="index"
                  class="topMessageBox"
                >
                  <div class="messageName">{{ item.name }}</div>
                  <div class="messageValue">
                    {{ item.value
                    }}<span>{{ item.unit ? item.unit : "" }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="ledContent">
              <div class="ledContentLeft">
                <div
                  class="contentBox"
                  v-for="(item, index) in leftContentMessage"
                  :key="index"
                  :style="{ marginTop: index > 0 ? '1vh' : '' }"
                >
                  <div class="boxImg">
                    <img
                      :src="item.imgUrl"
                      alt=""
                      style="width: 3vw; height: 2.5vw"
                    />
                  </div>
                  <div class="boxMessage">
                    <span class="messageTitle">{{ item.title }}</span>
                    <div class="hr"></div>
                    <span class="messageValue">{{ item.value }}</span>
                  </div>
                </div>
              </div>
              <div class="ledContentRight">
                <worldMap></worldMap>
              </div>
            </div>
          </div>
          <!-- led大屏页面右 -->
          <div class="ledPBRight">
            <div class="ledPBRTop">
              <doubleBarChart :chartData="chartData"></doubleBarChart>
            </div>
            <div class="ledPBRBottom">
              <seamless-table></seamless-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="ifShowLed == 2"></div>
  </resizeContainer>
</template>
<script>
import worldMap from "./components/worldMap.vue";
import doubleBarChart from "./components/doubleBarChart.vue";
import resizeContainer from "../../components/resizeContainer.vue"
import seamlessTable from "./components/seamlessTable.vue";
export default {
  components: {
    worldMap,
    doubleBarChart,
    seamlessTable,
    resizeContainer
  },
  created() {
    Date.prototype.format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds(), //毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }
      return fmt;
    };
  },
  data() {
    return {
      //LED页面切换图片定时器
      pageAllTimer: null,
      //航线下单TOP10柱状图数据
      chartData: [
        { name: "PVG-ERT-MU", value1: 20, value2: 15 },
        { name: "PVG-ERT-MU", value1: 21, value2: 14 },
        { name: "PVG-ERT-MU", value1: 19, value2: 13 },
        { name: "PVG-ERT-MU", value1: 17, value2: 12 },
        { name: "PVG-ERT-MU", value1: 22, value2: 15 },
        { name: "PVG-ERT-MU", value1: 21, value2: 13 },
        { name: "PVG-ERT-MU", value1: 18, value2: 14 },
        { name: "PVG-ERT-MU", value1: 17, value2: 9 },
        { name: "PVG-ERT-MU", value1: 14, value2: 11 },
        { name: "PVG-ERT-MU", value1: 17, value2: 13 },
      ],
      //今日下单货量累计数据
      PBLTopMessage: [
        { name: "上月销售额", value: 80000, unit: "元" },
        { name: "昨日订单数", value: 7000, unit: "票" },
        { name: "累计用户数", value: 13517, unit: "人" },
        { name: "累计货量", value: 13457, unit: "KG" },
      ],
      //led左下角标题、图标、数字
      leftContentMessage: [
        {
          imgUrl: require("../../assets/LED/leftContent1.png"),
          title: "今日访客数",
          value: 31511,
        },
        {
          imgUrl: require("../../assets/LED/leftContent2.png"),
          title: "今日浏览量",
          value: 31611,
        },
        {
          imgUrl: require("../../assets/LED/leftContent3.png"),
          title: "今日下单用户数",
          value: 31711,
        },
        {
          imgUrl: require("../../assets/LED/leftContent4.png"),
          title: "今日订单数",
          value: 31811,
        },
        {
          imgUrl: require("../../assets/LED/leftContent5.png"),
          title: "今日下单转化率",
          value: 31911,
        },
      ],
      //今日下单货量累计计数器
      numArray: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      //页面显示 （大屏 || 图片）
      ifShowLed: 1,
    };
  },

  mounted() {
    setInterval(() => {
      this.numArray[10] = this.numArray[10] + 1;

      if (this.numArray[10] == 10) {
        this.numArray[10] = 0;
        this.numArray[9] = this.numArray[9] + 1;
      }
      if (this.numArray[9] == 10) {
        this.numArray[9] = 0;
        this.numArray[8] = this.numArray[8] + 1;
      }
      if (this.numArray[8] == 10) {
        this.numArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
      this.$forceUpdate();
    }, 2000);
    // this.pageAllTimer = setTimeout(() => {
    //   this.ifShowLed == "2" ? (this.ifShowLed = "1") : (this.ifShowLed = "2");
    // }, 120000);
  },
  methods: {},
  watch: {
    //实现整体页面切换
    // ifShowLed() {
    //   clearInterval(this.pageAllTimer);
    //   if (this.ifShowLed == "2") {
    //     this.pageAllTimer = setTimeout(() => {
    //       this.ifShowLed == "2"
    //         ? (this.ifShowLed = "1")
    //         : (this.ifShowLed = "2");
    //     }, 10000);
    //   } else {
    //     this.pageAllTimer = setTimeout(() => {
    //       this.ifShowLed == "2"
    //         ? (this.ifShowLed = "1")
    //         : (this.ifShowLed = "2");
    //     }, 120000);
    //   }
    // },
  },
  beforeDestroy() {
    // clearInterval(this.pageAllTimer);
  },
};
</script>
<style lang="less">
// @font-face {
//   font-family: "Poppins-Regular"; /*重命名字体名 */
//   src: url-loader('../../assets/LCDWinTT/LCD-L___.TTF'); /*引入字体*/
//   font-weight: bolder;
//   font-style: normal;
// }
.LedTop {
  height: 8vh;
  background: url("../../assets/LED/LEDtop.png");
  background-size: 100% 8vh;
  position: relative;
  .ledTimeShow {
    float: left;
    color: #fff;
    font-size: 18px;
    font-weight: 400;
    position: absolute;
    transform: translate(0, -65%);
    top: 45%;
    left: 0;
    img {
      width: 3vh;
      width: 3vh;
      margin-left: 5px;
      margin-right: 5px;
      transform: translateY(5px);
    }
  }
  .ledTitle {
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 5px;
    -webkit-transform: translate(-50%, -65%);
    -moz-transform: translate(-50%, -65%);
    transform: translate(-50%, -65%);
    color: #fff;
    font-size: 30px;
    font-weight: 1000;
    margin-bottom: 20px;
  }
  .dcLogo {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(-10%, -60%);
    img {
      width: 14vh;
      height: 5vh;
    }
  }
}
.ledPageBody {
  width: 100%;
  height: 92vh;
  display: flex;
  .ledPBLeft {
    width: 75vw;
    height: 100%;
    overflow: hidden;
    .ledPBLTop {
      width: 75vw;
      height: 20vh;
      background: url("../../assets/LED/LEDtop2.png");
      background-size: 75vw 20vh;
      position: relative;
      .ledPBLTopTitle {
        position: absolute;
        top: 1.5vh;
        left: 3%;
        color: #fff;
        font-weight: 600;
      }
      .PBLTopMessage {
        position: absolute;
        width: 50%;
        top: 7vh;
        right: 2%;
        display: flex;
        justify-content: space-between;
        .topMessageBox {
          flex: 0 0 20%;
          padding: 2%;
          background: url("../../assets/LED/LEDtop2Border.png");
          background-size: 100% 100%;
          text-align: center;
          height: 8vh;
          .messageName {
            font-size: 14px;
            font-weight: 600;
            color: #fff;
          }
          .messageValue {
            font-size: 22px;
            font-weight: 800;
            color: #00dee5;
            margin-top: 2vh;
            margin-left: 15px;
            span {
              font-size: 10px;
              color: #fff;
              font-weight: 100;
              margin-left: 5px;
            }
          }
        }
      }
    }

    .ledContent {
      width: 75vw;
      height: 72vh;
      display: flex;
      .ledContentLeft {
        width: 16vw;
        height: 100%;
        .contentBox {
          width: 100%;
          height: 13.6vh;
          display: flex;
          // justify-content: space-around;
          align-items: center;
          background: url("../../assets/LED/leftContentBox.png");
          background-size: 100% 100%;
          .boxImg {
            width: 30%;
            text-align: center;
          }
          .boxMessage {
            width: 65%;
            .messageTitle {
              font-size: 15px;
              font-weight: 600;
              color: #fff;
            }
            .hr {
              width: 100%;
              height: 2px;
              background: linear-gradient(to right, #38a2d6 0%, #551138 100%);
              margin: 20px 0;
              // border: 1px solid transparent;
            }
            .messageValue {
              color: #00dee5;
              font-size: 20px;
              font-weight: 900;
            }
          }
        }
      }
      .ledContentRight {
        width: 59vw;
        height: 100%;
        background: url("../../assets/LED/ledMiddle.png");
        background-size: 100% 100%;
        margin: auto;
      }
    }
  }
  .ledPBRight {
    height: 100%;
    width: 25vw;
    .ledPBRTop {
      height: 63%;
      width: 100%;
      background: url("../../assets/LED/ledRightTop.png");
      background-size: 100% 100%;
    }
    .ledPBRBottom {
      height: 37%;
      width: 100%;
      background: url("../../assets/LED/ledRightBottom.png");
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
    }
  }
}
.newFont {
  // font-family: "Poppins-Regular";
  font-size: 70px;
  font-weight: 1000;
  display: flex;
  align-items: flex-end;
  transform: translateY(-2vh);
  color: #fff;
  height: 100%;
  margin-left: 3%;
}
.real-time-num {
  width: 4%;
  height: 10vh;
  background: url("../../assets/LED/orderNumBack.png");
  background-size: 100% 10vh;
  font-size: 40px;
  margin-left: 3px;
  text-align: center;
  overflow: hidden;
  .real-time-num-item {
    transition: all 0.5s ease-out;
    div {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 10vh;
    }
  }
}
.bannerBox {
  position: absolute;
  width: 50%;
  right: 2%;
  top: 0.3vh;
  height: 100%;
  overflow: hidden;
  #banner {
    color: #00dee5;
    font-size: 14px;
    white-space: nowrap; /* 文字不折行 */
    position: absolute;
    top: 3.3vh;
    // right:0%;
    animation: 10s move infinite linear;
    z-index: 2;
  }
  @keyframes move {
    0% {
      right: -100%;
    }
    100% {
      right: 100%;
    }
  }
}
</style>