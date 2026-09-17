import { defineDemoText } from './demo-text';

export const breadcrumbText = defineDemoText({
  'basic.title': { en: 'Basic', fa: 'پایه', ar: 'أساسي', tr: 'Temel' },
  'basic.body': {
    en: 'A nav landmark holding a trail of links. Mark the last crumb `current`: it renders as text rather than a link and carries `aria-current="page"`.',
    fa: 'یک لندمارک nav که رشته‌ای از لینک‌ها را نگه می‌دارد. آخرین دانه را `current` کنید: به‌جای لینک به‌صورت متن رندر می‌شود و `aria-current="page"` می‌گیرد.',
    ar: 'معلم تنقّل يحمل سلسلة روابط. علّم آخر عنصر بـ`current`: فيُرسم نصًّا لا رابطًا ويحمل `aria-current="page"`.',
    tr: 'Bir bağlantı izini tutan nav işareti. Son kırıntıyı `current` işaretleyin: bağlantı yerine metin olarak çizilir ve `aria-current="page"` taşır.',
  },
  'dividers.title': {
    en: 'Dividers',
    fa: 'جداکننده‌ها',
    ar: 'الفواصل',
    tr: 'Ayraçlar',
  },
  'dividers.body': {
    en: 'Three built-in separators, or replace them entirely with `separator`. The divider is decorative and hidden from assistive tech — the list structure carries the nesting.',
    fa: 'سه جداکننده‌ی آماده، یا با `separator` کاملاً جایگزینشان کنید. جداکننده تزئینی است و از فناوری کمکی پنهان می‌ماند — ساختار فهرست است که تودرتویی را می‌رساند.',
    ar: 'ثلاثة فواصل جاهزة، أو استبدلها كليًا بـ`separator`. الفاصل زخرفي ومخفي عن التقنيات المساعدة — فبنية القائمة هي التي تحمل التداخل.',
    tr: 'Üç hazır ayraç ya da `separator` ile tamamen değiştirin. Ayraç süstür ve yardımcı teknolojiden gizlenir — iç içeliği liste yapısı taşır.',
  },
  'dividers.custom': {
    en: 'custom separator',
    fa: 'جداکننده‌ی سفارشی',
    ar: 'فاصل مخصّص',
    tr: 'özel ayraç',
  },
  'icons.title': { en: 'Icons', fa: 'آیکون‌ها', ar: 'الأيقونات', tr: 'Simgeler' },
  'icons.body': {
    en: '`icon` adds a leading glyph. For an icon-only crumb — a home button at the head of the trail — pass the icon as children and give the link an `aria-label`.',
    fa: '`icon` یک نشان پیشرو اضافه می‌کند. برای دانه‌ی فقط‌آیکون — دکمه‌ی خانه در ابتدای مسیر — آیکون را به‌عنوان فرزند بدهید و به لینک یک `aria-label`.',
    ar: 'يضيف `icon` رمزًا متقدّمًا. ولعنصر بأيقونة فقط — زر الصفحة الرئيسية في بداية المسار — مرِّر الأيقونة كابن وامنح الرابط `aria-label`.',
    tr: '`icon` önde bir simge ekler. Yalnızca simgeli bir kırıntı için — izin başındaki ana sayfa düğmesi — simgeyi çocuk olarak geçin ve bağlantıya bir `aria-label` verin.',
  },
  'collapse.title': {
    en: 'Collapsing long trails',
    fa: 'جمع‌کردن مسیرهای بلند',
    ar: 'طيّ المسارات الطويلة',
    tr: 'Uzun izleri katlamak',
  },
  'collapse.body': {
    en: '`maxItems` folds the middle into an ellipsis, keeping the first crumb and the last `itemsAfterCollapse`. A five-level path on a phone either wraps or scrolls, and neither is good.',
    fa: '`maxItems` وسط مسیر را در یک سه‌نقطه جمع می‌کند و اولین دانه و `itemsAfterCollapse` تای آخر را نگه می‌دارد. مسیر پنج‌سطحی روی موبایل یا می‌شکند یا اسکرول می‌خورد، و هیچ‌کدام خوب نیست.',
    ar: 'يطوي `maxItems` الوسط في نقاط، مبقيًا العنصر الأول وآخر `itemsAfterCollapse`. فمسار من خمسة مستويات على الهاتف إمّا يلتف أو ينزلق، وكلاهما سيّئ.',
    tr: '`maxItems` ortayı üç noktaya katlar; ilk kırıntıyı ve son `itemsAfterCollapse` kadarını tutar. Telefonda beş düzeyli bir yol ya satır kırar ya kaydırılır, ikisi de iyi değildir.',
  },
  'collapse.full': {
    en: 'full trail',
    fa: 'مسیر کامل',
    ar: 'المسار الكامل',
    tr: 'tam iz',
  },
  'router.title': {
    en: 'Router links',
    fa: 'لینک‌های روتر',
    ar: 'روابط الموجّه',
    tr: 'Yönlendirici bağlantıları',
  },
  'router.body': {
    en: '`asChild` renders your element instead of the `<a>`, so a Next.js or React Router link keeps client-side navigation and still gets the crumb styling and ARIA wiring.',
    fa: '`asChild` المان خودتان را به‌جای `<a>` رندر می‌کند، پس لینک Next.js یا React Router ناوبری سمت‌کلاینت را نگه می‌دارد و در عین حال استایل و سیم‌کشی ARIA دانه را هم می‌گیرد.',
    ar: 'يرسم `asChild` عنصرك بدل `<a>`، فيحتفظ رابط Next.js أو React Router بالتنقّل من جهة العميل مع الحصول على تنسيق العنصر وتوصيلات ARIA.',
    tr: '`asChild` `<a>` yerine sizin öğenizi çizer; böylece bir Next.js ya da React Router bağlantısı istemci tarafı gezinmeyi korur ve yine de kırıntı stilini ve ARIA bağlantılarını alır.',
  },
  'nav.label': {
    en: 'Breadcrumb',
    fa: 'مسیر راهنما',
    ar: 'مسار التنقّل',
    tr: 'İçerik haritası',
  },
  'crumb.home': { en: 'Home', fa: 'خانه', ar: 'الرئيسية', tr: 'Ana sayfa' },
  'crumb.projects': {
    en: 'Projects',
    fa: 'پروژه‌ها',
    ar: 'المشاريع',
    tr: 'Projeler',
  },
  'crumb.components': {
    en: 'Components',
    fa: 'کامپوننت‌ها',
    ar: 'المكوّنات',
    tr: 'Bileşenler',
  },
});
