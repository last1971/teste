import BaseModel from "./BaseModel";

export default class Product extends BaseModel {
    static registerHooks() {
        const models = this.services.db;
        const { Producer } = this.services.db.models;
        this.beforeCreate(async (product) => {
            const producer  = product.producer || await Producer.findByPk(product.producer_id);
            if (!producer) throw new Erorr('Producer required');
            producer.name += '!';
            await producer.save();
            product.search_name = product.name
        });
        return this;
    }
}