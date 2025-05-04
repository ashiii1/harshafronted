// components/LoadingSkeleton.js

const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6 max-w-7xl mx-auto px-4 py-8">
      {/* Hero skeleton */}
      <div className="bg-gray-200 h-64 rounded-xl"></div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-200 h-40 rounded-xl"></div>
          <div className="bg-gray-200 h-40 rounded-xl"></div>
          <div className="bg-gray-200 h-40 rounded-xl"></div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-200 h-48 rounded-xl"></div>
          <div className="bg-gray-200 h-32 rounded-xl"></div>
          <div className="bg-gray-200 h-32 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
