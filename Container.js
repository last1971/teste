
const proxy = {
    get (instance, property) {
        if (instance.$services.has(property)) {
            return instance.get(property);
        }

        return instance[property];
    },
};

export default class Container {
    constructor (namespace) {
        this.$services = new Map();
        this.$singletons = new Map();
        this.$ns = namespace;

        return new Proxy(this, proxy);
    }

    register (name, definition, dependencies, options) {
        options = Object.assign({
            singleton: true,
            scoped: false,
        }, options);

        this.$services.set(name, {
            definition,
            dependencies,
            ...options,
        });
    }

    get (name) {
        const service = this.$services.get(name);

        if (!service) {
            throw new Error(`Service ${name} has not been registered`);
        }

        if (typeof service.definition === 'function') {
            if (service.singleton) {
                let instance;

                if (service.scoped && this.$ns.active) {
                    instance = this.$ns.get(name);

                    if (!instance) {
                        instance = this.factory(service);
                        this.$ns.set(name, instance);
                    }
                } else {
                    instance = this.$singletons.get(name);

                    if (!instance) {
                        instance = this.factory(service);
                        this.$singletons.set(name, instance);
                    }
                }

                return instance;
            }

            return this.factory(service);
        }

        return service.definition;
    }

    resolveDeps (service) {
        let deps = [];

        if (service.dependencies) {
            deps = service.dependencies.map((dep) => {
                return this.get(dep);
            });
        }

        return deps;
    }

    factory (service) {
        const Constructor = service.definition;

        if (typeof Constructor.prototype !== 'undefined' && Constructor.prototype.constructor) {
            return new Constructor(...this.resolveDeps(service));
        }

        return Constructor(...this.resolveDeps(service));
    }

    reset () {
        this.$singletons = new Map();
    }
}

