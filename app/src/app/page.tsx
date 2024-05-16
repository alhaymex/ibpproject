import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center">
      <div className="">
        You need to{" "}
        <Link className="hover:underline text-yellow-300" href="/login">
          Login
        </Link>{" "}
        to access this page!
      </div>
    </div>
  );
}
