import { useEffect, useState } from "react";
import useUserStore from "@/store/user/userStore";
import { getUserOrders } from "@/services/shop/orders";

export default function OrdersTab() {
  const { token } = useUserStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    getUserOrders()
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Invalid response");
        setOrders(data);
      })
      .catch((err) => console.error("Failed to load orders:", err))
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) {
    return (
      <p className="text-center text-gray-400">
        You must be logged in to view your orders.
      </p>
    );
  }

  if (loading) {
    return <p className="text-center text-gray-400">Loading your orders...</p>;
  }

  if (!orders.length) {
    return (
      <p className="text-center text-gray-400">
        You haven't placed any orders yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-zinc-900 p-4 rounded-xl border border-zinc-700"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Order #{order.id}</h3>
            <p className="text-sm text-gray-400">
              {order.created_at
                ? new Date(order.created_at).toLocaleDateString()
                : "Unknown date"}
            </p>
          </div>
          <div className="space-y-2 pl-2">
            {(order.items || []).map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>
                  {item.product_name} × {item.quantity}
                </span>
                <span>
                  ${(item.price_cents * item.quantity / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-right text-green-400 font-mono text-sm">
            Total: ${(order.total_cents / 100).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
