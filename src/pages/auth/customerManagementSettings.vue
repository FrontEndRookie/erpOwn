<template>
  <div style="background: #FFF;width:100%;height:calc(100%);overflow: scroll;">
    <div class="topButton">
      <button @click.stop="addList(-1)" v-auth="['656001_B']"> 新增 </button>
    </div>
    <el-table stripe ref="multipleTable" class="tableBody" :data="tableData" style="width: 100%">
      <template slot="empty">
        <img class="data-pic" src="../../assets/kong-icon.png" />
        <p>暂无数据</p>
      </template>
      >
      <el-table-column
        v-for="(column, index) in columns"
        :key="index"
        :sortable="column.sort"
        :prop="column.prop"
        :label="column.label"
        :min-width="column.width"
        align="center"
      >
        <template slot-scope="scope">
          <div v-if="column.label == '操作'" class="flexLineBox">
            <span @click.stop="detailsListItem(scope.$index,scope.row)" v-auth="['656000_B']">查看</span>
            <span @click.stop="addList(scope.$index,scope.row)" v-auth="['656001_B']">复制新增</span>
            <span v-if="!(scope.row.id === -1)" @click.stop="deleteListItem(scope.$index,scope.row)" v-auth="['656002_B']">删除</span>
            <span v-else></span>
          </div>
          <div v-else-if="column.label == '名称'" style="color: #169bd5;cursor: pointer;">
            <span @click.stop="detailsListItem(scope.$index,scope.row)" v-auth:disabled="['656000_B']">{{scope.row.settingName}}</span>
          </div>
          <div v-else-if="column.label == '生效时间'">
            <span>{{scope.row.effectiveDate?scope.row.effectiveDate:'/'}}</span>
          </div>
          <div
            v-else-if="column.label == '生效状态'"
            :style="{
              color:
                scope.row.status == 2? '#04f91d' : scope.row.status == 3?'#d9001b':'',
            }"
          >
            {{statusChange(scope.row.status)}}
          </div>
          <div v-else>
            {{ scope.row[column.prop] }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- <div v-show="total > 10">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handleCurrent"
        @size-change="handleSize"
        style="text-align: right; padding: 19px 30px 18px 0; background: #fff"
      >
      </el-pagination>
    </div> -->
    <div style="height:60px"></div>
    <el-dialog
      :close-on-click-modal="false"
      :title="(dialogEditor?'新增':'查看')+'设置'"
      :visible.sync="dialogVisible"
      @closed="closedHandle()"
      width="800px"
      :before-close="closeDia">
      <div 
      style="min-height:600px">
        <div class="lineDiv">
          <div class="line_tip">
            <span>名称</span><span class="ridTittle">&nbsp;*</span>
          </div>
          <div :class="warnNumber === 1?'warnClass':''" class="line_input line_input2">
            <div class="pictrue">
              <div class="item">
                <div class="img"></div>
              </div>
            </div>
            <div>设置名称</div>
            <div class="fgx"></div>
            <el-input v-model="settingName" type="text" @input="settingName=settingName.replace(/[ ]/g,'')" :disabled="!dialogEditor" placeholder="请输入名称" maxlength="10" show-word-limit
            @blur="blurWarnNum(settingName)"></el-input>
          </div>
        </div>
        <div class="lineDiv">
          <div class="line_tip">
            <span>信用等级额度范围设置</span><span class="ridTittle">&nbsp;*</span>
          </div>
          <div  class="line_input">
            <div class="tableBox">
                  <div class="tableLine tableLineTopH">
                    <div class="tableItem1 tableItem">
                      <span>信用等级</span>
                    </div>
                    <div class="tableItem2 tableItem">最小额度（元）</div>
                    <div class="tableItem2 tableItem">最大额度（元）</div>
                  </div>
                  <div class="tableLine" v-for="(item,index) in creditRates" :key="index">
                    <div class="tableItem1 tableItem"><span>{{item.levelName}}级</span></div>
                    <div class="tableItem2 tableItem">{{item.minLines?item.minLines:'请填写最大额度'}}</div>
                    <div style="position: relative;" class="tableItem2 tableItem">
                      <div v-if="!(item.show)">
                        <i class="el-icon-edit-outline" :style="item.warn?'color:red;':''" style="font-size:18px;cursor: pointer;"
                        @click="inputFocus(index)"></i>
                      </div>
                      <div v-else>
                        <span style="font-size:16px;color:red;" v-show="dialogEditor">*&nbsp;</span>
                        <input 
                          :id="'moneyInput-'+index"
                          :disabled="!dialogEditor"
                          :class="[{'warnClass':item.warn},{'noBorad':!dialogEditor}]"
                          maxlength="8"
                          @input="
                            (item.maxLines = $utils.pureNumber(item.maxLines)),nextInput(index)"
                          v-model="item.maxLines"
                          @blur="blurInput(index)"
                          type="text"
                        />
                      </div>
                      <!-- <span v-if="index === 4">
                        不限制
                      </span> -->
                      <!-- <div style="position: absolute;bottom:-7px;left:-70px;color:red;width: 300px;" v-show="item.warn">最大额度需要大于同等级别的最小额度，请重新输入</div> -->
                    </div>
                  </div>
                </div>
          </div>
        </div>
        <div class="optionBox">
          <div class="lineDiv">
            <div class="line_tip">
              <span>客户超期后下单限制</span><span class="ridTittle">&nbsp;*</span>
            </div>
            <div  class="line_input line_input2" :class="warnNumber === 6?'warnClass':''">
              <el-select :disabled="!dialogEditor"
                v-model="overDueOrExcessLimit.overDue"
                @change="overDueOrExcessLimit.overDue == 3?overDueOrExcessLimit.overDueSettlementMethod='':overDueOrExcessLimit.overDueSettlementMethod=10"
                placeholder="请选择"
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="item in timesArr5"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="lineDiv">
            <div class="line_tip">
              <span>客户超期后结算方式</span><span class="ridTittle">&nbsp;*</span>
            </div>
            <div  class="line_input line_input2">
              <el-select
              :disabled="overDueOrExcessLimit.overDue == 3 || !dialogEditor"
                v-model="overDueOrExcessLimit.overDueSettlementMethod"
                placeholder="/"
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="item in timesArr6"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="lineDiv">
            <div class="line_tip">
              <span>客户超额后下单限制</span><span class="ridTittle">&nbsp;*</span>
            </div>
            <div  class="line_input line_input2" :class="warnNumber === 5?'warnClass':''">
              <el-select :disabled="!dialogEditor"
                v-model="overDueOrExcessLimit.excess"
                placeholder="请选择"
                size="small"
                @change="overDueOrExcessLimit.excess == 3?overDueOrExcessLimit.excessSettlementMethod='':overDueOrExcessLimit.excessSettlementMethod=10"
                style="width: 100%"
              >
                <el-option
                  v-for="item in timesArr5"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="lineDiv">
            <div class="line_tip">
              <span>客户超额后结算方式</span><span class="ridTittle">&nbsp;*</span>
            </div>
            <div  class="line_input line_input2">
              <el-select
              :disabled="overDueOrExcessLimit.excess == 3 || !dialogEditor"
                v-model="overDueOrExcessLimit.excessSettlementMethod"
                  placeholder="/"
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="item in timesArr6"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="lineDiv">
            <div class="line_tip">
              <span>临时额度期限</span><span class="ridTittle">&nbsp;*</span>
            </div>
            <div class="line_input line_input2" :class="warnNumber === 3?'warnClass':''">
              <el-select :disabled = "!dialogEditor"
                v-model="otherSetting.temporaryQuotaPeriod"
                placeholder="请选择"
                size="small"
                style="width: calc(100%);margin:0  0 0 0px"
              >
                <el-option
                  v-for="item in timesArr4"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="lineDiv">
            <div class="line_tip">
              <span>超期滞纳金比例</span><span class="ridTittle">&nbsp;*</span>
            </div>
            <div :class="warnNumber === 2?'warnClass':''" class="line_input line_input2">
              <el-input :disabled = "!dialogEditor" size="small" v-model="otherSetting.overDueFeeRatio" placeholder="请输入"
                @input="otherSetting.overDueFeeRatio = $utils.clearNoNum(otherSetting.overDueFeeRatio,2)"
                @blur="blurWarnNum(otherSetting.overDueFeeRatio)"
                style="width: calc(100% - 100px);margin:0 10px 0 0"></el-input>
                <span class="tittleTip">%/每天&nbsp;</span>
            </div>
          </div>
          <div class="lineDiv" v-show="!(!dialogEditor && !effectiveDate)">
            <div class="line_tip">
              <span>本次设置生效日期</span><span class="ridTittle">&nbsp;*</span>
            </div>
            <div :class="warnNumber === 4?'warnClass':''" class="line_input line_input2">
              <el-input
                id="timeInput"
                :disabled = "!dialogEditor"
                @focus="openTimeChandle"
                size="mini"
                style="width:100%"
                placeholder="选择生效日期"
                suffix-icon="el-icon-date"
                v-model="effectiveDate">
              </el-input>
            </div>
          </div>
        </div>
      </div>
      <span v-if="dialogEditor" slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSetData('1')">确 定</el-button>
      </span>
      <el-dialog
        :modal="false"
        title="选择时间"
        :visible.sync="dogShow"
        width="600px"
        @open="openDia"
        :close-on-click-modal="false"
      >
        <el-calendar
          v-model="valueTime"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          style="border-top: 1px rgb(26, 26, 26) solid"
        >
          <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
          <template slot="dateCell" slot-scope="{ date, data }">
            <div
              :class="
                new Date(data.day) < new Date() - 86400000 ? 'is-selecteds' : ''
              "
              style="height: 100%"
            >
              <p
                :class="data.isSelected ? 'is-selected' : ''"
                style="
                  height: 50px;
                  font-size: 16px;
                  line-height: 50px;
                  text-align: center;
                "
              >
                <!-- {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}} -->
                {{ Number(data.day.split("-").slice(2).join("")) }}
                {{ data.isSelected ? "✔️" : "" }}
              </p>
            </div>
          </template>
        </el-calendar>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose(1),dogShow=false">此刻</el-button>
          <el-button type="primary" @click="handleClose(2),dogShow=false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-dialog>
    <el-dialog
        title="删除设置"
        :visible.sync="delDiaShow"
        width="800px"
        :close-on-click-modal="false"
      >
        <div class="delDiaShowText">
          <span>{{selRow.settingName }}</span>
          {{selRow.status == 2?'正在生效，删除设置后将采用系统默认设置，确认删除该设置吗？':'删除后不可恢复，确认删除该设置吗？'}}
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delDiaShow=false">我再想想</el-button>
          <el-button type="primary" @click="deleteListItemHandle(selRow.id);delDiaShow=false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
  </div>
