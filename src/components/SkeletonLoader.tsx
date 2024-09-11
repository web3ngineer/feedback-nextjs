const SkeletonLoader = () => {
  return (
    <div className="pt-40 md:pt-28 sm:mx-4 lg:mx-8 xl:mx-auto bg-white w-full max-w-6xl">
      <div className="text-4xl font-bold animate-pulse mb-4 w-2/3 h-8 bg-gray-300 rounded"></div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2 animate-pulse w-1/2 h-6 bg-gray-300 rounded"></h2>
        <div className="flex items-center">
          <input
            type="text"
            disabled
            className="input input-bordered w-full p-2 mr-2 animate-pulse bg-gray-300 rounded"
          />
          <div className="bg-gray-300 w-20 h-10 animate-pulse rounded"></div>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center">
          <div className="w-10 h-5 bg-gray-300 rounded-full mr-2 animate-pulse"></div>
          <div className="w-20 h-5 bg-gray-300 rounded mr-2 animate-pulse"></div>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center">
          <div className="w-10 h-5 bg-gray-300 rounded-full mr-2 animate-pulse"></div>
          <div className="w-20 h-5 bg-gray-300 rounded mr-2 animate-pulse"></div>
        </div>
      </div>
      <div className="mb-4">
        <div className="w-1/3 h-5 bg-gray-300 rounded animate-pulse"></div>
      </div>
      <div className="mb-4">
        <div className="flex items-center">
          <div className="w-10 h-5 bg-gray-300 rounded-full mr-2 animate-pulse"></div>
          <div className="w-20 h-5 bg-gray-300 rounded mr-2 animate-pulse"></div>
        </div>
      </div>
      <div className="mb-4">
        <div className="w-1/3 h-5 bg-gray-300 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
