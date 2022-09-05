import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { router } from './router'
import { isBeUsed, registerApp } from '../app-bridge/index'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={'demo1'} />
        {router.map((item) => (
          <Route
            key={item.path}
            path={item.path}
            element={<RenderComponent {...item} />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  )
}

function App1(props: any) {
  const { path } = props

  if (!path) return 'demo1'

  return (
    <>
      {router.map((item) => {
        if (item.path === path) {
          return <RenderComponent key={path} {...item} />
        }

        return ''
      })}
    </>
  )
}

export class RenderComponent extends React.Component {
  constructor(args: any) {
    super(args)
    this.state = {
      Com: null,
    }
  }

  async componentDidMount() {
    // @ts-ignore
    if (this.props.component) {
      // @ts-ignore
      const res = await this.props.component()
      this.setState({
        Com: res.default,
      })
    }
  }

  render(): React.ReactNode {
    // @ts-ignore
    const { Com } = this.state
    const props: any = this.props
    if (Com) {
      return <Com {...props} />
    } else {
      return 'loading...'
    }
  }
}

const loadedOthers = isBeUsed('demo1')

if (loadedOthers) {
  registerApp('demo1', {
    app: App1,
    router: router,
  })
} else {
  const dom = document.getElementById('root')
  render(<App />, dom)
}
