import axios from "axios";
import {Message} from "element-ui";
import router from "@/router";

//请求拦截器
axios.interceptors.request.use(config=>{
    if (window.sessionStorage.getItem('tokenStr')) {
        //请求携带自定义token
        config.headers['Authorization'] =
            window.sessionStorage.getItem('tokenStr');
    }
    return config
},error => {
    console.log(error);
})

//响应拦截器
axios.interceptors.response.use(success => {
    if (success.status && success.status === 200) {
        //code,message,json
        if (success.data.code === 500 || success.data.code === 401 || success.data.code === 403) {
            Message.error({message: success.data.message});
            return;
        }
        if (success.data.message) {
            Message.success(({message: success.data.message}))
        }
        return success.data;
    }
}, error => {
    if (error.response.code === 504 || error.response.code === 404) {
        Message.error({message: '服务器被吃了(╯﹏╰)'})
    } else if (error.response.code === 403) {
        Message.error({message: '权限不足'})
    } else if (error.response.code === 401) {
        Message.error({message: '尚未登陆'})
        router.replace('/').then(r => '/');
    } else {
        if (error.response.data.message) {
            Message.error({message: error.response.data.message})
        }
    }
    return;
});

// let base = 'ggz';
let base = '';

//传递json的post请求
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}
//传递json的put请求
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}
//传递json的get请求
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params,
        // async: false表示同步请求，true表示异步请求,默认异步，除非赋值
        async : (params == null || params.async == null)?true:params.async
    })
}

//传递json的delete请求
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    })
}