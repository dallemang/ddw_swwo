
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

function generateIcon (icon) {
  return <span
    className='svg-icon'
    dangerouslySetInnerHTML={{ __html: icon }}
  />
}

const requiredIcons = require.context('!raw-loader!svgo-loader!../static/svg-icons/', false, /^.*\.svg$/)

const ICONS = [
  'sparkle',
  'success',
  'error',
  'localhost'
]

const ICON_SVG = {}
const COMPONENT_ICONS = {}

ICONS.forEach(i => {
  const icon = requiredIcons('./icon-' + i + '.svg')

  ICON_SVG[i] = icon
  COMPONENT_ICONS[i] = generateIcon(icon)
})

export default class SVGIcon extends PureComponent {
  render () {
    const { glyph } = this.props
    return COMPONENT_ICONS[glyph] || null
  }
}

SVGIcon.propTypes ={
  glyph: PropTypes.string
}