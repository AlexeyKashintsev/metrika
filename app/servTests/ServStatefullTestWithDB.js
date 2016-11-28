/**
 * 
 * @author Алексей
 * @public 
 */
define('ServStatefullTestWithDB', ['orm'], function (Orm, ModuleName) {
    function module_constructor() {
        var self = this, model = Orm.loadModel(ModuleName);
        
        /**
         * @GET /sessiontestwithDB
         * @param {type} aParam
         * @param {type} suc
         * @param {type} fail
         * @returns {undefined}
         */
        self.doTest = function(aParam, suc, fail) {
            model.qTest.requery(suc)
        };
    }
    return module_constructor;
});
