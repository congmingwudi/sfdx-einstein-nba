/**
 * Created by ryan.cox on 6/2/20.
 */

({

    init: function(component, event, helper) {
        var filter = component.get("v.filter");
        console.log(helper.controllerFile() + ' > init - filter: ' + filter);

        // TABLE columns
        var columns = [];
        var recordType = component.get('v.recordType');
        switch(recordType) {

            default :
                columns = [
                    {label: 'Name', fieldName: 'Name', type: 'text', sortable: true, iconName: "standard:investment_account"},
                    //{label: 'Description', fieldName: 'Description', type: 'text', sortable: true, iconName: "standard:letterhead", cellAttributes: { alignment: 'left' } },
                    {label: 'Is Active?', fieldName: 'isActive', type: 'text', sortable: true, iconName: "standard:marketing_actions", cellAttributes: { alignment: 'left' } },
                    {type:  'button', typeAttributes: {iconName: 'standard:endorsement', label: '', name: 'activate', disabled: false}, cellAttributes: { alignment: 'center' } },
                    {type:  'button', typeAttributes: {iconName: 'standard:first_non_empty', label: '', name: 'deactivate', disabled: false}, cellAttributes: { alignment: 'center' } },
                ]
                break;

        } // end switch

    	component.set('v.tableColumns', columns);

        // load Recommendations
        helper.getRecommendations(component);

    }, // end init

    handleTabActive: function (component, event, helper) {
        var tab = event.getSource().get('v.id');
        console.log(helper.controllerFile() + ' > handleTabActive - tab: ' + tab);
        switch (tab) {
            case 'Table' :
                // refresh recommendations
                helper.getRecommendations(component);
                break;
        }
    }, // end handleTabActive

   // TABLE OPERATIONS

    updateColumnSorting: function (component, event, helper) {
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        var showLoadingSpinner = true;
        helper.updateColumnSorting(component, fieldName, sortDirection, showLoadingSpinner);
    }, // end updateColumnSorting

    handleRowAction: function (component, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        var childRecord_Label = component.get("v.childRecord_Label");
        console.log(helper.controllerFile() + ' > row action: ' + JSON.stringify(action));

        switch (action.name) {
            case 'activate': {
            	console.log(helper.controllerFile() + ' > activate row: ' + JSON.stringify(row));
                helper.setRecordFields(component, row);
                helper.updateRecommendationIsActive(component, true);
                break;
            }
            case 'deactivate': {
            	console.log(helper.controllerFile() + ' > deactivate row: ' + JSON.stringify(row));
                helper.setRecordFields(component, row);
                helper.updateRecommendationIsActive(component, false);
                break;
        	}
        } // end switch
    }, // end handleRowAction


});