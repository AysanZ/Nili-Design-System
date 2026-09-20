import type { CSSProperties } from 'react';
import {
  RiArrowRightUpLine,
  RiGlobalLine,
  RiLinkedinBoxFill,
  RiMailLine,
} from '@remixicon/react';

import { Avatar, type IconComponent } from '@www/components/nili';
import { Container } from '@www/components/site/container';
import { cn } from '@www/lib/cn';
import type { MessageKey, Translate } from '@www/i18n/dictionaries';

interface PersonLink {
  /**
   * The channel, not the address. A row of raw handles — an email, then two
   * profile URLs — reads as three strings you have to parse before you know
   * which is which; "Email · Portfolio · LinkedIn" reads as three destinations.
   * The address still travels in `href` and `title`, where it belongs.
   *
   * `null` means the channel names itself: LinkedIn is LinkedIn in every
   * locale, so only the generic one goes through `t`.
   */
  labelKey: MessageKey | null;
  label: string;
  title: string;
  href: string;
  /**
   * Every link carries its own mark, so the row reads at a glance.
   *
   * Rendered here, in this Server Component, rather than handed to the
   * library's `<Icon>`. `Icon` sits behind the `'use client'` boundary in
   * `components/nili`, and a component *is* a function: passing one across
   * that boundary is exactly what React refuses with "Functions cannot be
   * passed directly to Client Components". A Remix icon is a plain function
   * component with no hooks, so the server can call it itself and send the
   * SVG — which is what the header already does with its search glyph.
   */
  icon: IconComponent;

  /**
   * The channel's own colour, used only on hover and focus.
   *
   * Resting state is `soft-400` for all of them: six brand colours sitting at
   * full strength in a card would out-shout the person's name, which is the
   * thing the card is actually about. The colour arrives when you reach for
   * the link — it confirms what you are about to open rather than competing
   * for attention before you have decided.
   *
   * Email and personal websites have no fixed brand colour, so they take the
   * design system's primary.
   */
  brand: string;
}

interface Person {
  initials: string;
  image: string;
  name: string;
  role: MessageKey;
  bio: MessageKey;
  links: PersonLink[];
}

const PEOPLE: Person[] = [
  {
    initials: 'AZ',
    image: '/avatars/aysan-zeinalvand.png?v=b2dcf5b2',
    name: 'Aysan Zeinalvand',
    role: 'az.role',
    bio: 'az.bio',
    links: [
      {
        labelKey: 'team.email',
        label: 'Email',
        title: 'aysanzeinalvand@gmail.com',
        href: 'mailto:aysanzeinalvand@gmail.com',
        icon: RiMailLine,
        brand: 'var(--nili-primary-base)',
      },
      {
        labelKey: null,
        label: 'Portfolio',
        title: 'aysanz.dev',
        href: 'https://aysanz.dev',
        icon: RiGlobalLine,
        brand: 'var(--nili-primary-base)',
      },
      {
        labelKey: null,
        label: 'LinkedIn',
        title: 'linkedin.com/in/aysanzeinalvand',
        href: 'https://www.linkedin.com/in/aysanzeinalvand',
        icon: RiLinkedinBoxFill,
        brand: '#0A66C2',
      },
    ],
  },
  {
    initials: 'BR',
    image: '/avatars/behzad-rezazadeh.png',
    name: 'Behzad Rezazadeh',
    role: 'br.role',
    bio: 'br.bio',
    links: [
      {
        labelKey: 'team.email',
        label: 'Email',
        title: 'Behiwzad@gmail.com',
        href: 'mailto:Behiwzad@gmail.com',
        icon: RiMailLine,
        brand: 'var(--nili-primary-base)',
      },
      {
        labelKey: null,
        label: 'LinkedIn',
        title: 'linkedin.com/in/behzad-rezazadeh-80a1942bb',
        href: 'https://www.linkedin.com/in/behzad-rezazadeh-80a1942bb?utm_source=share_via&utm_content=profile&utm_medium=member_android',
        icon: RiLinkedinBoxFill,
        brand: '#0A66C2',
      },
    ],
  },
];

/**
 * Names are written once, in Latin script, tagged `lang="en"` and pinned
 * `dir="ltr"` so they read the same way under an RTL page as under an LTR one
 * — a proper noun is not a string to be mirrored.
 *
 * Each contact link carries its own mark. A row of bare monospace labels made
 * the email indistinguishable from the profile links at a glance; the glyph is
 * what separates them, and it is `aria-hidden` because the label beside it
 * already says which is which.
 */
