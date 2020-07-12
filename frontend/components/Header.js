import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Header, Container, Button } from 'semantic-ui-react'

export default function HeaderComponent({ title }) {
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
                        <Button primary onClick={() => window.location.href = '/login'}>
                            Acceder
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
