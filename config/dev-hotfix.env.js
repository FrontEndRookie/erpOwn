'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_FLAG: '"hotfix"',
  BASE_URL: '"/back/lxErpHotfix/faw"',
  BILL_URL: '"http://10.8.0.1/back/lxErpHotfix/faw/bill-of-lading"',
  WS_URL:'" wss://17dc.shenghuoq.com/back/lxWsHotfix/"',
  EXCEL_PATH: '"/image/excel/"',
  HTTP_PATH: '"http://mytest.luoxin56.com/lxErpHotfix"',
})
