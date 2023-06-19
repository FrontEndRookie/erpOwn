import http from './config'

const Api = {
  // 查询订单详情
  getOrderDetail: (...rest) => http.get(`/t-order/searchDetail`, ...rest),
  // 保存订单
  saveOrder: (...rest) => http.post(`/t-order/saveOrder`, ...rest),
  // 推进订单状态
  executeOrder: (...rest) => http.post(`/t-order/executeOrder`, ...rest),
  // 查询航空公司 by keyWord (航司二字码/航司中文名称/数字码)
  getAirCompanysByKeyWord: (...rest) => http.get(`/t-air-company/word-code/searchByPage`, ...rest),
  // 查询系统用户 by roleName
  getSystemUsersByRoleName: (...rest) => http.get(`/t-sys-user/search`, ...rest),
  // 代理列表查询
  getAgentList: (...rest) => http.post(`/t-agent/list`, ...rest),
  // 创建订舱上家委托书
  createAgentBookingNotePdf: (...rest) => http.post(`/t-order/createAgentBookingNotePdf`, ...rest),
  // 根据机场查询仓库
  getWarehousesByAirport: (...rest) => http.get(`/t-warehouse/searchByAirport`, ...rest),
  // 获取订单的汇率
  getExchangeRatesForOrder: (...rest) => http.get(`/t-order/getExchangeRatesForOrder`, ...rest),
  // 用token获取用户信息
  getUserInfoByToken: (...rest) => http.post(`/t-sys-user/getUserInfo`, ...rest),
  // 查询组织结构树
  getOrgTree: (...rest) => http.get(`/t-sys-org/searchOrgTree`, ...rest),
  // 部门上移下移
  moveOrg: (...rest) => http.post(`/t-sys-org/move`, ...rest),
  // 新增部门
  addOrg: (...rest) => http.post(`/t-sys-org/add`, ...rest),
  // 编辑部门
  editOrg: (...rest) => http.post(`/t-sys-org/update`, ...rest),
  // 删除部门
  delOrg: (...rest) => http.delete(`/t-sys-org/delete`, ...rest),
  // 分页查询部门下的用户
  getOrgMems: (...rest) => http.get(`/t-org-user/searchByPage`, ...rest),
  // 角色查询
  getRoles: (...rest) => http.get(`/t-sys-role/search`, ...rest),
  // 用户新增PLUS
  addSysUser: (...rest) => http.post(`/t-sys-user/addPlus`, ...rest),
  // 用户编辑PLUS
  editSysUser: (...rest) => http.post(`/t-sys-user/updatePlus`, ...rest),
  // 统计部门下用户数目
  getOrgMemTotal: (...rest) => http.get(`/t-org-user/countByOrg`, ...rest),
  // 用户修改密码
  editSysUserPassword: (...rest) => http.get(`/t-sys-user/updatePassword`, ...rest),
  // 设置部门上级
  setSuper: (...rest) => http.post(`/t-org-user/setSuper`, ...rest),
  // 添加角色
  addRole: (...rest) => http.post(`/t-sys-role/add`, ...rest),
  // 编辑角色
  editRole: (...rest) => http.post(`/t-sys-role/update`, ...rest),
  // 删除角色
  delRole: (...rest) => http.get(`/t-sys-role/delete`, ...rest),
  // 查询某个角色的权限
  getAuthByRole: (...rest) => http.get(`/t-role-auth/searchByRole`, ...rest),
  // 查询权限树
  getAuthTree: (...rest) => http.get(`/t-auth/searchAuthTree`, ...rest),
  // 保存角色权限
  saveRoleAuth: (...rest) => http.post(`/t-role-auth/saveBatch`, ...rest),
  // 航线审核列表
  getAuditAirlines: (...rest) => http.get(`/t-rates/searchAirlinePortal`, ...rest),
  // 是否通过审核
  auditAirline: (...rest) => http.post(`/t-rates/editAirlineAuditing`, ...rest),
  // 查询用户能访问的组织机构ID
  findVisibleOrgs: (...rest) => http.get(`/t-org-user/noAuth/findVisibleOrgs`, ...rest),
  // 导出客户账单
  exportCustomerBill: (...rest) => http.post(`/t-order/exportCustomerBill`, ...rest),
  // 查询部门直属的用户信息
  getDirectUsers: (...rest) => http.get(`/t-org-user/searchDirectUsers`, ...rest),
  // 查询字段权限配置树
  getFieldAuthTree: (...rest) => http.get(`/t-auth-field/searchFieldColumnTree`, ...rest),
  // 查询按钮权限配置树
  getBtnAuthTree: (...rest) => http.get(`/t-auth-field/searchFieldButtonTree`, ...rest),
  // 查询某个角色的字段权限和按钮权限，只返回响应报文的
  getFieldAuthTreeByRole: (...rest) => http.get(`/t-role-auth-field/searchViewByRole`, ...rest),
  // 保存角色字段权限，key为角色ID，要求value集合中的roleId全部之一致
  saveRoleFieldAuth: (...rest) => http.post(`/t-role-auth-field/saveFieldColBatch`, ...rest),
  // 保存角色按钮权限，key为角色ID，要求value集合中的roleId全部之一致
  saveRoleBtnAuth: (...rest) => http.post(`/t-role-auth-field/saveFieldBtnBatch`, ...rest),
  // 获取三字码
  getThreeLetterCodes: (...rest) => http.get(`/t-airport/word-code/searchByPage`, ...rest),
  // 获取账单操作记录
  getBillOperateRecords: (...rest) => http.get(`/t-order-present-log/list`, ...rest),
  //查询订单信息列表
  orderSearchByPage: (...rest) => http.get(`/t-order/searchByPage`, ...rest),
  // 获取筛选栏用户可视的企业列表，包括订单和财务模块 typeCode query 0=订单，1=财务
  getCompanyList: (...rest) => http.post(`/t-authentication-company/searchFilterList`, ...rest),
  //保存操作记录
  presentSavePresentLog: (...rest) => http.post(`/t-order-present-log/savePresentLog`, ...rest),
  // 导出订单信息列表
  exportOrderExecl: (...rest) => http.get(`/t-order/downloadExecl`, ...rest),
  //发起账单
  priceSendBill: (...rest) => http.post(`/t-order-price/sendBill`, ...rest),
  // 修改账单
  modifyBill: (...rest) => http.post(`/t-bill/modifyBill`, ...rest),
  // 申请作废订单
  applyVoidOrder: (...rest) => http.post(`/t-order/applyInvalidateOrder`, ...rest),
  // 埋点统计
  getBuriedPointSum: (...rest) => http.post(`/t-buried-point-track/sum`, ...rest),
  // 重置密码
  resetPassword: (...rest) => http.post(`/t-sys-user/resetPassword`, ...rest),
  // 查询特价列表
  getSpecialList: (...rest) => http.post(`/t-discount-info/list`, ...rest),
  // 查询系统发布特价列表
  getSysSpecialList: (...rest) => http.post(`/t-discount-info/listBySys`, ...rest),
  // 系统特价申请发布
  applySysSpecial: (...rest) => http.post(`/t-discount-info/apply`, ...rest),
  // 查询待审核信息数据
  getMenuCountInfo: (...rest) => http.get(`/system/listGroupInfo`, ...rest),
  // 查询一级部门，即节点的直属部门
  getFirstLevelOrgs: (...rest) => http.get(`/t-sys-org/searchFirstLevelOrgs`, ...rest),
  // 查询全部用户及其分公司-1级部门
  getUsersAndBranchOrg: (...rest) => http.get(`/t-org-user/findUsersAndBranchOrg`, ...rest),
  // 通过名称或社会统一信用代码获取公司基本信息
  getCompanyByCreditCode: (...rest) => http.post(`/t-agent/getCompanyInfo`, ...rest),
  // 获取新增供应商列表
  getAddSuppliers: (...rest) => http.post(`/t-agent/listAllAgent`, ...rest),
  // 罗新版-新增客户
  getAddClients: (...rest) => http.post(`/t-authentication-company/searchByPage4Lx`, ...rest),
  // 罗新版-导出客户列表
  exportCompanyExecl: (...rest) => http.post(`/t-authentication-company/export4Lx`, ...rest),
  // 罗新版-新增客户
  addClient: (...rest) => http.post(`/t-authentication-company/save4Lx`, ...rest),
  // 罗新版-修改客户
  editClient: (...rest) => http.post(`/t-authentication-company/update4Lx`, ...rest),
  // 上传营业执照
  uploadBusinessLicense: (...rest) => http.post(`/t-authentication-company/upload`, ...rest),
  // 代理名称下拉
  getAllAgentNames: (...rest) => http.get(`/t-agent/allAgentName`, ...rest),
  // 结算公司名称下拉
  getAllSettlementNames: (...rest) => http.get(`/t-agent/allSettlementName`, ...rest),
  // 导出新增供应商列表
  exportAgentExecl: (...rest) => http.get(`/t-agent/downloadAgentExecl`, ...rest),
  // 上传营业执照文件
  uploadAgentBusinessLicense: (...rest) => http.post(`/t-agent/uploadImage`, ...rest),
  // 新增供应商
  addSupplier: (...rest) => http.post(`/t-agent/save`, ...rest),
  // 修改供应商
  editSupplier: (...rest) => http.put(`/t-agent/update`, ...rest),
  // 获取客户新增查询列表
  getClientQueryList: (...rest) => http.get(`/t-authentication-company/searchQueryList`, ...rest),
  // 特价发布删除,后台用户删除自己的
  delSysSpecial: (...rest) => http.post(`/t-discount-info/deleteBySys`, ...rest),
  // 特价发布更新,后台用户更新自己的
  editSysSpecial: (...rest) => http.post(`/t-discount-info/updateBySys`, ...rest),
  // 新增客户前查询企业信用代码
  getUniqCompanyInfo: (...rest) => http.post(`/t-authentication-company/searchUniqCompanyInfo`, ...rest),
  // 查询订单操作历史
  getOrderHistory: (...rest) => http.post(`/t-order/searchHistory`, ...rest),
  // 查询订单参与者，不包含客户
  getOrderHistoryPartis: (...rest) => http.get(`/t-order/searchOrderPartis`, ...rest),
  // 获取订单结算方式
  getSettlementMethod: (...rest) => http.post(`/t-order/getSettlementMethod`, ...rest),

  // 新建订单
  // 获取用户所在分公司的企业列表
  selectCompanyListByThisUser: (...rest) => http.post(`/t-authentication-company/selectCompanyListByThisUser`, ...rest),
  // 查询认证企业详细信息
  getCustomerDetail: (...rest) => http.post(`/t-authentication-company/selectDetailOneById`, ...rest),
  // 查询当前用户的一级公司下所有部门的员工角色
  selectUserListByRoleName: rest => http.post(`/t-sys-user/selectUserListByRoleName?roleName=`+ rest.roleName),
  // 快捷下单
  fastOrder: (...rest) => http.post(`/t-order/fastOrder`, ...rest),
  // 上传托书文件
  uploadClientLetterFile: (...rest) => http.post(`/t-order/uploadClientLetterFile`, ...rest),

  // 发票信息
  // 快递列表分页
  getMails: (...rest) => http.post(`/t-portal-express-info/page`, ...rest),
  // 全部快递列表
  getAllMails: (...rest) => http.post(`/t-portal-express-info/list`, ...rest),
  // 新增/修改用户快递信息
  editMail: (...rest) => http.post(`/t-portal-express-info/saveOrUpdate`, ...rest),
  // 根据id删除快递信息
  delMail: (...rest) => http.delete(`/t-portal-express-info`, ...rest),
  // 发票抬头列表分页
  getInvoices: (...rest) => http.post(`/t-portal-invoice-info/page`, ...rest),
  // 全部发票抬头列表
  getAllInvoices: (...rest) => http.post(`/t-portal-invoice-info/list`, ...rest),
  // 新增/修改开票信息
  editInvoice: (...rest) => http.post(`/t-portal-invoice-info/saveOrUpdate`, ...rest),
  // 根据id删除开票信息
  delInvoice: (...rest) => http.delete(`/t-portal-invoice-info`, ...rest),

  // 订单草稿
  // 获取订单草稿详情
  getOrderDraftDetail: (...rest) => http.get(`/t-order-draft`, ...rest),
  // 获取订单草稿列表
  getOrderDrafts: (...rest) => http.post(`/t-order-draft/page`, ...rest),
  // 获取全部订单草稿
  getAllOrderDrafts: (...rest) => http.post(`/t-order-draft/list`, ...rest),
  // 编辑订单草稿
  editOrderDraft: (...rest) => http.post(`/t-order-draft/save`, ...rest),
  // 删除订单草稿
  delOrderDraft: (...rest) => http.delete(`/t-order-draft`, ...rest),
  // 获取当前用户及其一级分公司所在部门---用于订单分页查询
  findThisUserAndBranchOrg: (...rest) => http.get(`/t-org-user/findThisUserAndBranchOrg`, ...rest),

  // 账单
  // 开票申请
  invoiceApply: (...rest) => http.post(`/t-invoice-apply/invoiceApply`, ...rest),
  // 确认应付账单
  confirmApBill: (...rest) => http.post(`/t-order/confirmApBill`, ...rest),
  // 修改应付账单
  modifyApBill: (...rest) => http.post(`/t-order/modifyApBill`, ...rest),
  // 获取账单详情
  getBillDetail: (...rest) => http.post(`/t-bill/billDetail`, ...rest),
  // 创建账单PDF
  createBillPdf: (...rest) => http.post(`/t-bill/createBillPdf`, ...rest),
  // 获取币种by航班日期
  getCurrencyRates: (...rest) => http.get(`/t-order/getCurrencyEnumList`, ...rest),
  getCurrencyRatesNew: (...rest) => http.get(`/t-order/getExRatesByDate4Start`, ...rest),

  // 统计所有分类的订单列表数目
  countOrderList: (...rest) => http.get(`/t-order/countOrderList`, ...rest),

  // 合并对账
  // 客户账单管理-分页查询
  getMergeBills: (...rest) => http.post(`/t-order/searchMergeBillByPage`, ...rest),
  // 合并对账页面
  getMergeBillDetail: (...rest) => http.post(`/t-bill/billDetailMerge`, ...rest),
  // 合并对账并申请开票
  invoiceApplyMerge: (...rest) => http.post(`/t-invoice-apply/invoiceApplyMerge`, ...rest),

  // 发票管理
  // 查询用户所在分公司的所有员工及一级部门--用于发票管理
  searchBranchUsers: (...rest) => http.post(`/t-org-user/searchBranchUsers`, ...rest),
  // 发票管理列表分页查询
  getInvoiceManage: (...rest) => http.post(`/t-invoice-apply/searchInvoiceManage`, ...rest),
  // 查询发票信息详情
  getInvoiceManageDetail: (...rest) => http.get(`/t-invoice-apply/invoiceManageDetail`, ...rest),
  // 压缩并下载发票
  downloadInvoiceZip: (...rest) => http.post(`/t-invoice-apply/downloadInvoiceZip`, ...rest),
  // 合并对账-拉取客户账单
  exportMergeBill: (...rest) => http.post(`/t-order/exportMergeBill`, ...rest),
  //订单 航线日期导入
  updateDepartureDate:(...rest) =>http.post(`/t-order/updateDepartureDate`, ...rest),
  // 新闻表格
  cmsPage:(...rest) =>http.post('/t-cms-article/page', ...rest),
  // 新闻删除
  cmsDelete:(...rest) =>http.post('/t-cms-article/delete', ...rest),
  // 新闻编辑获取当前数据
  cmsGetById:(...rest) =>http.post('/t-cms-article/getById?id='+rest),
  // 新闻上传图片
  cmsUploadImg:(...rest) =>http.post('/t-cms-article/uploadImg', ...rest),
  // 新闻新建
  cmsSave:(...rest) =>http.post('/t-cms-article/save', ...rest),
  // 新闻保存
  cmsUpdate:(...rest) =>http.put('/t-cms-article/update', ...rest),
  // 新闻视频上传
  cmsVideo:(...rest) =>http.post('/t-cms-article/uploadVideo', ...rest),
  // 询盘数据
  searchInquiry:(...rest) =>http.post('/t-consulting-work-order/searchByPageSys', ...rest),

}

export default Api
