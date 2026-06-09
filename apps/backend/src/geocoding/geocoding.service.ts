import { Injectable, Logger } from '@nestjs/common';

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

@Injectable()
export class GeocodingService {
  private readonly logger = new Logger(GeocodingService.name);

  /**
   * Resolves an address to lat/lng via Nominatim (OpenStreetMap).
   * Returns null if the address cannot be resolved.
   */
  async geocode(address: string): Promise<{ lat: number; lng: number } | null> {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', address);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '1');

    try {
      const res = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'AutoHub/1.0 (diploma project)',
          'Accept-Language': 'uk,en',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!res.ok) {
        this.logger.warn(`Nominatim HTTP ${res.status} for "${address}"`);
        return null;
      }

      const data = (await res.json()) as NominatimResult[];
      if (!data.length) {
        return null;
      }

      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    } catch (err) {
      this.logger.warn(
        `Geocoding failed for "${address}": ${String(
          err instanceof Error ? err.message : err,
        )}`,
      );
      return null;
    }
  }
}
