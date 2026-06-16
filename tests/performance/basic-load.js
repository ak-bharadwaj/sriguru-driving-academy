import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5s', target: 20 }, // Ramp-up to 20 virtual users
    { duration: '10s', target: 20 }, // Stay at 20 users
    { duration: '5s', target: 0 },  // Ramp-down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
  },
};

export default function () {
  const res = http.get('http://localhost:3000/');
  check(res, {
    'is status 200': (r) => r.status === 200,
    'loads landing page': (r) => r.body.includes('Sri Guru'),
  });
  sleep(1);
}
