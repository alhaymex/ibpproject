// @ts-nocheck
"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Card from "@/components/Card";
import Image from "next/image";
import { Toaster, toast } from "sonner";

const page: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [addBtnLoadingMap, setAddBtnLoadingMap] = useState<{
    [key: string]: boolean;
  }>({});
  const [removeBtnLoadingMap, setRemoveBtnLoadingMap] = useState<{
    [key: string]: boolean;
  }>({});
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const addToCart = async (productId: string) => {
    setAddBtnLoadingMap((prevLoadingMap) => ({
      ...prevLoadingMap,
      [productId]: true,
    }));
    await axios
      .post(
        "http://localhost:8080/products/addtocart",
        { productId, quantity: 1 },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.status == true) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      })
      .finally(() => {
        setAddBtnLoadingMap((prevLoadingMap) => ({
          ...prevLoadingMap,
          [productId]: false,
        }));
      });
  };

  const removeFromCart = async (productId: string) => {
    setRemoveBtnLoadingMap((prevLoadingMap) => ({
      ...prevLoadingMap,
      [productId]: true,
    }));
    await axios
      .post(
        "http://localhost:8080/products/removefromcart",
        { productId, quantity: 1 },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.status == true) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      })
      .finally(() => {
        setRemoveBtnLoadingMap((prevLoadingMap) => ({
          ...prevLoadingMap,
          [productId]: false,
        }));
      });
  };

  useEffect(() => {
    const getCart = async () => {
      await axios
        .get("http://localhost:8080/products/getcart", {
          withCredentials: true,
        })
        .then((res) => {
          setProducts(res.data.cart);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching cart:", error);
        });
    };

    getCart();
  }, [addToCart, removeFromCart]);

  useEffect(() => {
    let sum = 0;
    products.forEach((product: any) => {
      sum += product.product.price * product.quantity;
    });
    setTotalPrice(sum);
  }, [products]);

  const trimDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  return (
    <div>
      <Toaster />

      <h1 className="text-3xl text-center">Your Cart </h1>

      {loading && (
        <div className="flex justify-center">
          <span className="loading loading-infinity loading-lg text-3xl text-warning"></span>
        </div>
      )}
      <div className="flex flex-col p-6 space-y-3">
        {products.map((product: any) => (
          <div className="card md:card-side bg-base-100 shadow-xl">
            <figure>
              <Image
                src={product.product.image}
                alt={product.title}
                width={200}
                height={200}
                className="rounded-lg"
                onClick={() =>
                  document.getElementById("my_modal_2")!.showModal()
                }
              />
            </figure>
            <div className="card-body">
              <h2
                onClick={() =>
                  document.getElementById("my_modal_2")!.showModal()
                }
                className="card-title cursor-pointer hover:underline"
              >
                {product.product.name}
              </h2>
              <p>{trimDescription(product.product.description, 100)}</p>
              <p>
                ₺{(product.product.price * product.quantity).toFixed(2)}
              </p>{" "}
              <p>Quantity: {product.quantity}</p>
              <div className="card-actions justify-end">
                <button
                  onClick={() => removeFromCart(product.product._id)}
                  className="btn bg-red-500 btn-error text-white"
                >
                  {removeBtnLoadingMap[product.product._id] ? (
                    <span className="loading loading-spinner loading-md"></span>
                  ) : (
                    "Remove"
                  )}
                </button>
                <button
                  onClick={() => addToCart(product.product._id)}
                  className="btn btn-warning text-white"
                >
                  {addBtnLoadingMap[product.product._id] ? (
                    <span className="loading loading-spinner loading-md"></span>
                  ) : (
                    "Add to Cart"
                  )}
                </button>
              </div>
            </div>

            <dialog id="my_modal_2" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">{product.product.name}</h3>
                <div className="flex justify-center p-3">
                  <Image
                    src={product.product.image}
                    alt={product.title}
                    width={400}
                    height={400}
                    className="rounded-lg"
                  />
                </div>
                <p className="py-4">{product.product.description}</p>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </div>
        ))}
      </div>
      {products.length > 0 &&
        !loading && ( // Render the total price div only if there are products and loading is false
          <div className="flex justify-between bg-base-100 p-3 shadow-lg">
            <h1 className="text-3xl">Total Price: ₺{totalPrice.toFixed(2)}</h1>
            <button className="btn btn-success text-white">Checkout</button>
          </div>
        )}
    </div>
  );
};

export default page;
