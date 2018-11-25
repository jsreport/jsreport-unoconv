import Properties from './UNOConvProperties'
import Studio from 'jsreport-studio'

Studio.addPropertiesComponent(Properties.title, Properties, (entity) => entity.__entitySet === 'templates')

Studio.addApiSpec({
  template: {
    unoconv: {
      enabled: true,
      format: 'pdf'
    }
  }
})
