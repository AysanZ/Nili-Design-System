import { useStudio } from './core/store';

/**
 * The studio speaks the language the library was built for.
 *
 * Keys are the English string, so a missing translation degrades to English
 * instead of to a key name — and adding a label does not mean editing two
 * files before it renders.
 */
const FA: Record<string, string> = {
  /* chrome */
  Design: 'طراحی',
  Variants: 'حالت‌ها',
  Code: 'کد',
  Insert: 'افزودن',
  Layers: 'لایه‌ها',
  API: 'پراپ‌ها',
  Undo: 'واگرد',
  Redo: 'ازنو',
  Components: 'کامپوننت‌ها',
  'New component': 'کامپوننت جدید',
  'Delete component': 'حذف کامپوننت',
  Rename: 'تغییر نام',
  Reset: 'بازنشانی',
  Import: 'ورود',
  Export: 'خروجی',
  Theme: 'تم',
  Language: 'زبان',
  Light: 'روشن',
  Dark: 'تیره',
  Width: 'عرض',
  Zoom: 'بزرگ‌نمایی',

  /* insert */
  'Search components': 'جستجوی کامپوننت',
  'Nothing matches': 'چیزی پیدا نشد',
  Layout: 'چیدمان',
  Stack: 'ستون',
  Row: 'ردیف',
  Text: 'متن',
  Slot: 'اسلات',
  'Add to selection': 'افزودن به انتخاب',

  /* layers */
  Duplicate: 'تکثیر',
  Delete: 'حذف',
  'Nothing drawn yet': 'هنوز چیزی کشیده نشده',
  'Pick a component from Insert': 'از تب افزودن یک کامپوننت بردار',

  /* api */
  Props: 'پراپ‌ها',
  'Add prop': 'پراپ جدید',
  Name: 'نام',
  Type: 'نوع',
  Required: 'اجباری',
  Optional: 'اختیاری',
  Default: 'پیش‌فرض',
  Sample: 'نمونه',
  Description: 'توضیح',
  Options: 'گزینه‌ها',
  'Shown when': 'وقتی نمایش داده شود که',
  'Only when': 'فقط وقتی',
  Always: 'همیشه',
  'Depends on': 'وابسته به',
  Condition: 'شرط',
  'is on': 'روشن باشد',
  'is off': 'خاموش باشد',
  equals: 'برابر باشد با',
  'does not equal': 'برابر نباشد با',
  'one of': 'یکی از',
  'No props yet': 'هنوز پراپی تعریف نشده',
  'A component with no props renders one way. Add one to give it states.':
    'کامپوننت بدون پراپ فقط یک شکل دارد. یکی اضافه کن تا حالت بگیرد.',
  States: 'حالت‌های نام‌دار',
  'Add state': 'حالت جدید',
  'Named states': 'حالت‌های نام‌دار',
  'Back to samples': 'بازگشت به نمونه',

  /* inspector */
  Inspector: 'تنظیمات',
  'Nothing selected': 'چیزی انتخاب نشده',
  'Pick a layer on the canvas': 'روی بوم یک لایه انتخاب کن',
  Direction: 'جهت',
  Gap: 'فاصله',
  Padding: 'حاشیه داخلی',
  Align: 'تراز',
  Distribute: 'توزیع',
  Wrap: 'شکستن خط',
  Background: 'پس‌زمینه',
  Radius: 'گردی گوشه',
  Border: 'کادر',
  Shadow: 'سایه',
  Size: 'اندازه',
  Hug: 'به‌اندازه محتوا',
  Fill: 'پرکردن',
  Fixed: 'ثابت',
  Variant: 'وریانت',
  Content: 'محتوا',
  State: 'وضعیت',
  Accessibility: 'دسترس‌پذیری',
  'Bind to prop': 'اتصال به پراپ',
  'Bound to': 'متصل به',
  Unbind: 'قطع اتصال',
  Expression: 'عبارت',
  'Class names': 'کلاس‌ها',
  'Show when': 'نمایش وقتی که',
  'Fills the': 'پرکننده‌ی',
  'None of this component’s props are drawable here':
    'هیچ‌کدام از پراپ‌های این کامپوننت اینجا قابل ویرایش نیست',

  /* variants */
  Rows: 'سطرها',
  Columns: 'ستون‌ها',
  'Not possible': 'ناممکن',
  'Add two props with a fixed set of values to cross them here.':
    'دو پراپ با مجموعه‌ی مشخصی از مقادیر تعریف کن تا اینجا در هم ضرب شوند.',
  'Every appearance': 'همه‌ی ظاهرها',

  /* code */
  Copy: 'کپی',
  Copied: 'کپی شد',
  Download: 'دانلود',
  'Download all': 'دانلود همه',
};

export function useT(): (text: string) => string {
  const { state } = useStudio();
  const fa = state.ui.lang === 'fa';
  return (text: string) => (fa ? (FA[text] ?? text) : text);
}

export function useDir(): 'rtl' | 'ltr' {
  return useStudio().state.ui.lang === 'fa' ? 'rtl' : 'ltr';
}
