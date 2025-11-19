import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import "./register.css";
import { useNavigate } from "react-router-dom";


interface RegisterForm {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
      });

      alert("Registration successful! Please login.");
      setLoading(false);
      navigate('/login')

    } catch (err: any) {
      setLoading(false);
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-title">Register</div>

      <form className="register-box" onSubmit={handleSubmit(onSubmit)}>
        <h2>Create Account</h2>
        <div className="input-group">
          <label>
            First Name<span>*</span>
          </label>
          <input
            type="text"
            placeholder="Enter first name"
            {...register("firstname", { required: "First name is required" })}
          />
          {errors.firstname && <p className="error-text">{errors.firstname.message}</p>}
        </div>
        <div className="input-group">
          <label>
            Last Name<span>*</span>
          </label>
          <input
            type="text"
            placeholder="Enter last name"
            {...register("lastname", { required: "Last name is required" })}
          />
          {errors.lastname && <p className="error-text">{errors.lastname.message}</p>}
        </div>
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
        <div className="input-group password-group">
          <label>
            Password<span>*</span>
          </label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <span className="eye-icon" onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>
        <div className="input-group password-group">
          <label>
            Confirm Password<span>*</span>
          </label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) => value === password || "Passwords do not match",
              })}
            />
            <span
              className="eye-icon"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="error-text">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
