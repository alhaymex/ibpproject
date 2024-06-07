"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

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
  const userId = params.userid;
  const router = useRouter();
  const role = useSelector((state: any) => state.auth.role);

  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [user, setUser] = useState<User>({
    image: "",
    firstname: "",
    lastname: "",
    email: "",
  });
  const [password, setPassword] = useState("");

  // Redirect non-admin users immediately
  useEffect(() => {
    if (role !== "admin") {
      router.push("/");
    }
  }, [role, router]);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/cpanel/user/${userId}`,
          {
            withCredentials: true,
          }
        );
        if (response.data.status === true) {
          setUser(response.data.user);
        } else {
          console.error(response.data.message);
          toast.error("Failed to fetch user data.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("An error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBtnLoading(true);

    const updatedUser = {
      userId,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/cpanel/updateuser",
        updatedUser,
        {
          withCredentials: true,
        }
      );

      if (response.data.status === true) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("An error occurred while updating the user.");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  if (role !== "admin") {
    return null; // Prevent rendering if the user is not an admin
  }

  return (
    <>
      <Toaster />
      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-infinity loading-lg text-yellow-300"></span>
        </div>
      ) : (
        <div className="flex justify-center p-6">
          <form className="flex flex-col gap-2" onSubmit={handleSave}>
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
                onChange={handleInputChange}
                name="firstname"
                type="text"
                className="grow"
                placeholder="First Name"
                value={user.firstname}
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <input
                onChange={handleInputChange}
                name="lastname"
                type="text"
                className="grow"
                placeholder="Last Name"
                value={user.lastname}
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <input
                onChange={handleInputChange}
                name="email"
                type="email"
                className="grow"
                placeholder="Email"
                value={user.email}
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <input
                onChange={handlePasswordChange}
                name="password"
                type="password"
                className="grow"
                placeholder="Password"
              />
            </label>
            <button
              type="submit"
              className="btn btn-success text-white"
              disabled={btnLoading}
            >
              {btnLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Save"
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Page;
