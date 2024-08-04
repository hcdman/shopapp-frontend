export class CartDTO {
    user_id: number;
    product_id: number;
    quantity: number;
    constructor(userId: number, productId: number, quantity: number)
    {
        this.user_id = userId;
        this.product_id = productId;
        this.quantity = quantity;
    }

}
