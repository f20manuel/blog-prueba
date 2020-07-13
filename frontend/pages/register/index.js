import React, { useState, useEffect } from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment, Icon } from 'semantic-ui-react'
import Head from 'next/head'
import { api } from '../../helpers'
import { links } from '../../enviroment'
import Axios from 'axios'

export default function index() {
    const [token, setToken] = useState('')

    const [data, setData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        c_password: '',
        role: 'user',
    })

    const [dataErrors, setDataErrors] = useState({
        name: '',
        email: '',
        password: '',
        c_password: '',
    })

    const handleChangeData = event => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    }

    const sendData = (data) => {
        if (data.password !== data.c_password) {
            return alert('La constraseñas no coinciden')
        }
        if (data.name !== '' && data.email !== '' && data.password !== '' && data.c_password !== '') {
            Axios.post(api('register'), data).then(response => {
                localStorage.setItem('accessToken', response.data.accessToken)
                window.location.href = '/blog-admin'
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

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        setToken(token)
        if(token) return window.location.replace('/blog-admin')
    }, [])

    const renderLogin = (token) => {
        if(!token) return (
            <div className="container">
                <Head>
                    <title>Blog de prueba</title>
                    <link rel="icon" href="/favicon.ico" />
                    {links.map((link, index) => (
                    <link key={index} rel="stylesheet" href={link.url} />
                    ))}
                </Head>
                <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                <Button floated="right" onClick={() => window.location.href = '/'}>Volver</Button>
                    <Header as='h2' color='teal' textAlign='center'>
                        <Icon name='user' /> Crea tu cuenta
                    </Header>
                    <Form size='large'>
                        <Segment stacked>
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
                                        required
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
                                        required
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
                            size='large'
                            onClick={() => sendData(data)}>
                            Ingresar
                        </Button>
                        </Segment>
                    </Form>
                    <Message>
                        ¿Ya tienes cuenta? <a href='/login'>Ingresar</a>
                    </Message>
                    </Grid.Column>
                </Grid>
            </div>
        )

        return (<div></div>)
    }

    return renderLogin(token)
}
