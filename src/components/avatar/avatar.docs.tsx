/**
 * Docs-only: the Figma Avatar page — personas, statuses, the size matrix,
 * groups and the Flat Avatar parts — drawn with the real components.
 * Not part of the library (see src/docs/figma.docs.tsx). The persona photos
 * live in public/avatars (extracted from the Figma file, 256px WebP).
 */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { RiLink, RiFlashlightFill } from '@remixicon/react';
import { Icon } from '../icon';
import { Caption } from '../../docs/figma.docs';
import { Avatar } from './avatar';
import { AvatarGroup, CompactAvatarGroup } from './avatar-group';
import { FlatAvatar, FLAT_AVATAR_COUNTS } from './flat-avatar';
import { FLAT_AVATAR_PARTS } from './flat-avatar.parts';
import type {
  AvatarSize,
  AvatarTone,
  AvatarTopStatus,
  AvatarBottomStatus,
} from './avatar.types';

export const PERSONAS = [
  {
    name: 'Olivia Rhye',
    photo: '/avatars/olivia-rhye.webp',
    cutout: '/avatars/olivia-rhye-cutout.webp',
    source:
      'https://unsplash.com/photos/woman-wearing-white-blazer-IXYxqP4zejo',
  },
  {
    name: 'Phoenix Baker',
    photo: '/avatars/phoenix-baker.webp',
    cutout: '/avatars/phoenix-baker-cutout.webp',
    source:
      'https://unsplash.com/photos/man-wearing-yellow-sweater-M7i6iMgzPwc',
  },
  {
    name: 'Lana Steiner',
    photo: '/avatars/lana-steiner.webp',
    cutout: '/avatars/lana-steiner-cutout.webp',
    source:
      'https://www.pexels.com/photo/curly-haired-woman-holding-sheets-of-hard-papers-7552448/',
  },
  {
    name: 'Demi Wilkinson',
    photo: '/avatars/demi-wilkinson.webp',
    cutout: '/avatars/demi-wilkinson-cutout.webp',
    source:
      'https://unsplash.com/photos/a-woman-with-an-afro-is-looking-at-the-camera-_cvwXhGqG-o',
  },
  {
    name: 'Candice Wu',
    photo: '/avatars/candice-wu.webp',
    cutout: '/avatars/candice-wu-cutout.webp',
    source:
      'https://unsplash.com/photos/woman-leaning-on-white-table-f2ar0ltTvaI',
  },
  {
    name: 'Natali Craig',
    photo: '/avatars/natali-craig.webp',
    cutout: '/avatars/natali-craig-cutout.webp',
    source:
      'https://unsplash.com/photos/woman-with-black-white-and-grey-blanket-leaning-on-wall-with-no-lifeguard-on-duty-signage-N5GCRjEMboQ',
  },
  {
    name: 'Drew Cano',
    photo: '/avatars/drew-cano.webp',
    cutout: '/avatars/drew-cano-cutout.webp',
    source:
      'https://www.pexels.com/photo/man-in-brown-button-up-shirt-3785079/',
  },
  {
    name: 'Orlando Diggs',
    photo: '/avatars/orlando-diggs.webp',
    cutout: '/avatars/orlando-diggs-cutout.webp',
    source:
      'https://unsplash.com/photos/man-in-white-crew-neck-t-shirt-and-black-pants-sitting-on-rock-during-daytime-h0qUAPHoXmE',
  },
  {
    name: 'Andi Lane',
    photo: '/avatars/andi-lane.webp',
    cutout: '/avatars/andi-lane-cutout.webp',
    source: 'https://www.pexels.com/photo/fashion-person-people-woman-7956286/',
  },
  {
    name: 'Kate Morrison',
    photo: '/avatars/kate-morrison.webp',
    cutout: '/avatars/kate-morrison-cutout.webp',
    source:
      'https://www.pexels.com/photo/woman-in-wearing-half-of-black-coat-8479814/',
  },
  {
    name: 'Koray Okumus',
    photo: '/avatars/koray-okumus.webp',
    cutout: '/avatars/koray-okumus-cutout.webp',
    source: 'https://unsplash.com/photos/man-wearing-eyeglasses-K84vnnzxmTQ',
  },
  {
    name: 'Ava Wright',
    photo: '/avatars/ava-wright.webp',
    cutout: '/avatars/ava-wright-cutout.webp',
    source: 'https://www.pexels.com/photo/woman-holding-a-laptop-4347368/',
  },
  {
    name: 'Zahir Mays',
    photo: '/avatars/zahir-mays.webp',
    cutout: '/avatars/zahir-mays-cutout.webp',
    source:
      'https://www.pexels.com/photo/serious-young-black-man-with-bag-and-netbook-in-hands-against-white-background-5745181/',
  },
  {
    name: 'Joshua Wilson',
    photo: '/avatars/joshua-wilson.webp',
    cutout: '/avatars/joshua-wilson-cutout.webp',
    source:
      'https://www.pexels.com/photo/a-handsome-model-wearing-a-brown-jacket-7388867/',
  },
  {
    name: 'Rene Wells',
    photo: '/avatars/rene-wells.webp',
    cutout: '/avatars/rene-wells-cutout.webp',
    source:
      'https://www.pexels.com/photo/woman-in-white-shirt-wearing-eyeglasses-8107620/',
  },
  {
    name: 'Lori Bryson',
    photo: '/avatars/lori-bryson.webp',
    cutout: '/avatars/lori-bryson-cutout.webp',
    source: 'https://unsplash.com/photos/woman-taking-selfie-c-mgSuxqpzA',
  },
  {
    name: 'Anaiah Whitten',
    photo: '/avatars/anaiah-whitten.webp',
    cutout: '/avatars/anaiah-whitten-cutout.webp',
    source:
      'https://unsplash.com/photos/woman-in-white-and-red-shirt-vp9mRauo68c',
  },
  {
    name: 'Noah Pierre',
    photo: '/avatars/noah-pierre.webp',
    cutout: '/avatars/noah-pierre-cutout.webp',
    source:
      'https://www.pexels.com/photo/a-man-in-black-suit-holding-a-tablet-5862269/',
  },
  {
    name: 'Katherine Moss',
    photo: '/avatars/katherine-moss.webp',
    cutout: '/avatars/katherine-moss-cutout.webp',
    source:
      'https://unsplash.com/photos/woman-wearing-black-and-white-striped-top-and-round-eyeglasses-Brl7bqld05E',
  },
  {
    name: 'Eduard Franz',
    photo: '/avatars/eduard-franz.webp',
    cutout: '/avatars/eduard-franz-cutout.webp',
    source:
      'https://www.pexels.com/photo/man-in-brown-coat-and-blue-denim-jeans-sitting-on-chair-6625967/',
  },
  {
    name: 'Alec Whitten',
    photo: '/avatars/alec-whitten.webp',
    cutout: '/avatars/alec-whitten-cutout.webp',
    source:
      'https://unsplash.com/photos/man-in-gray-and-white-plaid-button-up-shirt-TAkcKn99UC0',
  },
  {
    name: 'Eva Bond',
    photo: '/avatars/eva-bond.webp',
    cutout: '/avatars/eva-bond-cutout.webp',
    source:
      'https://www.pexels.com/photo/a-doctor-holding-a-clipboard-5215024/',
  },
  {
    name: 'Sophia Perez',
    photo: '/avatars/sophia-perez.webp',
    cutout: '/avatars/sophia-perez-cutout.webp',
    source:
      'https://unsplash.com/photos/selective-focus-photography-of-woman-wearing-red-knit-cap-8vT-DgHZDG4',
  },
  {
    name: 'Lyle Kauffman',
    photo: '/avatars/lyle-kauffman.webp',
    cutout: '/avatars/lyle-kauffman-cutout.webp',
    source: 'https://unsplash.com/photos/mens-gray-crew-neck-shirt-v2aKnjMbP_k',
  },
  {
    name: 'Kelly Williams',
    photo: '/avatars/kelly-williams.webp',
    cutout: '/avatars/kelly-williams-cutout.webp',
    source:
      'https://www.pexels.com/photo/woman-with-curly-hair-wearing-a-gray-knitted-sweater-7244701/',
  },
  {
    name: 'Lucy Bond',
    photo: '/avatars/lucy-bond.webp',
    cutout: '/avatars/lucy-bond-cutout.webp',
    source: 'https://www.pexels.com/photo/woman-in-white-dress-shirt-4972985/',
  },
  {
    name: 'Alisa Hester',
    photo: '/avatars/alisa-hester.webp',
    cutout: '/avatars/alisa-hester-cutout.webp',
    source:
      'https://www.pexels.com/photo/smiling-black-model-with-afro-braids-on-gray-background-7275385/',
  },
  {
    name: 'Rosalee Melvin',
    photo: '/avatars/rosalee-melvin.webp',
    cutout: '/avatars/rosalee-melvin-cutout.webp',
    source:
      'https://unsplash.com/photos/woman-smiling-while-standing-in-garden-HRZUzoX1e6w',
  },
  {
    name: 'Loki Bright',
    photo: '/avatars/loki-bright.webp',
    cutout: '/avatars/loki-bright-cutout.webp',
    source:
      'https://unsplash.com/photos/mens-blue-and-white-button-up-collared-top-DItYlc26zVI',
  },
  {
    name: 'Aliah Lane',
    photo: '/avatars/aliah-lane.webp',
    cutout: '/avatars/aliah-lane-cutout.webp',
    source:
      'https://www.pexels.com/photo/woman-wearing-pink-collared-half-sleeved-top-1036623/',
  },
  {
    name: 'Anita Cruz',
    photo: '/avatars/anita-cruz.webp',
    cutout: '/avatars/anita-cruz-cutout.webp',
    source:
      'https://www.pexels.com/photo/attractive-woman-wearing-white-top-2744193/',
  },
  {
    name: 'Kari Rasmussen',
    photo: '/avatars/kari-rasmussen.webp',
    cutout: '/avatars/kari-rasmussen-cutout.webp',
    source:
      'https://www.pexels.com/photo/photo-of-man-wearing-eyeglasses-6801642/',
  },
] as const;

