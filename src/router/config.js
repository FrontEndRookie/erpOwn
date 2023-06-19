import Layout from "../components/layout/Layout";

const autoRoutes = [
  {
    path: "/login",
    component: () => import("@/pages/login/index.vue"),
    hidden: true
  },
  {
    path: "/",
    component: () => import("@/pages/login/index.vue"),
    hidden: true
  },
  {
    path: "*",
    component: () => import("@/pages/404.vue"),
    hidden: true
  }
];

//代理管理
const agentManagement = [
  {
    path: "/agentManagement",
    component: Layout,
    name: "agentManagement",
    redirect: "noredirect",
    alwaysShow: true,
    meta: {
      title: "代理管理",
      icon: "agent",
      breadcrumb: true,
      auth: "250300_D"
    },
    children: [
      {
        path: "generation",
        component: () => import("@/pages/agentManagement/generation.vue"),
        name: "generation",
        meta: {
          title: "一代管理列表",
          keepAlive: true,
          needLogin: true,
          auth: "251700_M",
          countInfo: "agentExamNum",
          countDot: true
        }
      },
      {
        path: "nGeneration",
        component: () => import("@/pages/agentManagement/nGeneration.vue"),
        name: "nGeneration",
        meta: {
          title: "非一代管理列表",
          keepAlive: true,
          needLogin: true,
          auth: "250700_M"
        }
      },
      // {
      //   path: 'goodAirRoute',
      //   component: () => import('@/pages/agentManagement/goodAirRoute.vue'),
      //   name: 'goodAirRoute',
      //   meta: {
      //     title: '精品航线',
      //     keepAlive: true,
      //     needLogin: true,
      //     auth: '252700_M',
      //     countInfo: 'predominantExamNum',
      //     countDot: true,
      //   },
      // },
      // {
      //   path: 'specialRelease',
      //   component: () => import('@/pages/agentManagement/specialRelease.vue'),
      //   name: 'specialRelease',
      //   meta: {
      //     title: '特价发布管理',
      //     keepAlive: true,
      //     needLogin: true,
      //     auth: '253700_M',
      //   },
      // },
      {
        path: "AddSuppliers",
        component: () => import("@/pages/agentManagement/AddSuppliers.vue"),
        name: "AddSuppliers",
        meta: {
          title: "新增供应商",
          keepAlive: true,
          needLogin: true,
          auth: "254700_M"
        }
      }
    ]
  }
];

//货物跟踪
const cargoTrackingManage = [
  {
    path: "/cargoTrackingManage",
    component: Layout,
    name: "cargoTrackingManage",
    redirect: "noredirect",
    alwaysShow: true,
    meta: {
      title: "大盘主页",
      icon: "cargo-tracking",
      breadcrumb: true,
      auth: "500300_D"
    },
    children: [
      {
        path: "cargoTracking",
        component: () =>
          import("@/pages/cargoTrackingManage/cargoTracking.vue"),
        name: "cargoTracking",
        meta: {
          title: "货物追踪详情",
          keepAlive: true,
          needLogin: true,
          auth: "500700_M"
        }
      },
      {
        path: "routeDataStatistics",
        component: () =>
          import("@/pages/cargoTrackingManage/routeDataStatistics.vue"),
        name: "routeDataStatistics",
        meta: {
          title: "航线运营数据统计",
          keepAlive: true,
          needLogin: true,
          auth: "501700_M,"
        }
      }
    ]
  }
];
//管理员
const adminUserCenter = [
  {
    path: "/adminUser",
    component: Layout,
    name: "adminUser",
    redirect: "noredirect",
    alwaysShow: true,
    meta: {
      title: "管理员",
      icon: "admin",
      breadcrumb: true,
      auth: "450300_D"
    },
    children: [
      {
        path: "organize",
        component: () => import(`@/pages/auth/OrganizeManagement.vue`),
        name: "OrganizeManagement",
        hidden: false,
        meta: {
          title: "组织管理",
          keepAlive: false,
          needLogin: true,
          auth: "450700_M"
        }
      },
      {
        path: "auth",
        component: () => import(`@/pages/auth/AuthConfig.vue`),
        name: "AuthConfig",
        hidden: false,
        meta: {
          title: "角色权限",
          keepAlive: false,
          needLogin: true,
          auth: "451700_M"
        }
      },
      {
        path: "FieldAuthConfig",
        component: () => import(`@/pages/auth/FieldAuthConfig.vue`),
        name: "FieldAuthConfig",
        hidden: false,
        meta: {
          title: "字段权限",
          keepAlive: false,
          needLogin: true,
          auth: "452700_M"
        }
      },
      {
        path: "customerSetTwo",
        component: () => import(`@/pages/auth/customerManagementSettings.vue`),
        name: "customerSetTwo",
        hidden: false,
        meta: {
          title: "客户管理设置",
          keepAlive: false,
          needLogin: true,
          auth: "655700_M"
        }
      }
    ]
  }
];

