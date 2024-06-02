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
            IBPProject
          </Link>
        </div>
        {isLoggedIn ? (
          <div className="navbar bg-base-100">
            <div className="flex-1"></div>
            <div className="flex-none gap-2">
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
                    <li>
                      <Link href="/cpanel">Admin Panel</Link>
                    </li>
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
