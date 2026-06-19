import type { ComponentType } from "react";

type ServiceIconProps = {
  className?: string;
};

export type ServiceIconKey =
  | "bike-service"
  | "car-service"
  | "car-ac-repair"
  | "battery-replacement"
  | "tyre-wheel"
  | "engine-repair"
  | "denting-painting"
  | "ev-service";

function BikeServiceIcon({ className }: ServiceIconProps) {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <circle cx="16" cy="46" r="12" fill="#1A1A1A" />
      <circle cx="16" cy="46" r="8" fill="none" stroke="#D3D3D3" strokeWidth="2" />
      <circle cx="48" cy="46" r="12" fill="#1A1A1A" />
      <circle cx="48" cy="46" r="8" fill="none" stroke="#D3D3D3" strokeWidth="2" />
      <rect x="24" y="34" width="16" height="12" fill="#4A4A4A" />
      <path d="M 26 36 L 38 36 M 26 40 L 38 40 M 26 44 L 38 44" stroke="#1A1A1A" strokeWidth="2" />
      <path d="M 36 44 L 48 44 L 54 40" fill="none" stroke="#D3D3D3" strokeWidth="4" strokeLinecap="square" />
      <path d="M 22 34 L 16 20 L 26 20 L 36 28 L 44 28 L 48 36 Z" fill="#C2351A" />
      <path d="M 48 46 L 40 20 L 38 16" fill="none" stroke="#1A1A1A" strokeWidth="4" />
      <path d="M 34 16 L 42 16" fill="none" stroke="#1A1A1A" strokeWidth="4" />
      <path d="M 24 28 L 34 28 L 32 32 L 22 32 Z" fill="#1A1A1A" />
    </svg>
  );
}

function CarServiceIcon({ className }: ServiceIconProps) {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <rect x="6" y="38" width="10" height="16" rx="2" fill="#1A1A1A" />
      <rect x="48" y="38" width="10" height="16" rx="2" fill="#1A1A1A" />
      <path d="M 12 36 L 8 46 L 56 46 L 52 36 Z" fill="#C2351A" />
      <path d="M 14 36 L 18 22 L 46 22 L 50 36 Z" fill="#C2351A" />
      <path d="M 20 24 L 44 24 L 48 34 L 16 34 Z" fill="#1A1A1A" />
      <rect x="22" y="38" width="20" height="8" fill="#1A1A1A" />
      <path d="M 22 42 L 42 42" stroke="#D3D3D3" strokeWidth="2" />
      <rect x="12" y="38" width="6" height="4" fill="#D3D3D3" />
      <rect x="46" y="38" width="6" height="4" fill="#D3D3D3" />
    </svg>
  );
}

function CarAcRepairIcon({ className }: ServiceIconProps) {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <g stroke="#1A1A1A" strokeWidth="4" strokeLinecap="square">
        <line x1="32" y1="6" x2="32" y2="58" />
        <line x1="6" y1="32" x2="58" y2="32" />
        <line x1="13.6" y1="13.6" x2="50.4" y2="50.4" />
        <line x1="13.6" y1="50.4" x2="50.4" y2="13.6" />
      </g>
      <g stroke="#C2351A" strokeWidth="4" fill="none" strokeLinecap="square">
        <path d="M 32 16 L 24 24 M 32 16 L 40 24" />
        <path d="M 32 48 L 24 40 M 32 48 L 40 40" />
        <path d="M 16 32 L 24 24 M 16 32 L 24 40" />
        <path d="M 48 32 L 40 24 M 48 32 L 40 40" />
      </g>
      <circle cx="32" cy="32" r="6" fill="#C2351A" />
      <circle cx="32" cy="32" r="3" fill="#FFF" />
    </svg>
  );
}

function BatteryReplacementIcon({ className }: ServiceIconProps) {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <rect x="10" y="24" width="44" height="32" rx="2" fill="#1A1A1A" />
      <rect x="8" y="20" width="48" height="6" fill="#4A4A4A" />
      <rect x="16" y="12" width="10" height="8" rx="1" fill="#C2351A" />
      <path d="M 21 13 L 21 19 M 18 16 L 24 16" stroke="#FFF" strokeWidth="2" />
      <rect x="38" y="12" width="10" height="8" rx="1" fill="#D3D3D3" />
      <path d="M 40 16 L 46 16" stroke="#1A1A1A" strokeWidth="2" />
      <rect x="16" y="32" width="32" height="16" fill="#333333" />
      <rect x="16" y="32" width="8" height="16" fill="#C2351A" />
      <path d="M 28 40 L 44 40 M 28 44 L 40 44" stroke="#D3D3D3" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}

