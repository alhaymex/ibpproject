import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedIn: false,
  uid: "",
  profilePic: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.loggedIn = true;
      state.uid = action.payload.uid;
      state.profilePic = action.payload.profilePic;
    },
    logout(state) {
      state.loggedIn = false;
      state.uid = "";
      state.profilePic = "";
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
