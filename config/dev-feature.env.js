'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_FLAG: '"feature"',
  BASE_URL: '"/back/lxErpFeature/faw"',
  BILL_URL: '"http://10.8.0.1/back/lxErpFeature/faw/bill-of-lading"',
  WS_URL:'" ws://10.8.0.1/back/lxWsTest/"',
  EXCEL_PATH: '"/image/excel/"',
  HTTP_PATH: '"http://mytest.luoxin56.com/lxErpTest"',
})
