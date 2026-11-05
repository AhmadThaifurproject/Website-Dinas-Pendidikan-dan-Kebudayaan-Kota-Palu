const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="text-[72px] font-semibold text-gray-300 leading-none">
        404
      </h1>

      <h2 className="mt-4 text-xl font-semibold text-gray-800">
        Halaman Tidak Ditemukan
      </h2>

      <p className="mt-2 max-w-md text-sm text-gray-500">
        Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
    </div>
  );
};

export default NotFound;
