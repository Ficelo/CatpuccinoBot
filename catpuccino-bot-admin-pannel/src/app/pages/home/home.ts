import { Component, OnInit } from '@angular/core';
import { Database } from '../../services/database';
import { Agent } from '../../models/agent';
import { CardModule } from 'primeng/card';
import { CommonModule, NgFor } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CardModule, CommonModule, NgFor],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true
})
export class Home implements OnInit {

  agents$ : Observable<Agent[]> = new Observable();

  constructor(private databaseService : Database) {}

  ngOnInit(): void {
    this.agents$ = this.databaseService.getAllAgents();
  }
}
