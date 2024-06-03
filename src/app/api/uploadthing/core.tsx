import { createUploadthing, type FileRouter } from "uploadthing/next";
// import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import sharp from "sharp";
import { db } from "@/db";

const f = createUploadthing();
 
// const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
  .input(z.object({ configId: z.string().optional() }))
    // configId is filename 
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input }) => {
      // This code runs on your server before upload
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      const { configId } = metadata.input
      
      const res = await fetch(file.url)
      const buffer = await res.arrayBuffer()
      const imgMetadata = await sharp(buffer).metadata()
      const { width, height } = imgMetadata

      if (!configId) {
        // create a new row in our db with the new image that was uploaded
        const configuration = await db.configuration.create({
          data: {
            imageUrl: file.url,
            height: height || 500,
            width: width || 500,
          }
        })

        return { configId: configuration.id }
      } else {
        // this is run in step 2 when image cropped for phone cover
        const updatedConfiguration = await db.configuration.update({
          where: {
            id: configId
          },
          data: {
            croppedImageUrl: file.url,
          }
        })
        return { configId: updatedConfiguration.id };
      }
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;