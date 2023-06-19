<template>
  <div style="background:#fff;height:100vh">
    <el-form :inline="true" size="medium" style="padding:15px">
      <el-form-item>
        <el-button
          @click="changeDataType(index)"
          style="padding: 7px 10px"
          v-for="(item, index) in dataType"
          :key="index"
          size="mini"
          :type="searchRes.activeDataType == index ? 'primary' : 'info'"
          >{{ item }}</el-button
        >
      </el-form-item>
      <el-form-item label="起运区域">
        <el-select
          v-model="searchRes.startArea"
          placeholder="请选择起运区域"
          clearable
          remote
          multiple
          reserve-keyword
          style="width: 170px"
        >
          <el-option
            v-for="item in polArea"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目的港">
        <el-select
          v-model="searchRes.pod"
          id="pod"
          placeholder="请输入目的港"
          clearable
          filterable
          remote
          reserve-keyword
          style="width: 140px"
        >
          <el-option
            v-for="(item, index) in podOpt"
            :key="item.threeLetterCode"
            :value="item.threeLetterCode"
          >
            <span>{{ item.threeLetterCode }}</span>
            <span style="margin-left: 5px">{{ item.name }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提交时间" label-width="70px">
        <el-date-picker
          style="width: 140px"
          v-model="searchRes.startTime"
          type="date"
          :picker-options="pickerOptionsStartOne"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        >
        </el-date-picker
        >-
        <el-date-picker
          style="width: 140px"
          v-model="searchRes.endTime"
          type="date"
          :picker-options="pickerOptionsEndOne"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item style="margin-left: 10px">
        <el-button
          @click="searchList"
          type="primary"
          size="mini"
          style="border-radius: 7px"
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item style="margin-left: 8px;">
        <el-button
          @click="exportChat"
          type="primary"
          size="mini"
          style="border-radius: 7px"
          >导出会话</el-button
        >
      </el-form-item>
    </el-form>
    <div style="padding:0 20px">
    <el-table :data="tableData" max-height="600" >
      <el-table-column
        v-for="(item, index) in tableColumn"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
      >

      <template v-slot="{row}">
        <div v-if="item.prop == 'responseTime'">
          {{ row.responseTimeHour }}小时{{ row.responseTimeMin }}分
        </div>
        <div v-else >{{ row[item.prop] }}</div>
      </template>
      </el-table-column>
    </el-table>
    </div>
    <el-pagination
      background
      :current-page="pageNum"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="text-align:right;margin:2% 5% 0 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>
<script>
import chatUtil from "@/util/chatRoom.js";
const { dateFormat, getWeekSE, isToday } = chatUtil;
export default {
  created() {
    this.initAirportSearchByPage();
    this.searchList();
  },
  data() {
    return {
      searchRes: {
        activeDataType: 0,
        startArea: [],
        pod: "",
        startTime: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1 < 10
            ? "0" + (new Date().getMonth() + 1)
            : new Date().getMonth() + 1
        }-${
          new Date().getDate() < 10
            ? "0" + new Date().getDate()
            : new Date().getDate()
        }`,
        endTime: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1 < 10
            ? "0" + (new Date().getMonth() + 1)
            : new Date().getMonth() + 1
        }-${
          new Date().getDate() < 10
            ? "0" + new Date().getDate()
            : new Date().getDate()
        }`
      },
      podOpt: [],
      pickerOptionsStartOne: {
        // 限制航班日期
        disabledDate: time => {
          let endDateVal = this.searchRes.endTime;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        }
      },
      pickerOptionsEndOne: {
        disabledDate: time => {
          let beginDateVal = this.searchRes.startTime;
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime() - 8.64e7;
          }
        }
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      polArea: [
        {
          //起运区域
          label: "华东",
          value: "华东"
        },
        {
          label: "华南",
          value: "华南"
        },
        {
          label: "华中/华北",
          value: "华中华北"
        }
      ],
      dataType: ["今日", "昨日", "上周", "全部"],
      tableData: [],
      tableColumn: [
        {
          prop: "cwoId",
          label: "询单编号",
        },
        {
          prop: "createTime",
          label: "首次报价时间",
        },
         {
          prop: "responseTime",
          label: "报价响应时长",
        },
         {
          prop: "customerName",
          label: "询单人姓名",
        },
         {
          prop: "serviceName",
          label: "报价人姓名",
        },
        { prop: "startArea", label: "起始区域" },
        { prop: "pod", label: "目的港"},
        { prop: "piece", label: "件数"},
        { prop: "weight", label: "毛重"},
        { prop: "cbm", label: "体积"},
        { prop: "vwr", label: "比重"},
        { prop: "expectPrice", label: "报价"},
        {
          prop: "cargoReadyDate",
          label: "货好时间",
        },
        { prop: "remark", label: "备注"}
      ]
    };
  },
  methods: {
    //分页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.searchList();
    },
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.searchList();
    },
    //导出会话
    async exportChat() {
      const { dayjs } = this.$utils;
      let startArea = this.searchRes.startArea.join()
      let selectRes = { ...this.searchRes,startArea }
      const data = await this.$http.post(
        this.$service.exportCwoPallet,
        selectRes,
        {
          responseType: "arraybuffer"
        }
      );
      this.$utils.exportBuffer({
        buffer: data,
        exportName: `货盘记录.xlsx`
      });
    },
    searchList() {
      let { pageNum, pageSize } = this;
      let startArea = this.searchRes.startArea.join()
      let request = { ...this.searchRes, pageNum, pageSize, startArea };
      this.$http.post(this.$service.palletPage, request).then(res => {
        if (res.code == 200) {
          res.data.records.forEach(i => {
            if (i.expectPrice == 0) {
              i.expectPrice = "未报价";
            }
          });
          this.tableData = res.data.records;
          this.total = res.data.total;
        }
      });
    },
    //表格数据快捷筛选
    changeDataType(idx) {
      this.searchRes.activeDataType = idx;
      this.changeActiveDataType(idx);
      this.searchList();
      // });
    },
    changeActiveDataType(nv) {
      let date = new Date();
      if (nv == 0) {
        let today = `${date.getFullYear()}-${dateFormat(
          date.getMonth() + 1
        )}-${dateFormat(date.getDate())}`;
        this.searchRes.startTime = today;
        this.searchRes.endTime = today;
      } else if (nv == 1) {
        let time = date.getTime();
        let oneday = 1000 * 60 * 60 * 24;
        let lastDay = new Date(time - oneday);
        let lastDayDate = `${lastDay.getFullYear()}-${dateFormat(
          lastDay.getMonth() + 1
        )}-${dateFormat(lastDay.getDate())}`;
        this.searchRes.startTime = lastDayDate;
        this.searchRes.endTime = lastDayDate;
      } else if (nv == 2) {
        this.searchRes.startTime = getWeekSE()[0];
        this.searchRes.endTime = getWeekSE()[1];
      } else if (nv == 3) {
        this.searchRes.startTime = "";
        this.searchRes.endTime = "";
      }
    },
    //目的港
    podMethod(val) {
      if (this.lastVal == val) {
        return;
      }
      this.lastVal = val;
      this.initAirportSearchByPage(val);
    },
    initAirportSearchByPage(keyWord) {
      if (!keyWord) {
        keyWord = "";
      }
      this.$http
        .get(this.$service.airportSearchByPage + "?keyWord=" + keyWord)
        .then(data => {
          this.loading = false;
          if (data.code == 200) {
            this.podOpt = data.data.records;
          }
        });
    }
  },
  watch: {
    'searchRes.startTime'(nv, ov) {
      if (
        isToday(nv) == "今天" &&
        isToday(this.searchRes.endTime) == "今天"
      ) {
        this.searchRes.activeDataType = 0;
      } else if (
        isToday(nv) == "昨天" &&
        isToday(this.searchRes.endTime) == "昨天"
      ) {
        this.searchRes.activeDataType = 1;
      } else if (
        nv == getWeekSE()[0] &&
        this.searchRes.endTime == getWeekSE()[1]
      ) {
        this.searchRes.activeDataType = 2;
      } else if (!nv && !this.searchRes.endTime) {
        this.searchRes.activeDataType = 3;
      } else {
        this.searchRes.activeDataType = -1;
      }
    },
    'searchRes.endTime'(nv, ov) {
      if (
        isToday(nv) == "今天" &&
        isToday(this.searchRes.startTime) == "今天"
      ) {
        this.searchRes.activeDataType = 0;
      } else if (
        isToday(nv) == "昨天" &&
        isToday(this.searchRes.startTime) == "昨天"
      ) {
        this.searchRes.activeDataType = 1;
      } else if (
        this.searchRes.startTime == getWeekSE()[0] &&
        nv == getWeekSE()[1]
      ) {
        this.searchRes.activeDataType = 2;
      } else if (!nv && !this.searchRes.startTime) {
        this.searchRes.activeDataType = 3;
      } else {
        this.searchRes.activeDataType = -1;
      }
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.el-table {
  tr {
    &:first-child {
      td {
        border-top: 1px solid #f3f3f3;
      }
    }
  }
  td {
    border-right: 1px solid #f3f3f3;
    border-bottom: 1px solid #f3f3f3;
    &:first-child {
      border-left: 1px solid #f3f3f3;
    }
  }
}
/deep/td{
  .cell{
    text-align: center;
  }
}
/deep/th{
  .cell{
    text-align: center;
  }
}
</style>
