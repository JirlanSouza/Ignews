import { render, screen } from '@testing-library/react';
import Stripe from 'stripe';
import { mocked } from 'ts-jest/utils';

import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic';
import { stripe } from '../../services/stripe';

jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null, false];
    },
  };
});

jest.mock('../../services/prismic');

const posts = [
  {
    slug: 'my-new-slug',
    title: 'My new title',
    excerpt: 'Post excerpt',
    updatedAt: '10 de Maio',
  },
];

describe('Home page', () => {
  it('renders correctly', () => {
    const product = {
      priceId: 'fake-price-id',
      amount: '$US 9.99',
    };

    render(<Posts posts={posts} />);

    expect(screen.getByText(posts[0].title)).toBeInTheDocument();
    expect(screen.getByText(posts[0].excerpt)).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const price = {
      id: 'fake-price-id',
      unit_amount: 1000,
    } as any;

    const getPrismicClientMocked = mocked(getPrismicClient);
    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: posts[0].slug,
            data: {
              title: [{ type: 'heading', text: posts[0].title }],
              content: [{ type: 'paragraph', text: posts[0].excerpt }],
            },
            last_publication_date: '05-10-2022',
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: posts[0].slug,
              title: posts[0].title,
              excerpt: posts[0].excerpt,
              updatedAt: '10 de maio de 2022',
            },
          ],
        },
      })
    );
  });
});
