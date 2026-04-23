'use client';

import { useEdit } from './EditProvider';
import EditableText from './EditableText';
import EditablePhoto from './EditablePhoto';
import EditableIcon from './EditableIcon';
import ItemControls, { AddItemButton } from './ItemControls';
import ContactForm from './ContactForm';

export default function Landing() {
  const { content } = useEdit();
  const c = content;

  return (
    <>
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#fbf9f4]/80 backdrop-blur-md">
        <div className="flex justify-between items-center px-6 md:px-12 py-6 w-full max-w-screen-2xl mx-auto">
          <EditableText
            as="div"
            path="brand"
            value={c.brand}
            className="text-xl font-serif italic text-stone-800"
          />
          <div className="hidden md:flex gap-10 items-center">
            {(c.nav || []).map((item, i) => (
              <a
                key={i}
                className="text-stone-600 hover:text-stone-900 transition-colors text-label"
                href={item.href}
              >
                <EditableText as="span" path={`nav.${i}.label`} value={item.label} />
              </a>
            ))}
            <a
              href="#contact"
              className="bg-primary-container/20 border border-primary-container text-on-primary-container px-6 py-2.5 rounded-full text-label hover:bg-primary-container hover:text-white transition-all duration-300"
            >
              Записаться
            </a>
          </div>
        </div>
      </nav>

      <main className="pt-24 overflow-x-hidden">
        {/* Hero */}
        <section className="min-h-screen flex items-center px-6 md:px-12 max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center w-full">
            <div className="md:col-span-7 flex flex-col items-start">
              <EditableText as="p" path="hero.eyebrow" value={c.hero?.eyebrow} className="text-label text-primary mb-8" />
              <h1 className="text-5xl md:text-8xl font-serif italic leading-tight text-on-surface mb-12">
                <EditableText as="span" path="hero.title_before" value={c.hero?.title_before} />
                <EditableText as="span" path="hero.title_accent" value={c.hero?.title_accent} className="text-primary-container" />
                <EditableText as="span" path="hero.title_after" value={c.hero?.title_after} />
              </h1>
              <div className="flex flex-wrap gap-6 items-center">
                <a
                  href="#contact"
                  className="bg-primary-container text-on-primary-container px-10 py-4 rounded-full text-label font-medium hover:bg-primary transition-all duration-500 shadow-sm"
                >
                  <EditableText as="span" path="hero.cta_primary" value={c.hero?.cta_primary} />
                </a>
                <a href="#process" className="text-label border-b border-tertiary-container pb-1 hover:border-primary transition-all">
                  <EditableText as="span" path="hero.cta_secondary" value={c.hero?.cta_secondary} />
                </a>
              </div>
            </div>
            <div className="md:col-span-5 relative">
              <div className="aspect-[4/5] bg-surface-container-low rounded-xl overflow-hidden shadow-2xl shadow-on-surface/5">
                <EditablePhoto path="hero.photo" value={c.hero?.photo} alt="Портрет психолога" className="w-full h-full" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-tertiary-container/10 -z-10 rounded-full blur-2xl" />
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="bg-surface-container-low py-32 px-6 md:px-12">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
            <div className="md:col-span-7">
              <EditableText as="p" path="about.eyebrow" value={c.about?.eyebrow} className="text-label text-primary mb-6" />
              <EditableText as="h2" path="about.title" value={c.about?.title} className="text-4xl font-headline italic mb-8" />
              <div className="space-y-6 text-lg text-on-surface-variant font-light leading-relaxed">
                {(c.about?.paragraphs || []).map((p, i) => (
                  <EditableText key={i} as="p" path={`about.paragraphs.${i}`} value={p} multiline />
                ))}
              </div>
            </div>
            <div className="md:col-span-5 flex flex-col justify-center">
              <div className="border-l-[0.5px] border-tertiary-container pl-12 space-y-12 py-4">
                {(c.about?.credentials || []).map((cr, i) => (
                  <div key={i} data-qd-list-item className="relative">
                    <ItemControls section="about.credentials" index={i} length={c.about.credentials.length} />
                    <EditableText as="p" path={`about.credentials.${i}.label`} value={cr.label} className="text-label mb-2" />
                    <EditableText as="p" path={`about.credentials.${i}.title`} value={cr.title} className="font-headline italic text-xl" />
                    <EditableText as="p" path={`about.credentials.${i}.subtitle`} value={cr.subtitle} className="text-sm font-light text-on-surface-variant" />
                  </div>
                ))}
                <AddItemButton
                  section="about.credentials"
                  label="Добавить пункт"
                  template={{ label: 'Новый пункт', title: 'Заголовок', subtitle: 'Подзаголовок' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Expertise */}
        <section id="expertise" className="py-32 px-6 md:px-12 max-w-screen-2xl mx-auto">
          <div className="mb-20">
            <EditableText as="p" path="expertise.eyebrow" value={c.expertise?.eyebrow} className="text-label text-primary mb-4 text-center" />
            <EditableText as="h2" path="expertise.title" value={c.expertise?.title} className="text-4xl md:text-5xl font-headline italic text-center" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-12">
            {(c.expertise?.items || []).map((it, i) => (
              <div key={i} data-qd-list-item className="relative group">
                <ItemControls section="expertise.items" index={i} length={c.expertise.items.length} />
                <div className="mb-6">
                  <EditableIcon path={`expertise.items.${i}.icon`} value={it.icon} className="text-4xl text-primary font-extralight" />
                </div>
                <EditableText as="h3" path={`expertise.items.${i}.title`} value={it.title} className="text-2xl font-headline italic mb-4 group-hover:text-primary transition-colors" />
                <EditableText as="p" path={`expertise.items.${i}.text`} value={it.text} multiline className="text-on-surface-variant font-light leading-relaxed" />
              </div>
            ))}
          </div>
          <div className="text-center">
            <AddItemButton
              section="expertise.items"
              label="Добавить направление"
              template={{ icon: 'spa', title: 'Новое направление', text: 'Короткое описание.' }}
            />
          </div>
        </section>

        {/* Process */}
        <section id="process" className="py-32 px-6 md:px-12 bg-surface-container-highest/30">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12">
              <div className="md:w-1/3">
                <EditableText as="p" path="process.eyebrow" value={c.process?.eyebrow} className="text-label text-primary mb-6" />
                <EditableText as="h2" path="process.title" value={c.process?.title} className="text-4xl md:text-5xl font-headline italic mb-8" />
              </div>
              <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                {(c.process?.steps || []).map((s, i) => (
                  <div key={i} data-qd-list-item className="relative">
                    <ItemControls section="process.steps" index={i} length={c.process.steps.length} />
                    <EditableText
                      as="span"
                      path={`process.steps.${i}.num`}
                      value={s.num}
                      className="text-[80px] font-headline text-tertiary-container/20 absolute -top-12 -left-4 select-none"
                    />
                    <EditableText as="h4" path={`process.steps.${i}.title`} value={s.title} className="text-xl font-headline italic mb-4 mt-6" />
                    <EditableText as="p" path={`process.steps.${i}.text`} value={s.text} multiline className="text-on-surface-variant font-light leading-relaxed text-sm" />
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <AddItemButton
                section="process.steps"
                label="Добавить шаг"
                template={{ num: '0X', title: 'Новый шаг', text: 'Описание шага.' }}
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-32 px-6 md:px-12 max-w-screen-md mx-auto">
          <div className="text-center mb-20">
            <EditableText as="p" path="faq.eyebrow" value={c.faq?.eyebrow} className="text-label text-primary mb-4" />
            <EditableText as="h2" path="faq.title" value={c.faq?.title} className="text-4xl font-headline italic" />
          </div>
          <div className="space-y-4">
            {(c.faq?.items || []).map((item, i) => (
              <details key={i} data-qd-list-item className="group relative p-6 border-b border-tertiary-container/30 open:bg-surface-container-low transition-all rounded-xl">
                <ItemControls section="faq.items" index={i} length={c.faq.items.length} />
                <summary className="list-none cursor-pointer flex justify-between items-center text-on-surface font-light text-lg gap-4">
                  <EditableText as="span" path={`faq.items.${i}.q`} value={item.q} className="flex-1" />
                  <span className="material-symbols-outlined text-tertiary-container group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <div className="mt-6 text-on-surface-variant font-light leading-relaxed">
                  <EditableText as="div" path={`faq.items.${i}.a`} value={item.a} multiline />
                </div>
              </details>
            ))}
          </div>
          <div className="text-center">
            <AddItemButton
              section="faq.items"
              label="Добавить вопрос"
              template={{ q: 'Новый вопрос?', a: 'Ответ на вопрос.' }}
            />
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-32 px-6 md:px-12 max-w-screen-2xl mx-auto">
          <div className="bg-surface-container-lowest border-[0.5px] border-tertiary-container/20 rounded-2xl overflow-hidden shadow-2xl shadow-on-surface/5 flex flex-col md:flex-row">
            <div className="md:w-1/2 p-10 md:p-16 bg-surface-container-low/50">
              <EditableText as="p" path="contact.eyebrow" value={c.contact?.eyebrow} className="text-label text-primary mb-8" />
              <EditableText as="h2" path="contact.title" value={c.contact?.title} className="text-4xl md:text-5xl font-headline italic mb-12" />
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <div>
                    <EditableText as="p" path="contact.address_label" value={c.contact?.address_label} className="text-label text-[10px] mb-1" />
                    <EditableText as="p" path="contact.address" value={c.contact?.address} multiline className="text-on-surface-variant font-light whitespace-pre-line" />
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <span className="material-symbols-outlined text-primary">send</span>
                  <div>
                    <EditableText as="p" path="contact.contact_label" value={c.contact?.contact_label} className="text-label text-[10px] mb-1" />
                    <a
                      href={c.contact?.telegram_url || '#'}
                      className="text-on-surface font-medium hover:text-primary transition-colors inline-flex items-center gap-2"
                    >
                      <EditableText as="span" path="contact.telegram_text" value={c.contact?.telegram_text} />
                    </a>
                    <EditableText as="p" path="contact.telegram_url" value={c.contact?.telegram_url} className="text-xs text-on-surface-variant mt-1" />
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-10 md:p-16">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#56c39e]/10 bg-[#f5f3ee]">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-16 w-full max-w-screen-2xl mx-auto gap-8">
          <div>
            <EditableText as="div" path="brand" value={c.brand} className="text-lg font-serif italic text-stone-800" />
            <EditableText as="p" path="footer.copyright" value={c.footer?.copyright} className="text-[10px] tracking-widest uppercase text-stone-500 mt-2" />
          </div>
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {(c.footer?.links || []).map((l, i) => (
              <a
                key={i}
                href={l.href}
                data-qd-allow-nav=""
                target={l.href && l.href !== '#' ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="text-stone-500 text-[10px] tracking-widest uppercase hover:text-[#5c5794] transition-colors"
              >
                <EditableText as="span" path={`footer.links.${i}.label`} value={l.label} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
