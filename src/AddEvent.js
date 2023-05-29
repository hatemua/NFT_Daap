import React, { useState,useEffect,useRef } from 'react';
import axios from "axios"
import { useHistory } from "react-router-dom";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { connectWallet,getCurrentWalletConnected,AddEventC } from "./interact.js";

const _lang="fr";

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);
function AddEvent()  {
	const [TicketImage,setTicketImage] = useState({});
	const [previewImg,setPreviewImg] = useState("");
	const [Title,setTitle] = useState("");
	const [Description,setDescription] = useState("");
	const [MaxPart,setMaxPart] = useState("");
	const [Status,setStatus] = useState(false);
	const [walletAddress, setWallet] = useState("");
	const [TXadding, setTXadding] = useState("");
	const [AddedEventBlock,setAddedEventBlock] = useState(false);
	const [SuccessEventBlock,setSuccessEventBlock] = useState(false);

 useEffect(() => { 
 
    
        }, []);
		

		
const history = useHistory();

 const hiddenFileInput = useRef(null);
  
  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  const AddEventChain = async () => { //TODO: implement
    console.log("ok");
    const { success,txHash,status } = await AddEventC(MaxPart,"1",Description,Title);
	setAddedEventBlock(success);
	setTXadding(txHash);
	console.log(status);
  
  };

  const uploadImageIpfs = () => {
  console.log("OK");
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
     
    //we gather a local file for this example, but any valid readStream source will work here.
    let data = new FormData();
    data.append('file', TicketImage);

    //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
    //metadata is optional
    const metadata = JSON.stringify({
        name: 'testname',
        keyvalues: {
            exampleKey: 'exampleValue'
        }
    });
    data.append('pinataMetadata', metadata);

    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 2
                }
            ]
        }
    });
    data.append('pinataOptions', pinataOptions);

    return axios
        .post(url, data, {
            maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: "e768f2855b3a19dbdb11",
                pinata_secret_api_key: "920abc96c68df315ad90f4ebe564d4d7ec2a247ad1d246baf738c75e0ad38d10"
            }
        })
        .then(function (response) {
			console.log(response);
            //handle response here
        })
        .catch(function (error) {
            //handle error here
        });
 
};
  
  
  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file 
  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    setTicketImage(fileUploaded);
	setPreviewImg(URL.createObjectURL(fileUploaded));
  };
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
return (
	<>
	  <Box  style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100%',width:"90%"}}>
      <Card variant="outlined" style={{height: '70%',width:"80%"}}>
	<React.Fragment>
    <CardContent style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
	      		<Button variant="contained" onClick={async () => {await connectWalletPressed();}}>{walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}</Button>

		<Stack direction="row" spacing={2}>
			
			
			<Stack spacing={2}>
				<Button variant="contained" onClick={handleClick}>upload image</Button>
				 <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange} 
        style={{display: 'none'}} 
      />
				 <Box
    component="div"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
	style={{width:500,height:"100%",borderStyle: "dashed"}}
  >
			<div>
				<img src={previewImg} style={{width:400,height:200}}></img>
				<h4>Ticket Image</h4>
			</div>
			</Box>
			</Stack>
			<div>
				<Stack spacing={2}>
					<TextField id="outlined-basic" label="Title" variant="outlined" fullWidth onChange={e => setTitle(e.target.value)}/>
					<TextField id="outlined-basic" label="Description" multiline
          maxRows={4} variant="outlined" fullWidth onChange={e => setDescription(e.target.value)}/>
					<TextField id="outlined-basic" label="maximum participations" variant="outlined" fullWidth onChange={e => setMaxPart(e.target.value)}/>
					<TextField id="outlined-basic" label="Topic" variant="outlined" fullWidth />
					<TextField id="outlined-basic" label="Mentor" variant="outlined" fullWidth />
					<TextField
        id="datetime-local"
        label="Next appointment"
        type="datetime-local"
        defaultValue="2017-05-24T10:30"
        sx={{ width: 250 }}
        InputLabelProps={{
          shrink: true,
        }}
      />
				</Stack>
			</div>
		</Stack>
    </CardContent>
    <CardActions style={{ justifyContent: 'center',    flex: 1}}>
	        {!AddedEventBlock &&
      		<Button variant="contained" onClick={async () => {await AddEventChain();
			
			}}>Adding Event</Button>
			}
    </CardActions>
  </React.Fragment>
  </Card>
    </Box>
	</>

)

}


export default AddEvent;