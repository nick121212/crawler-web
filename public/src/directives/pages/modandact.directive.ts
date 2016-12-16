import * as _ from 'lodash';
import { module } from './module';

export class Controller {

    selected:Array<any>;
    key:string;

    constructor() {
        this.selected =  this.selected || [];
        this.key = this.key || "key";
    }

    isChecked(item,selected?:Array<any>){
        return _.some(selected || this.selected,(selectItem)=>{
            return item[this.key] == selectItem[this.key];
        });
    }

    isCheckAll(){
        return _.every(this.selected,(item)=>{
            return this.isChecked(item,item.perGroupActions);
        });
    }

    selectAll(){
        _.each(this.selected,(item)=>{
            this.toggle(item,item.perGroupActions);
        });
    }

    toggle(item,selected?:Array<any>){
        let remove = _.remove(selected || this.selected,(selectItem)=>{
            return item[this.key] == selectItem[this.key];
        });

        if(!remove.length){
            item = _.extend({},item);
            delete item.perGroupActions;
            (selected || this.selected).push(item);
        }
    }

}

function Directive(): ng.IDirective {
    return {
        restrict: 'EA',
        scope: false,
        bindToController: {
            "key":"@?",
            "selected":"=modandact"
        },
        controller: Controller,
        controllerAs:'modandactCtl'
    }
}

module.directive("modandact", [Directive]);