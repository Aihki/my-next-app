import { fetchMediaById } from "@/models/mediaModel";


export default async function Single({ params }: { params: { id: string } }) {
  const mediaItem = await fetchMediaById(parseInt(params.id));
  if (!mediaItem) {
    return <p>No media found</p>;
  }
  return (
    <div>
      <h1>{mediaItem.title}</h1>
      {mediaItem.media_type.includes("video") ? (
        <video width="640" height="4000" controls>
          <source src={mediaItem.filename} type={mediaItem.media_type} />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mediaItem.filename}
          alt={mediaItem.title}
          width="640"
          height="400"
        />
      )}
      <p>{mediaItem.description}</p>
      <p>{new Date(mediaItem.created_at).toLocaleDateString("fi-FI")}</p>
    </div>
  );
}
