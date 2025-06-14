import { useEffect, useState } from "react";
import { getProducts } from "@/services/shop/products";
import useCartStore from "@/store/shop/useCartStore";
import useToast from "@/hooks/useToast";
import Toast from "@/components/ui/Toast";

export default function OurProductsTab() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const addItem = useCartStore((state) => state.addItem);
  const { message, showToast } = useToast();

  useEffect(() => {
    getProducts()
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Products response is not an array");
        }

        setProducts(data);

        const initialQuantities = {};
        data.forEach((product) => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
      })
      .catch((err) => console.error("Error loading products:", err));
  }, []);

  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, parseInt(value) || 1),
    }));
  };

  const handleAddToCart = (productId) => {
    const quantity = quantities[productId];
    const product = products.find((p) => p.id === productId);
    if (product) {
      addItem(product, quantity);
      showToast(`Added ${product.name} ×${quantity} to cart`);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {(products || []).map((product) => (
          <div
            key={product.id}
            className="bg-zinc-900 rounded-2xl shadow-md p-4 flex flex-col items-center transition hover:shadow-lg hover:bg-zinc-800"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-32 h-32 object-contain mb-3 rounded-lg border border-zinc-700"
            />
            <h3 className="text-base font-medium text-center mb-1">
              {product.name}
            </h3>
            <p className="text-green-400 font-mono text-sm mb-3">
              ${(product.price_cents / 100).toFixed(2)}
            </p>

            <div className="flex items-center mb-3 space-x-2">
              <label htmlFor={`qty-${product.id}`} className="text-sm">
                Qty:
              </label>
              <input
                id={`qty-${product.id}`}
                type="number"
                min={1}
                value={quantities[product.id] || 1}
                onChange={(e) =>
                  handleQuantityChange(product.id, e.target.value)
                }
                className="w-14 bg-zinc-800 text-white rounded-md px-2 py-1 text-center border border-zinc-600 text-sm"
              />
            </div>

            <button
              onClick={() => handleAddToCart(product.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full text-sm transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <Toast message={message} />
    </>
  );
}
