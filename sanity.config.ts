import {createElement} from 'react'
import {defineConfig, defineField, defineType} from 'sanity'
import {structureTool} from 'sanity/structure'

const translation = defineType({
  name:'translation', title:'Localized copy', type:'object',
  components:{
    input:props => createElement('div', {dir:props.path.includes('ar') ? 'rtl' : 'ltr'}, props.renderDefault(props)),
  },
  fields:[
    defineField({name:'title',type:'string',validation:Rule => Rule.required()}),
    defineField({name:'intro',type:'text',rows:3,validation:Rule => Rule.required()}),
    defineField({name:'body',type:'text',rows:8}),
    defineField({name:'seoTitle',type:'string'}),
    defineField({name:'seoDescription',type:'text',rows:2}),
  ],
})

const page = defineType({
  name:'page', title:'Page or article', type:'document',
  fields:[
    defineField({name:'slug',title:'Route without locale (use home for the homepage)',type:'slug',
      options:{source:'en.title'}, validation:Rule => Rule.required().custom(value =>
        value?.current && /^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(value.current) ? true : 'Use lowercase route segments separated by slashes.')}),
    defineField({name:'en',title:'English',type:'translation',validation:Rule => Rule.required()}),
    defineField({name:'ar',title:'العربية',type:'translation',validation:Rule => Rule.required()}),
    defineField({name:'approved',title:'Approved for use on website',type:'boolean',initialValue:false}),
    defineField({name:'serviceApproved',title:'Owner confirmed service offer',type:'boolean',initialValue:false}),
  ],
  preview:{select:{title:'en.title',subtitle:'slug.current'}},
})

const faq = defineType({
  name:'faq', title:'Frequently asked question', type:'document',
  fields:[
    defineField({name:'en',title:'English (title = question, intro = answer)',type:'translation',validation:Rule => Rule.required()}),
    defineField({name:'ar',title:'العربية (العنوان = السؤال، المقدمة = الإجابة)',type:'translation',validation:Rule => Rule.required()}),
    defineField({name:'approved',title:'Approved for use on website',type:'boolean',initialValue:false}),
  ],
  preview:{select:{title:'en.title'}},
})

const settings = defineType({
  name:'siteSettings',title:'Site contact settings',type:'document',
  fields:[
    defineField({name:'whatsapp',type:'string',description:'International digits only, including country code.',validation:Rule => Rule.regex(/^[1-9][0-9]{7,14}$/)}),
    defineField({name:'email',type:'email'}),
    defineField({name:'approved',title:'Approved for use on website',type:'boolean',initialValue:false}),
  ],
})

export default defineConfig({
  name:'rysetup', title:'Rukn Al Yaqeen',
  projectId:process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset:process.env.SANITY_STUDIO_DATASET || '',
  plugins:[structureTool()],
  schema:{types:[translation,page,faq,settings]},
})
