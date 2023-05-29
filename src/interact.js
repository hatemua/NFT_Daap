import { useEffect, useState } from "react";

import { contractABI } from './abi';
import { EventAbi } from './EventAbi';
const alchemyKey="https://eth-mainnet.g.alchemy.com/v2/9YkULSmxC2HB8TD7N01E0NMceYtP9KUh";
const TestnetRPC= "https://sepolia.infura.io/v3/";
const alchemyKeyPolygon="https://polygon-rpc.com";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const {ethers, Wallet} = require("ethers");

// const web3 = createAlchemyWeb3(alchemyKey);
const web3 = createAlchemyWeb3(alchemyKey);

const contractAddress = "0xf60e4ff7931a72b1f821f44ae68a1f9bfaabb675";
const EventcontractAddress = "0x643A113A4FE9C003966B4D2Fecd195828BA4f20C";

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "Write a message in the text-field above.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};


export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "" + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            {" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};
export const getNumberOfMints = async() => {
  const nftContract = await new web3.eth.Contract(contractABI, contractAddress);
  const mintNumber =await nftContract.methods.totalSupply().call()  ;
  console.log(mintNumber)
  return mintNumber;
}
export const mintNFT = async(_amount) => {
 //error handling
 console.log(window.ethereum.selectedAddress);
  const provider= new ethers.providers.JsonRpcProvider(alchemyKey);
	   const gasPrice = await provider.getFeeData();
     
  console.log(gasPrice.gasPrice.toString())
  const nftContract = await new web3.eth.Contract(contractABI, contractAddress);
  const balance =await nftContract.methods.balanceOf(window.ethereum.selectedAddress).call()  ;
  
  
  let amount = _amount;
  if ( Number(balance)==0)
  {
    amount=amount-1
  }
  const val= Number(amount * 0.004 * 1e18).toString(16);
    //set up your Ethereum transaction
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        maxPriorityFeePerGas: ethers.BigNumber.from(100000000).toHexString(),
        maxFeePerGas: web3.utils.toHex(gasPrice.maxFeePerGas.toString()),
        gas: ethers.BigNumber.from(100000).toHexString(),

		value: "0x" + val,
        'data': nftContract.methods.mint(_amount).encodeABI() //make call to NFT smart contract 
		//Web3.utils.toBN(Web3.utils.toWei(val, "ether")).toString(16)
    };
    console.log(transactionParameters)
    //sign transaction via Metamask
    try {
        const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
        // console.log(txHash);
        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }
}
export const mintNFTWC = async(connector,account,_amount) => {
 //error handling
  	const provider= new ethers.providers.JsonRpcProvider(alchemyKey);
	   const gasPrice = await provider.getFeeData();

  const nftContract = await new web3.eth.Contract(contractABI, contractAddress);
  const balance =await nftContract.methods.balanceOf(account).call()  ;

  
  let amount = _amount;
  if ( Number(balance)==0)
  {
    amount=amount-1
  }
  const val= Number(amount * 0.004 * 1e18).toString(16);
    //set up your Ethereum transaction
    const tx = {
        to: contractAddress, // Required except during contract publications.
        from: account, // must match user's active address.
        maxPriorityFeePerGas: ethers.BigNumber.from(100000000).toHexString(),
        maxFeePerGas: web3.utils.toHex(gasPrice.maxFeePerGas.toString()),
        gas: ethers.BigNumber.from(100000).toHexString(),
        
       
		value: "0x" + val,
        'data': nftContract.methods.mint(_amount).encodeABI() //make call to NFT smart contract 
		//Web3.utils.toBN(Web3.utils.toWei(val, "ether")).toString(16)
    };
    //sign transaction via Metamask
    try {
        connector
  .sendTransaction(tx)
  .then((result) => {
    // Returns transaction id (hash)
	console.log(result);
	 return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + result
        }
    
  })
  .catch((error) => {
    // Error returned when rejected
    console.error(error);
  });
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }
}

export const AddEventC = async(maxParticipations,Type,description,Title) => {
 //error handling
  
  const nftContract = await new web3Poly.eth.Contract(EventAbi, EventcontractAddress);
    //set up your Ethereum transaction
    const transactionParameters = {
        to: EventcontractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        gasPrice: web3Poly.utils.toHex(web3.utils.toWei('30','gwei')),  
        gas: "0x50000",
        'data': nftContract.methods.AddEvent(maxParticipations,Type,description,Title).encodeABI() //make call to NFT smart contract 
		//Web3.utils.toBN(Web3.utils.toWei(val, "ether")).toString(16)
    };
    console.log(transactionParameters)
    //sign transaction via Metamask
    try {
        const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
        // console.log(txHash);
        return {
            success: true,
			txHash : txHash,
            status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }
}

