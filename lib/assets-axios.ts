"use client"

import axios from 'axios';

// POST   /upload                      (file upload: image/video)
// GET    /uploads/assets/{key}        (get uploaded file)
// GET    /uploads/placeholders/{key}  (get placeholder image

/**
Endpoint:
POST /upload

Body:

Form-data (multipart/form-data)
Anahtar: file
Değer: Yüklenecek dosya (fotoğraf veya video)
Örnek cURL:

Yanıt (Response) [application/json]:

placeholder: Yüklenen fotoğraf için oluşturulan düşük çözünürlüklü/blur placeholder görselinin yolu. (Video için boş string)
image: Yüklenen dosyanın (fotoğraf veya video) yolu.
2. Dosya Getirme (Assets veya Placeholder)
Endpoint:
GET /uploads/assets/{key}
GET /uploads/placeholders/{key}

Body:

Body gönderilmez.
Yanıt:

Dosyanın kendisi (image/video veya placeholder image)
Content-Type otomatik olarak dosya tipine göre ayarlanır.
Örnek:
GET http://localhost:8000/uploads/assets/1716630000000000000.mp4
GET http://localhost:8000/uploads/placeholders/1716630000000000000.jpg
 */

const assetAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_ASSET_API_URL!,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
    timeout: 30000, // 30 seconds timeout
});

export const uploadAsset = async (file: File): Promise<{ placeholder: string; image: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await assetAxios.post('upload', formData);
    return response.data;
};

export const getAsset = async (key: string): Promise<Blob> => {
    const response = await assetAxios.get(`uploads/assets/${key}`, {
        responseType: 'blob',
    });
    return response.data;
};

export const getPlaceholder = async (key: string): Promise<Blob> => {
    const response = await assetAxios.get(`uploads/placeholders/${key}`, {
        responseType: 'blob',
    });
    return response.data;
};