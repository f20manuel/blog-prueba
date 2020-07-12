import { public_url, api_url } from "./enviroment";

export function public_path(url) {
    return public_url + '/' + url
}

export function api(url) {
    return api_url + '/' + url
}

export function headersWithToken(token) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Authorization': 'Bearer ' + token,
    }
    
    return headers
}

export function headersWithTokenAndFormData(token) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + token,
    }
    
    return headers
}