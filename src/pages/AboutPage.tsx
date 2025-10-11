import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiAward, FiUsers, FiClock } from 'react-icons/fi';

const AboutPage: React.FC = () => {
  const stats = [
    { icon: FiHeart, label: 'Happy Customers', value: '1000+' },
    { icon: FiAward, label: 'Years Experience', value: '10+' },
    { icon: FiUsers, label: 'Team Members', value: '15' },
    { icon: FiClock, label: 'Orders Delivered', value: '5000+' }
  ];

  const team = [
    {
      name: 'Clinton Daniel Ferrao',
      role: 'Head Baker & Founder',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
      description: 'With over 10 years of experience in baking, Clinton founded Sweet Delights with a passion for creating memorable moments through exceptional cakes.'
    },
    {
      name: 'Sarah Johnson',
      role: 'Pastry Chef',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
      description: 'Sarah specializes in custom cake designs and has won multiple awards for her creative and delicious creations.'
    },
    {
      name: 'Michael Chen',
      role: 'Decorator',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
      description: 'Michael brings artistic flair to every cake, ensuring each creation is not just delicious but visually stunning.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-100 to-orange-200 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
            >
              About Sweet Delights
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              We are passionate bakers dedicated to creating exceptional cakes that make your special moments even more memorable. Every cake is crafted with love, premium ingredients, and attention to detail.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-orange-600" size={24} />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Sweet Delights was born from a simple belief: every celebration deserves a perfect cake. Founded in 2014 by Clinton Daniel Ferrao, our bakery started as a small home-based operation with a big dream.
                </p>
                <p>
                  What began with a passion for baking and a desire to bring joy to people's special moments has grown into Mumbai's most trusted cake destination. We've had the privilege of being part of thousands of celebrations, from intimate birthday parties to grand weddings.
                </p>
                <p>
                  Today, we continue to uphold our founding principles: using only the finest ingredients, maintaining the highest standards of quality, and treating every customer like family. Each cake that leaves our kitchen carries with it our commitment to excellence and our love for the craft.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg"
                alt="Our bakery"
                className="rounded-xl shadow-lg w-full h-96 object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do at Sweet Delights
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Quality First',
                description: 'We use only premium ingredients and maintain the highest standards in every cake we create.',
                icon: FiAward
              },
              {
                title: 'Customer Love',
                description: 'Every customer is family to us. We go above and beyond to exceed expectations.',
                icon: FiHeart
              },
              {
                title: 'Timely Delivery',
                description: 'We understand the importance of your special moments and ensure timely delivery every time.',
                icon: FiClock
              }
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-8 shadow-sm text-center"
                >
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="text-orange-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The talented individuals behind every delicious creation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl overflow-hidden"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-orange-600 font-semibold mb-4">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Order Your Perfect Cake?</h2>
            <p className="text-lg mb-8 opacity-90">
              Let us be part of your special celebration. Browse our collection or contact us for custom orders.
            </p>
            <div className="space-x-4">
              <a
                href="/"
                className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Cakes
              </a>
              <a
                href="/contact"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;