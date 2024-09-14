import { useRouter } from 'next/router'
import tvshowzipData from '../../../public/tvshowzip.json'
import tvshowzipItemsData from '../../../public/moviesfull.json'
import latestData from '../../../public/latest.json'
import { useEffect, useState, useRef } from 'react'
import Pagination from '../../../components/Pagination'
import AdultSkipAds from '../../../components/AdultSkipAds'
import GoogleTranslate from '../../../components/GoogleTranslate'
import SocialSharing from '../../../components/SocialSharing'
import SearchComponent from '../../../components/SearchComponent'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import HomeStyles from '@styles/styles.module.css'
import styles from '@styles/iframeStyles.module.css'

// Fetch data from tvshowzipItems.json
const fetchtvshowzipData = async () => {
  const response = await fetch('https://popcornfliks.vercel.app/moviesfull.json')
  return await response.json()
}

const getRandomLinks = (tvshowzipItems, count = 3) => {
  const shuffleArray = array => array.sort(() => 0.5 - Math.random())

  const getRandomItems = (data, count) => {
    const shuffled = shuffleArray(data)
    return shuffled.slice(0, count)
  }

  return [
    ...getRandomItems(tvshowzipItems, count)
    // ...getRandomItems(latest, count),
    // ...getRandomItems(adults, count),
    // ...getRandomItems(trailers, count)
  ]
}

