import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { config } from "../config";

const SignUp = () => {
  const navigate = useNavigate();

  const [data, setdata] = useState({
    email: "",
    password: "",
    confirmpassword: "",
  });

  const handleChage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setdata({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    try {
      e.preventDefault();
      if (data.password !== data.confirmpassword) {
        toast.error("password not match");
      }
      await axios.post(`${config.API_URL}/users/register`, data);
      toast.success("Register Sucessfully");
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="relative max-h-screen w-full flex flex-col md:flex-row bg-gradient-to-br from-gray-50 via-blue-300 to-violet-700 overflow-hidden">
      {/* --- BACKGROUND SHAPES --- */}
      {/* Mobile: Single large circle on the right | Desktop: Full decorative set */}
      <div className="absolute top-1/2 -right-20 md:-top-12 md:-right-16 w-80 h-80 bg-[#FCC6BB]/30 md:bg-[#FCC6BB]/40 rounded-full pointer-events-none z-0 transform -translate-y-1/2 md:translate-y-0" />

      <div className="hidden md:block absolute -bottom-24 left-[35%] w-72 h-72 bg-[#FCC6BB] rounded-full pointer-events-none z-0" />
      <div className="hidden md:block absolute -bottom-12 -left-16 w-40 h-40 bg-[#FCC6BB] rounded-full pointer-events-none z-0" />

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 w-full min-h-screen flex flex-col md:flex-row">
        {/* LEFT SECTION: Branding & Desktop Hero Text */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-start md:justify-between p-8 md:p-10">
          <div className="mt-4 md:mt-0">
            <img
              src="https://lemonpay.tech/logo%20hd.png"
              alt="lemonpay"
              className="w-48 md:w-60 object-contain"
            />
          </div>

          {/* Hero Text: Hidden on Mobile, Visible on Desktop */}
          <div className="hidden md:block mt-auto mb-20">
            <h1 className="text-3xl md:text-6xl font-bold text-white leading-tight">
              Join 1000+ Businesses
            </h1>
            <h1 className="text-3xl md:text-6xl font-bold text-white leading-tight">
              <span className="text-yellow-400">Powering Growth</span>
              <br />
              with Lemonpay!
            </h1>
          </div>
        </div>

        {/* RIGHT SECTION: Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-20">
          <div className="w-full max-w-md bg-white/5 md:bg-transparent p-8 md:p-0 rounded-3xl backdrop-blur-sm md:backdrop-blur-none">
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Welcome Sign Up System
              </h2>
              <p className="text-white text-sm opacity-80">
                Your gateway to seamless transactions and easy payments.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-white text-xs font-semibold uppercase tracking-widest opacity-80">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChage}
                  required
                  placeholder="Enter email address"
                  className="w-full bg-white/10 border border-white/30 p-3 rounded-xl text-white placeholder:text-white/40 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-white text-xs font-semibold uppercase tracking-widest opacity-80">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={data.password}
                  onChange={handleChage}
                  required
                  placeholder="Enter password"
                  className="w-full bg-white/10 border border-white/30 p-3 rounded-xl text-white placeholder:text-white/40 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                />
              </div>

              {/* Confirm Password Column */}
              <div className="space-y-2">
                <label className="text-white text-xs font-semibold uppercase tracking-widest opacity-80">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmpassword"
                  value={data.confirmpassword}
                  onChange={handleChage}
                  required
                  placeholder="Confirm your password"
                  className="w-full bg-white/10 border border-white/30 p-3 rounded-xl text-white placeholder:text-white/40 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                />
              </div>

              <div className="flex justify-between items-center text-sm text-white pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    required
                    className="accent-yellow-400 w-4 h-4"
                  />
                  <span className="group-hover:text-yellow-400 transition">
                    Agree to terms
                  </span>
                </label>
                <Link
                  to="/"
                  className="font-bold hover:text-yellow-400 transition underline underline-offset-4"
                >
                  Sign In
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-indigo-900 py-4 rounded-2xl font-bold text-lg hover:bg-yellow-400 hover:text-indigo-950 transform active:scale-[0.98] transition-all shadow-xl mt-4"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
