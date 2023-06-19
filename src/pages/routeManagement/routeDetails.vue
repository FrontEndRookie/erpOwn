<template>
  <div class="content-wrapper">
    <div class="content" style="position: relative;">
      <!-- <div v-show="tabName == 'tab2'" style="position: absolute;top: 25px;right:100px;z-index: 5;cursor: pointer;font-size:16px;width:100px;height:34px;">
        <span style="line-height: 34px;width:68px;height:34px;display: inline-block;">历史操作</span>
        <span style="height: 30px;width: 30px;display: inline-block;background-size: 100% 100%;border-radius: 50%;background-image:url('../../src/assets/history.jpg');"></span>
      </div> -->
      <el-tabs v-model="tabName" type="border-card">
        <el-tab-pane label="航线信息" name="tab1">
          <el-form :model="ruleForm" ref="ruleForm" :rules="rules" :label-position="labelPosition" :inline="true"
                   label-width="150px" size="medium" class="demo-form-inline">
            <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;padding-left: 20px;">航线信息</div>
            <div>
              <el-form-item prop="pol" label="起运港">
                <el-input v-model="ruleForm.pol" :disabled="true" style="width: 217px;"></el-input>
              </el-form-item>
              <el-form-item prop="pod" label="目的港">
                <el-input v-model="ruleForm.pod" :disabled="true" style="width: 217px;"></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item prop="airCompanyCode" label="航司代码">
                <el-input v-model="ruleForm.airCompanyCode" :disabled="true" style="width: 217px;"></el-input>
              </el-form-item>
              <el-form-item prop="shortestPrescription" label="时效">
                <el-col style="width: 98px;">
                  <el-input v-model="ruleForm.shortestPrescription" :disabled="true" size="medium"
                            placeholder="起始天数"></el-input>
                </el-col>
                <el-col style="text-align: center;width: 20px;">-</el-col>
                <el-col style="width: 98px;">
                  <el-input v-model="ruleForm.longestPrescription" :disabled="true" size="medium"
                            placeholder="结束天数"></el-input>
                </el-col>
              </el-form-item>
            </div>
            <!-- <div>
              <el-form-item prop="status" label="航线状态" >
                <el-switch v-model="ruleForm.status" :disabled="true" active-text="上架" inactive-text="下架" style="min-width: 216px;"></el-switch>
              </el-form-item>
              <el-form-item prop="principalId" label="航线负责人" >
                <el-select placeholder="请选择航线负责人" size="medium" v-model="ruleForm.principalId " :disabled="true" clearable
                           style="width: 216px; margin-right: -5px;">
                  <el-option
                    v-for="item in roleOpt"
                    :key="item.Value"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div> -->
            <!-- <div>
              <el-form-item label="备注">
                <el-input v-model="ruleForm.remark" :disabled="true" style="width: 596px;"
                          placeholder="请输入备注(最多输入300字符)" type="textarea" maxlength="300" show-word-limit></el-input>
              </el-form-item>
            </div> -->
            <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;padding-left: 20px;">航线进程</div>
            <div>
              <el-form-item label="航线路径">
                <div style="display: flex;">
                  <div v-for="(item,index) in fullLeg" :key="index">
                    <el-col style="width: 102px;">
                      <el-input v-model="item.airportName" :disabled="true"></el-input>
                    </el-col>
                    <el-col v-if="index != (fullLeg.length-1)" style="text-align: center;width: 20px;">-</el-col>
                  </div>
                </div>
              </el-form-item>
            </div>
            <div v-for="(parentItem,index) in airportTableArr" :key="index" class="route-module">
              <el-form :label-position="labelPosition" :inline="true" label-width="150px" size="small"
                       class="demo-form-inline">
                <el-form-item required :label="'航线'+(index+1)">
                  <el-col style="width: 102px;">
                    <el-input v-model="parentItem.startRouteName" :disabled="true"></el-input>
                  </el-col>
                  <el-col style="text-align: center;width: 20px;">-</el-col>
                  <el-col style="width: 102px;">
                    <el-input v-model="parentItem.endRouteName" :disabled="true"></el-input>
                  </el-col>
                </el-form-item>
              </el-form>
              <!-- 航班信息 -->
              <div class="flight-template">
                <div class="flight-template-ul-header">
                  <div class="flight-template-li" style="flex: 0 0 10%;text-align: center;">航班信息</div>
                  <div class="flight-template-li" style="flex: 0 0 20%;text-align: center;"><span
                    style="color: #f56c6c;">*</span>运载方式
                  </div>
                  <div class="flight-template-li" style="flex: 0 0 20%;text-align: center;"><span
                    style="color: #f56c6c;">*</span>航班号/卡车号
                  </div>
                  <div class="flight-template-li" style="flex: 0 0 20%;text-align: center;">起飞时间(ETD)</div>
                  <div class="flight-template-li" style="flex: 0 0 20%;text-align: center;">到达时间(ETA)</div>
                </div>
                <div v-for="(childerItem,childerIndex) in parentItem.childerTable" :key="childerIndex"
                     class="flight-template-ul-content">
                  <div class="flight-template-li" style="flex: 0 0 10%;"></div>
                  <div class="flight-template-li" style="flex: 0 0 20%;">
                    <el-select :disabled="true" v-model="childerItem.vehicleType" size="small" style="width: 80%;">
                      <el-option
                        v-for="item in airportOptions"
                        :key="item.name"
                        :label="item.name"
                        :disabled="parentItem.checkBox.indexOf(item.name) > -1"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="flight-template-li" style="flex: 0 0 20%;">
                    <el-input :disabled="true" v-model="childerItem.vehicleId" clearable placeholder="请输入" size="small"
                              style="width: 80%;"></el-input>
                  </div>
                  <div class="flight-template-li" style="flex: 0 0 20%;">
                    <el-time-picker :disabled="true" v-model="childerItem.etd" value-format="HH:mm" format="HH:mm"
                                    size="small" clearable style="width: 80%;" placeholder="选择时间"></el-time-picker>
                  </div>
                  <div class="flight-template-li" style="flex: 0 0 20%;">
                    <el-time-picker :disabled="true" v-model="childerItem.eta" value-format="HH:mm" format="HH:mm"
                                    size="small" clearable style="width: 80%;" placeholder="选择时间"></el-time-picker>
                  </div>
                </div>
              </div>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="航线报价"  name="tab2">
          <el-form :label-position="labelPosition" :inline="true" label-width="120px" size="medium"
                   class="demo-form-inline">
            <div v-for="(item,index) in airlineAgent" :key="index" class="route-module"
                 style="width: 95%;margin: 0 auto;margin-bottom: 20px;">
              <!-- <div>
                <el-form-item prop="name" label="航线名称">
                  <el-input :disabled="true" v-model="item.name" style="width: 220px;"></el-input>
                </el-form-item>
              </div> -->
              <div>
                <el-form-item required prop="agentId" label="代理公司">
                  <el-input :disabled="true" v-model="item.agentId" style="width: 220px;"></el-input>
                </el-form-item>
                <el-form-item required prop="dows" label="班期">
                  <el-select :disabled="true" v-model="item.dows" multiple placeholder="请选择班期" clearable
                             style="width: 468px;">
                    <el-option
                      v-for="item in dowsOpt"
                      :key="item.day"
                      :label="item.day"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <!-- <div style="margin:0 0 10px 45px;font-size: 14px;color: #606266;">
                <span>价格状态：</span>
                <el-switch
                  v-model="valueStatus"
                  active-text="上架"
                  inactive-text="下架">
                </el-switch>
                <span style="margin-left:60px;">航线负责人：</span>
                <input type="text"  disabled style="border: 1px solid #818181;">
              </div> -->
              <div>
                <el-form-item prop="status" label="航线状态" >
                  <el-switch v-model="item.status" :disabled="true" active-text="上架" inactive-text="下架" style="min-width: 216px;"></el-switch>
                </el-form-item>
                <el-form-item prop="principalId" label="航线负责人" >
                  <el-select placeholder="请选择航线负责人" size="medium" v-model="ruleForm.principalId " :disabled="true" clearable
                            style="width: 216px; margin-right: -5px;">
                    <el-option
                      v-for="item in roleOpt"
                      :key="item.Value"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <!-- <div v-if="item.otherFees.length > 0">
                <el-form-item label="杂费">
                  <el-tag v-for="(tagItem,tagIndex) in item.otherFees" :key="tagIndex" type="success"
                          style="margin-right: 5px;">{{ tagItem.feesName }} ￥{{ tagItem.fees }}
                  </el-tag>
                </el-form-item>
              </div> -->
              <div v-if="item.radioShow" class="title_one">
                <span style="font-size: 14px;">代理报价:</span>
                <span v-show="(item.radio == '1')?false:true">此为首程价格</span>
                <span v-show="(item.radio == '1')?true:false">此为全程价格</span>
              </div>
              <div v-if="!item.radioShow" class="title_one">
                <span style="font-size: 14px;">代理报价:</span>
                <span>此为全程价格</span>
              </div>
               <!-- 航班信息 -->
                <div style="display:flex;flex-direction: row;">
                  <el-tabs v-model="labelArry[index].activeName" type="card" @tab-click="tab=>{handleClick(tab,index)}" style="width:400px;">
                    <el-tab-pane :disabled="(item.ratesList[0].tableData.length)=='0'?true:false" label="散货" name="first"></el-tab-pane>
                    <el-tab-pane :disabled="(item.ratesList[1].tableData.length)=='0'?true:false" label="托盘" name="second"></el-tab-pane>
                    <el-tab-pane :disabled="(item.ratesList[2].tableData.length)=='0'?true:false" label="散货和托盘" name="third"></el-tab-pane>
                    <el-tab-pane :disabled="(item.ratesList[3].tableData.length)=='0'?true:false" label="MUST GO" name="fourth"></el-tab-pane>
                  </el-tabs>
                  <div v-if="item.radioShow" style="font-size:20px;line-height:50px;">
                    <span>卡车费是否计入显示：</span>
                    <el-radio v-model="item.radio" @change="changeRadio(index)" label="1">是</el-radio>
                    <el-radio v-model="item.radio" @change="changeRadio(index)" label="2">否</el-radio>
                  </div>
                </div>
              <div v-for="(listItem,listIndex) in item.ratesList" :key="listIndex">
                <div v-show="labelArry[index].listShow == listIndex">
                <!-- <div>
                  <el-form-item required label="代理报价">
                    <el-checkbox-group v-model="listItem.cargoType">
                      <el-checkbox :disabled="true" v-for="(optItem,optIndex) in cargoTypeOpt" :key="optIndex"
                                   :label="optItem.value">{{ optItem.name }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </div> -->
                <div class="flight-template" style="margin-left: 0;width: 100%;">
                  <div class="flight-template-ul-header">
                    <div v-if="listIndex != '3'" class="flight-template-li" style="flex: 0 0 10%;text-align: center;">比重(体积:重量)</div>
                    <div class="flight-template-li" style="flex: 0 0 11%;text-align: center;">M(最低收费)</div>
                    <div class="flight-template-li" style="flex: 0 0 11%;text-align: center;">N(小货价)</div>
                    <div class="flight-template-li" style="flex: 0 0 11%;text-align: center;">45KG+</div>
                    <div class="flight-template-li" style="flex: 0 0 11%;text-align: center;">100KG+</div>
                    <div class="flight-template-li" style="flex: 0 0 11%;text-align: center;">300KG+</div>
                    <div class="flight-template-li" style="flex: 0 0 11%;text-align: center;">500KG+</div>
                    <div class="flight-template-li" style="flex: 0 0 11%;text-align: center;">1000KG+</div>
                    <div class="flight-template-li" style="flex: 0 0 13%;text-align: center;">备注</div>
                    <!-- <div class="flight-template-li" style="flex: 0 0 6%;text-align: center;">
                      <el-checkbox v-model="listItem.checkAll" @change="val=>{handleCheckAllChange(val,index,listIndex)}">全选</el-checkbox></div> -->
                  </div>
                  <div v-for="(childerItem,childerIndex) in listItem.tableData" :key="childerIndex"
                       class="flight-template-ul-content">
                    <div v-if="listIndex != '3'" class="flight-template-li" style="flex: 0 0 10%;">
                      <el-input :value="childerItem.vwr == '-1'?'':('1:'+childerItem.vwr)" :disabled="true" size="small"
                                style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 11%;">
                      <el-input v-model="childerItem.ratesLevel0" :disabled="true" clearable placeholder="请输入"
                                size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 11%;">
                      <el-input v-model="childerItem.ratesN" :disabled="true" clearable placeholder="请输入" size="small"
                                style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 11%;">
                      <el-input v-model="childerItem.ratesLevel1" :disabled="true" clearable placeholder="请输入"
                                size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 11%;">
                      <el-input v-model="childerItem.ratesLevel2" :disabled="true" clearable placeholder="请输入"
                                size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 11%;">
                      <el-input v-model="childerItem.ratesLevel3" :disabled="true" clearable placeholder="请输入"
                                size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 11%;">
                      <el-input v-model="childerItem.ratesLevel4" :disabled="true" clearable placeholder="请输入"
                                size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 11%;">
                      <el-input v-model="childerItem.ratesLevel5" :disabled="true" clearable placeholder="请输入"
                                size="small" style="width: 80%;"></el-input>
                    </div>
                    <div style="flex: 0 0 13%;cursor:pointer;position: relative;" @mousemove.stop="showBZ(index,listIndex,childerIndex,)" @mouseout="showBZ(2)" class="flight-template-li">
                      <el-input v-model="childerItem.remarke" :disabled="true" clearable placeholder="请输入"
                                size="small" style="width: 80%;"></el-input>
                      <div v-if="(childerItem.remarke==undefined) || (childerItem.remarke=='undefined')?false:true" v-show="((''+childerItem.remarke).length>7 && (index === indexN) && (listIndex === listIndexN) && (childerIndex === childerIndexN))?true:false"
                      style="position: absolute;z-index: 999;line-height: 20px;max-height:70px;overflow:scroll; width: 400px;word-wrap:break-word;border:1px solid #000000;right: 130px;top: 15px;background-color: #FFF;border-radius: 8px;">
                      <span style="display:inline-block;width: 20px;"></span>{{childerItem.remarke}}</div>
                    </div>
                    <!-- <div class="flight-template-li" style="flex: 0 0 7%;">
                      <el-checkbox v-model="childerItem.labelValue" :key="childerIndex" @change="val=>{handleCheckedCitiesChange(val,index,listIndex,childerIndex)}"></el-checkbox>
                    </div> -->
                  </div>
                </div>
                <!-- <div class="selecting-operation"><button @click="selectingOperation(1)">上架</button><button @click="selectingOperation(2)">下架</button><button @click="selectingOperation(3)">取消操作</button></div> -->
                
                </div>
              </div>
              <!-- 卡车费 -->
              <!-- <div v-if="item.radioShow" v-show="(item.radio == '1')?true:false" class="flight-template" style="margin-left: 0;width: 100%;"> -->
              <div v-if="item.radioShow || item.radioShows" class="flight-template" style="margin-left: 0;width: 100%;">
                  <div style="font-size: 20px;margin:20px 0 0; border-radius: 5px 5px 0px 0px;background: #d7d7d7;font-weight: 900; width:80px;text-align: center;height: 40px;line-height: 40px;">卡车费</div>
                  <div class="flight-template-ul-header">
                    <div class="flight-template-li" style="flex: 0 0 10%;text-align: center;">目的站</div>
                    <div class="flight-template-li" style="flex: 0 0 12%;text-align: center;">最低收费</div>
                    <div class="flight-template-li" style="flex: 0 0 12%;text-align: center;">最低起运重量</div>
                    <div class="flight-template-li" style="flex: 0 0 12%;text-align: center;">单价</div>
                    <div class="flight-template-li" style="flex: 0 0 12%;text-align: center;">班次</div>
                    <div class="flight-template-li" style="flex: 0 0 12%;text-align: center;">ETD</div>
                    <div class="flight-template-li" style="flex: 0 0 12%;text-align: center;">ETA</div>
                    <div class="flight-template-li" style="flex: 0 0 12%;text-align: center;">整车运费</div>
                  </div>
                  <div class="flight-template-ul-content">
                    <div class="flight-template-li" style="flex: 0 0 10%;">
                      <el-input size="small" style="width: 80%;" v-model="ruleForm.pod" disabled></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input disabled type="number" clearable placeholder="请输入" v-model="item.ratesN" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input disabled type="number" v-model="item.minWeight" clearable placeholder="请输入" size="small"
                                style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input disabled type="number" v-model="item.unitRates" clearable placeholder="请输入"
                                size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input disabled v-model="item.carDows" clearable placeholder="请输入"
                                size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input disabled v-model="item.carEtd" clearable placeholder="请输入"
                                size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input disabled v-model="item.carEta" clearable placeholder="请输入"
                                size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input disabled type="number" v-model="item.entireCarRate" clearable placeholder="请输入"
                                size="small" style="width: 80%;"></el-input>
                    </div>
                  </div>
                </div>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import {toData} from '@/util/assist'
  export default {
    data() {
      return {
        indexN:'',
        listIndexN:'',
        childerIndexN:'',
        tabName: 'tab1',
        labelArry: [
          // {
          //   listShow: 0,
          //   activeName: 'first',
          //   showLabel:false
          // }
        ],
        valueStatus:false,
        isIndeterminate:false,
        // radio:'1',
        id: '',
        labelPosition: 'right',
        //航线信息
        ruleForm: {
          pol: '',
          pod: '',
          airCompanyCode: '',
          shortestPrescription: '',
          longestPrescription: '',
          status: true,
          remark: '',
          principalId: ''
        },
        rules: {
          pol: [{required: true, message: '请输入起运港机场三字码', trigger: 'change'}],
          pod: [{required: true, message: '请输入目的港机场三字码', trigger: 'change'}],
          airCompanyCode: [{required: true, message: '请输入起航司二字码', trigger: 'change'}],
          // principalId:[{required: true, message: '请选择航线负责人', trigger: 'change'}],
          shortestPrescription: [{required: true, message: '起始天数', trigger: 'change'}],
          status: [{required: true, message: '请选择航线', trigger: 'change'}]
        },
        //航线进程
        fullLeg: [],
        airportTableArr: [],
        airportOptions: [
          {
            name: '宽体客机',
            value: '1'
          },
          {
            name: '宽体货机',
            value: '2'
          },
          {
            name: '宽体客改货',
            value: '3'
          },
          {
            name: '窄体客机',
            value: '4'
          },
          {
            name: '窄体货机',
            value: '5'
          },
          {
            name: '窄体客改货',
            value: '6'
          },
          {
            name: '窄体飞机',
            value: '7'
          },
          {
            name: '宽体飞机',
            value: '8'
          },
          {
            name: '货机',
            value: '9'
          },
          {
            name: '飞机',
            value: '10'
          },
          {
            name: '卡车',
            value: '11'
          },
          {
            name: '轮船',
            value: '12'
          },
          {
            name: '客机',
            value: '13'
          }
        ],
        //航线价格
        cargoTypeOpt: [
          {
            name: '散货价',
            value: '1'
          },
          {
            name: '托盘价',
            value: '2'
          }
        ],
        roleOpt:[],
        otherFeesOpt: [
          {
            feesName: '报关费'
          },
          {
            feesName: '制单费'
          },
          {
            feesName: '信息费'
          },
          {
            feesName: '分单费'
          },
          {
            feesName: '其他费用'
          }
        ],
        dowsOpt: [
          {
            day: 'D1',
            value: '1'
          },
          {
            day: 'D2',
            value: '2'
          },
          {
            day: 'D3',
            value: '3'
          },
          {
            day: 'D4',
            value: '4'
          },
          {
            day: 'D5',
            value: '5'
          },
          {
            day: 'D6',
            value: '6'
          },
          {
            day: 'D7',
            value: '7'
          }
        ],
        airlineAgent: [],
        airlineAgentZ1: [],
        airlineAgentZ2: [],
      }
    },
    mounted() {
      this.id = this.$route.query.id
      this.initAirlineDetail()
      this.initAirlineRatesDetail()
      this.initRoleSearch()
    },

    methods: {
      // 备注显示
      showBZ(index,listIndex,childerIndex){
              this.indexN = index
              this.listIndexN = listIndex
              this.childerIndexN = childerIndex
            },
      // 单选卡车费用显示
      changeRadio(index){
        // this.airlineAgent[index]
        if(this.airlineAgent[index].radio === '1'){
          this.airlineAgent[index].ratesList = this.airlineAgentZ2[index].ratesList
        }else{
          this.airlineAgent[index].ratesList = this.airlineAgentZ1[index].ratesList
        }
      },
      // // 操作
      // selectingOperation(index){
      //   console.log(index);
      // },
      // // 全选
      // handleCheckAllChange(val,index,listIndex){
      //   // if(this.type == 'bulkCargo'){
      //     // 如果是散货
      //   if(val){
      //     for(let i=0;i<this.airlineAgent[index].ratesList[listIndex].tableData.length;i++){
      //         this.airlineAgent[index].ratesList[listIndex].tableData[i].labelValue = true 
      //        }
      //   }else{
      //     for(let i=0;i<this.airlineAgent[index].ratesList[listIndex].tableData.length;i++){
      //         this.airlineAgent[index].ratesList[listIndex].tableData[i].labelValue = false 
      //        }
      //   }
        
      // },
      // // 单选
      // handleCheckedCitiesChange(val,index,listIndex,childerIndex){
      //   let aaa = true
      //   for(let i=0;i<this.airlineAgent[index].ratesList[listIndex].tableData.length;i++){
      //     if(this.airlineAgent[index].ratesList[listIndex].tableData[i].labelValue == false){
      //        aaa = false
      //        break
      //     }
      //   }
      //   this.airlineAgent[index].ratesList[listIndex].checkAll = aaa
      // },
      handleClick(tab, index) {
        let arr = ['first','second',"third","fourth"]
        // this.activeName = arr[tab.index]
        // this.listShow = tab.index
        this.labelArry[index].activeName = arr[tab.index]
        this.labelArry[index].listShow = tab.index
      },
      initRoleSearch() {
        const vm = this
        var params = {
          roleName: '航线负责人'
        }
        params = toData(params)
        vm.$http.get(vm.$service.userRoleList + '?' + params).then(data => {
          if (data.code == 200) {
            this.roleOpt = data.data
          }
        }).catch((e) => {
          console.log(e)
        })
      },
      //获取航线信息详情
      initAirlineDetail() {
        this.$http.get(this.$service.airlineDetail + '?id=' + this.id).then((data) => {
          if (data.code == 200) {
            var data = data.data
            this.ruleForm.pol = data.pol
            this.ruleForm.pod = data.pod
            this.ruleForm.airCompanyCode = data.airCompanyCode
            this.ruleForm.shortestPrescription = data.shortDuration
            this.ruleForm.longestPrescription = data.longDuration
            this.ruleForm.status = data.status == 0 ? true : false
            this.ruleForm.remark = data.remark
            this.ruleForm.principalId = data.principalId
            var newFulleg = data.fullLeg.split(',')
            for (var i = 0; i < newFulleg.length; i++) {
              var json = {
                airportName: newFulleg[i]
              }
              this.fullLeg.push(json)
            }
            this.airportTableArr = JSON.parse(data.legDetail)
          }
        })
      },
      //航线报价信息详情
      initAirlineRatesDetail() {
        this.$http.get(this.$service.airlineRatesDetail + '?id=' + this.id).then((data) => {
          if (data.code == 200) {
            var data = data.data.airlineDetailVOS
            this.airlineAgent = []
            for (var q = 0; q < data.length; q++) {
            console.log(data[q].unitRates,data[q].ratesN);
              var json = {
                name: data[q].name,
                agentId: data[q].agentName,
                incidentalName: '',
                incidentalPrice: '',
                id: data[q].id,
                airlineAgentId:data[q].airlineAgentId,
                status:data[q].status== 1 ? true : false,
                carDows: data[q].carDows, //--卡车班次
                carEta: data[q].carEta, //--卡车ETA
                carEtd: data[q].carEtd, //--卡车ETD
                entireCarRate:  data[q].entireCarRate, //--整车费用
                minWeight:  data[q].minWeight, //--最低起运重量
                addCarRates:  data[q].addCarRates, //--是否加卡车价格1,需要加入卡车价格，0是无需加入卡车价格
                unitRates:  data[q].unitRates, //--单价
                ratesN:  data[q].ratesN, //--卡车最低收费
                radio:'1',
                radioShow: ((data[q].unitRates==0 || data[q].unitRates=='' || data[q].unitRates==null)?false:true),
                radioShows: ((data[q].ratesN==0 || data[q].ratesN=='' || data[q].ratesN==null)?false:true)
              }
              // console.log(json);
              json.dows = data[q].dows.split(',')
              // json.otherFees = JSON.parse(data[q].otherFees)
              // json.otherFeesArr = []
              // if(json.otherFees){
              //   for (var w = 0; w < json.otherFees.length; w++) {
              //     json.otherFeesArr.push(json.otherFees[w].feesName)
              //   }
              // }
              
              if (data[q].rates) {
                 json.ratesList = [
                            {
                          cargoType: 1,
                          isMustGo: 0,//  是否MUST GO: 0否，1是
                          tableData: [
                          ]
                        },
                        {
                          cargoType: 2,
                          isMustGo: 0,//  是否MUST GO: 0否，1是
                          tableData: [
                          ]
                        },
                        {
                          cargoType: 3,
                          isMustGo: 0,//  是否MUST GO: 0否，1是
                          tableData: [
                          ]
                        },
                        {
                          cargoType: 3,
                          isMustGo: 1,//  是否MUST GO: 0否，1是
                          tableData: [
                          ]
                        }
                      ]
                for(var e = 0; e < data[q].rates.length; e++){
                  var indexs = Number(data[q].rates[e].cargoType)-1
                  if(indexs == 0 || indexs == 1){
                    json.ratesList[indexs].tableData = data[q].rates[e].ratesInsertDTOS
                  }else{
                    if(data[q].rates[e].isMustGo == 0){
                      json.ratesList[2].tableData = data[q].rates[e].ratesInsertDTOS
                    }else{
                      json.ratesList[3].tableData = data[q].rates[e].ratesInsertDTOS
                    }
                  }
                }
              }
              this.airlineAgent.push(json)
              this.airlineAgentZ1 = JSON.parse(JSON.stringify(this.airlineAgent))
              for (let index = 0; index < this.airlineAgent.length; index++) {
                // console.log(this.airlineAgent[index]);
                if(this.airlineAgent[index].radioShow){
                  for(let i=0; i<this.airlineAgent[index].ratesList.length;i++)
                    if(this.airlineAgent[index].ratesList[i].tableData.length > 0){
                      for(let j = 0;j<this.airlineAgent[index].ratesList[i].tableData.length;j++){
                        // this.airlineAgent[index].ratesList[i].tableData[j].ratesLevel0 = this.airlineAgent[index].ratesList[i].tableData[j].ratesLevel0 + this.airlineAgent[index].unitRates
                        this.airlineAgent[index].ratesList[i].tableData[j].ratesLevel1 = this.airlineAgent[index].ratesList[i].tableData[j].ratesLevel1 == ''?(this.airlineAgent[index].ratesList[i].tableData[j].ratesLevel1):((this.airlineAgent[index].ratesList[i].tableData[j].ratesLevel1)*1000 + (this.airlineAgent[index].unitRates)*1000)/1000
                        this.airlineAgent[index].ratesList[i].tableData[j].ratesLevel2 = this.airlineAgent[index].ratesList[i].tableData[j].ratesLevel2 == ''?(this.airlineAgent[index].ratesList[i].tableData[j].ratesLevel2):((this.airlineAgent[index].ratesList[i].tableData[j].ratesLevel2)*1000 + (this.airlineAgent[index].unitRates)*1000)/1000
                        this.airlineAgent[index].ratesList[i].tableData[j].ratesLevel3 = this.airlineAgent[index].ratesList[i].tableData[j].ratesLevel3 == ''?(this.airlineAgent[index].ratesList[i].tableData[j].ratesLevel3):((this.airlineAgent[index].ratesList[i].tableData[j].ratesLevel3)*1000 + (this.airlineAgent[index].unitRates)*1000)/1000
                        this.airlineAgent[index].ratesList[i].tableData[j].ratesLevel4 = this.airlineAgent[index].ratesList[i].tableData[j].ratesLevel4 == ''?(this.airlineAgent[index].ratesList[i].tableData[j].ratesLevel4):((this.airlineAgent[index].ratesList[i].tableData[j].ratesLevel4)*1000 + (this.airlineAgent[index].unitRates)*1000)/1000
                        this.airlineAgent[index].ratesList[i].tableData[j].ratesLevel5 = this.airlineAgent[index].ratesList[i].tableData[j].ratesLevel5 == ''?(this.airlineAgent[index].ratesList[i].tableData[j].ratesLevel5):((this.airlineAgent[index].ratesList[i].tableData[j].ratesLevel5)*1000 + (this.airlineAgent[index].unitRates)*1000)/1000
                      }
                    }
                }
              }
              this.airlineAgentZ2 = JSON.parse(JSON.stringify(this.airlineAgent))
              // console.log(this.airlineAgent);
              for(let k=0;k<this.airlineAgent.length;k++){
                let arr = ['first','second',"third","fourth"]
                let NumberType = 'first'
                let NumberIndex = 0
                for(let j=0;j<this.airlineAgent[k].ratesList.length;j++){
                  Vue.set(this.airlineAgent[k].ratesList[j],'checkAll',false)
                  for(let i=0;i<this.airlineAgent[k].ratesList[j].tableData.length;i++){
                    Vue.set(this.airlineAgent[k].ratesList[j].tableData[i],'labelValue', false) 
                  }
                }
                for(let n=0;n<this.airlineAgent[k].ratesList.length;n++){
                  if(this.airlineAgent[k].ratesList[n].tableData.length != '0'){
                    NumberType = arr[n]
                    NumberIndex = n
                    break
                  }
                }
                this.labelArry.push({
                                  listShow: NumberIndex,
                                  activeName: NumberType})
              }
              console.log(this.airlineAgent);
            }
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import url("../../assets/icon/iconfont.css");

  .content-wrapper {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    overflow: hidden;
    background-color: #f3f6f9;
  }

  .content {
    background-color: #FFF;
    padding: 20px;
    box-sizing: border-box;

    /deep/ .el-form {
      background-color: transparent;
    }

    /deep/ .el-form--inline .el-form-item {
      margin-bottom: 20px;
    }

    /deep/ .textArea {
      .el-form-item__content {
        height: 64px;

        .el-textarea__inner {
          resize: none;
          padding: 10px 15px;
        }
      }
    }

    /deep/ .radio-group {
      margin-bottom: 30px;

      .el-form-item__label,
      .el-form-item__content {
        // height: 25px;
        line-height: 25px;
      }
    }

    /deep/ .brother-radio {
      margin-bottom: 12px;
    }

    /deep/ .el-form-item__content {
      height: auto;
    }
  }

  .stpes-class {
    width: 500px;
    margin-left: 200px;
    margin-bottom: 20px;
  }

  .route-module {
    background-color: rgba(153, 153, 153, 0.1);
    padding: 20px;
    width: 80%;
    margin-left: 80px;
    border-radius: 5px;
    margin-bottom: 20px;
    position: relative;
  }

  .flight-template {
    width: 80%;
    margin-left: 150px;
  }

  .flight-template-ul-header {
    background-color: #FAFAFA;
    font-weight: bold;
    display: flex;
    font-size: 14px;
  }

  .flight-template-ul-header .flight-template-li {
    height: 40px;
    line-height: 40px;
  }

  .flight-template-ul-content {
    display: flex;
    font-size: 14px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.09);

  }

  .flight-template-ul-content .flight-template-li {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 40px;
  }

  .close-img {
    width: 40px;
    height: 40px;
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }
  .selecting-operation{
    margin: 10px 0;
    text-align: right;
  }
  .selecting-operation button{
    display: inline-block;
    width: 60px;
    height: 20px;
    border-radius: 5px;
    background: #169bd5;
    color: white;
    margin-right: 10px;
    cursor:pointer;
    font-size: 12px;
  }
  .title_one{
    height: 50px;
    line-height: 50px;
    font-size: 20px;
    margin-bottom: 10px;
    margin-left: 6px;
  }
  .hui{
    background: red;
  }
</style>
