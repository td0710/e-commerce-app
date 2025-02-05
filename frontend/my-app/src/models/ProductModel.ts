import ProductVariantModel from "./ProductVariantModel";

class ProductModel {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
  variants: ProductVariantModel[];

  constructor(
    id: number,
    title: string,
    description: string,
    category: string,
    price: number,
    image: string,
    variants: ProductVariantModel[] = []
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.price = price;
    this.image = image;
    this.variants = variants;
  }
}

export default ProductModel;
