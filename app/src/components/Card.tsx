import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CardProps {
  id: number;
  img: string;
  title: string;
  price: number;
  description: string;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({
  id,
  img,
  title,
  price,
  description,
  onClick,
}) => {
  return (
    <div className="card w-[20rem] bg-base-100 shadow-xl" key={id}>
      <figure>
        <Link href={`/product/${id}`}>
          <Image
            loading="lazy"
            src={img}
            alt={title}
            width={400}
            height={400}
          />
        </Link>
      </figure>
      <div className="card-body">
        <Link href={`/product/${id}`} className="card-title hover:underline">
          {title}
        </Link>
        <p>{description}</p>
        <div className="card-actions flex items-center justify-between">
          <span>₺{price}</span>
          <button className="btn btn-warning text-white" onClick={onClick}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
