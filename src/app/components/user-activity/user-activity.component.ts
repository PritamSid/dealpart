import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, input } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-user-activity',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="dashboard-card h-100">
      <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
        <div>
          <p class="section-kicker mb-1">Realtime</p>
          <h3 class="section-title mb-1">Users in last 30 minutes</h3>
          <div class="big-number">{{ totalUsers() }}</div>
        </div>
        <span class="badge text-bg-success-subtle">Live</span>
      </div>

      <div class="chart-wrap">
        <canvas #activityChart></canvas>
      </div>
    </section>
  `,
  styles: [
    `
      .dashboard-card {
        background: #ffffff;
        border: 1px solid #e5efe8;
        border-radius: 24px;
        padding: 1.15rem;
        box-shadow: 0 20px 45px rgba(15, 23, 42, 0.06);
        width: 100%;
        // max-width: 500px;
      }

      .section-kicker {
        color: #6f8479;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-weight: 700;
      }

      .section-title {
        color: #183b2b;
        font-weight: 800;
        font-size: 1.1rem;
      }

      .big-number {
        color: #1f7a51;
        font-size: 2rem;
        font-weight: 800;
      }

      .chart-wrap {
        height: 180px;
        max-width: 400px;
        width: 100%;
      }
    `,
  ],
})
export class UserActivityComponent implements AfterViewInit, OnDestroy {
  readonly totalUsers = input.required<string>();
  readonly activityData = input.required<number[]>();

  @ViewChild('activityChart') private chartRef?: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;

  ngAfterViewInit(): void {
    const canvas = this.chartRef?.nativeElement;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return;
    }

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.activityData().map((_, index) => `${index + 1}`),
        datasets: [
          {
            data: this.activityData(),
            backgroundColor: this.activityData().map((_, index) =>
              index === 3 || index === 7 ? '#2f9e69' : index % 2 === 0 ? '#bfe7cf' : '#cbeef1'
            ),
            borderRadius: 8,
            borderSkipped: false,
            maxBarThickness: 18,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            display: false,
            grid: { display: false },
            border: { display: false },
          },
          y: {
            display: false,
            grid: { display: false },
            border: { display: false },
            beginAtZero: true,
          },
        },
      },
    };

    this.chart = new Chart(canvas, config);
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