export const AVATAR_SIZES: AvatarSize[] = [
  '3xl',
  '2xl',
  'xl',
  'lg',
  'md',
  'sm',
  'xs',
  '2xs',
  '3xs',
];

/** Figma Avatar Images: every persona as a photo card and a cut-out card. */
export function PersonaGrid() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-4 gap-4 lg:grid-cols-8">
      {PERSONAS.flatMap((p) =>
        (['photo', 'cutout'] as const).map((kind) => (
          <figure
            key={p.name + kind}
            className="flex flex-col items-center gap-2 rounded-xl border border-soft-200 bg-white-0 px-3 pt-3 pb-4"
          >
            <img
              src={p[kind]}
              alt={p.name}
              width={100}
              height={100}
              className="size-[100px] object-cover"
              loading="lazy"
            />
            <figcaption className="text-center text-[14px] leading-5 font-medium text-strong-950">
              {p.name}
            </figcaption>
            <a
              href={p.source}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[12px] leading-4 text-sub-600 underline decoration-from-font"
            >
              <Icon icon={RiLink} size={12} />
              {t('avatarDocs.imageLink')}
            </a>
          </figure>
        )),
      )}
    </div>
  );
}

const TOPS: AvatarTopStatus[] = [
  'verified',
  'pin',
  'favorite',
  'add',
  'remove',
  'notification',
];
const BOTTOMS: AvatarBottomStatus[] = [
  'online',
  'offline',
  'busy',
  'away',
  'company',
];

