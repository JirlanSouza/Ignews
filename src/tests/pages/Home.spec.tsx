import { render, screen } from '@testing-library/react';
import Stripe from 'stripe';
import { mocked } from 'ts-jest/utils';

import Home, { getStaticProps } from '../../pages';
import { stripe } from '../../services/stripe';

jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null, false];
    },
  };
});

jest.mock('../../services/stripe');

describe('Home page', () => {
  it('renders correctly', () => {
    const product = {
      priceId: 'fake-price-id',
      amount: '$US 9.99',
    };

    render(<Home product={product} />);

    expect(screen.getByText(`for ${product.amount} month`)).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const price = {
      id: 'fake-price-id',
      unit_amount: 1000,
    } as any;

    const retrievePricesStripeMocked = mocked(stripe.prices.retrieve);
    retrievePricesStripeMocked.mockResolvedValueOnce(price);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: price.id,
            amount: '$10.00',
          },
        },
      })
    );
  });
});
