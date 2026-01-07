import { initDb } from "./init.js";
import { query, closePool } from "./postgres.js";

const sampleProducts = [
  // Beverages - Boycotted
  { name: "Coca-Cola", brand: "The Coca-Cola Company", category: "Beverage", country: "USA", isBoycotted: true, reason: "Supports controversial policies", tunisianAlternative: "Boga, Hamoud Boualem" },
  { name: "Pepsi", brand: "PepsiCo", category: "Beverage", country: "USA", isBoycotted: true, reason: "Supports controversial policies", tunisianAlternative: "Boga, Hamoud Boualem" },
  { name: "Fanta", brand: "The Coca-Cola Company", category: "Beverage", country: "USA", isBoycotted: true, reason: "Part of Coca-Cola group", tunisianAlternative: "Boga Orange" },
  { name: "Sprite", brand: "The Coca-Cola Company", category: "Beverage", country: "USA", isBoycotted: true, reason: "Part of Coca-Cola group", tunisianAlternative: "Boga Lemon" },
  { name: "7UP", brand: "PepsiCo", category: "Beverage", country: "USA", isBoycotted: true, reason: "Part of PepsiCo group", tunisianAlternative: "Boga Lemon" },
  { name: "Mountain Dew", brand: "PepsiCo", category: "Beverage", country: "USA", isBoycotted: true, reason: "Part of PepsiCo group", tunisianAlternative: "Boga Energy" },
  { name: "Red Bull", brand: "Red Bull GmbH", category: "Energy Drink", country: "Austria", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Monster Energy", brand: "Monster Beverage", category: "Energy Drink", country: "USA", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Nestlé Water", brand: "Nestlé", category: "Beverage", country: "Switzerland", isBoycotted: true, reason: "Water resource exploitation", tunisianAlternative: "Safia, Ain Garci" },
  { name: "Evian", brand: "Danone", category: "Beverage", country: "France", isBoycotted: true, reason: "Supports controversial policies", tunisianAlternative: "Safia, Ain Garci, Melliti" },
  { name: "Starbucks Coffee", brand: "Starbucks", category: "Beverage", country: "USA", isBoycotted: true, reason: "Controversial business practices", tunisianAlternative: "Café Bondin, Maison du Café" },
  { name: "Nescafé", brand: "Nestlé", category: "Beverage", country: "Switzerland", isBoycotted: true, reason: "Part of Nestlé group", tunisianAlternative: "Café Bondin" },
  { name: "Lipton Ice Tea", brand: "Unilever/PepsiCo", category: "Beverage", country: "USA", isBoycotted: true, reason: "Joint venture with PepsiCo", tunisianAlternative: "Boga Ice Tea" },
  
  // Beverages - Tunisian/Safe
  { name: "Boga Lemon", brand: "SFBT", category: "Beverage", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Boga Orange", brand: "SFBT", category: "Beverage", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Safia Water", brand: "SFBT", category: "Beverage", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Ain Garci Water", brand: "SAIDA", category: "Beverage", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Melliti Water", brand: "Melliti", category: "Beverage", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Hamoud Boualem", brand: "Hamoud Boualem", category: "Beverage", country: "Algeria", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Café Bondin", brand: "Bondin", category: "Beverage", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  
  // Fast Food - Boycotted
  { name: "McDonald's Big Mac", brand: "McDonald's", category: "Fast Food", country: "USA", isBoycotted: true, reason: "Franchise policy concerns", tunisianAlternative: "Machmoum Burger" },
  { name: "McDonald's Fries", brand: "McDonald's", category: "Fast Food", country: "USA", isBoycotted: true, reason: "Franchise policy concerns", tunisianAlternative: "Local burger restaurants" },
  { name: "KFC Chicken", brand: "Yum! Brands", category: "Fast Food", country: "USA", isBoycotted: true, reason: "Corporate policies", tunisianAlternative: "Poulet Champion" },
  { name: "Pizza Hut", brand: "Yum! Brands", category: "Fast Food", country: "USA", isBoycotted: true, reason: "Corporate policies", tunisianAlternative: "Pizza Maestro" },
  { name: "Burger King Whopper", brand: "Burger King", category: "Fast Food", country: "USA", isBoycotted: true, reason: "Corporate policies", tunisianAlternative: "Machmoum Burger" },
  { name: "Domino's Pizza", brand: "Domino's", category: "Fast Food", country: "USA", isBoycotted: true, reason: "Corporate policies", tunisianAlternative: "Pizza Maestro" },
  { name: "Subway Sandwich", brand: "Subway", category: "Fast Food", country: "USA", isBoycotted: false, reason: "", tunisianAlternative: "" },
  
  // Snacks & Food - Boycotted
  { name: "Lay's Chips", brand: "PepsiCo", category: "Snacks", country: "USA", isBoycotted: true, reason: "Part of PepsiCo group", tunisianAlternative: "Vico Chips" },
  { name: "Doritos", brand: "PepsiCo", category: "Snacks", country: "USA", isBoycotted: true, reason: "Part of PepsiCo group", tunisianAlternative: "Vico Snacks" },
  { name: "Cheetos", brand: "PepsiCo", category: "Snacks", country: "USA", isBoycotted: true, reason: "Part of PepsiCo group", tunisianAlternative: "Bimo Snacks" },
  { name: "Pringles", brand: "Kellogg's", category: "Snacks", country: "USA", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Oreo", brand: "Mondelēz", category: "Snacks", country: "USA", isBoycotted: false, reason: "", tunisianAlternative: "Bimo Cookies" },
  { name: "KitKat", brand: "Nestlé", category: "Chocolate", country: "Switzerland", isBoycotted: true, reason: "Part of Nestlé group", tunisianAlternative: "Chocolat Aiguebelle" },
  { name: "Snickers", brand: "Mars Inc", category: "Chocolate", country: "USA", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "M&M's", brand: "Mars Inc", category: "Chocolate", country: "USA", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Twix", brand: "Mars Inc", category: "Chocolate", country: "USA", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Kinder Bueno", brand: "Ferrero", category: "Chocolate", country: "Italy", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Nutella", brand: "Ferrero", category: "Chocolate Spread", country: "Italy", isBoycotted: false, reason: "", tunisianAlternative: "" },
  
  // Snacks - Tunisian/Safe
  { name: "Bimo Cookies", brand: "General Biscuits Tunisia", category: "Snacks", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Vico Chips", brand: "Vico", category: "Snacks", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Messidor Biscuits", brand: "Messidor", category: "Snacks", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Chocolat Aiguebelle", brand: "Aiguebelle", category: "Chocolate", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Yazoo Cookies", brand: "Yazoo", category: "Snacks", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Poulina Chips", brand: "Poulina", category: "Snacks", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  
  // Dairy Products
  { name: "Danone Yogurt", brand: "Danone", category: "Dairy", country: "France", isBoycotted: true, reason: "Supports controversial policies", tunisianAlternative: "Vitalait, Soummam" },
  { name: "Delice Yogurt", brand: "Delice Danone", category: "Dairy", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Vitalait Milk", brand: "Vitalait", category: "Dairy", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Président Cheese", brand: "Lactalis", category: "Dairy", country: "France", isBoycotted: false, reason: "", tunisianAlternative: "Sicam Cheese" },
  { name: "Sicam Cheese", brand: "Sicam", category: "Dairy", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  
  // Electronics & Tech - Boycotted
  { name: "iPhone 15", brand: "Apple", category: "Electronics", country: "USA", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "iPhone 14", brand: "Apple", category: "Electronics", country: "USA", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "MacBook Pro", brand: "Apple", category: "Electronics", country: "USA", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "iPad Pro", brand: "Apple", category: "Electronics", country: "USA", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "HP Laptop", brand: "HP", category: "Electronics", country: "USA", isBoycotted: true, reason: "Contracts with controversial entities", tunisianAlternative: "Lenovo, Dell" },
  { name: "HP Printer", brand: "HP", category: "Electronics", country: "USA", isBoycotted: true, reason: "Contracts with controversial entities", tunisianAlternative: "Epson, Canon" },
  { name: "Dell XPS", brand: "Dell", category: "Electronics", country: "USA", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Samsung Galaxy S24", brand: "Samsung", category: "Electronics", country: "South Korea", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Lenovo ThinkPad", brand: "Lenovo", category: "Electronics", country: "China", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Microsoft Surface", brand: "Microsoft", category: "Electronics", country: "USA", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Sony PlayStation 5", brand: "Sony", category: "Gaming", country: "Japan", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Xbox Series X", brand: "Microsoft", category: "Gaming", country: "USA", isBoycotted: false, reason: "", tunisianAlternative: "" },
  
  // Personal Care - Boycotted
  { name: "Dove Soap", brand: "Unilever", category: "Personal Care", country: "UK", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Axe Deodorant", brand: "Unilever", category: "Personal Care", country: "UK", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Head & Shoulders", brand: "Procter & Gamble", category: "Personal Care", country: "USA", isBoycotted: true, reason: "Corporate policies", tunisianAlternative: "Local brands" },
  { name: "Pantene", brand: "Procter & Gamble", category: "Personal Care", country: "USA", isBoycotted: true, reason: "Corporate policies", tunisianAlternative: "Garnier, L'Oréal" },
  { name: "Gillette", brand: "Procter & Gamble", category: "Personal Care", country: "USA", isBoycotted: true, reason: "Corporate policies", tunisianAlternative: "Wilkinson" },
  { name: "Colgate", brand: "Colgate-Palmolive", category: "Personal Care", country: "USA", isBoycotted: false, reason: "", tunisianAlternative: "Signal" },
  { name: "L'Oréal Shampoo", brand: "L'Oréal", category: "Personal Care", country: "France", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Garnier Face Cream", brand: "L'Oréal", category: "Personal Care", country: "France", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Nivea Cream", brand: "Beiersdorf", category: "Personal Care", country: "Germany", isBoycotted: false, reason: "", tunisianAlternative: "" },
  
  // Cleaning Products
  { name: "Ariel Detergent", brand: "Procter & Gamble", category: "Cleaning", country: "USA", isBoycotted: true, reason: "Corporate policies", tunisianAlternative: "OMO, Le Chat" },
  { name: "Tide", brand: "Procter & Gamble", category: "Cleaning", country: "USA", isBoycotted: true, reason: "Corporate policies", tunisianAlternative: "OMO" },
  { name: "Fairy Liquid", brand: "Procter & Gamble", category: "Cleaning", country: "USA", isBoycotted: true, reason: "Corporate policies", tunisianAlternative: "Paic" },
  { name: "OMO Detergent", brand: "Unilever", category: "Cleaning", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Le Chat Detergent", brand: "Henkel", category: "Cleaning", country: "France", isBoycotted: false, reason: "", tunisianAlternative: "" },
  
  // Tunisian Traditional Products
  { name: "Harissa Cap Bon", brand: "Cap Bon", category: "Condiment", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Harissa Diva", brand: "Diva", category: "Condiment", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Tunisian Couscous", brand: "Dari", category: "Food", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Olive Oil Chemlali", brand: "CHO", category: "Food", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Olive Oil Chetoui", brand: "Terra Delyssa", category: "Food", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Makroudh Baklawa", brand: "Patisserie Tunisienne", category: "Dessert", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Dates Deglet Nour", brand: "Tunisian Dates", category: "Food", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  
  // Clothing & Fashion - Boycotted
  { name: "Nike Air Max", brand: "Nike", category: "Fashion", country: "USA", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Adidas Originals", brand: "Adidas", category: "Fashion", country: "Germany", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Puma Sneakers", brand: "Puma", category: "Fashion", country: "Germany", isBoycotted: true, reason: "Controversial sponsorships", tunisianAlternative: "Nike, Adidas, Local brands" },
  { name: "Zara Clothing", brand: "Inditex", category: "Fashion", country: "Spain", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "H&M Clothing", brand: "H&M", category: "Fashion", country: "Sweden", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Gap Jeans", brand: "Gap Inc", category: "Fashion", country: "USA", isBoycotted: false, reason: "", tunisianAlternative: "" },
  
  // Automobiles
  { name: "Toyota Corolla", brand: "Toyota", category: "Automobile", country: "Japan", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Mercedes-Benz", brand: "Mercedes-Benz", category: "Automobile", country: "Germany", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "BMW", brand: "BMW", category: "Automobile", country: "Germany", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Volkswagen Golf", brand: "Volkswagen", category: "Automobile", country: "Germany", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Renault Clio", brand: "Renault", category: "Automobile", country: "France", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Peugeot 208", brand: "Peugeot", category: "Automobile", country: "France", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Fiat 500", brand: "Fiat", category: "Automobile", country: "Italy", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Hyundai i20", brand: "Hyundai", category: "Automobile", country: "South Korea", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Kia Sportage", brand: "Kia", category: "Automobile", country: "South Korea", isBoycotted: false, reason: "", tunisianAlternative: "" },
  
  // Restaurants & Cafes
  { name: "Pizza Maestro", brand: "Pizza Maestro", category: "Restaurant", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Machmoum Burger", brand: "Machmoum", category: "Restaurant", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Lella Hadhria", brand: "Lella Hadhria", category: "Restaurant", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Mövenpick Ice Cream", brand: "Mövenpick", category: "Dessert", country: "Switzerland", isBoycotted: false, reason: "", tunisianAlternative: "" },
  
  // More Tunisian Beverages & Juices
  { name: "Boga Cidre", brand: "SFBT", category: "Beverage", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Boga Mangue", brand: "SFBT", category: "Beverage", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Fruitia Orange", brand: "SFBT", category: "Juice", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Fruitia Multivitamines", brand: "SFBT", category: "Juice", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Fresh Orange Juice", brand: "Fresh", category: "Juice", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Tropico Juice", brand: "PepsiCo", category: "Juice", country: "USA", isBoycotted: true, reason: "Part of PepsiCo group", tunisianAlternative: "Fruitia" },
  { name: "Ramy Juice", brand: "Ramy", category: "Juice", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Star Cola", brand: "Star", category: "Beverage", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Apla Water", brand: "Apla", category: "Beverage", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Hayet Water", brand: "Hayet", category: "Beverage", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  
  // More Tunisian Dairy & Yogurt
  { name: "Délice Yaourt", brand: "Délice Danone", category: "Dairy", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Délice Danette", brand: "Délice Danone", category: "Dairy", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Activia Yogurt", brand: "Danone", category: "Dairy", country: "France", isBoycotted: true, reason: "Supports controversial policies", tunisianAlternative: "Vitalait, Soummam" },
  { name: "Vitalait Lait", brand: "Vitalait", category: "Dairy", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Vitalait Fromage", brand: "Vitalait", category: "Dairy", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Soummam Lait", brand: "Soummam", category: "Dairy", country: "Algeria", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Kiri Cheese", brand: "Bel", category: "Dairy", country: "France", isBoycotted: false, reason: "", tunisianAlternative: "Vitalait" },
  { name: "La Vache Qui Rit", brand: "Bel", category: "Dairy", country: "France", isBoycotted: false, reason: "", tunisianAlternative: "Vitalait" },
  
  // More Tunisian Snacks & Biscuits
  { name: "Bimo Gaufrettes", brand: "General Biscuits", category: "Snacks", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Bimo Napolitain", brand: "General Biscuits", category: "Snacks", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Bimo Biscrem", brand: "General Biscuits", category: "Snacks", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Yazoo Wafer", brand: "Yazoo", category: "Snacks", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Tounsi Biscuits", brand: "Tounsi", category: "Snacks", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Brioche Mahboula", brand: "Mahboula", category: "Bakery", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Baguette Mahboula", brand: "Mahboula", category: "Bakery", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Croissant Mahboula", brand: "Mahboula", category: "Bakery", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Prince Biscuits", brand: "LU", category: "Snacks", country: "France", isBoycotted: false, reason: "", tunisianAlternative: "Bimo" },
  { name: "Petit Beurre", brand: "LU", category: "Snacks", country: "France", isBoycotted: false, reason: "", tunisianAlternative: "Bimo" },
  { name: "BN Biscuits", brand: "Mondelēz", category: "Snacks", country: "France", isBoycotted: false, reason: "", tunisianAlternative: "Bimo" },
  { name: "Grany Bars", brand: "LU", category: "Snacks", country: "France", isBoycotted: false, reason: "", tunisianAlternative: "Bimo" },
  
  // More Tunisian Pasta & Grains
  { name: "Panzani Pasta", brand: "Panzani", category: "Food", country: "France", isBoycotted: false, reason: "", tunisianAlternative: "Dari, Amen" },
  { name: "Dari Pasta", brand: "Dari", category: "Food", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Amen Pasta", brand: "Amen", category: "Food", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Dari Couscous", brand: "Dari", category: "Food", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Ferrero Pasta", brand: "Ferrero", category: "Food", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Barilla Pasta", brand: "Barilla", category: "Food", country: "Italy", isBoycotted: false, reason: "", tunisianAlternative: "Dari, Amen" },
  
  // Canned Foods & Conserves
  { name: "Harissa Le Phare du Cap Bon", brand: "Cap Bon", category: "Condiment", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Thon Mabrouka", brand: "Mabrouka", category: "Canned Food", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Concentré de Tomate Sicam", brand: "Sicam", category: "Condiment", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Tomate Coupe Le Moulin d'Or", brand: "Le Moulin d'Or", category: "Canned Food", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Pois Chiche Sicam", brand: "Sicam", category: "Canned Food", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Merguez", brand: "Les Vergers de Carthage", category: "Meat", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Ketchup Heinz", brand: "Heinz", category: "Condiment", country: "USA", isBoycotted: false, reason: "", tunisianAlternative: "Sicam" },
  { name: "Mayonnaise Amora", brand: "Unilever", category: "Condiment", country: "France", isBoycotted: false, reason: "", tunisianAlternative: "Sicam" },
  
  // Cooking Oils & Butter
  { name: "Huile d'Olive Alyssa", brand: "Alyssa", category: "Food", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Huile Végétale Lesieur", brand: "Lesieur", category: "Food", country: "France", isBoycotted: false, reason: "", tunisianAlternative: "Huile Cristal" },
  { name: "Huile Cristal", brand: "Cristal", category: "Food", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Margarine Randa", brand: "Randa", category: "Dairy", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Beurre Président", brand: "Lactalis", category: "Dairy", country: "France", isBoycotted: false, reason: "", tunisianAlternative: "Vitalait" },
  
  // Popular Cereals
  { name: "Nestlé Corn Flakes", brand: "Nestlé", category: "Breakfast", country: "Switzerland", isBoycotted: true, reason: "Part of Nestlé group", tunisianAlternative: "Local cereals" },
  { name: "Kellogg's Corn Flakes", brand: "Kellogg's", category: "Breakfast", country: "USA", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Chocapic", brand: "Nestlé", category: "Breakfast", country: "Switzerland", isBoycotted: true, reason: "Part of Nestlé group", tunisianAlternative: "Kellogg's" },
  { name: "Fitness Cereals", brand: "Nestlé", category: "Breakfast", country: "Switzerland", isBoycotted: true, reason: "Part of Nestlé group", tunisianAlternative: "Special K" },
  { name: "Special K", brand: "Kellogg's", category: "Breakfast", country: "USA", isBoycotted: false, reason: "", tunisianAlternative: "" },
  
  // More Cleaning Products
  { name: "Javel Siclone", brand: "Siclone", category: "Cleaning", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Liquide Vaisselle Dettol", brand: "Reckitt", category: "Cleaning", country: "UK", isBoycotted: false, reason: "", tunisianAlternative: "Paic" },
  { name: "Paic Citron", brand: "Colgate-Palmolive", category: "Cleaning", country: "France", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Mir Vaisselle", brand: "Henkel", category: "Cleaning", country: "Germany", isBoycotted: false, reason: "", tunisianAlternative: "Paic" },
  { name: "Soupline Adoucissant", brand: "Colgate-Palmolive", category: "Cleaning", country: "France", isBoycotted: false, reason: "", tunisianAlternative: "Comfort" },
  { name: "Comfort Adoucissant", brand: "Unilever", category: "Cleaning", country: "UK", isBoycotted: false, reason: "", tunisianAlternative: "" },
  
  // Ice Cream & Frozen Desserts
  { name: "Glace Gervais", brand: "Délice Danone", category: "Dessert", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Glace Mystère", brand: "Délice Danone", category: "Dessert", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Glace Magnum", brand: "Unilever", category: "Dessert", country: "UK", isBoycotted: false, reason: "", tunisianAlternative: "Gervais" },
  { name: "Glace Cornetto", brand: "Unilever", category: "Dessert", country: "UK", isBoycotted: false, reason: "", tunisianAlternative: "Gervais" },
  { name: "Ben & Jerry's", brand: "Unilever", category: "Dessert", country: "USA", isBoycotted: true, reason: "Controversial business practices", tunisianAlternative: "Gervais" },
  
  // Baby Products
  { name: "Pampers", brand: "Procter & Gamble", category: "Baby Care", country: "USA", isBoycotted: true, reason: "Corporate policies", tunisianAlternative: "Baby Plus" },
  { name: "Baby Plus", brand: "Baby Plus", category: "Baby Care", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Bledina", brand: "Danone", category: "Baby Food", country: "France", isBoycotted: true, reason: "Supports controversial policies", tunisianAlternative: "Local baby food brands" },
  { name: "Nestlé Baby Food", brand: "Nestlé", category: "Baby Food", country: "Switzerland", isBoycotted: true, reason: "Part of Nestlé group", tunisianAlternative: "Bledina" },
  
  // Cigarettes (for awareness)
  { name: "Marlboro", brand: "Philip Morris", category: "Tobacco", country: "USA", isBoycotted: true, reason: "Controversial practices", tunisianAlternative: "N/A - Stop smoking" },
  { name: "Gauloises", brand: "Imperial Tobacco", category: "Tobacco", country: "France", isBoycotted: false, reason: "", tunisianAlternative: "N/A - Stop smoking" },
  { name: "Cristal Cigarettes", brand: "SNTI", category: "Tobacco", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "N/A - Stop smoking" },
  
  // Pharmacie & Health
  { name: "Panadol", brand: "GSK", category: "Pharmacy", country: "UK", isBoycotted: false, reason: "", tunisianAlternative: "Doliprane" },
  { name: "Doliprane", brand: "Sanofi", category: "Pharmacy", country: "France", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Aspirin Bayer", brand: "Bayer", category: "Pharmacy", country: "Germany", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Vitamines Pharmex", brand: "Pharmex", category: "Pharmacy", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" }
];

async function seed() {
  try {
    await initDb();
    
    // Clear existing data
    await query("TRUNCATE products RESTART IDENTITY CASCADE;");
    console.log("✅ Products table truncated");

    console.log(`📦 Loading ${sampleProducts.length} products into database...`);

    for (const p of sampleProducts) {
      await query(
        `INSERT INTO products (name, brand, category, country, "isBoycotted", reason, "tunisianAlternative", "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [p.name, p.brand, p.category, p.country, p.isBoycotted, p.reason, p.tunisianAlternative, new Date().toISOString()]
      );
    }

    console.log("✅ Seed complete. المنتجات تم إدخالها بنجاح.");
    console.log(`✅ ${sampleProducts.length} products added to database.`);
  } catch (e) {
    console.error("❌ Seed failed:", e.message);
    process.exit(1);
  } finally {
    await closePool();
  }
}

seed();
