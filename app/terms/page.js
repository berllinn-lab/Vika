export const metadata = {
  title: 'Условия использования — The Quiet Dialogue',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface px-6 md:px-12 py-24">
      <div className="max-w-2xl mx-auto prose prose-stone">
        <a href="/" className="text-label text-[10px] text-on-surface-variant hover:text-primary mb-8 inline-block">
          ← На главную
        </a>
        <h1 className="font-headline text-3xl italic text-on-surface mt-4 mb-8">
          Условия использования
        </h1>

        <p className="text-on-surface-variant text-sm mb-6">Последнее обновление: апрель 2025 г.</p>

        <section className="space-y-6 text-on-surface/80 leading-relaxed">
          <div>
            <h2 className="font-semibold text-on-surface text-lg mb-2">1. Принятие условий</h2>
            <p>Используя данный сайт, вы принимаете настоящие Условия использования. Если вы не согласны с какими-либо положениями, пожалуйста, прекратите использование сайта.</p>
          </div>

          <div>
            <h2 className="font-semibold text-on-surface text-lg mb-2">2. Назначение сайта</h2>
            <p>Сайт предоставляет информацию о психологических консультациях и услугах. Информация на сайте носит ознакомительный характер и не заменяет профессиональную помощь, диагностику или лечение.</p>
          </div>

          <div>
            <h2 className="font-semibold text-on-surface text-lg mb-2">3. Запись на консультацию</h2>
            <p>Заявка через форму на сайте означает ваше намерение записаться на консультацию. Факт записи подтверждается отдельно — по телефону или электронной почте. Заявка не является договором об оказании услуг.</p>
          </div>

          <div>
            <h2 className="font-semibold text-on-surface text-lg mb-2">4. Ограничение ответственности</h2>
            <p>Владелец сайта не несёт ответственности за действия пользователей, основанные на информации, размещённой на сайте, без предварительной консультации со специалистом.</p>
          </div>

          <div>
            <h2 className="font-semibold text-on-surface text-lg mb-2">5. Интеллектуальная собственность</h2>
            <p>Все материалы сайта (тексты, изображения, дизайн) являются собственностью владельца. Использование материалов без разрешения запрещено.</p>
          </div>

          <div>
            <h2 className="font-semibold text-on-surface text-lg mb-2">6. Изменения</h2>
            <p>Мы вправе изменять настоящие Условия. Актуальная версия всегда доступна на этой странице. Продолжение использования сайта означает согласие с изменёнными условиями.</p>
          </div>

          <div>
            <h2 className="font-semibold text-on-surface text-lg mb-2">7. Контакты</h2>
            <p>По вопросам, связанным с условиями использования, обращайтесь через форму связи на главной странице.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
