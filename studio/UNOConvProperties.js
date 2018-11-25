import React, { Component } from 'react'

export default class Properties extends Component {
  static title (entity, entities) {
    if (!entity.unoconv || !entity.unoconv.format || entity.unoconv.enabled === false) {
      return 'unoconv'
    }

    return `unoconv ${entity.unoconv.format}`
  }
  render () {
    const { entity, onChange } = this.props

    return (
      <div className='properties-section'>
        <div className='form-group'><label>Format</label>
          <input
            type='text' placeholder='pdf' value={entity.unoconv ? entity.unoconv.format : ''}
            onChange={(v) => onChange({ _id: entity._id, unoconv: { format: v.target.value } })} />
        </div>
        <div className='form-group'>
          <label>Enabled</label>
          <input type='checkbox' checked={entity.enabled !== false} onChange={(v) => onChange({ _id: entity._id, enabled: v.target.checked })} />
        </div>
      </div>
    )
  }
}
