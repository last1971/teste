import { DataTypes } from 'sequelize';
import ProducerModel from "./ProducerModel";
import ProductModel from "./ProductModel";

export default {
    User: {
        options: {
            tableName: 'users'
        },
        attributes: {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            name: {
                type: DataTypes.STRING,
                notEmpty: true,
            },
            email: {
                type: DataTypes.STRING,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            options: {
                type: DataTypes.JSON,
            },
            avatar: {
                type: DataTypes.STRING,
            },
            skills: {
                type: DataTypes.JSON,
                defaultValue: {"interface": 0, "sales": 0, "computer": 0},
            }
        }
    },
    Producer: {
        class: ProducerModel,
        options: {
            tableName: 'producers',
            scopes: {
                rightProducer: {
                    include: [ { model: ProducerModel, as: 'rightProducer' } ]
                }
            }
        },
        attributes: {
            name: { type: DataTypes.STRING, unique: true },
            site: DataTypes.STRING,
            right_producer_id: { type:DataTypes.INTEGER },
            picture: DataTypes.STRING
        },
        relations: {
            belongsTo: {
                Producer: {
                    foreignKey: 'right_producer_id',
                    sourceKey: 'id',
                    constraints: false,
                    as: 'rightProducer'
                }
            }
        }
    },
    Product: {
        class: ProductModel,
        options: {
            tableName: 'products',
            defaultScope: {
                where: { producer_id: 6 }
            }
        },
        attributes: {
            name: { type: DataTypes.STRING, unique: 'product_name_producer_id' },
            search_name: DataTypes.STRING,
            vat: { type: DataTypes.DECIMAL, defaultValue: 20.00 },
            category_id: { type: DataTypes.INTEGER },
            producer_id: { type: DataTypes.INTEGER, unique: 'product_name_producer_id' },
            remark: DataTypes.TEXT,
            picture: DataTypes.STRING,
            right_product_id: { type: DataTypes.INTEGER },
        },
        relations: {
            belongsTo: {
                Producer: {
                    foreignKey: 'producer_id',
                    as: 'producer'
                }
            }
        }
    }
}