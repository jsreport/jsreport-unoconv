
module.exports = async function getTempFile (reporter, req, { documentContent, format, fileExtension }, cb) {
  let outputFilename

  const documentBuf = Buffer.from(documentContent, 'base64')

  const { pathToFile } = await reporter.writeTempFile((uuid) => {
    outputFilename = `${uuid}.${format}`
    return `${uuid}.${fileExtension}`
  }, documentBuf)

  try {
    cb(null, {
      sourcePath: pathToFile,
      outputFilename
    })
  } catch (e) {
    cb(e)
  }
}
