<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form
        :inline="true"
        size="medium"
        class="demo-form-inline"
        label-position="left"
      >
        <div class="content-search-normal" style="position:relative">
          <div style="position:absolute;right:10px;top:10px">
            <div
              style="cursor:pointer;display:inline-block;"
              @click="shiftSelectControl"
            >
              <img
                v-if="selectControl"
                src="../../assets/doubleArrowUp.png"
                alt=""
                style="width:30px;height:30px;margin:0 0 18px 0;transform:translateY(7px)"
              />
              <img
                v-if="!selectControl"
                src="../../assets/doubleArrowDown.png"
                alt=""
                style="width:30px;height:30px;margin:0 0 18px 0;transform:translateY(7px)"
              />
            </div>
          </div>
          <el-form-item label="订单号:" class="formItem">
            <el-popover placement="right" width="200" trigger="click">
              <div
                v-for="(item, index) in selectResult.orderNos
                  .split(/[,，/' ']/)
                  .splice(0, 20)"
                :key="index"
              >
                {{ index == 19 ? "..." : item }}
              </div>
              <el-input
                style="width: 170px"
                slot="reference"
                v-model="selectResult.orderNos"
                placeholder="请输入订单号"
                clearable
              >
              </el-input>
            </el-popover>
          </el-form-item>
          <el-form-item label="运单号:" class="formItem">
            <el-popover placement="right" width="200" trigger="click">
              <div
                v-for="(item, index) in selectResult.waybillNos
                  .split(/[,，/' ']/)
                  .splice(0, 20)"
                :key="index"
              >
                {{ index == 19 ? "..." : item }}
              </div>
              <el-input
                slot="reference"
                style="width: 170px"
                v-model="selectResult.waybillNos"
                placeholder="请输入运单号"
                clearable
              >
              </el-input>
            </el-popover>
          </el-form-item>
          <el-form-item label="财务系列号:" class="formItem">
            <el-input
              v-model="selectResult.financialSeriesNo"
              @change="setLimit($event)"
              style="width: 180px"
              size="medium"
              maxlength="12"
              clearable
              placeholder="请输入财务系列号"
            ></el-input>
          </el-form-item>
          <el-form-item label="开票抬头:" class="formItem">
            <el-input
              v-model="selectResult.invoiceTitle"
              style="width: 180px"
              size="medium"
              maxlength="30"
              clearable
              placeholder="请输入开票抬头"
            ></el-input>
          </el-form-item>
          <el-form-item label="结算对象:" class="formItem">
            <el-select
              v-model="selectResult.companyName"
              placeholder="请输入结算对象"
              clearable
              remote
              filterable
              reserve-keyword
              style="width: 180px"
            >
              <el-option
                v-for="(item, index) in customerNameArray"
                :key="index"
                :value="item.label"
                :label="item.label"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="核销状态:" class="formItem">
            <el-select
              v-model="selectResult.rcvWriteOffStatusList"
              placeholder="核销状态"
              clearable
              multiple
              collapse-tags
              @change="dealAllChange"
              style="width: 190px;"
            >
              <el-option
                v-for="(item, index) in writeOffStatus"
                :key="index"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="起运港:" class="formItem" v-show="selectControl">
            <el-select
              @blur="autoValue($event.target.value.toUpperCase(), 'pol')"
              v-model="selectResult.pol"
              id="pol"
              :remote-method="polMethod"
              placeholder="起运港三字码"
              clearable
              filterable
              maxlength="15"
              remote
              @change="getCurrentChange"
              reserve-keyword
              style="width: 190px"
            >
              <el-option
                v-for="(item, index) in polOpt"
                :disabled="pod == item.threeLetterCode"
                :key="item.threeLetterCode"
                :value="item.threeLetterCode"
              >
                <span>{{ item.threeLetterCode }}</span>
                <span style="margin-left: 5px">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="目的港:" class="formItem" v-show="selectControl">
            <el-select
              @blur="autoValue($event.target.value.toUpperCase(), 'pod')"
              @change="getCurrentChange"
              v-model="selectResult.pod"
              :remote-method="podMethod"
              placeholder="目的港三字码"
              id="pod"
              maxlength="15"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 190px"
            >
              <el-option
                v-for="item in podOpt"
                :disabled="pol == item.threeLetterCode"
                :key="item.threeLetterCode"
                :value="item.threeLetterCode"
              >
                <span>{{ item.threeLetterCode }}</span>
                <span style="margin-left: 5px">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="航司:" class="formItem" v-show="selectControl">
            <el-select
              v-model="selectResult.airCompanyCode"
              @change="getCurrentChange"
              id="airCompany"
              placeholder="请输入航司"
              :remote-method="companyMethod"
              :loading="loading"
              clearable
              filterable
              remote
              maxlength="15"
              reserve-keyword
              style="width: 190px"
            >
              <el-option
                v-for="(item, index) in airCompanyCodeOpt"
                :key="index"
                :label="item.name"
                :value="item.airCompanyCode"
              >
                <span>{{ item.airCompanyCode }}</span>
                <span style="margin-left: 5px">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="售前客服:"
            class="formItem"
            v-show="selectControl"
          >
            <el-select
              id="pscsId"
              v-model="selectResult.pscsId"
              @change="getCurrentChange"
              placeholder="请输入售前客服"
              :loading="loading"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 190px"
            >
              <el-option
                v-for="item in payBefore"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="售中客服:"
            class="formItem"
            v-show="selectControl"
          >
            <el-select
              id="mscsId"
              @change="getCurrentChange"
              v-model="selectResult.mscsId"
              placeholder="请输入售中客服"
              :loading="loading"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 190px"
            >
              <el-option
                v-for="item in paying"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="航线:" class="formItem" v-show="selectControl">
            <el-select
              id="principalId"
              v-model="selectResult.principalId"
              @change="getCurrentChange"
              placeholder="请输入航线"
              :loading="loading"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 190px"
            >
              <el-option
                v-for="item in airManger"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="交单时间:"
            class="formItem"
            style="width: 480px"
            v-show="selectControl"
          >
            <el-date-picker
              value-format="yyyy-MM-dd"
              @change="getCurrentChange"
              style="width: 180px"
              v-model="selectResult.startPresentationTime"
              type="date"
              :picker-options="pickerOptionsStartTwo"
              placeholder="选择日期"
            >
            </el-date-picker
            >-
            <el-date-picker
              value-format="yyyy-MM-dd"
              @change="getCurrentChange"
              style="width: 180px"
              v-model="selectResult.endPresentationTime"
              type="date"
              :picker-options="pickerOptionsEndTwo"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="航班日期:"
            style="width: 480px"
            class="formItem"
            v-show="selectControl"
          >
            <el-date-picker
              style="width: 180px"
              @change="getCurrentChange"
              value-format="yyyy-MM-dd"
              v-model="selectResult.startDepartureDate"
              type="date"
              :picker-options="pickerOptionsStartOne"
              placeholder="选择日期"
            >
            </el-date-picker
            >-
            <el-date-picker
              style="width: 180px"
              @change="getCurrentChange"
              value-format="yyyy-MM-dd"
              v-model="selectResult.endDepartureDate"
              type="date"
              :picker-options="pickerOptionsEndOne"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="结算方式:"
            class="formItem"
            style="width:320px"
            v-show="selectControl"
          >
            <el-select
              @change="getCurrentChange"
              v-model="selectResult.payWay"
              placeholder="请选择结算方式"
              style="width: 190px"
            >
              <el-option
                v-for="(item, index) in payWayData"
                :key="index"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="代理上家:"
            class="formItem"
            v-show="selectControl"
          >
            <el-select
              @change="getCurrentChange"
              v-model="selectResult.agentId"
              id="agentId"
              placeholder="请输入代理上家"
              :remote-method="agentMethod"
              :loading="loading"
              clearable
              filterable
              remote
              maxlength="30"
              reserve-keyword
              style="width: 190px"
            >
              <el-option
                v-for="item in agentOpt"
                :key="item.id"
                :label="item.agentName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否作废:" class="formItem">
            <el-select
              v-model="selectResult.fettle"
              @change="getCurrentChange"
              style="width: 120px"
              clearable
            >
              <el-option
                v-for="item in fettleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请选择分公司" class="formItem">
            <dc-select
              v-model="selectResult.orgId"
              placeholder="订单所属公司"
              clearable
              filterable
            >
              <el-option
                v-for="item in sysOrgs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </dc-select>
          </el-form-item>
          <el-form-item class="formItem">
            <dc-select
              v-model="selectResult.customerResponsibleId"
              placeholder="客户负责人"
              filterable
              clearable
              @change="getCurrentChange"
            >
              <el-option
                v-for="item in customerResponsibles"
                :key="item.value"
                :label="item.longLabel"
                :value="item.value"
              />
            </dc-select>
          </el-form-item>
          <div class="operateButton">
            <el-button
              @click="searchClick"
              size="mini"
              type="primary"
              icon="el-icon-search"
              v-auth="['104000_B']"
              >查询</el-button
            >
            <el-button @click="restClick" size="mini" type="primary"
              >清空</el-button
            >
          </div>

          <!-- 表格控制列显示 -->
          <el-drawer
            title="表格列控制"
            :visible.sync="drawer"
            size="200px"
            :direction="direction"
          >
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
              style="margin: 0 0 20px 20px"
              >全选</el-checkbox
            >
            <el-checkbox-group v-model="checkedTable" :min="0" :max="20">
              <el-checkbox
                v-for="choose in tableOptions"
                :label="choose"
                :key="choose"
                style="display: block; margin-left: 20px"
                >{{ choose }}</el-checkbox
              >
            </el-checkbox-group>
          </el-drawer>
        </div>
      </el-form>
    </div>
    <el-tabs
      v-model="typeCode"
      type="border-card"
      @tab-click="tabClickData"
      value="可操作"
    >
      <el-tab-pane
        v-for="(item, index) in tabName"
        :key="index"
        :label="item + '(' + tabNum[index] + ')'"
        :name="item"
      >
        <el-table
          :data="tableData"
          ref="multipleTable"
          border
          stripe
          header
          max-height="550px"
          class="finance-table"
          :cell-style="tableRowClassName"
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <template slot="empty">
            <img class="data-pic" src="../../assets/kong-icon.png" />
            <p>暂无数据</p>
          </template>
          <el-table-column
            type="selection"
            width="40"
            label="序号"
            fixed="left"
            :selectable="ifDisabled"
          ></el-table-column>
          <el-table-column
            prop="financialSeriesNo"
            label="财务系列号"
            width="160"
            v-if="checkedTable.indexOf('财务系列号') !== -1"
          >
            <template slot-scope="scope">
              <div
                @click="showData(scope.row.orderId, scope.row.orderNo)"
                style="color:skyBlue;cursor:pointer"
              >
                {{ scope.row.financialSeriesNo }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="orderNo"
            label="订单号"
            min-width="160"
            type=""
            v-if="checkedTable.indexOf('订单号') !== -1"
          >
            <template slot-scope="scope">
              <div
                @click="showData(scope.row.orderId, scope.row.orderNo)"
                style="color:skyBlue;cursor:pointer"
              >
                {{ scope.row.orderNo }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="waybillNo"
            label="运单号"
            min-width="160"
            type=""
            v-if="checkedTable.indexOf('运单号') !== -1"
          ></el-table-column>
          <el-table-column
            prop="reconciliationUnit"
            label="结算对象"
            min-width="220"
            type=""
            v-if="checkedTable.indexOf('结算对象') !== -1"
          ></el-table-column>
          <el-table-column
            prop="invoiceTitle"
            label="开票抬头"
            min-width="220"
            type=""
            v-if="checkedTable.indexOf('开票抬头') !== -1"
          ></el-table-column>
          <!-- <el-table-column label="开票备注" prop="invoiceRemark" min-width="160"  v-if="checkedTable.indexOf('开票备注') !== -1">
               <template slot-scope="scope">
                <div 
                    v-for="(item,index) in JSON.parse(scope.row.invoiceRemark)" 
                    :key="index" 
                    style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap" 
                    :title="item.remark?item.remark:''"
                    :style="{opacity:item.remark?'':0}"
                >
                  {{item.remark?item.remark:'暂无数据'}}
                </div>
              </template>
            </el-table-column> -->
          <el-table-column
            label="应收金额"
            v-if="checkedTable.indexOf('应收金额') !== -1"
          >
            <el-table-column prop="totalArCny" label="人民币" width="120">
            </el-table-column>
            <el-table-column label="原币" width="120">
              <template slot-scope="scope">
                <div
                  v-html="dealOrgn(scope.row.totalArOrgn)"
                  style="white-space:pre-wrap"
                ></div>
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column
            label="申请开票金额"
            prop="applyAmountOrgn"
            width="140"
            v-if="checkedTable.indexOf('申请开票金额') !== -1"
          >
            <template slot-scope="scope">
              <div
                v-html="dealOrgn(scope.row.applyAmountOrgn)"
                style="white-space:pre-wrap"
              ></div>
            </template>
          </el-table-column>
          <el-table-column
            label="已开票金额"
            prop="invoicedAmountOrgn"
            v-if="checkedTable.indexOf('已开票金额') !== -1"
          >
            <template slot-scope="scope">
              <div
                v-html="dealOrgn(scope.row.invoicedAmountOrgn)"
                style="white-space:pre-wrap"
              ></div>
            </template>
          </el-table-column>

          <el-table-column
            label="已核销金额"
            v-if="checkedTable.indexOf('已核销金额') !== -1"
          >
            <el-table-column
              prop="rcvWriteOffAmountCny"
              label="人民币"
              width="120"
            >
            </el-table-column>
            <el-table-column label="原币" width="120">
              <template slot-scope="scope">
                <div
                  v-html="dealOrgn(scope.row.rcvWriteOffAmountOrgn)"
                  style="white-space:pre-wrap"
                ></div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="未核销金额"
            v-if="checkedTable.indexOf('未核销金额') !== -1"
          >
            <el-table-column
              prop="notRcvWriteOffAmountCny"
              label="人民币"
              width="120"
            >
            </el-table-column>
            <el-table-column label="原币" width="120">
              <template slot-scope="scope">
                <div
                  v-html="dealOrgn(scope.row.notRcvWriteOffAmountOrgn)"
                  style="white-space:pre-wrap"
                ></div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="exchangeRate"
            label="汇率"
            min-width="80"
            v-if="checkedTable.indexOf('汇率') !== -1"
          >
            <template slot-scope="scope">
              <div
                v-html="getExchangeRate(scope.row.exchangeRate)"
                style="white-space:pre-wrap"
              ></div>
            </template>
          </el-table-column>
          <el-table-column
            prop="payWay"
            label="结算方式"
            min-width="80"
            v-if="checkedTable.indexOf('结算方式') !== -1"
          >
            <template slot-scope="scope">
              <div>
                {{
                  scope.row.payWay == 0
                    ? "付款买单"
                    : scope.row.payWay == 1
                    ? "月结买单"
                    : ""
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="rcvWriteOffCount"
            label="核销次数"
            min-width="80"
            v-if="checkedTable.indexOf('核销次数') !== -1"
          >
            <template slot-scope="scope">
              <div
                @click="getRcvWrite(scope.row)"
                style="color:skyblue;cursor:pointer"
                v-auth:disabled="['104004_B']"
              >
                {{ scope.row.rcvWriteOffCount }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="rcvWriteOffStatus"
            label="核销状态"
            min-width="80"
            v-if="checkedTable.indexOf('核销状态') !== -1"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row.rcvWriteOffStatus | getWriteOffStatus }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="departureDate"
            label="航班日期"
            min-width="100"
            type=""
            v-if="checkedTable.indexOf('航班日期') !== -1"
          ></el-table-column>
          <el-table-column
            prop="presentationTime"
            label="交单时间"
            min-width="100"
            type=""
            v-if="checkedTable.indexOf('交单时间') !== -1"
          ></el-table-column>

          <el-table-column
            prop="totalApCny"
            label="应付总金额"
            min-width="80"
            v-if="checkedTable.indexOf('应付总金额') !== -1"
          ></el-table-column>
          <el-table-column
            prop="orderProfit"
            label="利润"
            min-width="80"
            v-if="checkedTable.indexOf('利润') !== -1"
          ></el-table-column>
        </el-table>
        <div style="display:flex;justify-content:space-between">
          <div>
            <el-button size="mini" class="pageSkip"
              ><el-checkbox v-model="pageSkipChecked" @change="selectAllTable"
                >跨页全选</el-checkbox
              ></el-button
            >
            <el-button type="primary" size="mini" @click="getStatistData"
              >数据统计</el-button
            >
          </div>
          <div style="display:flex">
            <div style="margin:23px 10px 0 0">
              <!-- <el-button v-if="typeCode!= '业务修改中'" size="mini" type="primary" @click="getStatement">生成对账单</el-button> -->
              <el-button
                v-if="typeCode != '业务修改中'"
                size="mini"
                type="primary"
                @click="chargeOff(false)"
                v-auth="['104001_B']"
                >正常核销</el-button
              >
              <el-button
                v-if="typeCode != '业务修改中'"
                size="mini"
                type="primary"
                @click="chargeOff(true)"
                v-auth="['104002_B']"
                >预收核销</el-button
              >
              <el-button size="mini" type="primary" @click="getExportExcel"
                >导出列表</el-button
              >
              <el-button @click="drawer = true" type="primary" size="mini"
                >选择表格列</el-button
              >
            </div>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[10, 30, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              style="
                text-align: right;
                padding: 19px 30px 18px 0;
                background: #fff;
              "
            >
            </el-pagination>
          </div>
        </div>
        <div v-if="statistDataShow" style="margin:0px 0 0 10px">
          <div style="display:flex;" class="allStatist">
            <div class="statists">
              应收总金额:{{
                statistData.totalArCny
                  ? statistData.totalArCny.toLocaleString("en-US")
                  : 0
              }}
            </div>
            <div class="statists" style="white-space:pre-wrap;display:flex">
              <div>应收原币:</div>
              <div
                style="margin-left:5px"
                v-html="dealOrgnS(statistData.totalArOrgn)"
              ></div>
            </div>
            <div class="statists" style="white-space:pre-wrap;display:flex">
              <div>申请开票金额:</div>
              <div
                style="margin-left:5px"
                v-html="dealOrgnS(statistData.applyAmountOrgn)"
              ></div>
            </div>
            <div class="statists" style="white-space:pre-wrap;display:flex">
              <div>已开票金额:</div>
              <div
                style="margin-left:5px"
                v-html="dealOrgnS(statistData.invoicedAmountOrgn)"
              ></div>
            </div>
            <div class="statists">
              利润:{{
                statistData.orderProfit
                  ? statistData.orderProfit.toLocaleString("en-US")
                  : 0
              }}
            </div>
            <div
              class="statists"
              v-if="errorStatist"
              style="color:red;fontSize:14px;fontWeight:bold;transform:translateY(10px)"
            >
              存在异常订单!
            </div>
          </div>
          <div style="display:flex;padding-bottom:15px" class="allStatist">
            <div class="statists" style="white-space:pre-wrap;display:flex">
              <div>已核销原币:</div>
              <div
                style="margin-left:5px"
                v-html="dealOrgnS(statistData.totalArWoOrgn)"
              ></div>
            </div>
            <div class="statists" style="white-space:pre-wrap;display:flex">
              <div>已核销人民币:</div>
              <div style="margin-left:5px">
                {{
                  statistData.totalArWoCny
                    ? statistData.totalArWoCny.toLocaleString("en-US")
                    : 0
                }}
              </div>
            </div>
            <div class="statists" style="white-space:pre-wrap;display:flex">
              <div>未核销原币:</div>
              <div
                style="margin-left:5px"
                v-html="dealOrgnS(statistData.totalArUnWoOrgn)"
              ></div>
            </div>
            <div class="statists" style="white-space:pre-wrap;display:flex">
              <div>未核销人民币:</div>
              <div style="margin-left:5px">
                {{
                  statistData.totalArUnWoCny
                    ? statistData.totalArUnWoCny.toLocaleString("en-US")
                    : 0
                }}
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :title="dialogTitleOne + ' 订单详情'"
      :visible.sync="dialogFormVisibleOne"
      width="80%"
    >
      <Table
        :tableData="tableDataTwo"
        :operation="operation"
        :columns="columns2"
        :showSelection="false"
      >
      </Table>
      <div
        style="font-size: 18px;font-weight: 100;color: #333;padding: 0 20px 10px 20px;"
      >
        应收账单
      </div>
      <Table
        :tableData="tableDataOne"
        :operation="operation"
        :columns="columns1"
        :showSelection="false"
      >
      </Table>
      <div class="finance-table-price">
        <div>账单合计：{{ getOrgn(this.totalArOrgn) }}</div>
        <div>人民币合计：￥{{ this.totalArCny.toLocaleString("en-US") }}</div>
        <div>结算方式：{{ this.payWay == 0 ? "付款买单" : "月结买单" }}</div>
      </div>
      <div
        style="font-size: 18px;font-weight: 100;color: #333;padding: 10px 20px 10px 20px;"
      >
        修改记录
      </div>
      <Table
        :tableData="tableDataThree"
        :operation="operation"
        :columns="columns3"
        :showSelection="false"
      >
      </Table>
    </el-dialog>
    <el-dialog
      title="应收核销操作记录"
      :visible.sync="dialogFormVisibleTwo"
      width="90%"
      top="35vh"
    >
      <div style="width:100%;" class="operateList">
        <el-table :data="receiveOperate">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="订单号" prop="orderNo"></el-table-column>
          <el-table-column label="运单号" prop="waybillNo"></el-table-column>
          <el-table-column
            label="应收对象"
            prop="reconciliationUnit"
          ></el-table-column>
          <el-table-column label="应收金额" prop="totalArOrgn">
            <template slot-scope="scope">
              <div>
                {{ getOrgn(scope.row.totalArOrgn) }}
              </div>
            </template>
          </el-table-column>

          <el-table-column label="记录" width="600">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.records" :key="index">
                <div v-if="item.status == 2">
                  操作{{ index + 1 }}:{{ item.writeOffOperator }}
                  <span style="color:red;margin-left:10px">撤销"</span
                  ><span
                    >操作{{ item.revokeSerialNo }}"
                    <span style="display:none">核销金额:XXXHKD</span>
                    {{ item.revokeTime }}</span
                  >
                </div>
                <div v-else>
                  操作{{ index + 1 }}:{{ item.writeOffOperator }}
                  <span v-if="item.status == 0 && item.woType == 1"
                    >使用预收记录</span
                  >
                  <span style="color:skyblue;margin-left:10px">核销</span
                  ><span
                    >该订单,核销金额: {{ item.writeOffAmount
                    }}{{ currencyType[item.currency] }}</span
                  ><span style="margin-left:10px">{{ item.writeOffTime }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="100" label="操作">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.records" :key="index">
                <div
                  v-if="item.status == 0"
                  style="color:skyblue;cursor:pointer"
                  @click="confirmReset(index, item.woIds, scope.row)"
                  v-auth="['104005_B']"
                >
                  撤销
                </div>
                <div v-else-if="item.status == 2" style="opacity:0;">撤销</div>
                <div v-else-if="item.status == -1">已撤销</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 正常/预收核销按钮弹框 -->
    <el-dialog
      :title="this.dialogFormVisibleYS ? '使用预收记录核销' : '应收核销'"
      :visible.sync="dialogFormVisibleThree"
      width="1000px"
      style="margin:auto;"
    >
      <el-table
        ref="ysTable"
        v-if="dialogFormVisibleYS"
        :data="ysTableData"
        style="width: 100%"
        :row-key="row => row.id"
        @selection-change="ysSelectionChange"
        max-height="400"
      >
        <el-table-column type="selection" :reserve-selection="true" width="55">
        </el-table-column>
        <el-table-column prop="accountVoucherNo" label="会计凭证号" width="120">
        </el-table-column>
        <el-table-column prop="receiptDate" label="收款时间" width="120">
        </el-table-column>
        <el-table-column prop="payer" label="付款人名称" width="120">
          <template slot-scope="scope">
            <div
              style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"
              :title="scope.row.payer"
            >
              {{ scope.row.payer }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="exchangeRate" label="汇率" width="120">
        </el-table-column>
        <el-table-column prop="amount" label="收款金额" width="120">
          <template slot-scope="scope">
            <div>
              {{
                currencyLabel[chargeOffData.currency] + " " + scope.row.amount
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="writeOffLeft" label="核销剩余金额" width="140">
          <template slot-scope="scope">
            <div>
              {{
                currencyLabel[chargeOffData.currency] +
                  " " +
                  scope.row.writeOffLeft
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="receiptType" label="实收类型" width="120">
          <template slot-scope="scope">
            <div>
              {{ scope.row.receiptType == 0 ? "预收" : "额外收入" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="payeeName" label="收款人名称" width="120">
          <template slot-scope="scope">
            <div
              style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"
              :title="scope.row.payeeName"
            >
              {{ scope.row.payeeName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="payeeBank" label="收款人开户行" width="140">
          <template slot-scope="scope">
            <div
              style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"
              :title="scope.row.payeeBank"
            >
              {{ scope.row.payeeBank }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="payeeAccount" label="收款人账号" width="140">
        </el-table-column>
      </el-table>
      <div
        style="text-align:center;color:silver;margin-top:20px"
        v-if="dialogFormVisibleYS"
      >
        <span style="fontSize:14px;fontWeight:400"
          >预收记录收款金额:{{
            currencyLabel[chargeOffData.currency] + " " + ysAmount
          }}</span
        >
        <span style="margin-left:30px;fontSize:14px;fontWeight:400"
          >预收记录核销剩余金额:{{
            currencyLabel[chargeOffData.currency] + " " + ysWriteOffLeft
          }}</span
        >
      </div>
      <el-form
        style="display:flex;flex-wrap:wrap;justify-content:space-between;margin-top:20px"
        label-position="left"
      >
        <el-form-item label="本次核销金额:" required label-width="130px">
          <el-input
            v-if="!dialogFormVisibleYS"
            v-model="chargeOffData.writeOffAmount"
            placeholder="请输入核销金额"
            style="width:200px"
            onkeyup="this.value= this.value.match(/^-?\d{0,10}(\.\d{0,2})?/)? this.value.match(/^-?\d{0,10}(\.\d{0,2})?/)[0] : ''"
            @blur="chargeOffData.writeOffAmount = $event.target.value"
          ></el-input>
          <el-input
            v-else
            v-model="chargeOffData.writeOffAmount"
            placeholder="请输入核销金额"
            style="width:200px"
            onkeyup="this.value= this.value.match(/^\d{0,10}(\.\d{0,2})?/)? this.value.match(/^\d{0,10}(\.\d{0,2})?/)[0] : ''"
            @blur="chargeOffData.writeOffAmount = $event.target.value"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="收款账户信息:"
          required
          class="formItem"
          label-width="130px"
        >
          <div style="width:300px;" v-if="dialogFormVisibleYS">
            <el-popover
              placement="bottom"
              width="200"
              trigger="hover"
              popper-class="orderNoReceive"
            >
              <div
                v-for="(item, index) in ysAllData.userInfo"
                :key="index"
                style="whiteSpace:nowrap;"
              >
                {{ item }}
              </div>
              <div
                style="width:260px;color:silver;fontSize:13px;whiteSpace:nowrap;overflow:hidden;textOverflow:ellipsis"
                slot="reference"
              >
                {{ ysAllData.userInfo[0] }}
              </div>
            </el-popover>
          </div>

          <el-select
            v-else
            id="getAccountInfo"
            v-model="chargeOffData.userInfo"
            placeholder="请输入收款账户信息"
            :remote-method="chargeInfoMethod"
            clearable
            filterable
            remote
            reserve-keyword
            style="width: 300px"
          >
            <el-option
              v-for="item in chargeUserInfo"
              :key="item.id"
              :label="
                `${item.accountBank}-${item.userName}-${item.bankAccount}`
              "
              :value="
                `${item.accountBank}-${item.userName}-${item.bankAccount}`
              "
            >
              <span>{{ item.accountBank }}-</span>
              <span>{{ item.userName }}-</span>
              <span>{{ item.bankAccount }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="币种:" required label-width="130px">
          <el-select
            v-model="chargeOffData.currency"
            placeholder="请选择币种"
            @change="changeCurrency"
            style="width: 200px"
          >
            <el-option
              v-for="(item, index) in chargeMoney"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收款方式:" required label-width="130px">
          <div
            v-if="dialogFormVisibleYS"
            style="width:300px;color:silver;fontSize:13px"
          >
            银行转账
          </div>
          <el-select
            v-model="chargeOffData.writeOffWay"
            placeholder="请选择收款方式"
            clearable
            style="width: 300px"
            v-else
          >
            <el-option
              v-for="(item, index) in chargeWriteOffWay"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="到账时间:" required label-width="130px">
          <div style="width:260px;" v-if="dialogFormVisibleYS">
            <el-popover
              placement="bottom"
              width="200"
              trigger="hover"
              popper-class="orderNoReceiveS"
            >
              <div
                v-for="(item, index) in ysAllData.payDate"
                :key="index"
                style="whiteSpace:nowrap;"
              >
                {{ item }}
              </div>
              <div
                style="color:silver;fontSize:13px;display:inline-block"
                slot="reference"
              >
                {{ ysAllData.payDate[0] }}
              </div>
            </el-popover>
          </div>

          <el-date-picker
            style="width: 200px"
            v-model="chargeOffData.payDate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            v-else
            :picker-options="$store.getters.tomorrowDisabledDatePickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结算方式:" label-width="120px">
          <div style="width:300px">
            <el-radio-group v-model="chargeOffData.payWay">
              <el-radio label="0">付款买单</el-radio>
              <el-radio label="1">月结</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
      </el-form>
      <div style="display:flex;flex-wrap:wrap;width:84%;margin:15px auto 0">
        <div style="flex:0 0 33%">订单总金额:{{ moneyData[0] }}</div>
        <div style="flex:0 0 33%">
          申请开票总金额:{{ currencyLabel[chargeOffData.currency] + " "
          }}{{ moneyData[1] }}
        </div>
        <div style="flex:0 0 33%">已开票总金额:{{ moneyData[2] }}</div>
        <div style="flex:0 0 33%;margin-top:15px">
          未核销金额:{{ currencyLabel[chargeOffData.currency] + " "
          }}{{ moneyData[3] }}
        </div>
        <div style="flex:0 0 33%;margin-top:15px">
          已核销金额:{{ currencyLabel[chargeOffData.currency] + " "
          }}{{ moneyData[4] }}
        </div>
      </div>
      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <div style="text-align: center;padding-top:20px;" class="footButton">
          <el-button size="medium" type="primary" @click="confirmReceive"
            >确认核销</el-button
          >
          <el-button size="medium" @click="dialogFormVisibleThree = false"
            >取 消
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 生成对账单弹框 -->
    <el-dialog :visible.sync="dialogFormVisibleFour" width="80%">
      <div style="text-align:center">
        <div style="fontSize:20px;fontWeight:bolder;margin:30px 0 15px 0">
          上海飞莱达供应链管理有限公司
        </div>
        <div style="fontWeight:bold;fontSize:12px;margin-bottom:10px">
          Shanghai Feilaida Supply Chain Management Co., Ltd.
        </div>
        <div style="fontWeight:bold;fontSize:12px;margin-bottom:10px">
          上海市青浦区诸光路1588弄虹桥世界中心L3B栋606-608
        </div>
        <div style="fontWeight:bold;fontSize:12px;margin-bottom:30px">
          客户对账单
        </div>
        <hr />
        <div style="margin:8px 0;text-align:center;position:relative">
          <span style="position:absolute;left:0;">{{
            dialFourDatas.reconciliationUnit
          }}</span>
          <span>费用明细单</span>
        </div>
        <el-table :data="dialFourTable">
          <el-table-column label="委托单号" prop="orderNo"></el-table-column>
          <el-table-column
            label="业务类型"
            prop="businessType"
          ></el-table-column>
          <el-table-column
            label="航班日期"
            prop="departureDate"
          ></el-table-column>
          <el-table-column label="运单号" prop="waybillNo"></el-table-column>
          <el-table-column
            label="起运港-目的港"
            prop="polAndPod"
          ></el-table-column>
          <el-table-column label="单价" prop="price"></el-table-column>
          <el-table-column label="计费重" prop="cwStr"></el-table-column>
          <el-table-column label="币种" prop="currencyStr"></el-table-column>
          <el-table-column label="应收金额" prop="totalArCny"></el-table-column>
          <el-table-column
            label="开票金额"
            prop="invoiceAmount"
          ></el-table-column>
        </el-table>
        <div style="display:flex;justify-content:space-between;margin:15px 0 ">
          <div>总票数:{{ dialFourDatas.totalOrderNum }}</div>
          <div>开票金额: ¥ {{ dialFourDatas.invoiceAmount }}</div>
          <div>应收金额: ¥ {{ dialFourDatas.totalArCny }}</div>
          <div>已收金额: ¥ {{ dialFourDatas.totalWoCny }}</div>
          <div>未收金额: ¥ {{ dialFourDatas.totalUnWoCny }}</div>
        </div>
      </div>
      <el-form label-position="left">
        <el-form-item required label=" ">
          <el-input
            type="text"
            v-model="dialCheckInfo.feeWarnInfo"
            placeholder="上信息请确认签字盖章回传,如若未回复三个工作日内默认确认,请悉知！"
            style="width:50%"
          ></el-input>
        </el-form-item>
        <div style="margin:30px 0 20px 10px;fontSize:15px;fontWeight:bold">
          我司信息:
        </div>
        <el-form-item label="公司开户名" required label-width="100px">
          <el-input
            type="text"
            v-model="dialCheckInfo.accountName"
            placeholder="请输入公司开户名"
            style="width:50%"
            maxlength="40"
          ></el-input>
        </el-form-item>
        <el-form-item label="开户行" required label-width="100px">
          <el-input
            type="text"
            v-model="dialCheckInfo.accountBank"
            placeholder="请输入开户行"
            style="width:50%"
            maxlength="30"
          ></el-input>
        </el-form-item>
        <el-form-item label="人民币账号" required label-width="100px">
          <el-input
            type="text"
            v-model="dialCheckInfo.bankAccountCny"
            placeholder="请输入人民币账号"
            style="width:50%"
            maxlength="19"
          ></el-input>
        </el-form-item>
        <el-form-item label="美金账号" required label-width="100px">
          <el-input
            type="text"
            v-model="dialCheckInfo.bankAccountUsd"
            style="width:50%"
            maxlength="19"
          ></el-input>
        </el-form-item>
        <div style="margin:20px 0">
          <span>签字:</span><span style="margin-left:200px">日期:</span>
        </div>
        <div
          style="display:flex;justify-content:space-between;padding-bottom:30px;height:40px"
        >
          <el-form-item label=" " required style="width:70%">
            <el-input
              type="text"
              v-model="dialCheckInfo.statementWarnInfo"
              style="width:80%"
              placeholder="若有异议,请联系我司财务部,联系电话:17898843921"
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-button sizi="mini" @click="exportAccount" v-auth="['104003_B']"
            >导出对账单</el-button
          >
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Table from "@/components/financeTable";
export default {
  data() {
    return {
      
      sysOrgs: [],
      fettleList: [
        { id: "", name: "全部" },
        { id: 0, name: "正常" },
        { id: 1, name: "作废" }
      ],
      //复制表格查询数据-分页跳转使用
      copySelectJSON: [],
      selectControl: false,
      pageSkipChecked: false, //跨页全选
      statistDataShow: false, //数据统计
      statistData: {}, //数据统计数据
      errorStatist: false, //数据统计异常
      //表格控制列drawer
      drawer: false,
      checkAll: false,
      isIndeterminate: true,
      direction: "rtl",
      checkedTable: [
        "财务系列号",
        "订单号",
        "运单号",
        "结算对象",
        "应收金额",
        "开票抬头",
        "申请开票金额",
        "已开票金额",
        // "开票备注",
        "已核销金额",
        "未核销金额",
        "汇率",
        "结算方式",
        "核销次数",
        "核销状态",
        "航班日期",
        "交单时间",
        "应付总金额",
        "利润"
      ],
      tableOptions: [
        "财务系列号",
        "订单号",
        "运单号",
        "结算对象",
        "应收金额",
        "开票抬头",
        "申请开票金额",
        "已开票金额",
        // "开票备注",
        "已核销金额",
        "未核销金额",
        "汇率",
        "结算方式",
        "核销次数",
        "核销状态",
        "航班日期",
        "交单时间",
        "应付总金额",
        "利润"
      ],
      //表格tab页
      tabName: ["可操作", "业务修改中", "异常"],
      tabNum: [0, 0, 0],
      typeCode: "可操作",
      customerResponsibles: [],
      //核销状态
      writeOffStatus: [
        { value: "全部", id: "" },
        { value: "未对账未核销", id: "0" },
        { value: "部分对账未核销", id: "1" },
        { value: "已对账未核销", id: "2" },
        { value: "部分对账部分核销", id: "4" },
        { value: "已对账部分核销", id: "5" },
        { value: "已对账已核销", id: "8" }
      ],
      payWayData: [
        { value: "全部", id: "" },
        { value: "付款买单", id: 0 },
        { value: "月结买单", id: 1 }
      ],
      //搜索框结果
      selectResult: {
        customerResponsibleId: "",
        orgId: "",
        orderNos: "",
        waybillNos: "",
        companyName: null,
        customerName: "",
        agentId: "",
        airCompanyCode: "",
        invoiceTitle: "",
        financialSeriesNo: "",
        pol: "",
        pod: "",
        payWay: "",
        rcvWriteOffStatusList: [""],
        mscsId: "",
        pscsId: "",
        startDepartureDate: "",
        endDepartureDate: "",
        startPresentationTime: "",
        endPresentationTime: "",
        principalId: "",
        fettle: ""
      },
      //表格选中数据
      selectTableData: [],
      //预收核销弹框表格数据
      ysSelectData: [],
      //表格数据
      tableData: [],
      //表格分页
      pageSize: 10,
      pageNum: 1,
      total: 0,
      //弹框控制
      dialogTitleOne: "",
      dialogFormVisibleOne: false,
      dialogFormVisibleTwo: false,
      dialogFormVisibleThree: false,
      dialogFormVisibleFour: false,
      dialogFormVisibleYS: false,
      //核销次数弹框
      receiveOperate: [{}],
      //订单号列弹框数据
      totalArOrgn: "",
      totalArCny: "",
      payWay: "",
      //订单号列弹框表格数据
      columns1: [
        { label: "序号", show: true, width: "50" },
        { label: "费用名称", prop: "expenseName", show: true, width: "100" },
        {
          label: "收款单位",
          prop: "expenseUnitName",
          show: true,
          width: "150"
        },
        { label: "单价", prop: "price", show: true, width: "100" },
        { label: "数量", prop: "quantity", show: true, width: "100" },
        { label: "币种", prop: "currency", show: true, width: "100" },
        { label: "原币合计", prop: "totalOrgn", show: true, width: "100" },
        { label: "汇率", prop: "exchangeRateOnly", show: true, width: "100" },
        { label: "人民币合计", prop: "totalCny", show: true, width: "100" },
        { label: "备注", prop: "remark", show: true, width: "50" }
      ],
      columns2: [
        { label: "结算对象", prop: "customerName", show: true, width: "100" },
        {
          label: "代理上家",
          prop: "agentName",
          show: true,
          width: "150"
        },
        { label: "航司", prop: "airCompanyCode", show: true, width: "100" },
        { label: "起运港", prop: "pol", show: true, width: "100" },
        { label: "目的港", prop: "pod", show: true, width: "100" },
        { label: "货物信息", prop: "cargoInfo", show: true, width: "100" },
        { label: "操作人员", prop: "operation", show: true, width: "100" }
      ],
      columns3: [
        { label: "操作类型", prop: "operationType", show: true, width: "150" },
        { label: "说明", prop: "operationInfo", show: true, width: "100" },
        { label: "操作时间", prop: "createTime", show: true, width: "150" },
        { label: "操作人", prop: "operator", show: true, width: "100" }
      ],
      // 操作
      operation: {
        show: false,
        label: "操作",
        width: "180",
        options: [{ label: "编辑", method: "routeEdit" }]
      },
      currencyType: {},
      currencyLabel: [],
      //应收订单弹框数据
      tableDataOne: [],
      tableDataTwo: [],
      tableDataThree: [],

      //核销弹框数据
      chargeOffData: {
        writeOffAmount: "",
        writeOffWay: "",
        payWay: "0",
        currency: "",
        userInfo: "",
        payDate: ""
      },
      chargeMoney: [], //币种
      copyChargeNum: [],
      chargeWriteOffWay: [
        { value: 0, label: "银行转账" },
        { value: 1, label: "应付对冲" }
      ], //收款方式
      chargeUserInfo: [], //收款账户信息
      moneyData: [0, 0, 0, 0, 0],

      //生成对账单弹框数据
      dialFourTable: [],
      dialFourDatas: {},
      dialCheckInfo: {
        feeWarnInfo:
          "上信息请确认签字盖章回传,如若未回复三个工作日内默认确认,请悉知！",
        accountName: "上海飞莱达供应链管理有限公司",
        accountBank: "中国银行上海万科支行",
        bankAccountCny: "4390817",
        bankAccountUsd: "",
        statementWarnInfo: "若有异议,请联系我司财务部,联系电话:17898843921"
      },
      //航班日期选择器
      // 限制结束日期大于开始日期
      pickerOptionsStartOne: {
        disabledDate: time => {
          let endDateVal = this.selectResult.endDepartureDate;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        }
      },
      pickerOptionsEndOne: {
        disabledDate: time => {
          let beginDateVal = this.selectResult.startDepartureDate;
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime() - 8.64e7;
          }
        }
      },
      // 下单时间
      pickerOptionsStartTwo: {
        disabledDate: time => {
          let endDateVal = this.selectResult.endPresentationTime;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        }
      },
      pickerOptionsEndTwo: {
        disabledDate: time => {
          let beginDateVal = this.selectResult.startPresentationTime;
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime() - 8.64e7;
          }
        }
      },
      //搜索框接口数据
      agentOpt: [],
      polOpt: [],
      podOpt: [],
      airCompanyCodeOpt: [],
      payBefore: [],
      paying: [],
      airManger: [],
      ysAmount: 0,
      ysWriteOffLeft: 0,
      ysTableData: [],
      customerNameArray: ""
    };
  },
  mounted() {
    var array = this.$store.getters.getCurrencyIdObjArr;
    (this.currencyType = array[0]),
      (this.currencyLabel = array[1]),
      this.findThisUserAndBranchOrg();
    this.searchClick();
    this.initAgentList();
    this.initAirportSearchByPage();
    this.initCompanySearchByPage();
    this.operateData();
    this.dom();
    this.customerNameMethod();
    this.searchBranchUsers({
      roleName: "",
      listName: "customerResponsibles"
    });
  },
  methods: {
    async searchBranchUsers({ roleName = "", listName }) {
      try {
        const {
          data: { data }
        } = await this.$api.searchBranchUsers(
          {},
          {
            params: {
              roleName
            }
          }
        );
        this[listName] = data.map(item => {
          return {
            value: item.id,
            label: item.name,
            longLabel: `${item.name} ${item.branchNames}`
          };
        });
      } catch (error) {}
    },
    async findThisUserAndBranchOrg() {
      const {
        data: { data }
      } = await this.$api.findThisUserAndBranchOrg();
      this.sysOrgs = data.map(item => {
        return {
          value: item.id,
          label: item.name
        };
      });
    },
    customerNameMethod(certificationBody) {
      if (!certificationBody) {
        certificationBody = "";
      }
      var data = {
        certificationBody: certificationBody
      };
      this.$http
        .post(this.$service.searchViews, data, {
          params: {
            typeCode: 1
          }
        })
        .then(data => {
          if (data.code == 200) {
            this.customerNameArray = data.data.map(item => {
              return {
                label: item.companyName,
                value: item.id
              };
            });
          }
        });
    },
    setLimit(e) {
      this.selectResult.financialSeriesNo = e.replace(/[\W]/g, "");
    },
    //起始港三字码
    initAirportSearchByPage(keyWord, type) {
      if (!keyWord) {
        keyWord = "";
      }
      this.$http
        .get(this.$service.airportSearchByPage + "?keyWord=" + keyWord)
        .then(data => {
          this.loading = false;
          if (data.code == 200) {
            if (type == "起始港") {
              this.polOpt = data.data.records;
            } else if (type == "目的港") {
              this.podOpt = data.data.records;
            } else {
              this.polOpt = data.data.records;
              this.podOpt = data.data.records;
            }
          } else {
            this.$message.error(data.message);
          }
        });
    },
    polMethod(keyWord) {
      this.loading = true;
      this.initAirportSearchByPage(keyWord, "起始港");
    },
    podMethod(keyWord) {
      this.loading = true;
      this.initAirportSearchByPage(keyWord, "目的港");
    },
    //预收核销表格选中事件
    ysSelectionChange(e) {
      this.ysSelectData = e;
      //弹框表格下-预收记录累加计算
      this.ysAmount = this.ysSelectData.reduce((s, v) => s + v.amount, 0);
      this.ysWriteOffLeft = this.ysSelectData.reduce(
        (s, v) => s + v.writeOffLeft,
        0
      );

      //收款账户信息及到账时间
      this.ysAllData.userInfo = this.ysSelectData.map(
        item => item.payeeBank + "-" + item.payeeName + "-" + item.payeeAccount
      );
      this.ysAllData.payDate = this.ysSelectData.map(item => item.receiptDate);
    },
    //下拉框搜索框控制
    shiftSelectControl() {
      this.selectControl = !this.selectControl;
    },
    autoValue(e, type) {
      if (this.polOpt.some(item => item.threeLetterCode == e)) {
        if (type == "pod") {
          this.selectResult.pod = e;
        } else {
          this.selectResult.pol = e;
        }
      }
    },
    //汇率处理
    getExchangeRate(exchangeRate) {
      var orgn = exchangeRate;
      var totalOrgn = "";
      orgn = JSON.parse(orgn);
      if (orgn && orgn.length > 0) {
        for (var i = 0; i < orgn.length; i++) {
          var obj = this.currencyArrays.filter(item => {
            return item.id == orgn[i].currency;
          });
          totalOrgn = totalOrgn + obj[0]["code"] + ":" + Number(orgn[i].amount);
          if (i < orgn.length - 1) {
            totalOrgn = totalOrgn + "\n";
          }
        }
      }
      return totalOrgn;
    },
    //原币处理
    dealOrgn(orgn, extraWord) {
      if (!orgn) {
        return "¥ " + 0;
      }
      orgn = JSON.parse(orgn);
      var totalOrgn = "";
      if (orgn && orgn.length > 0) {
        for (var i = 0; i < orgn.length; i++) {
          var obj = this.currencyArrays.filter(item => {
            return item.id == orgn[i].currency;
          });
          totalOrgn = totalOrgn + obj[0]["symbol"] + Number(orgn[i].amount);
          if (i < orgn.length - 1) {
            totalOrgn = totalOrgn + "\n";
          }
        }
      } else {
        totalOrgn = "¥ " + 0;
      }
      return (extraWord ? extraWord + ":" : "") + totalOrgn;
    },
    dealOrgnS(orgn, extraWord) {
      if (!orgn) {
        return "¥ " + 0;
      }
      orgn = JSON.parse(orgn);
      var totalOrgn = "";
      if (orgn && orgn.length > 0) {
        for (var i = 0; i < orgn.length; i++) {
          var obj = this.currencyArrays.filter(item => {
            return item.id == orgn[i].currency;
          });
          totalOrgn =
            totalOrgn +
            obj[0]["symbol"] +
            Number(orgn[i].amount).toLocaleString("en-US");
          if (i < orgn.length - 1) {
            totalOrgn = totalOrgn + "\n";
          }
        }
      } else {
        totalOrgn = "¥ " + 0;
      }
      return (extraWord ? extraWord + ":" : "") + totalOrgn;
    },
    //限制搜索条件的最大位数
    dom() {
      //代理上家
      const select = document.querySelector("#agentId");
      select.setAttribute("maxLength", 30);
      //航司
      const select1 = document.querySelector("#airCompany");
      select1.setAttribute("maxLength", 15);
      //起运港目的港
      const select2 = document.querySelector("#pod");
      select2.setAttribute("maxLength", 15);
      const select3 = document.querySelector("#pol");
      select3.setAttribute("maxLength", 15);
      //售前售中航线
      const select4 = document.querySelector("#pscsId");
      select4.setAttribute("maxLength", 10);
      const select5 = document.querySelector("#mscsId");
      select5.setAttribute("maxLength", 10);
      const select6 = document.querySelector("#principalId");
      select6.setAttribute("maxLength", 10);
    },
    //表格列全选控制
    handleCheckAllChange(val) {
      this.checkedTable = val ? this.tableOptions : [];
      this.isIndeterminate = false;
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.abnormalFlag == 1 && row.orderProfit >= 0) {
        return "background-color: #CD5C5C";
      } else if (row.orderProfit < 0 && row.orderProfit > -200) {
        return "background-color: #FFDEAD";
      } else if (row.orderProfit <= -200 && row.orderProfit > -500) {
        return "background-color: #F4A460";
      } else if (row.orderProfit <= -500) {
        return "background-color: #FA8072";
      }
    },
    // 处理input的输入选择
    querySearch(q, cb) {
      let tempQuery = [];
      let arrayt = [];
      q = q
        .replace(/，/gi, ",")
        .replace(/\s/gi, ",")
        .replace(/\//g, ",")
        .replace(/-/gi, "")
        .replace(/,/gi, ",");
      if (q.charAt(q.length - 1) == ",") {
        q = q.slice(0, q.length - 1);
      }
      if (q.indexOf(",")) {
        tempQuery = q.split(",");
      } else {
        tempQuery[0] = q;
      }
      for (let i in tempQuery) {
        let newobj = {};
        newobj.value = tempQuery[i];
        newobj.label = tempQuery[i];
        arrayt.push(newobj);
      }
      cb(arrayt);
    },
    //生成对账单
    getStatement() {
      if (this.typeCode == "业务修改中") {
        this.$message({
          type: "warning",
          message: "该tab页数据不支持生成对账单"
        });
        return;
      }
      if (this.selectTableData.length == 0) {
        this.$message({
          type: "warning",
          message: "请至少勾选一条数据"
        });
      } else if (
        !this.selectTableData.every(
          item =>
            item.reconciliationUnit ==
            this.selectTableData[0].reconciliationUnit
        )
      ) {
        this.$message({
          type: "warning",
          message: "应收对象不一致,请重新勾选"
        });
      } else {
        this.dialCheckInfo = {
          feeWarnInfo:
            "上信息请确认签字盖章回传,如若未回复三个工作日内默认确认,请悉知！",
          accountName: "上海飞莱达供应链管理有限公司",
          accountBank: "中国银行上海万科支行",
          bankAccountCny: "4390817",
          bankAccountUsd: "",
          statementWarnInfo: "若有异议,请联系我司财务部,联系电话:17898843921"
        };
        let requestData = {};
        if (this.pageSkipChecked == false) {
          requestData.overPageCheck = false;
          requestData.rcvTitles = this.selectTableData.map(
            item => `${item.id}@@${item.invoiceTitle}@@${item.orderId}`
          );
        } else {
          requestData.overPageCheck = true;
          requestData.financePageDTO = this.searchDataDeal();
        }
        this.$http
          .post(this.$service.getAccountStatement, requestData)
          .then(res => {
            if (res.code == 200) {
              this.dialFourTable = res.data.fees;
              this.dialFourDatas = res.data.summationInfo;
              this.dialFourDatas.reconciliationUnit =
                res.data.checkInfo.reconciliationUnit;
              this.dialogFormVisibleFour = true;
            } else {
              this.$message.error(res.message);
            }
          });
      }
    },
    //生成对账单-导出对账单
    exportAccount() {
      if (Object.values(this.dialCheckInfo).some(item => item == "")) {
        this.$message.warning("请填写全部信息");
        return;
      }
      let request = {};
      request.fees = this.dialFourTable;
      request.summationInfo = JSON.parse(JSON.stringify(this.dialFourDatas));
      request.checkInfo = this.dialCheckInfo;
      request.checkInfo.reconciliationUnit =
        request.summationInfo.reconciliationUnit;
      delete request.summationInfo.reconciliationUnit;
      this.$http
        .post(this.$service.exportCheckPdf, request, {
          responseType: "arraybuffer"
        })
        .then(res => {
          const aLink = document.createElement("a");
          let blob = new Blob([res], {
            type: "application/pdf"
          });
          aLink.href = URL.createObjectURL(blob);
          aLink.setAttribute("download", "应收统计对账单" + ".pdf");
          aLink.click();
          document.body.appendChild(aLink);
          this.dialogFormVisibleFour = false;
        });
    },
    //预收核销表格
    getYsData(params) {
      return this.$http.post(this.$service.receiptSearch, params).then(res => {
        if (res.code == 200) {
          this.ysTableData = res.data.records;
          console.log(this.ysTableData);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //核销按钮
    chargeOff(ifYsVertify) {
      if (this.selectTableData.length == 0) {
        this.$message({
          type: "warning",
          message: "请至少勾选一条数据进行核销操作"
        });
      } else if (this.selectTableData.some(item => !item.invoiceTitle)) {
        this.$message({
          type: "warning",
          message: "存在未开票订单,不能核销，请重新勾选"
        });
      } else if (
        !this.selectTableData.every(
          item => item.invoiceTitle == this.selectTableData[0].invoiceTitle
        )
      ) {
        this.$message({
          type: "warning",
          message: "开票抬头不一致,请重新勾选"
        });
      } else {
        this.dialogFormVisibleYS = false;
        this.ysSelectData = [];
        (this.chargeOffData = {
          writeOffAmount: "",
          writeOffWay: "",
          payWay: "0",
          currency: "",
          userInfo: "",
          payDate: ""
        }),
          (this.copyChargeNum = []);
        this.moneyData = [0, 0, 0, 0, 0];
        this.chargeInfoMethod();
        let requestData = {};
        if (this.pageSkipChecked == true) {
          requestData.financePageDTO = this.searchDataDeal();
          requestData.overPageCheck = true;
        } else {
          requestData.overPageCheck = false;
          requestData.rcvTitles = this.selectTableData.map(
            item => `${item.id}@@${item.invoiceTitle}@@${item.orderId}`
          );
        }

        this.$http
          .post(this.$service.getWoFrameData, requestData)
          .then(async res => {
            if (res.code == 200) {
              let copyChargeMoney = res.data.currencyList;
              this.moneyData[0] = res.data.totalArCny;
              this.chargeMoney = [];
              //弹框底部未核销金额和已核销金额（需要随币种选择框变化）
              this.copyChargeNum[0] = res.data.applyAmountOrgn;
              this.copyChargeNum[1] = res.data.invoicedAmountOrgn;
              this.copyChargeNum[2] = res.data.arUnWoOrgn;
              this.copyChargeNum[3] = res.data.arWoOrgn;
              // console.log(copyChargeMoney,"0000");
              copyChargeMoney.forEach((item, index) => {
                //设置币种选项
                var obj = {};
                obj.label = this.currencyType[item];
                obj.value = item;
                this.$set(this.chargeMoney, index, obj);
              });
              //预收核销
              if (ifYsVertify) {
                (this.ysAllData = {
                  userInfo: [],
                  payDate: []
                }),
                  (this.ysWriteOffLeft = 0);
                this.ysAmount = 0;
                this.dialogFormVisibleYS = true;
                await this.getYsData({
                  pageNum: 1,
                  pageSize: 5000,
                  invoiceTitle: this.selectTableData[0].invoiceTitle,
                  currency: this.chargeMoney[0].value,
                  queryType: 1
                });
                this.dialogFormVisibleThree = true;
              } //正常核销
              else {
                this.dialogFormVisibleThree = true;
                this.$nextTick(() => {
                  const select7 = document.querySelector("#getAccountInfo");
                  select7.setAttribute("maxLength", 30);
                });
              }
              if (this.chargeMoney.length > 0) {
                this.chargeOffData.currency = this.chargeMoney[0].value;
                this.changeCurrency(this.chargeMoney[0].value);
              }
            } else {
              this.$message.error(res.message);
            }
          });
      }
    },
    //核销按钮弹框 币种选择框change
    changeCurrency(data) {
      if (this.$refs.ysTable) {
        this.$refs.ysTable.clearSelection();
      }
      this.ysAmount = 0;
      this.ysWriteOffLeft = 0;
      let copy = JSON.parse(JSON.stringify(this.copyChargeNum));
      this.moneyData[1] = JSON.parse(copy[0]).filter(
        item => item.currency == data
      )[0].amount;
      let copyData = copy[1][data];
      let res = "";
      for (let i in copyData) {
        res += this.currencyLabel[i] + " " + copyData[i] + "+";
      }

      this.moneyData[2] = res.slice(0, -1);
      this.moneyData[3] = JSON.parse(copy[2]).filter(
        item => item.currency == data
      )[0].amount;
      this.moneyData[4] = JSON.parse(copy[3]).filter(
        item => item.currency == data
      )[0].amount;
      console.log(copy, data, this.moneyData);

      if (this.dialogFormVisibleYS) {
        this.getYsData({
          pageNum: 1,
          pageSize: 5000,
          invoiceTitle: this.selectTableData[0].invoiceTitle,
          currency: data,
          queryType: 1
        });
      }
    },
    //核销按钮弹框确认核销
    confirmReceive() {
      if (
        !this.dialogFormVisibleYS &&
        Object.values(this.chargeOffData).indexOf("") != -1
      ) {
        this.$message.warning("请完成信息填写");
        return;
      } else if (
        this.dialogFormVisibleYS &&
        !this.chargeOffData.writeOffAmount
      ) {
        this.$message.warning("请完成信息填写");
        return;
      } else if (this.chargeOffData.writeOffAmount > this.moneyData[3]) {
        this.$message.warning("输入的核销金额>未核销金额,请重新输入");
        return;
      } else if (
        this.dialogFormVisibleYS &&
        this.chargeOffData.writeOffAmount > this.ysWriteOffLeft
      ) {
        this.$message.warning("输入的核销金额>预收记录剩余核销金额,请重新输入");
        return;
      }

      let requestData = JSON.parse(JSON.stringify(this.chargeOffData));
      if (!this.dialogFormVisibleYS) {
        let array = requestData.userInfo.split("-");
        requestData.accountBank = array[0];
        requestData.accountName = array[1];
        requestData.bankAccount = array[2];
        delete requestData.userInfo;
      }
      requestData.exportWoDTO = { overPageCheck: this.pageSkipChecked };
      if (this.pageSkipChecked == false) {
        requestData.writeOffWay = this.dialogFormVisibleYS
          ? 0
          : this.chargeOffData.writeOffWay;
        requestData.advIds = this.ysSelectData.map(item => item.id);
        requestData.exportWoDTO.rcvTitles = this.selectTableData.map(
          item => `${item.id}@@${item.invoiceTitle}@@${item.orderId}`
        );
        delete requestData.userInfo;
        // delete requestData.payDate
      } else {
        requestData.advIds = this.ysSelectData.map(item => item.id);
        requestData.exportWoDTO.financePageDTO = this.searchDataDeal();
      }

      if (!this.dialogFormVisibleYS) {
        this.$http.post(this.$service.arWriteOff, requestData).then(res => {
          if (res.code == 200) {
            this.$message.success("确认核销成功");
            this.dialogFormVisibleThree = false;
          } else {
            this.$message.error(res.message);
          }
          this.initData(this.searchDataDeal());
        });
      } else {
        this.$http.post(this.$service.arAdWriteOff, requestData).then(res => {
          if (res.code == 200) {
            this.$message.success("确认核销成功");
            this.dialogFormVisibleThree = false;
          } else {
            this.$message.error(res.message);
          }
          this.initData(this.searchDataDeal());
        });
      }
    },
    //核销次数列点击事件
    getRcvWrite(row) {
      if (row.rcvWriteOffCount == 0) return "";
      this.receiveOperate = [{}];
      this.dialogFormVisibleTwo = true;
      const copyData = [{}];
      copyData[0].orderNo = row.orderNo;
      copyData[0].waybillNo = row.waybillNo;
      copyData[0].reconciliationUnit = row.reconciliationUnit;
      copyData[0].totalArOrgn = row.totalArOrgn;
      this.$http
        .get(
          this.$service.searchArList +
            "?rcvId=" +
            row.id +
            "&invoiceTitle=" +
            row.invoiceTitle,
          {
            headers: {
              diffFlag: 1
            }
          }
        )
        .then(res => {
          let data = res.data;
          data.forEach((item, index) => {
            if (item.status == -1) {
              data.forEach((item2, index2) => {
                if (item2.id == item.id && index2 != index) {
                  item2.deleteId = index + 1;
                }
              });
            }
          });
          copyData[0].records = data;
          this.receiveOperate = copyData;
          this.receiveOperate[0].copyId = row.id;
          this.receiveOperate[0].invoiceTitle = row.invoiceTitle;
        });
    },
    //核销次数列确认核销
    confirmReset(index, id, row) {
      this.$confirm(`确定核销"操作${index + 1}"`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http
          .post(
            this.$service.arRevoke + "?woIds=" + id.join(),
            {},
            {
              headers: {
                diffFlag: 1
              }
            }
          )
          .then(data => {
            if (data.code == 200) {
              this.$http
                .get(
                  this.$service.searchArList +
                    "?rcvId=" +
                    row.copyId +
                    "&invoiceTitle=" +
                    row.invoiceTitle,
                  {
                    headers: {
                      diffFlag: 1
                    }
                  }
                )
                .then(res => {
                  let data = res.data;
                  data.forEach((item, index) => {
                    if (item.status == -1) {
                      data.forEach((item2, index2) => {
                        if (item2.id == item.id && index2 != index) {
                          item2.deleteId = index + 1;
                        }
                      });
                    }
                  });
                  console.log(res.data);
                  this.$set(this.receiveOperate[0], "records", res.data);
                  this.$forceUpdate();
                });
              this.initData(this.searchDataDeal());
            }
          });
        this.initData(this.searchDataDeal());
      });
    },
    //数据统计
    getStatistData() {
      this.statistData = {};
      this.errorStatist = false;
      this.statistDataShow = !this.statistDataShow;
      if (this.statistDataShow == false) return "";
      // let requestS = JSON.parse(JSON.stringify(this.searchDataDeal()))
      // if(this.selectTableData) {
      // requestS.rcvTitles = this.selectTableData.map(item=>`${item.id}@@${item.invoiceTitle}@@${item.orderId}`)
      // }
      // delete requestS.pageSize
      // delete requestS.pageNum
      let requestS = JSON.parse(JSON.stringify(this.searchDataDeal()));
      delete requestS.pageSize;
      delete requestS.pageNum;
      let requestData;
      if (this.pageSkipChecked == true) {
        requestData = {
          financePageDTO: requestS,
          overPageCheck: true
        };
      } else {
        requestData = {
          financePageDTO: requestS,
          rcvTitles: this.selectTableData.map(
            item => `${item.id}@@${item.invoiceTitle}@@${item.orderId}`
          ),
          overPageCheck: false
        };
      }
      this.$http.post(this.$service.receivableSum, requestData).then(res => {
        this.statistData = res.data;
        this.errorStatist = res.data.hasAbNormal;
      });
    },
    //表格数据勾选
    handleSelectionChange(e) {
      this.selectTableData = e;
    },
    //导出列表
    getExportExcel() {
      if (this.selectTableData.length == 0) {
        this.$message.warning("请至少选择一条信息");
        return;
      }
      let requestData;
      if (this.pageSkipChecked == true) {
        requestData = {
          financePageDTO: this.searchDataDeal(),
          overPageCheck: true
        };
      } else {
        requestData = {
          rcvTitles: this.selectTableData.map(
            item => `${item.id}@@${item.invoiceTitle}@@${item.orderId}`
          ),
          overPageCheck: false
        };
      }
      this.$http
        .post(this.$service.exportWoListExcel, requestData, {
          responseType: "arraybuffer"
        })
        .then(res => {
          const aLink = document.createElement("a");
          let blob = new Blob([res], {
            type: "application/vnd.ms-excel"
          });
          aLink.href = URL.createObjectURL(blob);
          aLink.setAttribute("download", "应收统计" + ".xlsx");
          aLink.click();
          document.body.appendChild(aLink);
        });
    },
    //切换tab
    tabClickData() {
      this.statistDataShow = false;
      this.pageSkipChecked = false;
      this.pageNum = 1;
      this.initData(this.searchDataDeal());
    },

    //订单号详情
    showData(id, orderNo) {
      this.dialogTitleOne = "";
      this.dialogTitleOne = orderNo;
      this.dialogFormVisibleOne = true;
      this.$http
        .get(this.$service.searchOrderDetail + `?orderId=${id}`)
        .then(data => {
          this.tableDataOne = data.data.arOrderPriceList;
          this.tableDataThree = data.data.orderPresentLogs;
          this.tableDataTwo = [
            {
              customerName: data.data.customerName,
              agentName: data.data.agentName,
              airCompanyCode: data.data.airCompanyCode,
              pol: data.data.pol,
              pod: data.data.pod,
              cargoInfo:
                data.data.cargoName +
                "," +
                data.data.inboundPiece +
                "," +
                data.data.inboundCbm +
                "," +
                data.data.inboundWeight +
                "," +
                data.data.inboundVwr,
              operation:
                data.data.pscsName +
                "," +
                (data.data.mscsName || "暂无") +
                "," +
                data.data.principalName +
                "," +
                data.data.customerResponsibleName
            }
          ];
          this.totalArOrgn = data.data.totalArOrgn;
          this.totalArCny = data.data.totalArCny;
          this.payWay = data.data.payWay;
        });
    },
    //跨页全选禁用
    ifDisabled(row) {
      if (this.pageSkipChecked == true) {
        return false;
      } else {
        return true;
      }
    },
    //跨页全选按钮
    selectAllTable() {
      for (let i = 0; i < this.$refs.multipleTable.length; i++) {
        this.$refs.multipleTable[i].clearSelection();
        for (let j = 0; j < this.tableData.length; j++) {
          if (this.pageSkipChecked == true) {
            this.$refs.multipleTable[i].toggleRowSelection(this.tableData[j]);
          } else {
            this.$refs.multipleTable[i].clearSelection();
          }
        }
      }
    },
    //选择框值改变直接查询
    getCurrentChange() {
      this.searchClick();
    },
    //搜索表单中多选框控制
    dealAllChange() {
      if (
        this.selectResult.rcvWriteOffStatusList.indexOf("0") != -1 &&
        this.selectResult.rcvWriteOffStatusList.indexOf("1") != -1 &&
        this.selectResult.rcvWriteOffStatusList.indexOf("2") != -1 &&
        this.selectResult.rcvWriteOffStatusList.indexOf("4") != -1 &&
        this.selectResult.rcvWriteOffStatusList.indexOf("5") != -1 &&
        this.selectResult.rcvWriteOffStatusList.indexOf("8") != -1
      ) {
        this.selectResult.rcvWriteOffStatusList = [""];
      } else if (this.selectResult.rcvWriteOffStatusList.indexOf("") > 0) {
        this.selectResult.rcvWriteOffStatusList = [""];
      } else if (
        this.selectResult.rcvWriteOffStatusList.indexOf("0") != -1 ||
        this.selectResult.rcvWriteOffStatusList.indexOf("1") != -1 ||
        this.selectResult.rcvWriteOffStatusList.indexOf("2") != -1 ||
        this.selectResult.rcvWriteOffStatusList.indexOf("4") != -1 ||
        this.selectResult.rcvWriteOffStatusList.indexOf("5") != -1 ||
        this.selectResult.rcvWriteOffStatusList.indexOf("8") != -1
      ) {
        if (this.selectResult.rcvWriteOffStatusList.indexOf("") != -1) {
          let index = this.selectResult.rcvWriteOffStatusList.indexOf("");
          this.selectResult.rcvWriteOffStatusList.splice(index, 1);
        }
      }
      this.searchClick();
    },
    //核销按钮收款账户信息
    chargeInfoMethod(keyWord) {
      if (!keyWord) {
        keyWord = "";
      }
      this.$http
        .get(this.$service.searchByAccount + "?account=" + keyWord)
        .then(data => {
          this.chargeUserInfo = data.data;
        });
    },
    //起始港三字码
    initAirportSearchByPage(keyWord, type) {
      if (!keyWord) {
        keyWord = "";
      }
      this.$http
        .get(this.$service.airportSearchByPage + "?keyWord=" + keyWord)
        .then(data => {
          this.loading = false;
          if (data.code == 200) {
            if (type == "起始港") {
              this.polOpt = data.data.records;
            } else if (type == "目的港") {
              this.podOpt = data.data.records;
            } else {
              this.polOpt = data.data.records;
              this.podOpt = data.data.records;
            }
          } else {
            this.$message.error(data.message);
          }
        });
    },
    polMethod(keyWord) {
      this.loading = true;
      this.initAirportSearchByPage(keyWord, "起始港");
    },
    podMethod(keyWord) {
      this.loading = true;
      this.initAirportSearchByPage(keyWord, "目的港");
    },
    //代理公司
    initAgentList(agentName) {
      if (!agentName) {
        agentName = "";
      }
      var data = {
        agentName: agentName,
        sceneFlag: 0
      };
      this.$http.post(this.$service.agentList, data).then(data => {
        this.loading = false;
        if (data.code == 200) {
          this.agentOpt = data.data.records;
        }
      });
    },
    agentMethod(agentName) {
      this.initAgentList(agentName);
    },
    //航司
    initCompanySearchByPage(keyWord) {
      if (!keyWord) {
        keyWord = "";
      }
      this.$http
        .get(this.$service.companySearchByPage + "?keyWord=" + keyWord)
        .then(data => {
          this.loading = false;
          if (data.code == 200) {
            this.airCompanyCodeOpt = data.data.records;
          } else {
            this.$message.error(data.message);
          }
        });
    },
    companyMethod(keyWord) {
      this.initCompanySearchByPage(keyWord);
    },
    //售前售中客服、航线负责人数据
    operateData() {
      this.$http
        .get(
          this.$service.userSearchNoAuth + "?roleName=售前客服&pageSize=50000"
        )
        .then(data => {
          this.payBefore = data.data.records;
        });
      this.$http
        .get(
          this.$service.userSearchNoAuth + "?roleName=售中客服&pageSize=50000"
        )
        .then(data => {
          this.paying = data.data.records;
        });
      this.$http
        .get(
          this.$service.userSearchNoAuth + "?roleName=航线负责人&pageSize=50000"
        )
        .then(data => {
          this.airManger = data.data.records;
        });
    },
    //查询数据处理
    searchDataDeal() {
      let copyData = JSON.parse(
        JSON.stringify(this.selectResult)
      );
      if (!copyData.companyName) { 
        copyData.companyName = null
      }
      if (copyData.rcvWriteOffStatusList.indexOf("") != -1)
        delete copyData.rcvWriteOffStatusList;
      copyData.waybillNos = copyData.waybillNos.replace(/-/g, "");
      copyData.woStatus = ["可操作", "业务修改中", "异常"].indexOf(
        this.typeCode
      );
      copyData.pageSize = this.pageSize;
      copyData.pageNum = this.pageNum;
      return copyData;
    },
    //查询接口
    initData(useData) {
      this.statistDataShow = false;
      this.$http.post(this.$service.receivableSearch, useData).then(res => {
        this.tableData = res.data.page.records;
        this.tabNum = [
          res.data.countAuth,
          res.data.countNoAuth,
          res.data.countErr
        ];
        this.total = res.data.page.total;
        setTimeout(() => {
          this.selectAllTable();
        }, 0);
      });
    },
    searchClick() {
      this.pageSkipChecked = false;
      this.pageNum = 1;
      this.initData(this.searchDataDeal(), true);
    },
    restClick() {
      this.selectResult = {
        orderNos: "",
        waybillNos: "",
        companyName: null,
        customerName: "",
        agentId: "",
        airCompanyCode: "",
        pol: "",
        pod: "",
        payWay: "",
        rcvWriteOffStatusList: [""],
        mscsId: "",
        pscsId: "",
        startDepartureDate: "",
        endDepartureDate: "",
        startPresentationTime: "",
        endPresentationTime: "",
        principalId: "",
        financialSeriesNo: "",
        invoiceTitle: ""
      };
      this.initData(this.searchDataDeal());
    },
    handleSizeChange(e) {
      this.pageNum = 1;
      this.pageSize = e;
      this.initData(this.searchDataDeal());
    },
    handleCurrentChange(e) {
      this.pageNum = e;
      this.initData(this.searchDataDeal());
    },
    getOrgn(orgn) {
      if (!orgn) {
        return;
      }
      orgn = JSON.parse(orgn);
      var totalOrgn = "";
      if (orgn && orgn.length > 0) {
        for (var i = 0; i < orgn.length; i++) {
          var obj = this.currencyArrays.filter(item => {
            return item.id == orgn[i].currency;
          });
          totalOrgn =
            totalOrgn +
            obj[0]["symbol"] +
            " " +
            Number(orgn[i].amount).toLocaleString("en-US");
          if (i < orgn.length - 1) {
            totalOrgn = totalOrgn + "+";
          }
        }
      }
      return totalOrgn;
    }
  },
  filters: {
    getWriteOffStatus(data) {
      let array = [
        "未对账未核销",
        "部分对账未核销",
        "已对账未核销",
        "未对账部分核销",
        "部分对账部分核销",
        "已对账部分核销",
        "未对账已核销",
        "部分对账已核销",
        "已对账已核销"
      ];
      return array[data];
    }
  },
  computed: {
    currencyArrays() {
      return this.$store.getters.getCurrencyFinance
    }
  },
  components: {
    Table
  }
};
</script>

<style lang="less">
.orderNoReceive {
  width: 200px !important;
  height: 200px !important;
  overflow: scroll !important;
}
</style>
<style scoped lang="less">
/deep/.el-tabs--top .el-tabs__item.is-top:last-child {
  color: red;
}
/deep/.el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item.is-active:last-child {
  color: red !important;
}
/deep/.el-tabs--border-card > .el-tabs__header .el-tabs__item:last-child:hover {
  color: red !important;
}
/deep/ .el-tag.el-tag--info {
  max-width: 100px;
}
.el-button--primary {
  width: 100px;
  // text-align: center;
}
/deep/.el-table {
  th {
    // background-color: #fff;
    border-right: 1px solid silver;
    border-bottom: 1px solid silver;
    &:first-child {
      border-left: 1px solid silver;
    }
  }
  td {
    // background-color: #fff;
    border-right: 1px solid silver;
    border-bottom: 1px solid silver;
    &:first-child {
      border-left: 1px solid silver;
    }
  }
}
.statist {
  margin-left: 15px;
  .statists {
    margin-top: 10px;
  }
}
/deep/.pageSkip {
  padding: 3px 5px !important;
}
/deep/ .el-table {
  .cell {
    text-align: center;
  }
  th {
    height: 30px;
  }
}
.operateList {
  /deep/ .el-table {
    .cell {
      text-align: left;
    }
    th {
      height: 35px;
    }
  }
}
.content-wrapper {
  width: 100%;
  height: 95%;
  box-sizing: border-box;
  /*height: 100%;*/
  padding: 20px;
  overflow: hidden;
  background-color: #f3f6f9 !important;
  .content {
    width: 100%;
    .content-search-normal {
      padding: 20px 20px 0 20px !important;
      background: #fff;
      .formItem {
        margin: 0 28px 8px 0;
      }
      .operateButton {
        display: flex;
        justify-content: center;
        margin-bottom: -10px;
        button {
          margin: 0px 10px 20px 10px;
        }
      }
    }
  }
}
.allStatist {
  .statists {
    flex: 0 0 170px;
    margin-right: 15px;
  }
}
.el-form--inline .el-form-item {
  margin-bottom: 20px;
  margin-right: 0px;
  vertical-align: bottom;
}
//   /deep/ .el-table__body tr:hover>td {
//   background-color: #CCC !important;
// }
</style>
