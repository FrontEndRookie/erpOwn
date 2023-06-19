'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_FLAG: '"test"',
  BASE_URL: '"/back/lxErpTest/faw"',
  BILL_URL: '"http://10.8.0.1/back/lxErpTest/faw/bill-of-lading"',
  WS_URL:'" ws://10.8.0.1/back/lxWsTest/"',
  EXCEL_PATH: '"/imageTest/excel/"',
  HTTP_PATH: '"http://mytest.luoxin56.com/lxErpTest"',
})
