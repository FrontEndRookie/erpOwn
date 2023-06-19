<template>
  <!-- 新建订单 -->
  <div class="add-order">
    <div class="add-order-wrap">
      <dc-form
        ref="form"
        :model="form"
        :rules="computedRules"
        size="mini"
        label-position="top"
        :validate-on-rule-change="false"
      >
        <order-section-container title="客户基本信息" style="margin-top: 0">
          <div class="flex-row base-row">
            <el-form-item
              label="订舱客户"
              prop="companyName"
              class="flex-form-item"
            >
              <dc-select
                v-model="form.companyName"
                filterable
                remote
                placeholder="客户"
                :remote-method="(query) => (customerQuery = query)"
                clearable
                :popper-append-to-body="false"
                @change="customerChange"
              >
                <el-option
                  v-for="item in computedCustomers"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </dc-select>
            </el-form-item>
            <el-form-item
              label="客户负责人"
              prop="customerResponsibleName"
              class="flex-form-item"
            >
              <el-input
                v-model.trim="form.customerResponsibleName"
                placeholder="自动生成"
                disabled
                style="width: 172px"
              />
            </el-form-item>
            <el-form-item
              label="单票结算方式"
              prop="payWay"
              class="flex-form-item"
            >
              <el-select
                v-model="form.payWay"
                placeholder="单票结算方式"
                :popper-append-to-body="false"
              >
                <el-option
                  v-for="item in computedPayWays"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="订单所属公司"
              prop="sysOrgName"
              class="flex-form-item"
            >
              <el-select
                v-model="form.sysOrgName"
                placeholder="订单所属公司"
                :popper-append-to-body="false"
                @change="sysOrgChange"
              >
                <el-option
                  v-for="item in branchs"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="售前客服"
              prop="pscsName"
              class="flex-form-item"
            >
              <dc-select
                v-model="form.pscsName"
                filterable
                placeholder="请选择售前客服"
                :popper-append-to-body="false"
                @change="pscsChange"
              >
                <el-option
                  v-for="item in pscsList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </dc-select>
            </el-form-item>
          </div>
          <div v-if="customerDetail.id">
            <ul class="customer-infos">
              <li
                v-for="item in customerInfos.list"
                :key="item.label"
                class="info-item"
              >
                <span class="title" style="margin-right: 10px"
                  >{{ item.label }}:</span
                >
                <span>{{ item.value || "暂无" }}</span>
              </li>
            </ul>
            <div
              class="customer-status-text"
              :class="{ error: customerInfos.customerStatusError }"
            >
              {{ customerInfos.customerStatusText }}
            </div>
          </div>
          <div class="flex-row base-row" style="margin-top: 20px">
            <el-form-item label="客户托书" prop="file">
              <el-input v-model="form.file" style="display: none"></el-input>
              <template #label>
                <span>客户托书</span>
                <span style="color: #aaa"
                  >文件大小不超过10M，支持pdf、word、excel</span
                >
              </template>
              <div>
                <el-button
                  type="primary"
                  @click="uploadCustomNote"
                  v-if="!form.file"
                  >点击上传</el-button
                >
                <div class="upload-wrap" v-if="form.file">
                  <i
                    class="el-icon-success"
                    style="color: #67c23a; font-size: 20px"
                  ></i>
                  <el-tag
                    closable
                    type="info"
                    size="small"
                    class="file-row"
                    @close="form.file = null"
                  >
                    {{ form.file.attachmentName }}
                  </el-tag>
                </div>
              </div>
            </el-form-item>
          </div>
        </order-section-container>
        <order-section-container title="航线报价信息">
          <div class="flex-row base-row" style="margin-top: 20px">
            <el-form-item
              label="航班日期/Flight NO_Date"
              prop="departureDate"
              class="flex-form-item"
            >
              <el-date-picker
                v-model="form.departureDate"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择时间"
                :clearable="false"
                style="width: 172px"
                @change="departureDateChange"
              />
            </el-form-item>
            <el-form-item
              label="成本价 (航线报价)"
              prop="costPrice"
              class="flex-form-item"
            >
              <el-input
                v-model.trim="form.costPrice"
                placeholder="成本价"
                @change="
                  changeZeroHandler({
                    key: 'costPrice',
                  })
                "
                style="width: 200px"
              >
                <template slot="append">
                  <el-select
                    v-model="form.costCurrency"
                    placeholder="币种"
                    style="width: 100px"
                  >
                    <el-option
                      v-for="item in computedCurrencyTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    >
                      <span>{{ item.label }}</span>
                      <span
                        style="font-size: 12px; color: red"
                        v-if="item.disabled"
                        >暂未设置当月汇率，请联系管理员</span
                      >
                    </el-option>
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item
              label="杂费 (航线报价)"
              prop="miscellaneousFees"
              class="flex-form-item"
            >
              <el-input
                v-model.trim="form.miscellaneousFees"
                placeholder="杂费"
                disabled
                @change="
                  changeZeroHandler({
                    key: 'miscellaneousFees',
                  })
                "
                style="width: 172px"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item
              label="航线"
              prop="principalName"
              class="flex-form-item"
            >
              <dc-select
                v-model="form.principalName"
                filterable
                placeholder="请选择航线人员"
                :popper-append-to-body="false"
                @change="principalChange"
              >
                <el-option
                  v-for="item in principalList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </dc-select>
            </el-form-item>
            <el-form-item
              label="是否为自有航线"
              prop="ownRote"
              class="flex-form-item"
            >
              <dc-select
                v-model="form.ownRote"
                filterable
                placeholder="是否为自有航线"
                :popper-append-to-body="false"
              >
                <el-option
                  v-for="item in ownRotes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </dc-select>
            </el-form-item>
            <el-form-item
              label="分泡 (成本)"
              prop="costBubblePoint"
              class="flex-form-item"
            >
              <el-select
                v-model="form.costBubblePoint"
                placeholder="请选择分泡比例"
                :popper-append-to-body="false"
              >
                <el-option
                  v-for="item in bubblePoints"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </order-section-container>
        <order-section-container title="货物信息">
          <!-- 航班信息 -->
          <div class="flex-row base-row">
            <el-form-item
              label="始发站/Airport of departure"
              prop="pol"
              class="flex-form-item"
            >
              <dc-select
                v-model="form.pol"
                filterable
                remote
                placeholder="始发站"
                :popper-append-to-body="false"
                :remote-method="
                  (keyWord) =>
                    getThreeLetterCodes({ keyWord, listName: 'pols' })
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
            <el-form-item
              label="到达站/Airport of Destination"
              prop="pod"
              class="flex-form-item"
              ><dc-select
                v-model="form.pod"
                filterable
                remote
                placeholder="始发站"
                :popper-append-to-body="false"
                :remote-method="
                  (keyWord) =>
                    getThreeLetterCodes({ keyWord, listName: 'pods' })
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
            <el-form-item
              label="航司/Flight"
              prop="airCompany"
              class="flex-form-item"
            >
              <dc-select
                v-model="form.airCompany"
                filterable
                remote
                :remote-method="getAirCompanysByKeyWord"
                :popper-append-to-body="false"
                @change="airCompanyChange"
              >
                <el-option
                  v-for="item in airCompanys"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </dc-select>
            </el-form-item>
          </div>
          <!-- 发货人信息 -->
          <div class="flex-row base-row">
            <el-form-item
              label="发货人名称,地址和电话/Shipper's Name and Address /telephone"
              prop="shipper"
              style="flex: 1"
            >
              <el-input
                type="textarea"
                placeholder="发货人名称,地址和电话"
                maxlength="200"
                v-model="form.shipper"
              />
            </el-form-item>
            <el-form-item
              label="通知人/Notify Party"
              prop="notifier"
              style="flex: 1"
            >
              <el-input
                type="textarea"
                placeholder="通知人"
                maxlength="200"
                v-model="form.notifier"
              />
            </el-form-item>
          </div>
          <!-- 收货人信息 -->
          <div class="flex-row base-row">
            <el-form-item
              label="收货人名称,地址和电话/Consignee's Name and Address /telephone"
              prop="consignee"
              style="flex: 1"
            >
              <el-input
                type="textarea"
                placeholder="收货人名称,地址和电话"
                maxlength="200"
                v-model="form.consignee"
              />
            </el-form-item>
          </div>
          <!-- 订舱数据表格 -->
          <div class="flex-row">
            <booking-table style="flex: 1">
              <template #bookingPiece-header>
                <el-form-item prop="bookingPiece">
                  <template #label>
                    <span>件数</span>
                    <div>No.of package</div>
                  </template>
                </el-form-item>
              </template>
              <template #bookingPiece>
                <el-form-item prop="bookingPiece">
                  <el-input
                    v-model.trim="form.bookingPiece"
                    placeholder="件数"
                    @change="
                      changeZeroHandler({
                        key: 'bookingPiece',
                      })
                    "
                  />
                </el-form-item>
              </template>
              <template #bookingWeight-header>
                <el-form-item prop="bookingWeight">
                  <template #label>
                    <span>毛重</span>
                    <div>G/W</div>
                  </template>
                </el-form-item>
              </template>
              <template #bookingWeight>
                <el-form-item prop="bookingWeight">
                  <el-input
                    v-model.trim="form.bookingWeight"
                    placeholder="毛重"
                    @change="
                      changeZeroHandler({
                        key: 'bookingWeight',
                      })
                    "
                  />
                </el-form-item>
              </template>
              <template #bookingCbm-header>
                <el-form-item prop="bookingCbm">
                  <template #label>
                    <span>体积</span>
                    <div>Measurement</div>
                  </template>
                </el-form-item>
              </template>
              <template #bookingCbm>
                <el-form-item prop="bookingCbm">
                  <el-input
                    v-model.trim="form.bookingCbm"
                    placeholder="体积"
                    @change="
                      changeZeroHandler({
                        key: 'bookingCbm',
                      })
                    "
                  />
                </el-form-item>
              </template>
              <template #cargoName-header>
                <el-form-item prop="cargoName">
                  <template #label>
                    <span>货物品名</span>
                    <div>Nature of goods</div>
                  </template>
                </el-form-item>
              </template>
              <template #cargoName>
                <el-form-item prop="cargoName">
                  <el-input
                    v-model="form.cargoName"
                    placeholder="货物品名"
                    maxlength="100"
                  />
                </el-form-item>
              </template>
              <template #marks-header>
                <el-form-item prop="marks">
                  <template #label>
                    <span>唛头</span>
                    <div>Marks</div>
                  </template>
                </el-form-item>
              </template>
              <template #marks>
                <el-form-item prop="marks">
                  <el-input
                    v-model="form.marks"
                    placeholder="唛头"
                    style="text-align: center"
                    maxlength="200"
                  />
                </el-form-item>
              </template>
            </booking-table>
          </div>
          <!-- 包装类型 -->
          <div style="margin-top: 20px">
            <el-form-item
              label="包装类型"
              prop="packageType"
              class="flex-form-item"
            >
              <el-radio-group v-model="form.packageType">
                <el-radio
                  v-for="item in packageTypes"
                  :key="item.value"
                  :label="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <!-- 托盘数据 -->
            <dc-primeval-table
              v-show="showTrayTable"
              :data="computedTrayList"
              :columns="computedTrayColumns"
            >
              <template #trayNumber="{ row, index }">
                <input
                  class="tray-input"
                  v-model.trim="row.trayNumber"
                  @input="
                    listInputHandler({
                      list: 'trayList',
                      key: 'trayNumber',
                      index,
                      val: row.trayNumber,
                    })
                  "
                  @change="
                    trayChangeHandler({
                      list: 'trayList',
                      key: 'trayNumber',
                      index,
                      val: row.trayNumber,
                    })
                  "
                />
              </template>
              <template #traySize="{ row, index }">
                <input
                  class="tray-input"
                  v-model.trim="row.traySize"
                  @input="
                    listInputHandler({
                      list: 'trayList',
                      key: 'traySize',
                      index,
                      val: row.traySize,
                    })
                  "
                  @change="
                    trayChangeHandler({
                      list: 'trayList',
                      key: 'traySize',
                      index,
                      val: row.traySize,
                    })
                  "
                />
              </template>
              <template #trayWidth="{ row, index }">
                <input
                  class="tray-input"
                  v-model.trim="row.trayWidth"
                  @input="
                    listInputHandler({
                      list: 'trayList',
                      key: 'trayWidth',
                      index,
                      val: row.trayWidth,
                    })
                  "
                  @change="
                    trayChangeHandler({
                      list: 'trayList',
                      key: 'trayWidth',
                      index,
                      val: row.trayWidth,
                    })
                  "
                />
              </template>
              <template #trayHeight="{ row, index }">
                <input
                  class="tray-input"
                  v-model.trim="row.trayHeight"
                  @input="
                    listInputHandler({
                      list: 'trayList',
                      key: 'trayHeight',
                      index,
                      val: row.trayHeight,
                    })
                  "
                  @change="
                    trayChangeHandler({
                      list: 'trayList',
                      key: 'trayHeight',
                      index,
                      val: row.trayHeight,
                    })
                  "
                />
              </template>
              <template #actions="{ row, index }">
                <el-button
                  type="text"
                  size="mini"
                  v-show="row.showAddBtn"
                  @click="addTray"
                  >新增</el-button
                >
                <el-button
                  type="text"
                  size="mini"
                  style="color: #f56c6c"
                  v-show="row.showDelBtn"
                  @click="trayList.splice(index, 1)"
                  >删除</el-button
                >
              </template>
            </dc-primeval-table>
          </div>
          <!-- 单价 -->
          <div class="flex-row base-row" style="margin-top: 20px">
            <el-form-item
              label="单价/Price (卖价)"
              prop="bookingPrice"
              class="flex-form-item"
            >
              <el-input
                v-model.trim="form.bookingPrice"
                placeholder="单价"
                @change="
                  changeZeroHandler({
                    key: 'bookingPrice',
                  })
                "
                style="width: 200px"
              >
                <template slot="append">
                  <el-select
                    v-model="form.bookingCurrency"
                    placeholder="币种"
                    style="width: 100px"
                    @change="bookingCurrencyChange"
                  >
                    <el-option
                      v-for="item in computedCurrencyTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    >
                      <span>{{ item.label }}</span>
                      <span
                        style="font-size: 12px; color: red"
                        v-if="item.disabled"
                        >暂未设置当月汇率，请联系管理员</span
                      >
                    </el-option>
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item
              label="分泡 (卖价)"
              prop="bubblePoint"
              class="flex-form-item"
            >
              <el-select
                v-model="form.bubblePoint"
                placeholder="请选择分泡比例"
                :popper-append-to-body="false"
              >
                <el-option
                  v-for="item in bubblePoints"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="计费重"
              prop="bookingCw"
              class="flex-form-item"
            >
              <el-input
                v-model.trim="form.bookingCw"
                placeholder="计费重自动填充"
                disabled
                style="width: 172px"
              />
            </el-form-item>
            <el-form-item
              label="比重"
              prop="computedBookingVwr"
              class="flex-form-item"
            >
              <el-input
                v-model.trim="computedBookingVwr"
                placeholder="比重自动填充"
                disabled
                style="width: 172px"
              />
            </el-form-item>
            <el-form-item
              label="预计进仓时间"
              prop="expectedInboundTime"
              class="flex-form-item"
            >
              <el-date-picker
                v-model="form.expectedInboundTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm"
                type="datetime"
                placeholder="选择时间"
                :clearable="false"
                style="width: 172px"
              />
            </el-form-item>
          </div>
        </order-section-container>
        <order-section-container title="货物类型">
          <!-- 货物类型 -->
          <div>
            <el-form-item
              label="货物类型"
              prop="cargoType"
              class="flex-form-item"
            >
              <el-radio-group v-model="form.cargoType">
                <el-radio
                  v-for="item in cargoTypes"
                  :key="item.value"
                  :label="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </div>
        </order-section-container>
        <order-section-container title="服务产品">
          <!-- 报关服务 -->
          <div>
            <el-form-item
              label="报关服务"
              prop="customsType"
              class="flex-form-item"
            >
              <div style="display: inline-block">
                <el-radio-group v-model="form.customsType">
                  <el-radio
                    v-for="item in customsTypes"
                    :key="item.value"
                    :label="item.value"
                    >{{ item.label }}</el-radio
                  >
                </el-radio-group>
              </div>
              <div style="display: inline-block">
                <el-select
                  v-model="form.ecdMode"
                  placeholder="请选择委托报关方法"
                  style="margin-left: 20px"
                  v-show="showEcdMode"
                  :popper-append-to-body="false"
                >
                  <el-option
                    v-for="item in ecdModes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
          </div>
          <!-- 国内提货 -->
          <div>
            <el-form-item
              label="国内提货"
              prop="isPickUp"
              class="flex-form-item"
            >
              <el-radio-group v-model="form.isPickUp">
                <el-radio
                  v-for="item in pickUpTypes"
                  :key="item.value"
                  :label="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <!-- 提货详情 -->
            <div class="row-detail" v-show="showPickUpForm">
              <el-form-item
                label="提货时间"
                prop="pickUpTime"
                class="flex-form-item"
              >
                <el-date-picker
                  v-model.trim="form.pickUpTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="选择提货时间"
                  style="width: 172px"
                  :clearable="false"
                  :picker-options="pickUpTimePickerOptions"
                />
              </el-form-item>
              <el-form-item
                label="提货地址"
                prop="pickUpAddress"
                class="flex-form-item"
              >
                <el-input
                  v-model.trim="form.pickUpAddress"
                  placeholder="提货地址"
                  maxlength="50"
                  show-word-limit
                  clearable
                />
              </el-form-item>
              <el-form-item
                label="提货联系人"
                prop="pickUpContacts"
                class="flex-form-item"
              >
                <el-input
                  v-model.trim="form.pickUpContacts"
                  placeholder="提货联系人"
                  maxlength="15"
                  show-word-limit
                  clearable
                />
              </el-form-item>
              <el-form-item
                label="联系电话"
                prop="pickUpTel"
                class="flex-form-item"
              >
                <el-input
                  v-model.trim="form.pickUpTel"
                  placeholder="联系电话"
                  maxlength="20"
                  show-word-limit
                  clearable
                />
              </el-form-item>
            </div>
          </div>
          <!-- 清关服务 -->
          <div>
            <el-form-item
              label="清关服务"
              prop="cclType"
              class="flex-form-item"
            >
              <el-radio-group v-model="form.cclType">
                <el-radio
                  v-for="item in cclTypes"
                  :key="item.value"
                  :label="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <!-- 清关详情 -->
            <div class="row-detail" v-show="showDeliveryForm">
              <el-form-item
                label="送货地址"
                prop="deliveryAddress"
                class="flex-form-item"
              >
                <el-input
                  v-model.trim="form.deliveryAddress"
                  placeholder="送货地址"
                  maxlength="200"
                  show-word-limit
                  clearable
                />
              </el-form-item>
              <el-form-item
                label="送货联系人"
                prop="deliveryContacts"
                class="flex-form-item"
              >
                <el-input
                  v-model.trim="form.deliveryContacts"
                  placeholder="送货联系人"
                  maxlength="50"
                  show-word-limit
                  clearable
                />
              </el-form-item>
              <el-form-item
                label="联系电话"
                prop="deliveryTel"
                class="flex-form-item"
              >
                <el-input
                  v-model.trim="form.deliveryTel"
                  placeholder="联系电话"
                  maxlength="20"
                  show-word-limit
                  clearable
                />
              </el-form-item>
            </div>
          </div>
        </order-section-container>
        <order-section-container title="客户信息">
          <!-- 客户信息 -->
          <div class="flex-row base-row">
            <el-form-item
              label="客户联系人"
              prop="customerContact"
              style="flex: 1"
              class="flex-form-item"
            >
              <el-input
                v-model.trim="form.customerContact"
                placeholder="客户联系人"
                maxlength="30"
                show-word-limit
              />
            </el-form-item>
            <el-form-item
              label="客户联系方式"
              prop="contactInfo"
              style="flex: 1"
              class="flex-form-item"
            >
              <el-input
                v-model.trim="form.contactInfo"
                placeholder="客户联系方式"
                maxlength="11"
                show-word-limit
              />
            </el-form-item>
            <el-form-item
              label="客户备注"
              prop="contactRemark"
              style="flex: 1"
              class="flex-form-item"
            >
              <el-input
                v-model="form.contactRemark"
                placeholder="客户备注"
                maxlength="30"
                show-word-limit
              />
            </el-form-item>
          </div>
          <!-- 订单备注 -->
          <div class="flex-row">
            <el-form-item
              label="订单备注"
              prop="remark"
              style="flex: 1"
              class="flex-form-item"
            >
              <el-input
                type="textarea"
                v-model="form.remark"
                placeholder="订单备注"
                maxlength="200"
                show-word-limit
                style="width: 100%"
              />
            </el-form-item>
          </div>
          <!-- 操作 -->
          <div class="flex-row base-row">
            <div class="order-actions">
              <el-button type="primary" @click="submitOrder"
                >确认新建</el-button
              >
              <el-button v-if="showCancelAddBtn" @click="cancelAdd"
                >取消新建</el-button
              >
              <el-button v-if="showDelOrderDraftBtn" @click="delOrderDraft"
                >删除草稿</el-button
              >
              <el-button @click="editOrderDraft">保存草稿</el-button>
            </div>
          </div>
        </order-section-container>
      </dc-form>
    </div>
    <float-estimated-bill
      :form="form"
      :currencyRate="currencyRate"
    ></float-estimated-bill>
  </div>
