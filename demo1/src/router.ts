export const router = [
  {
    path: 'a',
    component: () => import('@/pages/a'),
    title: 'a',
  },
  {
    path: 'b',
    component: () => import('@/pages/b'),
    title: 'b',
  },
  {
    path: 'c',
    component: () => import('@/pages/c'),
    title: 'c',
  },
]
