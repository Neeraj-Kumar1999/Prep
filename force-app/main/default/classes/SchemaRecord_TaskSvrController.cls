public class SchemaRecord_TaskSvrController {
	
    @AuraEnabled(cacheable=true)
    public static List<String> objectNames(){
        List<Schema.SObjectType> gd = Schema.getGlobalDescribe().Values();    
        List<String> options = new List<String>();
        for(SObjectType f : gd){
            if(f.getDescribe().isAccessible() && f.getDescribe().isUpdateable())
            options.add(f.getDescribe().getName());
            options.sort();        
        }
        return options;
    }
    
    @AuraEnabled(cacheable=true)
    public static DynamicBindingWrapper objectRecords(String selectedObject, String recsize){
        
        DynamicBindingWrapper dynamicData = new DynamicBindingWrapper();
        List<fieldDataWrapper> wrapperList =  new List<fieldDataWrapper>();
        List<String> fields = new List<String>();
        List<String> inaccessbilefields = new List<String>();
        
        Map<String , Schema.SObjectType> globalDescription = Schema.getGlobalDescribe();
        Schema.sObjectType objType = globalDescription.get(selectedObject); 
        Schema.DescribeSObjectResult r1 = objType.getDescribe();         
        Map<String , Schema.SObjectField> mapFieldList = r1.fields.getMap();  
        for(Schema.SObjectField field : mapFieldList.values())  {  
            Schema.DescribeFieldResult fieldResult = field.getDescribe();              
            if(fieldResult.isAccessible() &&   fieldResult.isUpdateable()){  
                fields.add(fieldResult.getName());
            } else inaccessbilefields.add(fieldResult.getName());
            fieldDataWrapper wrapper = new fieldDataWrapper();
            if(field.getDescribe().isAccessible() && field.getDescribe().isUpdateable()){
            wrapper.label = field.getDescribe().getLabel();
            wrapper.apiName = field.getDescribe().getName();
            wrapperList.add(wrapper);
            }
        }
        Integer i = 0;
        String fieldsToFetch = '';
        for(String temp:fields){       
            Integer len = fields.size();
            if(i==len-1){
                  fieldsToFetch = fieldsToFetch + temp;
            }
            else{
                  fieldsToFetch = fieldsToFetch + temp + ',';
            }
            i++;
        }
        String sql = ' SELECT ' + fieldsToFetch + ' FROM ' + selectedObject + ' ORDER BY CreatedDate DESC LIMIT '+recsize;
        List<Sobject> objRecords = new List<Sobject>();
        objRecords = Database.Query(sql);
        System.debug('objRecords--->' + objRecords);
        if(objRecords!=null && objRecords.size()>0){
        	dynamicData.sObjectData = objRecords;
        }
        else{
            dynamicData.sObjectData = new List<sObject>();
        }
        dynamicData.fieldList = wrapperList;
        System.debug('dynamicData.sObjectData--->' + dynamicData.sObjectData);
        System.debug('dynamicData.fieldList--->' + dynamicData.fieldList);
        System.debug('dynamicData--->' + dynamicData);
        return dynamicData;
        } 
    
    //Class to store the dynamic data and list of related fields
    public class DynamicBindingWrapper{
        @AuraEnabled
        public List<sObject> sObjectData {get; set;}
        @AuraEnabled
        public List<fieldDataWrapper> fieldList {get; set;}
    }
    
    //Class to store the field information
    public class fieldDataWrapper{
        @AuraEnabled
        public String label {get; set;}
        @AuraEnabled
        public String apiName {get; set;}
    }
}