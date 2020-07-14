import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import HeaderComponent from '../components/Header'
import { links } from '../enviroment'
import { api, public_path } from '../helpers'
import { Card } from 'react-bootstrap'
import Router from 'next/router'
import { Button, Image, Segment, Divider } from 'semantic-ui-react'

import moment from 'moment'

function Home(props) {
  const { posts } = props

  console.log(posts)

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
      <div className="row mx-0">
        <div className="col-md-8">
          {posts.map((post, index) => (
            <div key={index} className="col-md-5">
                <Segment>
                  <Image src={public_path('post/512/' + post.image)} wrapped />
                  <h2>{post.title}</h2>
                  <small>{moment(post.created_at).locale('es').format('LL')}</small>
                  <p>{post.shortDescription}</p>
                  <Divider/>
                  <Button onClick={() => window.location.href = post.slug} className="w-100" primary="true">Ver</Button>
                </Segment>
            </div>
          ))}
        </div>
        <div className="col-md-4">
          <h4>Más artículos</h4>
          {posts.map((post, index) => (
            <Segment onClick={() => console.log('hola')} key={index}>
              <div className="d-flex">
                <Image src={public_path('post/100/' + post.image)} className="mr-2" wrapped />
                <div>
                  <h4>{post.title}</h4>
                  <small>{moment(post.created_at).locale('es').format('LL')}</small>
                  <p>{post.shortDescription}</p>
                </div>
              </div>
              <Divider/>
              <Button onClick={() => window.location.href = post.slug} className="w-100" primary="true">Ver</Button>
            </Segment>
          ))}
        </div>
      </div>
    </div>
  )
}

Home.getInitialProps = async () => {
    const res = await fetch(api('posts'))
    const json = await res.json()
    return { posts: json.posts }
}

export default Home
