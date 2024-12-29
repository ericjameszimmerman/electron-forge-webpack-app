/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 */

import './index.css';
import { Chart, ChartConfiguration } from 'chart.js/auto';

// Initialize the chart
const initDashboard = () => {
  const canvas = document.getElementById('metricsChart') as HTMLCanvasElement;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const maxDataPoints = 30; // 30 seconds of data
  const initialData = Array(maxDataPoints).fill(0);
  const labels = Array(maxDataPoints).fill('');

  const chartConfig: ChartConfiguration = {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'CPU Usage',
          data: [...initialData],
          borderColor: '#4CAF50',
          tension: 0.4,
          fill: false
        },
        {
          label: 'Memory Usage',
          data: [...initialData],
          borderColor: '#2196F3',
          tension: 0.4,
          fill: false
        },
        {
          label: 'Disk Usage',
          data: [...initialData],
          borderColor: '#FFC107',
          tension: 0.4,
          fill: false
        },
        {
          label: 'Network',
          data: [...initialData],
          borderColor: '#9C27B0',
          tension: 0.4,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ffffff'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ffffff'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#ffffff'
          }
        }
      }
    }
  };

  const chart = new Chart(ctx, chartConfig);

  // Function to update chart data
  function updateChart(newData: number[]) {
    chart.data.datasets.forEach((dataset: any, index: number) => {
      dataset.data.push(newData[index]);
      if (dataset.data.length > maxDataPoints) {
        dataset.data.shift();
      }
    });
    chart.update('none');
  }

  // Function to update monitor values
  function updateMonitors(data: number[]) {
    const elements = {
      cpu: document.getElementById('cpu-value'),
      memory: document.getElementById('memory-value'),
      disk: document.getElementById('disk-value'),
      network: document.getElementById('network-value')
    };

    if (elements.cpu) elements.cpu.textContent = `${data[0].toFixed(1)}%`;
    if (elements.memory) elements.memory.textContent = `${data[1].toFixed(1)}%`;
    if (elements.disk) elements.disk.textContent = `${data[2].toFixed(1)}%`;
    if (elements.network) elements.network.textContent = `${data[3].toFixed(1)} KB/s`;
  }

  // Simulate real-time data (replace with actual data source)
  setInterval(() => {
    const newData = [
      Math.random() * 100, // CPU
      Math.random() * 100, // Memory
      Math.random() * 100, // Disk
      Math.random() * 1000 // Network
    ];
    
    updateMonitors(newData);
    updateChart(newData);
  }, 1000);
};

// Initialize dashboard when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboard);
} else {
  initDashboard();
}
