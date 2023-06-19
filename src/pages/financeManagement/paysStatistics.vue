<template>
  <div class="content-wrapper" style="background: #fff">
    <div class="content">
      <el-form
        :inline="true"
        :model="formInline"
        size="small"
        class="demo-form-inline"
        label-position="left"
      >
        <div class="content-search-normal" style="position: relative">
             <div style="position:absolute;right:10px;top:10px">
              <div style="cursor:pointer;display:inline-block;" @click="shiftSelectControl">
            <img v-if="selectControl"  src="../../assets/doubleArrowUp.png" alt="" style="width:30px;height:30px;margin:0 0 18px 0;transform:translateY(7px)">
            <img v-if="!selectControl" src="../../assets/doubleArrowDown.png" alt="" style="width:30px;height:30px;margin:0 0 18px 0;transform:translateY(7px)">
          </div>
          </div>
          <el-form-item class="test" label="订单号:">
          <el-popover
               placement="right"
               width="200"
               trigger="click">
               <div v-for="(item,index) in formInline.orderNos.split(/[,，/' ']/).splice(0,20)" :key="index">
                 {{index==19?"...":item}}
               </div>
            <el-input
                slot="reference"
                v-model="formInline.orderNos"
                placeholder="请输入订单号"
                style="width:160px"
                clearable
                  >
              </el-input>
          </el-popover>
          </el-form-item>
          <el-form-item label="运单号:" >
            <el-popover
               placement="right"
               width="200"
               trigger="click">
               <div v-for="(item,index) in formInline.waybillNos.split(/[,，/' ']/).splice(0,20)" :key="index">
                 {{index==19?"...":item}}
               </div>
            <el-input
                slot="reference"
                v-model="formInline.waybillNos"
                placeholder="请输入运单号"
                style="width:160px"
                clearable
                  >
              </el-input>
          </el-popover>
          </el-form-item>
         
         <el-form-item label="财务系列号:">
            <el-input
              v-model="formInline.financialSeriesNo"
              style="width: 180px"
              @change="setLimit($event)"
              size="medium"
              maxlength="12"
              clearable
              placeholder="请输入财务系列号"
            ></el-input>
          </el-form-item>
          <el-form-item label="应付对象:">
             <el-select
              v-model="formInline.expenseUnitName"
              placeholder="请输入应付对象"
              :remote-method="expenseUnitMethod"
              clearable
              remote
              filterable
              reserve-keyword
              style="width: 170px"
            >
              <el-option
                v-for="(item, index) in expenseUnitArray"
                :key="index"
                :value="item.agentName"
                :label="item.agentName"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订舱公司:" >
             <el-select
              v-model="formInline.companyId"
              placeholder="请输入订舱公司"
              clearable
              remote
              filterable
              reserve-keyword
              style="width: 170px"
            >
              <el-option
                v-for="(item, index) in customerNameArray"
                :key="index"
                :value="item.value"
                :label="item.label"
              >
              </el-option>
            </el-select>
          </el-form-item>
            <el-form-item
            label="核销状态:"
          >
            <el-select
              v-model="formInline.payWriteOffStatusList"
              @change="dealPayList"
              multiple
              collapse-tags
              placeholder="请选择"
            >
              <el-option
                v-for="item in payWriteOffStatusArray"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
           <el-form-item
            label="起运港:"
            v-show="selectControl"
          >
            <el-select
              v-model="formInline.pol"
              filterable
              remote
              clearable
              @change="getCurrentChange"
              reserve-keyword
              placeholder="请输入起运港"
              :remote-method="remoteMethodTwo"
            >
              <el-option
                v-for="item in optionTwo"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="目的港:"
            v-show="selectControl"
          >
            <el-select
              @change="getCurrentChange"
              v-model="formInline.pod"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入目的港"
              :remote-method="remoteMethodThree"
            >
              <el-option
                v-for="item in optionThree"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="航司:"  v-show="selectControl">
            <el-select
              @change="getCurrentChange"
              v-model="formInline.airCompanyCode"
              filterable
              remote
              clearable
              reserve-keyword
              style="width:185px"
              placeholder="请输入航司名称"
              :remote-method="remoteMethodFour"
            >
              <el-option
                v-for="item in optionFour"
                :key="item.airCompanyCode"
                :label="item.label"
                :value="item.airCompanyCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
           <el-form-item
            label="售前客服:"
            v-show="selectControl"
          >
            <el-select
              id="selectOne"
              @change="getCurrentChange"
              v-model="formInline.pscsId"
              filterable
              clearable
              placeholder="请选择"
              style="width:170px"
            >
              <el-option
                v-for="item in preSaleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
            <el-form-item
            label="售中客服:"
            v-show="selectControl"
          >
            <el-select
              id="selectThree"
              @change="getCurrentChange"
              v-model="formInline.mscsId"
              filterable
              clearable
              style="width:170px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in onSaleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="航线:"
            v-show="selectControl"
          >
            <el-select
              id="selectTwo"
              style="width:170px"
              @change="getCurrentChange"
              v-model="formInline.principalId"
              filterable
              clearable
              placeholder="请输入航线"
            >
              <el-option
                v-for="item in airLineList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        
          <el-form-item
            label="交单时间:"
            v-show="selectControl"
          >
            <el-date-picker
              v-model="formInline.startPresentationTime"
              @change="getCurrentChange"
              type="date"
              clearable
              style="width: 186px"
              :value-format="formatDate"
              placeholder="开始"
            >
            </el-date-picker
            >-
            <el-date-picker
              v-model="formInline.endPresentationTime"
              type="date"
              @change="getCurrentChange"
              clearable
              :value-format="formatDate"
              style="width: 186px"
              placeholder="结束"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="航班日期:"
            v-show="selectControl"
          >
            <el-date-picker
              v-model="formInline.startDepartureDate"
              @change="getCurrentChange"
              type="date"
              clearable
              style="width: 186px"
              :value-format="formatDate"
              placeholder="开始"
            >
            </el-date-picker
            >-
            <el-date-picker
              v-model="formInline.endDepartureDate"
              @change="getCurrentChange"
              type="date"
              clearable
              style="width: 186px"
              :value-format="formatDate"
              placeholder="结束"
            >
            </el-date-picker>
          </el-form-item>
         
          <el-form-item
            label="结算方式:"
            v-show="selectControl"
          >
            <el-select v-model="formInline.payWay" placeholder="请选择" @change="getCurrentChange">
              <el-option
                v-for="item in payWayArray"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        
           <el-form-item
            label="代理上家:"
            v-show="selectControl"
          >
            <el-select
              v-model="formInline.agentName"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入订舱代理上家"
              :remote-method="remoteMethod"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
         <el-form-item label="是否作废:" class="formItem" style="width:210px">
            <el-select
              @change="getCurrentChange"
              v-model="formInline.fettle"
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
           <el-form-item label="费用结算方式:">
            <el-select
              @change="getCurrentChange"
              v-model="formInline.feePayWay"
              style="width: 120px"
              clearable
            >
              <el-option
                v-for="item in feePayWayList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请选择分公司">
            <dc-select
              v-model="formInline.orgId"
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
          <el-form-item>
            <dc-select
              v-model="formInline.customerResponsibleId"
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
            <el-button size="mini" type="primary" @click="onSubmit(false)" v-auth="['106000_B']"
              >查询</el-button
            >
            <el-button size="mini" type="primary" @click="clearAllData"
              >清空</el-button
            >
          </div>
        </div>
      </el-form>
    </div>

    <el-drawer
      title="表格列控制"
      direction="rtl"
      size="200px"
      :visible.sync="drawer"
    >
      <el-checkbox v-model="checkedIndex0" style="margin: 0 0 20px 20px"
        >全选</el-checkbox
      >
       <el-checkbox class="mycheckbox" v-model="checkedIndex99"
        >财务系列号</el-checkbox
      >
      <el-checkbox class="mycheckbox" v-model="checkedIndex1"
        >订单号</el-checkbox
      >
      <el-checkbox class="mycheckbox" v-model="checkedIndex2"
        >运单号</el-checkbox
      >
      <el-checkbox class="mycheckbox" v-model="checkedIndex3"
        >应付对象</el-checkbox
      >
     
      <el-checkbox class="mycheckbox" v-model="checkedIndex6"
        >应收总金额</el-checkbox
      >
       <el-checkbox class="mycheckbox" v-model="checkedIndex18"
        >应收已核销总金额</el-checkbox
      >
      <el-checkbox class="mycheckbox" v-model="checkedIndex7">利润</el-checkbox>
      <el-checkbox class="mycheckbox" v-model="checkedIndex8"
        >应付费用名称</el-checkbox
      >
      <el-checkbox class="mycheckbox" v-model="checkedIndex19"
        >费用结算方式</el-checkbox
      >
      <el-checkbox class="mycheckbox" v-model="checkedIndex9"
        >应付金额</el-checkbox
      >
      <el-checkbox class="mycheckbox" v-model="checkedIndex10"
        >已对账金额</el-checkbox
      >
      <el-checkbox class="mycheckbox" v-model="checkedIndex11"
        >未对账金额</el-checkbox
      >
      <el-checkbox class="mycheckbox" v-model="checkedIndex12"
        >已核销金额</el-checkbox
      >
      <el-checkbox class="mycheckbox" v-model="checkedIndex13"
        >未核销金额</el-checkbox
      >
      <el-checkbox class="mycheckbox" v-model="checkedIndex14"
        >应付总金额</el-checkbox
      >
       <el-checkbox class="mycheckbox" v-model="checkedIndex4"
        >航班日期</el-checkbox
      >
      <el-checkbox class="mycheckbox" v-model="checkedIndex5"
        >交单时间</el-checkbox
      >
      <el-checkbox class="mycheckbox" v-model="checkedIndex15"
        >汇率</el-checkbox
      >
      <el-checkbox class="mycheckbox" v-model="checkedIndex16"
        >结算方式</el-checkbox
      >
      <el-checkbox class="mycheckbox" v-model="checkedIndex17"
        >核销次数</el-checkbox
      >
      <el-checkbox class="mycheckbox" v-model="checkedIndex14"
        >核销状态</el-checkbox
      >
    </el-drawer>

    <div class="el_tabs">
      <el-button
        :class="{ tip: woStatus == 0 }"
        @click="handleClick(0, (initBoolen = true))"
        >可操作({{ countAuth }})</el-button
      >
      <el-button
        :class="{ tip: woStatus == 1 }"
        @click="handleClick(1, (initBoolen = true))"
        >业务修改中({{ countNoAuth }})</el-button
      >
      <el-button
        :class="{ tip: woStatus == 2 }"
        style="color:red"
        @click="handleClick(2, (initBoolen = true))"
        >异常({{ countErr }})</el-button
      >
    </div>
    <div style="background: #fff; padding-bottom: 10px">
      <el-table
        :data="tableData"
        border
        :cell-style="backStyle"
        max-height="550px"
        ref="multipleTable"
        @select="clckOne"
        style="width: 100%"
       @selection-change="handleSelectionChange"

      >
        <el-table-column
          type="selection"
          fixed
          :selectable="judgeAllSelect"
          width="55"
        >
        </el-table-column>
       <el-table-column prop="financialSeriesNo" label="财务系列号" width="140" v-if="checkedIndex99">
               <template slot-scope="scope">
            <div style="color: skyblue;cursor:pointer" @click="orderNoDetail(scope.row)">
              {{ scope.row.financialSeriesNo }}
            </div>
          </template>
        </el-table-column>
       
        <el-table-column
          prop="orderNo"
          label="订单号"
          v-if="checkedIndex1"
          width="140"
        >
          <template slot-scope="scope">
            <div style="color: skyblue;cursor:pointer" @click="orderNoDetail(scope.row)">
              {{ scope.row.orderNo }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="waybillNo"
          v-if="checkedIndex2"
          label="运单号"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="expenseUnitName"
          v-if="checkedIndex3"
          label="应付对象"
          width="250"
        >
        </el-table-column>
        <el-table-column
          v-if="checkedIndex3"
          label="应付对象总金额"
          width="120"
        >
        <template slot-scope="scope">
              <div v-html="scope.row.totalApObjOrgn" style="white-space: pre-wrap">
              </div>
            </template>
        </el-table-column>
        <el-table-column
          label="应收总金额"
          v-if="checkedIndex6"
          prop="totalArCny"
        >
        </el-table-column>
         <el-table-column
          label="应收已核销总金额"
          v-if="checkedIndex18"
          prop="totalRcWoCny"
        >
        </el-table-column>
        <el-table-column
          prop="orderProfit"
          v-if="checkedIndex7"
          label="利润"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="expenseName"
          v-if="checkedIndex8"
          label="应付费用名称"
          width="100"
        >
        </el-table-column>
           <el-table-column
          prop="feePayWay"
          v-if="checkedIndex19"
          label="费用结算方式"
          width="100"
        >
        <template slot-scope="scope">
          <div>
            {{scope.row.feePayWay =='0'?'付款买单':scope.row.feePayWay =='1'?'月结买单':""}}
          </div>
        </template>
        </el-table-column>
        <el-table-column v-if="checkedIndex9" label="应付金额">
          <el-table-column prop="totalApCny" label="人民币" width="100">
          </el-table-column>
          <el-table-column label="原币" width="100">
            <template slot-scope="scope">
              <div v-html="scope.row.totalApOrgn" style="white-space: pre-wrap">
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          label="已对账金额"
          v-if="checkedIndex10"
        >
         <el-table-column prop="payCheckAmountRmb" label="人民币" width="100">
          </el-table-column>
          <el-table-column label="原币" width="100">
            <template slot-scope="scope">
              <div v-html="scope.row.payCheckAmounts" style="white-space: pre-wrap">
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          label="未对账金额"
          v-if="checkedIndex11"
        >
         <el-table-column prop="unreconciledAmount" label="人民币" width="100">
          </el-table-column>
          <el-table-column label="原币" width="100">
            <template slot-scope="scope">
              <div  v-html="scope.row.unreconciledAmountOrgn" style="white-space: pre-wrap">
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="已核销金额" v-if="checkedIndex12" width="200">
          <el-table-column
            prop="payWriteOffAmountRmb"
            label="人民币"
            width="100"
          >
          </el-table-column>
          <el-table-column label="原币" width="100">
            <template slot-scope="scope">
              <div v-html="scope.row.payWriteOffAmounts" style="white-space: pre-wrap">
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="未核销金额" v-if="checkedIndex13" width="200">
          <el-table-column
            prop="unwrittenOffAmountRmb"
            label="人民币"
            width="100"
          >
          </el-table-column>
          <el-table-column label="原币" width="100">
            <template slot-scope="scope">
              <div v-html="scope.row.unwrittenOffAmounts" style="white-space: pre-wrap">
              </div>
            </template>
          </el-table-column>
        </el-table-column>
         <el-table-column
          prop="departureDate"
          label="航班日期"
          v-if="checkedIndex4"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="presentationTime"
          label="交单时间"
          v-if="checkedIndex5"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="exchangeRates"
          label="汇率"
          v-if="checkedIndex15"
          width="100"
        >
        <template slot-scope="scope">
                <div v-html="getExchangeRate(scope.row.exchangeRates)" style="white-space:pre-wrap"></div>
            </template>
        </el-table-column>
        <el-table-column label="结算方式" v-if="checkedIndex16" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.payWay == 0">付款买单</span>
            <span v-if="scope.row.payWay == 1">月结</span>
          </template>
        </el-table-column>
        <el-table-column label="核销次数" v-if="checkedIndex17" width="100">
          <template slot-scope="scope">
            <span style="color: skyblue;cursor:pointer" @click="recordsBtn(scope.row)" v-auth:disabled="['106003_B']">{{
              scope.row.payWriteOffCount
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="核销状态" v-if="checkedIndex14" width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.payWriteOffStatus == 0">未对账未核销</span>
            <span v-if="scope.row.payWriteOffStatus == 1">部分对账未核销</span>
            <span v-if="scope.row.payWriteOffStatus == 2">已对账未核销</span>
            <span v-if="scope.row.payWriteOffStatus == 3">未对账部分核销</span>
            <span v-if="scope.row.payWriteOffStatus == 4"
              >部分对账部分核销</span
            >
            <span v-if="scope.row.payWriteOffStatus == 5">已对账部分核销</span>
            <span v-if="scope.row.payWriteOffStatus == 6">未对账已核销</span>
            <span v-if="scope.row.payWriteOffStatus == 7">部分对账已核销</span>
            <span v-if="scope.row.payWriteOffStatus == 8">已对账已核销</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <div>
          <!-- <el-button :type= slectAllDataButtonType @click="slectAllData">跨页全选</el-button> -->
          <el-button size="mini" class="pageSkip"
            ><el-checkbox v-model="slectAllDataStatic" @change="slectAllData"
              >跨页全选</el-checkbox
            ></el-button
          >
          <el-button type="primary" size="mini" @click="calcSlectData"
            >数据统计</el-button
          >
          
        </div>

        <div style="display: flex">
          <div style="margin: 10px 10px 0 0">
            
            <el-button
              size="mini"
              type="primary"
              v-if="woStatus != 1"
              @click="fatherReconciliation"
              v-auth="['106001_B']"
              >对账</el-button
            >
            <el-button
              size="mini"
              type="primary"
              v-if="woStatus != 1"
              @click="fatherVerification"
              v-auth="['106002_B']"
              >正常核销</el-button
            >
             <el-button
              size="mini"
              type="primary"
              v-if="woStatus != 1"
              @click="advanceVerification"
              v-auth="['106005_B']"
              >预付核销</el-button
            >
            <el-button size="mini" type="primary" @click="exportBillList"
              >导出列表</el-button
            >
            <el-button size="mini" @click="drawer = true" type="primary"
              >选择表格列</el-button
            >
          </div>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="[10, 20, 30, 40, 50]"
            @size-change="handleSizeChange"
            layout="total,sizes,  prev, pager, next, jumper"
            :total="pageTotal"
          >
          </el-pagination>
        </div>
        
      </div>
      <div v-show="computedDataStatic">
            <div class="calcDataContont">
              <div class="dataCount">
                应付总金额:
                {{
                  dataStaticObj.totalApCny
                    ? dataStaticObj.totalApCny.toLocaleString("en-US")
                    : 0
                }}
              </div>
              <div class="dataCount">
                已核销总金额:
                {{
                  dataStaticObj.totalApWoCny
                    ? dataStaticObj.totalApWoCny.toLocaleString("en-US")
                    : 0
                }}
              </div>
              <div class="dataCount">
                未核销总金额:
                {{
                  dataStaticObj.totalApUnwoCny
                    ? dataStaticObj.totalApUnwoCny.toLocaleString("en-US")
                    : 0
                }}
              </div>
              <div class="dataCount">
                已对账总金额:
                {{
                  dataStaticObj.totalPayCheckAmount
                    ? dataStaticObj.totalPayCheckAmount.toLocaleString("en-US")
                    : 0
                }}
              </div>
              <div class="dataCount">
                未对账总金额:
                {{
                  dataStaticObj.totalUnPayCheckAmount
                    ? dataStaticObj.totalUnPayCheckAmount.toLocaleString("en-US")
                    : 0
                }}
              </div>
              <div class="dataCount">
                利润:
                {{
                  dataStaticObj.orderProfit
                    ? dataStaticObj.orderProfit.toLocaleString("en-US")
                    : 0
                }}
              </div>
              <div class="dataCount" style="color:red;fontSize:14px;fontWeight:bold;transform:translateY(10px)">
                {{
                 dataStaticObj.hasAbNormal? '存在异常订单!':''
                }}
              </div>
            </div>
            <div class="calcDataContont">
              
              <div style="display: flex" class="dataCount">
                <div>应付原币:</div>
                <div style="margin-left:5px">
                  <div
                    v-for="(item, index) in dataStaticObj.totalApOrgn"
                    :key="index"
                  >
                    <div> {{currencyArr[item.currency]+ ' ' + item.amount.toLocaleString('en-US') }}</div>
                    <!-- <div v-if="item.currency == 1"> {{"¥ " + item.amount.toLocaleString('en-US') }}</div>
                    <div v-if="item.currency == 2">{{"HK$ " + item.amount.toLocaleString('en-US') }}</div>
                    <div v-if="item.currency == 3">{{ "$ " + item.amount.toLocaleString('en-US') }}</div>
                    <div v-if="item.currency == 4">{{"€ " + item.amount.toLocaleString('en-US') }}</div>
                    <div v-if="item.currency == 5">{{"￡ " + item.amount.toLocaleString('en-US') }}</div> -->
                  </div>
                  <div v-if="!dataStaticObj.totalApOrgn"> {{"¥ "}}0
                  </div>
                </div>
              </div>
<div style="display: flex" class="dataCount">
                <div>已核销原币:</div>
                <div style="margin-left:5px">
                  <div
                    v-for="(item, index) in dataStaticObj.totalApWoOrgn"
                    :key="index"
                  >
                    <div> {{currencyArr[item.currency]+ ' ' + item.amount.toLocaleString('en-US') }}</div>
                  </div>
                  <div v-if="!dataStaticObj.totalApWoOrgn">{{"¥ "}} 0
                  </div>
                </div>
              </div>
              <div style="display: flex" class="dataCount">
                <div>未核销原币:</div>
                <div style="margin-left:5px">
                  <div
                    v-for="(item, index) in dataStaticObj.totalApUnwoOrgn"
                    :key="index"
                  >
                    <div> {{currencyArr[item.currency]+ ' ' + item.amount.toLocaleString('en-US') }}</div>
                  </div>
                  <div v-if="!dataStaticObj.totalApUnwoOrgn">{{"¥ "}}0
                  </div>
                </div>
              </div>
              <div style="display: flex" class="dataCount">
                <div>已对账原币:</div>
                <div style="margin-left:5px">
                  <div
                    v-for="(item, index) in dataStaticObj.totalApWoPayCheckAmountOrgn"
                    :key="index"
                  >
                    <div> {{currencyArr[item.currency]+ ' ' + item.amount.toLocaleString('en-US') }}</div>
                  </div>
                  <div v-if="!dataStaticObj.totalApWoPayCheckAmountOrgn">{{"¥ "}}0
                  </div>
                </div>
              </div>
              <div style="display: flex" class="dataCount">
                <div>未对账原币:</div>
                <div style="margin-left:5px">
                  <div
                    v-for="(item, index) in dataStaticObj.totalApUnPayCheckAmounOrgn"
                    :key="index"
                  >
                    <div> {{currencyArr[item.currency]+ ' ' + item.amount.toLocaleString('en-US') }}</div>
                  </div>
                  <div v-if="!dataStaticObj.totalApUnPayCheckAmounOrgn">{{"¥ "}}0
                  </div>
                </div>
              </div>
            </div>
          </div>
    </div>

    <!-- 对账模态框组件 -->
    <reconciliation
      :idsArray="idsArray"
      :selectResult="formInline"
      :slectAllDataStatic="slectAllDataStatic"
      :woStatus = "woStatus"
      @farhersearch="onSubmit(true)"
      :childPropsObj="childPropsObj"
      ref="reconciliationData"
    />
    <!-- 核销模态框组件 -->
    <verification
      @farhersearch2="onSubmit(true)"
      v-if="showVerification"
      :childPropsObj="verificationObj"
      :verificationArr="verificationArr"
      :selectResult="formInline"
      :woStatus = "woStatus"
      :slectAllDataStatic="slectAllDataStatic"
      ref="verificationData"
    />
    <!-- 点击核销次数模态框 -->
    <el-dialog
      title="应付核销操作记录"
      :visible.sync="payWriteOffCountBoolen"
      width="60%"
      :before-close="handleClose"
    >
      <div class="diaModalClass">
        <el-table max-height="500" :data="payWriteOffCountData">
          <el-table-column type="index" label="序号" fixed :index="indexMethod">
          </el-table-column>
          <el-table-column prop="orderNo" label="订单号" width="140">
          </el-table-column>
          <el-table-column prop="waybillNo" label="运单号" width="100">
          </el-table-column>
          <el-table-column prop="expenseUnitName" label="应付对象" width="250">
          </el-table-column>
          <el-table-column prop="totalApOrgn" label="应付金额" width="100">
          </el-table-column>
          <el-table-column label="记录" width="550">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.tempObj" :key="index">
                <div
                  v-if="item.status == 0 || item.status == -1"
                  style="text-align: left"
                >
                  <div v-if="item.payCheckAmount != '0'">
                    <!-- 对账数据 -->
                    {{ `操作${index + 1}:${item.writeOffOperator}` }}
                    <span class="text_color_blue">对账</span>
                    该订单,对账金额：{{ item.payCheckAmount }}
                    <span>{{currencyType[item.currency]}}</span>
                    <!-- <span v-if="item.currency == 1"> CNY</span>
                    <span v-if="item.currency == 2"> HKD</span>
                    <span v-if="item.currency == 3"> USD</span>
                    <span v-if="item.currency == 4"> EUR</span>
                    <span v-if="item.currency == 5"> GBP</span> -->
                    <span style="margin-left: 10px">{{ item.writeOffTime }}</span>
                  </div>
                  <div v-else>
                    {{ `操作${index + 1}:${item.writeOffOperator}` }}{{item.tprId?'使用预付记录':''}}
                    <span class="text_color_blue"> 核销</span>
                    该订单,核销金额：{{ item.writeOffAmount }}
                    <span>{{currencyType[item.currency]}}</span>
                    <!-- <span v-if="item.currency == 1"> CNY</span>
                    <span v-if="item.currency == 2"> HKD</span>
                    <span v-if="item.currency == 3"> USD</span>
                    <span v-if="item.currency == 4"> EUR</span>
                    <span v-if="item.currency == 5"> GBP</span> -->
                    <span style="margin-left: 10px">{{ item.writeOffTime }}</span>
                  </div>
                </div>
                <div v-if="item.status == 2" style="text-align: left">
                  {{ `操作${index + 1}:${item.writeOffOperator} ` }}撤销了操作{{
                    item.tIndex
                  }}
                  <span style="margin-left: 10px">{{ item.writeOffTime }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.tempObj" :key="index">
                <div>
                  <span class="text_color_blue" @click="cheXiao(index)" v-auth="['106004_B']">{{
                    item.status == 0 ? "撤销" : ""
                  }}</span>
                  <span>{{ item.status == -1 ? "已撤销" : "" }}</span>
                  <span class="opacity" v-show="item.status == 2">ceshi</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 订单号对话框 -->
    <!-- 点击核销次数模态框 -->
    <el-dialog
      :visible.sync="orderNoShow"
      width="60%"
    >
      <td style="font-size: 18px;font-weight: 100;color: #169BD5;padding: 10px 0px 10px 20px;">{{ dialogTitleOne }}</td>
      <td style="font-size: 18px;font-weight: 100;color: #333333;padding: 10px 20px 10px 0px;">订单详情</td>
      <Table
        :tableData='orderData'
        :selectionTable="false"
        :columns='columns2'
        :select=1
        :currentPage='1'
        :pageSize='10'
        :operation='operation'
        @sizeChange='handleSizeChangeS'
        @currentChange='handleCurrentChangeS'
        >
      </Table>

      <td style="font-size: 18px;font-weight: 100;color: #169BD5;padding: 10px 0px 10px 20px;">{{ dialogTitleOne }}</td>
      <td style="font-size: 18px;font-weight: 100;color: #333333;padding: 10px 20px 10px 0px;">应付账单</td>
      <Table
        :tableData='arData'
        :selectionTable="false"
        :columns='columns3'
        :select=1
        :currentPage='1'
        :pageSize='10'
        :operation='operation'
        @sizeChange='handleSizeChangeS'
        @currentChange='handleCurrentChangeS'
        >
      </Table>

      <div class="finance-table-price">
        <div>账单合计：{{ getOrgn(this.totalApOrgn) }}</div>
        <div>人民币合计：￥{{ this.totalApCny }}</div>
      </div>
      <div style="font-size: 18px;font-weight: 100;color: #333;padding: 10px 20px 10px 20px;">修改记录</div>
      <Table
        :tableData='orderLogs'
        :columns='columns4'
        :selectionTable="false"
        :select=1
        :currentPage='1'
        :pageSize='10'
        :operation='operation'
        @sizeChange='handleSizeChangeS'
        @currentChange='handleCurrentChangeS'
      >
      </Table>
    </el-dialog>
    <advanceVerif ref="outAdvance" 
      :woStatus = "woStatus"
      :childPropsObj="verificationObj"
      :slectAllDataStatic="slectAllDataStatic" 
      :verificationArr="verificationArr" 
      :selectTableData="selectTableData"
      @reSearch="onSubmit(true)"
      :selectResult="formInline">
    </advanceVerif>
  </div>
</template>

<script>
import Table from '@/components/receivableStatisticsDetailsTable'
import advanceVerif from './components/advanceVerif.vue'
import reconciliation from "./components/reconciliation.vue";
import verification from "./components/verification.vue";
import { exportFile } from "../../util/util";
export default {
  data() {
    return {
      currencyType:{},
      sysOrgs: [],
      fettleList:[{id:'',name:"全部"},{id:0,name:"正常"},{id:1,name:'作废'}],
      currencyArray: this.$store.getters.getCurrencyFinance,
      currencyArr:{},
      showVerification:false,
      customerNameArray:'',
      expenseUnitArray:'',
      totalApOrgn:"",
      totalApCny:"",
       //table
      tableData: [],
      arData: [],
      orderLogs: [],
      orderProfit: 0,
      selectTableData:[],
      pageSkipChecked: false,
      orderData: [
        {
          customerName: "",
          agentName: "",
          airCompanyCode: "",
          pol: "",
          pod: "",
          cargoName: "",
          inboundPiece: "",
          inboundCbm: "",
          inboundWeight: "",
          inboundVwr: "",
          pscsName: "",
          principalName: "",
          mscsName: "",

        }
      ],
        columns2: [
        {label: '订舱客户', prop: 'customerName', show: true, width: '100'},
        {label: '代理上家', prop: 'agentName', show: true, width: '100'},
        {label: '航司', prop: 'airCompanyCode', show: true, width: '50'},
        {label: '起运港', prop: 'pol', show: true, width: '60'},
        {label: '目的港', prop: 'pod', show: true, width: '60'},
        {label: '货物信息', prop: 'cargoInfo', show: true, width: '80'},
        {label: '操作人员', prop: 'operator', show: true, width: '80'},
      ],
      columns3: [
        {label: '序号', show: true, width: '50'},
        {label: '费用名称', prop: 'expenseName', show: true, width: '100'},
        {label: '付款单位', prop: 'expenseUnitName', show: true, width: '150'},
        {label: '单价', prop: 'price', show: true, width: '100'},
        {label: '数量', prop: 'quantity', show: true, width: '100'},
        {label: '币种', prop: 'currency', show: true, width: '100'},
        {label: '原币合计', prop: 'totalOrgn', show: true, width: '100'},
        {label: '汇率', prop: 'exchangeRateNum', show: true, width: '100'},
        {label: '人民币合计', prop: 'totalCny', show: true, width: '100'},
        {label: '费用结算方式', prop: 'feePayWay', show: true, width: '100'},
        {label: '执行人', prop: 'executorName', show: true, width: '100'},
        {label: '备注', prop: 'remark', show: true, width: '50'}
      ],
      columns4: [
        {label: '操作类型', prop: 'operationType', show: true, width: '150'},
        {label: '说明', prop: 'operationInfo', show: true, width: '100'},
        {label: '操作时间', prop: 'createTime', show: true, width: '150'},
        {label: '操作人', prop: 'operator', show: true, width: '100'}
      ],
      // 操作
      operation: {
        show: false,
        label: '操作',
        width: '180',
        options: [
          {label: '撤销', method: 'routeEdit'}
        ]
      },
      operation1: {
        show: false,
        label: '操作',
        width: '180',
        options: [
          {label: '撤销', method: 'routeEdit'}
        ]
      },
      orderNoShow:false,//订单号对话框
      dialogTitleOne:"",
      selectControl: false, //搜索框下拉控制
      // activeName:'0',
      testNo: "", // 测试订单号
      testNos: "", //订单号 多个的时候
      testBIllNo: "", // 测试运单号
      testBIllNos: "", // 测试运单号
      oldOptions: [], // 多选 保存上一次选择
      drawer: false, // 右侧表格状态
      customerResponsibles:[],
      formInline: {
        customerResponsibleId:'',
        orgId: '',
        orderNo: "",
        orderNos: "",
        waybillNo: "",
        waybillNos: "",
        companyId: "",
        airCompanyCode: "",
        agentName: "",
        startDepartureDate: "",
        endDepartureDate: "",
        startPresentationTime: "",
        endPresentationTime: "",
        financialSeriesNo:"",
        pol: "",
        pod: "",
        payWay: "",
        payWriteOffStatus: "",
        payWriteOffStatusList: [""],
        pscsId: "",
        principalId: "",
        mscsId: "",
        fettle:'',
        feePayWay:''
      },
      feePayWayList:[
        {name:"全部",id:''},{name:"付款买单",id:'0'},{name:"月结买单",id:'1'},
      ],
      payWayArray: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "0",
          label: "付款买单",
        },
        {
          value: "1",
          label: "月结",
        },
      ],
      payWriteOffStatusArray: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "0",
          label: "未对账未核销",
        },
        {
          value: "1",
          label: "部分对账未核销",
        },
        {
          value: "2",
          label: "已对账未核销",
        },
        {
          value: "4",
          label: "部分对账部分核销",
        },
        {
          value: "5",
          label: "已对账部分核销",
        },
        {
          value: "8",
          label: "已对账已核销",
        },
      ],
      payWriteOffCountBoolen: false, // 点击核销次数 控制模态框的显示
      payWriteOffCountData: [], // 模态框展示的数据
      woStatus: 0, // 正常0，业务修改中1，异常2
      tableData: [],
      dataStaticObj: {}, // 数据统计对象
      countAuth: "", // 可操作数量
      countErr: "", // 异常数量
      countNoAuth: "", //业务修改中数量
      formatDate: "yyyy-MM-dd",
      currentPage: 1, // 分页当前页默认1
      pageSize: 10, //分页每页数据量默认10
      pageTotal: 0, // 分页总数据量
      slectAllDataStatic: false, // 跨页全选的状态 默认false
      slectAllDataButtonType: "", // 跨页全选 点击与不点击之后的样式改变
      computedDataType: "", // 数据统计样式改变
      computedDataStatic: false, // 数据统计样式改变
      multipleSelection: [], // 单选的数组,
      childPropsData: [], //  传入对账子组件的数组
      childPropsObj: {}, //
      childBoolen: false, // 子组件是否引入
      preSaleList: [], // 售前客服数组
      onSaleList: [], // 售中客服数组
      airLineList: [], // 航线负责人数组
      options: [], //
      optionTwo: [], //
      optionThree: [], //
      optionFour: [], //
      verificationObj: {}, // 传递给核销组件的对象
      verificationArr: [], //传递给核销组件的数组
      tableColumnArray: {}, // 表头默认显示状态
      checkedIndex0: true, // 默认全选
      checkedIndex99:true,
      checkedIndex1: true,
      checkedIndex2: true,
      checkedIndex3: true,
      checkedIndex4: true,
      checkedIndex5: true,
      checkedIndex6: true,
      checkedIndex7: true,
      checkedIndex8: true,
      checkedIndex9: true,
      checkedIndex10: true,
      checkedIndex11: true,
      checkedIndex12: true,
      checkedIndex13: true,
      checkedIndex14: true,
      checkedIndex15: true,
      checkedIndex16: true,
      checkedIndex17: true,
      checkedIndex18: true,
      checkedIndex19: true,
      
      //数据统计按钮 统计勾选数据id
      idsArray:[],
      copySelectJSON:{}

    };
  },
  async mounted() {
    var array = this.$store.getters.getCurrencyIdObjArr
    this.currencyType = array[0] // ['CNY','HKD','USD','EUR','GBP']
    this.currencyArr = array[1] // ['CNY','HKD','USD','EUR','GBP']
    this.findThisUserAndBranchOrg()
    this.selectSet();
    await this.onSubmit();
    await this.getSysInitial();
    this.expenseUnitMethod()
    this.customerNameMethod()
    this.searchBranchUsers({
      roleName: "",
      listName: "customerResponsibles",
    });
  },
  watch: {
    checkedIndex0(newValue) {
      if (newValue == true) {
        this.checkedIndex99 = true;
        this.checkedIndex1 = true;
        this.checkedIndex2 = true;
        this.checkedIndex3 = true;
        this.checkedIndex4 = true;
        this.checkedIndex5 = true;
        this.checkedIndex6 = true;
        this.checkedIndex7 = true;
        this.checkedIndex8 = true;
        this.checkedIndex9 = true;
        this.checkedIndex10 = true;
        this.checkedIndex11 = true;
        this.checkedIndex12 = true;
        this.checkedIndex13 = true;
        this.checkedIndex14 = true;
        this.checkedIndex15 = true;
        this.checkedIndex16 = true;
        this.checkedIndex17 = true;
      } else {
        this.checkedIndex99 = false;
        this.checkedIndex1 = false;
        this.checkedIndex2 = false;
        this.checkedIndex3 = false;
        this.checkedIndex4 = false;
        this.checkedIndex5 = false;
        this.checkedIndex6 = false;
        this.checkedIndex7 = false;
        this.checkedIndex8 = false;
        this.checkedIndex9 = false;
        this.checkedIndex10 = false;
        this.checkedIndex11 = false;
        this.checkedIndex12 = false;
        this.checkedIndex13 = false;
        this.checkedIndex14 = false;
        this.checkedIndex15 = false;
        this.checkedIndex16 = false;
        this.checkedIndex17 = false;
      }
    },
  },
  components: {
    reconciliation,
    verification,
    Table,
    advanceVerif
  },
  methods: {
    async searchBranchUsers({ roleName = "", listName }) {
      try {
        const {
          data: { data },
        } = await this.$api.searchBranchUsers(
          {},
          {
            params: {
              roleName,
            },
          }
        );
        this[listName] = data.map((item) => {
          return {
            value: item.id,
            label: item.name,
            longLabel: `${item.name} ${item.branchNames}`,
          };
        });
      } catch (error) {}
    },
    async findThisUserAndBranchOrg() {
      const {
        data: { data },
      } = await this.$api.findThisUserAndBranchOrg();
      this.sysOrgs = data.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    },
    //汇率处理
    getExchangeRate(exchangeRate) {
      let copy = exchangeRate.replace(/{|}/g,"")
      copy = copy.split(",")
      // console.log(exchangeRate,copy);
      var totalOrgn = "";
      if(copy && (copy.length > 0)){
        for (var i = 0; i < copy.length; i++) {
          let currency = copy[i].trim().split("=")[0]
          let valueS =  Number(copy[i].trim().split("=")[1])
          // console.log(currency,valueS);
          var obj = this.currencyArray.filter((item)=>{return (item.id == currency)})
          totalOrgn = totalOrgn + obj[0]["code"] + ":" + Number(valueS)
          if(i < (copy.length - 1)){
            totalOrgn = totalOrgn + '\n'
          }
        }
      }
      return totalOrgn;
    },
    // getExchangeRate(exchangeRate) {
    //   console.log(exchangeRate,"--");
    //      let copy = exchangeRate.replace(/{|}/g,"")
    //      copy = copy.split(",")
    //      console.log(copy)
    //     if (typeof (exchangeRate) == "undefined") {
    //       return "";
    //     }
    //   var totalOrgn = "";
    //   var value1 = 0;
    //   var value2 = 0;
    //   var value3 = 0;
    //   var value4 = 0;
    //   var value5 = 0;
    //   for (let i = 0; i < copy.length; i++) {
    //     let currency = copy[i].trim().slice(0,1)
    //     let valueS =  Number(copy[i].trim().slice(2))
    //     console.log(copy[i],currency,valueS,i)
    //     if (currency == "1") {
    //       value1 += valueS;
    //     } else if (currency == "2") {
    //       value2 += valueS;
    //     } else if (currency == "3") {
    //       value3 += valueS;
    //     } else if (currency == "4") {
    //       value4 += valueS;
    //     } else if (currency == "5") {
    //       value5 += valueS;
    //     }
    //   }
    //   totalOrgn = "";
    //   totalOrgn += value1 ? "CNY:" + value1 + "\n" : "";
    //   totalOrgn += value2 ? "HKD:" + value2 + "\n" : "";
    //   totalOrgn += value3 ? "USD:" + value3 + "\n" : "";
    //   totalOrgn += value4 ? "EUR:" + value4 + "\n" : "";
    //   totalOrgn += value5 ? "GBP:" + value5 + "\n" : "";
    //   totalOrgn = totalOrgn.substring(0, totalOrgn.length - 1);
    //   return totalOrgn;
    // },
    expenseUnitMethod(agentName){
      if (!agentName) {
        agentName = "";
      }
      var data = {
        agentName: agentName,
        sceneFlag: 0,
      };
      this.$http.post(this.$service.agentList, data).then((data) => {
        if (data.code == 200) {
          this.expenseUnitArray = data.data.records;
        }
      });
    },
    customerNameMethod(certificationBody){
      if (!certificationBody) {
        certificationBody = "";
      }
      var data = {
        certificationBody: certificationBody,
      };
      this.$http.post(this.$service.searchViews, data, {
        params: {
          typeCode: 1,
        }
      }).then((data) => {
        if (data.code == 200) {
          this.customerNameArray = data.data.map(item => {
            return {
              label: item.companyName,
              value: item.id,
            };
          });
        }
      });
    },
    
     setLimit(e){
      this.formInline.financialSeriesNo = e.replace(/[\W]/g,'')
    },
    handleSelectionChange(e) {
        this.selectTableData = e
        this.idsArray = e.map(item=>item.ids.split(","))
        this.idsArray = this.idsArray.flat()
      },
     handleCurrentChangeS(e) {
      this.currentPage = e
      this.getTabelData()
    },
    handleSizeChangeS(e) {
      this.pageSize = e
      this.getTabelData()
    },
    getOrgn(orgn) {
      if (!orgn) {
        return;
      }
      orgn = JSON.parse(orgn);
      var totalOrgn = "";
      if(orgn && (orgn.length > 0)){
        for (var i = 0; i < orgn.length; i++) {
          var obj = this.currencyArray.filter((item)=>{return (item.id == orgn[i].currency)})
          totalOrgn = totalOrgn + obj[0]["symbol"] + " " + Number(orgn[i].amount).toLocaleString('en-US')
          if(i < (orgn.length - 1)){
            totalOrgn = totalOrgn + '+'
          }
        }
      }
      return totalOrgn;
    },
    //订单号弹框
    orderNoDetail(data){
      // console.log(data)
      this.dialogTitleOne = data.orderNo
      this.orderNoShow = true
       this.$http.post(this.$service.search + "?orderId=" + data.orderId).then(data => {
        if (data.code == 200) {
          this.arData = data.data.arOrderPriceList
          this.orderLogs = data.data.orderPresentLogs
          this.totalApOrgn = data.data.totalApOrgn
          this.totalApCny = data.data.totalApCny.toLocaleString('en-US')
          this.orderProfit = data.data.orderProfit
          // this.orderId = data.data.orderId
          this.orderData[0].customerName = data.data.customerName
          this.orderData[0].agentName = data.data.agentName
          this.orderData[0].airCompanyCode = data.data.airCompanyCode
          this.orderData[0].pol = data.data.pol
          this.orderData[0].pod = data.data.pod
          this.orderData[0].cargoName = data.data.cargoName
          this.orderData[0].inboundPiece = data.data.inboundPiece
          this.orderData[0].inboundCbm = data.data.inboundCbm
          this.orderData[0].inboundWeight = data.data.inboundWeight
          this.orderData[0].inboundVwr = data.data.inboundVwr
          this.orderData[0].pscsName = data.data.pscsName
          this.orderData[0].principalName = data.data.principalName
          this.orderData[0].mscsName = data.data.mscsName
          this.orderData[0].customerResponsibleName = data.data.customerResponsibleName

        } else {
          this.$message.error(data.message)
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    //下拉框搜索框控制
    shiftSelectControl() {
      this.selectControl = !this.selectControl;
    },
    // 输入控制
    selectSet() {
      let one = document.querySelector("#selectOne");
      let two = document.querySelector("#selectTwo");
      let three = document.querySelector("#selectThree");
      one.setAttribute("maxLength", 10);
      two.setAttribute("maxLength", 10);
      three.setAttribute("maxLength", 10);
    },
    //选择框改变直接查询
    getCurrentChange(){
      this.onSubmit()
    },
    //搜索表单中多选框控制
    dealPayList() {
      if (
        this.formInline.payWriteOffStatusList.indexOf("0") != -1 &&
        this.formInline.payWriteOffStatusList.indexOf("1") != -1 &&
        this.formInline.payWriteOffStatusList.indexOf("2") != -1 &&
        this.formInline.payWriteOffStatusList.indexOf("4") != -1 &&
        this.formInline.payWriteOffStatusList.indexOf("5") != -1 &&
        this.formInline.payWriteOffStatusList.indexOf("8") != -1
      ) {
        this.formInline.payWriteOffStatusList = [""];
      } else if (this.formInline.payWriteOffStatusList.indexOf("") > 0) {
        this.formInline.payWriteOffStatusList = [""];
      } else if (
        this.formInline.payWriteOffStatusList.indexOf("0") != -1 ||
        this.formInline.payWriteOffStatusList.indexOf("1") != -1 ||
        this.formInline.payWriteOffStatusList.indexOf("2") != -1 ||
        this.formInline.payWriteOffStatusList.indexOf("4") != -1 ||
        this.formInline.payWriteOffStatusList.indexOf("5") != -1 ||
        this.formInline.payWriteOffStatusList.indexOf("8") != -1
      ) {
        if (this.formInline.payWriteOffStatusList.indexOf("") != -1) {
          let index = this.formInline.payWriteOffStatusList.indexOf("");
          this.formInline.payWriteOffStatusList.splice(index, 1);
        }
      }
      this.onSubmit()
    },
    // 清空搜索数据
    clearAllData() {
      this.formInline = {
        orderNo: "",
        orderNos: "",
        waybillNo: "",
        waybillNos: "",
        companyId: "",
        airCompanyCode: "",
        agentName: "",
        startDepartureDate: "",
        endDepartureDate: "",
        startPresentationTime: "",
        endPresentationTime: "",
        financialSeriesNo:"",
        pol: "",
        pod: "",
        payWay: "",
        payWriteOffStatus: "",
        payWriteOffStatusList: [""],
        pscsId: "",
        principalId: "",
        mscsId: "",
      };
      this.woStatus = 0;
      this.currentPage = 1;
      this.onSubmit()
    },
    // 跨页之后禁止单选
    judgeAllSelect() {
      return !this.slectAllDataStatic;
    },
    // 撤销
    async cheXiao(e) {
      let { id } = this.payWriteOffCountData[0].tempObj[e];
      this.$confirm(`确认撤销 “操作${e + 1}” 吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let res = await this.$http.post(
          this.$service.revokeRecords + "?id=" + id, {}, {
            headers: {
              diffFlag: 1
            }
          }
        );
        // console.log(res);
        if (res.code == 200) {
          // let res1 = await this.$http.post(this.$service.searchRecords, {
          //   ids: e.ids,
          // }, {
          //   headers: {
          //     diffFlag: 1
          //   }
          // });
          // this.payWriteOffCountData[0].tempObj = res1.data;
          this.$message({
            type: "success",
            message: "撤销成功!",
          });
          this.handleClose();
          this.onSubmit(true);
        }
      });
    },
    handleClose() {
      this.payWriteOffCountData = [];
      this.payWriteOffCountBoolen = false;
    },
    async recordsBtn(e) {
      let res = await this.$http.post(this.$service.searchRecords, {
        ids: e.ids,
      },{
        headers: {
          diffFlag: 1
        }
      });
      if (res.code == 200) {
        // console.log(res.data);
        let arr = res.data;
        for (let i in arr) {
          if (arr[i].status == 2) {
            for (let j in arr) {
              if (arr[i].revokeId == arr[j].id) {
                arr[i].tIndex = Number(j) + 1;
              }
            }
          }
        }
        let te = Object.assign({}, e, { tempObj: arr });
        this.$set(this.payWriteOffCountData, 0, te);
        setTimeout(() => {
          this.payWriteOffCountBoolen = true;
        }, 10);
      }
    },
    // 导出列表
    async exportBillList() {
      let { slectAllDataStatic, formInline, woStatus, multipleSelection } =
        this;
      if (slectAllDataStatic) {
        let params = Object.assign({}, formInline, { woStatus, woStatus });
        if (params.payWriteOffStatusList.indexOf("") != -1) {
          params.payWriteOffStatusList = [];
        }
        if(params.waybillNos.length <= 15){
          params.waybillNo = params.waybillNos.replace(/-/g,'')
          params.waybillNos = ""
        }else {
          params.waybillNos =  params.waybillNos.replace(/-/g,'')
        }
        let res = await this.$http.post(this.$service.billExportExcel, params, {
          responseType: "arraybuffer",
        });
        exportFile(res, "application/x-xls", "应付统计");
      } else {
        if (this.selectTableData.length > 0) {
          let idArray = this.idsArray
          let params = {
            ids: idArray,
            woStatus: woStatus,
          };
          let res = await this.$http.post(
            this.$service.billExportExcel,
            params,
            { responseType: "arraybuffer" }
          );
          exportFile(res, "application/x-xls", "应付统计");
        } else {
          this.$message({
            message: "请先选择数据",
            type: "warning",
          });
        }
      }
    },

    async handleClick(e, initBoolen = true) {
      this.computedDataStatic = false;
      this.slectAllDataStatic = false
      this.woStatus = e;
      if(initBoolen){
        this.currentPage = 1;
      }
      let {
        formInline,
        currentPage,
        woStatus,
        slectAllDataStatic,
        countAuth,
        countErr,
        countNoAuth,
      } = this;
      let tempTotal = "";
      if (e == 0) {
        tempTotal = countAuth;
      } else if (e == 1) {
        tempTotal = countNoAuth;
      } else if (e == 2) {
        tempTotal = countErr;
      }
      let params = Object.assign(
        {},
        formInline,
        { ids:this.idsArray},
        { pageNum: currentPage, woStatus: woStatus },
        { pageSize: tempTotal }
      );
      if (params.payWriteOffStatusList.indexOf("") != -1) {
        params.payWriteOffStatusList = [];
      }
      if(params.waybillNos.length <= 15){
          params.waybillNo = params.waybillNos.replace(/-/g,'')
          params.waybillNos = ""
        }else {
          params.waybillNos =  params.waybillNos.replace(/-/g,'')
        }
      this.$http.post(this.$service.dataStatistics, params).then((res) => {
        if (res.code == 200) {
          let tempObj = res.data;
            tempObj.totalApWoPayCheckAmountOrgn = JSON.parse(tempObj.totalApWoPayCheckAmountOrgn);
          tempObj.totalApUnPayCheckAmounOrgn = JSON.parse(tempObj.totalApUnPayCheckAmounOrgn);
          tempObj.totalApUnwoOrgn = JSON.parse(tempObj.totalApUnwoOrgn);
          tempObj.totalApOrgn = JSON.parse(tempObj.totalApOrgn);
          tempObj.totalApWoOrgn = JSON.parse(tempObj.totalApWoOrgn);
        
          // this.$set(tempObj,'totalApWoPayCheckAmountOrgn',JSON.parse(tempObj.totalApWoPayCheckAmountOrgn))
          this.dataStaticObj = tempObj;
          // console.log(typeof(this.dataStaticObj.totalApWoPayCheckAmountOrgn))
        }
      });
      if (initBoolen) {
        await this.getTabelData(
          formInline,
          currentPage,
          woStatus,
          slectAllDataStatic,
          this.pageSize
        );
      }
     
    },
    // 输入代理上家的时候返回值
    async remoteMethod(e) {
      if (e !== "") {
        let res = await this.$http.post(this.$service.agentList, {
          agentName: e,
          sceneFlag: 0,
        });
        this.options = res.data.records.map((item) => {
          return { value: item.agentName, label: item.agentName };
        });
      } else {
        this.options = [];
      }
    },
    // 输入起始港的时候返回值
    async remoteMethodTwo(e) {
      if (e !== "") {
        let res = await this.$http.get(
          this.$service.airportSearchByPage + `?keyWord=${e}`
        );
        this.optionTwo = res.data.records.map((item) => {
          return { value: item.threeLetterCode, label: item.name };
        });
      } else {
        this.optionTwo = [];
      }
    },
    // 输入目的港的时候返回值
    async remoteMethodThree(e) {
      if (e !== "") {
        let res = await this.$http.get(
          this.$service.airportSearchByPage + `?keyWord=${e}`
        );
        this.optionThree = res.data.records.map((item) => {
          return { value: item.threeLetterCode, label: item.name };
        });
      } else {
        this.optionThree = [];
      }
    },
    // 输入航司的时候返回值
    async remoteMethodFour(e) {
      if (e !== "") {
        let res = await this.$http.get(
          this.$service.companySearchByPage + `?keyWord=${e}`
        );
        // console.log(res.data.records);
        this.optionFour = res.data.records;
      } else {
        this.optionFour = [];
      }
    },
    // 获取搜索条件当中的原始值
    async getSysInitial() {
      let res1 = await this.$http.get(
        this.$service.userSearchNoAuth + "?roleName=售前客服&pageSize=50000"
      );
      let res2 = await this.$http.get(
        this.$service.userSearchNoAuth + "?roleName=售中客服&pageSize=50000"
      );
      let res3 = await this.$http.get(
        this.$service.userSearchNoAuth + "?roleName=航线负责人&pageSize=50000"
      );
      Promise.all([res1, res2, res3]).then((res) => {
        this.preSaleList = res[0].data.records;
        this.onSaleList = res[1].data.records;
        this.airLineList = res[2].data.records;
      });
    },
    async onSubmit(ifComponent) {
      if(!ifComponent){
        this.currentPage = 1;
      }
      this.slectAllDataStatic = false
      let { formInline, currentPage, woStatus, slectAllDataStatic } = this;
      let copyS = JSON.parse(JSON.stringify(formInline))
      
       if(copyS.orderNos.length <= 11){
        copyS.orderNo = copyS.orderNos
        copyS.orderNos = ""
      }
       if(copyS.waybillNos.length <= 15){
        copyS.waybillNo = copyS.waybillNos.replace(/-/g,'')
        copyS.waybillNos = ""
      }else {
        copyS.waybillNos =  copyS.waybillNos.replace(/-/g,'')
      }
      // this.pageNum = 1
      await this.getTabelData(
        formInline,
        currentPage,
        woStatus,
        slectAllDataStatic,
        this.pageSize,
      );
      await this.handleClick(woStatus, false);
    
    },

    async handleCurrentChange(e) {
      this.computedDataStatic = false;
      let { formInline, woStatus, slectAllDataStatic } = this;
      this.currentPage = e;
      await this.getTabelData(formInline, e, woStatus, slectAllDataStatic,this.pageSize);
    },
    async handleSizeChange(e) {
      this.computedDataStatic = false;
      let { formInline, woStatus, slectAllDataStatic } = this;
      this.pageSize = e;
      this.currentPage = 1
      await this.getTabelData(formInline, 1, woStatus, slectAllDataStatic,e);
    },
    // 点击对账
    async fatherReconciliation() {
      let tempArray = JSON.parse(JSON.stringify(this.selectTableData))
      if(tempArray.every(item=>!item.expenseUnitName)){
        return this.$message.warning("该费用暂未选择应付对象，不能对账或核销")
      }
      if (tempArray.length >= 1) {
        let tempString = tempArray[0].expenseUnitName;
        let a = tempArray.filter((i) => {
          if (i.expenseUnitName == tempString) {
            return i;
          }
        });

        if (tempArray.length !== a.length ) {
          this.$message({
            showClose: true,
            message: "应付对象不一致，请重新勾选",
            type: "warning",
          });
        } else {
          this.childPropsData = tempArray;
          let idsArray = tempArray.map((item) => {
            return item.ids;
          });

          let tempAds = [];
          for (let j in idsArray) {
            if (idsArray[j] == null) {
            } else {
              if (idsArray[j].indexOf(",") == -1) {
                tempAds.push(idsArray[j]);
              } else {
                let te = idsArray[j].split(",");
                tempAds = tempAds.concat(te);
              }
            }
          }
          let { formInline } = this;
          let params = Object.assign({}, formInline, { ids: tempAds ,woStatus:this.woStatus});
          if (params.payWriteOffStatusList.indexOf("") != -1) {
            params.payWriteOffStatusList = [];
          }
          if(params.waybillNos.length <= 15){
          params.waybillNo = params.waybillNos.replace(/-/g,'')
          params.waybillNos = ""
        }else {
          params.waybillNos =  params.waybillNos.replace(/-/g,'')
        }
          if(this.slectAllDataStatic) {
             delete params.ids
          }
          let res = await this.$http.post(this.$service.toCheckAmount, params);
          if (res.code == 200) {
            let testObj = Object.assign(
              {},
              res.data,
              { expenseUnitName: tempString },
              { ids: tempAds }
            );
            this.childPropsObj = testObj;
            // console.log(this.childPropsObj)
            setTimeout(() => {
              this.$refs.reconciliationData.input3 = "";
              this.$refs.reconciliationData.showModal();
            }, 0);
          } else {
            return this.$message.error(res.message)
          }
        }
      } else if (tempArray.length == 0) {
        this.$message({
          showClose: true,
          message: "请先勾选一条数据",
          type: "warning",
        });
        return;
      }
    },
    //预付核销
   async advanceVerification(){
      let tempArray = this.selectTableData
      if(tempArray.every(item=>!item.expenseUnitName)){
        return this.$message.warning("该费用暂未选择应付对象，不能对账或核销")
      }
      if (tempArray.length >= 1 || this.slectAllDataStatic == true) {
        let tempString = tempArray[0].expenseUnitName;
        let a = tempArray.filter((i) => {
          if (i.expenseUnitName == tempString) {
            return i;
          }
        });
        if (tempArray.length !== a.length) {
          this.$message({
            showClose: true,
            message: "应付对象不一致，请重新勾选",
            type: "warning",
          });
        } else {
          let { formInline } = this;
          let idsArray = tempArray.map((item) => {
            return item.ids;
          });

          let tempAds = [];
          for (let j in idsArray) {
            if (idsArray[j] == null) {
            } else {
              if (idsArray[j].indexOf(",") == -1) {
                tempAds.push(idsArray[j]);
              } else {
                let te = idsArray[j].split(",");
                tempAds = tempAds.concat(te);
              }
            }
          }
          let test = tempArray.map((res) => {
            return { orderId: res.orderId, ids: res.ids };
          });
          this.verificationArr = test;
          let params = Object.assign({}, formInline, { ids: tempAds,woStatus:this.woStatus });
          if (params.payWriteOffStatusList.indexOf("") != -1) {
            params.payWriteOffStatusList = [];
          }
          if(params.waybillNos.length <= 15){
          params.waybillNo = params.waybillNos.replace(/-/g,'')
          params.waybillNos = ""
        }else {
          params.waybillNos =  params.waybillNos.replace(/-/g,'')
        }
          if(this.slectAllDataStatic) {
             delete params.ids
          }
          let res = await this.$http.post(this.$service.toWriteOffAmountCount,params)
             if (res.code == 200) {
                this.verificationObj = res.data;
                setTimeout(() => {
                  // this.$refs.outAdvance.remoteMethod("");
                  // this.$refs.outAdvance.showModal();
                  this.$refs.outAdvance.openDial( this.selectTableData[0].expenseUnitName)

                }, 0);
              } else {
                return this.$message.error(res.message)
              }
          
        }
      } else if (tempArray.length == 0) {
        this.$message({
          showClose: true,
          message: "请先勾选一条数据",
          type: "warning",
        });
        return;
      } else {
      }
    },
    // 正常核销
    async fatherVerification() {
      let tempArray = this.selectTableData
      if(tempArray.every(item=>!item.expenseUnitName)){
        return this.$message.warning("该费用暂未选择应付对象，不能对账或核销")
      }
      if (tempArray.length >= 1 || this.slectAllDataStatic == true) {
        let tempString = tempArray[0].expenseUnitName;
        let a = tempArray.filter((i) => {
          if (i.expenseUnitName == tempString) {
            return i;
          }
        });
        if (tempArray.length !== a.length) {
          this.$message({
            showClose: true,
            message: "应付对象不一致，请重新勾选",
            type: "warning",
          });
        } else {
          this.showVerification = true
          let { formInline } = this;
          let idsArray = tempArray.map((item) => {
            return item.ids;
          });

          let tempAds = [];
          for (let j in idsArray) {
            if (idsArray[j] == null) {
            } else {
              if (idsArray[j].indexOf(",") == -1) {
                tempAds.push(idsArray[j]);
              } else {
                let te = idsArray[j].split(",");
                tempAds = tempAds.concat(te);
              }
            }
          }
          let test = tempArray.map((res) => {
            return { orderId: res.orderId, ids: res.ids };
          });
          this.verificationArr = test;
          let params = Object.assign({}, formInline, { ids: tempAds,woStatus:this.woStatus });
          if (params.payWriteOffStatusList.indexOf("") != -1) {
            params.payWriteOffStatusList = [];
          }
          if(params.waybillNos.length <= 15){
          params.waybillNo = params.waybillNos.replace(/-/g,'')
          params.waybillNos = ""
        }else {
          params.waybillNos =  params.waybillNos.replace(/-/g,'')
        }
          if(this.slectAllDataStatic) {
             delete params.ids
          }
          let res = await this.$http.post(
            this.$service.toWriteOffAmountCount,
            params
          );
          if (res.code == 200) {
            this.verificationObj = res.data;
            setTimeout(() => {
              this.$refs.verificationData.remoteMethod("");
              this.$refs.verificationData.showModal();
            }, 0);
          } else {
            return this.$message.error(res.message)
          }
        }
      } else if (tempArray.length == 0) {
        this.$message({
          showClose: true,
          message: "请先勾选一条数据",
          type: "warning",
        });
        return;
      }
    },
    // 单选数据
    async clckOne(selection, row) {
      this.multipleSelection = selection;
    },
    // 跨页全选
    async slectAllData() {
      let { formInline, currentPage, woStatus, slectAllDataStatic } = this;
      this.dealSelectAll(slectAllDataStatic);
    },
    // 数据统计
    async calcSlectData() {
      if(this.computedDataStatic == false) {
      let {
        formInline,
        currentPage,
        woStatus,
        slectAllDataStatic,
        countAuth,
        countErr,
        countNoAuth,
      } = this;
      let tempTotal = "";
      if (woStatus == 0) {
        tempTotal = countAuth;
      } else if (woStatus == 1) {
        tempTotal = countNoAuth;
      } else if (woStatus == 2) {
        tempTotal = countErr;
      }
      let params = Object.assign(
        {},
        formInline,
        { ids:this.idsArray},
        { pageNum: currentPage, woStatus: woStatus },
        { pageSize: tempTotal }
      );
      if (params.payWriteOffStatusList.indexOf("") != -1) {
        params.payWriteOffStatusList = [];
      }
      if(params.waybillNos.length <= 15){
          params.waybillNo = params.waybillNos.replace(/-/g,'')
          params.waybillNos = ""
        }else {
          params.waybillNos =  params.waybillNos.replace(/-/g,'')
        }
      if(this.slectAllDataStatic) {
        delete params.ids
      }
      this.$http.post(this.$service.dataStatistics, params).then((res) => {
        if (res.code == 200) {
          let tempObj = res.data;
          tempObj.totalApUnwoOrgn = JSON.parse(tempObj.totalApUnwoOrgn);
          tempObj.totalApOrgn = JSON.parse(tempObj.totalApOrgn);
          tempObj.totalApWoOrgn = JSON.parse(tempObj.totalApWoOrgn);
          tempObj.totalApWoPayCheckAmountOrgn = JSON.parse(tempObj.totalApWoPayCheckAmountOrgn);
          tempObj.totalApUnPayCheckAmounOrgn = JSON.parse(tempObj.totalApUnPayCheckAmounOrgn);
          this.dataStaticObj = tempObj;
        }
      });
      }
      this.computedDataStatic = !this.computedDataStatic;
      this.computedDataType = this.computedDataStatic == false ? "" : "primary";
    },
    // 默认处理tableData是否全选
    async dealSelectAll(e) {
      this.tableData.forEach((item) => {
        this.$refs.multipleTable.toggleRowSelection(item, e);
      });
    },

    // 处理订单input的输入选择
    querySearch(q, cb) {
      let tempQuery = [];
      let arrayt = [];
      q = q
        .replace(/，/gi, ",")
        .replace(/\s/gi, ",")
        .replace(/\//g, ",")
        .replace(/-/gi, "");
      if (q.charAt(q.length - 1) == ",") {
        q = q.slice(0, q.length - 1);
      }

      if (q.indexOf(",") != -1) {
        tempQuery = q.split(",");
        this.formInline.orderNos = q;
        this.formInline.orderNo = "";
      } else {
        tempQuery[0] = q;
        this.formInline.orderNo = q;
        this.formInline.orderNos = "";
      }
      for (let i in tempQuery) {
        let newobj = {};
        newobj.value = tempQuery[i];
        newobj.label = tempQuery[i];
        arrayt.push(newobj);
      }
      this.testNo = q;
      cb(arrayt);
    },
    // 处理运单input的输入选择
    querySearch2(q, cb) {
      let tempQuery = [];
      let arrayt = [];
      q = q
        .replace(/，/gi, ",")
        .replace(/\s/gi, ",")
        .replace(/\//g, ",")
        .replace(/-/gi, "");
      if (q.charAt(q.length - 1) == ",") {
        q = q.slice(0, q.length - 1);
      }

      if (q.indexOf(",") != -1) {
        tempQuery = q.split(",");
        this.formInline.waybillNos = q;
        this.formInline.waybillNo = "";
      } else {
        tempQuery[0] = q;
        this.formInline.waybillNo = q;
        this.formInline.waybillNos = "";
      }
      for (let i in tempQuery) {
        let newobj = {};
        newobj.value = tempQuery[i];
        newobj.label = tempQuery[i];
        arrayt.push(newobj);
      }
      this.testBIllNo = q;
      cb(arrayt);
    },
    dealNo() {
      // 选择的时候将处理后的输入数据赋值给所选择的内容
      this.testNos = this.testNo;
    },
    dealNo2() {
      // 选择的时候将处理后的输入数据赋值给所选择的内容
      this.testBIllNos = this.testBIllNo;
    },
    // 获取tabel数据
    async getTabelData(
      formInline,
      currentPage,
      woStatus,
      slectAllDataStatic = false,
      pageSize = 10
    ) {
      let tempObj = {...formInline,...{ pageNum: currentPage, woStatus: woStatus,pageSize: pageSize }}
      if (tempObj.payWriteOffStatusList.indexOf("") != -1) {
        tempObj.payWriteOffStatusList = [];
      }
      if(tempObj.waybillNos.length <= 15){
          tempObj.waybillNo = tempObj.waybillNos.replace(/-/g,'')
          tempObj.waybillNos = ""
        }else {
          tempObj.waybillNos =  tempObj.waybillNos.replace(/-/g,'')
        }
      try {
        let res = await this.$http.post(
          this.$service.searchWoByPageBill,
          tempObj
        );
        if (res.code == 200) {
          let resData = res.data.page;
          this.countNoAuth = res.data.countNoAuth;
          this.countAuth = res.data.countAuth;
          this.countErr = res.data.countErr;
          if (resData) {
            for (let i in resData.records) {
              resData.records[i].totalApOrgn = await this.dealApString(
                resData.records[i].totalApOrgn
              );
              resData.records[i].payWriteOffAmounts = await this.dealApString(
                resData.records[i].payWriteOffAmounts
              );
              resData.records[i].unwrittenOffAmounts = await this.dealApString(
                resData.records[i].unwrittenOffAmounts
              );
              resData.records[i].payCheckAmounts = await this.dealApString(
                resData.records[i].payCheckAmounts
              );
              resData.records[i].unreconciledAmountOrgn = await this.dealApString(
                resData.records[i].unreconciledAmountOrgn
              );
              resData.records[i].totalApObjOrgn = await this.dealApString(
                resData.records[i].totalApObjOrgn
              );
            }
            // console.log(this.woStatus)
            if (this.woStatus == 1) {
              this.pageTotal = res.data.countNoAuth;
            } else if (this.woStatus == 2) {
              this.pageTotal = res.data.countErr;
            } else {
              this.pageTotal = res.data.countAuth;
            }
            this.tableData = resData.records;
            if (slectAllDataStatic) {
              this.multipleSelection = resData.records;
            } else {
              this.multipleSelection = [];
            }
            setTimeout(async () => {
              await this.dealSelectAll(slectAllDataStatic);
            }, 0);
          } else {
            this.tableData = [];
            this.pageTotal = 0
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 处理利润异常样式
    backStyle({ row, rowIndex }) {
      if (
        row.totalApCny < row.payCheckAmount ||
        row.payCheckAmountRmb < row.payWriteOffAmountRmb ||
        row.totalApCny < row.payWriteOffAmountRmb
      ) {
        // console.log('第二种异常')
        return "background-color: #CD5C5C";
      } else if (-200 < row.orderProfit && row.orderProfit < 0) {
        return "background-color: #FFDEAD";
      } else if (-500 <= row.orderProfit && row.orderProfit <= -200) {
        return "background-color: #F4A460";
      } else if (row.orderProfit < -500) {
        return "background-color: #FA8072";
      }
    },
    // 处理返回的原币string
    dealApString(orgn,extraWord) {
      if (!orgn) {
        return "¥ " +0;
      }
      orgn = JSON.parse(orgn);
      var totalOrgn = "";
      if(orgn && (orgn.length > 0)){
        for (var i = 0; i < orgn.length; i++) {
          var obj = this.currencyArray.filter((item)=>{return (item.id == orgn[i].currency)})
          totalOrgn = totalOrgn + obj[0]["symbol"] + Number(orgn[i].amount)
          if(i < (orgn.length - 1)){
            totalOrgn = totalOrgn + '\n'
          }
        }
      }else{
        totalOrgn = "¥ " +0
      }
      return (extraWord?extraWord+":":"") +totalOrgn;
    },
  },
};
</script>

<style scoped lang="less">
 .el-button--primary{
      width:100px;
      // text-align: center;
  }
/deep/.pageSkip {
  padding: 3px 5px !important;
}
/deep/ .el-table {
  .cell {
    text-align: center;
  }
  th {
    height: 35px;
  }
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
.content-wrapper {
    width:100%;
  height: 95%;
  box-sizing: border-box;
  /*height: 100%;*/
  padding: 20px;
  padding-top:0;
  overflow: hidden;
  background-color: #f3f6f9 !important;
  .content {
    width: 100%;
    .content-search-normal {
      padding: 20px 20px 0 20px !important;
      background: #fff;
      /deep/.el-form-item {
        margin-left: 15px;
        margin-bottom:8px!important
      }
      .formItem {
        width: 320px;
        margin-top: -5px;
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
.demo-form-inline {
  margin: 20px 0;
  /* width: 80%; */
  /* display: flex;
  justify-content: space-around;
  flex-wrap: wrap; */
}
.endItem {
  position: relative;
  right: -88px;
}

.content-wrapper {
  /* width: calc(100% - 100px); */
}
/deep/.el-tabs--top .el-tabs__item.is-top:last-child{
  color:red;
  
}
/deep/.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active:last-child{
  color:red!important;

}
/deep/.el-tabs--border-card>.el-tabs__header .el-tabs__item:last-child:hover{
  color: red !important;
}
.footer {
  display: flex;
  justify-content: space-between;
  // align-items: center;
  margin: 10px 15px 10px 0;
}
.calcDataContont {
  margin: 10px 0;
  display: flex;
}
.text_color_blue {
  color: #62a0ed;
}
.calcDataContont > span {
  margin-left: 10px;
}
.calcDataContont {
  .dataCount {
    margin-left: 10px;
    flex: 0 0 180px;
  }
}
.calcDataContont .fon {
  display: flex;
  flex-direction: column;
}
.diaModalClass {
  margin-top: 20px;
  padding-bottom: 20px;
}
.opacity {
  opacity: 0;
}
.el_tabs {
  display: flex;
  justify-content: start;
  border-top: 1px solid #d5d5d5;
}
.el_tabs .el-button {
  margin-left: 0;
  border-radius: 0;
}
.tip {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
.drawerTip {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  margin-top: 10vh;
}
.drawerTip > .mycheckbox {
  margin-top: 10px;
}
.mycheckbox {
  width: 100%;
  margin-left: 20px;
}
//  /deep/.el-table__body-wrapper .el-table__body tr:hover>td{
//   background-color: #CCC !important;
// }
//  /deep/.el-table__body-wrapper .el-table__body tr:hover .el-table-column--selection{
//   background-color: #CCC !important;
// }
//   /deep/.el-table__body-wrapper .el-table__body tbody .hover-row td{
//   background-color: #CCC !important;
// }
//   /deep/.el-table__body-wrapper .el-table__body tbody .hover-row .el-table-column--selection{
//   background-color: #CCC !important;
// }
</style>
