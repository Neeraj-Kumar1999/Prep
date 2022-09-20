({
	doInit : function(component, event, helper) {        
       
        var action = component.get("c.objectNames");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {           
                var allValues = response.getReturnValue();
                component.set("v.pickl", allValues);                
            }        	         
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } 
                else {
                    console.log("Unknown Error");
                }
            }
        });
        $A.enqueueAction(action);
	},
    
    
    doSearch : function(component, event, helper) {
        
        const username = component.get('v.CurrentUser')['Profile'].Name;
        console.log('User Profile:'+username);
        if(username === 'System Administrator'){
            var y = "True";
            component.set('v.issysadm',y);
            console.log('in adm');
        }
        console.log('Is Admin?'+component.get('v.issysadm'));
        var pickselected = component.find("selectid").get("v.value");        
        console.log('pickselected--->' + pickselected);
		component.set('v.selectedValue', pickselected);
        var selected = component.get('v.selectedValue');
        var pagesize = component.get('v.RecSize');
        console.log('Selected--->' + selected);
        console.log('Size--->' + pagesize);
        var action = component.get("c.objectRecords");
        action.setParams({selectedObject : selected,recsize :pagesize});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {  
                //component.find('sfdcDiv').set("v.body",[]);
                var allValues = response.getReturnValue();
            	console.log('allValues--->' + allValues);
                var objectValue = allValues.sObjectData;
                console.log('objectValue--->' + objectValue);
                var fieldList = allValues.fieldList;
                console.log('fieldList--->' + fieldList);
                
                /* Create Dynamic Table */
                var sObjectDataTableHeader = [];
                // Create table Header
                for (var i=0; i<fieldList.length; i++) {
                	sObjectDataTableHeader.push(fieldList[i].label);
                }
                console.log('sObjectDataTableHeader--->>' + sObjectDataTableHeader);
                //Get the count of columns.
                var columnCount = sObjectDataTableHeader.length;
                //Create a HTML Table element.
                var table = document.createElement("TABLE");
                //table.border='2';
                //Add the header row.
                var row = table.insertRow(-1);
                for (var i=0; i<columnCount; i++) {
                	var headerCell = document.createElement("TH");
                    //headerCell.width='75';
                    headerCell.innerHTML = sObjectDataTableHeader[i];
                    headerCell.className='headerClass';
                    row.appendChild(headerCell);
                }
                var dvTable = document.getElementById("sfdctable");
                dvTable.innerHTML = "";
                dvTable.appendChild(table);
                
                /* Create Dynamic Table End */    
                if(objectValue.length){
                	for(var j=0; j<objectValue.length; j++){
                    	// Dynamic table Row
                        row = table.insertRow(-1);
                        // Dynamic Table Row End
                        for (var i=0; i<fieldList.length; i++) {
                        	// Dynamic table Row
                            var cell = row.insertCell(-1);
                            cell.innerHTML = objectValue[j][fieldList[i].apiName]; 
                        }
                    }
                }
            }        	         
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } 
                else {
                    console.log("Unknown Error");
                }
            }
        });
        $A.enqueueAction(action);
    }
})