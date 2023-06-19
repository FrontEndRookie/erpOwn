<template>
  <div class="content-wrapper">
    <div class="content">
      <!-- <div class="boxTop">
        <h1>系统自定义设置</h1>
        <p>除了自定义企业外，所有认证成功的企业都用这一套标准</p>
      </div> -->
      <div class="boxBotton">
        <div class="boxBottonLeft">
          <el-tabs
            class="rTabTop"
            tab-position="left"
            type="card"
            style="width: 100%"
          >
            <el-tab-pane
              style="width: 100%"
              v-for="(item, index) in tittles"
              :key="index"
              :label="item"
            ></el-tab-pane>
          </el-tabs>
        </div>
        
        <div class="boxBottonRight">
          <div
            class="felxTop"
            style="
              position: sticky;
              top: 0px;
              z-index: 999;
              transform: translateZ(0px);
            "
          >
            <div class="boxTop" style="background: #ffffff">
              <h1>配置</h1>
              <p>注意：除了自定义企业外，所有认证成功的企业都用这一套标准</p>
            </div>
            <div class="boxTop" style="background: #f3f6f9"></div>
            <div class="buttonTop">
              <el-tabs
                class="buttonTopTab"
                type="card"
                style="width: 50%"
                v-model="form.activeSet" @tab-click="getSetData(form.activeSet)"
              >
                <el-tab-pane label="基础设置" name="1"></el-tab-pane>
                <el-tab-pane v-if="false" label="审批流程" name="2"></el-tab-pane>
              </el-tabs>
              <div class="tipRow tipBottom">
                <button class="bottBule" style="border:0;" @click="saveSetData(form.activeSet)" v-auth="['656001_B']">保存当前{{form.activeSet=='1'?'基础设置':'审批流程'}}</button>
                <span class="redTip" style="width: 60px"></span>
                <button v-if="false" style="background: #ffffff">取消</button>
              </div>
            </div>
          </div>
          <div v-if="form.activeSet == '1'" class="aaa">
            <div class="tipRow tipRowFirst">
              <span class="redTip">*</span
              ><span class="tittleTip">本次基础设置生效日期：</span
              ><button class="comButton" style="background: #ffffff;" @click="dogShow = true">此刻</button>
              <el-dialog
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
            </div>
            <div class="tipRow">
              <!-- <span class="tittleTip">认证企业信用等级基础设置</span> -->
            </div>
            <div class="boxbody">
              <div class="boxbodyR boxbodyC">
                <div class="tableTittle tittleTip">信用等级额度范围设置</div>
                <div class="tableBox">
                  <div class="tableLine">
                    <div class="tableItem1 tableItem">
                      <span>信用等级</span>
                    </div>
                    <div class="tableItem2 tableItem">最小额度（元）</div>
                    <div class="tableItem2 tableItem">最大额度（元）</div>
                  </div>
                  <div class="tableLine" v-for="(item,index) in creditRates" :key="index">
                    <div class="tableItem1 tableItem"><span>{{item.levelName}}级</span></div>
                    <div class="tableItem2 tableItem">{{item.minLines}}</div>
                    <div style="position: relative;" class="tableItem2 tableItem">
                      <span class="redTip">*</span>
                      <input
                        :class="item.warn?'warnClass':''"
                        maxlength="8"
                         @input="
                          (item.maxLines = $utils.pureNumber(item.maxLines)),nextInput(index)"
                        v-model="item.maxLines"
                        @blur="blurInput(index)"
                        type="text"
                      />
                      <!-- <span v-if="index === 4">
                        不限制
                      </span> -->
                      <!-- <div style="position: absolute;bottom:-7px;left:-70px;color:red;width: 300px;" v-show="item.warn">最大额度需要大于同等级别的最小额度，请重新输入</div> -->
                    </div>
                  </div>
                </div>
              </div>
              <div class="boxbodyL boxbodyC">
                <div class="lineL">
                  <!-- <span class="redTip"></span> -->
                  <span class="tittleTip">信用等级降级机制</span>
                  <div style="margin-left: 20px">
                    <el-radio disabled="true" v-model="creditRatingRelegationMechanism" :label='1'
                      >开启</el-radio
                    >
                    <el-radio v-model="creditRatingRelegationMechanism" :label='0'
                      >关闭</el-radio
                    >
                  </div>
                </div>
                <!-- <div class="newLineRow">

                </div> -->
                <div class="lineL" style="align-items: flex-start">
                  <!-- <span class="redTip"></span> -->
                  <div class="lineChunk" style="margin-top: 14px">
                    <span class="tittleTip">自动降级条件设置</span>
                  </div>
                  <div class="lineChunk" style="margin-left: 20px">
                    <div class="lineL">
                      <span class="redTip">*</span>
                      <span class="tittleTip">超期票数：</span>
                      <div class="padd-r">
                        <el-select disabled="true"
                          v-model="form.timeValue1"
                          placeholder="请选择"
                          size="small"
                          style="width: 120px"
                        >
                          <el-option
                            v-for="item in timesArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          >
                          </el-option>
                        </el-select>
                      </div>
                      <el-input disabled="true" size="small" style="width: 100px"></el-input>&emsp;票
                    </div>
                    <div class="lineL">
                      <span class="redTip">*</span
                      ><span class="tittleTip">违规次数：</span>
                      <div class="padd-r">
                        <el-select disabled="true"
                          v-model="form.timeValue2"
                          placeholder="请选择"
                          size="small"
                          style="width: 120px"
                        >
                          <el-option
                            v-for="item in timesArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          >
                          </el-option>
                        </el-select>
                      </div>
                      <el-input disabled="true" size="small" style="width: 100px"></el-input>&emsp;次
                    </div>
                    <div class="ridTittle">注意：满足上述任意一种条件即可</div>
                  </div>
                  <div class="lineChunk" style="margin-left: 20px">
                    <div class="lineL">
                      <span class="redTip"></span
                      ><span class="tittleTip tittleTipw">降级后默认额度：</span>
                      <div class="padd-l">
                        <el-select disabled="true"
                          v-model="form.timeValue2"
                          placeholder="请选择"
                          size="small"
                          style="width: 222px"
                        >
                          <el-option
                            v-for="item in timesArr1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          >
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="lineL">
                      <span class="redTip"></span
                      ><span class="tittleTip tittleTipw">E级用户降级后：</span>
                      <div class="padd-l">
                        <el-select disabled="true"
                          v-model="form.timeValue2"
                          placeholder="请选择"
                          size="small"
                          style="width: 222px"
                        >
                          <el-option
                            v-for="item in timesArr2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          >
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="lineL">
                      <span class="redTip"></span
                      ><span class="tittleTip">付款买单用户降级后：</span>
                      <div class="padd-l">
                        <el-select disabled="true"
                          v-model="form.timeValue2"
                          placeholder="请选择"
                          size="small"
                          style="width: 202px"
                        >
                          <el-option
                            v-for="item in timesArr3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          >
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="tipRow">
              <span class="tittleTip">账期额度基础设置</span>
            </div> -->
            <div class="boxbody" style="border-bottom: 0;">
              <div class="boxbodyL boxbodyC">
                <div class="lineL">
                  <span class="tittleTip">超期/超额后限制</span>
                  <span class="redTip"  style="margin-left:14px"></span>
                  <span class="tittleTip">超期：</span>
                  <div class="padd-r">
                    <el-select
                      v-model="overDueOrExcessLimit.overDue"
                      @change="overDueOrExcessLimit.overDue == 3?overDueOrExcessLimit.overDueSettlementMethod='':overDueOrExcessLimit.overDueSettlementMethod=10"
                      placeholder="请选择"
                      size="small"
                      style="width: 200px"
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
                  <span class="redTip"></span>
                  <span class="tittleTip">超期后结算方式：</span>
                  <div class="padd-r">
                    <el-select
                    :disabled="overDueOrExcessLimit.overDue == 3"
                      v-model="overDueOrExcessLimit.overDueSettlementMethod"
                      placeholder="/"
                      size="small"
                      style="width: 120px"
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
                <div class="lineL">
                  <span class="tittleTip" style="color:#FFFFFF">超期/超额后限制</span>
                  <span class="redTip" style="margin-left:14px"></span>
                  <span class="tittleTip">超额：</span>
                  <div class="padd-r">
                    <el-select
                      v-model="overDueOrExcessLimit.excess"
                      placeholder="请选择"
                      size="small"
                      @change="overDueOrExcessLimit.excess == 3?overDueOrExcessLimit.excessSettlementMethod='':overDueOrExcessLimit.excessSettlementMethod=10"
                      style="width: 200px"
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
                  <span class="redTip"></span>
                  <span class="tittleTip">超额后结算方式：</span>
                  <div class="padd-r">
                    <el-select
                    :disabled="overDueOrExcessLimit.excess == 3"
                      v-model="overDueOrExcessLimit.excessSettlementMethod"
                       placeholder="/"
                      size="small"
                      style="width: 120px"
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
                
              </div>
              <div class="boxbody" style="border-top: 1px solid black;border-bottom: 0">
                <div class="boxbodyL boxbodyC">
                  <div class="lineL">
                    <span class="tittleTip">其他基础设置</span>
                    <span class="redTip" style="margin-left:27px"></span>
                    <span class="redTip">*</span>
                    <span class="tittleTip">超期滞纳金比例：</span>
                    <el-input size="small" v-model="otherSetting.overDueFeeRatio" @input="otherSetting.overDueFeeRatio = $utils.clearNoNum(otherSetting.overDueFeeRatio,2)"  style="width: 100px;margin:0 10px 0 0"></el-input
                    ><span class="tittleTip">%/每天</span>
                    <span class="redTip" style="width:40px"></span>
                    <span class="tittleTip">临时额度期限：</span>
                    <div class="padd-r">
                      <el-select
                        v-model="otherSetting.temporaryQuotaPeriod"
                        placeholder="请选择"
                        size="small"
                        style="width: 80px;margin:0  0 0 0px"
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
                    <span class="tittleTip">个月</span>
                  </div>
                  <!-- <div class="lineL">
                    <span class="redTip"></span>
                    <span class="ridTittle" style="width: 240px"
                      >占单票应收金额的百分比</span
                    >
                    <span class="ridTittle" style="width: 300px"
                      >从设置临时额度的时刻算起</span
                    >
                  </div> -->
                </div>
              </div>
            </div>
            <!-- <div class="tipRow tipBottom">
                <button class="bottBule">保存当前设置</button>
                <span class="redTip" style="width:60px"></span>
                <button> 取消</button>
            </div> -->
          </div>
          <div v-if="form.activeSet == '2'" class="aaa">
            <div class="tipRow">
              <span class="tittleTip">审批流程</span>
            </div>
            <div class="boxbody" style="border-bottom:0;">
              <div class="boxbodyL boxbodyC">
                <div class="lineL">
                  <el-tabs
                    v-model="activeName"
                    type="card"
                    @tab-click="handleClick"
                    style="width: 100%"
                  >
                    <el-tab-pane
                      label="订单解锁审批"
                      name="first"
                    ></el-tab-pane>
                    <el-tab-pane label="XX审批" name="second"></el-tab-pane>
                  </el-tabs>
                </div>
                <div class="lineBox">
                  <div class="lineBoxitem">
                    <span class="lineBoxTipBlack">环节1：发起流程</span>
                    <span class="redTip"></span>
                    <span class="lineBoxTipBlue">添加下一环节</span>
                    <span class="redTip"></span>
                    <span class="lineBoxTipBlue">删除</span>
                  </div>
                  <div class="lineBoxitem">
                    <span class="lineBoxTipBlack">此环节申请人：</span>
                    <div class="block">
                      <el-cascader
                        size="mini"
                        style="width: 100px"
                        v-model="value"
                        :options="options"
                        :props="{ expandTrigger: 'hover' }"
                        @change="handleChange"
                      ></el-cascader>
                    </div>
                    <span class="redTip"></span>
                    <span class="lineBoxTipBlue"
                      >流向下一环节条件1：订单应收总金额 ≥</span
                    >
                    <input size="small" style="width: 100px" />元
                  </div>
                  <div class="lineBoxitem">
                    <span class="lineBoxTipBlack">此环节抄送人：</span>
                    <div class="block">
                      <el-cascader
                        size="mini"
                        style="width: 100px"
                        v-model="value"
                        :options="options"
                        :props="{ expandTrigger: 'hover' }"
                        @change="handleChange"
                      ></el-cascader>
                    </div>
                    <span class="redTip"></span>
                    <span class="lineBoxTipBlue">流向下一环节条件2:</span>
                    <div class="padd-r">
                      <el-select
                        v-model="form.timeValue2"
                        placeholder="请选择"
                        size="mini"
                        style="width: 80px"
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
                </div>
                <div class="lineL">
                  <span class="lineBoxTipBlue">结束流程</span>
                  <span class="redTip"></span>
                  <span class="tittleTip">结束流程抄送</span>
                  <span class="redTip"></span>
                  <div class="block">
                    <el-cascader
                      size="mini"
                      style="width: 100px"
                      v-model="value"
                      :options="options"
                      :props="{ expandTrigger: 'hover' }"
                      @change="handleChange"
                    ></el-cascader>
                  </div>
                </div>
                <!-- <div class="lineL">
                  <button class="bottBule">保存当前设置</button>
                  <span class="redTip" style="width: 60px"></span>
                  <button>取消</button>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      creditRates:[
        {
            "maxLines": null,
            "minLines": 1,
            "levelId": 5,
            "levelName": "E",
            'warn':false
        },
        {
            "maxLines": null,
            "minLines": null,
            "levelId": 4,
            "levelName": "D",
            'warn':false
        },
        {
            "levelId": 3,
            "minLines": null,
            "levelName": "C",
            "maxLines": null,
            'warn':false
        },
        {
            "levelName": "B",
            "maxLines": null,
            "minLines": null,
            "levelId": 2,
            'warn':false
        },
        {
            "levelId": 1,
            "maxLines": null,
            "minLines": null,
            "levelName": "A",
            'warn':false
        },],
      bumberJ: 0,
      bumber: "",
      oldData: "",
      valueTime: new Date(),
      effectiveDate: '', // 开始生效时间
      dogShow: false,
      creditRatingRelegationMechanism: 0, // 信用等级降级机制 1-开启 0-关闭
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
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" },
        { value: 4, label: "4" },
        { value: 5, label: "5" },
        { value: 6, label: "6" },
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
      autoRelegationMechanism: "enim exercitation",
      timeType:0,
      settingName:'',
      id:'',
      createTime:'',
    };
  },
  created() {},
  mounted(){
    this.getSetData('1')
  },
  beforeMount() {
    var d = this.valueTime; //转换时间戳
    // this.effectiveDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    // var year = d.getFullYear()
    // var moth = d.getMonth() + 1
    // var day = d.getDate()
    this.valueTime = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  },
  watch: {
    valueTime: {
      handler(newName, oldName) {
        this.calendarChang(newName, oldName);
      },
      immediate: true,
    },
  },
  computed: {},
  methods: {
    openDia(){
      this.valueTime = this.effectiveDate;
    },
    nextInput(index){
      if(Number(index) < 4 && Number(this.creditRates[index].maxLines)!=0){
        this.creditRates[Number(index)+1].minLines = Number(this.creditRates[index].maxLines)+1
      }
    },
    blurInput(index){
      if(Number(this.creditRates[index].maxLines) === 0 || Number(this.creditRates[index].maxLines) === '' || Number(this.creditRates[index].maxLines) === null){
        var arrData = JSON.parse(JSON.stringify(this.creditRates))
        for (let i = index; i < arrData.length; i++) {
          if(i == index){
            this.$set(this.creditRates[i],'maxLines','')
            this.$set(this.creditRates[i],'warn',false)
          }
          // else if(i == 4){
          //   this.$set(this.creditRates[i],'minLines','')
          //   this.$set(this.creditRates[i],'maxLines','不限制')
          // }
          else{
            this.$set(this.creditRates[i],'minLines','')
            this.$set(this.creditRates[i],'maxLines','')
            this.$set(this.creditRates[i],'warn',false)
          }
        }
      }
      if(this.creditRates[Number(index)].minLines >= Number(this.creditRates[index].maxLines)){
        this.$set(this.creditRates[Number(index)],'warn',true)
        this.$message.warning("最大额度需要大于同等级别的最小额度，请重新输入")
        // this.creditRates[Number(index)].warn = true
      }else{
        this.$set(this.creditRates[Number(index)],'warn',false)
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
      if(valueTime == cc){
        this.timeType = 4
      }else{
        this.timeType = 0
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
    handleClose(type){
      if(type === 1 || type === 3 || this.timeType === 4){
        var newData = new Date();
        var valueTime =
        newData.getFullYear() +
        "-" +
        (newData.getMonth() + 1) +
        "-" +
        newData.getDate() + ' ' + newData.getHours() + ':' + newData.getMinutes() + ':' + newData.getSeconds()
      }else if(type === 2){
        var valueTime = this.valueTime.getFullYear() +
        "-" +
        (this.valueTime.getMonth() + 1) +
        "-" +
        this.valueTime.getDate()
        valueTime =  valueTime + ' ' + '00:00:00'
      }
      this.effectiveDate = valueTime
    },
    //   allcalendar(newdata) {
    //         var newValue = newdata.day
    //         newdata= new Date(newdata.day)
    //         var newData = new Date()
    //         var valueTime =newData.getFullYear() + '-' + (newData.getMonth() + 1) + '-' + newData.getDate()
    //         if(newdata<newData){
    //           setTimeout(()=>{
    //             this.valueTime = valueTime
    //           })
    //         }else{
    //           this.valueTime = newValue
    //         }
    //         // var chooseData = new Date(this.valueTime)
    //         //需要用到这日期做啥事，比如做为调接口的参数
    //         // loading.close();
    //         // console.log(this.valueTime);
    //         // var d = new Date(this.valueTime)
    //         // this.valueTi.year = d.getFullYear()
    //         // this.valueTi.moth = d.getMonth() + 1
    //         // this.valueTi.day = d.getDate()
    //         // this.timeValue = this.valueTime
    //     },
    bzgs(array){
      var arr = array.split('-')
      var str = ''+arr[0]
      for(let i=1; i<arr.length; i++){
        if(arr[i].split('').length == 1){
          str = str +"-0" + arr[i]
        }else{
          str = str +"-" + arr[i]
        }
      }
      return str
    },
    saveSetData(num){
      var warnType = 0
      var arrData = JSON.parse(JSON.stringify(this.creditRates))
      for (let i = 0; i < arrData.length; i++) {
        if(Number(arrData[i].minLines) >= Number(arrData[i].maxLines)){
          this.$set(this.creditRates[i],'warn',true)
          warnType = 1
        }else{
          this.$set(this.creditRates[i],'warn',false)
        }
      }
      if(warnType == 1){
        return this.$message.error('最大额度需要大于同等级别的最小额度，请重新输')
      }
      if( this.otherSetting.overDueFeeRatio == '' || this.otherSetting.temporaryQuotaPeriod == ''){
        return this.$message.warning('请输入必填项')
      }
      var d = new Date();
      var todayYN =  d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      var todaySet = this.effectiveDate.split(' ')[0]
      var status = 0
      if(todayYN == todaySet){
        // this.effectiveDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
        var effectiveDate = todayYN 
        var status = 1
      }else{
        var effectiveDate = todaySet 
      }
      effectiveDate = this.bzgs(effectiveDate)
      if(num === '1'){
        var obj2 = JSON.parse(JSON.stringify(this.overDueOrExcessLimit))
        if(obj2.overDueSettlementMethod === ''){
          obj2.overDueSettlementMethod = null
        }
        if(obj2.excessSettlementMethod === ''){
          obj2.excessSettlementMethod = null
        }
        var obj = {
          autoRelegationMechanism:this.autoRelegationMechanism,
          // createTime:this.createTime,
          creditRates:this.creditRates,
          creditRatingRelegationMechanism:this.creditRatingRelegationMechanism?this.creditRatingRelegationMechanism:0,
          effectiveDate:effectiveDate,
          // id:this.id, // 保存不需要id更新需要id
          status:status,
          settingName:this.settingName,
          otherSetting:this.otherSetting,
          overDueOrExcessLimit:obj2,
        }
        this.$http.post(this.$service.systemSetDate,obj).then(data => {
          if (data.code == 200) {
            this.$message.success('保存成功')
            this.getSetData('1')
          }else{
            this.$message.error(data.message)
          }
        })
      }else{

      }
    },
    getSetData(num){
      if(num === '1'){
        this.$http.get(this.$service.systemSGetDate).then(data => {
          if (data.code == 200) {
            this.autoRelegationMechanism = data.data.autoRelegationMechanism
            this.creditRates = data.data.creditRates
            this.creditRatingRelegationMechanism = data.data.creditRatingRelegationMechanism
            this.effectiveDate = data.data.effectiveDate
            this.id = data.data.id
            this.createTime = data.data.createTime
            this.otherSetting = data.data.otherSetting
            this.overDueOrExcessLimit = data.data.overDueOrExcessLimit
            this.settingName = data.data.settingName
            var d = new Date();
            this.effectiveDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
          }else{
            this.$message.error(data.message)
          }
        })
      }else{

      }
    }
  },
};
</script>

<style scoped lang='less'>
.content-wrapper {
  width: 100%;
  height: 100%;
  padding: 20px;
  //   overflow: scroll;
  .content {
    display: flex;
    flex-direction: column;
    // border: 1px solid black;
    width: 83%;
    height: 95%;
    // border-radius: 10px;
    margin-left: 30px;
    // padding: 20px;
    // overflow: scroll;
    .boxBotton {
      flex: 1;
      display: flex;
      flex-direction: row;
      padding: 2px 0 2px 0;
      overflow: scroll; //
      background-color: #f3f6f9;
      .boxBottonLeft {
        background: #ffffff;
        display: flex;
        margin-right: 2px;
        flex-direction: column;
        width: 150px;
        height: 100%-2px;
        // border: 1px solid black;
        margin-right: 20px;
        // -moz-box-shadow: 5px 5px 5px #888888; /* 老的 Firefox */
        // box-shadow: 5px 5px 5px #888888;
        // padding-right: 20px;
      }
      .boxBottonRight {
        width: calc(100% - 240px);
        display: flex;
        background: #ffffff;
        flex-direction: column;
        height: 100%-2px;
        // border: 1px solid black;
        // border-radius: 10px;
        // padding: 0 20px;
        // -moz-box-shadow: 5px 5px 5px #888888; /* 老的 Firefox */
        // box-shadow: 5px 5px 5px #888888;
        .boxTop {
          display: flex;
          width: 100%;
          padding: 10px 0;
          // border-bottom: 1px solid black;
          align-items: center;
          h1 {
            font-size: 14px;
            font-weight: 1000;
          }
          p {
            display: inline-block;
            padding-left: 20px;
            color: #d9001b;
            font-weight: 700;
          }
        }
        .buttonTop {
          display: flex;
          flex-direction: row;
          width: 100%;
          background: #dbffb0;
        }
        .aaa {
          overflow-y: scroll;
          padding: 0 20px;
          .tipRow {
            display: flex;
            flex-direction: row;
            // height: 30px;
            margin: 5px 0;
            align-items: center;
          }
          .tipRowFirst {
            padding: 10px 0;
            border-bottom: 1px black solid;
          }
          .boxbody {
            // overflow: scroll;
            display: flex;
            flex-direction: column;
            width: 100%;
            padding: 1px;
            border-bottom: 1px solid black;
            // border-radius: 10px;
            .boxbodyC {
              padding: 10px 0;
              display: flex;
              flex-direction: column;
              // flex: 1;
              width: 100%;
              .tableTittle {
              }
              .tableBox {
                display: flex;
                width: 50%;
                flex-direction: column;
                height: 200px;
                margin-left: 20px;
                border-top: 1px solid black;
                .tableLine {
                  border-left: 1px solid black;
                  height: 40px;
                  width: 100%;
                  display: flex;
                  flex-direction: row;
                  .tableItem {
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    // line-height: 30px;
                    text-align: center;
                    border-bottom: 1px solid black;
                    border-right: 1px solid black;
                    align-items: center;
                    justify-content: center;
                    input {
                      border: 1px solid rgb(155, 155, 155);
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
              }
            }
            .lineL {
              display: flex;
              flex-direction: row;
              align-items: center;
              padding: 4px 0;

              .tittleTipw {
                display: inline-block;
                width: 100px;
              }
            }
            .lineBox {
              padding: 10px 0;
              width: 100%;
              border-bottom: 1px solid black;
              // border-radius: 10px;
              display: flex;
              flex-direction: column;
              .lineBoxitem {
                padding: 5px 0;
                margin-left: 10px;
                display: flex;
                flex-direction: row;
                align-items: center;
                // justify-content: center;
              }
            }
          }
        }
      }
    }
  }
}
/deep/ .rTabTop .el-tabs__item {
  padding: 0;
  text-align: center !important;
  border: 0 !important;
}
.boxbodyR {
  flex-direction: row !important;
}
.redTip {
  display: inline-block;
  width: 16px;
  font-size: 16px;
  color: red;
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
  color: #C0C4CC;
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
  align-items:center;
  padding: 0px 40px 0px 0;
}
/deep/ .el-tabs__nav{
  border-bottom: 0 !important;
}
/deep/.buttonTopTab .el-tabs__nav .is-active {
  background: #ffffff;
  color: #1989fa;
}
button{
  cursor: pointer;
}
/deep/ .dialog-footer{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
/deep/ .warnClass{
  background: #df5d6c !important;
  color: #FFFFFF;
}
//    /deep/ el-input{
//        width: 100px  !important;
//    }
</style>