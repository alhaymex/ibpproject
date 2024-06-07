"use client";
import React, { useState } from "react";
import axios from "axios";

import { Toaster, toast } from "sonner";

const Page: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(Number);
  const [description, setDescription] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "title") {
      setTitle(value);
    }

    if (name === "image") {
      setImage(value);
    }

    if (name === "price") {
      setPrice(Number(value));
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    if (!title || !image || !price || !description) {
      setLoading(false);
      return toast.error("Please fill in all fields!");
    }
    const product = {
      title,
      image,
      price,
      description,
    };
    console.log(product);

    await axios
      .post("http://localhost:8080/products/new", product, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.status === false) {
          toast.error(res.data.message);
          setLoading(false);
        } else {
          toast.success(res.data.message);
          setLoading(false);
        }
      });
  };
  return (
    <form className="flex flex-col items-center space-y-3">
      <Toaster />

      <input
        type="text"
        placeholder="Title"
        className="input input-bordered w-full max-w-xs"
        onChange={handleInputChange}
        value={title}
        name="title"
      />
      <input
        type="text"
        placeholder="Image URL"
        className="input input-bordered w-full max-w-xs"
        onChange={handleInputChange}
        value={image}
        name="image"
      />
      <input
        type="number"
        placeholder="Price"
        className="input input-bordered w-full max-w-xs"
        onChange={handleInputChange}
        value={price}
        name="price"
      />
      <textarea
        placeholder="Description"
        className="textarea textarea-bordered textarea-lg w-full max-w-xs h-32"
        onChange={handleTextareaChange}
        value={description}
        name="description"
      ></textarea>

      <button
        onClick={handleSubmit}
        className="btn btn-warning text-white w-full max-w-xs"
      >
        {loading ? (
          <span className="loading loading-spinner text-warning"></span>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
};

export default Page;
