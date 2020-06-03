/**
 * Created by ryan.cox on 6/2/20.
 */

({

    controllerFile: function() {
        return "RC_NBA_RecommendationsController";
    },

    helperFile: function() {
        return "RC_NBA_RecommendationsHelper";
    },

    getRecommendations: function(component) {

        console.log(this.helperFile() + ' > getRecommendations');

        // isLoading controls the spinner to indicate processing
        component.set('v.isLoading', true);

        // create the action
        var action = component.get("c.getRecommendations"); // method on apex: RC_NBA_RecommendationsController

        // add callback behavior for when response is received
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log(this.helperFile() + ' > getRecommendations - response: ' + state);
            if (state === "SUCCESS") {

                // set recommendations
                let recordList = response.getReturnValue();
            	console.log(this.helperFile() + ' > getRecommendations - recommendations: ' + JSON.stringify(recordList));
                component.set("v.recordList", recordList);

                // set table data
                this.setRecordTableData(component, recordList);

                // stop the spinner
                component.set('v.isLoading', false);
            }
            else {
                console.log(this.helperFile() + ' > getRecommendations - failed with state: ' + state);
            }
        });

        // send action off to be executed
        $A.enqueueAction(action);

    }, // end getRecommendations

   // TABLE OPERATIONS

    setRecordTableData: function(component, recordList) {

        console.log(this.helperFile() + ' > setRecordTableData - recordList: ' + recordList.length);
		//console.log(this.helperFile() + ' > setRecordTableData - recordList: ' + JSON.stringify(recordList));

        // data items
        var recordType = component.get('v.recordType');
        var data = Array();
        for (var i = 0; i < recordList.length; ++i) {
            var item = recordList[i];
            var dataItem = {};
            dataItem.Name = item.Name;

            // TODO: [TEMPLATE UPDATE] fields for object type to be displayed in the record table
            switch(recordType) {

                default :
                    dataItem.Name = item.Name;
                    dataItem.Description = item.Description;
                    dataItem.isActive = (item.Is_Active__c) ? 'ACTIVE' : 'NOT ACTIVE';
                    break;

            } // end switch
            // END [TEMPLATE UPDATE]

            data.push(dataItem);
        }

        console.log(this.helperFile() + ' > setRecordTableData - data: ' + JSON.stringify(data));

        // set table data
        component.set('v.tableData', data);

        // sort table by order item 'Name'
        var fieldName = 'Name';
        var sortDirection = 'asc';
        var showLoadingSpinner = false;
        this.updateColumnSorting(component, fieldName, sortDirection, showLoadingSpinner);

    }, // end setRecordTableData

    updateColumnSorting: function(component, fieldName, sortDirection, showLoadingSpinner) {
        if (showLoadingSpinner) component.set('v.isLoading', true);
        // We use the setTimeout method here to simulate the async process of the sorting data,
        // so that user will see the spinner loading when the data is being sorted.
        var helper = this;
        setTimeout(function() {
            //console.log(this.helperFile() + ' > sort - fieldName: ' + fieldName + ', sortDirection: ' + sortDirection);
            component.set("v.sortedBy", fieldName);
            component.set("v.sortedDirection", sortDirection);
            helper.sortData(component, fieldName, sortDirection);
            if (showLoadingSpinner) component.set('v.isLoading', false);
        }, 0);
    }, // end updateColumnSorting

    sortData: function (component, fieldName, sortDirection) {
        var data = component.get("v.tableData");
        var reverse = sortDirection !== 'asc';

        data = Object.assign([],
            data.sort(this.sortBy(fieldName, reverse ? -1 : 1))
        );
        component.set("v.tableData", data);
    }, // end sortData

    sortBy: function (field, reverse, primer) {
        var key = primer
            ? function(x) { return primer(x[field]) }
            : function(x) { return x[field] };

        return function (a, b) {
            var A = key(a);
            var B = key(b);
            return reverse * ((A > B) - (B > A));
        };
    }, // end sortBy

   setRecordFields: function(component, row) {

        console.log(this.helperFile() + ' > setRecordFields - row: ' + JSON.stringify(row));

        // get record
        var record;
        var recordList = component.get("v.recordList");
        console.log(this.helperFile() + ' > setRecordFields - recordList: ' + JSON.stringify(recordList));
        for (var i = 0; i < recordList.length; ++i) {
            var item = recordList[i];
            if (item.Name == row.Name) {
                record = item;
            }
        }
        console.log(this.helperFile() + ' > setRecordFields - record: ' + JSON.stringify(record));

        // set current childRecord
        component.set("v.record", record);

    }, // setChildRecordFields

    updateRecommendationIsActive: function(component, isActive) {

        var record = component.get("v.record");
        if (record) {
            console.log(this.helperFile() + ' > updateRecommendationIsActive - ' + record.Name + ', current isActive: ' + record.Is_Active__c + ', set to: ' + isActive);

            // update only if different values
            let doUpdate = (isActive != record.Is_Active__c);

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

                        // refresh recommendations
                        this.getRecommendations(component);
                    }
                    else {
                        console.log(this.helperFile() + ' > updateRecommendationIsActive - failed with state: ' + state);
                    }
                });

                // send action off to be executed
                $A.enqueueAction(action);
            }
        } else {
            console.log(this.helperFile() + ' > updateRecommendationIsActive - no record selected');
        }

    }, // end activeRecommendation

});