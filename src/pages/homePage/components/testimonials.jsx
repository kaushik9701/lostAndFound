import React, { useContext } from 'react';
import MyContext from '../../../context/data/myContext';

const testimonials = [
  {
    id: 1,
    name: 'John Doe',
    avatar: "/testimo1.jpeg",
    text: 'This is an amazing platform for finding lost items. It really helped me reunite with my lost wallet.',
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: "/testimo4.jpeg",
    text: 'I was able to recover my lost ID quickly, thanks to this app. Highly recommended!',
  },
  {
    id: 3,
    name: 'Michael Brown',
    avatar: "/testimo3.jpeg",
    text: 'A great community-driven platform. I returned a lost backpack and got a reward. Awesome experience!',
  },
];

const Testimonials = () => {
  const { mode } = useContext(MyContext);

  return (
    <section className={`py-16 ${
      mode === 'dark' 
        ? 'bg-gray-950 text-white' 
        : 'bg-gray-100 text-black'
    }`}>
      <div className="container mx-auto text-center pb-20">
        <h2 className="text-4xl md:text-6xl font-bold mb-8 md:p-8 text-emerald-400">
          What Our Users Say
        </h2>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`p-6 rounded-xl shadow-xl transition-all transform hover:scale-105 ${
                mode === 'dark'
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              <div className="flex justify-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className={`w-46 h-46 rounded-full object-cover border-4 ${
                    mode === 'dark'
                      ? 'border-emerald-500'
                      : 'border-emerald-500'
                  }`}
                />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                mode === 'dark' 
                  ? 'text-white' 
                  : 'text-gray-900'
              }`}>
                {testimonial.name}
              </h3>
              <p className={`text-lg ${
                mode === 'dark'
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}>
                {testimonial.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;