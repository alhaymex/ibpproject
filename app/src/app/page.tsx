"use client";
import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import Link from "next/link";
import { useSelector } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const isLoggedIn = useSelector((state: any) => state.auth.loggedIn);
  const router = useRouter();
  if (!isLoggedIn) {
    router.push("/login");
  }

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getAllProducts = async () => {
      await axios
        .get("http://localhost:8080/products/all")
        .then((res) => {
          setProducts(res.data.products);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getAllProducts();
  }, []);

  // Function to trim description if it is too long
  const trimDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  return (
    <div className="flex justify-center">
      {isLoggedIn ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
          {products.map((product: any) => (
            <Card
              key={product._id}
              id={product._id}
              img={product.image}
              title={product.title}
              price={product.price}
              description={trimDescription(product.description, 50)} // Trim description to 100 characters
              onClick={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="">
          You need to{" "}
          <Link className="hover:underline text-yellow-300" href="/login">
            Login
          </Link>{" "}
          to access this page!
        </div>
      )}
    </div>
  );
}
