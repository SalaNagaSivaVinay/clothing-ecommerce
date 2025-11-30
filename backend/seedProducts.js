import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const products = [
  { name: 'Classic White T-Shirt', description: 'Cotton tee', price: 499, image: 'https://via.placeholder.com/300', category: 'Men', sizes: ['S','M','L','XL'] },
  { name: 'Blue Denim Jeans', description: 'Straight fit jeans', price: 1499, image: 'https://via.placeholder.com/300', category: 'Men', sizes: ['M','L','XL'] },
  { name: 'Black Hoodie', description: 'Warm hoodie', price: 999, image: 'https://via.placeholder.com/300', category: 'Men', sizes: ['S','M','L','XL'] },
  { name: 'Red Dress', description: 'Summer dress', price: 1299, image: 'https://via.placeholder.com/300', category: 'Women', sizes: ['S','M','L'] },
  { name: 'Floral Skirt', description: 'Pleated skirt', price: 899, image: 'https://via.placeholder.com/300', category: 'Women', sizes: ['S','M','L'] },
  { name: 'Leather Jacket', description: 'Stylish jacket', price: 3999, image: 'https://via.placeholder.com/300', category: 'Men', sizes: ['M','L','XL'] },
  { name: 'Kids Tee', description: 'Comfortable tee', price: 399, image: 'https://via.placeholder.com/300', category: 'Kids', sizes: ['S','M'] },
  { name: 'Kids Joggers', description: 'Soft joggers', price: 499, image: 'https://via.placeholder.com/300', category: 'Kids', sizes: ['S','M'] },
  { name: 'Striped Shirt', description: 'Formal shirt', price: 799, image: 'https://via.placeholder.com/300', category: 'Men', sizes: ['M','L','XL'] },
  { name: 'Pleated Blouse', description: 'Chic blouse', price: 699, image: 'https://via.placeholder.com/300', category: 'Women', sizes: ['S','M','L'] },
  { name: 'Sport Shorts', description: 'Running shorts', price: 399, image: 'https://via.placeholder.com/300', category: 'Men', sizes: ['S','M','L'] },
  { name: 'Summer Hat', description: 'Sun hat', price: 199, image: 'https://via.placeholder.com/300', category: 'Women', sizes: [] },
  { name: 'Casual Chinos', description: 'Comfortable chinos', price: 1099, image: 'https://via.placeholder.com/300', category: 'Men', sizes: ['M','L','XL'] },
  { name: 'Evening Gown', description: 'Elegant gown', price: 4999, image: 'https://via.placeholder.com/300', category: 'Women', sizes: ['M','L'] },
  { name: 'Bomber Jacket', description: 'Light jacket', price: 2499, image: 'https://via.placeholder.com/300', category: 'Men', sizes: ['M','L','XL'] },
  { name: 'Sweatshirt', description: 'Casual sweatshirt', price: 899, image: 'https://via.placeholder.com/300', category: 'Women', sizes: ['S','M','L'] },
  { name: 'Denim Skirt', description: 'Casual skirt', price: 799, image: 'https://via.placeholder.com/300', category: 'Women', sizes: ['S','M','L'] },
  { name: 'Cargo Pants', description: 'Utility pants', price: 1199, image: 'https://via.placeholder.com/300', category: 'Men', sizes: ['M','L','XL'] },
  { name: 'Polo Shirt', description: 'Smart casual', price: 599, image: 'https://via.placeholder.com/300', category: 'Men', sizes: ['S','M','L'] },
  { name: 'Kids Jacket', description: 'Warm jacket', price: 899, image: 'https://via.placeholder.com/300', category: 'Kids', sizes: ['S','M'] }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("⚡ Connected to MongoDB");

    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log("🌱 Seeded products successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();