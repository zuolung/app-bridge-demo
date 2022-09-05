import React from 'react'
import { AsyncComponent } from '../../app-bridge/index'

export default function AAA() {
  return (
    <div>
      <h1>Demo1 - AAAAAAA</h1>
      <AsyncComponent url="http://localhost:10222" name="demo2" target="app" />
    </div>
  )
}
