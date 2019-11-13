const path = require('path')
const mime = require('mime')
const scriptCallbackTempFile = require('./scriptCallbackTempFile')

module.exports = function (reporter, definition) {
  reporter.documentStore.registerComplexType('UNOConvType', {
    format: { type: 'Edm.String' },
    enabled: { type: 'Edm.Boolean' }
  })

  reporter.documentStore.model.entityTypes.TemplateType.unoconv = { type: 'jsreport.UNOConvType' }

  reporter.beforeRenderListeners.add('unoconv', (req, res) => {
    // otherwise the output is html for office online
    if (req.template.unoconv && req.template.unoconv.enabled !== false && req.template.unoconv.format) {
      req.options.preview = false
    }
  })

  reporter.afterRenderListeners.add('unoconv', async (req, res) => {
    if (!req.template.unoconv || req.template.unoconv.enabled === false || !req.template.unoconv.format || req.context.isChildRequest) {
      return
    }

    const result = await reporter.executeScript({
      command: definition.options.command,
      documentContent: res.content.toString('base64'),
      documentFileExtension: res.meta.fileExtension,
      unoconvFormat: req.template.unoconv.format
    }, {
      execModulePath: path.join(__dirname, 'scriptUnoconvExec.js'),
      callback: (operationParams, cb) => scriptCallbackTempFile(reporter, req, operationParams, cb)
    }, req)

    if (result.stdout) {
      reporter.logger.debug(result.stdout, req)
    }

    if (result.stderr) {
      reporter.logger.error(result.stderr, req)
    }

    if (result.error) {
      const error = new Error(result.error.message)
      error.stack = result.error.stack

      throw reporter.createError('Error while executing unoconv', {
        original: error,
        weak: true
      })
    }

    res.content = Buffer.from(result.documentContent, 'base64')
    res.meta.fileExtension = req.template.unoconv.format
    res.meta.contentType = mime.getType(req.template.unoconv.format)
  })
}
