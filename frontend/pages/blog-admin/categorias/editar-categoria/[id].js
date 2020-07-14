import React,{ useState, useEffect, useCallback } from 'react'
import Router, { useRouter } from 'next/router'
import MainAdmin from '../../../../components/MainAdmin'
import Head from 'next/head'
import { links, root_url } from '../../../../enviroment'
import { Image, Popup, Card, Header, Form, Button, Placeholder } from 'semantic-ui-react'
import { urlObjectKeys } from 'next/dist/next-server/lib/utils'
import Axios from 'axios'
import { api, public_path } from '../../../../helpers'

function index() {
    const router = useRouter()
    const { id } = router.query

    const [category, setCategory] = useState({})

    const getCategory = useCallback(
        async (id) => {
            const token = localStorage.getItem('accessToken')

            await Axios.get(api('categories/' + id + '/edit'), {
                headers: {
                    'Authorization': 'Bearer '+ token
                }
            }).then(response => {
                const getData = response.data.category
                setCategory(getData)
                setData(getData)
                setSlug(getData.slug)
                setImageURL(public_path('category/512/' + getData.imagen))
            }).catch(errors => console.log('getCategoryErrors:', errors))
        },
        [],
    )

    useEffect(() => {
        getCategory(id)
    }, [id])

    const [disabledButton, setDisabledButton] = useState(true)

    const [loading, setLoading] = useState(false)

    const [image, setImage] = useState(null);

    const [imageURL, setImageURL] = useState('https://via.placeholder.com/1024')

    const [data, setData] = useState({
        name: '',
        description: '',
    })

    const [slug, setSlug] = useState('')

    const [breadcrumbs, setBreadcrumbs] = useState([
        { key: 'escritorio', content: 'Escritorio', href: '/blog-admin'},
        { key: 'categorias', content: 'Categorías', href: '/blog-admin/categorias'},
        { key: 'nuevaCategoria', content: 'Nueva categoría', active: true},
    ])

    const handleImage = event => {
        setDisabledButton(false)
        const imagen = event.target.files[0]

        setImage(imagen)
        setImageURL(URL.createObjectURL(imagen))
    }

    const handleChangeData = event => {
        setDisabledButton(false)
        if (event.target.name === 'name') {
            const value = root_url + '/categorias/' + event.target.value
            setSlug(value.replace(/ /g, '-').toLowerCase())
        }

        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    }

    const sendData = (id) => {
        setLoading(true)
        const token = localStorage.getItem('accessToken')

        const newFormData = new FormData()
        newFormData.append('image', image)
        newFormData.append('name', data.name)
        newFormData.append('slug', slug)
        newFormData.append('description', data.description)
        newFormData.append('_method', 'PATCH')

        console.log(newFormData)

        Axios.post(api('categories/' + id), newFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            // console.log(response)
            setLoading(false)
            alert('Categoría ' + data.name + ' actualizada con éxito')
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

    return (
        <>
            <Head>
                <title>Editar categoría {category.name || 'loading...'}</title>
                <link rel="icon" href="/favicon.ico" />
                {links.map((link, index) => (
                    <link key={index} rel="stylesheet" href={link.url} />
                ))}
            </Head>
            <MainAdmin currentPage="Editar categoría" breadcrumbs={breadcrumbs}>
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
                                            Datos de {category.name}
                                        </Header>
                                    </div>
                                    <div>
                                        <Button
                                            primary
                                            loading={loading}
                                            disabled={disabledButton}
                                            onClick={() => sendData(category.id)}
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

// index.getInitialProps = async function () {
//     const router = useRouter()
//     const { id } = router.query
//     const res = await Axios.get(api('categories/' + id + '/edit'), {
//         headers: {
//             'Authorization': 'Bearer ' + token
//         }
//     })

//     const data = await res.data

//     return { category: data }
// }

export default index
