import { render, screen } from '@testing-library/react';
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils';

import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock('next-auth/client');
jest.mock('next/router');
jest.mock('../../services/prismic');

const postContentText = 'Post excerpt';
const post = {
  slug: 'my-new-slug',
  title: 'My new title',
  content: `<p>${postContentText}</p>`,
  updatedAt: '10 de Maio',
};

describe('PostPreview page', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<PostPreview post={post} />);

    expect(screen.getByText(post.title)).toBeInTheDocument();
    expect(screen.getByText(postContentText)).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
    expect(screen.getByText('Subscribe now 🤗')).toBeInTheDocument();
  });

  it('redirects user to full post when user is subscribed', async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const replaceMocked = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      {
        activeSubscription: 'fake-active-subscription',
      },
      false,
    ] as any);

    useRouterMocked.mockReturnValueOnce({
      replace: replaceMocked,
    } as any);

    render(<PostPreview post={post} />);

    expect(replaceMocked).toHaveBeenCalledWith(`/posts/${post.slug}`);
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

    const response = await getStaticProps({
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
