import React,{ useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import MainAdmin from '../../../../components/MainAdmin'
import Head from 'next/head'
import { links } from '../../../../enviroment'
import { Image, Popup, Card, Header, Form, Button, Placeholder } from 'semantic-ui-react'
import { urlObjectKeys } from 'next/dist/next-server/lib/utils'
import Axios from 'axios'
import { api, headersWithTokenAndFormData, public_path } from '../../../../helpers'

export default function index() {
    const router = useRouter()
    
    const [token, setToken] = useState('')

    const [loading, setLoading] = useState(false)

    const [category, setCategory] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        setToken(token)
        if (!token) return window.location.replace('/login')
    }, [])

    const [image, setImage] = useState(null);

    const [imageURL, setImageURL] = useState('https://via.placeholder.com/1024')

    const [data, setData] = useState({
        name: '',
        description: '',
    })

    const [breadcrumbs, setBreadcrumbs] = useState([
        { key: 'escritorio', content: 'Escritorio', href: '/blog-admin'},
        { key: 'categorias', content: 'Categorías', href: '/blog-admin/categorias'},
        { key: 'nuevaCategoria', content: 'Nueva categoría', active: true},
    ])

    const handleImage = event => {
        const imagen = event.target.files[0]

        setImage(imagen)
        setImageURL(URL.createObjectURL(imagen))
    }

    const handleChangeData = event => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    }

    const sendData = () => {
        setLoading(true)

        const newFormData = new FormData()
        newFormData.append('image', image, image.filename)
        newFormData.append('name', data.name)
        newFormData.append('description', data.description)

        console.log(newFormData)

        Axios.post(api('categories'), newFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            // console.log(response)
            setLoading(false)
            alert('Categoría ' + data.name + ' agregada con éxito')
            window.location.replace('/blog-admin/categorias')
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

    //placeholders
    const placeholderImage = () => {
        

        if (category.imagen) {
            setImageURL(public_path('category/100/' + category.imagen))
            return (
                <Popup content='Haga click para subir una imágen' trigger={
                    <Image
                        src={imageURL}
                        as='a'
                        size='medium'
                        rounded
                        href={void(0)}
                    />
                }/>
            )
        }

        return (
            <Placeholder style={{widht: 300, height: 300}}>
                <Placeholder.Image/>
            </Placeholder>
        )
    }

    return (
        <>
            <Head>
                <title>Editar categoría {category.name || 'loading...'}</title>
                <link rel="icon" href="/favicon.ico" />
                {links.map((link, index) => (
                    <link key={index} rel="stylesheet" href={link.url} />
                ))}
            </Head>
            <MainAdmin currentPage="Nueva categoría" breadcrumbs={breadcrumbs}>
                <div className="row mx-0">
                    <div className="col-md-4">
                        <label htmlFor="input-image">
                            {placeholderImage()}
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
                                            Datos de {category.name}
                                        </Header>
                                    </div>
                                    <div>
                                        <Button
                                            primary
                                            loading={loading}
                                            onClick={() => sendData()}
                                        >
                                            Actualizar
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
