import React, { useContext, useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { fireDB } from '../../../firebase/FirebaseConfig';
import MyContext from '../../../context/data/myContext';

const HighBountyItems = () => {
  const { mode } = useContext(MyContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch high bounty products
  useEffect(() => {
    const fetchHighBountyProducts = async () => {
      try {
        // Create a query to fetch products ordered by bounty in descending order
        const q = query(
          collection(fireDB, "products"), 
          orderBy("bounty", "desc"), 
          limit(6)
        );

        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          bounty: doc.data().bounty || '$0' // Fallback if no bounty
        }));

        setProducts(fetchedProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching high bounty products:", error);
        setLoading(false);
      }
    };

    fetchHighBountyProducts();
  }, []);

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-16 ${
        mode === 'dark' ? 'bg-gray-950' : 'bg-gray-100'
      }`}>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className={`flex pb-2 justify-center text-4xl md:text-6xl font-bold ${
        mode === 'dark'
          ? 'bg-gray-950 text-emerald-400'
          : 'bg-gray-100 text-emerald-600'
      }`}>
        <h1>High Bounties</h1>
      </div>

      <div className={`relative pt-24 ${
        mode === 'dark'
          ? 'bg-gray-950'
          : 'bg-gray-100'
      }`}>
        {/* "View All" Button */}
        <a
          href="/items"
          className={`absolute top-4 right-4 ${
            mode === 'dark'
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-emerald-500 text-white hover:bg-emerald-600'
          } py-2 px-4 rounded-lg font-semibold transition`}
        >
          View All
        </a>

        {/* Scrolling Product Section */}
        <div className={`
          overflow-x-auto 
          flex items-center 
          space-x-4 
          pb-4 
          px-4 
          snap-x 
          snap-mandatory 
          scroll-smooth 
          ${
            mode === 'dark'
              ? 'scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800'
              : 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-200'
          }
          md:grid md:grid-cols-6 md:gap-4
        `}>
          {products.map((product) => (
            <div
              key={product.id}
              className={`
                relative
                flex-shrink-0 
                w-56 
                h-72 
                rounded-lg 
                shadow-lg 
                transform 
                transition 
                duration-300 
                hover:scale-105 
                snap-center 
                md:snap-align-none
                ${
                  mode === 'dark'
                    ? 'bg-gray-800'
                    : 'bg-white'
                }
              `}
            >
              {/* Always visible price/bounty tag at the top */}
              <div
                className={`absolute top-2 right-2 z-10 px-3 py-1 rounded-full font-bold shadow-md ${
                  mode === 'dark'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                {product.bounty}
              </div>
              
              <img
                src={product.imageUrl || '/placeholder-image.jpg'}
                alt={product.title}
                className="w-full h-full object-cover rounded-lg"
              />

              {/* Product Details Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg opacity-0 hover:opacity-75 transition-opacity duration-300 flex flex-col justify-between py-9">
                {/* Location at the top */}
                <div className={`text-white font-medium bg-black pt-8 bg-opacity-50 px-3 rounded-lg self-start ${
                  mode === 'dark'
                    ? 'hover:bg-opacity-70'
                    : 'hover:bg-opacity-40'
                }`}>
                  {typeof product.location === 'object' 
  ? (product.location.address || `${product.location.latitude}, ${product.location.longitude}`)
  : (product.location || 'Location not specified')}
                </div>
                
                {/* Description and title at the bottom */}
                <div className="flex flex-col gap-2">
                  {/* Brief description */}
                  <p className="text-white text-sm bg-black bg-opacity-50 p-2 pb-7 rounded-lg line-clamp-2">
                    {product.description?.substring(0, 80) || 'No description available'}
                    {product.description?.length > 80 ? '...' : ''}
                  </p>
                  
                  {/* Title with link */}
                  <a
                    href={`/products?search=${encodeURIComponent(product.title)}`}
                    className={`text-white font-bold bg-black pt-7 bg-opacity-50 px-3 py-1 rounded-lg self-start ${
                      mode === 'dark'
                        ? 'hover:bg-opacity-70'
                        : 'hover:bg-opacity-40'
                    }`}
                  >
                    {product.title}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HighBountyItems;