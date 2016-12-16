import { module } from '../module';
import * as _ from "lodash";
import { IActionModel, IColumn } from "../models/action.model";

class Service {
    public static _builderName: string = "actionUtils";

    /**
     * 构建服务
     * @type {()=>Service<T>[]}
     */
    public static builder: Array<string | Function> = [() => {

        class Base<T> {
            constructor(protected data?: T) {

            }

            columnUnitBuilder(unit: string, numeric: boolean | string = false) {
                this.data = _.extend({}, this.data, {
                    unit: unit,
                    numeric: numeric
                });

                return this;
            }

            toValue(): T {
                return this.data;
            }
        }

        class Service<T> extends Base<T> {
            constructor(protected data?: T) {
                super(data);
            }

            /**
             * 按钮配置生成方法
             * @param title        按钮title
             * @param cls          按钮className
             * @param showTitle
             * @returns {Service}
             */
            columnBuilder(content: string, title: string, name?: string, sort?: string, unit?: string): Object {
                return new Service<IColumn>({
                    content: content,
                    title: title,
                    name: name,
                    sort: sort,
                    unit: unit
                });
            }
        }

        return new Service();
    }];
}

module.service(Service._builderName, Service.builder);