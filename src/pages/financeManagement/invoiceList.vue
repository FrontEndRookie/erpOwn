<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :inline="true" size="medium" :model="selectResult" class="demo-form-inline" label-position="left">
        <div class="content-search-normal" style="position:relative">
             <div style="position:absolute;right:10px;top:10px">
              <div style="cursor:pointer;display:inline-block;" @click="shiftSelectControl">
            <img v-if="selectControl"  src="../../assets/doubleArrowUp.png" alt="" style="width:30px;height:30px;margin:0 0 18px 0;transform:translateY(7px)">
            <img v-if="!selectControl" src="../../assets/doubleArrowDown.png" alt="" style="width:30px;height:30px;margin:0 0 18px 0;transform:translateY(7px)">
          </div>
          </div>
          <div class="formItem">
          <el-form-item label="订单号:" >
            <el-input v-model="selectResult.orderNo" style="width:180px"  size="medium" maxlength="15" clearable placeholder="请输入订单号" onkeyup="this.value = this.value.replace(/[^\da-zA-Z]/g,'');" @blur="selectResult.orderNo = $event.target.value"></el-input>
          </el-form-item>
        </div>

        <div class="formItem">
          <el-form-item label="运单号:" >
            <el-input v-model="selectResult.waybillNo" style="width:180px"  size="medium" clearable placeholder="请输入运单号" onkeyup="this.value = this.value.replace(/[^\da-zA-Z]/g,'');" @blur="selectResult.waybillNo = $event.target.value.substr(0,11)"></el-input>
          </el-form-item>
        </div>
         <div class="formItem" >
         <el-form-item label="财务系列号:">
            <el-input
              v-model="selectResult.financialSeriesNo"
              style="width: 190px"
              @change="setLimit($event)"
              size="medium"
              maxlength="12"
              clearable
              placeholder="请输入财务系列号"
            ></el-input>
          </el-form-item>
        </div>
      <div class="formItem">
          <el-form-item label="发票抬头:" >
            <el-input v-model="selectResult.invoiceTitle" style="width: 225px;" size="medium" maxlength="30" clearable placeholder="请输入发票抬头"></el-input>
          </el-form-item>
        </div>
          <div class="formItem">
          <el-form-item label="开票进度:" >
            <el-select v-model="selectResult.invoicingStatus" multiple  collapse-tags style="width: 165px;" @change="dealAllChange">
              <el-option
                v-for="(item,index) in billProgress"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="formItem">
          <el-form-item label="发票状态:" >
            <el-select v-model="selectResult.invoiceStatus" style="width: 160px;" @change="getCurrentChange">
              <el-option
                v-for="(item,index) in billState"
                :key="index"
                :value="item.value"
                :label="item.label"
                >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="formItem" v-show="selectControl">
          <el-form-item label="结算对象:" >
              <el-select
              v-model="selectResult.companyId"
              placeholder="请输入结算对象"
              clearable
              remote
              filterable
              reserve-keyword
              style="width: 190px"
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
        </div>
         <div class="formItem" v-show="selectControl">
          <el-form-item label="发票号:" >
            <el-input v-model="selectResult.invoiceNum" style="width: 145px;" size="medium" maxlength="8" clearable placeholder="请输入发票号" onkeyup="this.value = this.value.replace(/[^\d]/g,'');" @blur="selectResult.invoiceNum = $event.target.value"></el-input>
          </el-form-item>
        </div>
           <div class="formItem" v-show="selectControl">
          <el-form-item label="发票类型:" >
            <el-select v-model="selectResult.invoiceType" multiple  collapse-tags style="width: 220px;" @change="dealAllChange">
              <el-option
                v-for="(item,index) in billType"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="formItem" v-show="selectControl">
          <el-form-item label="快递状态:" >
            <el-select v-model="selectResult.expressStatus" style="width: 150px;"  @change="getCurrentChange">
              <el-option
                v-for="(item,index) in expressState"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="formItem" v-show="selectControl">
          <el-form-item label="是否上传:" >
            <el-select  v-model="selectResult.upload" style="width: 110px;"  @change="getCurrentChange">
              <el-option
                v-for="(item,index) in ifUpload"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        
       <div  class="formItem" v-show="selectControl">
          <el-form-item label="航班日期" >
             <el-date-picker
             style="width:140px"
              v-model="selectResult.startDepartureDate"
              type="date" 
              @change="getCurrentChange"
              :picker-options="pickerOptionsStartOne"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker >-
             <el-date-picker
             style="width:140px"
              v-model="selectResult.endDepartureDate"
              type="date"
               @change="getCurrentChange"
              :picker-options="pickerOptionsEndOne"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <div  class="formItem" v-show="selectControl">
          <el-form-item label="交单时间:" >
            <el-date-picker
             style="width:140px"
              v-model="selectResult.startPresentationTime"
              type="date"
               @change="getCurrentChange"
              :picker-options="pickerOptionsStartTwo"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker >-
             <el-date-picker
             style="width:140px"
              v-model="selectResult.endPresentationTime"
              type="date"
               @change="getCurrentChange"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptionsEndTwo"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <div  class="formItem" v-show="selectControl">
          <el-form-item label="申请时间:" >
            <el-date-picker
             style="width:150px"
              v-model="selectResult.startInvoiceApplyTime"
              :picker-options="pickerOptionsStartThree"
               @change="getCurrentChange"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker >-
             <el-date-picker
             style="width:150px"
              v-model="selectResult.endInvoiceApplyTime"
              :picker-options="pickerOptionsEndThree"
               @change="getCurrentChange"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <div  class="formItem"  v-show="selectControl">
          <el-form-item label="开票日期:" >
            <el-date-picker
             style="width:140px"
              v-model="selectResult.startInvoicingTime"
              :picker-options="pickerOptionsStartFour"
               @change="getCurrentChange"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker >-
             <el-date-picker
             style="width:140px"
              v-model="selectResult.endInvoicingTime"
              :picker-options="pickerOptionsEndFour"
               @change="getCurrentChange"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
           
        </div>
        <el-form-item label="是否作废:" class="formItem" >
            <el-select
              v-model="selectResult.fettle"
              style="width: 120px"
              clearable
              @change="searchClick(true)"
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
        <div class="operateButton" style="justify-content:center">
              <el-button @click="searchClick(true)" size="mini" type="primary" icon="el-icon-search" style="margin-right:0" v-auth="['102000_B']">查询</el-button>
              <el-button @click="restClick" size="mini" type="primary">清空</el-button>
        </div>
           
        </div>
      </el-form>
      <el-tabs class="nth9_class" v-model="typeCode" type="border-card" @tab-click="tabClickData" value="全部">
        <el-tab-pane v-for="(item,index) in tabName" :key="index" :label="item+'('+tabNum[index]+')'" :name="item">
      <foldTable :tableData="tableData"  :pageSkipAll="pageSkipChecked" :checkedTable="checkedTable" @changeCheckBox="handleSelectionChange" @showOrderWayBill="showOrderWayBill" @showInvoice="showInvoice" @openPost="openPost"></foldTable>
             <div style="display:flex;justify-content:space-between">
               <div>
                 <el-button size="mini" class="pageSkip"><el-checkbox  v-model="pageSkipChecked" @change="selectAllTable" style="color:white;">跨页全选</el-checkbox></el-button>
                 <el-button  size="mini" type="primary" @click="getStatistData">数据统计</el-button>
               
               </div>
                <div style="display:flex">
                    <div class="operateButton" style="margin:20px 10px 0 0">
                      <el-button size='mini' type="primary" @click="invoicing()" style="height:28px" v-auth="['102002_B']">开票</el-button>
                      <el-button size='mini' type="primary" @click="delInvoice()" style="height:28px" v-auth="['102003_B']">作废</el-button>
                      <el-button size='mini' type="primary" @click="deleteInvo()" style="height:28px" v-auth="['102006_B']">删除</el-button>

                      <el-button size='mini' type="primary" @click="delivery()" style="height:28px" v-auth="['102004_B']">邮寄</el-button>
                      <el-upload
                        :disabled="uploadDisable()"
                        style="width:100px;height:28px;margin-right:10px;"
                        action="#"
                        accept=".zip"
                        class="upLoad"
                        :on-change="handleChange"
                        :multiple = "true"
                        :auto-upload="false">
                        <el-button type="primary" size="medium" @click="uploadResolve" v-auth="['102005_B']">上传发票</el-button>
                      </el-upload>
                      <el-button size='mini' type="primary" @click="exportList" style="height:28px">导出列表</el-button>
                      <el-button size='mini' type="primary" @click="drawer = true" style="height:28px">选择表格列</el-button>
                      
                      <!-- <el-button @click="drawer = true" type="primary" size='mini'>选择表格列</el-button> -->
                    </div>
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[10,30,50]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    style="text-align: right;padding: 19px 30px 18px 0;background: #fff"
                    >
                  </el-pagination>
                </div>
               
             </div>
               <div style="padding-bottom:15px" v-if="statistDataShow">
                   <span>应收总金额:{{statistData.shouldGet.toLocaleString('en-US')}}</span>
                   <span style="margin-left:15px">申请开票金额: {{statistData.applyInvoice.toLocaleString('en-US')}}</span>
                   <span style="margin-left:15px">已开票金额:{{statistData.invoicedMoney.toLocaleString('en-US')}}</span>
                   <span style="color:red" v-if="isExitAbnormalFlag">存在异常订单!</span>
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
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style="margin:0 0 20px 20px">全选</el-checkbox>
        <el-checkbox-group
          v-model="checkedTable"
          :min="0"
          :max="21">
              <el-checkbox v-for="choose in tableOptions" :label="choose" @change="tableKey = tableKey == 1? 2:1" :key="choose" style="display:block;margin-left:20px">{{choose}}</el-checkbox>
        </el-checkbox-group>
      </el-drawer>
      <!-- 订单号&运单号弹框 -->
      <el-dialog
          width="80%"
          title="订单运单号信息"
          :visible.sync="orderWayBillFrame"
        >
        <el-table :data="orderTableData">
            <el-table-column prop="orderNo" label="订单号" min-width="110"></el-table-column>
            <el-table-column prop="waybillNo" label="运单号" min-width="110"></el-table-column>
            <el-table-column prop="customerName" label="订舱客户" min-width="80"></el-table-column>
            <el-table-column prop="agentName" label="代理上家" min-width="80"></el-table-column>
            <el-table-column prop="airCompanyCode" label="航司" min-width="80"></el-table-column>
            <el-table-column prop="pol" label="起运港" min-width="50"></el-table-column>
            <el-table-column prop="pod" label="目的港" min-width="50"></el-table-column>
            <el-table-column prop="date20" label="货物信息" min-width="80">
              <template slot-scope="scope">
               <span>
                 <div>{{ scope.row.cargoInfo.split(",")[0] }}</div>
                  <div>{{ scope.row.cargoInfo.split(",")[1] }}PCS</div>
                  <div>{{ scope.row.cargoInfo.split(",")[2] }}CBM</div>
                  <div>{{ scope.row.cargoInfo.split(",")[3] }}KGS</div>
                  <div>1:{{ scope.row.cargoInfo.split(",")[4] }}</div>
               </span>
              </template>
            </el-table-column>
            <el-table-column label="操作人员" min-width="80">
               <template slot-scope="scope">
              <span>
                <div>售中：{{ scope.row.operator.split(",")[1] }}</div>
                <div>售前：{{ scope.row.operator.split(",")[0] }}</div>
                <div>航线：{{ scope.row.operator.split(",")[2] }}</div>
                <div>客户负责人：{{ scope.row.operator.split(",")[3] }}</div>
              </span>
            </template>
            </el-table-column>
            <el-table-column prop="departureDate" label="航班日期" min-width="80"></el-table-column>
            <el-table-column prop="presentationTime" label="交单时间" min-width="80"></el-table-column>
            <el-table-column label="应收金额" min-width="160">
              <el-table-column prop="totalArCny" label="人民币" min-width="80"></el-table-column>
              <el-table-column  label="原币" min-width="80">
                <template slot-scope="scope">
                  <div v-html="dealOrgn(scope.row.totalArOrgn)" style="white-space:pre-wrap"></div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column  label="应付金额" min-width="160">
              <el-table-column prop="totalApCny" label="人民币" min-width="80"></el-table-column>
              <el-table-column prop="date20" label="原币" min-width="80">
                <template slot-scope="scope">
                  <div v-html="dealOrgn(scope.row.totalApOrgn)" style="white-space:pre-wrap"></div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column  label="申请开票金额" min-width="160">
               <template slot-scope="scope">
                  <div v-html="dealOrgn(scope.row.invoiceApplyOrgn)" style="white-space:pre-wrap"></div>
                </template>
            </el-table-column>
            <el-table-column  label="应收结算方式" min-width="80">
              <template slot-scope="scope">
                <div>
                  {{scope.row.payWay == 0?"付款买单" :scope.row.payWay == 1?"月结买单":''}}
                </div>
              </template>
            </el-table-column>
        </el-table>
      </el-dialog>
      <!-- 发票信息查看 -->
       <el-dialog
          width="85%"
          title="发票信息"
          :visible.sync="invoiceDialog"
        >
        <el-table :data="invoiceTableData">
            <el-table-column prop="invoiceTitle" label="发票抬头" min-width="120"></el-table-column>
            <el-table-column prop="dutyParagraph" label="税号" min-width="80"></el-table-column>
            <el-table-column label="公司地址及电话" min-width="140">
              <template slot-scope="scope">
                <div>
                  {{scope.row.companyAddress}}
                  {{scope.row.companyTel}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="开户行及账号" min-width="140">
              <template slot-scope="scope">
                <div>
                  {{scope.row.accountBank}}
                  {{scope.row.bankAccount}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="recipient" label="收件人" min-width="80"></el-table-column>
            <el-table-column label="收件人地址及电话" min-width="140">
              <template slot-scope="scope">
                <div>
                  {{scope.row.recipientAddress}}
                  {{scope.row.recipientTel}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="货物或应税劳务、服务名称" min-width="200">
              <template slot-scope="scope">
                <div>
                  {{scope.row.taxableServiceText}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="开票备注" min-width="140">
              <template slot-scope="scope">
                <div>
                  {{scope.row.invoiceRemark}}
                </div>
              </template>
            </el-table-column>
        </el-table>
      </el-dialog>
    </div>

    <!-- 快递弹框 -->
    <el-dialog title="快递信息" :visible.sync="postMessageDial" width="500px">
      <el-form>
      <div style="margin-top:20px">
          <el-form-item label="快递公司" label-width="100px" required>
            <el-select v-model="postMessage.postOne" placeholder="请选择" style="width:300px">
              <el-option
                v-for="item in postChoice"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="100px" label="邮寄日期" required>
            <el-date-picker
              v-model="postMessage.postTwo"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              style="width:300px">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="快递单号" label-width="100px">
            <el-input size="medium"  v-model="postMessage.postThree" placeholder="请输入快递单号" maxlength="10" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"  @blur="postMessage.postThree = $event.target.value" style="width:300px">
            </el-input>
          </el-form-item>
        </div>
      </el-form>
        <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <div style="text-align: center;padding-top:20px;">
          <el-button size="medium" type="primary"
            @click="confirmPost">确认邮寄</el-button>
          <el-button size="medium" @click="postMessageDial = false">取 消
          </el-button>
        </div>
      </div>

    </el-dialog>
    <!-- 作废按钮弹框 -->
    <el-dialog title="提示" :visible.sync="delRequestDial" width="500px">
      <div style="text-align:center;font-size:15px;color:#606266;margin-top:45px;margin-bottom:15px">
         <div style="color:#2273ce"> 发票号码:{{rubbishInvoice}}</div>
        <div>确认作废该发票吗？</div>
      </div>
          <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <div style="text-align: center;padding-top:20px;">
          <el-button size="medium" type="primary"
            @click="comfirmDele">确定</el-button>
          <el-button size="medium" @click="delRequestDial = false">取 消
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 开票弹框 -->
      <el-dialog title="开票" :visible.sync="invoicingDial" width="1200px" class="getInvoice">
      <div class="invoicingDial">
        <div style="width:50%;border:1px solid silver;padding:10px 6px;margin-right:10px">
          <el-form style="display:flex;flex-wrap:wrap;" label-position="left">
           <el-form-item label="单张发票金额:" label-width="115px" required style="width:260px">
            <el-input size="medium" class="newDialNum" v-model="invoicingLeft.invoiceAmount" clearable placeholder="请输入发票金额" maxlength="13" onkeyup="this.value= this.value.match(/^-?\d{0,10}(\.\d{0,2})?/)? this.value.match(/^-?\d{0,10}(\.\d{0,2})?/)[0] : ''" @blur="invoicingLeft.invoiceAmount = $event.target.value" style="width:170px">
            </el-input>
          </el-form-item>
          <el-form-item label="开票首张号码:" label-width="115px" required style="width:300px">
            <el-input size="medium"  v-model.trim="invoicingLeft.invoiceNum" clearable placeholder="请输入开票首张号码" maxlength="8" style="width:170px;" class="newDialNum">
            </el-input>
          </el-form-item>
          <el-form-item label="开票张数:" label-width="115px" required style="width:260px">
            <el-input size="medium" class="newDialNum"  v-model.number.trim="invoicingLeft.invoiceCount" clearable placeholder="请输入开票张数" maxlength="2"  style="width:170px" oninput ="value=value.replace(/[^0-9]/g,'')">
            </el-input>
          </el-form-item>
          <el-form-item label-width="115px" label="开票日期:" required style="width:300px">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="invoicingLeft.invoicingTime"
              type="date"
              placeholder="请选择开票日期"
              style="width:170px">
            </el-date-picker>
          </el-form-item>
          
          <el-form-item label="开票抬头:" required label-width="115px">
            <div style="width:340px" v-if="ifNewInvoHead">{{openInvoExtraMessage.invoiceTitle}}</div>
            <el-input  v-model="invoicingLeft.invoiceTitle" v-else size="medium" maxlength="30" placeholder="请输入开票抬头" style="width:340px"></el-input>
          </el-form-item>
          <el-form-item label="纳税人识别号:" required label-width="115px">
            <div style="width:340px" v-if="ifNewInvoHead">{{openInvoExtraMessage.dutyParagraph}}</div>
            <el-input v-model="invoicingLeft.dutyParagraph" v-else size="medium" maxlength="30" placeholder="请输入纳税人识别号" oninput ="value=value.replace(/[^0-9a-zA-Z]/g,'')" style="width:340px"></el-input>
          </el-form-item>
          <el-form-item label="公司地址:" required label-width="115px">
            <div style="width:340px" v-if="ifNewInvoHead">{{openInvoExtraMessage.companyAddress}}</div>
            <el-input v-model="invoicingLeft.companyAddress"  v-else size="medium" maxlength="40" placeholder="请输入公司地址" style="width:340px"></el-input>
          </el-form-item>
          <el-form-item label="公司电话:" required label-width="115px">
            <div style="width:340px" v-if="ifNewInvoHead">{{openInvoExtraMessage.companyTel}}</div>
            <el-input v-model="invoicingLeft.companyTel" v-else size="medium" maxlength="20" placeholder="请输入公司电话" style="width:340px"></el-input>
          </el-form-item>
          <el-form-item label="开户行:" required label-width="115px">
            <div style="width:340px" v-if="ifNewInvoHead">{{openInvoExtraMessage.accountBank}}</div>
            <el-input v-model="invoicingLeft.accountBank" v-else size="medium" maxlength="30" placeholder="请输入开户行" style="width:340px"></el-input>
          </el-form-item>
           <el-form-item label="银行账号:" required label-width="115px">
            <div style="width:340px" v-if="ifNewInvoHead">{{openInvoExtraMessage.bankAccount}}</div>
            <el-input v-model="invoicingLeft.bankAccount" v-else size="medium" maxlength="30" placeholder="请输入银行账号" style="width:340px"></el-input>
          </el-form-item>
          <el-form-item label="发票类型:" required label-width="115px">
            <div style="width:340px" v-if="ifNewInvoHead">{{openInvoExtraMessage.invoiceType == 0?"普票":openInvoExtraMessage.invoiceType == 1?"专票":openInvoExtraMessage.invoiceType == 2?"电子普票":""}}</div>
            <el-select v-model="invoicingLeft.invoiceType" style="width: 210px;" v-else>
              <el-option
                v-for="(item,index) in boxBillType"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          </el-form>
          <div style="text-align:center">
            <!-- <span style="cursor:pointer;color:skyblue" @click="shiftNewInvoHead">{{ifNewInvoHead ?'新增抬头开票':'使用开票申请的抬头开票'}}</span> -->
            <el-button type="primary" size="mini" style="margin-left:20px;cursor:pointer" @click="invoiceLeftConfirm">确认生成</el-button>
          </div>
        </div>
        <div style="width:50%;">
          <el-table
              :data="invoicingRight"
              height="90%"
              >
              <el-table-column label="序号" type="index"></el-table-column>
              <el-table-column label="发票金额" prop="invoiceAmount"></el-table-column>
              <el-table-column label="发票号码" prop="invoiceNum"></el-table-column>
              <el-table-column label="发票抬头" prop="invoiceTitle"></el-table-column>
              <el-table-column label="发票种类" prop="invoiceType">
                <template slot-scope="scope">
                  <div>
                      {{scope.row.invoiceType == 0?"普票":scope.row.invoiceType == 1?"专票":scope.row.invoiceType == 2?"电子普票":""}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="30">
                <template slot-scope="scope">
                  <span style="fontSize:15px;color:skyblue" @click="deleteInvoiceRight(scope)">X</span>
                </template>
              </el-table-column>

          </el-table>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;width:70%;margin:15px auto 0">
        <div>申请开票总金额：{{invoiceFootOne}}</div>
        <div>未开票金额：{{invoiceFootTwo}}</div>
        <div>生成的发票金额：{{invoiceFootThree}}</div>
      </div>
          <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <div style="text-align: center;padding-top:20px;">
          <el-button size="medium" type="primary"
            @click="confirmInvoice">确认开票</el-button>
          <el-button  size="medium" @click="invoicingDial = false">取 消
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import DcStatus from "@/status";
  import { toData } from '@/util/assist'
  import foldTable from './components/foldTable.vue'
// import Axios from '../../../static/axios.min.js'
  export default {
    components:{
      foldTable
    },
    data() {
      return {
        currencyArray: this.$store.getters.getCurrencyFinance,
        sysOrgs: [],
        //复制表格查询数据-分页跳转使用
        copySelectJSON:[],
        
        isExitAbnormalFlag:false,
        selectControl:false,
        tableKey :1,
        ifDisable:true,
        //表格控制列drawer
        drawer: false,
        checkAll: false,
        isIndeterminate: true,
        direction: 'rtl',
        checkedTable:['财务系列号','订单号', '运单号', '结算对象','航班日期','交单时间','发票抬头','备注','开票信息','申请开票金额','发票种类','申请时间','开票进度','已开票金额','发票号码','开票日期','快递信息','邮寄状态','发票状态','是否上传', '申请人'],
        tableOptions:['财务系列号','订单号', '运单号', '结算对象','发票抬头','开票信息','发票种类','申请开票金额','已开票金额','备注','开票进度','发票号码','发票状态','是否上传','开票日期','航班日期','交单时间','申请时间','快递信息','邮寄状态', '申请人'],
        //是否作废选项
        fettleList:[{id:'',name:"全部"},{id:0,name:"正常"},{id:1,name:'作废'}],
        
        //表格tab页
        tabName:["全部","月结开票","单独开票","异常"],
        tabNum:[0,0,0,0],

        //页面查询条件
        //是否上传
        ifUpload:[
          {
            label:"全部",
            value:""
          },{
            label:"是",
            value:"1"
          },{
            label:"否",
            value:"0"
          },
        ],
        getUpLoad:['否','是'],
        //发票类型
        billType:[
          {label:"全部",value:""},
          {label:"增值税普通发票",value:"0"},
          {label:"增值税专用发票",value:"1"},
          {label:"增值税电子普通发票",value:"2"},
      ],
      boxBillType:[
          {label:"增值税普通发票",value:"0"},
          {label:"增值税专用发票",value:"1"},
          {label:"增值税电子普通发票",value:"2"},
      ],
      getBillType:["增值税普通发票","增值税专用发票","增值税电子普通发票"],
      //开票进度
        billProgress:[
          {label:"全部",value:""},
          {label:"未开",value:"0"},
          {label:"部分开",value:"1"},
          {label:"已开",value:"2"},
        ],
        getBillProgress:["未开","部分开","已开"],
        //发票状态
        billState:[
          {label:"全部",value:""},
          {label:"正常",value:"0"},
          {label:"部分作废",value:"2"},
          {label:"作废",value:"1"},
        ],
        getBillState:["正常","作废","部分作废"],
        //快递状态
        expressState:[
          {label:"全部",value:""},
          {label:"已寄出",value:"1"},
          {label:"未寄出",value:"0"}
        ],
        getExpressState:["未寄出","已寄出"],
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
        // 交易时间
         pickerOptionsStartTwo: {
          disabledDate: time => {
            let endDateVal = this.selectResult.endPresentationTime
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime()
            }
          }
        },
        pickerOptionsEndTwo: {
          disabledDate: time => {
            let beginDateVal = this.selectResult.startPresentationTime
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal).getTime()-8.64e7
            }
          }
        },
        //申请时间
         pickerOptionsStartThree: {
          disabledDate: time => {
            let endDateVal = this.selectResult.endInvoiceApplyTime
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime()
            }
          }
        },
        pickerOptionsEndThree: {
          disabledDate: time => {
            let beginDateVal = this.selectResult.startInvoiceApplyTime
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal).getTime()-8.64e7
            }
          }
        },
        //开票时间
         pickerOptionsStartFour: {
          disabledDate: time => {
            let endDateVal = this.selectResult.endInvoicingTime
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime()
            }
          }
        },
        pickerOptionsEndFour: {
          disabledDate: time => {
            let beginDateVal = this.selectResult.startInvoicingTime
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal).getTime()-8.64e7
            }
          }
        },
        customerResponsibles:[],
        //搜索框结果
        selectResult:{
          customerResponsibleId:'',
          orderNo:"",
          waybillNo:"",
          companyId:"",
          invoiceTitle:"",
          upload:"",
          invoiceNum:"",
          invoiceType:[""],
          invoicingStatus:['0','1'],
          invoiceStatus:"",
          expressStatus:"",
          startDepartureDate:"",
          endDepartureDate:"",
          startPresentationTime:"",
          endPresentationTime:"",
          startInvoiceApplyTime:"",
          endInvoiceApplyTime:"",
          startInvoicingTime:"",
          endInvoicingTime:"",
          financialSeriesNo:"",
          fettle:'',
          orgId: '',
        },

        //table数据
        tableData: [],
        //拷贝表格数据用于调接口
        copyTable:[],
        //table 订单号列&运单号列弹框
        orderWayBillFrame:false,
        //订单运单号弹框数据
        orderTableData:[],
        //table选中数据
        selectTableData:[],

        //点击/按钮弹框
        //开票信息弹框是否显示
        invoiceDialog:false,
        //开票信息查看表格数据
        invoiceTableData:[],
        invoiceFootOne:'',
        invoiceFootTwo:'',
        invoiceFootThree:'',

        //快递按钮弹框数据
        postMessage:{postOne:"",postTwo:"",postThree:""},
        //快递按钮弹框-快递公司下拉框数据
        postChoice:[{
          value: '中通',
          label: '中通快递'
        }, {
          value: '顺丰',
          label: '顺丰快递'
        }, {
          value: '申通',
          label: '申通快递'
        }, {
          value: '圆通',
          label: '圆通快递'
        }],
        //快递按钮弹出框是否显示
        postMessageDial:false,
        //表格行内点击未寄出弹出弹框数据
        tableRowPostData:'',
        //作废按钮弹出框是否显示
        delRequestDial:false,
        //作废按钮发票信息
        rubbishInvoice:"",
        //开票按钮弹框是否显示
        invoicingDial:false,
        //开票左侧表单数据
        invoicingLeft:{id:'',invoiceNum:"",invoiceCount:"",invoicingTime:"",invoiceAmount:""},
        //开票右侧表格数据
        invoicingRight:[],

        //分页操作参数
        pageNum:1,
        pageSize: 10,
        total: "",
        //跨页全选
        pageSkipChecked:false,
        //数据统计按钮数据
        statistData:{shouldGet:0,applyInvoice:0,invoicedMoney:0},
        //数据统计是否显示
        statistDataShow:false,
        //表格tab栏
        typeCode: '全部',
        fileList:[],
        copyTypeCode:'',
        //开票弹框是否使用新的抬头开票
        ifNewInvoHead:true,
        openInvoExtraMessage:{
          invoiceTitle:"",
          dutyParagraph:"",
          companyAddress:"",
          companyTel:"",
          accountBank:"",
          bankAccount:"",
          invoiceType:"",
          customerNameArray:''
        },
      }
    },
    created() {
      this.findThisUserAndBranchOrg()
      this.tableData.forEach(item=>item.orderWayBill = false)
      if(this.$route.params.orderNo){
        this.selectResult.orderNo = this.$route.params.orderNo
        this.$route.params.tab ==2 ?(this.typeCode = '月结开票'):(this.typeCode = '单独开票')
        this.searchClick(true)
      }
    },
    mounted() {
        this.searchClick(true)
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
      //消息列表跳转请求数据
      newRequest(){
        if(this.$route.params.orderNo){
          this.selectResult.orderNo = this.$route.params.orderNo
          this.$route.params.tab ==2 ?(this.typeCode = '月结开票'):(this.typeCode = '单独开票')
          this.searchClick(true)
        }
      },
      //切换开票方式
       shiftNewInvoHead() {
        this.ifNewInvoHead = !this.ifNewInvoHead
        this.invoiceFootThree = 0
        this.invoicingRight = []
        for(let i in this.invoicingLeft){
          this.invoicingLeft[i] = ''
        }
      },
       //下拉框搜索框控制
    shiftSelectControl(){
      this.selectControl = !this.selectControl
    },
      uploadDisable(){
        if(this.pageSkipChecked == true){
          if(this.tableData.length == 0) {
            return true
          }
          return false
        }
        else {
          return this.selectTableData.some(item=>item.invoiceNum== "") || this.selectTableData.some(item=>item.invoiceType!=2) || this.ifMainFold(this.selectTableData) || this.selectTableData.length==0
        }
      },
      
      uploadResolve(){
        if(this.pageSkipChecked == false) {
          if(this.ifMainFold(this.selectTableData)){
           this.$message({
            message: '主数据和折叠数据不能同时存在',
            type: 'warning'
          });
          return
        }
        else if(this.selectTableData.length==0){
           this.$message({
            message: '请选择数据进行操作',
            type: 'warning'
          });
          return
        }
        else if (this.selectTableData.some(item=>item.invoiceNum== "")){
          this.$message.warning("所选数据无发票号码，不允许上传发票")
        }
        else if (this.selectTableData.some(item=>item.invoiceNum== "")){
          this.$message.warning("所选数据存在未开票,不允许上传发票")
        }
        else if (this.selectTableData.some(item=>item.invoiceType!=2)){
          this.$message.warning("所选数据存在非电子发票，不允许上传发票")
        }
        }
        else {
          if(this.tableData.length == 0) {
            this.$message.warning("暂无数据不支持上传发票")
          }
        }
      },
      // 导入文件的上传
      handleChange(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('文件过大,请重新上传');
          return
        }
        //选中行调接口数据处理
        let requestData = {}
        if(this.pageSkipChecked == true) {
            requestData.overPageCheck = true
            requestData.financePageDTO = this.selectResultData()
            requestData.uploadInvoAppMap = null
        } else {
          requestData.overPageCheck = false
          requestData.financePageDTO = null
          let copyTabless = JSON.parse(JSON.stringify(this.selectTableData))
          if(this.selectTableData.some(item=>item.ifChild == true)){
            let result = this.sortArr(copyTabless,"iaId")
            requestData.uploadInvoAppMap ={}
            result.forEach((item,index)=>{
              requestData.uploadInvoAppMap[item[0].iaId] = item.map(item2=>item2.id)
            })
          } else {
            requestData.uploadInvoAppMap ={}
            copyTabless.forEach(item=>{
              if(item.invoiceInfos){
                requestData.uploadInvoAppMap[item.id] = item.invoiceInfos.map(item2=>item2.id)
              } else {
                  requestData.uploadInvoAppMap[item.id] = [item.firstId]
              }
            })
          }
        }
        // this.importExcel(file.raw)
        // console.log(formdate)
        let reader = new FileReader();
        let vm = this
          reader.readAsDataURL(file.raw);
          reader.onload = function() {
            const fileFormData = new FormData();
            fileFormData.append('image', file.raw)
            vm.$http.post(vm.$service.uploadInvoicePDF, fileFormData).then(res => {
              if(res.code == 200) {
                vm.$http.post(vm.$service.uploadInvoBody,requestData,{
                   responseType: 'arraybuffer'
                    }).then(res1=>{
                      let enc = new TextDecoder("utf-8");
                      let uint8_msg = new Uint8Array(res1);
                      let str=enc.decode(uint8_msg);
                      if(str.indexOf("code")>-1) {
                        let copyStr = JSON.parse(str)
                        if(copyStr.code == 200) {
                          vm.$message.success('导入成功')
                        }
                        else {
                          vm.$message.error(copyStr.message)
                        }
                      }
                      else{
                        const aLink = document.createElement("a");
                        let blob = new Blob([res1], {
                          type: "application/zip"
                        })
                        aLink.href = URL.createObjectURL(blob)
                        aLink.setAttribute('download', '导入失败文件' + '.zip')
                        aLink.click()
                        document.body.appendChild(aLink)
                      }
                      vm.searchClick(true)
                  })
              } else {
                      aLink.href = URL.createObjectURL(blob)
                      aLink.setAttribute('download', '上传发票' + '.zip') // 设置下载文件名称
                      aLink.click()
                      document.body.appendChild(aLink)
                      vm.searchClick(true)
              }
            })
            };
      },

      // 删除文件
      handleRemove(file) {
        this.excelInfo = "";
      },
      // 预览文件
      handlePreview(file) {
        window.location.href = URL.createObjectURL(file.raw);
      },
      //多选合并同一折叠行数据
      sortArr(arr, str) {
        var _arr = [],
            _t = [],
            // 临时的变量
            _tmp;
        // 按照特定的参数将数组排序将具有相同值得排在一起
        arr = arr.sort(function(a, b) {
            var s = a[str],
                t = b[str];
            return s < t ? -1 : 1;
        });
        if ( arr.length ){
            _tmp = arr[0][str];
        }
        // 将相同类别的对象添加到统一个数组
        for (var i in arr) {
            // console.log( _tmp);
            if ( arr[i][str] === _tmp ){
                _t.push( arr[i] );
            } else {
                _tmp = arr[i][str];
                _arr.push( _t );
                _t = [arr[i]];
            }
        }
        // 将最后的内容推出新数组
        _arr.push( _t );
        return _arr;
      },

      //导出列表
      exportList (){
        if(this.pageSkipChecked == false){
          if(this.selectTableData.length == 0) {
          this.$message({type:"warning",message:"请选择数据"})
          return false
      } else if(Boolean(this.selectTableData.some(item=>item.ifChild == true))){
          this.$message({
            message: '必须选择主信息进行导出',
            type: 'warning'
          });
          return false
        }
        } 
        if(this.pageSkipChecked == true) {
          if(this.tableData.length == 0) {
           return this.$message.warning("暂无数据,不支持导出列表")
          }
          
        }
        let requestData = {}
        if(this.pageSkipChecked == true) {
          requestData.overPageCheck = true
          requestData.financePageDTO = this.selectResultData()
          requestData.invoiceAppIds = []
        } else {
          requestData.invoiceAppIds = []
          requestData.financePageDTO = {}
          this.selectTableData.forEach((item,index)=>{
            requestData.invoiceAppIds[index] = item.id
          })
          requestData.overPageCheck = false
        }
        this.$http.post(this.$service.exportToExcel,requestData, {
            responseType: 'arraybuffer'
          }).then(res=>{
          
            const aLink = document.createElement("a");
            let blob = new Blob([res], {
              type: "application/vnd.ms-excel"
            })
            aLink.href = URL.createObjectURL(blob)
            aLink.setAttribute('download', '发票列表' + '.xlsx') // 设置下载文件名称
            aLink.click()
            document.body.appendChild(aLink)
        })
      },
      //搜索表单中多选框控制
      dealAllChange (){
      if(this.selectResult.invoicingStatus.indexOf("0") != -1 && this.selectResult.invoicingStatus.indexOf("1") != -1 && this.selectResult.invoicingStatus.indexOf("2") != -1) {
        this.selectResult.invoicingStatus = [""]
      } 
      else if (this.selectResult.invoicingStatus.indexOf("")>0){
        this.selectResult.invoicingStatus = [""]
      }
      else if(this.selectResult.invoicingStatus.indexOf("0") != -1 || this.selectResult.invoicingStatus.indexOf("1") != -1 || this.selectResult.invoicingStatus.indexOf("2") != -1 ) {
          if(this.selectResult.invoicingStatus.indexOf("") != -1){
            let index = this.selectResult.invoicingStatus.indexOf("")
            this.selectResult.invoicingStatus.splice(index,1)
          } 
        }
      if(this.selectResult.invoiceType.indexOf("0") != -1 && this.selectResult.invoiceType.indexOf("1") != -1 && this.selectResult.invoiceType.indexOf("2") != -1) {
        this.selectResult.invoiceType = [""]
      }
      else if (this.selectResult.invoiceType.indexOf("")>0){
        this.selectResult.invoiceType = [""]
      }
      else if(this.selectResult.invoiceType.indexOf("0") != -1 || this.selectResult.invoiceType.indexOf("1") != -1 || this.selectResult.invoiceType.indexOf("2") != -1 ) {
          if(this.selectResult.invoiceType.indexOf("") != -1){
            let index = this.selectResult.invoiceType.indexOf("")
            this.selectResult.invoiceType.splice(index,1)
          } 
        }
        this.searchClick(true)
      },
      //表格选择列显示drawer -全选
       handleCheckAllChange(val) {
         //控制抽屉全选后刷新table
        this.tableKey =  this.tableKey == 1? 2:1

        this.checkedTable = val ? this.tableOptions : [];
        this.isIndeterminate = false;
      },
      //表格选中事件
     handleSelectionChange(e){
      //  console.log(e)
       this.selectTableData = e
     },
      //查看开票信息
      showInvoice(message){
        // console.log(message)
        this.invoiceTableData = [JSON.parse(JSON.stringify(message))]
        this.invoiceDialog = true
      },

      //表格内点出快递弹框
      openPost(message){
        if(message.expressStatus == "未寄出"){
          let datas = [message]
          if (Boolean(datas.some(item=>item.invoicingStatus ==0))) {
            this.$message({
              message: '暂未开票,不能邮寄,请重新勾选',
              type: 'warning'
            });
          }

          else if (Boolean(datas.some(item=>item.invoiceType == 2))){
            this.$message({
              message: '电子发票不需要邮寄,请重新勾选',
              type: 'warning'
            });
          }
          else {
            this.postMessage = {postOne:"",postTwo:"",postThree:""};
            this.tableRowPostData = message
            this.postMessageDial=true
          }
        }
      },
      //表格运单号&订单号弹框
      showOrderWayBill(data){
        let request = { 'orderIds':data.orderInfos.map(item=>item.id),'invoiceApplyId':data.id}
        this.orderTableData = []
        this.$http.post(this.$service.orderInfoShow,request).then(item=>{
          this.orderTableData = item.data
        })
        this.orderWayBillFrame = true
      },
      //判断是否同时勾选主数据和折叠数据
      ifMainFold(e){
        let exist = false
        if(e.some(item=>item.ifChild != undefined) && e.some(item=>item.hasChild != undefined)){
          exist = true
        }
        return exist;
      },
      //获取作废条数
      getDeleteNum (){
        var num =0
        this.selectTableData.forEach(item=>{
          if(item.invoiceInfos){
            num +=item.invoiceInfos.length
          } else {
            num+=1
          }
        })
        return num
      },
      ifDataDel (){
        var result
        if(this.selectTableData.some(item=>!item.hasChild)){
           if(this.selectTableData.some(item=>item.invoiceStatus == "作废")){
          result = true
        } 
        }
        else {
          this.selectTableData.forEach(item=>{
            if(item.invoiceInfos.some(item2=>item2.invoiceStatus == "作废")) {
              result = true
            }
          })
        }
        return result
      },
      deleteInvo(){
        if(this.selectTableData.length == '0'){
           this.$message.warning("请选择数据进行删除")
        }
       else if(this.selectTableData.length > 1){
          this.$message.warning("请勾选单张发票进行删除操作")
        } else if (this.selectTableData[0].hasChild){
          this.$message.warning("请勾选单张发票进行删除操作")
        } else if (this.selectTableData[0].invoiceStatus == '作废'){
          this.$message.warning("作废的发票不允许删除，请重新勾选")
        } else if (this.selectTableData[0].invoiceNum == ''){
          this.$message.warning("勾选数据为未开票数据，请重新勾选")
        } 
        else {
          
          this.$confirm(`<div>发票号码:${this.selectTableData[0].invoiceNum}</div><div>确认删除该发票吗？</div>`, {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              center:true,
              dangerouslyUseHTMLString:true,
              type: 'warning'
              }).then(() => {
                this.$http.post(this.$service.deleteInvoice, {invoiceApplyId:this.selectTableData[0].iaId || this.selectTableData[0].id,invoiceNum:this.selectTableData[0].invoiceNum} ).then(res=>{
                if(res.code==200){
                  this.$message.success("删除成功")
                  this.searchClick(true)
                }
                else{this.$message.error(res.message)}
                })
              }).catch(() => {
              this.$message({
              type: 'info',
              message: '已取消删除'
              }); });
        }
      },
      //作废按钮
      delInvoice(){
        // console.log(this.ifDataDel())0   
        if(this.pageSkipChecked) {
          this.$message({
            message: '作废不支持跨页全选',
            type: 'warning'
          });
        }
        else if (this.selectTableData.length==0) {
          this.$message({
            message: '请选择数据进行作废',
            type: 'warning'
          });
        }
        else if(this.getDeleteNum()>10) {
          this.$message({
            message: '所选数据发票超过十条',
            type: 'warning'
          });
        }  else if(this.ifMainFold(this.selectTableData)){
           this.$message({
            message: '主数据和折叠数据不能同时存在',
            type: 'warning'
          });
        }  else if(this.selectTableData.some(item=>item.invoiceNum =="")){
           this.$message({
            message: '勾选数据存在未开票数据，请重新勾选',
            type: 'warning'
          });
        } else if (this.ifDataDel()) {
            this.$message({
            message: '勾选数据存在已作废数据，请重新勾选',
            type: 'warning'
          });
        }
        else {
          var rubbishArray = []
          this.selectTableData.forEach(item=>{
            //判断是否是主数据 是就将折叠数据放入数组
            if(item.hasChild) {
              item.invoiceInfos.forEach(item2=>{
                if(item2.invoiceNum){
                  rubbishArray.push(item2.invoiceNum)
                }
              })
            } else {
              if(item.invoiceNum) {
                rubbishArray.push(item.invoiceNum)
              }
            }
            })
          this.rubbishInvoice = rubbishArray.join("、")
          this.delRequestDial = true;
        }
      },
      //作废接口折叠数据处理
      delData(){
        var result = []
        //折叠数据
        if(this.selectTableData.some(item=>item.ifChild == true)){
          let fatherData = JSON.parse(JSON.stringify(this.copyTable))
        let data = JSON.parse(JSON.stringify(this.selectTableData))
        data.forEach(item=>{
          delete item.copyId
          delete item.ifChild
          delete item.invoiceType
        })
          var postArr = this.sortArr(data,"iaId")
          postArr.forEach((item,index)=>{
            result[index] = {}
            item.forEach(item4=>{
              item4.expressStatus = this.getExpressState.indexOf(item4.expressStatus)
              item4.invoiceStatus = this.getBillState.indexOf(item4.invoiceStatus)
              item4.upload = this.getUpLoad.indexOf(item4.upload)
            })
            result[index].nullifyInvoiceList = item
            var getFatherData = fatherData.filter(item2=>item[0].iaId == item2.id)
             result[index].id = getFatherData[0].id
            //  result[index].invoiceNumbers = getFatherData[0].invoiceNumbers
             result[index].invoiceStatus = getFatherData[0].invoiceStatus
             result[index].invoicedAmount = getFatherData[0].invoicedAmount
             result[index].invoicingStatus = getFatherData[0].invoicingStatus
             var data2= []
            if(getFatherData[0].orderInfos) {
              getFatherData[0].orderInfos.forEach((item3,index3)=>{data2[index3]=item3.id})
            }
             result[index].orderId = data2
          })
        } else {
          let fatherData = JSON.parse(JSON.stringify(this.copyTable))
          this.selectTableData.forEach((item,index)=>{
            result[index] = {}
            var getFatherData = fatherData.filter(item2=>item.id == item2.id)
            result[index].id = getFatherData[0].id
            // result[index].invoiceNumbers = getFatherData[0].invoiceNumbers
            result[index].invoiceStatus = getFatherData[0].invoiceStatus
            result[index].invoicedAmount = getFatherData[0].invoicedAmount
            result[index].invoicingStatus = getFatherData[0].invoicingStatus
            result[index].nullifyInvoiceList = getFatherData[0].invoiceInfos
            var data2= []
            if(getFatherData[0].orderInfos) {
              getFatherData[0].orderInfos.forEach((item3,index3)=>{data2[index3]=item3.id})
            }
             result[index].orderId = data2
          })
        }

          return result
      },

      //确认作废
      comfirmDele(){
        // console.log(this.delData())
          let data = JSON.parse(JSON.stringify(this.delData()))
          // console.log(data)
          this.$http.post(this.$service.nullifyInvoiceMore,data).then(data=>{
            if(data.code == 200) {
              this.$message.success('发票作废成功')
              this.delRequestDial = false
              this.searchClick(true)
            }else {
                this.$message.error(data.message)
                this.delRequestDial = false
              }
          })
      },
      //开票按钮
      invoicing(){
        if(this.pageSkipChecked) {
          this.$message({
            message: '开票不支持跨页全选',
            type: 'warning'
          });
        }
        //  if(this.pageSkipChecked) this.selectTableData = JSON.parse(JSON.stringify(this.copyTable))
        else if(this.selectTableData.length != 1) {
          if(this.selectTableData.length == 0) {
             this.$message({
            message: '请选择数据进行开票',
            type: 'warning'
          });
          }
          else {
          this.$message({
            message: '只能选择一条信息进行开票',
            type: 'warning'
          });
          }
        }
        else if(Boolean(this.selectTableData.some(item=>item.ifChild == true))){
          this.$message({
            message: '必须选择主信息进行开票',
            type: 'warning'
          });
        }
        else if (this.selectTableData[0].invoicingStatus == 2 && (this.selectTableData[0].applyAmount == this.selectTableData[0].invoicedAmount)) {
          this.$message({
            message: '不能重复开票，请重新勾选',
            type: 'warning'
          });
        }
        else {
          const { Big } = this.$utils
          this.ifNewInvoHead = true
          this.invoicingLeft = {id:'',invoiceNum:"",invoiceCount:"",invoicingTime:"",invoiceAmount:""}
          this.invoicingRight = []
          this.invoiceFootOne = this.selectTableData[0].applyAmount
          this.invoiceFootTwo = parseFloat(new Big(this.selectTableData[0].applyAmount).minus(this.selectTableData[0].invoicedAmount))
          this.invoiceFootThree = 0
          this.invoicingLeft.id = ""
          this.invoicingDial = true
          this.openInvoExtraMessage={
            invoiceTitle:this.selectTableData[0].invoiceTitle,
            dutyParagraph:this.selectTableData[0].dutyParagraph,
            companyAddress:this.selectTableData[0].companyAddress,
            companyTel:this.selectTableData[0].companyTel,
            accountBank:this.selectTableData[0].accountBank,
            bankAccount:this.selectTableData[0].bankAccount,
            invoiceType:this.selectTableData[0].invoiceType
          }
        }
      },
     
     //开票弹框左侧确认生成
      invoiceLeftConfirm() {
        let copyLeft = JSON.parse(JSON.stringify(this.invoicingLeft))
        delete copyLeft.id
        if(this.invoicingLeft.invoiceCount>50){
          this.$message({
            message: '开票张数不能大于50',
            type: 'warning'
          });
        } 
      
         else if(this.invoicingRight.length+this.invoicingLeft.invoiceCount>50) {
          this.$message({
            message: '右侧发票张数不能大于50',
            type: 'warning'
          });
        }
        else if ((!this.invoicingLeft.invoiceAmount || !this.invoicingLeft.invoiceCount|| !this.invoicingLeft.invoiceNum || !this.invoicingLeft.invoicingTime) && this.ifNewInvoHead ){
          this.$message({
            message: '请填写左侧全部信息后进行操作',
            type: 'warning'
          });
        }
        else if (!this.ifNewInvoHead && Object.values(copyLeft).indexOf("") != -1){
           this.$message({
            message: '请填写左侧全部信息后进行操作',
            type: 'warning'
          });
        }
        else if(!Number(this.invoicingLeft.invoiceCount) || !Number(this.invoicingLeft.invoiceNum) || !Number(this.invoicingLeft.invoiceAmount)){
          this.$message({
            message: '开票金额/首张号码/张数必须是数字',
            type: 'warning'
          })
        }
        else if (this.invoicingLeft.invoiceNum.length<8){
          this.$message({
            message: '开票首张号码必须是八位数字',
            type: 'warning'
          })
        }
        else if ((this.invoiceFootTwo-this.invoiceFootThree) < Number(this.invoicingLeft.invoiceAmount)*Number(this.invoicingLeft.invoiceCount) ){
           this.$message({
            message: '发票金额大于未开票金额,请重新填写',
            type: 'warning'
          });
        }
        else {
          const copyData = JSON.parse(JSON.stringify(this.copyTable))
          let data = copyData.filter(item=>item.id==this.selectTableData[0].id)[0]
          data.toBeInvoiceList = JSON.parse(JSON.stringify(this.invoicingRight)) 
          let copySInvoLeft = JSON.parse(JSON.stringify(this.invoicingLeft))
          delete copySInvoLeft.id
          delete copySInvoLeft.invoiceNum
          delete copySInvoLeft.invoiceCount
          delete copySInvoLeft.invoicingTime
          delete copySInvoLeft.invoiceAmount
          if(data.invoiceInfos) {
            if(this.ifNewInvoHead) {
               data.invoiceInfos.forEach(itemss =>Object.assign(itemss,this.openInvoExtraMessage))
            }
            else {
               data.invoiceInfos.forEach(itemss =>Object.assign(itemss,copySInvoLeft))
            }
          }
          if(data.toBeInvoiceList) {
            if(this.ifNewInvoHead) {
             data.toBeInvoiceList.forEach(itemsss=>Object.assign(itemsss,this.openInvoExtraMessage))
            }
            else 
            {
              data.toBeInvoiceList.forEach(itemsss=>Object.assign(itemsss,copySInvoLeft))
            }
          }
          let copyInvoLeft = ""
          if(this.ifNewInvoHead){
             copyInvoLeft = Object.assign({},this.invoicingLeft,this.openInvoExtraMessage)
          }
          else {
            copyInvoLeft = this.invoicingLeft
          }
          this.$http.post(this.$service.actionInvoice,{firstInvoiceInfo:copyInvoLeft,tInvoiceAppListVos:data}).then(data=>{
            if(data.code == 200) {
              // console.log(this.invoicingRight,1111)
              this.invoicingRight.push(...data.data)
              // console.log(this.invoicingRight)
              let totalMoney = 0
              this.invoicingRight.forEach(item=> {
              totalMoney+=item.invoiceAmount})
              this.invoiceFootThree = totalMoney
              this.$message.success("生成发票成功")
              this.invoicingLeft = {id:'',invoiceNum:"",invoiceCount:"",invoicingTime:"",invoiceAmount:"",invoiceTitle:"",dutyParagraph:"",companyAddress:"",companyTel:"",accountBank:"",bankAccount:"",invoiceType:""}
            } else {
              this.$message.error(data.message)
            }
            
          })

        }
      },
      //开票弹出框 表格删除功能
      deleteInvoiceRight(e){
        console.log(this.invoicingRight)
        this.invoicingRight.splice(e.$index,1)
        let totalMoney = 0
            this.invoicingRight.forEach(item=> {
            totalMoney+=item.invoiceAmount})
            this.invoiceFootThree = totalMoney
      },
      //开票弹出框 确认开票
      confirmInvoice (){
         if(this.invoiceFootThree == 0) {
          this.$message.warning("未生成发票,请点击确认生成")
        }
         else {
          const copyData = JSON.parse(JSON.stringify(this.copyTable))
          let data = copyData.filter(item=>item.id==this.selectTableData[0].id)[0]
          data.toBeInvoiceList = this.invoicingRight
          let request = {insertTitle:!this.ifNewInvoHead,tinvoiceAppListVo:data}
          this.$http.post(this.$service.confirmInvoice,request).then(data=>{
            if(data.code == 200) {
              this.searchClick(true)
              this.$message.success("开票成功")
            }else {
                this.$message.error(data.message)
              }
              
          })
          this.invoicingDial = false
        }
      },

      //快递按钮
      delivery(){
        // if(this.pageSkipChecked) this.selectTableData = JSON.parse(JSON.stringify(this.copyTable))
        if(this.pageSkipChecked == false) {
          if (this.selectTableData.length == 0) {
            this.$message({
              message: '请至少选择1条信息',
              type: 'warning'
            });
          }
          else if(Boolean(this.selectTableData.some(item=>item.ifChild == true))){
            this.$message({
              message: '只能选择主数据进行快递',
              type: 'warning'
            });
          }
          else if (Boolean(this.selectTableData.some(item=>item.invoicingStatus ==0))) {
            this.$message({
              message: '暂未开票,不能邮寄,请重新勾选',
              type: 'warning'
            });
          }

          else if (Boolean(this.selectTableData.some(item=>item.invoiceType == 2))){
            this.$message({
              message: '电子发票不需要邮寄,请重新勾选',
              type: 'warning'
            });
          }
          else if (Boolean(this.selectTableData.some(item=>item.recipient != this.selectTableData[0].recipient|| item.recipientAddress != this.selectTableData[0].recipientAddress || item.recipientTel != this.selectTableData[0].recipientTel))) {
            this.$message({
              message: '邮寄信息不一致,请分批邮寄',
              type: 'warning'
            });
          }
          else {
          this.postMessage = {postOne:"",postTwo:"",postThree:""};
          this.postMessageDial = true;
          this.tableRowPostData = ""
        }
        }
        else {
          if(this.tableData.length == 0) {
            this.$message.warning("暂无数据不支持快递操作")
            return
          }
          this.postMessage = {postOne:"",postTwo:"",postThree:""};
          this.postMessageDial = true;
          this.tableRowPostData = ""
        }
      },

      //快递弹框确认
      confirmPost(){
        let requestData = {
          expressDTOList:[],
          expressInfo:"",
          financePageDTO:{},
          overPageCheck:false
        }
        if(this.postMessage.postOne == "" || this.postMessage.postTwo =="") {
          this.$message({
            type:"warning",
            message:"快递公司和邮寄信息不能为空"
          })
          return
        }
        let postMess = String(this.postMessage.postOne)+","+String(this.postMessage.postThree)+","+String(this.postMessage.postTwo)
        requestData.expressInfo = postMess
        if(this.pageSkipChecked == false) {
          requestData.overPageCheck = this.pageSkipChecked
          requestData.expressDTOList =[]
          var data
          if(this.tableRowPostData) {
            data = [this.tableRowPostData]
          } else {
           data = JSON.parse(JSON.stringify(this.selectTableData))
          }
            data.forEach((item,index)=>{
              requestData.expressDTOList[index]={}
              requestData.expressDTOList[index].expressInfo = item.expressInfo
              requestData.expressDTOList[index].expressStatus = this.getExpressState.findIndex(items => items == item.expressStatus)
              requestData.expressDTOList[index].id = item.id
              // requestData.expressDTOList[index].invoiceNumbers = item.invoiceNumbers
              requestData.expressDTOList[index].recipient = item.recipient
              requestData.expressDTOList[index].recipientAddress = item.recipientAddress
              requestData.expressDTOList[index].recipientTel = item.recipientTel
              requestData.expressDTOList[index].toBeExpressInvoice = []
              if(item.invoiceInfos){
                 item.invoiceInfos.forEach((item2,index2)=>{
                requestData.expressDTOList[index].toBeExpressInvoice[index2] = item2.invoiceNum
              })
              } else {
                requestData.expressDTOList[index].toBeExpressInvoice[0]=item.invoiceNum
              }
            })
        } else {
          requestData.overPageCheck = true
          requestData.financePageDTO = this.selectResultData()
        }
        this.$http.post(this.$service.expressInvoices,requestData).then(data=>{
           if(data.code == 200) {
              this.$message.success('编辑快递信息成功')
            } else {
                this.$message.error(data.message)
              }
        })
        this.postMessageDial = false;
        this.searchClick(true)
      },
      //数据统计按钮
      getStatistData(){
        this.isExitAbnormalFlag = false
        // console.log(this.tableData)
        this.statistDataShow = !this.statistDataShow
        if(this.statistDataShow == false) return""
        this.statistData = {shouldGet:0,applyInvoice:0,invoicedMoney:0}
      
        let request = {financePageDTO:this.selectResultData(),iaId:this.selectTableData.map(item=>item.id)}
        this.$http.post(this.$service.invoiceStatistics,request).then(res=>{
          this.statistData.shouldGet = res.data.totalArCny;
          this.statistData.applyInvoice =res.data.applyAmount;
          this.statistData.invoicedMoney = res.data.invoicedAmount;
          this.isExitAbnormalFlag = res.data.isExitAbnormalFlag == 1? true :false
        })
      },
      //跨页全选按钮
      selectAllTable(){
        if(this.pageSkipChecked == false) {
          this.selectTableData = []
        }
      },
      //tab切换
     async tabClickData(tab,event) {
        this.pageNum = 1
        this.pageSkipChecked = false
        this.statistDataShow = false
        await this.searchClick()
        this.copyTypeCode = this.typeCode
      },
      //查询条件数据
      selectResultData(){
        let arrayCopy = JSON.parse(JSON.stringify(this.selectResult))
        //搜索框选择全部 删除属性
        if(arrayCopy.expressStatus == "") delete arrayCopy.expressStatus;
        if(arrayCopy.invoiceStatus == "") delete arrayCopy.invoiceStatus;
        if(arrayCopy.upload == "") delete arrayCopy.upload;
        if(arrayCopy.invoiceType.length == 1 && (arrayCopy.invoiceType)[0]=="" ) delete arrayCopy.invoiceType;
        if(arrayCopy.invoicingStatus.length == 1 && arrayCopy.invoicingStatus[0]=="" ) delete arrayCopy.invoicingStatus;
        //搜索框多选情况
        if(arrayCopy.invoiceType) arrayCopy.invoiceType = arrayCopy.invoiceType.join()
        if(arrayCopy.invoicingStatus) arrayCopy.invoicingStatus = arrayCopy.invoicingStatus.join()
        //调接口 判断当前tab页
        if(this.typeCode == "月结开票") {arrayCopy.merge = 0}
        else if(this.typeCode == "单独开票") {arrayCopy.merge = 1}
        else if (this.typeCode == "异常") {arrayCopy.abnormalFlag = 1}
        return arrayCopy
      },
      //查询
      searchClick(self) {
        let arrayCopy = this.selectResultData()
        
        //当前页数和每页显示个数
        arrayCopy.pageNum = this.pageNum
        arrayCopy.pageSize = this.pageSize
        this.copySelectJSON.pageNum = this.pageNum
        this.copySelectJSON.pageSize = this.pageSize
       
        return this.$http.post(this.$service.invoiceSearch, arrayCopy ).then((data) => {
          let dData = data.data
          if (data.code == 200) {
            
            //获取信息总数，及表格tab页的数据数量
            this.total = dData.pageInfo.total
            this.tabNum = [dData.totalCount,dData.mergeCount,dData.notMergeCount,dData.abNormalCount]
            //用于后续调接口操作
            this.copyTable = JSON.parse(JSON.stringify(dData.pageInfo.records))
            //处理数据后在表格上显示
            let getData = JSON.parse(JSON.stringify(data.data.pageInfo.records))
            getData.forEach((item,index)=>{
              //copyID用于折叠表格的rowKey
              item.copyId = item.id
              // item.iaId = item.id
              if(item.invoiceInfos && item.invoiceInfos.length>=1){
                //判断是否是主数据
                item.hasChild = true
                item.ifFold = false
                item.invoiceInfos.forEach((item2,index)=>{
                  item2.invoiceType =item.invoiceType
                  //标记是折叠数据
                  item2.ifChild = true
                  //作为element table 折叠表格的row-key使用
                  item2.copyId = String(item.id)+'-'+String(index)
                  //将折叠数据中的数字处理成文字显示
                  item2.expressStatus = this.getExpressState[item2.expressStatus]
                  item2.invoiceStatus = this.getBillState[item2.invoiceStatus]
                  item2.upload = this.getUpLoad[item2.upload]
                })
              }
              // 从invoiceInfos和orderInfos中取数据
              item.invoiceNum = (item.invoiceInfos && item.invoiceInfos[0] && item.invoiceInfos[0].invoiceNum) || ""
              item.invoicingTime = (item.invoiceInfos && item.invoiceInfos[0] && item.invoiceInfos[0].invoicingTime) || ""
              item.expressStatus = this.getExpressState[item.expressStatus] || ""
              item.invoiceStatus = this.getBillState[item.invoiceStatus] ||  ""
              item.upload = this.getUpLoad[item.upload] || ""
              if(item.orderInfos&& item.orderInfos[0]){
                item.orderNo =item.orderInfos[0].orderNo
                item.waybillNo =item.orderInfos[0].waybillNo
                item.departureDate =item.orderInfos[0].departureDate
                item.presentationTime =item.orderInfos[0].presentationTime
              }
               //折叠操作控制
              if(item.invoiceInfos && item.invoiceInfos.length == 1) {
                item.firstId = item.invoiceInfos[0].id
                item.hasChild = false
                delete item.invoiceInfos
              }
            })
            this.tableData = getData.map(item => {
              return {
                ...item,
                taxableServiceText: (() => {
                  const taxableService = DcStatus.commonStatus.getStatus(
                    "taxableServices",
                    item.taxableService
                  )
                  return (taxableService || {}).label
                })()
              }
            })
            this.statistDataShow = false
            //控制跨页全选
            if(self) this.pageSkipChecked = false
            this.selectAllTable()
            // console.log(getData,1111)
            // this.$forceUpdate()
          } else {
            this.$message.error(data.message)
          }
        })
      },
      //重置
      restClick() {
        this.pageSkipChecked = false
        this.selectAllTable()
        this.pageNum = 1
        this.pageSize = 10
        this.selectResult={
          financialSeriesNo:"",
          orderNo:"",
          waybillNo:"",
          companyId:"",
          invoiceTitle:"",
          upload:"",
          invoiceNum:"",
          invoiceType:[""],
          invoicingStatus:[""],
          invoiceStatus:"",
          expressStatus:"",
          startDepartureDate:"",
          endDepartureDate:"",
          startPresentationTime:"",
          endPresentationTime:"",
          startInvoiceApplyTime:"",
          endInvoiceApplyTime:"",
          startInvoicingTime:"",
          endInvoicingTime:"",
        }
        this.searchClick(true)
      },
      handleCurrentChange(e) {
        // console.log(e)
        this.statistDataShow = false
        this.pageNum = e
        this.searchClick()
      },
      handleSizeChange(e) {
        // console.log(e)
        this.statistDataShow = false
        this.pageSize = e
        this.searchClick()
      },
      //控制快递信息列显示内容  
      dealExpress(express) {
        if(!express) express =""
        let data = express.split(",")
        return `<div>公司:${data[0]?data[0]:""}\n单号:${data[1]?data[1]:""}\n日期:${data[2]?data[2]:""}</div>`
      },
      //控制原币列显示 
      dealOrgn(orgn) {
        if (!orgn) {
          return;
        }
        orgn = JSON.parse(orgn);
        var totalOrgn = "";
        if(orgn && (orgn.length > 0)){
          for (var i = 0; i < orgn.length; i++) {
            var obj = this.currencyArray.filter((item)=>{return (item.id == orgn[i].currency)})
            totalOrgn = totalOrgn + obj[0]["symbol"]+ " " + Number(orgn[i].amount)
            if(i < (orgn.length - 1)){
              totalOrgn = totalOrgn + '\n'
            }
          }
        }else{
          totalOrgn = "¥ 0"
        }
        return totalOrgn;
      },
      // dealOrgn(orgn) {
      //   if (!orgn) {
      //     return;
      //   }
      //   orgn = JSON.parse(orgn);
      //   var totalOrgn = "";
      //   var value1 = 0;
      //   var value2 = 0;
      //   var value3 = 0;
      //   var value4 = 0;
      //   var value5 = 0;
      //   // HK$ $ € ￡
      //   for (var i = 0; i < orgn.length; i++) {
      //     if (orgn[i].currency == "1") {
      //       value1 += orgn[i].amount;
      //     } else if (orgn[i].currency == "2") {
      //       value2 += orgn[i].amount;
      //     } else if (orgn[i].currency == "3") {
      //       value3 += orgn[i].amount;
      //     } else if (orgn[i].currency == "4") {
      //       value4 += orgn[i].amount;
      //     } else if (orgn[i].currency == "5") {
      //       value5 += orgn[i].amount;
      //     }
      //   }
      //   totalOrgn = "";
      //   totalOrgn += value1  ? "¥ " +value1 + "\n" : "";
      //   totalOrgn += value2 ? "HK$ "+value2 + "\n" : "";
      //   totalOrgn += value3 ?  "$ " +value3 + "\n" : "";
      //   totalOrgn += value4 ?  "€ " +value4 + "\n" : "";
      //   totalOrgn += value5 ? "￡ " +value5 + "\n": "";
      //   totalOrgn = totalOrgn.substring(0, totalOrgn.length - 1);
      //   if(!totalOrgn) {
      //     totalOrgn =  "¥ 0"
      //   }
      //   return totalOrgn;
      // },
    },
    watch:{
      '$route.params.orderNo'(){
        // console.log(this.$route.params)
        if(this.$route.params.page == 2){
           this.newRequest()
        } 
      },
      '$route.query.time'(){
        // console.log(this.$route.params)
        if(this.$route.params.page == 2){
           this.newRequest()
        } 
      }
    }
  }
