// src/api/api.js
// Axios instance with base URL and auth token handling
// Functions to presign and get view URLs for item and bundle images

import axios from "axios";

const api = axios.create({
  baseURL: "https://apiofstuffbi.sanjulagathsara.com",
});

// Auto attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function presignItemImage(itemId, contentType) {
  const res = await api.post(`/items/${itemId}/image/presign`, { contentType });
  return res.data; // { key, uploadUrl, url }
}

export async function presignNewItemImage(contentType) {
  const res = await api.post(`/items/image/presign`, { contentType });
  return res.data; // { key, uploadUrl, url }
}

export async function getItemImageViewUrl(itemId) {
  const res = await api.get(`/items/${itemId}/image/view-url`);
  return res.data; // { viewUrl }
}

export async function uploadToS3(uploadUrl, file, onProgress) {
  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type },
    onUploadProgress: (evt) => {
      if (!evt.total) return;
      const percent = Math.round((evt.loaded / evt.total) * 100);
      onProgress?.(percent);
    },
  });
}

export async function presignNewBundleImage(contentType) {
  const res = await api.post(`/bundles/image/presign`, { contentType });
  return res.data; // { key, uploadUrl, url }
}

export async function presignBundleImage(bundleId, contentType) {
  const res = await api.post(`/bundles/${bundleId}/image/presign`, { contentType });
  return res.data;
}

export async function getBundleImageViewUrl(bundleId) {
  const res = await api.get(`/bundles/${bundleId}/image/view-url`);
  return res.data; // { viewUrl }
}


export default api;
