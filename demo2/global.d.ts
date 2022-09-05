declare module '@dian/ui-mobile'
declare module 'react-router-dom'

interface Window {
  __MAIN_APP?: boolean
  __CHILD_APP?: Record<string, any>
}
