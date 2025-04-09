
import React from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IndianRupee, DollarSign, PoundSterling, Euro } from "lucide-react";

type Currency = {
  code: string;
  symbol: React.ReactNode;
  name: string;
};

const currencies: Currency[] = [
  {
    code: "INR",
    symbol: <IndianRupee size={14} className="mr-1" />,
    name: "Indian Rupee"
  },
  {
    code: "USD",
    symbol: <DollarSign size={14} className="mr-1" />,
    name: "US Dollar"
  },
  {
    code: "GBP",
    symbol: <PoundSterling size={14} className="mr-1" />,
    name: "British Pound"
  },
  {
    code: "AED",
    symbol: <span className="mr-1">د.إ</span>,
    name: "UAE Dirham"
  },
  {
    code: "EUR",
    symbol: <Euro size={14} className="mr-1" />,
    name: "Euro"
  }
];

interface CurrencySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  value, 
  onValueChange 
}) => {
  const selectedCurrency = currencies.find(c => c.code === value) || currencies[0];
  
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger 
        className="w-[85px] h-8 border-none focus:ring-0 focus:ring-offset-0 bg-transparent"
      >
        <SelectValue>
          <div className="flex items-center text-gray-800">
            {selectedCurrency.symbol}
            <span className="font-medium">{selectedCurrency.code}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="min-w-[140px]">
        {currencies.map((currency) => (
          <SelectItem 
            key={currency.code} 
            value={currency.code}
            className="cursor-pointer"
          >
            <div className="flex items-center">
              {currency.symbol}
              <span>{currency.code}</span>
              <span className="ml-2 text-gray-500 text-xs">{currency.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencySelector;
