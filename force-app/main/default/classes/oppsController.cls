public with sharing class oppsController {
 
    public class datawrap{
        @AuraEnabled public Sobject sob;
    }
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpenOpps() {
        
        return  [SELECT Id, Name, CloseDate, Amount,
                   StageName, Probability,
                   AccountId, OwnerId
            FROM Opportunity
            WHERE Probability < 100
            AND Probability > 0
            WITH SECURITY_ENFORCED
            ORDER BY Probability DESC
        ];
       
    }
 
}