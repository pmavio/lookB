const config = {
    //程序运行端口
    service_port: 6000,
    //域名
    service_dns: '127.0.0.1',
    // 静态资源路径
    resource_url: '/build',
    //数据库地址
    mongodb_url: 'mongodb://127.0.0.1:27017/LOOKB',
    dns: "http://lookb.com",
    //是否加载第三方插件配置项
    webpack_hot: false,
    //jwt加密私钥
    sign: "llsb",

};


if (process.env.NODE_ENV === 'production') {

}

module.exports = config;