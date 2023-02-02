import { Helmet } from 'react-helmet-async';

const APP_TITLE = 'Neatbox';
const DESCRIPTION_FALLBACK = 'You share, we lock!';

const getTitle = (pageTitle?: string) => (pageTitle ? `${pageTitle} | ${APP_TITLE}` : APP_TITLE);
const getDescription = (pageDescription?: string) => pageDescription ?? DESCRIPTION_FALLBACK;

type Props = { pageTitle?: string; pageDescription?: string; rootMetadata?: boolean };

const SEO = ({ pageTitle, pageDescription, rootMetadata }: Props) => {
  const title = getTitle(pageTitle);
  const description = getDescription(pageDescription);

  /** Only update relevant metadata */
  if (!rootMetadata) {
    return (
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@NeatboxHQ" />
        <meta name="twitter:creator" content="@NeatboxHQ" />
        <meta name="twitter:description" content={description} />
        {/* <meta name="twitter:image" content="https://" /> */}

        <meta property="og:url" content="https://topas.city" />
        <meta property="og:site_name" content={APP_TITLE} />
        <meta property="og:title" content={APP_TITLE} />
        <meta property="og:description" content={description} />
        {/* <meta property="og:image" content="https://" /> */}
      </Helmet>
    );
  }

  /** Set all metadata */
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="msapplication-TileColor" content="#00aba9" />
      <meta name="theme-color" content="#ffffff" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@NeatboxHQ" />
      <meta name="twitter:creator" content="@NeatboxHQ" />
      <meta name="twitter:description" content={description} />
      {/* <meta name="twitter:image" content="https://" /> */}

      <meta property="og:url" content="https://topas.city" />
      <meta property="og:site_name" content={APP_TITLE} />
      <meta property="og:title" content={APP_TITLE} />
      <meta property="og:description" content={description} />
      {/* <meta property="og:image" content="https://" /> */}
    </Helmet>
  );
};

export default SEO;
