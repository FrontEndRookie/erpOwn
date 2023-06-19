<template>
  <div class="order-manage-new">
    <dc-form size="mini" class="search-form dc-custom-shadow">
      <div class="order-search">
        <img
          :src="allSearchIcon.src"
          class="all-search-icon"
          @click="showAllSearch = !showAllSearch"
        />
        <template>
          <el-form-item>
            <el-input
              v-model.trim="form.orderNo"
              placeholder="订单号"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model.trim="form.waybillNo"
              placeholder="运单号"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model.trim="form.inboundNo"
              placeholder="进仓编号"
              clearable
            />
          </el-form-item>
          <el-form-item v-auth:none="['151001_B']">
            <dc-select
              v-model="form.companyId"
              filterable
              remote
              placeholder="客户"
              clearable
            >
              <el-option
                v-for="item in portalUsers"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </dc-select>
          </el-form-item>
          <el-form-item>
            <dc-select
              v-model="form.pol"
              filterable
              remote
              clearable
              placeholder="起运港"
              :remote-method="
                (keyWord) => getThreeLetterCodes({ keyWord, listName: 'pols' })
              "
            >
              <el-option
                v-for="item in pols"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span>{{ item.detailText }}</span>
              </el-option>
            </dc-select>
          </el-form-item>
          <el-form-item>
            <dc-select
              v-model="form.pod"
              filterable
              remote
              clearable
              placeholder="目的港"
              :remote-method="
                (keyWord) => getThreeLetterCodes({ keyWord, listName: 'pods' })
              "
            >
              <el-option
                v-for="item in pods"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span>{{ item.detailText }}</span>
              </el-option>
            </dc-select>
          </el-form-item>
          <el-form-item>
            <dc-select
              v-model="form.airCompanyCode"
              filterable
              remote
              placeholder="航司"
              clearable
              :remote-method="getAirCompanysByKeyWord"
            >
              <el-option
                v-for="item in airCompanys"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </dc-select>
          </el-form-item>
        </template>
        <template v-if="showAllSearch">
          <el-form-item>
            <dc-select
              v-model="form.agentId"
              filterable
              remote
              :remote-method="getSearchAgentList"
              placeholder="代理公司"
              clearable
            >
              <el-option
                v-for="item in searchAgentList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </dc-select>
          </el-form-item>
          <el-form-item>
            <dc-select
              v-model="form.pscsId"
              filterable
              clearable
              placeholder="售前客服"
            >
              <el-option
                v-for="item in pscsList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </dc-select>
          </el-form-item>
          <el-form-item>
            <dc-select
              v-model="form.principalId"
              filterable
              clearable
              placeholder="航线"
            >
              <el-option
                v-for="item in principalList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </dc-select>
          </el-form-item>
          <el-form-item>
            <dc-select
              v-model="form.mscsId"
              filterable
              clearable
              placeholder="操作"
            >
              <el-option
                v-for="item in mscsList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </dc-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="departureDates"
              type="daterange"
              unlink-panels
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="航班起始日期"
              end-placeholder="航班截止日期"
              style="width: 364px"
            />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="orderTimes"
              type="daterange"
              unlink-panels
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="下单起始日期"
              end-placeholder="下单截止日期"
              style="width: 364px"
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="form.rcvCheckStatus"
              placeholder="应收对账状态"
              clearable
            >
              <el-option
                v-for="item in rcvCheckStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="form.rcvWriteOffStatus"
              placeholder="应收核销状态"
              clearable
            >
              <el-option
                v-for="item in rcvWriteOffStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="form.financeStatus"
              placeholder="交单状态"
              clearable
            >
              <el-option
                v-for="item in financeStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="form.invoicingStatus"
              placeholder="开票状态"
              clearable
            >
              <el-option
                v-for="item in invoicingStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <dc-select
              v-model="form.sysOrgId"
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
              v-model="form.customerResponsibleId"
              placeholder="客户负责人"
              filterable
              clearable
            >
              <el-option
                v-for="item in customerResponsibles"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </dc-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="form.ownRote"
              placeholder="是否为自有航线"
              clearable
            >
              <el-option
                v-for="item in ownRotes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
           <el-form-item>
            <el-select
              v-model="form.apFeeStatus"
              placeholder="应付对账状态"
              clearable
            >
              <el-option
                v-for="item in apFeeStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </div>
      <div class="order-actions">
        <el-form-item>
          <el-button
            type="primary"
            @click="currentPageChange(1)"
            v-auth:none="['151000_B']"
            >查询</el-button
          >
          <el-button type="primary" @click="resetSearch">清空</el-button>
          <el-button
            type="primary"
            v-auth:none="['151003_B']"
            @click="exportOrderExecl"
            >导出列表</el-button
          >
          <el-button
            type="primary"
            @click="showExportBillDialog = true"
            v-auth:none="['151002_B']"
            >拉账单</el-button
          >
          <el-button
            type="primary"
            @click="exportOrderExeclBZY"
            v-auth:none="['151004_B']"
            >导出耗时明细</el-button
          >
          <el-button
            type="primary"
            @click="jump2addOrder"
            v-auth:none="['151005_B']"
            >新建订单</el-button
          >
          <el-button
            type="primary"
            @click="importAirDate"
            v-if="ifAdminLogin"
            >航班日期导入</el-button
          >
        </el-form-item>
        <el-form-item style="margin-left: auto">
          <div class="count-down-time">
            <span style="margin-right: 10px" v-show="timerSwitch">{{
              currentCountDownText
            }}</span>
            <span style="margin-right: 20px">定时刷新</span>
            <el-switch
              v-model="timerSwitch"
              active-text="开"
              inactive-text="关"
              @change="(val) => setIntervalTimer(val)"
            ></el-switch>
          </div>
        </el-form-item>
      </div>
    </dc-form>
    <main
      ref="mainTable"
      class="main-table dc-custom-shadow"
      style="margin-top: 20px"
    >
      <dc-table
        v-loading="tableLoading"
        :columns="computedColumns"
        :data="computedList"
        :showPagination="false"
        :height="tableHeight"
        row-key="timestampKeyId"
        border
        :row-class-name="rowClassName"
        emptyCellText="/"
      >
        <template #orderNo="{ row }">
          <span
            @click="jump2detail(row)"
            style="cursor: pointer; text-decoration: underline; color: #409eff"
            v-auth:disabled="['152000_B']"
            >{{ row.orderNo }}</span
          >
        </template>
        <template #statusDesc="{ row }">
          <el-tooltip
            :content="row.freezeReason"
            placement="top"
            effect="light"
            popper-class="freeze-reason-popper"
          >
            <div v-if="row.isFreezedOrder" class="freeze-reason">
              {{ row.freezeReason }}
            </div>
          </el-tooltip>
          <div v-if="!row.isFreezedOrder">
            <p>{{ row.statusDesc }}</p>
            <p
              v-if="row.showInboundSuccess"
              style="font-size: 14px; color: #32cd32"
            >
              进仓数据已确认
            </p>
          </div>
        </template>
        <template #pol="{ row }">
          <div v-auth-field:[row.pol]="['101010_FC']">
            <span v-if="!row.showEdit">{{ row.pol }}</span>
            <dc-select
              v-else
              v-model="row.pol"
              :disabled="row.polDisabled || row.cancelOrderDisabled"
              size="mini"
              filterable
              remote
              placeholder="起运港"
              :remote-method="
                (keyWord) => getThreeLetterCodes({ keyWord, listName: 'pols' })
              "
            >
              <el-option
                v-for="item in pols"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span>{{ item.detailText }}</span>
              </el-option>
            </dc-select>
          </div>
        </template>
        <template #pod="{ row }">
          <div v-auth-field:[row.pod]="['101020_FC']">
            <span v-if="!row.showEdit">{{ row.pod }}</span>
            <dc-select
              v-else
              v-model="row.pod"
              :disabled="row.podDisabled || row.cancelOrderDisabled"
              size="mini"
              filterable
              remote
              placeholder="目的港"
              :remote-method="
                (keyWord) => getThreeLetterCodes({ keyWord, listName: 'pods' })
              "
            >
              <el-option
                v-for="item in pods"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span>{{ item.detailText }}</span>
              </el-option>
            </dc-select>
          </div>
        </template>
        <template #departureDate="{ row }">
          <div v-auth-field:[row.departureDate]="['101040_FC']">
            <span v-if="!row.showEdit">{{ row.departureDate }}</span>
            <el-date-picker
              v-else
              v-model="row.departureDate"
              :disabled="row.departureDateDisabled || row.cancelOrderDisabled"
              size="mini"
              type="datetime"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              placeholder="选择航班日期"
              :clearable="false"
              style="width: 130px"
            />
          </div>
        </template>
        <template #flightNo="{ row }">
          <div v-auth-field:[row.flightNo]="['105050_FC']">
            <span v-if="!row.showEdit">{{ row.flightNo }}</span>
            <input
              v-else
              class="table-input"
              v-model.trim.lazy="row.flightNo"
              size="mini"
              :disabled="row.flightNoDisabled || row.cancelOrderDisabled"
              placeholder="航班号"
              maxlength="30"
              clearable
            />
          </div>
        </template>
        <template #airCompanyCode="{ row, index }">
          <div v-auth-field:[row.airCompanyCode]="['101030_FC']">
            <span v-if="!row.showEdit">{{ row.airCompanyCode }}</span>
            <dc-select
              v-else
              v-model="row.airCompanyCode"
              size="mini"
              :disabled="row.airCompanyDisabled || row.cancelOrderDisabled"
              filterable
              remote
              :remote-method="getAirCompanysByKeyWord"
              @change="(val) => airCompanyChange(val, index)"
            >
              <el-option
                v-for="item in airCompanys"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              />
            </dc-select>
          </div>
        </template>
        <template #waybillNo="{ row }">
          <div v-auth-field:[row.waybillNo]="['105000_FC']">
            <span v-if="!row.showEdit">{{ row.waybillNo }}</span>
            <input
              v-else
              class="table-input"
              v-model.trim.lazy="row.waybillNo"
              size="mini"
              :disabled="row.waybillNoDisabled || row.cancelOrderDisabled"
              placeholder="运单号"
              maxlength="30"
              clearable
            />
          </div>
        </template>
        <template #subWaybillNo="{ row }">
          <div v-auth-field:[row.subWaybillNo]="['105005_FC']">
            <span v-if="!row.showEdit">{{ row.subWaybillNo }}</span>
            <input
              v-else
              class="table-input"
              v-model.trim.lazy="row.subWaybillNo"
              size="mini"
              :disabled="row.subWaybillNoDisabled || row.cancelOrderDisabled"
              placeholder="英文逗号隔开"
              maxlength="100"
              clearable
            />
          </div>
        </template>
        <template #companyName="{ row }">
          <div>
            <span v-auth-field:[row.companyName]="['101000_FC']">{{
              row.companyName
            }}</span>
            <span v-if="row.qq">
              <a
                :href="`tencent://message/?uin=${row.qq}&Menu=yes&Service=300&sigT=42a1e5347953b64c5ff3980f8a6e644d4b31456cb0b6ac6b27663a3c4dd0f4aa14a543b1716f9d45`"
                ><dc-img name="qq" type="svg" style="width: 25px"
              /></a>
            </span>
          </div>
          <div
            v-show="row.showAboveQuotaFlagText"
            style="color: red; font-size: 12px"
          >
            该客户已超额！
          </div>
        </template>
        <template #cargoName="{ row }">
          <div v-auth-field:[row.cargoName]="['105005_FC']">
            <div v-if="!row.showEdit">
              {{ row.cargoName }}
            </div>
            <input
              v-else
              class="table-input"
              v-model.trim.lazy="row.cargoName"
              size="mini"
              :disabled="row.cancelOrderDisabled"
              placeholder="品名"
              maxlength="50"
              clearable
            />
          </div>
        </template>
        <template #jmt="{ row }">
          <template v-if="row.showInboundFlag === 1">
            {{ row.inboundPiece || "-" }} / {{ row.inboundWeight || "-" }} /
            {{ row.inboundCbm || "-" }}
          </template>
          <template v-else>
            {{ row.bookingPiece || "-" }} / {{ row.bookingWeight || "-" }} /
            {{ row.bookingCbm || "-" }}
          </template>
        </template>
        <template #bookingPrice="{ row, index }">
          <div v-auth-field:[row.bookingPrice]="['101140_FC']">
            <span v-if="!row.showEdit">{{ row.bookingPrice }}</span>
            <input
              v-else
              class="table-input"
              v-model.trim="row.bookingPrice"
              size="mini"
              :disabled="row.bookingPriceDisabled || row.cancelOrderDisabled"
              placeholder="单价"
              clearable
              @input="
                inputHandler({
                  key: 'bookingPrice',
                  index,
                  val: row.bookingPrice,
                })
              "
              @change="
                changeHandler({
                  key: 'bookingPrice',
                  index,
                  val: row.bookingPrice,
                })
              "
            />
          </div>
        </template>
        <template #bubblePoint="{ row }">
          <div v-auth-field:[row.bubblePointText]="['101150_FC']">
            <span v-if="!row.showEdit">{{ row.bubblePointText }}</span>
            <el-select
              v-else
              v-model="row.bubblePoint"
              size="mini"
              placeholder="分泡比例"
              :disabled="row.bubblePointDisabled || row.cancelOrderDisabled"
            >
              <el-option
                v-for="item in bubblePoints"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </template>
        <template #agent="{ row, index }">
          <div v-auth-field:[row.agentName]="['101160_FC']">
            <span v-if="!row.showEdit">{{ row.agentName }}</span>
            <dc-select
              v-else
              v-model="row.agentId"
              size="mini"
              filterable
              remote
              :disabled="row.agentDisabled || row.cancelOrderDisabled"
              :remote-method="getAgentList"
              placeholder="代理"
              @change="(val) => agentChange(val, index)"
            >
              <el-option
                v-for="item in agentList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </dc-select>
          </div>
        </template>
        <template #payWay="{ row }">
          <div v-auth-field:[row.payWayText]="['104000_FC']">
            <span v-if="!row.showEdit">{{ row.payWayText }}</span>
            <el-select
              v-else
              v-model="row.payWay"
              size="mini"
              :disabled="row.cancelOrderDisabled"
              placeholder="结算方式"
            >
              <el-option
                v-for="item in row.payWays"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-show="item.show"
              >
              </el-option>
            </el-select>
          </div>
        </template>
        <template #pscs="{ row, index }">
          <div v-auth-field:[row.pscsName]="['105020_FC']">
            <span v-if="!row.showEdit">{{ row.pscsName }}</span>
            <dc-select
              v-else
              v-model="row.pscsId"
              size="mini"
              filterable
              :disabled="row.cancelOrderDisabled"
              placeholder="售前客服"
              @change="(val) => pscsChange(val, index)"
            >
              <el-option
                v-for="item in pscsList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-show="item.show"
              />
            </dc-select>
          </div>
        </template>
        <template #principal="{ row, index }">
          <div v-auth-field:[row.principalName]="['105030_FC']">
            <span v-if="!row.showEdit">{{ row.principalName }}</span>
            <dc-select
              v-else
              v-model="row.principalId"
              size="mini"
              filterable
              :disabled="row.cancelOrderDisabled"
              placeholder="航线"
              @change="(val) => principalChange(val, index)"
            >
              <el-option
                v-for="item in principalList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-show="item.show"
              />
            </dc-select>
          </div>
        </template>
        <template #mscs="{ row, index }">
          <div v-auth-field:[row.mscsName]="['105035_FC']">
            <span v-if="!row.showEdit">{{ row.mscsName }}</span>
            <dc-select
              v-else
              v-model="row.mscsId"
              size="mini"
              filterable
              placeholder="操作"
              :disabled="row.cancelOrderDisabled"
              @change="(val) => mscsChange(val, index)"
            >
              <el-option
                v-for="item in mscsList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-show="item.show"
              />
            </dc-select>
          </div>
        </template>
        <template #checkStatus="{ row }">
          <p
            :style="{ color: row.checkStatusColor }"
            v-auth-field:[row.checkStatusText]="['105140_FC']"
          >
            {{ row.checkStatusText }}
          </p>
        </template>
        <template #singleWoStatus="{ row }">
          <p
            :style="{ color: row.singleWoStatusColor }"
            v-auth-field:[row.singleWoStatusText]="['105142_FC']"
          >
            {{ row.singleWoStatusText }}
          </p>
        </template>
          <template #apFeeStatus="{ row }">
          <p
          v-auth-field:[row.apFeeStatusText]="['105148_FC']"
          >
            {{ row.apFeeStatusText }}
          </p>
        </template>
        <template #financeStatus="{ row }">
          <p
            :style="{ color: row.financeStatusColor }"
            v-auth-field:[row.financeStatusText]="['105144_FC']"
          >
            {{ row.financeStatusText }}
          </p>
        </template>
        <template #invoicingStatus="{ row }">
          <p
            :style="{ color: row.invoicingStatusColor }"
            v-auth-field:[row.invoicingStatusText]="['105146_FC']"
          >
            {{ row.invoicingStatusText }}
          </p>
        </template>
        <template #costPrice="{ row, index }">
          <div v-auth-field:[row.costPrice]="['101525_FC']">
            <span v-if="!row.showEdit">{{ row.costPrice }}</span>
            <input
              v-else
              class="table-input"
              v-model.trim="row.costPrice"
              size="mini"
              :disabled="row.costPriceDisabled || row.cancelOrderDisabled"
              placeholder="单价"
              clearable
              @input="
                inputHandler({
                  key: 'costPrice',
                  index,
                  val: row.costPrice,
                })
              "
              @change="
                changeHandler({
                  key: 'costPrice',
                  index,
                  val: row.costPrice,
                })
              "
            />
          </div>
        </template>
        <template #ownRote="{ row }">
          <div v-auth-field:[row.ownRoteText]="['101529_FC']">
            <span v-if="!row.showEdit">{{ row.ownRoteText }}</span>
            <el-select
              v-else
              v-model="row.ownRote"
              size="mini"
              placeholder="分泡比例"
              :disabled="row.ownRoteDisabled || row.cancelOrderDisabled"
            >
              <el-option
                v-for="item in ownRotes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </template>
        <template #sysOrgName="{ row }">
          <div v-auth-field:[row.sysOrgName]="['101531_FC']"></div>
        </template>
        <template #costBubblePoint="{ row }">
          <div v-auth-field:[row.costBubblePointText]="['101533_FC']">
            <span v-if="!row.showEdit">{{ row.costBubblePointText }}</span>
            <el-select
              v-else
              v-model="row.costBubblePoint"
              size="mini"
              placeholder="分泡比例"
              :disabled="row.bubblePointDisabled || row.cancelOrderDisabled"
            >
              <el-option
                v-for="item in bubblePoints"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </template>
        <template #customerResponsibleName="{ row }">
          <div v-auth-field:[row.customerResponsibleName]="['101535_FC']"></div>
        </template>
        <template #actions="{ row, index }">
          <el-button
            v-if="!row.showEdit && row.showSaveOrderBtn"
            type="primary"
            size="mini"
            @click="list[index].showEdit = true"
            >编辑</el-button
          >
          <el-button
            v-if="row.showEdit && row.showSaveOrderBtn"
            v-auth:none="['152001_B']"
            type="primary"
            size="mini"
            @click="actionHandler('saveOrder', row)"
            >保存</el-button
          >
          <el-popover
            placement="bottom-end"
            trigger="click"
            popper-class="action-popover-menu"
          >
            <div
              v-for="item in row.orderActions"
              :key="item.name"
              style="margin: 6px 0; text-align: right"
            >
              <el-button
                :type="item.type || 'primary'"
                size="mini"
                @click="actionHandler(item.action, row)"
                :disabled="item.disabled"
                >{{ item.label }}</el-button
              >
            </div>
            <el-button
              type="primary"
              size="mini"
              slot="reference"
              v-if="row.orderActions.length > 0"
              >更多<i class="el-icon-caret-bottom el-icon--right"></i
            ></el-button>
          </el-popover>
        </template>
      </dc-table>
    </main>
    <footer class="order-footer dc-custom-shadow">
      <div class="total-info">
        <span v-show="showSumInfoItem.orderVols"
          >订单量:
          <span v-auth-field-list:[sumInfo.orderVols]="['106000_FC']">{{
            sumInfo.orderVols
          }}</span></span
        >
        <span v-show="showSumInfoItem.vols"
          >正常单/取消单:
          <span v-auth-field-list:[sumInfo.vols]="['106010_FC']"></span>
        </span>
        <span v-show="showSumInfoItem.normalCws"
          >正常单计费重:
          <span v-auth-field-list:[sumInfo.normalCws]="['106020_FC']"></span
        ></span>
        <span v-show="showSumInfoItem.arCnys"
          >应收总计:
          <span v-auth-field-list:[sumInfo.arCnys]="['106025_FC']"></span
        ></span>
        <span v-show="showSumInfoItem.apCnys"
          >应付总计:
          <span v-auth-field-list:[sumInfo.apCnys]="['106030_FC']"></span
        ></span>
        <span v-show="showSumInfoItem.profits"
          >利润:
          <span v-auth-field-list:[sumInfo.profits]="['106035_FC']"></span
        ></span>
        <span v-show="showSumInfoItem.arWoCny"
          >应收已核销人民币:
          <span v-auth-field-list:[sumInfo.arWoCny]="['106040_FC']"></span
        ></span>
        <span v-show="showSumInfoItem.arUnWoCny"
          >应收未核销人民币:
          <span v-auth-field-list:[sumInfo.arUnWoCny]="['106051_FC']"></span
        ></span>
      </div>
      <div class="order-pagination">
        <el-pagination
          style="margin-left: auto"
          :total="total"
          :current-page="form.pageNum"
          :page-size="form.pageSize"
          @current-change="currentPageChange"
          @size-change="pageSizeChange"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40, 50]"
        />
      </div>
    </footer>
    <el-dialog
      class="export-bill-dialog"
      title="请选择账单导出格式"
      :close-on-click-modal="false"
      :visible.sync="showExportBillDialog"
    >
      <el-radio-group v-model="exportBillType">
        <!-- <el-radio :label="1">pdf格式</el-radio> -->
        <el-radio :label="2">excel格式</el-radio>
      </el-radio-group>
      <span slot="footer">
        <el-button @click="showExportBillDialog = false">取 消</el-button>
        <el-button type="primary" @click="exportBill">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import DcStatus from "@/status";
