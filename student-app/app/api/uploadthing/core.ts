import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  // Profile picture uploads (for all users)
  profilePicture: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      try {
        const session = await getServerSession(authOptions);
        return { userId: session?.user ? (session.user as any).id : "anonymous" };
      } catch (e) {
        return { userId: "anonymous" };
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Profile picture upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),

  // Gallery image uploads (for admin)
  galleryImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async () => {
      try {
        const session = await getServerSession(authOptions);
        return { userId: session?.user ? (session.user as any).id : "anonymous" };
      } catch (e) {
        return { userId: "anonymous" };
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Gallery image upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
