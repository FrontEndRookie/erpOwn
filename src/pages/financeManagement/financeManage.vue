<template>
  <div class="content-wrapper">
    <div class="content" style="position: relative">
      <el-form
        :inline="true"
        size="medium"
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
          <el-form-item label="订单号:" class="formItem">
            <el-input
              v-model="selectResult.orderNo"
              style="width: 175px"
              size="medium"
              @blur="selectResult.orderNo = $event.target.value"
              maxlength="15"
              onkeyup="this.value = this.value.replace(/[^\da-zA-Z]/g,'');"
              clearable
              placeholder="请输入订单号"
            ></el-input>
          </el-form-item>

          <el-form-item label="运单号:" class="formItem orderNOs">
            <el-input
              v-model="selectResult.waybillNo"
              style="width: 150px"
              size="medium"
              onkeyup="this.value = this.value.replace(/[^\d]/g,'');"
              @blur="selectResult.waybillNo = $event.target.value.substr(0,11)"
              clearable
              placeholder="请输入运单号"
            ></el-input>
          </el-form-item>
            <el-form-item label="财务系列号:" class="formItem" >
            <el-input
              v-model="selectResult.financialSeriesNo"
              style="width: 180px"
              size="medium"
              maxlength="12"
              @change="setLimit($event)"
              clearable
              placeholder="请输入财务系列号"
            ></el-input>
          </el-form-item>
          <el-form-item label="订舱客户:" class="formItem">
           
             <el-select
              v-model="selectResult.companyId"
              placeholder="请输入订舱客户"
              clearable
              remote
              filterable
              reserve-keyword
              style="width: 220px"
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

          <el-form-item label="代理上家:" class="formItem">
            <el-select
              v-model="selectResult.agentId"
              placeholder="请输入代理上家"
              :remote-method="agentMethod"
              :loading="loading"
              clearable
              filterable
              remote
              maxlength="3"
              reserve-keyword
              @change="getCurrentData"
              id="agentId"
              style="width: 240px"
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

          <el-form-item label="开票进度:" class="formItem">
            <el-select
              v-model="selectResult.invoicingStatus"
              placeholder="请选择开票进度"
              style="width: 155px"
              multiple
              collapse-tags
              @change="dealAllChange"
            >
              <el-option
                v-for="(item,index) in billProgress"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
            <!-- <el-form-item label="是否发起客户对账:" class="formItem">
            <el-select
              v-model="selectResult.checkFlag"
              style="width: 155px"
            >
              <el-option
                v-for="(item,index) in reconciliation"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item> -->
           <el-form-item label="起运港:" class="formItem" v-show="selectControl">
            <el-select
              v-model="selectResult.pol"
              id="pol"
              placeholder="起运港三字码"
              :remote-method="polMethod"
              :loading="loading"
              clearable
              filterable
              maxlength="15"
              @change="getCurrentData"
              remote
              reserve-keyword
              style="width: 155px"
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

          <el-form-item label="目的港:" class="formItem" v-show="selectControl" style="margin-right:35px">
            <el-select
              v-model="selectResult.pod"
              id="pod"
              placeholder="目的港三字码"
              :remote-method="podMethod"
              maxlength="15"
              :loading="loading"
              @change="getCurrentData"
              clearable
              filterable
              remote
              reserve-keyword
              style="width: 155px"
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

          <el-form-item label="航司:" class="formItem" v-show="selectControl" style="margin-right:35px">
            <el-select
              id="airCompany"
              v-model="selectResult.airCompanyCode"
              placeholder="请输入航司"
              :remote-method="companyMethod"
              @change="getCurrentData"
              :loading="loading"
              clearable
              filterable
              remote
              maxlength="15"
              reserve-keyword
              style="width: 215px"
            >
              <el-option
                v-for="(item,index) in airCompanyCodeOpt"
                :key="index"
                :label="item.name"
                :value="item.airCompanyCode"
              >
              <span>{{ item.airCompanyCode }}</span>
                <span style="margin-left: 5px">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="售前客服:" class="formItem" v-show="selectControl">
            <el-select
              id="pscsId"
              @change="getCurrentData"
              v-model="selectResult.pscsId"
              placeholder="请输入售前客服"
              :loading="loading"
              clearable
              filterable
              remote
              reserve-keyword
              maxlength="10"
              style="width: 215px"
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
          <el-form-item label="售中客服:" class="formItem" v-show="selectControl">
            <el-select
              id="mscsId"
              @change="getCurrentData"
              v-model="selectResult.mscsId"
              placeholder="请输入售中客服"
              :loading="loading"
              clearable
              filterable
              remote
              reserve-keyword
              maxlength="10"
              style="width: 215px"
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
              placeholder="请输入航线"
              :loading="loading"
              clearable
              filterable
              remote
              @change="getCurrentData"
              reserve-keyword
              style="width: 215px"
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
            label="航班日期:"
            style="width: 480px;margin-bottom:5px"
             v-show="selectControl"
          >
            <el-date-picker
              style="width: 190px"
              value-format="yyyy-MM-dd"
              v-model="selectResult.startDepartureDate"
              type="date"
              @change="getCurrentData"
              :picker-options="pickerOptionsStartOne"
              placeholder="选择日期"
            >
            </el-date-picker
            >-
            <el-date-picker
              style="width: 180px"
              value-format="yyyy-MM-dd"
              v-model="selectResult.endDepartureDate"
              type="date"
              @change="getCurrentData"
              :picker-options="pickerOptionsEndOne"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="交单时间:" style="width: 480px;margin-bottom:5px" v-show="selectControl">
            <el-date-picker
              value-format="yyyy-MM-dd"
              style="width: 180px"
              v-model="selectResult.startPresentationTime"
              type="date"
              @change="getCurrentData"
              :picker-options="pickerOptionsStartTwo"
              placeholder="选择日期"
            >
            </el-date-picker
            >-
            <el-date-picker
              value-format="yyyy-MM-dd"
              style="width: 180px"
              @change="getCurrentData"
              v-model="selectResult.endPresentationTime"
              type="date"
              :picker-options="pickerOptionsEndTwo"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="是否作废:" class="formItem" >
            <el-select
              v-model="selectResult.fettle"
              @change="getCurrentData"
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
        <el-form-item>
          <dc-select
            v-model="selectResult.customerResponsibleId"
            placeholder="客户负责人"
            filterable
            clearable
            @change="getCurrentData"
          >
            <el-option
              v-for="item in customerResponsibles"
              :key="item.value"
              :label="item.longLabel"
              :value="item.value"
            />
          </dc-select>
        </el-form-item>
          <div class="operateButton" >
            <el-button
              @click="searchClick('search')"
              size="mini"
              type="primary"
              icon="el-icon-search"
              v-auth="['101000_B']"
              >查询</el-button
            >
            <el-button @click="restClick" size="mini" type="primary"
              >清空</el-button
            >
          </div>
         
        </div>
      </el-form>
      <el-tabs
        class="nth9_class"
        v-model="typeCode"
        type="border-card"
        @tab-click="tabClickData"
        value="全部"
      >
        <el-tab-pane
          v-for="(item, index) in tabName"
          :key="index"
          :label="item + '(' + tabNum[index] + ')'"
          :name="item"
        >
          <el-table
            :data="tableData"
            border
            stripe
            max-height="540px"
            header
            :cell-style="tableRowClassName"
            ref="multipleTable"
            class="finance-table"
            @selection-change="handleSelectionChange"
            style="width: 100%;"
          >
            <template slot="empty">
              <img class="data-pic" src="../../assets/kong-icon.png" />
              <p>暂无数据</p>
            </template>
            <el-table-column type="selection" width="50" :selectable="ifDisabled" fixed="left"></el-table-column>
            <el-table-column label="财务系列号" prop="financialSeriesNo" width="160" v-if="checkedTable.indexOf('财务系列号') !== -1">
              <template slot-scope="scope">
              <div style="color:skyblue;cursor:pointer" @click="showFees(scope.row,true)">
                  {{scope.row.financialSeriesNo}}
              </div>
            </template>
            </el-table-column>
         
            <el-table-column
              label="订单号"
              min-width="160"
              align="center"
              v-if="checkedTable.indexOf('订单号') !== -1"
            >
            <template slot-scope="scope">
              <div style="color:skyblue;cursor:pointer" @click="showFees(scope.row,true)">
                  {{scope.row.orderNo}}
              </div>
            </template>
            </el-table-column>
            <el-table-column
              prop="waybillNo"
              label="运单号"
              min-width="160"
              align="center"
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
              align="center"
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
              label="应付金额"
              align="center"
              v-if="checkedTable.indexOf('应付金额') !== -1"
            >
              <el-table-column prop="totalApCny" label="人民币" width="120">
              </el-table-column>
              <el-table-column label="原币" width="120">
                  <template slot-scope="scope">
                  <div v-html="dealOrgn(scope.row.totalApOrgn)" style="white-space:pre-wrap"></div>
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
              prop="exchangeRate"
              label="汇率"
              min-width="80"
              v-if="checkedTable.indexOf('汇率') !== -1"
            >
            <template slot-scope="scope">
              <div v-html="getExchangeRate(scope.row.exchangeRate)" style="white-space:pre-wrap">
              </div>
            </template>
            </el-table-column>
            <el-table-column
              prop="invoicingStatus"
              label="开票进度"
              min-width="80"
              v-if="checkedTable.indexOf('开票进度') !== -1"
            >
              <template slot-scope="scope">
                <div>
                    {{scope.row.invoicingStatus == 0 ?
                    '未开票' : scope.row.invoicingStatus == 1 ?
                    '部分开票' : scope.row.invoicingStatus == 2 ? '已开票' : ''
                    }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="invoicedAmount"
              label="开票金额"
              min-width="80"
              v-if="checkedTable.indexOf('开票金额') !== -1"
            ></el-table-column>
            <el-table-column
              prop="financeStatus"
              label="订单状态"
              min-width="80"
              v-if="checkedTable.indexOf('订单状态') !== -1"
            >
            <template slot-scope="scope">
                <div :key="scope.row.id" v-auth:disabled="{ 2: ['101001_B'], 3: ['101002_B'] }[scope.row.financeStatus]"  :style="{'color':scope.row.financeStatus ==2 || scope.row.financeStatus ==3 ? 'skyblue' : 'black','cursor':scope.row.financeStatus ==2 || scope.row.financeStatus ==3 ?'pointer':'' }" @click="scope.row.financeStatus ==2 || scope.row.financeStatus ==3?showFees(scope.row,false):''">
                  {{scope.row.financeStatus == 0 || scope.row.financeStatus == 1 ?
                    '正常' : scope.row.financeStatus == 2 ?
                      '修改申请' : scope.row.financeStatus == 3 ?
                        '修改审核' : scope.row.financeStatus == 4 ?
                          '修改中' : scope.row.financeStatus == 5 ?
                            '异常' : ''}}
                </div>
              </template>
            </el-table-column>
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
              min-width="190"
              type=""
              v-if="checkedTable.indexOf('货物信息') !== -1"
            >
              <template slot-scope="scope">
               <span>
                 <div>{{ scope.row.cargoInfo.split(",")[0] }}</div>
                  <div>{{ scope.row.cargoInfo.split(",")[1] }}PCS/{{ scope.row.cargoInfo.split(",")[3] }}KGS/{{ scope.row.cargoInfo.split(",")[2] }}CBM</div>
                  <div>1:{{ scope.row.cargoInfo.split(",")[4] }}</div>
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
                <div>售前：{{ scope.row.operator.split(",")[0] }}</div>
                <div>售中：{{ scope.row.operator.split(",")[1] }}</div>
                <div>航线：{{ scope.row.operator.split(",")[2] }}</div>
                <div>客户负责人：{{ scope.row.operator.split(",")[3] }}</div>
              </span>
            </template>
            </el-table-column>
       
            
          </el-table>
          <div style="display: flex; justify-content: space-between">
            <div>
              <el-button size="mini" class="pageSkip"><el-checkbox v-model="pageSkipChecked" @change="selectAllTable">跨页全选</el-checkbox></el-button>
              <el-button type="primary" size="mini" @click="showStatistData"
                >数据统计</el-button
              >
              <div style="margin-top: 15px" v-if="statistDataShow">
                <span>应收总金额:{{ statistData.totalArCny?statistData.totalArCny.toLocaleString('en-US'):0 }}</span>
                <span style="margin-left: 15px"
                  >应付总金额: {{  statistData.totalApCny?statistData.totalApCny.toLocaleString('en-US'):0 }}</span
                >
                <span style="margin-left: 15px"
                  >利润:{{ statistData.orderProfit?statistData.orderProfit.toLocaleString('en-US'):0 }}</span
                >
                <span style="fontSize:17px;color:red;margin-left:10px" v-if="statistData.abnormalFlag != 0">存在异常订单！</span>
              </div>
            </div>
            <div style="display:flex;">
               <div style="widht:100%;margin:5px 10px 0 0">
              <el-button size="mini" type="primary" @click="showFees(false,false,false,true)" v-show="typeCode == '已交单'"  style="height:28px;margin-top:19px" v-auth="['101003_B']">修改</el-button>
              <el-button size="mini" type="primary" @click="showFees(false,false,false,true)" v-show="typeCode == '修改申请'"  style="height:28px;margin-top:19px" v-auth="['101001_B']">解锁</el-button>
              <el-button size="mini" type="primary" @click="showFees(false,false,false,true)" v-show="typeCode == '修改审核'" style="height:28px;margin-top:19px" v-auth="['101002_B']">审核</el-button>
              <el-dropdown @command="getExportExcel">
                <el-button size="mini" type="primary" style="height:28px;margin-top:19px">
                  导出列表<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="detail">导出明细</el-dropdown-item>
                  <el-dropdown-item command="total">导出总计</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button @click="drawer = true" type="primary" size="mini" style="height:28px;margin-top:19px">选择表格列</el-button>
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
    <el-dialog :visible.sync="dialogFormVisible" :title="dialogTitle" width="80%">
        <div
          style="
            font-size: 18px;
            font-weight: 100;
            color: #333;
            padding: 0 20px 10px 20px;
          "
        >
          应收账单
        </div>
        <Table
          :tableData="arData"
          :columns="columns1"
          :showSelection="false"
          :operation="operation"
          :cellStyle="dialTableClassName"
          @orderDetails="orderDetails"
        >
        </Table>
        <div class="finance-table-price">
          <div>账单合计：{{ getOrgn(this.totalArOrgn) }}</div>
          <div>人民币合计：￥{{ this.totalArCny }}</div>
          <div>结算方式：{{ this.payWay == 0 ? "付款买单" : "月结买单" }}</div>
        </div>
        <div
          style="
            font-size: 18px;
            font-weight: 100;
            color: #333;
            padding: 10px 20px 10px 20px;
          "
        >
          应付账单
        </div>
        <Table
          :tableData="apData"
          :columns="columns2"
          :cellStyle="dialTableClassName"
          :showSelection="false"
          :operation="operation"
          @orderDetails="orderDetails"
        >
        </Table>
        <div class="finance-table-price">
          <div>账单合计：{{ getOrgn(this.totalApOrgn) }}</div>
          <div>人民币合计：￥{{ this.totalApCny }}</div>
          <div>订单利润：{{ this.orderProfit }}</div>
        </div>
        <div
          v-if="orderFinanceStatus!= 0"
          style="
            font-size: 18px;
            font-weight: 100;
            color: #333;
            padding: 10px 20px 10px 20px;
          "
        >
          修改记录
        </div>
        <Table
          v-if="orderFinanceStatus!= 0"
          :tableData="logData"
          :showSelection="false"
          :columns="columns3"
          :operation="operation"
          @orderDetails="orderDetails"
        >
        </Table>

        <div v-if="onlyShow == false">
          <div
            style="
              font-size: 18px;
              font-weight: 100;
              color: #333;
              padding: 10px 20px 10px 20px;
              border-bottom: 1px dashed #999;
            "
          >
            <span style="color:red;font-size:25px">*</span>操作说明
          </div>
          <el-input
            type="textarea"
            rows="2"
            placeholder="请输入操作说明"
            v-model="info"
            maxlength="200"
            show-word-limit
          >
          </el-input>
          <div
            slot="footer"
            class="dialog-footer"
            v-show="orderFinanceStatus == 1"
          >
            <el-button @click="dialogFormVisible =false">取消</el-button>
            <el-button type="primary" @click="savePresentLog(2)"
              >确认解锁</el-button
            >
          </div>
          <div
            slot="footer"
            class="dialog-footer"
            v-show="orderFinanceStatus == 2"
          >
            <el-button @click="savePresentLog(3)">驳回</el-button>
            <el-button type="primary" @click="savePresentLog(2)"
              >确认解锁</el-button
            >
          </div>
          <div
            slot="footer"
            class="dialog-footer"
            v-show="orderFinanceStatus == 3"
          >
            <el-button @click="savePresentLog(5)">驳回</el-button>
            <el-button type="primary" @click="savePresentLog(4)"
              >审核通过</el-button
            >
          </div>
            <div style="text-align:center;margin-top:15px" v-if="showFeesPage">
              <el-pagination
                  @current-change="handleDialChange"
                  layout="total, prev, pager, next"
                  :page-size="1"
                  :current-page.sync="dialPage"
                  :total="copySelectData.length">
                </el-pagination>
            </div>
        </div>

    </el-dialog>
  </div>
</template>

<script>
import Table from "@/components/financeTable";
import { toData } from "@/util/assist";

export default {
  data() {
    return {
      fettleList:[{id:'',name:"全部"},{id:0,name:"正常"},{id:1,name:'作废'}],
      ifClose:false,
      copySelectData:[],
      selectControl:false,
      //判断是否是表格行点击
      onlyShow:true,
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
        "应付金额",
        "利润",
        "汇率",
        "开票进度",
        "开票金额",
        "订单状态",],
      tableOptions: [
        "财务系列号",
        "订单号",
        "运单号",
        "订舱客户",
        "代理上家",
        "航班日期",
        "交单时间",
        "应收金额",
        "应付金额",
        "利润",
        "汇率",
        "开票进度",
        "开票金额",
        "订单状态",
        "航司",
        "起运港",
        "目的港",
        "货物信息",
        "操作人员",
      ],
      //开票进度
      billProgress:[
          {label:"全部",value:""},
          {label:"未开",value:"0"},
          {label:"部分开",value:"1"},
          {label:"已开",value:"2"},
        ],
      //订单状态
      getFinanceStatus:["未提单","正常","修改申请","修改中","异常"],
      //表格tab
      tabName: ["全部", "未交单", "已交单", "修改申请","修改中","修改审核","异常"],
      typeCode: "全部",
      tabNum: [0, 0, 0, 0,0,0,0],
      detailTabs: [],
      //弹框数据
      dialogTitle:"",
      dialPage:1,
      dialogFormVisible: false,
      showFeesPage: false,
      //table
      selectTableData:[],
      tableData: [],
      arData: [],
      apData: [],
      logData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      // 列

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
      // 操作
      operation: {
        show: false,
        label: "操作",
        width: "180",
        options: [{ label: "编辑", method: "routeEdit" }],
      },
      //航班日期选择器
      // 限制结束日期大于开始日期
      pickerOptionsStartOne: {
        disabledDate: (time) => {
          let endDateVal = this.selectResult.endDepartureDate;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime() ;
          }
        },
      },
      pickerOptionsEndOne: {
        disabledDate: (time) => {
          let beginDateVal = this.selectResult.startDepartureDate;
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime() -8.64e7;
          }
        },
      },
      // 交易时间
      pickerOptionsStartTwo: {
        disabledDate: (time) => {
          let endDateVal = this.selectResult.endPresentationTime;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        },
      },
      pickerOptionsEndTwo: {
        disabledDate: (time) => {
          let beginDateVal = this.selectResult.startPresentationTime;
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime()-8.64e7;
          }
        },
      },
      customerResponsibles:[],
      //搜索框结果
      selectResult:{
        customerResponsibleId:"",
        orderNo:"",
        waybillNo:"",
        companyId:"",
        agentId:"",
        airCompanyCode:"",
        pol:"",
        pod:"",
        invoicingStatus:[""],
        mscsId:"",
        pscsId:"",
        startDepartureDate:"",
        endDepartureDate:"",
        startPresentationTime:"",
        endPresentationTime:"",
        principalId:"",
        fettle:'',
        orgId: '',
        // checkFlag:1
    },
      //数据统计是否显示
      statistDataShow:false,
      statistData:{},
      //跨页全选状态
      pageSkipChecked:false,
      totalApOrgn: null,
      totalArCny: null,
      totalApCny: null,
      totalArOrgn: null,
      orderProfit: null,
      financeStatus: "",
      payWay: null,
      orderId: null,
      info: null,
      orderFinanceStatus: null,
      invoiceOpt: [
        {
          Name: "未开票",
          Value: "0",
        },
        {
          Name: "已开票",
          Value: "1",
        },
        {
          Name: "部分开票",
          Value: "2",
        },
      ],
       reconciliation: [
        {
          label: "未发起",
          value: "0",
        },
        {
          label: "已发起",
          value: 1,
        },
        {
          label: "全部",
          value: "",
        },
      ],
      //搜索条件后台数据
      polOpt:[],
      podOpt:[],
      agentOpt:[],
      airCompanyCodeOpt:[],
      payBefore:[],
      paying:[],
      airManger:[],
      copySelectJSON:[],
      customerNameArray:'',
      sysOrgs: [],
      currencyArray: this.$store.getters.getCurrencyFinance,
    };
  },
  created(){
     if(this.$route.params.orderId){
       let {orderId,orderNo,tab} = this.$route.params
       this.orderId = orderId
        this.messageListSkip(orderId,orderNo,tab)
      }
  },
  activated() {
    //  if(this.$route.params.orderId){
    //    let {orderId,orderNo,tab} = this.$route.params
    //    this.orderId = orderId
    //       this.messageListSkip(orderId,orderNo,tab)
    //   }
  },
  mounted() {
    //console.log(this.currencyArray,"---");
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
    getCurrentData(){
      this.searchClick()
    },
    getOperateList() {
      return this.$http.get(
        this.$service.billOpearteList + `?orderId=${this.orderId}`
      );
     
    },
    //消息列表跳转
    async messageListSkip(orderId,orderNo,type){
      this.dialogTitle = orderNo
      this.selectResult.orderNo = orderNo
      this.onlyShow = false
      if(type == 1){
        this.typeCode = "修改申请"
      } else if(type == 2) {
        this.typeCode = "修改审核"
      }
       await this.initData()
       if(this.tableData && this.tableData.length>0) {
        this.$http
        .get(this.$service.orderPriceTable + "?orderId=" + orderId)
        .then((data) => {
          if (data.code == 200) {
            // this.total = data.data.total
            this.arData = data.data.arOrderPriceList;
            this.apData = data.data.apOrderPriceList;
            this.logData = data.data.logs;
            this.totalArOrgn = data.data.totalArOrgn.toLocaleString('en-US');
            this.totalApOrgn = data.data.totalApOrgn.toLocaleString('en-US');
            this.totalArCny = data.data.totalArCny.toLocaleString('en-US');
            this.totalApCny = data.data.totalApCny.toLocaleString('en-US');
            this.orderProfit = data.data.orderProfit.toLocaleString('en-US');
            this.payWay = this.tableData[0].payWay;
            // this.orderId = this.tableData[0].orderId;
            this.orderFinanceStatus = this.tableData[0].financeStatus;
            this.dialogFormVisible = true;
          } else {
            this.$message.error(data.message);
          }})
       } else {
         let res =await this.getOperateList()
         let people = res.data.filter(items=>items.operationType ==2)[0].operator
         this.$message.warning(`${people}已处理该申请，勿重复操作`)
       }
    },
    shiftSelectControl(){
      this.selectControl = !this.selectControl
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
    dialTableClassName({row,rowIndex,column,columnIndex}){
      if(this.orderFinanceStatus ==3 && row.modifyColumn) {
        if(row.modifyColumn ==-1){
          return `text-decoration:line-through;text-decoration-color:red;`
        }
        else if(row.modifyColumn == 0) {
          return 'background-color: #169bd5';
        }
        else if (row.modifyColumn.split(",").indexOf(String(columnIndex))>-1){
          return 'background-color: #169bd5';
        }
      }
    },
     tableRowClassName({row, rowIndex}) {
      if(row.orderProfit >= 0 && (row.abnormalFlag== 1 || row.abnormalFlag== 4 || row.abnormalFlag== 5 || row.abnormalFlag== 7) ) {
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
    getExportExcel (command) {
       if(this.selectTableData.length == 0) {
          this.$message({type:"warning",message:"请选择数据进行导出"})
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
          let copyDate = JSON.parse(JSON.stringify(this.selectResult))
            if (copyDate.invoicingStatus[0]=="") {
              delete copyDate.invoicingStatus
            } else {
              copyDate.invoicingStatus = copyDate.invoicingStatus.join()
            }
            let arrayIndex = ["未交单","已交单","修改申请","修改审核","修改中","异常"]
            if(arrayIndex.indexOf(this.typeCode) != -1) {
              copyDate.financeStatus = arrayIndex.indexOf(this.typeCode)
            }
            requestData.financePageDTO = copyDate
          } else {
          requestData.orderIds = []
          this.selectTableData.forEach((item,index)=>{
            requestData.orderIds[index] = item.id
          })
        }
        this.$http.post(this.$service.exportFoExcel,requestData, {
            responseType: 'arraybuffer'
          }).then(res=>{
            const aLink = document.createElement("a");
            let blob = new Blob([res], {
              type: "application/vnd.ms-excel"
            })
            aLink.href = URL.createObjectURL(blob)
            const downloadName = `财务订单列表${
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
    showStatistData(){
      let copyDate = JSON.parse(JSON.stringify(this.selectResult))
            if (copyDate.invoicingStatus[0]=="") {
              delete copyDate.invoicingStatus
            } else {
              copyDate.invoicingStatus = copyDate.invoicingStatus.join()
            }
            let arrayIndex = ["未交单","已交单","修改申请","修改审核","修改中","异常"]
            if(arrayIndex.indexOf(this.typeCode) != -1) {
              copyDate.financeStatus = arrayIndex.indexOf(this.typeCode)
            }
            if(!this.pageSkipChecked){
            copyDate.ids = this.selectTableData.map(item=>item.id)

            }
            this.statistDataShow = !this.statistDataShow
            if(this.statistDataShow == false) return""
            this.$http.post(this.$service.financeOrderCount,copyDate).then(data=>{
              this.statistData = data.data
            })
    },
    //获取表格选中数据
    handleSelectionChange (e) {
      this.selectTableData = e
      // console.log(this.selectTableData)
    },
    //控制多选框
    dealAllChange (){
      if(this.selectResult.invoicingStatus.indexOf("0") != -1 && this.selectResult.invoicingStatus.indexOf("1") != -1 && this.selectResult.invoicingStatus.indexOf("2") != -1) {
        this.selectResult.invoicingStatus = [""]
      }
      else if (this.selectResult.invoicingStatus.indexOf("")>0) {
        this.selectResult.invoicingStatus = [""]
      }
      else if(this.selectResult.invoicingStatus.indexOf("0") != -1 || this.selectResult.invoicingStatus.indexOf("1") != -1 || this.selectResult.invoicingStatus.indexOf("2") != -1 ) {
          if(this.selectResult.invoicingStatus.indexOf("") != -1){
            let index = this.selectResult.invoicingStatus.indexOf("")
            this.selectResult.invoicingStatus.splice(index,1)
          }
        }
        this.searchClick()
      },
    //表格选择列显示drawer -全选
    handleCheckAllChange(val) {
      this.checkedTable = val ? this.tableOptions : [];
      this.isIndeterminate = false;
    },
    //tab切换
    tabClickData() {
      this.pageSkipChecked = false
      this.statistDataShow = false
      this.pageNum = 1
      this.initData()
    },
    //起始港三字码
    initAirportSearchByPage(keyWord, type) {
      if (!keyWord) {
        keyWord = "";
      }
      this.$http
        .get(this.$service.airportSearchByPage + "?keyWord=" + keyWord)
        .then((data) => {
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
        sceneFlag: 0,
      };
      this.$http.post(this.$service.agentList, data).then((data) => {
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
    savePresentLog(operationType) {
      if(!this.info) {
        this.$message({
          type: "warning",
          message:"操作说明必填"
        })
        return false
      }
      var json = {
        orderId: this.orderId,
        info: this.info,
        operationType: operationType,
        financeStatus: this.orderFinanceStatus,
      };
      // json = toData(json)
      this.$http
        .post(this.$service.savePresentLog, json, {
          headers: {
            // key 为 operationType ， value 为权限 diffFlag
            diffFlag: {
              2: 3,
              3: 3,
              4: 4,
              5: 4,
            }[operationType],
          },
        })
        .then((data) => {
          if (data.code == 200) {
            this.$message.success("操作成功");
            this.initData()
            if(this.ifClose){
              this.orderFinanceStatus = ''
              this.copySelectData.forEach(item=>{
                if(item.id ==this.orderId) {
                  item.financeStatus = ''
                  item.info = this.info
                }
              })
              // console.log(this.copySelectData)
            }
          } else {
            this.$message.error(data.message);
          }
        })
        .catch((e) => {
          console.log(e);
        });
        if(!this.ifClose){
         this.dialogFormVisible =false
        }
    },
    showFees(linedata,onlyShow,pageSkip,tableClick) {
      if(!pageSkip){
        this.ifClose = false
      }
      this.info = ''
      this.dialogTitle = linedata.orderNo
      let orderId = linedata.id
      let payWay = linedata.payWay
      let financeStatus = linedata.financeStatus
      this.info = linedata.info
      if (this.pageSkipChecked == true) {
        this.$message({
          type:"warning",
          message:"修改不支持跨页全选哦"
        })
        return
      }
      this.showFeesPage = false
      if(linedata == false){
        if(this.selectTableData.length == 0 || this.selectTableData.length > 20) {
           this.$message({
            message: '请选择1到20条信息',
            type: 'warning'
          });
          return false
        } else {
          this.dialPage = 1
          this.showFeesPage = true
          this.copySelectData = JSON.parse(JSON.stringify(this.selectTableData))
          orderId = this.selectTableData[0].id
          financeStatus = this.selectTableData[0].financeStatus
          payWay = this.selectTableData[0].payWay
          this.dialogTitle = this.selectTableData[0].orderNo
          if(tableClick && this.selectTableData.length>1){
            this.ifClose = true
          }
        }
      }
      if(pageSkip) {
        this.showFeesPage = true
      }
      // console.log(orderId,financeStatus,payWay,linedata)
      //判断是否是表格运单号列点击进入弹框
      onlyShow ==true ? this.onlyShow = true : this.onlyShow = false
      // console.log(this.onlyShow)
      this.dialogFormVisible = true;
      this.$http
        .get(this.$service.orderPriceTable + "?orderId=" + orderId)
        .then((data) => {
          if (data.code == 200) {
            // this.total = data.data.total
            this.arData = data.data.arOrderPriceList;
            this.apData = data.data.apOrderPriceList;
            this.logData = data.data.logs;
            this.orderFinanceStatus = financeStatus;
            this.totalArOrgn =data.data.totalArOrgn && data.data.totalArOrgn.toLocaleString('en-US');
            this.totalApOrgn =data.data.totalApOrgn && data.data.totalApOrgn.toLocaleString('en-US');
            this.totalArCny =data.data.totalArCny && data.data.totalArCny.toLocaleString('en-US');
            this.totalApCny = data.data.totalApCny && data.data.totalApCny.toLocaleString('en-US');
            this.orderProfit =data.data.orderProfit && data.data.orderProfit.toLocaleString('en-US');
            this.payWay = payWay;
            this.orderId = orderId;
            this.dialogFormVisible = true;
          } else {
            this.$message.error(data.message);
          }
        })
        .catch((e) => {
        });

    },
    dealOrgn(orgn) {
      // console.log(orgn);
      if (!orgn) {
        return;
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
      }
      return totalOrgn;
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
          totalOrgn = totalOrgn + obj[0]["symbol"] + Number(orgn[i].amount).toLocaleString('en-US')
          if(i < (orgn.length - 1)){
            totalOrgn = totalOrgn + '+'
          }
        }
      }
      return totalOrgn;
    },
    //跨页全选按钮
    selectAllTable(){
        for(let i=0;i<this.$refs.multipleTable.length;i++){
              this.$refs.multipleTable[i].clearSelection();

          // this.pageSkipChecked ?  this.$refs.multipleTable[i].toggleAllSelection() : this.$refs.multipleTable[i].clearSelection()
          for(let j=0;j<this.tableData.length;j++){
            if(this.pageSkipChecked == true ) {
							this.$refs.multipleTable[i].toggleRowSelection(this.tableData[j]);
						} else {
              this.$refs.multipleTable[i].clearSelection();
            }

          }
        }
      },
       //跨页全选禁用
      ifDisabled(row) {
        if(this.pageSkipChecked == true) {
          return false
        } else {
          return true
        }
      },
    //查询
    initData() {
      let copyDate = JSON.parse(JSON.stringify(this.selectResult))
      if (copyDate.invoicingStatus[0]=="") {
        delete copyDate.invoicingStatus
      } else {
        copyDate.invoicingStatus = copyDate.invoicingStatus.join()
      }
      let arrayIndex = ["未交单","已交单","修改申请","修改审核","修改中","异常"]
      if(arrayIndex.indexOf(this.typeCode) != -1) {
        copyDate.financeStatus = arrayIndex.indexOf(this.typeCode)
        this.copySelectJSON.financeStatus = arrayIndex.indexOf(this.typeCode)
      }
      copyDate.pageNum = this.pageNum
      copyDate.pageSize = this.pageSize
   
      return this.$http
        .post(this.$service.financeOrderList, copyDate )
        .then((data) => {
          if (data.code == 200) {
            // if(ifPageSkip){
            //   this.copySelectJSON = copyDate
            // }
            this.statistDataShow = false
            // this.total = data.data.total;
            this.tabNum = [data.data.totalCount,data.data.notCommitCount,data.data.commitCount,data.data.applyCount,data.data.changeCount,data.data.checkCount,data.data.errorCount]
            if(data.data.pageInfo == null) {
              this.tableData = []
              this.total = 0
            } else {
            this.tableData = data.data.pageInfo.records;
            this.total = data.data.pageInfo.total
            setTimeout(()=>{
              this.selectAllTable()
            },0)
            }
          } else {
            this.$message.error(data.message);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    //查询
    searchClick() {
      this.pageSkipChecked = false
      this.pageNum = 1
      this.initData();
    },
    //重置
    restClick() {
      this.pageSkipChecked = false
        this.selectAllTable()
      this.selectResult={
        orderNo:"",
        waybillNo:"",
        companyId:"",
        agentId:"",
        airCompanyCode:"",
        pol:"",
        pod:"",
        invoicingStatus:[""],
        mscsId:"",
        pscsId:"",
        startDepartureDate:"",
        endDepartureDate:"",
        startPresentationTime:"",
        endPresentationTime:"",
        principalId:"",
        // checkFlag:1
    },
      this.pageNum = 1;
      this.pageSize = 10;
      this.initData()
    },
    handleDialChange (e) {
      // console.log(e,this.selectTableData)
      this.showFees(this.copySelectData[e-1],false,true,true)
    },
     handleCurrentChange(e) {
      this.pageNum = e;
      this.initData();
    },
    handleSizeChange(e) {
      this.pageSize = e;
       this.initData();
    },
    getExchangeRate(exchangeRate) {
      var orgn = exchangeRate
      var totalOrgn = "";
      if(orgn && (orgn.length > 0)){
        for (var i = 0; i < orgn.length; i++) {
          var obj = this.currencyArray.filter((item)=>{return (item.id == orgn[i].currency)})
          totalOrgn = totalOrgn + obj[0]["code"] + ":" + Number(orgn[i].exchangeRate)
          if(i < (orgn.length - 1)){
            totalOrgn = totalOrgn + '\n'
          }
        }
      }
      return totalOrgn;
    },
  },
  watch: {
    tableData(idx) {
      return idx;
    },
    '$route.params.orderId'(){
      if(this.$route.params.page == 3){
         let {orderId,orderNo,tab} = this.$route.params
         this.orderId = orderId
          this.messageListSkip(orderId,orderNo,tab)
      }
    },
    '$route.query.time'(){
      if(this.$route.params.page == 3){
         let {orderId,orderNo,tab} = this.$route.params
         this.orderId = orderId
          this.messageListSkip(orderId,orderNo,tab)
      }
    }
  },
  components: {
    Table,
  },
};
</script>


<style scoped lang="less">
@import url("../../assets/icon/iconfont.css");
/deep/.el-tabs--top .el-tabs__item.is-top:last-child{
  color:red;
  
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
/deep/ .el-table {
  th {
    height:35px
  }
}
/deep/.pageSkip {
        padding:3px 5px!important
  }
  /deep/.el-input--medium{
     .el-input__inner {
        text-overflow: ellipsis!important;
      }
     }
     .orderNOs{
      /deep/.el-input__inner {
        text-overflow: clip!important;
      }
     }
.operateButton {
  display: flex;
  justify-content: center;
  // margin-top:-5px;
  // margin-bottom: -10px;
  button {
    margin: 0px 10px 10px 10px;
  }
}
/deep/ .el-table {
          .cell {
            text-align: center;
          }
      }
.dialog-footer {
  text-align:center;
  margin-top:20px;
}
.content-wrapper {
  width: 100%;
  height:95%;
  box-sizing: border-box;
  /*height: 100%;*/
  padding: 20px;
  overflow: hidden;
  background-color: #f3f6f9 !important;
}

.el-form {
  background-color: #fff;
}

.el-form--inline .el-form-item {
  margin-bottom: 10px;
  margin-right: 0px;
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

.wrapper,
.content {
  width: 100%;
}

.el-table .sort-caret.ascending {
  border-bottom-color: #fff;
}

.content-search-normal {
  padding: 20px 20px 0 20px !important;
  background: #fff;
  .formItem {
    // width: 320px;
    margin: 0px 25px 5px 0;
  }
}

.content-search-high {
  padding: 0 0 20px 30px;
}

/deep/ .el-dialog {
  min-width: 480px;
  border-radius: 6px;
  padding-bottom: 20px;
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
//  /deep/.el-table__body-wrapper .el-table__body tr:hover>td{
//   background-color: #CCC !important;
// }
//   /deep/.el-table__body-wrapper .el-table__body tbody .hover-row td{
//   background-color: #CCC !important;
// }
</style>
