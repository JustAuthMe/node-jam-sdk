import * as querystring from "querystring";
import fetch, {Response} from 'node-fetch';
import {
    JamBadRequestError,
    JamInternalServerError,
    JamNotFoundError,
    JamUnauthorizedError,
    JamUnknownError
} from "./Exceptions";

const CORE_URL = 'https://core.justauth.me/';
const API_URL =  `${CORE_URL}api/`;

interface TypicalUserData {
    email: string;
    jam_id: string;
    [key: string]: string;
}

export type UserInfos = Readonly<Partial<TypicalUserData>>;

export class JamSDK {

    constructor(private appId: string, private redirectUrl: string, private apiSecret: string) {
    }

    /**
     * Generate the login URL associated with the provided appId and redirectUrl
     * @return string
     */
    public generateLoginUrl(): string {
        const encodedQueryString = querystring.encode({
           app_id: this.appId,
           redirect_url: this.redirectUrl
        });
        return `${CORE_URL}auth?${encodedQueryString}`;
    }

    public async getUserInfos(accessToken: string): Promise<UserInfos>{
        const encodedQueriString = querystring.encode({
           access_token: accessToken,
           secret: this.apiSecret
        });
        let response;
        const url = `${API_URL}data?${encodedQueriString}`;
        response = await fetch(url);

        return await JamSDK.processResponse(response);
    }

    private static async processResponse(response: Response): Promise<UserInfos>{
        switch (response.status) {
            case 200:
                return await response.json();
            case 400:
                throw new JamBadRequestError('Access-Token and API Secret are required. Please contact support@justauth.me');
            case 401:
                throw new JamUnauthorizedError('Api Secret is invalid');
            case 404:
                throw new JamNotFoundError('No such Access-Token');
            case 500:
                throw new JamInternalServerError('Wrong data format. Please contact support@justauth.me');
            default:
                throw new JamUnknownError('Unknow error. Please contact support@justauth.me');
        }
    }
}
