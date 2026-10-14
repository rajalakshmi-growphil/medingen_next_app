const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const screensDir = path.join(srcDir, 'screens');
const featuresDir = path.join(srcDir, 'features');

const featureMapping = {
  // auth
  Login1: 'auth',
  Login2: 'auth',
  Login3: 'auth',
  ExistingUser: 'auth',
  EnterPassword: 'auth',
  CreatePassword: 'auth',
  CreateProfile: 'auth',
  CreateSuccess: 'auth',
  Splash1: 'auth',
  Splash2: 'auth',
  Splash3: 'auth',
  Splash4: 'auth',
  
  // products
  SearchViewMedicine: 'products',
  SaltPage: 'products',
  GenericMedicineOnline: 'products',
  CompareView: 'products',
  IphonePro: 'products',
  'iphone-pro': 'products',

  // categories
  Category: 'categories',

  // cart
  LandingPage: 'cart',
  PharmacistVerification: 'cart',
  PaymentPage: 'cart',
  OrderConfirmed: 'cart',

  // checkout
  UploadPrescription: 'checkout',
  SelectPrescription: 'checkout',
  CapturePrescription: 'checkout',

  // orders
  Orders: 'orders',
  OrderDetails: 'orders',
  OrdersTrack: 'orders',
  OrderPayment: 'orders',
  OrderPlacedSuccess: 'orders',
  OrderProgressConfirmation: 'orders',

  // profile
  ProfileView: 'profile',
  PersonalInfo: 'profile',
  ChangePassword: 'profile',
  SavedAddress: 'profile',
  AddressNew: 'profile',

  // reminders
  Reminder: 'reminders',

  // notifications
  Notifications: 'notifications',

  // search
  SearchBox: 'search',
  SearchResults: 'search',

  // blogs
  Blogs: 'blogs',
  Blog: 'blogs',

  // offers
  Offers: 'offers',
  OffersView: 'offers',
  Rewards: 'offers',
  RewardsView: 'offers',
  RewardsViewMig: 'offers',

  // home / static
  Dashboard: 'home',
  PolicyPages: 'home',
  PrivacyPolicy: 'home',
};

// 1. Move folders from screens to features
Object.entries(featureMapping).forEach(([folderName, feature]) => {
  const oldPath = path.join(screensDir, folderName);
  const targetDir = path.join(featuresDir, feature, folderName);

  if (fs.existsSync(oldPath)) {
    fs.mkdirSync(path.join(featuresDir, feature), { recursive: true });
    fs.renameSync(oldPath, targetDir);
    console.log(`Moved ${folderName} -> features/${feature}/${folderName}`);
  }
});

// 2. Create index.ts files for each feature
const features = [...new Set(Object.values(featureMapping))];
features.forEach(feature => {
  const fDir = path.join(featuresDir, feature);
  if (fs.existsSync(fDir)) {
    const subdirs = fs.readdirSync(fDir).filter(f => fs.statSync(path.join(fDir, f)).isDirectory());
    let exportStatements = '';
    subdirs.forEach(subdir => {
      exportStatements += `export * from './${subdir}';\n`;
    });
    fs.writeFileSync(path.join(fDir, 'index.ts'), exportStatements, 'utf8');
  }
});

console.log('Migration to features completed successfully.');