// 航线管理
const routeManagementCenter = [
  {
    path: "/routeManagement",
    component: Layout,
    name: "routeManagement",
    redirect: "noredirect",
    alwaysShow: true,
    meta: {
      title: "航线管理",
      icon: "route",
      breadcrumb: false,
      auth: "200300_D"
    },
    children: [
      {
        path: "routeManage",
        component: () => import("@/pages/routeManagement/routeManage.vue"),
        name: "routeManage",
        meta: {
          title: "航线列表",
          keepAlive: true,
          needLogin: true,
          auth: "200700_M"
        }
      },
      {
        path: "RouteAudit",
        component: () => import("@/pages/routeManagement/RouteAudit.vue"),
        name: "RouteAudit",
        meta: {
          title: "航线审核",
          keepAlive: false,
          needLogin: true,
          auth: "202700_M",
          countInfo: "airlineExamNum",
          countDot: true
        }
      },
      {
        path: "routeAdd",
        component: () => import("@/pages/routeManagement/routeAdd.vue"),
        name: "routeAdd",
        hidden: true,
        meta: {
          title: "新增航线",
          keepAlive: true,
          needLogin: true
        }
      },
      {
        path: "routeDetails",
        component: () => import("@/pages/routeManagement/routeDetails.vue"),
        name: "routeDetails",
        hidden: true,
        meta: {
          title: "航线详情",
          keepAlive: false,
          needLogin: true
        }
      },
      {
        path: "historyOperating",
        component: () => import("@/pages/routeManagement/historyOperating.vue"),
        name: "historyOperating",
        hidden: true,
        meta: {
          title: "历史操作",
          keepAlive: false,
          needLogin: true
        }
      },
      {
        path: "routeEdit",
        component: () => import("@/pages/routeManagement/routeEdit.vue"),
        name: "routeEdit",
        hidden: true,
        meta: {
          title: "编辑航线",
          keepAlive: false,
          needLogin: true
        }
      },
      {
        path: "routeImport",
        component: () => import("@/pages/routeManagement/routeImport.vue"),
        name: "routeImport",
        hidden: false,
        meta: {
          title: "航线导入",
          keepAlive: false,
          needLogin: true,
          auth: "201700_M"
        }
      }
    ]
  }
];

