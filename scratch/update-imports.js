const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

const featureMapping = {
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
  
  SearchViewMedicine: 'products',
  SaltPage: 'products',
  GenericMedicineOnline: 'products',
  CompareView: 'products',
  IphonePro: 'products',
  'iphone-pro': 'products',

  Category: 'categories',

  LandingPage: 'cart',
  PharmacistVerification: 'cart',
  PaymentPage: 'cart',
  OrderConfirmed: 'cart',

  UploadPrescription: 'checkout',
  SelectPrescription: 'checkout',
  CapturePrescription: 'checkout',

  Orders: 'orders',
  OrderDetails: 'orders',
  OrdersTrack: 'orders',
  OrderPayment: 'orders',
  OrderPlacedSuccess: 'orders',
  OrderProgressConfirmation: 'orders',

  ProfileView: 'profile',
  PersonalInfo: 'profile',
  ChangePassword: 'profile',
  SavedAddress: 'profile',
  AddressNew: 'profile',

  Reminder: 'reminders',

  Notifications: 'notifications',

  SearchBox: 'search',
  SearchResults: 'search',

  Blogs: 'blogs',
  Blog: 'blogs',

  Offers: 'offers',
  OffersView: 'offers',
  Rewards: 'offers',
  RewardsView: 'offers',
  RewardsViewMig: 'offers',

  Dashboard: 'home',
  PolicyPages: 'home',
  PrivacyPolicy: 'home',
};

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.css') || file.endsWith('.js')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(srcDir);

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace @/screens/FolderName/FileName with @/features/feature/FolderName/FileName
  // or @/screens/FolderName with @/features/feature/FolderName
  Object.entries(featureMapping).forEach(([folder, feature]) => {
    // Exact folder match in import
    const regex1 = new RegExp(`@/screens/${folder}/`, 'g');
    content = content.replace(regex1, `@/features/${feature}/${folder}/`);

    const regex2 = new RegExp(`@/screens/${folder}(['";])`, 'g');
    content = content.replace(regex2, `@/features/${feature}/${folder}$1`);
  });

  // Any remaining generic @/screens/
  content = content.replace(/@\/screens\//g, '@/features/');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated imports in ${path.relative(srcDir, filePath)}`);
  }
});

// Remove empty screens dir if exists
const screensDir = path.join(srcDir, 'screens');
if (fs.existsSync(screensDir)) {
  fs.rmSync(screensDir, { recursive: true, force: true });
  console.log('Removed empty src/screens directory.');
}
