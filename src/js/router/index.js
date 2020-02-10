Ktu.router = new VueRouter({
    esModule: false,
    routes: [
        {
            path: '/Components',
            component: Ktu.router.Compoment,
            children: (() => {

                let routerList = [];

                Ktu.config.router.forEach((item) => {
                    const key = item.key;
                    routerList.push({
                        path: key,
                        component: Ktu.router[key],
                    });
                });

                return routerList;

            })()
        },
        {
            path: '*',
            redirect: '/Components'
        }
    ]
});