<template>
  <div class="content-wrapper">
    <div class="content" style="position: relative;">
      <!-- <div v-show="tabName == 'tab2'" style="position: absolute;top: 25px;right:100px;z-index: 5;cursor: pointer;font-size:16px;width:100px;height:34px;">
        <span style="line-height: 34px;width:68px;height:34px;display: inline-block;">历史操作</span>
        <span style="height: 30px;width: 30px;display: inline-block;background-size: 100% 100%;border-radius: 50%;background-image:url('../../src/assets/history.jpg');"></span>
      </div> -->
      <el-tabs v-model="tabName" type="border-card">
        <el-tab-pane label="航线信息" name="tab1">
          <el-form :model="ruleForm" ref="ruleForm" :rules="rules" :label-position="labelPosition" :inline="true" label-width="150px" size="medium" class="demo-form-inline">
            <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;padding-left: 20px;">航线信息</div>
            <div>
              <el-form-item prop="pol" label="起运港">
                <!-- <el-select v-model="ruleForm.pol" @change="polChange" placeholder="请输入机场三字码" :remote-method="polMethod" :loading="loading" clearable filterable remote reserve-keyword>
                  <el-option
                    v-for="(item,index) in polOpt"
                    :disabled="ruleForm.pod == item.threeLetterCode"
                    :key="item.threeLetterCode"
                    :value="item.threeLetterCode">
                      <span>{{item.threeLetterCode}}</span>
                      <span style="margin-left: 5px;">{{item.name}}</span>
                  </el-option>
                </el-select> -->
                <el-input v-model="ruleForm.pol" @input="polMethod" @focus="polClick(1,true)" @blur="polClick(1,false)" size="medium" placeholder="请输入机场三字码" style="width: 216px;"></el-input>
                <div v-show="isPol" class="el-select-dropdown el-popper" style="min-width: 216px;">
                  <div class="el-scrollbar" style="">
                    <div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -5px; margin-right: -5px;">
                      <ul class="el-scrollbar__view el-select-dropdown__list">
                        <li v-if="polOpt.length > 0" :class="{'is-disabled': ruleForm.pod == item.threeLetterCode}" @mousedown="polChange(item)" v-for="(item,index) in polOpt" :key="index" class="el-select-dropdown__item">
                          <span>{{item.threeLetterCode}}</span>
                          <span style="margin-left: 5px;">{{item.name}}</span>
                        </li>
                        <li v-if="polOpt.length == 0" class="el-select-dropdown__item" style="color: #c0c4cc;">暂无数据</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item prop="pod" label="目的港">
                <!-- <el-select v-model="ruleForm.pod" placeholder="请输入机场三字码" :remote-method="podMethod" :loading="loading" clearable filterable remote reserve-keyword>
                  <el-option
                    v-for="item in podOpt"
                    :disabled="ruleForm.pol == item.threeLetterCode"
                    :key="item.threeLetterCode"
                    :value="item.threeLetterCode">
                      <span>{{item.threeLetterCode}}</span>
                      <span style="margin-left: 5px;">{{item.name}}</span>
                  </el-option>
                </el-select> -->
                <el-input v-model="ruleForm.pod" @input="podMethod" @focus="polClick(2,true)" @blur="polClick(2,false)" size="medium" placeholder="请输入机场三字码" style="width: 216px;"></el-input>
                <div v-show="isPod" class="el-select-dropdown el-popper" style="min-width: 216px;">
                  <div class="el-scrollbar" style="">
                    <div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -5px; margin-right: -5px;">
                      <ul class="el-scrollbar__view el-select-dropdown__list">
                        <li v-if="podOpt.length > 0" :class="{'is-disabled': ruleForm.pol == item.threeLetterCode}" @mousedown="polChange1(item)" v-for="(item,index) in podOpt" :key="index" class="el-select-dropdown__item">
                          <span>{{item.threeLetterCode}}</span>
                          <span style="margin-left: 5px;">{{item.name}}</span>
                        </li>
                        <li v-if="podOpt.length == 0" class="el-select-dropdown__item" style="color: #c0c4cc;">暂无数据</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </div>
            <div>
              <el-form-item prop="airCompanyCode" label="航司代码">
                <!-- <el-select v-model="ruleForm.airCompanyCode" placeholder="请输入航司二字码" :remote-method="companyMethod" :loading="loading" clearable filterable remote reserve-keyword>
                  <el-option
                    v-for="item in airCompanyCodeOpt"
                    :key="item.twoLetterCode"
                    :value="item.twoLetterCode">
                      <span>{{item.twoLetterCode}}</span>
                      <span style="margin-left: 5px;">{{item.name}}</span>
                  </el-option>
                </el-select> -->
                <el-input v-model="ruleForm.airCompanyCode" @input="companyMethod" @focus="polClick(3,true)" @blur="polClick(3,false)" size="medium" placeholder="请输入航司二字码" style="width: 216px;"></el-input>
                <div v-show="isAirCompanyCode" class="el-select-dropdown el-popper" style="min-width: 216px;">
                  <div class="el-scrollbar" style="">
                    <div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -5px; margin-right: -5px;">
                      <ul class="el-scrollbar__view el-select-dropdown__list">
                        <li v-if="airCompanyCodeOpt.length > 0" @mousedown="polChange2(item)" v-for="(item,index) in airCompanyCodeOpt" :key="index" class="el-select-dropdown__item">
                          <span>{{item.airCompanyCode}}</span>
                          <span style="margin-left: 5px;">{{item.name}}</span>
                        </li>
                        <li v-if="airCompanyCodeOpt.length == 0" class="el-select-dropdown__item" style="color: #c0c4cc;">暂无数据</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item prop="shortDuration" label="时效">
                <el-col style="width: 98px;">
                  <el-input v-model="ruleForm.shortDuration" onkeyup="value=value.replace(/[^\d]/g, '')" size="medium" placeholder="起始天数"></el-input>
                </el-col>
                <el-col style="text-align: center;width: 20px;">-</el-col>
                <el-col style="width: 98px;">
                  <el-input v-model="ruleForm.longDuration" onkeyup="value=value.replace(/[^\d]/g, '')" size="medium" placeholder="结束天数"></el-input>
                </el-col>
              </el-form-item>
            </div>
            <!-- <div>
              <el-form-item prop="status" label="航线状态">
                <el-switch v-model="ruleForm.status" active-text="上架" inactive-text="下架" style="min-width: 216px;"></el-switch>
              </el-form-item>
              <el-form-item prop="principalId" label="航线负责人">
                <el-select placeholder="请选择航线负责人" size="medium" disabled v-model="ruleForm.principalId" clearable  style="width: 216px; margin-right: -5px;">
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
                <el-input v-model="ruleForm.remark" style="width: 596px;" placeholder="请输入备注(最多输入300字符)" type="textarea"
                  maxlength="300" show-word-limit></el-input>
              </el-form-item>
            </div> -->
            <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;padding-left: 20px;">航线进程</div>
            <div>
              <el-form-item required label="航线路径">
                <div style="display: flex;">
                  <div v-for="(item,index) in fullLeg" :key="index">
                    <el-col style="width: 102px;">
                      <!-- <el-select :disabled="index == 0 ? true : false" @change="airportChange" @focus="airportEcheckClick" v-model="item.airportName" placeholder="三字码" :remote-method="airportMethod" :loading="loading" filterable remote reserve-keyword>
                        <el-option
                          v-for="item in airportOpt"
                          :key="item.threeLetterCode"
                          :disabled="airportEcheckArr.indexOf(item.threeLetterCode) > -1"
                          :value="item.threeLetterCode">
                            <span>{{item.threeLetterCode}}</span>
                            <span style="margin-left: 5px;">{{item.name}}</span>
                        </el-option>
                      </el-select> -->
                      <el-input :disabled="index == 0 ? true : false" v-model="item.airportName" @input="airportMethod" @focus="airportEcheckClick(true,index,item.airportName)" @blur="airportEcheckClick(false,index)" size="medium" placeholder="三字码"></el-input>
                      <div v-if="index != 0 && index == airportNameIndex" class="el-select-dropdown el-popper" style="min-width: 216px;">
                        <div class="el-scrollbar" style="">
                          <div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -5px; margin-right: -5px;">
                            <ul class="el-scrollbar__view el-select-dropdown__list">
                              <li v-if="airportOpt.length > 0" :class="{'is-disabled': airportEcheckArr.indexOf(item.threeLetterCode) > -1}" @mousedown="polChange3(item,index)" v-for="(item,chidlerIndex) in airportOpt" :key="chidlerIndex" class="el-select-dropdown__item">
                                <span>{{item.threeLetterCode}}</span>
                                <span style="margin-left: 5px;">{{item.name}}</span>
                              </li>
                              <li v-if="airportOpt.length == 0" class="el-select-dropdown__item" style="color: #c0c4cc;">暂无数据</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </el-col>
                    <el-col v-if="index != (fullLeg.length-1)" style="text-align: center;width: 20px;">-</el-col>
                  </div>
                  <el-button @click="airportClick" style="height: 36px;line-height: 36px;padding: 0;margin-left: 10px;"
                    type="primary">添加路径</el-button>
                </div>
              </el-form-item>
            </div>
            <div v-for="(parentItem,index) in airportTableArr" :key="index" class="route-module">
              <img @click="delTableClick(index)" v-if="index != 0" class="close-img" src="../../assets/gaungbi.png" />
              <el-form :label-position="labelPosition" :inline="true" label-width="150px" size="small" class="demo-form-inline">
                <el-form-item required :label="'航程'+(index+1)">
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
                  <div class="flight-template-li" style="flex: 0 0 20%;text-align: center;"><span v-if="index == 0" style="color: #f56c6c;">*</span>运载方式</div>
                  <div class="flight-template-li" style="flex: 0 0 20%;text-align: center;"><span v-if="index == 0" style="color: #f56c6c;">*</span>航班号/卡车号</div>
                  <div class="flight-template-li" style="flex: 0 0 20%;text-align: center;">起飞时间(ETD)</div>
                  <div class="flight-template-li" style="flex: 0 0 20%;text-align: center;">到达时间(ETA)</div>
                  <div class="flight-template-li" style="flex: 0 0 10%;text-align: center;">操作</div>
                </div>
                <div v-for="(childerItem,childerIndex) in parentItem.childerTable" :key="childerIndex"
                  class="flight-template-ul-content">
                  <div class="flight-template-li" style="flex: 0 0 10%;"></div>
                  <div class="flight-template-li" style="flex: 0 0 20%;">
                    <el-select v-model="childerItem.vehicleType" @focus="vehicleFocus(index,childerIndex)" size="small" clearable placeholder="请选择" style="width: 80%;">
                      <el-option
                        v-for="item in airportOptions"
                        :key="item.name"
                        :label="item.name"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="flight-template-li" style="flex: 0 0 20%;">
                    <el-input v-model="childerItem.vehicleId" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" clearable placeholder="请输入" size="small" style="width: 80%;">
                    </el-input>
                  </div>
                  <div class="flight-template-li" style="flex: 0 0 20%;">
                    <el-time-picker v-model="childerItem.etd" value-format="HH:mm" format="HH:mm" size="small" clearable style="width: 80%;" placeholder="选择时间"></el-time-picker>
                  </div>
                  <div class="flight-template-li" style="flex: 0 0 20%;">
                    <el-time-picker v-model="childerItem.eta" value-format="HH:mm" format="HH:mm" size="small" clearable style="width: 80%;" placeholder="选择时间"></el-time-picker>
                  </div>
                  <div class="flight-template-li" size="small" style="flex: 0 0 10%;">
                    <!-- <a v-if="parentItem.childerTable.length != 10" @click="addChilder(index)" style="font-size: 18px;"><i class="el-icon-circle-plus-outline"></i></a> -->
                    <a @click="addChilder(index,childerIndex)" style="font-size: 18px;"><i class="el-icon-circle-plus-outline"></i></a>
                    <a @click="delChilder(index,childerIndex)" style="font-size: 18px;" :style="{visibility: childerIndex == 0 && parentItem.childerTable.length == 1 ? 'hidden' : 'visible'}"><i class="el-icon-delete"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div class="rest-style">
              <el-form-item label=" " label-width="150px">
                <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="航线报价" name="tab2">
          <el-form :label-position="labelPosition" :inline="true" label-width="120px" size="medium" class="demo-form-inline">
            <div v-for="(item,index) in airlineAgent" :key="index" class="route-module" style="width: 95%;margin: 0 auto;margin-bottom: 20px;">
              <img @click="delTableClick1(index,item.id)" v-if="airlineAgent.length > 1" class="close-img" src="../../assets/gaungbi.png" />
              <!-- <div>
                <el-form-item prop="name" label="航线名称">
                  <el-input placeholder="请输入航线名称" v-model="item.name" style="width: 220px;"></el-input>
                </el-form-item>
              </div> -->
              <div>
                <!-- <el-form-item required label="代理公司">
                  <el-select v-model="item.agentId" @change="agentChang" clearable placeholder="请输入代理公司" :remote-method="agentMethod" :loading="loading" filterable remote reserve-keyword style="width: 220px;">
                    <el-option
                      v-for="item in agentOpt"
                      :key="item.value"
                      :disabled="checkDaili.indexOf(item.id) > -1 ? true : false"
                      :label="item.agentName"
                      :value="item.id + '#' + item.agentName">
                    </el-option>
                  </el-select>
                </el-form-item>  // bzy-->
                <el-form-item required label="代理公司">
                  <el-select v-model="item.agentId"  clearable placeholder="请输入代理公司" :remote-method="agentMethod" :loading="loading" filterable remote reserve-keyword style="width: 220px;">
                    <el-option
                      v-for="item in agentOpt"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item required label="班期">
                  <el-col style="width: 470px;">
                  <el-select @change="dowsChange(index)" v-model="item.dows" multiple placeholder="请选择班期" clearable style="width: 468px;">
                    <el-option
                      v-for="item in dowsOpt"
                      :key="item.day"
                      :label="item.day"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  </el-col>
                      <el-col style="text-align: center;width: 40px;">
                          <button class="quanxuan" @click="allselect(index)">全选</button>
                      </el-col>
                      <el-col style="text-align: center;width: 40px;">
                          <button class="quanxuan"  @click="negation(index)">反选</button>
                      </el-col>
                </el-form-item>
              </div>
              <!-- <div>
                <el-form-item label="杂费">
                  <el-col style="width: 220px;">
                    <el-select v-model="item.incidentalName" placeholder="请选择杂费名称" clearable style="width: 220px;">
                      <el-option
                        v-for="itemOpt in otherFeesOpt"
                        :key="itemOpt.feesName"
                        :label="itemOpt.feesName"
                        :disabled="item.otherFeesArr.indexOf(itemOpt.feesName) > -1"
                        :value="itemOpt.feesName">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col style="text-align: center;width: 30px;">-</el-col>
                  <el-col style="width: 220px;">
                    <el-input v-model="item.incidentalPrice" placeholder="请输入杂费金额" style="width: 220px;"></el-input>
                  </el-col>
                  <el-col style="text-align: center;width: 120px;margin-left: 20px;">
                    <el-button @click="addFeesClick(index)" type="primary" size="medium">添加</el-button>
                  </el-col>
                </el-form-item>
              </div> -->
              <div>
                <el-form-item prop="status" label="航线状态" v-auth="['201004_B']">
                  <el-switch v-model="item.status" active-text="上架" @change="onDown(item.airlineAgentId,item.status)" inactive-text="下架" style="min-width: 216px;"></el-switch>
                </el-form-item>
                <el-form-item prop="principalId" label="航线负责人">
                  <el-select placeholder="请选择航线负责人" size="medium" disabled v-model="ruleForm.principalId" clearable  style="width: 216px; margin-right: -5px;">
                    <el-option
                      v-for="item in roleOpt"
                      :key="item.Value"
                      :label="item.name"
                      :value="item.id">
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
              <!-- <div v-if="item.otherFees.length > 0">
               <el-form-item label=" ">
                  <el-tag v-for="(tagItem,tagIndex) in item.otherFees" :key="tagIndex" @close="otherFeesClose(index,tagIndex)" type="success" closable style="margin-right: 5px;">{{tagItem.feesName}} ￥{{tagItem.fees}}</el-tag>
                </el-form-item>
              </div> -->
              <!-- <div class="title_one">
                <span style="font-size: 14px;">代理报价:</span>
                <span v-show="(radio == '1')?false:true">此为首程价格</span>
                <span v-show="(radio == '1')?true:false">此为全程价格</span>
              </div> -->
               <!-- 航班信息 -->
                <div style="display:flex;flex-direction: row;">
                  <span style="display:inline-block;width:18px;padding-top:5px;color:red;margen-right:20px">*</span>
                  <el-tabs :class="tabAllCol == 1?'tabAllRed':''" v-model="labelArry[index].activeName" type="card" @tab-click="tab=>{handleClick(tab,index)}" style="width:400px;">
                    <el-tab-pane label="散货" name="first"></el-tab-pane>
                    <el-tab-pane label="托盘" name="second"></el-tab-pane>
                    <el-tab-pane label="散货+托盘" name="third"></el-tab-pane>
                    <el-tab-pane label="MUST GO" name="fourth"></el-tab-pane>
                  </el-tabs>
                  <!-- <div v-if="'true'" style="font-size:20px;line-height:50px;">
                    <span>卡车费是否计入显示：</span>
                    <el-radio v-model="radio" @change="changeRadio" label="1">是</el-radio>
                    <el-radio v-model="radio" @change="changeRadio" label="2">否</el-radio>
                  </div> -->
                </div>
              <div v-for="(listItem,listIndex) in item.ratesList" :key="listIndex" style="background: #FFF;">
                <div v-show="labelArry[index].listShow == listIndex">
                <!-- <div style="position: relative;">
                  <el-form-item required label="代理报价">
                    <el-checkbox-group v-model="listItem.cargoType">
                      <el-checkbox :disabled="!(item.ratesList.length != 2) && (listItem.cargoType.length != 2)" v-for="(optItem,optIndex) in cargoTypeOpt" :key="optIndex" :label="optItem.value">{{optItem.name}}</el-checkbox>
                    </el-checkbox-group>
                    <img v-if="!(item.ratesList.length != 2) && (listItem.cargoType.length != 2)" @click="delTableClickImg(index,listIndex)" class="close-img" src="../../assets/gaungbi.png" style="position: absolute;top: 0;right: -50px;" />
                  </el-form-item>
                </div> -->
                <!-- <div>
                  <el-form-item label=" ">
                    <el-col style="width: 220px;">
                      <el-input v-model="listItem.vw" placeholder="请输入比重值" style="width: 220px;"></el-input>
                    </el-col>
                    <el-col style="text-align: center;width: 120px;margin-left: 20px;">
                      <el-button v-if="listItem.tableData.length != 10" @click="addAirlineVw(index,listIndex)" type="primary" size="medium">添加</el-button>
                    </el-col>
                  </el-form-item>
                </div> -->
                <!-- 航班信息 -->
                <div class="flight-template" style="margin-left: 0;width: 100%;">
                  <div class="flight-template-ul-header">
                    <div v-if="listIndex != '3'"  class="flight-template-li" style="flex: 0 0 10%;text-align: center;">比重(体积:重量)</div>
                    <div class="flight-template-li" style="flex: 0 0 10%;text-align: center;">M(最低收费)</div>
                    <div class="flight-template-li" style="flex: 0 0 10%;text-align: center;">N(小货价)</div>
                    <div class="flight-template-li" style="flex: 0 0 10%;text-align: center;">45KG+</div>
                    <div class="flight-template-li" style="flex: 0 0 10%;text-align: center;">100KG+</div>
                    <div class="flight-template-li" style="flex: 0 0 10%;text-align: center;">300KG+</div>
                    <div class="flight-template-li" style="flex: 0 0 10%;text-align: center;">500KG+</div>
                    <div class="flight-template-li" style="flex: 0 0 10%;text-align: center;">1000KG+</div>
                    <div class="flight-template-li" style="flex: 0 0 11%;text-align: center;">备注</div>
                    <div class="flight-template-li" style="flex: 0 0 9%;text-align: center;">操作</div>
                    <!-- <div class="flight-template-li" style="flex: 0 0 6%;text-align: center;">
                      <el-checkbox v-model="listItem.checkAll" @change="val=>{handleCheckAllChange(val,index,listIndex)}">全选</el-checkbox></div> -->
                  </div>
                  <div v-for="(childerItem,childerIndex) in listItem.tableData" :class="childerItem.lightItem != false?'activeChildren':''" :key="childerIndex" class="flight-template-ul-content">
                    <div v-if="listIndex != '3'" class="flight-template-li" style="flex: 0 0 10%;position: relative;">
                      <!-- <span class="apan">1:</span>
                      <el-input class="apanInput" v-model="childerItem.vwr"  size="small" style="width: 80%;" onkeyup="value=value.replace(/[^\d\.\/]/ig,'')"
                      @blur="airlineAgent[index].ratesList[listIndex].tableData = sortByKey(airlineAgent[index].ratesList[listIndex].tableData,'vwr')"></el-input> -->
                      <el-input :value="childerItem.vwr == '-1'?'':('1:'+childerItem.vwr)" :disabled="true" size="small"
                                style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 10%;">
                      <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" @blur="childerItem.ratesLevel0=Number(childerItem.ratesLevel0)" v-model="childerItem.ratesLevel0" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 10%;">
                      <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" @blur="childerItem.ratesN=Number(childerItem.ratesN)" v-model="childerItem.ratesN" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 10%;">
                      <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" @blur="childerItem.ratesLevel1=Number(childerItem.ratesLevel1)" v-model="childerItem.ratesLevel1" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 10%;">
                      <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" @blur="childerItem.ratesLevel2=Number(childerItem.ratesLevel2)" v-model="childerItem.ratesLevel2" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 10%;">
                      <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" @blur="childerItem.ratesLevel3=Number(childerItem.ratesLevel3)" v-model="childerItem.ratesLevel3" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 10%;">
                      <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" @blur="childerItem.ratesLevel4=Number(childerItem.ratesLevel4)" v-model="childerItem.ratesLevel4" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 11%;">
                      <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" @blur="childerItem.ratesLevel5=Number(childerItem.ratesLevel5)" v-model="childerItem.ratesLevel5" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div @mousemove.stop="showBZ(index,listIndex,childerIndex,)" @mouseout="showBZ(2)" class="flight-template-li" style="position: relative;flex: 0 0 10%;">
                      <el-input v-model="childerItem.remarke" clearable placeholder="请输入" maxlength="300" size="small" style="width: 80%;"></el-input>
                      <div v-if="(childerItem.remarke==undefined) || (childerItem.remarke=='undefined')?false:true" v-show="((''+childerItem.remarke).length>7 && (index === indexN) && (listIndex === listIndexN) && (childerIndex === childerIndexN))?true:false"
                      style="position: absolute;z-index: 999;line-height: 20px;max-height:70px;overflow:scroll; width: 400px;word-wrap:break-word;border:1px solid #000000;right: 130px;top: 15px;background-color: #FFF;border-radius: 8px;">
                      <span style="display:inline-block;width: 20px;"></span>{{childerItem.remarke}}</div>
                    </div>
                    <div class="flight-template-li" size="small" style="flex: 0 0 9%;">
                      <!-- <a @click="delChilder1(index,listIndex,childerIndex,'add')" style="font-size: 18px;"><i class="el-icon-circle-plus-outline"></i></a> -->
                      <a @click="delChilder1(index,listIndex,childerIndex,'ele')" style="font-size: 18px;"><i class="el-icon-delete"></i></a>
                    </div>
                    <!-- <div class="flight-template-li" style="flex: 0 0 6%;">
                      <el-checkbox v-model="childerItem.labelValue" :key="childerIndex" @change="val=>{handleCheckedCitiesChange(val,index,listIndex,childerIndex)}"></el-checkbox>
                    </div> -->
                  </div>
                </div>
                
                <!-- <div class="rest-style" style="margin-top: 20px;">
                  <el-form-item label=" ">
                    <el-button v-if="(item.ratesList.length != 2) && (listItem.cargoType.length != 2)" @click="addCargoType(index,listIndex)" type="primary">设置{{listItem.cargoType.toString() == '2' ? '散货价' : '托盘价'}}</el-button>
                    <el-button v-if="listIndex == (item.ratesList.length-1)" @click="submitData(index)" type="primary" >保存</el-button>
                  </el-form-item>
                </div> -->
                </div>
                <div v-show="labelArry[index].listShow == listIndex" class="selecting-operation" style="margin-top:10px;">
                  <!-- <button @click="selectingOperation(1)">上架</button>
                  <button @click="selectingOperation(2)">下架</button>
                  <button v-if="listItem.tableData.length != 10" @click="addAirlineVw(index,listIndex)" type="primary" size="medium">添加</button>
                  <button @click="selectingOperation(3)">删除</button>
                  <button @click="selectingOperation(4)">取消操作</button> -->
                  <el-form-item label=" " style="margin-top:10px;">
                    <el-col v-if="listIndex != '3'" style="width: 220px;">
                      <el-input v-model="vwr" onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" placeholder="请输入比重值" style="width: 220px;"></el-input>
                    </el-col>
                    <el-col style="text-align: center;width: 120px;margin-left: 20px;">
                      <!-- <el-button v-if="listItem.tableData.length != 10" @click="addAirlineVw(index,listIndex)" type="primary" size="medium">添加</el-button> -->
                      <el-button v-if="listIndex != '3'" @click="inputPK(vwr,index,listIndex)" type="primary" size="medium">添加</el-button>
                      <el-button v-if="listIndex == '3' && listItem.tableData.length < 1" @click="inputPK(vwr,index,listIndex)" type="primary" size="medium">添加</el-button>
                    </el-col>
                  </el-form-item>
                </div>
              </div>
               <!-- 卡车费 -->
                <div v-show="(fullLeg.length == 2)?false:true"   class="flight-template" style="margin-left: 0;width: 100%;">
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
                      <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" clearable placeholder="请输入" v-model="item.ratesN" size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" disabled v-model="item.minWeight" clearable placeholder="请输入" size="small"
                                style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" v-model="item.unitRates" clearable placeholder="请输入"
                                size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input v-model="item.carDows" clearable placeholder="请输入" disabled
                                size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input v-model="item.carEtd" clearable placeholder="请输入" disabled
                                size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input v-model="item.carEta" clearable placeholder="请输入" disabled
                                size="small" style="width: 80%;"></el-input>
                    </div>
                    <div class="flight-template-li" style="flex: 0 0 12%;">
                      <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" disabled v-model="item.entireCarRate" clearable placeholder="请输入"
                                size="small" style="width: 80%;"></el-input>
                    </div>
                  </div>
                </div>
                <!-- <div style="display: inline-block;background-color: white;"> -->
                <!-- <div style="display:block;background-color: white;padding-top:20px;">
                  <el-button @click="submitData(index)" type="primary" style="height:36px">保存</el-button> 
                </div> -->
            </div>
            <div class="rest-style" style="padding-left: 20px;margin-top: 20px;">
              <el-form-item label=" ">
                <el-button @click="submitData()" type="primary" style="height:36px">保存</el-button>
                <el-button v-if="false" @click="addAirlineAgent" type="primary" >添加代理</el-button>
                <el-button @click="cancelInput" type="primary" >取消</el-button>
              </el-form-item>
              
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
        tabAllCol:0,
        indexN:'',
        listIndexN:'',
        childerIndexN:'',
        airlineAgentInsertDTOS:[],
        vwr:'',
        tabName: 'tab1',
        labelArry: [
          {
            listShow: 0,
            activeName: 'first'
          }
        ],
        listShow: 0,
        activeName: 'first',
        valueStatus:false,
        isIndeterminate:false,
        id: '',
        labelPosition: 'right',
        //航线信息
        continent: '',
        ruleForm: {
          pol: '',
          pod: '',
          airCompanyCode: '',
          shortDuration: '',
          source: 0,
          longDuration: '',
          status: true,
          remark: '',
          principalId: ''
        },
        isPol: false,
        isPod: false,
        isAirCompanyCode: false,
        airportNameIndex: 0,
        rules: {
          pol: [{required: true, message: '请输入起运港机场三字码', trigger: 'change'}],
          pod: [{ required: true, message: '请输入目的港机场三字码', trigger: 'change'}],
          airCompanyCode: [{required: true, message: '请输入起航司二字码', trigger: 'change'}],
          // principalId:[{required: true, message: '请选择航线负责人', trigger: 'change'}],
          shortDuration: [{required: true, message: '起始天数', trigger: 'change'}],
          status: [{required: true, message: '请选择航线', trigger: 'change'}]
        },
        loading: false,
        polOpt: [],
        podOpt: [],
        airCompanyCodeOpt: [],
        airportOpt: [],
        airportEcheckArr: [],
        agentOpt: [],
        //航线进程
        fullLeg: [],
        airportTableArr: [
          {
            voyage_no: '',
            startRouteName: '',
            endRouteName: '',
            checkBox: [],
            childerTable: [{
              vehicleType: '',
              vehicleId: '',
              etd: '',
              eta: ''
            }]
          }
        ],
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
        otherFeesOpt: [
          {
            feesName: '制单费'
          },
          {
            feesName: '信息费'
          },
          {
            feesName: '运抵费'
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
        roleOpt: [],
        airlineAgent: [
          {
            name: '',
            agentId: '',
            agentName: '',
            dows: [],
            incidentalName: '',
            incidentalPrice: '',
            // otherFees: [],
            // otherFeesArr: [],
            status:true,
            carDows: "", //--卡车班次
            carEta: "", //--卡车ETA
            carEtd: "", //--卡车ETD
            entireCarRate: 0, //--整车费用
            minWeight: 0, //--最低起运重量
            addCarRates: 0, //--是否加卡车价格1,需要加入卡车价格，0是无需加入卡车价格
            unitRates: 0, //--单价
            ratesN: 0, //--卡车最低收费
            ratesList: [
              {
                // cargoType: 1,
                // isMustGo: 0,
                // tableData: [
                //   // {
                //     // vw: '',
                //     // vwPro: '',
                //     // cargoType: '',
                //     // ratesN: '',
                //     // ratesLevel0: '',
                //     // ratesLevel1: '',
                //     // ratesLevel2: '',
                //     // ratesLevel3: '',
                //     // ratesLevel4: '',
                //     // ratesLevel5: '',
                //   // }
                // ]
              }
            ]
          }
        ],
        checkDaili: []
      }
    },
    mounted() {
      this.id = this.$route.query.id
      this.initAirportSearchByPage()
      this.initCompanySearchByPage()
      this.initAgentList()
      this.initAirlineDetail()
      this.initAirlineRatesDetail()
      this.initRoleSearch()
    },
    methods: {
      // 取消操作，清空输入——刷新页面
      cancelInput(){
        this.$confirm("确定清除刚编辑内容吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.initAirlineDetail()
            this.initAirlineRatesDetail()
          }).catch(() => {
            console.log('取消')
          })
      },
      // 3去重1，2数据
      MoveDuplication(){
      },
      // 备注显示
      showBZ(index,listIndex,childerIndex){
              this.indexN = index
              this.listIndexN = listIndex
              this.childerIndexN = childerIndex
            },
      // 全选
      handleCheckAllChange(val,index,listIndex){
        // if(this.type == 'bulkCargo'){
          // 如果是散货
        if(val){
          for(let i=0;i<this.airlineAgent[index].ratesList[listIndex].tableData.length;i++){
              this.airlineAgent[index].ratesList[listIndex].tableData[i].labelValue = true 
             }
        }else{
          for(let i=0;i<this.airlineAgent[index].ratesList[listIndex].tableData.length;i++){
              this.airlineAgent[index].ratesList[listIndex].tableData[i].labelValue = false 
             }
        }
        
      },
      // 操作
      selectingOperation(index){
        console.log(index);
      },
      // 单选
      handleCheckedCitiesChange(val,index,listIndex,childerIndex){
        let aaa = true
        for(let i=0;i<this.airlineAgent[index].ratesList[listIndex].tableData.length;i++){
          if(this.airlineAgent[index].ratesList[listIndex].tableData[i].labelValue == false){
             aaa = false
             break
          }
        }
        this.airlineAgent[index].ratesList[listIndex].checkAll = aaa
      },
      handleClick(tab, index) {
        let arr = ['first','second',"third","fourth"]
        this.labelArry[index].activeName = arr[tab.index]
        this.labelArry[index].listShow = tab.index
      },
      negation(index){
          let depdata =  this.airlineAgent[index].dows;
          let arr2=[],arrd=[]
          for(var i=1;i<=this.dowsOpt.length;i++){
            arr2.push(''+i)
          }
          for(var i=0;i<arr2.length;i++){
              if(depdata.indexOf(arr2[i]) !== -1){
              }else{
                arrd.push(arr2[i])
              }
          }
          this.airlineAgent[index].dows=arrd
        },
        allselect(index){
          let arr2=[]
          for(var i=1;i<=this.dowsOpt.length;i++){
            arr2.push(''+i)
          }
          this.airlineAgent[index].dows=arr2
        },
      //班期排序
      dowsChange(index) {
        this.airlineAgent[index].dows.sort()
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
        this.$http.get(this.$service.airlineDetail+'?id='+this.id).then((data) => {
          if(data.code == 200){
            var data = data.data
            this.ruleForm.pol = data.pol
            this.ruleForm.pod = data.pod
            this.continent = data.continent
            this.ruleForm.airCompanyCode = data.airCompanyCode
            this.ruleForm.shortDuration = data.shortDuration
            this.source = data.source
            this.ruleForm.longDuration = data.longDuration
            this.ruleForm.status = data.status == 0 ? true : false
            this.ruleForm.remark = data.remark
            this.ruleForm.principalId = data.principalId
            var newFulleg = data.fullLeg.split(',')
            for(var i = 0; i < newFulleg.length; i++){
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
        this.$http.get(this.$service.airlineRatesDetail+'?id='+this.id).then((data) => {
          if(data.code == 200){
            var data = data.data.airlineDetailVOS
            // console.log(data);
            // this.checkDaili = [] // 用来确定是否禁用代理公司输入框、、没用
            this.airlineAgent = []
            for(var q = 0; q < data.length; q++){
              // console.log(data);
              var json = {
                name: data[q].name,
                // agentId: data[q].agentId+'#'+data[q].agentName, // bzy
                agentId: data[q].agentId, // bzy
                incidentalName: '',
                incidentalPrice: '',
                id: data[q].id,
                airlineAgentId:data[q].airlineAgentId,
                // status:(newDataLine.airlineAgentId==true?1:0),
                status:data[q].status== 1 ? true : false,
                carDows: data[q].carDows, //--卡车班次
                carEta: data[q].carEta, //--卡车ETA
                carEtd: data[q].carEtd, //--卡车ETD
                entireCarRate:  data[q].entireCarRate, //--整车费用
                minWeight:  data[q].minWeight, //--最低起运重量
                addCarRates:  data[q].addCarRates, //--是否加卡车价格1,需要加入卡车价格，0是无需加入卡车价格
                unitRates:  data[q].unitRates, //--单价
                ratesN:  data[q].ratesN, //--卡车最低收费
              }
              // this.checkDaili.push(data[q].agentId)
              json.dows = data[q].dows.split(',')
              // json.otherFees = JSON.parse(data[q].otherFees)
              // json.otherFeesArr = []
              // if(json.otherFees){
              //   for(var w = 0; w < json.otherFees.length; w++){
              //     json.otherFeesArr.push(json.otherFees[w].feesName)
              //   }
              // }
              
              if(data[q].rates){
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
                    if(json.ratesList[indexs].tableData.length>0){
                      for(let i=0;i<json.ratesList[indexs].tableData.length;i++){
                        json.ratesList[indexs].tableData[i].lightItem = false
                      }
                    }
                  }else{
                    // console.log(data[q].rates[e].isMustGo);
                    if(data[q].rates[e].isMustGo == 0){
                      json.ratesList[2].tableData = data[q].rates[e].ratesInsertDTOS
                      if(json.ratesList[2].tableData.length>0){
                        for(let i=0;i<json.ratesList[2].tableData.length;i++){
                          json.ratesList[2].tableData[i].lightItem = false
                        }
                      }
                    }else{
                      json.ratesList[3].tableData = data[q].rates[e].ratesInsertDTOS
                      if(json.ratesList[3].tableData.length>0){
                        for(let i=0;i<json.ratesList[3].tableData.length;i++){
                          json.ratesList[3].tableData[i].lightItem = false
                        }
                      }
                    }
                  }
                      // var childerJson = {}
                      // childerJson.vwr = ''
                      // var cargoType = data[q].rates[e].cargoType.toString()
                      // console.log(data[q].rates[e]);
                      // // childerJson.cargoType = cargoType.split(',')
                      // childerJson.cargoType = cargoType
                      // childerJson.isMustGo = data[q].rates[e].isMustGo
                      // for(var z = 0; z < data[q].rates[e].ratesInsertDTOS.length; z++){
                      //   data[q].rates[e].ratesInsertDTOS[z].vwr = data[q].rates[e].ratesInsertDTOS[z].vwr
                      // }
                      // childerJson.tableData = data[q].rates[e].ratesInsertDTOS
                      // json.ratesList.push(childerJson)
                }
                this.airlineAgent.push(json)
              }else{
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
                this.airlineAgent.push(json)
              }

              for(let k=0;k<this.airlineAgent.length;k++){
                this.labelArry.push({
                                    listShow: 0,
                                    activeName: 'first'})
              }
            }
            // console.log(this.airlineAgent)
          }
        })
      },
      //保存
      submitData() {
        var newFullLeg = []
        if(this.ruleForm.pol == ''){
          this.$message.error('请填写航线信息页：起运港')
          return
        }
        if(this.ruleForm.pod == ''){
          this.$message.error('请填写航线信息页：目的港')
          return
        }
        if(this.ruleForm.shortDuration === '' || this.ruleForm.longDuration === ''){
          this.$message.error('请填写航线信息页：时效')
          return
        }
        if(this.ruleForm.airCompanyCode == ''){
          this.$message.error('请填写航线信息页：航司代码')
          return
        }
            for(var i = 0; i < this.fullLeg.length; i++){
              if(!this.fullLeg[i].airportName){
                this.$message.error('请填写完整的航线路径')
                return
              }
              newFullLeg.push(this.fullLeg[i].airportName)
            }
            var tt = JSON.parse(JSON.stringify(this.ruleForm.pod))
            if(this.fullLeg[this.fullLeg.length-1].airportName != tt.split('#')[0]){
              this.$message.error('航线路径错误，目的港信息不匹配')
              return
            }
            for(var i = 0; i < this.airportTableArr.length; i++){
              for(var q = 0; q < this.airportTableArr[i].childerTable.length; q++){
                // if(!this.airportTableArr[i].childerTable[q].vehicleType){
                //   this.$message.error('航程'+(i+1)+'航班信息第'+(q+1)+'行运载方式未填写')
                //   return
                // }
                if(i == 0){
                  if(!this.airportTableArr[i].childerTable[q].vehicleType){
                    this.$message.error('航程'+(i+1)+'航班信息第'+(q+1)+'行运载方式未填写')
                    return
                  }
                  if(this.airportTableArr[i].childerTable[q].vehicleId == ''){
                    this.$message.error('航程'+(i+1)+'航班信息第'+(q+1)+'航班号/卡车号未填写')
                    return
                  }
                }
              }
            }
            var pod = JSON.parse(JSON.stringify(this.ruleForm.pod))
            var newAgent = []
            this.airlineAgentInsertDTOS = JSON.parse(JSON.stringify(this.airlineAgent))
            var lightArr = []
            for(var q = 0; q < this.airlineAgentInsertDTOS.length; q++){
              var numberK = 0
              var ag = JSON.parse(JSON.stringify(this.airlineAgentInsertDTOS[q].agentId))
              var agentName = ''
              for (let i = 0; i < this.agentOpt.length; i++) {
                if(this.agentOpt[i].id == ag){
                  agentName = this.agentOpt[i].name
                }
              }
              var newJson = {
                agentId: ag,
                agentName: agentName,
                // otherFees: JSON.stringify(this.airlineAgentInsertDTOS[q].otherFees),
                dows: this.airlineAgentInsertDTOS[q].dows.toString(),
                airlineId: this.id,           // 555        航线id  默认null
                status: (this.airlineAgentInsertDTOS[q].status==true?1:0),               //555    是否上架  0=上架 1=下架 默认为0  
                id: this.airlineAgentInsertDTOS[q].id,                //     555       航线代理id，默认null 
                carDows: this.airlineAgentInsertDTOS[q].carDows, //--卡车班次
                carEta: this.airlineAgentInsertDTOS[q].carEta, //--卡车ETA
                carEtd: this.airlineAgentInsertDTOS[q].carEtd, //--卡车ETD
                entireCarRate: this.airlineAgentInsertDTOS[q].entireCarRate, //--整车费用
                minWeight: this.airlineAgentInsertDTOS[q].minWeight, //--最低起运重量
                addCarRates: this.airlineAgentInsertDTOS[q].addCarRates, //--是否加卡车价格1,需要加入卡车价格，0是无需加入卡车价格
                unitRates: this.airlineAgentInsertDTOS[q].unitRates, //--单价
                ratesN: this.airlineAgentInsertDTOS[q].ratesN, //--卡车最低收费
                // status: this.airlineAgentInsertDTOS[q]., //--航线代理上架下架状态
                ratesList: []
              }
              if(!newJson.agentId){
                this.$message.error('航线报价模块'+(q+1)+'代理公司未填写')
                return
              }
              if(!newJson.dows){
                this.$message.error('航线报价模块'+(q+1)+'班期未填写')
                return
              }
              for(var a = 0; a < this.airlineAgentInsertDTOS[q].ratesList.length; a++){
                if(this.airlineAgentInsertDTOS[q].ratesList[a].tableData.length==0){
                    numberK++
                    continue
                  }
                var list = {}
                list.cargoType = this.airlineAgentInsertDTOS[q].ratesList[a].cargoType.toString()
                if(!list.cargoType){
                  this.$message.error('当前代理报价必选')
                  return
                }
                list.isMustGo =  this.airlineAgentInsertDTOS[q].ratesList[a].isMustGo.toString()
                list.ratesInsertDTOS = []
                for(var z = 0; z < this.airlineAgentInsertDTOS[q].ratesList[a].tableData.length; z++){
                  // console.log();
                
                  var childer = {
                    vwr: this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z].vwr,
                    ratesN: this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z].ratesN,
                    dows: this.airlineAgentInsertDTOS[q].dows.toString(),
                    remarke: this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z].remarke,     //555       价格备注
                    ratesLevel0: this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z].ratesLevel0,
                    ratesLevel1: this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z].ratesLevel1,
                    ratesLevel2: this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z].ratesLevel2,
                    ratesLevel3: this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z].ratesLevel3,
                    ratesLevel4: this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z].ratesLevel4,
                    ratesLevel5: this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z].ratesLevel5,
                  }
                  // for(let kk = 0;kk<6;kk++){
                  //   var strKK = 'ratesLevel'+kk
                  //   console.log(childer.ratesLevel1);
                  //   if(childer.strKK == ''){
                  //     return this.$message.error('存在报价全空，请检查')
                  //   }
                  // }
                  if((childer.vwr==0 || childer.vwr=='' ||childer.vwr==undefined||childer.vwr==null)&&(this.airlineAgentInsertDTOS[q].ratesList[a].isMustGo == '0')){
                    return this.$message.error('存在报价比重不合法，请检查')
                  }
                  var numberNN=0
                  // if(childer.ratesLevel0 == ''){
                  //     numberNN++
                  //   }
                  if(childer.ratesLevel1 == ''){
                      numberNN++
                    }
                  if(childer.ratesLevel2 == ''){
                      numberNN++
                    }
                  if(childer.ratesLevel3 == ''){
                      numberNN++
                    }
                  if(childer.ratesLevel4 == ''){
                      numberNN++
                    }
                  if(childer.ratesLevel5 == ''){
                      numberNN++
                    }
                  if(numberNN == 5){
                    this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z].lightItem = true
                    lightArr.push('1')
                      // this.$nextTick(
                      //   this.$set(
                      //   this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z],
                      //   "lightItem",
                      //   1
                      // )
                    // )
                    // console.log(this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z]);
                      // return this.$message.error('存在报价全空，请检查')
                  }else{
                    this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z].lightItem = false
                    // this.$set(
                    //   this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z],
                    //   "lightItem",
                    //   0
                    // );
                  }
                  list.ratesInsertDTOS.push(childer)
                }
                // return console.log(list.ratesInsertDTOS);
                newJson.ratesList.push(list)
              }
              if(numberK == 4){
                // return this.$message.error('航线报价不能为空，请检查')
                this.tabAllCol = 1
                return this.$message.error('请将价格补充完整')
              }
              newAgent.push(newJson)
            }
            // setTimeout(()=>{
            //   var objArr = JSON.parse(JSON.stringify(this.airlineAgentInsertDTOS))
            //   this.airlineAgentInsertDTOS = objArr
            // },0)
            this.airlineAgent = this.airlineAgentInsertDTOS
            if(lightArr.length>0){
              return this.$message.error('请将价格补充完整')
              // return this.$message.error('存在报价全空，请检查')
            }
            var data = {
              id: this.id,
              pol: this.ruleForm.pol,
              pod: this.ruleForm.pod,
              continent: this.continent,
              planeType: this.airportTableArr[0].childerTable[0].vehicleType,
              airCompanyCode: this.ruleForm.airCompanyCode,
              shortDuration: this.ruleForm.shortDuration,
              source:this.source,
              longDuration: this.ruleForm.longDuration,
              status: this.ruleForm.status ? 0 : 1,
              fullLeg: newFullLeg.toString(),
              legCount: this.airportTableArr.length,
              legDetail: JSON.stringify(this.airportTableArr),
              // remark: this.ruleForm.remark,
              principalId: this.ruleForm.principalId,
              airlineAgentInsertDTOS: newAgent,
            }
            // return console.log(data);
            // this.$http.post(this.$service.airlineUpdate,data).then(data => {
            this.$http.post(this.$service.airlineSave,data, {
              headers: {
                diffFlag: 1,
              },
            }).then(data => {
              if (data.code == 200) {
                this.$router.push('/routeManagement/routeManage')
                this.$message.success('保存成功')
              }else{
                console.log(data);
                this.$message.error(data.message)
              }
            })
        // var newDataLine = JSON.parse(JSON.stringify(this.airlineAgent[index]))
        // var newAgent = {}
        // var ag = JSON.parse(JSON.stringify(newDataLine.agentId))
        // newAgent.airlineId = this.id
        // newAgent.agentId = ag.split('#')[0]
        // newAgent.agentName = ag.split('#')[1]
        // newAgent.status = (newDataLine.airlineAgentId==true?1:0)
        // newAgent.dows = newDataLine.dows.toString()
        // newAgent.id = newDataLine.id
        // newAgent.carDows = newDataLine.carDows, //--卡车班次
        // newAgent.carEta = newDataLine.carEta, //--卡车ETA
        // newAgent.carEtd = newDataLine.carEtd, //--卡车ETD
        // newAgent.entireCarRate = newDataLine.entireCarRate, //--整车费用
        // newAgent.minWeight = newDataLine.minWeight, //--最低起运重量
        // newAgent.addCarRates = newDataLine.addCarRates, //--是否加卡车价格1,需要加入卡车价格，0是无需加入卡车价格
        // newAgent.unitRates = newDataLine.unitRates, //--单价
        // newAgent.ratesN = newDataLine.ratesN, //--卡车最低收费
        // // newAgent.name = newDataLine.name
        // // newAgent.otherFees = JSON.stringify(newDataLine.otherFees)
        // newAgent.ratesList = []
        // if(!newAgent.agentId){
        //   this.$message.error('当前代理公司未填写')
        //   return
        // }
        // if(!newAgent.dows){
        //   this.$message.error('当前班期必选')
        //   return
        // }
        // for(var a = 0; a < newDataLine.ratesList.length; a++){
        //   if(newDataLine.ratesList[a].tableData.length == 0){
        //     continue
        //   }
        //   var list = {}
        //   list.cargoType = newDataLine.ratesList[a].cargoType.toString()
        //   if(!list.cargoType){
        //     this.$message.error('当前代理报价必选')
        //     return
        //   }
        //   list.ratesInsertDTOS = []
        //   for(var z = 0; z < newDataLine.ratesList[a].tableData.length; z++){
        //     var childer = {
        //       vwr: newDataLine.ratesList[a].tableData[z].vwr,
        //       ratesN: newDataLine.ratesList[a].tableData[z].ratesN,
        //       dows: newDataLine.dows.toString(),
        //       ratesLevel0: newDataLine.ratesList[a].tableData[z].ratesLevel0,
        //       ratesLevel1: newDataLine.ratesList[a].tableData[z].ratesLevel1,
        //       ratesLevel2: newDataLine.ratesList[a].tableData[z].ratesLevel2,
        //       ratesLevel3: newDataLine.ratesList[a].tableData[z].ratesLevel3,
        //       ratesLevel4: newDataLine.ratesList[a].tableData[z].ratesLevel4,
        //       ratesLevel5: newDataLine.ratesList[a].tableData[z].ratesLevel5,
        //       remarke: newDataLine.ratesList[a].tableData[z].remarke,
        //     }
        //     if(childer.vwr==0 || childer.vwr=='' ||childer.vwr==undefined||childer.vwr==null){
        //         return this.$message.error('存在报价比重不合法，请检查')
        //       }
        //     var numberNN=0
        //       if(childer.ratesLevel0 == ''){
        //           numberNN++
        //         }
        //       if(childer.ratesLevel1 == ''){
        //           numberNN++
        //         }
        //       if(childer.ratesLevel2 == ''){
        //           numberNN++
        //         }
        //       if(childer.ratesLevel3 == ''){
        //           numberNN++
        //         }
        //       if(childer.ratesLevel4 == ''){
        //           numberNN++
        //         }
        //       if(childer.ratesLevel5 == ''){
        //           numberNN++
        //         }
        //       if(numberNN == 6){
        //           return this.$message.error('存在报价全空，请检查')
        //         }
        //     list.ratesInsertDTOS.push(childer)
        //   }
        //   newAgent.ratesList.push(list)
        // }

        // this.$http.post(this.$service.airlineSaveCascade,newAgent).then((data) => {
        //   if(data.code == 200){
        //     this.$message.success('航线报价保存成功')
        //     // this.$router.push('/routeManagement/routeManage')
        //     this.initAirlineRatesDetail()
        //   }else{
        //     this.$message.error(data.message)
        //   }
        // })
      },
      // 上下架
      onDown(val,type){
        // var jaon ={'airlineAgentId': val}
        // this.$http.post(this.$service.airlineUpdate,jaon).then((data) => {
        this.$http.get(this.$service.airlineUpdate+'?airlineAgentId='+val, {
          headers: {
            diffFlag: 1,
          }
        }).then((data) => {
          // console.log(data);
          if(data.code == 200){
            if(type == true){
              this.$message.success('上架成功')
            }else{
              this.$message.success('下架成功')
            }
          }else{
            this.$message.error(data.message)
          }
        })
      },
      //起始港三字码
      initAirportSearchByPage(keyWord,type) {
        if(!keyWord){
          keyWord = ''
        }
        this.$http.get(this.$service.airportSearchByPage+'?keyWord='+keyWord).then((data) => {
          this.loading = false
          if(data.code == 200){
            if(type == '起始港'){
              this.polOpt = data.data.records
            }else if(type == '目的港') {
              this.podOpt = data.data.records
            }else if(type == '航线'){
              this.airportOpt = data.data.records
            }else{
              this.polOpt = data.data.records
              this.podOpt = data.data.records
              this.airportOpt = data.data.records
            }
          }
        })
      },
      polMethod(keyWord) {
        this.loading = true
        this.initAirportSearchByPage(keyWord,'起始港')
      },
      polChange(item) {
        if(item.threeLetterCode == this.ruleForm.pod){
          return
        }
        this.ruleForm.pol = item.threeLetterCode
        this.fullLeg[0].airportName = item.threeLetterCode
        this.airportTableArr[0].startRouteName = item.threeLetterCode
      },
      polChange1(item) {
        if(item.threeLetterCode == this.ruleForm.pol){
          return
        }
        this.continent = item.continent
        this.ruleForm.pod = item.threeLetterCode
      },
      polChange2(item) {
        this.ruleForm.airCompanyCode = item.airCompanyCode
      },
      polChange3(item,index){
        if(this.airportEcheckArr.indexOf(item.threeLetterCode) > -1){
          return
        }
        this.fullLeg[index].airportName = item.threeLetterCode
        this.airportNameIndex = 0
        for(var i = 0; i < this.fullLeg.length; i++){
          if(i < (this.fullLeg.length - 1)){
            this.airportTableArr[i].startRouteName = this.fullLeg[i].airportName
            this.airportTableArr[i].endRouteName = this.fullLeg[i+1].airportName
          }
        }
      },
      polClick(type,is) {
        if(type == '1'){
          this.isPol = is
        }else if(type == '2'){
          this.isPod = is
        }else if(type == '3'){
          this.isAirCompanyCode = is
        }
      },
      podMethod(keyWord) {
        this.loading = true
        this.initAirportSearchByPage(keyWord,'目的港')
      },
      //航线路径
      airportMethod(keyWord) {
        this.loading = true
        this.initAirportSearchByPage(keyWord,'航线')
        // this.airportEcheckArr = []
        // for(var i = 0; i < this.fullLeg.length; i++){
        //   this.airportEcheckArr.push(this.fullLeg[i].airportName)
        // }
      },
      airportEcheckClick(is,index,item) {
        if(is){
          this.initAirportSearchByPage(item,'航线')
          this.airportNameIndex = index
          this.airportEcheckArr = []
          for(var i = 0; i < this.fullLeg.length; i++){
            this.airportEcheckArr.push(this.fullLeg[i].airportName)
          }
        }else{
          this.airportNameIndex = 0
        }
      },
      airportChange(e) {
        for(var i = 0; i < this.fullLeg.length; i++){
          if(i < (this.fullLeg.length - 1)){
            this.airportTableArr[i].startRouteName = this.fullLeg[i].airportName
            this.airportTableArr[i].endRouteName = this.fullLeg[i+1].airportName
          }
        }
      },
      vehicleFocus(index,childerIndex) {
        var table = this.airportTableArr[index].childerTable
        this.airportTableArr[index].checkBox = []
        for(var i = 0; i < table.length; i++){
          this.airportTableArr[index].checkBox.push(table[i].vehicleType)
        }
      },
      //航司公司
      initCompanySearchByPage(keyWord) {
        if(!keyWord){
          keyWord = ''
        }
        this.$http.get(this.$service.companySearchByPage+'?keyWord='+keyWord).then((data) => {
          this.loading = false
          if(data.code == 200){
            this.airCompanyCodeOpt = data.data.records
          }
        })
      },
      companyMethod(keyWord) {
        this.initCompanySearchByPage(keyWord)
      },
      //添加航线路径
      airportClick() {
        var json = {
          airportName: ''
        }
        this.fullLeg.push(json)
        var jsonArr = {
          voyage_no: '',
          startRouteName: '',
          endRouteName: '',
          checkBox: [],
          childerTable: [{
            vehicleType: '',
            vehicleId: '',
            etd: '',
            eta: ''
          }]
        }
        this.airportTableArr.push(jsonArr)
      },
      //添加航班信息
      addChilder(index) {
        var json = {
          vehicleType: '',
          vehicleId: '',
          etd: '',
          eta: ''
        }
        this.airportTableArr[index].childerTable.push(json)
      },
      //删除航班信息
      delChilder(index, childerIndex) {
        this.airportTableArr[index].childerTable.splice(childerIndex, 1)
      },
      //删除代理报价
      // delChilder1(index, listIndex ,childerIndex) {
      //   this.airlineAgent[index].ratesList[listIndex].tableData.splice(childerIndex, 1)
      // },

      // 判重复输入
      inputPK(val,index,listIndex){ //airlineAgent
        // console.log(val,index,listIndex);
        this.tabAllCol = 0
        var value = val
        if((Number(val)<60 || Number(val)>1500) && (val != '')){
          return this.$message.error('请添加60-1500的比例数值')
        }
        var numberType = 0
        if(val != ''){
          // console.log((this.airlineAgent)[index].ratesList)
          var arrCopy = {arr:[]}
          arrCopy.arr = (this.airlineAgent)[index].ratesList
          var stringObj = JSON.parse(JSON.stringify(arrCopy.arr))
            if((listIndex === 0 || listIndex === 1) && (stringObj[2].tableData.length>0)){ //isMustGo
              for (let j = 0; j < stringObj[2].tableData.length; j++) {
                if(stringObj[2].tableData[j].vwr == val){
                  value = ''
                  numberType = 1
                }
              }
            }
            if((listIndex === 2) && ((stringObj[0].tableData.length>0) || (stringObj[1].tableData.length>0))){
              if(stringObj[1].tableData.length>0){
                for (let j = 0; j < stringObj[1].tableData.length; j++) {
                    if(stringObj[1].tableData[j].vwr == val){
                      value = ''
                      numberType = 3
                    }
                }
              }
              if(stringObj[0].tableData.length>0){
                for (let j = 0; j < stringObj[0].tableData.length; j++) {
                    if(stringObj[0].tableData[j].vwr == val){
                      value = ''
                      numberType = 2
                    }
                }
              }
          }
          if(value === ''){
            this.vwr = value
            if(numberType == 1){
              return this.$message.error('散货+托盘已存在1:'+val+'价格,请重新输入')
            }else if(numberType == 2){
              return this.$message.error('已存在散货1:'+val+'价格,请重新输入')
            }else if(numberType == 3){
              return this.$message.error('已存在托盘1:'+val+'价格,请重新输入')
            }
          }
        }else{
          var arrCopy = {arr:[]}
          arrCopy.arr = (this.airlineAgent)[index].ratesList
          var stringObj = JSON.parse(JSON.stringify(arrCopy.arr))
            if((listIndex === 0 || listIndex === 1) && (stringObj[2].tableData.length>0)){ //isMustGo
              for (let j = 0; j < stringObj[2].tableData.length; j++) {
                if(stringObj[2].tableData[j].vwr == -1){
                  value = ''
                  numberType = 1
                }
              }
            }
            if((listIndex === 2) && ((stringObj[0].tableData.length>0) || (stringObj[1].tableData.length>0))){
              if(stringObj[1].tableData.length>0){
                for (let j = 0; j < stringObj[1].tableData.length; j++) {
                    if(stringObj[1].tableData[j].vwr == -1){
                      value = ''
                      numberType = 3
                    }
                }
              }
              if(stringObj[0].tableData.length>0){
                for (let j = 0; j < stringObj[0].tableData.length; j++) {
                    if(stringObj[0].tableData[j].vwr == -1){
                      value = ''
                      numberType = 2
                    }
                }
              }
          }
          if(value === ''){
            this.vwr = value
            if(numberType == 1){
              return this.$message.error('散货+托盘已存在比重为空,请重新输入')
            }else if(numberType == 2){
              return this.$message.error('已存在散货比重为空,请重新输入')
            }else if(numberType == 3){
              return this.$message.error('已存在托盘比重为空,请重新输入')
            }
          }
        }
        this.vwr = value
        this.addAirlineVw(index,listIndex)
      },
      delChilder1(index, listIndex ,childerIndex,type) {
        if(type == 'add'){
            var json = {
            // vw: this.airlineAgent[index].ratesList[listIndex].vw,
            vwr: -1,
            vwPro: '',
            lightItem: false,
            // vwPro: '1:'+this.airlineAgent[index].ratesList[listIndex].vw,
            cargoType: '',
            ratesN: '',
            ratesLevel0: '',
            ratesLevel1: '',
            ratesLevel2: '',
            ratesLevel3: '',
            ratesLevel4: '',
            ratesLevel5: '',
          }
          this.airlineAgent[index].ratesList[listIndex].tableData.push(json)
          // this.airlineAgent[index].ratesList[listIndex].vwr = 0
          this.sortByKey(this.airlineAgent[index].ratesList[listIndex].tableData,'vwr')
          // this.airlineAgent[index].ratesList[listIndex].ratesInsertDTOS = this.unique(this.airlineAgent[index].ratesList[listIndex].ratesInsertDTOS)
        }else{
          this.airlineAgent[index].ratesList[listIndex].tableData.splice(childerIndex, 1)
        }
      },
      delTableClick(index) {
        this.airportTableArr.splice(index,1)
        this.fullLeg.splice(index,1)
        for(var i = 0; i < this.fullLeg.length; i++){
          if(i < (this.fullLeg.length - 1)){
            this.airportTableArr[i].startRouteName = this.fullLeg[i].airportName
            this.airportTableArr[i].endRouteName = this.fullLeg[i+1].airportName
          }
        }
      },
      delTableClick1(index,id) {
        if(id){
          this.$confirm("确定删除这条代理报价?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            // this.$http.delete(this.$service.airlineDeleteCascade+'?airlineId='+this.id+'&relationId='+id).then((data) => {
            //   if(data.code == 200){
            //     this.airlineAgent.splice(index,1)
            //     this.$message.success('删除航线报价成功')
            //   }else{
            //     this.$message.error('删除航线报价失败')
            //   }
            // })
            this.airlineAgent.splice(index,1)
          }).catch(() => {
            console.log('取消')
          })
        }else{
          this.airlineAgent.splice(index,1)
        }
      },
      remoteMethod(query) {
        // console.log(query)
      },
      //添加杂费
      addFeesClick(index) {
        var reg = /(^[1-9][0-9]{0,5}$)|(^[0-9]{0,5}[\.][0-9]{1,2}$)/
        if(!this.airlineAgent[index].incidentalName){
          this.$message.error('请选择杂费名称')
          return
        }else if(!this.airlineAgent[index].incidentalPrice){
          this.$message.error('请输入杂费金额')
          return
        }else if(!reg.test(this.airlineAgent[index].incidentalPrice)){
          this.$message.error('金额范围是整数最大六位数，小数保留两位')
          return
        }

        var json = {
          feesName: this.airlineAgent[index].incidentalName,
          fees: this.airlineAgent[index].incidentalPrice
        }
        this.airlineAgent[index].otherFees.push(json)
        this.airlineAgent[index].otherFeesArr.push(json.feesName)
        this.airlineAgent[index].incidentalName = ''
        this.airlineAgent[index].incidentalPrice = ''
      },
      //删除杂费
      otherFeesClose(index,tagIndex) {
        this.airlineAgent[index].otherFees.splice(tagIndex,1)
        this.airlineAgent[index].otherFeesArr.splice(tagIndex,1)
      },
      //代理公司
      initAgentList(agentName) {
        
        if(agentName == '' || agentName == undefined){
          var data = ''
        }else{
          var data = ''+agentName
        }
        this.$http.post(this.$service.agentListAll,data).then((data) => {
          this.loading = false
          if(data.code == 200){
            this.agentOpt = data.data
          }
        })
      },
      agentMethod(agentName) {
        this.initAgentList(agentName)
      },
      // agentChang() {
      //   this.checkDaili = []
      //   for(var i = 0; i < this.airlineAgent.length; i++){
      //     var qa = JSON.parse(JSON.stringify(this.airlineAgent[i].agentId))  // bzy
      //     if(qa.split('#')[0]){
      //       this.checkDaili.push(Number(qa.split('#')[0]))
      //     }
      //   }
      // },
      //下一步
      submitForm(ruleForm) {
        this.$refs[ruleForm].validate((valid,object) => {
          if (valid) {
            var newFullLeg = []
            for(var i = 0; i < this.fullLeg.length; i++){
              if(!this.fullLeg[i].airportName){
                this.$message.error('请填写完整的航线路径')
                return
              }
              newFullLeg.push(this.fullLeg[i].airportName)
            }
            var tt = JSON.parse(JSON.stringify(this.ruleForm.pod))
            if(this.fullLeg[this.fullLeg.length-1].airportName != tt.split('#')[0]){
              this.$message.error('航线路径错误，目的港信息不匹配')
              return
            }
            for(var i = 0; i < this.airportTableArr.length; i++){
              for(var q = 0; q < this.airportTableArr[i].childerTable.length; q++){
                // if(!this.airportTableArr[i].childerTable[q].vehicleType){
                //   this.$message.error('航程'+(i+1)+'航班信息第'+(q+1)+'行运载方式未填写')
                //   return
                // }
                if(i == 0){
                  if(!this.airportTableArr[i].childerTable[q].vehicleType){
                    this.$message.error('航程'+(i+1)+'航班信息第'+(q+1)+'行运载方式未填写')
                    return
                  }
                  if(this.airportTableArr[i].childerTable[q].vehicleId == ''){
                    this.$message.error('航程'+(i+1)+'航班信息第'+(q+1)+'航班号/卡车号未填写')
                    return
                  }
                }
              }
            }
            var pod = JSON.parse(JSON.stringify(this.ruleForm.pod))
            var newAgent = []
            this.airlineAgentInsertDTOS = JSON.parse(JSON.stringify(this.airlineAgent))
            for(var q = 0; q < this.airlineAgentInsertDTOS.length; q++){
              var ag = JSON.parse(JSON.stringify(this.airlineAgentInsertDTOS[q].agentId))
              var agentName = ''
              for (let i = 0; i < this.agentOpt.length; i++) {
                if(this.agentOpt[i].id == ag){
                  agentName = this.agentOpt[i].name
                }
              }
              var newJson = {
                agentId: ag,
                agentName: agentName,
                // otherFees: JSON.stringify(this.airlineAgentInsertDTOS[q].otherFees),
                dows: this.airlineAgentInsertDTOS[q].dows.toString(),
                airlineId: this.id,           // 555        航线id  默认null
                status: (this.airlineAgentInsertDTOS[q].status==true?1:0),               //555    是否上架  0=上架 1=下架 默认为0  
                id: this.airlineAgentInsertDTOS[q].id,                //     555       航线代理id，默认null 
                carDows: this.airlineAgentInsertDTOS[q].carDows, //--卡车班次
                carEta: this.airlineAgentInsertDTOS[q].carEta, //--卡车ETA
                carEtd: this.airlineAgentInsertDTOS[q].carEtd, //--卡车ETD
                entireCarRate: this.airlineAgentInsertDTOS[q].entireCarRate, //--整车费用
                minWeight: this.airlineAgentInsertDTOS[q].minWeight, //--最低起运重量
                addCarRates: this.airlineAgentInsertDTOS[q].addCarRates, //--是否加卡车价格1,需要加入卡车价格，0是无需加入卡车价格
                unitRates: this.airlineAgentInsertDTOS[q].unitRates, //--单价
                ratesN: this.airlineAgentInsertDTOS[q].ratesN, //--卡车最低收费
                // status: this.airlineAgentInsertDTOS[q]., //--航线代理上架下架状态
                ratesList: []
              }
              if(!newJson.agentId){
                this.$message.error('航线报价模块'+(q+1)+'代理公司未填写')
                return
              }
              if(!newJson.dows){
                this.$message.error('航线报价模块'+(q+1)+'班期未填写')
                return
              }
              for(var a = 0; a < this.airlineAgentInsertDTOS[q].ratesList.length; a++){
                var numberNull = 0 //判断同类型下是否有两个空
                if(this.airlineAgentInsertDTOS[q].ratesList[a].tableData.length==0){
                    continue
                  }
                var list = {}
                list.cargoType = this.airlineAgentInsertDTOS[q].ratesList[a].cargoType.toString()
                if(!list.cargoType){
                  this.$message.error('当前代理报价必选')
                  return
                }
                list.isMustGo =  this.airlineAgentInsertDTOS[q].ratesList[a].isMustGo.toString()
                list.ratesInsertDTOS = []
                for(var z = 0; z < this.airlineAgentInsertDTOS[q].ratesList[a].tableData.length; z++){
                  // console.log();
                
                  var childer = {
                    vwr: this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z].vwr,
                    ratesN: this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z].ratesN,
                    dows: this.airlineAgentInsertDTOS[q].dows.toString(),
                    remarke: this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z].remarke,     //555       价格备注
                    ratesLevel0: this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z].ratesLevel0,
                    ratesLevel1: this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z].ratesLevel1,
                    ratesLevel2: this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z].ratesLevel2,
                    ratesLevel3: this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z].ratesLevel3,
                    ratesLevel4: this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z].ratesLevel4,
                    ratesLevel5: this.airlineAgentInsertDTOS[q].ratesList[a].tableData[z].ratesLevel5,
                  }
                  // for(let kk = 0;kk<6;kk++){
                  //   var strKK = 'ratesLevel'+kk
                  //   console.log(childer.ratesLevel1);
                  //   if(childer.strKK == ''){
                  //     return this.$message.error('存在报价全空，请检查')
                  //   }
                  // }
                  // if((childer.vwr==0 || childer.vwr=='' ||childer.vwr==undefined||childer.vwr==null)&&(this.airlineAgentInsertDTOS[q].ratesList[a].isMustGo == '0')){
                  //   console.log(this.airlineAgentInsertDTOS[q].ratesList[a].isMustGo);
                  //   return this.$message.error('存在报价比重不合法，请检查')
                  // }
                  if((childer.vwr === -1)&&this.airlineAgentInsertDTOS[q].ratesList[a].isMustGo == '0'){
                    numberNull++
                    if(numberNull == 2){
                      return this.$message.error('同类型下存在两个空比重，请检查')
                    }
                  }
                  var numberNN=0
                  // if(childer.ratesLevel0 == ''){
                  //     numberNN++
                  //   }
                  if(childer.ratesLevel1 == ''){
                      numberNN++
                    }
                  if(childer.ratesLevel2 == ''){
                      numberNN++
                    }
                  if(childer.ratesLevel3 == ''){
                      numberNN++
                    }
                  if(childer.ratesLevel4 == ''){
                      numberNN++
                    }
                  if(childer.ratesLevel5 == ''){
                      numberNN++
                    }
                  if(numberNN == 5){
                      this.tabName = 'tab2'
                      return this.$message.error('请将价格补充完整')
                      // return this.$message.error('存在报价全空，请检查')
                    }
                  list.ratesInsertDTOS.push(childer)
                }
                // return console.log(list.ratesInsertDTOS);
                newJson.ratesList.push(list)
              }
              newAgent.push(newJson)
            }
            var data = {
              id: this.id,
              pol: this.ruleForm.pol,
              pod: this.ruleForm.pod,
              continent: this.continent,
              planeType: this.airportTableArr[0].childerTable[0].vehicleType,
              airCompanyCode: this.ruleForm.airCompanyCode,
              shortDuration: this.ruleForm.shortDuration,
              source:this.source,
              longDuration: this.ruleForm.longDuration,
              status: this.ruleForm.status ? 0 : 1,
              fullLeg: newFullLeg.toString(),
              legCount: this.airportTableArr.length,
              legDetail: JSON.stringify(this.airportTableArr),
              // remark: this.ruleForm.remark,
              principalId: this.ruleForm.principalId,
              airlineAgentInsertDTOS: newAgent,
            }
            // return console.log(data);
            // this.$http.post(this.$service.airlineUpdate,data).then(data => {
            this.$http.post(this.$service.airlineSave,data, {
              headers: {
                diffFlag: 1,
              },
            }).then(data => {
              if (data.code == 200) {
                this.$router.push('/routeManagement/routeManage')
                this.$message.success('保存成功')
              }else{
                this.$message.error(data.message)
              }
            })

          } else {
            setTimeout(()=>{
              var isError= document.getElementsByClassName("is-error");
              if(isError[0].querySelector('input')){
                isError[0].querySelector('input')
              }else if(isError[0].querySelector('textarea')){
                isError[0].querySelector('textarea').focus()
              }
            },100);
            return false;
          }
        })
      },
      //上一步
      activeClick() {
        this.active = 1
      },
      //添加代理
      addAirlineAgent() {
        var json = {
          id: '',
          name: '',
          agentId: '',
          agentName: '',
          dows: [],
          incidentalName: '',
          incidentalPrice: '',
          // otherFees: [],
          // otherFeesArr: [],
          ratesList: [
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
        }
        this.airlineAgent.push(json)
      },
      //添加比重
      addAirlineVw(index,listIndex) {
        if(listIndex != '3'){
          if(this.vwr == ''){
            // console.log(this.airlineAgent[index].ratesList[listIndex].tableData);
            for(var i = 0; i < this.airlineAgent[index].ratesList[listIndex].tableData.length; i++){
              if(this.airlineAgent[index].ratesList[listIndex].tableData[i].vwr == -1){
                this.$message.error('本类型只允许一条空比重，请重新输入')
                return
              }
            }
          }
          for(var i = 0; i < this.airlineAgent[index].ratesList[listIndex].tableData.length; i++){
            if(this.airlineAgent[index].ratesList[listIndex].tableData[i].vwr == this.vwr){
              this.$message.error('比重已存在，请重新输入')
              return
            }
          }
        }else{
          this.vwr = -1
        }
        var vwrCope = this.vwr
        if(this.vwr == ''){
          vwrCope = -1
        }
        var json = {
          vwr: vwrCope,
          vwPro: '',
          lightItem: false,
          cargoType: '',
          ratesN: 0,
          remarke:'',
          ratesLevel0: 0,
          ratesLevel1: 0,
          ratesLevel2: 0,
          ratesLevel3: 0,
          ratesLevel4: 0,
          ratesLevel5: 0,
        }
        this.airlineAgent[index].ratesList[listIndex].tableData.push(json)
        // console.log(this.airlineAgent[index].ratesList[listIndex].tableData);
        this.vwr = ''
        this.sortByKey(this.airlineAgent[index].ratesList[listIndex].tableData,'vwr')
        // this.airlineAgent[index].ratesList[listIndex].tableData = this.unique(this.airlineAgent[index].ratesList[listIndex].tableData)
      },
      //数组对象排序
      sortByKey(array,key) {
        return array.sort(function(a,b) {
          var x = Number(a[key])
          var y = Number(b[key])
          var num = x < y ? 1 : 0
          return x > y ? num : -1
        })
      },
      //数组去重
      unique(arr) {
        const res = new Map();
        return arr.filter((a) => !res.has(a.vw) && res.set(a.vw, 1))
      },
      //删除代理报价
      delTableClickImg(index,listIndex) {
        this.airlineAgent[index].ratesList.splice(listIndex,1)
      },
      //添加代理报价
      addCargoType(index,listIndex){
        var num = ''
        if(this.airlineAgent[index].ratesList[0].cargoType[0] == '1'){
          num = '2'
        }else{
          num = '1'
        }
        var json = {
          cargoType: [num],
          vw: '',
          tableData: []
        }
        this.airlineAgent[index].ratesList.push(json)
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
    /deep/ .el-form{
      background-color: transparent;
    }
    /deep/ .el-form--inline .el-form-item{
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

  .activeChildren{
    background: #ffa8a8;
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
  .close-img{
    width: 40px;
    height: 40px;
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }
  .quanxuan{
      cursor: pointer;
      width: 100%;
      height: 34px;
      background-color: white;
      font-size: 8px;
      color: #909399;
      border: 1px solid #e5e5e5;
    }
  .selecting-operation{
    margin: 10px 0;
    text-align: right;
  }
  /deep/ .tabAllRed .el-tabs__nav{
    border: 1px solid red;
  }
  .selecting-operation button{
    display: inline-block;
    width: 60px;
    // height: 20px;
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
  .apan{
    display: block;
    height: 30px;
    line-height: 31px;
    background: #FFF;
    position: absolute;
    z-index: 3;
    left: 12px;
    top:5px;
    
    // border:1px solid #e5e5e5 ;
    // border-right: 0;
  }
  // .apanInput{
  //   border-left: 0 !important;
  //   padding-left: 0 !important; 
  // }
</style>
