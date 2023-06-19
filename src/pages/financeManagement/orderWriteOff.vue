<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" size="medium" class="demo-form-inline" label-position="right">
        <div class="content-search-normal" style="position:relative">
          <div style="position:absolute;right:10px;top:10px">
              <div style="cursor:pointer;display:inline-block;" @click="shiftSelectControl">
            <img v-if="selectControl"  src="../../assets/doubleArrowUp.png" alt="" style="width:30px;height:30px;margin:0 0 18px 0;transform:translateY(7px)">
            <img v-if="!selectControl" src="../../assets/doubleArrowDown.png" alt="" style="width:30px;height:30px;margin:0 0 18px 0;transform:translateY(7px)">
          </div>
          </div>
          <el-form-item label="订单号:" >
            <el-input v-model="selectResult.orderNo" style="width: 160px;" size="medium" maxlength="15" clearable placeholder="请输入订单号"></el-input>
          </el-form-item>

          <el-form-item label="运单号:" >
            <el-input v-model="selectResult.waybillNo" style="width: 135px;" size="medium" clearable placeholder="请输入运单号" onkeyup="this.value = this.value.replace(/[^\d]/g,'');" @blur="selectResult.waybillNo = $event.target.value.substr(0,11)"></el-input>
          </el-form-item>
          <el-form-item label="财务系列号:">
            <el-input
              v-model="selectResult.financialSeriesNo"
              style="width: 170px"
              @change="setLimit($event)"
              size="medium"
              maxlength="12"
              clearable
              placeholder="请输入财务系列号"
            ></el-input>
          </el-form-item>
          <el-form-item label="订舱客户:" >
              <el-select
              v-model="selectResult.companyId"
              placeholder="请输入订舱客户"
              clearable
              remote
              filterable
              reserve-keyword
              style="width: 200px"
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

          <el-form-item label="代理上家:" >
           <el-select
              v-model="selectResult.agentId"
              placeholder="请输入代理上家"
              :remote-method="agentMethod"
              :loading="loading" 
              @change="getCurrentChange"
              clearable
              filterable
              maxlength="30"
              remote
              reserve-keyword
              id="agentId"
              style="width: 200px"
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
             <el-form-item label="应收核销状态:">
            <el-select v-model="selectResult.rcvWriteOffStatusList" placeholder="应收核销状态" clearable multiple collapse-tags  @change="dealAllChange" style="width: 200px;">
              <el-option
                v-for="(item,index) in writeOffStatus"
                :key="index"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="应付核销状态:" >
            <el-select v-model="selectResult.payWriteOffStatusList" placeholder="应付核销状态" clearable multiple collapse-tags  @change="dealAllChange" style="width: 200px;">
              <el-option
                v-for="(item,index) in writeOffStatus"
                :key="index"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="起运港:"  v-show="selectControl">
            <el-select  @change="getCurrentChange" v-model="selectResult.pol" placeholder="起运港三字码" id="pol" :remote-method="polMethod" maxlength="15" :loading="loading" clearable filterable remote reserve-keyword style="width: 140px;">
              <el-option
                v-for="(item,index) in polOpt"
                :disabled="pod == item.threeLetterCode"
                :key="item.threeLetterCode"
                :value="item.threeLetterCode">
                <span>{{item.threeLetterCode}}</span>
                <span style="margin-left: 5px;">{{item.name}}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="目的港:"  v-show="selectControl">
            <el-select  @change="getCurrentChange" v-model="selectResult.pod" placeholder="目的港三字码" id="pod" :remote-method="podMethod" maxlength="15" :loading="loading" clearable filterable remote reserve-keyword style="width: 140px;">
              <el-option
                v-for="item in podOpt"
                :disabled="pol == item.threeLetterCode"
                :key="item.threeLetterCode"
                :value="item.threeLetterCode">
                <span>{{item.threeLetterCode}}</span>
                <span style="margin-left: 5px;">{{item.name}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="航司:"   v-show="selectControl">
            <el-select  @change="getCurrentChange" v-model="selectResult.airCompanyCode" placeholder="请输入航司" id="airCompany" :remote-method="companyMethod" maxlength="15" :loading="loading" clearable filterable remote reserve-keyword style="width: 190px;">
              <el-option
                v-for="(item,index) in airCompanyCodeOpt"
                :key="index"
                :label="item.name"
                :value="item.airCompanyCode">
                <span>{{ item.airCompanyCode }}</span>
                <span style="margin-left: 5px">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        
         <el-form-item label="售前客服:"  v-show="selectControl">
            <el-select
              id="pscsId"
               @change="getCurrentChange"
              v-model="selectResult.pscsId"
              placeholder="请输入售前客服"
              :loading="loading"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 170px"
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

          <el-form-item label="售中客服:"  v-show="selectControl">
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
              style="width: 170px"
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
           <el-form-item label="航线:" v-show="selectControl">
            <el-select
              id="principalId"
               @change="getCurrentChange"
              v-model="selectResult.principalId"
              placeholder="请输入航线"
              :loading="loading"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 200px"
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
     

        <div style="width:475px" class="formItem" v-show="selectControl">
          <el-form-item label="航班日期:">
             <el-date-picker
             style="width:185px"
              value-format="yyyy-MM-dd"
               @change="getCurrentChange"
              v-model="selectResult.startDepartureDate"
              type="date"
              :picker-options="pickerOptionsStartOne"
              placeholder="选择日期">
            </el-date-picker >-
             <el-date-picker
             style="width:185px"
              value-format="yyyy-MM-dd"
               @change="getCurrentChange"
              v-model="selectResult.endDepartureDate"
              type="date"
              :picker-options="pickerOptionsEndOne"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
          
          <el-form-item label="交单时间:">
            <el-date-picker
             style="width:165px"
              value-format="yyyy-MM-dd"
               @change="getCurrentChange"
              v-model="selectResult.startPresentationTime"
              type="date"
              :picker-options="pickerOptionsStartTwo"
              placeholder="选择日期">
            </el-date-picker >-
             <el-date-picker
             style="width:165px"
              value-format="yyyy-MM-dd"
               @change="getCurrentChange"
              v-model="selectResult.endPresentationTime"
              type="date"
              :picker-options="pickerOptionsEndTwo"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
         <el-form-item label="是否作废:">
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
        <el-form-item label="请选择分公司">
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
          <el-form-item>
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
              <el-button @click="searchClick(true)" size="mini" type="primary" icon="el-icon-search" v-auth="['103000_B']">查询</el-button>
              <el-button @click="restClick" size="mini" type="primary">清空</el-button>
              </div>
               
        </div>
      </el-form>
      <el-tabs class="nth9_class" v-model="typeCode" type="border-card" @tab-click="tabClickData" value="可操作">
        <el-tab-pane v-for="(item,index) in tabName" :key="index" :label="item+'('+tabNum[index]+')'" :name="item">
           <el-table
            :data="tableData"
            ref="multipleTable"
            border
            stripe
            max-height="550px"
            header
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
         
            <el-table-column label="财务系列号" width="160" v-if="checkedTable.indexOf('财务系列号') !== -1">
              <template slot-scope="scope">
              <div @click="showData(scope.row.id,scope.row.orderNo)" style="color:skyBlue;cursor:pointer">
                {{scope.row.financialSeriesNo}}
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
              <div @click="showData(scope.row.id,scope.row.orderNo)" style="color:skyBlue;cursor:pointer">
                {{scope.row.orderNo}}
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
              prop="customerName"
              label="订舱客户"
              min-width="220"
              type=""
              v-if="checkedTable.indexOf('订舱客户') !== -1"
            ></el-table-column>
            <el-table-column
              prop="agentName"
              label="代理上家"
              min-width="220"
              type=""
              v-if="checkedTable.indexOf('代理上家') !== -1"
            ></el-table-column>
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
              label="应收金额"
              v-if="checkedTable.indexOf('应收金额') !== -1"
            >
              <el-table-column prop="totalArCny" label="人民币" width="120">
              </el-table-column>
              <el-table-column label="原币" width="120">
                <template slot-scope="scope">
                  <div v-html="dealOrgn(scope.row.totalArOrgn)" style="white-space:pre-wrap"></div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column
              label="应收已核销金额"
              v-if="checkedTable.indexOf('应收已核销金额') !== -1"
            >
              <el-table-column prop="totalRcWoCny" label="人民币" width="120">
              </el-table-column>
              <el-table-column label="原币" width="120">
                 <template slot-scope="scope">
                  <div v-html="dealOrgn(scope.row.totalRcWoOrgn)" style="white-space:pre-wrap"></div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column
              label="应收未核销金额"
              v-if="checkedTable.indexOf('应收未核销金额') !== -1"
            >
              <el-table-column prop="totalRcUnwoCny" label="人民币" width="120">
              </el-table-column>
              <el-table-column label="原币" width="120">
                 <template slot-scope="scope">
                  <div v-html="dealOrgn(scope.row.totalRcUnwoOrgn)" style="white-space:pre-wrap"></div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column
              label="应付金额"
              v-if="checkedTable.indexOf('应付金额') !== -1"
            >
              <el-table-column prop="totalApCny" label="人民币" width="120">
              </el-table-column>
              <el-table-column prop="city" label="原币" width="120">
                 <template slot-scope="scope">
                  <div v-html="dealOrgn(scope.row.totalApOrgn)" style="white-space:pre-wrap"></div>
                </template>
              </el-table-column>
            </el-table-column>
             <el-table-column
              label="应付已核销金额"
              v-if="checkedTable.indexOf('应付已核销金额') !== -1"
            >
              <el-table-column prop="totalApWoCny" label="人民币" width="120">
              </el-table-column>
              <el-table-column label="原币" width="120">
                 <template slot-scope="scope">
                  <div v-html="dealOrgn(scope.row.totalApWoOrgn)" style="white-space:pre-wrap"></div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column
              label="应付未核销金额"
              v-if="checkedTable.indexOf('应付未核销金额') !== -1"
            >
              <el-table-column prop="totalApUnwoCny" label="人民币" width="120">
              </el-table-column>
              <el-table-column label="原币" width="120">
                 <template slot-scope="scope">
                  <div v-html="dealOrgn(scope.row.totalApUnwoOrgn)" style="white-space:pre-wrap"></div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column
              prop="orderProfit"
              label="利润"
              min-width="80"
              v-if="checkedTable.indexOf('利润') !== -1"
            ></el-table-column>
            
            <el-table-column
              prop="airCompanyCode"
              label="航司"
              min-width="80"
              type=""
              v-if="checkedTable.indexOf('航司') !== -1"
            ></el-table-column>
            <el-table-column
              prop="pol"
              label="起运港"
              min-width="80"
              type=""
              v-if="checkedTable.indexOf('起运港') !== -1"
            ></el-table-column>
            <el-table-column
              prop="pod"
              label="目的港"
              min-width="80"
              type=""
              v-if="checkedTable.indexOf('目的港') !== -1"
            ></el-table-column>
             <el-table-column
              prop="cargoInfo"
              label="货物信息"
              min-width="140"
              type=""
              v-if="checkedTable.indexOf('货物信息') !== -1"
            >
              <template slot-scope="scope">
               <span>
                 <div>{{ scope.row.cargoInfo && scope.row.cargoInfo.split(",")[0] }}</div>
                  <div>{{ scope.row.cargoInfo && scope.row.cargoInfo.split(",")[1] }}PCS</div>
                  <div>{{ scope.row.cargoInfo && scope.row.cargoInfo.split(",")[2] }}CBM</div>
                  <div>{{ scope.row.cargoInfo && scope.row.cargoInfo.split(",")[3] }}KGS</div>
                  <div>1:{{ scope.row.cargoInfo && scope.row.cargoInfo.split(",")[4] }}</div>
               </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="operator"
              label="操作人员"
              min-width="160"
              type=""
              v-if="checkedTable.indexOf('操作人员') !== -1"
            >
            <template slot-scope="scope">
              <span>
                <div>售前：{{ scope.row.operator && scope.row.operator.split(",")[0] }}</div>
                <div>售中：{{ scope.row.operator && scope.row.operator.split(",")[1] }}</div>
                <div>航线：{{ scope.row.operator && scope.row.operator.split(",")[2] }}</div>
                <div>客户负责人：{{ scope.row.operator && scope.row.operator.split(",")[3] }}</div>
              </span>
            </template>
            </el-table-column>
           
          </el-table>
          <div style="display:flex;justify-content:space-between">
            <div>
              <el-button size="mini" class="pageSkip"><el-checkbox v-model="pageSkipChecked" @change="selectAllTable">跨页全选</el-checkbox></el-button>
              <el-button type="primary" size="mini" @click="getStatistData"
                >数据统计</el-button
              >
             

            </div>
            <div style="display:flex;">
               <div style="widht:100%;margin:25px 15px 0 0">
                  <el-dropdown @command="exportList">
                    <el-button size='mini' type="primary">
                      导出列表<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="detail">导出明细</el-dropdown-item>
                      <el-dropdown-item command="total">导出总计</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  
                  <el-button @click="drawer = true" type="primary" size='mini'>选择表格列</el-button>
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
                  <div class="statists">应收总金额:{{statistData.totalArCny}}</div>
                  <div class="statists">已核销总金额:{{statistData.totalRcWoCny}}</div>
                  <div class="statists">未核销总金额:{{statistData.totalRcUnwoCny}}</div>
                  <div class="statists" style="white-space:pre-wrap;display:flex"><div>应收原币</div><div style="margin-left:5px"  v-html="dealOrgnS(statistData.totalArOrgn)"></div></div>
                  <div class="statists" style="white-space:pre-wrap;display:flex"><div>已核销原币</div><div style="margin-left:5px"  v-html="dealOrgnS(statistData.totalRcWoOrgn)"></div></div>
                  <div class="statists" style="white-space:pre-wrap;display:flex"><div>未核销原币</div><div style="margin-left:5px"  v-html="dealOrgnS(statistData.totalRcUnwoOrgn)"></div> </div>
                  <div class="statists">利润:{{statistData.orderProfit}}</div>
                  <div class="statists" style="color:red;fontSize:14px;fontWeight:bold;transform:translateY(10px)" v-if='errorStatist'>存在异常订单!</div>

                </div>
                <div style="display:flex;padding-bottom:15px" class="allStatist">
                  <div class="statists">应付总金额:{{statistData.totalApCny}}</div>
                  <div class="statists">已核销总金额:{{statistData.totalApWoCny}}</div>
                  <div class="statists">未核销总金额:{{statistData.totalApUnwoCny}}</div>
                  <div class="statists" style="white-space:pre-wrap;display:flex"><div>应付原币</div ><div  style="margin-left:5px" v-html="dealOrgnS(statistData.totalApOrgn)"></div></div>
                  <div class="statists" style="white-space:pre-wrap;display:flex"><div>已核销原币</div ><div style="margin-left:5px" v-html="dealOrgnS(statistData.totalApWoOrgn)"></div></div>
                  <div class="statists" style="white-space:pre-wrap;display:flex"><div>未核销原币</div><div style="margin-left:5px"  v-html="dealOrgnS(statistData.totalApUnwoOrgn)"></div></div>
                </div>
              </div>
        </el-tab-pane>
      </el-tabs>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="80%">
          <div style="font-size: 18px;font-weight: 100;color: #333;padding: 0 20px 10px 20px;">应收账单</div>
          <Table
            :tableData='tableDataOne'
            :operation="operation"
            :columns='columns1'
            :showSelection="false"
          >
          </Table>
          <div class="finance-table-price">
            <div>账单合计：{{getOrgn(this.totalArOrgn)}}</div>
            <div>人民币合计：￥{{ this.totalArCny }}</div>
            <div>结算方式：{{ this.payWay == 0 ? "付款买单" : "月结买单" }}</div>
          </div>
          <div style="font-size: 18px;font-weight: 100;color: #333;padding: 10px 20px 10px 20px;">应付账单</div>
          <Table
            :tableData='tableDataTwo'
            :operation="operation"
            :columns='columns2'
            :showSelection="false"
            >
          </Table>
          <div class="finance-table-price">
            <div>账单合计：{{ getOrgn(this.totalArOrgn) }}</div>
            <div>人民币合计：￥{{ this.totalApCny }}</div>
            <div>账单利润：{{ this.orderProfit }}</div>
          </div>
          <div class="finance-table-price">
            <div>订单利润:{{ this.orderProfit }}</div>
          </div>
          <div style="font-size: 18px;font-weight: 100;color: #333;padding: 10px 20px 10px 20px;">修改记录</div>
          <Table
            :tableData='tableDataThree'
            :operation="operation"
            :columns='columns3'
            :showSelection="false"
            >
          </Table>
    </el-dialog>
  </div>
</template>

<script>
  import Table from '@/components/financeTable'
  import { toData } from '@/util/assist'
  export default {
    data() {
      return {
        currencyArray: this.$store.getters.getCurrencyFinance,
        sysOrgs: [],
        fettleList:[{id:'',name:"全部"},{id:0,name:"正常"},{id:1,name:'作废'}],
      selectControl:false,
       //表格控制列drawer
      drawer: false,
      checkAll: false,
      isIndeterminate: true,
      direction: "rtl",
      checkedTable: [  
        "财务系列号",
        "订单号",
        "运单号",
        "航班日期",
        "交单时间",
        "订舱客户",
        "代理上家",
        "应收金额",
        "应收已核销金额",
        "应收未核销金额",
        "应付金额",
        "应付已核销金额",
        "应付未核销金额",
        "利润",],
      tableOptions: [
        "财务系列号",
        "订单号",
        "运单号",
         "订舱客户",
        "代理上家",
        "航班日期",
        "交单时间",
        "应收金额",
        "应收已核销金额",
        "应收未核销金额",
        "应付金额",
        "应付已核销金额",
        "应付未核销金额",
        "利润",
        "航司",
        "起运港",
        "目的港",
        "货物信息",
        "操作人员"
      ],
        //表格tab页
        tabName:["可操作","业务修改中","异常"],
        tabNum:[0,0,0],
        dialogFormVisible: false,
        customerResponsibles:[],
         //搜索框结果
        selectResult:{
          customerResponsibleId:'',
          orgId: '',
          financialSeriesNo:'',
          orderNo:"",
          waybillNo:"",
          companyId:"",
          agentId:"",
          airCompanyCode:"",
          startPresentationTime:"",
          endPresentationTime:"",
          startDepartureDate:"",
          endDepartureDate:"",
          pscsId:"",
          rcvWriteOffStatusList:[""],
          payWriteOffStatusList:[""],
          pol:"",
          pod:"",
          mscsId:"",
          principalId:"",
          woStatus:0,
          fettle:''
        },
        columns1: [
        { label: "序号", show: true, width: "50" },
        { label: "费用名称", prop: "expenseName", show: true, width: "100" },
        {
          label: "收款单位",
          prop: "expenseUnitName",
          show: true,
          width: "150",
        },
        { label: "单价", prop: "price", show: true, width: "100" },
        { label: "数量", prop: "quantity", show: true, width: "100" },
        { label: "币种", prop: "currency", show: true, width: "100" },
        { label: "原币合计", prop: "totalOrgn", show: true, width: "100" },
        { label: "汇率", prop: "exchangeRateOnly", show: true, width: "100" },
        { label: "人民币合计", prop: "totalCny", show: true, width: "100" },
        { label: "备注", prop: "remark", show: true, width: "50" },
      ],
      columns2: [
        { label: "序号", prop: "orderNo", show: true, width: "50" },
        { label: "费用名称", prop: "expenseName", show: true, width: "100" },
        {
          label: "付款单位",
          prop: "expenseUnitName",
          show: true,
          width: "150",
        },
        { label: "单价", prop: "price", show: true, width: "100" },
        { label: "数量", prop: "quantity", show: true, width: "100" },
        { label: "币种", prop: "currency", show: true, width: "100" },
        { label: "原币合计", prop: "totalOrgn", show: true, width: "100" },
        { label: "汇率", prop: "exchangeRateOnly", show: true, width: "100" },
        { label: "人民币合计", prop: "totalCny", show: true, width: "100" },
        { label: "备注", prop: "remark", show: true, width: "50" },
      ],
      columns3: [
        { label: "操作类型", prop: "operationType", show: true, width: "150" },
        { label: "说明", prop: "operationInfo", show: true, width: "100" },
        { label: "操作时间", prop: "createTime", show: true, width: "150" },
        { label: "操作人", prop: "operator", show: true, width: "100" },
      ],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        //table
        selectTableData:[],
        tableData:[],
        tableDataOne:[],
        tableDataTwo:[],
        tableDataThree:[],
        pageSkipChecked:false,
        //数据统计
        statistDataShow:false,
        errorStatist:false,
        statistData:{},
        totalArOrgn:"",
        totalApOrgn:"",
        totalArCny:"",
        totalApCny:"",
        orderProfit:"",
        payWay:"",
        // 操作
        operation: {
          show: false,
          label: '操作',
          width: '180',
          options: [
            {label: '编辑', method: 'routeEdit'}
          ]
        },
        //航班日期选择器
         // 限制结束日期大于开始日期
        pickerOptionsStartOne: {
          disabledDate: time => {
            let endDateVal = this.selectResult.endDepartureDate
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime()
            }
          }
        },
        pickerOptionsEndOne: {
          disabledDate: time => {
            let beginDateVal = this.selectResult.startDepartureDate
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal).getTime()-8.64e7
            }
          }
        },
        // 下单时间
         pickerOptionsStartTwo: {
          disabledDate: time => {
            let endDateVal = this.selectResult.startPresentationTime
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime()
            }
          }
        },
        pickerOptionsEndTwo: {
          disabledDate: time => {
            let beginDateVal = this.selectResult.endPresentationTime
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal).getTime()-8.64e7
            }
          }
        },
        writeOffStatus:[{value:"全部",id:""},{value:"未对账未核销",id:'0'},{value:"部分对账未核销",id:'1'},{value:"已对账未核销",id:'2'},{value:"部分对账部分核销",id:'4'},{value:"已对账部分核销",id:'5'},{value:"已对账已核销",id:'8'}],
        agentOpt: [],
        polOpt: [],
        podOpt: [],
        airCompanyCodeOpt:[],
        payBefore:[],
        paying:[],
        airManger:[],
        typeCode: '可操作',
        orderCount: 0,
        //复制表格查询数据-分页跳转使用
        copySelectJSON:[],
        dialogTitle:'',
        customerNameArray:'',
      }
    },
    mounted() {
      // this.currencyArray = this.$store.getters.getCurrencyFinance
      this.findThisUserAndBranchOrg()
      this.initData()
      this.initAgentList()
      this.initAirportSearchByPage()
      this.initCompanySearchByPage()
      this.operateData()
      this.dom()
      this.customerNameMethod()
      this.searchBranchUsers({
        roleName: "",
        listName: "customerResponsibles",
      });
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
      this.selectResult.financialSeriesNo = e.replace(/[\W]/g,'')
    },
      //选择框值改变直接查询 
      getCurrentChange(){
        this.searchClick(true)
      },
    //下拉框搜索框控制
    shiftSelectControl(){
      this.selectControl = !this.selectControl
    },
      //原币处理
    dealOrgn(orgn,extraWord) {
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
    dealOrgnS(orgn, extraWord) {
      if (!orgn) {
        return "¥ "+0;
      }
      orgn = JSON.parse(orgn);
      var totalOrgn = "";
      if(orgn && (orgn.length > 0)){
        for (var i = 0; i < orgn.length; i++) {
          var obj = this.currencyArray.filter((item)=>{return (item.id == orgn[i].currency)})
          totalOrgn = totalOrgn + obj[0]["symbol"] + Number(orgn[i].amount).toLocaleString('en-US')
          if(i < (orgn.length - 1)){
            totalOrgn = totalOrgn + '\n'
          }
        }
      }else{
        totalOrgn = "¥ " +0
      }
      return (extraWord?extraWord+":":"") +totalOrgn;;
    },
      //限制搜索条件的最大位数
      dom(){
          //代理上家
        const select = document.querySelector('#agentId')
        select.setAttribute('maxLength',30)
        //航司
        const select1 = document.querySelector('#airCompany')
        select1.setAttribute('maxLength',15)
         //起运港目的港
        const select2 = document.querySelector('#pod')
        select2.setAttribute('maxLength',15)
         const select3 = document.querySelector('#pol')
        select3.setAttribute('maxLength',15)
        //售前售中航线
         const select4 = document.querySelector('#pscsId')
         select4.setAttribute('maxLength',10)
         const select5 = document.querySelector('#mscsId')
         select5.setAttribute('maxLength',10)
         const select6 = document.querySelector('#principalId')
         select6.setAttribute('maxLength',10)
      },
        //获取表格选中数据
        handleSelectionChange (e) {
          this.selectTableData = e
          // console.log(this.selectTableData)
        },
      tableRowClassName({row, rowIndex}) {
        if(row.abnormalFlag > 1  && row.orderProfit>=0){
          return 'background-color:#CD5C5C ';
        }
      else if (row.orderProfit<0 &&  row.orderProfit>-200 ) {
        return 'background-color: #FFDEAD';
      }
        else if (row.orderProfit<=-200 && row.orderProfit>-500) {
          return 'background-color: #F4A460';
        } else if (row.orderProfit<=-500 ) {
        return 'background-color: #FA8072';
      }
      },
       //搜索表单中多选框控制
      dealAllChange (){
      if(this.selectResult.rcvWriteOffStatusList.indexOf("0") != -1 && this.selectResult.rcvWriteOffStatusList.indexOf("1") != -1 && this.selectResult.rcvWriteOffStatusList.indexOf("2") != -1 && this.selectResult.rcvWriteOffStatusList.indexOf("4") != -1 && this.selectResult.rcvWriteOffStatusList.indexOf("5") != -1 && this.selectResult.rcvWriteOffStatusList.indexOf("8") != -1) {
        this.selectResult.rcvWriteOffStatusList = [""]
      }
       else if (this.selectResult.rcvWriteOffStatusList.indexOf("")>0){
        this.selectResult.rcvWriteOffStatusList = [""]
      }
      else if(this.selectResult.rcvWriteOffStatusList.indexOf("0") != -1 || this.selectResult.rcvWriteOffStatusList.indexOf("1") != -1 || this.selectResult.rcvWriteOffStatusList.indexOf("2") != -1 || this.selectResult.rcvWriteOffStatusList.indexOf("4") != -1 || this.selectResult.rcvWriteOffStatusList.indexOf("5") != -1 || this.selectResult.rcvWriteOffStatusList.indexOf("8") != -1  ) {
          if(this.selectResult.rcvWriteOffStatusList.indexOf("") != -1){
            let index = this.selectResult.rcvWriteOffStatusList.indexOf("")
            this.selectResult.rcvWriteOffStatusList.splice(index,1)
          } 
        }
      if(this.selectResult.payWriteOffStatusList.indexOf("0") != -1 && this.selectResult.payWriteOffStatusList.indexOf("1") != -1 && this.selectResult.payWriteOffStatusList.indexOf("2") != -1 && this.selectResult.payWriteOffStatusList.indexOf("4") != -1 && this.selectResult.payWriteOffStatusList.indexOf("5") != -1 && this.selectResult.payWriteOffStatusList.indexOf("8") != -1) {
        this.selectResult.payWriteOffStatusList = [""]
      }
       else if (this.selectResult.payWriteOffStatusList.indexOf("")>0){
        this.selectResult.payWriteOffStatusList = [""]
      }
      else if(this.selectResult.payWriteOffStatusList.indexOf("0") != -1 || this.selectResult.payWriteOffStatusList.indexOf("1") != -1 || this.selectResult.payWriteOffStatusList.indexOf("2") != -1 || this.selectResult.payWriteOffStatusList.indexOf("4") != -1 || this.selectResult.payWriteOffStatusList.indexOf("5") != -1 || this.selectResult.payWriteOffStatusList.indexOf("8") != -1  ) {
        if(this.selectResult.payWriteOffStatusList.indexOf("") != -1){
            let index = this.selectResult.payWriteOffStatusList.indexOf("")
            this.selectResult.payWriteOffStatusList.splice(index,1)
          } 
        }
        this.searchClick(true)
      },
      //数据统计
      getStatistData(){
        let copyData = JSON.parse(JSON.stringify(this.selectResult))
        if(copyData.rcvWriteOffStatusList[0] ==""){
          delete copyData.rcvWriteOffStatusList
        }
        if(copyData.payWriteOffStatusList[0] ==""){
          delete copyData.payWriteOffStatusList
        }
         copyData.woStatus = this.typeCode == "可操作" ? 0 :this.typeCode == "业务修改中" ? 1 :this.typeCode == "异常" ?  2 :""
        // if(copyData.rcvWriteOffStatusList[0] === "") {
        //   delete copyData.rcvWriteOffStatusList
        //   }
        // if(copyData.payWriteOffStatusList[0] === "") {
        //   delete copyData.payWriteOffStatusList
        //   }
          delete copyData.pageNum
          delete copyData.pageSize
        //   copyData.orderIds = this.selectTableData.map(item=>item.id)
        this.statistDataShow = !this.statistDataShow
        if(this.statistDataShow == false) return""
        let requestData = {}
        if(this.pageSkipChecked == true) {
          requestData.overPageCheck = true
          requestData.financePageDTO = copyData
        } else {
          requestData.overPageCheck = false
          requestData.orderIds = []
          this.selectTableData.forEach((item,index)=>{
            requestData.orderIds[index] = item.id
          })
          if(requestData.orderIds.length==0) {
            requestData.orderIds = null
          }
          requestData.financePageDTO = copyData
        }
        this.$http.post(this.$service.subWoList,requestData).then(data=>{
          if(data.code == 200) {
          this.statistData = data.data
          this.statistData.totalArCny = this.statistData.totalArCny.toLocaleString('en-US')
          this.statistData.totalRcWoCny = this.statistData.totalRcWoCny.toLocaleString('en-US')
          this.statistData.totalRcUnwoCny = this.statistData.totalRcUnwoCny.toLocaleString('en-US')
          this.statistData.totalApCny = this.statistData.totalApCny.toLocaleString('en-US')
          this.statistData.totalApWoCny = this.statistData.totalApWoCny.toLocaleString('en-US')
          this.statistData.totalApUnwoCny = this.statistData.totalApUnwoCny.toLocaleString('en-US')
          this.errorStatist = data.data.hasAbNormal
          }
        })
      },
      //订单号弹框
      showData(id,no){
        this.dialogFormVisible = true
        this.$http.get(this.$service.searchWoDetail+"?orderId="+id).then(data=>{
          this.tableDataOne = data.data.arOrderPriceList
          this.tableDataTwo = data.data.apOrderPriceList
          this.tableDataThree = data.data.orderPresentLogs
          this.payWay = data.data.payWay
          this.totalArOrgn = data.data.totalArOrgn.toLocaleString('en-US');
          this.totalApOrgn = data.data.totalApOrgn.toLocaleString('en-US');
          this.totalArCny = data.data.totalArCny.toLocaleString('en-US');
          this.totalApCny = data.data.totalApCny.toLocaleString('en-US');
          this.orderProfit = data.data.orderProfit.toLocaleString('en-US');
          this.dialogTitle = no
        })
      },
      //表格选择列显示drawer -全选
    handleCheckAllChange(val) {
      this.checkedTable = val ? this.tableOptions : [];
      this.isIndeterminate = false;
    },
      //tab切换
      tabClickData() {
        this.pageNum =1
          this.statistDataShow = false
        this.pageSkipChecked = false
      	this.initData()
      },

      //起始港三字码
      initAirportSearchByPage(keyWord, type) {
        if (!keyWord) {
          keyWord = ''
        }
        this.$http.get(this.$service.airportSearchByPage + '?keyWord=' + keyWord).then((data) => {
          this.loading = false
          if (data.code == 200) {
            if (type == '起始港') {
              this.polOpt = data.data.records
            } else if (type == '目的港') {
              this.podOpt = data.data.records
            } else {
              this.polOpt = data.data.records
              this.podOpt = data.data.records
            }
          } else {
            this.$message.error(data.message)
          }
        })
      },
      polMethod(keyWord) {
        this.loading = true
        this.initAirportSearchByPage(keyWord, '起始港')
      },
      podMethod(keyWord) {
        this.loading = true
        this.initAirportSearchByPage(keyWord, '目的港')
      },
      //代理公司
      initAgentList(agentName) {
        if (!agentName) {
          agentName = ''
        }
        var data = {
          agentName: agentName,
          sceneFlag: 0,
        }
        this.$http.post(this.$service.agentList, data).then((data) => {
          this.loading = false
          if (data.code == 200) {
            this.agentOpt = data.data.records
          }
        })
      },
      agentMethod(agentName) {
        this.initAgentList(agentName)
      },
       //航司
      initCompanySearchByPage(keyWord) {
        if (!keyWord) {
          keyWord = ''
        }
        this.$http.get(this.$service.companySearchByPage + '?keyWord=' + keyWord).then((data) => {
          this.loading = false
          if (data.code == 200) {
            this.airCompanyCodeOpt = data.data.records
          } else {
            this.$message.error(data.message)
          }
        })
      },
      companyMethod(keyWord) {
        this.initCompanySearchByPage(keyWord)
      },
      //售前售中客服、航线负责人数据
      operateData (){
        this.$http.get(this.$service.userSearchNoAuth+'?roleName=售前客服&pageSize=50000').then(data=>{
          this.payBefore = data.data.records
        })
        this.$http.get(this.$service.userSearchNoAuth+'?roleName=售中客服&pageSize=50000').then(data=>{
          this.paying = data.data.records
        })
        this.$http.get(this.$service.userSearchNoAuth+'?roleName=航线负责人&pageSize=50000').then(data=>{
          this.airManger = data.data.records
        })
      },
       //跨页全选禁用
      ifDisabled(row) {
        if(this.pageSkipChecked == true) {
          return false
        } else {
          return true
        }
      },
      //跨页全选按钮
    selectAllTable(){
        for(let i=0;i<this.$refs.multipleTable.length;i++){
          this.$refs.multipleTable[i].clearSelection();
          for(let j=0;j<this.tableData.length;j++){
            if(this.pageSkipChecked == true ) {
							this.$refs.multipleTable[i].toggleRowSelection(this.tableData[j]);
						} else {
              this.$refs.multipleTable[i].clearSelection();;
            }
          }
        }
      },
      //查询条件处理
      selectResultData (){
        let copyData = JSON.parse(JSON.stringify(this.selectResult))
        if(copyData.rcvWriteOffStatusList[0] === "") {
          delete copyData.rcvWriteOffStatusList
          }
        if(copyData.payWriteOffStatusList[0] === "") {
          delete copyData.payWriteOffStatusList
          }
          copyData.pageSize =this.pageSize
          copyData.pageNum =this.pageNum
          copyData.woStatus = this.typeCode == "可操作" ? 0 :this.typeCode == "业务修改中" ? 1 :this.typeCode == "异常" ?  2 :""
          return copyData
      },
      //导出列表
      exportList (command){
        if(this.selectTableData.length == 0) {
          this.$message({type:"warning",message:"请选择数据"})
          return false
      }
        let requestData = {
          typeCode: {
            'detail': 0,
            'total': 1,
          }[command]
        }
        if(this.pageSkipChecked == true) {
          requestData.overPageCheck = true
          requestData.financePageDTO = this.selectResultData()
        } else {
          requestData.orderIds = []
          this.selectTableData.forEach((item,index)=>{
            requestData.orderIds[index] = item.id
          })
        }
        this.$http.post(this.$service.exportWoExcel,requestData, {
            responseType: 'arraybuffer'
          }).then(res=>{
            const aLink = document.createElement("a");
            let blob = new Blob([res], {
              type: "application/vnd.ms-excel"
            })
            aLink.href = URL.createObjectURL(blob)
            const downloadName = `财务核销列表${
              {
                'detail': '明细',
                'total': '总计',
              }[command]
            }`
            aLink.setAttribute('download', downloadName + '.xlsx') // 设置下载文件名称
            aLink.click()
            document.body.appendChild(aLink)
        })
      },
      //查询数据
      initData() {
          let copyData = this.selectResultData()
          this.errorStatist = false
        this.$http.post(this.$service.searchWoByPage,copyData).then(data => {
          if (data.code == 200) {
            
          this.statistDataShow = false
            this.tableData = data.data.page.records.map(item => {
              const { pscsName, mscsName, principalName, customerResponsibleName } = item
              return {
                ...item,
                operator: [pscsName, mscsName, principalName, customerResponsibleName].map(i => i || '暂无').join(','),
              }
            })
            this.tabNum = [data.data.countAuth?data.data.countAuth:0,data.data.countNoAuth?data.data.countNoAuth:0,data.data.countErr?data.data.countErr:0]
            this.total = data.data.page.total
            setTimeout(()=>{
              this.selectAllTable()
            },0)
          }else {
            this.$message.error(data.message)
          }
        }).catch((e) => {
          console.log(e)
        })
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
      //查询
      searchClick() {
        this.pageNum = 1
        this.pageSkipChecked = false
        this.initData()
      },
      //重置
      restClick() {

        this.selectResult={
          financialSeriesNo:'',
          orderNo:"",
          waybillNo:"",
          companyId:"",
          agentId:"",
          airCompanyCode:"",
          startPresentationTime:"",
          endPresentationTime:"",
          startDepartureDate:"",
          endDepartureDate:"",
          pscsId:"",
          rcvWriteOffStatusList:[""],
          payWriteOffStatusList:[""],
          pol:"",
          pod:"",
          mscsId:"",
          principalId:"",
          woStatus:0
        },
        this.pageNum = 1
        this.pageSize = 10
        this.initData()
        this.pageSkipChecked = false
        this.selectAllTable()
      },
      handleCurrentChange(e) {
        this.pageNum = e
        this.initData()
      },
      handleSizeChange(e) {
        this.pageNum = 1
        this.pageSize = e
        this.initData()
      },
    },

    components: {
      Table
    },
  }
