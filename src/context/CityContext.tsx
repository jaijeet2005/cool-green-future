import { createContext, useContext, useState, ReactNode } from "react";
import { cities, CityData } from "@/data/cities";

interface CityContextType {
  selectedCity: CityData;
  setSelectedCity: (city: CityData) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<CityData>(cities[0]);
  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error("useCity must be used within CityProvider");
  return ctx;
}
