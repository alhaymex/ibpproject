"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface PageProps {
  params: {
    userid: string;
  };
}

interface User {
  image: string;
  firstname: string;
  lastname: string;
  email: string;
}

const Page: React.FC<PageProps> = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [resStatus, setResStatus] = useState(Boolean);
  const [user, setUser] = useState<User>({
    image: "",
    firstname: "",
    lastname: "",
    email: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8080/cpanel/user/${params.userid}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.status === true) {
          setUser(res.data.user);
          setLoading(false);
        } else {
          console.log(res.data.message);
        }
      });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-infinity loading-lg text-yellow-300"></span>
        </div>
      ) : (
        <>
          <div className=" flex justify-center p-6">
            <form className="flex flex-col gap-2">
              <div className="flex justify-center avatar">
                <div className="w-24 rounded-full">
                  <Image
                    src={user.image}
                    alt="profile"
                    width={100}
                    height={100}
                  />
                </div>
              </div>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow"
                  placeholder="First Name"
                  value={user.firstname}
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow"
                  placeholder="Last Name"
                  value={user.lastname}
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="email"
                  className="grow"
                  placeholder="Email"
                  value={user.email}
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="password"
                  className="grow"
                  placeholder="Password"
                />
              </label>
              <button className="btn btn-success text-white">Save</button>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default Page;
