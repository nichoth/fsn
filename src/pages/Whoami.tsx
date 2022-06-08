import React, { BaseSyntheticEvent, FunctionComponent, useState } from "react"
import Layout from "../components/Layout"
import './whoami.css'

type WhoamiProps = {
    who: ''
}

const Whoami: FunctionComponent<WhoamiProps> = () => {
  return (
    <Layout>
        <h2>who am i?</h2>
    </Layout>
  )
}

export default Whoami
