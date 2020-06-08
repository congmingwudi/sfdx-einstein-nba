/**
 * Created by ryan.cox on 6/7/20.
 */

({
    controllerFile: function() {
        return "RC_NBA_RecommendationController";
    },

    helperFile: function() {
        return "RC_NBA_RecommendationHelper";
    },

    updateRecommendationIsActive: function(component, isActive) {

        var record = component.get("v.record");
        if (record) {
            console.log(this.helperFile() + ' > updateRecommendationIsActive - ' + record.Name + ', set isActive to: ' + isActive);

            // update only if different values
            let doUpdate = true;

            if (doUpdate) {
                // isLoading controls the spinner to indicate processing
                component.set('v.isLoading', true);

                // create the action
                var action = component.get("c.updateRecommendationIsActive"); // method on apex: RC_NBA_RecommendationsController
                action.setParams({
                    "recommendationID": record.Id,
                    "isActive": isActive
                });

                // add callback behavior for when response is received
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    console.log(this.helperFile() + ' > updateRecommendationIsActive - response: ' + state);
                    if (state === "SUCCESS") {
                        console.log(this.helperFile() + ' > updateRecommendationIsActive - isActive updated to: ' + isActive);
                    }
                    else {
                        console.log(this.helperFile() + ' > updateRecommendationIsActive - failed with state: ' + state);
                    }
                    
                    // stop the spinner
                    component.set('v.isLoading', false);
                });

                // send action off to be executed
                $A.enqueueAction(action);
            }
        } else {
            console.log(this.helperFile() + ' > updateRecommendationIsActive - no record selected');
        }

    }, // end updateRecommendationIsActive

});