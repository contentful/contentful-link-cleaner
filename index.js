try {
  module.exports = require('./dist/run-link-cleaner').default
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    require('babel-register')
    module.exports = require('./lib/run-link-cleaner').default
  } else {
    console.log(err)
    process.exit(1)
  }
}
