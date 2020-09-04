import { AppProps } from 'next/app';
import '../styles/index.css';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />;
}

export default MyApp;