export function TeamSection({ t }: { t: Translate }) {
  return (
    <section id="team" className="scroll-mt-16 border-t border-soft-200">
      <Container className="py-14 md:py-20">
        <h2 className="text-[22px] leading-[30px] font-semibold tracking-[-0.02em] text-strong-950 md:text-[26px] md:leading-9">
          {t('team.title')}
        </h2>
        <p className="mt-2 max-w-[62ch] text-[14px] leading-[23px] text-sub-600">
          {t('team.lead')}
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {PEOPLE.map((person) => (
            <div
              key={person.name}
              className="rounded-xl border border-soft-200 bg-white-0 p-5 md:p-6"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  size="md"
                  name={person.name}
                  initials={person.initials}
                  src={person.image}
                />
                <div className="min-w-0">
                  <h4
                    dir="ltr"
                    lang="en"
                    className="truncate text-[15px] leading-5 font-semibold text-strong-950"
                  >
                    {person.name}
                  </h4>
                </div>
              </div>

              <p className="mt-4 text-[13px] leading-5 font-medium text-strong-950">
                {t(person.role)}
              </p>
              <p className="mt-2 text-[14px] leading-[23px] text-sub-600">
                {t(person.bio)}
              </p>

              {/* Coloured pills, not a line of bare links.

                  Each one is a destination you either want or do not, and a
                  filled target says that more clearly than underlined text in
                  a row — it is also a bigger tap area on a phone, where three
                  12px links sitting 12px apart are a coin toss.

                  Resting state carries the channel's colour on the icon and a
                  faint tint of it in the background — enough to read at a
                  glance which platform each pill is, without six saturated
                  chips shouting over the person's name. Hovering (or
                  focusing, for anyone not using a mouse) fills the pill solid
                  with that same colour and turns the text and icon white, so
                  the whole target confirms what you are about to open.

                  Plain `<a>`, styled by hand rather than `<Button asChild>`:
                  the colour is per-link and lives outside Button's own colour
                  enum, so the simpler element is the one that does not fight
                  the library for control of its own hover state. The address
                  travels in `href`, `title` and `aria-label`; the label on
                  screen is the channel name.

                  The arrow is the one background-swap-independent way to say
                  "this leaves the site" — profile, website and mailto: links
                  all point somewhere that is not this page, and the 45° glyph is
                  the standard mark for that regardless of which corner of the
                  pill it sits in. It fades in and nudges toward its own
                  corner on hover so the motion reads as "opening", not as
                  decoration. */}
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-soft-200 pt-4">
                {person.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    title={link.title}
                    aria-label={t('team.contact')
                      .replace('{name}', person.name)
                      .concat(` — ${link.title}`)}
                    style={
                      {
                        '--brand': link.brand,
                        '--brand-tint': `color-mix(in srgb, var(--brand) 10%, transparent)`,
                        '--brand-border': `color-mix(in srgb, var(--brand) 28%, transparent)`,
                      } as CSSProperties
                    }
                    className={cn(
                      'group/link relative inline-flex items-center gap-1.5 rounded-full border py-1.5 ps-2.5 pe-3 text-[12px] leading-4 font-medium',
                      'border-[var(--brand-border)] bg-[var(--brand-tint)] text-strong-950',
                      '[&_svg]:text-[var(--brand)]',
                      'transition-colors duration-200 ease-out',
                      'hover:border-[var(--brand)] hover:bg-[var(--brand)] hover:text-white-0 hover:[&_svg]:text-white-0',
                      'focus-visible:border-[var(--brand)] focus-visible:bg-[var(--brand)] focus-visible:text-white-0 focus-visible:[&_svg]:text-white-0',
                      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-base',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="inline-flex shrink-0 [&_svg]:size-4"
                    >
                      <link.icon />
                    </span>
                    <span>{link.labelKey ? t(link.labelKey) : link.label}</span>
                    <RiArrowRightUpLine
                      aria-hidden="true"
                      className={cn(
                        'size-3.5 shrink-0 opacity-0',
                        'transition-[opacity,transform] duration-200 ease-out',
                        'group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:opacity-100',
                        'group-focus-visible/link:translate-x-0.5 group-focus-visible/link:-translate-y-0.5 group-focus-visible/link:opacity-100',
                        /* Physical, not logical, on purpose: "up and to the
                           right" reads as "leaving the page" regardless of
                           reading direction, the same way it does on every
                           external-link convention. Mirroring it under RTL
                           would point the arrow into the pill instead of out
                           of it. */
                        'motion-reduce:transition-none motion-reduce:translate-x-0 motion-reduce:translate-y-0',
                      )}
                    />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
