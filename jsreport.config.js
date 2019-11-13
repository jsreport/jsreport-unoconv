
module.exports = {
  name: 'unoconv',
  main: 'lib/unoconv.js',
  optionsSchema: {
    extensions: {
      unoconv: {
        type: 'object',
        properties: {
          command: { type: 'string', default: 'unoconv' }
        }
      }
    }
  },
  dependencies: ['templates', 'assets']
}
