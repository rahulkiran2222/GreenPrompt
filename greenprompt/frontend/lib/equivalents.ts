export const EQUIVALENT_LABELS: Record<string, { label: string; icon: string; format: (n: number) => string }> = {
  smartphone_charges: { label: "Smartphone charges", icon: "📱", format: n => n.toFixed(4) },
  led_bulb_hours: { label: "LED bulb hours", icon: "💡", format: n => n.toFixed(3) },
  laptop_minutes: { label: "Laptop minutes", icon: "💻", format: n => n.toFixed(2) },
  google_searches: { label: "Google searches", icon: "🔍", format: n => n.toFixed(2) },
  ev_meters_driven: { label: "EV meters driven", icon: "🚗", format: n => n.toFixed(2) },
  trees_needed_yearly: { label: "Trees (yr offset)", icon: "🌳", format: n => n.toExponential(2) },
};