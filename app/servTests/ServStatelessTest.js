/**
 * 
 * @author Алексей
 * @stateless
 * @public 
 */
define('ServStatelessTest', ['orm'], function (Orm, ModuleName) {
    function module_constructor() {
        var self = this, model = Orm.loadModel(ModuleName);
        
        /**
         * @GET /statelesstest
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
