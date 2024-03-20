import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Funds } from '../model/funds';
import { Page } from '../model/page';
import { Observable } from 'rxjs/internal/Observable';
import { Funderamount } from '../model/funderamount';

@Injectable({
  providedIn: 'root'
})
export class FundsService {

  fundUrl = environment.fundsBaseUrl
  constructor(private http: HttpClient) { }

  getAllFunds(pageIndex: number, pageSize: number): Observable<Page<Funds>> {
    const param = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize);
    return this.http.get<Page<Funds>>(`${this.fundUrl}/getall`, { params: param });
  }

  saveFund(funds: Funds): Observable<Funds> {
    return this.http.post<Funds>(`${this.fundUrl}/save`, funds);
  }

  getStudentsByFunder(email: string): Observable<Funds[]> {
    return this.http.get<Funds[]>(`${this.fundUrl}/findFunder/${email}`);
  }
  
  getBar(): Observable<Funderamount[]> {
    return this.http.get<Funderamount[]>(`${this.fundUrl}/bar`);
  }

  getPie(): Observable<{ totalStudentAmount: number[], totalMaintenanceAmount: number[] }> {
    return this.http.get<{ totalStudentAmount: number[], totalMaintenanceAmount: number[] }>(`${this.fundUrl}/pie`);
  }

}