// 财务管理
const financeManagementCenter = [
  {
    path: "/financeManagement",
    component: Layout,
    name: "financeManagement",
    redirect: "noredirect",
    alwaysShow: true,
    meta: {
      title: "财务管理",
      icon: "finance",
      breadcrumb: false,
      auth: "100300_D"
    },
    children: [
      {
        path: "financeManage",
        component: () => import("@/pages/financeManagement/financeManage.vue"),
        name: "financeManage",
        meta: {
          title: "财务列表",
          keepAlive: true,
          needLogin: true,
          auth: "100700_M"
        }
      },
      {
        path: "invoiceList",
        component: () => import("@/pages/financeManagement/invoiceList.vue"),
        name: "invoiceList",
        meta: {
          title: "发票列表",
          keepAlive: true,
          needLogin: true,
          auth: "101700_M"
        }
      },
      {
        path: "orderWriteOff",
        component: () => import("@/pages/financeManagement/orderWriteOff.vue"),
        name: "orderWriteOff",
        meta: {
          title: "订单详情",
          keepAlive: true,
          needLogin: true,
          auth: "102700_M"
        }
      },
      {
        path: "receivableStatistics",
        component: () =>
          import("@/pages/financeManagement/receivableStatistics.vue"),
        name: "receivableStatistics",
        meta: {
          title: "应收统计",
          keepAlive: true,
          needLogin: true,
          auth: "103700_M"
        }
      },
      {
        path: "receivableStatisticsDetails",
        component: () =>
          import("@/pages/financeManagement/receivableStatisticsDetails.vue"),
        name: "receivableStatisticsDetails",
        meta: {
          title: "应收核销明细",
          keepAlive: true,
          needLogin: true,
          auth: "104700_M"
        }
      },
      {
        path: "paysStatistics",
        component: () => import("@/pages/financeManagement/paysStatistics.vue"),
        name: "paysStatistics",
        meta: {
          title: "应付统计",
          keepAlive: true,
          needLogin: true,
          auth: "105700_M"
        }
      },
      {
        path: "paysStatisticsDetails",
        component: () =>
          import("@/pages/financeManagement/paysStatisticsDetails.vue"),
        name: "paysStatisticsDetails",
        meta: {
          title: "应付核销明细",
          keepAlive: true,
          needLogin: true,
          auth: "106700_M"
        }
      },
      {
        path: "collectInAdvance",
        component: () =>
          import("@/pages/financeManagement/collectInAdvance.vue"),
        name: "collectInAdvance",
        meta: {
          title: "预收管理",
          keepAlive: true,
          needLogin: true,
          auth: "107700_M"
        }
      },
      {
        path: "collectOutAdvance",
        component: () =>
          import("@/pages/financeManagement/collectOutAdvance.vue"),
        name: "collectOutAdvance",
        meta: {
          title: "预付管理",
          keepAlive: true,
          needLogin: true,
          auth: "108300_M"
        }
      },
      {
        path: "bankAccount",
        component: () => import("@/pages/financeManagement/bankAccount.vue"),
        name: "bankAccount",
        meta: {
          title: "银行账号列表",
          keepAlive: false,
          needLogin: true,
          auth: "108701_M"
        }
      },
      {
        path: "payInfo",
        component: () => import("@/pages/financeManagement/payInfo.vue"),
        name: "payInfo",
        meta: {
          title: "收款信息表",
          keepAlive: false,
          needLogin: true,
          auth: "108801_M"
        }
      }
    ]
  }
];

// 账单总览
const billOverview = [
  {
    path: "/billOverview",
    component: Layout,
    name: "billOverview",
    redirect: "noredirect",
    alwaysShow: true,
    meta: {
      title: "账单总览",
      icon: "bill",
      breadcrumb: false,
      auth: "130300_D"
    },
    children: [
      {
        path: "userBill",
        component: () => import("@/pages/billOverview/userBill.vue"),
        name: "userBill",
        meta: {
          title: "用户账单",
          keepAlive: false,
          needLogin: true,
          auth: "130700_M"
        }
      },
      {
        path: "shopBill",
        component: () => import("@/pages/billOverview/shopBill.vue"),
        name: "shopBill",
        meta: {
          title: "供应商账单",
          keepAlive: false,
          needLogin: true,
          auth: "131700_M"
        }
      }
    ]
  }
];

