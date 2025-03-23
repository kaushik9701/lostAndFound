import React, { useContext, useState, useEffect } from 'react';
import MyContext from '../../context/data/myContext';
import { auth } from '../../firebase/FirebaseConfig';
import LocationPicker from './locationPicker';

function RecoveryRequest({ onClose }) {
    const context = useContext(MyContext);
    const { products, setProducts, addProduct, categories, mode } = context;
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    
    // Initialize component and set type to "request"
    useEffect(() => {
        // Set the type to request when this component mounts
        setProducts(prev => ({
            ...prev,
            type: "request",
            location: {
                address: typeof prev.location === 'string' ? prev.location : '',
                latitude: null,
                longitude: null
            }
        }));
    }, []);

    const handleImageUpload = async () => {
        if (!imageFile) {
            alert("Please select an image.");
            return;
        }

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "LostAndFound");

        try {
            setUploading(true);
            const response = await fetch("https://api.cloudinary.com/v1_1/duzg5ijih/image/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setProducts((prev) => ({
                ...prev,
                imageUrl: data.secure_url,
                userId: auth.currentUser?.uid || "",
            }));

            setUploading(false);
        } catch (error) {
            console.error("Upload failed:", error);
            setUploading(false);
        }
    };

    const handleLocationSelect = (locationData) => {
        setProducts(prev => ({
            ...prev,
            location: locationData
        }));
    };

    const validateForm = () => {
        if (!products.title) {
            alert("Please enter a title");
            return false;
        }
        if (!products.category) {
            alert("Please select a category");
            return false;
        }
        if (!products.location?.address || !products.location?.latitude) {
            alert("Please select a location on the map");
            return false;
        }
        if (!products.description) {
            alert("Please enter a description");
            return false;
        }
        return true;
    };

    const handleAddRequest = () => {
        if (validateForm()) {
            addProduct();
            // Close modal after successful submission
            if (onClose) onClose();
        }
    };

    // Dynamic styling based on mode
    const bgColor = mode === 'dark' ? 'bg-gray-800' : 'bg-white';
    const textColor = mode === 'dark' ? 'text-white' : 'text-gray-800';
    const borderColor = mode === 'dark' ? 'border-gray-700' : 'border-gray-200';
    const inputBgColor = mode === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
    const inputPlaceholderColor = mode === 'dark' ? 'placeholder-gray-400' : 'placeholder-gray-500';

    return (
        <>
            {/* Header with close button */}
            <div className={`sticky top-0 ${bgColor} p-4 border-b ${borderColor} rounded-t-lg flex justify-between items-center z-10`}>
                <h1 className={`${textColor} text-xl font-bold`}>Submit Recovery Request</h1>
                <button 
                    onClick={onClose} 
                    className={`${mode === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'} text-xl`}
                    aria-label="Close"
                >
                    ×
                </button>
            </div>

            {/* Scrollable content area */}
            <div className={`overflow-y-auto p-6 flex-1 ${bgColor}`}>
                {/* Responsive grid layout - 1 column on mobile, 2 columns on desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left column - Basic info */}
                    <div>
                        <div className="mb-4">
                            <label className={`block ${textColor} mb-2`}>Title</label>
                            <input 
                                type="text" 
                                name="title" 
                                placeholder="What did you lose?"
                                className={`${inputBgColor} px-4 py-2 w-full rounded-lg ${textColor} ${inputPlaceholderColor} outline-none`}
                                onChange={(e) => setProducts({ ...products, title: e.target.value })} 
                                value={products.title} 
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className={`block ${textColor} mb-2`}>Category</label>
                            <select
                                value={products.category}
                                onChange={(e) => setProducts({ ...products, category: e.target.value })}
                                className={`${inputBgColor} px-4 py-2 w-full rounded-lg ${textColor} outline-none`}
                            >
                                <option value="">Select a category</option>
                                {categories?.map(category => (
                                    <option key={category} value={category}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </option>
                                )) || (
                                    <>
                                        <option value="electronics">Electronics</option>
                                        <option value="jewelry">Jewelry</option>
                                        <option value="keys">Keys</option>
                                        <option value="wallets">Wallets</option>
                                        <option value="documents">Documents</option>
                                        <option value="clothing">Clothing</option>
                                        <option value="bags">Bags</option>
                                        <option value="accessories">Accessories</option>
                                        <option value="pets">Pets</option>
                                        <option value="other">Other</option>
                                    </>
                                )}
                            </select>
                        </div>
                        
                        <div className="mb-4">
                            <label className={`block ${textColor} mb-2`}>Description</label>
                            <textarea 
                                name="description" 
                                placeholder="Please provide a detailed description of the lost item"
                                className={`${inputBgColor} px-4 py-2 w-full rounded-lg ${textColor} ${inputPlaceholderColor} outline-none`}
                                rows="4"
                                onChange={(e) => setProducts({ ...products, description: e.target.value })} 
                                value={products.description}
                            ></textarea>
                        </div>
                        
                        {/* Bounty field for recovery requests */}
                        <div className="mb-4">
                            <label className={`block ${textColor} mb-2`}>
                                Reward/Bounty (Optional)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. $50, Gift card, etc."
                                className={`${inputBgColor} px-4 py-2 w-full rounded-lg ${textColor} ${inputPlaceholderColor} outline-none`}
                                onChange={(e) => setProducts({ ...products, bounty: e.target.value })}
                                value={products.bounty || ""}
                            />
                        </div>
                    </div>
                    
                    {/* Right column - Location and Image */}
                    <div>
                        <div className="mb-4">
                            <label className={`block ${textColor} mb-2`}>
                                Last seen location
                            </label>
                            <LocationPicker 
                                onLocationSelect={handleLocationSelect}
                                initialLocation={products.location}
                            />
                            {products.location?.address && (
                                <div className={`mt-2 px-4 py-2 ${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg`}>
                                    <p className={`text-sm ${textColor}`}>
                                        Selected: {products.location.address}
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        <div className="mb-4">
                            <label className={`block ${textColor} mb-2`}>
                                Reference Image (Optional)
                            </label>
                            <input 
                                type="file" 
                                onChange={(e) => setImageFile(e.target.files[0])} 
                                className={`mb-2 bg-white w-60 pl-5 rounded-3xl text-black`} 
                            />
                            <button 
                                onClick={handleImageUpload} 
                                disabled={uploading}
                                className="bg-emerald-500 hover:bg-emerald-600 text-black px-4 py-2 rounded-lg mb-2 w-full transition"
                            >
                                {uploading ? 'Uploading...' : 'Upload Image'}
                            </button>
                            {products.imageUrl && (
                                <div className="mt-2">
                                    <img 
                                        src={products.imageUrl} 
                                        alt="Uploaded" 
                                        className="w-full max-h-48 object-cover rounded-lg" 
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Fixed footer with action button */}
            <div className={`sticky bottom-0 ${bgColor} p-4 border-t ${borderColor} rounded-b-lg`}>
                <button 
                    onClick={handleAddRequest}
                    className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-4 py-3 rounded-lg w-full transition"
                >
                    Submit Recovery Request
                </button>
            </div>
        </>
    );
}

export default RecoveryRequest;