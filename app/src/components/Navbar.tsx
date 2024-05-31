"use client";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function Home() {
  const isLoggedIn = useSelector((state: any) => state.auth.loggedIn);
  const img = useSelector((state: any) => state.auth.profilePic);
  console.log(img);
  return (
    <nav className="p-3 bg-base-100">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            IBPProject
          </Link>
        </div>
        {isLoggedIn ? (
          <div className="navbar bg-base-100">
            <div className="flex-1"></div>
            <div className="flex-none gap-2">
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Search"
                  className="input input-bordered w-24 md:w-auto"
                />
              </div>
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
                    <a className="justify-between">
                      Profile
                      <span className="badge">New</span>
                    </a>
                  </li>
                  <li>
                    <a>Settings</a>
                  </li>
                  <li>
                    <a>Logout</a>
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
