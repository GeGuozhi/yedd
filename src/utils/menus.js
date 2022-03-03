import {getRequest} from "@/utils/api";

export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return;
    }
    getRequest("/system/cfg/menu").then(data => {
        if (data) {
            //格式化Router
            let fmtRoutes = formatRoutes(data);
            for (let x of fmtRoutes) {
                router.addRoute(x)
            }
            //将数据存入Vuex
            store.commit('initRoutes', fmtRoutes);
            // 连接WebSocket
            store.dispatch('connect');
        }
    })
}

export const formatRoutes = (routes) => {
    let fmtRoutes = [];
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            iconCls,
            children
        } = router;
        if (children && children instanceof Array) {
            children = formatRoutes(children);
        }
        let fmtRouter = {
            path: path,
            name: name,
            iconCls: iconCls,
            children: children,
            component(resolve) {
                if (component.startsWith('Home', '0')) {
                    require(['../views/' + component + '.vue'], resolve);
                } else if (component.startsWith('Emp', '0')) {
                    require(['../views/emp/' + component + '.vue'], resolve);
                } else if (component.startsWith('Per')) {
                    require(['../views/per/' + component + '.vue'], resolve);
                } else if (component.startsWith('Sal')) {
                    require(['../views/sal/' + component + '.vue'], resolve);
                } else if (component.startsWith('Sta')) {
                    require(['../views/sta/' + component + '.vue'], resolve);
                } else if (component.startsWith('Sys')) {
                    require(['../views/sys/' + component + '.vue'], resolve);
                }
            }
        };
        fmtRoutes.push(fmtRouter);
    });
    return fmtRoutes;
}