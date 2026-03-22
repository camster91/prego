import { useState } from 'react';
import { Check, Crown, Dumbbell, Heart } from 'lucide-react';

export default function Pricing() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900">Your Pregnancy Fitness Journey</h1>
          <p className="mt-3 text-lg text-gray-600">Safe, guided workouts for every trimester</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free */}
          <div className="rounded-2xl p-8 bg-white border border-gray-200 shadow-sm">
            <Dumbbell className="w-8 h-8 text-pink-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Free</h3>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-extrabold">$0</span>
              <span className="ml-2 text-gray-500">/forever</span>
            </div>
            <ul className="mt-6 space-y-3">
              {['5 basic exercises', '1 workout plan', 'Timer', 'Basic progress tracking'].map((f, i) => (
                <li key={i} className="flex items-center text-gray-600">
                  <Check className="w-5 h-5 mr-3 text-green-500" />{f}
                </li>
              ))}
            </ul>
            <button className="mt-8 w-full py-3 rounded-lg font-semibold border-2 border-pink-300 text-pink-600 hover:bg-pink-50">
              Current Plan
            </button>
          </div>

          {/* Premium */}
          <div className="rounded-2xl p-8 bg-pink-600 text-white shadow-lg ring-4 ring-pink-600 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-sm font-semibold px-4 py-1 rounded-full">
              Recommended
            </div>
            <Crown className="w-8 h-8 text-pink-200 mb-4" />
            <h3 className="text-xl font-bold">Premium</h3>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-extrabold">$4.99</span>
              <span className="ml-2 text-pink-200">/month</span>
            </div>
            <ul className="mt-6 space-y-3">
              {[
                'All 12+ exercises',
                '8 workout programs',
                'Custom workout plans',
                'Audio coaching cues',
                'Full progress history',
                'Achievement badges',
                'Priority support'
              ].map((f, i) => (
                <li key={i} className="flex items-center text-pink-100">
                  <Check className="w-5 h-5 mr-3 text-pink-200" />{f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="mt-8 w-full py-3 rounded-lg font-semibold bg-white text-pink-600 hover:bg-pink-50 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Start Premium'}
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-gray-500 text-sm">
          Cancel anytime. All exercises reviewed by certified prenatal fitness experts.
        </p>
      </div>
    </div>
  );
}
