import React, { useState, useEffect } from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment, Icon } from 'semantic-ui-react'
import Head from 'next/head'
import { api } from '../../helpers'
import { links } from '../../enviroment'
import Axios from 'axios'

export default function index() {
    const [token, setToken] = useState('')

    const [data, setData] = useState({
        email: '',
        password: '',
    })

    const [dataErrors, setDataErrors] = useState({
        email: '',
        password: '',
    })

    const handleChangeData = event => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    }

    const sendData = (data) => {
        Axios.post(api('login'), data).then(response => {
            localStorage.setItem('accessToken', response.data.accessToken)
            window.location.href = '/blog-admin'
        }).catch(error => {
            console.log(error)
            const status = error.response.status
            switch (status) {
                case 401:
                        alert('Correo o contraseña incorrectos')
                    break;
            
                default:
                    break;
            }
        })
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
                        <Icon name='user' /> Ingresa con tu cuenta
                    </Header>
                    <Form size='large'>
                        <Segment stacked>
                        <Form.Input
                            value={data.email}
                            fluid
                            icon='user'
                            iconPosition='left'
                            placeholder='Correo electrónico'
                            type='email'
                            name='email'
                            onChange={event => handleChangeData(event)}
                            required
                        />
                        <Form.Input
                            value={data.password}
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            type='password'
                            name='password'
                            onChange={event => handleChangeData(event)}
                            required
                        />

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
                        ¿No tienes cuenta? <a href='/register'>Crear cuenta</a>
                    </Message>
                    </Grid.Column>
                </Grid>
            </div>
        )

        return (<div></div>)
    }

    return renderLogin(token)
}
