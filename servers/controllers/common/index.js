import createItem from './createItem';
import getItem from './getItem';
import removeItem from './removeItem';
import updateItem from './updateItem';
import list from './list';
import auth from '../../auth';

export const routers = {
    'GET /': [auth.passport, auth.permission, list],
    'GET /:key': [auth.passport, auth.permission, getItem],
    'POST /': [auth.passport, auth.permission, createItem],
    'DELETE /:key': [auth.passport, auth.permission, removeItem],
    'PUT /:key': [auth.passport, auth.permission, updateItem]
}

export const init = (router, sequelizeModel) => {

}

export const config = {
    createItem: {
        attributes: []
    },
    list: {
        attributes: []
    },
    removeItem: {

    },
    updateItem: {

    },
    getItem: {

    }
}