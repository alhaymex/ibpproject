// @ts-nocheck
"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Card from "@/components/Card";
import Image from "next/image";
import { Toaster, toast } from "sonner";

const page: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [addBtnLoading, setAddBtnLoading] = useState(false);
  const [removeBtnLoading, setRemoveBtnLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const addToCart = async (productId: string) => {
    setAddBtnLoading(true);
    await axios
      .post(
        "http://localhost:8080/products/addtocart",
        { productId, quantity: 1 },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.status == true) {
          toast.success(res.data.message);
          setAddBtnLoading(false);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  const removeFromCart = async (productId: string) => {
    setRemoveBtnLoading(true);
    await axios
      .post(
        "http://localhost:8080/products/removefromcart",
        { productId, quantity: 1 },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.status == true) {
          toast.success(res.data.message);
          setRemoveBtnLoading(false);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
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

  const trimDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  return (
    <div>
      <Toaster />

      <h1 className="text-3xl text-center">Your Cart</h1>
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
                  {removeBtnLoading ? (
                    <span className="loading loading-spinner loading-md"></span>
                  ) : (
                    "Remove"
                  )}
                </button>
                <button
                  onClick={() => addToCart(product.product._id)}
                  className="btn btn-warning text-white"
                >
                  {addBtnLoading ? (
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
    </div>
  );
};

export default page;