</template>

<script>
// import Table from './components/clientTable.vue'
export default {
  //   components:{
  //       Table
  //   },
  props: {},
  data() {
    return {
      dialogEditor:true,
      dialogVisible:false,
      tableData: [],
      columns: [
        {
          label: "名称",
          prop: "settingName",
          show: true,
          width: "",
          fixed: "left",
        },
        {
          label: "生效时间",
          prop: "effectiveDate",
          show: true,
          width: "",
          fixed: "left",
        },
        { label: "生效状态", prop: "status", show: true, width: "" },

        { label: "设置时间", prop: "createTime", show: true, width: "" },
        { label: "设置人", prop: "createUserName", show: true, width: "" },
        {
          label: "操作",
          prop: "--",
          show: true,
          width: "",
        },
      ],
      // currentPage: 1,
      // pageSize: 10,
      // total: 10, // 以下为旧
      creditRates:[
        {
            "maxLines": null,
            "minLines": 1,
            "levelId": 5,
            "levelName": "E",
            'warn':false,
            'show':false,
        },
        {
            "maxLines": null,
            "minLines": null,
            "levelId": 4,
            "levelName": "D",
            'warn':false,
            'show':false,
        },
        {
            "levelId": 3,
            "minLines": null,
            "levelName": "C",
            "maxLines": null,
            'warn':false,
            'show':false,
        },
        {
            "levelName": "B",
            "maxLines": null,
            "minLines": null,
            "levelId": 2,
            'warn':false,
            'show':false,
        },
        {
            "levelId": 1,
            "maxLines": null,
            "minLines": null,
            "levelName": "A",
            'warn':false,
            'show':false,
        },],
      warnNumber: 0,
      bumberJ: 0,
      bumber: "",
      oldData: "",
      valueTime: new Date(),
      effectiveDate: '', // 开始生效时间
      dogShow: false,
      // creditRatingRelegationMechanism: 0, // 信用等级降级机制 1-开启 0-关闭
      form: { timeValue1: 0, timeValue2: 0, activeSet: "1" },
      timesArr: [
        { value: 0, label: "累计总和" },
        { value: 1, label: "每月" },
        { value: 2, label: "每季度" },
        { value: 3, label: "每半年" },
        { value: 4, label: "每年" },
      ],
      timesArr1: [{ value: 0, label: "下一级别的最大额度" }],
      timesArr2: [
        { value: 0, label: "可下单，付款买单" },
        { value: 1, label: "可下单，订单冻结需要审批" },
      ],
      timesArr3: [
        { value: 0, label: "可下单，订单冻结需要审批" },
        { value: 1, label: "可下单，不做处理" },
        { value: 2, label: "不可下单，直接封号" },
      ],
      timesArr4: [
        { value: 1, label: "1个月" },
        { value: 2, label: "2个月" },
        { value: 3, label: "3个月" },
        { value: 4, label: "4个月" },
        { value: 5, label: "5个月" },
        { value: 6, label: "6个月" },
      ],
      timesArr5: [
        { value: 1, label: "可下单，不做限制" },
        { value: 2, label: "可下单，订单冻结需要审批" },
        { value: 3, label: "不可下单" },
      ],
      timesArr6: [
        // { value: 0, label: "/" },
        { value: 10, label: "不做限制" },
        { value: 0, label: "付款买单" },
      ],
      tittles: [
        "客户管理设置",
        // "供应商管理设置",
        // "报警设置",
        // "组织架构",
        // "角色权限",
      ],
      overDueOrExcessLimit: {
        "excess": 3,  // 超额
        "excessSettlementMethod": '', // 超额结算方式
        "overDueSettlementMethod": '', // 超期结算方式
        "overDue": 3 // 超期
      },
      otherSetting: {
        "overDueFeeRatio": null, // 超期滞纳金比例 0.5% 每天
        "temporaryQuotaPeriod": 1 // 临时额度期限 单位：月
      },
      // autoRelegationMechanism: "enim exercitation",
      timeType:0,
      settingName:'',
      id:'',
      createTime:'',
      delDiaShow:false, // 确定删除提示框
      selRow:'', // 确定删除信息
    };
  },
  created() {
  },
  mounted() {
    this.getSetPageList()
  },
  beforeMount() {
    var d = this.valueTime; //转换时间戳
    this.valueTime =
      d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  },
  watch: {
    valueTime: {
      handler(newName, oldName) {
        this.calendarChang(newName, oldName);
      },
      immediate: true,
    },
  },
  computed: {
    
  },
  methods: {
    blurWarnNum(value){
      if(value){
        this.warnNumber = 0
      }
    },
    closedHandle(){
      for (let i = 0; i < this.creditRates.length; i++) {
        this.$set(this.creditRates[i],"show",false)
      }
    },
    inputFocus(index){
      this.$set(this.creditRates[index],"show",true)
      setTimeout(()=>{
        document.getElementById('moneyInput-'+index).focus()
      })
      for (let i = 0; i < this.creditRates.length; i++) {  // 失焦使使得输入框变为icon
        // if(i !== index){
        if(!Boolean(this.creditRates[i].maxLines) && i !== index){
          this.$set(this.creditRates[i],"show",false)
        }
      }
    },
    openTimeChandle(){
      document.getElementById("timeInput").blur();
      if(Boolean(this.effectiveDate)){
        this.valueTime = this.$utils.dayjs(this.effectiveDate).format("YYYY-MM-DD")
      }else{
        this.valueTime = this.$utils.dayjs(new Date()).format("YYYY-MM-DD")
      }
      this.dogShow = true
    },
    statusChange(index){
      var statusArray = ["","暂未生效","生效","失效"]
      return statusArray[Number(index)]
    },
    closeDia(){
      this.dialogVisible = false
    },
    getSetPageList(){
      var obj = {
        "currentPage": 1,
        "pageSize": 10000
      }
       this.$http.post(this.$service.systemSetPageList, obj).then((data) => {
          if (data.code == 200) {
            // console.log(data.data);
            this.tableData = data.data.records
            // this.total = data.data.total
          } else {
            this.$message.error(data.message);
          }
        });
    },
    detailsListItem(index,row){
      this.dialogEditor = false
      this.dialogVisible = true
      this.getSetData(row,true) // 第二个元素用于判断生效时间是否复用
    }, 
    deleteListItem(index,row){
      this.selRow = row
      // console.log(this.selRow,"------");
      setTimeout(()=>{
        this.delDiaShow = true
      })
    },
    deleteListItemHandle(id){
      this.$http.post(this.$service.deleteSystemSetList, [id]).then((data) => {
        if (data.code == 200) {
          this.$message.success("删除成功");
          this.getSetPageList();
        } else {
          this.$message.error(data.message);
        }
      });
    },
    addList(index,row){
      this.dialogEditor = true
      this.dialogVisible = true
      if(index === -1){
        this.getSetData()
      }else{
        this.getSetData(row,false)
      }
    },
    openDia() {
      if(Boolean(this.effectiveDate)){
        this.valueTime = this.$utils.dayjs(this.effectiveDate).format("YYYY-MM-DD")
      }else{
        this.valueTime = this.$utils.dayjs(new Date()).format("YYYY-MM-DD")
      }
    },
    nextInput(index) {
      if (Number(index) < 4 && Number(this.creditRates[index].maxLines) != 0) {
        this.creditRates[Number(index) + 1].minLines =
          Number(this.creditRates[index].maxLines) + 1;
      }
    },
    blurInput(index) {
      if (
        Number(this.creditRates[index].maxLines) === 0 ||
        Number(this.creditRates[index].maxLines) === "" ||
        Number(this.creditRates[index].maxLines) === null
      ) {
        var arrData = JSON.parse(JSON.stringify(this.creditRates));
        for (let i = index; i < arrData.length; i++) {
          if (i == index) {
            this.$set(this.creditRates[i], "maxLines", "");
            this.$set(this.creditRates[i], "warn", false);
          }
          // else if(i == 4){
          //   this.$set(this.creditRates[i],'minLines','')
          //   this.$set(this.creditRates[i],'maxLines','不限制')
          // }
          else {
            this.$set(this.creditRates[i], "minLines", "");
            this.$set(this.creditRates[i], "maxLines", "");
            this.$set(this.creditRates[i], "warn", false);
          }
        }
      }
      if (
        this.creditRates[Number(index)].minLines >=
        Number(this.creditRates[index].maxLines)
      ) {
        this.$set(this.creditRates[Number(index)], "warn", true);
        this.$message.warning("最大额度需要大于同等级别的最小额度，请重新输入");
        // this.creditRates[Number(index)].warn = true
      }else if (this.creditRates[Number(index+1)] && this.creditRates[Number(index+1)].maxLines &&
        (this.creditRates[Number(index+1)].minLines >=
        Number(this.creditRates[index+1].maxLines))
      ) {
        this.$set(this.creditRates[Number(index+1)], "warn", true);
        this.$message.warning("最大额度需要大于同等级别的最小额度，请重新输入");
        // this.creditRates[Number(index)].warn = true
      } else {
        this.$set(this.creditRates[Number(index)], "warn", false);
        // this.creditRates[Number(index)].warn = false
      }
    },
    calendarChang(newda, oldda) {
      var newData = new Date();
      var valueTime =
        newData.getFullYear() +
        "-" +
        (newData.getMonth() + 1) +
        "-" +
        newData.getDate();
      var aa = new Date(newda);
      var cc =
        aa.getFullYear() + "-" + (aa.getMonth() + 1) + "-" + aa.getDate();
      var bb = new Date(oldda);
      var dd =
        bb.getFullYear() + "-" + (bb.getMonth() + 1) + "-" + bb.getDate();
      if (valueTime == cc) {
        this.timeType = 4;
      } else {
        this.timeType = 0;
      }
      console.log(valueTime, cc, dd);
      if (aa < newData) {
        setTimeout(() => {
          this.valueTime = valueTime;
        });
      } else {
        // setTimeout(()=>{
        //   this.valueTime = cc
        // })
      }
    },
    handleClose(type) {
      if (type === 1 || type === 3 || this.timeType === 4) {
        var newData = new Date();
        var valueTime = this.$utils.dayjs(newData).format("YYYY-MM-DD HH:mm:ss");
      } else if (type === 2) {
        var valueTime =this.$utils.dayjs(this.valueTime).format("YYYY-MM-DD")
        valueTime = valueTime + " " + "00:00:00";
      }
      this.effectiveDate = valueTime;
      this.blurWarnNum(this.effectiveDate)
    },
    bzgs(array) {
      var arr = array.split("-");
      var str = "" + arr[0];
      for (let i = 1; i < arr.length; i++) {
        if (arr[i].split("").length == 1) {
          str = str + "-0" + arr[i];
        } else {
          str = str + "-" + arr[i];
        }
      }
      return str;
    },
    saveSetData(num) {
      var warnType = 0;
      if(!this.settingName){
        this.warnNumber = 1;
        return this.$message.warning("请输入设置名称");
      }
      var arrData = JSON.parse(JSON.stringify(this.creditRates));
      for (let i = 0; i < arrData.length; i++) {
        if (Number(arrData[i].minLines) >= Number(arrData[i].maxLines)) {
          this.$set(this.creditRates[i], "warn", true);
          warnType = 1;
        } else {
          this.$set(this.creditRates[i], "warn", false);
        }
      }
      if (warnType == 1) {
        return this.$message.error(
          "最大额度需要大于同等级别的最小额度，请重新输"
        );
      }
      if(!Boolean(this.overDueOrExcessLimit.excess) || !Boolean(this.overDueOrExcessLimit.overDue)){
        if(!Boolean(this.overDueOrExcessLimit.excess)){
          this.warnNumber = 5
        }else{
          this.warnNumber = 6
        }
        return this.$message.warning("请输入必填项");
      }
      if (
        !Boolean(this.otherSetting.overDueFeeRatio) ||
        !Boolean(this.otherSetting.temporaryQuotaPeriod)
      ) {
        if(!Boolean(this.otherSetting.temporaryQuotaPeriod)){
          this.warnNumber = 3
        }else{
          this.warnNumber = 2
        }
        return this.$message.warning("请输入必填项");
      }
      if(!Boolean(this.effectiveDate)){
        this.warnNumber = 4
        return this.$message.warning("请选择生效时间");
      }else{
        var effectiveDate = this.effectiveDate.split(" ")[0];
      }
      this.warnNumber = 0
      if (num === "1") {
        var obj2 = JSON.parse(JSON.stringify(this.overDueOrExcessLimit));
        if (obj2.overDueSettlementMethod === "") {
          obj2.overDueSettlementMethod = null;
        }
        if (obj2.excessSettlementMethod === "") {
          obj2.excessSettlementMethod = null;
        }
        var obj = {
          settingName:this.settingName,
          // id=this.id,
          // autoRelegationMechanism: this.autoRelegationMechanism,
          // createTime:this.createTime,
          // creditRatingRelegationMechanism: this.creditRatingRelegationMechanism
          //   ? this.creditRatingRelegationMechanism
          //   : 0,
          creditRates: this.creditRates,
          effectiveDate: effectiveDate,
          // status: status,
          settingName: this.settingName,
          otherSetting: this.otherSetting,
          overDueOrExcessLimit: obj2,
        };
        this.$http.post(this.$service.systemSetDate, obj).then((data) => {
          if (data.code == 200) {
            this.$message.success("新增设置成功");
            this.dialogVisible = false
            this.getSetPageList();
            // this.getSetData() // 重置数据
          } else {
            this.$message.error(data.message);
          }
        });
      } else {
      }
    },
    getSetData(data,type) {
      this.warnNumber = 0
      if(data){
        // this.autoRelegationMechanism = data.autoRelegationMechanism;
        this.creditRates = JSON.parse(JSON.stringify(data.creditRates));
        var arrData = JSON.parse(JSON.stringify(this.creditRates));
        for (let i = 0; i < arrData.length; i++) {
            this.$set(this.creditRates[i], "show", true);
        }
        // this.creditRatingRelegationMechanism =
        //   data.creditRatingRelegationMechanism;
        this.effectiveDate = data.effectiveDate;
        this.id = data.id;
        this.createTime = data.createTime;
        this.otherSetting = data.otherSetting;
        this.overDueOrExcessLimit = data.overDueOrExcessLimit;
        this.settingName = data.settingName;
        if(!type){
          // var d = new Date();
          // this.effectiveDate = this.$utils.dayjs(d).format("YYYY-MM-DD HH:mm:ss")
          this.effectiveDate = ''
          this.settingName = '';
        }

      }else{
        // this.autoRelegationMechanism = '';
        this.creditRates = [
        {
            "maxLines": null,
            "minLines": 1,
            "levelId": 5,
            "levelName": "E",
            'warn':false,
            'show':false,
        },
        {
            "maxLines": null,
            "minLines": null,
            "levelId": 4,
            "levelName": "D",
            'warn':false,
            'show':false,
        },
        {
            "levelId": 3,
            "minLines": null,
            "levelName": "C",
            "maxLines": null,
            'warn':false,
            'show':false,
        },
        {
            "levelName": "B",
            "maxLines": null,
            "minLines": null,
            "levelId": 2,
            'warn':false,
            'show':false,
        },
        {
            "levelId": 1,
            "maxLines": null,
            "minLines": null,
            "levelName": "A",
            'warn':false,
            'show':false,
        },];
        // this.creditRatingRelegationMechanism = 0;
        this.id = '';
        this.createTime = '';
        this.otherSetting = {
          "overDueFeeRatio": null, // 超期滞纳金比例 0.5% 每天
          "temporaryQuotaPeriod": null // 临时额度期限 单位：月
        };
        this.overDueOrExcessLimit = {
          "excess": null,  // 超额
          "excessSettlementMethod": '', // 超额结算方式
          "overDueSettlementMethod": '', // 超期结算方式
          "overDue": null // 超期
        };
        this.settingName = "";
        this.effectiveDate = ''
      }
    },
  },
};
</script>

