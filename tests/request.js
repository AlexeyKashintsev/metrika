/* 
 * Выполнение метода api
 */
function request(httpMethod, apiMethod, params, callback) {
     $.ajax({
        url: "/tk/application/" + apiMethod,
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