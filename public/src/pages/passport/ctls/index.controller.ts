/**
 * Created by NICK on 16/8/17.
 */


export class IndexController {
    static $inject = ["$scope", "$mdMedia"];

    screenIsSmall: boolean;

    constructor(private $scope, private $mdMedia) {
        $scope.$watch(()=> {
            return $mdMedia('xs');
        }, (small)=> {
            this.screenIsSmall = small;
        });
    }
}