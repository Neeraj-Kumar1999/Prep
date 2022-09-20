public class GetRecentRecords {       
    
    @AuraEnabled(cacheable=true)
    public static List<String> getSobjectsmethod(){
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
    public static DynamicBindingWrapper objectRecords(String selectedObject, String recsize, String fieldsselected){
        
        DynamicBindingWrapper dynamicData = new DynamicBindingWrapper();
        List<fieldDataWrapper> wrapperList =  new List<fieldDataWrapper>();
        List<String> lstfls = new List<String>();
        string fieldString = '';
        if(fieldsselected == ''){
            List<String> fields = new List<String>();        
            
            
            Map<string,Schema.SobjectType> schemaMap = Schema.getGlobalDescribe();           
            Map<string,Schema.SObjectField> fieldMap = schemaMap.get(selectedObject).getDescribe().fields.getMap();            
            List<String> strlst = new List<String>();
            for(Schema.SObjectField field : fieldMap.values()){
                Schema.DescribeFieldResult des = field.getDescribe();
                strlst.add(des.getName());     
                if(des.isAccessible() && des.isUpdateable()){
                    fieldDataWrapper wrapper = new fieldDataWrapper();
                    wrapper.label = des.getLabel();
                    wrapper.fieldName = des.getName();
                    //wrapper.editable = des.isUpdateable();            
                    wrapperList.add(wrapper);
                }
            }
            
            System.debug(strlst.size());
            
            System.debug('Str null');
            
            for(integer i=0;i<strlst.size();i++){
                if(fieldString!= null){
                    fieldString = fieldString+','+strlst[i];
                } else fieldString = strlst[i];
            }
        } 
        else {
            fieldString = fieldsselected.removeStart(',');
            fieldString = fieldString.removeStart(',');
            lstfls = fieldString.split(',');
            System.debug('Array fields:'+lstfls);
        }
        for(String ss:lstfls){
            fieldDataWrapper wrapper = new fieldDataWrapper();
            wrapper.label = ss;
            wrapper.fieldName = ss;
            //wrapper.editable = des.isUpdateable();            
            wrapperList.add(wrapper);
        }
        
        System.debug('Fields String:'+fieldString);
        
        
        fieldString = fieldString.removeStart(',');
        System.debug('Fields String:'+fieldString);
        String sql = ' SELECT ' + fieldString + ' FROM ' + selectedObject + ' ORDER BY CreatedDate DESC LIMIT '+ recsize;
        System.debug('Query:'+sql);
        List<Sobject> objRecords = new List<Sobject>();
        objRecords = Database.Query(sql);
        System.debug('Data::'+objRecords);
        if(objRecords!= null && objRecords.size()>0){            
            dynamicData.sObjectData = objRecords;
        }    
        
        dynamicData.fieldList = wrapperList;
        System.debug('Dynamic Rec Data' + dynamicData.sObjectData);
        System.debug('Dynamic Fields' + dynamicData.fieldList);
        System.debug('Dynamic Data' + dynamicData);
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
        public String fieldName {get; set;}      
    }
    public class fieldselectionwrapper{
        @AuraEnabled
        public String label {get; set;}
        @AuraEnabled
        public String value {get; set;}
        
    }
    
    @AuraEnabled(cacheable=true)
    public static List<fieldselectionwrapper> selectfields(String selectedObject){        
        Map<string,Schema.SobjectType> schemaMap = Schema.getGlobalDescribe();        
        Map<string,Schema.SObjectField> fieldMap = schemaMap.get(selectedObject).getDescribe().fields.getMap();
        string fieldString = '';
        List<String> strlst = new List<String>();
        List<fieldselectionwrapper> wrapperList =  new List<fieldselectionwrapper>();
        for(Schema.SObjectField field : fieldMap.values()){
            Schema.DescribeFieldResult des = field.getDescribe();
            strlst.add(des.getName());            
            fieldselectionwrapper wrapper = new fieldselectionwrapper();
            wrapper.label = des.getLabel();
            wrapper.value = des.getName();                        
            wrapperList.add(wrapper);
        }
        
        System.debug('Fields:'+wrapperList);
        return wrapperList;
    }
    @AuraEnabled(cacheable=true)
    public static String checkprofile(){
        User u = [SELECT id, Profile.Name, Profile.Id FROM User WHERE Id=:Userinfo.getUserId()];
        String profileName = u.Profile.Name;
        System.debug('Profile Name:'+profileName);
        return profileName;
    }
}