import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import type { OffPlanProject } from "@/data/types";
import { formatLocation, formatNumber, formatPrice } from "@/lib/format";
import { shimmerBlurDataURL } from "@/lib/image";

export default function OffPlanCard({
  project,
  priority = false,
}: {
  project: OffPlanProject;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/off-plan/${project.slug}`}
      className="group block overflow-hidden rounded-sm border border-gold-300/50 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-400 hover:shadow-[0_25px_55px_-15px_rgba(184,146,63,0.45)]"
    >
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-gray-100">
        {project.images.length > 0 ? (
          <Image
            src={project.images[0]}
            alt={project.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            placeholder="blur"
            blurDataURL={shimmerBlurDataURL(400, 275)}
            priority={priority}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-300">
            <ImageOff className="h-8 w-8" strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="bg-black/70 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
            {project.status}
          </span>
          {project.featured && (
            <span className="bg-gold-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink-950">
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <p className="text-xs text-gray-500">{formatLocation(project.area, project.city)}</p>
        <h3 className="mt-1 font-display text-base font-bold text-ink-900">
          {project.name}
        </h3>
        <p className="mt-1 text-xs text-gray-400">by {project.developer}</p>

        {(project.handover || project.minSize > 0 || project.maxSize > 0) && (
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
            {project.handover && <span>Handover {project.handover}</span>}
            {(project.minSize > 0 || project.maxSize > 0) && (
              <span>
                {formatNumber(project.minSize)}&ndash;{formatNumber(project.maxSize)} m&sup2;
              </span>
            )}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="font-display text-lg font-bold text-ink-900">
            {project.startingPrice > 0
              ? `From ${formatPrice(project.startingPrice, "total")}`
              : "Price on Request"}
          </span>
          <span className="text-xs text-gray-400">Ref {project.reference}</span>
        </div>
      </div>
    </Link>
  );
}
