import { Operation } from 'express-openapi';
import * as api from '../../../api';
import factory from '../../../../Model/ModelFactory';
import { RecordedModelInterface } from '../../../../Model/Api/RecordedModel';

export const get: Operation = async (req, res) => {
    let recordeds = <RecordedModelInterface>(factory.get('RecordedModel'));

    try {
        let list = await recordeds.getM3u8(req.headers.host, req.secure, req.params.id, req.query.encodedId);
        api.responsePlayList(req, res, list);
    } catch(err) {
        if(err.message === RecordedModelInterface.NotFoundRecordedFileError) {
            api.responseError(res, { code: 404,  message: 'Recorded file is not Found' });
        } else {
            api.responseServerError(res, err.message);
        }
    }
};

get.apiDoc = {
    summary: '録画済みファイルのプレイリストを取得',
    tags: ['recorded'],
    description: '録画済みファイルのプレイリストを取得する',
    parameters: [
        {
            name: 'id',
            in: 'path',
            description: 'recorded id',
            required: true,
            type: 'integer'
        },
        {
            name: 'encodedId',
            in: 'query',
            description: 'encoded id',
            type: 'integer',
        }
    ],
    produces: [
        'application/x-mpegURL',
    ],
    responses: {
        200: {
            description: 'ok'
        },
        404: {
            description: 'Not found'
        },
        default: {
            description: '予期しないエラー',
            schema: {
                $ref: '#/definitions/Error'
            }
        }
    }
};