const PAGE_NUM = 1;
const PAGE_SIZE = 10;
export default {
  name: "orderManageNew",
  created() {
    this.init();
  },
  mounted() {
    window.addEventListener("resize", this.getTableHeight);
  },
  activated() {
    if (!this.isRunActivated) {
      this.isRunActivated = true;
      return;
    }
    window.addEventListener("resize", this.getTableHeight);
    this.currentPageChange();
  },
  deactivated() {
    window.removeEventListener("resize", this.getTableHeight);
  },
  beforeDestroy() {
    this.setIntervalTimer(false);
    window.removeEventListener("resize", this.getTableHeight);
  },
  data() {
    const { bubblePoints, payWays, ownRotes } = DcStatus.commonStatus;
    return {
      isRunActivated: false,
      bubblePoints,
      payWays,
      showAllSearch: false,
      showExportBillDialog: false,
      exportBillType: 2, // 1 pdf | 2 excel
      tableLoading: false,
      list: [],
      sumInfo: {
        orderVols: "",
        vols: "",
        normalCws: "",
        arCnys: "",
        apCnys: "",
        profits: "",
        arWoCny: "",
        arUnWoCny: "",
      },
      total: 0,
      columns: [
        {
          prop: "orderNo",
          label: "订单号",
          fixed: "left",
          "min-width": "140",
          authFieldCodes: ["105010_FC"],
        },
        {
          prop: "pol",
          label: "起运港",
          fixed: "left",
          "min-width": "100",
          authFieldCodes: ["101010_FC"],
        },
        {
          prop: "pod",
          label: "目的港",
          fixed: "left",
          "min-width": "100",
          authFieldCodes: ["101020_FC"],
        },
        {
          prop: "departureDate",
          label: "航班日期",
          fixed: "left",
          "min-width": "140",
          authFieldCodes: ["101040_FC"],
        },
        {
          prop: "waybillNo",
          label: "提单号",
          fixed: "left",
          "min-width": "140",
          authFieldCodes: ["105000_FC"],
        },
        {
          prop: "companyName",
          label: "客户",
          fixed: "left",
          "min-width": "150",
          authFieldCodes: ["101000_FC"],
        },
        {
          prop: "agent",
          label: "代理",
          "min-width": "160",
          authFieldCodes: ["101160_FC"],
        },
        {
          prop: "pscs",
          label: "售前客服",
          "min-width": "120",
          authFieldCodes: ["105020_FC"],
        },
        {
          prop: "principal",
          label: "航线",
          "min-width": "120",
          authFieldCodes: ["105030_FC"],
        },
        {
          prop: "mscs",
          label: "操作",
          "min-width": "120",
          authFieldCodes: ["105035_FC"],
        },
        {
          prop: "orderTime",
          label: "下单时间",
          "min-width": "160",
          authFieldCodes: ["105120_FC"],
        },
        {
          prop: "statusDesc",
          label: "订单状态",
          "min-width": "150",
          authFieldCodes: ["105135_FC"],
        },
        {
          prop: "flightNo",
          label: "航班号",
          "min-width": "160",
          authFieldCodes: ["105050_FC"],
        },
        {
          prop: "airCompanyCode",
          label: "航司",
          "min-width": "80",
          authFieldCodes: ["101030_FC"],
        },
        {
          prop: "subWaybillNo",
          label: "分单号",
          "min-width": "160",
          authFieldCodes: ["105005_FC"],
        },
        {
          prop: "cargoName",
          label: "品名",
          "min-width": "100",
          authFieldCodes: ["101110_FC"],
          showEllipsis: true,
        },
        {
          prop: "jmt",
          label: "件.毛.体",
          "min-width": "100",
          authFieldCodes: ["101080_FC"],
        },
        {
          prop: "bookingPrice",
          label: "单价",
          "min-width": "100",
          authFieldCodes: ["101140_FC"],
        },
        {
          prop: "bubblePoint",
          label: "分泡比例",
          "min-width": "100",
          authFieldCodes: ["101150_FC"],
        },
        {
          prop: "payWay",
          label: "单票结算方式",
          "min-width": "120",
          authFieldCodes: ["104000_FC"],
        },
        {
          prop: "accountWarning",
          label: "账期预警信息",
          "min-width": "120",
          authFieldCodes: ["104035_FC"],
        },
        {
          prop: "totalArCny",
          label: "应收总金额",
          "min-width": "100",
          authFieldCodes: ["104040_FC"],
        },
        {
          prop: "totalApCny",
          label: "应付总金额",
          "min-width": "100",
          authFieldCodes: ["104055_FC"],
        },
        {
          prop: "invoicedAmount",
          label: "已开票金额",
          "min-width": "100",
          authFieldCodes: ["104045_FC"],
        },
        {
          prop: "totalRcWoCny",
          label: "已核销金额",
          "min-width": "100",
          authFieldCodes: ["104050_FC"],
        },
        {
          prop: "checkStatus",
          label: "应收对账状态",
          "min-width": "150",
          authFieldCodes: ["105140_FC"],
        },
        {
          prop: "singleWoStatus",
          label: "应收核销状态",
          "min-width": "150",
          authFieldCodes: ["105142_FC"],
        },
        {
          prop: "apFeeStatus",
          label: "应付对账状态",
          "min-width": "150",
          authFieldCodes: ["105148_FC"],
        },
        {
          prop: "financeStatus",
          label: "交单状态",
          "min-width": "150",
          authFieldCodes: ["105144_FC"],
        },
        {
          prop: "invoicingStatus",
          label: "开票状态",
          "min-width": "150",
          authFieldCodes: ["105146_FC"],
        },
        {
          prop: "costPrice",
          label: "成本价 (航线报价)",
          "min-width": "150",
          authFieldCodes: ["101525_FC"],
        },
        {
          prop: "ownRote",
          label: "是否为自有航线",
          "min-width": "150",
          authFieldCodes: ["101529_FC"],
        },
        {
          prop: "sysOrgName",
          label: "订单所属公司",
          "min-width": "150",
          authFieldCodes: ["101531_FC"],
        },
        {
          prop: "costBubblePoint",
          label: "分泡 (成本)",
          "min-width": "150",
          authFieldCodes: ["101533_FC"],
        },
        {
          prop: "customerResponsibleName",
          label: "客户负责人",
          "min-width": "150",
          authFieldCodes: ["101535_FC"],
        },
        {
          prop: "actions",
          label: "操作",
          fixed: "right",
          "min-width": "150",
        },
      ],
      form: {
        orderNo: "",
        waybillNo: "",
        inboundNo: "",
        pol: "",
        pod: "",
        agentId: "",
        companyId: "",
        pageNum: PAGE_NUM,
        pageSize: PAGE_SIZE,
        pscsId: "",
        mscsId: "",
        principalId: "",
        financeStatus: "",
        invoicingStatus: "",
        rcvWriteOffStatus: "",
        rcvCheckStatus: "",
        airCompanyCode: "",
        sysOrgId: "",
        ownRote: "",
        customerResponsibleId: "",
        apFeeStatus:''
      },
      sysOrgs: [],
      ownRotes,
      departureDates: ["", ""],
      orderTimes: ["", ""],
      agentList: [],
      searchAgentList: [],
      portalUsers: [],
      principalList: [], // 航线负责人列表
      pscsList: [], // 售前列表
      mscsList: [], // 售中列表
      pols: [],
      pods: [],
      airCompanys: [],
      tableHeight: 200,
      apFeeStatusList:[
        { value: 0, label: "未对账" },
        { value: 1, label: "已对账" },
        { value: 2, label: "修改中" },
      ],
      rcvCheckStatusList: [
        { value: 1, label: "未对账" },
        { value: 2, label: "部分对账" },
        { value: 3, label: "已对账" },
      ], // 对账
      rcvWriteOffStatusList: [
        { value: 1, label: "未核销" },
        { value: 2, label: "部分核销" },
        { value: 3, label: "已核销" },
      ], // 核销
      financeStatusList: [
        { value: 0, label: "未交单" },
        { value: 1, label: "已交单" },
        { value: 2, label: "解锁待审核" },
        { value: 3, label: "交单待审核" },
        { value: 4, label: "修改中" },
      ], // 交单
      invoicingStatusList: [
        { value: 0, label: "未开票" },
        { value: 1, label: "部分开票" },
        { value: 2, label: "已开票" },
      ], // 开票
      timerSwitch: false, // 定时刷新开关
      intervalTimer: null, // 定时刷新定时器
      currentCountDown: 0, // 定时刷新倒计时,单位毫秒 (当前)
      countDown: 30 * 1000, // 定时刷新倒计时,单位毫秒 (当前)
      timestampKey: 0,
      customerResponsibles: [],
    };
  },
  computed: {
    ifAdminLogin(){
      return JSON.parse(sessionStorage.getItem('userInfo')).loginName == 'admin'
    },
    showTypeCodeSelect() {
      return this.typeCode === "" && !this.fettle;
    },
    currentCountDownText() {
      return `${this.currentCountDown / 1000}s 后刷新`;
    },
    allSearchIcon() {
      const icon = this.showAllSearch ? "doubleArrowUp" : "doubleArrowDown";
      return {
        src: require(`../../assets/${icon}.png`),
      };
    },
    startDepartureDate() {
      return this.departureDates ? this.departureDates[0] : "";
    },
    endDepartureDate() {
      return this.departureDates ? this.departureDates[1] : "";
    },
    startOrderTime() {
      return this.orderTimes ? this.orderTimes[0] : "";
    },
    endOrderTime() {
      return this.orderTimes ? this.orderTimes[1] : "";
    },
    searchForm() {
      const {
        form,
        startDepartureDate,
        endDepartureDate,
        startOrderTime,
        endOrderTime,
        typeCode,
        fettle,
        openStatus,
      } = this;
      return {
        ...form,
        startDepartureDate,
        endDepartureDate,
        startOrderTime,
        endOrderTime,
        typeCode,
        fettle,
        openStatus,
      };
    },
    typeCode() {
      return this.$route.meta.typeCode;
    },
    openStatus() {
      return this.$route.meta.openStatus;
    },
    fettle() {
      return this.$route.meta.fettle;
    },
    showSumInfoItem() {
      const { getAuthFieldListStatus } = this;
      return {
        orderVols: getAuthFieldListStatus(["106000_FC"]).list,
        vols: getAuthFieldListStatus(["106010_FC"]).list,
        normalCws: getAuthFieldListStatus(["106020_FC"]).list,
        arCnys: getAuthFieldListStatus(["106025_FC"]).list,
        apCnys: getAuthFieldListStatus(["106030_FC"]).list,
        profits: getAuthFieldListStatus(["106035_FC"]).list,
        arWoCny: getAuthFieldListStatus(["106040_FC"]).list,
        arUnWoCny: getAuthFieldListStatus(["106051_FC"]).list,
      };
    },
    computedColumns() {
      return this.columns.filter((item) => {
        return this.getAuthFieldListStatus(item.authFieldCodes).list;
      });
    },
    departureDatePickerOptions() {
      return {
        disabledDate: (time) => {
          return time.getTime() < new Date().getTime() - 24 * 60 * 60 * 1000;
        },
      };
    },
    computedList() {
      return this.list.map((order) => {
        const {
          id,
          status,
          aboveQuotaFlag,
          bubblePoint,
          ownRote,
          costBubblePoint,
          payWay,
          checkStatus,
          singleWoStatus,
          financeStatus,
          invoicingStatus,
          canPriceChange,
          inboundStatus,
          totalRcWoCny,
          invoicedAmount,
          activityCodeDone,
          openStatus,
          payWayVO,
          apFeeStatus
        } = order;
        const checkStatusObj =
          {
            0: {
              label: "未对账",
            },
            1: {
              label: "部分对账",
            },
            2: {
              label: "已对账",
              color: "#32CD32",
            },
            3: {
              label: "账单已发送，待确认",
              color: "#f69e56",
            },
            4: {
              label: "账单已修改，待确认",
            },
          }[checkStatus] || {};
        const singleWoStatusObj =
          {
            0: {
              label: "未核销",
            },
            1: {
              label: "部分核销",
              priceText: `￥${totalRcWoCny}`,
            },
            2: {
              label: "已核销",
              color: "#32CD32",
            },
          }[singleWoStatus] || {};
          const apFeeStatusObj =
          {
            0: {
              label: "未对账",
            },
            1: {
              label: "已对账",
            },
            2: {
              label: "修改中",
            },
          }[apFeeStatus] || {};
        const financeStatusObj =
          {
            0: {
              label: "未交单",
            },
            1: {
              label: "已交单",
              color: "#32CD32",
            },
            2: {
              label: "申请解锁",
            },
            3: {
              label: "解锁待审核",
            },
            4: {
              label: "修改中",
            },
          }[financeStatus] || {};
        const invoicingStatusObj =
          {
            0: {
              label: "未开票",
            },
            1: {
              label: "部分开票",
              priceText: `￥${invoicedAmount}`,
            },
            2: {
              label: "已开票",
              color: "#32CD32",
            },
          }[invoicingStatus] || {};
        const orderStatus = DcStatus.orderStatus[status];
        const _actions = Array.isArray(orderStatus.actions)
          ? orderStatus.actions
          : orderStatus.actions[activityCodeDone];
        const isFreezedOrder = openStatus === 0;
        const payWays = this.payWays.map((item) => {
          return {
            ...item,
            show: payWayVO?payWayVO.payWayEnumList
              .map((p) => p.key)
              .includes(item.value):[],
          };
        });
        const {
          polDisabled,
          podDisabled,
          departureDateDisabled,
          flightNoDisabled,
          airCompanyDisabled,
          waybillNoDisabled,
          subWaybillNoDisabled,
          bookingPriceDisabled,
          bubblePointDisabled,
          costBubblePointDisabled,
          cancelOrderDisabled,
          costPriceDisabled,
          agentDisabled,
        } = this.$utils.getOrderDisableds(order);
        return {
          ...order,
          payWays,
          isFreezedOrder,
          timestampKeyId: `${this.timestampKey}-${id}`,
          checkStatusText: `${checkStatusObj.label || ""}${
            checkStatusObj.priceText || ""
          }`,
          checkStatusColor: checkStatusObj.color,
          singleWoStatusText: `${singleWoStatusObj.label || ""}${
            singleWoStatusObj.priceText || ""
          }`,
          apFeeStatusText:`${apFeeStatusObj.label || ""}`,
          singleWoStatusColor: singleWoStatusObj.color,
          financeStatusText: `${financeStatusObj.label || ""}${
            financeStatusObj.priceText || ""
          }`,
          financeStatusColor: financeStatusObj.color,
          invoicingStatusText: `${invoicingStatusObj.label || ""}${
            invoicingStatusObj.priceText || ""
          }`,
          invoicingStatusColor: invoicingStatusObj.color,
          showInboundSuccess: (() => {
            if (status === 21 && inboundStatus === 2) {
              return true;
            }
            return false;
          })(),
          showAboveQuotaFlagText: aboveQuotaFlag === 1, // 0=未超额 | 1=已超额
          bubblePointText: (() => {
            const bubblePointObj = DcStatus.commonStatus.getStatus(
              "bubblePoints",
              bubblePoint
            );
            return (bubblePointObj || {}).label;
          })(),
          ownRoteText: (() => {
            const ownRoteObj = DcStatus.commonStatus.getStatus(
              "ownRotes",
              ownRote
            );
            return (ownRoteObj || {}).label;
          })(),
          costBubblePointText: (() => {
            const bubblePointObj = DcStatus.commonStatus.getStatus(
              "bubblePoints",
              costBubblePoint
            );
            return (bubblePointObj || {}).label;
          })(),
          payWayText: (() => {
            const payWayObj = DcStatus.commonStatus.getStatus(
              "payWays",
              payWay
            );
            return (payWayObj || {}).label;
          })(),
          polDisabled,
          podDisabled,
          departureDateDisabled,
          flightNoDisabled,
          airCompanyDisabled,
          waybillNoDisabled,
          subWaybillNoDisabled,
          bookingPriceDisabled,
          bubblePointDisabled,
          costBubblePointDisabled,
          cancelOrderDisabled,
          costPriceDisabled,
          agentDisabled,
          showSaveOrderBtn:
            (() => {
              if (isFreezedOrder) {
                return false;
              }
              const { validEditAuthFieldCodes } = this.$store.getters;
              const saveOrder = _actions.find(
                (btn) => btn.action === "saveOrder"
              );
              if (saveOrder) {
                if (saveOrder.fieldAuth) {
                  return saveOrder.fieldAuth.every((code) =>
                    validEditAuthFieldCodes.includes(code)
                  );
                }
                return true;
              }
              return false;
            })() && this.$utils.authCheckHidden(["152001_B"]) === "visible",
          orderActions: [
            ...(() => {
              if (!status) {
                return [];
              }
              const orderStatus = DcStatus.orderStatus[status];
              if (!orderStatus || !_actions) {
                return [];
              }
              const { validEditAuthFieldCodes } = this.$store.getters;
              const actions = _actions.filter((item) => {
                if (!item.fieldAuth) {
                  return true;
                }
                return item.fieldAuth.every((code) =>
                  validEditAuthFieldCodes.includes(code)
                );
              });
              return actions;
            })()
              .map((btn) => {
                return {
                  ...btn,
                  disabled:
                    btn.action === "cancelOrder" &&
                    this.$utils.cancelOrderBtnDisabled(order),
                  roleAuthCode: {
                    saveOrder: ["152001_B"],
                    resolveOrder: ["152002_B"],
                    cancelOrder: ["152002_B"],
                    rejectOrder: ["152002_B"],
                    applyVoidOrder: ["152008_B"],
                  }[btn.action],
                };
              })
              .filter(
                (btn) =>
                  btn.action !== "saveOrder" &&
                  this.$utils.authCheckHidden(btn.roleAuthCode) === "visible" &&
                  !isFreezedOrder
              ),
            ...[
              {
                label: "发起解锁流程",
                action: "unlockFreezedOrder",
              },
              {
                label: "取消订单",
                type: "danger",
                action: "cancelOrder",
                roleAuthCode: ["152002_B"],
                disabled: this.$utils.cancelOrderBtnDisabled(order),
              },
            ].filter((btn) => isFreezedOrder),
          ],
        };
      });
    },
  },
  methods: {
    init() {
      this.getAgentList();
      this.getSearchAgentList();
      this.getCompanyList();
      this.getSystemUsersByRoleName({
        roleName: "售前客服",
        listName: "pscsList",
      });
      this.getSystemUsersByRoleName({
        roleName: "售中客服",
        listName: "mscsList",
      });
      this.getSystemUsersByRoleName({
        roleName: "航线负责人",
        listName: "principalList",
      });
      this.getThreeLetterCodes({ listName: "pols" });
      this.getThreeLetterCodes({ listName: "pods" });
      this.getAirCompanysByKeyWord();
      this.findThisUserAndBranchOrg();
      this.getUsersAndBranchOrg();
      this.getList();
    },
    exportOrderExeclBZY() {
      this.$http
        .get(this.$service.downNeedTimeExecl, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          let enc = new TextDecoder("utf-8");
          let uint8_msg = new Uint8Array(res); // 也可能是res.data
          let str = enc.decode(uint8_msg);
          if (str.indexOf("code") > -1) {
            let copyStr = JSON.parse(str);
            if (copyStr.code == 200) {
            } else {
              this.$message.error(copyStr.message);
              return;
            }
          }
          const aLink = document.createElement("a");
          let blob = new Blob([res], {
            type: "application/vnd.ms-excel",
          });
          aLink.href = URL.createObjectURL(blob);
          aLink.setAttribute("download", "明细列表" + ".xlsx"); // 设置下载文件名称
          aLink.click();
          document.body.appendChild(aLink);
          console.log("123123");
        });
    },
    async getList() {
      this.tableLoading = true;
      try {
        const {
          data: {
            data: { records, total, sumInfo },
          },
        } = await this.$api.orderSearchByPage({
          params: {
            ...this.searchForm,
          },
        });
        this.total = total;
        this.list = (records || []).map((item) => {
          return {
            ...item,
            showEdit: false,
          };
        });
        const {
          orderVols,
          normalVols,
          cancelledVols,
          normalCws,
          arCnys,
          apCnys,
          profits,
          arWoCny,
          arUnWoCny,
        } = sumInfo;
        this.sumInfo = {
          ...sumInfo,
          orderVols: orderVols && orderVols.toLocaleString("en-US"),
          vols:
            `${ normalVols && normalVols.toLocaleString(
              "en-US"
            )}/${cancelledVols && cancelledVols.toLocaleString("en-US")}`,
          normalCws: normalCws && normalCws.toLocaleString("en-US"),
          arCnys: arCnys && arCnys.toLocaleString("en-US"),
          apCnys: apCnys && apCnys.toLocaleString("en-US"),
          profits: profits && profits.toLocaleString("en-US"),
          arWoCny: arWoCny && arWoCny.toLocaleString("en-US"),
          arUnWoCny: arUnWoCny && arUnWoCny.toLocaleString("en-US"),
        };
        this.timestampKey = new Date().getTime();
      } catch (error) {
      } finally {
        this.$store.dispatch("getOrderCountInfo");
        this.tableLoading = false;
      }
    },
    pageSizeChange(size) {
      this.form.pageSize = size;
      this.getList();
    },
    currentPageChange(page) {
      this.form.pageNum = page || this.form.pageNum;
      this.getList();
    },
    // 代理列表搜索查询
    async getSearchAgentList(agentName = "") {
      try {
        const {
          data: {
            data: { records },
          },
        } = await this.$api.getAgentList({
          agentName,
          pageSize: 20,
          sceneFlag: 0,
        });
        this.searchAgentList = records.map((item) => {
          return {
            ...item,
            label: item.agentName,
            value: item.id,
          };
        });
      } catch (error) {}
    },
    // 代理列表查询
    async getAgentList(agentName = "") {
      try {
        const {
          data: {
            data: { records },
          },
        } = await this.$api.getAgentList({
          agentName,
          pageSize: 20,
          sceneFlag: 1,
        });
        this.agentList = records.map((item) => {
          return {
            ...item,
            label: item.agentName,
            value: item.id,
          };
        });
      } catch (error) {}
    },
    async getCompanyList(certificationBody = "") {
      try {
        const {
          data: { data },
        } = await this.$api.getCompanyList(
          {},
          {
            params: {
              typeCode: 0,
            },
          }
        );
        this.portalUsers = data.map((item) => {
          return {
            label: item.companyName,
            value: item.id,
          };
        });
      } catch (error) {}
    },
    // 查询系统用户
    async getSystemUsersByRoleName({ roleName, listName }) {
      const {
        data: {
          data: { records },
        },
      } = await this.$api.getSystemUsersByRoleName({
        params: {
          roleName,
          pageSize: 9999,
          delFlag: 0,
        },
      });
      this[listName] = records.map((item) => {
        return {
          ...item,
          label: item.name,
          value: item.id,
          show: item.status === 0,
        };
      });
    },
    jump2detail(order) {
      this.$router.push({ name: "OrderDetailNew", query: { id: order.id } });
    },
    resetSearch() {
      Object.keys(this.form).forEach((key) => {
        switch (key) {
          case "pageNum":
            this.form[key] = PAGE_NUM;
            break;
          case "pageSize":
            this.form[key] = PAGE_SIZE;
            break;
          default:
            this.form[key] = "";
            break;
        }
      });
      this.departureDates = ["", ""];
      this.orderTimes = ["", ""];
      this.currentPageChange(1);
    },
    async getTableHeight() {
      await this.$nextTick();
      this.tableHeight = this.$refs.mainTable.offsetHeight;
    },
    async exportBill() {
      try {
        const {
          data: {
            data: { companyName: downloadCompanyName, xpath: downloadUrl },
          },
        } = await this.$api.exportCustomerBill({
          ...this.searchForm,
        });
        this.$utils.downloadFile({
          url: downloadUrl,
          name: `${downloadCompanyName}对账单`,
        });
      } catch (error) {
      } finally {
        this.showExportBillDialog = false;
      }
    },
    // 导出列表
    async exportOrderExecl() {
      try {
        const { data } = await this.$api.exportOrderExecl({
          params: {
            ...this.searchForm,
          },
          responseType: "arraybuffer",
        });
        this.$utils.exportBuffer({
          buffer: data,
          exportName: "全部订单列表.xlsx",
        });
      } catch (error) {}
    },
    rowClassName({ row, rowIndex }) {
      if (row.remindFlag === 1) {
        return "remind-row";
      }
    },
    async getThreeLetterCodes({ keyWord = "", listName }) {
      const {
        data: {
          data: { records },
        },
      } = await this.$api.getThreeLetterCodes({
        params: {
          keyWord,
        },
      });
      this[listName] = records.map((item) => {
        const { threeLetterCode, name, city, country } = item;
        return {
          ...item,
          label: threeLetterCode,
          value: threeLetterCode,
          detailText: `${threeLetterCode} - ${name} - ${city} - ${country}`,
        };
      });
    },
    // 查询航空公司 by keyWord (航司二字码/航司中文名称/数字码)
    async getAirCompanysByKeyWord(keyWord = "") {
      const {
        data: {
          data: { records },
        },
      } = await this.$api.getAirCompanysByKeyWord({
        params: {
          keyWord,
        },
      });
      this.airCompanys = records.map((item) => {
        return {
          ...item,
          label: `${item.airCompanyCode}-${item.name}`,
          value: item.airCompanyCode,
        };
      });
    },
    getAuthFieldListStatus(authFieldCodes = []) {
      const {
        validEditAuthFieldCodes,
        validViewAuthFieldCodes,
        validListAuthFieldCodes,
      } = this.$store.getters;
      const edit = authFieldCodes.every((code) =>
        validEditAuthFieldCodes.includes(code)
      );
      const view = authFieldCodes.every((code) =>
        validViewAuthFieldCodes.includes(code)
      );
      const list = authFieldCodes.every((code) =>
        validListAuthFieldCodes.includes(code)
      );
      return {
        edit,
        view,
        list,
      };
    },
    airCompanyChange(val, index) {
      const { value: airCompanyCode, name: airCompanyName } =
        this.airCompanys.find((item) => item.value === val);
      this.list.splice(index, 1, {
        ...this.list[index],
        airCompanyCode,
        airCompanyName,
      });
    },
    agentChange(val, index) {
      const { value: agentId, label: agentName } = this.agentList.find(
        (item) => item.value === val
      );
      this.list.splice(index, 1, {
        ...this.list[index],
        agentId,
        agentName,
      });
    },
    pscsChange(val, index) {
      const { value: pscsId, label: pscsName } = this.pscsList.find(
        (item) => item.value === val
      );
      this.list.splice(index, 1, {
        ...this.list[index],
        pscsId,
        pscsName,
      });
    },
    principalChange(val, index) {
      const { value: principalId, label: principalName } =
        this.principalList.find((item) => item.value === val);
      this.list.splice(index, 1, {
        ...this.list[index],
        principalId,
        principalName,
      });
    },
    mscsChange(val, index) {
      const { value: mscsId, label: mscsName } = this.mscsList.find(
        (item) => item.value === val
      );
      this.list.splice(index, 1, {
        ...this.list[index],
        mscsId,
        mscsName,
      });
    },
    async actionHandler(action, order) {
      switch (action) {
        case "saveOrder":
          try {
            await this.$confirm("确认要保存此次编辑?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "放弃",
              type: "warning",
            });
            this.saveOrder(order);
          } catch (error) {}
          break;
        case "retestOrder":
          try {
            await this.$confirm("是否确认本次操作?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "放弃",
              type: "warning",
            });
            this.executeOrder({ ctrlFlag: 3, order });
          } catch (error) {}
          break;
        case "resolveOrder":
          try {
            await this.$confirm("确认要保存此次编辑?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "放弃",
              type: "warning",
            });
            this.executeOrder({ ctrlFlag: 1, order });
          } catch (error) {}
          break;
        case "cancelOrder":
          try {
            await this.$confirm("确认要取消订单?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "放弃",
              type: "warning",
            });
            this.executeOrder({ ctrlFlag: 2, order });
          } catch (error) {}
          break;
        case "rejectOrder":
          try {
            await this.$confirm("确认要进行该操作?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "放弃",
              type: "warning",
            });
            this.executeOrder({ ctrlFlag: 2, order });
          } catch (error) {}
          break;
        case "applyVoidOrder":
          try {
            await this.$confirm("确认要作废订单?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "放弃",
              type: "warning",
            });
            this.applyVoidOrder(order);
          } catch (error) {}
          break;
        case "unlockFreezedOrder":
          try {
            await this.$alert(
              "该功能暂未上线，请直接联系管理员说明情况并解锁！",
              "提示",
              {
                confirmButtonText: "确定",
              }
            );
          } catch (error) {}

          break;
        default:
          this.$message.error("未定义操作事件");
          break;
      }
    },
    // 保存订单
    async saveOrder(order) {
      try {
        const {
          data: {
            data: { excessInfo },
          },
        } = await this.$api.saveOrder({
          order: {
            ...order,
          },
        });
        if (excessInfo) {
          try {
            await this.$confirm(excessInfo.message, `提示`, {
              confirmButtonText: "联系客户",
              cancelButtonText: "确认",
            });
            const tagA = document.createElement("a");
            tagA.href = `tencent://message/?uin=${excessInfo.customerQq}&Menu=yes&Service=300&sigT=42a1e5347953b64c5ff3980f8a6e644d4b31456cb0b6ac6b27663a3c4dd0f4aa14a543b1716f9d45`;
            tagA.click();
          } catch (error) {}
        } else {
          this.$message.success("保存成功");
        }
        this.currentPageChange();
      } catch (error) {
        return Promise.reject();
      } finally {
      }
    },
    // 推进订单状态 ctrlFlag 正常分支1 | 异常分支2 | 复测分支3
    async executeOrder({ ctrlFlag, order }) {
      try {
        const {
          data: {
            data: { excessInfo },
          },
        } = await this.$api.executeOrder({
          order: {
            ...order,
          },
          ctrlMap: {
            ctrlFlag,
          },
        });
        if (excessInfo) {
          try {
            await this.$confirm(excessInfo.message, `提示`, {
              confirmButtonText: "联系客户",
              cancelButtonText: "确认",
            });
            const tagA = document.createElement("a");
            tagA.href = `tencent://message/?uin=${excessInfo.customerQq}&Menu=yes&Service=300&sigT=42a1e5347953b64c5ff3980f8a6e644d4b31456cb0b6ac6b27663a3c4dd0f4aa14a543b1716f9d45`;
            tagA.click();
          } catch (error) {}
        } else {
          this.$message.success("操作成功");
        }
        this.currentPageChange();
      } catch (error) {
      } finally {
      }
    },
    async applyVoidOrder(order) {
      try {
        await this.$api.applyVoidOrder(
          {},
          {
            params: {
              orderId: order.id,
            },
          }
        );
        this.$message.success("操作成功");
        this.currentPageChange();
      } catch (error) {
      } finally {
      }
    },
    inputHandler({ key, index, val: newVal, formatKey }) {
      formatKey = formatKey || key;
      const listItem = this.list[index];
      const oldVal = listItem[key];
      const val = this.$utils.getValidNumber({
        format: DcStatus.numberFormat[formatKey],
        newVal,
        oldVal,
      });
      this.list.splice(index, 1, {
        ...listItem,
        [key]: String(val).trim(),
      });
    },
    changeHandler({ key, index, val }) {
      const listItem = this.list[index];
      if (Number(val) === 0) {
        this.list.splice(index, 1, {
          ...listItem,
          [key]: "",
        });
        return;
      }
    },
    // 定时刷新|毫秒
    setIntervalTimer(begin) {
      clearInterval(this.intervalTimer);
      if (!begin) {
        return;
      }
      this.currentCountDown = this.countDown;
      this.intervalTimer = setInterval(() => {
        this.currentCountDown -= 1000;
        if (this.currentCountDown < 0) {
          this.currentCountDown = 0;
          this.currentPageChange();
          this.currentCountDown = this.countDown;
          this.setIntervalTimer(true);
        }
      }, 1000);
    },
    jump2addOrder() {
      this.$router.push({ name: "AddOrder" });
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
    async getUsersAndBranchOrg() {
      try {
        const {
          data: { data },
        } = await this.$api.getUsersAndBranchOrg();
        this.customerResponsibles = data.map((item) => {
          return {
            value: item.id,
            label: item.name,
            longLabel: `${item.name} ${item.branchNames}`,
          };
        });
      } catch (error) {}
    },
    //航线日期导入
    async importAirDate(){
      const files = await this.$utils.loadFile({
        accept: ".xls,.xlsx",
      });
      const file = files[0];
      const maxSize = 5;
      if (file.size > 1024 * 1024 * maxSize) {
        this.$message.error(`文件大小不能超过${maxSize}M`);
        return;
      }
      const fileFormData = new FormData();
      fileFormData.append("file", file);
      const { data } = await this.$api.updateDepartureDate(fileFormData,{responseType: "arraybuffer"})
        this.$utils.exportBuffer({
          buffer: data,
          exportName: "导入失败文件.xlsx",
          resolve:function(){this.$message.success("导入成功")}.bind(this),
          callback:function(){this.$message.error("文件数据导入失败")}.bind(this)
        });
        this.getList()
    }
  },
  watch: {
    list() {
      this.getTableHeight();
    },
    showAllSearch() {
      this.getTableHeight();
    },
  },
};
</script>