<style scoped lang='less'>
.lineDiv{
  font-size: 16px;
  color: #333333;
  line-height:30px;
  margin: 9px 0;
  
}
.line_tip{

}
.line_input{
  width: 100%;
  min-height: 36px;
}
.line_input2{
  border: 1px solid #c0c4cc;
  display: flex;
  flex-direction: row;
  align-content: center;
  line-height: 40px;
  height: 36px;
}
/deep/ .line_input2 .el-input{
  border: 0;
  flex:1;
  height: 35px;
  line-height: 35px;
}
/deep/ .line_input2 .el-input .el-input__inner{
  border: 0 !important;
  height: 35px !important;
  line-height: 35px !important;
  font-size: 16px !important;
}
.line_input2 .fgx{
  width: 1px;
  height: 20px;
  background: #333333;
  margin: 10px 0px 0px 20px;
}
/deep/.buttonTop .el-tabs {
  background: #dbffb0;
}
/deep/.buttonTop .el-tabs .el-tabs__header {
  margin: 0;
  width: 100%;
}
/deep/.rTabTop .is-left {
  width: 100%;
}
/deep/.is-active {
  background: #169bd5;
  color: #ffffff;
}
.tittleTip {
  font-weight: 800;
}
button {
  height: 26px;
  line-height: 26px;
  text-align: center;
  padding: 0 4px;
  border: 1px solid black;
  border-radius: 5px;
  min-width: 70px;
}
.bottBule {
  color: white;
  background: rgba(22, 155, 213, 1);
}
.padd-r {
  margin-right: 10px;
}
.padd-l {
  margin-left: 0px;
}
.ridTittle {
  color: red;
  font-size: 16px;
  font-weight: 400;
}
.comButton {
  cursor: pointer;
  border: 1px solid black;
  border-radius: 2px;
  width: 40px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: rgb(0, 128, 255);
}
.lineBoxTipBlack {
  font-weight: 800;
}
.lineBoxTipBlue {
  font-weight: 800;
  color: #169bd5;
}
input {
  width: 50%;
  height: 24px;
  text-align: center;
}
.is-selected {
  color: #f3f6f9;
  background: #1989fa;
}
.is-selecteds {
  cursor: not-allowed;
  color: #c0c4cc;
}
/deep/ .current {
  height: 50px;
}
/deep/ .el-calendar-day {
  height: 50px;
  padding: 0;
}
/deep/ .el-dialog {
  min-width: 480px;
  border-radius: 6px;
}
.mcspan {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}
.tipBottom {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0px 40px 0px 0;
}
/deep/ .el-tabs__nav {
  border-bottom: 0 !important;
}
/deep/.buttonTopTab .el-tabs__nav .is-active {
  background: #ffffff;
  color: #1989fa;
}
button {
  cursor: pointer;
}
/deep/ .dialog-footer {
  // display: flex;
  // flex-direction: row;
  // justify-content: space-between;
  .el-button{
    width: 120px;
    height: 40px;
    font-size: 16px;
  }
  .el-button--primary {
    background: rgba(102, 152, 255, 1) !important;
    border: 0 ;
  }
}
/deep/ .warnClass {
  border: 1px red solid !important;
  // background: #e39ca4 !important;
  // color: #ffffff;
}
/deep/.el-table__body .el-table__row  td{
    text-align: center;
    border-right: 1px solid #fff !important;
    border-bottom: 1px solid #fff !important;
    background-color: #f2f2f2 !important;
    font-size: 16px;
}
/deep/ .el-table__body tr:hover>td {
  // background-color: #f2f2f2 !important;
}
.flexLineBox{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-around;
}
.noBorad{
  border: 0px !important;
}
.flexLineBox span{
  cursor: pointer;
  color: #169bd5;
  display: inline-block;
  width: 80px;
}
.classBlue{
  color: #169bd5;
}
/deep/.tableBody .el-table__header-wrapper .is-center{
  background: #aaaaaa;
  border-right: 1px solid #fff !important;
  border-bottom: 1px solid #fff !important;
  text-align: center;
  color:#333;
  font-size: 16px;
  font-weight: bold;
}
.fontRed{
  color: #d9001b;
}
.fontGreen{
  color: #04f91d;
}
/deep/ .main-container{
  background: #FFF;
}
.topButton{
  margin-top: 20px;
  margin-bottom: 20px;
  button{
    width: 120px;
    height: 40px;
    background: #169bd5;
    font-size: 18px;
    color: #fff !important;
    border:  0;
    border-radius: 0;
  }
}

