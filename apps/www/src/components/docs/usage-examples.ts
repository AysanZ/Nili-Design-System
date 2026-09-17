/**
 * Usage snippets shown on the Code tab.
 *
 * These are intentional examples of how a consumer would import and use the
 * component. Full library source is not published yet, so we only surface
 * the public API surface.
 */

export const USAGE_EXAMPLES: Record<string, string> = {
  button: `import {
  Button,
  LinkButton,
  FancyButton,
  CompactButton,
  Icon,
} from "@nili/ui"
import {
  RiArrowRightSLine,
  RiCloseLine,
  RiAddLine,
} from "@remixicon/react"

export function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Primary</Button>
      <Button appearance="stroke" color="neutral">Secondary</Button>
      <FancyButton color="primary">Fancy</FancyButton>
      <LinkButton href="#" color="primary">Link</LinkButton>
      <CompactButton aria-label="Close">
        <Icon icon={RiCloseLine} />
      </CompactButton>
      <Button
        iconOnly
        aria-label="Add"
        startIcon={<Icon icon={RiAddLine} />}
      />
    </div>
  )
}`,

  badge: `import { Badge } from "@nili/ui"

export function Example() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge color="green" appearance="light">Success</Badge>
      <Badge color="red">Error</Badge>
    </div>
  )
}`,

  alert: `import { Alert } from "@nili/ui"

export function Example() {
  return (
    <Alert>
      <Alert.Title>Heads up</Alert.Title>
      <Alert.Description>
        You can add components to your app using the CLI.
      </Alert.Description>
    </Alert>
  )
}`,

  avatar: `import { Avatar } from "@nili/ui"

export function Example() {
  return (
    <div className="flex items-center gap-3">
      <Avatar src="/avatar.png" alt="User" />
      <Avatar fallback="JD" />
    </div>
  )
}`,

  checkbox: `import { Checkbox } from "@nili/ui"

export function Example() {
  return (
    <label className="flex items-center gap-2">
      <Checkbox defaultChecked />
      Accept terms
    </label>
  )
}`,

  'text-input': `import {
  TextInput,
  InputSelect,
  TagInput,
  CounterInput,
  DigitInput,
  Icon,
} from "@nili/ui"
import { RiMailLine, RiSearchLine } from "@remixicon/react"

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <TextInput
        type="email"
        label="Email Address"
        sublabel="(Optional)"
        information
        hint="This is a hint text to help user."
        placeholder="hello@nili.design"
        startIcon={<Icon icon={RiMailLine} />}
        required
      />

      <TextInput
        type="phone"
        label="Phone Number"
        select={
          <InputSelect icon={<span>🇺🇸</span>} aria-label="Country code">
            +1
          </InputSelect>
        }
      />

      <TextInput
        type="search"
        label="Search"
        startIcon={<Icon icon={RiSearchLine} />}
        shortcut="⌘K"
      />

      <TagInput
        label="Cities"
        defaultValue={["Berlin", "London"]}
        dismissLabel="Remove"
      />

      <CounterInput label="Guests" defaultValue={2} min={1} max={10} />

      <DigitInput
        length={4}
        label="Verification code"
        groupLabel="Code"
        cellLabel={(i, total) => 'Digit ' + i + ' of ' + total}
      />
    </div>
  )
}`,

  switch: `import { Switch } from "@nili/ui"

export function Example() {
  return (
    <label className="flex items-center gap-2">
      <Switch defaultChecked />
      Notifications
    </label>
  )
}`,

  modal: `import { Modal, Button } from "@nili/ui"

export function Example() {
  return (
    <Modal>
      <Modal.Trigger render={<Button>Open</Button>} />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Edit profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>…</Modal.Body>
        <Modal.Footer>
          <Button appearance="stroke">Cancel</Button>
          <Button>Save</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}`,

  tooltip: `import { Tooltip, Button } from "@nili/ui"

export function Example() {
  return (
    <Tooltip content="Add to library">
      <Button appearance="ghost">Hover me</Button>
    </Tooltip>
  )
}`,

  tabs: `import { Tabs } from "@nili/ui"

export function Example() {
  return (
    <Tabs defaultValue="account">
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="password">Password</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">Account settings</Tabs.Content>
      <Tabs.Content value="password">Change password</Tabs.Content>
    </Tabs>
  )
}`,

  dropdown: `import {
  Dropdown,
  Icon,
  Avatar,
  CountryFlag,
  PlaceholderLogo,
} from "@nili/ui"
import { RiFlashlightLine } from "@remixicon/react"

// Icon · Country · User · Company — all via startAdornment
const options = [
  {
    value: "design",
    label: "Design",
    startAdornment: <Icon icon={RiFlashlightLine} />,
  },
  {
    value: "ir",
    label: "Iran",
    startAdornment: <CountryFlag code="ir" size="sm" />,
  },
  {
    value: "sophia",
    label: "Sophia Williams",
    description: "Product design",
    startAdornment: <Avatar size="3xs" name="Sophia Williams" />,
  },
  {
    value: "apex",
    label: "Apex Financial",
    description: "Finance & Banking",
    startAdornment: (
      <PlaceholderLogo company="apex-financial" size="xs" label="" />
    ),
  },
]

export function Example() {
  return (
    <Dropdown
      label="Label"
      sublabel="(Optional)"
      information
      hint="This is a hint text to help user."
      placeholder="Select…"
      options={options}
      searchable
    />
  )
}`,

  'quick-actions': `import { QuickActions, QuickActionItem, Icon } from "@nili/ui"
import { RiFileAddLine, RiUserAddLine, RiUploadCloud2Line } from "@remixicon/react"

export function Example() {
  return (
    <QuickActions label="Quick actions" columns={2}>
      <QuickActionItem
        icon={<Icon icon={RiFileAddLine} />}
        tone="primary"
        description="Create a draft invoice"
      >
        New invoice
      </QuickActionItem>
      <QuickActionItem
        icon={<Icon icon={RiUserAddLine} />}
        tone="feature"
        description="Send an invite link"
      >
        Invite member
      </QuickActionItem>
      <QuickActionItem
        icon={<Icon icon={RiUploadCloud2Line} />}
        tone="success"
        description="Attach a PDF or image"
      >
        Upload file
      </QuickActionItem>
    </QuickActions>
  )
}`,


  filter: `import {
  FilterBar,
  FilterChip,
  FilterList,
  FilterListItem,
  Icon,
} from "@nili/ui"
import { RiPriceTag3Line, RiCalendarLine, RiUserLine } from "@remixicon/react"

export function Example() {
  return (
    <>
      <FilterBar surface="panel" label="Table filters">
        <FilterChip
          active
          value="Active"
          startIcon={<Icon icon={RiPriceTag3Line} />}
          onClear={() => {}}
          clearLabel="Clear"
        >
          Status
        </FilterChip>
        <FilterChip startIcon={<Icon icon={RiCalendarLine} />}>Date</FilterChip>
        <FilterChip startIcon={<Icon icon={RiUserLine} />}>Owner</FilterChip>
        <FilterChip placeholder>Add filter</FilterChip>
      </FilterBar>

      <FilterList label="Status">
        <FilterListItem active count={128}>All</FilterListItem>
        <FilterListItem count={42}>Active</FilterListItem>
        <FilterListItem count={12}>Draft</FilterListItem>
      </FilterList>
    </>
  )
}`,

};

/** Fallback when no dedicated example exists yet. */
export function defaultUsageExample(componentName: string, importNames: string[]) {
  const names = importNames.length > 0 ? importNames.join(', ') : componentName;
  return `import { ${names} } from "@nili/ui"

export function Example() {
  return <${componentName} />
}`;
}
