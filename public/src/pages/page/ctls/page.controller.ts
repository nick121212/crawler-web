/**
 * Created by NICK on 16/8/10.
 */

export class PageController {
    static $inject = ["$stateParams"];

    key: string;

    constructor(private $stateParams: ng.ui.IStateParamsService) {
        this.key = $stateParams["key"];
    }
}