<style lang="less" scoped>
.order-manage-new {
  display: flex;
  flex-direction: column;
  padding: 20px 20px 0 20px;
  height: calc(100vh - 101px);
  background: #f3f6f9;
  .order-search {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    padding-right: 30px;
    /deep/.el-form-item__content {
      margin-right: 20px;
      min-width: 170px;
    }
  }
  .order-actions {
    display: flex;
    // justify-content: flex-end;
    /deep/.el-form-item__content {
      margin-right: 20px;
    }
  }
  .main-table {
    flex: 1;
    min-height: 0;
  }
  /deep/.el-table__fixed-right-patch {
    background: #2273ce;
    height: 50px !important;
  }
  .order-footer {
    padding: 20px;
    background: #fff;
    .total-info {
      display: flex;
      flex-wrap: wrap;
      font-size: 14px;
      line-height: 20px;
      font-weight: bold;
      span {
        margin-right: 30px;
      }
    }
    .order-pagination {
      margin-top: 10px;
      display: flex;
      align-items: center;
    }
  }
  .export-bill-dialog {
    /deep/.el-dialog {
      width: 400px;
      min-width: auto;
    }
    /deep/.el-dialog__body {
      text-align: center;
      padding: 30px 20px 20px;
    }
    /deep/.el-dialog__footer {
      text-align: center;
      padding: 10px 20px 20px;
    }
  }
  /deep/.el-table__row.remind-row td {
    background-color: #fb998e;
  }
  .all-search-icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
  }
  .table-input {
    border: 1px solid #e5e5e5 !important;
    box-sizing: border-box;
    width: 100%;
    padding: 0 15px;
    height: 28px;
    line-height: 28px;
    font-size: 12px;
    &:disabled {
      color: #c0c4cc;
      background-color: #f5f7fa;
      cursor: not-allowed;
    }
    &::placeholder {
      // font-size: 12px;
    }
  }
  .order-actions {
    margin-bottom: -15px;
  }
  .search-form {
    padding: 10px;
    background: #fff;
  }
  .count-down-time {
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .freeze-reason {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: red;
  }
}
</style>