import React,{ useState, useEffect } from 'react'
import MainAdmin from '../../../../components/MainAdmin'
import Head from 'next/head'
import { links } from '../../../../enviroment'
import { Image, Popup, Card, Header, Form, Button } from 'semantic-ui-react'
import { urlObjectKeys } from 'next/dist/next-server/lib/utils'
import Axios from 'axios'
import { api, headersWithTokenAndFormData } from '../../../../helpers'

export default function index() {
    const [token, setToken] = useState('')

    const [loading, setLoading] = useState(false)
    const [diabledButton, setDisabledButton] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        setToken(token)
        if (!token) return window.location.replace('/login')
    }, [])

    const [image, setImage] = useState(null);

    const [imageURL, setImageURL] = useState('https://via.placeholder.com/1280')

    const [data, setData] = useState({
        title: '',
        category_id: '',
        description: '',
        content: '',
    })

    const [slug, setSlug] = useState('')

    const [breadcrumbs, setBreadcrumbs] = useState([
        { key: 'escritorio', content: 'Escritorio', href: '/blog-admin'},
        { key: 'articulos', content: 'Articulos', href: '/blog-admin/articulos'},
        { key: 'nuevoArticulo', content: 'Nuevo articulo', active: true},
    ])

    const handleImage = event => {
        setDisabledButton(false)
        const imagen = event.target.files[0]

        setImage(imagen)
        setImageURL(URL.createObjectURL(imagen))
    }

    const handleChangeData = event => {
        setDisabledButton(false)
        if (event.target.name === 'title') {
            const value = '/blog-admin/articulos/' + event.target.value
            setSlug(value.replace(' ', '-').toLowerCase())
        }

        setData({
            ...data,
            [event.target.name]: event.target.value,
        })
    }

    const sendData = () => {
        setLoading(true)

        const newFormData = new FormData()
        newFormData.append('image', image)
        newFormData.append('title', data.title)
        newFormData.append('category_id', data.category_id)
        newFormData.append('slug', slug)
        newFormData.append('description', data.description)
        newFormData.append('content', data.content)

        console.log(newFormData)

        Axios.post(api('posts'), newFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            // console.log(response)
            setLoading(false)
            alert('Artículo ' + data.title + ' agregado con éxito')
            window.location.replace('/blog-admin/articulos')
        }).catch(error => {
            setLoading(false)
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
                <title>Nuevo artículo</title>
                <link rel="icon" href="/favicon.ico" />
                {links.map((link, index) => (
                    <link key={index} rel="stylesheet" href={link.url} />
                ))}
            </Head>
            <MainAdmin currentPage="Nuevo artículo" breadcrumbs={breadcrumbs}>
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
                        <input
                            type="file"
                            name="image"
                            className="d-none"
                            id="input-image"
                            onChange={event => handleImage(event)}
                        />
                    </div>
                    <div className="col-md-8">
                        <Card className="w-100 p-5">
                            <Card.Header>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <Header as="h2">
                                            Datos para el nuevo artículo
                                        </Header>
                                    </div>
                                    <div>
                                        <Button
                                            primary="true"
                                            loading={loading}
                                            disabled={diabledButton}
                                            onClick={() => sendData()}
                                        >
                                            Guardar
                                        </Button>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Content>
                                <Form>
                                    <Form.Field>
                                        <label htmlFor="title">
                                            Título:
                                        </label>
                                        <input
                                            value={data.title}
                                            placeholder="Título para el nuevo artículo"
                                            type="text"
                                            id="title"
                                            name="title"
                                            onChange={event => handleChangeData(event)}
                                            required
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label htmlFor="slug">
                                            Slug:
                                        </label>
                                        <input
                                            value={slug}
                                            type="text"
                                            id="slug"
                                            name="slug"
                                            required
                                            onChange={(event) => setSlug(event.target.value)}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label htmlFor="description">
                                            Descripción (opcional):
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={data.description}
                                            placeholder="Describa brevemente aquí su artículo"
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
