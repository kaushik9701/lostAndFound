let isLoading = false;
let isLoaded = false;
const callbacks = [];

export const loadGoogleMapsScript = (apiKey) => {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (window.google && window.google.maps) {
      isLoaded = true;
      resolve(window.google.maps);
      return;
    }

    // Add to callbacks if currently loading
    if (isLoading) {
      callbacks.push({ resolve, reject });
      return;
    }

    // Set loading flag
    isLoading = true;

    // Create script element
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;

    // Handle script load success
    script.onload = () => {
      isLoaded = true;
      isLoading = false;
      
      // Resolve this promise
      resolve(window.google.maps);
      
      // Resolve any queued promises
      callbacks.forEach(callback => callback.resolve(window.google.maps));
      callbacks.length = 0;
    };

    // Handle script load error
    script.onerror = (error) => {
      isLoading = false;
      
      // Reject this promise
      reject(error);
      
      // Reject any queued promises
      callbacks.forEach(callback => callback.reject(error));
      callbacks.length = 0;
    };

    // Add to document
    document.head.appendChild(script);
  });
};