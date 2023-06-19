<template>
  <div class="channel-analysis">
    <header>
      <el-radio-group v-model="fastDate">
        <el-radio-button
          v-for="item in fastDates"
          :label="item.label"
          :key="item.label"
          >{{ item.text }}</el-radio-button
        >
      </el-radio-group>
      <dc-form :inline="true" size="mini">
        <div class="form-row" style="margin-top: 20px">
          <el-form-item label="漏斗分析">
            <el-select v-model="form.type" @change="form.name = ''" placeholder="请选择分类">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="时间">
            <el-date-picker
              v-model="form.beginDate"
              type="date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              placeholder="起始日期"
              :picker-options="beginDatePickerOptions"
              @change="
                () => {
                  getTableData();
                  fastDate = '';
                }
              "
            />
            <span style="margin: 0 10px">-</span>
            <el-date-picker
              v-model="form.endDate"
              type="date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              placeholder="结束日期"
              :picker-options="endDatePickerOptions"
              @change="
                () => {
                  getTableData();
                  fastDate = '';
                }
              "
            />
          </el-form-item>
          <el-form-item label="项目">
            <el-select v-model="form.project" placeholder="请选择项目" @change="getTableData();form.name = ''">
              <el-option
                v-for="item in computedProjects"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </dc-form>
    </header>
    <main class="main-wrap" style="margin-top: 20px">
      <div ref="funnelChart" class="funnel-chart"></div>
      <div class="funnel-table" >
        <el-table
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          style="width: 100%"
          class="table-rowss"
          v-if="form.type === 3 && form.name != ''"
          :data="tableData"
          :row-class-name="tableRowClassName"
          :span-method="form.project === ''?objectSpanMethod:''"
          border>
          <el-table-column
            v-for="(column, index) in columns"
            v-if="form.project !== '' && column.label=='项目'?false:true"
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :min-width="column.width"
            align="center">
            <template slot-scope="scope">
              <div v-if="column.label=='项目'">
                {{scope.row.channelTypeName?scope.row.channelTypeName:'计数'}}
              </div>
              <div v-else>
                {{scope.row[column.prop]}}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </main>
  </div>
</template>

