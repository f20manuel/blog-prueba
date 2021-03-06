import React, { useState , useEffect } from 'react'
import { api, public_path } from '../../../helpers.js'
import { MDBDataTableV5 } from 'mdbreact'
import { Image, Button, Icon, Card, Popup } from 'semantic-ui-react'
import Axios from 'axios'
import { links } from '../../../enviroment.js'
import Head from 'next/head'
import MainAdmin from '../../../components/MainAdmin.js'
import Router from 'next/router'

export default function index() {
    const [loading, setLoading] = useState(false)
    const [columns, setColumns] = useState([
        { label: 'ID', field: 'id', width: 100 },
        { label: 'Imágen', field: 'image', width: 100 },
        { label: 'Categoría', field: 'category', widht: 100},
        { label: 'Título', field: 'title', width: 200},
        { label: 'Descripción', field: 'description', width: 400},
        { label: 'Acciones', field: 'actions', width: 100 }
    ])

    const [dataTable, setDataTable] = useState({
        columns: columns,
        rows: [],
    })

    const [breadcrumbs, setBreadcrumbs] = useState([
        { key: 'escritorio', content: 'Escritorio', href: '/blog-admin'},
        { key: 'articulos', content: 'Artículos', active: true},
    ])

    useEffect(() => {
        setLoading(true)
        const token = localStorage.getItem('accessToken')

        if (!token) Router.replace('/login')
        
        const getPosts = async (token) => {
            await Axios.get(api('posts'), {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(response => {
                const posts = response.data.posts
                if(posts) handlePosts(posts, token)
                setLoading(false)
            }).catch(error => console.log(error))
        }

        if (token) getPosts(token)
    }, [])

    const handlePosts = (posts, token) => {
        const rows = []
        if(posts) {
            posts.forEach(post => {
                console.log(post)
                rows.push({
                    id: post.id,
                    image: (<Image src={public_path('post/100/' + post.image)} avatar />),
                    category: post.category.name,
                    title: post.title,
                    description: post.shortDescription,
                    actions: (
                        <Button.Group icon>
                            <Popup content='Editar' trigger={
                                <Button primary="true" onClick={() => Router.push('/blog-admin/articulos/editar-articulo/' + post.id)}>
                                    <Icon name='edit' />
                                </Button>
                            }/>
                            <Button onClick={() => deletePostAsk(post.id)}>
                                <Icon name='delete' />
                            </Button>
                        </Button.Group>
                    )
                })
            })
        }

        setDataTable({ columns: columns, rows: rows })
    }

    const deletePost = async (id) => {
        const token = localStorage.getItem('accessToken')
        await Axios.post(api('posts/') + id, {
            _method: 'DELETE'
        }, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            alert('Artículo eliminada con éxito!')
            setLoading(false)
            Router.reload()
        }).catch(errors => console.log(errors))
    }

    const deletePostAsk = (id) => {
        const DELETE = confirm('¿Estas segur@ de que quieres eliminar este artículo?')
        setLoading(true)
        if (DELETE) deletePost(id)
    }

    return (
        <>
            <Head>
                <title>Artículos - blog de prueba</title>
                <link rel="icon" href="/favicon.ico" />
                {links.map((link, index) => (
                    <link key={index} rel="stylesheet" href={link.url} />
                ))}
            </Head>
            <MainAdmin currentPage="Artículos" breadcrumbs={breadcrumbs}>
                <Button className="mb-3" floated='right' primary onClick={() => window.location.href = '/blog-admin/articulos/nuevo-articulo'}>
                    <Icon name="plus" />
                    Nuevo artículo
                </Button>
                <Card className="w-100">
                    <Card.Content>
                        <MDBDataTableV5
                            hover
                            scrollX
                            entriesOptions={[5, 20, 25]}
                            entries={5}
                            pagesAmount={4}
                            data={dataTable}
                            searchTop
                            searchBottom={false}
                        />
                    </Card.Content>
                </Card>
            </MainAdmin>
        </>
    )
}
