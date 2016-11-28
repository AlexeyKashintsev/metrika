/* 
 * Выполнение метода api
 */
function request(httpMethod, apiMethod, params, callback) {
     $.ajax({
        url: "/" + appContext + "/application/" + apiMethod,
        data: params,
        type: httpMethod,
        complete: function (dat) {
            //console.log(dat);
            if (dat.responseJSON) {
                callback(dat.responseJSON);
            } else {
                callback({
                    error: "Server error: " + dat.status,
                    response: dat.responseText
                });
            }
        }
    });
}

function fetchData(queryName, aParams, callback) {
    var params = '';
    for (var e in aParams) {
        params += '&' + e + '=' + aParams[e]
    }
    $.ajax({
        url: "/" + appContext + "/application?__type=7&__queryId=" + queryName + params,
        data: null,
        type: 'GET',
        complete: function (dat) {
            //console.log(dat);
            if (dat.responseJSON) {
                callback(dat.responseJSON);
            } else {
                callback({
                    error: "Server error: " + dat.status,
                    response: dat.responseText
                });
            }
        }
    });
    
}