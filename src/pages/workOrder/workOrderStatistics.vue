<template>
  <div class="content-wrapper">
     <div class='totalBox'>
       <div class="statistBox">
         <div class="boxTitle">目的港总览-周统计</div>
         <div v-for="(item,index) in statistBoxData" :key="index" class="boxMessage">{{item.title}}: <span :style="{color: (item.colorShow?'#d8220b':'black'),fontWeight:(item.bolderShow ? '900':'400')}">{{item.value}}</span>
           <img src="../../assets/guanjunjiangbei.png" alt="" v-if="item.showNo">
           <img src="../../assets/upArrow.png" alt="" v-if="item.value>0 && item.showImg">
           <img src="../../assets/downArrow.png" alt="" v-if="item.value<0 && item.showImg">
         </div>
       </div>
      <echartsCategory :series="categorySeries" :yAxis="categoryYAxis" cid="category"></echartsCategory>
    </div>
    <div style="display:flex;justify-content:space-around;margin-top:80px">
      <echartsPie v-for="(item,index) in chartTitle" :key="index" :cid="`cid+${index}`" :chartTitle="chartTitle[index]" :centerTitle="centerTitle(index)" :data="pieData(index)"></echartsPie>
    </div>
   
  </div>
</template>

<script>
import echartsPie from '../../components/echartsPie.vue'
import echartsCategory from '../../components/echartsCategory.vue'
  export default {
    components:{
      echartsPie,
      echartsCategory
    },
    mounted(){
      this.getSumData();
      this.interval = setInterval(()=>{
        this.getSumData();
      clearInterval(this.intervalWeek)
      clearInterval(this.intervalMonth)},300000)
    },
    data(){
      return {
        //定时器
        interval:"",
        intervalWeek:"",
        intervalMonth:"",

        chartTitle:["日工单统计","周工单统计","月工单统计"], //饼图标题
        statistBoxData:[
          {title:"目的港",value:"",colorShow:true,bolderShow:true,showNo:true},
          {title:"周询次",value:""},
          {title:"周增长",value:"",unit:"%",showImg:true,colorShow:true,bolderShow:true}
          ], //目的港总览
          categorySeries: [{},{}],//柱状图图形数据
          categoryYAxis:[{},{}],//柱状图坐标轴数据

          //工单统计饼图
          centerTitle1:"",
          centerTitle2:"",
          centerTitle3:"",
          pieData1: [
            { value: "", name: "正常处理", color: "#eecb5f" },
            { value: "", name: "未处理", color: "#61a5e8" }],
          pieData2: [
            { value: "", name: "正常处理", color: "#eecb5f" },
            { value: "", name: "未处理", color: "#61a5e8" }]
          ,
           pieData3: [
            { value: "", name: "正常处理", color: "#eecb5f" },
            { value: "", name: "未处理", color: "#61a5e8" }]
          }
    },
    methods:{
      centerTitle(index){
        if(index == 0) {return this.centerTitle1}
        else if(index == 1) {return this.centerTitle2}
        else if(index == 2) {return this.centerTitle3}
      },
      pieData(index) {
        if(index == 0) {return this.pieData1}
        else if(index == 1) {return this.pieData2}
        else if(index == 2) {return this.pieData3}
      },
      getSumData(){
        this.$http.get(this.$service.sumWorkOrderData).then(data=>{
          if(data.code==200){
            //目的港总览数据
            this.statistBoxData[0].value=data.data.hottestPod.pod
            this.statistBoxData[1].value=data.data.hottestPod.weekSearchCount
            this.statistBoxData[2].value=String(data.data.hottestPod.weekGrowthRate)
            let podRanks = data.data.podRanks
            let podArray = []
            podArray.length = podRanks.length
          //目的港柱状图数据
          this.$set(this.categorySeries[0],"data",podRanks.map(item=>item.weekSearchCount))
          this.$set(this.categorySeries[1],"data",podArray.fill(Math.max(...podRanks.map(item=>item.weekSearchCount))))
          this.$set(this.categoryYAxis[0],"data",podRanks.map(item=>item.pod))
          this.$set(this.categoryYAxis[1],"data",podRanks.map(item=>item.weekSearchCount))

           //工单统计饼图数据
           //日
           let dailySum = data.data.dailySum
            this.pieData1[0].value = dailySum.normalCount
            this.pieData1[1].value = dailySum.unProcessedCount
            this.centerTitle1 = ` {name| ${dailySum.today.substr(5)}}\n {value|${dailySum.total}}`

            //周
            let weekLySums = data.data.weekLySums
            this.pieData2[1].value = weekLySums[2].unProcessedCount
            this.pieData2[0].value = weekLySums[2].normalCount
            this.centerTitle2 = `{name| ${weekLySums[2].weekDesc}}\n {value|${weekLySums[2].total}}`
            let wIndex = 2
            if(weekLySums && weekLySums.length>0){
              this.intervalWeek = setInterval(()=>{
                if(wIndex == 0){
                  wIndex =weekLySums.length-1
                }
                this.pieData2[1].value = weekLySums[wIndex].unProcessedCount
                this.pieData2[0].value = weekLySums[wIndex].normalCount
                this.centerTitle2 = `{name| ${weekLySums[wIndex].weekDesc}}\n {value|${weekLySums[wIndex].total}}`
                wIndex--
              },14000)
            }
            //月
            let monthlySums = data.data.monthlySums
             this.pieData3[1].value = monthlySums[2].unProcessedCount
             this.pieData3[0].value = monthlySums[2].normalCount
             this.centerTitle3 = `{name| ${monthlySums[2].monthNo+"月"}}\n {value|${monthlySums[2].total}}`
            let mIndex = 2
            if(monthlySums && monthlySums.length>0){
              this.intervalMonth = setInterval(()=>{
                if(mIndex == 0){
                  mIndex =monthlySums.length-1
                }
                this.pieData3[1].value = monthlySums[mIndex].unProcessedCount
                this.pieData3[0].value = monthlySums[mIndex].normalCount
                this.centerTitle3 = `{name| ${monthlySums[mIndex].monthNo+"月"}}\n {value|${monthlySums[mIndex].total}}`
                mIndex--
              },14000)
            }
          } else {
            this.$message.error(data.message)
          }
        })
      }
    },
    destroyed() {
      clearInterval(this.interval)
      clearInterval(this.intervalWeek)
      clearInterval(this.intervalMonth)
    },
  }
</script>

<style scoped lang="less">
.content-wrapper {
    width: 100%;
    box-sizing: border-box;
    /*height: 100%;*/
    padding: 20px;
    overflow: hidden;
    background-color: #f3f6f9 !important;
  }
  .totalBox {
    margin-bottom:40px; 
    display:flex;
    justify-content:space-around;
    .statistBox {
      width:360px;
      border:2px solid silver;
      .boxTitle {
        padding:15px 0 15px 25px;
        font-size:35px;
        font-weight:bolder;
        color:white;
        background: #61a5e8;
        margin-bottom:25px;
      }
      .boxMessage {
        padding-left:25px;
        font-size:25px;
        margin-bottom:40px;
      img {
        width:30px;
        height:40px;
      }
    }
}
  }

  
</style>
