export function generateSlug(text: string): string {
  const trMap: Record<string, string> = {
    ç: 'c',
    Ç: 'c',
    ğ: 'g',
    Ğ: 'g',
    ş: 's',
    Ş: 's',
    ü: 'u',
    Ü: 'u',
    ı: 'i',
    İ: 'i',
    ö: 'o',
    Ö: 'o',
  };

  let slug = text.trim();

  // Replace Turkish characters
  for (const [key, value] of Object.entries(trMap)) {
    slug = slug.replaceAll(key, value);
  }

  // Normalize, remove special characters, replace spaces with hyphens
  slug = slug
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug) {
    slug = 'ilan';
  }

  // Append a short random suffix to ensure uniqueness
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${slug}-${randomSuffix}`;
}
