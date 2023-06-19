<template>
  <!-- 订舱表单 -->
  <div class="booking-form">
    <dc-form
      ref="form"
      :model="form"
      :rules="computedRules"
      :disabled="orderDisableds.orderDisabled"
      size="mini"
      label-position="top"
    >
      <order-section-container title="客户基本信息">
        <div class="flex-row base-row">
          <el-form-item
            label="订舱客户"
            prop="companyName"
            class="flex-form-item"
          >
            <div v-auth-field:[form.companyName]="['101000_FC']">
              <el-input
                v-model.trim="form.companyName"
                placeholder="订舱客户"
                disabled
                style="width: 172px"
              >
              </el-input>
            </div>
          </el-form-item>
          <el-form-item
            label="客户负责人"
            prop="customerResponsibleName"
            class="flex-form-item"
          >
            <div v-auth-field:[form.customerResponsibleName]="['101535_FC']">
              <el-input
                v-model.trim="form.customerResponsibleName"
                placeholder="客户负责人"
                disabled
                style="width: 172px"
              >
              </el-input>
            </div>
          </el-form-item>
          <el-form-item
            label="单票结算方式"
            prop="payWay"
            class="flex-form-item"
          >
            <div v-auth-field:[payWayText]="['104000_FC']">
              <el-select
                v-model="form.payWay"
                placeholder="单票结算方式"
                @change="$emit('orderPayWayChange', form.payWay)"
              >
                <el-option
                  v-for="item in payWays"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  v-show="item.show"
                />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item
            label="订单所属公司"
            prop="sysOrgName"
            class="flex-form-item"
          >
            <div v-auth-field:[form.sysOrgName]="['101531_FC']">
              <el-input
                v-model.trim="form.sysOrgName"
                placeholder="订单所属公司"
                disabled
                style="width: 172px"
              >
              </el-input>
            </div>
          </el-form-item>
        </div>
      </order-section-container>
      <order-section-container title="航线报价信息">
        <div class="flex-row base-row">
          <el-form-item
            label="成本价 (航线报价)"
            prop="costPrice"
            class="flex-form-item"
          >
            <div v-auth-field:[form.costPrice]="['101525_FC']">
              <el-input
                v-model.trim="form.costPrice"
                placeholder="成本价"
                :disabled="orderDisableds.costPriceDisabled"
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
                    :disabled="orderDisableds.costPriceDisabled"
                    @change="
                      $emit('orderCostCurrencyChange', form.costCurrency)
                    "
                  >
                    <el-option
                      v-for="item in currencyTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    >
                      <span>{{ item.label }}</span>
                      <span
                        style="font-size: 12px; color: red"
                        v-if="item.disabled"
                        >暂未设置航班日期所在月份的汇率</span
                      >
                    </el-option>
                  </el-select>
                </template>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item
            label="杂费 (航线报价)"
            prop="miscellaneousFees"
            class="flex-form-item"
          >
            <div v-auth-field:[form.miscellaneousFees]="['101527_FC']">
              <el-input
                v-model.trim="form.miscellaneousFees"
                placeholder="杂费"
                @change="
                  changeZeroHandler({
                    key: 'miscellaneousFees',
                  })
                "
                style="width: 172px"
              >
                <template slot="append">元</template>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item
            label="航线"
            prop="principalName"
            class="flex-form-item"
          >
            <div v-auth-field:[form.principalName]="['105030_FC']">
              <dc-select
                v-model="form.principalName"
                filterable
                placeholder="请选择航线"
                @change="principalChange"
              >
                <el-option
                  v-for="item in principalList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </dc-select>
            </div>
          </el-form-item>
          <el-form-item
            label="是否为自有航线"
            prop="ownRote"
            class="flex-form-item"
          >
            <div v-auth-field:[ownRoteText]="['101529_FC']">
              <dc-select
                v-model="form.ownRote"
                filterable
                placeholder="是否为自有航线"
                :disabled="orderDisableds.ownRoteDisabled"
                @change="$emit('orderOwnRoteChange', form.ownRote)"
              >
                <el-option
                  v-for="item in ownRotes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </dc-select>
            </div>
          </el-form-item>
          <el-form-item
            label="分泡 (成本)"
            prop="costBubblePoint"
            class="flex-form-item"
          >
            <div v-auth-field:[costBubblePointText]="['101533_FC']">
              <el-select
                v-model="form.costBubblePoint"
                placeholder="请选择分泡比例"
                @change="(val) => $emit('orderCostBubblePointChange', val)"
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
          </el-form-item>
        </div>
      </order-section-container>
      <order-section-container title="基本信息">
        <!-- 航班信息 -->
        <div class="flex-row base-row">
          <el-form-item
            label="始发站/Airport of departure"
            prop="pol"
            class="flex-form-item"
          >
            <div v-auth-field:[form.pol]="['101010_FC']">
              <dc-select
                v-model="form.pol"
                filterable
                remote
                placeholder="始发站"
                :remote-method="getPols"
                :disabled="orderDisableds.polDisabled"
                @change="$emit('orderPolChange', form.pol)"
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
          </el-form-item>
          <el-form-item
            label="到达站/Airport of Destination"
            prop="pod"
            class="flex-form-item"
          >
            <div v-auth-field:[form.pod]="['101020_FC']">
              <dc-select
                v-model="form.pod"
                filterable
                remote
                placeholder="始发站"
                :remote-method="getPods"
                :disabled="orderDisableds.podDisabled"
                @change="$emit('orderPodChange', form.pod)"
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
          </el-form-item>
          <el-form-item
            label="航司/Flight"
            prop="airCompany"
            class="flex-form-item"
          >
            <div v-auth-field:[form.airCompany]="['101030_FC']">
              <dc-select
                v-model="form.airCompany"
                :disabled="orderDisableds.airCompanyDisabled"
                filterable
                remote
                :remote-method="getAirCompanysByKeyWord"
                @change="airCompanyChange"
              >
                <el-option
                  v-for="item in airCompanys"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </dc-select>
            </div>
          </el-form-item>
          <el-form-item
            label="航班日期/Flight NO_Date"
            prop="departureDate"
            class="flex-form-item"
          >
            <div v-auth-field:[form.departureDate]="['101040_FC']">
              <el-date-picker
                v-model="form.departureDate"
                :disabled="orderDisableds.departureDateDisabled"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择时间"
                :clearable="false"
                style="width: 172px"
              />
            </div>
          </el-form-item>
        </div>
        <!-- 发货人信息 -->
        <div class="flex-row base-row">
          <el-form-item
            label="发货人名称,地址和电话/Shipper's Name and Address /telephone"
            prop="shipper"
            style="flex: 1"
          >
            <div v-auth-field:[form.shipper]="['101050_FC']">
              <el-input
                type="textarea"
                placeholder="发货人名称,地址和电话"
                maxlength="200"
                v-model="form.shipper"
              />
            </div>
          </el-form-item>
          <el-form-item
            label="通知人/Notify Party"
            prop="notifier"
            style="flex: 1"
          >
            <div v-auth-field:[form.notifier]="['101060_FC']">
              <el-input
                type="textarea"
                placeholder="通知人"
                maxlength="200"
                v-model="form.notifier"
              />
            </div>
          </el-form-item>
        </div>
        <!-- 收货人信息 -->
        <div class="flex-row base-row">
          <el-form-item
            label="收货人名称,地址和电话/Consignee's Name and Address /telephone"
            prop="consignee"
            style="flex: 1"
          >
            <div v-auth-field:[form.consignee]="['101070_FC']">
              <el-input
                type="textarea"
                placeholder="收货人名称,地址和电话"
                maxlength="200"
                v-model="form.consignee"
              />
            </div>
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
                <div
                  v-auth-field:[form.bookingPiece]="['101080_FC']"
                  style="text-align: center"
                >
                  <el-input
                    v-model.trim="form.bookingPiece"
                    placeholder="件数"
                    :disabled="orderDisableds.bookingDataDisabled"
                    @change="
                      changeZeroHandler({
                        key: 'bookingPiece',
                      })
                    "
                  />
                </div>
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
                <div
                  v-auth-field:[form.bookingWeight]="['101080_FC']"
                  style="text-align: center"
                >
                  <el-input
                    v-model.trim="form.bookingWeight"
                    placeholder="毛重"
                    :disabled="orderDisableds.bookingDataDisabled"
                    @change="
                      changeZeroHandler({
                        key: 'bookingWeight',
                      })
                    "
                  />
                </div>
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
                <div
                  v-auth-field:[form.bookingCbm]="['101080_FC']"
                  style="text-align: center"
                >
                  <el-input
                    v-model.trim="form.bookingCbm"
                    placeholder="体积"
                    :disabled="orderDisableds.bookingDataDisabled"
                    @change="
                      changeZeroHandler({
                        key: 'bookingCbm',
                      })
                    "
                  />
                </div>
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
                <div
                  v-auth-field:[form.cargoName]="['101110_FC']"
                  style="text-align: center"
                >
                  <el-input
                    v-model="form.cargoName"
                    placeholder="货物品名"
                    maxlength="100"
                  />
                </div>
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
                <div
                  v-auth-field:[form.marks]="['101120_FC']"
                  style="text-align: center"
                >
                  <el-input
                    v-model="form.marks"
                    placeholder="唛头"
                    style="text-align: center"
                    maxlength="200"
                  />
                </div>
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
            <div v-auth-field:[packageTypeText]="['101130_FC']">
              <el-radio-group v-model="form.packageType">
                <el-radio
                  v-for="item in packageTypes"
                  :key="item.value"
                  :label="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </div>
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
            <div v-auth-field:[form.bookingPrice]="['101140_FC']">
              <el-input
                v-model.trim="form.bookingPrice"
                placeholder="单价"
                @change="
                  changeZeroHandler({
                    key: 'bookingPrice',
                  })
                "
                :disabled="orderDisableds.bookingPriceDisabled"
                style="width: 200px"
              >
                <template slot="append">
                  <el-select
                    v-model="form.bookingCurrency"
                    placeholder="币种"
                    style="width: 100px"
                    @change="
                      $emit('orderBookingCurrencyChange', form.bookingCurrency)
                    "
                    :disabled="orderDisableds.bookingPriceDisabled"
                  >
                    <el-option
                      v-for="item in currencyTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    >
                      <span>{{ item.label }}</span>
                      <span
                        style="font-size: 12px; color: red"
                        v-if="item.disabled"
                        >暂未设置航班日期所在月份的汇率</span
                      >
                    </el-option>
                  </el-select>
                </template>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item
            label="分泡 (卖价)"
            prop="bubblePoint"
            class="flex-form-item"
          >
            <div v-auth-field:[bubblePointText]="['101150_FC']">
              <el-select
                v-model="form.bubblePoint"
                placeholder="请选择分泡比例"
                :disabled="orderDisableds.bubblePointDisabled"
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
          </el-form-item>
          <el-form-item label="计费重" prop="bookingCw" class="flex-form-item">
            <div v-auth-field:[form.bookingCw]="['101100_FC']">
              <el-input
                v-model.trim="form.bookingCw"
                placeholder="计费重自动填充"
                disabled
                style="width: 172px"
              />
            </div>
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
            <div v-auth-field:[form.expectedInboundTime]="['101180_FC']">
              <el-date-picker
                v-model="form.expectedInboundTime"
                :disabled="orderDisableds.inboundGuideDisabled"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm"
                type="datetime"
                placeholder="选择时间"
                :clearable="false"
                :picker-options="expectedInboundTimePickerOptions"
                style="width: 172px"
                @change="
                  $emit(
                    'orderExpectedInboundTimeChange',
                    form.expectedInboundTime
                  )
                "
              />
            </div>
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
            <div v-auth-field:[cargoTypeText]="['101200_FC']">
              <el-radio-group v-model="form.cargoType">
                <el-radio
                  v-for="item in cargoTypes"
                  :key="item.value"
                  :label="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </div>
          </el-form-item>
        </div>
      </order-section-container>
      <order-section-container title="服务产品">
        <div>
          <!-- 报关服务 -->
          <div style="flex: 1">
            <el-form-item
              label="报关服务"
              prop="customsType"
              class="flex-form-item"
            >
              <div
                v-auth-field:[customsTypeText]="['101220_FC']"
                style="display: inline-block"
              >
                <el-radio-group v-model="form.customsType">
                  <el-radio
                    v-for="item in customsTypes"
                    :key="item.value"
                    :label="item.value"
                    >{{ item.label }}</el-radio
                  >
                </el-radio-group>
              </div>
              <div
                v-auth-field:[ecdModeText]="['101220_FC']"
                style="display: inline-block"
              >
                <el-select
                  v-model="form.ecdMode"
                  placeholder="请选择委托报关方法"
                  style="margin-left: 20px"
                  v-show="showEcdMode"
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
          <div style="flex: 1">
            <el-form-item
              label="国内提货"
              prop="isPickUp"
              class="flex-form-item"
            >
              <div v-auth-field:[pickUpTypeText]="['101220_FC']">
                <el-radio-group v-model="form.isPickUp">
                  <el-radio
                    v-for="item in pickUpTypes"
                    :key="item.value"
                    :label="item.value"
                    >{{ item.label }}</el-radio
                  >
                </el-radio-group>
              </div>
            </el-form-item>
            <!-- 提货详情 -->
            <div class="row-detail" v-show="showPickUpForm">
              <el-form-item
                label="提货时间"
                prop="pickUpTime"
                class="flex-form-item"
              >
                <div v-auth-field:[form.pickUpTime]="['101220_FC']">
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
                </div>
              </el-form-item>
              <el-form-item
                label="提货地址"
                prop="pickUpAddress"
                class="flex-form-item"
              >
                <div v-auth-field:[form.pickUpAddress]="['101220_FC']">
                  <el-input
                    v-model.trim="form.pickUpAddress"
                    placeholder="提货地址"
                    maxlength="50"
                    show-word-limit
                    clearable
                  />
                </div>
              </el-form-item>
              <el-form-item
                label="提货联系人"
                prop="pickUpContacts"
                class="flex-form-item"
              >
                <div v-auth-field:[form.pickUpContacts]="['101220_FC']">
                  <el-input
                    v-model.trim="form.pickUpContacts"
                    placeholder="提货联系人"
                    maxlength="15"
                    show-word-limit
                    clearable
                  />
                </div>
              </el-form-item>
              <el-form-item
                label="联系电话"
                prop="pickUpTel"
                class="flex-form-item"
              >
                <div v-auth-field:[form.pickUpTel]="['101220_FC']">
                  <el-input
                    v-model.trim="form.pickUpTel"
                    placeholder="联系电话"
                    maxlength="20"
                    show-word-limit
                    clearable
                  />
                </div>
              </el-form-item>
            </div>
          </div>
          <!-- 清关服务 -->
          <div style="flex: 1">
            <el-form-item
              label="清关服务"
              prop="cclType"
              class="flex-form-item"
            >
              <div v-auth-field:[cclTypeText]="['101220_FC']">
                <el-radio-group v-model="form.cclType">
                  <el-radio
                    v-for="item in cclTypes"
                    :key="item.value"
                    :label="item.value"
                    >{{ item.label }}</el-radio
                  >
                </el-radio-group>
              </div>
            </el-form-item>
            <!-- 清关详情 -->
            <div class="row-detail" v-show="showDeliveryForm">
              <el-form-item
                label="送货地址"
                prop="deliveryAddress"
                class="flex-form-item"
              >
                <div v-auth-field:[form.deliveryAddress]="['101220_FC']">
                  <el-input
                    v-model.trim="form.deliveryAddress"
                    placeholder="送货地址"
                    maxlength="200"
                    show-word-limit
                    clearable
                  />
                </div>
              </el-form-item>
              <el-form-item
                label="送货联系人"
                prop="deliveryContacts"
                class="flex-form-item"
              >
                <div v-auth-field:[form.deliveryContacts]="['101220_FC']">
                  <el-input
                    v-model.trim="form.deliveryContacts"
                    placeholder="送货联系人"
                    maxlength="50"
                    show-word-limit
                    clearable
                  />
                </div>
              </el-form-item>
              <el-form-item
                label="联系电话"
                prop="deliveryTel"
                class="flex-form-item"
              >
                <div v-auth-field:[form.deliveryTel]="['101220_FC']">
                  <el-input
                    v-model.trim="form.deliveryTel"
                    placeholder="联系电话"
                    maxlength="20"
                    show-word-limit
                    clearable
                  />
                </div>
              </el-form-item>
            </div>
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
            <div v-auth-field:[form.customerContact]="['101240_FC']">
              <el-input
                v-model.trim="form.customerContact"
                placeholder="客户联系人"
                maxlength="30"
                show-word-limit
              />
            </div>
          </el-form-item>
          <el-form-item
            label="客户联系方式"
            prop="contactInfo"
            style="flex: 1"
            class="flex-form-item"
          >
            <div v-auth-field:[form.contactInfo]="['101260_FC']">
              <el-input
                v-model.trim="form.contactInfo"
                placeholder="客户联系方式"
                maxlength="30"
                show-word-limit
              />
            </div>
          </el-form-item>
          <el-form-item
            label="客户备注"
            prop="contactRemark"
            style="flex: 1"
            class="flex-form-item"
          >
            <div v-auth-field:[form.contactRemark]="['101280_FC']">
              <el-input
                v-model="form.contactRemark"
                placeholder="客户备注"
                maxlength="30"
                show-word-limit
              />
            </div>
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
            <div v-auth-field:[form.remark]="['105040_FC']">
              <el-input
                type="textarea"
                v-model="form.remark"
                placeholder="订单备注"
                maxlength="200"
                show-word-limit
                style="width: 100%"
              />
            </div>
          </el-form-item>
        </div>
      </order-section-container>
      <order-section-container
        title="托书"
        v-if="
          agentBookingNote.show ||
          customNote.show ||
          !$utils.authCheckDisabled(['152009_B'])
        "
      >
        <div style="display: flex">
          <!-- 上家托书 -->
          <div
            v-auth:none="['152015_B']"
            v-if="agentBookingNote.show"
            :class="{ 'note-disabled': orderDisableds.freezedOrderDisabled }"
          >
            <el-form-item label="上家托书">
              <div class="booking-notes">
                <div class="note-item" @click="downLoadMyPowerOfAttorney">
                  <dc-img name="pdf" />
                  <p class="note-name">
                    {{ agentBookingNote.name }}
                  </p>
                </div>
              </div>
            </el-form-item>
          </div>
          <!-- 客户托书 -->
          <div
            v-auth:none="['152016_B']"
            v-if="customNote.show"
            :class="{ 'note-disabled': orderDisableds.freezedOrderDisabled }"
          >
            <el-form-item label="客户托书">
              <div class="booking-notes">
                <div
                  class="note-item"
                  v-for="item in bookingNotes"
                  :key="item.id"
                  @click="
                    $utils.downloadFile({
                      url: item.xpath,
                      name: item.attachmentName,
                      disabled: orderDisableds.freezedOrderDisabled,
                    })
                  "
                >
                  <div>
                    <dc-img name="pdf" />
                  </div>
                  <p class="note-name">
                    {{ item.attachmentName }}
                  </p>
                </div>
              </div>
            </el-form-item>
          </div>
          <div style="margin-top: auto">
            <dc-form>
              <el-button
                type="text"
                v-auth="['152009_B']"
                @click="
                  $router.push({
                    name: 'OrderHistory',
                    query: { id: order.id },
                  })
                "
                >历史操作记录</el-button
              >
            </dc-form>
          </div>
        </div>
      </order-section-container>
    </dc-form>
  </div>
