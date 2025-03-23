import React, { useContext } from 'react';
import NavBar from '../navBar/navBar';
import Footer from '../footer/footer';
import MyContext from '../../context/data/myContext';

function Layout({children}) {
  const context = useContext(MyContext);
  const { mode } = context;

  return (
    <div className={`min-h-screen flex flex-col ${
      mode === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-white text-black'
    }`}>
      <NavBar />
      <div className={`flex-grow content ${
        mode === 'dark' 
          ? 'bg-gray-900 text-white' 
          : 'bg-white text-black'
      }`}>
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