// 订单管理
const orderManagementCenter = [
  {
    path: "/orderManagement",
    component: Layout,
    name: "orderManagement",
    redirect: "noredirect",
    alwaysShow: true,
    meta: {
      title: "订单管理",
      icon: "order",
      breadcrumb: false,
      auth: "150300_D"
    },
    children: [
      {
        path: "orderManageNew",
        component: () => import("@/pages/orderManagement/OrderManageNew.vue"),
        name: "OrderManageNew",
        meta: {
          title: "全部订单",
          keepAlive: true,
          needLogin: true,
          typeCode: "",
          auth: "150700_M",
          countInfo: "countAll"
        }
      },
      {
        path: "orderManageNew1",
        component: () => import("@/pages/orderManagement/OrderManageNew.vue"),
        name: "OrderManageNew1",
        meta: {
          title: "待平台审核",
          keepAlive: true,
          needLogin: true,
          typeCode: 1,
          auth: "150700_M",
          countInfo: "countCheck"
        }
      },
      {
        path: "orderManageNew2",
        component: () => import("@/pages/orderManagement/OrderManageNew.vue"),
        name: "OrderManageNew2",
        meta: {
          title: "待进仓",
          keepAlive: true,
          needLogin: true,
          typeCode: 2,
          auth: "150700_M",
          countInfo: "countPreWarehouse"
        }
      },
      {
        path: "orderManageNew3",
        component: () => import("@/pages/orderManagement/OrderManageNew.vue"),
        name: "OrderManageNew3",
        meta: {
          title: "操作中",
          keepAlive: true,
          needLogin: true,
          typeCode: 3,
          auth: "150700_M",
          countInfo: "countOperating"
        }
      },
      {
        path: "orderManageNew4",
        component: () => import("@/pages/orderManagement/OrderManageNew.vue"),
        name: "OrderManageNew4",
        meta: {
          title: "海关安检",
          keepAlive: true,
          needLogin: true,
          typeCode: 4,
          auth: "150700_M",
          countInfo: "countSecurity"
        }
      },
      {
        path: "orderManageNew5",
        component: () => import("@/pages/orderManagement/OrderManageNew.vue"),
        name: "OrderManageNew5",
        meta: {
          title: "运输中",
          keepAlive: true,
          needLogin: true,
          typeCode: 5,
          auth: "150700_M",
          countInfo: "countTransit"
        }
      },
      {
        path: "orderManageNew6",
        component: () => import("@/pages/orderManagement/OrderManageNew.vue"),
        name: "OrderManageNew6",
        meta: {
          title: "完成",
          keepAlive: true,
          needLogin: true,
          typeCode: 6,
          auth: "150700_M",
          countInfo: "countCompleted"
        }
      },
      {
        path: "orderManageNew7",
        component: () => import("@/pages/orderManagement/OrderManageNew.vue"),
        name: "OrderManageNew7",
        meta: {
          title: "已取消",
          keepAlive: true,
          needLogin: true,
          typeCode: 7,
          auth: "150700_M",
          countInfo: "countCancelled"
        }
      },
      {
        path: "orderManageNewFreeze",
        component: () => import("@/pages/orderManagement/OrderManageNew.vue"),
        name: "orderManageNewFreeze",
        meta: {
          title: "冻结",
          keepAlive: true,
          needLogin: true,
          typeCode: "",
          auth: "150700_M",
          openStatus: 0,
          countInfo: "countFreeze"
        }
      },
      {
        path: "orderManageNew8",
        component: () => import("@/pages/orderManagement/OrderManageNew.vue"),
        name: "OrderManageNew8",
        meta: {
          title: "异常",
          keepAlive: true,
          needLogin: true,
          typeCode: 8,
          color: "#dc261b",
          auth: "150700_M",
          countInfo: "countErr"
        }
      },
      {
        path: "orderManageNewVoid",
        component: () => import("@/pages/orderManagement/OrderManageNew.vue"),
        name: "OrderManageNewVoid",
        meta: {
          title: "作废订单",
          keepAlive: true,
          needLogin: true,
          typeCode: "",
          color: "#E6A23C",
          auth: "150700_M",
          countInfo: "countInvalidate",
          typeCode: 10,
          fettle: 1
        }
      },
      {
        path: "ladingBillDownLoad",
        component: () =>
          import("@/pages/orderManagement/ladingBillDownLoad.vue"),
        name: "ladingBillDownLoad",
        meta: {
          title: "提单制作",
          keepAlive: false,
          needLogin: true,
          auth: "152700_M"
        }
      },
      {
        path: "orderDetailNew",
        component: () => import("@/pages/orderManagement/OrderDetailNew.vue"),
        name: "OrderDetailNew",
        hidden: true,
        meta: {
          title: "订单详情",
          keepAlive: false,
          needLogin: true,
          auth: "151700_M"
        }
      },
      {
        path: "AddOrder",
        component: () => import("@/pages/orderManagement/AddOrder.vue"),
        name: "AddOrder",
        hidden: true,
        meta: {
          title: "新建订单",
          keepAlive: false,
          needLogin: true
        }
      },
      {
        path: "orderHistory",
        component: () => import("@/pages/orderManagement/OrderHistory.vue"),
        name: "OrderHistory",
        hidden: true,
        meta: {
          title: "订单历史记录",
          keepAlive: false,
          needLogin: true
        }
      },
      {
        path: "ConfirmBill",
        component: () => import("@/pages/orderManagement/ConfirmBill.vue"),
        name: "ConfirmBill",
        hidden: true,
        meta: {
          title: "确认账单",
          keepAlive: false,
          needLogin: true
        }
      },
      {
        path: "OrderDrafts",
        component: () => import("@/pages/orderManagement/OrderDrafts.vue"),
        name: "OrderDrafts",
        meta: {
          title: "我的草稿",
          keepAlive: true,
          needLogin: true,
          countInfo: "countDraft"
        }
      }
    ]
  }
];

