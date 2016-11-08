/**
 * 
 * @author Алексей
 * @public 
 */
define('ServStatefullTest', ['orm'], function (Orm, ModuleName) {
    function module_constructor() {
        var self = this, model = Orm.loadModel(ModuleName);
        
        /**
         * @GET /sessiontest
         * @param {type} aParam
         * @param {type} suc
         * @param {type} fail
         * @returns {undefined}
         */
        self.doTest = function(aParam, suc, fail) {
            suc(aParam);
        };
    }
    return module_constructor;
});
