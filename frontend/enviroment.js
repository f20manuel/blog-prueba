export const public_url = 'http://localhost:8000'

export const api_url = public_url + '/api'

export const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
}

export const links = [
    {url: '/css/style.css'},
    {url: 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css'},
    {url: '//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css'}
]