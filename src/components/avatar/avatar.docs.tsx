/**
 * Docs-only: the Figma Avatar page — personas, statuses, the size matrix,
 * groups and the Flat Avatar parts — drawn with the real components.
 * Not part of the library (see src/docs/figma.docs.tsx).
 *
 * The 32 named personas used to point at 64 files in public/avatars that were
 * never committed, so every avatar in every story rendered as a broken image
 * and the docs quietly taught you that Avatar does not work. There is now one
 * committed photo and every persona uses it: the names still differ, which is
 * all AvatarGroup and the initials fallback need, and nothing 404s.
 */
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { RiFlashlightFill } from '@remixicon/react';
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

/** The one committed persona photo. Every persona points at it. */
export const PERSONA_PHOTO = '/avatars/persona.png';

/**
 * Names for the avatar examples.
 *
 * Figma ships 32 personas, each as a photo and a background-removed cut-out.
 * Those 64 files are not in this repo, and shipping licensed stock photography
 * in a component library is a licence question rather than a technical one —
 * so the docs use a single image and keep the names. What the stories are
 * actually demonstrating is sizing, stacking, status markers and the initials
 * fallback, and none of that needs 32 different faces.
 *
 * Drop the real exports into `public/avatars/` and point `photo` / `cutout`
 * back at per-persona paths when the licensing is settled; nothing else here
 * has to change.
 */
export const PERSONAS = [
  { name: 'Olivia Rhye', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Phoenix Baker', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Lana Steiner', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Demi Wilkinson', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Candice Wu', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Natali Craig', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Drew Cano', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Orlando Diggs', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Andi Lane', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Kate Morrison', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Koray Okumus', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Ava Wright', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Zahir Mays', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Joshua Wilson', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Rene Wells', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Lori Bryson', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Anaiah Whitten', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Noah Pierre', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Katherine Moss', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Eduard Franz', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Alec Whitten', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Eva Bond', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Sophia Perez', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Lyle Kauffman', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Kelly Williams', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Lucy Bond', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Alisa Hester', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Rosalee Melvin', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Loki Bright', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Aliah Lane', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Anita Cruz', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
  { name: 'Kari Rasmussen', photo: PERSONA_PHOTO, cutout: PERSONA_PHOTO },
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

/**
 * Figma draws a wall of 32 photos and 32 cut-outs here. One is enough: the
 * section documents that Avatar takes an image and crops it to a circle, and
 * 63 more faces do not make that point any harder to miss.
 */
export function PersonaGrid() {
  const { t } = useTranslation();
  return (
    <figure className="flex w-fit flex-col items-center gap-3 rounded-xl border border-soft-200 bg-white-0 px-5 pt-5 pb-6">
      <img
        src={PERSONA_PHOTO}
        alt=""
        width={100}
        height={100}
        className="size-[100px] rounded-full object-cover"
      />
      <figcaption className="text-center text-[14px] leading-5 font-medium text-strong-950">
        {t('avatarDocs.imageCaption')}
      </figcaption>
    </figure>
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
