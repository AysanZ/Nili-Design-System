import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar, initialsFromName } from '.';
import { AvatarGroup } from './avatar-group';

describe('initialsFromName', () => {
  it('handles Latin and Persian names alike', () => {
    expect(initialsFromName('Ada Lovelace')).toBe('AL');
    expect(initialsFromName('Grace')).toBe('G');
    expect(initialsFromName('علی رضایی')).toBe('عر');
    expect(initialsFromName('  spaced   out  ')).toBe('SO');
  });
});

describe('Avatar', () => {
  it('labels the image with the name', () => {
    render(<Avatar name="Ada Lovelace" src="/ada.png" />);
    expect(
      screen.getByRole('img', { name: 'Ada Lovelace' }),
    ).toBeInTheDocument();
  });

  it('falls back to initials without a src', () => {
    render(<Avatar name="Ada Lovelace" />);
    expect(screen.getByText('AL')).toBeInTheDocument();
  });

  it('names the presence marker when statusLabel is given', () => {
    render(
      <Avatar
        name="Ada"
        size="xl"
        bottomStatus="online"
        statusLabel="Online"
      />,
    );
    expect(screen.getByRole('img', { name: 'Online' })).toBeInTheDocument();
  });

  // Figma draws both statuses on all nine sizes, down to 20px.
  it('keeps status markers on small sizes, scaled down', () => {
    const { container } = render(
      <Avatar
        name="Ada"
        size="3xs"
        bottomStatus="online"
        statusLabel="Online"
      />,
    );
    expect(container.querySelector('[aria-label="Online"]')).not.toBeNull();
  });
});

describe('AvatarGroup', () => {
  const people = [
    { id: '1', name: 'Ada Lovelace' },
    { id: '2', name: 'Grace Hopper' },
    { id: '3', name: 'Alan Turing' },
    { id: '4', name: 'Katherine Johnson' },
  ];

  it('caps visible avatars and shows the overflow count', () => {
    render(<AvatarGroup items={people} max={2} label="Team" />);
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  // The old version read document.dir during render and set inline transforms.
  it('uses a logical margin instead of an inline transform', () => {
    const { container } = render(<AvatarGroup items={people} label="Team" />);
    // md (default) overlaps by 12px in Figma: -ms-3.
    const avatars = container.querySelectorAll('[class*="-ms-3"]');
    expect(avatars.length).toBe(people.length - 1);
    expect(container.querySelector('[style*="translateX"]')).toBeNull();
  });

  it('names the group', () => {
    render(<AvatarGroup items={people} label="Team members" />);
    expect(
      screen.getByRole('group', { name: 'Team members' }),
    ).toBeInTheDocument();
  });
});