function TyreWheelIcon({ className }: ServiceIconProps) {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="28" fill="#1A1A1A" />
      <circle cx="32" cy="32" r="25" fill="none" stroke="#333333" strokeWidth="4" strokeDasharray="6 4" />
      <circle cx="32" cy="32" r="18" fill="none" stroke="#D3D3D3" strokeWidth="4" />
      <path d="M 16 32 A 16 16 0 0 1 32 16 L 32 22 A 10 10 0 0 0 22 32 Z" fill="#C2351A" />
      <path d="M 32 14 L 36 32 L 28 32 Z" fill="#4A4A4A" />
      <path d="M 32 50 L 36 32 L 28 32 Z" fill="#4A4A4A" />
      <path d="M 14 32 L 32 36 L 32 28 Z" fill="#4A4A4A" />
      <path d="M 50 32 L 32 36 L 32 28 Z" fill="#4A4A4A" />
      <path d="M 19 19 L 32 32 L 28 36 Z" fill="#4A4A4A" />
      <path d="M 45 45 L 32 32 L 36 28 Z" fill="#4A4A4A" />
      <circle cx="32" cy="32" r="4" fill="#D3D3D3" />
      <circle cx="32" cy="32" r="2" fill="#1A1A1A" />
    </svg>
  );
}

function EngineRepairIcon({ className }: ServiceIconProps) {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <g fill="#1A1A1A">
        <circle cx="28" cy="28" r="16" />
        <rect x="24" y="6" width="8" height="44" rx="1" />
        <rect x="6" y="24" width="44" height="8" rx="1" />
        <rect x="12" y="12" width="32" height="32" rx="1" transform="rotate(45 28 28)" />
      </g>
      <circle cx="28" cy="28" r="8" fill="#FFF" />
      <circle cx="28" cy="28" r="6" fill="#1A1A1A" />
      <g transform="rotate(45 32 32)">
        <rect x="28" y="10" width="8" height="44" fill="#C2351A" />
        <path d="M 24 10 C 24 4, 40 4, 40 10 L 40 16 L 36 16 L 36 12 L 28 12 L 28 16 L 24 16 Z" fill="#D3D3D3" />
        <path d="M 24 54 C 24 60, 40 60, 40 54 L 40 48 L 36 48 L 36 52 L 28 52 L 28 48 L 24 48 Z" fill="#D3D3D3" />
      </g>
    </svg>
  );
}

function DentingPaintingIcon({ className }: ServiceIconProps) {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M 26 6 L 40 6 L 36 24 L 28 24 Z" fill="#D3D3D3" />
      <rect x="28" y="4" width="10" height="2" fill="#1A1A1A" />
      <path d="M 20 24 L 42 24 L 44 28 L 24 28 Z" fill="#1A1A1A" />
      <path d="M 24 28 L 36 28 L 30 52 L 22 52 Z" fill="#C2351A" />
      <path d="M 22 28 C 18 36, 18 40, 26 44" fill="none" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" />
      <rect x="42" y="22" width="6" height="8" fill="#D3D3D3" />
      <rect x="48" y="24" width="4" height="4" fill="#1A1A1A" />
      <path d="M 54 20 L 62 14 M 56 26 L 64 26 M 54 32 L 62 38" stroke="#C2351A" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function EVServiceIcon({ className }: ServiceIconProps) {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M 8 56 C 8 40, 20 40, 20 40" fill="none" stroke="#1A1A1A" strokeWidth="6" strokeLinecap="round" />
      <path d="M 16 34 L 32 34 L 36 22 L 20 22 Z" fill="#1A1A1A" />
      <path d="M 32 34 L 42 34 L 44 26 L 35 26 Z" fill="#4A4A4A" />
      <rect x="42" y="28" width="8" height="4" rx="1" fill="#D3D3D3" />
      <path d="M 40 8 L 24 32 L 36 32 L 32 56 L 56 26 L 40 26 Z" fill="#C2351A" stroke="#FFF" strokeWidth="2" />
    </svg>
  );
}

const SERVICE_ICON_COMPONENTS: Record<ServiceIconKey, ComponentType<ServiceIconProps>> = {
  "bike-service": BikeServiceIcon,
  "car-service": CarServiceIcon,
  "car-ac-repair": CarAcRepairIcon,
  "battery-replacement": BatteryReplacementIcon,
  "tyre-wheel": TyreWheelIcon,
  "engine-repair": EngineRepairIcon,
  "denting-painting": DentingPaintingIcon,
  "ev-service": EVServiceIcon,
};

export function ServiceIcon({ slug, className }: { slug: ServiceIconKey; className?: string }) {
  const Icon = SERVICE_ICON_COMPONENTS[slug];
  return <Icon className={className} />;
}