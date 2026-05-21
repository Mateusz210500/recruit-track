import {
  afterNextRender,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';

import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_META,
  ApplicationStatus,
} from '../../../data/application-status';

const STATUS_CHART_COLORS: Record<ApplicationStatus, string> = {
  wishlist: '#64748b',
  applied: '#3b82f6',
  interview: '#f59e0b',
  offer: '#22c55e',
  rejected: '#ef4444',
};

type ChartModule = typeof import('chart.js');
type ChartInstance = InstanceType<ChartModule['Chart']>;

@Component({
  selector: 'app-status-distribution-chart',
  template: `
    <section
      class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      aria-labelledby="status-distribution-heading"
    >
      <h2 id="status-distribution-heading" class="text-lg font-semibold text-slate-900">
        Status distribution
      </h2>
      <p class="mt-1 text-sm text-slate-600">
        Share of applications across each pipeline stage.
      </p>
      <div class="mt-4 h-64">
        <canvas #chartCanvas aria-label="Status distribution chart"></canvas>
      </div>
    </section>
  `,
})
export class StatusDistributionChartComponent {
  readonly counts = input.required<Record<ApplicationStatus, number>>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly chartCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('chartCanvas');

  private chartModule: ChartModule | null = null;
  private chart: ChartInstance | null = null;

  constructor() {
    afterNextRender(() => {
      void this.ensureChart();
    });

    effect(() => {
      this.counts();
      void this.updateChart();
    });

    this.destroyRef.onDestroy(() => {
      this.chart?.destroy();
      this.chart = null;
    });
  }

  private async ensureChart(): Promise<void> {
    if (this.chart) {
      return;
    }

    this.chartModule = await import('chart.js');
    this.chartModule.Chart.register(...this.chartModule.registerables);

    const canvas = this.chartCanvas().nativeElement;
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    this.chart = new this.chartModule.Chart(context, {
      type: 'doughnut',
      data: this.buildChartData(),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }

  private async updateChart(): Promise<void> {
    await this.ensureChart();
    if (!this.chart) {
      return;
    }

    const nextData = this.buildChartData();
    this.chart.data.labels = nextData.labels;
    this.chart.data.datasets = nextData.datasets;
    this.chart.update();
  }

  private buildChartData() {
    const labels = APPLICATION_STATUSES.map(
      (status) => APPLICATION_STATUS_META[status].label,
    );
    const data = APPLICATION_STATUSES.map((status) => this.counts()[status]);
    const backgroundColor = APPLICATION_STATUSES.map(
      (status) => STATUS_CHART_COLORS[status],
    );

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderWidth: 0,
        },
      ],
    };
  }
}
