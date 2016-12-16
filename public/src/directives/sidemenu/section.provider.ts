import { module } from './module';

function Provider() {
    var _sections = [],
        _theme,
        _palettes;

    this.initWithSections = function (value) {
        _sections = value ? value : [];
    };

    this.initWithTheme = function (value) {
        _theme = value.theme();
        _palettes = value._PALETTES;
    };

    this.$get = [function () {
        var MdSideMenuSections = function () {
            this.sections = _sections;
            this.selectedNode = null;
            this.options = {};
            this.theme = _theme;
            this.palettes = _palettes;
            this.searchStr = "";
        };

        return new MdSideMenuSections();
    }];
}

// export default (module: ng.IModule)=> {
module.provider('mdSideMenuSections', [Provider]);
// };