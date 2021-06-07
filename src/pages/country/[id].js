import Head from "next/head";
import styles from "../../styles/PlaylistPage.module.css";
import Link from "next/link";
import { connectToDatabase } from "../../../util/mongodb";
import React, { useState, useEffect } from "react";
import countryMap from "../../../Data/countryMap.json";
import GetCountryLists from "../../BackendFunctions/GetCountryLists";
export default function Country({ countryID, countryName }) {
  const [token, setToken] = useState("");
  const [playlists, setPlaylists] = useState(null);
  const [tokenState, setTokenState] = useState(false);
  useEffect(async () => {
    setTokenState(true);
    if (!tokenState) {
      let token = await fetch(
        `${process.env.NEXT_PUBLIC_PROD_URL}/api/auth/getToken?Type=Anon`
      );
      let tokenData = await token.json();
      console.log(tokenData);
      const countryLists = await GetCountryLists(countryID);
      setPlaylists(countryLists);
    }
  });

  return (
    <>
      <div className={styles.container}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link
            href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
            rel="stylesheet"
          ></link>
          <link rel="preconnect" href="https://fonts.gstatic.com"></link>
          <link
            href="https://fonts.googleapis.com/css2?family=Codystar&display=swap"
            rel="stylesheet"
          ></link>
        </Head>
      </div>

      <div className={styles.playlistHeader} style={{ fontSize: 70 }}>
        <div>
          <Link href="/">
            <a>
              <button className={styles.returnButton} style={{ fontSize: 20 }}>
                Return to main page
              </button>
            </a>
          </Link>
        </div>
        <div style={{ marginTop: "1.5rem" }}>{countryName}</div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  //console.log(context.query);
  const { db } = await connectToDatabase();

  //Enable page access to both country code and names.
  let id;
  let countryName;
  if (countryMap[context.query.id]) {
    id = context.query.id;
    countryName = countryMap[id];
  } else {
    const getKeyByValue = (obj, value) =>
      Object.keys(obj).find((key) => obj[key] === value);
    id = getKeyByValue(countryMap, context.query.id);
    if (id) {
      countryName = context.query.id;
    } else {
      throw new Error("Country Not Found");
    }
  }

  return {
    props: {
      countryID: id,
      countryName: countryName,
    },
  };
}