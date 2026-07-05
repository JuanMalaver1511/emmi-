-- Add wholesale pricing to products
ALTER TABLE "Product" ADD COLUMN "wholesalePrice" DECIMAL(10,2);
ALTER TABLE "Product" ADD COLUMN "wholesaleMinQty" INTEGER NOT NULL DEFAULT 6;

-- Add wholesale flag to cart items
ALTER TABLE "CartItem" ADD COLUMN "wholesale" BOOLEAN NOT NULL DEFAULT false;

-- Drop old unique constraint and recreate with wholesale
DROP INDEX IF EXISTS "CartItem_userId_productId_size_color_key";
CREATE UNIQUE INDEX "CartItem_userId_productId_size_color_wholesale_key" ON "CartItem"("userId", "productId", "size", "color", "wholesale");
