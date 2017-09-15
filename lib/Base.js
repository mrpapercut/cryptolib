function F() {}

class Base {
    constructor() {}

    extend(overrides) {
        F.prototype = this;
        var subtype = new F();
        if (overrides) subtype.mixIn(overrides);
        if (!subtype.hasOwnProperty("init")) {
            subtype.init = function() {
                subtype.$super.init.apply(this, arguments);
            };
        }
        subtype.init.prototype = subtype;
        subtype.$super = this;
        return subtype;
    }

    create() {
        var instance = this.extend();
        instance.init.apply(instance, arguments);
        return instance;
    }

    init() {}

    mixIn(properties) {
        for (var propertyName in properties) {
            if (properties.hasOwnProperty(propertyName)) {
                this[propertyName] = properties[propertyName];
            }
        }

        if (properties.hasOwnProperty("toString")) {
            this.toString = properties.toString;
        }
    }

    clone() {
        return this.extend().init.prototype.extend(this);
    }
}

export default Base;
