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
        { label: 'Nombre', field: 'name', widht: 200},
        { label: 'Rol', field: 'role', width: 100},
        { label: 'Correo electrónico', field: 'email', width: 200},
        { label: 'Celular', field: 'mobile', width: 200},
        { label: 'Acciones', field: 'actions', width: 100 }
    ])

    const [dataTable, setDataTable] = useState({
        columns: columns,
        rows: [],
    })

    const [breadcrumbs, setBreadcrumbs] = useState([
        { key: 'escritorio', content: 'Escritorio', href: '/blog-admin'},
        { key: 'usuairos', content: 'Usuarios', active: true},
    ])

    useEffect(() => {
        setLoading(true)
        const token = localStorage.getItem('accessToken')

        const getUsers = async (token) => {
            await Axios.get(api('users'), {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(response => {
                const users = response.data.users
                if(users) handlePosts(users, token)
                setLoading(false)
            }).catch(error => console.log(error))
        }

        if (token) getUsers(token)
    }, [])

    const handlePosts = (users, token) => {
        const rows = []
        if(users) {
            users.forEach(user => {
                rows.push({
                    id: user.id,
                    name: user.name,
                    role: user.role === 'user'?
                    'usuario':'administrador',
                    email: user.email,
                    mobile: user.mobile,
                    actions: (
                        <Button.Group icon>
                            <Popup content='Editar' trigger={
                                <Button primary="true" onClick={() => Router.push('/blog-admin/usuarios/editar-usuario/' + user.id)}>
                                    <Icon name='edit' />
                                </Button>
                            }/>
                            <Button onClick={() => deleteUserAsk(user.id)}>
                                <Icon name='delete' />
                            </Button>
                        </Button.Group>
                    )
                })
            })
        }

        setDataTable({ columns: columns, rows: rows })
    }

    const deleteUser = async (id) => {
        setLoading(true)
        const token = localStorage.getItem('accessToken')

        if (token) {
            await Axios.post(api('users/') + id, {
                _method: 'DELETE'
            }, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(response => {
                alert('Usuario eliminado con éxito!')
                setLoading(false)
                window.location.reload()
            }).catch(errors => console.log(errors))
        }
    }

    const deleteUserAsk = (id) => {
        const DELETE = confirm('¿Estas segur@ de que quieres eliminar este usuario?')
        if (DELETE) deleteUser(id)
    }

    return (
        <>
            <Head>
                <title>Usuarios - blog de prueba</title>
                <link rel="icon" href="/favicon.ico" />
                {links.map((link, index) => (
                    <link key={index} rel="stylesheet" href={link.url} />
                ))}
            </Head>
            <MainAdmin currentPage="Usuarios" breadcrumbs={breadcrumbs}>
                <Button className="mb-3" floated='right' primary onClick={() => window.location.href = '/blog-admin/usuarios/nuevo-usuario'}>
                    <Icon name="plus" />
                    Nuevo usuario
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
