"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { Toaster, toast } from "sonner";

interface PageProps {
  params: {
    productid: string;
  };
}

const Page: React.FC<PageProps> = ({ params }) => {
  const productId = params.productid;
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [product, setProduct] = useState({
    _id: productId,
    title: "",
    description: "",
    image: "",
    price: 0,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/products/get/${productId}`
        );
        const { data } = response;
        if (data.status === true) {
          setProduct(data.product);
          setLoading(false);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch product data");
      }
    };

    fetchProduct();
  }, [productId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    setBtnLoading(true);

    if (
      !product.title ||
      !product.description ||
      !product.image ||
      !product.price
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    await axios
      .post("http://localhost:8080/products/editproduct", product, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.status === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
        }
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <div className="flex flex-col gap-4 w-96">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <form className="card w-96 bg-base-100 shadow-xl">
            <figure>
              <Image
                src={product.image}
                alt={product.title}
                width={400}
                height={400}
              />
            </figure>
            <div className="card-body">
              <label className="input input-bordered flex items-center gap-2">
                <input
                  name="title"
                  type="text"
                  className="grow"
                  placeholder="Title"
                  value={product.title}
                  onChange={handleInputChange}
                />
              </label>

              <label className="input input-bordered flex items-center gap-2">
                <input
                  name="price"
                  type="number"
                  className="grow"
                  placeholder="Price"
                  value={product.price}
                  onChange={handleInputChange}
                />
              </label>
              <textarea
                placeholder="Description"
                className="textarea textarea-bordered textarea-lg w-full max-w-xs h-32"
                name="description"
                value={product.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <button onClick={handleSave} className="btn btn-success text-white">
              {btnLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Save"
              )}
            </button>
          </form>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default Page;
