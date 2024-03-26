import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Application } from '../model/application';
import { Observable } from 'rxjs';
import { Successstory } from '../model/successstory';
import { Page } from '../model/page';
import { Studentdetails } from '../model/studentdetails';
import { Studentfunds } from '../model/studentfunds';

@Injectable({
  providedIn: 'root',
})
export class StudentService {

  studentUrl = environment.studentUrl;
  storyUrl = environment.storyUrl;
  studentFundUrl = environment.studentFundsUrl;

  constructor(private http: HttpClient) { }

  saveApplication(application: FormData): Observable<Application> {
    return this.http.post<Application>(`${this.studentUrl}/save`, application);
  }

  getStudents(pageNo: number, pageSize: number): Observable<Page<Studentdetails>> {
    const param = new HttpParams()
      .set('pageNo', pageNo)
      .set('pageSize', pageSize);
    return this.http.get<Page<Studentdetails>>(`${this.studentUrl}/getallapproved`, { params: param });
  }

  getAllPending(
    pageIndex: number,
    pageSize: number
  ): Observable<Page<Studentdetails>> {

    const param = new HttpParams()
      .set('pageNo', pageIndex)
      .set('pageSize', pageSize);

    return this.http.get<Page<Studentdetails>>(
      `${this.studentUrl}/getallpending`, { params: param }
    );

  }

  getStudentsByYear(pageNo: number,pageSize: number, year: string): Observable<Page<Studentdetails>> {
    const param = new HttpParams()
      .set('pageNo', pageNo)
      .set('pageSize', pageSize);
    return this.http.get<Page<Studentdetails>>(
      `${this.studentUrl}/searchbyyear/${year}`, { params: param }
    );
  }

  getStudentsByCourse(pageNo: number,pageSize: number, course: string): Observable<Page<Studentdetails>> {
    const param = new HttpParams()
    .set('pageNo', pageNo)
    .set('pageSize', pageSize);
    return this.http.get<Page<Studentdetails>>(
      `${this.studentUrl}/searchbygroup/${course}`, { params: param }
    );
  }

  getStudentsByCollege(pageNo: number,pageSize: number, college: string): Observable<Page<Studentdetails>> {
    const param = new HttpParams()
      .set('pageNo', pageNo)
      .set('pageSize', pageSize);
    return this.http.get<Page<Studentdetails>>(
      `${this.studentUrl}/searchbycollege/${college}`, { params: param }
    );
  }

  viewStudent(email: string): Observable<Studentdetails> {
    return this.http.get<Studentdetails>(`${this.studentUrl}/get/${email}`);
  }

  getstories(pageNo: number, pageSize: number): Observable<Page<Successstory>> {
    const param = new HttpParams()
      .set('pageNo', pageNo)
      .set('pageSize', pageSize);
    return this.http.get<Page<Successstory>>(`${this.storyUrl}/getall`, { params: param });
  }

  setApproved(
    name: string,
    student: Studentdetails
  ): Observable<Studentdetails> {

    return this.http.put<Studentdetails>(
      `${this.studentUrl}/approved/${name}`,
      student
    );
  }

  setRejected(student: Studentdetails): Observable<Studentdetails> {
    return this.http.patch<Studentdetails>(`${this.studentUrl}/rejected`, student,)
  }
  getAllStudents(
    pageIndex: number,
    pageSize: number
  ): Observable<Page<Studentdetails>> {

    const param = new HttpParams().
      set('pageIndex', pageIndex).
      set('pageSize', pageSize);

    return this.http.get<Page<Studentdetails>>(`${this.studentUrl}/findall`, { params: param });
  }

  getRaisedAmount(email: string): Observable<Studentfunds> {
    return this.http.get<Studentfunds>(`${this.studentFundUrl}/getstudent/${email}`);
  }

  updateProfile(profilePhoto: File, email: string): Observable<Studentdetails> {
    const formData = new FormData();
    formData.append('file', profilePhoto);
    return this.http.patch<Studentdetails>(`${this.studentUrl}/updateProfile/${email}`, formData)
  }

  addStory(story: Successstory): Observable<Successstory> {
    return this.http.post<Successstory>(`${this.storyUrl}/save`, story);
  }

  findStudent(email: string): Observable<Studentdetails> {

    return this.http.get<Studentdetails>(`${this.studentUrl}/get/${email}`);
  }

  save(application: FormData): Observable<Studentdetails> {
    return this.http.post<Studentdetails>(`${this.studentUrl}/savestudent`, application);
  }

  saveFiles(formData: FormData, email: string): Observable<Studentdetails> {
    return this.http.put<Studentdetails>(`${this.studentUrl}/updatestudent/${email}`, formData)
  }


}

