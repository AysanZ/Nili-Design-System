import { defineDemoText } from './demo-text';

export const emptyStateText = defineDemoText({
  'basic.title': { en: 'Basic', fa: 'پایه', ar: 'أساسي', tr: 'Temel' },
  'basic.body': {
    en: 'Only `title` is required. The `illustration` slot sizes whatever SVG or image you hand it from the `size` axis, so pass the glyph itself rather than something that frames it — the artwork lives in Figma and is exported, not shipped by the component.',
    fa: 'فقط `title` الزامی است. اسلات `illustration` اندازه‌ی هر SVG یا تصویری را که بدهید از محور `size` می‌گیرد، پس خود آیکون را بدهید نه چیزی که قاب دورش می‌کشد — تصویرسازی در فیگما می‌ماند و اکسپورت می‌شود، نه اینکه کامپوننت آن را همراه ببرد.',
    ar: 'المطلوب هو `title` فقط. تأخذ فتحة `illustration` حجم أي SVG أو صورة تمرّرها من محور `size`، لذا مرِّر الأيقونة نفسها لا ما يؤطّرها — فالرسوم تبقى في فيجما وتُصدَّر، ولا يشحنها المكوّن.',
    tr: 'Yalnızca `title` zorunlu. `illustration` yuvası verdiğiniz SVG veya görselin boyutunu `size` ekseninden alır; bu yüzden onu çerçeveleyen bir şeyi değil, simgenin kendisini verin — çizimler Figma’da durur ve dışa aktarılır, bileşenle gelmez.',
  },
  'sizes.title': { en: 'Sizes', fa: 'اندازه‌ها', ar: 'الأحجام', tr: 'Boyutlar' },
  'sizes.body': {
    en: 'Three densities. `sm` for an empty cell or a narrow panel, `md` for a card, `lg` for a whole page.',
    fa: 'سه چگالی. `sm` برای یک سلول خالی یا پنل باریک، `md` برای کارت، `lg` برای یک صفحه‌ی کامل.',
    ar: 'ثلاث كثافات. `sm` لخلية فارغة أو لوحة ضيّقة، و`md` لبطاقة، و`lg` لصفحة كاملة.',
    tr: 'Üç yoğunluk. Boş bir hücre ya da dar panel için `sm`, kart için `md`, tüm sayfa için `lg`.',
  },
  'cases.title': {
    en: 'The three cases worth distinguishing',
    fa: 'سه حالتی که ارزش تفکیک دارند',
    ar: 'الحالات الثلاث التي تستحق التمييز',
    tr: 'Ayırmaya değer üç durum',
  },
  'cases.body': {
    en: 'Nothing created yet, nothing matched, and something went wrong are different situations, and the action differs each time. A “no results” state that offers “Create your first item” is confusing — the items exist, the filter is wrong.',
    fa: '«هنوز چیزی ساخته نشده»، «چیزی پیدا نشد» و «خطایی رخ داد» سه وضعیت متفاوت‌اند و کنش هرکدام فرق می‌کند. حالت «نتیجه‌ای نیست» که دکمه‌ی «اولین مورد را بسازید» می‌دهد گیج‌کننده است؛ موردها وجود دارند، فیلتر اشتباه است.',
    ar: '«لم يُنشأ شيء بعد» و«لا نتائج مطابقة» و«حدث خطأ» ثلاث حالات مختلفة، والإجراء يختلف في كلٍّ منها. حالة «لا نتائج» التي تعرض «أنشئ أول عنصر» مربكة — العناصر موجودة، والمرشّح هو الخطأ.',
    tr: '“Henüz bir şey oluşturulmadı”, “eşleşen bir şey yok” ve “bir şeyler ters gitti” farklı durumlardır ve her birinde eylem değişir. “Sonuç yok” durumunda “İlk öğeni oluştur” demek kafa karıştırır — öğeler var, yanlış olan filtredir.',
  },
  // The copy a real empty state would carry.
  'copy.noInvoices': {
    en: 'No invoices yet',
    fa: 'هنوز فاکتوری نیست',
    ar: 'لا فواتير بعد',
    tr: 'Henüz fatura yok',
  },
  'copy.noInvoicesBody': {
    en: 'When you send your first invoice, it will show up here.',
    fa: 'وقتی اولین فاکتورتان را بفرستید، همین‌جا نشان داده می‌شود.',
    ar: 'عند إرسال أول فاتورة لك ستظهر هنا.',
    tr: 'İlk faturanızı gönderdiğinizde burada görünecek.',
  },
  'copy.newInvoice': {
    en: 'New invoice',
    fa: 'فاکتور جدید',
    ar: 'فاتورة جديدة',
    tr: 'Yeni fatura',
  },
  'copy.noResults': {
    en: 'No results',
    fa: 'نتیجه‌ای نیست',
    ar: 'لا نتائج',
    tr: 'Sonuç yok',
  },
  'copy.noResultsBody': {
    en: 'Try a different search term.',
    fa: 'عبارت دیگری را جست‌وجو کنید.',
    ar: 'جرّب كلمة بحث أخرى.',
    tr: 'Başka bir arama terimi deneyin.',
  },
  'copy.noProjects': {
    en: 'No projects yet',
    fa: 'هنوز پروژه‌ای نیست',
    ar: 'لا مشاريع بعد',
    tr: 'Henüz proje yok',
  },
  'copy.noProjectsBody': {
    en: 'Create one to get started.',
    fa: 'برای شروع یکی بسازید.',
    ar: 'أنشئ واحدًا للبدء.',
    tr: 'Başlamak için bir tane oluşturun.',
  },
  'copy.newProject': {
    en: 'New project',
    fa: 'پروژه‌ی جدید',
    ar: 'مشروع جديد',
    tr: 'Yeni proje',
  },
  'copy.noMatches': {
    en: 'No matches for “roadmap”',
    fa: 'چیزی با «roadmap» پیدا نشد',
    ar: 'لا نتائج مطابقة لـ «roadmap»',
    tr: '“roadmap” için eşleşme yok',
  },
  'copy.noMatchesBody': {
    en: 'Check the spelling, or clear the filters.',
    fa: 'املا را بررسی کنید یا فیلترها را پاک کنید.',
    ar: 'تحقّق من الإملاء أو امسح المرشّحات.',
    tr: 'Yazımı denetleyin ya da filtreleri temizleyin.',
  },
  'copy.clearFilters': {
    en: 'Clear filters',
    fa: 'پاک‌کردن فیلترها',
    ar: 'مسح المرشّحات',
    tr: 'Filtreleri temizle',
  },
  'copy.loadFailed': {
    en: 'Could not load projects',
    fa: 'پروژه‌ها بارگذاری نشدند',
    ar: 'تعذّر تحميل المشاريع',
    tr: 'Projeler yüklenemedi',
  },
  'copy.loadFailedBody': {
    en: 'Check your connection and try again.',
    fa: 'اتصالتان را بررسی و دوباره تلاش کنید.',
    ar: 'تحقّق من اتصالك وحاول مجددًا.',
    tr: 'Bağlantınızı denetleyip yeniden deneyin.',
  },
  'copy.retry': {
    en: 'Retry',
    fa: 'تلاش دوباره',
    ar: 'إعادة المحاولة',
    tr: 'Yeniden dene',
  },
  'copy.support': {
    en: 'Contact support',
    fa: 'تماس با پشتیبانی',
    ar: 'تواصل مع الدعم',
    tr: 'Desteğe yazın',
  },
});
