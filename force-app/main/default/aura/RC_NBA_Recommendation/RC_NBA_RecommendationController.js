/**
 * Created by ryan.cox on 6/7/20.
 */

({
    isActiveChanged: function(component, event, helper) {

        console.log();
        var isActive = component.get("v.record.Is_Active__c");
        console.log(helper.controllerFile() + ' > isActiveChanged - isActive: ' + isActive);
        helper.updateRecommendationIsActive(component, isActive);

    }, // end isActiveChanged
});