// 广告模块
const adverManagementCenter = [
  {
    path: "/adverManagement",
    component: Layout,
    name: "adverManagement",
    redirect: "noredirect",
    alwaysShow: true,
    meta: {
      title: "广告管理",
      icon: "ad",
      breadcrumb: false,
      auth: "600300_D"
    },
    children: [
      {
        path: "adverCenter",
        component: () => import("@/pages/adverManagement/adverCenter.vue"),
        name: "adverCenter",
        hidden: true,
        meta: {
          title: "广告列表",
          keepAlive: false,
          needLogin: true
        }
      },
      {
        path: "adverAdd",
        component: () => import("@/pages/adverManagement/adverAdd.vue"),
        name: "adverAdd",
        hidden: true,
        meta: {
          title: "新增广告",
          keepAlive: false,
          needLogin: true
        }
      },
      {
        path: "bannerNew",
        component: () => import("@/pages/adverManagement/bannerNew.vue"),
        name: "bannerNew",
        meta: {
          title: "banner广告位",
          keepAlive: false,
          needLogin: true,
          auth: "600700_M"
        }
      }
    ]
  }
];

// 用户管理
const userManagementCenter = [
  {
    path: "/userManagement",
    component: Layout,
    name: "userManagement",
    redirect: "noredirect",
    alwaysShow: true,
    meta: {
      title: "用户管理",
      icon: "user",
      breadcrumb: false,
      auth: "650300_D"
    },
    children: [
      {
        path: "clientManage",
        component: () => import("@/pages/userManagement/clientManage.vue"),
        name: "clientManage",
        meta: {
          title: "企业认证",
          keepAlive: false,
          needLogin: true,
          auth: "651700_M",
          countInfo: "companyUserExamNum",
          countDot: true
        }
      },
      {
        path: "userManage",
        component: () => import("@/pages/userManagement/userManage.vue"),
        name: "userManage",
        meta: {
          title: "用户列表",
          keepAlive: false,
          needLogin: true,
          auth: "650700_M"
        }
      },
      {
        path: "customerManagementMasterList",
        component: () =>
          import("@/pages/userManagement/customerManagementMasterList.vue"),
        name: "customerManagementMasterList",
        meta: {
          title: "客户管理总列表",
          keepAlive: false,
          needLogin: true,
          auth: "653700_M"
        }
      },
      {
        path: "userOrderManagement",
        component: () =>
          import("@/pages/userManagement/userOrderManagement.vue"),
        name: "userOrderManagement",
        meta: {
          title: "订单管理总表",
          keepAlive: false,
          needLogin: true,
          auth: "654700_M"
        }
      },
      {
        path: "personalCenter",
        component: () => import("@/pages/userManagement/userInfo.vue"),
        name: "personalCenter",
        hidden: true,
        meta: {
          title: "个人中心",
          keepAlive: false,
          needLogin: true
          // auth: '654700_M',
        }
      },
      {
        path: "appletUserList",
        component: () => import("@/pages/userManagement/appletUserList.vue"),
        name: "appletUserList",
        meta: {
          title: "小程序用户列表",
          keepAlive: false,
          needLogin: true,
          auth: "108801_M"
        }
      },
      // {
      //   path: 'systemSet',
      //   component: () => import('@/pages/userManagement/systemSet.vue'),
      //   name: 'systemSet',
      //   meta: {
      //     title: '系统设置',
      //     keepAlive: false,
      //     needLogin: true,
      //     auth: '655700_M',
      //   },
      // },
      {
        path: "AddClients",
        component: () => import("@/pages/userManagement/AddClients.vue"),
        name: "AddClients",
        meta: {
          title: "新增客户",
          keepAlive: true,
          needLogin: true,
          auth: "652700_M"
        }
      }
    ]
  }
];

