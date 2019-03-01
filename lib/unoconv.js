const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile)
const path = require('path')
const exec = util.promisify(require('child_process').exec)
const mime = require('mime')

module.exports = function (reporter, definition) {
  reporter.documentStore.registerComplexType('UNOConvType', {
    format: { type: 'Edm.String' },
    enabled: { type: 'Edm.Boolean' }
  })

  reporter.documentStore.model.entityTypes['TemplateType'].unoconv = { type: 'jsreport.UNOConvType' }

  reporter.beforeRenderListeners.add('unoconv', (req, res) => {
    // otherwise the output is html for office online
    if (req.template.unoconv && req.template.unoconv.enabled !== false && req.template.unoconv.format) {
      req.options.preview = false
    }
  })

  reporter.afterRenderListeners.add('unoconv', async (req, res) => {
    if (!req.template.unoconv || req.template.unoconv.enabled === false || !req.template.unoconv.format) {
      return
    }

    let outputFilename

    const { pathToFile: sourcePath } = await reporter.writeTempFile((uuid) => {
      outputFilename = `${uuid}.${req.template.unoconv.format}`
      return `${uuid}.${res.meta.fileExtension}`
    }, res.content)

    const { stdout, stderr } = await exec(`${definition.options.command} -f ${req.template.unoconv.format} ${sourcePath}`)

    if (stdout) {
      reporter.logger.debug(stdout, req)
    }
    if (stderr) {
      reporter.logger.error(stderr, req)
    }

    res.content = await readFile(path.join(path.dirname(sourcePath), outputFilename))
    res.meta.fileExtension = req.template.unoconv.format
    res.meta.contentType = mime.getType(req.template.unoconv.format)
  })
}
