import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@emmi.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@emmi.com', password: adminPassword, role: 'ADMIN' },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@emmi.com' },
    update: {},
    create: { name: 'Cliente', email: 'user@emmi.com', password: userPassword, role: 'USER' },
  });

  const categories = [
    { name: 'Camisetas', slug: 'camisetas', description: 'Camisetas modernas y cómodas' },
    { name: 'Pantalones', slug: 'pantalones', description: 'Pantalones elegantes y casuales' },
    { name: 'Vestidos', slug: 'vestidos', description: 'Vestidos para toda ocasión' },
    { name: 'Chaquetas', slug: 'chaquetas', description: 'Chaquetas y abrigos' },
    { name: 'Accesorios', slug: 'accesorios', description: 'Complementa tu estilo' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const allCategories = await prisma.category.findMany();

  const products = [
    { name: 'Camiseta Premium Blanca', slug: 'camiseta-premium-blanca', description: 'Camiseta de algodón orgánico de alta calidad. Corte moderno y cómodo para el día a día.', price: 59900, comparePrice: 79900, images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'], sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Blanco', 'Negro', 'Gris'], stock: 50, featured: true, categoryId: allCategories[0].id },
    { name: 'Camiseta Elegante Roja', slug: 'camiseta-elegante-roja', description: 'Camiseta de corte moderno en rojo pasión. Perfecta para un look casual pero sofisticado.', price: 79900, comparePrice: 99900, images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Rojo', 'Blanco', 'Negro'], stock: 35, featured: true, categoryId: allCategories[0].id },
    { name: 'Pantalón Casual Beige', slug: 'pantalon-casual-beige', description: 'Pantalón casual de corte recto. Tejido suave y transpirable ideal para cualquier temporada.', price: 129900, comparePrice: 159900, images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600'], sizes: ['28', '30', '32', '34', '36'], colors: ['Beige', 'Negro', 'Azul'], stock: 30, featured: true, categoryId: allCategories[1].id },
    { name: 'Pantalón Ajustado Negro', slug: 'pantalon-ajustado-negro', description: 'Pantalón ajustado de vestir. Elegancia y comodidad en un diseño moderno.', price: 149900, images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600'], sizes: ['28', '30', '32', '34'], colors: ['Negro', 'Gris'], stock: 25, featured: false, categoryId: allCategories[1].id },
    { name: 'Vestido Rojo Elegante', slug: 'vestido-rojo-elegante', description: 'Vestido rojo de corte elegante. Perfecto para ocasiones especiales y cenas formales.', price: 189900, comparePrice: 249900, images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600'], sizes: ['XS', 'S', 'M', 'L'], colors: ['Rojo', 'Negro'], stock: 20, featured: true, categoryId: allCategories[2].id },
    { name: 'Vestido Casual Blanco', slug: 'vestido-casual-blanco', description: 'Vestido blanco ligero y fresco. Ideal para días de verano y eventos casuales.', price: 99900, images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600'], sizes: ['S', 'M', 'L'], colors: ['Blanco', 'Celeste'], stock: 40, featured: false, categoryId: allCategories[2].id },
    { name: 'Chaqueta de Cuero', slug: 'chaqueta-de-cuero', description: 'Chaqueta de cuero genuino. Un clásico atemporal que nunca pasa de moda.', price: 349900, comparePrice: 449900, images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Negro', 'Marrón'], stock: 15, featured: true, categoryId: allCategories[3].id },
    { name: 'Chaqueta Deportiva', slug: 'chaqueta-deportiva', description: 'Chaqueta deportiva moderna. Cómoda y funcional para el día a día.', price: 179900, images: ['https://images.unsplash.com/photo-1544923246-77307dd270b6?w=600'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Negro', 'Gris', 'Azul'], stock: 45, featured: false, categoryId: allCategories[3].id },
    { name: 'Bufanda de Lujo Roja', slug: 'bufanda-de-lujo-roja', description: 'Bufanda de cachemir roja. Suavidad y calidez con un toque de elegancia.', price: 59900, images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600'], sizes: ['Única'], colors: ['Rojo', 'Burdeos'], stock: 60, featured: false, categoryId: allCategories[4].id },
    { name: 'Gorro Clásico', slug: 'gorro-clasico', description: 'Gorro de lana clásico. El complemento perfecto para el invierno.', price: 39900, images: ['https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600'], sizes: ['Única'], colors: ['Negro', 'Gris', 'Rojo'], stock: 80, featured: false, categoryId: allCategories[4].id },
    { name: 'Camiseta Algodón Orgánico', slug: 'camiseta-algodon-organico', description: 'Camiseta sostenible de algodón orgánico. Suave con tu piel y con el planeta.', price: 69900, images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600'], sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Blanco', 'Negro', 'Verde'], stock: 55, featured: false, categoryId: allCategories[0].id },
    { name: 'Pantalón Vaquero Clásico', slug: 'pantalon-vaquero-clasico', description: 'Pantalón vaquero de corte clásico. Duradero y cómodo para cualquier ocasión.', price: 119900, comparePrice: 149900, images: ['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600'], sizes: ['28', '30', '32', '34', '36'], colors: ['Azul', 'Negro'], stock: 35, featured: false, categoryId: allCategories[1].id },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log('Seed completed successfully');
  console.log('Admin login: admin@emmi.com / admin123');
  console.log('User login:  user@emmi.com / user123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