// 科目管理
const courseManagement = [
  {
    path: "/courseManagement",
    component: Layout,
    name: "courseManagement",
    redirect: "noredirect",
    alwaysShow: true,
    meta: {
      title: "科目管理",
      icon: "course",
      breadcrumb: false,
      auth: "350300_D"
    },
    children: [
      {
        path: "exchangeRateManagement",
        component: () =>
          import("@/pages/courseManagement/exchangeRateManagement.vue"),
        name: "exchangeRateManagement",
        meta: {
          title: "汇率管理",
          keepAlive: false,
          needLogin: true,
          auth: "351700_M"
        }
      },
      {
        path: "expenseList",
        component: () =>
          import("@/pages/courseManagement/expenseManagement.vue"),
        name: "expenseList",
        meta: {
          title: "费用列表",
          keepAlive: true,
          needLogin: true,
          auth: "350700_M"
        }
      }
    ]
  }
];

// 工单
const workOrder = [
  {
    path: "/workOrder",
    component: Layout,
    name: "workOrder",
    redirect: "noredirect",
    alwaysShow: true,
    meta: {
      title: "工单",
      icon: "work-order",
      breadcrumb: false,
      auth: "400300_D"
    },
    children: [
      {
        path: "serviceWorkOrder",
        component: () => import("@/pages/workOrder/serviceWorkOrder.vue"),
        name: "serviceWorkOrder",
        meta: {
          title: "客服询单",
          keepAlive: false,
          needLogin: true,
          auth: "400700_M"
        }
      },
      {
        path: "airlineWorkOrder",
        component: () => import("@/pages/workOrder/airlineWorkOrder.vue"),
        name: "airlineWorkOrder",
        meta: {
          title: "航线报价",
          keepAlive: false,
          needLogin: true,
          auth: "401700_M"
        }
      },
      {
        path: "workOrderStatistics",
        component: () => import("@/pages/workOrder/workOrderStatistics.vue"),
        name: "workOrderStatistics",
        meta: {
          title: "询单目的港可视化",
          keepAlive: false,
          needLogin: true,
          auth: "402700_M"
        }
      },
      {
        path: "overAllStatistics",
        component: () => import("@/pages/workOrder/overAllStatistics.vue"),
        name: "overAllStatistics",
        meta: {
          title: "统计表",
          keepAlive: false,
          needLogin: true,
          auth: "403700_M"
        }
      }
    ]
  }
];

// 仓库
const warehouse = [
  {
    path: "/warehouseManagement",
    component: Layout,
    name: "WarehouseManagement",
    redirect: "noredirect",
    alwaysShow: true,
    meta: {
      title: "仓库管理",
      icon: "warehouse",
      breadcrumb: false,
      auth: "550300_D"
    },
    children: [
      {
        path: "warehouseList",
        component: () =>
          import("@/pages/warehouseManagement/WarehouseList.vue"),
        name: "WarehouseList",
        meta: {
          title: "仓库列表",
          keepAlive: false,
          needLogin: true,
          auth: "550700_M"
        }
      }
    ]
  }
];

// 埋点统计
const buriedPoint = [
  {
    path: "/buriedPoint",
    component: Layout,
    name: "BuriedPoint",
    redirect: "noredirect",
    alwaysShow: true,
    meta: {
      title: "埋点统计",
      icon: "cargo-tracking",
      breadcrumb: false,
      auth: "670300_D"
    },
    children: [
      {
        path: "ChannelAnalysis",
        component: () => import("@/pages/buriedPoint/ChannelAnalysis.vue"),
        name: "ChannelAnalysis",
        meta: {
          title: "渠道分析",
          keepAlive: true,
          needLogin: true,
          auth: "670700_M"
        }
      }
    ]
  }
];

// led
const led = [
  {
    path: "/ledPage",
    component: Layout,
    name: "ledPageLayout",
    redirect: "noredirect",
    alwaysShow: true,
    hidden: true,
    meta: {
      title: "led大屏",
      icon: "icon iconfont icon-ECN",
      breadcrumb: false
    },
    children: [
      {
        path: "ledPage",
        component: () => import("@/pages/ledPage/led.vue"),
        name: "ledPage",
        hidden: true,
        meta: {
          title: "led大屏展示",
          keepAlive: false,
          needLogin: true
        }
      }
    ]
  }
];

