import {faqs, pages} from '../src/lib/content.ts'

function translations(title, intro) {
  return {
    en:{_type:'translation',title:title[0],intro:intro[0]},
    ar:{_type:'translation',title:title[1],intro:intro[1]},
  }
}

const home = {
  slug:'home',
  title:['Build your business in the UAE.','أسّس أعمالك في الإمارات.'],
  intro:[
    'Company formation, licensing and corporate PRO support for entrepreneurs and growing businesses across the Emirates.',
    'دعم تأسيس الشركات والتراخيص والمعاملات الحكومية لرواد الأعمال والشركات النامية في الإمارات.',
  ],
}

for (const {slug,title,intro} of [home,...pages]) {
  console.log(JSON.stringify({
    _id:'drafts.ry.page.' + slug.replaceAll('/','.'),
    _type:'page', slug:{_type:'slug',current:slug},
    approved:false, serviceApproved:false, ...translations(title,intro),
  }))
}
for (const [index,{q,a}] of faqs.entries()) {
  console.log(JSON.stringify({
    _id:'drafts.ry.faq.' + (index + 1),
    _type:'faq', approved:false, ...translations(q,a),
  }))
}
