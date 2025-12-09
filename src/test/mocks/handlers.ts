import { HttpResponse, http } from 'msw';

export const handlers = [
  http.get('https://api.openweathermap.org/data/2.5/air_pollution', ({ request }) => {
    const url = new URL(request.url);
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');

    if (lat === '6.5244' && lon === '3.3792') {
      return HttpResponse.json({
        coord: { lat: 6.5244, lon: 3.3792 },
        list: [
          {
            main: { aqi: 2 },
            components: { pm2_5: 30, pm10: 50, o3: 40, no2: 20, so2: 10, co: 300 },
            dt: Math.floor(Date.now() / 1000)
          },
        ],
      });
    }

    return HttpResponse.json({ error: 'Location not mocked' }, { status: 404 });
  }),

  http.get('https://api.openweathermap.org/data/2.5/weather', ({ request }) => {
    const url = new URL(request.url);
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');

    if (lat === '6.5244' && lon === '3.3792') {
      return HttpResponse.json({
        coord: { lon: 3.3792, lat: 6.5244 },
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
        main: { temp: 30, feels_like: 35, pressure: 1012, humidity: 70 },
        visibility: 10000,
        wind: { speed: 5, deg: 270 },
        dt: Math.floor(Date.now() / 1000),
        name: 'Lagos',
      });
    }
    return HttpResponse.json({ error: 'Weather not mocked' }, { status: 404 });
  }),

  http.get('/api/monitoring-stations', () => {
    return HttpResponse.json({
      stations: [
        { id: 'station-lagos-1', name: 'Lagos Island', lat: 6.45, lng: 3.4, currentAqi: 120, lastUpdated: new Date().toISOString() },
        { id: 'station-mainland-1', name: 'Lagos Mainland', lat: 6.6, lng: 3.35, currentAqi: 80, lastUpdated: new Date().toISOString() },
      ],
    });
  }),
];
