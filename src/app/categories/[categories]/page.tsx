"use client";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { MainNav } from "@/components/main-nav";
import { BreadcrumbWithCustomSeparator } from "@/components/breadcrumb";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import MainFooter from "@/components/footer";
import { SelectDemo } from "@/components/select";
import { Separator } from "@/components/ui/separator";
import fcard from "@/components/filters-category/filterCard";
import Fcard from "@/components/filters-category/filterCard";
import { PaginationComponent } from "@/components/pagination";
import {
  getProductsByCategory,
  getProductsByCategoryFiltered,
  getProductsByCategoryfiltered,
} from "@/actions/createProduct";
import CategoriesRelatedProduct from "@/components/categories/CategoriesRelatedProduct";
import { useToast } from "@/components/ui/use-toast";
import LoadingAnimation from "@/components/Loading/LoadingAnimation";

function decodeURLParams(url) {
  // Check if url is a string
  if (typeof url !== "string") {
    console.error("Invalid URL format");
    return {};
  }
  // Split the URL to get the query string part
  const queryString = url?.split("?")[1];
  if (!queryString) {
    return {};
  }

  // Split the query string into key-value pairs
  const params = new URLSearchParams(queryString);
  const decodedParams = {};

  // Iterate through each parameter and decode its value
  params.forEach((value, key) => {
    decodedParams[key] = decodeURIComponent(value);
  });

  return decodedParams;
}

