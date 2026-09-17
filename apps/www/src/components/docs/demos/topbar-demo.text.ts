import { defineDemoText } from './demo-text';

export const topbarText = defineDemoText({
  'bar.title': { en: 'The bar', fa: 'نوار', ar: 'الشريط', tr: 'Çubuk' },
  'bar.body': {
    en: 'A logo slot, a row of items, and an actions slot at the end. `label` names the landmark — a page with a Topbar and a Sidebar has two navs, and “navigation, navigation” is not a landmark list.',
    fa: 'یک اسلات لوگو، یک ردیف آیتم، و یک اسلات کنش در انتها. `label` لندمارک را نام‌گذاری می‌کند — صفحه‌ای که هم Topbar دارد هم Sidebar دو nav دارد، و «ناوبری، ناوبری» فهرست لندمارک نیست.',
    ar: 'فتحة للشعار وصفّ من العناصر وفتحة إجراءات في النهاية. و`label` يسمّي المعلم — فصفحة فيها Topbar وSidebar تحوي معلمَي تنقّل، و«تنقّل، تنقّل» ليست قائمة معالم.',
    tr: 'Bir logo yuvası, bir öğe satırı ve sonda bir eylem yuvası. `label` işareti adlandırır — Topbar’ı ve Sidebar’ı olan bir sayfada iki nav vardır ve “gezinme, gezinme” bir işaret listesi değildir.',
  },
  'nav.main': {
    en: 'Main navigation',
    fa: 'ناوبری اصلی',
    ar: 'التنقّل الرئيسي',
    tr: 'Ana gezinme',
  },
  'nav.home': { en: 'Home', fa: 'خانه', ar: 'الرئيسية', tr: 'Ana sayfa' },
  'nav.projects': {
    en: 'Projects',
    fa: 'پروژه‌ها',
    ar: 'المشاريع',
    tr: 'Projeler',
  },
  'nav.reports': {
    en: 'Reports',
    fa: 'گزارش‌ها',
    ar: 'التقارير',
    tr: 'Raporlar',
  },
  'states.title': {
    en: 'Item states',
    fa: 'حالت‌های آیتم',
    ar: 'حالات العنصر',
    tr: 'Öğe durumları',
  },
  'states.body': {
    en: '`active` marks the current page. `menu` adds the chevron for an item that opens a dropdown rather than navigating. `href` makes it a link; without one it renders as a button.',
    fa: '`active` صفحهٔ فعلی را علامت می‌زند. `menu` برای آیتمی که به‌جای ناوبری یک دراپ‌داون باز می‌کند شورون اضافه می‌کند. `href` آن را لینک می‌کند؛ بدون آن به‌صورت دکمه رندر می‌شود.',
    ar: 'يعلّم `active` الصفحة الحالية. ويضيف `menu` الزاوية لعنصر يفتح قائمة منسدلة بدل التنقّل. ويجعله `href` رابطًا، وبدونه يُرسم زرًّا.',
    tr: '`active` geçerli sayfayı imler. `menu`, gezinmek yerine bir açılır menü açan öğeye şevron ekler. `href` onu bağlantı yapar; olmadığında düğme olarak çizilir.',
  },
  'states.label': {
    en: 'Item states',
    fa: 'حالت‌های آیتم',
    ar: 'حالات العنصر',
    tr: 'Öğe durumları',
  },
  'states.workspace': {
    en: 'Workspace',
    fa: 'فضای کاری',
    ar: 'مساحة العمل',
    tr: 'Çalışma alanı',
  },
  'states.billing': {
    en: 'Billing',
    fa: 'صورت‌حساب',
    ar: 'الفوترة',
    tr: 'Faturalama',
  },
  'actions.title': {
    en: 'The actions slot',
    fa: 'اسلات کنش‌ها',
    ar: 'فتحة الإجراءات',
    tr: 'Eylem yuvası',
  },
  'actions.body': {
    en: 'Anything that belongs at the end of the bar — search, notifications, a primary action, the account menu. It is a free slot rather than an enum, for the reason every other trailing slot in this system is.',
    fa: 'هرچه که به انتهای نوار تعلق دارد — جست‌وجو، اعلان‌ها، یک کنش اصلی، منوی حساب. به همان دلیلی که هر اسلات انتهایی دیگر در این سیستم آزاد است، این هم enum نیست.',
    ar: 'كل ما ينتمي إلى نهاية الشريط — البحث والإشعارات وإجراء رئيسي وقائمة الحساب. وهي فتحة حرّة لا قائمة ثابتة، للسبب نفسه الذي جعل كل فتحة خلفية أخرى في هذا النظام كذلك.',
    tr: 'Çubuğun sonuna ait olan her şey — arama, bildirimler, birincil bir eylem, hesap menüsü. Bu sistemdeki diğer her sondaki yuvanın nedeniyle, bir enum değil serbest bir yuvadır.',
  },
  'actions.label': {
    en: 'Navigation with actions',
    fa: 'ناوبری همراه با کنش‌ها',
    ar: 'تنقّل مع إجراءات',
    tr: 'Eylemli gezinme',
  },
  'actions.group': {
    en: 'search · notifications · action · account',
    fa: 'جست‌وجو · اعلان‌ها · کنش · حساب',
    ar: 'بحث · إشعارات · إجراء · حساب',
    tr: 'arama · bildirimler · eylem · hesap',
  },
  'actions.search': { en: 'Search', fa: 'جست‌وجو', ar: 'بحث', tr: 'Ara' },
  'actions.unread': {
    en: 'Notifications, 3 unread',
    fa: 'اعلان‌ها، ۳ خوانده‌نشده',
    ar: 'الإشعارات، ٣ غير مقروءة',
    tr: 'Bildirimler, 3 okunmamış',
  },
  'actions.newProject': {
    en: 'New project',
    fa: 'پروژهٔ جدید',
    ar: 'مشروع جديد',
    tr: 'Yeni proje',
  },
});
