import { module } from './module';
import * as io from 'socket.io-client';

module.factory("sockets", ["socketFactory", "$rootScope", (socketFactory, $rootScope) => {
    class Sockets {
        events: any;

        constructor() {
            $rootScope.$watch($rootScope.config, () => {
                if ($rootScope.config && $rootScope.config.events) {
                    this.init();
                }
            });
        }

        init() {
            this.events = socketFactory({
                ioSocket: io($rootScope.config.events)
            });
            this.events.forward("error");
            this.events.forward("events");
            this.events.forward("connect");
            this.events.forward("disconnect");
        }
    }

    return {
        events: new Sockets()
    };
}]);