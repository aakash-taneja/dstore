import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";
import { toast } from "react-toastify";

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  const JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0MjA5ZTQyNi1mZWZhLTQ2ZTQtYTI2Zi1mYTYxYzcxODg5ODUiLCJlbWFpbCI6ImFha2FzaHRhbmVqYTEyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI0OGVmZTkzMjIxZDk1ZTkyYWNlNSIsInNjb3BlZEtleVNlY3JldCI6IjZlNWE4ZWI2MGQ4OTc0Njc2NmNiMzNlM2ZmYTk0M2Y3OTc5MmE3ZjU3ZDJmNTU5MDE4NmNmN2IwZjNhYjllYTAiLCJpYXQiOjE3MDMwOTEyMjR9.qUZ-gGToK7IVq9Io49_p9Pc6yOx1kBH-trpLTjoZmqY`;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            maxBodyLength: "Infinity",
            headers: {
              "Content-Type": `multipart/form-data`,
              Authorization: `Bearer ${JWT}`,
            },
          }
        );
        const ImgHash = `https://ipfs.io/ipfs/${resFile.data.IpfsHash}`;
        toast("Wait for txn to complete", {
          position: "top-right",
          autoClose: 5000,
          type: "success",
        });
        await contract.add(account, ImgHash);
        toast.success("Successfully Image Uploaded", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setFileName("No image selected");
        setFile(null);
      } catch (e) {
        toast.error("Unable to upload image", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }

    setFileName("No image selected");
    setFile(null);
    return e;
  };
  const retrieveFile = async (e) => {
    const data = e.target.files[0]; //files array of files object
    console.log(data);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
    e.preventDefault();
    // console.log("calling submit");
    // const res = await handleSubmit(e);
    // console.log("submit done", res);
  };

  return (
    <div className="top">
      <div style={{ marginBottom: "20px" }}>
        Select an image to store permanently{" "}
      </div>
      {/* <div onClick={handleclick}>toast</div> */}
      <form className="form" onSubmit={handleSubmit}>
        <div
          style={{ display: "flex", flexDirection: "column", width: "20rem" }}
        >
          <span className="textArea">{fileName}</span>
          <label htmlFor="file-upload" className="choose">
            Choose Image
          </label>
          <input
            disabled={!account}
            type="file"
            id="file-upload"
            name="data"
            onChange={retrieveFile}
          />
        </div>
        <button type="submit" className="upload" disabled={!file}>
          Upload File
        </button>
      </form>
    </div>
  );
};
export default FileUpload;
