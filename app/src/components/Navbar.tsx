"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function Home() {
  const router = useRouter();
  const isLoggedIn = useSelector((state: any) => state.auth.loggedIn);
  const img = useSelector((state: any) => state.auth.profilePic);
  const role = useSelector((state: any) => state.auth.role);

  const handleLogout = async () => {
    await axios.post("http://localhost:8080/auth/logout").then((res) => {
      router.push("/login");
    });
  };

  return (
    <nav className="p-3 bg-base-100 shadow-sm">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            Pretendyol
          </Link>
        </div>
        {isLoggedIn ? (
          <div className="navbar bg-base-100">
            <div className="flex-1"></div>
            <div className="flex-none gap-2">
              {role == "admin" ? (
                <Link
                  className="btn btn-warning text-white"
                  href="/products/new"
                >
                  Add Product
                </Link>
              ) : (
                ""
              )}
              <Link
                href="/cart"
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </Link>

              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <Image
                      width={100}
                      height={100}
                      alt="Profile picture"
                      src={img}
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link href="/profile" className="justify-between">
                      Profile
                    </Link>
                  </li>
                  {role == "admin" ? (
                    <>
                      <li>
                        <Link href="/cpanel">Admin Panel</Link>
                      </li>
                      <li>
                        <Link href="/products/manage">Manage Products</Link>
                      </li>
                    </>
                  ) : null}

                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex space-x-3">
            <Link className="btn" href="/login">
              Login
            </Link>
            <Link className="btn btn-outline btn-ghost" href="/register">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
