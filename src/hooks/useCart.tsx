import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const { data: stockData } = await api.get(`/stock/${productId}`);

      if (stockData.amount === 0) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      const productIndex = cart.findIndex(product => product.id === productId);
      let updatedCart: Product[];

      if (productIndex === -1) {
        const { data: productData } = await api.get(`/products/${productId}`);
        const product = { ...productData, amount: 1 };
        updatedCart = [...cart, product];
      } else {
        if (stockData.amount < cart[productIndex].amount + 1) {
          toast.error("Quantidade solicitada fora de estoque");
          return;
        }

        updatedCart = [...cart];
        updatedCart[productIndex] = {
          ...updatedCart[productIndex],
          amount: updatedCart[productIndex].amount + 1,
        };
      }

      setCart(updatedCart);
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(updatedCart));
    } catch (error) {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
