import { Injectable } from '@angular/core';
import { Agent } from '../models/agent';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Database {

  baseUrl : string = "http://localhost:3001";
  agents : Agent[] = [];

  constructor(private http : HttpClient){}

  getAllAgents() : Observable<Agent[]> {
    return this.http.get<Agent[]>(this.baseUrl + '/agents');
  }

}
