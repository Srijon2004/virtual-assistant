import React, { useContext, useState } from "react";
// import bg from "../assets/authBg.png"

import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

import axios from "axios";
function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, userData, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          name,
          email,
          password,
        },
        { withCredentials: true }
      );
      setUserData(result.data);
      setLoading(false);
      navigate("/customize");
    } catch (error) {
      console.log(error);
      setUserData(null);
      setLoading(false);
      setErr(error.response.data.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const res = await axios.post(
        `${serverUrl}/api/auth/google`,
        {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        },
        { withCredentials: true }
      );

      setUserData(res.data);
      navigate("/");
    } catch (error) {
      console.log(error);
      setErr("Google signup failed");
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: "url(/image3.png)" }}
    >
      {/* <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]' onSubmit={handleSignUp}>
<h1 className='text-white text-[30px] font-semibold mb-[30px]'>Register to <span className='text-blue-400'>Virtual Assistant</span></h1>
<input type="text" placeholder='Enter your Name' className='w-full h-[60px] outline-none border-2 border-white bg-transparent  text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]' required onChange={(e)=>setName(e.target.value)} value={name}/>
<input type="email" placeholder='Email' className='w-full h-[60px] outline-none border-2 border-white bg-transparent  text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]' required onChange={(e)=>setEmail(e.target.value)} value={email}/>
<div className='w-full h-[60px] border-2 border-white bg-transparent  text-white rounded-full text-[18px] relative'>
<input type={showPassword?"text":"password"} placeholder='password' className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]' required onChange={(e)=>setPassword(e.target.value)} value={password}/>
{!showPassword && <IoEye className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-[white] cursor-pointer' onClick={()=>setShowPassword(true)}/>}
  {showPassword && <IoEyeOff className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-[white] cursor-pointer' onClick={()=>setShowPassword(false)}/>}
</div>
{err.length>0 && <p className='text-red-500 text-[17px]'>
  *{err}
  </p>}
{/* <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold  bg-white rounded-full text-[19px] ' disabled={loading}>{loading?"Loading...":"Sign Up"}</button> 

<button
  type="button"
  onClick={handleGoogleSignup}
  className="min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] flex items-center justify-center gap-2"
>
  <img src="https://developers.google.com/identity/images/g-logo.png" className="w-6 h-6"/>
  Sign up with Google
</button>




<p className='text-[white] text-[18px] cursor-pointer' onClick={()=>navigate("/signin")}>Already have an account ? <span className='text-blue-400'>Sign In</span></p>
 </form> */}

      <form
        className="w-[90%] max-w-[420px] bg-[#00000070] backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/50 p-10 flex flex-col gap-5 text-white"
        onSubmit={handleSignUp}
      >
        <h1 className="text-3xl font-bold text-center">
          Create your <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          className="h-12 px-5 rounded-xl bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="h-12 px-5 rounded-xl bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-12 px-5 rounded-xl bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="absolute right-4 top-3 cursor-pointer text-white/80">
            {showPassword ? (
              <IoEyeOff onClick={() => setShowPassword(false)} />
            ) : (
              <IoEye onClick={() => setShowPassword(true)} />
            )}
          </span>
        </div>

        {err && <p className="text-red-400 text-sm text-center">{err}</p>}

        {/* NORMAL SIGNUP BUTTON */}
        <button
          type="submit"
          className="h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-semibold hover:scale-[1.03] transition"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <div className="flex items-center gap-3 text-white/60">
          <div className="flex-1 h-px bg-white/20"></div>
          OR
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        {/* GOOGLE SIGNUP BUTTON */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="h-12 bg-white text-black rounded-xl flex items-center justify-center gap-3 hover:scale-[1.03] transition"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            className="w-5"
          />
          Sign up with Google
        </button>

        <p className="text-center text-white/70">
          Already have an account?
          <span
            onClick={() => navigate("/signin")}
            className="text-blue-400 cursor-pointer ml-1"
          >
            Sign in
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
