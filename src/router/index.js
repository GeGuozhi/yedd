import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import FriendChat from "@/views/chat/FriendChat";
import Setting from "@/views/sys/Setting";
import UserInfo from "@/views/sys/UserInfo";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        hidden: true
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/chat',
                name: 'Chat',
                component: FriendChat
            },
            {
                path: '/userinfo',
                name: 'UserInfo',
                component: UserInfo
            },
            {
                path: '/setting',
                name: 'Setting',
                component: Setting
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

export default router
