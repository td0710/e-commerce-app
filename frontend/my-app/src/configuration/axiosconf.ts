import axios from "axios";

import Swal from "sweetalert2";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  withCredentials: true,
});
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest || typeof originalRequest._retry === "undefined") {
      originalRequest._retry = false;
    }

    if (error.response.data.code === "1009" && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await api.post("/api/auth/refresh-token");
        const token = response.data.token;

        console.log(response);
        localStorage.setItem("token", token);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("id");
        localStorage.removeItem("role");
        await Swal.fire({
          timer: 10000,
          icon: "error",
          title: "Phiên đăng nhập đã hết hạn!",
          text: "Vui lòng đăng nhập lại!",
          confirmButtonText: "OK",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });

        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
