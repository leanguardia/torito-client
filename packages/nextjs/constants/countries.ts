export type Country = {
  id: string;
  name: string;
  flag: string;
  symbol: string;
  code: string;
  rate: number;
};

export const COUNTRIES: readonly Country[] = [
  { id: "bo", name: "Bolivia", flag: "🇧🇴", symbol: "Bs", code: "BOB", rate: 12.2 },
  { id: "ar", name: "Argentina", flag: "🇦🇷", symbol: "$", code: "ARS", rate: 1000 },
  { id: "co", name: "Colombia", flag: "🇨🇴", symbol: "$", code: "COP", rate: 4100 },
  { id: "pe", name: "Perú", flag: "🇵🇪", symbol: "S/", code: "PEN", rate: 3.7 },
  { id: "cl", name: "Chile", flag: "🇨🇱", symbol: "$", code: "CLP", rate: 940 },
  { id: "br", name: "Brasil", flag: "🇧🇷", symbol: "R$", code: "BRL", rate: 5.4 },
  { id: "uy", name: "Uruguay", flag: "🇺🇾", symbol: "$", code: "UYU", rate: 40 },
  { id: "ec", name: "Ecuador", flag: "🇪🇨", symbol: "$", code: "USD", rate: 1 },
  { id: "cr", name: "Costa Rica", flag: "🇨🇷", symbol: "₡", code: "CRC", rate: 510 },
  { id: "ke", name: "Kenya", flag: "🇰🇪", symbol: "KSh", code: "KES", rate: 130 },
  { id: "gh", name: "Ghana", flag: "🇬🇭", symbol: "₵", code: "GHS", rate: 15 },
  { id: "ng", name: "Nigeria", flag: "🇳🇬", symbol: "₦", code: "NGN", rate: 1600 },
];

export const DEFAULT_COUNTRY_ID = "bo";
