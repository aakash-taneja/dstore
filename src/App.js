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
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0x29d10b3a8d20206019b40276255103b5197835e7";
        const contract = new ethers.Contract(contractAddress, abi.abi, signer);
        //console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);

  const notify = () => {
    toast.success("Success Notification !", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };
  return (
    <>
      <div className="App">
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
            <a href="#display">
              <div class="arrow">
                <span></span>
                <span></span>
              </div>
            </a>
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
