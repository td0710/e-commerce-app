class ProductCartModel {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
  constructor(
    id: number,
    title: string,
    description: string,
    category: string,
    price: number,
    image: string,
    color: string,
    size: string,
    quantity: number
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.price = price;
    this.image = image;
    this.color = color;
    this.size = size;
    this.quantity = quantity;
  }
}

export default ProductCartModel;
