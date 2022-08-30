import React from 'react'
import Frame, { FrameContextConsumer } from 'react-frame-component'

import { PRINT_STYLE } from '../utils'

class PrintFrame extends React.Component {
  innerWindow = null

  print = () => {
    if (this.innerWindow) {
      this.innerWindow.print()
    }
  }

  render() {
    const { children } = this.props
    return (
      <Frame
        style={{
          border: '1px dashed black',
          padding: '10px',
          width: '100%',
          height: '600px',
          overflow: 'none',
        }}
        head={<style>{PRINT_STYLE}</style>}
      >
        <FrameContextConsumer>
          {
            ({ window }) => {
              this.innerWindow = window
              return children
            }
          }
        </FrameContextConsumer>
      </Frame>
    )
  }
}

export default PrintFrame
