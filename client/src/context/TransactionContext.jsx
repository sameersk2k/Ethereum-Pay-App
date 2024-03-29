import React, {useEffect,useState} from 'react';
import {ethers} from 'ethers';

import {contractABI,contractAddress} from '../utils/constants';

export const TransactionContext  = React.createContext();

const {ethereum} = window;

const getEthereumContract =()=>{
  const provider= new ethers.providers.Web3Provider(ethereum);

  const signer= provider.getSigner();

  const transactionContract = new ethers.Contract(contractAddress,contractABI,signer);

  return transactionContract;
}

export const TransactionProvider = ({children}) =>{

  const [currentAccount,setCurrentAccount] = useState("");
  const [formData,setFormData] = useState({addressTo:'',amount:'',message:''});

  const[isLoading,setisLoading] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);



  const [transactionCount,setTransactionCount]=useState(localStorage.getItem('transactionCount'));


  const handleChange=(e,name)=>{
    setFormData((prevState)=>({...prevState,[name]:e.target.value}));
  }

  const checkWalletConnection = async () => {
    try {
      if(!ethereum) return alert('Please install metamask');

    const accounts = await ethereum.request({method:'eth_accounts'});

    if(accounts.length){
      setCurrentAccount(accounts[0]);
    }else{
      console.log('No accounts found');
    }

    console.log(accounts);
    } catch (error) {
      throw new Error("No Ethereum Object");
    }
  }

  const connectWallet = async()=>{
    try {
      if(!ethereum) return alert('Please install metamask');
      const accounts = await ethereum.request({method:'eth_requestAccounts'});
      
      setCurrentAccount(accounts[0]);
    } catch (error) {
        throw new Error("No ethereum object.")
    }
  }

  const sendTransaction = async ()=>{
    try {

      if(!ethereum) return alert('Please install metamask');
      const {addressTo,amount,message} = formData;
      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);
      await ethereum.request({
        method: 'eth_sendTransaction',
        params:[{
          from:currentAccount,
          to:addressTo,
          gas:'0x5208',//hexadecimal //21000 Gwei //0.000021 ether
          value:parsedAmount._hex,
        }]
      });

      const transactionHash = await transactionContract.addToBlockchain(addressTo,parsedAmount,message);

      setisLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      setisLoading(false);
      setTransactionSuccess(true);
      console.log(`Success - ${transactionHash.hash}`);

      const transactionCount = await transactionContract.getTransactionCount();

      setTransactionCount(transactionCount.toNumber());

    } catch (error) {
      throw new Error("No ethereum object.")
    }
  }

  useEffect(()=>{
    checkWalletConnection();
  },[]);


  
  return(
    <TransactionContext.Provider value={{connectWallet,currentAccount,formData,setFormData,handleChange,sendTransaction,isLoading,transactionSuccess}}>
      {children}
    </TransactionContext.Provider>
  );
}



