import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import OurProductsTab from "@/features/shop/tabs/OurProductsTab";
import CartTab from "@/features/shop/tabs/CartTab";
import OrdersTab from "@/features/shop/tabs/OrderTab";

const TABS = {
  products: "Our Products",
  cart: "Cart",
  orders: "Orders",
};

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentTab = searchParams.get("tab") || "products";
  const [activeTab, setActiveTab] = useState(currentTab);

  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-4">
      <h1 className="text-3xl font-bold text-center text-green-500 mb-6">
        Django Films Shop
      </h1>

      <div className="flex justify-center space-x-6 border-b border-gray-700 mb-8">
        {Object.entries(TABS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`pb-2 text-lg font-medium ${
              activeTab === key
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        {activeTab === "products" && <OurProductsTab />}
        {activeTab === "cart" && <CartTab />}
        {activeTab === "orders" && <OrdersTab />}
      </div>
    </div>
  );
}
