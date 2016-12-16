import auth from '../../auth';
import getTree from './getTree';
import createItem from './createItem';
import updateItem from './updateItem';
import removeItem from './removeItem';

export const routers = {
    'POST /': [auth.passport, auth.permission, createItem],
    'PUT /:key': [auth.passport, auth.permission, updateItem],
    'DELETE /:key': [auth.passport, auth.permission, removeItem],
    'GET /manual/modAndAct': [auth.passport, auth.permission, getTree]
}

export const init = (router, sequelizeModel) => {
    console.log(router);
}

export const config = {

}