import { LightningElement, api,wire,track } from "lwc";
import getSobjectsmethod from '@salesforce/apex/GetRecentRecords.getSobjectsmethod';
import objectRecords from "@salesforce/apex/GetRecentRecords.objectRecords";
let i=0;
export default class check extends LightningElement {
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
    @track tableData = []

    connectedCallback() {
      //  this.doInit();
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

    
get pagesizeoptions(){        
    return [{value: '2', label: '2'},{value: '4', label: '4'},
            {value: '6', label: '6'},{value: '8', label: '8'},
            {value: '10', label: '10'}]
}

    handlepagesizechange(event) {
        this.pagesize = event.detail.value;        
        console.log('PageSize:'+this.pagesize);
    }

    @wire(objectRecords,{selectedObject: '$selectedsobj',recsize: '$pagesize'})
wiredgetdata(result){
    if (result.data) {
       console.log('Selected Obj:'+this.selectedsobj);  
       console.log('Selected Size:'+this.pagesize); 
       console.log('Data:'+JSON.stringify(result.data.fieldList));  
       console.log('Data:'+JSON.stringify(result.data.sObjectData));  
       
    this.columnslist = result.data.fieldList;
    this.tableData = result.data.sObjectData;
    console.log('Columns final:'+JSON.stringify(this.columnslist)) ;
    console.log('Data final:'+JSON.stringify(this.tableData)) ;
    
    this.ifreceiveddata = true;

   
    } else if (result.error) {
        this.tableData = undefined;
        console.log(result.error);
    }
}
   

    
}