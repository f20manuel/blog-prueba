import React, { useState, useEffect, useCallback } from 'react'
import { Header, Icon, Image, Menu, Segment, Sidebar, Grid, GridRow, GridColumn, Button, Breadcrumb } from 'semantic-ui-react'
import { Container } from 'react-bootstrap'
import Router from 'next/router'
import { api } from '../helpers'
import Axios from 'axios'

export default function MainAdmin({ children, currentPage, breadcrumbs }) {
    const [loading, setLoading] = useState(false)

    const [visible, setVisible] = useState(false)
    const [token, setToken] = useState('')

    const [user, setUser] = useState({})

    const getUser  = useCallback( async () => {
        await Axios.post(api('details'), {}, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            const getData = response.data
            setUser(getData)
        }).catch(errors => console.log('getUserError:', errors))
    }, [])

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        const role = localStorage.getItem('role')
        setToken(token)
        if (!token) return Router.replace('/login')
        if (role && role === 'user') Router.replace('/blog-user')
        getUser(token)
    }, [token])

    const handleLogout = async (user) => {
        setLoading(true)
        const token = localStorage.getItem('accessToken')

        await Axios.post(api('logout'), {
            user: user
        }, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            setLoading(false)
            localStorage.removeItem('accessToken')
            localStorage.removeItem('role')
            Router.replace('/')
        }).catch(errors => console.log('logoutError', errors))
    }

    const renderMainAdmin = token => {
        if (token) return (
            <>
                <Sidebar.Pushable style={{minHeight: '100vh'}} as={Segment}>
                    <Sidebar
                        as={Menu}
                        animation='scale down'
                        icon='labeled'
                        inverted
                        onHide={() => setVisible(false)}
                        vertical
                        visible={visible}
                        width='thin'
                    >
                        <Menu.Item
                            name="Escritorio"
                            active={currentPage === 'Escritorio'}
                            onClick={() => Router.push('/blog-admin')}>
                            <Icon name='home' />
                            Escritorio
                        </Menu.Item>
                        <Menu.Item
                            name="Categorías"
                            active={currentPage === 'Usuarios'}
                            onClick={() => Router.push('/blog-admin/usuarios')}>
                            <Icon name='users' />
                            Usuarios
                        </Menu.Item>
                        <Menu.Item
                            name="Categorías"
                            active={currentPage === 'Categorías'}
                            onClick={() => Router.push('/blog-admin/categorias')}>
                            <Icon name='boxes' />
                            Categorías
                        </Menu.Item>
                        <Menu.Item
                            name="Categorías"
                            active={currentPage === 'Entradas'}
                            onClick={() => Router.push('/blog-admin/articulos')}>
                            <Icon name='edit' />
                            Entrada
                        </Menu.Item>
                    </Sidebar>
    
                    <Sidebar.Pusher>
                        <Segment basic>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex justify-content-start align-items-center">
                                    <div>
                                        <Button onClick={() => setVisible(!visible)} circular icon={visible?'angle left':'bars'} />
                                    </div>
                                    <div className="pl-2">
                                        <Header as="h1">
                                            { currentPage }
                                        </Header>
                                    </div>
                                </div>
                                <div>
                                    <Button
                                        loading={loading}
                                        primary="true"
                                        onClick={() => handleLogout(user, token)}
                                    >
                                        Salir
                                    </Button>
                                </div>
                            </div>
                            <Container className="py-5">
                                <Breadcrumb icon='right angle' sections={breadcrumbs} className="mb-3"/>
                                { children }
                            </Container>
                        </Segment>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </>
        )

        return (<div></div>)
    }

    return renderMainAdmin(token)

    MainAdmin.propTypes = {
        currentPage: PropTypes.string.isRequired,
        breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired,
            link: PropTypes.bool,
            active: PropTypes.bool
        }).isRequired).isRequired,
    }
}
