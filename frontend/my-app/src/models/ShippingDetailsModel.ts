export class ShippingDetailsModel {
  id: number;
  userId: number;
  country: string;
  name: string;
  contactNumber: string;
  email: string;
  homeAddress: string;

  constructor(
    id: number,
    userId: number,
    country: string,
    name: string,
    contactNumber: string,
    email: string,
    homeAddress: string
  ) {
    this.id = id;
    this.userId = userId;
    this.country = country;
    this.name = name;
    this.contactNumber = contactNumber;
    this.email = email;
    this.homeAddress = homeAddress;
  }
}
