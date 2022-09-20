import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
export default class DualListSelectionLimit extends LightningElement {
    options = [];
    values = [];
    defaultValues= [];
    connectedCallback() {
        const items = [];
        for (let i = 1; i <= 15; i++) {
            items.push({
                label: `Option ${i}`,
                value: `opt${i}`,
            });
        }
        this.options.push(...items);
        this.defaultValues=['opt2', 'opt4', 'opt6'];
        console.log('Options:'+JSON.stringify(this.options));
    }

    handleChange(event)
    {
        var selectedRows=event.detail.value;
        if(this.defaultValues!=undefined && this.defaultValues!=null && this.defaultValues.length>0)
        {
                var items=this.defaultValues.filter(value => selectedRows.includes(value));
                if(this.defaultValues.length!==items.length)
                {
                    this.showMessage('Notification','Existing selected value(s) can not be removed','error');
                    this.defaultValues=[...this.defaultValues];
                    event.preventDefault();
                    return;
                }
        }
        
    }
    showMessage( t, m,type ){
        const toastEvt = new ShowToastEvent({
            title: t,
            message:m,
            variant: type
        });
        this.dispatchEvent(toastEvt);
    };
}