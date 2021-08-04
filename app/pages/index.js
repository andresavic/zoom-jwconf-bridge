import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Home() {

  async function sendCommand(command) {
    const rawResponse = await fetch('/api/jwconf/' + command, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const content = await rawResponse.json();
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Zoom JWConf Bridge</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Zoom JWConf Bridge
        </h1>

        {// eslint-disable-next-line
        }<a className={styles.vnc} href="/api/jwconf/vnc" target="_blank">VNC Session</a>

        <button onClick={() => { sendCommand('start'); }} className={styles.startButton}>Start</button>


        <button onClick={() => { sendCommand('stop'); }} className={styles.stoppButton}>Stopp</button>
      </main>
    </div>
  )
}