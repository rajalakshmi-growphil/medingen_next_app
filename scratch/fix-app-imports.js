const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

const folderToFeatureMap = {
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
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(srcDir);

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Convert relative screens/ references in app/
  content = content.replace(/from (['"])\.\.\/\.\.\/\.\.\/screens\/([^\/'"]+)\/([^\/'"]+)(['"])/g, (match, q1, folder, comp, q2) => {
    const feat = folderToFeatureMap[folder] || 'home';
    return `from ${q1}@/features/${feat}/${folder}/${comp}${q2}`;
  });

  content = content.replace(/from (['"])\.\.\/\.\.\/screens\/([^\/'"]+)\/([^\/'"]+)(['"])/g, (match, q1, folder, comp, q2) => {
    const feat = folderToFeatureMap[folder] || 'home';
    return `from ${q1}@/features/${feat}/${folder}/${comp}${q2}`;
  });

  content = content.replace(/from (['"])\.\.\/screens\/([^\/'"]+)\/([^\/'"]+)(['"])/g, (match, q1, folder, comp, q2) => {
    const feat = folderToFeatureMap[folder] || 'home';
    return `from ${q1}@/features/${feat}/${folder}/${comp}${q2}`;
  });

  // 2. Convert @/features/FolderName/CompName -> @/features/feature/FolderName/CompName
  Object.entries(folderToFeatureMap).forEach(([folder, feat]) => {
    const r1 = new RegExp(`@/features/${folder}/`, 'g');
    content = content.replace(r1, `@/features/${feat}/${folder}/`);

    const r2 = new RegExp(`@/features/${folder}(['";])`, 'g');
    content = content.replace(r2, `@/features/${feat}/${folder}$1`);
  });

  // 3. Convert relative cross-folder imports in features/
  Object.entries(folderToFeatureMap).forEach(([folder, feat]) => {
    const r1 = new RegExp(`from (['"])\\.\\.\\/${folder}\\/`, 'g');
    content = content.replace(r1, `from $1@/features/${feat}/${folder}/`);

    const r2 = new RegExp(`from (['"])\\.\\.\\/${folder}(['"])`, 'g');
    content = content.replace(r2, `from $1@/features/${feat}/${folder}$2`);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated imports in ${path.relative(srcDir, filePath)}`);
  }
});

console.log('App imports updated.');
