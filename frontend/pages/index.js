import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import HeaderComponent from '../components/Header'
import { links } from '../enviroment.js'

export default function Home() {
  const [token, setToken] = useState('')
  useEffect(() => {
    setToken(localStorage.getItem('accessToken'))
  }, [])

  if(token) window.location.href = '/blog-admin'

  return (
    <div className="container">
      <Head>
        <title>Blog de prueba</title>
        <link rel="icon" href="/favicon.ico" />
        {links.map((link, index) => (
          <link key={index} rel="stylesheet" href={link.url} />
        ))}
      </Head>
      <HeaderComponent title='Blog de prueba' />
    </div>
  )
}
