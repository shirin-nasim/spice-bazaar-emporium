
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { searchProducts, Product } from "@/lib/search";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  onSelectProduct?: (product: Product) => void;
  autoFocus?: boolean;
  minimal?: boolean;
}

export const SearchBar = ({
  placeholder = "Search products...",
  className = "",
  onSearch,
  onSelectProduct,
  autoFocus = false,
  minimal = false,
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();

  useEffect(() => {
    const handleSearch = async () => {
      if (debouncedQuery.trim() === "") {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await searchProducts(debouncedQuery);
        setResults(searchResults);
        setIsOpen(searchResults.length > 0);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    handleSearch();
  }, [debouncedQuery]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSelectProduct = (product: Product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      navigate(`/products/${product.id}`);
    }
    setIsOpen(false);
    setQuery("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full ${
            minimal
              ? "pl-8 pr-4 py-1.5 text-sm"
              : "pl-10 pr-4 py-2 text-base"
          } rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500`}
        />
        <Search
          className={`absolute ${
            minimal ? "left-2 top-1.5" : "left-3 top-1/2 transform -translate-y-1/2"
          } text-gray-400`}
          size={minimal ? 16 : 18}
        />
      </form>

      {isOpen && (
        <div
          ref={resultsRef}
          className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg max-h-80 overflow-y-auto border border-gray-200"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((product) => (
                <li key={product.id}>
                  <button
                    onClick={() => handleSelectProduct(product)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  >
                    <div className="w-10 h-10 flex-shrink-0 mr-3">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {product.description.substring(0, 60)}
                        {product.description.length > 60 ? "..." : ""}
                      </p>
                    </div>
                    <div className="ml-auto font-medium text-amber-600">
                      ${(product.sale_price || product.price).toFixed(2)}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.trim() !== "" ? (
            <div className="p-4 text-center text-gray-500">
              No products found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
