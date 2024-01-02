import lighthouse from "@lighthouse-web3/sdk";
import { config } from "../config/index";
import { IUploadProgressCallback } from "@lighthouse-web3/sdk/dist/types";

export const progressCallback = (progressData) => {};

export const deploytoLightHouse = async (e, progressCallback) => {
  console.log(e);
  const output = await lighthouse.upload(
    e,
    config.LIGHTHOUSE_API_KEY,
    false,
    undefined
    // progressCallback
  );
  console.log("lighthouse output", output);
  return output.data.Hash;
};

export const uploadTextToLighthouse = async (text) => {
  const response = await lighthouse.uploadBuffer(
    text,
    config.LIGHTHOUSE_API_KEY
  );
  //console.log("https://gateway.lighthouse.storage/ipfs/" + response.data.Hash);
  return response.data.Hash;
};

export const displayImage = (cid) => {
  return `https://gateway.lighthouse.storage/ipfs/${cid}`;
};
