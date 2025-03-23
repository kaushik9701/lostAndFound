import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../../components/Layout/layout';
import Filter from '../../components/filter/filter';
import ItemList from './itemsComponent/itemsComponent';
import { Maps } from '../../components/maps/maps';

function Items() {
  const location = useLocation();
  const [showMap, setShowMap] = useState(location.state?.showMap || false);
  
  // Set showMap based on navigation state
  useEffect(() => {
    if (location.state?.showMap) {
      setShowMap(true);
    }
  }, [location]);

  const toggleView = () => {
    setShowMap(!showMap);
  };

  // Add a data attribute for the map toggle button
  const buttonBg = showMap ? 
    'bg-yellow-500 hover:bg-yellow-600' : 
    'bg-emerald-500 hover:bg-emerald-600';

  return (
    <Layout>
      <Filter />
      
      {/* Toggle button positioned below the Filter component */}
      <div className="container mx-auto px-4 my-4 flex justify-end">
        <button
          onClick={toggleView}
          data-map-toggle="true"
          data-map-view={showMap.toString()}
          className={`px-4 py-2 ${buttonBg} text-white rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2 font-medium`}
        >
          {showMap ? (
            <>
              <span>View Item List</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 14H19V8H5V14ZM3 6V16C3 16.5304 3.21071 17.0391 3.58579 17.4142C3.96086 17.7893 4.46957 18 5 18H19C19.5304 18 20.0391 17.7893 20.4142 17.4142C20.7893 17.0391 21 16.5304 21 16V6C21 5.46957 20.7893 4.96086 20.4142 4.58579C20.0391 4.21071 19.5304 4 19 4H5C4.46957 4 3.96086 4.21071 3.58579 4.58579C3.21071 4.96086 3 5.46957 3 6Z" fill="currentColor"/>
              </svg>
            </>
          ) : (
            <>
              <span>Locate Items on Map</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
              </svg>
            </>
          )}
        </button>
      </div>
      
      {/* Content container with animation */}
      <div className="container mx-auto px-4">
        <div className="transition-opacity duration-300 ease-in-out">
          {showMap ? (
            <div className="rounded-lg overflow-hidden shadow-lg">
              <Maps />
            </div>
          ) : (
            <ItemList />
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Items;