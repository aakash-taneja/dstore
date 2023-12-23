import { useEffect, useState } from "react";
import "./Display.css";
import Modal from "./Modal";
import { toast } from "react-toastify";
const Display = ({ contract, account }) => {
  const [data, setData] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (account) getdata();
  }, [account]);

  const getdata = async () => {
    let dataArray;
    const Otheraddress = document.querySelector(".address").value;
    try {
      if (Otheraddress) {
        dataArray = await contract.display(Otheraddress);
        console.log(dataArray);
      } else {
        console.log(account);
        dataArray = await contract.display(account);
        console.log(account, dataArray);
      }
    } catch (e) {
      toast.error("You don't have access", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    const isEmpty = Object.keys(dataArray).length === 0;

    if (!isEmpty) {
      const str = dataArray.toString();
      const str_array = str.split(",");
      // console.log(str);
      // console.log(str_array);
      const images = str_array.map((item, i) => {
        console.log(item);
        return (
          <a href={item} key={i} target="_blank">
            <img key={i} src={item} alt="new" className="image-list" />
          </a>
        );
      });
      setData(images);
    } else {
      toast.success("No image to display", {
        position: toast.POSITION.TOP_RIGHT,
      });
      toast.success("Please upload image to share", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  return (
    <>
      <div class="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div> Total Images : {data.length}</div>
          <button className="center button" onClick={() => setModalOpen(true)}>
            Share
          </button>
        </div>
        <div className="image-list">{data}</div>

        {modalOpen && (
          <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
        )}
      </div>
      <div className="container" style={{ marginTop: "20px" }}>
        <div>Enter Address of anyone to view their images</div>
        <div class="row">
          <input
            type="text"
            placeholder="Enter Address"
            className="address"
          ></input>
          <button className="center button" onClick={getdata}>
            Get Data
          </button>
        </div>
      </div>
    </>
  );
};
export default Display;
