<template>
  <div class="content-wrapper">
    <div class="content">
      <el-steps class="stpes-class" :active="active" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="航线价格"></el-step>
      </el-steps>

      <!-- 基本信息 -->
      <el-form v-show="active == 1" :model="ruleForm" ref="ruleForm" :rules="rules" :label-position="labelPosition" :inline="true" label-width="150px" size="medium" class="demo-form-inline">
        <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;">航线信息</div>
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
                :label="item.threeLetterCode"
                :value="item.threeLetterCode+'#'+item.continent">
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
          <el-form-item prop="shortestPrescription" label="时效">
            <el-col style="width: 98px;">
              <el-input v-model="ruleForm.shortestPrescription" onkeyup="value=value.replace(/[^\d]/g, '')" size="medium" placeholder="起始天数"></el-input>
            </el-col>
            <el-col style="text-align: center;width: 20px;">-</el-col>
            <el-col style="width: 98px;">
              <el-input v-model="ruleForm.longestPrescription" onkeyup="value=value.replace(/[^\d]/g, '')" size="medium" placeholder="结束天数"></el-input>
            </el-col>
          </el-form-item>
        </div>
        <div >
          <!-- <el-form-item prop="status" label="航线状态">
            <el-switch v-model="ruleForm.status" active-text="上架" inactive-text="下架" style="min-width: 216px;"></el-switch>
          </el-form-item> -->
          <el-form-item prop="principalId" label="航线负责人">
            <el-select placeholder="请选择航线负责人" size="medium" :disabled="!showButton" v-model="ruleForm.principalId" clearable style="width: 216px; margin-right: -5px;">
              <el-option
                v-for="item in roleOpt"
                :key="item.Value"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <!-- <div>
          <el-form-item label="备注">
            <el-input v-model="ruleForm.remark" style="width: 596px;" placeholder="请输入备注(最多输入300字符)" type="textarea"
              maxlength="300" show-word-limit></el-input>
          </el-form-item>
        </div> -->
        <div style="font-size: 18px;font-weight: 100;margin-bottom: 10px;">航线进程</div>
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
                          <li v-if="airportOpt.length > 0"
                            :class="{'is-disabled': airportEcheckArr.indexOf(item.threeLetterCode) > -1}"
                            @mousedown="polChange3(item,index)" v-for="(item,chidlerIndex) in airportOpt"
                            :key="chidlerIndex"
                            class="el-select-dropdown__item">
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
              <el-button v-if="fullLeg.length != 10" @click="airportClick" style="height: 36px;line-height: 36px;padding: 0;margin-left: 10px;" type="primary">添加路径</el-button>
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
                <el-input v-model="childerItem.vehicleId" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
              </div>
              <div class="flight-template-li" style="flex: 0 0 20%;">
                <el-time-picker v-model="childerItem.etd" value-format="HH:mm" format="HH:mm" size="small" clearable style="width: 80%;" placeholder="选择时间"></el-time-picker>
              </div>
              <div class="flight-template-li" style="flex: 0 0 20%;">
                <el-time-picker v-model="childerItem.eta" value-format="HH:mm" format="HH:mm" size="small" clearable style="width: 80%;" placeholder="选择时间"></el-time-picker>
              </div>
              <div class="flight-template-li" size="small" style="flex: 0 0 10%;">
                <a :style="{visibility: parentItem.childerTable.length > 9 ? 'hidden' : 'visible'}" @click="addChilder(index)" style="font-size: 18px;"><i class="el-icon-circle-plus-outline"></i></a>
                <a @click="delChilder(index,childerIndex)" style="font-size: 18px;" :style="{visibility: childerIndex == 0 && parentItem.childerTable.length == 1 ? 'hidden' : 'visible'}"><i class="el-icon-delete"></i></a>
              </div>
            </div>
          </div>
        </div>
        <div class="rest-style">
          <el-form-item label=" " label-width="150px">
            <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
          </el-form-item>
        </div>
      </el-form>

      <!-- 航线价格 -->
      <el-form v-show="active == 2" :label-position="labelPosition" :inline="true" label-width="150px" size="medium" class="demo-form-inline">
      <!-- <el-form v-show="active == true" :label-position="labelPosition" :inline="true" label-width="150px" size="medium" class="demo-form-inline"> -->
        <div v-for="(item,index) in airlineAgentInsertDTOS" :key="index" class="route-module" style="margin-left: 0;width: 90%;padding-bottom: 0;">
          <img @click="delTableClick1(index)"  v-if="airlineAgentInsertDTOS.length > 1" class="close-img" src="../../assets/gaungbi.png" />
          <!-- <div>
            <el-form-item prop="name" label="航线名称">
              <el-input placeholder="请输入航线名称" v-model="item.name" style="width: 220px;"></el-input>
            </el-form-item>
          </div> -->
          <div>
            <el-form-item required label="代理公司">
              <el-select v-model="item.agentId" @change="agentChang" clearable placeholder="请输入代理公司" :remote-method="agentMethod" :loading="loading" filterable remote reserve-keyword style="width: 220px;">
                <el-option
                  v-for="item in agentOpt"
                  :key="item.value"
                  :label="item.agentName"
                  :disabled="checkDaili.indexOf(item.id) > -1 ? true : false"
                  :value="item.id + '#' + item.agentName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item required label="班期">
              <el-select @change="dowsChange(index)" v-model="item.dows" multiple placeholder="请选择班期" clearable style="width: 468px;">
                <el-option
                  v-for="item in dowsOpt"
                  :key="item.day"
                  :label="item.day"
                  :value="item.value">
                </el-option>
              </el-select>
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
          <div v-if="item.otherFees.length > 0">
           <el-form-item label=" ">
              <el-tag v-for="(tagItem,tagIndex) in item.otherFees" :key="tagIndex" @close="otherFeesClose(index,tagIndex)" type="success" closable style="margin-right: 5px;">{{tagItem.feesName}} ￥{{tagItem.fees}}</el-tag>
            </el-form-item>
          </div>
           <div style="display:flex">
             <span style="display:inline-block;width:18px;padding-top:5px;color:red;margen-right:20px">*</span>
              <el-tabs :class="tabAllCol == 1?'tabAllRed':''" v-model="labelArry[index].activeName" type="card" @tab-click="tab=>{handleClick(tab,index)}" style="width:400px;">
                <el-tab-pane label="散货" name="name1"></el-tab-pane>
                <el-tab-pane label="托盘" name="name2"></el-tab-pane>
                <el-tab-pane label="散货+托盘" name="name3"></el-tab-pane>
                <el-tab-pane label="MUST GO" name="name4"></el-tab-pane>
              </el-tabs>
            </div>
          <div v-for="(listItem,listIndex) in item.ratesList" :key="listIndex">
            <div v-show="labelArry[index].listShow == listIndex">
           
            <!-- <div style="position: relative;">
              <el-form-item required label="代理报价">
                <el-checkbox-group v-model="listItem.cargoType">
                  <el-checkbox :disabled="!(item.ratesList.length != 2) && (listItem.cargoType.length != 2)" v-for="(optItem,optIndex) in cargoTypeOpt" :key="optIndex" :label="optItem.value">{{optItem.name}}</el-checkbox>
                </el-checkbox-group>
                <img v-if="!(item.ratesList.length != 2) && (listItem.cargoType.length != 2)" @click="delTableClickImg(index,listIndex)" class="close-img" src="../../assets/gaungbi.png" style="position: absolute;top: 0;right: -50px;" />
              </el-form-item>
            </div>
            <div>
              <el-form-item label=" ">
                <el-col style="width: 220px;">
                  <el-input v-model="listItem.vw" placeholder="请输入比重值" style="width: 220px;"></el-input>
                </el-col>
                <el-col style="text-align: center;width: 120px;margin-left: 20px;">
                  <el-button v-if="listItem.ratesInsertDTOS.length != 10" @click="addAirlineVw(index,listIndex)" type="primary" size="medium">添加</el-button>
                </el-col>
              </el-form-item>
            </div> -->
            <!-- 航班信息 -->
            <div class="flight-template" style="margin-left: 0;width: 100%;">
              <div class="flight-template-ul-header">
                <div v-if="listIndex != '3'"  class="flight-template-li" style="flex: 0 0 10%;text-align: center;">比重(体积:重量)</div>
                <div class="flight-template-li" style="flex: 0 0 11%;text-align: center;">M(最低收费)</div>
                <div class="flight-template-li" style="flex: 0 0 11%;text-align: center;">N(小货价)</div>
                <div class="flight-template-li" style="flex: 0 0 10.5%;text-align: center;">45KG+</div>
                <div class="flight-template-li" style="flex: 0 0 10.5%;text-align: center;">100KG+</div>
                <div class="flight-template-li" style="flex: 0 0 10.5%;text-align: center;">300KG+</div>
                <div class="flight-template-li" style="flex: 0 0 10.5%;text-align: center;">500KG+</div>
                <div class="flight-template-li" style="flex: 0 0 10.5%;text-align: center;">1000KG+</div>
                <div class="flight-template-li" style="flex: 0 0 9.5%;text-align: center;">备注</div>
                <div class="flight-template-li" style="flex: 0 0 6%;text-align: center;">
                  <a v-if="listIndex != '3'" @click="delChilder1(index,listIndex,childerIndex,'add')" style="font-size: 18px;"><i class="el-icon-circle-plus-outline"></i></a>
                  <a v-if="listIndex == '3' && listItem.ratesInsertDTOS.length < 1" @click="delChilder1(index,listIndex,childerIndex,'add')" style="font-size: 18px;"><i class="el-icon-circle-plus-outline"></i></a>
                </div>
              </div>
              <div v-for="(childerItem,childerIndex) in listItem.ratesInsertDTOS" :key="childerIndex" :class="childerItem.lightItem === 1?'activeChildren':''" class="flight-template-ul-content"> 
                <!-- <div v-if="listIndex != '3'"  class="flight-template-li" style="flex: 0 0 10%;">
                  <el-input v-model="childerItem.vwPro" @change="childerItem.vwr = Number((childerItem.vwPro).slice(2))" @input="val=>{childerItem.vwPro = inputXZ(val)}"
                  @blur="airlineAgentInsertDTOS[index].ratesList[listIndex].ratesInsertDTOS = sortByKey(airlineAgentInsertDTOS[index].ratesList[listIndex].ratesInsertDTOS,'vwr'),repetition(airlineAgentInsertDTOS[index].ratesList[listIndex].ratesInsertDTOS,childerItem.vwr)" placeholder="1:167"  size="small" style="width: 80%;"></el-input>
                </div> -->
                <div v-if="listIndex != '3'"  class="flight-template-li" style="flex: 0 0 10%;">
                  <el-input v-model="childerItem.vwPro" @change="childerItem.vwr = Number((childerItem.vwPro).slice(2))" @input="val=>{childerItem.vwPro = inputXZ(val)}" @blur="val=>{childerItem.vwr = inputPK(childerItem.vwr,index,listIndex,childerIndex) }" 
                  placeholder="1:167" clearable size="small" style="width: 80%;"></el-input>
                </div>
                <div class="flight-template-li" style="flex: 0 0 11%;">
                  <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" @blur="childerItem.ratesLevel0=Number(childerItem.ratesLevel0)" v-model="childerItem.ratesLevel0" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                </div>
                <div class="flight-template-li" style="flex: 0 0 11%;">
                  <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" @blur="childerItem.ratesN=Number(childerItem.ratesN)" v-model="childerItem.ratesN" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                </div>
                <div class="flight-template-li" style="flex: 0 0 10.5%;">
                  <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" @blur="childerItem.ratesLevel1=Number(childerItem.ratesLevel1)" v-model="childerItem.ratesLevel1" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                </div>
                <div class="flight-template-li" style="flex: 0 0 10.5%;">
                  <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" @blur="childerItem.ratesLevel2=Number(childerItem.ratesLevel2)" v-model="childerItem.ratesLevel2" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                </div>
                <div class="flight-template-li" style="flex: 0 0 10.5%;">
                  <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" @blur="childerItem.ratesLevel3=Number(childerItem.ratesLevel3)" v-model="childerItem.ratesLevel3" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                </div>
                <div class="flight-template-li" style="flex: 0 0 10.5%;">
                  <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" @blur="childerItem.ratesLevel4=Number(childerItem.ratesLevel4)" v-model="childerItem.ratesLevel4" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                </div>
                <div class="flight-template-li" style="flex: 0 0 10.5%;">
                  <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" @blur="childerItem.ratesLevel5=Number(childerItem.ratesLevel5)" v-model="childerItem.ratesLevel5" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                </div>
                <div class="flight-template-li" style="flex: 0 0 9.5%;">
                  <el-input  v-model="childerItem.remarke" maxlength="300" clearable placeholder="请输入" size="small" style="width: 80%;"></el-input>
                </div>
                <div class="flight-template-li" size="small" style="flex: 0 0 6%;">
                  <a v-show="listIndex != '3' && childerIndex==listItem.ratesInsertDTOS.length-1" @click="delChilder1(index,listIndex,childerIndex,'add')" style="font-size: 18px;"><i class="el-icon-circle-plus-outline"></i></a>
                  <a @click="delChilder1(index,listIndex,childerIndex,'ele')" style="font-size: 18px;"><i class="el-icon-delete"></i></a>
                  <!-- <a  v-else style="width: 18px;"></a> -->
                </div>
              </div>
            </div>
            <!-- <div v-if="(item.ratesList.length != 2) && (listItem.cargoType.length != 2)" class="rest-style" style="margin-top: 20px;">
              <el-form-item label=" " label-width="150px">
                <el-button @click="addCargoType(index,listIndex)" type="primary">设置{{listItem.cargoType.toString() == '2' ? '散货价' : '托盘价'}}</el-button>
              </el-form-item>
            </div> -->
            </div>
          </div>
          <div>
            <!-- 卡车费 -->
            <div class="flight-template" style="margin-left: 0;width: 100%;">
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
                  <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" v-model="item.minWeight" clearable placeholder="请输入" size="small" disabled
                            style="width: 80%;"></el-input>
                </div>
                <div class="flight-template-li" style="flex: 0 0 12%;">
                  <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')" v-model="item.unitRates" clearable placeholder="请输入"
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
                  <el-input onkeyup="value=value.replace(/[^\d\.\/]/ig,'')"  disabled v-model="item.entireCarRate" clearable placeholder="请输入"
                            size="small" style="width: 80%;"></el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rest-style" style="padding-left: 20px;">
          <el-form-item label=" " label-width="150px">
            <el-button @click="addAirlineAgent" type="primary" >添加代理</el-button>
            <el-button @click="activeClick" type="primary" >上一步</el-button>
            <el-button @click="cancelInput" type="primary" >取消</el-button>
            <el-button @click="inputCFK" type="primary" >保存</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {toData} from '@/util/assist'
  export default {
    data() {
      return {
        tabAllCol:0,
        flightNos:'',
        showButton:false,
        // listShow: 0,
        // activeName: 'first',
        labelArry: [
          {
            listShow: 0,
            activeName: 'name1'
          },
          {
            listShow: 0,
            activeName: 'name1'
          }
        ],
        active: 1,
        labelPosition: 'right',
        //航线信息
        continent: '',
        ruleForm: {
          pol: '',
          pod: '',
          airCompanyCode: '',
          shortestPrescription: '', //shortestPrescription
          longestPrescription: '',// longestPrescription
          status: true,
          principalId:'',
          remark: ''
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
          shortestPrescription: [{required: true, message: '起始天数', trigger: 'change'}],
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
        fullLeg: [{
            airportName: '',
          },
          {
            airportName: '',
          }
        ],
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
        airlineAgentInsertDTOS: [
          {
            name: '',
            id:'',
            agentId: '',
            agentName: '',
            dows: [],
            incidentalName: '', //
            incidentalPrice: '', //
            otherFees: [], //
            otherFeesArr: [], //
            carDows: "", //--卡车班次
            carEta: "", //--卡车ETA
            carEtd: "", //--卡车ETD
            entireCarRate: "", //--整车费用
            minWeight: "", //--最低起运重量
            addCarRates: 0, //--是否加卡车价格1,需要加入卡车价格，0是无需加入卡车价格
            unitRates: "", //--单价
            ratesN: "", //--卡车最低收费
            status: 0, //--航线代理上架下架状态
            ratesList: [
              {
                cargoType: 1,
                isMustGo: 0,//  是否MUST GO: 0否，1是
                ratesInsertDTOS: [
                  // {
                    // vwr: 0,
                    // remarke: "",// 价格备注
                    // lightItem:0,
                    // vwPro: '',
                    // cargoType: '',
                    // ratesN: '',
                    // ratesLevel0: '',
                    // ratesLevel1: '',
                    // ratesLevel2: '',
                    // ratesLevel3: '',
                    // ratesLevel4: '',
                    // ratesLevel5: '',
                  // }
                ]
              },
              {
                cargoType: 2,
                isMustGo: 0,//  是否MUST GO: 0否，1是
                ratesInsertDTOS: [
                  // {
                    // vwr: 0,
                    // remarke: "",// 价格备注
                    // lightItem:0,
                    // vwPro: '',
                    // cargoType: '',
                    // ratesN: '',
                    // ratesLevel0: '',
                    // ratesLevel1: '',
                    // ratesLevel2: '',
                    // ratesLevel3: '',
                    // ratesLevel4: '',
                    // ratesLevel5: '',
                  // }
                ]
              },
              {
                cargoType: 3,
                isMustGo: 0,//  是否MUST GO: 0否，1是
                ratesInsertDTOS: [
                  // {
                    // vwr: 0,
                    // remarke: "",// 价格备注
                    // lightItem:0,
                    // vwPro: '',
                    // cargoType: '',
                    // ratesN: '',
                    // ratesLevel0: '',
                    // ratesLevel1: '',
                    // ratesLevel2: '',
                    // ratesLevel3: '',
                    // ratesLevel4: '',
                    // ratesLevel5: '',
                  // }
                ]
              },
              {
                cargoType: 3,
                isMustGo: 1,//  是否MUST GO: 0否，1是
                ratesInsertDTOS: [
                  // {
                  //   vwr: 0,
                  //   remarke: "",// 价格备注
                  //   vwPro: '',
                  //   lightItem:0,
                  //   cargoType: '',
                  //   ratesN: '',
                  //   ratesLevel0: '',
                  //   ratesLevel1: '',
                  //   ratesLevel2: '',
                  //   ratesLevel3: '',
                  //   ratesLevel4: '',
                  //   ratesLevel5: '',
                  // }
                ]
              }
            ]
          }
        ],
        checkDaili: []
      }
    },
    beforeMount(){
      this.showButton = ((JSON.parse(sessionStorage.getItem('userInfo')).roleName).indexOf('管理员')>-1?true:false)
      // console.log(this.showButton);
      // this.columns[8].show = this.showButton
    },
    activated() {
      window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
      var routeAdd = sessionStorage.getItem('routeAdd')
      // console.log(routeAdd)
      if(routeAdd == 'hide' || routeAdd == null){
        this.checkDaili = []
        this.active = 1
        this.ruleForm.pol = ''
        this.ruleForm.pod = ''
        this.ruleForm.airCompanyCode = ''
        this.ruleForm.shortestPrescription = ''
        this.ruleForm.longestPrescription = ''
        this.ruleForm.status = true
        this.ruleForm.remark = ''
        this.ruleForm.principalId = ''
        this.loading = false
        this.polOpt = []
        this.podOpt = []
        this.airCompanyCodeOpt = []
        this.airportOpt = []
        this.airportEcheckArr = []
        this.agentOpt = []
        //航线进程
        this.fullLeg = [{
            airportName: '',
          },
          {
            airportName: '',
          }
        ]
        this.airportTableArr = [
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
        ]
        this.airlineAgentInsertDTOS = [
          {
            name: '',
            id:'',
            agentId: '',
            agentName: '',
            dows: [],
            incidentalName: '', //
            incidentalPrice: '', //
            otherFees: [], //
            otherFeesArr: [], //
            carDows: "", //--卡车班次
            carEta: "", //--卡车ETA
            carEtd: "", //--卡车ETD
            entireCarRate: "", //--整车费用
            minWeight: "", //--最低起运重量
            addCarRates: 0, //--是否加卡车价格1,需要加入卡车价格，0是无需加入卡车价格
            unitRates: "", //--单价
            ratesN: "", //--卡车最低收费
            status: 0, //--航线代理上架下架状态
            ratesList: [
              {
                cargoType: 1,
                isMustGo: 0,//  是否MUST GO: 0否，1是
                ratesInsertDTOS: [
                ]
              },
              {
                cargoType: 2,
                isMustGo: 0,//  是否MUST GO: 0否，1是
                ratesInsertDTOS: [
                ]
              },
              {
                cargoType: 3,
                isMustGo: 0,//  是否MUST GO: 0否，1是
                ratesInsertDTOS: [
                ]
              },
              {
                cargoType: 3,
                isMustGo: 1,//  是否MUST GO: 0否，1是
                ratesInsertDTOS: [
                ]
              }
            ]
          }
        ]
        this.initAirportSearchByPage()
        this.initCompanySearchByPage()
        this.initAgentList()
        this.initRoleSearch()
        this.ruleForm.principalId = JSON.parse(sessionStorage.getItem("userInfo")).id
        sessionStorage.setItem('routeAdd','show')
      }
    },
    watch:{
          ruleForm: {
              handler(newVal) {
                  if(newVal.airCompanyCode){
                    if(newVal.airCompanyCode.length == 2){
                      // 航司代码
                      this.lineNumber()
                    }
                  }
              },
              deep: true
          }
    },
    methods: {
      // 取消操作，清空输入——刷新页面
      cancelInput(){
        this.$confirm("确定清除刚编辑内容吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.checkDaili = []
            this.active = 1
            this.ruleForm.pol = ''
            this.ruleForm.pod = ''
            this.ruleForm.airCompanyCode = ''
            this.ruleForm.shortestPrescription = ''
            this.ruleForm.longestPrescription = ''
            this.ruleForm.status = true
            this.ruleForm.remark = ''
            this.ruleForm.principalId = ''
            this.loading = false
            this.polOpt = []
            this.podOpt = []
            this.airCompanyCodeOpt = []
            this.airportOpt = []
            this.airportEcheckArr = []
            this.agentOpt = []
            //航线进程
            this.fullLeg = [{
                airportName: '',
              },
              {
                airportName: '',
              }
            ]
            this.airportTableArr = [
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
            ]
            this.airlineAgentInsertDTOS = [
              {
                name: '',
                id:'',
                agentId: '',
                agentName: '',
                dows: [],
                incidentalName: '', //
                incidentalPrice: '', //
                otherFees: [], //
                otherFeesArr: [], //
                carDows: "", //--卡车班次
                carEta: "", //--卡车ETA
                carEtd: "", //--卡车ETD
                entireCarRate: "", //--整车费用
                minWeight: "", //--最低起运重量
                addCarRates: 0, //--是否加卡车价格1,需要加入卡车价格，0是无需加入卡车价格
                unitRates: "", //--单价
                ratesN: "", //--卡车最低收费
                status: 0, //--航线代理上架下架状态
                ratesList: [
                  {
                    cargoType: 1,
                    isMustGo: 0,//  是否MUST GO: 0否，1是
                    ratesInsertDTOS: [
                    ]
                  },
                  {
                    cargoType: 2,
                    isMustGo: 0,//  是否MUST GO: 0否，1是
                    ratesInsertDTOS: [
                    ]
                  },
                  {
                    cargoType: 3,
                    isMustGo: 0,//  是否MUST GO: 0否，1是
                    ratesInsertDTOS: [
                    ]
                  },
                  {
                    cargoType: 3,
                    isMustGo: 1,//  是否MUST GO: 0否，1是
                    ratesInsertDTOS: [
                    ]
                  }
                ]
              }
            ]
          this.initAirportSearchByPage()
          this.initCompanySearchByPage()
          this.initAgentList()
          this.initRoleSearch()
          this.ruleForm.principalId = JSON.parse(sessionStorage.getItem("userInfo")).id
          }).catch(() => {
            console.log('取消')
          })
      },
      //监听浏览器刷新
      beforeunloadHandler (e) {
        e = e || window.event
        if (e) {
          e.returnValue = '关闭提示'
        }
        this.initAirportSearchByPage()
        this.initCompanySearchByPage()
        this.initAgentList()
        sessionStorage.setItem('routeAdd','hide')
        return '关闭提示'
      },
      //班期排序
      dowsChange(index) {
        this.airlineAgentInsertDTOS[index].dows.sort()
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
      //保存
      submitData() {
        var newFullLeg = []
        for(var i = 0; i < this.fullLeg.length; i++){
          newFullLeg.push(this.fullLeg[i].airportName)
        }
        var newAgent = []
        var lightArr = []
        for(var q = 0; q < this.airlineAgentInsertDTOS.length; q++){
          var ag = JSON.parse(JSON.stringify(this.airlineAgentInsertDTOS[q].agentId))
          var newJson = {
            agentId: ag.split('#')[0],
            agentName: ag.split('#')[1],
            // otherFees: JSON.stringify(this.airlineAgentInsertDTOS[q].otherFees),
            dows: this.airlineAgentInsertDTOS[q].dows.toString(),
            airlineId: null,           // 555        航线id  默认null
            status: 0,               //555    是否上架  0=上架 1=下架 默认为0  
            id: null,                //     555       航线代理id，默认null 
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
          var NumberNaN = 0
          for(let a = 0; a < this.airlineAgentInsertDTOS[q].ratesList.length; a++){
            if(this.airlineAgentInsertDTOS[q].ratesList[a].ratesInsertDTOS.length == 0){
              NumberNaN = NumberNaN + 1
            }
            var numberNull = 0 //判断同类型下是否有两个空
            // 排序
            this.sortByKey(this.airlineAgentInsertDTOS[q].ratesList[a].ratesInsertDTOS,'vwr')
            // console.log(this.airlineAgentInsertDTOS[q].ratesList[a].ratesInsertDTOS);
             if(this.airlineAgentInsertDTOS[q].ratesList[a].ratesInsertDTOS.length==0){
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
            for(var z = 0; z < this.airlineAgentInsertDTOS[q].ratesList[a].ratesInsertDTOS.length; z++){
              // console.log();
             
              var childer = {
                vwr: this.airlineAgentInsertDTOS[q].ratesList[a].ratesInsertDTOS[z].vwr,
                ratesN: this.airlineAgentInsertDTOS[q].ratesList[a].ratesInsertDTOS[z].ratesN,
                dows: this.airlineAgentInsertDTOS[q].dows.toString(),
                remarke: this.airlineAgentInsertDTOS[q].ratesList[a].ratesInsertDTOS[z].remarke,     //555       价格备注
                ratesLevel0: this.airlineAgentInsertDTOS[q].ratesList[a].ratesInsertDTOS[z].ratesLevel0,
                ratesLevel1: this.airlineAgentInsertDTOS[q].ratesList[a].ratesInsertDTOS[z].ratesLevel1,
                ratesLevel2: this.airlineAgentInsertDTOS[q].ratesList[a].ratesInsertDTOS[z].ratesLevel2,
                ratesLevel3: this.airlineAgentInsertDTOS[q].ratesList[a].ratesInsertDTOS[z].ratesLevel3,
                ratesLevel4: this.airlineAgentInsertDTOS[q].ratesList[a].ratesInsertDTOS[z].ratesLevel4,
                ratesLevel5: this.airlineAgentInsertDTOS[q].ratesList[a].ratesInsertDTOS[z].ratesLevel5,
              }
              // for(let kk = 0;kk<6;kk++){
              //   var strKK = 'ratesLevel'+kk
              //   console.log(childer.ratesLevel1);
              //   if(childer.strKK == ''){
              //     return this.$message.error('存在报价全空，请检查')
              //   }
              // }
              // if((childer.vwr==0 || childer.vwr=='' || childer.vwr==undefined || childer.vwr==null)&&this.airlineAgentInsertDTOS[q].ratesList[a].isMustGo == '0'){
              if((childer.vwr === -1)&&this.airlineAgentInsertDTOS[q].ratesList[a].isMustGo == '0'){
                numberNull++
                if(numberNull == 2){
                  return this.$message.error('同类型下存在两个空比重，请检查')
                }
              }
              var numberNN=0
              // if(childer.ratesLevel0 == ''){// '' == 0
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
                  this.airlineAgentInsertDTOS[q].ratesList[a].ratesInsertDTOS[z].lightItem = 1
                  lightArr.push('1')
                  // return this.$message.error('存在报价全空，请检查')
                }else{
                  this.airlineAgentInsertDTOS[q].ratesList[a].ratesInsertDTOS[z].lightItem = 0
                }
              list.ratesInsertDTOS.push(childer)
            }
            // 去重
            if(this.airlineAgentInsertDTOS[q].ratesList[a].isMustGo != 1){
              this.airlineAgentInsertDTOS[q].ratesList[a].ratesInsertDTOS = this.unique(this.airlineAgentInsertDTOS[q].ratesList[a].ratesInsertDTOS)
            }
            // return console.log(list.ratesInsertDTOS);
            newJson.ratesList.push(list)
          }
          if(NumberNaN == 4){
            this.tabAllCol = 1
            this.$message.error('请将价格补充完整')
            return
          }
          newAgent.push(newJson)
        }
        if(lightArr.length > 0){
            // return this.$message.error('存在报价全空，请检查')
            return this.$message.error('请将价格补充完整')
        }
        // return console.log(newAgent);
        // var pod = JSON.parse(JSON.stringify(this.ruleForm.pod))
        var data = {
          flightNos: this.flightNos, //航班号，后续需要有一个生成航班接口，如果不填目前请写个随机数
          id: null,      //        555        id，默认为null   
          principalId: sessionStorage.getItem('userInfo').name,          //555   负责人（目前取登录人可以为null）
          pol: this.ruleForm.pol,
          pod: this.ruleForm.pod,
          continent: this.continent,
          planeType: this.airportTableArr[0].childerTable[0].vehicleType,
          airCompanyCode: this.ruleForm.airCompanyCode,
          shortDuration: this.ruleForm.shortestPrescription,
          source: 0,
          longDuration: this.ruleForm.longestPrescription,
          // status: this.ruleForm.status ? 0 : 1,
          fullLeg: newFullLeg.toString(),
          legCount: this.airportTableArr.length,
          legDetail: JSON.stringify(this.airportTableArr),
          airlineAgentInsertDTOS: newAgent,
          // remark: this.ruleForm.remark,
          principalId: this.ruleForm.principalId
        }
        // return console.log(data);
        this.$http.post(this.$service.airlineSave,data, {
          headers: {
            diffFlag: 1,
          },
        }).then((data) => {
          if(data.code == 200){
            sessionStorage.setItem('routeAdd','hide')
            this.$router.push('/routeManagement/routeManage')
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
      // 获取随机航班号
      lineNumber(){
        if(this.ruleForm.airCompanyCode != ''){
          // this.$http.post(this.$service.airlineNumber,{'airCompanyCode':this.ruleForm.airCompanyCode}).then((data) => {
          this.$http.get(this.$service.airlineNumber+'?airCompanyCode='+this.ruleForm.airCompanyCode).then((data) => {
              this.flightNos = data
              this.airportTableArr[0].childerTable[0].vehicleId = data
            // if(data.code == 200){
            //   console.log(data);
            //   // this.flightNos = data.data.records
            // }
          })
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
      delChilder1(index, listIndex ,childerIndex,type) {
        this.tabAllCol = 0
        if(type == 'add'){
            var json = {
            // vw: this.airlineAgent[index].ratesList[listIndex].vw,
            vwr: -1,
            vwPro: '',
            lightItem:0,
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
          this.airlineAgentInsertDTOS[index].ratesList[listIndex].ratesInsertDTOS.push(json)
          this.airlineAgentInsertDTOS[index].ratesList[listIndex].vwr = -1
          // this.sortByKey(this.airlineAgentInsertDTOS[index].ratesList[listIndex].ratesInsertDTOS,'vwr')
          // this.airlineAgent[index].ratesList[listIndex].ratesInsertDTOS = this.unique(this.airlineAgent[index].ratesList[listIndex].ratesInsertDTOS)
        }else{
          this.airlineAgentInsertDTOS[index].ratesList[listIndex].ratesInsertDTOS.splice(childerIndex, 1)
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
      delTableClick1(index) {
        this.airlineAgentInsertDTOS.splice(index,1)
      },
      remoteMethod(query) {
        // console.log(query)
      },
      // 重复比重为值
      inputCFK(){
        var arrCopy = {arr:[]}
        arrCopy.arr = this.airlineAgentInsertDTOS
        var stringObj = JSON.parse(JSON.stringify(arrCopy.arr))
        for (let i = 0; i < stringObj.length; i++) {
          if(stringObj[i].ratesList[2].ratesInsertDTOS.length>0){
            for (let j = 0; j < stringObj[i].ratesList[2].ratesInsertDTOS.length; j++) {
              if(stringObj[i].ratesList[2].ratesInsertDTOS[j].vwr == -1){
                for (let k = 0; k < stringObj[i].ratesList[0].ratesInsertDTOS.length; k++) {
                  if(stringObj[i].ratesList[0].ratesInsertDTOS[k].vwr == -1){
                    return this.$message.error('散货+托盘已存在空比重,散货不应存在空比重,请重新输入')
                  }
                }
                for (let k = 0; k < stringObj[i].ratesList[1].ratesInsertDTOS.length; k++) {
                  if(stringObj[i].ratesList[1].ratesInsertDTOS[k].vwr == -1){
                    return this.$message.error('散货+托盘已存在空比重,托盘不应存在空比重,请重新输入')
                  }
                }
              }
            }
          }
        }
        this.submitData()
      },
      // 判重复输入
      inputPK(val,index,listIndex,childerIndex){
        // console.log(val,index,listIndex,childerIndex);
        if((Number(val)<60 || Number(val)>1500) && (val != -1)){
          this.$message.error('请添加60-1500的比例数值')
          val = ''
        }
        var value = (val == "")?-1:val
        if(val != -1){
          // console.log((this.airlineAgentInsertDTOS)[index].ratesList)
          var numberType = 0
          var arrCopy = {arr:[]}
          arrCopy.arr = (this.airlineAgentInsertDTOS)[index].ratesList
          var stringObj = JSON.parse(JSON.stringify(arrCopy.arr))
            if(stringObj[listIndex].ratesInsertDTOS.length >1){
              var GG = 0
              for (let j = 0; j < stringObj[listIndex].ratesInsertDTOS.length; j++) {
                  if(stringObj[listIndex].ratesInsertDTOS[j].vwr == val){
                    GG++
                  }
                  if(GG == 2){
                    value = -1
                    numberType = 4
                  }
                }
            }
            if((listIndex === 0 || listIndex === 1) && (stringObj[2].ratesInsertDTOS.length>0)){ //isMustGo
              for (let j = 0; j < stringObj[2].ratesInsertDTOS.length; j++) {
                if(stringObj[2].ratesInsertDTOS[j].vwr == val){
                  value = -1
                  numberType = 1
                }
              }
            }
            if((listIndex === 2) && ((stringObj[0].ratesInsertDTOS.length>0) || (stringObj[1].ratesInsertDTOS.length>0))){
              if(stringObj[1].ratesInsertDTOS.length>0){
                for (let j = 0; j < stringObj[1].ratesInsertDTOS.length; j++) {
                    if(stringObj[1].ratesInsertDTOS[j].vwr == val){
                      value = -1
                      numberType = 3
                    }
                }
              }
              if(stringObj[0].ratesInsertDTOS.length>0){
                for (let j = 0; j < stringObj[0].ratesInsertDTOS.length; j++) {
                    if(stringObj[0].ratesInsertDTOS[j].vwr == val){
                      value = -1
                      numberType = 2
                    }
                }
              }
            }
          if(value === -1){
            (this.airlineAgentInsertDTOS)[index].ratesList[listIndex].ratesInsertDTOS[childerIndex].vwPro = ''
            if(numberType == 1){
               this.$message.error('散货+托盘已存在1:'+val+'价格,请重新输入')
            }else if(numberType == 2){
               this.$message.error('已存在散货1:'+val+'价格,请重新输入')
            }else if(numberType == 3){
               this.$message.error('已存在托盘1:'+val+'价格,请重新输入')
            }else if(numberType == 4){
               this.$message.error('该类型已存在1:'+val+'价格,请重新输入')
            }
          }else{
            (this.airlineAgentInsertDTOS)[index].ratesList[listIndex].ratesInsertDTOS[childerIndex].vwPro = '1:'+value
          }
        }
        // console.log("2"+value);
        return value
      },
      // 输入限制
      inputXZ(value){
        var val = value
        // console.log(val);
        if(val == ""){
          val = ''
          return val
        }else if(val.length<2){
          val = "1:"+value
        }
        var str2 = val.slice(2)
        str2 = str2.replace(/\D/g,'')
        val = "1:"+str2
        // console.log(val);
        return val
      },
      //添加杂费
      addFeesClick(index) {
        // console.log(this.airlineAgentInsertDTOS)
        var reg = /(^[1-9][0-9]{0,5}$)|(^[0-9]{0,5}[\.][0-9]{1,2}$)/
        if(!this.airlineAgentInsertDTOS[index].incidentalName){
          this.$message.error('请选择杂费名称')
          return
        }else if(this.airlineAgentInsertDTOS[index].incidentalPrice == ''){
          this.$message.error('请输入杂费金额')
          return
        }else if(!reg.test(this.airlineAgentInsertDTOS[index].incidentalPrice)){
          this.$message.error('金额范围是整数最大六位数，小数保留两位')
          return
        }
        var json = {
          feesName: this.airlineAgentInsertDTOS[index].incidentalName,
          fees: this.airlineAgentInsertDTOS[index].incidentalPrice
        }
        this.airlineAgentInsertDTOS[index].otherFees.push(json)
        this.airlineAgentInsertDTOS[index].otherFeesArr.push(json.feesName)
        this.airlineAgentInsertDTOS[index].incidentalName = ''
        this.airlineAgentInsertDTOS[index].incidentalPrice = ''
      },
      //删除杂费
      otherFeesClose(index,tagIndex) {
        this.airlineAgentInsertDTOS[index].otherFees.splice(tagIndex,1)
        this.airlineAgentInsertDTOS[index].otherFeesArr.splice(tagIndex,1)
      },
      //代理公司
      initAgentList(agentName) {
        if(!agentName){
          agentName = ''
        }
        var data = {
          agentName: agentName,
          sceneFlag: 0,
        }
        this.$http.post(this.$service.agentList,data).then((data) => {
          this.loading = false
          if(data.code == 200){
            this.agentOpt = data.data.records
          }
        })
      },
      agentMethod(agentName) {
        this.initAgentList(agentName)
      },
      agentChang() {
        this.checkDaili = []
        for(var i = 0; i < this.airlineAgentInsertDTOS.length; i++){
          var qa = JSON.parse(JSON.stringify(this.airlineAgentInsertDTOS[i].agentId))
          if(qa.split('#')[0]){
            this.checkDaili.push(Number(qa.split('#')[0]))
          }
        }
      },
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
            // var data = {
            //   fullLeg: newFullLeg.toString(),
            //   airCompanyCode: this.ruleForm.airCompanyCode
            // }
            this.active = 2
            // this.$http.post(this.$service.airlineCheckAirlineInfo,data).then((data) => {
            //   if(data.code == 200){
            //     this.active = 2
            //   }else{
            //     this.$message.error(data.message)
            //   }
            // })
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
          name: '',
          id:'',
          agentId: '',
          agentName: '',
          dows: [],
          incidentalName: '', //
          incidentalPrice: '', //
          otherFees: [], //
          otherFeesArr: [], //
          carDows: "", //--卡车班次
          carEta: "", //--卡车ETA
          carEtd: "", //--卡车ETD
          entireCarRate: 0, //--整车费用
          minWeight: 0, //--最低起运重量
          addCarRates: 0, //--是否加卡车价格1,需要加入卡车价格，0是无需加入卡车价格
          unitRates: 0, //--单价
          ratesN: 0, //--卡车最低收费
          status: 0, //--航线代理上架下架状态
          ratesList: [
              {
                cargoType: 1,
                isMustGo: 0,//  是否MUST GO: 0否，1是
                ratesInsertDTOS: [
                  // {
                  //   vwr: 0,
                  //   remarke: "",// 价格备注
                  //   vwPro: '',
                  //   cargoType: '',
                  //   ratesN: '',
                  //   ratesLevel0: '',
                  //   ratesLevel1: '',
                  //   ratesLevel2: '',
                  //   ratesLevel3: '',
                  //   ratesLevel4: '',
                  //   ratesLevel5: '',
                  // }
                ]
              },
              {
                cargoType: 2,
                isMustGo: 0,//  是否MUST GO: 0否，1是
                ratesInsertDTOS: [
                  // {
                  //   vwr: 0,
                  //   remarke: "",// 价格备注
                  //   vwPro: '',
                  //   cargoType: '',
                  //   ratesN: '',
                  //   ratesLevel0: '',
                  //   ratesLevel1: '',
                  //   ratesLevel2: '',
                  //   ratesLevel3: '',
                  //   ratesLevel4: '',
                  //   ratesLevel5: '',
                  // }
                ]
              },
              {
                cargoType: 3,
                isMustGo: 0,//  是否MUST GO: 0否，1是
                ratesInsertDTOS: [
                  // {
                  //   vwr: 0,
                  //   remarke: "",// 价格备注
                  //   vwPro: '',
                  //   cargoType: '',
                  //   ratesN: '',
                  //   ratesLevel0: '',
                  //   ratesLevel1: '',
                  //   ratesLevel2: '',
                  //   ratesLevel3: '',
                  //   ratesLevel4: '',
                  //   ratesLevel5: '',
                  // }
                ]
              },
              {
                cargoType: 3,
                isMustGo: 1,//  是否MUST GO: 0否，1是
                ratesInsertDTOS: [
                  // {
                  //   vwr: 0,
                  //   remarke: "",// 价格备注
                  //   vwPro: '',
                  //   cargoType: '',
                  //   ratesN: '',
                  //   ratesLevel0: '',
                  //   ratesLevel1: '',
                  //   ratesLevel2: '',
                  //   ratesLevel3: '',
                  //   ratesLevel4: '',
                  //   ratesLevel5: '',
                  // }
                ]
              }
            ]
        }
        this.airlineAgentInsertDTOS.push(json)
        var obj1 = {
            listShow: 0,
            activeName: 'name1'
          }
        this.labelArry.push(obj1)
      },
      //添加比重
      addAirlineVw(index,listIndex) {
        // console.log(this.airlineAgentInsertDTOS[index].ratesList[listIndex].ratesInsertDTOS);
        if(!this.airlineAgentInsertDTOS[index].ratesList[listIndex].vwr){
          this.$message.error('请输入比重值')
          return
        }else if(!(/(^[1-9]\d*$)/.test(this.airlineAgentInsertDTOS[index].ratesList[listIndex].vwr))){
          this.$message.error('只能输入正整数')
          return
        }
        for(var i = 0; i < this.airlineAgentInsertDTOS[index].ratesList[listIndex].ratesInsertDTOS.length; i++){
          if(this.airlineAgentInsertDTOS[index].ratesList[listIndex].ratesInsertDTOS[i].vwr == this.airlineAgentInsertDTOS[index].ratesList[listIndex].vwr){
            this.$message.error('比重已存在，请重新输入')
            return
          }
        }
        var json = {
          vwr: this.airlineAgentInsertDTOS[index].ratesList[listIndex].vwr,
          vwPro: '1:'+this.airlineAgentInsertDTOS[index].ratesList[listIndex].vwr,
          cargoType: '',
          lightItem:0,
          ratesN: '',
          ratesLevel0: '',
          ratesLevel1: '',
          ratesLevel2: '',
          ratesLevel3: '',
          ratesLevel4: '',
          ratesLevel5: '',
        }
        this.airlineAgentInsertDTOS[index].ratesList[listIndex].ratesInsertDTOS.push(json)
        this.airlineAgentInsertDTOS[index].ratesList[listIndex].vwr = ''
        // this.sortByKey(this.airlineAgentInsertDTOS[index].ratesList[listIndex].ratesInsertDTOS,'vwr')
        this.airlineAgentInsertDTOS[index].ratesList[listIndex].ratesInsertDTOS = this.unique(this.airlineAgentInsertDTOS[index].ratesList[listIndex].ratesInsertDTOS)
      },
      handleClick(tab, index){
        // console.log(tab, index);
        // console.log(this.labelArry);
        let arr = ['name1','name2',"name3","name4"]

        this.labelArry[index].activeName = arr[tab.index]
        this.labelArry[index].listShow = tab.index
      },
      //数组对象排序
      sortByKey(array,key) {
        // array = this.unique(array)
        array.sort(function(a,b) {
            var x = Number(a[key])
            var y = Number(b[key])
            var num = x < y ? 1 : 0
            return x > y ? num : -1
          })
        return array
      },
      repetition(arry, value){

      },
      //数组去重
      unique(arr) {
        const res = new Map();
        return arr.filter((a) => !res.has(a.vwr) && res.set(a.vwr, 1))
      },
      //删除代理报价
      delTableClickImg(index,listIndex) {
        this.airlineAgentInsertDTOS[index].ratesList.splice(listIndex,1)
      },
      //添加代理报价
      addCargoType(index,listIndex){
        var num = ''
        if(this.airlineAgentInsertDTOS[index].ratesList[0].cargoType[0] == '1'){
          num = '2'
        }else{
          num = '1'
        }
        var json = {
          cargoType: [num],
          vwr: '',
          ratesInsertDTOS: []
        }
        this.airlineAgentInsertDTOS[index].ratesList.push(json)
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
      vertical-align: top;
    }
    /deep/ .tabAllRed .el-tabs__nav{
      border: 1px solid red;
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
  .activeChildren{
    background: #ffa8a8;
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
  .close-img{
    width: 40px;
    height: 40px;
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }
</style>