</template>

<script>
import BookingTable from "./components/BookingTable.vue";
import FloatEstimatedBill from "./components/FloatEstimatedBill.vue";
import DcStatus from "@/status";
export default {
  name: "AddOrder",
  components: {
    BookingTable,
    FloatEstimatedBill,
  },
  created() {
    this.init();
  },
  data() {
    const {
      cargoTypes,
      packageTypes,
      customsTypes,
      pickUpTypes,
      cclTypes,
      bubblePoints,
      ecdModes,
      payWays,
      ownRotes,
      // currencyTypes,
    } = DcStatus.commonStatus;
    return {
      form: {
        companyId: "", // 客户id
        companyName: "", // 客户
        customerResponsibleId: "", // 客户负责人id
        customerResponsibleName: "", // 客户负责人name
        sysOrgName: "", // 订单所属公司name
        sysOrgId: "", // 订单所属公司id
        payWay: "",
        pscsId: "", // 售前id
        pscsName: "", // 售前
        principalId: "", // 航线id
        principalName: "", // 航线负责人
        pol: "", // 始发站
        pod: "", // 到达站
        airCompanyCode: "", // 航司code
        airCompanyName: "", // 航司名
        airCompany: "", // 航司
        departureDate: "", // 航班日期
        shipper: "", // 发货人名称、地址和电话
        notifier: "", // 通知人
        consignee: "", // 收货人名称、地址和电话
        bookingPiece: "", // 订舱件数
        bookingWeight: "", // 订舱毛重
        bookingCbm: "", // 订舱体积
        cargoName: "", // 货物品名
        marks: "", // 唛头
        packageType: 1, // 包装类型
        bookingPrice: "", // 订舱单价
        costPrice: "", // 成本价(航线报价)
        miscellaneousFees: "", // 杂费(成本)
        bubblePoint: 10, // 分泡比例
        costBubblePoint: 10, // 分泡（成本）
        bookingVwr: "", // 	订舱比重
        bookingCw: "", // 订舱计费重
        expectedInboundTime: "", // 预计进仓时间
        cargoType: 1, // 货物类型
        customsType: 1, // 报关服务
        ecdMode: 1, // 委托报关模式
        isPickUp: 1, // 国内提货
        pickUpTime: "", // 提货时间
        pickUpAddress: "", // 提货地址
        pickUpTel: "", // 提货联系电话
        pickUpContacts: "", // 提货联系人
        cclType: 1, // 清关服务
        deliveryAddress: "", // 送货地址
        deliveryTel: "", // 送货联系电话
        deliveryContacts: "", // 送货联系人
        customerContact: "", // 客户联系人
        contactInfo: "", // 客户联系方式
        contactRemark: "", // 客户备注
        remark: "", // 订单备注
        ownRote: 0,
        file: null,
        costCurrency: 1, // 成本币种
        bookingCurrency: 1, // 售价币种
      },
      trayColumns: [
        {
          prop: "trayNumber",
          label: "托盘数量",
        },
        {
          prop: "traySize",
          label: "长（cm）",
        },
        {
          prop: "trayWidth",
          label: "宽（cm）",
        },
        {
          prop: "trayHeight",
          label: "高（cm）",
        },
        {
          prop: "actions",
          label: "操作",
          width: "80px",
        },
      ],
      customers: [], // 客户列表
      principalList: [], // 航线负责人列表
      pscsList: [], // 售前列表
      pols: [], // 起运港列表
      pods: [], // 目的港列表
      airCompanys: [], // 航空公司列表
      trayList: [],
      cargoTypes, // 品类列表
      packageTypes, // 包装列表
      customsTypes, // 报关服务列表
      pickUpTypes, // 国内提货列表
      cclTypes, // 清关服务列表
      bubblePoints, // 分泡比例表
      ecdModes, // 委托报关方法
      payWays,
      customerPayWays: [],
      branchs: [], // 分公司
      ownRotes,
      customerDetail: {},
      orderAttachmentVO: {}, // 客户托书文件
      currencyTypes:[], // 币种列表
      currencyRates: {1:1}, // 币种汇率列表
      currencyRate: 1, // 币种汇率
      customerQuery: "",
    };
  },
  mounted(){
    this.currencyTypes = this.$store.state.common.currencyTypes
  },
  computed: {
    computedCustomers({ customerQuery }) {
      return this.customers
        .filter((item) => {
          return (
            customerQuery !== "" &&
            customerQuery.trim() !== "" &&
            item.label.toLowerCase().includes(customerQuery.toLowerCase())
          );
        })
        .slice(0, 10);
    },
    computedCurrencyTypes() {
      return this.currencyTypes.map((item) => {
        const rate = this.currencyRates[item.id];
        return {
          ...item,
          label: `${item.value === 1 ? "元" : item.name} / KG`,
          disabled: !rate,
          rate,
          value:item.id,
        };
      });
    },
    orderDraftId() {
      return this.$route.query.id;
    },
    customerInfos() {
      const {
        message: customerStatusText,
        openStatus,
        payWay,
        accountingPeriod,
        quota,
        poraryQuota,
        remainingQuota,
        totalArrears,
        overDueVotes,
        isExcess,
        isOverDue,
      } = this.customerDetail;
      return {
        list: [
          {
            label: "客户开放状态",
            value: {
              1: "开放",
              0: "冻结",
              null: "开放",
            }[openStatus],
          },
          {
            label: "结算方式",
            value: {
              0: "付款买单",
              1: "月结",
              2: "固定天数",
            }[payWay],
          },
          {
            label: "结算账期",
            value: accountingPeriod,
          },
          {
            label: "授信额度",
            value: quota,
          },
          {
            label: "临时额度",
            value: poraryQuota,
          },
          {
            label: "剩余额度",
            value: remainingQuota,
          },
          {
            label: "总欠款",
            value: totalArrears,
          },
          {
            label: "超期票数",
            value: overDueVotes,
          },
        ],
        customerStatusText,
        customerStatusError: isExcess || isOverDue,
      };
    },
    computedRules() {
      return {
        companyName: [
          {
            required: true,
            message: "请选择订舱客户",
          },
        ],
        customerResponsibleName: [
          {
            required: true,
            message: "请选择订舱客户",
          },
        ],
        payWay: [
          {
            required: true,
            message: "请选择单票结算方式",
          },
        ],
        sysOrgName: [
          {
            required: true,
            message: "请选择订单所属公司",
          },
        ],
        pscsName: [
          {
            required: true,
            message: "请选择售前客服",
          },
        ],
        file: [
          {
            required: true,
            message: "请上传客户托书",
          },
        ],
        costPrice: [
          {
            required: true,
            message: "请填写成本价",
            trigger: "blur",
          },
        ],
        costBubblePoint: [
          {
            required: true,
            message: "请选择分泡比例(成本)",
          },
        ],
        principalName: [
          {
            required: true,
            message: "请选择航线人员",
          },
        ],
        ownRote: [
          {
            required: true,
            message: "请选择是否为自有航线",
          },
        ],
        pol: [
          {
            required: true,
            message: "请选择始发站",
          },
        ],
        pod: [
          {
            required: true,
            message: "请选择到达站",
          },
        ],
        airCompany: [
          {
            required: true,
            message: "请选择航司",
            trigger: "change",
          },
        ],
        departureDate: [
          {
            required: true,
            message: "请选择航班日期",
            trigger: "blur",
          },
        ],
        bookingPiece: [
          {
            required: true,
            message: "请填写件数",
            trigger: "blur",
          },
        ],
        bookingWeight: [
          {
            required: true,
            message: "请填写毛重",
            trigger: "blur",
          },
        ],
        bookingCbm: [
          {
            required: true,
            message: "请填写体积",
            trigger: "blur",
          },
        ],
        cargoName: [
          {
            required: true,
            message: "请填写货物品名",
            trigger: "blur",
          },
        ],
        packageType: [
          {
            required: true,
            message: "请选择包装类型",
          },
        ],
        bookingPrice: [
          {
            required: true,
            message: "请填写单价",
            trigger: "blur",
          },
        ],
        bubblePoint: [
          {
            required: true,
            message: "请选择分泡比例",
          },
        ],
        bookingCw: [
          {
            required: true,
            message: "无法计算出有效计费重",
            trigger: "blur",
          },
        ],
        computedBookingVwr: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!this.computedBookingVwr) {
                callback(new Error("无法计算出有效比重"));
              }
              callback();
            },
          },
        ],
        expectedInboundTime: [
          {
            required: true,
            message: "请选择预计进仓时间",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              const departureDate = new Date(this.form.departureDate).getTime();
              const expectedInboundTime = new Date(value).getTime();
              if (departureDate < expectedInboundTime) {
                callback(new Error("请选择早于航班日期的预计进仓时间"));
              }
              callback();
            },
            trigger: "change",
          },
        ],
        cargoType: [
          {
            required: true,
            message: "请选择货物类型",
          },
        ],
        customsType: [
          {
            required: true,
            message: "请选择报关服务",
          },
        ],
        pickUpTime: [
          {
            required: this.showPickUpForm,
            message: "请选择提货时间",
          },
          {
            validator: (rule, value, callback) => {
              const departureDate = new Date(this.form.departureDate).getTime();
              const expectedInboundTime = new Date(value).getTime();
              if (departureDate < expectedInboundTime) {
                callback(new Error("请选择早于航班日期的提货时间"));
              }
              callback();
            },
            trigger: "change",
          },
        ],
        isPickUp: [
          {
            required: true,
            message: "请选择国内提货服务",
          },
        ],
        pickUpAddress: [
          {
            required: this.showPickUpForm,
            message: "请填写提货地址",
          },
        ],
        pickUpTel: [
          {
            required: this.showPickUpForm,
            message: "请填写提货联系电话",
          },
        ],
        pickUpContacts: [
          {
            required: this.showPickUpForm,
            message: "请填写提货联系人",
          },
        ],
        cclType: [
          {
            required: true,
            message: "请选择清关服务",
          },
        ],
        deliveryAddress: [
          {
            required: this.showDeliveryForm,
            message: "请填写送货地址",
          },
        ],
        deliveryContacts: [
          {
            required: this.showDeliveryForm,
            message: "请填写送货联系人",
          },
        ],
        deliveryTel: [
          {
            required: this.showDeliveryForm,
            message: "请填写送货联系电话",
          },
        ],
        customerContact: [
          {
            required: false,
            message: "请填写客户联系人",
          },
        ],
        contactInfo: [
          {
            required: false,
            message: "请填写客户联系方式",
          },
          // {
          //   required: false,
          //   validator: (rule, value, callback) => {
          //     if (!/^(?:(?:\+|00)86)?1\d{10}$/.test(value)) {
          //       callback(new Error("请输入正确的手机号"));
          //     }
          //     callback();
          //   },
          //   trigger: "blur",
          // },
        ],
      };
    },
    computedTrayColumns() {
      return this.trayColumns.filter((item) => item);
    },
    computedTrayList() {
      return this.trayList.map((item, index, list) => {
        return {
          ...item,
          showAddBtn: index === list.length - 1 && index <= 8,
          showDelBtn: list.length !== 1,
        };
      });
    },
    showTrayTable() {
      return this.form.packageType === 2;
    },
    computedBookingVwr() {
      const { bookingVwr } = this.form;
      return bookingVwr ? `1 : ${bookingVwr}` : "";
    },
    departureDatePickerOptions() {
      return {
        disabledDate: (time) => {
          return time.getTime() < new Date().getTime() - 24 * 60 * 60 * 1000;
        },
      };
    },
    expectedInboundTimePickerOptions() {
      return {
        disabledDate: (time) => {
          const yesterday = new Date().getTime() - 24 * 60 * 60 * 1000;
          const departureDate = new Date(this.form.departureDate).getTime();
          return time.getTime() < yesterday || time.getTime() > departureDate;
        },
      };
    },
    showEcdMode() {
      return this.form.customsType === 2;
    },
    pickUpTimePickerOptions() {
      return {
        disabledDate: (time) => {
          const yesterday = new Date().getTime() - 24 * 60 * 60 * 1000;
          const departureDate = new Date(this.form.departureDate).getTime();
          return time.getTime() < yesterday || time.getTime() > departureDate;
        },
      };
    },
    showPickUpForm() {
      return this.form.isPickUp === 2;
    },
    showDeliveryForm() {
      return this.form.cclType !== 1;
    },
    computedPayWays() {
      return this.payWays.filter((item) => {
        return this.customerPayWays.map((i) => i.key).includes(item.value);
      });
    },
    showCancelAddBtn() {
      return !this.orderDraftId;
    },
    showDelOrderDraftBtn() {
      return this.orderDraftId;
    },
  },
  methods: {
    init() {
      if (this.orderDraftId) {
        this.$route.meta.title = "订单详情-我的草稿";
      } else {
        this.$route.meta.title = "新建订单";
      }
      this.getThreeLetterCodes({ listName: "pols" });
      this.getThreeLetterCodes({ listName: "pods" });
      this.getAirCompanysByKeyWord();
      this.getRoleOptions();
      this.addTray();
      this.getOrderDraftDetail();
    },
    airCompanyChange(val) {
      const {
        value: airCompanyCode,
        name: airCompanyName,
        airCompany,
      } = this.airCompanys.find((item) => item.value === val);
      this.form = {
        ...this.form,
        airCompanyCode,
        airCompanyName,
        airCompany,
      };
    },
    addTray() {
      const tray = {
        trayNumber: "",
        traySize: "",
        trayWidth: "",
        trayHeight: "",
      };
      this.trayList.push(tray);
    },
    // formatKey 查表用的字段名
    listInputHandler({ list, key, index, val: newVal, formatKey }) {
      formatKey = formatKey || key;
      const listItem = this[list][index];
      const oldVal = listItem[key];
      const val = this.$utils.getValidNumber({
        format: DcStatus.numberFormat[formatKey],
        newVal,
        oldVal,
      });
      this[list].splice(index, 1, {
        ...listItem,
        [key]: val,
      });
    },
    trayChangeHandler({ list, key, index, val }) {
      const listItem = this[list][index];
      if (Number(val) === 0) {
        this[list].splice(index, 1, {
          ...listItem,
          [key]: "",
        });
        return;
      }
    },
    // formatKey 查表用的字段名
    inputHandler({ key, newVal, oldVal, formatKey }) {
      formatKey = formatKey || key;
      const val = this.$utils.getValidNumber({
        format: DcStatus.numberFormat[formatKey],
        newVal,
        oldVal,
      });
      this.form[key] = val;
    },
    changeZeroHandler({ key }) {
      const newVal = Number(this.form[key]);
      if (newVal === 0) {
        this.form[key] = "";
        return;
      }
    },
    getComputedBookingData() {
      const {
        bubblePoint,
        bookingWeight: weight,
        bookingCbm: volume,
      } = this.form;
      this.form.bookingCw = this.$utils.getBillingWeight({
        bubblePoint,
        weight,
        volume,
      });
      this.form.bookingVwr = volume ? Math.round(weight / volume) : "";
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
          airCompany: `${item.airCompanyCode}-${item.name}`,
        };
      });
    },
    pscsChange(val) {
      const { value: pscsId, label: pscsName } = this.pscsList.find(
        (item) => item.value === val
      );
      this.form = {
        ...this.form,
        pscsId,
        pscsName,
      };
    },
    principalChange(val) {
      const { value: principalId, label: principalName } =
        this.principalList.find((item) => item.value === val);
      this.form = {
        ...this.form,
        principalId,
        principalName,
      };
    },
    async getRoleOptions() {
      this.getCustomers();
      this.selectUserListByRoleName({
        roleName: "售前客服",
        listName: "pscsList",
      });
      this.getLineRoleName({
        roleName: "航线负责人",
        listName: "principalList",
      });
    },
    async getCustomers() {
      const {
        data: { data },
      } = await this.$api.selectCompanyListByThisUser();
      this.customers = data.map((item) => {
        return {
          ...item,
          value: item.id,
          label: item.companyName,
        };
      });
    },
    async getCustomerDetail(companyId) {
      if (!companyId) {
        this.customerPayWays = [];
        this.branchs = [];
        this.form = {
          ...this.form,
          customerResponsibleId: "",
          customerResponsibleName: "",
        };
        this.customerDetail = {};
        return;
      }
      const {
        data: {
          data: {
            payWayVO,
            sysOrgList,
            customerResponsibleId,
            customerResponsibleName,
          },
          data,
        },
      } = await this.$api.getCustomerDetail(
        {},
        {
          params: {
            companyId,
          },
        }
      );
      this.customerPayWays = payWayVO.payWayEnumList;
      this.branchs = sysOrgList.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      if (this.customerPayWays.length === 1) {
        this.form.payWay = this.form.payWay || this.computedPayWays[0].value;
      }
      if (
        !this.customerPayWays.map((item) => item.key).includes(this.form.payWay)
      ) {
        // 客户更改了结算方式，草稿单票结算方式置空
        this.form.payWay = "";
      }
      if (this.branchs.length === 1) {
        this.form.sysOrgId = this.form.sysOrgId || this.branchs[0].value;
        this.form.sysOrgName = this.form.sysOrgName || this.branchs[0].label;
      }
      this.form = {
        ...this.form,
        customerResponsibleId,
        customerResponsibleName:
          customerResponsibleName || "没有得到customerResponsibleName字段",
      };
      this.customerDetail = {
        ...data,
      };
    },
    customerChange(val) {
      const { value: companyId, label: companyName } =
        this.customers.find((item) => item.value === val) || {};
      this.form = {
        ...this.form,
        companyId,
        companyName,
        payWay: "",
        sysOrgName: "",
        sysOrgId: "",
      };
      this.getCustomerDetail(val);
      this.customerQuery = "";
    },
    sysOrgChange(val) {
      const { value: sysOrgId, label: sysOrgName } = this.branchs.find(
        (item) => item.value === val
      );
      this.form = {
        ...this.form,
        sysOrgName,
        sysOrgId,
      };
    },
    async uploadCustomNote() {
      const files = await this.$utils.loadFile({
        accept: ".pdf,.doc,.docx,.xls,.xlsx",
      });
      const file = files[0];
      const maxSize = 10;
      if (file.size > 1024 * 1024 * maxSize) {
        this.$message.error(`文件大小不能超过${maxSize}M`);
        return;
      }
      const fileFormData = new FormData();
      fileFormData.append("file", file);
      const {
        data: { data: orderAttachmentVO },
      } = await this.$api.uploadClientLetterFile(fileFormData);
      this.form = {
        ...this.form,
        file: orderAttachmentVO,
      };
      this.orderAttachmentVO = orderAttachmentVO;
    },
    async selectUserListByRoleName({ roleName, listName }) {
      const {
        data: { data },
      } = await this.$api.selectUserListByRoleName({ roleName });
      this[listName] = data.map((item) => {
        return {
          ...item,
          label: item.name,
          value: item.id,
        };
      });
    },

    //  获取航线人员
    async getLineRoleName({ roleName, listName }) {
      const data = await this.$http.get(
        this.$service.userSearchNoAuth + "?roleName=航线负责人&pageSize=9999"
      );
      this[listName] = data.data.records.map((item) => {
        return {
          ...item,
          label: item.name,
          value: item.id,
        };
      });
    },
    submitOrder() {
      this.$refs.form.form.validate((valid, errorKeys) => {
        if (valid) {
          this.fastOrder();
        } else {
          Object.entries(errorKeys).find(([key, val]) => {
            if (val[0]) {
              this.$message.error(val[0].message);
              return true;
            }
          });
          return false;
        }
      });
    },
    async fastOrder() {
      try {
        const {
          data: {
            data: { messageObjDTO, id },
            data,
          },
        } = await this.$api.fastOrder({
          order: {
            ...this.form,
            trayDetail: JSON.stringify(this.trayList),
          },
          orderAttachmentVO: this.orderAttachmentVO,
        });
        if (data.code === -1) {
          // this.$message.error(data.message);
          try {
            await this.$confirm(data.message, "提示", {
              confirmButtonText: "保存草稿",
              cancelButtonText: "取消新建",
              type: "warning",
            });
            this.editOrderDraft();
          } catch (error) {
            this.cancelAdd();
          }
          return;
        }
        if (messageObjDTO.code) {
          // this.$message.error(messageObjDTO.message);
          try {
            await this.$confirm(messageObjDTO.message, "提示", {
              confirmButtonText: "发起解锁流程",
              cancelButtonText: "暂不处理",
              type: "warning",
            });
            await this.$alert(
              "该功能暂未上线，请直接联系管理员说明情况并解锁！",
              "提示",
              {
                confirmButtonText: "确定",
              }
            );
          } catch (error) {
          } finally {
            this.$router.push({ name: "OrderDetailNew", query: { id } });
          }
          return;
        }
        this.$message.success("下单成功");
        this.$bus.$emit("close-current-page", {
          callback: () => {
            setTimeout(() => {
              this.$router.push({ name: "OrderDetailNew", query: { id } });
            }, 100);
          },
          noHistoryCallback: () => {
            setTimeout(() => {
              this.$router.push({ name: "OrderDetailNew", query: { id } });
            }, 100);
          },
        });
      } catch (error) {}
    },
    async editOrderDraft() {
      try {
        const { attachmentName, attachmentPath, fileType, fileSize } =
          this.orderAttachmentVO;
        const {
          data: {
            data: { id },
          },
        } = await this.$api.editOrderDraft({
          ...this.form,
          trayDetail: JSON.stringify(this.trayList),
          attachmentName,
          attachmentPath,
          fileSize,
          fileType,
        });
        this.$message.success("保存草稿成功");
        this.$router.replace({
          name: "AddOrder",
          query: { id },
        });
      } catch (error) {}
    },
    async getOrderDraftDetail() {
      if (!this.orderDraftId) {
        this.getCurrencyRates();
        return;
      }
      try {
        const {
          data: {
            data: {
              attachmentName,
              attachmentPath,
              fileSize,
              fileType,
              companyId,
              trayDetail,
            },
            data,
          },
        } = await this.$api.getOrderDraftDetail({
          params: {
            id: this.orderDraftId,
          },
        });
        if (companyId) {
          this.getCustomerDetail(companyId);
        }
        const file = {
          attachmentName,
          attachmentPath,
          fileSize,
          fileType,
        };
        const airCompany =
          data.airCompanyCode && data.airCompanyName
            ? `${data.airCompanyCode}-${data.airCompanyName}`
            : "";
        this.form = {
          ...data,
          costCurrency: data.costCurrency || 1,
          bookingCurrency: data.bookingCurrency || 1,
          airCompany,
          file:
            attachmentName && attachmentPath && fileSize && fileType
              ? file
              : null,
        };
        const trayList = JSON.parse(trayDetail || "[]");
        if (trayList.length > 0) {
          this.trayList = trayList;
        }
        this.orderAttachmentVO = file;
        this.getCurrencyRates();
      } catch (error) {}
    },
    cancelAdd() {
      this.$bus.$emit("close-current-page", {
        noHistoryCallback: () => {
          this.$router.push({ name: "OrderManageNew" });
        },
      });
    },
    async delOrderDraft() {
      try {
        await this.$confirm("确认要进行该操作吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        await this.$api.delOrderDraft({
          params: {
            id: this.orderDraftId,
          },
        });
        this.$bus.$emit("close-current-page", {
          noHistoryCallback: () => {
            this.$router.push({ name: "OrderManageNew" });
          },
        });
      } catch (error) {}
    },
    departureDateChange() {
      this.getCurrencyRates();
    },
    async getCurrencyRates() {
      const { departureDate } = this.form;
      if(!departureDate) return 
      try {
        const {
          data: { data },
        } = await this.$api.getCurrencyRatesNew({
          params: {
            departureDate,
          },
        });
        this.currencyRates = data;
        console.log(data);
        this.bookingCurrencyChange(this.form.bookingCurrency);
      } catch (error) {}
    },
    bookingCurrencyChange(val) {
      this.currencyRate =
        this.currencyRates[val] || 1;
    },
  },
  watch: {
    "form.bookingPrice"(newVal, oldVal) {
      if (![null, "null"].includes(newVal)) {
        this.inputHandler({ key: "bookingPrice", newVal, oldVal });
      }
    },
    "form.costPrice"(newVal, oldVal) {
      if (![null, "null"].includes(newVal)) {
        this.inputHandler({ key: "costPrice", newVal, oldVal });
      }
    },
    "form.miscellaneousFees"(newVal, oldVal) {
      if (![null, "null"].includes(newVal)) {
        this.inputHandler({ key: "miscellaneousFees", newVal, oldVal });
      }
    },
    "form.bookingPiece"(newVal, oldVal) {
      if (![null, "null"].includes(newVal)) {
        this.inputHandler({ key: "bookingPiece", newVal, oldVal });
      }
    },
    "form.bookingWeight"(newVal, oldVal) {
      if (![null, "null"].includes(newVal)) {
        this.inputHandler({ key: "bookingWeight", newVal, oldVal });
        this.getComputedBookingData();
      }
    },
    "form.bookingCbm"(newVal, oldVal) {
      if (![null, "null"].includes(newVal)) {
        this.inputHandler({ key: "bookingCbm", newVal, oldVal });
        this.getComputedBookingData();
      }
    },
    "form.bubblePoint"(newVal, oldVal) {
      if (![null, "null"].includes(newVal)) {
        this.getComputedBookingData();
      }
    },
    "form.contactInfo"(newVal, oldVal) {
      if (![null, "null"].includes(newVal)) {
        this.inputHandler({ key: "contactInfo", newVal, oldVal });
      }
    },
    "$route.query.id"() {
      this.init();
    },
  },
};
</script>

