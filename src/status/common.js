
const commonStatus = {
  // 货物品类 t_order
  cargoTypes: [
    {
      value: 1,
      label: "普货",
    },
    {
      value: 2,
      label: "化工品",
    },
    {
      value: 3,
      label: "危险品",
    },
    {
      value: 4,
      label: "防疫物资",
    },
    {
      value: 5,
      label: "电商货物",
    },
  ],
  // 包装类型 t_order
  packageTypes: [
    {
      value: 1,
      label: "散货",
    },
    {
      value: 2,
      label: "托盘",
    },
  ],
  // 分泡比例 t_order
  bubblePoints: [
    {
      value: 10,
      label: "不分泡",
    },
    {
      value: 1,
      label: "1/9",
      volumeRatio: 0.1,
      weightRatio: 0.9,
    },
    {
      value: 2,
      label: "2/8",
      volumeRatio: 0.2,
      weightRatio: 0.8,
    },
    {
      value: 3,
      label: "3/7",
      volumeRatio: 0.3,
      weightRatio: 0.7,
    },
    {
      value: 4,
      label: "4/6",
      volumeRatio: 0.4,
      weightRatio: 0.6,
    },
    {
      value: 5,
      label: "5/5",
      volumeRatio: 0.5,
      weightRatio: 0.5,
    },
    {
      value: 6,
      label: "6/4",
      volumeRatio: 0.6,
      weightRatio: 0.4,
    },
    {
      value: 7,
      label: "7/3",
      volumeRatio: 0.7,
      weightRatio: 0.3,
    },
    {
      value: 8,
      label: "8/2",
      volumeRatio: 0.8,
      weightRatio: 0.2,
    },
    {
      value: 9,
      label: "9/1",
      volumeRatio: 0.9,
      weightRatio: 0.1,
    },
    {
      value: 11,
      label: "1/3",
      volumeRatio: 2/3,
      weightRatio: 1/3,
    },
    {
      value: 12,
      label: "2/3",
      volumeRatio: 1/3,
      weightRatio: 2/3,
    },
    {
      value: 13,
      label: "分半泡",
      volumeRatio: 0.5,
      weightRatio: 0.5,
    },
  ],
  // 报关服务类型 t_order
  customsTypes: [
    {
      value: 1,
      label: "自行报关",
    },
    {
      value: 2,
      label: "委托报关",
    },
  ],
  // 委托报关方法 t_order
  ecdModes: [
    {
      value: 1,
      label: "一般贸易",
    },
    {
      value: 2,
      label: "小包（9610）",
    },
    {
      value: 3,
      label: "FBA（9710/9810）",
    },
  ],
  // 国内提货类型 t_order
  pickUpTypes: [
    {
      value: 1,
      label: "不需要",
    },
    {
      value: 2,
      label: "需要",
    },
  ],
  // 清关服务类型 t_order
  cclTypes: [
    {
      value: 1,
      label: "自行清关",
    },
    {
      value: 2,
      label: "DDU",
    },
    {
      value: 3,
      label: "DDP",
    },
    {
      value: 4,
      label: "DAP",
    },
  ],
  // 进仓数据分数据包装方式 t_order
  subInboundPackingTypes: [
    {
      value: 1,
      label: "纸箱",
    },
    {
      value: 2,
      label: "夹板箱",
    },
    {
      value: 3,
      label: "托盘",
    },
    {
      value: 4,
      label: "木箱",
    },
  ],
  // 进仓数据分数据外箱情况 t_order
  subInboundOuterBoxTypes: [
    {
      value: 1,
      label: "正常",
    },
    {
      value: 2,
      label: "异常",
    },
  ],
  // 账单类型 t_order_price
  expenseTypes: [
    {
      value: 1,
      label: "应收",
      totalWoCnyField: 'totalRcWoCny', // 核销金额字段
    },
    {
      value: 2,
      label: "应付",
      totalWoCnyField: 'totalApWoCny', // 核销金额字段
    },
  ],
  // 币种类型 t_bill_detail
  currencyTypes: [
    {
      value: 1,
      name: '人民币',
      label: 'CNY',
      code: 'CNY',
      symbol: '￥'
    }, {
      value: 2,
      name: '港币',
      label: '港币',
      code: 'HKD',
      symbol: "HK$"
    }, {
      value: 3,
      name: '美元',
      label: '美元',
      code: 'USD',
      symbol: '$'
    }, {
      value: 4,
      name: '欧元',
      label: '欧元',
      code: 'EUR',
      symbol: '€'
    }, {
      value: 5,
      name: '英镑',
      label: '英镑',
      code: 'GBP',
      symbol: '￡',
    }
  ],
  // 结算方式 t_order
  payWays: [
    {
      value: 0,
      label: "付款买单",
    },
    {
      value: 1,
      label: "月结买单",
    },
    {
      value: 2,
      label: "固定天数",
    },
  ],
  // 代理结算方式 t_order
  agentPayWays: [
    {
      value: 0,
      label: "付款买单",
    },
    {
      value: 1,
      label: "月结买单",
    },
    {
      value: 2,
      label: "固定天数",
    },
  ],
  // 寄单地址 前端写死
  customsAddressList: [
    {
      label: "上海航联",
      value:
        "(航联报关行)上海市浦东新区闻居路1333号B区528室 祝卫杰 18217031902",
    },
    {
      label: "上海瑞懿",
      value:
        "(瑞懿报关行)上海市浦东新区施湾七路997号1号楼208/209室 程瑞 18964969018",
    },
  ],
  // 应收账单对账状态
  arOrderReconciliationStatusList: [
    {
      label: "暂未确认应收账单",
      value: 0,
    },
    {
      label: "账单已发送，等待客户确认....",
      value: 1,
    },
    {
      label: "账单已确认",
      value: 2,
    },
    {
      label: "费用已确认，开票申请已提交",
      value: 3,
    },
    {
      label: "账单已确认，发票开具",
      value: 4,
    },
  ],
  // 应付费用账单状态
  apFeeStatusList: [
    {
      label: "暂未确认应付账单",
      value: 0,
    },
    {
      label: "应付账单已确认",
      value: 1,
    },
    {
      label: "应付账单修改中",
      value: 2,
    },
  ],
  // 应付账单交单状态 t_order_price financeStatus
  apOrderPresentationStatusList: [
    {
      label: "未交单",
      value: 0,
    },
    {
      label: "已交单",
      value: 1,
    },
    {
      label: "申请解锁",
      statusText: '解锁已申请，等待审核',
      value: 2,
    },
    {
      label: "交单待审核",
      value: 3,
    },
    {
      label: "修改中",
      value: 4,
    },
  ],
  billOperationTypes: [
    {
      label: "交单",
      value: 0,
    },
    {
      label: "解锁申请",
      value: 1,
    },
    {
      label: "解锁通过",
      value: 2,
    },
    {
      label: "解锁驳回",
      value: 3,
    },
    {
      label: "审核通过",
      value: 4,
    },
    {
      label: "审核驳回",
      value: 5,
    },
  ],
  // 发票类型 t_invoice_apply
  invoiceTypes: [
    {
      label: "增值税普通发票",
      shortName: '纸质普票',
      value: 0,
    },
    {
      label: "增值税专用发票",
      shortName: '纸质专票',
      value: 1,
    },
    {
      label: "增值税电子普通发票",
      shortName: '电子普票',
      value: 2,
    },
    {
      label: "DEBIT NOTE",
      shortName: 'DEBIT NOTE',
      value: 3,
    },
  ],
  // 是否允许合并开票 t_invoice_apply
  merges: [
    {
      label: "合并开票",
      billingRecordsName: '月结开票',
      value: 0,
    },
    {
      label: "单独开票",
      billingRecordsName: '单独开票',
      value: 1,
    },
  ],
  settlementWays: [
    {
      value: 1,
      label: "付款买单",
    },
    {
      value: 2,
      label: "月结买单",
    },
    {
      value: 3,
      label: "固定天数",
    },
  ],
  supplierTypes: [
    {
      value: 4,
      label: "报关行",
    },
    {
      value: 3,
      label: "磁检",
    },
    {
      value: 2,
      label: "刻章",
    },
    {
      value: 5,
      label: "其他",
    },
    {
      value: 6,
      label: "空运",
    },
    {
      value: 7,
      label: "海运整柜",
    },
    {
      value: 8,
      label: "海运拼箱",
    },
    {
      value: 9,
      label: "海运散杂船",
    },
    {
      value: 10,
      label: "铁路",
    },
    {
      value: 11,
      label: "FBA专线",
    },
    {
      value: 12,
      label: "快递",
    },
    {
      value: 13,
      label: "陆运",
    },
    {
      value: 14,
      label: "国外",
    },
    {
      value: 15,
      label: "车队",
    },
  ],
  // 是否为自有航线 t_order
  ownRotes: [
    {
      value: 1,
      label: "是"
    },
    {
      value: 0,
      label: "否"
    },
  ],
  // 货物或应税劳务、服务名称 t_invoice_apply
  taxableServices: [
    {
      label: "国际代理运费",
      value: 0,
      invoiceTypes: [0, 2],
    },
    {
      label: "国际货物运输代理服务费",
      value: 1,
      invoiceTypes: [0, 2],
    },
    {
      label: "国际货物运输代理费",
      value: 2,
      invoiceTypes: [0, 2],
    },
    {
      label: "国内代理运输费",
      value: 3,
      invoiceTypes: [1],
    },
  ],
}
commonStatus.getStatus = (statusName, statusCode) => {
  return commonStatus[statusName].find(item => item.value === statusCode)
}
commonStatus.getStatusNew = (statusNames, statusCode) => {
  return statusNames.find(item => item.id === statusCode)
}
export default commonStatus