<script>
import * as echarts5 from "echarts5";
export default {
  // 渠道分析
  name: "ChannelAnalysis",
  created() {
    this.init();
  },
  data() {
    return {
      tableData:[],
      fastDates: [
        {
          label: "today",
          text: "今天",
        },
        {
          label: "yestoday",
          text: "昨天",
        },
        {
          label: "week",
          text: "本周",
        },
        {
          label: "all",
          text: "全部",
        },
      ],
      fastDate: "today",
      form: {
        type: "",
        project: "",
        beginDate: "",
        endDate: "",
        name:'',
      },
      types: [
        {
          value: "",
          label: "全部",
        },
        {
          value: 1,
          label: "渠道推广",
        },
        {
          value: 2,
          label: "流量推广",
        },
        {
          value: 3,
          label: "内部运营",
        },
        {
          value: 4,
          label: "SEO推广",
        },
      ],
      projects: [
        {
          value: "",
          label: "全部",
        },
        {
          type: 1,
          value: 1,
          label: "福步论坛",
        },
        {
          type: 1,
          value: 2,
          label: "友情链接",
        },
        {
          type: 2,
          value: 3,
          label: "短信",
        },
        {
          type: 2,
          value: 4,
          label: "邮件",
        },
        {
          type: 3,
          value: 5,
          label: "QQ群发",
        },
        {
          type: 3,
          value: 6,
          label: "微信任务",
        },
        {
          type: 3,
          value: 7,
          label: "贴吧",
        },
        {
          type: 3,
          value: 8,
          label: "自推广",
        },
        {
          type: 3,
          value: 9,
          label: "知乎",
        },
        {
          type: 3,
          value: 10,
          label: "福步",
        },
        {
          type: 3,
          value: 11,
          label: "电销",
        },
        {
          type: 2,
          value: 12,
          label: "飞啊网",
        },
        {
          type: 3,
          value: 13,
          label: "抖音",
        },
        {
          type: 1,
          value: 14,
          label: "货代说",
        },
        {
          type: 4,
          value: 15,
          label: "百度",
        },
      ],
      spanArr:[],
      columns:[
        {
          label: '人员',
          prop: 'customerServiceName',
          show: true,
          // width: '160'
        },{
          label: '编号',
          prop: 'customerServiceNo',
          show: true,
        },{
          label: '项目',
          prop: 'channelTypeName',
          show: true,
          // width: '160'
        },{
          label: '浏览量（PV）',
          prop: 'pv',
          show: true,
        },{
          label: '访客数（UV）',
          prop: 'uv',
          show: true,
        },],
      funnelChart: null,
      list: [
        {
          key: "countIndex",
          value: 100,
          name: "浏览网站",
          color: "#6395f9",
        },
        {
          key: "countClick",
          value: 80,
          name: "点击登录",
          color: "#62daab",
        },
        {
          key: "countSubscribe",
          value: 60,
          name: "扫码关注公众号",
          color: "#657798",
        },
        {
          key: "countVerification",
          value: 50,
          name: "获取验证码",
          color: "#f6c022",
        },
        {
          key: "countRegister",
          value: 30,
          name: "注册完成",
          color: "#7666f9",
        },
        {
          key: "countAuthenticate",
          value: 20,
          name: "提交企业认证资质",
          color: "#95f204",
        },
        {
          key: "countOrder",
          value: 10,
          name: "确认订舱",
          color: "#d9021b",
        },
      ],
      countSum: {},
    };
  },
  computed: {
    computedProjects() {
      return this.projects.filter((item) => {
        if (!this.form.type) {
          return true;
        }
        return !item.type || item.type === this.form.type;
      });
    },
    beginDatePickerOptions() {
      return {
        disabledDate: (time) => {
          return time.getTime() > new Date().getTime();
        },
      };
    },
    endDatePickerOptions() {
      return {
        disabledDate: (time) => {
          const beginDate = new Date(this.form.beginDate).getTime();
          return (
            time.getTime() > new Date().getTime() ||
            time.getTime() < beginDate - 60 * 60 * 1000 * 24
          );
        },
      };
    },
    chartData() {
      let { list, countSum } = this;
      list = list.map((item) => {
        const count = countSum[item.key] || 0;
        const ratio = countSum.countIndex
          ? Math.round(((count * 100) / countSum.countIndex) * 10) / 10
          : 0;
        return {
          ...item,
          count,
          ratio,
        };
      });
      return {
        legendData: list.map((item) => item.name),
        seriesData: list.map((item, index) => {
          return {
            ...item,
            itemStyle: {
              color: item.color,
            },
            tooltip: {
              formatter: `${item.name} ${item.ratio}%`,
            },
            label: {
              formatter: `${item.ratio}%`,
            },
          };
        }),
        labelLineData: list.map((item, index) => {
          return {
            ...item,
            itemStyle: {
              color: item.color,
            },
            label: {
              normal: {
                formatter: `${item.count}`,
              },
            },
          };
        }),
      };
    },
    chartOption() {
      const { legendData, seriesData, labelLineData } = this.chartData;
      const seriesOption = {
        type: "funnel",
        left: "0",
        minSize: "10%",
        sort: "none",
      };
      return {
        title: {
          text: "转化率",
        },
        tooltip: {
          trigger: "item",
        },
        toolbox: {
          feature: {
            // dataView: { readOnly: false },
            // restore: {},
            // saveAsImage: {},
          },
        },
        legend: {
          data: legendData,
          x: "center",
          y: "bottom",
        },
        series: [
          {
            ...seriesOption,
            name: "line",
            silent: true,
            labelLine: {
              length: 40,
              lineStyle: {
                width: 2,
                color: "transparent",
              },
            },
            data: labelLineData,
          },
          {
            ...seriesOption,
            name: "转化率",
            label: {
              position: "inside",
              textStyle: {
                color: "#fff",
              },
            },
            data: seriesData,
          },
        ],
      };
    },
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
        // return console.log(row)
        if (row.channelType == -1) {
          return 'warning-row';
        }else if(row.customerServiceName == '计数'){
          return 'warning-row';
        }
        return '';
      },
    getSpanArr(data) {
      this.spanArr = []
        // data就是我们从后台拿到的数据
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          var pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].customerServiceName === data[i - 1].customerServiceName) {
            this.spanArr[pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            pos = i;
          }
        }
      }
        // console.log(this.spanArr);
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        // console.log(`rowspan:${_row} colspan:${_col}`);
        return {
          // [0,0] 表示这一行不显示， [2,1]表示行的合并数
          rowspan: _row,
          colspan: _col
        };
      }
    },
    // changeTable(name,type){
    //   console.log(name,type);
    //   this.getTableData()
    // },
    // getName(typeIndex){
    //   for (let j = 0; j < this.projects.length; j++) {
    //           if(this.projects[j].type == typeIndex){
    //              var channelTypeName = this.projects[j].label
    //              return channelTypeName
    //             data.data[i].channelTypeName = channelTypeName
    //           }
    //         }
    // },
    getTableData(){
      if(this.form.type !== 3){
        return
      }
      var trackType = ''
      var nameArr = ['','浏览网站','点击登录','扫码关注公众号','获取验证码','注册完成', '提交企业认证资质', '确认订舱']
      for (let i = 0; i < nameArr.length; i++) {
        if(nameArr[i] == this.form.name){
           trackType = i
        }
      }
      var obj = {
        beginDate: this.form.beginDate,
        endDate: this.form.endDate,
        typeLevel1: this.form.type,
        typeLevel2: this.form.project,
        trackType:trackType,
      }
      this.$http.post(this.$service.getBuriedPointTable,obj).then(data => {
        if (data.code == 200) {
          var dataArr = JSON.parse(JSON.stringify(data.data))
          for (let i = 0; i < dataArr.length; i++) {
             for (let j = 0; j < this.projects.length; j++) {
              
              if(Number(this.projects[j].value) == Number(dataArr[i].channelType)){
                 dataArr[i].channelTypeName = this.projects[j].label
              }else{
                // dataArr[i].channelTypeName = '计数'
              }
            }
            // this.$set(dataArr[i],'channelTypeName',channelTypeName)
          }
          this.tableData = dataArr
          this.getSpanArr(dataArr)
        } else {
          this.$message.error(data.message)
        }
      }).catch(() => {
            console.log('取消')
          })
    },
    async init() {
      await this.$nextTick();
      this.initFunnelChart();
      this.getBuriedPointSum();
      this.funnelChart.on('click', (params) => { //漏斗点击事件
        // console.log(params.data.name);
        this.form.name = params.data.name
        this.getTableData()
      })
    },
    initFunnelChart() {
      const funnelChart = echarts5.init(this.$refs.funnelChart);
      this.funnelChart = funnelChart;
    },
    updateFunnelChart() {
      this.funnelChart.setOption(this.chartOption);
    },
    fastDateChange() {
      const { dayjs } = this.$utils;
      switch (this.fastDate) {
        case "today":
          const today = dayjs().format("YYYY-MM-DD");
          this.form.beginDate = today;
          this.form.endDate = today;
          break;
        case "yestoday":
          const yestoday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
          this.form.beginDate = yestoday;
          this.form.endDate = yestoday;
          break;
        case "week":
          this.form.beginDate = dayjs().day(1).format("YYYY-MM-DD");
          this.form.endDate = dayjs().format("YYYY-MM-DD");
          break;
        case "all":
          this.form.beginDate = "";
          this.form.endDate = "";
          break;
      }
    },
    async getBuriedPointSum() {
      const {
        beginDate,
        endDate,
        type: typeLevel1,
        project: typeLevel2,
      } = this.form;
      try {
        const {
          data: { data },
        } = await this.$api.getBuriedPointSum({
          beginDate,
          endDate,
          typeLevel1,
          typeLevel2,
        });
        this.countSum = data;
        this.updateFunnelChart();
      } catch (error) {}
    },
  },
  watch: {
    fastDate: {
      immediate: true,
      handler() {
        this.fastDateChange();
      },
    },
    "form.type"() {
      this.form.project = "";
    },
    form: {
      deep: true,
      handler() {
        this.getBuriedPointSum();
      },
    },
  },
};
</script>

<style lang="less" scoped>
.channel-analysis {
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: calc(100vh - 121px);
  .form-row {
    padding: 20px 20px 0 20px;
    margin-top: 20px;
    background: #fff;
    :nth-of-type(1) {
      margin-top: 0;
    }
  }
  .main-wrap {
    flex: 1;
    display: flex;
    flex-direction: row;
    min-height: 0;
    padding: 20px;
    background: #fff;
    overflow: auto;
    .funnel-chart {
      width: 500px;
      height: 500px;
      margin-right: 200px;
    }
    .funnel-table{
      flex:1;
      height: 500px;
      overflow: scroll;
    }
  }
   /deep/.table-rowss .el-table__row  td{
    border-right: 1px #ebeef5 solid !important;
    border-bottom: 1px #ebeef5 solid !important;
  }
   /deep/.table-rowss  .warning-row{
    background: #ffdd02;
  }
}
</style>