import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth } from '../../firebase/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import myContext from '../../context/data/myContext';
import Loader from '../../components/loader/loader';
import gsap from 'gsap';

import GreenWaveShader from './greenWave';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);

  const context = useContext(myContext);
  const { loading, setLoading } = context;

 
  const emailInputRef = useRef(null);
  const h1Ref = useRef(null);

  const signin = async () => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('user', JSON.stringify(result));
      
      toast.success('Signin Successfully', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      window.location.href = '/';
    } catch (error) {
      toast.error('Signin Failed', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && signin();
  };
  useEffect(() => {
    // Only run animation when ref is available
    if (h1Ref.current) {
      gsap.fromTo(
        h1Ref.current,
        { opacity: 0, y: -100 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power3.out", delay: 0.5 }
      );
    }
  }, []); 

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Particle Background */}
      <h1 ref={h1Ref} className='absolute w-full min-h-screen flex justify-center pt-10 z-10 text-green-400 text-6xl md:text-7xl lg:text-8xl font-bold'>LostAndFound</h1>

      <div className='absolute'><GreenWaveShader/></div>
      <div 
        
      />
       
      {/* Loading Overlay */}
      {loading && <Loader />}

      {/* Login Container */}
      <div className="relative z-10 w-80 md:w-full max-w-md p-5 mt-20  bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 transform transition-all duration-300 hover:scale-105">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-wider">
            Sign In
          </h1>
          <p className="text-white/70">Use you email and password</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => {
          e.preventDefault();
          signin();
        }}>
          {/* Email Input */}
          <div className="relative">
            <input 
              ref={emailInputRef}
              type="email"
              value={email}
              onKeyDown={handleKey}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsFocused(prev => ({ ...prev, email: true }))}
              onBlur={() => setIsFocused(prev => ({ ...prev, email: false }))}
              placeholder="Email Address"
              required
              className={`w-full px-4 py-3 bg-white/10 text-white rounded-lg border transition-all duration-300 ${
                isFocused.email 
                  ? 'border-white/50 ring-2 ring-white/30' 
                  : 'border-white/20'
              }`}
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white/50" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Password Input */}
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              value={password}
              onKeyDown={handleKey}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsFocused(prev => ({ ...prev, password: true }))}
              onBlur={() => setIsFocused(prev => ({ ...prev, password: false }))}
              placeholder="Password"
              required
              className={`w-full px-4 py-3 bg-white/10 text-white rounded-lg border transition-all duration-300 ${
                isFocused.password 
                  ? 'border-white/50 ring-2 ring-white/30' 
                  : 'border-white/20'
              }`}
            />
            {/* Password Toggle */}
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
          >
            <span>Sign In</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </form>

        {/* Signup Link */}
        <div className="text-center mt-6">
          <p className="text-white/70">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-white font-semibold hover:underline transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      <footer className="absolute bottom-4 w-full text-center text-xs sm:text-sm md:text-base text-white/50">
        © {new Date().getFullYear()} Lost & Found App. All rights reserved.
      </footer>
    </div>
  );
}

export default Login;