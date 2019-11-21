import BaseModel from "./BaseModel";

export default class Producer extends BaseModel {
    static async getFirst() {
        return this.findByPk(1);
    }

    getPlain() {
        return this.get({ plain: true });
    }


}