</script>
<style lang="less">

  .invoicePopper{
      max-height: 200px!important;
      overflow: scroll;
  }
</style>
<style scoped lang="less">
  @import url("../../assets/icon/iconfont.css");
  /deep/.el-tabs--top .el-tabs__item.is-top:last-child{
  color:red;
  
}
/deep/.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active:last-child{
  color:red!important;

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
/deep/.el-tabs--border-card>.el-tabs__header .el-tabs__item:last-child:hover{
  color: red !important;
}
   .el-button--primary{
      width:100px;
      // text-align: center;
  }
  /deep/.el-form-item{
    margin-bottom: 0;
  }
   /deep/ .el-checkbox__label {
     color:#000
   }
  /deep/.pageSkip {
        color:#fff;
        padding:3px 5px!important
  }
  /deep/.el-table{
    width:97%!important;
    .cell {
      white-space: normal!important;
    }
  }
  .content-search-normal {
    .formItem{
      display:inline-block;
      margin:0 10px 6px 0;
    }
  }
  .operateButton {
    display:flex;
    justify-content: flex-end;
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
  //select多选框选中项限制宽度
  /deep/.el-tag.el-tag--info {
    max-width: 120px;
  }
  //表格单元格设置
  .el-table{
    /deep/.cell{
      display: flex;
      justify-content: center;
      text-align: center;
      white-space: nowrap;
      }
  }
  //开票按钮弹出框
  .invoicingDial{
    width: 100%;
    display:flex;
    justify-content: space-between;
    margin:15px auto 0;
    /deep/.el-table__empty-text{
      display:none
    }
    /deep/ .el-table th{
      height: 35px;
    }
  }
  .content-wrapper {
  width:100%;
    height:95%;
    box-sizing: border-box;
    /*height: 100%;*/
    padding: 20px;
    overflow: hidden;
    background-color: #f3f6f9 !important;
  }

  .el-form {
    background-color: #FFF;
  }

  .el-form--inline .el-form-item {
    // margin-bottom: 20px;
    // vertical-align: bottom;
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
  /deep/.operateButton .upLoad .el-button--medium{
    font-size: 12px;
    padding: 7px 20px;
  }
  /deep/.el-checkbox__label{
    font-size: 12px;
  }
</style>
