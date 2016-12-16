/**
 * Created by NICK on 16/8/10.
 */

import * as _ from 'lodash';

export class AllInController {
    static $inject = ["$stateParams", "fxAction", "toolbarUtils", "materialUtils"];
    private key: string;

    constructor(private $stateParams: ng.ui.IStateParamsService, private fxAction, private toolbarUtils, private materialUtils) {
       
    }
}