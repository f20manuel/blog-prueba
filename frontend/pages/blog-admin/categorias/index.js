import React, { useState , useEffect } from 'react'
import { api, public_path } from '../../../helpers.js'
import { MDBDataTableV5 } from 'mdbreact'
import { Image, Button, Icon, Card, Popup } from 'semantic-ui-react'
import Axios from 'axios'
import { links } from '../../../enviroment.js'
import Head from 'next/head'
import MainAdmin from '../../../components/MainAdmin.js'
import { Container } from 'react-bootstrap'
import Router from 'next/router'

export default function index() {
    const [loading, setLoading] = useState(false)
    const [columns, setColumns] = useState([
        { label: 'ID', field: 'id', width: 100 },
        { label: 'Imágen', field: 'image', width: 100 },
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
        { key: 'categorias', content: 'Categorías', active: true},
    ])

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (!token) window.location.href = '/login'

        const getCategories = async (token) => {
            await Axios.get(api('categories'), {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(response => {
                const categories = response.data.categories
                if(categories) handleCategories(categories)
            }).catch(error => console.log(error))
        }

        if (token) getCategories(token)
    }, [])

    const handleCategories = (categories) => {
        const rows = []
        if(categories) {
            categories.forEach(category => {
                rows.push({
                    id: category.id,
                    image: (<Image src={public_path('category/100/' + category.imagen)} avatar />),
                    name: category.name,
                    description: category.description,
                    actions: (
                        <Button.Group icon>
                            <Popup content='Editar' trigger={
                                <Button primary="true" onClick={() => window.location.href = '/blog-admin/categorias/editar-categoria/' + category.id}>
                                    <Icon name='edit' />
                                </Button>
                            }/>
                            <Button loading={loading} onClick={() => deleteCategoryAsk(category.id)}>
                                <Icon name='delete' />
                            </Button>
                        </Button.Group>
                    )
                })
            })
        }

        setDataTable({ columns: columns, rows: rows })
    }

    const deleteCategory = async (id) => {
        const token = localStorage.getItem('accessToken')

        await Axios.post(api('categories/') + id, {
            _method: 'DELETE'
        }, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            alert('Categorías eliminada con éxito!')
            setLoading(false)
            Router.reload()
        }).catch(errors => console.log(errors))
    }

    const deleteCategoryAsk = (id) => {
        const DELETE = confirm('¿Estas segur@ de que quieres eliminar esta categoría?')
        setLoading(true)
        if (DELETE) deleteCategory(id)
    }

    return (
        <>
            <Head>
                <title>Blog de prueba</title>
                <link rel="icon" href="/favicon.ico" />
                {links.map((link, index) => (
                    <link key={index} rel="stylesheet" href={link.url} />
                ))}
            </Head>
            <MainAdmin currentPage="Categorías" breadcrumbs={breadcrumbs}>
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
