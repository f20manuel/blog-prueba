import React,{ useState, useEffect } from 'react'
import MainAdmin from '../../../../components/MainAdmin'
import Head from 'next/head'
import { links } from '../../../../enviroment'
import { Image, Popup, Card, Header, Form } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { urlObjectKeys } from 'next/dist/next-server/lib/utils'
import Axios from 'axios'
import { api, headersWithTokenAndFormData } from '../../../../helpers'

export default function index() {
    const [token, setToken] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        setToken(token)
        if (!token) return window.location.replace('/login')
    }, [])

    const [imageURL, setImageURL] = useState('https://via.placeholder.com/1024')

    const [data, setData] = useState({
        image: '',
        name: '',
        description: '',
    })

    const [breadcrumbs, setBreadcrumbs] = useState([
        { key: 'escritorio', content: 'Escritorio', href: '/blog-admin'},
        { key: 'categorias', content: 'Categorías', href: '/blog-admin/categorias'},
        { key: 'nuevaCategoria', content: 'Nueva categoría', active: true},
    ])

    const handleChangeData = event => {
        if (event.target.name === 'image') {
            setData({...data, image: event.target.files[0]})
            setImageURL(URL.createObjectURL(event.target.files[0]))
        }
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    }

    const sendData = data => {
        const newFormData = new FormData()
        newFormData.append('image', data.image)
        newFormData.append('name', data.name)
        newFormData.append('description', data.description)

        Axios.post(api('categories'), newFormData, {
            headers: headersWithTokenAndFormData(token)
        }).then(response => {
            alert('Categoría ' + data.name + ' agregada con éxito')
            window.location.replace('/blog-admin/categorias')
        }).catch(error => {
            console.log(error)
            const status = error.response.status || ''
            switch (status) {
                case 401:
                    alert('No estas autorizado para realizar esta acción.')
                    break;
            }
        })
    }

    return (
        <>
            <Head>
                <title>Nueva categoría</title>
                <link rel="icon" href="/favicon.ico" />
                {links.map((link, index) => (
                    <link key={index} rel="stylesheet" href={link.url} />
                ))}
            </Head>
            <MainAdmin currentPage="Nueva categoría" breadcrumbs={breadcrumbs}>
                <div className="row mx-0">
                    <div className="col-md-4">
                        <label htmlFor="input-image">
                        <Popup content='Haga click para subir una imágen' trigger={
                            <Image
                                src={imageURL}
                                as='a'
                                size='medium'
                                rounded
                                href={void(0)}
                            />
                        }/>
                        </label>
                        <input type="file" name="image" className="d-none" id="input-image" onChange={event => handleChangeData(event)}/>
                    </div>
                    <div className="col-md-8">
                        <Card className="w-100 p-5">
                            <Card.Header>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <Header as="h2">
                                            Datos para la nueva categoría
                                        </Header>
                                    </div>
                                    <div>
                                        <Button
                                            primary="true"
                                            onClick={() => sendData(data)}
                                        >
                                            Guardar
                                        </Button>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Content>
                                <Form>
                                    <Form.Field>
                                        <label htmlFor="name">
                                            Nombre:
                                        </label>
                                        <input
                                            value={data.name}
                                            placeholder="Nombre para la nueva categoría"
                                            type="text"
                                            id="name"
                                            name="name"
                                            onChange={event => handleChangeData(event)}
                                            required
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label htmlFor="description">
                                            Descripción (opcional):
                                        </label>
                                        <textarea
                                            value={data.description}
                                            placeholder="Describa aquí su buena categoría"
                                            id="description"
                                            name="description"
                                            onChange={event => handleChangeData(event)}
                                        />
                                    </Form.Field>
                                </Form>
                            </Card.Content>
                        </Card>
                    </div>
                </div>
            </MainAdmin>
        </>
    )
}
