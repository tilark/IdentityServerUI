'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"mydevelopment"',
  BASE_API: '"http://rap2api.taobao.org/app/mock/25971"',
  IDENTITY_API: '"http://rap2api.taobao.org/app/mock/25965"'
})
