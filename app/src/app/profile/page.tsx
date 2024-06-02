"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const page: React.FC = () => {
  const router = useRouter();

  const img = useSelector((state: any) => state.auth.profilePic);
  const isLoggedIn = useSelector((state: any) => state.auth.loggedIn);

  if (!isLoggedIn) {
    router.push("/login");
  }

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/auth/profile", {
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

  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <div className="flex  flex-col gap-4 w-52">
            <div className="flex gap-4 items-center">
              <div className="skeleton w-16 h-16 rounded-full shrink-0"></div>
              <div className="flex flex-col gap-4">
                <div className="skeleton h-4 w-20"></div>
                <div className="skeleton h-4 w-28"></div>
              </div>
            </div>
            <div className="skeleton h-32 w-full"></div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="card card-compact w-96 bg-base-100 shadow-xl">
            <div className="flex justify-center avatar">
              <div className="w-24 rounded-full">
                <Image src={img} alt="profile" width={100} height={100} />
              </div>
            </div>
            <div className="card-body">
              <div className="flex justify-center">
                <h2 className="card-title">
                  {user.firstname + " " + user.lastname}
                </h2>
              </div>
              <div className="flex justify-center">
                <h2>{user.email}</h2>
              </div>

              <div className="mt-3 card-actions justify-center">
                <button className="btn btn-warning text-white">Update</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default page;
