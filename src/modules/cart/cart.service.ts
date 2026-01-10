import { prisma } from "../../config/db";

/**
 * Check stock availability
 */
const checkStock = async (productId: string, quantity: number) => {
  const inventory = await prisma.inventory.findUnique({
    where: { productId },
  });

  if (!inventory || inventory.stockQuantity < quantity) {
    throw new Error("Insufficient stock");
  }
};

/**
 * Add or update cart item
 */
export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  await checkStock(productId, quantity);

  return prisma.cartItem.upsert({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    update: {
      quantity: {
        increment: quantity,
      },
    },
    create: {
      userId,
      productId,
      quantity,
    },
  });
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (cartItemId: string, quantity: number) => {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than zero");
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  await checkStock(cartItem.productId, quantity);

  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });
};

/**
 * Remove cart item
 */
export const removeCartItem = async (cartItemId: string) => {
  return prisma.cartItem.delete({
    where: { id: cartItemId },
  });
};

/**
 * Get user's cart
 */
export const getUserCart = async (userId: string) => {
  return prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          inventory: true,
        },
      },
    },
  });
};
