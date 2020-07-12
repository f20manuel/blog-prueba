const { Ref } = require("semantic-ui-react");

import React from 'react'
import { links } from '../../enviroment';
import Head from 'next/head';
import MainAdmin from '../../components/MainAdmin';

export default function index() {
    return (
        <>
            <Head>
                <title>Escritorio</title>
                <link rel="icon" href="/favicon.ico" />
                {links.map((link, index) => (
                <link key={index} rel="stylesheet" href={link.url} />
                ))}
            </Head>
            <MainAdmin currentPage="Escritorio" />
        </>
    )
}
