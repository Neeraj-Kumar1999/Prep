import { LightningElement, api,wire,track } from "lwc";
import getSobjectsmethod from '@salesforce/apex/GetRecentRecords.getSobjectsmethod';
import objectRecords from "@salesforce/apex/GetRecentRecords.objectRecords";
import checkprofile from "@salesforce/apex/GetRecentRecords.checkprofile";
import selectfields from "@salesforce/apex/GetRecentRecords.selectfields";
import { NavigationMixin } from 'lightning/navigation';
import USER_ID from '@salesforce/user/Id'; 

let i=0;
export default class check extends NavigationMixin(LightningElement) {
@track displayList;
@track allObjectList = [];
@track sobname = [];
@track selectedsobj;
@track value = '';
@track recdata = [];
@track pagesize = '';
@track error;
@track isselectedSob = false;
@track isselectedpagesize = false;
@track ifreceiveddata = false;
@track columnslist = [];
@track tableData = [];
@track columnslistfinal = [];
@track draftValues = [];
@track selectedRec;
@track isLoading;
@track userId = USER_ID;
@track inpfields = [];
@track isadmin = false;
@track showaddfields = false;
@track showbutton = false;
@track fieldcolumslist =[];
@track passfields = '';
isinpblank = false;

connectedCallback() {
checkprofile()
.then(result => {
console.log('Result:'+result);
if(result == true){
this.isadmin = result;
}
console.log('Is Admin:'+this.isadmin);
})
.catch(error => {
this.error = error;
console.log('Error is ' + this.error);
});    
}



showaddbutton(){
console.log('inside add fields');
this.showaddfields = true;
this.ifreceiveddata = false;
selectfields({selectedObject: this.selectedsobj})
.then(result => {
console.log('Result:'+JSON.stringify(result));
this.fieldcolumslist = result;
var tempsoblist = []; 
for (var i = 0; i < this.fieldcolumslist.length; i++) {     
let templist = Object.assign({}, this.fieldcolumslist[i]); //cloning object      
tempsoblist.push(templist);  
}   

tempsoblist.push({
type:"button",
fixedWidth: 150,
typeAttributes: {
    label: 'Edit',
    name: 'edit',
    variant: 'brand'
}
});   
console.log('Columns::'+JSON.stringify(this.fieldcolumslist));
console.log('Default::'+JSON.stringify(this.defaultvalues));
this.isadmin = false;

this.columnslistfinal = tempsoblist;
})
.catch(error => {         
    this.error = error;
    console.log('Error is ' + this.error);
});
}
@wire (getSobjectsmethod, {}) 
wiredgetgetSobjectsmethod({data,error}){
if (data) {                  
for(i=0; i<data.length; i++)  {                
    this.sobname.push({
        label: data[i],                    
        value: data[i]
    });                                  
}                
this.displayList =  true;          
} else if (error) {
this.error = error;                    
}
}

get options(){        
return this.sobname;
}

handleChange(event){        
this.value = event.detail.value; 
console.log(this.value);
this.isselectedSob = true; 
this.selectedsobj = this.value;    
}

handlepagesizechange(event) {
this.pagesize = event.detail.value;        
console.log('PageSize:'+this.pagesize);
this.isLoading = true;
}

@wire(objectRecords,{selectedObject: '$selectedsobj',recsize: '$pagesize',fieldsselected: '$passfields'})
wiredgetdata(result){
if (result.data) {

this.isLoading = false;

this.columnslist = result.data.fieldList;   
console.log('Columns:'+JSON.stringify(this.columnslist));
var tempsoblist = []; 
for (var i = 0; i < this.columnslist.length; i++) {     
let templist = Object.assign({}, this.columnslist[i]);   
tempsoblist.push(templist);  
}   

tempsoblist.push({
type:"button",
fixedWidth: 150,
typeAttributes: {
    label: 'Edit',
    name: 'edit',
    variant: 'brand'
}
});    



this.columnslistfinal = tempsoblist;  
this.tableData = result.data.sObjectData;
this.ifreceiveddata = true;


} else if (result.error) {
this.tableData = undefined;    
}
}

navigateToEditRecordPage(event){
console.log('inside edit');
this.selectedRec = event.detail?.row?.Id;
console.log('Selected Rec:'+this.selectedRec);

this[NavigationMixin.Navigate]({
type:'standard__recordPage',
attributes:{
recordId: this.selectedRec,
objectApiName:this.selectedsobj,    
actionName: 'edit'
    }
});
}


handlechangefields(event){
console.log('inside fields change');
this.inpfields = event.detail.value;
console.log('Selected fields:'+this.inpfields);
}

saveChanges(){
if(this.inpfields.length>0){
this.isinpblank = false;    
for(i=0;i<this.inpfields.length;i++){
if(this.passfields!= null){
this.passfields = this.passfields+','+this.inpfields[i];
} else this.passfields = this.inpfields[i];
}
console.log('Final String:'+this.passfields);
this.showbutton = false;
this.showaddfields = false;
this.ifreceiveddata = true;
}
else {this.passfields = ',Name,CreatedById,CreatedDate';
this.showbutton = false;
this.showaddfields = false;
this.ifreceiveddata = true;
}
}
}