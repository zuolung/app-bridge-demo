import React, { useState, useEffect } from 'react'
import { render } from 'react-dom'
import { createBrowserHistory } from 'history'
import {
  unstable_HistoryRouter as HRouter,
  Routes,
  Route,
} from 'react-router-dom'
import { router } from './router'
import {
  isBeUsed,
  registerApp,
  asyncLoader,
  AsyncComponent,
} from '../app-bridge/index'

const history = createBrowserHistory()

export default function App() {
  const [routerDemo1, setRouter] = useState<any[]>([])

  useEffect(() => {
    asyncLoader({
      url: 'http://localhost:10010',
      name: 'demo1',
    }).then((res) => {
      setRouter(res.router)
    })
  }, [])

  return (
    <>
      <button onClick={() => history.push(`/a`)}>Demo1 - a</button>
      <button onClick={() => history.push(`/b`)}>Demo1 - b</button>
      <button onClick={() => history.push(`/c`)}>Demo1 - c</button>
      <button onClick={() => history.push(`/d`)}>Demo2 - d</button>
      <button onClick={() => history.push(`/e`)}>Demo2 - e</button>
      <button onClick={() => history.push(`/f`)}>Demo2 - f</button>
      <HRouter history={history}>
        <Routes>
          <Route path="/" element={'demo2'} />
          {router.map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={<RenderComponent {...item} />}
            />
          ))}
          {routerDemo1.map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={
                <AsyncComponent
                  url="http://localhost:10010"
                  name="demo1"
                  target="app"
                  params={{
                    path: item.path,
                  }}
                />
              }
            />
          ))}
        </Routes>
      </HRouter>
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
    const res = await this.props.component()
    this.setState({
      Com: res.default,
    })
  }

  async componentWillReceiveProps(nextProps: any) {
    // @ts-ignore
    if (this.props.component && nextProps.component !== this.props.component) {
      // @ts-ignore
      const res = await nextProps.component()
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

const loadedOthers = isBeUsed('demo2')

if (loadedOthers) {
  registerApp('demo2', {
    app: () => <span>demo2 - component</span>,
  })
} else {
  const dom = document.getElementById('root')
  render(<App />, dom)
}
