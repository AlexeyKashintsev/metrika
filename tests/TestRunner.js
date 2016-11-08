"use strict";
if(!users) {
    var users = {
        anonymus: {
            username: null,
            password: null,
            tests: []
        },
//        sales: {
//            username: "gen",
//            password: "gen",
//            tests: []
//        },
//        manager: {
//            username: "fran",
//            password: "fran",
//            tests: []
//        }
    };
}

tests.sort(function(a, b) {
    if (!a.priority && !b.priority)
        return 0;
    if (!a.priority)
        return -1;
    if (!b.priority)
        return 1;
    if (a.priority == b.priority)
        return 0;
    return a.priority > b.priority ? 1 : -1;
});

tests.forEach(function(test) {
    test.roles.forEach(function(testRole) {
        users[testRole].tests.push(test);
    });
});

var usrs = [];
for (var user in users) {
    usrs.push(user);
}

function nextLogin() {
    if (usrs.length) {
        var userRole = usrs[0];
        var user = users[userRole];
        user.userRole = userRole;
        usrs = usrs.slice(1, usrs.length);
        logAs(userRole, user);
    } else {
        if (doCallback)
            doCallback();
    }
}

function logAs(userRole, user) {
    QUnit.module("Тестирование от роли " + userRole);
    QUnit.test('Вход от роли ' + userRole,
        function(assert) {
            var loginTest = assert.async();
            logout(assert).then(
                function() {
                    if (user.username && user.password)
                        return login(user.username, user.password);
                    else
                        return true;
                }, function() {
                    assert.notOk(true, "Закрытие текущей сессии");
                    loginTest();
                }) 
                .then(function(anonimus) {
                    if (!anonimus)
                        assert.ok(true, "Вход от имени пользователя " + user.username);
                    else
                        assert.ok(true, "Анонимный вход");
                        
                    return init();
                }).then(function() {
                    assert.ok(true, "Инициализация модулей PlatypusJS");
                    loginTest();
                    return doTests(user);
                }, function(e) {
                    assert.notOk(true, "Вход от имени пользователя " + user.username);
                    loginTest();
                    console.log('Ошибка инициализации: ' + e);
                })
                .then(nextLogin);
        });
}

function doTests(user) {
    return new Promise(function(resolve, reject) {
        if (!user.tests.length)
            resolve();
        
        var tstRun = 0;
        user.tests.forEach(function(test) {
            if (!test.repeats)
                test.repeats = 1;
            for (var j = 0; j < test.repeats; j++) {
                tstRun++;
                QUnit.test(test.description, function(assert) {
                    var cTest = assert.async();
                    (new Promise(function(resolve, reject) {
                        test.test(assert, user, resolve, reject);
                        if (test.timeout)
                            setTimeout(reject, test.timeout);
                    })).then(function() {
                        cTest();
                        tstRun--;
                        if (!tstRun)
                            resolve();
                    }, function() {
                        assert.notOk(true, 'Тест провален!');
                        cTest();
                        tstRun--;
                        if (!tstRun)
                            resolve();
                    });
                });
            }
        }); 
    });
}

nextLogin();