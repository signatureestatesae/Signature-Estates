import Image from "next/image";

export default function AgentAvatar({
  photo,
  name,
  sizes,
  className = "object-cover",
  priority,
}: {
  photo: string;
  name: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  if (!photo) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 font-display text-3xl font-semibold text-gray-400">
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }
  return <Image src={photo} alt={name} fill priority={priority} sizes={sizes} className={className} />;
}
