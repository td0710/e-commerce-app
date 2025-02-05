class ProductVariantModel {
  id: number;
  productId: number;
  color: string;
  size: string;
  stock: number;

  constructor(
    id: number,
    productId: number,
    color: string,
    size: string,
    stock: number
  ) {
    this.id = id;
    this.productId = productId;
    this.color = color;
    this.size = size;
    this.stock = stock;
  }
}

export default ProductVariantModel;
