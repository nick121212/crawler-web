/**
 * Created by NICK on 16/8/17.
 */

export class RegisterController {
    title: string = "用户注册";

    constructor(private $rootScope, private $timeout) {

    }
}

RegisterController.$inject = ["$rootScope", "$timeout"];