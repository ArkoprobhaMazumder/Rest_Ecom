
export default class ProductModel {

    constructor(name, description, price, image, category, sizes, id) {
        this._id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
        this.category = category;
        this.sizes = sizes;
    }
}
