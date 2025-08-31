"use client";

import { useMemo, useState } from "react";
import { COUNTRIES, DEFAULT_COUNTRY_ID } from "~~/constants/countries";

export function useDeposit() {
  const [countryId, setCountryId] = useState<string>(DEFAULT_COUNTRY_ID);
  const [usdt, setUsdt] = useState<string>("");

  const country = useMemo(() => COUNTRIES.find(c => c.id === countryId)!, [countryId]);
  const usdtNum = useMemo(() => Number(usdt || 0), [usdt]);
  const localAmount = useMemo(() => usdtNum * country.rate, [usdtNum, country.rate]);
  const loanAmount = useMemo(() => (usdtNum > 0 ? localAmount * 0.5 : 0), [localAmount, usdtNum]);

  return {
    countryId,
    setCountryId,
    usdt,
    setUsdt,
    country,
    usdtNum,
    localAmount,
    loanAmount,
  };
}
