"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

const page: React.FC = () => {
  const router = useRouter();
  const role = useSelector((state: any) => state.auth.role);

  if (role !== "admin") {
    router.push("/");
  }

  const [users, setUsers] = useState([{}]);
  const search = async (e: any) => {
    // If the input is empty dont search
    if (e.target.value === "") {
      setUsers([{}]);
      return;
    }
    await axios
      .get("http://localhost:8080/cpanel/search/" + e.target.value)
      .then((res) => {
        setUsers(res.data);
        console.log(users);
      });
  };

  return (
    <div>
      <div className="flex justify-center p-3 space-x-3">
        <input
          onChange={search}
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
        />
        <Link href="/cpanel/adduser" className="btn btn-warning text-white">
          Add User
        </Link>
      </div>
      <div className="p-6 overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {users.map((user: any) => (
              <tr className={user.id ? "hove" : ""}>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.email}</td>
                <td>
                  <Link
                    className={user.id ? "btn btn-warning text-white" : ""}
                    href={`/user/${user.id}`}
                  >
                    {user.id ? "Edit" : ""}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default page;
