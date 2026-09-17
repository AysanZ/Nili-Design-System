import { defineDemoText } from './demo-text';

export const placeholderLogoText = defineDemoText({
  'set.title': { en: 'The set', fa: 'مجموعه', ar: 'المجموعة', tr: 'Küme' },
  'set.body': {
    en: 'Nine fictional companies, each with a name, industry and location in `PLACEHOLDER_COMPANIES` — enough to fill a table without inventing a real brand you do not have the right to draw.',
    fa: 'نُه شرکت خیالی، هرکدام با نام، صنعت و موقعیت در `PLACEHOLDER_COMPANIES` — به‌اندازه‌ی کافی برای پرکردن یک جدول، بدون آنکه برند واقعی‌ای را بکشید که حق ترسیمش را ندارید.',
    ar: 'تسع شركات متخيّلة، لكلٍّ اسم وقطاع وموقع في `PLACEHOLDER_COMPANIES` — ما يكفي لملء جدول دون اختلاق علامة تجارية حقيقية لا تملك حق رسمها.',
    tr: '`PLACEHOLDER_COMPANIES` içinde her biri ad, sektör ve konum taşıyan dokuz kurgusal şirket — çizme hakkınız olmayan gerçek bir markayı uydurmadan bir tabloyu doldurmaya yeter.',
  },
  'sizes.title': { en: 'Sizes', fa: 'اندازه‌ها', ar: 'الأحجام', tr: 'Boyutlar' },
  'sizes.body': {
    en: 'Six sizes, matching the Avatar scale so a row of logos and a row of avatars line up.',
    fa: 'شش اندازه، هم‌مقیاس با Avatar تا یک ردیف لوگو و یک ردیف آواتار با هم تراز شوند.',
    ar: 'ستة أحجام مطابقة لمقياس Avatar كي يتحاذى صفّ الشعارات مع صفّ الصور الرمزية.',
    tr: 'Avatar ölçeğiyle eşleşen altı boyut — böylece bir logo satırıyla bir avatar satırı hizalanır.',
  },
  'variants.title': {
    en: 'Variants',
    fa: 'گونه‌ها',
    ar: 'التنويعات',
    tr: 'Varyantlar',
  },
  'variants.body': {
    en: 'Original keeps the brand colour; black and white are the monochrome marks — for a dark strip, a print sheet, or anywhere the colour would fight the surface.',
    fa: 'original رنگ برند را نگه می‌دارد؛ black و white نشان‌های تک‌رنگ‌اند — برای یک نوار تیره، یک برگ چاپی، یا هرجا که رنگ با پس‌زمینه بجنگد.',
    ar: 'يحتفظ original بلون العلامة؛ أما black وwhite فهما النسختان أحاديتا اللون — لشريط داكن أو ورقة طباعة أو أي سطح يتنازع مع اللون.',
    tr: 'original marka rengini korur; black ve white tek renkli işaretlerdir — koyu bir şerit, bir baskı sayfası ya da rengin yüzeyle çatıştığı her yer için.',
  },
  'variants.onDark': {
    en: 'white (on a dark surface)',
    fa: 'white (روی سطح تیره)',
    ar: 'white (على سطح داكن)',
    tr: 'white (koyu bir yüzeyde)',
  },
  'empty.title': {
    en: 'The empty tile',
    fa: 'کاشی خالی',
    ar: 'البلاطة الفارغة',
    tr: 'Boş karo',
  },
  'empty.body': {
    en: 'Omit `company` for the neutral disc — what you draw when a record genuinely has no logo, so a list of companies stays a grid of discs instead of collapsing where the data is missing.',
    fa: 'برای دایره‌ی خنثی `company` را ندهید — همان چیزی که وقتی رکوردی واقعاً لوگو ندارد می‌کشید، تا فهرست شرکت‌ها همچنان شبکه‌ای از دایره‌ها بماند و جایی که داده نیست فرو نریزد.',
    ar: 'احذف `company` للحصول على القرص المحايد — وهو ما ترسمه حين لا يملك السجل شعارًا فعلًا، فتبقى قائمة الشركات شبكة أقراص بدل أن تنهار حيث تغيب البيانات.',
    tr: 'Nötr disk için `company` vermeyin — bir kaydın gerçekten logosu yokken çizdiğiniz şey budur; böylece şirket listesi, verinin eksik olduğu yerde çökmek yerine bir disk ızgarası olarak kalır.',
  },
  'empty.label': {
    en: 'No logo',
    fa: 'بدون لوگو',
    ar: 'بلا شعار',
    tr: 'Logo yok',
  },
});
