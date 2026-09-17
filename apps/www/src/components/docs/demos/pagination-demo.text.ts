import { defineDemoText } from './demo-text';

export const paginationText = defineDemoText({
  'root': {
    en: 'Pagination',
    fa: 'صفحه‌بندی',
    ar: 'ترقيم الصفحات',
    tr: 'Sayfalama',
  },
  'basic.title': { en: 'Basic', fa: 'پایه', ar: 'أساسي', tr: 'Temel' },
  'basic.body': {
    en: '`count` is the number of pages; `page` is 1-based. Uncontrolled with `defaultPage`, or controlled with `page` plus `onPageChange`.',
    fa: '`count` تعداد صفحه‌هاست و `page` از یک شروع می‌شود. با `defaultPage` بدون کنترل، یا با `page` به‌همراه `onPageChange` کنترل‌شده.',
    ar: '`count` هو عدد الصفحات، و`page` يبدأ من واحد. غير متحكَّم به عبر `defaultPage`، أو متحكَّم به عبر `page` مع `onPageChange`.',
    tr: '`count` sayfa sayısıdır; `page` birden başlar. `defaultPage` ile denetimsiz ya da `page` artı `onPageChange` ile denetimli.',
  },
  'types.title': { en: 'Types', fa: 'انواع', ar: 'الأنواع', tr: 'Türler' },
  'types.body': {
    en: 'Basic is separate cells; Full Radius makes them pills; Group joins them into a single segmented control.',
    fa: 'basic سلول‌های جداست؛ full-radius آن‌ها را قرصی می‌کند؛ group آن‌ها را در یک کنترل بخش‌بندی‌شدهٔ یکپارچه به‌هم می‌چسباند.',
    ar: 'النوع basic خلايا منفصلة، وfull-radius يجعلها أقراصًا، وgroup يضمّها في عنصر مجزّأ واحد.',
    tr: 'basic ayrı hücrelerdir; full-radius onları hap yapar; group onları tek bir bölümlü denetimde birleştirir.',
  },
  'window.title': {
    en: 'The window',
    fa: 'پنجره',
    ar: 'النافذة',
    tr: 'Pencere',
  },
  'window.body': {
    en: '`siblingCount` is how many pages sit either side of the current one; `boundaryCount` is how many stay pinned at each end. `showEdges` adds first/last jumps outside the arrows.',
    fa: '`siblingCount` یعنی چند صفحه دو طرف صفحهٔ فعلی بنشیند؛ `boundaryCount` یعنی چندتا در هر سر سنجاق بماند. `showEdges` پرش به اول و آخر را بیرون از فلش‌ها اضافه می‌کند.',
    ar: '`siblingCount` هو عدد الصفحات على جانبي الصفحة الحالية، و`boundaryCount` هو عدد ما يبقى مثبّتًا في كل طرف. ويضيف `showEdges` قفزات البداية والنهاية خارج الأسهم.',
    tr: '`siblingCount`, geçerli sayfanın iki yanında kaç sayfa duracağıdır; `boundaryCount`, her uçta kaçının sabit kalacağı. `showEdges` okların dışına ilk/son atlamalarını ekler.',
  },
  'window.default': {
    en: 'siblingCount=1 (default)',
    fa: 'siblingCount=1 (پیش‌فرض)',
    ar: 'siblingCount=1 (الافتراضي)',
    tr: 'siblingCount=1 (varsayılan)',
  },
  'align.title': {
    en: 'Alignment and device mode',
    fa: 'تراز و حالت دستگاه',
    ar: 'المحاذاة ووضع الجهاز',
    tr: 'Hizalama ve cihaz kipi',
  },
  'align.body': {
    en: '`align` positions the row. The mobile device mode drops the cells for a pair of arrows and a “Page 3 of 16” summary — a sixteen-page trail does not fit on a phone.',
    fa: '`align` جای ردیف را تعیین می‌کند. حالت دستگاه موبایل سلول‌ها را کنار می‌گذارد و به‌جایش دو فلش و خلاصهٔ «صفحهٔ ۳ از ۱۶» می‌آورد — مسیر شانزده‌صفحه‌ای روی موبایل جا نمی‌شود.',
    ar: 'يحدّد `align` موضع الصف. ويُسقط وضع الهاتف الخلايا لصالح سهمين وملخّص «الصفحة ٣ من ١٦» — فمسار من ست عشرة صفحة لا يتّسع على الهاتف.',
    tr: '`align` satırı konumlandırır. Mobil cihaz kipi hücreleri bırakıp bir çift ok ve “16 sayfadan 3.” özetini koyar — on altı sayfalık bir iz telefona sığmaz.',
  },
  'align.sample': {
    en: 'align={value}',
    fa: 'align={value}',
    ar: 'align={value}',
    tr: 'align={value}',
  },
  'align.mobile': { en: 'mobile', fa: 'موبایل', ar: 'الهاتف', tr: 'mobil' },
  'advanced.title': {
    en: 'Advanced',
    fa: 'پیشرفته',
    ar: 'متقدّم',
    tr: 'Gelişmiş',
  },
  'advanced.body': {
    en: '`advanced` adds the summary before the trail and the rows-per-page control after it. Every visible string is a prop — a design system that owns its copy forces its translation stack on every consumer.',
    fa: '`advanced` خلاصه را پیش از مسیر و کنترل تعداد ردیف در صفحه را پس از آن اضافه می‌کند. هر رشتهٔ دیده‌شدنی یک پراپ است — سیستم طراحی‌ای که متنش را خودش نگه دارد، پشتهٔ ترجمه‌اش را به هر مصرف‌کننده تحمیل می‌کند.',
    ar: 'يضيف `advanced` الملخّص قبل المسار وعنصر عدد الصفوف بعده. وكل نص ظاهر هو خاصية — فنظام تصميم يملك نصوصه يفرض طبقة ترجمته على كل مستهلك.',
    tr: '`advanced` özeti izden önce, sayfa başına satır denetimini sonra ekler. Görünen her dize bir prop’tur — metnine sahip çıkan bir tasarım sistemi çeviri yığınını her tüketiciye dayatır.',
  },
  'advanced.summary': {
    en: 'Page {page} of {count}',
    fa: 'صفحهٔ {page} از {count}',
    ar: 'الصفحة {page} من {count}',
    tr: '{count} sayfadan {page}.',
  },
  'advanced.perPage': {
    en: '{size} / page',
    fa: '{size} در هر صفحه',
    ar: '{size} لكل صفحة',
    tr: 'sayfa başına {size}',
  },
  'advanced.perPageLabel': {
    en: 'Rows per page',
    fa: 'تعداد ردیف در هر صفحه',
    ar: 'الصفوف في كل صفحة',
    tr: 'Sayfa başına satır',
  },
  'disabled.title': {
    en: 'Disabled',
    fa: 'غیرفعال',
    ar: 'معطّل',
    tr: 'Devre dışı',
  },
  'disabled.body': {
    en: 'Greys out the whole control — a table that is reloading, for instance.',
    fa: 'کل کنترل را خاکستری می‌کند — مثلاً جدولی که در حال بارگذاری دوباره است.',
    ar: 'يجعل العنصر كله رماديًا — كجدول يعيد التحميل مثلًا.',
    tr: 'Tüm denetimi soluklaştırır — örneğin yeniden yüklenen bir tablo.',
  },
});
