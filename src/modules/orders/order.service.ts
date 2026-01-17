import { prisma } from "../../config/db";

type AddressSnapshot = {
  line1: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

export const checkout = async (userId: string, address: AddressSnapshot) => {
  // 1) Read cart (outside tx is OK, but we will validate again inside tx)
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  return prisma.$transaction(async (tx) => {
    // 2) Re-fetch cart inside transaction (safer)
    const items = await tx.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    if (items.length === 0) throw new Error("Cart is empty");

    // 3) Validate & decrement inventory (atomic)
    for (const item of items) {
      const inv = await tx.inventory.findUnique({
        where: { productId: item.productId },
      });

      if (!inv)
        throw new Error(`Inventory missing for product ${item.productId}`);
      if (inv.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for ${item.product.name}`);
      }

      await tx.inventory.update({
        where: { productId: item.productId },
        data: {
          stockQuantity: { decrement: item.quantity },
        },
      });
    }

    // 4) Compute total + create order (immutable snapshot)
    const totalAmount = items.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    );

    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,
        addressSnapshot: address,
        status: "PENDING",
      },
    });

    // 5) Create order items snapshots
    await tx.orderItem.createMany({
      data: items.map((i) => ({
        orderId: order.id,
        productId: i.productId,
        productNameSnapshot: i.product.name,
        priceSnapshot: i.product.price,
        quantity: i.quantity,
      })),
    });

    // 6) Clear cart
    await tx.cartItem.deleteMany({ where: { userId } });

    // Return order with items
    return tx.order.findUnique({
      where: { id: order.id },
      include: { items: true },
    });
  });
};
