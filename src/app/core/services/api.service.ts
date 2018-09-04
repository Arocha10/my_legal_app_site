import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { JwtService } from './jwt.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) {}

  private formatErrors(error: any) {
    return  throwError(error.error);
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${environment.web_api}${path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}): Observable<any> {
    console.log(JSON.stringify(body));
    return this.http.post(
      `${environment.web_api}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${environment.web_api}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors));
  }


  delete(path): Observable<any> {
    return this.http.delete(
      `${environment.web_api}${path}`
    ).pipe(catchError(this.formatErrors));
  }
}