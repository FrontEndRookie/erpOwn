// 数据库对照 t_bps_activity
export default {
  1: {
    name: '用户下单',
    actions: [],
  },
  2: {
    name: '待分配航线',
    actions: [
      {
        label: '保存',
        action: 'saveOrder',
        fieldAuth: ['801000_BB'],
      },
      {
        label: '确认分配',
        action: 'resolveOrder',
        fieldAuth: ['801101_BB'],
      },
      {
        label: '取消订单',
        action: 'cancelOrder',
        type: 'danger',
        fieldAuth: ['801202_BB'],
      },
    ],
  },
  3: {
    name: '待平台审核',
    actions: [
      {
        label: '保存',
        action: 'saveOrder',
        fieldAuth: ['802001_BB'],
      },
      {
        label: '审核通过',
        action: 'resolveOrder',
        fieldAuth: ['802002_BB'],
      },
      {
        label: '取消订单',
        action: 'cancelOrder',
        type: 'danger',
        fieldAuth: ['802003_BB'],
      },
    ],
  },
  5: {
    name: '审核失败，请确认备选方案',
    actions: [],
  },
  9: {
    name: '待进仓',
    actions: [
      {
        label: '保存',
        action: 'saveOrder',
        fieldAuth: ['803000_BB'],
      },
      {
        label: '货物已进仓',
        action: 'resolveOrder',
        fieldAuth: ['803001_BB'],
      },
      {
        label: '取消订单',
        action: 'cancelOrder',
        type: 'danger',
        fieldAuth: ['803002_BB'],
      },
    ],
  },
  13: {
    name: '待平台出进仓数据',
    actions: [
      {
        label: '保存',
        action: 'saveOrder',
        fieldAuth: ['804000_BB'],

      },
      {
        label: '进仓数据填写完成',
        action: 'resolveOrder',
        fieldAuth: ['804001_BB'],
      },
      {
        label: '进仓异常，取消订单',
        action: 'cancelOrder',
        type: 'danger',
        fieldAuth: ['804002_BB'],
      },
    ],
  },
  15: {
    name: '进仓数据重新测量中',
    actions: [
      {
        label: '保存',
        action: 'saveOrder',
        fieldAuth: ['806000_BB'],
      },
      {
        label: '进仓数据填写完成',
        action: 'resolveOrder',
        fieldAuth: ['806001_BB'],
      },
      {
        label: '进仓数据有异议，取消订单',
        action: 'cancelOrder',
        type: 'danger',
        fieldAuth: ['806002_BB'],
      },
    ],
  },
  17: {
    name: '进仓数据待确认',
    actions: {
      // 待确认
      'CZ_JCSJ': [
        {
          label: '保存',
          action: 'saveOrder',
          fieldAuth: ['805000_BB'],
        },
        {
          label: '进仓数据申请复测',
          action: 'retestOrder',
          fieldAuth: ['805001_BB'],
        },
        {
          label: '进仓数据已确认',
          action: 'resolveOrder',
          fieldAuth: ['805002_BB'],
        },
        {
          label: '进仓数据有异议，取消订单',
          action: 'cancelOrder',
          type: 'danger',
          fieldAuth: ['805003_BB'],
        },
      ],
      // 再次确认
      'CZ_CXCL': [
        {
          label: '保存',
          action: 'saveOrder',
          fieldAuth: ['807000_BB'],
        },
        {
          label: '进仓数据申请复测',
          action: 'retestOrder',
          fieldAuth: ['807001_BB'],
        },
        {
          label: '进仓数据已确认',
          action: 'resolveOrder',
          fieldAuth: ['807002_BB'],
        },
        {
          label: '进仓数据有异议，取消订单',
          action: 'cancelOrder',
          type: 'danger',
          fieldAuth: ['807003_BB'],
        },
      ],
    }
  },
  21: {
    name: '操作中，待完成',
    actions: [
      {
        label: '保存',
        action: 'saveOrder',
        fieldAuth: ['808000_BB'],
      },
      {
        label: '操作完成',
        action: 'resolveOrder',
        fieldAuth: ['808001_BB'],
      },
      {
        label: '操作异常，取消订单',
        action: 'cancelOrder',
        type: 'danger',
        fieldAuth: ['808002_BB'],
      },
    ],
  },
  25: {
    name: '待海关放行',
    actions: [
      {
        label: '保存',
        action: 'saveOrder',
        fieldAuth: ['809000_BB'],
      },
      {
        label: '卡口放行',
        action: 'resolveOrder',
        fieldAuth: ['809001_BB'],
      },
      {
        label: '海关查验',
        action: 'rejectOrder',
        type: 'danger',
        fieldAuth: ['809002_BB'],
      },
    ],
  },
  27: {
    name: '海关查验中',
    actions: [
      {
        label: '保存',
        action: 'saveOrder',
        fieldAuth: ['810000_BB'],
      },
      {
        label: '查验正常',
        action: 'resolveOrder',
        fieldAuth: ['810001_BB'],
      },
      {
        label: '查验异常，待处理',
        action: 'rejectOrder',
        type: 'danger',
        fieldAuth: ['810002_BB'],
      },
    ],
  },
  29: {
    name: '查验异常，待处理',
    actions: [
      {
        label: '保存',
        action: 'saveOrder',
        fieldAuth: ['811000_BB'],
      },
      {
        label: '处理成功',
        action: 'resolveOrder',
        fieldAuth: ['811001_BB'],
      },
      {
        label: '查验处理失败，取消订单',
        action: 'cancelOrder',
        type: 'danger',
        fieldAuth: ['811002_BB'],
      },
    ],
  },
  31: {
    name: '待机场安检',
    actions: [
      {
        label: '保存',
        action: 'saveOrder',
        fieldAuth: ['812000_BB'],
      },
      {
        label: '安检通过',
        action: 'resolveOrder',
        fieldAuth: ['812001_BB'],
      },
      {
        label: '安检异常，待处理',
        action: 'rejectOrder',
        type: 'danger',
        fieldAuth: ['812002_BB'],
      },
    ],
  },
  33: {
    name: '安检异常，待处理',
    actions: [
      {
        label: '保存',
        action: 'saveOrder',
        fieldAuth: ['813000_BB'],
      },
      {
        label: '安检通过',
        action: 'resolveOrder',
        fieldAuth: ['813001_BB'],
      },
      {
        label: '处理失败，取消订单',
        action: 'cancelOrder',
        type: 'danger',
        fieldAuth: ['813002_BB'],
      },
    ],
  },
  37: {
    name: '飞机待起运',
    actions: [
      {
        label: '保存',
        action: 'saveOrder',
        fieldAuth: ['814000_BB'],
      },
      {
        label: '已起运',
        action: 'resolveOrder',
        fieldAuth: ['814001_BB'],
      },
      {
        label: '起运异常',
        action: 'rejectOrder',
        type: 'danger',
        fieldAuth: ['814002_BB'],
      },
    ],
  },
  39: {
    name: '订单取消',
    actions: [
      {
        label: '保存',
        action: 'saveOrder',
      },
      {
        label: '订单作废',
        action: 'applyVoidOrder',
        type: 'danger',
      },
    ],
  },
  41: {
    name: '飞机待到达',
    actions: [
      {
        label: '保存',
        action: 'saveOrder',
        fieldAuth: ['815000_BB'],
      },
      {
        label: '已到达',
        action: 'resolveOrder',
        fieldAuth: ['815001_BB'],
      },
    ],
  },
  43: {
    name: '飞机已到达',
    actions: [
      {
        label: '保存',
        action: 'saveOrder',
        fieldAuth: ['816000_BB'],
      },
    ],
  },
}