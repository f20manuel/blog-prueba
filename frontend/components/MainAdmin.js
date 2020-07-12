import React, { useState, useEffect } from 'react'
import { Header, Icon, Image, Menu, Segment, Sidebar, Grid, GridRow, GridColumn, Button, Breadcrumb } from 'semantic-ui-react'
import { Container } from 'react-bootstrap'

export default function MainAdmin({ children, currentPage, breadcrumbs }) {
    const [visible, setVisible] = useState(false)
    const [token, setToken] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        setToken(token)
        if (!token) return window.location.replace('/login')
    }, [])

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
                            onClick={() => window.location.href = '/blog-admin'}>
                            <Icon name='home' />
                            Escritorio
                        </Menu.Item>
                        <Menu.Item
                            name="Categorías"
                            active={currentPage === 'Categorías'}
                            onClick={() => window.location.href = '/blog-admin/categorias'}>
                            <Icon name='boxes' />
                            Categorías
                        </Menu.Item>
                    </Sidebar>
    
                    <Sidebar.Pusher>
                        <Segment basic>
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
