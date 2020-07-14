import React, { useState, useEffect, useCallback } from 'react'
import Router, { useRouter } from 'next/router'
import { Segment, Image, Divider, Button } from 'semantic-ui-react'

import moment from 'moment'
import { api, public_path } from '../../helpers'
import Head from 'next/head'
import HeaderComponent from '../../components/Header'
import { links } from '../../enviroment'
import Axios from 'axios'

function index(props) {
    const { posts } = props

    const router = useRouter()
    const { slug } = router.query

    const [post, setPost] = useState({})

    const getPost = useCallback( async (slug) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            await Axios.post(api('posts/show'), { slug: slug }, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(response => {
                const getData = response.data.post
                setPost(getData)
            })
        } else {
            Router.replace('/login')
        }
    }, [])

    useEffect(() => {
        getPost(slug)
    }, [slug])

    return (
        <div className="container mb-5">
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
                <Image src={public_path('post/1280/' + post.image)} className="mr-2" wrapped />
                <h4>{post.title}</h4>
                <small>{post.created_at}</small>
                <div className="mt-5" dangerouslySetInnerHTML={{ __html: post.content}}></div>
            </div>
            <div className="col-md-4">
                <h4>Más artículos</h4>
                {posts.map((post, index) => (
                    <Segment onClick={() => console.log('hola')} key={index}>
                    <div className="d-flex">
                        <Image src={public_path('post/100/' + post.image)} className="mr-2" wrapped />
                        <div>
                        <h4>{post.title}</h4>
                        <small>{post.created_at}</small>
                        <p>{post.shortDescription}</p>
                        </div>
                    </div>
                    <Divider/>
                    <Button onClick={() => Router.push(post.slug)} className="w-100" primary="true">Ver</Button>
                    </Segment>
                ))}
            </div>
          </div>
        </div>
    )
}

index.getInitialProps = async () => {
    const res = await fetch(api('posts'))
    const json = await res.json()
    return { posts: json.posts }
}

export default index
