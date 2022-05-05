import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import './App.css';

import Timeline from './Timeline';
import SocialMedia from './SocialMedia';
import AboutGrid from './AboutGrid';
import IconsGrid from './IconsGrid';

import Roadmap from './Roadmap';
import HouseOfHolders from './HouseOfHolders';
import HomePage from './Home';
import Copy from './copy';
import { BrowserRouter } from "react-router-dom";
import { HashLink as Link } from 'react-router-hash-link';

// Everything from here to the next comment represent the backend that I did not create, but got public permission to use------------------

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: .59vw;
  margin-top:-.54vw;
  font-size:.8vw;
  border: none;
  border-radius:.16vw;
  background-color: var(--secondary);
  padding: .54vw;
  font-weight: bold;
  color: var(--secondary-text);
  width: 10.8vw;
  cursor: pointer;
  box-shadow: 0px .324vw 0px -.108px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px .324vw 0px -.108px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px .324vw 0px -.108px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;


export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

export const testFunction = () => {
  return(console.log('hey hey'));
}

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 20) {
      newMintAmount = 20;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  {/*--This is where I coded from scratch including using ternary operator with blockchain.account to have text react to successful sign in-------------------------------------------------------------------------------------------*/}

  const [navbar, setNavbar] = useState(false);

  const changeBackground = () => {
    if (window.scrollY >=10) {
      setNavbar(true);
    } else{
      setNavbar(false);
    }
  };

  window.addEventListener('scroll', changeBackground);

  const [toggle, setToggle] = useState(false);

  const handleClick = () => {
    console.log(toggle);
    setToggle(!toggle);
    
  }

  const [minttoggle, setMintToggle] = useState(false);

  const handleMintClick = () => {
    setMintToggle(!minttoggle);
    console.log(minttoggle);
  }


  return (
    <BrowserRouter>
    <div className="main">
        <div className="secondNav">
          <div className={toggle ? "mobileButton1" : "mobileButton"} onClick={handleClick}>
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
          <div className={toggle ? "navbarMobile":"navbarMobile1"}>
            
              <div className="topMobileNav">
              <Link to="#home"><img style={{width:'65vw',height:'32vw',marginLeft:'13vw', marginTop:'-3vw'}}src="config/images/Canvas.png" /></Link>
               <div className={toggle ? "mobileButton1" : "mobileButton"} onClick={handleClick}>
                <ul>
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
               </div>
            </div>
            <ul>
                 
                 <Link className="link2" to='#about'>ABOUT</Link>
                 <Link className="link2" to='#icons'>ICONS</Link>
                 <Link className="link2" to='#house'>HOUSE OF HOLDERS</Link>
                 <Link className="link2" to='#roadmap'>ROADMAP</Link>
                 <Link className="link2" to='#team'>TEAM</Link>
                {/* <Link className="link2" to='#mint'>MINT</Link> */}
                 <li className="link3"><button className="metamaskMobile" onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}>{blockchain.account ? 'CONNECTED' : 'CONNECT WALLET'}</button></li>
                 {/*<Link className="link2" to="">BUY NOW</Link>*/}
            </ul>
          </div>
          </div>
       
          <div className={navbar ? 'nav active' : 'nav'} >
            <Link className={navbar ? "title2 active":"title2"} to="#home"><div> <h1>Untitled</h1></div></Link>
            
              <div className="navList">
               <ul>
                 {/*<li><Link className={navbar ? 'link active' : 'link'} to='#home'>HOME</Link></li>*/}
                 <li><Link className={navbar ? 'link active' : 'link'} to='#about'>ABOUT</Link></li>
                 <li><Link className={navbar ? 'link active' : 'link'} to='#icons'>ICONS</Link></li>
                 <li><Link className={navbar ? 'link active' : 'link'} to='#house'>HOUSE OF HOLDERS</Link></li>
                 <li><Link className={navbar ? 'link active' : 'link'} to='#roadmap'>ROADMAP</Link></li>
                 <li><Link className={navbar ? 'link active' : 'link'} to='#team'>TEAM</Link></li>
                 <li><Link className={navbar ? 'link active' : 'link'} onClick={handleMintClick} to='#buyContainer'>BUY NOW</Link></li>
                 <li><button className={navbar ? 'metamask active' : "metamask"} 
                 onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}>{blockchain.account ? 'CONNECTED' : 'CONNECT WALLET'}</button>
                      {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <p className={navbar ? 'walletInfo active' : 'walletInfo'}>
                          {blockchain.errorMsg}
                          </p>
                      </>
                    ) : null}
                    
                    </li>
                </ul>
              
             </div>
          <span className={navbar ? 'walletInfo active' : 'walletInfo'}>{blockchain.account}</span>
          
          </div> 
        
        <SocialMedia />
        <HomePage />
        <AboutGrid />
        
        <IconsGrid />
        <HouseOfHolders />
        <Roadmap />
        <Timeline />
        
        <Copy />

       
        
        <div id="mint" className={minttoggle ? "mintTab":"noMint"}>
        
          
         {/*-----------------------------------------------This was done by HashLips except for the commenting out----------------------------------------------------------------------------------------*/}

          <s.Container           
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: '2vw',
              borderRadius: 24,
              border: ".3vw solid var(--primary)",
              boxShadow: "0px .4vw .6vw .1vw rgba(0,0,0,0.7)",
            }}
          >
            
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: '3.5vw',
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}.
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Excluding gas fees.
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    {/*
                    It was requested of me to not reveal connect option on the 'mint' tab-------------------------------
                    
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT WALLET
                    </StyledButton>  
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                        ) : null} */}
                  </s.Container>        
                ) 
                : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        
                      >
                        {claimingNft ? "BUSY" : "BUY"}
                      </StyledButton>
                    </s.Container>          
                  </>
                )}
              </>
            )}
            <s.SpacerLarge />
            <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            Please make sure you are connected to the right network (
            {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
            Once you make the purchase, you cannot undo this action.
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
            successfully mint your NFT. We recommend that you don't lower the
            gas limit.
          </s.TextDescription>
          </s.Container>
          <s.SpacerLarge />
          
          
        
        </div>
        <s.SpacerLarge />
         
    </div>
    </BrowserRouter>
          
  );
}

export default App;

