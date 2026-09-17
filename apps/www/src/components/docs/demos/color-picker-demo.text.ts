import { defineDemoText } from './demo-text';

export const colorPickerText = defineDemoText({
  'dot.title': {
    en: 'Color Dot',
    fa: 'نقطهٔ رنگ',
    ar: 'نقطة اللون',
    tr: 'Renk noktası',
  },
  'dot.body': {
    en: 'A swatch button. Ten palette colours, or any CSS colour through `value`. `aria-label` is required — a coloured circle has no accessible name of its own.',
    fa: 'یک دکمهٔ نمونه‌رنگ. ده رنگ پالت، یا هر رنگ CSS از طریق `value`. `aria-label` الزامی است — یک دایرهٔ رنگی نام دسترس‌پذیری از خودش ندارد.',
    ar: 'زر عيّنة لونية. عشرة ألوان من اللوحة، أو أي لون CSS عبر `value`. و`aria-label` مطلوبة — فالدائرة الملوّنة بلا اسم وصفي خاص بها.',
    tr: 'Bir örnek düğmesi. On palet rengi ya da `value` üzerinden herhangi bir CSS rengi. `aria-label` zorunludur — renkli bir dairenin kendine ait erişilebilir adı yoktur.',
  },
  'dot.palette': {
    en: 'palette (click one)',
    fa: 'پالت (یکی را بزنید)',
    ar: 'اللوحة (انقر واحدًا)',
    tr: 'palet (birine tıklayın)',
  },
  'dot.arbitrary': {
    en: 'arbitrary values',
    fa: 'مقدارهای دلخواه',
    ar: 'قيم اعتباطية',
    tr: 'serbest değerler',
  },
  'picker.title': {
    en: 'Color Picker',
    fa: 'انتخابگر رنگ',
    ar: 'منتقي الألوان',
    tr: 'Renk seçici',
  },
  'picker.body': {
    en: 'Spectrum, hue track and a hex field. Uncontrolled with `defaultValue`, or controlled with `value` plus `onChange` — which fires with a hex string, including the alpha pair when opacity is on.',
    fa: 'طیف، ریل فام و یک فیلد هگز. با `defaultValue` بدون کنترل، یا با `value` به‌همراه `onChange` کنترل‌شده — که با یک رشتهٔ هگز صدا زده می‌شود، و وقتی کدری روشن است جفت آلفا را هم دارد.',
    ar: 'طيف ومسار تدرّج وحقل ست عشري. غير متحكَّم به عبر `defaultValue`، أو متحكَّم به عبر `value` مع `onChange` — الذي يُطلق بسلسلة ست عشرية تشمل زوج الشفافية حين تكون العتامة مفعّلة.',
    tr: 'Tayf, ton rayı ve bir onaltılık alan. `defaultValue` ile denetimsiz ya da `value` artı `onChange` ile denetimli — bu, saydamsızlık açıkken alfa çiftini de içeren bir onaltılık dizeyle tetiklenir.',
  },
  'opacity.title': {
    en: 'Opacity and swatches',
    fa: 'کدری و نمونه‌رنگ‌ها',
    ar: 'العتامة والعيّنات',
    tr: 'Saydamsızlık ve örnekler',
  },
  'opacity.body': {
    en: '`withOpacity` adds the alpha track and switches the hex field to eight digits. `swatches` is the row of recent or brand colours under the controls.',
    fa: '`withOpacity` ریل آلفا را اضافه می‌کند و فیلد هگز را به هشت رقم می‌برد. `swatches` همان ردیف رنگ‌های اخیر یا برند زیر کنترل‌هاست.',
    ar: 'يضيف `withOpacity` مسار الشفافية ويحوّل الحقل الست عشري إلى ثمانية أرقام. و`swatches` هو صفّ الألوان الأخيرة أو ألوان العلامة تحت عناصر التحكّم.',
    tr: '`withOpacity` alfa rayını ekler ve onaltılık alanı sekiz haneye geçirir. `swatches`, denetimlerin altındaki son kullanılan ya da marka renkleri satırıdır.',
  },
  'opacity.with': {
    en: 'with opacity',
    fa: 'با کدری',
    ar: 'مع العتامة',
    tr: 'saydamsızlıkla',
  },
  'opacity.swatches': {
    en: 'with swatches',
    fa: 'با نمونه‌رنگ‌ها',
    ar: 'مع العيّنات',
    tr: 'örneklerle',
  },
  'footer.title': {
    en: 'Footer and labels',
    fa: 'پابرگ و برچسب‌ها',
    ar: 'التذييل والتسميات',
    tr: 'Alt bilgi ve etiketler',
  },
  'footer.body': {
    en: '`footer` sits under the hex field — a confirm button, usually, when the picker lives in a popover. Every visible string is a prop, so the component ships no translation stack of its own.',
    fa: '`footer` زیر فیلد هگز می‌نشیند — معمولاً یک دکمهٔ تأیید، وقتی انتخابگر داخل پاپ‌اور است. هر رشتهٔ دیده‌شدنی یک پراپ است، پس کامپوننت پشتهٔ ترجمهٔ خودش را همراه نمی‌برد.',
    ar: 'يجلس `footer` تحت الحقل الست عشري — زر تأكيد عادةً حين يعيش المنتقي داخل نافذة منبثقة. وكل نص ظاهر هو خاصية، فلا يشحن المكوّن طبقة ترجمة خاصة به.',
    tr: '`footer` onaltılık alanın altında durur — seçici bir açılır katmandaysa genelde bir onay düğmesi. Görünen her dize bir prop’tur; bileşen kendi çeviri yığınını taşımaz.',
  },
  'labels.spectrum': {
    en: 'Saturation and brightness',
    fa: 'اشباع و روشنایی',
    ar: 'التشبّع والسطوع',
    tr: 'Doygunluk ve parlaklık',
  },
  'labels.hue': { en: 'Hue', fa: 'فام', ar: 'التدرّج', tr: 'Ton' },
  'labels.opacity': {
    en: 'Opacity',
    fa: 'کدری',
    ar: 'العتامة',
    tr: 'Saydamsızlık',
  },
  'labels.hex': {
    en: 'Hex value',
    fa: 'مقدار هگز',
    ar: 'القيمة الست عشرية',
    tr: 'Onaltılık değer',
  },
  'labels.swatches': {
    en: 'Saved colours',
    fa: 'رنگ‌های ذخیره‌شده',
    ar: 'الألوان المحفوظة',
    tr: 'Kayıtlı renkler',
  },
  'labels.eyedropper': {
    en: 'Pick a colour from the screen',
    fa: 'برداشتن رنگ از صفحه',
    ar: 'التقط لونًا من الشاشة',
    tr: 'Ekrandan bir renk seçin',
  },
  'apply': { en: 'Apply', fa: 'اعمال', ar: 'تطبيق', tr: 'Uygula' },
});
