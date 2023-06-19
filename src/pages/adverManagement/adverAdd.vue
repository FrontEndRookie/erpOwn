<template>
 <div class="content-wrapper">
    <div class="content">
      <div class="echarts-all">

        <div>
          <div id="echartsPie1" style="width: 100%;height: 100%;"></div>
        </div>

        <div>
          <div id="echartsPie2" style="width: 100%;height: 100%;"></div>
        </div>

        <div>
          <div id="echartsPie3" style="width: 100%;height: 100%;"></div>
        </div>

        <div>

        </div>

        <div>
          <div id="echartsPie5" style="width: 100%;height: 100%;"></div>
        </div>

        <div>
          <div id="echartsPie6" style="width: 100%;height: 100%;"></div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    mounted() {

    },
    methods: {

    }
  }
</script>

<style scoped lang="less">
	@import url("../../assets/icon/iconfont.css");
	.content-wrapper {
		width: 100%;
    box-sizing: border-box;
    /*height: 100%;*/
    padding: 20px;
    overflow: hidden;
    background-color: #f3f6f9 !important;
  }
  .echarts-all{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .echarts-all > div{
    width: 32.33%;
    height: 45vh;
    min-width: 450px;
    min-height: 430px;
    margin-right: 1.5%;
    border: 1px solid #dedede;
    box-sizing: border-box;
    background-color: #FFF;
    margin-top: 15px;
    // padding: 15px;
  }
  .echarts-all > div:nth-of-type(3n){
    margin-right: 0;
  }
</style>
