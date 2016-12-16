/**
 * Created by NICK on 16/8/12.
 */

class Service {
    public static _name: string = "materialUtils";

    public static provider: Array<string | Function> = ["$timeout", "$state", "$stateParams", "$mdToast", "$mdDialog", "$mdSidenav", ($timeout: angular.ITimeoutService, $state, $stateParams, $mdToast, $mdDialog, $mdSidenav) => {
        class MaterialService {
            /**
             * 阻止默认事件
             * */
            preventDefault($event: MouseEvent) {
                if ($event) {
                    $event.preventDefault();
                }
            }

            /**
             * 阻止冒泡
             * */
            stopPropagation($event: MouseEvent) {
                $event && ($event.cancelBubble = true) && $event.stopPropagation();
            }

            /**
             * 阻止默认事件  +  阻止冒泡
             * */
            stopAll($event: MouseEvent) {
                this.preventDefault($event);
                this.stopPropagation($event);
            }

            /**
             * 关闭弹窗
             * */
            close() {
                $mdDialog && $mdDialog.cancel();
            }

            /**
             * angular的safe执行
             */
            safeApply($scope: angular.IScope, applyFn: any) {
                if (!$scope.$$phase) $scope.$apply(applyFn);
                else applyFn();
            }

            /**
             * 弹出信息
             */
            alert(title: string, content?: string) {
                let alert = $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title(title)
                        .content(content || "操作成功！")
                        .ariaLabel(title)
                        .ok("知道了")
                );

                return alert;
            }

            /**
             * 弹出错误信息
             * msg:提示的信息
             */
            showErrMsg(msg: string) {
                return $mdToast.show($mdToast.simple()
                    .textContent(msg || "error")
                    .position("bottom right")
                    .action("关闭")
                    .capsule(true)
                    .highlightAction(true)
                    .hideDelay(3000));
            }

            /**
             * 弹出提示信息
             * msg:提示的信息
             * */
            showMsg(msg: string) {
                return $mdToast.show($mdToast.simple()
                    .textContent(msg || "success")
                    .position("top right")
                    .action("关闭")
                    .capsule(true)
                    .highlightAction(true)
                    .hideDelay(3000));
            }

            /**
             * 打开菜单
             * */
            openMenu($mdOpenMenu: Function, $event: MouseEvent) {
                $mdOpenMenu($event);
            }

            /**
             * 打开sidenav
             */
            buildToggle(navId: string) {
                return () => {
                    $mdSidenav(navId).toggle()
                        .then(() => {
                            console.log(navId);
                        });
                };
            }
        }

        return new MaterialService();
    }];
}

const module = angular.module("fxMaterialModule", []);

module.service(Service._name, Service.provider);

export default `${module.name}`;