export var menu = [
    {
        module: 'dashboard',
        title: ['Inicio', 'Dashboard'],
        component: 'components/dashboard',
        icon: 'home'
    },
    {
        module: 'stations',
        title: ['Estaciones', 'Stations'],
        component: 'components/stations',
        icon: 'bus'
    },
    {
        module: 'routes',
        title: ['Rutas', 'Routes'],
        component: 'components/routes',
        icon: 'route'
    },
    {
        module: 'account',
        title: ['Cuenta', 'Account'],
        component: 'components/account',
        icon: 'user'
    }
    // {
    //     module: 'settings',
    //     title: ['Configuracion', 'Settings'],
    //     icon: 'cog',
    //     iconArrow: 'chevron-down',
    //     submenu: [
    //         {
    //             title: ['Areas', 'Areas'],
    //             component: 'components/settings/areas',
    //         },
    //         {
    //             title: ['Usuarios', 'Users'],
    //             component: 'components/settings/users',
    //         }
    //     ]
    // }
]