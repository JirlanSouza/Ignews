import { render, screen } from '@testing-library/react';
import { getSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';

import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock('next-auth/client');

jest.mock('../../services/prismic');

const postContentText = 'Post excerpt';
const post = {
  slug: 'my-new-slug',
  title: 'My new title',
  content: `<p>${postContentText}</p>`,
  updatedAt: '10 de Maio',
};

describe('Home page', () => {
  it('renders correctly', () => {
    const product = {
      priceId: 'fake-price-id',
      amount: '$US 9.99',
    };

    render(<Post post={post} />);

    expect(screen.getByText(post.title)).toBeInTheDocument();
    expect(screen.getByText(postContentText)).toBeInTheDocument();
  });

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession);
    getSessionMocked.mockResolvedValueOnce({} as any);

    const response = await getServerSideProps({
      req: {
        cookies: {},
      },
      params: {
        slug: post.slug,
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: {
          destination: `/posts/preview/${post.slug}`,
          permanent: false,
        },
      })
    );
  });

  it('loads initial data', async () => {
    const getSessionMocked = mocked(getSession);
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription',
    } as any);

    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        uid: post.slug,
        data: {
          title: [{ type: 'heading', text: post.title }],
          content: [{ type: 'paragraph', text: postContentText }],
        },
        last_publication_date: '05-10-2022',
      }),
    } as any);

    const response = await getServerSideProps({
      req: {
        cookies: {},
      },
      params: {
        slug: post.slug,
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: post.slug,
            title: post.title,
            content: post.content,
            updatedAt: '10 de maio de 2022',
          },
        },
      })
    );
  });
});
