"use client";
import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../store/reducers/AuthReducer";

const CheckAuth = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get("http://localhost:8080/auth/checkauth", {
          withCredentials: true,
        });
        if (res.data.status == true) {
          const uid = res.data.user.uid;
          const profilePic = res.data.user.image;
          const role = res.data.user.role;

          // console.log(profilePic);

          dispatch(login({ uid, profilePic, role }));
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkLogin();
  }, []);

  return <React.Fragment>{children}</React.Fragment>;
};

export default CheckAuth;
