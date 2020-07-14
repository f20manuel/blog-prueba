import React,{ useState, useEffect, useCallback } from 'react'
import MainAdmin from '../../../../components/MainAdmin'
import Head from 'next/head'
import { links } from '../../../../enviroment'
import { Image, Popup, Card, Header, Form, Button, Segment } from 'semantic-ui-react'
import { urlObjectKeys } from 'next/dist/next-server/lib/utils'
import Axios from 'axios'
import { api, headersWithTokenAndFormData } from '../../../../helpers'
import Router, { useRouter } from 'next/router'

export default function index() {
    const router = useRouter()
    const { id } = router.query

    const [user, setUser] = useState({})

    const getUser = useCallback(
        async (id) => {
            const token = localStorage.getItem('accessToken')

            await Axios.get(api('users/' + id + '/edit'), {
                headers: {
                    'Authorization': 'Bearer '+ token
                }
            }).then(response => {
                const getData = response.data.user
                setUser(getData)
                setData(getData)
            }).catch(errors => console.log('getUserErrors:', errors))
        },
        [],
    )

    useEffect(() => {
        if (id) {
            getUser(id)
        }
    }, [id])

    const [loading, setLoading] = useState(false)
    const [diabledButton, setDisabledButton] = useState(true)

    const [data, setData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        c_password: '',
        role: '',
    })

    const [dataErrors, setDataErrors] = useState({
        name: '',
        email: '',
        password: '',
        c_password: '',
    })

    const [breadcrumbs, setBreadcrumbs] = useState([
        { key: 'escritorio', content: 'Escritorio', href: '/blog-admin'},
        { key: 'usuarios', content: 'Usuarios', href: '/blog-admin/usuarios'},
        { key: 'editarUsuario', content: 'Editar usuario', active: true},
    ])

    const handleChangeData = event => {
        setDisabledButton(false)

        setData({
            ...data,
            [event.target.name]: event.target.value,
        })
    }

    const sendData = () => {
        setLoading(true)
        const token = localStorage.getItem('accessToken')
        
        if (data.password !== '') {
            if (data.password !== data.c_password) {
                return alert('La constraseñas no coinciden')
                setLoading(false)
            }
        }

        if (data.name !== '' && data.email !== '' && token) {
            Axios.post(api('users/' + id), {
                name: data.name,
                email: data.email,
                mobile: data.mobile,
                password: data.password,
                c_password: data.c_password,
                _method: 'PATCH'
            }, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(response => {
                alert('Usuario agregado con éxito!')
                Router.replace('/blog-admin/usuarios')
            }).catch(errors => {
                console.log(errors.response)
                const error = errors.response.data.error
                setDataErrors({
                    ...data,
                    name: error.name || '',
                    email: error.email || '',
                    password: error.password || '',
                    c_password: error.c_password || '',
                })
            })
        } else {
            alert('Los campos con "*" son obligatorios')
        }
    }

    return (
        <>
            <Head>
                <title>Editar usuario</title>
                <link rel="icon" href="/favicon.ico" />
                {links.map((link, index) => (
                    <link key={index} rel="stylesheet" href={link.url} />
                ))}
            </Head>
            <MainAdmin currentPage="Editar usuario" breadcrumbs={breadcrumbs}>
                <div className="row mx-0">
                    <div className="col-12">
                        <Card className="w-100 p-5">
                            <Card.Header>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <Header as="h2">
                                            Datos del usuario {user.name}
                                        </Header>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Content>
                                <Form size='large'>
                                    <div className="row mx-0">
                                        <div className="col-md-6 mb-3">
                                            <Form.Field>
                                                <label htmlFor="name">
                                                    Nombre completo*
                                                </label>
                                                <input
                                                    value={data.name}
                                                    type="text"
                                                    error={dataErrors.name ? 'true' : 'false'}
                                                    id="name"
                                                    name="name"
                                                    placeholder="Nombre completo"
                                                    onChange={event => handleChangeData(event)}
                                                    required
                                                />
                                                {dataErrors.name?(
                                                    <small>{dataErrors.name}</small>
                                                ):null}
                                            </Form.Field>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <Form.Field>
                                                <label htmlFor="mobile">
                                                    Teléfono celular
                                                </label>
                                                <input
                                                    value={data.mobile}
                                                    type="tel"
                                                    id="mobile"
                                                    name="mobile"
                                                    placeholder="Teléfono celular"
                                                    onChange={event => handleChangeData(event)}
                                                />
                                            </Form.Field>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <Form.Field>
                                                <label htmlFor="email">
                                                    Correo electrónico*
                                                </label>
                                                <input
                                                    value={data.email}
                                                    type="email"
                                                    error={dataErrors.email ? 'true' : 'false'}
                                                    id="email"
                                                    name="email"
                                                    placeholder="Correo electrónico"
                                                    onChange={event => handleChangeData(event)}
                                                    required
                                                />
                                                {dataErrors.email?(
                                                    <small>{dataErrors.email}</small>
                                                ):null}
                                            </Form.Field>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <Form.Field>
                                                <label htmlFor="password">
                                                    Contraseña*
                                                </label>
                                                <input
                                                    value={data.password}
                                                    type="password"
                                                    error={dataErrors.password ? 'true' : 'false'}
                                                    id="password"
                                                    name="password"
                                                    placeholder="Contraseña"
                                                    onChange={event => handleChangeData(event)}
                                                />
                                                {dataErrors.password?(
                                                    <small>{dataErrors.password}</small>
                                                ):null}
                                            </Form.Field>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <Form.Field>
                                                <label htmlFor="c_password">
                                                    Confirmar contraseña*
                                                </label>
                                                <input
                                                    value={data.c_password}
                                                    type="password"
                                                    error={dataErrors.c_password ? 'true' : 'false'}
                                                    id="c_password"
                                                    name="c_password"
                                                    placeholder="Confirmar contraseña"
                                                    onChange={event => handleChangeData(event)}
                                                />
                                                {dataErrors.c_password?(
                                                    <small>{dataErrors.c_password}</small>
                                                ):null}
                                            </Form.Field>
                                        </div>
                                    </div>

                                    <Button
                                        primary
                                        fluid
                                        loading={loading}
                                        size='large'
                                        onClick={() => sendData(data)}>
                                        Actualizar
                                    </Button>
                                </Form>
                            </Card.Content>
                        </Card>
                    </div>
                </div>
            </MainAdmin>
        </>
    )
}
