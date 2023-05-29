import React, { useState,useEffect } from 'react';
import axios from "axios"
import { useHistory } from "react-router-dom";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { connectWallet,getCurrentWalletConnected,mintNFT } from "./interact.js";

import  './mintCSS.css'
const _lang="fr";

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);
function Mint(props)  {
	
const [walletAddress, setWallet] = useState("");
const [status, setStatus] = useState("");
const [name, setName] = useState("");
const [description, setDescription] = useState("");
const [url, setURL] = useState("");
 useEffect(() => { 
 async function fetchData() {
      const {address, status} = await getCurrentWalletConnected();
	   setWallet(address);
    setStatus(status); 
    addWalletListener();
  }
  fetchData();
    
        }, []);
const history = useHistory();

 const connectWalletPressed = async () => { //TODO: implement
     console.log("ok");
	 const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };
  const addWalletListener = () => {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        setWallet(accounts[0]);
        setStatus("Write a message in the text-field above.");
      } else {
        setWallet("");
        setStatus("Connect to Metamask using the top right button.");
      }
    });
  } else {
    setStatus(
      <p>
        {" "}
        ??{" "}
        <a target="_blank" href="https://metamask.io/download.html">
          You must install Metamask, a virtual Ethereum wallet, in your
          browser.
        </a>
      </p>
    );
  
}
}
  const onMintPressed = async () => { //TODO: implement
    console.log("ok");
    const { status } = await mintNFT(1,4);
    setStatus(status);
  };



return (
	 <>
	  <div className="main">

       

        <section className="sign-in">
            <div className="container">
                <div className="signin-content">
                    <div className="signin-image">
                        <figure><img src="images/9C33A1F7-05A7-453A-A694-83F4A6AD8240 1.png" alt="sing up image" /></figure>
                        <a href="#" className="signup-image-link">Hegemony DNA</a>
                    </div>

                    <div className="signin-form">
                        <h2 className="form-title">Hegemony DNA</h2>
                            <div className="form-group">
                                <label for="your_name"><i className="zmdi zmdi-account material-icons-name"></i></label>
                                <input type="text" name="your_name" id="your_name" placeholder="Number of NFT"/>
                            
							</div>
                           
                           
                            <div className="form-group form-button">
                                <input type="submit" name="signin" id="signin" className="form-submit" value="Log in"/>
                            </div>
                        
                    </div>
                </div>
            </div>
        </section>

    </div>
	 </>

)

}


export default Mint;