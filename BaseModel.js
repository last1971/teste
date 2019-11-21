import Sequelize from 'sequelize';
import _ from 'lodash';

export default class BaseModel extends Sequelize.Model {
    static init (definition, services) {
        const sequelize = services.db.connection;
        //const ret = sequelize.define(definition.name, definition.attributes, definition.options);

                this.$relations = definition.relations || {};

                this.services = services;
                this.prototype.services = services;

                return  super.init(definition.attributes, {
                    ...definition.options,
                    sequelize,
                });

    }

    static associate () {
        const toRelName = (string) => {
            const name = _.kebabCase(string);

            return name.charAt(0).toUpperCase() + name.slice(1);
        };

        if (typeof this.$relations !== 'object' || this.$relations === null) {
            return;
        }

        Object.keys(this.$relations).forEach((relationshipType) => {
            const relationshipDefinitions = this.$relations[relationshipType];

            Object.keys(relationshipDefinitions).forEach((relationshipTarget) => {
                let relationshipTargetDefinitions = relationshipDefinitions[relationshipTarget];

                if (!Array.isArray(relationshipTargetDefinitions)) {
                    relationshipTargetDefinitions = [relationshipTargetDefinitions];
                }

                relationshipTargetDefinitions.forEach((relationshipDefinition) => {
                    const relationshipName = toRelName(relationshipDefinition.as || relationshipTarget);
                    const targetModel = this.sequelize.models[relationshipTarget];

                    this[relationshipName] = this[relationshipType](targetModel, relationshipDefinition);
                });
            });
        });
    }

    static registerHooks () {
        return this;
    }
}
