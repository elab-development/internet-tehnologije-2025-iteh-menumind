export async function uploadToCloudinary(file: File) {
  const signRes = await fetch("/api/cloudinary/sign", {
    method: "POST",
  });

  if (!signRes.ok) {
    throw new Error("Failed to sign upload");
  }

  const sign = await signRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sign.apiKey);
  formData.append("timestamp", sign.timestamp);
  formData.append("signature", sign.signature);
  formData.append("folder", sign.folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  return res.json() as Promise<{
    secure_url: string;
    public_id: string;
  }>;
}
