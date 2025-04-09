
import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Language = {
  code: string;
  flag: string;
  name: string;
};

const languages: Language[] = [
  {
    code: "EN",
    flag: "🇺🇸",
    name: "English"
  },
  {
    code: "HI",
    flag: "🇮🇳",
    name: "Hindi"
  },
  {
    code: "AR",
    flag: "🇦🇪",
    name: "Arabic"
  },
  {
    code: "ES",
    flag: "🇪🇸",
    name: "Spanish"
  },
  {
    code: "FR",
    flag: "🇫🇷",
    name: "French"
  }
];

export const LanguageSelector = () => {
  const [value, setValue] = useState("EN");
  const selectedLanguage = languages.find(l => l.code === value) || languages[0];
  
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger 
        className="w-[85px] h-8 border-none focus:ring-0 focus:ring-offset-0 bg-transparent"
      >
        <SelectValue>
          <div className="flex items-center text-gray-800">
            <span className="mr-1">{selectedLanguage.flag}</span>
            <span className="font-medium">{selectedLanguage.code}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="min-w-[140px]">
        {languages.map((language) => (
          <SelectItem 
            key={language.code} 
            value={language.code}
            className="cursor-pointer"
          >
            <div className="flex items-center">
              <span className="mr-2">{language.flag}</span>
              <span>{language.code}</span>
              <span className="ml-2 text-gray-500 text-xs">{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
