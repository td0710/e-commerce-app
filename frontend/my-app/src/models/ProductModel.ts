class ProductModel {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;

  constructor(
    id: number,
    title: string,
    description: string,
    category: string,
    price: number,
    image: string
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.price = price;
    this.image = image;
  }
}

export default ProductModel;
