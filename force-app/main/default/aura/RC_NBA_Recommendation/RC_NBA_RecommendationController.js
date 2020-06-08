/**
 * Created by ryan.cox on 6/7/20.
 */

({

    init: function(component, event, helper) {
        var record = component.get("v.record");
        console.log(helper.controllerFile() + ' > init - record: ' + JSON.stringify(record));

        var imageMap = component.get("v.imageMap");
        if (imageMap != null) {
            //console.log(helper.controllerFile() + ' > init - imageMap: ' + JSON.stringify(imageMap));
            var imageURL = imageMap[record.ImageId];
            console.log(helper.controllerFile() + ' > init - imageURL: ' + imageURL);
            component.set("v.imageURL", imageURL);
        }

    }, // end init

    isActiveChanged: function(component, event, helper) {

        console.log();
        var isActive = component.get("v.record.Is_Active__c");
        console.log(helper.controllerFile() + ' > isActiveChanged - isActive: ' + isActive);
        helper.updateRecommendationIsActive(component, isActive);

    }, // end isActiveChanged
});