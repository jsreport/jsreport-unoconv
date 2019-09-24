const util = require('util')
const path = require('path')
const fs = require('fs')
const readFile = util.promisify(fs.readFile)
const exec = util.promisify(require('child_process').exec)

module.exports = async (inputs, callback, done) => {
  try {
    const callbackAsync = util.promisify(callback)
    const command = inputs.command
    const fileExtension = inputs.documentFileExtension
    const format = inputs.unoconvFormat

    const { sourcePath, outputFilename } = await callbackAsync({
      documentContent: inputs.documentContent,
      format,
      fileExtension
    })

    const { stdout, stderr } = await exec(`${command} -f ${format} ${sourcePath}`)
    const resultBuf = await readFile(path.join(path.dirname(sourcePath), outputFilename))

    done(null, {
      documentContent: resultBuf.toString('base64'),
      stdout,
      stderr
    })
  } catch (e) {
    done(null, {
      error: {
        message: e.message,
        stack: e.stack
      }
    })
  }
}
