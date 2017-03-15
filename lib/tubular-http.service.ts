import { Injectable, Inject, Optional } from '@angular/core';
import {
    Http, Response, RequestMethod, Request, Headers,
    RequestOptions, RequestOptionsArgs, ResponseContentType
} from '@angular/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
// TODO: Add debounceTime?

import { SETTINGS_PROVIDER, ITubularSettingsProvider } from './tubular-settings.service';
import { TubularAuthService } from './tubular-auth.service';

/**
 * Required structure when constructing new Request();
 */
export interface TbRequestArgs extends RequestOptionsArgs {
    requireAuthentication: boolean;
}

@Injectable()
export class TubularHttpService {

    private requireAuthentication: boolean;

    constructor(
        @Optional() @Inject(SETTINGS_PROVIDER) private settingsProvider: ITubularSettingsProvider,
        private http: Http,
        private tbAuthService: TubularAuthService) { }

    public get(url: string, requireAuthentication: boolean = false): Observable<any> {
        let requestArgs = <TbRequestArgs>{
            method: RequestMethod.Get,
            url,
            requireAuthentication
        };

        return this.request(requestArgs);
    }

    public post(url: string, data: any, requireAuthentication: boolean = false): Observable<any> {
        let requestArgs = <TbRequestArgs>{
            method: RequestMethod.Post,
            body: data,
            url,
            requireAuthentication
        };

        return this.request(requestArgs);
    }

    public put(url: string, data: any, requireAuthentication: boolean = false): Observable<any> {
        let requestArgs = <TbRequestArgs> {
            method: RequestMethod.Put,
            body: data,
            url,
            requireAuthentication
        };

        return this.request(requestArgs);
    }

    public delete(url: string, data: any, requireAuthentication: boolean = false): Observable<any> {
        let requestArgs = <TbRequestArgs> {
            method: RequestMethod.Delete,
            body: data,
            url,
            requireAuthentication
        };

        return this.request(requestArgs);
    }

    public retrieveGridData(url: string, req: any): Observable<any> {
        req.columns.forEach(this.transformSortDirection);

        console.log('retrieveGridData');

        return this.post(url, req)
            .map(this.extractData)
            .catch(this.handleRequestError);
    }

    public request(request: TbRequestArgs): Observable<any> {
        let ngRequest = new Request({
            url: request.url,
            method: request.method,
            search: request.search || '',
            headers: request.headers || null,
            body: request.body || null,
            withCredentials: request.withCredentials || false,
            responseType: request.responseType || ResponseContentType.Json
        });

        if (request.requireAuthentication) {
            if (this.tbAuthService.isValidSession()) {
                this.tbAuthService.addAuthHeaderToRequest(ngRequest);
            } else {
                if (this.tbAuthService.isAuthTokenExpired() &&
                    this.tbAuthService.isUsingRefreshTokens()) {
                    return this.handleRequestError(
                        {
                            message: 'Token expired',
                            status: '401', 
                            statusText: 'Token expired' 
                        }, 
                        ngRequest);
                }
            }
        }

        return this.http.request(ngRequest)
            .map(this.extractData)
            .catch((error: Error) => this.handleRequestError(error, request));
    }

    public retrieveData(url: string, req: any): Observable<any> {
        req.columns.forEach(this.transformSortDirection);

        return this.post(url, req)
            .map(this.extractData)
            .catch(this.handleRequestError);
    }

    public save(
        url: string, 
        row: any, 
        method: RequestMethod = RequestMethod.Post, 
        requireAuthentication: boolean = true): Observable<any> {
        let requestArgs = <TbRequestArgs> {
            body: row,
            method,
            url,
            requireAuthentication
        };

        return this.request(requestArgs);
    }

    private handleRequestError(error: any, request) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';

        if (error && error.status === 401 && this.tbAuthService.isUsingRefreshTokens() && request) {
            return this.tbAuthService.refreshSession()
                .mergeMap((response) => {
                    if (this.tbAuthService.isValidSession()) {

                        return this.http.request(request)
                            .map(this.extractData)
                            .catch(this.handleRequestError);
                    } else {
                        return Observable.throw(error);
                    }
                })
                .catch(this.handleRequestError);
        }

        return Observable.throw(errMsg);
    }

    private transformSortDirection(column) {
        switch (column.direction) {
            case 1:
                column.sortDirection = 'Ascending';
                break;
            case 2:
                column.sortDirection = 'Descending';
                break;
            default:
                column.sortDirection = 'None';
        }
    }

    private extractData(res: Response) {
        return res.json() || {};
    }
}