<style lang="less" scoped>
.add-order {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 81px);
  background: #f3f6f9;
  .add-order-wrap {
    padding: 20px;
    flex: 1;
    min-height: 0;
    overflow: auto;
  }
  .flex-row {
    display: flex;
    flex-wrap: wrap;
    &.base-row {
      .el-form-item {
        margin-right: 20px;
        &:nth-last-of-type(1) {
          margin-right: 0;
        }
        min-width: 200px;
        &.flex-form-item {
          /deep/.el-form-item__label {
            margin-right: 20px;
            float: left;
          }
          /deep/.el-form-item__content {
            display: inline-block;
          }
        }
      }
      /deep/.el-form-item__error {
        transform: translateY(4px);
      }
    }
  }
  .tray-input {
    box-sizing: border-box;
    padding: 2px 10px;
    width: 80px;
    text-align: center;
    font-size: 12px;
  }
  .flex-form-item {
    display: flex;
    /deep/.el-form-item__label {
      float: left;
      margin-right: 20px;
    }
    /deep/.el-form-item__content {
      flex: 1;
      .el-radio-group {
        display: flex;
        align-items: center;
        height: 30px;
      }
    }
  }
  .row-detail {
    padding-left: 80px;
    /deep/.el-form-item__label {
      width: 80px;
    }
    /deep/.el-input {
      width: 300px;
    }
  }
  /deep/.dc-primeval-table {
    background: #f6f6f6;
    thead {
      color: #333;
      background: #f5f7fa;
    }
  }
  /deep/.el-input__inner,
  /deep/.el-textarea__inner,
  /deep/.el-input__count-inner,
  /deep/.el-input__count {
    background: #fff;
    &:disabled {
      background: #f5f7fa;
    }
  }
  /deep/.el-input__suffix {
    height: auto;
  }
  .order-actions {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    width: 100%;
    > * {
      margin: 0 20px;
    }
  }
  .upload-wrap {
    display: flex;
    align-items: center;
    .file-row {
      margin-left: 20px;
    }
  }
  .customer-infos {
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    .info-item {
      display: flex;
      align-items: center;
      .title {
        font-weight: bold;
      }
      &:not(:nth-last-of-type(1)) {
        &::after {
          margin: 0 10px;
          content: "/";
          font-size: 18px;
        }
      }
    }
  }
  .customer-status-text {
    margin-top: 10px;
    font-size: 14px;
    font-weight: bold;
    color: #67c23a;
    &.error {
      color: #f56c6c;
    }
  }
}
</style>