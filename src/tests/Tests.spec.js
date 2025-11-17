import http from 'k6/http';
import { Trend, Rate } from 'k6/metrics';
import { check, sleep } from 'k6';

export const getDuration = new Trend('get_duration'); // Trend da duração
export const statusRate = new Rate('status_rate'); // Rate para validar status

export const options = {
  stages: [
    { duration: '30s', target: 7 },
    { duration: '2m', target: 92 },
    { duration: '1m', target: 92 }
  ],

  thresholds: {
    http_req_duration: ['p(90)<6800'],
    http_req_failed: ['rate<0.25'],

    get_duration: ['p(90)<6800'],
    status_rate: ['rate>0.75']
  }
};

export default function () {
  const apiKey = 'reqres-free-v1';

  const res = http.get('https://fakestoreapi.com/products');

  getDuration.add(res.timings.duration);

  statusRate.add(res.status === 200);

  check(res, {
    'status é 200': r => r.status === 200
  });

  sleep(1);
}
