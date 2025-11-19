import { useForm } from "react-hook-form";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";   // <-- import context
import { setAuthToken } from "../../api";

type FormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const navigate = useNavigate();
  const { setToken } = useAuth();      // <-- use context
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        data
      );

      const token = res.data.token;
      setToken(token);
      localStorage.setItem("token", token);
      setAuthToken(token);

      setLoading(false);

      navigate("/dashboard");
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      alert(error?.response?.data?.error || "Login failed");
    }
  };


  return (
    <div className="login-container">
      <div className="title">Tracker App</div>

      <form className="login-box" onSubmit={handleSubmit(onSubmit)}>
        <h2>Login</h2>

        {/* Email */}
        <div className="input-group">
          <label>
            Email<span>*</span>
          </label>
          <input
            type="email"
            placeholder="Enter email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="input-group password-group">
          <label>
            Password<span>*</span>
          </label>

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              {...register("password", { required: "Password is required" })}
            />

            <span
              className="eye-icon"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          {errors.password && (
            <p className="error-text">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="register-text">
          Didn't Signup? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
