import React from 'react';
import MapsComponent from './mapsComponent';

export function Maps() {
  // Your Google Maps API key
  const apiKey = import.meta.env.VITE_GOOGLE_API;
  
  // Example product locations (you'll replace these with your actual product data)
  const productLocations = [
    {  
      lat: 38.64990743083649, 
      lng: -90.27140514871927, 
      title: 'Product A', 
      content: '<div><h3>Product A</h3><p>Price: $99.99</p></div>' 
    },
    {  
      lat: 38.61299250242562, 
      lng: -90.24033939602236, 
      title: 'Product B', 
      content: '<div><h3>Product B</h3><p>Price: $149.99</p></div>' 
    }
  ];

  return (
    <div className="px-24 pb-16">
      <h1>Product Locations</h1>
      <MapsComponent 
        apiKey={apiKey} 
        markers={productLocations} 
        center={{ lat: 38.6270, lng: -90.1994 }} 
        zoom={12} 
      />
    </div>
  );
}