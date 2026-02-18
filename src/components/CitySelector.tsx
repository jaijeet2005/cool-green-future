import { cities } from "@/data/cities";
import { useCity } from "@/context/CityContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CitySelector() {
  const { selectedCity, setSelectedCity } = useCity();

  return (
    <Select
      value={selectedCity.id}
      onValueChange={(val) => {
        const city = cities.find((c) => c.id === val);
        if (city) setSelectedCity(city);
      }}
    >
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select city" />
      </SelectTrigger>
      <SelectContent>
        {cities.map((city) => (
          <SelectItem key={city.id} value={city.id}>
            {city.name}, {city.state}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
