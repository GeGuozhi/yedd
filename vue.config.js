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

proxyObj['/ws']={
    ws:false,
    //目标地址
    target:'ws://localhost:8081',
}



module.exports={
    devServer:{
        host:'localhost',
        port:8080,
        proxy:proxyObj
    }
}