const Page = ({ params }: { params: { categories: string } }) => {
  const [currentPage, setCurrentPage] = useState(() => {
    const storedPage = localStorage.getItem("currentPage");
    return storedPage ? parseInt(storedPage, 10) : 1;
  });
  const [filterVisible, setFilterVisible] = useState(false); // Add this state variable

  const { toast } = useToast();
  const router = useRouter();
  const callToast = ({ variant, title, description }) => {
    // alert("toast is being  called")
    toast({
      variant: variant,
      title: title,
      description: description,
    });
  };

  const [paginatedData, setPaginatedData] = useState({
    products: [],
    totalPages: 0,
    totalProductsCount: 0,
    currentProductsCount: 0,
    brands: [],
    fetchedCategories: [],
  });
  const [categoryName, setSelectedCategoryName] = useState([]);
  // console.log("this is the selected category name", categoryName);

  const [parentCategoryName, setparentCategoryName] = useState(
    params.categories
  );

  const validCategories = ["Kids", "Mens", "Womens", ""];

  useEffect(() => {
    if (!validCategories.includes(parentCategoryName)) {
      // Redirect to 404 page if the category is invalid
      router.replace("/404");
    }
  }, [parentCategoryName, router, validCategories]);

  const [loading, setLoading] = useState(false); // Added loading state

  // 'priceAsc', 'priceDesc', 'discountAsc', 'discountDesc', 'ratingsAsc', 'ratingsDesc'
  const [brandSelected, setBrandSelected] = useState(false);
  const [brandName, setBrandName] = useState([]);
  const [sortBy, setSortBy] = useState("");
  // console.log("this is brand name", brandName)
  // console.log("this is the sort by", sortBy);

  const [minDiscountedPrice, setMinDiscountedPrice] = useState(0);
  const [maxDiscountedPrice, setMaxDiscountedPrice] = useState(100000);
  const [minDiscountPercentage, setMinDiscountPercentage] = useState(0);
  const [maxDiscountPercentage, setMaxDiscountPercentage] = useState(100);
  const [filterData, setFilterData] = useState([]);

  const [productsFound, setProductsFound] = useState(true);
  // console.log("this is the current page", currentPage);
  // Load current page from local storage on component mount
  useEffect(() => {
    const storedPage = localStorage.getItem("currentPage");
    if (storedPage) {
      setCurrentPage(parseInt(storedPage, 10));
    }
  }, []);

  // Save current page to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);

  // useEffect(() => {

  //   const urlParams = new URLSearchParams(window.location.search);
  //   const test = localStorage.getItem('filteredData')
  //   const
  //   // alert(test)
  //   const decodedParams = decodeURLParams(test);
  //   console.log("this is the decoded params",decodedParams);
  //   const categories = urlParams.get('category')?.split(',') || [];
  //   const brands = urlParams.get('brandName')?.split(',') || [];
  //   const minPrice = parseInt(urlParams.get('minDiscountedPrice') || '0', 10);
  //   const maxPrice = parseInt(urlParams.get('maxDiscountedPrice') || '100000', 10);
  //   const minDiscount = parseInt(urlParams.get('minDiscountPercentage') || '0', 10);
  //   const maxDiscount = parseInt(urlParams.get('maxDiscountPercentage') || '100', 10);
  //   const page = parseInt(urlParams.get('page') || '1', 10);

  //   // If no URL params, check local storage
  //   if (!urlParams.has('category') && localStorage.getItem('filteredData')) {
  //     const storedParams = new URLSearchParams(localStorage.getItem('filteredData'));

  //     const storedCategories = storedParams.get('category')?.split(',') || [];
  //     const storedBrands = storedParams.get('brandName')?.split(',') || [];
  //     const storedMinPrice = parseInt(storedParams.get('minDiscountedPrice') || '0', 10);
  //     const storedMaxPrice = parseInt(storedParams.get('maxDiscountedPrice') || '100000', 10);
  //     const storedMinDiscount = parseInt(storedParams.get('minDiscountPercentage') || '0', 10);
  //     const storedMaxDiscount = parseInt(storedParams.get('maxDiscountPercentage') || '100', 10);
  //     const storedPage = parseInt(storedParams.get('page') || '1', 10);

  //     setSelectedCategoryName(Array.from(new Set(storedCategories)));
  //     setBrandName(storedBrands);
  //     setMinDiscountedPrice(storedMinPrice);
  //     setMaxDiscountedPrice(storedMaxPrice);
  //     setMinDiscountPercentage(storedMinDiscount);
  //     setMaxDiscountPercentage(storedMaxDiscount);
  //     setCurrentPage(storedPage);
  //   } else {
  //     setSelectedCategoryName(Array.from(new Set(categories)));
  //     setBrandName(brands);
  //     setMinDiscountedPrice(minPrice);
  //     setMaxDiscountedPrice(maxPrice);
  //     setMinDiscountPercentage(minDiscount);
  //     setMaxDiscountPercentage(maxDiscount);
  //     setCurrentPage(page);
  //   }

  //   // Save to local storage for next time
  //   // const queryParams = new URLSearchParams();
  //   // if (categories.length > 0) queryParams.set('category', categories.join(','));
  //   // if (brands.length > 0) queryParams.set('brandName', brands.join(','));
  //   // if (minPrice !== 0) queryParams.set('minDiscountedPrice', minPrice);
  //   // if (maxPrice !== 100000) queryParams.set('maxDiscountedPrice', maxPrice);
  //   // if (minDiscount !== 0) queryParams.set('minDiscountPercentage', minDiscount);
  //   // if (maxDiscount !== 100) queryParams.set('maxDiscountPercentage', maxDiscount);
  //   // if (page !== 1) queryParams.set('page', page);
  //   // localStorage.setItem('filteredData', queryParams.toString());
  // }, []);

  useEffect(() => {
    const fetchPaginatedData = async () => {
      // console.log("this is the minimum discount price", minDiscountedPrice)
      setLoading(true); // Start loading

      const data = await getProductsByCategoryFiltered(
        parentCategoryName === "Kids" ? "KidsCategory" : parentCategoryName,
        categoryName,
        brandName,
        minDiscountedPrice,
        maxDiscountedPrice,
        minDiscountPercentage,
        maxDiscountPercentage,
        currentPage,
        9,
        sortBy
      );
      // console.log("this is the data filtred", data.products);
      setProductsFound(data.products.length > 0 ? true : false);
      setPaginatedData({
        products: data.products,
        totalPages: data.totalPages,
        totalProductsCount: data.totalProducts,
        currentProductsCount: data.products?.length,
        brands: data.uniqueBrands,
      });

      const newFilterData = [
        {
          category: "Category",
          options: data.uniqueCategories
            .filter((category) => !["jewellery", "watches"].includes(category)) // Filter out categories with certain names
            .map((category) => ({
              label: category,
              value: category,
            })),
        },
        {
          category: "Brand",
          options: !brandSelected
            ? data.uniqueBrands.map((brand) => ({
                label: brand,
                value: brand,
              }))
            : filterData.find((item) => item.category === "Brand").options,
        },
        {
          category: "Price",
          options: data.priceRanges.map((range) => ({
            label: range.label,
            value: range.value,
            min: range.min,
            max: range.max,
          })),
        },
        {
          category: "Discount",
          options: data.discountRanges.map((range) => ({
            label: range.label,
            value: range.value,
            min: range.min,
            max: range.max,
          })),
        },
      ];
      setFilterData(newFilterData);

      // Construct the query parameters
      const queryParams = new URLSearchParams();
      // console.log("this is the brand name", brandName);
      if (categoryName && categoryName.length > 0) {
        // Remove duplicates from categoryName

        const uniqueCategories = Array.from(new Set(categoryName));

        // Assuming categoryName is an array of strings, join them with a comma
        queryParams.set("category", uniqueCategories.join(","));
      }
      if (brandName && brandName.length > 0) {
        // Assuming brandName is an array of strings, you might want to join them or handle each element individually
        queryParams.set("brandName", brandName.join(",")); // Joining brands with a comma or another delimiter
      }
      if (minDiscountedPrice)
        queryParams.set("minDiscountedPrice", minDiscountedPrice);
      if (maxDiscountedPrice !== 100000)
        queryParams.set("maxDiscountedPrice", maxDiscountedPrice);
      if (minDiscountPercentage)
        queryParams.set("minDiscountPercentage", minDiscountPercentage);
      if (maxDiscountPercentage !== 100)
        queryParams.set("maxDiscountPercentage", maxDiscountPercentage);
      if (currentPage) queryParams.set("page", currentPage);

      // Update local storage with filtered data
      // localStorage.setItem('filteredData', queryParams.toString());

      // Update the browser's URL with the new query parameters if there are any
      if (Array.from(queryParams).length > 0) {
        const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
        window.history.replaceState(null, "", newUrl);
      } else {
        window.history.replaceState(null, "", window.location.pathname);
      }
      setLoading(false); // End loading
    };
    fetchPaginatedData();
  }, [
    currentPage,
    categoryName,
    brandName,
    minDiscountedPrice,
    maxDiscountedPrice,
    minDiscountPercentage,
    maxDiscountPercentage,
    sortBy,
  ]);

  const fixedBrand = paginatedData.brands.map((brand) => ({
    label: brand,
    value: brand,
  }));

  const completeUrl = typeof window !== "undefined" ? window.location.href : "";
  const segments = completeUrl.split("/");
  const previousSegment = segments[segments.length - 1];
  const previousSegment1 = segments[segments.length - 1];
  // console.log("this is the Previous segment:", previousSegment);
  const breadcrumbsData = [
    { id: 1, href: "/", label: "Home" },
    {
      id: 2,
      href: `/categories/${previousSegment1}`,
      label: previousSegment1.split("?")[0],
    },
    // { id: 3, href: `/categories/${previousSegment1}/${previousSegment}`, label: previousSegment },
    // { id: 4, href: params?.product, label: data?.name },
  ];

  // Define total number of products and products per page
  const totalProducts = paginatedData.totalProductsCount;
  const productsPerPage = 9;

  // Function to calculate start and end indexes of products to display
  const calculateProductRange = (currentPage) => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = Math.min(
      startIndex + productsPerPage - 1,
      totalProducts - 1
    );
    return { start: startIndex, end: endIndex };
  };

  const { start, end } = calculateProductRange(currentPage);

  return (
    <div className=" overflow-hidden ">
      <div className=" mt-[8rem]">
        <BreadcrumbWithCustomSeparator items={breadcrumbsData} />
        <div className="filter flex justify-between w-full px-5 mt-5  overflow-hidden relative">
          <div className=" h-[4rem]">
            <h1
              onClick={() => setFilterVisible(!filterVisible)} // Add this onClick handler
              className="w-40 below-700:w-28  below-700:text-[0.8rem] p-2 border-2 border-black text-black mt-4  self-center justify-center border-b-8 border-r-4  bg-pink-500 font-bold  below-695:flex hidden"
            >
              FILTERS
            </h1>
          </div>
          <div>
            <div className="  mb-2 ">
              <h1 className=" text-[1.5rem] below-700:text-[0.8rem] below-600:hidden uppercase  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 bg-yellow-500 font-bold">
                {`SHOWING  ${start + 1} to ${
                  end + 1
                } out of ${totalProducts} products`}{" "}
              </h1>
            </div>
          </div>
          <div className=" px-5 py-5 flex w-[19rem] justify-between below-700:w-[10rem] ">
            <SelectDemo setSortBy={setSortBy} />
          </div>
        </div>
        <div className="  mb-2 ">
          <h1 className=" text-[1.5rem] below-700:text-[0.8rem] below-600:flex hidden uppercase  p-2 border-2 border-black text-black mt-4  self-center justify-center border-b-8 border-r-4 bg-yellow-500 font-bold">
            {`SHOWING  ${start + 1} to ${
              end + 1
            } out of ${totalProducts} products`}{" "}
          </h1>
        </div>
        <Separator />
        <div className=" flex justify-between below-695:hidden ">
          <div className="filterCategorysection flex-none w-1/5 border-r  below-1000:w-[12rem] ">
            {filterData.map((category, index) => (
              <Fcard
                key={index}
                category={category}
                setBrandSelected={setBrandSelected}
                setSelectedCategoryName={setSelectedCategoryName}
                setBrandName={setBrandName}
                setMinDiscountedPrice={setMinDiscountedPrice}
                setMaxDiscountedPrice={setMaxDiscountedPrice}
                setMinDiscountPercentage={setMinDiscountPercentage}
                setMaxDiscountPercentage={setMaxDiscountPercentage}
              />
            ))}
          </div>

          <div className="productsRight flex-grow ">
            <div className={`min-h-[90vh]    `}>
              {productsFound === false ? (
                <div className=" text-center self-center">
                  <h1 className=" text-[4rem]  below-1000:text-[2rem] below-695:text-[1rem] uppercase ">
                    No Products found Lmao 😂
                  </h1>
                  <h1 className=" text-[4rem] below-1000:text-[2rem]  below-695:text-[1rem] uppercase  ">
                    What you Filtering ?
                  </h1>
                  <h1 className=" text-[4rem] below-1000:text-[2rem]  below-695:text-[1rem] uppercase ">
                    Search again Bruh...
                  </h1>
                </div>
              ) : paginatedData.products?.length === 0 ? (
                <div className=" h-screen  flex items-center justify-center">
                  <LoadingAnimation />
                </div>
              ) : (
                <div>
                  {loading ? (
                    <>
                      <div className=" h-screen  flex items-center justify-center">
                        <LoadingAnimation />
                      </div>
                    </>
                  ) : (
                    <CategoriesRelatedProduct
                      categoryPageData={true}
                      relatedProduct={paginatedData.products}
                      callToast={callToast}
                    />
                  )}
                </div>
              )}
            </div>

            <div className=" h-[4rem] ">
              <PaginationComponent
                currentPage={currentPage}
                totalPages={paginatedData.totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        </div>

        <div
          className={` justify-between below-695:flex hidden transition-all duration-500 ${
            filterVisible ? "ml-0" : "-ml-full"
          }`}
        >
          <div
            className={`filterCategorysection flex-none w-1/5 border-r below-1000:w-[12rem]  transition-all duration-500 ${
              filterVisible ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {filterData.map((category, index) => (
              <Fcard
                key={index}
                category={category}
                setBrandSelected={setBrandSelected}
                setSelectedCategoryName={setSelectedCategoryName}
                setBrandName={setBrandName}
                setMinDiscountedPrice={setMinDiscountedPrice}
                setMaxDiscountedPrice={setMaxDiscountedPrice}
                setMinDiscountPercentage={setMinDiscountPercentage}
                setMaxDiscountPercentage={setMaxDiscountPercentage}
              />
            ))}
          </div>

          <div
            className={`productsRight  below-445:hidden  below-378:hidden flex-grow   transition-all duration-500 ${
              filterVisible ? "ml-[0vw]" : "ml-[-40vw] "
            }`}
          >
            <div className={`min-h-[90vh] `}>
              {productsFound === false ? (
                <div className=" text-center self-center">
                  <h1 className=" text-[4rem] below-1000:text-[2rem] below-695:text-[1rem] uppercase ">
                    No Products found Lmao 😂
                  </h1>
                  <h1 className=" text-[4rem] below-1000:text-[2rem] below-695:text-[1rem] uppercase  ">
                    What you Filtering ?
                  </h1>
                  <h1 className=" text-[4rem] below-1000:text-[2rem] below-695:text-[1rem] uppercase ">
                    Search again Bruh...
                  </h1>
                </div>
              ) : paginatedData.products?.length === 0 ? (
                <div className=" h-screen   flex items-center justify-center">
                  <LoadingAnimation />
                </div>
              ) : (
                <div>
                  {loading ? (
                    <>
                      <div className=" h-screen   flex items-center justify-center">
                        <LoadingAnimation />
                      </div>
                    </>
                  ) : (
                    <CategoriesRelatedProduct
                      categoryPageData={true}
                      relatedProduct={paginatedData.products}
                      callToast={callToast}
                    />
                  )}
                </div>
              )}
            </div>

            <div className=" h-[4rem] ">
              <PaginationComponent
                currentPage={currentPage}
                totalPages={paginatedData.totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>

              {/* below-435 */}
           


          {/* below 445 */}
          <div
            className={`productsRight hidden below-445:block  below-378:hidden flex-grow   transition-all duration-500 ${
              filterVisible ? "ml-[0vw]" : "ml-[-55vw] "
            }`}
          >
            <div className={`min-h-[90vh] `}>
              {productsFound === false ? (
                <div className=" text-center self-center">
                  <h1 className=" text-[4rem] below-1000:text-[2rem] below-695:text-[1rem] uppercase ">
                    No Products found Lmao 😂
                  </h1>
                  <h1 className=" text-[4rem] below-1000:text-[2rem] below-695:text-[1rem] uppercase  ">
                    What you Filtering ?
                  </h1>
                  <h1 className=" text-[4rem] below-1000:text-[2rem] below-695:text-[1rem] uppercase ">
                    Search again Bruh...
                  </h1>
                </div>
              ) : paginatedData.products?.length === 0 ? (
                <div className=" h-screen below-445:h-[10rem]  flex items-center justify-center">
                  <LoadingAnimation />
                </div>
              ) : (
                <div>
                  {loading ? (
                    <>
                      <div className=" h-screen below-445:h-[10rem] flex items-center justify-center">
                        <LoadingAnimation />
                      </div>
                    </>
                  ) : (
                    <CategoriesRelatedProduct
                      categoryPageData={true}
                      relatedProduct={paginatedData.products}
                      callToast={callToast}
                    />
                  )}
                </div>
              )}
            </div>

            <div className=" h-[4rem] ">
              <PaginationComponent
                currentPage={currentPage}
                totalPages={paginatedData.totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>

          {/* below 378 */}

          <div
            className={`productsRight hidden below-378:block  flex-grow   transition-all duration-500 ${
              filterVisible ? "ml-[0vw]" : "ml-[-60vw] "
            }`}
          >
            <div className={`min-h-[90vh] `}>
              {productsFound === false ? (
                <div className=" text-center self-center">
                  <h1 className=" text-[4rem] below-1000:text-[2rem] below-695:text-[1rem] uppercase ">
                    No Products found Lmao 😂
                  </h1>
                  <h1 className=" text-[4rem] below-1000:text-[2rem] below-695:text-[1rem] uppercase  ">
                    What you Filtering ?
                  </h1>
                  <h1 className=" text-[4rem] below-1000:text-[2rem] below-695:text-[1rem] uppercase ">
                    Search again Bruh...
                  </h1>
                </div>
              ) : paginatedData.products?.length === 0 ? (
                <div className=" h-screen  flex items-center justify-center">
                  <LoadingAnimation />
                </div>
              ) : (
                <div>
                  {loading ? (
                    <>
                      <div className=" h-screen  flex items-center justify-center">
                        <LoadingAnimation />
                      </div>
                    </>
                  ) : (
                    <CategoriesRelatedProduct
                      categoryPageData={true}
                      relatedProduct={paginatedData.products}
                      callToast={callToast}
                    />
                  )}
                </div>
              )}
            </div>

            <div className=" h-[4rem] ">
              <PaginationComponent
                currentPage={currentPage}
                totalPages={paginatedData.totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        </div>

        <MainFooter />
      </div>
    </div>
  );
};

export default Page;
