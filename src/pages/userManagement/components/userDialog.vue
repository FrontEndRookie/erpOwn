<template>
  <div>
    <el-dialog
      title="选择时间"
      :visible="dogShow == 1 ? true : false"
      width="600px"
      @open="handleOpen()"
      @close="handleClose(1)"
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
      <span slot="footer" class="dialog-footer" style="display: flex;flex-direction: row;justify-content: space-between;">
        <el-button @click="handleClose(3)">此刻</el-button>
        <el-button type="primary" @click="handleClose(2)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      class="statusClass"
      :title="routerName != 'userOrderManagement'?'账期额度变更记录':'订单状态变更记录'"
      :visible="diaogType == 2 ? true : false"
      width="700px"
      @close="changeDialogVisible(10)"
      :close-on-click-modal="false"
    >
      <div
        class="dialog-body"
        style="height: 400px; overflow: scroll; padding: 40px 20px"
      >
        <el-timeline>
          <el-timeline-item v-for="(item,index) in hostoryArr" :key="index" :timestamp="item.createTime" placement="top">
            <el-card>
              <h4 style="line-height: 30px;font-weight: 600;font-size: 17px;">{{item.sysName}}</h4>
              <p style="line-height: 20px;" v-html="(item.content).replace(/\n/g,'<br />')"></p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑"
      @open="''"
      :visible="diaogType == 1 ? true : false"
      class="bianjiDia"
      width="800px"
      @close="changeDialogVisible(10)"
      :close-on-click-modal="false"
    >
      <dev class="dialog-body">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <!-- <el-tab-pane label="用户管理" name="first"> -->
            <div class="boxboby">
              <div class="lineL">
                <span class="redTip">*</span>
                <span class="tittleTip">本次账期额度生效日期：</span>
                <button class="comButton" @click="changeDialogS(1)">
                  此刻
                </button>
              </div>
              <div class="lineL">
                <span class="redTip">*</span>
                <span class="tittleTip">结算方式：</span>
                <el-radio-group v-model="payWay" @change='payChange'>
                  <el-radio :label="0">付款买单</el-radio>
                  <el-radio :label="1">月结买单</el-radio>
                  <el-radio :label="2">固定天数</el-radio>
                </el-radio-group>
              </div>
              <div class="lineL">
                <span class="redTip">*</span>
                <span class="tittleTip">结算账期：</span>
                <input v-show="payWay === 2 || payWay === 0"
                  class="lineInput"
                  :disabled = 'payWay === 0'
                    :placeholder="payWay === 2?'':'/'"
                  maxlength="3"
                  @input="
                    accountingPeriod = $utils.pureNumber(accountingPeriod,5)
                  "
                  @blur="
                    accountingPeriod = $utils.pureNumber(accountingPeriod,5)
                  "
                  v-model="accountingPeriod"
                  type="text"
                />
                <el-select
                  v-show="payWay === 1"
                  v-model="accountingPeriod"
                  placeholder="请选择"
                  size="mini"
                  style="width: 102px; margin-right: 16px"
                >
                  <el-option
                    v-for="item in ['15','30','45','60']"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
                <span class="tittleTip">天</span>
              </div>
              <div class="lineL">
                <span class="redTip">*</span>
                <span class="tittleTip">客户等级：</span>
                <el-select
                  class="khdj" :disabled="payWay === 0"
                  v-model="creditGrade"
                  @change="changMoney(creditGrade)"
                  placeholder="/"
                  size="mini"
                  style="width: 100px; margin-right: 16px;text-align: center;"
                >
                  <el-option
                    v-for="item in styleArr1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <span class="tittleTip">级</span>
                <span class="redTip" style="width: 30px"></span>
                <span class="redTip">*</span>
                <span class="tittleTip">授信额度：</span>
                <input
                  class="lineInput"
                  :disabled="payWay === 0"
                  maxlength="8"
                  :placeholder="payWay === 0?'/':''"
                  @input="quota = $utils.pureNumber(quota,5)"
                  @blur="quota = $utils.pureNumber(quota,5)"
                  v-model="quota"
                  type="text"
                />
                <span class="tittleTip">元</span>
              </div>
              <div v-if="!(tittleBody == '' || tittleBody == null)" class="lineL" style="display:flex;flex-direction: row;">
                <span class="redTip"></span>
                <span  class="tittleTip" style="width:auto;color: #d9001b; font-size: 14px">{{tittleBody}}</span>
              </div>
              <div class="lineL">
                <span class="redTip"></span>
                <span class="tittleTip">临时额度：</span>
                <input
                  class="lineInput"
                  maxlength="8"
                  @input="poraryQuota = $utils.pureNumber(poraryQuota,5)"
                  @blur="poraryQuota = $utils.pureNumber(poraryQuota,5)" 
                  v-model="poraryQuota"
                  type="text"
                />
                <span class="tittleTip">元</span>
                <span class="redTip" style="width: 30px"></span>
                <span class="tittleTip">临时额度生效时间：</span>
                <el-date-picker
                  size="mini"
                  v-model="form.valueTimeStart"
                  type="date"
                  format="yyyy-MM-dd"
                  @change = 'timeChange(form.valueTimeStart,Number(otherSetting.temporaryQuotaPeriod))'
                  style="width:140px"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                  placeholder="选择日期">
                </el-date-picker>
                ——
                <el-date-picker
                  size="mini"
                  disabled="true"
                  style="width:140px"
                  v-model="form.valueTimeEnd"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
                <!-- <el-date-picker
                  v-model="form.valueTime"
                  type="daterange"
                  size="mini"
                  range-separator="——"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 300px"
                >
                </el-date-picker> -->
                <!-- <span class="tittleTip">元</span> -->
              </div>
              <div class="lineL">
                <span class="redTip"></span>
                <span class="tittleTip" style="color: #d9001b; font-size: 14px"
                  >注意：临时额度和临时额度期生效时间必须同时填写，否则不能生效</span
                >
              </div>
              <div class="lineL">
                <span class="redTip">*</span>
                <span class="tittleTip">超额/超期后限制：</span>
                <el-radio-group @change="userSet(overDueOrExcessLimitStrategy)" v-model="overDueOrExcessLimitStrategy">
                  <el-radio :label="1">使用基础设置</el-radio>
                  <el-radio :label="2">自定义</el-radio>
                </el-radio-group>
              </div>
              <div class="lineL">
                <span class="redTip"></span>
                <span class="tittleTip">超期：</span>
                <el-select
                  :disabled="overDueOrExcessLimitStrategy === 1"
                  @change="overDueOrExcessLimit.overDue == 3?overDueOrExcessLimit.overDueSettlementMethod='':overDueOrExcessLimit.overDueSettlementMethod=10"
                  v-model="overDueOrExcessLimit.overDue"
                  placeholder="请选择"
                  size="mini"
                  style="width: 160px; margin-right: 16px"
                >
                  <el-option
                    v-for="item in styleArr2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <span class="redTip" style="width: 43px"></span>
                <span class="tittleTip">超期后结算方式：</span>
                <el-select
                  :disabled="overDueOrExcessLimitStrategy === 1 || overDueOrExcessLimit.overDue === 3"
                  v-model="overDueOrExcessLimit.overDueSettlementMethod"
                  placeholder="/"
                  size="mini"
                  style="width: 100px; margin-right: 16px"
                >
                  <el-option
                    v-for="item in styleArr3"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="lineL">
                <span class="redTip"></span>
                <span class="tittleTip">超额：</span>
                <el-select
                  :disabled="overDueOrExcessLimitStrategy === 1"
                  v-model="overDueOrExcessLimit.excess"
                  @change="overDueOrExcessLimit.excess == 3?overDueOrExcessLimit.excessSettlementMethod='':overDueOrExcessLimit.excessSettlementMethod=10"
                  placeholder="请选择"
                  size="mini"
                  style="width: 160px; margin-right: 16px"
                >
                  <el-option
                    v-for="item in styleArr2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <span class="redTip" style="width: 43px"></span>
                <span class="tittleTip">超额后结算方式：</span>
                <el-select
                  :disabled="overDueOrExcessLimitStrategy === 1 || overDueOrExcessLimit.excess === 3"
                  v-model="overDueOrExcessLimit.excessSettlementMethod"
                  placeholder="/"
                  size="mini"
                  style="width: 100px; margin-right: 16px"
                >
                  <el-option
                    v-for="item in styleArr3"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="lineL">
                <span class="redTip"> {{overDueOrExcessLimitStrategy === 2?'*':''}} </span>
                <span class="tittleTip">超期滞纳金比例：</span>
                <input
                class="lineInput"
                  :disabled="overDueOrExcessLimitStrategy === 1"
                  maxlength="8"
                  style="width: 50px"
                  @input="otherSetting.overDueFeeRatio = $utils.clearNoNum(otherSetting.overDueFeeRatio,2)"
                  v-model="otherSetting.overDueFeeRatio"
                  type="text"
                />
                <span class="tittleTip">%每天</span>
                <span class="redTip" style="width: 43px"></span>
                <span class="tittleTip">临时额度期限：</span>
                <el-select
                  :disabled="overDueOrExcessLimitStrategy === 1"
                  v-model="otherSetting.temporaryQuotaPeriod"
                  @change="timeChange(form.valueTimeStart,Number(otherSetting.temporaryQuotaPeriod))"
                  placeholder="请选择"
                  size="mini"
                  style="width: 100px; margin-right: 16px"
                >
                  <el-option
                    v-for="item in styleArr4"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <span class="tittleTip">月</span>
              </div>
              <div class="lineL">
                <span class="redTip"></span>
                <span class="tittleTip" style="color: #d9001b; font-size: 14px"
                  >注意：超期滞纳金 =
                  单票应收金额*超期滞纳金比例*单票逾期天数</span
                >
              </div>
            </div>
          <!-- </el-tab-pane> -->
          <el-tab-pane label="配置管理" v-if="false" :disabled="true" name="second">
            <div class="boxboby">
              <div class="lineL">
                <span class="redTip"></span>
                <span class="tittleTip">认证企业：</span>
                <span class="tittleTip">{{ companyName }}</span>
              </div>
              <div class="lineL">
                <span class="redTip">*</span>
                <span class="tittleTip">企业信用代码：</span>
                <span class="tittleTip">{{ creditCode }}</span>
              </div>
              <div class="lineL">
                <span class="redTip">*</span>
                <span class="tittleTip">绑定售前客服：</span>
                <el-select
                  v-model="pscsId"
                  placeholder="请选择"
                  size="mini"
                  style="width: 200px; margin-right: 16px"
                >
                  <el-option
                    v-for="item in pcscArray"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="lineL" >
                <span class="redTip">*</span>
                <span class="tittleTip">企业联系人电话：</span>
                <input
                  maxlength="11"
                  style="width: 184px"
                  @input="userTel = $utils.pureNumber(userTel,5)"
                  @blur="userTel = $utils.pureNumber(userTel,5)"
                  v-model="userTel"
                  type="text"
                />
              </div>
              <div class="lineL">
                <span class="redTip">*</span>
                <span class="tittleTip">企业联系人邮箱：</span>
                <input
                  maxlength="8"
                  style="width: 184px"
                  v-model="userEmail"
                  type="text"
                />
              </div>
              <!-- <div class="lineL">
                <span class="redTip">*</span>
                <span class="tittleTip">企业联系人QQ号：</span>
                <input
                  maxlength="8"
                  style="width: 177px"
                  v-model="userEmail"
                  type="text"
                />
              </div> -->
            </div>
          </el-tab-pane>
        </el-tabs>
      </dev>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="changeDialogVisible(2, false)"> 取消 </el-button>
        <el-button type="primary" @click="changeDialogVisible(2, true)"
          >保存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ['userObj'],
  data() {
    return {
      tittleBody:'',
      pickerOptions: {
    　　disabledDate(v) {
          return v.getTime() < new Date().getTime() - 86400000;
        }
    　},
      oldObj:{},
      hostoryArr:[],
      pcscArray: [],
      valueTime: new Date(),
      dogShow: "",
      diaogType: "",

      overDueOrExcessLimit: {
        excess: 1, // 超额
        excessSettlementMethod: 10, // 超额结算方式
        overDueSettlementMethod: 10, // 超期结算方式
        overDue: 1, // 超期
      },
      otherSetting: {
        overDueFeeRatio: null, // 超期滞纳金比例 0.5% 每天
        temporaryQuotaPeriod: 1, // 临时额度期限 单位：月
      },
      id: "",
      money:{
        minMoney:'',
        maxMoney:'',
      },
      routerName:'',
      creditRates:[],
      effectiveDate: new Date(), //开始生效时间
      userTel: "", //企业联系人电话
      userEmail: "", //邮箱
      companyName: "", //企业名称
      creditCode: "", //信用代码
      pscsName: "", // 售前客服名称
      pscsId: "", // 售前客服id
      overDueOrExcessLimitStrategy: 1, //是否自定义配置 1-否 2-是
      poraryQuota: "", // 临时额度
      quota: "", // 授信额度
      creditGrade: "", // 客户等级
      accountingPeriod: "", //结算账期
      payWay: 0, //结算方式 0：付款买单 1：月结买单 2-固定时间
      activeName: "first",
      settingName:'',
      form: {
        valueTimeStart: "",
        valueTimeEnd: "",
      },
      styleArr1: [
        { value: 5, label: "E" },
        { value: 4, label: "D" },
        { value: 3, label: "C" },
        { value: 2, label: "B" },
        { value: 1, label: "A" },
        // { value: 0, label: "/" },
      ],
      styleArr2: [
        { value: 1, label: "可下单，不做限制" },
        { value: 2, label: "可下单，订单冻结需要审批" },
        { value: 3, label: "不可下单" },
      ],
      styleArr3: [
        // { value: 0, label: "/" },
        { value: 10, label: "不做限制" },
        { value: 0, label: "付款买单" },
      ],
      styleArr4: [
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" },
        { value: 4, label: "4" },
        { value: 5, label: "5" },
        { value: 6, label: "6" },
      ],
    };
  },
  beforeMount() {
    // console.log(this.diaogType, this.$store.state.userManageType);
    // this.diaogType = this.$store.state.userManageType
  },
  mounted() {
    this.routerName = this.$route.path.slice(
      this.$route.path.lastIndexOf("/") + 1
    );
    // console.log(this.routerName);//customerManagementMasterList//orderManagement
    this.$http
      .get(this.$service.userSearchNoAuth + "?roleName=售前客服&pageSize=50000")
      .then((data) => {
        this.pcscArray = data.data.records;
      });
    if (!this.$utils.authCheckDisabled(['654004_B'])) {
      this.userSet(1)
    }
  },
  computed: {
    isEdit2() {
      return this.$store.state.dogShowZ; //需要监听的数据
    },
    isEdit() {
      return this.$store.state.userManageType; //需要监听的数据
    },

  },
  watch: {
    isEdit(newVal, oldVal) {
      this.diaogType = newVal;
    },
    isEdit2(newVal, oldVal) {
      this.dogShow = newVal;
    },
    userObj:{
      handler(newVal, oldVal){
        // console.log('监听',newVal);
        this.changObj(newVal);
      },
      immediate: true,
      deep: true
    },
    valueTime: {
      handler(newName, oldName) {
        // console.log('zz'+newName);
        this.calendarChang(newName, oldName);
      },
      immediate: true,
    },
  },
  methods: {
    // 改变额度范围
    changMoney(index){
      for (let i = 0; i < this.creditRates.length; i++) {
              if(this.creditRates[i].levelId == index){
                this.money.minMoney = this.creditRates[i].minLines
                this.money.maxMoney = this.creditRates[i].maxLines
              }
            }
        if(this.payWay === 0){
          this.tittleBody = ''
        }else{
          this.tittleBody = '注意：'+this.DJ(this.creditGrade)+'级的授信额度范围为'+this.money.minMoney+'元~'+this.money.maxMoney+'元'
        }
    },
    // 付款方式带来改变
    payChange(){
      // console.log(this.payWay,this.creditGrade);
      if(this.payWay === 0){
        this.accountingPeriod = ""
        this.creditGrade=''
        this.quota = ''
        this.tittleBody = ''
      }else if(this.payWay === 1){
        if(this.creditGrade === '' || this.creditGrade === null){
          this.creditGrade=5
        }
        this.accountingPeriod = '15'
        this.changMoney(this.creditGrade)
      }else{
        this.accountingPeriod = ''
        if(this.creditGrade === '' || this.creditGrade === null){
          this.creditGrade=5
        }
        this.changMoney(this.creditGrade)
      }
    },
    // 获取等级
    DJ(num){
      for (let i = 0; i < this.styleArr1.length; i++) {
        if(this.styleArr1[i].value == num){
          return this.styleArr1[i].label
        }
      }
    },
    // 获取基础设置
    userSet(type){
      if(type == 1){
        if(this.routerName != 'userOrderManagement'){
          this.$http.get(this.$service.systemSGetDate).then(data => {
            if (data.code == 200) {
              // this.id = data.data.id
              // this.createTime = data.data.createTime
              this.creditRates = data.data.creditRates   // 额度范围
              this.otherSetting = data.data.otherSetting  // 超期滞纳金比例 数组
              this.overDueOrExcessLimit = data.data.overDueOrExcessLimit // 超额 超期 数组
              this.settingName = data.data.settingName  // 
            }else{
              this.$message.error(data.message)
            }
          }).catch((e) => {
            console.log(e)
          })
        }
      }else{
        // this.overDueOrExcessLimit = {
        //   excess: 1, // 超额
        //   excessSettlementMethod: 10, // 超额结算方式
        //   overDueSettlementMethod: 10, // 超期结算方式
        //   overDue: 1, // 超期
        // }
        // this.otherSetting = {
        //   overDueFeeRatio: null, // 超期滞纳金比例 0.5% 每天
        //   temporaryQuotaPeriod: 1, // 临时额度期限 单位：月
        // }
      }
    },
    // 初始赋值
    changObj(obj){
        var type = this.$store.state.userManageType
        // console.log(obj,type);
        if(type == 1){
            this.oldObj = JSON.parse(JSON.stringify(obj))
            this.effectiveDate=new Date //开始生效时间
            this.userTel=obj.userTel //企业联系人电话
            this.userEmail=obj.userEmail //邮箱
            this.companyName=obj.companyName //企业名称
            this.creditCode=obj.creditCode //信用代码
            this.pscsName=obj.pscsName // 售前客服名称
            this.pscsId=obj.pscsId // 售前客服id
            this.overDueOrExcessLimitStrategy=obj.overDueOrExcessLimitStrategy?obj.overDueOrExcessLimitStrategy:1 //是否自定义配置 1-否 2-是
            this.poraryQuota=obj.poraryQuota==0 || obj.poraryQuota== null?'':obj.poraryQuota // 临时额度
            this.quota=obj.quota==0 || obj.quota==null?'':obj.quota // 授信额度
            this.creditGrade=obj.creditGrade==0 || obj.creditGrade==null?'':obj.creditGrade // 客户等级
            this.accountingPeriod=obj.accountingPeriod==0 || obj.accountingPeriod==null?'':obj.accountingPeriod//结算账期
            this.payWay=obj.payWay //结算方式 0：付款买单 1：月结买单 2-固定时间
            this.id=obj.id
            this.form.valueTimeStart = (obj.poraryStart == '9999-01-01'?null:obj.poraryStart)//临时额度生效起始时间
            this.form.valueTimeEnd = (obj.poraryEnd == '9999-01-01'?null:obj.poraryEnd)//临时额度生效截止时间
            // console.log(this.form.valueTimeStart,this.form.valueTimeEnd,obj.valueTimeEnd);
            this.changMoney(this.creditGrade)
            if(this.overDueOrExcessLimitStrategy == 2){
              // this.creditRates = data.data.creditRates   // 额度范围
              // this.userSet()
              if(obj.overDueOrExcessLimit == null){
                this.overDueOrExcessLimit = {
                  excess: 3, // 超额
                  excessSettlementMethod: '', // 超额结算方式
                  overDueSettlementMethod: '', // 超期结算方式
                  overDue: 3, // 超期
                }
              }else{
                this.overDueOrExcessLimit = {
                  excess: obj.overDueOrExcessLimit.excess?obj.overDueOrExcessLimit.excess:3, // 超额
                  excessSettlementMethod: obj.overDueOrExcessLimit.excessSettlementMethod===null||obj.overDueOrExcessLimit.excessSettlementMethod===''?'':obj.overDueOrExcessLimit.excessSettlementMethod, // 超额结算方式
                  overDueSettlementMethod: obj.overDueOrExcessLimit.overDueSettlementMethod===null||obj.overDueOrExcessLimit.overDueSettlementMethod===''?'':obj.overDueOrExcessLimit.overDueSettlementMethod, // 超期结算方式
                  overDue: obj.overDueOrExcessLimit.overDue?obj.overDueOrExcessLimit.overDue:3, // 超期
                }
              }
              if(obj.otherSetting == null){
                this.otherSetting = {
                  overDueFeeRatio: null, // 超期滞纳金比例 0.5% 每天
                  temporaryQuotaPeriod: 1, // 临时额度期限 单位：月
                }
              }else{
                this.otherSetting = {
                  overDueFeeRatio: obj.otherSetting.overDueFeeRatio == null || obj.otherSetting.overDueFeeRatio == undefined?null:obj.otherSetting.overDueFeeRatio, // 超期滞纳金比例 0.5% 每天
                  temporaryQuotaPeriod: obj.otherSetting.temporaryQuotaPeriod == null || obj.otherSetting.temporaryQuotaPeriod == undefined?1:obj.otherSetting.temporaryQuotaPeriod, // 临时额度期限 单位：月
                }
              }
              console.log(this.oldObj,this.overDueOrExcessLimit);
              // this.otherSetting = obj.otherSetting  // 超期滞纳金比例 数组
              // this.overDueOrExcessLimit = obj.overDueOrExcessLimit // 超额 超期 数组
            }else{
              this.userSet(1)
            }
            for (let i = 0; i < this.creditRates.length; i++) {
              if(this.creditRates[i].levelId == obj.creditGrade){
                this.money.minMoney = this.creditRates[i].minLines
                this.money.maxMoney = this.creditRates[i].maxLines
              }
            }
        }else if(type == 2){
          if(this.routerName=='userOrderManagement'){
            this.hostoryArr = obj
          }else{
            this.id=obj.id
            this.getHistory(this.id)
          }
        }
        
    },
    //历史
    getHistory(id){
        var params = {
            // "companyId":63
            "companyId":id
        }

        this.$http.post(this.$service.userHistoryData, params).then(data => {
            if(data.code == 200){
                this.hostoryArr = data.data
            }else{
                this.$message.error(data.message)
            }
        }).catch((e) => {
          console.log(e)
        })
    },
    //
    handleOpen() {
      this.valueTime = this.effectiveDate;
    },
    //关闭时间选择弹窗
    handleClose(type) {
      if (type == 1) {
        // this.valueTime = new Date()
        this.$store.commit("changeDogShow", 0); //mutations
      }else if (type == 3) {
        this.$store.commit("changeDogShow", 0); //mutations
        var aa = new Date();
        var newDate = aa.getFullYear() + "-" + (aa.getMonth() + 1) + "-" + aa.getDate();
        newDate = this.bzgs(newDate)
        this.effectiveDate = newDate;
      } else {
        this.$store.commit("changeDogShow", 0); //mutations
        this.effectiveDate = this.valueTime;
      }
    },
    //开启时间选择弹窗
    changeDialogS(type) {
      if (type == 1) {
        this.$store.commit("changeDogShow", 1); //mutations
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
      // console.log(valueTime, cc, dd);
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
    bzgs(array) {
        var aa = new Date(array);
      var cc =
      aa.getFullYear() + "-" + (aa.getMonth() + 1) + "-" + aa.getDate();
      var arr = cc.split("-");
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
    // 增加月份
    timeChange(date, num) {
      console.log(date);
        if(date == null){
          // var aa = new Date();
          // var newDate = aa.getFullYear() + "-" + (aa.getMonth() + 1) + "-" + aa.getDate();
          // newDate = this.bzgs(newDate)
          this.$nextTick(()=>{
            // this.form.valueTimeStart = newDate
            this.form.valueTimeStart = null
            this.form.valueTimeEnd = null
          })
          // this.$set(this.form,'valueTimeStart',newDate)
          // date = newDate
          return
        }
        var oldDate = date            
        var monthnum = 0;
        if (typeof (num) == "string")
            monthnum = parseInt(num);
        else
            monthnum = num;
        if (typeof (date) == "string")
            date = new Date(date);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var sumMonths = month + monthnum;
        var newyear = year + parseInt(sumMonths/12);
        var newmonth =sumMonths % 12;
        var newday = day;
        if (newmonth < 1) {
          console.log(newmonth,sumMonths);
            if (newmonth == 0) {
              newyear--
              // newmonth =0- (sumMonths-1) % 12
              newmonth = 12
            }else{
              newmonth =0- (sumMonths-1) % 12
            }
        } 
        var da = new Date(newyear, newmonth, 0);
        console.log('清空sss',newyear,newmonth);
        var endDate = newyear + "-" + newmonth + "-" + (da.getDate() < newday?da.getDate():newday)
        if(Number(endDate.split('-')[2]) == Number(oldDate.split('-')[2])){
          var day1 = new Date(endDate);
          day1.setTime(day1.getTime()-24*60*60*1000);
          this.$nextTick(()=>{
            this.form.valueTimeEnd = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
          })
        }else{
          this.$nextTick(()=>{
              this.form.valueTimeEnd = newyear + "-" + newmonth + "-" + (da.getDate() < newday?da.getDate():newday)
          })
        }
        
        // return console.log(newyear + "-" + newmonth + "-" + (da.getDate() < newday?da.getDate():newday))
      },
    
    // 保存更改
    changeDialogVisible(type, save) {
      // console.log(type);
      // this.show = false;
      if (type == 1) {

      } else if (type == 2) {
        var warn = false
        if(this.payWay != 0){
          this.accountingPeriod == ''?warn = true:''
          // this.creditGrade == ''?warn = true:''
          this.quota == ''?warn = true:''
        }
          if(save && (this.creditGrade != '' && this.creditGrade != null) && ((this.quota < this.money.minMoney) || (this.quota > this.money.maxMoney))){
              return this.$message.warning('填写的授信额度不在该等级范围内，请重新填写看备注')
            }
        if(save && warn){
          return this.$message.warning('请输入必填信息')
        }
        if(this.overDueOrExcessLimitStrategy == 2 && (this.otherSetting.overDueFeeRatio === '' || this.otherSetting.overDueFeeRatio == null)){
          return this.$message.warning('请输入必填信息')
        }
        this.$store.commit("changeUserManageType", 0);
        var effectiveDate = this.bzgs(this.effectiveDate)
        // return console.log('生效时间',this.effectiveDate,effectiveDate);
        if(this.form.valueTimeStart != null){
          var poraryStart = this.bzgs(this.form.valueTimeStart)
        }else{
          var poraryStart = '9999-01-01'
        }
        if(this.form.valueTimeEnd != null){
          var poraryEnd = this.bzgs(this.form.valueTimeEnd)
        }else{
          var poraryEnd = '9999-01-01'
        }
        var aa = new Date();
        var newDate = aa.getFullYear() + "-" + (aa.getMonth() + 1) + "-" + aa.getDate();
        newDate = this.bzgs(newDate)
        if(effectiveDate == newDate){
          var openStatus = 1 
        }else{
          var openStatus = 0
        }
        var obj = {
          id:this.id,
          openStatus: openStatus,
          type:2, 
          save:save,
          }
        if(this.overDueOrExcessLimitStrategy == 2){ // 有问题
          if(JSON.stringify(this.overDueOrExcessLimit) != JSON.stringify(this.oldObj.overDueOrExcessLimit)){
            var objChilder = {}
            if(this.oldObj.overDueOrExcessLimit == null){
              objChilder = JSON.parse(JSON.stringify(this.overDueOrExcessLimit))
            }else{
              console.log(this.overDueOrExcessLimit,this.oldObj);
              if(Number(this.overDueOrExcessLimit.overDue)!=Number(this.oldObj.overDueOrExcessLimit.overDue)){
                objChilder['overDue'] = this.overDueOrExcessLimit.overDue
              }
              if(Number(this.overDueOrExcessLimit.excess)!=Number(this.oldObj.overDueOrExcessLimit.excess)){
                objChilder['excess'] = this.overDueOrExcessLimit.excess
              }
              if((this.overDueOrExcessLimit.excessSettlementMethod)!=(this.oldObj.overDueOrExcessLimit.excessSettlementMethod)){
                objChilder['excessSettlementMethod'] = this.overDueOrExcessLimit.excessSettlementMethod === ''?null:this.overDueOrExcessLimit.excessSettlementMethod
              }
              if((this.overDueOrExcessLimit.overDueSettlementMethod)!=(this.oldObj.overDueOrExcessLimit.overDueSettlementMethod)){
                objChilder['overDueSettlementMethod'] = this.overDueOrExcessLimit.overDueSettlementMethod === ''?null:this.overDueOrExcessLimit.overDueSettlementMethod
              }
            } 
            if(JSON.stringify(objChilder) == '{}'){

            }else{
              obj['overDueOrExcessLimit'] = objChilder
            }
          }
          if(this.oldObj.otherSetting == null){
            obj['otherSetting'] = JSON.parse(JSON.stringify(this.otherSetting))
          }else if(JSON.stringify(this.otherSetting) != JSON.stringify(this.oldObj.otherSetting)){
            var objChilder2 = {}
            console.log(this.otherSetting,this.oldObj.otherSetting);
            if(Number(this.otherSetting.overDueFeeRatio)!=Number(this.oldObj.otherSetting.overDueFeeRatio)){
              objChilder2['overDueFeeRatio'] = this.otherSetting.overDueFeeRatio
            }
            if(Number(this.otherSetting.temporaryQuotaPeriod)!=Number(this.oldObj.otherSetting.temporaryQuotaPeriod)){
              objChilder2['temporaryQuotaPeriod'] = this.otherSetting.temporaryQuotaPeriod
            }
            if(JSON.stringify(objChilder2) == '{}'){

            }else{
              obj['otherSetting'] = objChilder2
            }
          }
        }
        if(effectiveDate != this.oldObj.effectiveDate){
          obj['accountPeriodLimitEffectiveTime'] = effectiveDate
        }
        // if(this.userTel != this.oldObj.userTel){
        //   obj['userTel'] = this.userTel
        // }
        // if(this.userEmail != this.oldObj.userEmail){
        //   obj['userEmail'] = this.userEmail
        // }
        // if(this.companyName != this.oldObj.companyName){
        //   obj['companyName'] = this.companyName
        // }
        if(this.creditCode != this.oldObj.creditCode){
          obj['creditCode'] = this.creditCode
        }
        // if(this.pscsName != this.oldObj.pscsName){
        //   obj[pscsName] = this.oldObj.pscsName
        //   obj[pscsId] = this.oldObj.pscsId
        // }
        if(Number(this.overDueOrExcessLimitStrategy) != Number(this.oldObj.overDueOrExcessLimitStrategy)){
          obj['overDueOrExcessLimitStrategy'] = this.overDueOrExcessLimitStrategy
        }
        if(Number(this.poraryQuota) != Number(this.oldObj.poraryQuota)){
          obj['poraryQuota'] = (this.poraryQuota==''||this.poraryQuota==null?0:this.poraryQuota)
          obj['poraryStart'] = poraryStart
          obj['poraryEnd'] = poraryEnd
        }else if(Number(this.poraryQuota) != Number(this.oldObj.poraryQuota)){
          obj['poraryStart'] = poraryStart
          obj['poraryEnd'] = poraryEnd
        }
        if(Number(this.quota) != Number(this.oldObj.quota)){
          obj['quota'] = (this.quota == ''?0:this.quota)
          obj['creditGrade'] = (this.creditGrade == ''?0:this.creditGrade)
        }
        if(Number(this.creditGrade) != Number(this.oldObj.creditGrade)){
          obj['creditGrade'] = (this.creditGrade == ''?0:this.creditGrade)
        }
        if(Number(this.accountingPeriod) != Number(this.oldObj.accountingPeriod)){
          obj['accountingPeriod'] = (this.accountingPeriod == ''?0:this.accountingPeriod)
        }
        if(this.payWay != this.oldObj.payWay){
          obj['payWay'] = this.payWay
        }
        // return console.log(obj);
        this.$emit("changeDialogVisible", obj);
        this.userTel='' //企业联系人电话
        this.userEmail='' //邮箱
        this.companyName='' //企业名称
        this.creditCode='' //信用代码
        this.pscsName='' // 售前客服名称
        this.pscsId='' // 售前客服id
        this.overDueOrExcessLimitStrategy= 1 //是否自定义配置 1-否 2-是
        this.poraryQuota='' // 临时额度
        this.quota='' // 授信额度
        this.creditGrade='' // 客户等级
        this.accountingPeriod='' //结算账期
        this.payWay=0 //结算方式 0：付款买单 1：月结买单 2-固定时间
        this.id=''
        this.form.valueTimeStart = '' //临时额度生效起始时间
        this.form.valueTimeEnd = '' //临时额度生效截止时间
      } else if (type == 3) {
        var obj = {
          from: this.from3,
          type: 3,
          save: save,
        };
        this.$emit("changeDialogVisible", obj);
      }else{
        this.$store.commit("changeUserManageType", 0);
      }
      this.activeName = 'first'
    },
    handlePasteContent(e){
      console.log(e);
    }
  },
};
</script>
<style  lang="less" scoped>
/* img{
     border: 1px solid black;
 } */
/deep/.bianjiDia .el-dialog {
  height: 600px;
  .dialog-body {
    //  display: flex;
    //  flex-direction: column;
    padding: 20px;
    //  height:600px;
    width: 100%;
  }
}
.boxboby {
  display: flex;
  flex-direction: column;
  width: 100%;
  .lineL {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px 0;
    height: 26px;
  }
}
.redTip {
  display: inline-block;
  width: 16px;
  font-size: 16px;
  color: red;
}
.tittleTip {
  font-weight: 500;
}
.comButton {
  cursor: pointer;
  border: 1px solid #e5e5e5;
  border-radius: 2px;
  width: 40px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: rgb(0, 128, 255);
}
el-select {
}
input {
  width: 100px;
  height: 20px;
  border: 1px solid rgb(155, 155, 155);
  text-align: center;
  margin-right: 16px;
}
.lineInput{
  border: 1px solid #e5e5e5!important;
}
.lineInput:hover{
  border: 1px solid #333!important;
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
/deep/.khdj .el-input__inner{
    text-align: center;
    width: 103px;
    border: 1px solid #e5e5e5 !important;  
}
/deep/.khdj:hover .el-input__inner{
  border: 1px solid #333!important;
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

/deep/ .statusClass .el-dialog__title{
  font-weight: bold;
  font-size: 16px;
}
/deep/ .el-tabs__header{
  border: 0;
}
//  .avatar-uploader .el-upload {
//     display: inline-block;
//     border: 1px dashed #d9d9d9;
//     border-radius: 6px;
//     cursor: pointer;
//     position: relative;
//     overflow: hidden;
//   }
//   .avatar-uploader .el-upload:hover {
//     border-color: #409EFF;
//   }
//   .avatar-uploader-icon {
//     font-size: 28px;
//     color: #8c939d;
//     width: 178px;
//     height: 178px;
//     line-height: 178px;
//     text-align: center;
//   }
//   .avatar {
//     width: 100%;
//     height: 100%;
//     display: block;
//     z-index: 0;
//   }
//   .avatar-uploader-icon{
//       width: 100%;
//     height: 100%;
//   }
//   .spanrz{
//     position: absolute;
//     display: block;
//     width: 60px;
//     height: 40px;
//     line-height: 40px;
//     text-align: center;
//     cursor: pointer;
//     color: #409EFF;
//     right:-50px;
//     top:0;
//   }
//   .spanrII{
//     position: absolute;
//     display: block;
//     border: 1px solid #fea100 ;
//     border-radius: 50%;
//     width: 30px;
//     height: 30px;
//     line-height: 30px;
//     text-align: center;
//     cursor: pointer;
//     color: #fea100;
//     font-size: 20px;
//     right:-40px;
//     top:5px;
//   }
</style>