</script>


<style scoped lang="less">
  @import url("../../assets/icon/iconfont.css");
  // /deep/.el-table tbody tr:hover>td {
    // background-color:blue!important
// }

/deep/.el-tabs--top .el-tabs__item.is-top:last-child{
  color:red;
  
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
/deep/.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active:last-child{
  color:red!important;

}
/deep/.el-tabs--border-card>.el-tabs__header .el-tabs__item:last-child:hover{
  color: red !important;
}
 .el-button--primary{
      width:100px;
      // text-align: center;
  }
  /deep/ .el-tag.el-tag--info{
  max-width: 100px;
}
 /deep/.el-input--medium{
     .el-input__inner {
        text-overflow: ellipsis!important;
      }
     }
/deep/.pageSkip {
        padding:3px 5px!important
  }
  /deep/ .el-table {
          .cell {
            text-align: center;
          }
          th {
    height:35px
  }
      }
   .content-search-normal {
    .formItem{
      display:inline-block;
      width: 320px;
      // margin-top:-5px;
    }
  }
  .allStatist {
    
    .statists {
      flex:0 0 170px;
      margin-right:15px;
    }
  }
   
  .content-wrapper {
    height: 95%;
      width:100%;
    box-sizing: border-box;
    /*height: 100%;*/
    padding: 20px;
    overflow: hidden;
    background-color: #f3f6f9 !important;
  }
.operateButton {
    display:flex;
    justify-content: center;
    margin-bottom:-10px;
    .upLoad {
      /deep/.el-button--medium {
        padding:6px 20px
      }
    }
    button {
      margin:0px 10px 20px 10px;
    }
  }
  .el-form {
    background-color: #FFF;
  }

  .el-form--inline .el-form-item {
    margin-bottom: 20px;
    vertical-align: bottom;
  }

  .parimary_btn {
    background-color: #9ac143 !important;
    border-color: #9ac143 !important;

    &:hover {
      color: #f1e3d5 !important;
      background-color: #7f9e3c !important;
      border-color: #7f9e3c !important;
    }
  }

  .icon-shouqi {
    color: #3985ca;
    margin-right: 2px;
    font-size: 14px;
    margin-left: 15px;
  }

  .shouqi {
    cursor: pointer;
    color: #3985ca;
    position: relative;
  }

  .shouqi .iconfont {
    font-size: 2px;
    position: absolute;
    height: 20px;
    line-height: 20px;
    margin-top: 7px;
    margin-left: 10px;
  }

  .wrapper,.content {
    width: 100%;
  }

  .el-table .sort-caret.ascending {
    border-bottom-color: #FFF;
  }

  .content-search-normal {
    padding: 20px 20px 0 20px !important;
    background: #fff;
  }

  .content-search-high {
    padding: 0 0 20px 30px;
  }

  /deep/ .el-dialog {
    min-width: 480px;
    border-radius: 6px;
  }
  .el-form--inline .el-form-item {
  margin-bottom: 10px;
  margin-right: 10px;
  vertical-align: bottom;
}
//  /deep/.el-table__body-wrapper .el-table__body tr:hover>td{
//   background-color: #CCC !important;
// }
//   /deep/.el-table__body-wrapper .el-table__body tbody .hover-row td{
//   background-color: #CCC !important;
// }
</style>
