var yargs = require('yargs')
var packageFile = require('../package')

var opts = yargs
  .version(packageFile.version || 'Version only available on installed package')
  .usage('Usage: $0 [options]')
  .option('space', {
    describe: 'ID of Space',
    type: 'string',
    demand: true
  })
  .option('delivery-token', {
    describe: 'Delivery API token',
    type: 'string',
    demand: true
  })
  .option('management-token', {
    describe: 'Management API token',
    type: 'string'
  })
  .option('pre-publish-delay', {
    describe: 'Delay in milliseconds to account for delay after creating entities, due to internal database indexing',
    type: 'number',
    default: 5000
  })
  .config('config', 'Configuration file with required values')
  .argv

module.exports = {
  opts: opts,
  errorLogFile: process.cwd() + '/contentful-link-cleaner-' + Date.now() + '.log'
}
