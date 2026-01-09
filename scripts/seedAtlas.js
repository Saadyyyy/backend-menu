const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Menu = require('../models/Menu');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const categoriesData = [
    { name: 'Makanan', image: '/images/makanan.jpg' },
    { name: 'Minuman', image: '/images/minuman.jpg' },
    { name: 'Dessert', image: '/images/dessert.jpg' },
    { name: 'Cemilan', image: '/images/cemilan.jpg' },
    { name: 'Sarapan', image: '/images/sarapan.jpg' },
    { name: 'Kopi', image: '/images/kopi.jpg' },
  ];
  const catMap = {};
  for (const c of categoriesData) {
    let doc = await Category.findOne({ name: c.name });
    if (!doc) {
      doc = await Category.create(c);
    }
    catMap[c.name] = doc._id;
  }
  const menusData = [
    { category: 'Makanan', name: 'Nasi Goreng', description: 'Nasi goreng spesial', image: '/images/nasigoreng.jpg', time: 15, slot: 20 },
    { category: 'Makanan', name: 'Sate Ayam', description: 'Sate ayam bumbu kacang', image: '/images/sateayam.jpg', time: 20, slot: 15 },
    { category: 'Minuman', name: 'Es Teh Manis', description: 'Teh manis dingin', image: '/images/esteh.jpg', time: 2, slot: 100 },
    { category: 'Minuman', name: 'Jus Alpukat', description: 'Jus alpukat creamy', image: '/images/jusalpukat.jpg', time: 5, slot: 50 },
    { category: 'Dessert', name: 'Puding Coklat', description: 'Puding coklat lembut', image: '/images/puding.jpg', time: 10, slot: 30 },
    { category: 'Dessert', name: 'Cheesecake', description: 'Cheesecake klasik', image: '/images/cheesecake.jpg', time: 25, slot: 20 },
    { category: 'Cemilan', name: 'Kentang Goreng', description: 'Kentang goreng renyah', image: '/images/kentang.jpg', time: 8, slot: 40 },
    { category: 'Cemilan', name: 'Roti Bakar', description: 'Roti bakar coklat', image: '/images/rotibakar.jpg', time: 7, slot: 35 },
    { category: 'Sarapan', name: 'Bubur Ayam', description: 'Bubur ayam hangat', image: '/images/bubur.jpg', time: 12, slot: 25 },
    { category: 'Sarapan', name: 'Omelet', description: 'Omelet keju', image: '/images/omelet.jpg', time: 6, slot: 30 },
    { category: 'Kopi', name: 'Espresso', description: 'Single shot espresso', image: '/images/espresso.jpg', time: 3, slot: 60 },
    { category: 'Kopi', name: 'Cappuccino', description: 'Cappuccino klasik', image: '/images/cappuccino.jpg', time: 4, slot: 50 },
  ];
  let created = 0;
  for (const m of menusData) {
    const catId = catMap[m.category];
    if (!catId) {
      continue;
    }
    const exists = await Menu.findOne({ name: m.name, category: catId });
    if (!exists) {
      await Menu.create({ category: catId, name: m.name, description: m.description, image: m.image, time: m.time, slot: m.slot });
      created += 1;
    }
  }
  const count = await Menu.countDocuments();
  console.log(JSON.stringify({ created, totalMenus: count }));
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
