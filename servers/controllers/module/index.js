import menu from './menu';
import crud from './crud';
import createItem from './createItem';
import removeItem from './removeItem';
import auth from '../../auth';

export const routers = {
    'POST /': [auth.passport,auth.permission, createItem],
    'DELETE /:key': [auth.passport,auth.permission, removeItem],
    'GET /all/menu': [auth.passport,auth.permission, menu],
    'POST /manual/crud': [auth.passport,auth.permission, crud]
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
    updateItem: {
        removeAttributes: []
    }
}