/**
 * 
 * @author Алексей
 */

function init() {
    console.log('Initializing...')
    return new Promise(function (resolve, reject) {
        require(['rpc', 'logger'], function (rpc, Logger) {
            function moduleLoader(moduleName, assert) {
                if (!assert)
                    assert = {
                        async: function(txt) {logger.info(txt);},
                        ok: function(txt) {logger.info(txt);},
                        notOk: function(txt) {logger.info(txt);}
                    };
                
                var getModule = assert.async();
                
                return new Promise(function (resolve, reject) {
                    rpc.requireRemotes(moduleName, function (module) {
                        assert.ok(true, "Создано подключение к серверному модулю " + moduleName);
                        getModule();
                        resolve(module);
                    }, function(err) {
                        assert.notOk(true, "Ошибка при подключении к серверному модулю " + moduleName);
                        getModule();
                        reject(false);
                    });
                });
            }
            
            function webSocketConnection(wsModuleName, anOpenCallback, aMessageCallback) {
                var messageCallback = aMessageCallback;
                
                var wsProtocol = (window.location.protocol === 'https:') ? "wss:" : "ws:";
                var path = window.location.pathname.substr(0, window.location.pathname.lastIndexOf("/"));
                path = path.substr(0, path.lastIndexOf("/"));
                var URI = wsProtocol + "//" + window.location.host + path + "/" + wsModuleName;
                var opened = false;
                
                var webSocket = new WebSocket(URI);
                webSocket.onopen = function () {
                    Logger.info("WebSocket connection opened, URL: " + URI);
                };

                webSocket.onerror = function (evt) {
                    Logger.info("WebSocket onError: " + evt.data);
                };

                webSocket.onmessage = function (evt) {
                    Logger.info("WebSocket message: " + evt.data);
                    if (!opened && evt.data === 'opened') {
                        opened = true;
                        if (anOpenCallback)
                            anOpenCallback();
                    } else {
                        messageCallback(evt.data);
                    }
                };

                webSocket.onclose = function () {
                    Logger.info("WebSocket close");
                };
                
                Object.defineProperty(webSocket, 'message', {
                    set: function(msgProc) {
                        messageCallback = msgProc;
                    }
                });
                
                return webSocket;
            }
            
            window.getProxy = moduleLoader;
            window.wsConnection = webSocketConnection;
            window.logger = Logger;
            resolve();
        }, reject);
    });
}

function login(username, password, assert) {
    return new Promise(function(resolve, reject) {
        console.log('Logging in...');
        $.ajax({
            type: "GET",
            url: "../application-start.html",
            complete: function(a) {
                console.log(a);
                if (a.responseText.search('<input type="password" name="j_password" id="password" />') >= 0)
                    $.ajax({
                        type: "POST",
                        url: "j_security_check",
                        dataType: 'json',
                        async: true,
                        data: {
                            j_username: username,
                            j_password : password
                        },
                        complete: function (b) {
                            console.log('Logged in...');
                            console.log(b);
                            if (b.responseText.search('Platypus Application login fail.') == -1)
                                resolve();
                            else
                                reject();
                        }
                    });
                else
                    reject();
            }
        });
    });
}

function logout(assert) {
    return new Promise(function(resolve, reject) {
        require('security', function(security) {
            security.principal(function(principal) {
                assert.ok(true, "Закрытие текущей сессии");
                principal.logout(resolve);
            }, function(err) {
                assert.ok(true, "Нет текущей сессии");
                resolve();
            });
        }, function() {
            assert.ok(true, "Нет текущей сессии");
            resolve();
        });
    });
}