"use strict";
if (!window.tests)
    window.tests = [];
tests.push({
    name: 'UserSessionTest',
    description: 'Работа с пользовательской сессией',
    roles: ['sales', 'manager'],
    repeats: 1,
    priority: 1,
    test: 
    function(assert, userData, finish, crash) {
        var moduleName = "UserSession";
        var sessionMod;

        return getProxy(moduleName, assert)
        .then(function (module) {
            logger.info('Тест получения настроек');
            return new Promise(function(resolve, reject) {
                
                sessionMod = module;
                
                var moduleTest1 = assert.async();
                sessionMod.getUserName(function(res) {
                    assert.ok(res == userData.username, "Получение имени пользователя");
                    moduleTest1();
                }, function(err) {
                    assert.notOk(true, "Получение имени пользователя");
                    moduleTest1();
                });
                
                sessionMod.getUserRoles(null, function(usrRoles) {
                    logger.info('Роли получены');
                    console.log(usrRoles);
                    if (usrRoles[userData.userRole]) {
                        assert.ok(true, "Получение ролей пользователя");
                        resolve(usrRoles);
                    } else {
                        assert.notOk(true, "Получение ролей пользователя");
                        reject();
                    }
                }, function(err) {
                    assert.notOk(true, "Получение ролей пользователя");
                    reject(err);
                });
            });
        }, crash)
        .then(function(roles) {
            for (var role in roles) {
                switch (role) {
                    case 'sales': 
                            return salesTest();
                            break;
                    case 'franchazi': 
                            return managerTest();
                            break;
                }
            };
        })
        .then(finish, function(err) {
            assert.notOk(true, "Ошибка при тестировании сессионного модуля: " + err);
            finish();
        });
        
        function salesTest() {
            return new Promise(function(resolve, reject) {
                sessionMod.getTradePoint(function(tradePointData) {
                    logger.info('Получена информация по торговой точке');
                    console.log(tradePointData);
                    assert.ok(tradePointData, 'Получение торговой точки');
                    tradePointData ? resolve(tradePointData) : reject();
                }, reject);
            }).then(function(tpData) {
                return new Promise(function(resolve, reject) {
                    window.testTP = tpData;
                    console.log('!!!!!');
                    console.log(tpData);
                    resolve();
                });
            });
        };
        
        function managerTest() {
            assert.ok(true, 'Вход от имени менеджера');
        }
    }
});