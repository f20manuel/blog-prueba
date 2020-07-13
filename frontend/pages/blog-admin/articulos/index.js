import React, { useState , useEffect } from 'react'
import { api, public_path } from '../../../helpers.js'
import { MDBDataTableV5 } from 'mdbreact'
import { Image, Button, Icon, Card, Popup } from 'semantic-ui-react'
import Axios from 'axios'
import { links } from '../../../enviroment.js'
import Head from 'next/head'
import MainAdmin from '../../../components/MainAdmin.js'
import { Container } from 'react-bootstrap'

export default function index() {
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(false)
    const [columns, setColumns] = useState([
        { label: 'ID', field: 'id', width: 100 },
        { label: 'Imágen', field: 'image', width: 100 },
        { label: 'Categoría', field: 'category', widht: 100},
        { label: 'Nombre', field: 'name', width: 200},
        { label: 'Descripción', field: 'description'},
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
        const token = localStorage.getItem('accessToken')
        if (!token) window.location.href = '/login'

        setToken(token)
    }, [])

    useEffect(() => {
        setLoading(true)
        
        const getPosts = async (token) => {
            await Axios.get(api('posts'), {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(response => {
                const posts = response.data.posts
                if(posts) handleposts(posts)
                setLoading(false)
            }).catch(error => console.log(error))
        }

        if (token) getPosts(token)
    }, [token])

    const handlePosts = (posts) => {
        const rows = []
        if(posts) {
            posts.forEach(post => {
                rows.push({
                    id: post.id,
                    image: (<Image src={public_path('post/100/' + post.image)} avatar />),
                    name: post.name,
                    description: post.description,
                    actions: (
                        <Button.Group icon>
                            <Popup content='Editar' trigger={
                                <Button primary="true" onClick={() => window.location.href = '/blog-admin/articulos/editar-articulo/' + post.id}>
                                    <Icon name='edit' />
                                </Button>
                            }/>
                            <Button>
                                <Icon name='delete' />
                            </Button>
                        </Button.Group>
                    )
                })
            })
        }

        setDataTable({ columns: columns, rows: rows })
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
