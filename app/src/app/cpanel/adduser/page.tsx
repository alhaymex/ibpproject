"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { Toaster, toast } from "sonner";
import axios from "axios";

const page: React.FC = () => {
  const router = useRouter();
  const role = useSelector((state: any) => state.auth.role);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [loading, setLoading] = useState(false);

  //   if (role !== "admin") {
  //     router.push("/");
  //   }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "firstname") {
      setFirstname(value);
    } else if (name === "lastname") {
      setLastname(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstname || !lastname || !email || !password || !selectedRole) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    const user = {
      firstname,
      lastname,
      email,
      password,
      role: selectedRole,
    };

    axios
      .post("http://localhost:8080/cpanel/adduser", user, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.status === false) {
          toast.error(res.data.message);
          setLoading(false);
        } else {
          toast.success(res.data.message);
          setFirstname("");
          setLastname("");
          setEmail("");
          setPassword("");
          setSelectedRole("");
          setLoading(false);
        }
      });
  };

  return (
    <div className="flex flex-col items-center">
      <Toaster />
      <form className="flex flex-col space-y-3">
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
            type="text"
            className="grow"
            placeholder="firstname"
            name="firstname"
            onChange={handleInputChange}
            value={firstname}
          />
        </label>
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
            type="text"
            className="grow"
            placeholder="lastname"
            name="lastname"
            onChange={handleInputChange}
            value={lastname}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="email"
            className="grow"
            placeholder="email"
            name="email"
            onChange={handleInputChange}
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
            value={password}
            name="password"
            onChange={handleInputChange}
            placeholder="password"
          />
        </label>

        <select
          className="select select-bordered w-full max-w-xs"
          value={selectedRole}
          onChange={handleRoleChange}
        >
          <option disabled value="">
            Role
          </option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={handleAddUser} className="btn btn-warning text-white">
          {loading ? (
            <>
              <span className="loading loading-spinner  "></span>
              Saving...
            </>
          ) : (
            "Add User"
          )}
        </button>
      </form>
    </div>
  );
};

export default page;
