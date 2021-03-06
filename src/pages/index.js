import Head from "next/head";
import Header from "../components/HomePage/PageHeader";
import styles from "../styles/Home.module.css";
//import { S3 } from "@aws-sdk/client-s3";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Countrycomplete from "../components/Countrycomplete";
import AuthHelper from "../BackendFunctions/AuthHelper";
import getAccessToken from "../components/HomePage/getAccessToken";
import getRefreshToken from "../components/HomePage/getRefreshToken";
import DiscoverButton from "../components/HomePage/DiscoverButton";
import RandomPlaylist from "../components/HomePage/RandomPlaylist";
import CustomPlaylist from "../components/HomePage/CustomPlaylist";
import { config, dom } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
export default function Home() {
  const [token, setToken] = useState("");
  const [ButtonState, setButtonState] = useState("Visible");
  const [tokenState, setTokenState] = useState(false);
  const [searchMode, setSearchMode] = useState("Country");
  useEffect(async () => {
    if (window.location.search.length > 10) {
      let hashParams = {};
      let a,
        b = /([^&;=]+)=?([^&;]*)/g,
        c = window.location.search.substring(1);
      while ((a = b.exec(c))) {
        hashParams[a[1]] = decodeURIComponent(a[2]);
      }
      if (!tokenState) {
        setTokenState(true);
        let AccessToken = await getAccessToken(hashParams.code);
        setToken(AccessToken);
      }
      window.history.replaceState(null, "", "/");
    } else if (localStorage.getItem("TokenTime")) {
      let tempTime = localStorage.getItem("TokenTime");
      const Hour = 1000 * 60 * 60;
      let HourAgo = Date.now() - Hour;
      if (tempTime < HourAgo) {
        console.log("Token Refreshed");
        let refToken = localStorage.getItem("RefreshToken");
        localStorage.removeItem("Token");
        localStorage.removeItem("TokenTime");
        getRefreshToken(refToken);
      }
    }
  });

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
          rel="stylesheet"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Codystar&display=swap"
          rel="stylesheet"
        ></link>
        <style>{dom.css()}</style>
      </Head>
      <div className={styles.container}>
        <Header />
        <AuthHelper token={token} />
        <div className="searchBody">
          <Countrycomplete
            searchButton={false}
            searchType={searchMode}
            updateSearchMode={setSearchMode}
            updateButtonState={setButtonState}
            pageType={"Home"}
          />
        </div>

        <div className="functionButtons" style={{ visibility: ButtonState }}>
          <DiscoverButton discoverMode={searchMode} />
          <RandomPlaylist />
          <CustomPlaylist />
        </div>
      </div>
    </>
  );
}
