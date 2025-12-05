import React, { useEffect, useState } from "react";
import { Calendar, User, Eye, Search } from "react-feather";
import { Link } from 'react-router-dom';
import { extractFirstImage } from "../../utils/helper"; 




const Banner: React.FC = () => {
  return (
    <section className="relative h-[45vh] bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#6dd5ed] overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white">
        <h1 className="text-4xl font-bold mb-4">Berita Artikel</h1>
        <p className="text-xl">Dinas Pendidikan Kota Palu</p>
      </div>
    </section>
  );
};

const SearchBar: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center">
        <div className="relative w-full md:w-1/2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            placeholder="Cari berita..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

interface Berita {
  id: number;
  judul: string;
  isi_berita: string;
  gambar: string | null;
  penulis: string;
  tanggal_upload: string;
  views: number;
  slug: string;
  
}

interface NewsCardProps {
  title: string;
  date: string;
  author: string;
  views: number;
  image: string;
  slug: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  date,
  author,
  views,
  image,
  slug,
}) => {
  return (
    <div className="flex flex-col bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="w-full h-48 bg-gray-200 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>

        <div className="flex flex-col text-sm text-gray-600 mb-4 space-y-2">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <User size={16} />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={16} />
            <span>{views} views</span>
          </div>
        </div>

       <div className="mt-auto">
 <Link to={`/berita/${slug}`}>
    <button className="w-full inline-block text-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors duration-300">
      Baca Selengkapnya
    </button>
  </Link>
</div>

      </div>
    </div>
  );
};

const Pagination: React.FC = () => {
  return (
    <div className="flex justify-center items-center mt-8 space-x-2">
      <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        Previous
      </button>
      <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        1
      </button>
      <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        2
      </button>
      <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        3
      </button>
      <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        Next
      </button>
    </div>
  );
};

const NewsPage: React.FC = () => {
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/berita")
      .then((res) => res.json())
      .then((data) => {
        setBeritaList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching berita:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center p-10">Loading berita...</div>;
  }

  return (
    <div>
      <Banner />
      <SearchBar />

     <div className="container mx-auto pb-2 px-20">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 p-14">
    {beritaList.map((item) => {
      const firstContentImage = extractFirstImage(item.isi_berita);

      return (
        <NewsCard
          key={item.id}
          title={item.judul}
          date={new Date(item.tanggal_upload).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          author={item.penulis}
          views={item.views}
          image={
            item.gambar
              ? `http://localhost:8000/storage/${item.gambar}`
              : firstContentImage || "https://via.placeholder.com/400x300?text=No+Image"
          }
          slug={item.slug}
        />
      );
    })}
  </div>
</div>

      <div className="container mx-auto mt-0 pb-10">
        <Pagination />
      </div>
    </div>
  );
};

export default NewsPage;
