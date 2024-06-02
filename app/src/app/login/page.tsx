"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducers/AuthReducer";
import { useSelector } from "react-redux";

import { Toaster, toast } from "sonner";

import axios from "axios";

const page: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const isLoggedIn = useSelector((state: any) => state.auth.loggedIn);

  if (isLoggedIn) {
    router.push("/");
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
    }

    if (name === "password") {
      setPassword(value);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const user = {
      email,
      password,
    };

    await axios
      .post("http://localhost:8080/auth/login", user, { withCredentials: true })
      .then((res) => {
        if (res.data.status == false) {
          toast.error(res.data.message);
          setLoading(false);
        } else {
          const uid = res.data.user.uid;
          const profilePic = res.data.user.image;
          const role = res.data.user.role;

          dispatch(login({ uid, profilePic, role }));
          router.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(user);
  };

  return (
    <div className=" flex justify-center p-6">
      <Toaster />

      <div className="bg-neutral rounded-lg flex justify-center p-6">
        <form className="space-y-3">
          <h1 className="text-center text-xl font-bold">Login</h1>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input
              onChange={handleInputChange}
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              required
              value={email}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              className="grow"
              placeholder="password"
              name="password"
              value={password}
              onChange={handleInputChange}
            />
          </label>
          <div className="divider"></div>
          <div className="flex justify-center">
            <button
              onClick={handleLogin}
              className="btn btn-warning text-white"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner text-warning"></span>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
