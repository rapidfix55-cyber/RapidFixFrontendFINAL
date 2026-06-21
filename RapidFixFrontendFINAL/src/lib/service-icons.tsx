import { Wrench, Car, Wind, Battery, Settings, Paintbrush, Zap, Gauge } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ServiceIconKey =
  | "mechanic-near-me"
  | "bike-service"
  | "car-service"
  | "car-ac-repair"
  | "battery-replacement"
  | "tyre-wheel"
  | "engine-repair"
  | "denting-painting"
  | "ev-service";

const iconMap: Record<ServiceIconKey, LucideIcon> = {
  "mechanic-near-me": Wrench,
  "bike-service": Gauge,
  "car-service": Car,
  "car-ac-repair": Wind,
  "battery-replacement": Battery,
  "tyre-wheel": Settings,
  "engine-repair": Wrench,
  "denting-painting": Paintbrush,
  "ev-service": Zap,
};

interface ServiceIconProps {
  slug: ServiceIconKey;
  className?: string;
}

export function ServiceIcon({ slug, className }: ServiceIconProps) {
  const Icon = iconMap[slug] ?? Wrench;
  return <Icon className={className} strokeWidth={1.5} />;
}
