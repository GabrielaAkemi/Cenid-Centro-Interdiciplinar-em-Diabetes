import { apiFetch } from "./api";

export default async function uploadFiles(files: File[], contentType: string, objectId: number) {
  for (const file of files) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("content_type", contentType);
    formData.append("object_id", objectId.toString());

    await apiFetch("/api/anexos/", true, {
      method: "POST",
      body: formData,
    });


  }
}
