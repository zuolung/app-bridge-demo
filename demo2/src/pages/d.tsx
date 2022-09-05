import React from 'react'
import { AsyncComponent } from '../../app-bridge/index'

export default function AAA() {
  return (
    <div>
      <h1>Demo2 - DDDDDDDDDDDDD</h1>
      <AsyncComponent
        url="http://localhost:10010"
        name="demo1"
        target="app"
        params={{
          path: 'a',
        }}
      />
    </div>
  )
}