// Function to get random links from each dataset
const tvshowzipDetail = ({ tvshowzipItem }) => {
  const router = useRouter()
  const { id } = router.query
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 0 // Assume there are 3 pages

  const [playerReady, setPlayerReady] = useState(false)
  const [showTimer, setShowTimer] = useState(false)
  const [seconds, setSeconds] = useState(30) // Example timer duration
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [accordionExpanded, setAccordionExpanded] = useState(false)
  const [iframeAccordionExpanded, setIframeAccordionExpanded] = useState(false)
  const playerRef = useRef(null)
  const currentIndexRef = useRef(0)
  // Determine the type of content (tvshowzipItem, tvshow, or adult)
  const isTVShow = tvshowzipItem.type === 'tvshow'
  const isAdult = tvshowzipItem.badgegroup === 'Adult'
  const [randomtvshowzipItems, setRandomtvshowzipItems] = useState([])
  const [linkTargets, setLinkTargets] = useState([])

  const enhancedParagraph = (text, tvshowzipItem) => {
    // Ensure tvshowzipItem and words are valid
    const words = Array.isArray(tvshowzipItem?.words) ? tvshowzipItem.words : []
    const videotvshowzipItems = tvshowzipItem?.videotvshowzipItems || ''
    const imdb = tvshowzipItem?.imdb || ''

    // Define link targets
    const linkTargets = [
      {
        text: words[0] || '', // Fallback to empty string if words[0] is undefined
        url: `https://www.imdb.com/title/${videotvshowzipItems || imdb}/`
      }
    ]

    // If imdb is defined, update the first link target for TV shows
    if (imdb) {
      linkTargets[0] = {
        text: words[0] || '',
        url: `https://www.imdb.com/title/${imdb}/`
      }
    }

    // Replace text with links
    linkTargets.forEach(linkTarget => {
      if (linkTarget.text) {
        const regex = new RegExp(`(${linkTarget.text})`, 'g')
        text = text.replace(
          regex,
          `<a href="${linkTarget.url}" class="text-blue-500 underline" target="_blank" rel="noopener noreferrer">${linkTarget.text}</a>`
        )
      }
    })

    return text
  }

  useEffect(() => {
    // Fetch the initial random links
    setLinkTargets(getRandomLinks(tvshowzipItemsData))

    // Update the links every 30 seconds
    const interval = setInterval(() => {
      setLinkTargets(getRandomLinks(tvshowzipItemsData))
    }, 30000) // 30 seconds in milliseconds

    return () => clearInterval(interval)
  }, [])

  // Function to fetch data and set state
  const fetchData = async () => {
    try {
      const response = await fetch('https://popcornfliks.vercel.app/moviesfull.json')
      const data = await response.json()

      // Get 6 random TV Series s
      const randomtvshowzipItemsData = getRandomItems(data, 5)
      setRandomtvshowzipItems(randomtvshowzipItemsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // useEffect to fetch data on component mount
  useEffect(() => {
    fetchData() // Initial fetch

    // Set interval to update trailers every 5 seconds
    const interval = setInterval(() => {
      fetchData()
    }, 10000)

    // Clean up interval on component unmount
    return () => clearInterval(interval)
  }, [])

  // Utility function to get random items from data
  const getRandomItems = (data, count) => {
    const shuffled = shuffleArray([...data]) // Create a copy and shuffle the array
    return shuffled.slice(0, count)
  }

  // Function to shuffle array items randomly
  const shuffleArray = array => {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      // And swap it with the current element.
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }

    return array
  }

  const handleDownloadClick = () => {
    setShowTimer(true)
    setSeconds(30) // Example timer duration
  }

  useEffect(() => {
    const detectMobileDevice = () => {
      const userAgent =
        typeof window.navigator === 'undefined' ? '' : navigator.userAgent
      const mobile = Boolean(
        userAgent.match(
          /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPtvshowzipItems/i
        )
      )
      setIsMobileDevice(mobile)
    }

    detectMobileDevice()
  }, [])

  useEffect(() => {
    let timer
    if (showTimer && seconds > 0) {
      timer = setTimeout(() => setSeconds(seconds - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [showTimer, seconds])

  useEffect(() => {
    let timer
    if (showTimer && accordionExpanded && seconds > 0) {
      timer = setInterval(() => {
        setSeconds(prevSeconds => (prevSeconds > 0 ? prevSeconds - 1 : 0))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [showTimer, accordionExpanded, seconds])

  const toggleAccordion = () => {
    setAccordionExpanded(prevState => !prevState)
    if (!accordionExpanded) {
      setSeconds(30) // Reset the timer when accordion is expanded
    }
  }

  const handleStartTimer = () => {
    setShowTimer(true)
    setAccordionExpanded(true)
  }
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)

  if (!tvshowzipItem) return <div>Loading...</div>

  const { videomovieitem, videomovies, image1 } = tvshowzipItem

  // Check if videomovies contains episode data
  const ismovies = videomovies[0] && videomovies[0].includes('/')

  // Extract current video data
  const currentVideoId = videomovieitem[currentEpisodeIndex]
  const currentVideoData = videomovies[currentEpisodeIndex] || {} // Ensure currentEpisodeIndex is within bounds

  // Default to episode 1 and season 1 if not defined
  const episode = ismovies ? currentVideoData.episode || 1 : null
  const season = ismovies ? currentVideoData.season || 1 : null

  // Construct video sources based on whether it's a TV show or a movie
  const videoSources = videomovies.map(item => {
    // Check if item contains episode data
    const isItemmovies = item.includes('/')
    const [id, itemSeason, itemEpisode] = isItemmovies
      ? item.split('/')
      : [item, null, null]

    return {
      name: isItemmovies ? `Episode ${itemEpisode}` : 'Movie',
      urls: [
        `https://short.ink/${currentVideoId}?thumbnail=${image1}`,
        isItemmovies
          ? `https://vidsrc.me/embed/tv?imdb=${id}&season=${itemSeason}&episode=${itemEpisode}`
          : `https://vidsrc.me/embed/movie?imdb=${id}`,
        isItemmovies
          ? `https://vidsrc.pro/embed/tv/${id}/${itemSeason}/${itemEpisode}`
          : `https://vidsrc.pro/embed/movie/${id}`,
        isItemmovies
          ? `https://vidsrc.cc/v2/embed/tv/${id}/${itemSeason}/${itemEpisode}`
          : `https://vidsrc.cc/v2/embed/movie/${id}`,
        isItemmovies
          ? `https://ffmovies.lol/series/?imdb=${id}`
          : `https://ffmovies.lol/movies/?imdb=${id}`,
        isItemmovies
          ? `https://autoembed.co/tv/imdb/${id}-${itemSeason}-${itemEpisode}`
          : `https://autoembed.co/movie/imdb/${id}`,
        isItemmovies
          ? `https://multiembed.mov/directstream.php?video_id=${id}&s=${itemSeason}&e=${itemEpisode}`
          : `https://multiembed.mov/directstream.php?video_id=${id}`
      ]
    }
  })

  const handleNextEpisode = () => {
    setCurrentEpisodeIndex(prevIndex => {
      const nextIndex = (prevIndex + 1) % videoSources.length
      console.log('Next Episode Index:', nextIndex)
      return nextIndex
    })
  }

  const handlePreviousEpisode = () => {
    setCurrentEpisodeIndex(prevIndex => {
      const newIndex =
        (prevIndex - 1 + videoSources.length) % videoSources.length
      console.log('Previous Episode Index:', newIndex)
      return newIndex
    })
  }

  const handlePlayerSelect = index => {
    setCurrentPlayerIndex(index)
  }

  // Ensure currentVideoSources is always valid
  const currentVideoSources = videoSources[currentEpisodeIndex]?.urls || []
  const src = currentVideoSources[currentPlayerIndex] || '' // Default to an empty string if not available

  const prevEpisodeNumber = episode - 1 < 1 ? videoSources.length : episode - 1
  const nextEpisodeNumber = (episode % videoSources.length) + 1

  const toggleIframeAccordion = () => {
    setIframeAccordionExpanded(prev => !prev)
  }

  const uwatchfreeSchema = JSON.stringify([
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Popcornflix???',
      url: 'https://popcornfliks.vercel.app/',
      image: ['https://popcornfliks.vercel.app/favicon.ico'],
      logo: {
        '@type': 'ImageObject',
        url: 'https://popcornfliks.vercel.app/logo.png',
        width: 280,
        height: 100
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: 'https://popcornfliks.vercel.app/',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://popcornfliks.vercel.app/search?q={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    }
  ])

  const breadcrumbSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Popcornflix???',
        item: 'https://popcornfliks.vercel.app/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'tvshowzipItems',
        item: tvshowzipItem.baseurl
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tvshowzipItem.name,
        item: tvshowzipItem.siteurl
      }
    ]
  })

  const rankMathSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Person', 'Organization'],
        '@id': 'https://gravatar.com/drtrailer2022/#person',
        name: 'Dr Trailer'
      },
      {
        '@type': 'WebSite',
        '@id': 'https://popcornfliks.vercel.app#website',
        url: 'https://popcornfliks.vercel.app',
        name: 'Popcornflix???',
        publisher: {
          '@id': 'https://gravatar.com/drtrailer2022/#person'
        },
        inLanguage: 'en-US'
      },
      {
        '@type': 'WebPage',
        '@id': `${tvshowzipItem.siteurl}#webpage`,
        url: tvshowzipItem.siteurl,
        name: `${tvshowzipItem.name} | Popcornflix???`,
        datePublished: tvshowzipItem.datePublished,
        dateModified: tvshowzipItem.dateModified,
        isPartOf: {
          '@id': 'https://popcornfliks.vercel.app#website'
        },
        inLanguage: 'en-US'
      },
      {
        '@type': 'Person',
        '@id': 'https://gravatar.com/drtrailer2022/',
        name: 'Dr Trailer',
        url: 'https://gravatar.com/drtrailer2022/',
        image: {
          '@type': 'ImageObject',
          '@id': 'https://gravatar.com/drtrailer2022',
          url: 'https://gravatar.com/drtrailer2022',
          caption: 'Dr Trailer',
          inLanguage: 'en-US'
        },
        sameAs: ['https://popcornfliks.vercel.app']
      },
      {
        '@type': 'Article',
        '@id': `${tvshowzipItem.siteurl}#article`,
        headline: ` ${tvshowzipItem.name} | Popcornflix???`,
        datePublished: tvshowzipItem.datePublished,
        dateModified: tvshowzipItem.dateModified,
        articleSection: 'tvshowzipItems',
        author: {
          '@id': 'https://gravatar.com/drtrailer2022/'
        },
        publisher: {
          '@id': 'https://gravatar.com/drtrailer2022/#person'
        },
        description: tvshowzipItem.synopsis,
        image: tvshowzipItem.image,
        name: ` ${tvshowzipItem.name} | Popcornflix???`,
        isPartOf: {
          '@id': `${tvshowzipItem.siteurl}#webpage`
        },
        inLanguage: 'en-US',
        mainEntityOfPage: {
          '@id': `${tvshowzipItem.siteurl}#webpage`
        }
      },
      {
        '@type': 'BlogPosting',
        '@id': `${tvshowzipItem.siteurl}#blogPost`,
        headline: ` ${tvshowzipItem.name} | Popcornflix???`,
        datePublished: tvshowzipItem.datePublished,
        dateModified: tvshowzipItem.dateModified,
        articleSection: 'tvshowzipItems',
        author: {
          '@id': 'https://gravatar.com/drtrailer2022/'
        },
        publisher: {
          '@id': 'https://gravatar.com/drtrailer2022/#person'
        },
        description: tvshowzipItem.synopsis,
        image: tvshowzipItem.image,
        name: ` ${tvshowzipItem.name} | Popcornflix???`,
        '@id': `${tvshowzipItem.siteurl}#richSnippet`,
        isPartOf: {
          '@id': `${tvshowzipItem.siteurl}#webpage`
        },
        inLanguage: 'en-US',
        mainEntityOfPage: {
          '@id': `${tvshowzipItem.siteurl}#webpage`
        }
      }
    ]
  })

  const newsArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${tvshowzipItem.siteurl}#webpage`, // Add a comma here
    name: tvshowzipItem.title,
    url: tvshowzipItem.siteurl,
    description: tvshowzipItem.synopsis,
    image: tvshowzipItem.image,
    datePublished: tvshowzipItem.startDate,
    potentialAction: {
      '@type': 'WatchAction',
      target: {
        '@type': 'EntryPoint',
        name: tvshowzipItem.title,
        urlTemplate: tvshowzipItem.siteurl
      }
    },
    locationCreated: {
      '@type': 'Place',
      name: tvshowzipItem.country
    },
    author: {
      '@type': 'Person',
      name: 'DrTrailer',
      url: 'https://gravatar.com/drtrailer2022'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Popcornflix???',
      logo: {
        '@type': 'ImageObject',
        url: 'https://popcornfliks.vercel.app/og_image.jpg'
      }
    },
    additionalProperty: {
      '@type': 'PropertyValue',
      name: 'Action Platform',
      value: ['Desktop Web Platform', 'iOS Platform', 'Android Platform']
    }
  }

  // Convert newsArticleSchema and videoObjects to JSON strings
  const newsArticleJson = JSON.stringify(newsArticleSchema)

  const ldJsonData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'tvshowzipItem',
    '@id': `${tvshowzipItem.siteurl}`,
    name: tvshowzipItem.title,
    url: tvshowzipItem.siteurl,
    description: tvshowzipItem.synopsis,
    image: tvshowzipItem.image,
    genre: tvshowzipItem.genre,
    datePublished: tvshowzipItem.datePublished,
    director: {
      '@type': 'Person',
      name: tvshowzipItem.directorname
    },
    actor: tvshowzipItem.starring.map(actor => ({
      '@type': 'Person',
      name: actor
    })),
    potentialAction: {
      '@type': 'WatchAction',
      target: {
        '@type': 'EntryPoint',
        name: tvshowzipItem.title,
        urlTemplate: tvshowzipItem.siteurl
      }
    },
    locationCreated: {
      '@type': 'Place',
      name: tvshowzipItem.country
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      '@id': tvshowzipItem.siteurl,
      ratingValue: 8,
      ratingCount: 5,
      bestRating: '10',
      worstRating: '1'
    },
    author: {
      '@type': 'Person',
      name: 'DrTrailer',
      url: 'https://gravatar.com/drtrailer2022'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Popcornflix???',
      logo: {
        '@type': 'ImageObject',
        url: 'https://popcornfliks.vercel.app/og_image.jpg'
      }
    },
    additionalProperty: {
      '@type': 'PropertyValue',
      name: 'Action Platform',
      value: ['Desktop Web Platform', 'iOS Platform', 'Android Platform']
    }
  })

  const tvshowzipItemsSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: tvshowzipItem.title,
    description: tvshowzipItem.text,
    uploadDate: tvshowzipItem.datePublished,
    thumbnailUrl: tvshowzipItem.image1,
    duration: 'P34S', // Replace with the actual duration if it's different
    embedUrl: tvshowzipItem.videourl
  })

  return (
    <div>
      <Head>
        {/* Existing meta tags */}
        <meta
          name='robots'
          content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        />
        <title> {tvshowzipItem.name} | Popcornflix???</title>
        <link rel='canonical' href={tvshowzipItem && tvshowzipItem.siteurl} />
        <meta name='robots' content='index, follow' />
        <meta name='googlebot' content='index,follow' />
        <meta name='revisit-after' content='1 days' />
        <meta property='og:locale' content='en_US' />
        <meta
          property='og:title'
          content={`${tvshowzipItem && tvshowzipItem.name} - Popcornflix???`}
        />
        <meta
          property='og:description'
          content='Stream HD tvshowzipItems and TV series for free on Popcornflix???. Online. Stream. Download. full-length tvshowzipItems and shows in HD quality without registration.'
        />
        <meta
          name='description'
          content={`${tvshowzipItem.title} available on Popcornflix???. Enjoy free streaming of full-length tvshowzipItems and TV series online with no registration required.`}
        />
        <meta
          property='og:url'
          content={`${tvshowzipItem && tvshowzipItem.siteurl}`}
        />
        <meta
          name='keywords'
          content={`${tvshowzipItem && tvshowzipItem.keywords}`}
        />
        <meta property='og:site_name' content='Popcornflix???' />
        <meta
          property='og:image:alt'
          content={`${tvshowzipItem && tvshowzipItem.name}`}
        />
        <meta
          property='og:image'
          fetchpriority='high'
          as='image'
          content={tvshowzipItem.image1}
        />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta property='article:section' content='tvshowzipItems' />
        <meta name='author' content='admin' />
        <meta
          property='article:modified_time'
          content='2024-01-01T13:13:13+00:00'
        />
        <meta property='og:type' content='video.tvshowzipItem' />
        {/* Specific to the tvshowzipItem page */}
        <meta property='og:video' content={tvshowzipItem.videourl} />
        <meta property='og:video:type' content='video/mp4' />
        <meta property='og:video:width' content='1280' />
        <meta property='og:video:height' content='720' />
        <meta property='og:image' content={tvshowzipItem.image1} />

        {/* Specify that this page is part of a website */}
        {/* <meta property='og:type' content='website' />{' '} */}
        {/* Specify the overall website context */}
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
        <meta property='og:image:type' content='image/webp' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta
          name='twitter:title'
          content='Popcornflix??? - Explore. Discover. Online.'
        />
        <meta
          name='twitter:description'
          content='Stream HD tvshowzipItems and TV series for free on Popcornflix???. Online. Stream. Download. full-length tvshowzipItems and shows in HD quality without registration.'
        />
        <meta
          name='twitter:image'
          content={`${tvshowzipItem && tvshowzipItem.image1}`}
        />
        <meta name='twitter:label1' content='Est. reading time' />
        <meta name='twitter:data1' content='1 minute' />
        <meta name='google-site-verification' content='o8uNsADswyHnNPA69n9gI7u6L4_cdjN4iT5lRhHHtMU' />
        <meta
          name='facebook-domain-verification'
          content='du918bycikmo1jw78wcl9ih6ziphd7'
        />
        <meta
          name='dailymotion-domain-verification'
          content='dmv6sg06w9r5eji88'
        />
        {/* Structured Data */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite', // Specify that this is a website
              name: 'Popcornflix???',
              url: `${tvshowzipItem && tvshowzipItem.siteurl}`,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${tvshowzipItem.siteurl}/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string'
              }
            })
          }}
        />
        {/* Existing structured data */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: ldJsonData }}
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: uwatchfreeSchema }}
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: rankMathSchema }}
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: newsArticleJson }}
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: tvshowzipItemsSchema }}
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: breadcrumbSchema }}
        />
      </Head>

      <SocialSharing />
      {isAdult && <AdultSkipAds tvshowzipItem={tvshowzipItem} />}
      {/* <Script src='../../propler/ads.js' defer />
      <Script src='../../propler/ads2.js' defer /> */}

      <div
        className={`w-full`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 500,
          textAlign: 'center',
          // backgroundColor: '#D3D3D3'
          backgroundColor: '#000'
        }}
      >
        <GoogleTranslate />
      </div>
      <div
        className={`w-full`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '20px',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 500,
          textAlign: 'center',
          // backgroundColor: '#D3D3D3'
          backgroundColor: '#000'
        }}
      >
        {/* TV Show Description */}
        {isTVShow && (
          <>
            <h2 className='px-0 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-2xl hover:text-blue-800 font-bold mt-2'>
              {tvshowzipItem.title} Online - Stream Your Favorite TV Series
            </h2>
            <p className='text-lg text-yellow-500 mt-4'>
              Explore the captivating world of{' '}
              <strong>{tvshowzipItem.title}</strong>, the TV series that has
              everyone talking. At
              <strong> Popcornflix???</strong>, you can stream{' '}
              <strong>{tvshowzipItem.title}</strong> and immerse yourself in its
              exciting episodes, whether you're catching up on past seasons or
              tuning in to the latest releases. Our platform offers a seamless
              streaming experience, making it easy to watch your favorite TV
              series online.
            </p>
            <p className='text-lg text-yellow-500 mt-4'>
              Streaming <strong>{tvshowzipItem.title}</strong> on{' '}
              <strong>Popcornflix???</strong> ensures that you won't miss a single
              moment of the action, drama, or comedy that makes this TV series a
              must-watch. With high-quality streaming and user-friendly
              navigation, <strong>Popcornflix???</strong> provides everything you
              need to enjoy <strong>{tvshowzipItem.title}</strong>
              and other top TV series. Our library is frequently updated, so you
              can always find the latest episodes as soon as they air.
            </p>
            <p className='text-lg text-yellow-500 mt-4'>
              Whether you're binge-watching or following along weekly,{' '}
              <strong>{tvshowzipItem.title}</strong> on{' '}
              <strong>Popcornflix???</strong> is your go-to destination for
              streaming TV series online. Join our community of viewers and
              start watching <strong>{tvshowzipItem.title}</strong> today. With{' '}
              <strong>Popcornflix???</strong>, your favorite TV series is just a
              click away.
            </p>
          </>
        )}

        {/* Adult Content Description */}
        {isAdult && (
          <>
            <h2 className='px-0 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-2xl hover:text-blue-800 font-bold mt-2'>
              {tvshowzipItem.title} Online - Stream Premium Adult Content
            </h2>
            <p className='text-lg text-yellow-500 mt-4'>
              Indulge in the finest selection of adult entertainment with{' '}
              <strong>{tvshowzipItem.title}</strong>. At{' '}
              <strong>Popcornflix???</strong>, we offer a vast library of premium
              adult content, including the latest and most popular titles like{' '}
              <strong>{tvshowzipItem.title}</strong>. Our platform is designed
              for those who seek high-quality, discreet streaming of adult
              films, ensuring a seamless and private viewing experience.
            </p>
            <p className='text-lg text-yellow-500 mt-4'>
              Streaming <strong>{tvshowzipItem.title}</strong> on{' '}
              <strong>Popcornflix???</strong> provides you with a user-friendly
              interface and crystal-clear video quality. Our adult content is
              regularly updated, giving you access to new releases as soon as
              they become available. Whether you're exploring new genres or
              returning to your favorites,{' '}
              <strong>{tvshowzipItem.title}</strong>
              and other top titles are available at your fingertips.
            </p>
            <p className='text-lg text-yellow-500 mt-4'>
              For a premium experience in adult entertainment, look no further
              than <strong>{tvshowzipItem.title}</strong> on{' '}
              <strong>Popcornflix???</strong>. Our platform ensures your privacy
              and security while you enjoy the content you love. Start streaming{' '}
              <strong>{tvshowzipItem.title}</strong> today and discover why{' '}
              <strong>Popcornflix???</strong> is the trusted choice for adult
              content.
            </p>
          </>
        )}

        {/* tvshowzipItem Description (Default) */}
        {!isTVShow && !isAdult && (
          <>
            <h2 className='px-0 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-2xl  font-bold mt-2'>
              {tvshowzipItem.title} Online and Experience Top-Tier Streaming
            </h2>
            <p className='text-lg text-yellow-500 mt-4'>
              Dive into the world of cinema with{' '}
              <strong>{tvshowzipItem.title}</strong>, available to stream right
              here. At <strong>Popcornflix???</strong>, we bring you the best in
              entertainment, offering an extensive library of tvshowzipItems and
              TV shows, including the latest blockbusters like{' '}
              <strong>{tvshowzipItem.title}</strong>. Whether you're a fan of
              action, drama, comedy, or any other genre, you'll find exactly
              what you're looking for.
            </p>
            <p className='text-lg text-yellow-500 mt-4'>
              Streaming <strong>{tvshowzipItem.title}</strong> on{' '}
              <strong>Popcornflix???</strong> guarantees a seamless viewing
              experience with high-definition quality and uninterrupted
              playback. Our platform is designed to make it easy for you to
              discover and enjoy your favorite films. With regularly updated
              content, you will always have access to the newest releases,
              ensuring you can watch <strong>{tvshowzipItem.title}</strong> and
              other top titles as soon as they're available.
            </p>
            <p className='text-lg text-yellow-500 mt-4'>
              Whether you're revisiting a classic or catching a new release,{' '}
              <strong>{tvshowzipItem.title}</strong> on{' '}
              <strong>Popcornflix???</strong> is the perfect way to enjoy your
              tvshowzipItem night. Join the countless users who trust us for
              their streaming needs and start watching{' '}
              <strong>{tvshowzipItem.title}</strong> online today. At{' '}
              <strong>Popcornflix???</strong>, your entertainment is just a click
              away.
            </p>
          </>
        )}
        {/* </div> */}
        <a
          href='https://t.me/watchtvshowzipItemtvshow/'
          target='_blank'
          rel='noopener noreferrer'
          className='telegram-link'
          style={{ display: 'block', textAlign: 'center', margin: '0 auto' }}
        >
          <p style={{ display: 'inline-block' }}>
            For Request or Demand <br />
            tvshowzipItems & TV Series Join Telegram
            <i className='fab fa-telegram telegram-icon'></i>
          </p>
        </a>
        <span className='px-0 bg-clip-text text-sm text-black font-bold mt-2'>
          <SearchComponent />
        </span>
        <div
          className={`w-full`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
            textAlign: 'center',
            // backgroundColor: '#D3D3D3'
            backgroundColor: '#000'
          }}
        >
          <div className='flex-container'>
            <div className='category-container'>
              <Image
                src={tvshowzipItem.image}
                alt={tvshowzipItem.title}
                width={300}
                height={300}
                quality={90}
                loading='lazy'
                style={{
                  width: '400px', // Ensures the image is displayed at this width
                  height: '500px', // Ensures the image is displayed at this height
                  objectFit: 'cover',
                  margin: 'auto',
                  marginTop: '50px',
                  marginBottom: '20px',
                  borderRadius: '50px',
                  boxShadow: '0 0 10px 0 #000',
                  filter:
                    'contrast(1.1) saturate(1.1) brightness(1.0) hue-rotate(0deg)'
                }}
              />
              <div
                style={{
                  maxWidth: '800px',
                  width: '100%',
                  marginBottom: '20px'
                }}
              >
                <div
                  style={{
                    maxWidth: '800px',
                    width: '100%',
                    marginBottom: '20px'
                  }}
                >
                  <h2 className='bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-bg font-semibold mt-2'>
                    Genre: {tvshowzipItem.genre}
                  </h2>
                  <h2 className='bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-bg font-semibold mt-2'>
                    Director: {tvshowzipItem.directorname}
                  </h2>
                  <h2 className='bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-bg font-semibold mt-2'>
                    Starring: {tvshowzipItem.starring}
                  </h2>
                  <h2 className='bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-bg font-semibold mt-2'>
                    Origin Country: {tvshowzipItem.country}
                  </h2>
                  <h2 className='bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-bg font-semibold mt-2'>
                    Language: {tvshowzipItem.language}
                  </h2>

                  <h2 className='bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-bg font-semibold mt-2'>
                    Total Episodes: {tvshowzipItem.episode}
                  </h2>
                  <div className='bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-bg font-semibold mt-2'>
                    Synopsis :-
                    {tvshowzipItem.text &&
                      tvshowzipItem.text.split('\n\n').map((paragraph, idx) => (
                        <p
                          key={idx}
                          style={{
                            marginBottom: '10px',
                            fontFamily: 'Poppins, sans-serif'
                          }}
                          dangerouslySetInnerHTML={{
                            __html: enhancedParagraph(paragraph, tvshowzipItem) // Pass tvshowzipItem here
                          }}
                        />
                      ))}
                  </div>

                  <div className={`${HomeStyles.imageGrid} mt-5`}>
                    <img
                      className={`${HomeStyles.image} img-fluid lazyload image`} // "image" class applies your CSS
                      src={tvshowzipItem.directorimg}
                      alt={tvshowzipItem.directorname}
                      title={tvshowzipItem.directorname}
                      quality={90}
                      style={{
                        objectFit: 'cover', // Ensures the image covers the container
                        boxShadow: '0 0 10px 0 #000', // Shadow effect with black color
                        filter:
                          'contrast(1.2) saturate(1.3) brightness(1.1) hue-rotate(0deg)' // Image filter
                      }}
                      loading='lazy'
                      layout='responsive'
                    />

                    <img
                      className={`${HomeStyles.image} img-fluid lazyload `}
                      src={tvshowzipItem.actor1img}
                      alt={tvshowzipItem.actor1}
                      title={tvshowzipItem.actor1}
                      quality={90}
                      style={{
                        objectFit: 'cover', // Ensures the image covers the container
                        boxShadow: '0 0 10px 0 #000', // Shadow effect with black color
                        filter:
                          'contrast(1.2) saturate(1.3) brightness(1.1) hue-rotate(0deg)' // Image filter
                      }}
                      loading='lazy'
                      layout='responsive'
                    />
                    <img
                      className={`${HomeStyles.image} img-fluid lazyload `}
                      src={tvshowzipItem.actor2img}
                      alt={tvshowzipItem.actor2}
                      title={tvshowzipItem.actor2}
                      quality={90}
                      style={{
                        objectFit: 'cover', // Ensures the image covers the container
                        boxShadow: '0 0 10px 0 #000', // Shadow effect with black color
                        filter:
                          'contrast(1.2) saturate(1.3) brightness(1.1) hue-rotate(0deg)' // Image filter
                      }}
                      loading='lazy'
                      layout='responsive'
                    />
                    <img
                      className={`${HomeStyles.image} img-fluid lazyload `}
                      src={tvshowzipItem.actor3img}
                      alt={tvshowzipItem.actor3}
                      title={tvshowzipItem.actor3}
                      quality={90}
                      style={{
                        objectFit: 'cover', // Ensures the image covers the container
                        boxShadow: '0 0 10px 0 #000', // Shadow effect with black color
                        filter:
                          'contrast(1.2) saturate(1.3) brightness(1.1) hue-rotate(0deg)' // Image filter
                      }}
                      loading='lazy'
                      layout='responsive'
                    />
                    <img
                      className={`${HomeStyles.image} img-fluid lazyload `}
                      src={tvshowzipItem.actor4img}
                      alt={tvshowzipItem.actor4}
                      title={tvshowzipItem.actor4}
                      quality={90}
                      style={{
                        objectFit: 'cover', // Ensures the image covers the container
                        boxShadow: '0 0 10px 0 #000', // Shadow effect with black color
                        filter:
                          'contrast(1.2) saturate(1.3) brightness(1.1) hue-rotate(0deg)' // Image filter
                      }}
                      loading='lazy'
                      layout='responsive'
                    />
                    <img
                      className={`${HomeStyles.image} img-fluid lazyload `}
                      src={tvshowzipItem.actor5img}
                      alt={tvshowzipItem.actor5}
                      title={tvshowzipItem.actor5}
                      quality={90}
                      style={{
                        objectFit: 'cover', // Ensures the image covers the container
                        boxShadow: '0 0 10px 0 #000', // Shadow effect with black color
                        filter:
                          'contrast(1.2) saturate(1.3) brightness(1.1) hue-rotate(0deg)' // Image filter
                      }}
                      loading='lazy'
                      layout='responsive'
                    />
                  </div>
                  <h2 className='px-0 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-4xl hover:text-blue-800 font-bold mt-2'>
                    Watch Official Trailer {tvshowzipItem.name}
                  </h2>

                  <main style={{ width: '100%', display: 'block' }}>
                    <section>
                      <div className={styles.iframeWrapper}>
                        <div className={styles.iframeContainer}>
                          <iframe
                            className={styles.iframe}
                            frameBorder='0'
                            src={`https://geo.dailymotion.com/player/xjrxe.html?video=${tvshowzipItem.traileritem}&mute=true&Autoquality=1080p`}
                            allowFullScreen
                            title='Dailymotion Video Player'
                            allow='autoplay; encrypted-media'
                          ></iframe>
                        </div>
                      </div>
                    </section>
                  </main>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    route='home'
                    style={{
                      marginTop: '50px',
                      marginBottom: '50px',
                      borderRadius: '50px',
                      boxShadow: '0 0 10px 0 #fff',
                      filter:
                        'contrast(1.0) saturate(1.0) brightness(1.0) hue-rotate(0deg)'
                    }}
                  />
                  <h1
                    className='px-0 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-3xl hover:text-blue-800 font-bold mt-2'
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 'bold',
                      marginTop: '50px',
                      marginBottom: '50px'
                    }}
                  >
                    {tvshowzipItem.title}
                  </h1>

                  {/* Button to toggle iframe */}
                  <button
                    onClick={toggleIframeAccordion}
                    className='text-black bg-gradient-to-r from-pink-500 to-amber-500 font-bold py-3 px-6 rounded-lg shadow-lg hover:from-amber-600 hover:to-pink-600 transition duration-300 text-3xl'
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 'bold',
                      marginTop: '50px',
                      marginBottom: '50px'
                    }}
                  >
                    {iframeAccordionExpanded ? 'Close Now' : 'Click to Watch'}
                  </button>
                  {/* Conditional rendering of Next Episode button */}
                  {ismovies && !isAdult && iframeAccordionExpanded && (
                    <div className='flex flex-col items-center mb-4'>
                      <button
                        onClick={handleNextEpisode}
                        disabled={videoSources.length === 0}
                        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-4 text-xl hover:text-green-600 font-bold mt-2'
                      >
                        Next Episode
                      </button>
                    </div>
                  )}

                  {/* Container for the iframe */}
                  {iframeAccordionExpanded && (
                    <>
                      <div className={styles.container}>
                        <div className={styles.iframeContainer}>
                          <iframe
                            className={styles.iframe}
                            src={src}
                            allowFullScreen
                            scrolling='no'
                            title='Video Player'
                          ></iframe>
                        </div>
                      </div>

                      <p
                        className='text-black text-bg font-black bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-sm'
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          textShadow: '1px 1px 1px 0 #fff',
                          filter:
                            'contrast(1.2) saturate(1.3) brightness(1.1) hue-rotate(15deg)'
                        }}
                      >
                        *Note: Use Settings in Player to improve the Quality of
                        video to HD Quality 1080p.
                      </p>

                      {/* Conditional rendering of Previous Episode button */}
                      {ismovies && !isAdult && (
                        <div className='flex flex-col items-center mb-4'>
                          <button
                            onClick={handlePreviousEpisode}
                            disabled={videoSources.length === 0}
                            className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-xl hover:text-blue-600 font-bold mt-2'
                            style={{ marginTop: '10px', marginBottom: '10px' }}
                          >
                            Previous Episode
                          </button>
                        </div>
                      )}

                      <h2
                        className='px-0 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-4xl hover:text-blue-800 font-bold mt-2'
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        Select Player To Watch.
                      </h2>

                      <div className='flex flex-col items-center mt-4 gap-2'>
                        <div className='flex flex-wrap justify-center mb-4 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text hover:text-blue-800 text-bg font-semibold mt-2'>
                          {currentVideoSources.map((source, index) => (
                            <button
                              key={index}
                              onClick={() => handlePlayerSelect(index)}
                              className={`mx-2 my-1 px-4 py-2 rounded ${
                                currentPlayerIndex === index
                                  ? 'bg-red-500 text-white'
                                  : 'bg-gray-200 text-black'
                              } hover:bg-green-500 hover:text-white transition duration-300 ease-in-out`}
                              style={{
                                border: 'none',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                padding: '10px 20px',
                                margin: '5px'
                              }}
                            >
                              Player {index + 1}
                            </button>
                          ))}
                        </div>

                        <div className='flex flex-col items-center justify-center'>
                          {/* Render the button for Season 2 if linkurl exists */}
                          {tvshowzipItem.linkurl && (
                            <Link href={tvshowzipItem.linkurl}>
                              <div
                                className={`px-4 py-2 border rounded mx-2 my-1 ${
                                  tvshowzipItem.linkurl
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-200'
                                } hover:bg-green-700 hover:text-white`}
                                style={{
                                  fontFamily: 'Poppins, sans-serif',
                                  marginTop: '20px',
                                  filter:
                                    'contrast(1.2) saturate(1.3) brightness(1.1) hue-rotate(15deg)'
                                }}
                              >
                                Click to Watch Next Season
                              </div>
                            </Link>
                          )}
                          {/* Render the button for Season 1 if linkurl2 exists */}
                          {tvshowzipItem.linkurl2 && (
                            <Link href={tvshowzipItem.linkurl2}>
                              <div
                                className={`px-4 py-2 border rounded mx-2 my-1 ${
                                  tvshowzipItem.linkurl2
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-200'
                                } hover:bg-green-700 hover:text-white`}
                                style={{
                                  fontFamily: 'Poppins, sans-serif',
                                  marginTop: '20px',
                                  filter:
                                    'contrast(1.2) saturate(1.3) brightness(1.1) hue-rotate(15deg)'
                                }}
                              >
                                Click to Watch Previous Season
                              </div>
                            </Link>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <div className={styles.container}>
                    <h2
                      className='px-0 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-3xl hover:text-blue-800 font-bold mt-2'
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      Click to Download {tvshowzipItem.name}
                    </h2>

                    {/* <div className='flex flex-col items-center justify-center'></div>

                  {tvshowzipItem.mp3player && <MP3Player mp3Url={tvshowzipItem.mp3player} />} */}

                    <div
                      className='flex flex-col items-center justify-center'
                      style={{
                        marginTop: '50px',
                        marginBottom: '50px'
                      }}
                    >
                      {!showTimer ? (
                        <button
                          onClick={handleStartTimer}
                          className='animate-pulse bg-gradient-to-r from-amber-500 to-pink-500 text-black font-bold py-3 px-6 rounded-lg shadow-lg hover:from-amber-600 hover:to-pink-600 transition duration-300 text-2xl'
                        >
                          Download Now
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={toggleAccordion}
                            className='animate-pulse bg-gradient-to-r from-pink-500 to-amber-500 font-bold py-3 px-6 rounded-lg shadow-lg hover:from-amber-600 hover:to-pink-600 transition duration-300 text-2xl'
                            style={{
                              marginBottom: '20px'
                            }}
                          >
                            {accordionExpanded
                              ? 'Click to Stop Download'
                              : 'Download Now'}
                          </button>

                          {accordionExpanded && (
                            <>
                              <div className={styles.container}>
                                {seconds > 0 ? (
                                  <p
                                    className='bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-2xl font-bold mb-4'
                                    style={{ marginTop: '50px' }}
                                  >
                                    Your download link will be ready in{' '}
                                    {seconds} seconds...
                                  </p>
                                ) : (
                                  <p
                                    className='bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-2xl font-bold mb-4'
                                    style={{ marginTop: '50px' }}
                                  >
                                    Your download links are ready.
                                  </p>
                                )}
                              </div>

                              {seconds === 0 && (
                                <div>
                                  {Object.keys(tvshowzipItem)
                                    .filter(key =>
                                      key.startsWith('downloadlink')
                                    )
                                    .map((key, index) => (
                                      <Link
                                        key={index}
                                        href={tvshowzipItem[key]}
                                        target='_blank'
                                      >
                                        <div
                                          className='bg-gradient-to-r from-amber-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-amber-600 hover:to-pink-600 transition duration-300'
                                          style={{
                                            margin: 'auto',
                                            marginTop: '50px',
                                            borderRadius: '50px',
                                            boxShadow: '0 0 10px 0 #fff',
                                            filter:
                                              'contrast(1.1) saturate(1.2) brightness(1.3) hue-rotate(0deg)'
                                          }}
                                        >
                                          <span
                                            className='animate-pulse'
                                            style={{
                                              color:
                                                key === 'downloadlink1'
                                                  ? '#FF0000'
                                                  : '#0efa06',
                                              fontSize: '24px',
                                              textShadow: '3px 5px 5px #000'
                                            }}
                                          >
                                            <i
                                              className={
                                                key === 'downloadlink1'
                                                  ? 'fa fa-magnet'
                                                  : 'fa fa-download'
                                              }
                                              aria-hidden='true'
                                            ></i>{' '}
                                          </span>
                                          Download {index + 1}
                                        </div>
                                      </Link>
                                    ))}
                                </div>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='sidebar'>
              <h2
                className='bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-3xl font-bold mt-2'
                style={{
                  marginTop: '15px'
                }}
              >
                Most Latest Uploaded
                <p
                  className='bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-3xl font-bold mt-2'
                  style={{
                    marginTop: '15px'
                  }}
                >
                  Movies & TV Series & Adult.
                </p>
              </h2>
              <div className='categorylatest-container'>
                <div className='cardlatest-container'>
                  {randomtvshowzipItems.map(tvshowzipItems => (
                    <div key={tvshowzipItems.id} className='cardlatest'>
                      <a href={tvshowzipItems.siteurl} id={tvshowzipItems.id}>
                        <div className='relative'>
                          <img
                            src={tvshowzipItems.image}
                            alt={tvshowzipItems.title}
                            className='rounded-lg mx-auto'
                            width={1280}
                            height={720}
                            quality={90}
                            loading='lazy'
                            style={{
                              marginTop: '10px',
                              width: '1280px', // Ensures the image is displayed at this width
                              height: '350px', // Ensures the image is displayed at this height
                              boxShadow: '0 0 10px 0 #000',
                              filter:
                                'contrast(1.1) saturate(1.1) brightness(1.0) hue-rotate(0deg)'
                            }}
                          />
                          <h2 className='bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-xl font-semibold mt-2'>
                            {tvshowzipItems.name}
                          </h2>
                          {/* <h3 className='bg-gradient-to-r from-pink-700 to-blue-700 bg-clip-text text-transparent text-bg font-semibold mt-2'>
                          {tvshowzipItems.text}
                        </h3> */}
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          /* Global styles */
          body {
            font-family: 'Poppins', sans-serif;
            font-weight: 400;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }

          .section-title {
            color: #000;
            font-weight: bold;
            font-size: 30px;
            text-shadow: 3px 5px 5px #000;
            margin-bottom: 20px;
          }

          .flex-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
          }

          .category-container {
            flex-grow: 1; /* Take remaining space */
            margin-top: 40px;
            width: calc(50% - 10px); /* Adjust width to leave space between */
          }
          .categorylatest-container {
            flex-grow: 1; /* Take remaining space */
            margin-top: 40px;
            width: calc(100% - 0px); /* Adjust width to leave space between */
          }

          .card-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
          }
          .cardlatest-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
          }

          .card {
            width: 100%; /* Card width will automatically adapt */
            max-width: 100%; /* Limit max width for larger screens */
            // border: 1px solid #ccc;
            border-radius: 8px;
            overflow: hidden;
          }
          .cardlatest {
            width: 100%; /* Card width will automatically adapt */
            max-width: 100%; /* Limit max width for larger screens */
            // border: 1px solid #ccc;
            border-radius: 8px;
            overflow: hidden;
          }

          .relative {
            position: relative;
          }

          .badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: rgba(0, 0, 0, 0.4);
            color: #000;
            padding: 5px;
            border-radius: 5px;
            font-weight: bold;
          }

          .card img {
            width: 100%;
            height: auto;
            object-fit: cover;
            border-radius: 8px;
          }

          .text-center {
            text-align: center;
          }

          // h1 {
          //   // color: #fff;
          //   font-weight: bold;
          //   // text-shadow: 3px 5px 5px #000;
          //   margin-bottom: 10px;
          //   font-size: 30px; /* Corrected property */
          //   line-height: 1; /* Optional: Adjust line height if needed */
          //   height: 30px; /* Set the desired height */
          // }

          .sidebar {
            width: calc(40% - 10px); /* Adjust width to leave space between */
            padding: 20px;
            // border: 1px solid #ccc;
            border-radius: 8px;
            margin-top: 40px;
          }

          @media (max-width: 768px) {
            .flex-container {
              flex-direction: column; /* Stack items vertically on smaller screens */
            }

            .category-container,
            .sidebar {
              width: 100%; /* Make both full width on smaller screens */
            }

            .sidebar {
              margin-top: 20px;
            }
          }
          .telegram-link {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: bold;
            background: linear-gradient(to right, #ff7e5f, #feb47b);
            background-clip: text;
            color: transparent;
            margin-top: 25px;
          }

          .telegram-icon {
            color: #0088cc;
            margin-left: 10px;
            font-size: 2rem;
            animation: pulse 1.5s infinite;
          }

          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }

          @media (min-width: 768px) {
            .title {
              font-size: 2rem;
            }

            .highlight {
              font-size: 2rem;
            }

            .telegram-link {
              font-size: 2rem;
            }
          }

          @media (min-width: 1024px) {
            .title {
              font-size: 2.5rem;
            }

            .highlight {
              font-size: 2.5rem;
            }

            .telegram-link {
              font-size: 2.5rem;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

export async function getStaticPaths () {
  const paths = tvshowzipData.map(item => ({
    params: { id: item.id }
  }))

  return { paths, fallback: false }
}

export async function getStaticProps ({ params }) {
  const tvshowzipItem = tvshowzipData.find(item => item.id === params.id)
  return { props: { tvshowzipItem } }
}
export default tvshowzipDetail
