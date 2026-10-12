import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, isFirebaseConfigured, storage } from './firebase';

const extensions: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif',
};

export async function uploadSiteImage(file: File): Promise<string> {
  if (!isFirebaseConfigured || !auth.currentUser?.emailVerified) {
    throw new Error('Inicia sesión con una cuenta verificada para subir imágenes.');
  }
  const extension = extensions[file.type];
  if (!extension || file.size > 5 * 1024 * 1024) {
    throw new Error('Usa JPG, PNG, WebP o AVIF de máximo 5 MB.');
  }
  const location = ref(storage, `site-images/${crypto.randomUUID()}.${extension}`);
  await uploadBytes(location, file, { contentType: file.type });
  return getDownloadURL(location);
}
