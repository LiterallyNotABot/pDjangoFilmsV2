import useCartStore from "@/store/shop/useCartStore";
import { checkoutCart } from "@/services/shop/cart";

export default function CartTab() {
  const { items, removeItem, clearCart } = useCartStore();
  const cartItems = Object.values(items);

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price_cents * item.quantity,
    0
  );

  const handleCheckout = async () => {
    try {
      const payload = cartItems.map(({ product, quantity }) => ({
        product_id: product.id,
        quantity,
      }));

      const data = await checkoutCart(payload);

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert("Failed to initiate checkout.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong during checkout.");
    }
  };

  if (cartItems.length === 0) {
    return <p className="text-center text-gray-400">Your cart is empty.</p>;
  }

  return (
    <div className="space-y-6">
      {cartItems.map(({ product, quantity }) => (
        <div
          key={product.id}
          className="flex items-center justify-between bg-zinc-800 p-4 rounded-xl"
        >
          <div className="flex items-center space-x-4">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-16 h-16 object-contain rounded"
            />
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-400">
                ${product.price_cents / 100} × {quantity}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <p className="text-green-400 font-mono text-sm">
              ${(product.price_cents * quantity / 100).toFixed(2)}
            </p>
            <button
              onClick={() => removeItem(product.id)}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center mt-6 border-t border-zinc-600 pt-4">
        <p className="text-lg font-bold text-white">
          Total: ${(total / 100).toFixed(2)}
        </p>

        <div className="space-x-4">
          <button
            onClick={clearCart}
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-sm rounded"
          >
            Clear Cart
          </button>
          <button
            onClick={handleCheckout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
