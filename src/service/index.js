//ng开发环境
const { BASE_URL: pulicWeb } = process.env

const serviceApi = {
  // 登录
  login: pulicWeb + '/t-sys-user/login',
  //用户查询
  userRoleList: pulicWeb + '/t-sys-user/queryUserList',
  //用户新增
  userAdd: pulicWeb + '/t-sys-user/add',
  //用户编辑
  userUpdate: pulicWeb + '/t-sys-user/update',
  //用户修改密码
  userUpdatePassword: pulicWeb + '/t-sys-user/updatePassword',
  //角色查询
  roleSearch: pulicWeb + '/t-sys-role/search',
  //新增角色
  roleAdd: pulicWeb + '/t-sys-role/add',
  //删除角色
  roleDelete: pulicWeb + '/t-sys-role/delete',
  //编辑角色
  roleUpdate: pulicWeb + '/t-sys-role/update',
  //模块查询
  moduleSearch: pulicWeb + '/t-sys-module/search',
  //模块新增
  moduleAdd: pulicWeb + '/t-sys-module/add',
  //模块修改
  moduleUpdate: pulicWeb + '/t-sys-module/update',
  //模块删除
  moduleDelete: pulicWeb + '/t-sys-module/delete',
  //代理列表查询
  agentList: pulicWeb + '/t-agent/list',
  //代理列表查询全
  agentListAll: pulicWeb + '/t-agent/listIdAndAgent',
  // 代理删除查询是否绑定航线
  isAlineAgent: pulicWeb + '/t-airline-agent/getAirlineAgentCount',
  //代理列表新增
  agentSave: pulicWeb + '/t-agent/save',
  //代理列表修改
  agentUpdate: pulicWeb + '/t-agent/update',
  //代理列表修改2
  saveMscs: pulicWeb + '/agent_belong/saveMscs',
  //代理列表删除
  agentDelete: pulicWeb + '/t-agent/delete',
  
  // 全部订单导出明细 /faw/t-order/downNeedTimeExecl
  downNeedTimeExecl: pulicWeb + '/t-order/downNeedTimeExecl',

  //一代管理

  ///faw/ 资格审核预检查
  perExamine: pulicWeb + '/t-agent/per-examine',
  // 导出列表
  downloadExeclAgent: pulicWeb + '/t-agent/downloadExecl',
  // 供应商列表/faw/t-agent/listAgent
  getlistAgent: pulicWeb + '/t-agent/listAgent',
  // 修改供应商级别
  changeLevel: pulicWeb + '/t-agent/changeLevel',
  // 通过名称或社会统一信用代码获取公司基本信息
  getCompanyInfo: pulicWeb + '/t-agent/getCompanyInfo',
  // 上传营业执照文件
  uploadImage: pulicWeb + '/t-agent/uploadImage',
  // 保存或更新代理 
  saveOrUpdateAgent: pulicWeb + '/t-agent/saveOrUpdateAgent',
  // 一代管理查询
  listPrimaryAgent: pulicWeb + '/t-agent/listPrimaryAgent',
  // 查看操作历史
  ydHistory: pulicWeb + '/t-agent/history',
  // 修改一代资格
  changePrimaryAgentStatus: pulicWeb + '/t-agent/changePrimaryAgentStatus',
  // 资格审核
  examine: pulicWeb + '/t-agent/examine',
  //删除已违规的标签
  deleteLable: pulicWeb + '/t-agent/deleteLable',

  // 特价发布Api
  // 查询列表
  specialList: pulicWeb + '/t-discount-info/list',
  //客户名称下拉
  specialListApplicantName: pulicWeb + '/t-discount-info/listApplicantName',
  // 上传图片
  // special: pulicWeb + '/pre_airline/uploadImage',
  //审核
  specialStatus: pulicWeb + '/t-discount-info/changeStatus',
  // 查看历史
  specialListLog: pulicWeb + '/t-discount-info/history',

  // 精品航线Api
  // 选择周期
  goodWeeks: pulicWeb + '/pre_airline/noAuth/getTwoRoundInfo',
  // 查询列表
  goodRouterList: pulicWeb + '/pre_airline/list',
  //客户名称下拉
  goodRouterListApplicantName: pulicWeb + '/pre_airline/listApplicantName',
  // 上传图片
  goodRouterImage: pulicWeb + '/pre_airline/uploadImage',
  //审核
  goodRouterStatus: pulicWeb + '/pre_airline/changeStatus',
  // 查看历史
  goodRouterlistLog: pulicWeb + '/pre_airline/listLog',
  // 判断位置是否可以更换 /pre_airline/findByweeksAndPos 
  goodRouterPTtoPT: pulicWeb + '/pre_airline/findByweeksAndPos',
  // 更新精品航线 pre_airline/updatePreDomain
  goodRouterUpdatePreDomain: pulicWeb + '/pre_airline/updatePreDomain',

  // 系统设置
  // 增加更新设置接口 /faw/system-setting/saveOrUpdate
  systemSetDate: pulicWeb + '/system-setting/saveOrUpdate',
  // 获取正在生效的系统设置 /faw/system-setting/selectOpenStatusOne
  systemSGetDate: pulicWeb + '/system-setting/selectOpenStatusOne',
  // 系统设置分页查询 /faw/system-setting/selectPage
  systemSetPageList: pulicWeb + '/system-setting/selectPage',
  // // 更新、新增系统设置/faw/system-setting/saveOrUpdate
  // upAndaddSysSetList: pulicWeb + '/system-setting/saveOrUpdate',
  // 删除系统设置/faw/system-setting/deleteByIds
  deleteSystemSetList:pulicWeb + '/system-setting/deleteByIds',

   // 客户管理
    //  查询企业列表（权限）?type=1 get
    getCompanyListAboutClient: pulicWeb + '/t-authentication-company/searchQueryList?type=1',
    //  查询客户负责人（包含一级公司名称） get
    findUsersAndBranchOrg: pulicWeb + '/t-org-user/findUsersAndBranchOrg',
    //  客户负责人所在分公司 （包含一级公司名称） get
    searchFirstLevelOrgs: pulicWeb + '/t-sys-org/searchFirstLevelOrgs',
   // 分页查询客户信息 
   getUserInfoList: pulicWeb + '/t-authentication-company/selectAuthenticationCompanyPage',
   // 客户管理页面导出 
   exportUserList: pulicWeb + '/t-authentication-company/authenticationCompanyExport',
   // 客户管理页面选中导出  /faw/t-authentication-company/authenticationCompanyListExport
   exportUserListAll: pulicWeb + '/t-authentication-company/authenticationCompanyListExport',
   // 客户管理设置保存
   userSetUpdata: pulicWeb + '/t-authentication-company/update',
   // 客户管理操作历史
   userHistoryData: pulicWeb + '/account-period-limit-change-record/list',
   // 客户管理操作历史
   getUserCompanyList: pulicWeb + '/t-authentication-company/selectSimpleAuthenticationCompanyList',

  // 埋点查表
  getBuriedPointTable: pulicWeb + '/t-buried-point-track/sumDetail',

  //订单管理
  // 订单分页查询列表
  selectOrderManagePage: pulicWeb + '/t-order/selectOrderManagePage',
  // 订单管理导出
  orderManageExport: pulicWeb + '/t-order/orderManageExport',
  // 选中的订单管理导出 /faw/t-order/orderManageListExport
  orderManageListExport: pulicWeb + '/t-order/orderManageListExport',
  // 特批截止日期更新 /faw/t-order/update
  specialEndUpdate: pulicWeb + '/t-order/update',
  // 特批截止日期更新 /faw/t-order/batchUpdate
  specialEndUpdateAll: pulicWeb + '/t-order/batchUpdate',
  // 清空特批截止日期更新 faw/t-order/clearSpecialApprovalDeadline
  specialEndUpdateClear: pulicWeb + '/t-order/clearSpecialApprovalDeadline',
  // 订单管理操作历史 /faw/t-order-edit-history/list
  orderHistoryData: pulicWeb + '/t-order-edit-history/list',
  // 导出超期订单信息
  overDueOrderExportList: pulicWeb + '/t-order/overDueOrderExport',

  //上传Banner图片
  uploadBannerImage: pulicWeb + '/t-banner/uploadBannerImage',
  //保存/修改Banner信息
  changeBanner: pulicWeb + '/t-banner/changeBanner',
  //后台广告管理展示
  manageBannerList: pulicWeb + '/t-banner/manageBannerList',
  //航线价格导出 id 旧
  // airlineExcelExport: pulicWeb + '/t-rates/exportExcel',
  //航线价格导出 id 新（恒坤）
  airlineExcelExport: pulicWeb + '/t-rates/exportAirlineToExcel',
  //航线价格导出 全部 新（恒坤）
  allAirlineExcelExport: pulicWeb + '/t-rates/exportExcel',
  //航线价格导入1航线人员
  airlineExcelImport: pulicWeb + '/t-rates/importExcel',
  //航线价格导入2供应商
  airlineExcelImport2: pulicWeb + '/t-rates/importAgentExcel',
  //代理导入
  agentDataImport: pulicWeb + '/t-agent/agentDataImport',
  // //客户导入
  companyDataImport: pulicWeb + '/t-authentication-company/companyDataImport',

  // 二代价格导入
  airPriceImport: pulicWeb + '/t-rates/importExcelOriginal',
  //航线价格导入
  downloadTemplate: pulicWeb + '/t-rates/downloadTemplate',
  //三字代码查询分页
  airportSearchByPage: pulicWeb + '/t-airport/word-code/searchByPage',
  //二字代码查询分页
  companySearchByPage: pulicWeb + '/t-air-company/word-code/searchByPage',
  //新增航线
  airlineSave: pulicWeb + '/t-airline/save',
  // 航线导入历史操作
  historyPage: pulicWeb + '/t-airline-import/searchByPage',
  // 获取随机航班号
  airlineNumber: pulicWeb + '/t-airline/getRandFlightNo',
  // 代理上下架
  // airlineSave: pulicWeb + '/t-airline/update',
  //航线管理列表
  airlineSearchByPage: pulicWeb + '/t-airline/searchByPage',
  //航线管理列表 消息通知接口
  notUpInSeByPage: pulicWeb + '/t-airline/notUpInSeByPage',
  //航线信息修改/上架下架按钮
  airlineUpdate: pulicWeb + '/t-airline/update',
  //航线删除
  // airlineDelete: pulicWeb + '/t-airline/delete',
  airlineDelete: pulicWeb + '/t-airline/deleteAirline',
  //航线信息详情
  airlineDetail: pulicWeb + '/t-airline/airlineDetail',
  //航线报价信息详情
  airlineRatesDetail: pulicWeb + '/t-airline/airlineRatesDetail',
  //清空航线代理关系及价格
  airlineDeleteCascade: pulicWeb + '/t-airline-agent/deleteCascade',
  //保存航线代理关系及价格
  airlineSaveCascade: pulicWeb + '/t-airline-agent/saveCascade',
  //航线唯一性校验
  airlineCheckAirlineInfo: pulicWeb + '/t-airline/checkAirlineInfo',
  //banner刷新html
  dcReptileReplace: '/back/dcReptile/pageStatic/replace',
  //用户列表
  userSearchByPage: pulicWeb + '/t-portal-user/searchByPage',
  //用户查询
  // userSearch: pulicWeb + '/t-sys-user/search',
  // 航线负责人
  personNames: pulicWeb + '/t-airline//getAirLinePersonName',

  // 扫码登录
  smzhLogin: pulicWeb + '/wecome/noAuth/login',
  // 扫码登录后绑定账户
  smBindAccount: pulicWeb + '/wecome/noAuth/add',
  // 个人账户信息
  userSelfInfo: pulicWeb + '/wecome/getDepartRole',
  // 用户重置密码
  userResetPassword: pulicWeb + '/wecome/passwordReset',
  // 用户换绑企微
  userChangeQW: pulicWeb + '/wecome/change',

  //用户查询 2022.4.26 移除noAuth
  userSearchNoAuth: pulicWeb + '/t-sys-user/search',
  //客户名称重复性校验 参数：companyName
  checkCompanyNameIsRepeat: pulicWeb + '/t-authentication-company/checkCompanyNameIsRepeat',
  //供应商名称查询校验 参数：agentName
  checkAgentNameIsRepeat: pulicWeb + '/t-agent/checkAgentNameIsRepeat',
  //客户删除
  deleteClient: pulicWeb + '/t-authentication-company/deleteByIds',
  //删除供应商
  deleteSupplier: pulicWeb + '/t-agent/deleteByIds',
  // 判断客户是否有有效订单
  checkCompanyHasOrder: pulicWeb + '/t-authentication-company/checkCompanyHasOrder',
  // 判断供应商是否有有效订单
  checkAgentHasOrder: pulicWeb + '/t-agent/checkAgentHasOrder',
  //修改用户
  userUpdateUserinfo: pulicWeb + '/t-portal-user/update',
  //费用查询
  expenseList: pulicWeb + '/t-expense/searchByPage',
  // 费用查询 noAuth
  noAuthExpenseList: pulicWeb + '/t-expense/noAuth/searchByPage',
  //费用列表新增
  expenseSave: pulicWeb + '/t-expense/save',
  //费用列表修改
  expenseUpdate: pulicWeb + '/t-expense/update',
  //费用列表删除
  expenseDelete: pulicWeb + '/t-expense/delete',
  //查询订单信息列表
  orderSearchByPage: pulicWeb + '/t-order/searchByPage',
  // 导出订单信息列表
  orderDownloadExecl: pulicWeb + '/t-order/downloadExecl',
  //统计分类的订单列表数目
  orderCountList: pulicWeb + '/t-order/countList',
  //查询订单详情
  orderSearchDetail: pulicWeb + '/t-order/searchDetail',
  //费用分页查询，排除了空运费
  expenseSearchExcludeAirFee: pulicWeb + '/t-expense/searchExcludeAirFee',
  //保存订单
  orderSaveOrder: pulicWeb + '/t-order/saveOrder',
  //执行订单
  orderExecuteOrder: pulicWeb + '/t-order/executeOrder',
  //上传附件
  attachmentUpload: pulicWeb + '/t-order-attachment/upload',
  //发起账单
  priceSendBill: pulicWeb + '/t-order-price/sendBill',
  //保存操作记录
  presentSavePresentLog: pulicWeb + '/t-order-present-log/savePresentLog',
  //财务订单列表查询
  financeOrderList: pulicWeb + '/t-order/financeOrderList',

  orderPriceTable: pulicWeb + '/t-order-price/getOrderPriceTable',
  //财务订单列表导出列表
  exportFoExcel: pulicWeb + '/t-order/exportFoExcel',
  //财务订单列表 数据统计
  financeOrderCount: pulicWeb + '/t-order/financeOrderCount',
  //财务订单列表查询
  savePresentLog: pulicWeb + '/t-order-present-log/savePresentLog',
  trackList: pulicWeb + '/track/monitorQuery/airCompanyInfo',
  trackDetail: pulicWeb + '/track/monitorQuery/getData',
  //汇率编辑
  editByYearAndMonth: pulicWeb + '/t-cur-exrate/editByYearAndMonth',
  //新增汇率
  exchangeRateAdd: pulicWeb + '/t-cur-exrate/addNewCurrency',
  //汇率列表
  searchByYear: pulicWeb + '/t-cur-exrate/searchByYear',
  //最新获取货币汇率信息列表
  searchByCurrency: pulicWeb + '/t-currency/list',
  //银行账户管理-删除
  deleteBankAccount: pulicWeb + '/t-bank-account/deleteInfo',
  //银行账户管理-新增编辑
  editBankAccount: pulicWeb + '/t-bank-account/inorChInfo',

  //银行账户管理-查询
  searchBankAccount: pulicWeb + '/t-bank-account/searchByNameBank',

  //发票申请页面-查询
  invoiceSearch: pulicWeb + '/t-invoice-apply/searchByPage',

  //发票申请页面 -开票确认生成
  actionInvoice: pulicWeb + '/t-invoice-apply/actionInvoice',
  //发票申请页面 - 订单号运单号查看详情
  orderInfoShow: pulicWeb + '/t-invoice-apply/orderInfoShow',
  //生成发票
  confirmInvoice: pulicWeb + '/t-invoice-apply/confirmInvoice',

  expressInvoices: pulicWeb + '/t-invoice-apply/expressInvoices',

  nullifyInvoiceMore: pulicWeb + '/t-invoice-apply/nullifyInvoiceMore',

  //发票申请页面 - 数据统计
  invoiceStatistics: pulicWeb +'/t-invoice-apply/dataStatistics',
  //发票申请页面 - 导出列表
  exportToExcel: pulicWeb + '/t-invoice-apply/exportToExcel',
  //发票申请页面 - 上传发票
  uploadInvoicePDF: pulicWeb + '/t-invoice-apply/uploadInvoicePDF',
  //应收核销明细列表
  searchWoDetailByPage: pulicWeb + '/t-rcv-records/searchWoDetailByPage',
  //核销明细列表查询
  writeOffSearch: pulicWeb + '/t-payment-write-off/writeOffSearch',
//应收核销操作记录
  searchArList: pulicWeb + '/t-write-off-records/searchArWoList',
//应收核销操作记录
  arRevoke: pulicWeb + '/t-write-off-records/arRevoke',
  //应收核销页面，点击订单编号时，查询订单详情及财务记录
  searchOrderDetail: pulicWeb + '/t-rcv-records/searchOrderDetail',
  //订单核销页面 - 查询
  searchWoByPage: pulicWeb +'/t-order/searchWoByPage',
  //订单核销页面 - 订单号详情
  searchWoDetail: pulicWeb +'/t-order/searchWoDetail',
  //订单核销页面 - 数据统计
  subWoList: pulicWeb +'/t-order/sumWoList' ,
  //订单核销页面 - 导出列表
  exportWoExcel: pulicWeb +'/t-order/exportWoExcel' ,
  //统计应收核销明细数据
  sumWoDetail: pulicWeb + '/t-rcv-records/sumWoDetail',
  //订单核销列表导出
  exportWoDetailExcel: pulicWeb + '/t-rcv-records/exportWoDetailExcel',
  //查询操作记录
  searchRecords: pulicWeb + '/t-order-payment/searchRecords',
  //数据统计
  dataStatistics: pulicWeb + '/t-order-payment/dataStatistics',
  //撤销记录
  revokeRecords: pulicWeb + '/t-order-payment/revokeRecords',
  //查询
  search: pulicWeb + '/t-order-payment/search',
  //导出核销明细对账单
  exportWriteOffExcel: pulicWeb + '/t-payment-write-off/exportWriteOffExcel',
  //应收统计 -查询
  receivableSearch: pulicWeb + '/t-rcv-records/searchByPage',
  //应收统计 - 导出列表
  exportWoListExcel: pulicWeb + '/t-rcv-records/exportWoListExcel',
   //应收统计 - 数据统计
   receivableSum: pulicWeb + '/t-rcv-records/sumList',
  //应收统计 - 核销弹框数据
  getWoFrameData: pulicWeb + '/t-rcv-records/getWoFrameData',
  //应收统计 - 核销按钮弹框收款账户信息
  searchByAccount:pulicWeb + '/t-bank-account/searchByAccount',
  //应收统计 - 核销按钮弹框确认核销
  arWriteOff :pulicWeb + '/t-write-off-records/arWriteOff',
  //应收统计 - 预收核销按钮弹框确认核销
  arAdWriteOff :pulicWeb + '/t-write-off-records/arAdWriteOff',
  //应收统计 - 生成对账单按钮
  getAccountStatement :pulicWeb + '/t-rcv-records/getAccountStatement',
  //应收统计 - 导出对账单
  exportCheckPdf :pulicWeb +'/t-rcv-records/exportCheckPdf',
  //应收统计 - 预收核销弹框表格
  receiptSearch :pulicWeb +'/t-advance-receipt/searchByPage',
   // 查询应付信息列表
   searchWoByPageBill: pulicWeb + '/t-order-payment/searchWoByPage',
   // 对账导入excel
   importExcel: pulicWeb + '/t-order-payment/importExcel',
   //  导出失败对账单
   exportErrExcel: pulicWeb + '/t-order-payment/exportErrExcel',
   // 对账单对账接口
   toReconciliation: pulicWeb + "/t-order-payment/toReconciliation",
   //  输入对账接口
   toEnterReconciliation: pulicWeb +'/t-order-payment/toEnterReconciliation',
   // 核销
   writeOff: pulicWeb + '/t-payment-write-off/writeOff',
   //  应付导出excel
   billExportExcel: pulicWeb + '/t-order-payment/exportExcel',
   // 发票列表页面 - 上传发票
   uploadInvoBody :  pulicWeb +'/t-invoice-apply/uploadInvoBody',
   //  核销统计接口
   //客服工单-工单数据统计
   sumWorkOrderData: pulicWeb + '/t-work-order/sumWorkOrderData',
   //客服工单/航线 工单详情
   searchWorkOrderDetailById:  pulicWeb +'/t-work-order/searchWorkOrderDetailById',
   //客服工单/航线 工单详情 取消按钮
   closeWorkOrder: pulicWeb +'/t-work-order/closeWorkOrder',
   //客服工单 工单详情 提交按钮
   workOrderAskAgain: pulicWeb + '/t-work-order/askAgain',
   //客服工单 - 导出文件
   exportCstListExcel : pulicWeb + '/t-work-order/exportCstListExcel',
   //客服工单 - 催单
   remindWorkOrder :  pulicWeb +'/t-work-order/remind',
   //客服工单 - 新建工单
   launchWorkOrder :  pulicWeb + '/t-work-order/launchWorkOrder',
   //客服工单任务数
   countDealingWork4Cst : pulicWeb +'/t-work-order/countDealingWork4Cst',
   //客服工单 -滚动公告
   searchRollList: pulicWeb +'/t-work-order/searchRollList',
  //客服工单 - 新建工单获取关键字
  stringIfContent: pulicWeb +'/t-work-order/stringIfContent',
  searchByAirportCode: pulicWeb +'/t-airport/word-code/noAuth/searchByAirportCode',
   //工单-客服工单查询
   searchByPageForCst:  pulicWeb + '/t-work-order/searchByPageForCst',
   //工单 - 待我确认 查询
   searchDealing: pulicWeb + '/t-work-order/searchDealingWork4Cst',
   airOrder: pulicWeb + '/t-work-order/searchAllWork4PrcpByPage',
   // 导出航线工单审核全部工单
   airOrderExport: pulicWeb + '/t-work-order/exportPrcpAllWorkListExcel',
   // 航线工单点击详情
   detailsSearch: pulicWeb + '/t-work-order/searchWorkOrderDetailById',
   //航线工单 - 转单
   setOrder:pulicWeb + '/t-work-order/transfer',
 // 航线工单 - 交单
   handleOrder: pulicWeb + '/t-work-order/reply',
   //航线工单 - 待我处理数量
   countWork4Prcp: pulicWeb + '/t-work-order/countWork4Prcp',
  //航线工单 - 代我处理查询
  searchDealingWork4Prcp: pulicWeb +'/t-work-order/searchDealingWork4Prcp',
  //航线工单 - 航线正在回复
  prcpProcessing: pulicWeb + '/t-work-order/prcpProcessing',
   // 工单 - 统计
  orderStatistics: pulicWeb + '/t-work-order/sumUserWorkData',
  //工单 - 统计 导出统计数据
  exportList: pulicWeb+ '/t-work-order/exportUserWorkListExcel',
    //  对账统计接口
   toCheckAmount : pulicWeb + '/t-order-payment/toCheckAmount',
  //  核销统计接口
  toWriteOffAmountCount: pulicWeb + '/t-order-payment/toWriteOffAmountCount',
  // 修改账单
  modifyBill: pulicWeb + '/t-bill/modifyBill',
  // 获取订单的汇率
  getExchangeRatesForOrder: pulicWeb +  '/t-order/getExchangeRatesForOrder',

  // 用户账单页面
  userList: pulicWeb + '/t-bill/userBill',
// 导出用户账单
  userListExport: pulicWeb + '/t-bill/userBillExport',
// 供应商账单页面
agentBill: pulicWeb + '/t-bill/agentBill',
// 导出供应商账单
  agentListExport:pulicWeb +'/t-bill/agentBillExport',
  // 导出pdf 托书
  createAgentBookingNotePdf: pulicWeb + '/t-order/createAgentBookingNotePdf',
  // 账单操作记录
  billOpearteList: pulicWeb + '/t-order-present-log/list',

  //航线运营数据统计
  searchAirData: pulicWeb + '/t-air-data/searchAirData',
  // 航线操作人员数据导出
  exportOperator: pulicWeb + '/t-air-data/exportOperator',
  // 区域航线导出
  exportArea: pulicWeb + '/t-air-data/exportArea',
  // 获取分泡比例
  getOrderBubblePoint: pulicWeb + '/t-order/getOrderBubblePoint',

  // 仓库相关
  // 根据机场查询仓库，并且添加了一个第三方仓库
  searchByAirport: pulicWeb + `/t-warehouse/searchByAirport`,
  // 新增仓库
  addWarehouse: pulicWeb + `/t-warehouse/add`,
  // 编辑仓库
  editWarehouse: pulicWeb + `/t-warehouse/update`,
  // 删除仓库
  delWarehouse: pulicWeb + `/t-warehouse/delete`,
  // 仓库信息查询
  getWarehouses: pulicWeb + `/t-warehouse/searchByPage`,
  // 查询筛选栏列表
  searchCondList: pulicWeb + `/t-warehouse/searchCondList`,
  // 上传进仓地图模板
  uploadWarehouseMap: pulicWeb + `/t-warehouse/uploadInboundMap`,
  // 预收记录分页查询
  searchByPageInAdvance: pulicWeb + '/t-advance-receipt/searchByPage',
  // 新增记录
  newAddInAdvance: pulicWeb + '/t-advance-receipt/add',
  // 编辑记录
  editInAdvance: pulicWeb + '/t-advance-receipt/update',
  //预收数据统计
  inAdvanceSum: pulicWeb + '/t-advance-receipt/sum',
  //预收数据导出列表
  inAdvanceExportExcel: pulicWeb + '/t-advance-receipt/exportExcel',
  //消息通知列表
  getBoxMessage: pulicWeb +'/message-notice/getBoxMessage',
  //消息通知全部历史
  getAllMessage: pulicWeb +'/message-notice/getAllMessage',
  //消息通知 读取
  toRead: pulicWeb +'/message-notice/toRead',
  // 用token获取用户信息
  getUserInfoByToken: pulicWeb + `/t-sys-user/getUserInfo`,
  // 客户列表 - 查询
  authenticationSearch: pulicWeb +`/t-authentication-company/searchByPage`,
  //客户列表 - 审核通过
  toExamine:pulicWeb+'/t-authentication-company/toExamine',
  //客户列表 - 驳回
  toRejection:pulicWeb+'/t-authentication-company/toRejection',
  //客户列表 - 财务打款
  toPayment:pulicWeb+'/t-authentication-company/toPayment',
  //客户列表 - 导出
  customerExport:pulicWeb+'/t-authentication-company/export',
  //客户列表 - 编辑
  editPeriodInfo:pulicWeb+'/t-authentication-company/editPeriodInfo',
  //非一代管理 - 查询
  listSupplier:pulicWeb+'/t-agent/listSupplier ',
  //非一代管理 - 导出
  downloadSuExecl:pulicWeb+'/t-agent/downloadSuExecl',
  //非一代管理 供应商名称/简称
  listSupplierName:pulicWeb+'/t-agent/listSupplierName',
  listSupplierCode:pulicWeb+'/t-agent/listSupplierCode',

  //工单二期 -客服工单 航线动态
  searchByPage4Cst:pulicWeb+'/t-work-order-airline/searchByPage4Cst',
  //工单二期 -客服工单 航线动态数量统计
  countAirline4Cst:pulicWeb+'/t-work-order-airline/countAirline4Cst',
  //工单二期 -客服工单 航线动态 -导出列表
  exportExcel4Cst:pulicWeb+'/t-work-order-airline/exportExcel4Cst',
  //工单二期 -客服工单 航线播报
  searchAirlineRol:pulicWeb+'/t-work-order-airline/searchAirlineRoll',

  //工单二期 -航线工单 我要发布
  searchByPage4Prcp:pulicWeb+'/t-work-order-airline/searchByPage4Prcp',
  //工单二期 -航线工单 我要发布-删除
  airlineDeleteIssue:pulicWeb+'/t-work-order-airline/delete',
  //工单二期 -航线工单 航线发布
  airlinePublish:pulicWeb+'/t-work-order-airline/publish',

  //工单聊天室 -单个聊天室
  getSingleChatBox:pulicWeb+'/t-work-order-chat/getSingleChatBox',
  //工单聊天室 - 发送消息
  chatSendMes:pulicWeb+'/t-work-order-chat/sendMes',
  //工单聊天室 -邀请成员
  toAddPri:pulicWeb+'/t-work-order-chat/toAddPri',
  //工单聊天室 - 转单
  toTransfer:pulicWeb+'/t-work-order-chat/toTransfer',
  //工单聊天室 - 关闭
  toDeleteBox:pulicWeb+'/t-work-order-chat/toDeleteBox',
  //多聊天室 统计
  getBoxCount:pulicWeb+'/t-work-order-chat/getBoxCount',
  //多聊天室
  getChatBoxs:pulicWeb+'/t-work-order-chat/getChatBoxs',
  //多聊天室 - 置顶
  chatToTop:pulicWeb+'/t-work-order-chat/toTop',
  //工单二期 -客服
  searchCstUserByPage: pulicWeb + '/t-work-order/noAuth/searchCstUserByPage',
  //工单二期 - 航线
  searchPrcpUserByPage: pulicWeb + '/t-work-order/noAuth/searchPrcpUserByPage',
  //提单url 新接口
  billLading: pulicWeb + '/bill-of-lading',
  // 获取筛选栏用户可视的企业列表，包括订单和财务模块 typeCode query 0=订单，1=财务
  searchViews: pulicWeb + '/t-authentication-company/searchFilterList',
  //消息通知-屏蔽
  toMaskMessage: pulicWeb + '/message-notice/toMaskMessage',
  //消息通知 - 全部已读
  toAllRead: pulicWeb + '/message-notice/toAllRead',
  //工单-上传文件
  orderUpload: pulicWeb + '/t-work-order-chat/upload',
  //货物追踪详情
  dateAverAndReturn: pulicWeb + '/track/dateAverAndReturn',
  deleteInvoice: pulicWeb +'/t-invoice/deleteInvoice',
  //预付管理
      //搜索
    outAdvanceSearch: pulicWeb +'/t-paid-records/searchPage',
      //新增预付
     addOutAdvance: pulicWeb +'/t-paid-records/toAdd',
     //编辑实付
     editOutAdvance: pulicWeb +'/t-paid-records/toEdit',
     //应付统计 预付记录
     toGetPaid: pulicWeb +'/t-payment-write-off/toGetPaid',
     //应付统计 预付核销确认核销
     toPrepaymentWriteOff:pulicWeb +'/t-payment-write-off/toPrepaymentWriteOff',
     //预付 导出列表
     outAdvanceExport: pulicWeb +'/t-paid-records/toExport',
     //预付 数据统计
     outAdvanceCount:pulicWeb +'/t-paid-records/dataCount',

      // 实单询盘
      //航线-询单查询
      searchByPageSys:pulicWeb + '/t-consulting-work-order/searchByPageSys',
      //短线首次重连
      searchByPageSysRec:pulicWeb + '/t-consulting-work-order/searchByPageSysRec',
      //航线 - 聊天室内容
      getCwoBox:pulicWeb + '/t-consulting-work-order/getCwoBox?cwoId=',
      //消息撤回
      RevokeMessage: pulicWeb + "/t-consulting-work-order/revokeMessage?flowId=",
      //航线 - 聊天室发送
      sendCwoMes:pulicWeb +  '/t-consulting-work-order/sendCwoMes',
      //航线 -上传文件和图片
      chatRoomUpload:pulicWeb + '/t-consulting-work-order/upload',
      //航线-聊天室快捷信息
      quickMessageSearch:pulicWeb + '/t-quick-mes/searchByPage',
      //航线-聊天室快捷信息添加
      addQuickMes:pulicWeb + '/t-quick-mes/addQuickMes?mes=',
      //航线-聊天室快捷信息删除
      deleteQuickMes:pulicWeb + '/t-quick-mes/deleteQuickMes?mesId=',
      	//航线 转单
	    transferInquiry: pulicWeb +'/t-consulting-work-order/transferCwo',
      // 客服转航线
      psReturn: pulicWeb +'/t-consulting-work-order/psReturn?cwoId=',
      //航线转客服
      toPs: pulicWeb +'/t-consulting-work-order/toPs?cwoId=',
      //航线 变换的询单
      getCwoById: pulicWeb +'/t-consulting-work-order/getCwoById?cwoId=',
      //航线 生成货盘信息
      addNewPallet: pulicWeb +'/t-cwo-pallet/save',
      //航线 修改货盘信息
      updatePallet: pulicWeb +'/t-cwo-pallet/update',
      //航线 查询货盘信息
      getPalletById:pulicWeb +'/t-cwo-pallet/getById?id=',
      //用户列表导出
      customerExport:pulicWeb +'/t-portal-user/exportByExcel',
       //询盘会话设置 休假人
       selectUserListByRoleName:pulicWeb+'/t-sys-user/selectUserListByRoleName',
       //询盘会话设置 查询
       sessionSettingSearch:pulicWeb+'/t-cwo-leave-form/page',
       //询盘会话设置 请假分配保存
       cwoLeaveFrom:pulicWeb+'/t-cwo-leave-form/save',
       //询盘会话设置 撤销
       revokeLeaveForm:pulicWeb+'/t-cwo-leave-form/revokeLeaveForm',
       //询盘 判断用户是否休假
       checkIsLeaving:pulicWeb+'/t-cwo-leave-form/checkIsLeaving',
       //询盘会话设置 目的港数据
       listByThreeLetterCode:pulicWeb+'/t-airport/word-code/listByThreeLetterCode?threeLetterCode=',
       //询盘会话设置 目的港分配-分页数据
       podSetTable:pulicWeb+'/t-pod-service/page',
       //询盘会话设置 目的港分配 -导出
       exportPodServiceFile:pulicWeb+'/t-pod-service/exportPodServiceFile',
       //询盘会话设置 目的港分配 - 删除
       deletePodSet:pulicWeb+'/t-pod-service/delete',
       //询盘会话设置 目的港分配 -新增
       newPodSet:pulicWeb+'/t-pod-service/save',
       //询盘会话设置 目的港分配 -编辑
       podSetUpdate:pulicWeb+'/t-pod-service/update',
       //询盘会话设置 目的港分配 -上传
       importPodServiceFile:pulicWeb+'/t-pod-service/importPodServiceFile',
        //询盘右键
      //标为已读
      toSignRead:pulicWeb+'/t-consulting-work-order/toSignRead?cwoId=',
      //标为未读
      toSignUnRead:pulicWeb+'/t-consulting-work-order/toSignUnRead?cwoId=',
      //移除会话
      toHideCw:pulicWeb+'/t-consulting-work-order/toHideCw?cwoId=',
      //置顶/取消置顶
      setTopStatus:pulicWeb+'/t-consulting-work-order/setTopStatus?cwoId=',
       //询盘 客服 转单
       transferNewCwo:pulicWeb +'/t-consulting-work-order/transferNewCwo',
       // 新建询盘
       addNewCwo:pulicWeb +'/t-consulting-work-order/addNewCwo',
         //询盘关键字查询
      searchCwoMenu: pulicWeb.slice(0,pulicWeb.length-3)+'es/cwo/searchCwoMenu',
      //询盘关键字查询 二级菜单
      searchCwoFlow: pulicWeb.slice(0,pulicWeb.length-3)+'/es/cwo/searchCwoFlow',
        //询盘会话 导出会话
        exportCwoF:pulicWeb +'/t-consulting-work-order/exportCwoF',

        // 航线分配
      polPage:pulicWeb +'/t-pol-area/page',
       polSave:pulicWeb +'/t-pol-area/save',
       polDelete:pulicWeb +'/t-pol-area/delete',
       polUpdate:pulicWeb +'/t-pol-area/update',
       podPage:pulicWeb +'/t-pod-area/page',
       podSave:pulicWeb +'/t-pod-area/save',
       podDelete:pulicWeb +'/t-pod-area/delete',
       podUpdate:pulicWeb +'/t-pod-area/update',
       importAllocationRuleExcel:pulicWeb +'/t-pod-area/importAllocationRuleExcel',
       // 货盘列表
       palletPage:pulicWeb +'/t-cwo-pallet/page',
       exportCwoPallet:pulicWeb +'/t-cwo-pallet/exportCwoPallet',

       //小程序用户注册
       palletOldUser:pulicWeb + '/t-old-company/searchSimplePage', //新建-老用户列表
       palletNewUser:pulicWeb + '/t-authentication-company/selectSimpleAuthenticationCompanyList', //新建- 新用户列表
       palletSelectByPhone:pulicWeb +  '/t-portal-user/selectByPhone', //手机号查询用户
       palletSave:pulicWeb+ '/t-portal-user-company/save', //新建用户
       palletOldUserSearch:pulicWeb + '/t-old-company/page', //老用户列表
       searchCompanyPage :pulicWeb+'/t-authentication-company/searchCompanyPage', //新用户列表

       //财务- 付款信息
       OrgsWithPaymentInfo :pulicWeb+'/t-sys-org/searchFirstLevelOrgsWithPaymentInfo', //分公司列表
       paymentList:pulicWeb+'/t-payment-info/page', //付款信息查询
       addPayment:pulicWeb+'/t-payment-info/save', //新增付款信息
       editPayment:pulicWeb+'/t-payment-info/update', //编辑付款信息
       deletePayment:pulicWeb+ '/t-payment-info/delete',//删除付款信息
       
       // 应收多对象
       listCompanyByCustomerResponsibleId:pulicWeb +'/t-order/listCompanyByCustomerResponsibleId', //添加结算对象
       cancelInvoiceApply:pulicWeb + '/t-invoice-apply/cancelApply', // 撤销开票申请
       confirmBill:pulicWeb + '/t-bill/confirmBill', // 确认账单
}
export default serviceApi

