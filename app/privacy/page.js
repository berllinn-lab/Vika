export const metadata = {
  title: 'Политика конфиденциальности — The Quiet Dialogue',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface px-6 md:px-12 py-24">
      <div className="max-w-2xl mx-auto prose prose-stone">
        <a href="/" className="text-label text-[10px] text-on-surface-variant hover:text-primary mb-8 inline-block">
          ← На главную
        </a>
        <h1 className="font-headline text-3xl italic text-on-surface mt-4 mb-8">
          Политика конфиденциальности
        </h1>

        <p className="text-on-surface-variant text-sm mb-6">Последнее обновление: апрель 2025 г.</p>

        <section className="space-y-6 text-on-surface/80 leading-relaxed">
          <div>
            <h2 className="font-semibold text-on-surface text-lg mb-2">1. Общие положения</h2>
            <p>Настоящая Политика конфиденциальности описывает, как мы собираем, используем и защищаем личную информацию пользователей сайта. Используя сайт, вы соглашаетесь с условиями данной политики.</p>
          </div>

          <div>
            <h2 className="font-semibold text-on-surface text-lg mb-2">2. Какие данные мы собираем</h2>
            <p>При заполнении формы записи мы получаем:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Имя</li>
              <li>Номер телефона и/или адрес электронной почты</li>
              <li>Сообщение, которое вы указали</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-on-surface text-lg mb-2">3. Цель сбора данных</h2>
            <p>Данные используются исключительно для связи с вами по вопросам записи на консультацию. Они не передаются третьим лицам, не продаются и не используются в рекламных целях.</p>
          </div>

          <div>
            <h2 className="font-semibold text-on-surface text-lg mb-2">4. Хранение данных</h2>
            <p>Информация хранится на защищённом сервере. Данные удаляются по вашему запросу или после завершения взаимодействия. Для удаления ваших данных свяжитесь с нами через контактную форму.</p>
          </div>

          <div>
            <h2 className="font-semibold text-on-surface text-lg mb-2">5. Cookie</h2>
            <p>Сайт использует технические cookie исключительно для обеспечения работы сессии авторизации. Аналитические или рекламные cookie не используются.</p>
          </div>

          <div>
            <h2 className="font-semibold text-on-surface text-lg mb-2">6. Ваши права</h2>
            <p>Вы вправе запросить доступ к своим данным, их исправление или удаление. Для этого напишите на контактный адрес, указанный на сайте.</p>
          </div>

          <div>
            <h2 className="font-semibold text-on-surface text-lg mb-2">7. Изменения политики</h2>
            <p>Мы оставляем за собой право вносить изменения в настоящую Политику. Актуальная версия всегда доступна на этой странице.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
