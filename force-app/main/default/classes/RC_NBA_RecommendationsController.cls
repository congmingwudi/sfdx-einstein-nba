/**
 * Created by ryan.cox on 6/2/20.
 */

public with sharing class RC_NBA_RecommendationsController {

    @AuraEnabled
    public static List<Recommendation> getRecommendations() {
        System.debug('RC_NBA_RecommendationsController > getRecommendations');

        List<Recommendation> recommendations = [
                SELECT
                        AcceptanceLabel,
                        ActionReference,
                        CreatedBy.Name,
                        CreatedDate,
                        Description,
                        Id,
                        ImageId,
                        IsActionActive,
                        Is_Active__c,
                        LastModifiedBy.Name,
                        LastModifiedDate,
                        Name,
                        RejectionLabel
                FROM Recommendation];

        System.debug('RC_NBA_RecommendationsController > getRecommendations - recommendations (' + recommendations.size() + '): ' + recommendations);

        return recommendations;

    } // end getRecommendations

    @AuraEnabled
    public static Recommendation updateRecommendationIsActive(String recommendationID, Boolean isActive) {
        System.debug('RC_NBA_RecommendationsController > updateRecommendationIsActive - recommendationID: ' + recommendationID
            + ', isActive: ' + isActive);

        Recommendation recommendation = new Recommendation(Id = recommendationID, Is_Active__c = isActive);
        update recommendation;
        System.debug('RC_NBA_RecommendationsController > updateRecommendationIsActive - updated: ' + recommendation);

        return recommendation;

    } // end updateRecommendationIsActive

}