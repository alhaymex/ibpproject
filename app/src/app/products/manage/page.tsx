"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, Toaster } from "sonner";

interface Product {
  _id: string;
  title: string;
  description: string;
  image: string;
  price: number;
}

const page: React.FC = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  const role = useSelector((state: any) => state.auth.role);

  if (role !== "admin") {
    router.push("/login");
  }

  const trimDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  const handleDelete = async (id: string) => {
    await axios
      .post(
        "http://localhost:8080/products/delete",
        { id },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.status === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
        }
      });
  };

  useEffect(() => {
    const getAllProducts = async () => {
      await axios.get("http://localhost:8080/products/all").then((res) => {
        setProducts(res.data.products);
        setLoading(false);
      });
    };
    getAllProducts();
  }, [handleDelete]);
  return (
    <div>
      <Toaster />
      {loading && (
        <div className="flex justify-center">
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Title</th>
              <th>Description</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {products.map((product) => (
              <tr key={product._id}>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask w-16 h-16 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.title}
                          width={200}
                          height={200}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{product.title}</div>
                      <div className="text-sm opacity-50">₺{product.price}</div>
                    </div>
                  </div>
                </td>
                <td>{trimDescription(product.description, 80)}</td>
                <td>
                  <Link
                    href={`/products/${product._id}`}
                    className="btn btn-warning text-white"
                  >
                    Edit
                  </Link>
                </td>
                <th>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="btn bg-red-600 btn-error text-white"
                  >
                    Delete
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Description</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default page;
