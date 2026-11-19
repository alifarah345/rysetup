export const locales = ['en','ar'] as const
export type Locale = typeof locales[number]
export type Translation = readonly [string, string]
export const pick = (locale: Locale, value: Translation) => value[locale === 'ar' ? 1 : 0]
export const url = (locale: Locale, slug = '') => '/' + locale + '/' + (slug ? slug + '/' : '')
export const isLive = () => process.env.RY_PUBLIC_RELEASE === 'true'

interface Page {
  slug: string
  title: Translation
  intro: Translation
  service?: boolean
}

export const pages: Page[] = [
  {slug:'about',title:['About us','من نحن'],intro:['Rukn Al Yaqeen Business Setup is a UAE business setup consultancy for entrepreneurs, investors and growing companies.','ركن اليقين للاستشارات في تأسيس الأعمال في الإمارات، لخدمة رواد الأعمال والمستثمرين والشركات النامية.']},
  {slug:'business-setup',title:['Business setup','تأسيس الأعمال'],intro:['Explore the main routes to starting a company in the UAE and discuss which route fits your activity.','تعرّف على مسارات تأسيس الشركات في الإمارات وناقش المسار الملائم لنشاطك.'],service:true},
  {slug:'business-setup/mainland',title:['Mainland company formation','تأسيس شركة في البر الرئيسي'],intro:['Discuss your proposed activity, target market and operating requirements before choosing a mainland setup.','ناقش نشاطك المقترح والسوق المستهدف ومتطلبات التشغيل قبل اختيار التأسيس في البر الرئيسي.'],service:true},
  {slug:'business-setup/free-zone',title:['Free zone company formation','تأسيس شركة في منطقة حرة'],intro:['Compare free zone options based on your activity, space requirements and plans for growth.','قارن خيارات المناطق الحرة وفق نشاطك ومتطلبات المساحة وخطط النمو.'],service:true},
  {slug:'pro-services',title:['PRO services','خدمات المعاملات الحكومية'],intro:['Discuss outsourced support for trade licence issuance and renewal, employment permits and contracts, government transactions, and licence amendments or cancellation.','ناقش الدعم الخارجي لإصدار وتجديد الرخص التجارية وتصاريح وعقود العمل والمعاملات الحكومية وتعديل الرخص أو إلغائها.'],service:true},
  {slug:'visa-residency',title:['Visa and residency services','خدمات التأشيرات والإقامة'],intro:['Talk through visa and residency requirements for yourself, your team or your business plans.','ناقش متطلبات التأشيرات والإقامة لك أو لفريقك أو بحسب خطط شركتك.'],service:true},
  {slug:'packages',title:['Business packages','باقات الأعمال'],intro:['Ask about ongoing corporate PRO support and a scope tailored to your company’s needs.','استفسر عن الدعم المستمر للمعاملات الحكومية ونطاق العمل المناسب لاحتياجات شركتك.'],service:true},
  {slug:'resources',title:['Business resources','موارد الأعمال'],intro:['Start with the essentials and explore practical planning questions for your UAE business.','ابدأ بالأساسيات وتعرّف على الأسئلة العملية للتخطيط لأعمالك في الإمارات.']},
  {slug:'resources/plan-your-setup',title:['Plan your UAE business setup','خطّط لتأسيس أعمالك في الإمارات'],intro:['Define your activity, where you want to operate, and what your business will need in its first year. Bring those details to a consultation to compare routes.','حدّد نشاطك ومكان عملك واحتياجات شركتك في السنة الأولى. شارك هذه التفاصيل خلال الاستشارة لمقارنة الخيارات.']},
  {slug:'faq',title:['Frequently asked questions','الأسئلة الشائعة'],intro:['Find answers to common planning questions before you request a consultation.','تعرّف على إجابات الأسئلة الشائعة قبل طلب الاستشارة.']},
  {slug:'contact',title:['Request a free consultation','اطلب استشارة مجانية'],intro:['Tell us what you are planning and how we can reach you.','أخبرنا عن خططك وكيف يمكننا التواصل معك.']},
  {slug:'privacy',title:['Privacy policy','سياسة الخصوصية'],intro:['Draft for review. The inquiry form asks for basic contact information and a short description of your business needs. Please keep personal documents out of your message.','مسودة للمراجعة. يطلب نموذج الاستفسار بيانات تواصل أساسية ووصفًا موجزًا لاحتياجاتك. يُرجى عدم إرسال مستندات شخصية.']},
  {slug:'terms',title:['Terms and conditions','الشروط والأحكام'],intro:['Draft for review. Website material is general information. Service scope and terms will be agreed separately.','مسودة للمراجعة. محتوى الموقع معلومات عامة، ويُتفق على نطاق الخدمات وشروطها بصورة منفصلة.']},
  {slug:'setup-quiz',title:['Find your setup route','اكتشف مسار التأسيس المناسب'],intro:['Answer three short questions to find a starting point for your consultation.','أجب عن ثلاثة أسئلة قصيرة لاختيار نقطة بداية لاستشارتك.']},
]

export const features = [
  {slug:'business-setup/mainland', icon:'building', title:['Mainland setup','التأسيس في البر الرئيسي'], text:['Explore a mainland business structure shaped around your activity and where you plan to operate.','استكشف تأسيس شركة في البر الرئيسي وفق نشاطك ومكان عملك.']},
  {slug:'business-setup/free-zone', icon:'globe', title:['Free zone setup','التأسيس في منطقة حرة'], text:['Narrow down free zone options around your goals, operating needs and plans for growth.','حدّد خيارات المناطق الحرة بما يلائم أهدافك واحتياجاتك التشغيلية.']},
  {slug:'pro-services', icon:'file', title:['Corporate PRO services','خدمات المعاملات الحكومية'], text:['Get support with licensing, renewals and the government transactions that keep business moving.','احصل على دعم في التراخيص والتجديد والمعاملات الحكومية لشركتك.']},
  {slug:'visa-residency', icon:'person', title:['Visa & residency','التأشيرات والإقامة'], text:['Understand the steps to plan visa and residency support for yourself or your team.','تعرّف على خطوات التخطيط للتأشيرات والإقامة لك أو لفريقك.']},
] as const

export const faqs = [
  {q:['How do I choose between mainland and free zone?', 'كيف أختار بين البر الرئيسي والمنطقة الحرة؟'],a:['Start with your business activity, where you intend to operate and what facilities you need. A consultation can help you compare options.','ابدأ بتحديد نشاطك ومكان التشغيل والمرافق المطلوبة. يمكن للاستشارة مساعدتك في المقارنة بين الخيارات.']},
  {q:['Can you help an existing company?', 'هل تساعدون الشركات القائمة؟'],a:['You can inquire about ongoing PRO support, licensing changes and government transactions. The scope will depend on your company’s needs.','يمكنك الاستفسار عن دعم المعاملات الحكومية والتعديلات على الرخص بحسب احتياجات شركتك.']},
  {q:['What should I bring to a consultation?', 'ماذا أجهّز للاستشارة؟'],a:['A short description of your planned activity, location preferences and any visa needs is a useful starting point.','ابدأ بوصف موجز لنشاطك المقترح وموقعك المفضل وأي احتياجات للتأشيرات.']},
] as const
