import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <nav className="p-3 bg-base-100">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            IBPProject
          </Link>
        </div>
        <div className="flex space-x-3">
          <Link className="btn" href="/login">
            Login
          </Link>
          <Link className="btn btn-outline btn-ghost" href="/register">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
