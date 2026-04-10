import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, input } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { WeeklyMetric } from '../../services/dashboard-data.service';

Chart.register(...registerables);

@Component({
  selector: 'app-weekly-report',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="dashboard-card h-100">
      <div class="section-head mb-3">
        <div>
          <p class="section-kicker mb-1">Analytics</p>
          <h3 class="section-title mb-0">Weekly Report</h3>
        </div>
        <span class="badge text-bg-success-subtle">+18.2% growth</span>
      </div>

      <div class="metric-grid mb-3">
        <div class="metric-tile" *ngFor="let item of summary()">
          <small>{{ item.label }}</small>
          <strong>{{ item.value }}</strong>
        </div>
      </div>

      <div class="chart-wrap">
        <canvas #weeklyChart></canvas>
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
      }

      .section-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
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
      }

      .metric-grid {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 0.75rem;
      }

      .metric-tile {
        background: #f7fbf8;
        border: 1px solid #e7f0ea;
        border-radius: 16px;
        padding: 0.75rem;
      }

      .metric-tile small {
        display: block;
        color: #73877d;
        margin-bottom: 0.25rem;
      }

      .metric-tile strong {
        color: #1d3d2d;
        font-size: 1.02rem;
      }

      .chart-wrap {
        height: 270px;
      }

      @media (max-width: 1199.98px) {
        .metric-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      @media (max-width: 767.98px) {
        .section-head {
          flex-direction: column;
        }

        .metric-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .chart-wrap {
          height: 220px;
        }
      }
    `,
  ],
})
export class WeeklyReportComponent implements AfterViewInit, OnDestroy {
  readonly summary = input.required<WeeklyMetric[]>();
  readonly chartData = input.required<number[]>();

  @ViewChild('weeklyChart') private chartRef?: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;

  ngAfterViewInit(): void {
    const canvas = this.chartRef?.nativeElement;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return;
    }

    const gradient = context.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(47, 158, 105, 0.35)');
    gradient.addColorStop(1, 'rgba(47, 158, 105, 0.02)');

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            data: this.chartData(),
            borderColor: '#2f9e69',
            backgroundColor: gradient,
            fill: true,
            tension: 0.38,
            borderWidth: 3,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: '#6f8479' },
          },
          y: {
            beginAtZero: true,
            grid: { color: '#eef4ef' },
            border: { display: false },
            ticks: { color: '#6f8479' },
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
