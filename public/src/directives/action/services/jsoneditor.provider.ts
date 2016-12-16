import { module } from '../module';

function Provider() {
    function Builder(args) {
        const options = {
            modes: ['tree', 'code', 'text'],
            mode: 'code',
            name: args.form.key.join('')
        };

        args.form.preferText = !!args.form.preferText;
        args.form.jsonOptions = _.extend(args.form.jsonOptions || {}, options);
    }

    this.builder = Builder;
    this.$get = [function () {
        return {};
    }];
}

module.provider('jsonEditorBuilder', [Provider]);