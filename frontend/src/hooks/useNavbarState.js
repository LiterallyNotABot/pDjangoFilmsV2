import { useState } from "react";

export default function useNavbarState() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return {
    menuOpen,
    setMenuOpen,
    searchOpen,
    setSearchOpen,
  };
}