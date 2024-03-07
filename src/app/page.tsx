import MediaList from "@/components/MediaList";
import Image from "next/image";

const  Home = () => {
  return (
    <main>
         <h1 className="text-4xl font-bold">Media</h1>
      <MediaList />
    </main>
  );
}

export default Home;
