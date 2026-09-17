import { defineDemoText } from './demo-text';

export const typographyText = defineDemoText({
  'band.title': {
    en: 'Inter Display · Title',
    fa: 'Inter Display · عنوان',
    ar: 'Inter Display · العناوين',
    tr: 'Inter Display · Başlık',
  },
  'band.label': {
    en: 'Inter · Label',
    fa: 'Inter · برچسب',
    ar: 'Inter · التسميات',
    tr: 'Inter · Etiket',
  },
  'band.paragraph': {
    en: 'Inter · Paragraph',
    fa: 'Inter · پاراگراف',
    ar: 'Inter · الفقرات',
    tr: 'Inter · Paragraf',
  },
  'band.subheading': {
    en: 'Inter · Subheading',
    fa: 'Inter · زیرعنوان',
    ar: 'Inter · العناوين الفرعية',
    tr: 'Inter · Alt başlık',
  },
  'band.body': {
    en: 'Inter · Body',
    fa: 'Inter · متن',
    ar: 'Inter · المتن',
    tr: 'Inter · Gövde',
  },
  'band.document': {
    en: 'Inter · Documentation',
    fa: 'Inter · مستندات',
    ar: 'Inter · التوثيق',
    tr: 'Inter · Belgeler',
  },
  'band.body.count': {
    en: '{n} variants. The element is chosen from the variant — h1 renders an <h1>, paragraph-* renders a <p> — so the document outline stays correct without asking.',
    fa: '{n} گونه. المان از روی خود گونه انتخاب می‌شود — h1 یک <h1> می‌سازد و paragraph-* یک <p> — پس ساختار سند بدون اینکه چیزی بپرسید درست می‌ماند.',
    ar: '{n} تنويعة. يُختار العنصر من التنويعة نفسها — فـh1 يرسم <h1> وparagraph-* يرسم <p> — فيبقى مخطّط المستند سليمًا دون سؤال.',
    tr: '{n} varyant. Öğe varyanttan seçilir — h1 bir <h1>, paragraph-* bir <p> üretir — böylece belge ana hattı sormadan doğru kalır.',
  },
  'sample.long': {
    en: 'The quick brown fox jumps',
    fa: 'روباه قهوه‌ای چابک می‌پرد',
    ar: 'الثعلب البنّي السريع يقفز',
    tr: 'Hızlı kahverengi tilki atlar',
  },
  'sample.short': {
    en: 'The quick brown fox',
    fa: 'روباه قهوه‌ای چابک',
    ar: 'الثعلب البنّي السريع',
    tr: 'Hızlı kahverengi tilki',
  },
  'spec.variant': { en: 'variant', fa: 'گونه', ar: 'التنويعة', tr: 'varyant' },
  'spec.size': { en: 'size', fa: 'اندازه', ar: 'الحجم', tr: 'boyut' },
  'spec.weight': { en: 'weight', fa: 'وزن', ar: 'الوزن', tr: 'ağırlık' },
  'spec.tracking': {
    en: 'tracking',
    fa: 'فاصله‌ی حروف',
    ar: 'تباعد الأحرف',
    tr: 'harf aralığı',
  },
  'as.title': {
    en: 'Changing the element',
    fa: 'تغییر المان',
    ar: 'تغيير العنصر',
    tr: 'Öğeyi değiştirmek',
  },
  'as.body': {
    en: 'Use `as` when the visual weight and the semantics disagree — a section heading that must not be an <h1>, or a label rendered on a <span>.',
    fa: 'وقتی وزن بصری و معنای سمانتیک با هم نمی‌خوانند از `as` استفاده کنید — عنوان بخشی که نباید <h1> باشد، یا برچسبی که روی <span> رندر می‌شود.',
    ar: 'استخدم `as` حين يختلف الوزن البصري عن المعنى الدلالي — عنوان قسم يجب ألا يكون <h1>، أو تسمية تُرسم على <span>.',
    tr: 'Görsel ağırlıkla anlam ayrıştığında `as` kullanın — <h1> olmaması gereken bir bölüm başlığı ya da <span> üzerinde çizilen bir etiket.',
  },
  'as.section': {
    en: 'Section title',
    fa: 'عنوان بخش',
    ar: 'عنوان القسم',
    tr: 'Bölüm başlığı',
  },
  'as.inline': {
    en: 'Inline label',
    fa: 'برچسب درون‌خطی',
    ar: 'تسمية داخلية',
    tr: 'Satır içi etiket',
  },
  'as.link': {
    en: 'Read the guidelines',
    fa: 'راهنما را بخوانید',
    ar: 'اقرأ الإرشادات',
    tr: 'Yönergeleri okuyun',
  },
});
