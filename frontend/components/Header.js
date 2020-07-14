import React, { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Grid, Header, Container, Button } from 'semantic-ui-react'
import Axios from 'axios'
import { api } from '../helpers'
import Router from 'next/router'

export default function HeaderComponent({ title }) {
    const [user, setUser] = useState({})
  
    const getUser = useCallback( async () => {
      const token = localStorage.getItem('accessToken')
        if (token) {
            await Axios.post(api('details'), {}, {
                headers: {
                'Authorization': 'Bearer ' + token
                }
            }).then(response => {
                const getData = response.data
                setUser(getData)
            })
        }
    }, [])
  
    useEffect(() => {
        getUser()
    }, [])

    return (
        <Container>
            <Grid>
                <Grid.Row style={{paddingTop: 32, paddingBottom: 32}}>
                    <Grid.Column width={13}>
                        <Header as='h1'>
                            { title }
                        </Header>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Button floated='right' primary onClick={() => Router.push('/login')}>
                            {user.name ? 'Cuenta' : 'Acceder'}
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    )

    HeaderComponent.propTypes = {
        title: PropTypes.string.isRequired
    }
}
