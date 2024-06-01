"use client";
import Image from "next/image";
import Link from "next/link";
``;
import { useSelector } from "react-redux";

export default function Home() {
  const isLoggedIn = useSelector((state: any) => state.auth.loggedIn);
  return (
    <div className="flex justify-center">
      {isLoggedIn ? (
        <div>Hello</div>
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
