const routes: RouteConfig[] = [
    {
        name: 'Login',
        path: '/login',
        createConfig: {
            single: false,
            showCustomTitlebar: true,
        },
    },
    {
        name: 'PageParams',
        path: '/page-params/:test',
    },
]

export default routes