.pictrue{
  box-sizing: border-box;
  position: relative;
  width: 24px;
  height: 24px;
  transform: rotate(45deg);
  overflow: hidden;
  margin: 6px;
}
.pictrue .item{
  box-sizing: border-box;
  // padding: 10px;
  position: absolute;
  width: 100%;
  height: 100%;
  content:" ";
  transform: rotate(-45deg);
  border: 2px solid #000;
  overflow: hidden;
  background-color: #fff;
} 
.pictrue .item:after{
  position: absolute;
  top: -2px;
  left: -2px;
  content:" ";
  width: 100%;
  height: 100%; 
  transform: rotate(135deg);
  border: 2px solid #000;
}
.pictrue .item:before{
  position: absolute;
  left: 0;
  top: 0; 
  box-sizing: border-box;
  content:" ";
  width: 100%;
  height: 100%;
  transform: rotate(135deg);
  border: 2px solid #fff;
}
.pictrue .item .img{
  position: absolute;
  width: 6px;
  height: 6px;
  border: 2px solid #00bbff;
  border-radius: 50%;
  top:5px;
  left:5px;
}
.tableBox {
  display: flex;
  width: 100%;
  flex-direction: column;
  border-top: 1px solid #fff;
  background: #f2f2f2;
  .tableLine {
    border-left: 1px solid #fff;
    height: 44px;
    width: 100%;
    display: flex;
    flex-direction: row;
    .tableItem {
      display: flex;
      flex-direction: row;
      width: 100%;
      // line-height: 30px;
      text-align: center;
      border-bottom: 1px solid #fff;
      border-right: 1px solid #fff;
      align-items: center;
      justify-content: center;
      input {
        background: #f2f2f2;
        border: 1px solid #9b9b9b;
      }
    }
    .tableItem1 {
      flex: 2;
    }
    .tableItem2 {
      flex: 3;
      input{
        height: 20px;
      }
    }
  }
  .tableLineTopH {
    background: #aaaaaa;
  }
}
.optionBox{
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  .lineDiv{
    width: 48%;
  }
}
.delDiaShowText{
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  line-height: 30px;
  padding: 20px 0;
}
</style>