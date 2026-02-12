

export const products= [
  {
    id: 'p1',
    name: 'Classic Cotton T-Shirt',
    category: 'T-Shirts',
    basePrice: 29.99,
    image: '/placeholder.svg',
    barcode: '1001001001',
    description: 'Premium cotton crew neck t-shirt',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'White', hex: '#ffffff' },
      { name: 'Navy', hex: '#1e3a5f' },
      { name: 'Red', hex: '#dc2626' },
    ],
    variants: [
      { size: 'S', color: { name: 'Black', hex: '#1a1a1a' }, stock: 15, sku: 'TSH-BLK-S' },
      { size: 'M', color: { name: 'Black', hex: '#1a1a1a' }, stock: 22, sku: 'TSH-BLK-M' },
      { size: 'L', color: { name: 'Black', hex: '#1a1a1a' }, stock: 18, sku: 'TSH-BLK-L' },
      { size: 'XL', color: { name: 'Black', hex: '#1a1a1a' }, stock: 10, sku: 'TSH-BLK-XL' },
      { size: 'M', color: { name: 'White', hex: '#ffffff' }, stock: 20, sku: 'TSH-WHT-M' },
      { size: 'L', color: { name: 'White', hex: '#ffffff' }, stock: 14, sku: 'TSH-WHT-L' },
      { size: 'M', color: { name: 'Navy', hex: '#1e3a5f' }, stock: 12, sku: 'TSH-NVY-M' },
      { size: 'L', color: { name: 'Red', hex: '#dc2626' }, stock: 8, sku: 'TSH-RED-L' },
    ],
  },
  {
    id: 'p2',
    name: 'Slim Fit Denim Jeans',
    category: 'Jeans',
    basePrice: 59.99,
    image: '/placeholder.svg',
    barcode: '1002002002',
    description: 'Stretch denim slim fit jeans',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Indigo', hex: '#3b4f7a' },
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Light Wash', hex: '#8facc4' },
    ],
    variants: [
      { size: 'S', color: { name: 'Indigo', hex: '#3b4f7a' }, stock: 10, sku: 'JNS-IND-S' },
      { size: 'M', color: { name: 'Indigo', hex: '#3b4f7a' }, stock: 16, sku: 'JNS-IND-M' },
      { size: 'L', color: { name: 'Indigo', hex: '#3b4f7a' }, stock: 12, sku: 'JNS-IND-L' },
      { size: 'XL', color: { name: 'Black', hex: '#1a1a1a' }, stock: 8, sku: 'JNS-BLK-XL' },
      { size: 'M', color: { name: 'Black', hex: '#1a1a1a' }, stock: 14, sku: 'JNS-BLK-M' },
      { size: 'L', color: { name: 'Light Wash', hex: '#8facc4' }, stock: 6, sku: 'JNS-LTW-L' },
    ],
  },
  {
    id: 'p3',
    name: 'Leather Bomber Jacket',
    category: 'Jackets',
    basePrice: 149.99,
    image: '/placeholder.svg',
    barcode: '1003003003',
    description: 'Genuine leather bomber jacket with satin lining',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Brown', hex: '#8B4513' },
      { name: 'Black', hex: '#1a1a1a' },
    ],
    variants: [
      { size: 'S', color: { name: 'Brown', hex: '#8B4513' }, stock: 4, sku: 'JKT-BRN-S' },
      { size: 'M', color: { name: 'Brown', hex: '#8B4513' }, stock: 6, sku: 'JKT-BRN-M' },
      { size: 'L', color: { name: 'Brown', hex: '#8B4513' }, stock: 5, sku: 'JKT-BRN-L' },
      { size: 'M', color: { name: 'Black', hex: '#1a1a1a' }, stock: 7, sku: 'JKT-BLK-M' },
      { size: 'L', color: { name: 'Black', hex: '#1a1a1a' }, stock: 3, sku: 'JKT-BLK-L' },
    ],
  },
  {
    id: 'p4',
    name: 'Floral Summer Dress',
    category: 'Dresses',
    basePrice: 79.99,
    image: '/placeholder.svg',
    barcode: '1004004004',
    description: 'Lightweight floral print summer dress',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Rose', hex: '#e11d48' },
      { name: 'Sky Blue', hex: '#38bdf8' },
      { name: 'Ivory', hex: '#fffff0' },
    ],
    variants: [
      { size: 'S', color: { name: 'Rose', hex: '#e11d48' }, stock: 9, sku: 'DRS-RSE-S' },
      { size: 'M', color: { name: 'Rose', hex: '#e11d48' }, stock: 11, sku: 'DRS-RSE-M' },
      { size: 'L', color: { name: 'Sky Blue', hex: '#38bdf8' }, stock: 7, sku: 'DRS-SKY-L' },
      { size: 'M', color: { name: 'Ivory', hex: '#fffff0' }, stock: 13, sku: 'DRS-IVR-M' },
    ],
  },
  {
    id: 'p5',
    name: 'Wool Blend Overcoat',
    category: 'Jackets',
    basePrice: 199.99,
    image: '/placeholder.svg',
    barcode: '1005005005',
    description: 'Tailored wool blend overcoat for winter',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Charcoal', hex: '#36454F' },
      { name: 'Camel', hex: '#C19A6B' },
    ],
    variants: [
      { size: 'M', color: { name: 'Charcoal', hex: '#36454F' }, stock: 5, sku: 'OVR-CHR-M' },
      { size: 'L', color: { name: 'Charcoal', hex: '#36454F' }, stock: 4, sku: 'OVR-CHR-L' },
      { size: 'XL', color: { name: 'Camel', hex: '#C19A6B' }, stock: 3, sku: 'OVR-CML-XL' },
      { size: 'XXL', color: { name: 'Camel', hex: '#C19A6B' }, stock: 2, sku: 'OVR-CML-XXL' },
    ],
  },
  {
    id: 'p6',
    name: 'Casual Polo Shirt',
    category: 'T-Shirts',
    basePrice: 39.99,
    image: '/placeholder.svg',
    barcode: '1006006006',
    description: 'Classic fit piqué polo shirt',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Forest Green', hex: '#228B22' },
      { name: 'Burgundy', hex: '#800020' },
      { name: 'White', hex: '#ffffff' },
    ],
    variants: [
      { size: 'S', color: { name: 'Forest Green', hex: '#228B22' }, stock: 10, sku: 'POL-GRN-S' },
      { size: 'M', color: { name: 'Forest Green', hex: '#228B22' }, stock: 15, sku: 'POL-GRN-M' },
      { size: 'L', color: { name: 'Burgundy', hex: '#800020' }, stock: 12, sku: 'POL-BRG-L' },
      { size: 'XL', color: { name: 'White', hex: '#ffffff' }, stock: 8, sku: 'POL-WHT-XL' },
      { size: 'M', color: { name: 'Burgundy', hex: '#800020' }, stock: 11, sku: 'POL-BRG-M' },
    ],
  },
  {
    id: 'p7',
    name: 'Chino Pants',
    category: 'Pants',
    basePrice: 49.99,
    image: '/placeholder.svg',
    barcode: '1007007007',
    description: 'Tailored fit stretch chino pants',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Khaki', hex: '#c3b091' },
      { name: 'Navy', hex: '#1e3a5f' },
      { name: 'Olive', hex: '#556B2F' },
    ],
    variants: [
      { size: 'S', color: { name: 'Khaki', hex: '#c3b091' }, stock: 14, sku: 'CHN-KHK-S' },
      { size: 'M', color: { name: 'Khaki', hex: '#c3b091' }, stock: 20, sku: 'CHN-KHK-M' },
      { size: 'L', color: { name: 'Navy', hex: '#1e3a5f' }, stock: 10, sku: 'CHN-NVY-L' },
      { size: 'XL', color: { name: 'Olive', hex: '#556B2F' }, stock: 6, sku: 'CHN-OLV-XL' },
    ],
  },
  {
    id: 'p8',
    name: 'Silk Evening Dress',
    category: 'Dresses',
    basePrice: 129.99,
    image: '/placeholder.svg',
    barcode: '1008008008',
    description: 'Elegant silk evening dress with side slit',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Emerald', hex: '#046307' },
    ],
    variants: [
      { size: 'S', color: { name: 'Black', hex: '#1a1a1a' }, stock: 3, sku: 'EVD-BLK-S' },
      { size: 'M', color: { name: 'Black', hex: '#1a1a1a' }, stock: 5, sku: 'EVD-BLK-M' },
      { size: 'L', color: { name: 'Emerald', hex: '#046307' }, stock: 4, sku: 'EVD-EMR-L' },
    ],
  },
];

export function searchProducts(query) {
  const lower = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower) ||
      p.barcode.includes(query)
  );
}

export function getProductById(id) {
  return products.find((p) => p.id === id);
}
