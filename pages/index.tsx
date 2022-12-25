import type { NextPage } from "next";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import AddressForm from "../components/AddressForm";
import * as web3 from "@solana/web3.js";

const Home: NextPage = () => {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [executable, setExecutable] = useState(false);

  const addressSubmittedHandler = (address: string) => {
    try {
      const key = new web3.PublicKey(address);
      setAddress(key.toBase58());
      const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
      connection.getBalance(key).then((balance) => {
        setBalance(balance / web3.LAMPORTS_PER_SOL);
      });
      connection.getAccountInfo(key).then((info) => {
        setExecutable(info?.executable ?? false);
      });
    } catch (error) {
      setAddress("");
      setBalance(0);
      setExecutable(false);
      alert(error);
    }
  };

  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        <p>Solana Account Info App</p>
        <AddressForm handler={addressSubmittedHandler} />
        <p>{`Address: ${address}`}</p>
        <p>{`Balance: ${balance} SOL`}</p>
        <p>{`Is account executable : ${executable ? "Yes" : "No"}`}</p>
      </header>
    </div>
  );
};

export default Home;
