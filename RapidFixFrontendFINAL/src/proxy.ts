import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const services = [
  'bike-service',
  'battery-replacement',
  'car-ac-repair',
  'car-service',
  'denting-painting',
  'engine-repair',
  'ev-service',
  'mechanic-near-me',
  'tyre-wheel',
];

const cities = [
  'delhi', 'noida', 'gurgaon', 'faridabad', 'ghaziabad', 'greater-noida', 'dwarka',
  'gurugram', 'manesar', 'bahadurgarh', 'sonipat', 'rohtak', 'panipat', 'karnal',
  'rewari', 'bhiwadi', 'alwar', 'meerut', 'hapur', 'bulandshahr', 'modinagar',
  'mumbai', 'bangalore', 'hyderabad', 'chennai', 'kolkata', 'pune', 'ahmedabad',
  'surat', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'bhopal',
  'patna', 'vadodara', 'ludhiana', 'agra', 'nashik', 'ranchi', 'coimbatore',
  'vijayawada', 'mysore', 'jodhpur', 'raipur', 'kochi', 'chandigarh',
  'bhubaneswar', 'thiruvananthapuram', 'visakhapatnam', 'madurai',
];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.slice(1);

  for (const service of services) {
    if (pathname.startsWith(`${service}-in-`)) {
      const city = pathname.replace(`${service}-in-`, '');
      if (!cities.includes(city)) {
        return NextResponse.rewrite(new URL('/not-found', request.url));
      }
      return NextResponse.rewrite(
        new URL(`/${service}-in-CITYSLUG?city=${city}`, request.url)
      );
    }
  }
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
