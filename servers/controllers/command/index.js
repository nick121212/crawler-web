import testItem from './testItem';
import execCmdList from './getExecuteCommandList';
import execCmdResList from './getExecuteCommandResultList';
import auth from '../../auth';

export const routers = {
    'POST /manual/test': [auth.passport, auth.permission, testItem],
    'GET /manual/execCmdList': [auth.passport, auth.permission, execCmdList],
    'GET /manual/execCmdResList': [auth.passport, auth.permission, execCmdResList]
}

export const init = (router, sequelizeModel) => {

}

export const config = {
    createItem: {

    },
    list: {

    },
    removeItem: {

    },
    updateItem: {

    },
    getItem: {

    }
}