import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import styles from '../styles/123movies.module.css'
import SearchComponent from '../components/SearchComponent'
import GoogleTranslate from '../components/GoogleTranslate'
import SocialSharing from '../components/SocialSharing'
import Head from 'next/head'
import Image from 'next/image'
import Script from 'next/script'

const MoviesPage = ({ movies, tvshows, trailers, adults }) => {
  const sections = [
    // { title: 'Latest Trailer', items: trailers },
    { title: 'Latest Movies.', items: movies },
    { title: 'Latest TV Series.', items: tvshows },
    { title: 'Adult Content.', items: adults }
  ]

  const uwatchfreeSchema = JSON.stringify([
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: '123Movies Online™ - Explore. Stream. Online. ',
      url: 'https://123moviesonline.vercel.app/',
      image: ['https://123moviesonline.vercel.app/favicon.ico'],
      logo: {
        '@type': 'ImageObject',
        url: 'https://123moviesonline.vercel.app/logo.png',
        width: 280,
        height: 80
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: 'https://123moviesonline.vercel.app/',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://123moviesonline.vercel.app/search?q={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    }
  ])

  const rankMathSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': 'https://123moviesonline.vercel.app/author/justwatchfree/',
        name: 'Dr Trailer',
        url: 'https://123moviesonline.vercel.app/author/justwatchfree/',
        image: {
          '@type': 'ImageObject',
          '@id': 'https://gravatar.com/drtrailer2022',
          url: 'https://gravatar.com/drtrailer2022',
          caption: 'Dr Trailer',
          inLanguage: 'en-US'
        }
      },
      {
        '@type': 'Organization',
        '@id': 'https://123moviesonline.vercel.app/#organization',
        name: '123Movies Online™ - Explore. Stream. Online. ',
        url: 'https://123moviesonline.vercel.app'
      },
      {
        '@type': 'WebSite',
        '@id': 'https://123moviesonline.vercel.app/#website',
        url: 'https://123moviesonline.vercel.app',
        name: '123Movies Online™ - Explore. Stream. Online. ',
        publisher: {
          '@type': 'Organization',
          '@id': 'https://123moviesonline.vercel.app/#organization'
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://123moviesonline.vercel.app/?s={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'WebPage',
        '@id': 'https://123moviesonline.vercel.app/#webpage',
        url: 'https://123moviesonline.vercel.app/',
        name: 'Movie',
        datePublished: '2024-01-13T13:00:00+00:00',
        dateModified: '2024-01-13T13:13:00+00:00',
        about: {
          '@type': 'Person',
          '@id': 'https://123moviesonline.vercel.app/author/justwatchfree/',
          name: 'Dr Trailer',
          url: 'https://123moviesonline.vercel.app/author/justwatchfree/',
          image: {
            '@type': 'ImageObject',
            '@id': 'https://gravatar.com/drtrailer2022',
            url: 'https://gravatar.com/drtrailer2022',
            caption: 'Dr Trailer',
            inLanguage: 'en-US'
          }
        },
        isPartOf: {
          '@id': 'https://123moviesonline.vercel.app/#website'
        },
        inLanguage: 'en-US',
        mainEntity: [
          {
            '@type': 'Article',
            '@id': 'https://123moviesonline.vercel.app/',
            url: 'https://123moviesonline.vercel.app/',
            headline: '123Movies Online™ - Explore. Stream. Online. ',
            datePublished: '2024-01-13T13:00:00+00:00',
            dateModified: '2024-01-13T13:13:00+00:00',
            author: {
              '@type': 'Person',
              '@id': 'https://123moviesonline.vercel.app/author/justwatchfree/',
              name: 'Dr Trailer',
              url: 'https://123moviesonline.vercel.app/author/justwatchfree/',
              image: {
                '@type': 'ImageObject',
                '@id': 'https://gravatar.com/drtrailer2022',
                url: 'https://gravatar.com/drtrailer2022',
                caption: 'Dr Trailer',
                inLanguage: 'en-US'
              }
            },
            publisher: {
              '@type': 'Organization',
              '@id': 'https://123moviesonline.vercel.app/#organization',
              name: '123Movies Online™ - Explore. Stream. Online. ',
              url: 'https://123moviesonline.vercel.app'
            }
          },
          {
            '@type': 'Article',
            '@id': 'https://123moviesonline.vercel.app/',
            url: 'https://123moviesonline.vercel.app/',
            headline: '123Movies Online™ - Explore. Stream. Online. ',
            datePublished: '2024-01-13T13:00:00+00:00',
            dateModified: '2024-01-13T13:13:00+00:00',
            author: {
              '@type': 'Person',
              '@id': 'https://123moviesonline.vercel.app/author/justwatchfree/',
              name: 'Dr Trailer',
              url: 'https://123moviesonline.vercel.app/author/justwatchfree/',
              image: {
                '@type': 'ImageObject',
                '@id': 'https://gravatar.com/drtrailer2022',
                url: 'https://gravatar.com/drtrailer2022',
                caption: 'Dr Trailer',
                inLanguage: 'en-US'
              }
            },
            publisher: {
              '@type': 'Organization',
              '@id': 'https://123moviesonline.vercel.app/#organization',
              name: '123Movies Online™ - Explore. Stream. Online. ',
              url: 'https://123moviesonline.vercel.app'
            }
          },
          {
            '@type': 'Article',
            '@id': 'https://123moviesonline.vercel.app/',
            url: 'https://123moviesonline.vercel.app/',
            headline: '123Movies Online™ - Explore. Stream. Online. ',
            datePublished: '2024-01-13T13:00:00+00:00',
            dateModified: '2024-01-13T13:13:00+00:00',
            author: {
              '@type': 'Person',
              '@id': 'https://123moviesonline.vercel.app/author/justwatchfree/',
              name: 'Dr Trailer',
              url: 'https://123moviesonline.vercel.app/author/justwatchfree/',
              image: {
                '@type': 'ImageObject',
                '@id': 'https://gravatar.com/drtrailer2022',
                url: 'https://gravatar.com/drtrailer2022',
                caption: 'Dr Trailer',
                inLanguage: 'en-US'
              }
            }
          }
        ]
      }
    ]
  })

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ y: -250 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        <Head>
          <link
            rel='sitemap'
            type='application/xml'
            title='Sitemap'
            href='https://123moviesonline.vercel.app/sitemap.xml'
          />
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0'
          />
          <link rel='icon' type='image/x-icon' href='/favicon.ico' />
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/apple-touch-icon.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/favicon-16x16.png'
          />
          <link rel='manifest' href='/site.webmanifest' />
          <meta name='googlebot' content='index,follow' />
          <meta name='revisit-after' content='1 days' />
          <meta name='referrer' content='origin' />
          <meta
            name='robots'
            content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
          />
          <meta
            name='keywords'
            content='watch free movies, free movies online, download movies, full movies, HD movies, movie streaming, stream TV series, watch TV shows free'
          />
          <meta
            name='description'
            content='Stream HD movies and TV series for free on 123Movies Online. Explore, stream, and download full-length movies and shows in HD quality without registration.'
          />
          <link rel='canonical' href='https://123moviesonline.vercel.app/' />
          <meta property='og:locale' content='en_US' />
          <meta property='og:type' content='video.movie' />
          <meta property='og:type' content='website' />
          <meta
            property='og:title'
            content='123Movies Online™ - Explore. Stream. Online. '
          />
          <meta property='og:url' content='https://123moviesonline.vercel.app/' />
          <meta
            property='og:site_name'
            content='123Movies Online™ - Explore. Stream. Online. '
          />
          <meta
            property='og:image'
            content='https://123moviesonline.vercel.app/og_image.jpg'
          />
          <meta property='og:image:width' content='1200' />
          <meta property='og:image:height' content='630' />
          <meta property='og:image:type' content='image/jpg' />
          <meta
            name='application-name'
            content='123Movies Online™ - Explore. Stream. Online. '
          />
          <meta
            property='article:modified_time'
            content='2024-01-01T13:13:13+00:00'
          />
          <link
            rel='sitemap'
            type='application/xml'
            title='Sitemap'
            href='https://123moviesonline.vercel.app/sitemap.xml'
          />
          <meta name='twitter:card' content='summary_large_image' />
          <meta
            name='twitter:title'
            content='123Movies Online™ - Explore. Stream. Online.  HD Movies and TV Series Free'
          />
          <meta
            name='twitter:description'
            content='Stream HD movies and TV series for free on 123Movies Online™. Explore, stream, and download full-length movies and shows in HD quality without registration.'
          />
          <meta
            name='twitter:image'
            content='https://123moviesonline.vercel.app/og_image.jpg'
          />
          <meta
            name='google-site-verification'
            content='4gdbnCGat0T4Ow3Y_RYzPM4vwtsXvhUel5Q-2yULK6k'
          />
          <meta
            name='google-site-verification'
            content='4gdbnCGat0T4Ow3Y_RYzPM4vwtsXvhUel5Q-2yULK6k'
          />
          <meta
            name='facebook-domain-verification'
            content='du918bycikmo1jw78wcl9ih6ziphd7'
          />
          <meta
            name='dailymotion-domain-verification'
            content='dmlp2t3912gbq4occ'
          />
          <meta name='monetag' content='98a412cb5612b9188cd76b9744304b6c' />

          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{ __html: rankMathSchema }}
          />
          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{ __html: uwatchfreeSchema }}
          />
          <link
            rel='stylesheet'
            href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
            integrity='sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=='
            crossorigin='anonymous'
            referrerpolicy='no-referrer'
          />
          <Script
            dangerouslySetInnerHTML={{
              __html: `
            (function (w, d, s, id) {
              if (typeof (w.webpushr) !== 'undefined') return;
              w.webpushr = w.webpushr |function () { (w.webpushr.q = w.webpushr.q |[]).push(arguments) };
              var js, fjs = d.getElementsByTagName(s)[0];
              js = d.createElement(s); js.id = id; js.async = 1;
              js.src = "https://cdn.webpushr.com/app.min.js";
              fjs.parentNode.appendChild(js);
            }(window, document, 'script', 'webpushr-jssdk'));

            webpushr('setup', { 'key': 'BOuic2nh-qk0sm0846T84my5yaHHRUOFIsif_OEwQXV0CRQMQbaRhqkCbpuGwX2EssCbADsVnqq9YvlVCuA7Hyc' });
          `
            }}
          />
        </Head>

        <GoogleTranslate />

        <h1 className={styles.title}>
          {' '}
          123Movies Online™ - Explore. Stream. Online.{' '}
        </h1>
        <SearchComponent />

        <SocialSharing />
      </motion.div>
      {sections.map((section, index) => (
        <div key={index}>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          {/* <motion.div
            className={styles.movieList}
            initial="hidden"
            animate="visible"
          > */}
          <motion.div
            className={styles.movieList}
            initial={{ y: -250 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 120 }}
          >
            {section.items.length > 0 ? (
              section.items.map(item => (
                <Link key={item.id} href={item.siteurl || '/'} passHref>
                  <motion className={styles.movieCard}>
                    <img
                      src={item.image1 || '/default-image.jpg'}
                      alt={item.title || 'Default Title'}
                      className={styles.movieImage}
                      style={{
                        boxShadow: '0 0 10px 0 #000',
                        filter:
                          'contrast(1.1) saturate(1.1) brightness(1.0) hue-rotate(0deg)'
                      }}
                    />
                    <h3 className={styles.movieTitle}>
                      {item.title || 'Default Title'}
                    </h3>
                    <div className={styles.movieDetails}>
                      <strong
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          textShadow: '1px 1px 1px #000',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      >
                        {' '}
                        Genre:{' '}
                      </strong>{' '}
                      <span className={styles.movieDescription}>
                        {item.genre || 'Default Description'}
                      </span>
                      <strong
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          textShadow: '1px 1px 1px #000',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      >
                        {' '}
                        Country:{' '}
                      </strong>{' '}
                      <span className={styles.movieDescription}>
                        {item.country || 'Default Description'}
                      </span>
                      <strong
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          textShadow: '1px 1px 1px #000',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      >
                        {' '}
                        Language:{' '}
                      </strong>{' '}
                      <span className={styles.movieDescription}>
                        {item.language || 'Default Description'}
                      </span>
                      <strong
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          textShadow: '1px 1px 1px #000',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      >
                        {' '}
                        Starring:{' '}
                      </strong>{' '}
                      <span className={styles.movieDescription}>
                        {item.starring || 'Default Description'}
                      </span>
                      <strong
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          textShadow: '1px 1px 1px #000',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      >
                        {' '}
                        Synopsis:{' '}
                      </strong>{' '}
                      <span className={styles.movieDescription}>
                        {item.news1 || 'Default Description'}
                      </span>
                    </div>
                  </motion>
                </Link>
              ))
            ) : (
              <p>No items to display.</p>
            )}
          </motion.div>
        </div>
      ))}
    </div>
  )
}

export async function getStaticProps () {
  const readFile = filename => {
    const filePath = path.join(process.cwd(), 'public', filename)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContent)
  }

  const movies = readFile('movies.json')
  const tvshows = readFile('tvshow.json')
  const trailers = readFile('trailers.json')
  const adults = readFile('adult.json')

  return {
    props: {
      movies,
      tvshows,
      trailers,
      adults
    }
  }
}

export default MoviesPage
