const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/inscritos', component: () => import('pages/InscritosPage.vue') },
      { path: '/pagos', component: () => import('pages/PagosPage.vue') },
      { path: '/areas', component: () => import('pages/DesaPage.vue') },
      { path: '/calendar', component: () => import('pages/DesaPage.vue') },
      { path: '/asistencia', component: () => import('pages/DesaPage.vue') },
      { path: '/ficha', component: () => import('pages/DesaPage.vue') },
      { path: '/certificado', component: () => import('pages/DesaPage.vue') },
    ]
  },
  //ficha- certificado
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
