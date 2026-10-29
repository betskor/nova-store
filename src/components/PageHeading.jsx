
export default function PageHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
          {eyebrow}
        </p>
      )}

      <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
        {title}
      </h1>

      {description && (
        <p className="mt-4 max-w-2xl leading-7 text-zinc-500">
          {description}
        </p>
      )}
    </div>
  )
}
