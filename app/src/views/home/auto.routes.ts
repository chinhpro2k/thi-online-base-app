const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    redirectTo: '/login?form=home',
    windowOptions: {
      title: 'App thi online',
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
    },
    createConfig: {
      showSidebar: false,
      showCustomTitlebar: true,
      saveWindowBounds: true,
      openDevTools: false,
    },
  },
]

export default routes
