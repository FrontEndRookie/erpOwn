// [整数, 小数] 不填默认 [10**9, 0]
export default {
  // 托盘数据
  trayNumber: [4], // 托盘数量
  traySize: [3], // 托盘长
  trayWidth: [3], // 托盘宽
  trayHeight: [3], // 托盘高
  // 进仓数据
  inboundPiece: [4], //进仓件数
  inboundWeight: [6, 2], //进仓毛重
  inboundCbm: [4, 4], //进仓体积
  inboundCw: [8, 3], //进仓计费重
  // 进仓子数据
  inboundSubPiece: [4], // 件数
  inboundSubWeight: [6, 2], // 重量
  inboundSubCbm: [4, 4], // 体积
  inboundSubLength: [6, 2], // 长
  inboundSubWidth: [6, 2], // 宽
  inboundSubHeight: [6, 2], // 高
  // 订舱数据
  bookingPrice: [6, 2], // 订舱价格
  bookingPiece: [4], // 订舱件数
  bookingWeight: [6, 2], // 订舱毛重
  bookingCbm: [4, 4], // 订舱体积
  costPrice: [6, 2], // 订舱价格(成本)
  miscellaneousFees: [6, 2], // 杂费(成本)
  contactInfo: [11], // 客户联系方式
  // 账单
  billPrice: [6, 2], // 费用价格
  billQuantity: [8, 3], // 费用数量
  applyAmountOrgn: [9, 2], // 申请开票金额
  // 客户
  businessContactTel: [11], // 业务联系人手机号码
  businessContactQq: [15], // 业务联系人QQ
  financialContactTel: [11], // 财务联系人手机号码
  financialContactQq: [15], // 财务联系人QQ
  adminAccount: [11], // 企业管理员账号
  accountingPeriod: [3], // 结算账期
  quota: [8], // 授信额度
  // 供应商
  busPhone: [11], // 业务联系人手机号码
  busQQ: [15], // 业务联系人QQ
  finPhone: [11], // 财务联系人手机号码
  finQQ: [15], // 财务联系人QQ
  settlementDays: [3], // 结算账期
  creditLimit: [8], // 授信额度
}