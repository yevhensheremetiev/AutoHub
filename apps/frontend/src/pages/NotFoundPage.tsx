import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import carSvgRaw from '@/assets/icons/car.svg?raw';
import lightningSvgRaw from '@/assets/icons/lightning.svg?raw';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

/** Renders `car.svg` inside a parent `<svg>` (nested SVG). Color = `className` (e.g. `text-primary`). */
function CarIconFromAsset(props: { className?: string }) {
  const markup = carSvgRaw
    .replace(/<\?xml[^>]*\?>\s*/i, '')
    .replace(
      /<svg[^>]*>/,
      `<svg width="280" height="145" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="${props.className ?? 'text-primary'}" aria-hidden="true">`,
    );

  return <g dangerouslySetInnerHTML={{ __html: markup }} />;
}

/** `lightning.svg` viewBox is 0–959.76; path `d` may span multiple lines. */
function lightningPathDFromRaw(raw: string): string {
  const pathTag = raw.indexOf('<path');
  if (pathTag === -1) return '';
  const start = raw.indexOf('d="', pathTag);
  if (start === -1) return '';
  let i = start + 3;
  while (i < raw.length && raw[i] !== '"') i += 1;
  return raw.slice(start + 3, i).replace(/\s+/g, ' ').trim();
}

function CollisionCarsIllustration() {
  const { t } = useTranslation();
  // Car graphic width/height from CarIconFromAsset (must match injected SVG attrs).
  const carW = 280;
  const carH = 145;
  const vbW = 900;
  const vbH = 300;
  const cx = vbW / 2;
  const cy = vbH / 2;
  const carY = (vbH - carH) / 2;
  /** Virtual half-gap at center — bumpers align to this. */
  const impactInnerR = 12;
  /**
   * `car.svg` viewBox is 0–24; path ends near x=22, stroke-width 2 → outer edge ≈ 23 in user units.
   */
  const carViewBox = 24;
  const silhouetteFrontX = (23 / carViewBox) * carW;
  /** Extra shift toward center (viewBox px). */
  const carsInwardPx = 75;
  const leftX = cx - impactInnerR + carsInwardPx - silhouetteFrontX;
  /** Mirrored car: world-x of unmirrored front at local x=silhouetteFrontX — see transform chain. */
  const rightGroupX = cx + impactInnerR - carsInwardPx - carW + silhouetteFrontX;

  /** Inward tilt toward collision (deg); pivot at front bumper so bumpers stay aligned. */
  const carTiltDeg = 10;
  const tiltPivotX = silhouetteFrontX;
  const tiltPivotY = carH * 0.72;

  const lightningD = lightningPathDFromRaw(lightningSvgRaw);
  /** Asset bolt points up; scale to ~ray length, origin at viewBox center. */
  const lightningScale = 0.048;
  const lightningVbCenter = 959.76 / 2;
  const lightningRadius = 52;
  const lightningOffsetX = 8;

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      className="mx-auto w-full max-w-4xl opacity-95 [filter:drop-shadow(0_18px_40px_rgba(0,0,0,0.45))]"
      role="img"
      aria-label={t('notFound.illustrationAriaLabel')}
    >
      {/* Cars — same asset as car.svg; fronts meet at center */}
      <g opacity="0.95">
        <g transform={`translate(${leftX}, ${carY})`}>
          <g
            transform={`translate(${tiltPivotX}, ${tiltPivotY}) rotate(${carTiltDeg}) translate(${-tiltPivotX}, ${-tiltPivotY})`}
          >
            <CarIconFromAsset className="text-primary" />
          </g>
        </g>

        {/* Mirror: same local tilt as left, then flip X — avoids asymmetric rotate(-θ). */}
        <g transform={`translate(${rightGroupX}, ${carY}) scale(-1, 1) translate(${-carW}, 0)`}>
          <g
            transform={`translate(${tiltPivotX}, ${tiltPivotY}) rotate(${carTiltDeg}) translate(${-tiltPivotX}, ${-tiltPivotY})`}
          >
            <CarIconFromAsset className="text-primary" />
          </g>
        </g>
      </g>

      <g
        className="opacity-90"
        transform={`translate(${cx}, ${cy}) translate(${lightningOffsetX}, ${-lightningRadius}) scale(${lightningScale}) translate(${-lightningVbCenter}, ${-lightningVbCenter})`}
      >
        <path d={lightningD} fill="#EAB308" />
      </g>
    </svg>
  );
}

export function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-background to-muted/30 px-4">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.20),_transparent_55%),_radial-gradient(circle_at_bottom,_hsl(var(--ring)/0.18),_transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.25] [background-image:linear-gradient(to_right,hsl(var(--foreground)/0.10)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.10)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(circle_at_center,black_25%,transparent_70%)]" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center py-14">
        <div className="w-full space-y-8 text-center">
          <Text
            as="p"
            align="center"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            {t('notFound.ohNo')}{' '}
          </Text>

          <Text
            as="h1"
            align="center"
            className="select-none text-7xl font-semibold tracking-tight text-primary sm:text-8xl"
          >
            404
          </Text>

          <Text
            as="p"
            align="center"
            className="mx-auto max-w-2xl text-balance text-base text-muted-foreground sm:text-lg"
          >
            {t('notFound.description')}
          </Text>

          <CollisionCarsIllustration />

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              onClick={() => navigate(-1)}
              size="lg"
              className="rounded-full px-6"
            >
              {t('notFound.goBack')}
            </Button>
            <Button
              type="button"
              onClick={() => navigate('/')}
              variant="outline"
              size="lg"
              className="rounded-full px-6"
            >
              {t('notFound.backToHome')}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
