import abi from "./abi.json";
import { useState, useEffect } from "react";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import "./App.css";
import { ethers } from "ethers";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [initiateConnection, setInitiateConnection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const connectMetaMask = async () => {
      try {
        setIsLoading(true);
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
        window.ethereum.on("accountsChanged", () => {
          const [address] = account;
          setAccount(address);
        });
        window.ethereum.on("disconnect", (error) => {
          window.location.reload();
        });
        await newProvider.send("eth_requestAccounts", []);
        const signer = newProvider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0x29d10b3a8d20206019b40276255103b5197835e7";
        const newContract = new ethers.Contract(
          contractAddress,
          abi.abi,
          signer
        );
        setContract(newContract);
        setProvider(newProvider);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error.message);
      } finally {
        setIsLoading(false);
        // if (initiateConnection) {
        setInitiateConnection(false);
        // }
      }
    };

    if (initiateConnection) {
      connectMetaMask();
    }
  }, [initiateConnection]);
  useEffect(() => {
    console.log("accounnt", account);
  }, [account]);

  const disconnectMetaMask = async () => {
    try {
      // await window.ethereum.disconnect();
      await provider.send("eth_requestAccounts", []);
      setAccount("");
      setProvider(null);
      setInitiateConnection(false);
    } catch (error) {
      console.error("Error disconnecting from MetaMask:", error.message);
    }
  };
  const handleScroll = () => {
    const displaySection = document.getElementById("display");
    displaySection.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <div className="App">
        <nav>
          {/* <img src="../public/dstore01.png"} /> */}
          <div className="logo"></div>
          {account ? (
            <>
              <button class="button" onClick={disconnectMetaMask}>
                Disconnect Wallet
              </button>
            </>
          ) : (
            <button
              class="button"
              onClick={() => setInitiateConnection(true)}
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : "Connect MetaMask"}
            </button>
          )}
        </nav>
        <div
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h1 style={{ color: "white" }}>
            D-Store : Decentralized Image Storage and distribution
          </h1>
          <h4
            style={{ color: "white", marginBottom: "10px", color: "#f6f6f6" }}
          >
            To use the dApp - Connect your wallet, Switch to Goerli testnet and
            add test ethers form <a href="https://goerlifaucet.com/"> here</a>
          </h4>
          <div class="bg"></div>
          <div class="bg bg2"></div>
          <div class="bg bg3"></div>
          <p style={{ color: "white" }}>
            Account : {account ? account : "Not connected"}
          </p>

          <div class="row">
            <div>
              <FileUpload
                account={account}
                provider={provider}
                contract={contract}
              ></FileUpload>
            </div>
            <div class="image-vector"></div>
            <div onClick={handleScroll}>
              <div class="arrow">
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
        <div id="display">
          <Display contract={contract} account={account}></Display>
        </div>
        {/* <button onClick={notify}>Notify</button> */}
        <ToastContainer />
        {/* <ToastContainer /> */}
      </div>
    </>
  );
}

export default App;
