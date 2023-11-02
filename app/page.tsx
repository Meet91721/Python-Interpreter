import styles from './page.module.css'

import Header from '@/components/header/header'

export default function Home() {
  return (
    <>
      <Header />
      <main className={styles.main} >
        <div
          className={styles.textarea} style={{ height: '90vh', display: 'flex', justifyContent: 'center' }}>
          <div
            style={{ height: '60vh', width: '70vw', border: '2px grey solid', marginTop: "auto", marginBottom: "auto", display: 'flex', borderRadius: '40px' }}>
            <div style={{ margin: "auto", textAlign: 'center', fontSize: 'larger', opacity: '1' }}>
              <span>
                <strong style={{ textDecorationStyle: 'double', fontSize: '35px' }}>
                  <u>Python Interpretor</u>
                </strong>
              </span>
              <pre >
                20BCE012 AMIN MEET
                <br />
                20BCE024 AVI TAYAL
                <br />
                20BCE070 DWIJ BAVISI
              </pre>
            </div>
          </div>

        </div>
      </main >
    </>
  )
}
