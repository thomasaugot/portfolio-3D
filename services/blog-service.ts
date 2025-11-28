export async function getMediumPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`, {
    next: { revalidate: 43200 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Medium posts");
  }
  console.log("Fetched Medium posts:", await res.clone().json());
  return res.json();
}