// 订单管理
const billManagement = [
  {
    path: "/billManagement",
    component: Layout,
    name: "billManagement",
    redirect: "noredirect",
    alwaysShow: true,
    meta: {
      title: "账单管理",
      icon: "order",
      breadcrumb: false,
      auth: "170300_D"
    },
    children: [
      {
        path: "MergeReconciliation",
        component: () => import("@/pages/bill/MergeReconciliation.vue"),
        name: "MergeReconciliation",
        meta: {
          title: "合并开票",
          keepAlive: true,
          needLogin: true,
          auth: "170700_M"
        }
      },
      {
        path: "InvoiceManagement",
        component: () => import("@/pages/bill/InvoiceManagement.vue"),
        name: "InvoiceManagement",
        meta: {
          title: "发票管理",
          keepAlive: true,
          needLogin: true,
          auth: "171700_M"
        }
      },
      {
        path: "BillingInfo",
        component: () => import("@/pages/bill/BillingInfo.vue"),
        name: "BillingInfo",
        meta: {
          title: "开票抬头",
          keepAlive: true,
          needLogin: true
        }
      },
      {
        path: "ConfirmMergeBill",
        component: () => import("@/pages/bill/ConfirmMergeBill.vue"),
        name: "ConfirmMergeBill",
        hidden: true,
        meta: {
          title: "确认对账并开票",
          keepAlive: false,
          needLogin: true
        }
      },
      {
        path: "InvoiceDetail",
        component: () => import("@/pages/bill/InvoiceDetail.vue"),
        name: "InvoiceDetail",
        hidden: true,
        meta: {
          title: "发票详情",
          keepAlive: false,
          needLogin: true
        }
      }
    ]
  }
];

// fba管理
const cmsManagement = [
  {
    path: "/cms",
    component: Layout,
    name: "cmsManagementCenter",
    redirect: "noredirect",
    alwaysShow: true,
    meta: {
      title: "cms管理",
      icon: "bill",
      breadcrumb: false
    },
    children: [
      {
        path: "cmsManagement",
        component: () => import("@/pages/cms/cmsManagement.vue"),
        name: "cmsManagement",
        meta: {
          title: "CMS列表",
          keepAlive: true,
          needLogin: true
        }
      },
      {
        path: "editProduct",
        component: () => import("@/pages/cms/cmsProductDetail.vue"),
        name: "EditCMSProduct",
        hidden: true,
        meta: {
          title: "编辑cms",
          keepAlive: false,
          needLogin: true
        }
      },
      {
        path: "addProduct",
        component: () => import("@/pages/cms/cmsProductDetail.vue"),
        name: "AddCMSProduct",
        hidden: true,
        meta: {
          title: "添加cms",
          keepAlive: false,
          needLogin: true
        }
      }
    ]
  }
];
//实单询盘
const orderInquiry = [
  {
    path: "/orderInquiry",
    component: Layout,
    name: "orderInquiry",
    redirect: "noredirect",
    alwaysShow: true,
    meta: {
      title: "实单询盘",
      icon: "customer",
      breadcrumb: false,
      auth: "410000_D"
    },
    children: [
      {
        path: "airReception",
        component: () => import("@/pages/inquiry/index.vue"),
        name: "airReception",
        blank: true,
        meta: {
          title: "接待会话",
          keepAlive: false,
          needLogin: true,
          auth: "404700_M"
        }
      },
      {
        path: "sessionSetting",
        component: () => import("@/pages/inquiry/sessionSetting.vue"),
        name: "sessionSetting",
        meta: {
          title: "会话设置",
          keepAlive: false,
          auth: "404702_M",
          needLogin: true
        }
      },
      {
        path: "palletList",
        component: () => import("@/pages/inquiry/palletList.vue"),
        name: "palletList",
        meta: {
          title: "货盘列表",
          keepAlive: false,
          needLogin: true,
          auth: "404701_M"
        }
      }
    ]
  }
];
// 权限控制路由
export const asyncRoutes = [
  ...orderManagementCenter,
  ...routeManagementCenter, // dashboard home
  ...cmsManagement,
  ...warehouse,
  ...billManagement,
  ...financeManagementCenter,
  ...billOverview,
  ...adverManagementCenter,
  ...agentManagement,
  ...userManagementCenter,
  ...adminUserCenter,
  ...courseManagement,
  ...cargoTrackingManage,
  ...workOrder,
  ...buriedPoint,
  ...led,
  ...orderInquiry
];

// 默认显示路由
export const constantRoutes = [...autoRoutes];

export default constantRoutes;