</template>

<script>
import BookingTable from "./BookingTable.vue";
import DcStatus from "@/status";
// 需要父子通信的数据
const OrderKeys = [
  "companyName", // 订舱客户
  "customerResponsibleName", // 客户负责人
  "sysOrgName", // 订单所属公司
  "costPrice", // 成本价 (航线报价)
  "miscellaneousFees", // 杂费 (航线报价)
  "principalName", // 航线人员
  "ownRote", // 是否为自有航线
  "costBubblePoint", // 分泡 (成本)
  "pol", // 始发站
  "pod", // 到达站
  "airCompanyCode", // 航司code
  "airCompanyName", // 航司名
  "departureDate", // 航班日期
  "shipper", // 发货人名称、地址和电话
  "notifier", // 通知人
  "consignee", // 收货人名称、地址和电话
  "bookingPiece", // 订舱件数
  "bookingWeight", // 订舱毛重
  "bookingCbm", // 订舱体积
  "cargoName", // 货物品名
  "marks", // 唛头
  "packageType", // 包装类型
  "trayDetail", // 托盘数据
  "bookingPrice", // 订舱单价
  "bubblePoint", // 分泡比例
  "bookingVwr", // 	订舱比重
  "bookingCw", // 订舱计费重
  "expectedInboundTime", // 预计进仓时间
  "cargoType", // 货物类型
  "customsType", // 报关服务
  "ecdMode", // 委托报关模式
  "isPickUp", // 国内提货
  "pickUpTime", // 提货时间
  "pickUpAddress", // 提货地址
  "pickUpTel", // 提货联系电话
  "pickUpContacts", // 提货联系人
  "cclType", // 清关服务
  "deliveryAddress", // 送货地址
  "deliveryTel", // 送货联系电话
  "deliveryContacts", // 送货联系人
  "customerContact", // 客户联系人
  "contactInfo", // 客户联系方式
  "contactRemark", // 客户备注
  "remark", // 订单备注
  "payWay", // 单票结算方式
  "costCurrency", // 成本币种
  "bookingCurrency", // 售价币种
];
export default {
  name: "BookingForm",
  components: {
    BookingTable,
  },
  created() {
    this.init();
  },
  props: {
    order: {
      type: Object,
      default: () => ({}),
    },
    getPols: {
      type: Function,
      default: () => {},
    },
    getPods: {
      type: Function,
      default: () => {},
    },
    pols: {
      type: Array,
      default: () => [],
    },
    pods: {
      type: Array,
      default: () => [],
    },
    airCompanys: {
      type: Array,
      default: () => [],
    },
    getAirCompanysByKeyWord: {
      type: Function,
      default: () => {},
    },
    payWays: {
      type: Array,
      default: () => [],
    },
    principalList: {
      type: Array,
      default: () => [],
    },
    currencyTypes: {
      type: Array,
      default: () => [],
    },
    orderDisableds: {
      type: Array,
      default: () => ({}),
    },
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
      ownRotes,
    } = DcStatus.commonStatus;
    return {
      form: {},
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
      trayList: [],
      cargoTypes, // 品类列表
      packageTypes, // 包装列表
      customsTypes, // 报关服务列表
      pickUpTypes, // 国内提货列表
      cclTypes, // 清关服务列表
      bubblePoints, // 分泡比例表
      ecdModes, // 委托报关方法
      ownRotes,
    };
  },
  computed: {
    payWayText() {
      const payWay = DcStatus.commonStatus.getStatus(
        "payWays",
        this.form.payWay
      );
      return (payWay || {}).label || "";
    },
    packageTypeText() {
      const packageType = DcStatus.commonStatus.getStatus(
        "packageTypes",
        this.form.packageType
      );
      return (packageType || {}).label;
    },
    ownRoteText() {
      const ownRote = DcStatus.commonStatus.getStatus(
        "ownRotes",
        this.form.ownRote
      );
      return (ownRote || {}).label;
    },
    costBubblePointText() {
      const bubblePoint = DcStatus.commonStatus.getStatus(
        "bubblePoints",
        this.form.costBubblePoint
      );
      return (bubblePoint || {}).label;
    },
    bubblePointText() {
      const bubblePoint = DcStatus.commonStatus.getStatus(
        "bubblePoints",
        this.form.bubblePoint
      );
      return (bubblePoint || {}).label;
    },
    cargoTypeText() {
      const cargoType = DcStatus.commonStatus.getStatus(
        "cargoTypes",
        this.form.cargoType
      );
      return (cargoType || {}).label;
    },
    customsTypeText() {
      const customsType = DcStatus.commonStatus.getStatus(
        "customsTypes",
        this.form.customsType
      );
      return (customsType || {}).label;
    },
    ecdModeText() {
      const ecdMode = DcStatus.commonStatus.getStatus(
        "ecdModes",
        this.form.ecdMode
      );
      return (ecdMode || {}).label;
    },
    pickUpTypeText() {
      const pickUpType = DcStatus.commonStatus.getStatus(
        "pickUpTypes",
        this.form.isPickUp
      );
      return (pickUpType || {}).label;
    },
    cclTypeText() {
      const cclType = DcStatus.commonStatus.getStatus(
        "cclTypes",
        this.form.cclType
      );
      return (cclType || {}).label;
    },
    computedRules() {
      return {
        costPrice: [
          {
            required: true,
            message: "请填写成本价(航线报价)",
          },
        ],
        ownRote: [
          {
            required: true,
            message: "请填写成本价(航线报价)",
            trigger: "change",
          },
        ],
        principalName: [
          {
            required: ![1].includes(this.order.status),
            message: "请选择航线负责人",
            trigger: "change",
          },
        ],
        costBubblePoint: [
          {
            required: true,
            message: "请选择分泡比例(成本)",
          },
        ],
        pol: [
          {
            required: true,
            message: "请选择始发站",
            trigger: "change",
          },
        ],
        pod: [
          {
            required: true,
            message: "请选择到达站",
            trigger: "change",
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
            trigger: "change",
          },
        ],
        bookingPiece: [
          {
            required: true,
            message: "请填写件数",
          },
        ],
        bookingWeight: [
          {
            required: true,
            message: "请填写毛重",
          },
        ],
        bookingCbm: [
          {
            required: true,
            message: "请填写体积",
          },
        ],
        cargoName: [
          {
            required: true,
            message: "请填写货物品名",
          },
        ],
        packageType: [
          {
            required: true,
            message: "请选择包装类型",
            trigger: "change",
          },
        ],
        bookingPrice: [
          {
            required: true,
            message: "请填写单价",
          },
        ],
        bubblePoint: [
          {
            required: true,
            message: "请选择分泡比例",
            trigger: "change",
          },
        ],
        bookingCw: [
          {
            required: true,
            message: "无法计算出有效计费重",
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
            trigger: "change",
          },
          {
            trigger: "change",
            validator: (rule, value, callback) => {
              const departureDate = new Date(this.form.departureDate).getTime();
              const expectedInboundTime = new Date(value).getTime();
              if (departureDate < expectedInboundTime) {
                callback(new Error("请选择早于航班日期的预计进仓时间"));
              }
              callback();
            },
          },
        ],
        cargoType: [
          {
            required: true,
            message: "请选择货物类型",
            trigger: "change",
          },
        ],
        customsType: [
          {
            required: true,
            message: "请选择报关服务",
            trigger: "change",
          },
        ],
        pickUpTime: [
          {
            required: this.showPickUpForm,
            message: "请选择提货时间",
            trigger: "change",
          },
          {
            trigger: "change",
            validator: (rule, value, callback) => {
              const departureDate = new Date(this.form.departureDate).getTime();
              const expectedInboundTime = new Date(value).getTime();
              if (departureDate < expectedInboundTime) {
                callback(new Error("请选择早于航班日期的提货时间"));
              }
              callback();
            },
          },
        ],
        isPickUp: [
          {
            required: true,
            message: "请选择国内提货服务",
            trigger: "change",
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
            trigger: "change",
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
    // 上家托书信息
    agentBookingNote() {
      const { pol, pod, airCompanyCode, departureDate } = this.order;
      const date = this.$utils.dayjs(departureDate).format("MM.DD");
      return {
        name: `${pol}-${pod}-${airCompanyCode} ${date} 托书.pdf`,
        show: this.order.canSeeAgentNote === 0,
      };
    },
    // 客户托书
    customNote() {
      return {
        show: this.bookingNotes && this.bookingNotes.length > 0,
      };
    },
    bookingNotes() {
      return this.order.orderAttachmentList
        .filter((item) => {
          return item.attachmentType === 3;
        })
        .map((item) => {
          return {
            ...item,
          };
        });
    },
  },
  methods: {
    // 下载上家托书
    async downLoadMyPowerOfAttorney() {
      if (this.orderDisableds.freezedOrderDisabled) {
        return;
      }
      const {
        data: { xpath: url },
      } = await this.$api.createAgentBookingNotePdf(this.order.id);
      this.$utils.downloadFile({ url, name: this.agentBookingNote.name });
    },
    init() {
      const form = this.$utils.copyDataByKeys(this.order, OrderKeys);
      const { airCompanyCode, airCompanyName, trayDetail } = form;
      this.form = {
        ...form,
        airCompany: `${airCompanyCode}-${airCompanyName}`,
      };
      this.trayList = trayDetail ? JSON.parse(trayDetail) : [];
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
      this.$emit("orderAirCompanyChange", {
        airCompanyCode,
        airCompanyName,
      });
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
        this.orderChange(key, "");
        return;
      }
      this.orderChange(key, newVal);
    },
    orderChange(key, val) {
      switch (key) {
        case "bookingPrice":
          this.$emit("orderBookingPriceChange", val);
          break;
        case "costPrice":
          this.$emit("orderCostPriceChange", val);
          break;
        case "miscellaneousFees":
          this.$emit("orderMiscellaneousFeesChange", val);
          break;
        default:
          break;
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
      this.$emit("orderBookingDataChange", {
        bookingCbm: this.form.bookingCbm,
        bookingCw: this.form.bookingCw,
        bookingVwr: this.form.bookingVwr,
        bookingWeight: this.form.bookingWeight,
        bubblePoint: this.form.bubblePoint,
        bookingPiece: this.form.bookingPiece,
      });
      if (!this.orderDisableds.bookingDataDisabled) {
        this.$emit("orderInboundCwChange", this.form.bookingCw);
        this.$emit("orderCostCwChange");
      }
    },
    formValidate(isValidate = true) {
      const formData = this.getFormData();
      if (!isValidate) {
        return Promise.resolve(formData);
      }
      return new Promise((resolve, reject) => {
        this.$refs.form.form.validate((valid, errorKeys) => {
          if (valid) {
            resolve(formData);
          } else {
            Object.entries(errorKeys).find(([key, val]) => {
              if (val[0]) {
                this.$message.error(val[0].message);
                return true;
              }
            });
            reject();
            return false;
          }
        });
      });
    },
    getFormData() {
      const order = this.$utils.copyDataByKeys(this.order, OrderKeys);
      const form = Object.entries(order).reduce((obj, [key, val]) => {
        if (
          val !== this.form[key] &&
          val !== Number(this.form[key]) &&
          this.form[key] !== "null" &&
          this.form[key] !== null
        ) {
          obj = {
            ...obj,
            [key]: this.form[key],
          };
        }
        return obj;
      }, {});
      return form;
    },
    principalChange(val) {
      const { value: principalId, label: principalName } =
        this.principalList.find((item) => item.value === val);
      this.form = {
        ...this.form,
        principalId,
        principalName,
      };
      this.$emit("orderPrincipalChange", {
        principalId,
        principalName,
      });
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
  },
};
</script>

<style lang="less" scoped>
.booking-form {
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
  .booking-notes {
    display: flex;
    padding-top: 10px;
    .note-item {
      margin-right: 20px;
      width: 100px;
      text-align: center;
      font-size: 12px;
      line-height: 1.2;
    }
    .note-name {
      margin-top: 10px;
      cursor: pointer;
    }
  }
  .note-disabled {
    cursor: not-allowed;
  }
}
</style>