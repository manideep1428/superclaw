import { resolveAppHref } from '@/lib/urls';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ComponentPropsWithoutRef, ComponentType } from 'react';

type AnchorProps = ComponentPropsWithoutRef<'a'>;
type CardProps = {
  href?: string;
  rel?: string;
  target?: string;
} & Record<string, unknown>;

const DefaultCard = (defaultMdxComponents as unknown as {
  Card?: ComponentType<CardProps>;
}).Card;

function mergeRel(currentRel?: string, requiredRel?: string) {
  if (!requiredRel) {
    return currentRel;
  }

  const parts = new Set(
    [...(currentRel?.split(' ') ?? []), ...requiredRel.split(' ')].filter(Boolean),
  );

  return Array.from(parts).join(' ');
}

export function createAppAwareLink(RelativeLink?: ComponentType<AnchorProps>) {
  return function AppAwareLink({ href, rel, target, ...props }: AnchorProps) {
    if (
      RelativeLink &&
      href &&
      !href.startsWith('/') &&
      !href.startsWith('#') &&
      !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(href)
    ) {
      return <RelativeLink href={href} rel={rel} target={target} {...props} />;
    }

    const resolved = resolveAppHref(href);
    const nextTarget = resolved.external ? '_blank' : target;
    const nextRel = resolved.external
      ? mergeRel(rel, 'noopener noreferrer')
      : rel;

    return <a href={resolved.href} rel={nextRel} target={nextTarget} {...props} />;
  };
}

export function getMDXComponents(components?: MDXComponents) {
  const cardComponents = DefaultCard
    ? {
        Card: (props: CardProps) => {
          const resolved = resolveAppHref(props.href);

          return (
            <DefaultCard
              {...props}
              href={resolved.href}
              rel={
                resolved.external
                  ? mergeRel(props.rel, 'noopener noreferrer')
                  : props.rel
              }
              target={resolved.external ? '_blank' : props.target}
            />
          );
        },
      }
    : {};

  return {
    ...defaultMdxComponents,
    ...cardComponents,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
