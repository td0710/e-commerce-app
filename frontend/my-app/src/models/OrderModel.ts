class OrderModel {
  orderId: number;
  totalPrice: number;
  quantity: number;
  size: string;
  color: string;
  shippingName: string;
  shippingAddress: string;
  shippingCountry: string;
  shippingEmail: string;
  productName: string;
  productCategory: string;
  productImg: string;
  constructor(
    orderId: number,
    totalPrice: number,
    quantity: number,
    size: string,
    color: string,
    shippingName: string,
    shippingAddress: string,
    shippingCountry: string,
    shippingEmail: string,
    productName: string,
    productCategory: string,
    productImg: string
  ) {
    this.orderId = orderId;
    this.totalPrice = totalPrice;
    this.quantity = quantity;
    this.size = size;
    this.color = color;
    this.shippingName = shippingName;
    this.shippingAddress = shippingAddress;
    this.shippingCountry = shippingCountry;
    this.shippingEmail = shippingEmail;
    this.productName = productName;
    this.productCategory = productCategory;
    this.productImg = productImg;
  }
}

export default OrderModel;
