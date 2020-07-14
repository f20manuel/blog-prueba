import React,{ useState, useEffect, useCallback } from 'react'
import MainAdmin from '../../../../components/MainAdmin'
import Head from 'next/head'
import { links, root_url } from '../../../../enviroment'
import { Image, Popup, Card, Header, Form, Button, Input, Select } from 'semantic-ui-react'
import { urlObjectKeys } from 'next/dist/next-server/lib/utils'
import Axios from 'axios'
import { api, headersWithTokenAndFormData, public_path } from '../../../../helpers'
import Router, { useRouter } from 'next/router'

//text rich editor
import { Editor } from '@tinymce/tinymce-react';

export default function index() {
    const router = useRouter()
    const { id } = router.query

    const [post, setPost] = useState({})

    const getPost = useCallback(async (id) => {
        const token = localStorage.getItem('accessToken')

        await Axios.get(api('posts/' + id + '/edit'), {
            headers: {
                'Authorization': 'Bearer '+ token
            }
        }).then(response => {
            const getData = response.data.post
            setPost(getData)
            setData(getData)
            setSlug(getData.slug)
            setImageURL(public_path('post/512/' + getData.image))
        }).catch(errors => console.log('getPostErrors:', errors))
    }, [])

    const [categories, setCategories] = useState([])

    const getCategories = useCallback( async () => {
        const token = localStorage.getItem('accessToken')
        
        await Axios.get(api('categories'), {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            const cats = []
            response.data.categories.map((post, index) => {
                cats.push({
                    key: index,
                    value: post.id,
                    text: post.name
                })
            })
            setCategories(cats)
        }).catch(errors => console.log(errors))
    }, [])
    

    useEffect(() => {
        if (id) getPost(id)
        getCategories()
    }, [id])

    const [loading, setLoading] = useState(false)
    const [diabledButton, setDisabledButton] = useState(true)

    const [image, setImage] = useState(null);

    const [imageURL, setImageURL] = useState('https://via.placeholder.com/1280')

    const [data, setData] = useState({})

    //editor values
    const handleEditorChange = (event) => {
        setDisabledButton(false)
        setData({
            ...data,
            content: event.target.getContent()
        })
    }

    const [slug, setSlug] = useState('')

    const [breadcrumbs, setBreadcrumbs] = useState([
        { key: 'escritorio', content: 'Escritorio', href: '/blog-admin'},
        { key: 'articulos', content: 'Articulos', href: '/blog-admin/articulos'},
        { key: 'editarArticulo', content: 'Editar articulo', active: true},
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
            const value = root_url + '/articulos/' + event.target.value
            setSlug(value.replace(/ /g, '-').toLowerCase())
        }

        setData({
            ...data,
            [event.target.name]: event.target.value,
        })
    }

    const sendData = (id) => {
        setLoading(true)
        const token = localStorage.getItem('accessToken')

        const newFormData = new FormData()
        newFormData.append('image', image)
        newFormData.append('title', data.title)
        newFormData.append('category_id', data.category_id)
        newFormData.append('slug', slug)
        newFormData.append('shortDescription', data.shortDescription)
        newFormData.append('content', data.content)
        newFormData.append('_method', 'PATCH')

        Axios.post(api('posts/' + id), newFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            setLoading(false)
            alert('Artículo ' + data.title + ' editado con éxito')
            Router.replace('/blog-admin/articulos')
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
                                            Datos del articulo {post.title}
                                        </Header>
                                    </div>
                                    <div>
                                        <Button
                                            primary="true"
                                            loading={loading}
                                            disabled={diabledButton}
                                            onClick={() => sendData(post.id)}
                                        >
                                            Actualizar
                                        </Button>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Content>
                                <Form>
                                    <div className="row mx-0">
                                        <div className="col-md-8 mb-3 pl-0">
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
                                        </div>
                                        <div className="col-md-4 mb-3 pr-0">
                                            <Form.Field>
                                                <label htmlFor="categories">
                                                    Categoría
                                                </label>
                                                <Select
                                                    id="categories"
                                                    name="post_id"
                                                    value={data.category_id}
                                                    placeholder={categories?'Selecciona una categoría':'Loading...'}
                                                    options={categories}
                                                    onChange={(event, {value}) => setData({...data, category_id: value})}
                                                />
                                            </Form.Field>
                                        </div>
                                    </div>
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
                                            value={data.shortDescription}
                                            placeholder="Describa brevemente aquí su artículo"
                                            id="description"
                                            name="shortDescription"
                                            onChange={event => handleChangeData(event)}
                                        />
                                    </Form.Field>
                                    <Editor
                                        initialValue={data.content}
                                        init={{
                                        height: 500,
                                        menubar: false,
                                        plugins: [
                                            'advlist autolink lists link image',
                                            'charmap print preview anchor help',
                                            'searchreplace visualblocks code',
                                            'insertdatetime media table paste wordcount'
                                        ],
                                        toolbar:
                                            'undo redo | formatselect | bold italic | \
                                            alignleft aligncenter alignright | \
                                            bullist numlist outdent indent | help'
                                        }}
                                        onChange={event => handleEditorChange(event)}
                                    />
                                </Form>
                            </Card.Content>
                        </Card>
                    </div>
                </div>
            </MainAdmin>
        </>
    )
}