/** Figma Top & Bottom Statuses, at their 80px size. */
export function StatusSets() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-6">
      {(
        [
          ['avatarDocs.bottom', BOTTOMS, 'bottomStatus'],
          ['avatarDocs.top', TOPS, 'topStatus'],
        ] as const
      ).map(([key, list, prop]) => (
        <div key={key} className="flex flex-col gap-2">
          <Caption>{t(key)}</Caption>
          <div className="flex items-center gap-4 bg-weak-50 p-5">
            {list.map((status) => (
              <Avatar
                key={status}
                size="3xl"
                name=""
                className="[&>div:first-child]:invisible"
                companyIcon={<RiFlashlightFill />}
                {...{ [prop]: status }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Figma Avatar: nine sizes × Image · Solid Background · Text · Icon, with both statuses. */
export function AvatarSizeMatrix() {
  const { t } = useTranslation();
  const p = PERSONAS[0];
  const common = {
    topStatus: 'verified',
    bottomStatus: 'online',
    name: p.name,
  } as const;
  return (
    <div className="grid grid-cols-[auto_repeat(4,auto)] items-center gap-x-10 gap-y-6">
      <span />
      <Caption>{t('avatarDocs.stylePhoto')}</Caption>
      <Caption>{t('avatarDocs.styleSolid')}</Caption>
      <Caption>{t('avatarDocs.styleText')}</Caption>
      <Caption>{t('avatarDocs.styleIcon')}</Caption>
      {AVATAR_SIZES.map((size) => (
        <Row key={size} label={size}>
          <Avatar size={size} src={p.photo} {...common} />
          <Avatar size={size} src={p.cutout} tone="blue" {...common} />
          <Avatar size={size} tone="blue" {...common} />
          <Avatar size={size} tone="blue" placeholder {...common} />
        </Row>
      ))}
    </div>
  );
}

const GROUP_TONES: AvatarTone[] = ['blue', 'yellow', 'pink', 'green'];
const groupItems = (offset = 0) =>
  GROUP_TONES.map((tone, i) => {
    const p = PERSONAS[(i + offset) % PERSONAS.length];
    return { id: p.name, name: p.name, src: p.cutout, tone };
  });

/** Figma Avatar Group: four avatars and a +9 counter, at every size. */
export function AvatarGroupMatrix() {
  return (
    <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
      {AVATAR_SIZES.map((size) => (
        <AvatarGroup
          key={size}
          size={size}
          items={groupItems()}
          overflowCount={9}
        />
      ))}
    </div>
  );
}

/** Figma Compact Avatar Group: 40 · 32 · 24, in both appearances. */
export function CompactGroupMatrix() {
  return (
    <div className="flex flex-col gap-4">
      {(['default', 'stroke'] as const).map((appearance) => (
        <div key={appearance} className="flex items-center gap-6">
          {(['sm', 'xs', '2xs'] as const).map((size) => (
            <CompactAvatarGroup
              key={size}
              size={size}
              appearance={appearance}
              items={[...groupItems(3).slice(0, 3), ...groupItems(10)]}
              max={3}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export const FLAT_PART_KEYS = Object.keys(
  FLAT_AVATAR_COUNTS,
) as (keyof typeof FLAT_AVATAR_COUNTS)[];

/** Figma Flat Avatar parts: every variant of every part, as drawn in Figma. */
export function FlatAvatarParts() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-8">
      {FLAT_PART_KEYS.map((part) => (
        <div key={part} className="flex flex-col gap-3">
          <Caption>
            {t(`avatarDocs.part${part[0].toUpperCase()}${part.slice(1)}`)}
          </Caption>
          <div className="flex flex-wrap gap-4">
            {FLAT_AVATAR_PARTS[part].map((markup, index) => (
              <svg
                key={index}
                width={85}
                height={85}
                viewBox="0 0 85 85"
                className="rounded-md border border-dashed border-soft-200 bg-white-0"
                aria-label={`${part} ${index + 1}`}
                role="img"
                // Static, first-party vector data generated from the Figma file.
                dangerouslySetInnerHTML={{ __html: markup }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** A few Avatar Creator combinations. */
export function FlatAvatarExamples() {
  const combos = [
    {
      background: 4,
      face: 0,
      outfit: 0,
      hair: 0,
      eye: 0,
      cheek: 0,
      mouth: 0,
      hat: 4,
    },
    {
      background: 0,
      face: 5,
      outfit: 3,
      hair: 6,
      eye: 1,
      cheek: 1,
      mouth: 2,
      glasses: 0,
    },
    { background: 2, face: 9, outfit: 6, hair: 9, eye: 2, mouth: 3 },
    {
      background: 3,
      face: 13,
      outfit: 9,
      hair: 3,
      eye: 3,
      cheek: 2,
      mouth: 4,
      hat: 2,
    },
    {
      background: 5,
      face: 2,
      outfit: 11,
      hair: 7,
      eye: 4,
      mouth: 5,
      glasses: 5,
    },
    {
      background: 1,
      face: 14,
      outfit: 4,
      hair: 2,
      eye: 0,
      cheek: 3,
      mouth: 1,
      hat: 0,
    },
  ];
  return (
    <div className="flex flex-wrap items-end gap-4">
      {combos.map((combo, i) => (
        <FlatAvatar key={i} size="3xl" {...combo} />
      ))}
      {AVATAR_SIZES.slice(3).map((size) => (
        <FlatAvatar key={size} size={size} {...combos[0]} />
      ))}
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <Caption className="pe-2">{label}</Caption>
      {children}
    </>
  );
}
