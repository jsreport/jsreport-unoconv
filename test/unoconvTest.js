require('should')
const jsreport = require('jsreport-core')
const fs = require('fs')
const path = require('path')

describe('unoconv', () => {
  let reporter

  beforeEach(() => {
    reporter = jsreport({
      templatingEngines: {
        strategy: 'in-process'
      }
    }).use(require('../')({
      command: `python ${path.join(__dirname, 'unoconv.py')}`
    }))
      .use(require('jsreport-templates')())
      .use(require('jsreport-assets')())
      .use(require('jsreport-docxtemplater')())
    return reporter.init()
  })

  afterEach(() => reporter.close())

  it('should be able to convert docx to pdf', async () => {
    const result = await reporter.render({
      template: {
        engine: 'none',
        recipe: 'docxtemplater',
        docxtemplater: {
          templateAsset: {
            content: fs.readFileSync(path.join(__dirname, 'template.docx'))
          }
        },
        unoconv: {
          format: 'pdf'
        }
      },
      data: {
        name: 'John'
      }
    })
    result.meta.fileExtension.should.be.eql('pdf')
    result.meta.contentType.should.be.eql('application/pdf')
    result.content.toString().should.startWith('%PDF')
  })
})
