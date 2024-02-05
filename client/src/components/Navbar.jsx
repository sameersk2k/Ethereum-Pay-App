import { useState } from 'react';
import {HiMenuAlt4} from 'react-icons/hi';
import {AiOutlineClose} from 'react-icons/ai';
import logo from '../../images/logo1.png';

const Navbar = () => {
  

  return(
    
      <div className="flex justify-center items-center">
        <img src={logo} alt="logo" className="w-32 cursor-pointer mt-4"/>
      </div>
      

    
  );
}

export default Navbar;