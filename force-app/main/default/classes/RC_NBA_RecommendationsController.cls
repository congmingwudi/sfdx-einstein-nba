/**
 * Created by ryan.cox on 6/2/20.
 */

public with sharing class RC_NBA_RecommendationsController {

    @AuraEnabled
    public static List<Recommendation> getRecommendations(String filter) {
        System.debug('RC_NBA_RecommendationsController > getRecommendations - filter: ' + filter);

        List<Recommendation> recommendations;

        if ((filter != null) && (filter != '')) {
            // filter recommendations
            String filterString = '%' + filter + '%';
            recommendations = [
                    SELECT AcceptanceLabel, ActionReference, CreatedBy.Name, CreatedDate, Description,
                            Id, ImageId, IsActionActive, Is_Active__c, LastModifiedBy.Name, LastModifiedDate,
                            Name, RejectionLabel
                    FROM Recommendation
                    WHERE Name LIKE :filterString
            ];
        } else {
            // all recommendations
            recommendations = [
                    SELECT AcceptanceLabel, ActionReference, CreatedBy.Name, CreatedDate, Description,
                            Id, ImageId, IsActionActive, Is_Active__c, LastModifiedBy.Name, LastModifiedDate,
                            Name, RejectionLabel
                    FROM Recommendation
            ];
        }

        System.debug('RC_NBA_RecommendationsController > getRecommendations - recommendations (' + recommendations.size() + '): ' + recommendations);

        return recommendations;

    } // end getRecommendations

    @AuraEnabled
    public static Map<String, String> getRecommendationImageURLs(List<String> imageIDs) {
        System.debug('RC_NBA_RecommendationsController > getRecommendationImageURLs - imageIDs: ' + imageIDs);

        Map<String, String> imageMap = new Map<String, String>();

        if ((imageIds != null) && (imageIDs.size() > 0)) {

            // orgID
            String orgID = [SELECT Id from Organization LIMIT 1].Id;

            // domain
            String host = Url.getSalesforceBaseUrl().getHost();
            List<String> toks = host.split('\\.');
            String domain = toks.get(0);

            // urlPrefix
            String urlPrefix = 'https://' + domain + '--c.documentforce.com';

            // contentAssets
            List<ContentAsset> contentAssets = [SELECT Id, DeveloperName FROM ContentAsset WHERE Id IN :imageIDs];
            System.debug('RC_NBA_RecommendationsController > getRecommendationImageURLs - contentAssets: ' + contentAssets);

            for (ContentAsset asset : contentAssets) {
                String url = urlPrefix + '/file-asset-public/' + asset.DeveloperName + '?oid=' + orgId;
                imageMap.put(asset.Id, url);
            }
        }

        System.debug('RC_NBA_RecommendationsController > getRecommendationImageURLs - imageMap: ' + imageMap);
        return imageMap;

    } // end getRecommendationImageURLs

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