import React, { useContext, useState, useEffect } from "react";
import MyContext from "../../context/data/myContext";
import { Search } from "lucide-react";

function Filter() {
  const context = useContext(MyContext);
  const { 
    categories, 
    mode, 
    product, 
    setProduct,
    setFilterType,
    setSearchKey 
  } = context;

  // Local filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // Store original products when component mounts
  const [originalProducts, setOriginalProducts] = useState([]);

  // Effect to capture original products when they first load
  useEffect(() => {
    if (product.length > 0 && originalProducts.length === 0) {
      setOriginalProducts(product);
    }
  }, [product, originalProducts]);

  // Filter function 
  const applyFilters = (products, query, category, type) => {
    if (!products || products.length === 0) return [];

    return products.filter(item => {
      // Search filter
      const matchesSearch = !query || 
        (item.title?.toLowerCase().includes(query.toLowerCase())) || 
        (item.description?.toLowerCase().includes(query.toLowerCase()));

      // Category filter
      const matchesCategory = !category || 
        item.category?.toLowerCase() === category.toLowerCase();

      // Type filter
      const matchesType = !type || item.type === type;

      return matchesSearch && matchesCategory && matchesType;
    });
  };

  // Handle search input
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchKey(query);
    
    // Always filter from the original list
    const results = applyFilters(
      originalProducts,
      query,
      selectedCategory,
      selectedType
    );
    setProduct(results);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    
    // Always filter from the original list
    const results = applyFilters(
      originalProducts,
      searchQuery,
      category,
      selectedType
    );
    setProduct(results);
  };

  // Handle type change
  const handleTypeChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);
    setFilterType(type);
    
    // Always filter from the original list
    const results = applyFilters(
      originalProducts,
      searchQuery,
      selectedCategory,
      type
    );
    setProduct(results);
  };

  // Reset all filters
  const resetFilters = () => {
    // Reset local state
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedType("");

    // Reset context filters
    setSearchKey("");
    setFilterType("");

    // Reset to original products
    setProduct(originalProducts);
  };

  return (
    <div className="container mx-auto px-4 mt-5">
      <div className={`p-5 rounded-lg drop-shadow-xl border ${mode === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-200 text-black"}`}>
        {/* Search Input */}
        <div className="relative mb-6">
          <label htmlFor="search" className="block text-sm font-medium mb-2">
            Search Items
          </label>
          <div className="relative">
            <div className="absolute flex items-center ml-3 h-full">
              <Search className="text-emerald-400 w-6 h-6" />
            </div>
            <input
              id="search"
              type="text"
              placeholder="Search for lost items..."
              value={searchQuery}
              onChange={handleSearchChange}
              className={`pl-12 pr-4 py-3 w-full rounded-md outline-none text-sm ${
                mode === "dark" 
                  ? "bg-gray-700 text-white border-gray-600" 
                  : "bg-white text-black border border-gray-300"
              }`}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category Filter */}
          <div className="flex flex-col">
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className={`px-4 py-3 w-full rounded-md outline-none text-sm border ${
                mode === "dark"
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category.toLowerCase()}>{category}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex flex-col">
            <label htmlFor="type" className="block text-sm font-medium mb-2">
              Item Type
            </label>
            <select
              id="type"
              value={selectedType}
              onChange={handleTypeChange}
              className={`px-4 py-3 w-full rounded-md outline-none text-sm border ${
                mode === "dark"
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              <option value="">All Types</option>
              <option value="found">Found Items</option>
              <option value="request">Recovery Requests</option>
            </select>
          </div>

          {/* Reset Button */}
          <div className="flex flex-col justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-colors duration-200 text-sm font-medium"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-6 text-sm flex justify-between items-center">
          <span className="font-medium">{product.length} items found</span>
        </div>
      </div>
    </div>
  );
}

export default Filter;