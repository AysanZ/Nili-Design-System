import { defineDemoText } from './demo-text';

export const badgeText = defineDemoText({
  'appearances.title': {
    en: 'Appearances',
    fa: 'ظاهرها',
    ar: 'المظاهر',
    tr: 'Görünümler',
  },
  'appearances.body': {
    en: 'Four treatments. Named `appearance`, not `style` — `style` is React’s own prop, and taking it would make an inline style impossible.',
    fa: 'چهار پرداخت. نامش `appearance` است نه `style` — چون `style` پراپ خود ری‌اکت است و گرفتنش استایل اینلاین را غیرممکن می‌کرد.',
    ar: 'أربع معالجات. اسمها `appearance` لا `style` — فـ`style` خاصية React نفسها، وأخذها يجعل النمط المضمّن مستحيلًا.',
    tr: 'Dört işleyiş. Adı `style` değil `appearance` — `style` React’in kendi prop’u ve onu almak satır içi stili olanaksız kılardı.',
  },
  'colors.title': { en: 'Colors', fa: 'رنگ‌ها', ar: 'الألوان', tr: 'Renkler' },
  'colors.body': {
    en: 'Ten colours, free to combine with any appearance. The colour is decoration — put the meaning in the label.',
    fa: 'ده رنگ که با هر ظاهری ترکیب می‌شوند. رنگ تزئین است؛ معنا را در متن برچسب بگذارید.',
    ar: 'عشرة ألوان تُدمج بحرّية مع أي مظهر. اللون زينة — ضع المعنى في النص.',
    tr: 'On renk, her görünümle serbestçe birleşir. Renk süstür — anlamı etikete koyun.',
  },
  'sizes.title': { en: 'Sizes', fa: 'اندازه‌ها', ar: 'الأحجام', tr: 'Boyutlar' },
  'sizes.body': {
    en: 'Medium (20px) and Small (16px).',
    fa: 'medium (۲۰ پیکسل) و small (۱۶ پیکسل).',
    ar: 'medium (‏20 بكسل) وsmall (‏16 بكسل).',
    tr: 'medium (20px) ve small (16px).',
  },
  'content.title': {
    en: 'Dot, icons and numbers',
    fa: 'نقطه، آیکون و عدد',
    ar: 'النقطة والأيقونات والأرقام',
    tr: 'Nokta, simgeler ve sayılar',
  },
  'content.body': {
    en: '`dot` draws a leading dot; `startIcon` and `endIcon` take any node. A bare number is just children — there is no separate count prop.',
    fa: '`dot` یک نقطه‌ی پیشرو می‌کشد؛ `startIcon` و `endIcon` هر نودی را می‌پذیرند. عدد خالی هم فقط children است — پراپ جداگانه‌ای برای شمارش وجود ندارد.',
    ar: '`dot` يرسم نقطة في المقدّمة؛ ويقبل `startIcon` و`endIcon` أي عنصر. والرقم المجرّد هو children فقط — لا توجد خاصية منفصلة للعدّ.',
    tr: '`dot` başa bir nokta koyar; `startIcon` ve `endIcon` her düğümü alır. Çıplak bir sayı da yalnızca children’dır — ayrı bir sayaç prop’u yoktur.',
  },
  'status.title': {
    en: 'Status Badge',
    fa: 'بَج وضعیت',
    ar: 'شارة الحالة',
    tr: 'Durum rozeti',
  },
  'status.body': {
    en: 'A separate component, because the colour follows the status: a “Completed” badge cannot be rendered in red by accident. Stroke or Light, with an icon or a dot.',
    fa: 'کامپوننتی جداگانه، چون رنگ از وضعیت می‌آید: بَج «Completed» به‌طور تصادفی قرمز نمی‌شود. stroke یا light، با آیکون یا نقطه.',
    ar: 'مكوّن منفصل، لأن اللون يتبع الحالة: لا يمكن أن تُعرض شارة «Completed» بالأحمر بالخطأ. stroke أو light، مع أيقونة أو نقطة.',
    tr: 'Ayrı bir bileşen, çünkü renk durumdan gelir: “Completed” rozeti yanlışlıkla kırmızı çizilemez. stroke ya da light, simgeyle veya noktayla.',
  },
  'status.dot': {
    en: 'with dot',
    fa: 'با نقطه',
    ar: 'مع نقطة',
    tr: 'noktalı',
  },
  // Sample copy in the previews. Variant *values* ("filled", "blue",
  // "completed") stay Latin: they are the identifiers you type.
  'copy.active': { en: 'Active', fa: 'فعال', ar: 'نشط', tr: 'Etkin' },
  'copy.new': { en: 'New', fa: 'جدید', ar: 'جديد', tr: 'Yeni' },
  'copy.disabled': {
    en: 'Disabled',
    fa: 'غیرفعال',
    ar: 'معطّل',
    tr: 'Devre dışı',
  },
});
