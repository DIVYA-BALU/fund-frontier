import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { FundsService } from 'src/app/services/funds.service';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {

  subscription$: Subscription = new Subscription();

  fundersEmail: string[] = [];
  paidAmount: number[] = [];

  constructor(private http: HttpClient, private fundsService: FundsService) { }

  ngOnInit(): void {
    this.subscription$.add(this.fundsService.getBar()
      .subscribe(data => {

        data.forEach((value) => {
          this.fundersEmail.push(value.funderEmail);
          this.paidAmount.push(value.totalPaidAmount);
        })

        this.createBarChart(this.fundersEmail, this.paidAmount);
      }));

    this.subscription$.add(this.fundsService.getPie().subscribe(data => {
      this.renderPieChart(data);
    }));

  }

  createBarChart(labels: string[], data: number[]) {
    const chart = new Chart('barchart', {
      type: 'bar',
      data: {
        labels: this.fundersEmail,
        datasets: [{
          label: 'Total Paid Amount (Rs.)',
          data: this.paidAmount,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y:
          {
            beginAtZero: true
          }
        }
      }
    });
  }

  renderPieChart(data: { totalStudentAmount: number[], totalMaintenanceAmount: number[] }) {
    const myPieChart = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: ['Student Amount (Rs.)', 'Maintenance Amount (Rs.)'],
        datasets: [{
          data: [data.totalStudentAmount, data.totalMaintenanceAmount],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)'
          ],
          borderWidth: 1
        }]
      }
    });
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}


