import { GetStaticProps } from 'next';
import Head from 'next/head';

import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

import styles from '../styles/home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.News</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the
            <span>React</span> world.
          </h1>
          <p>
            Get acess to all the plubications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton />
        </section>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1JqIPrL62Qz0xxFhf1GhW9yd');

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
