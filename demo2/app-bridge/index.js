import React, { useState, useEffect } from 'react'
import getScriptFromHtml from './getScriptFromHtml'

if (!window.__domi_app_data__) window.__domi_app_data__ = {}
if (!window.__domi_beUsed__) window.__domi_beUsed__ = {}

if (!window.__domi_scriptTaskCache__) window.__domi_scriptTaskCache__ = {}

function registerApp(appName, data) {
  const origin = window.__domi_app_data__ || {}
  if (!origin[appName]) origin[appName] = {}
  origin[appName] = {
    ...origin[appName],
    ...data,
  }
}

function isBeUsed(name) {
  return window.__domi_beUsed__[name]
}

function fetchHtml(url) {
  return fetch(url, { method: 'GET', mode: 'cors' })
    .then((res) => {
      return res.text()
    })
    .then((data) => {
      return data
    })
}

function getOrigin(url) {
  const urlArr = url.split('/')
  const prefix = url.split(':')[0]

  return `${prefix}://${urlArr[2]}`
}

async function asyncLoader({ url, name }) {
  if (window.__domi_app_data__[name]) {
    return Promise.resolve(window.__domi_app_data__[name])
  }

  if (window.__domi_scriptTaskCache__[url]) {
    return window.__domi_scriptTaskCache__[url]
  }

  window.__domi_beUsed__[name] = true

  const promiseResult = new Promise(async (resolve, reject) => {
    const htmlStr = await fetchHtml(url)
    const scripts = getScriptFromHtml(htmlStr).scripts
    const mainScript = scripts[scripts.length - 1]
    const scriptor = document.createElement('script')
    scriptor.src = `${getOrigin(url)}/${mainScript.src}`

    document.body.append(scriptor)

    scriptor.onload = function () {
      resolve(window.__domi_app_data__[name])
    }

    scriptor.onerror = function (res) {
      reject(res)
    }
  })

  window.__domi_scriptTaskCache__[url] = promiseResult

  return promiseResult
}

function AsyncComponent(props) {
  const { url, target, name, LoadingComponent, ErrorComponent, params } = props
  const [, forceUpdate] = useState()
  const [error, setError] = useState()

  useEffect(function () {
    asyncLoader({
      url,
      name,
    })
      .then((res) => {
        forceUpdate({})
      })
      .catch((error) => {
        setError(error)
      })
  }, [])

  if (error) {
    if (errorComponent) return <ErrorComponent error={error} />
    return <>load error</>
  }

  const Result = window.__domi_app_data__?.[name]?.[target]

  return Result ? (
    <Result {...params} />
  ) : (
    <>{LoadingComponent ? <LoadingComponent /> : <>loading...</>}</>
  )
}

export { registerApp, AsyncComponent, asyncLoader, isBeUsed }
