var postParse = {};

////////////////////////////////////////////////////////
// 解析上下文里node原生请求的POST参数
postParse.parsePostData = function(ctx) {
    return new Promise((resolve, reject) => {
        try {
            var postdata = "";
            ctx.req.addListener('data', (data) => {
              postdata += data
            })
            ctx.req.addListener("end",function(){
              var parseData = parseQueryStr( postdata )
              resolve( parseData )
            })
        } catch ( err ) {
            reject(err)
        }
    })
}

// 将POST请求参数字符串解析成JSON
function parseQueryStr( queryStr ) {
    var queryData = {}
    var queryStrList = queryStr.split('&')
    for (  var [ index, queryStr ] of queryStrList.entries()  ) {
        var itemList = queryStr.split('=')
        queryData[ itemList[0] ] = decodeURIComponent(itemList[1])
    }
    return queryData
}
///////////////////////////////////////////////////////////////

module.exports = postParse;