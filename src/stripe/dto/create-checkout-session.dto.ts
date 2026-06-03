export class CreateCheckoutSessionDto {
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  shipping: {
    fullName: string;
    address: string;
    city: string;
    phone: string;
  };
  paymentMethod: string;
  total: number;
}
