import React, { useContext } from 'react';
import MyContext from '../../context/data/myContext';

const Footer = () => {
  const { mode } = useContext(MyContext);
  
  return (
    <footer className={`py-6 ${
      mode === 'dark'
        ? 'bg-gray-800 text-gray-300'
        : 'bg-gray-100 text-gray-700'
    }`}>
      <div className="container mx-auto px-6">
        {/* Simple Footer Content */}
        <div className="flex flex-col items-center">
          {/* App Name */}
          <div className="flex items-center space-x-2 mb-4">
            <span className={`text-xl font-bold ${
              mode === 'dark'
                ? 'text-white'
                : 'text-emerald-600'
            }`}>
              Lost & Found
            </span>
          </div>
          
          {/* Developer Name */}
          <p className={`text-sm mb-4 ${
            mode === 'dark'
              ? 'text-gray-400'
              : 'text-gray-600'
          }`}>
            Developed by Kaushik Reddy Bandi
          </p>
          
          {/* Social Media Icons */}
          <div className="flex space-x-4 mb-4">
            <a 
              href="https://www.linkedin.com/in/kaushik-reddy-bandi-1ba624257/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`p-2 rounded-full ${
                mode === 'dark'
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-emerald-400'
                  : 'hover:bg-gray-200 text-gray-600 hover:text-emerald-600'
              } transition-colors duration-200`}
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.7,3H4.3C3.582,3,3,3.582,3,4.3v15.4C3,20.418,3.582,21,4.3,21h15.4c0.718,0,1.3-0.582,1.3-1.3V4.3 C21,3.582,20.418,3,19.7,3z M8.339,18.338H5.667v-8.59h2.672V18.338z M7.004,8.574c-0.857,0-1.549-0.694-1.549-1.548 c0-0.855,0.691-1.548,1.549-1.548c0.854,0,1.547,0.694,1.547,1.548C8.551,7.881,7.858,8.574,7.004,8.574z M18.339,18.338h-2.669 v-4.177c0-0.996-0.017-2.278-1.387-2.278c-1.389,0-1.601,1.086-1.601,2.206v4.249h-2.667v-8.59h2.559v1.174h0.037 c0.356-0.675,1.227-1.387,2.526-1.387c2.703,0,3.203,1.779,3.203,4.092V18.338z"></path>
              </svg>
            </a>
            <a 
              href="https://github.com/kaushik9701" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`p-2 rounded-full ${
                mode === 'dark'
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-emerald-400'
                  : 'hover:bg-gray-200 text-gray-600 hover:text-emerald-600'
              } transition-colors duration-200`}
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
              </svg>
            </a>
            <a 
              href="mailto:bandikaushikreddy@gmail.com"
              className={`p-2 rounded-full ${
                mode === 'dark'
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-emerald-400'
                  : 'hover:bg-gray-200 text-gray-600 hover:text-emerald-600'
              } transition-colors duration-200`}
              aria-label="Email"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </a>
          </div>
          
          {/* Copyright */}
          <p className={`text-sm ${
            mode === 'dark'
              ? 'text-gray-500'
              : 'text-gray-500'
          }`}>
            © {new Date().getFullYear()} Lost & Found. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;