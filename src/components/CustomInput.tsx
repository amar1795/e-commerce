import { searchProductsByNameOrBrand } from "@/actions/product/findProductbySearch";
import { getProductDetailsByID } from "@/actions/product/searchedProductData";
import { da } from "@faker-js/faker";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";

const CustomInput = () => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [searchedData, setsearchedData] = useState("");
  const containerRef = useRef(null);
  const [lastSelectedSuggestion, setLastSelectedSuggestion] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const timeoutRef = useRef(null); // Ref for timeout ID
  const router = useRouter();

  // console.log("this is the searched value", searchedData);
  // console.log("this is the suggestions", suggestions);

  const fetchSearchedData = async (id) => {
    // alert(searchedData)
    const fetchedData = await getProductDetailsByID(id);
    // const parentCategoryIds = fetchedData?.parentCategoryIds;
    let {parentCategory,topmostParentCategory} = fetchedData?.parentCategoryIds;
    // console.log("this is the parent category ids", parentCategoryIds);
    // let category2 =
    //   parentCategoryIds && parentCategoryIds[2]
    //     ? parentCategoryIds[2]
    //     : parentCategoryIds && parentCategoryIds[1]
    //     ? parentCategoryIds[1]
    //     : "";

    // const category0 =
    //   parentCategoryIds && parentCategoryIds[0] ? parentCategoryIds[0] : "";
    const productId = fetchedData?.productId || "";

    // Check and convert category2 if it is 'KidsCategory'
    if (parentCategory === "Kids Category") {
      parentCategory = "Kids";
    }

    // Remove spaces from category names
    // category2 = category2.replace(/\s+/g, "");
    const cleanedCategory0 = parentCategory.replace(/\s+/g, "");

    const testUrl = `/categories/${topmostParentCategory}/${cleanedCategory0}/${productId}`;
    // alert(testUrl)
    router.push(testUrl);
    // console.log("this is the test url", testUrl);
    // console.log("this is the fetched data", fetchedData);
  };

  useEffect(() => {
    // Load recent searches from localStorage
    const storedSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(storedSearches);
  }, []);

  const handleInputChange = async (event) => {
    const value = event.target.value;
    // console.log("this is the value", value);
    setInputValue(value);

    // Clear the previous timeout
    clearTimeout(timeoutRef.current);

    // Set a new timeout
    timeoutRef.current = setTimeout(async () => {
      if (value.trim() === "") {
        setSuggestions([]);
        setDropdownVisible(false);
        return;
      }

      try {
        const fetchedData = await searchProductsByNameOrBrand(value);
        setSuggestions(
          fetchedData.map((data) => ({ id: data.id, name: data.name }))
        );
        setDropdownVisible(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    }, 800);
  };

  // Clear timeout on component unmount
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSuggestionClick = async ({ suggestion, recentSearch, id }) => {
    if (!recentSearch) {
      setsearchedData(id);
      fetchSearchedData(id);
    }

    setInputValue(suggestion);
    setDropdownVisible(false); // Close dropdown when suggestion is clicked
    setLastSelectedSuggestion(suggestion); // Remember the last selected suggestion

    // Add to recent searches if not already present
    if (!recentSearches.includes(suggestion)) {
      const updatedRecentSearches = [suggestion, ...recentSearches].slice(
        0,
        10
      ); // Limit to 5 recent searches
      setRecentSearches(updatedRecentSearches);
      localStorage.setItem(
        "recentSearches",
        JSON.stringify(updatedRecentSearches)
      ); // Save to localStorage immediately
    }
    // Trigger search functionality

    if (recentSearch) {
      try {
        const fetchedData = await searchProductsByNameOrBrand(suggestion);
        setSuggestions(
          fetchedData.map((data) => ({ id: data.id, name: data.name }))
        );
        setDropdownVisible(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    }
  };

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  const handleInputFocus = () => {
    if (inputValue.trim() === "") {
      // Show recent searches only if input is empty
      setDropdownVisible(true);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const searchTerm = event.target.value.trim();
      if (searchTerm) {
        // Add to recent searches if not already present
        setRecentSearches((prevSearches) => {
          const newSearches = prevSearches.includes(searchTerm)
            ? prevSearches
            : [searchTerm, ...prevSearches].slice(0, 5); // Limit to 5 recent searches
          localStorage.setItem("recentSearches", JSON.stringify(newSearches));
          return newSearches;
        });
        setDropdownVisible(false); // Close the dropdown after pressing Enter
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        className={`w-[40rem] below-695:w-[30rem] below-566:w-[20rem] 
          below-400:w-[15rem] below-400:text-[0.8rem] outline-none bg-white text-black p-2 border-2 border-black   flex self-center justify-center border-b-8 border-r-4 `}
        placeholder="Search for products,brands and more"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown} // Add this line
      />
      {isDropdownVisible && (
        <div className="absolute bg-white border border-black w-[40rem] mt-2 z-20 max-h-[30rem]  below-400:w-[15rem]  overflow-y-auto ">
          {inputValue.trim() === "" ? (
            recentSearches.length > 0 ? (
              <>
                <div className="p-2 text-red-500 font-bold below-400:text-[1rem]">
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-200 text-red-500 below-400:text-[0.8rem]"
                    onClick={() =>
                      handleSuggestionClick({
                        suggestion: search,
                        recentSearch: true,
                      })
                    }
                  >
                    {search}
                  </div>
                ))}
              </>
            ) : (
              <div className="p-2 text-gray-500 below-400:text-[0.8rem]">No recent searches</div>
            )
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200 below-400:text-[0.8rem] "
                onClick={() =>
                  handleSuggestionClick({
                    suggestion: suggestion.name,
                    recentSearch: false,
                    id: suggestion.id,
                  })
                }
              >
                {suggestion.name}
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500 below-400:text-[0.8rem] ">No products found</div> // Show message when no suggestions
          )}
        </div>
      )}
    </div>
  );
};

export default CustomInput;
