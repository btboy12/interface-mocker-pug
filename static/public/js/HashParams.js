// 将地址栏的hash转换为字典。例：
// id=1&name=test
// =>
// {id:1,name:'test'}
// 如果没有传入参数，则直接取地址栏的hash
function getHashParams(hash) {
    var params = {};
    var hash = hash || document.location.hash.substring(1);
    var pairs = hash.split("&");
    for (var i in pairs) {
        var paramStr = pairs[i];
        if (paramStr.indexOf("=") > 0) {
            var kv = paramStr.split("=");
            params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
        }
    }
    return params;
}

// 将字典转化为hash。例：
// {id:1,name:'test'}
// =>
// id=1&name=test
function parseHashParams(params) {
    var list = [];
    for (var i in params) {
        list.push(encodeURIComponent(i) + "=" + encodeURIComponent(params[i]));
    }
    return list.join("&");
}

// 在hash中设置某值，如原值不存在则添加。例：
// 原url:localhost#id=1&name=test
// setHashParams('key',100)
// 新值:localhost#id=1&name=test&key=100
// 
// 原url:localhost#id=1&name=test
// setHashParams('id',100)
// 新值:localhost#id=100&name=test
function setHashParams(name, value) {
    var obj = getHashParams();
    obj[name] = value;
    document.location.hash = parseHashParams(obj);
}

// 删除hash中的某值。例：
// 原url:localhost#id=1&name=test
// setHashParams('id')
// 新值:localhost#name=test
function delHashParams(name) {
    var obj = getHashParams();
    delete obj[name];
    document.location.hash = parseHashParams(obj);
}