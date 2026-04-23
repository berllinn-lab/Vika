'use client';

import { useEffect, useState } from 'react';

export default function InstagramSection({ isHidden, editMode }) {
  const [posts, setPosts] = useState(null); // null = loading

  useEffect(() => {
    fetch('/api/instagram-posts')
      .then((r) => r.json())
      .then(setPosts)
      .catch(() => setPosts([]));
  }, []);

  // Не рендерим секцию если постов нет и не в режиме редактирования
  if (posts !== null && posts.length === 0 && !editMode) return null;

  const visibilityClass = isHidden
    ? editMode ? ' opacity-40' : ' hidden'
    : '';

  return (
    <section
      id="instagram"
      className={`py-32 px-6 md:px-12 bg-[#fbf9f4] relative${visibilityClass}`}
    >
      <div className="max-w-screen-2xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-label text-primary mb-4">Инстаграм</p>
          <h2 className="text-4xl font-headline italic">Жизнь вне кабинета.</h2>
          <a
            href="https://www.instagram.com/time_prenatal/"
            target="_blank"
            rel="noopener noreferrer"
            data-qd-allow-nav=""
            className="inline-flex items-center gap-2 mt-6 text-label text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
            @time_prenatal
          </a>
        </div>

        {posts === null ? (
          <div className="flex justify-center py-16">
            <span className="material-symbols-outlined animate-spin text-primary" style={{ fontSize: 32 }}>progress_activity</span>
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-on-surface-variant text-label">Посты появятся после первой синхронизации.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {posts.map((post) => (
              <a
                key={post.id}
                href={post.permalink || `https://www.instagram.com/time_prenatal/`}
                target="_blank"
                rel="noopener noreferrer"
                data-qd-allow-nav=""
                className="group relative block overflow-hidden rounded-xl bg-surface-container"
              >
                <div className="aspect-square relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.photo_url}
                    alt={post.caption ? post.caption.slice(0, 80) : 'Instagram фото'}
                    className="w-full h-full object-cover grayscale-[20%] sepia-[10%] group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                {post.caption ? (
                  <div className="absolute inset-0 bg-on-surface/0 group-hover:bg-on-surface/60 transition-colors duration-300 flex items-end p-4">
                    <p className="text-white text-xs font-light leading-snug opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-4">
                      {post.caption}
                    </p>
                  </div>
                ) : null}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
