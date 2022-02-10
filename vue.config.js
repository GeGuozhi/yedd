// const fa = require("element-ui/src/locale/lang/fa");
let proxyObj={}

proxyObj['/']={
    //websocket
    ws:false,

    //目标地址
    target:'http://localhost:8081',

    //发送请求host会设置target
    changeOrigin:true,

    //不重写求情求地址
    pathRewrite:{
        '^/':'/'
    }

}



module.exports={
    devServer:{
        host:'localhost',
        port:8080,
        proxy:proxyObj
    }
}