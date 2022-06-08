import React, { BaseSyntheticEvent, FunctionComponent, useState } from "react"
import Layout from "../components/Layout"
import { useWebnative, WebnativeContext } from "../context/webnative"
import './whoami.css'

type WhoamiProps = {
}

const Whoami: FunctionComponent<WhoamiProps> = () => {
    const wn = useWebnative()

    return (
        <Layout className="whoami">
            <h2>who am i?</h2>
            <dl>
                <dt>username</dt>
                <dd>{wn.username}</dd>
            </dl>
        </Layout>
    )
}

export default Whoami
