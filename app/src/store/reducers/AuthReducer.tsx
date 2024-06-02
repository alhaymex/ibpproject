import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedIn: false,
  uid: "",
  profilePic: "",
  role: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.loggedIn = true;
      state.uid = action.payload.uid;
      state.profilePic = action.payload.profilePic;
      state.role = action.payload.role;
    },
    logout(state) {
      state.loggedIn = false;
      state.uid = "";
      state.profilePic = "";
      state.role = "";
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
