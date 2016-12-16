import { module } from './module';
import * as _ from "lodash";
import 'restangular';

class Service {
    public static _name: string = "toolbarUtils";

    public static provider: Array<string | Function> = [() => {

        class Base {
            constructor(public data?: any) {

            }

            conditionBuilder(condition: string, prefix: boolean = true) {
                this.data = _.extend({}, this.data, {
                    conditionInfo: {
                        condition: condition,
                        prefix: prefix
                    }
                });

                return this;
            }

            noOptions(tooltip: boolean = false, icon: boolean = false) {
                tooltip && delete this.data.tooltip;
                icon && delete this.data.icon;

                return this;
            }

            tooltipBuilder(title: string = "", position: string = "bottom") {
                this.data = _.extend({}, this.data, {
                    tooltip: {
                        title: title,
                        position: position
                    }
                });

                return this;
            }

            iconBuilder(icon: string, style?: [{ (id: string): any }], ricon?: string, options?: [{ (id: string): any }]) {
                this.data = _.extend({}, this.data, {
                    icon: {
                        icon: icon,
                        ricon: ricon,
                        style: style
                    }
                });

                return this;
            }

            attrBuilder(attributes: [{ (id: string): any }]) {
                this.data = _.extend({}, this.data, {
                    attributes: attributes
                });

                return this;
            }

            toolsBuilder(tools: Array<Object>) {
                this.data = _.extend({}, this.data, {
                    tools: tools || []
                });

                return this;
            }

            btnClick(func: Function) {
                if (func && _.isFunction(func)) {
                    this.data = _.extend({}, this.data, {
                        onClick: func
                    });
                }

                return this;
            }

            menuOptionsBuilder(width: number = 4, items: Array<any> = []) {
                this.data = _.extend({}, this.data, {
                    width: width || 4,
                    items: items || []
                });

                return this;
            }

            toValue(): any {
                return this.data;
            }
        }

        class Service extends Base {
            constructor(public data?: any) {
                super(data);
            }

            /**
             * 按钮配置生成方法
             * @param title        按钮title
             * @param cls          按钮className
             * @param showTitle
             * @returns {Service}
             */
            btnBuilder(title: string, className: string, showTitle: boolean = true, tooltipPosition: string = "bottom"): Service {
                const service = new Service({
                    type: "btn",
                    title: title,
                    className: className,
                    showTitle: showTitle
                });

                service.tooltipBuilder(title, tooltipPosition);

                return service;
            }

            menuBuilder(title: string, className: string, showTitle: boolean = true, tooltipPosition: string = "bottom"): Service {
                const service = this.btnBuilder(title, className, showTitle, tooltipPosition);

                service.data.type = "menu";

                return service;
            }

            menuItemBuilder(title: string, className: string, showTitle: boolean = true, tooltipPosition: string = "bottom"): Service {
                const service = this.btnBuilder(title, className, showTitle, tooltipPosition);

                service.data.type = "menuItem";

                return service;
            }

            /**
             * label配置生成方法
             * @param title
             * @returns {Service}
             */
            labelBuilder(title: string): Service {
                return new Service({
                    type: "label",
                    title: title
                });
            }

            layoutBuilder(flex: string = "none", layout: string = "none", layoutAlign: string = "none none"): Service {
                return new Service({
                    type: "layout",
                    flex: flex,
                    layout: layout,
                    layoutAlign: layoutAlign
                });
            }

            noneBuilder(type: string) {
                return new Service({
                    type: type
                });
            }
        }

        return new Service();
    }];
}

module.service(Service._name, Service.provider);