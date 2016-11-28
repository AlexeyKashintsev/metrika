/**
 * 
 * @author Алексей
 */
define('Launcher', ['orm', 'forms', 'ui'], function (Orm, Forms, Ui, ModuleName) {
    function module_constructor() {
        var self = this
                , model = Orm.loadModel(ModuleName)
                , form = Forms.loadForm(ModuleName, model);
        
        self.show = function () {
            form.show();
        };
        
        form.button.onActionPerformed = function(evt) {
            model.qShotsInPeriod.query({period_start: new Date(), period_end: new Date()})
        }        
    }
    return module_constructor;
});
