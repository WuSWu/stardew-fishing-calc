'use client'
import '../globals.css';
import Head from 'next/head'

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <link rel="icon" href="/stardew-fishing-calc/assets/tiles/tile900.png" sizes="any" />
                <title>Stardew Valley Fishing Calculator</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
            </Head>
            <Component {...pageProps} />
        </>
    )
}