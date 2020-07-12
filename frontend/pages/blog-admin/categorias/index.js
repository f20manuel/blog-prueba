import React, { useState , useEffect } from 'react'
import { api, public_path } from '../../../helpers.js'
import { MDBDataTableV5 } from 'mdbreact'
import { Image, Button, Icon, Card } from 'semantic-ui-react'
import Axios from 'axios'
import { links } from '../../../enviroment.js'
import Head from 'next/head'
import MainAdmin from '../../../components/MainAdmin.js'
import { Container } from 'react-bootstrap'

export default function index() {
    const [token, setToken] = useState('')
    const [loading, setLoading] = useState(false)
    const [columns, setColumns] = useState([
        { label: 'ID', field: 'id' },
        { label: 'Imágen', field: 'image' },
        { label: 'Nombre', field: 'name' },
        { label: 'Descripción', field: 'description' },
        { label: 'Acciones', field: 'actions' }
    ])

    const [dataTable, setDataTable] = useState({
        columns: columns,
        rows: [],
    })

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        setToken(token)
        if (!token) window.location.href = '/login'
    }, [])

    const handleCategories = (categories) => {
        const rows = []
        if(categories) {
            categories.forEach(category => {
                rows.push({
                    id: category.id,
                    image: (<Image src={public_path(category.image)} avatar />),
                    name: category.name,
                    description: category.description,
                    actions: (
                        <Button.Group icon>
                            <Button>
                                <Icon name='edit' />
                            </Button>
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

    useEffect(() => {
        setLoading(true)
        
        Axios.get(api('categories'), {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            const categories = response.data.categories
            handleCategories(categories)
        }).catch(error => console.log(error))
    }, [token])

    return (
        <>
            <Head>
                <title>Blog de prueba</title>
                <link rel="icon" href="/favicon.ico" />
                {links.map((link, index) => (
                    <link key={index} rel="stylesheet" href={link.url} />
                ))}
            </Head>
            <MainAdmin currentPage="Categorías">
                <Button className="mb-3" floated='right' primary onClick={() => window.location.href = '/blog-admin/categorias/nueva-categoria'}>
                    <Icon name="plus" />
                    Nueva Categoría
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
