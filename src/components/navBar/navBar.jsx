import { Fragment, useContext, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Link } from 'react-router-dom'
import { BsFillCloudSunFill } from 'react-icons/bs'
import { FiSun } from 'react-icons/fi'
import myContext from '../../context/data/myContext'
import { RxCross2 } from 'react-icons/rx'
import { BsChatLeftFill } from "react-icons/bs";
import { BsChatLeft } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase/FirebaseConfig'


export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate();
  const handleChatButtonClick = () => {
    navigate('/chat');  // Navigate to the chat page
  };
  const context = useContext(myContext)
  const { toggleMode, mode } = context
  const user = JSON.parse(localStorage.getItem('user'))
  const logout = () => {
    signOut(auth);
    localStorage.clear('user');
    window.location.href = "/";
}

  return (
    <div className="bg-white sticky top-0 z-50 "  >
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="px-9 relative flex w-full max-w-3xs  flex-col overflow-y-auto bg-white pb-12 shadow-xl" style={{ backgroundColor: mode === 'dark' ? 'rgb(40, 44, 52)' : '', color: mode === 'dark' ? 'white' : '', }}>
                <div className="flex px-4 pb-2 pt-28">
                  <button
                    type="button"
                    className=" inline-flex items-center justify-center border-2 rounded-full p-2 mb-5 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <RxCross2 />
                  </button>
                </div>
                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  <div className="flow-root">
                    <Link to={'/'} style={{ color: mode === 'dark' ? 'white' : '', }} className="-m-2 block p-2 font-medium text-gray-900">
                      Home
                    </Link>
                  </div>

                  <div className="flow-root">
                    <Link to={'/items'} className="-m-2 block p-2 font-medium text-gray-900" style={{ color: mode === 'dark' ? 'white' : '', }}>
                      Items
                    </Link>
                  </div>

                  {user ? <><div className="flow-root">
                    <Link to={'/profile'} className="-m-2 block p-2 font-medium text-gray-900" style={{ color: mode === 'dark' ? 'white' : '', }}>
                      Profile
                    </Link>
                  </div>

                   <div className="flow-root ">
                    <a onClick={logout} className="-m-2 block p-2 font-medium text-gray-900 cursor-pointer" style={{ color: mode === 'dark' ? 'white' : '', }}>
                      Logout
                    </a>
                  </div> </>: <div className='flex flex-col space-y-5'><Link to={'/login'} className="w-20 p-3 bg-emerald-400  rounded-4xl  font-medium text-gray-900" style={{ color: mode === 'dark' ? 'white' : '', }}>
                      Login
                    </Link><Link to={'/signup'} className="w-20 p-3 bg-emerald-400 rounded-4xl  font-medium text-gray-900" style={{ color: mode === 'dark' ? 'white' : '', }}>
                      SignUp
                    </Link> </div>}
                    {user ? 
                    <div className="flex lg:ml-6 p-2">
                  <button className='' onClick={()=>navigate('/chat')}>
                    {/* <MdDarkMode size={35} style={{ color: mode === 'dark' ? 'white' : '' }} /> */}
                    {mode === 'light' ?
                      (<BsChatLeft className='' size={25} />
                      ) : 'dark' ?
                        (<BsChatLeftFill size={25} />
                        ) : ''}
                  </button>
                </div>:''}
                  <div className="flow-root">
                    
                  </div>
                </div>

                
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* desktop  */}
      <header className="relative bg-white">
        <nav aria-label="Top" className="bg-gray-100 px-4 sm:px-6 lg:px-8 shadow-xl " style={{ backgroundColor: mode === 'dark' ? '#282c34' : '', color: mode === 'dark' ? 'white' : '', }}>
          <div className="">
            <div className="flex h-16 items-center">
              <button
                type="button"
                className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
                onClick={() => setOpen(true)} style={{ backgroundColor: mode === 'dark' ? 'rgb(80 82 87)' : '', color: mode === 'dark' ? 'white' : '', }}
              >
                <span className="sr-only">Open menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>

              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link to={'/'} className='flex'>
                  <div className="flex ">
                    <h1 className=' text-2xl font-bold text-black  px-2 py-1 rounded' style={{ color: mode === 'dark' ? 'white' : '', }}>LostAndFound</h1>
                  </div>
                </Link>
              </div>

              <div className="ml-auto flex items-center">
                <div className="hidden space-x-3 lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">

                  <Link to={'/'} className="text-sm font-medium text-gray-700 " style={{ color: mode === 'dark' ? 'white' : '', }}>
                    Home
                  </Link>
                  <Link to={'/items'} className="text-sm font-medium text-gray-700 " style={{ color: mode === 'dark' ? 'white' : '', }}>
                    Items
                  </Link>

                  {user ? <> <Link to={'/profile'} className="text-sm font-medium text-gray-700 " style={{ color: mode === 'dark' ? 'white' : '', }}>
                    Profile
                  </Link>
                 <a onClick={logout} className="text-sm font-medium text-gray-700 cursor-pointer  " style={{ color: mode === 'dark' ? 'white' : '', }}>
                    Logout
                  </a>
                  </>
                  : <><Link to="/login"className="bg-emerald-400 w-full text-white font-bold px-4 py-2 rounded-lg text-center block"> Login </Link>
                            <Link to="/signup" className="bg-emerald-400 w-full text-white font-bold px-4 py-2 rounded-lg text-center block">SignUp</Link></>}
                </div>
                
               {user ? <div className="flex lg:-mr-5 p-5">
                  <button className='pt-2.5' onClick={()=>navigate('/chat')}>
                    {/* <MdDarkMode size={35} style={{ color: mode === 'dark' ? 'white' : '' }} /> */}
                    {mode === 'light' ?
                      (<BsChatLeft className='' size={25} />
                      ) : 'dark' ?
                        (<BsChatLeftFill size={25} />
                        ) : ''}
                  </button>
                </div>: <></>} 
                <div className="flex lg:ml-6">
                  <button className='' onClick={toggleMode}>
                    {/* <MdDarkMode size={35} style={{ color: mode === 'dark' ? 'white' : '' }} /> */}
                    {mode === 'light' ?
                      (<FiSun className='' size={30} />
                      ) : 'dark' ?
                        (<BsFillCloudSunFill size={30} />
                        ) : ''}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}