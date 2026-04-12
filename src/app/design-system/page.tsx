'use client'

import { useEffect, useState } from 'react'
import { SimpleHeader, SimpleFooter } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  Palette,
  Type,
  Layout,
  Component,
  Box,
  CheckCircle,
  XCircle,
  GitBranch,
  ExternalLink,
  Download,
  Image as ImageIcon,
  FileText,
  Palette as PaletteIcon,
  PenTool,
} from 'lucide-react'

const tabs = [
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'components', label: 'Components', icon: Component },
  { id: 'icons', label: 'Icons', icon: Box },
  { id: 'spacing', label: 'Spacing', icon: Layout },
  { id: 'branding', label: 'Branding', icon: PaletteIcon },
  { id: 'assets', label: 'Assets', icon: ImageIcon },
  { id: 'resources', label: 'Resources', icon: FileText },
]

const colorCategories = [
  {
    name: 'Primary',
    colors: [
      { name: 'Primary', variable: '--primary', light: '#00663d', dark: '#008f5d', text: 'on-primary' },
      { name: 'Primary Foreground', variable: '--primary-foreground', light: '#ffffff', dark: '#ffffff', text: 'on dark' },
    ]
  },
  {
    name: 'Background & Surface',
    colors: [
      { name: 'Background', variable: '--background', light: '#ffffff', dark: '#0f172a', text: 'on-background' },
      { name: 'Foreground', variable: '--foreground', light: '#0f172a', dark: '#f1f5f9', text: 'on-background' },
      { name: 'Card', variable: '--card', light: '#ffffff', dark: '#0f172a', text: 'on-card' },
      { name: 'Card Foreground', variable: '--card-foreground', light: '#0f172a', dark: '#f1f5f9', text: 'on-card' },
      { name: 'Popover', variable: '--popover', light: '#ffffff', dark: '#0f172a', text: 'on-popover' },
      { name: 'Popover Foreground', variable: '--popover-foreground', light: '#0f172a', dark: '#f1f5f9', text: 'on-popover' },
    ]
  },
  {
    name: 'Secondary & Accent',
    colors: [
      { name: 'Secondary', variable: '--secondary', light: '#f1f5f9', dark: '#1e293b', text: 'on-secondary' },
      { name: 'Secondary Foreground', variable: '--secondary-foreground', light: '#0f172a', dark: '#f1f5f9', text: 'on-secondary' },
      { name: 'Muted', variable: '--muted', light: '#f1f5f9', dark: '#1e293b', text: 'on-muted' },
      { name: 'Muted Foreground', variable: '--muted-foreground', light: '#64748b', dark: '#94a3b8', text: 'on-muted' },
      { name: 'Accent', variable: '--accent', light: '#f1f5f9', dark: '#1e293b', text: 'on-accent' },
      { name: 'Accent Foreground', variable: '--accent-foreground', light: '#0f172a', dark: '#f1f5f9', text: 'on-accent' },
    ]
  },
  {
    name: 'Semantic',
    colors: [
      { name: 'Destructive', variable: '--destructive', light: '#dc2626', dark: '#dc2626', text: 'on-destructive' },
      { name: 'Destructive Foreground', variable: '--destructive-foreground', light: '#ffffff', dark: '#ffffff', text: 'on-destructive' },
      { name: 'Border', variable: '--border', light: '#e2e8f0', dark: '#1e293b', text: 'border' },
      { name: 'Input', variable: '--input', light: '#e2e8f0', dark: '#1e293b', text: 'input' },
      { name: 'Ring', variable: '--ring', light: '#00663d', dark: '#008f5d', text: 'focus ring' },
    ]
  }
]

const buttonVariants = [
  { variant: 'default' as const, label: 'Default' },
  { variant: 'destructive' as const, label: 'Destructive' },
  { variant: 'outline' as const, label: 'Outline' },
  { variant: 'secondary' as const, label: 'Secondary' },
  { variant: 'ghost' as const, label: 'Ghost' },
  { variant: 'link' as const, label: 'Link' },
]

const buttonSizes = [
  { size: 'default' as const, label: 'Default' },
  { size: 'sm' as const, label: 'Small' },
  { size: 'lg' as const, label: 'Large' },
  { size: 'icon' as const, label: 'Icon' },
]

const badgeVariants = [
  { variant: 'default' as const, label: 'Default' },
  { variant: 'secondary' as const, label: 'Secondary' },
  { variant: 'destructive' as const, label: 'Destructive' },
  { variant: 'outline' as const, label: 'Outline' },
  { variant: 'success' as const, label: 'Success' },
  { variant: 'warning' as const, label: 'Warning' },
]

const iconList = [
  'Calendar', 'Mail', 'Phone', 'MapPin', 'Menu', 'X', 'ChevronRight', 'ChevronLeft',
  'Plus', 'Minus', 'Search', 'Filter', 'Sort', 'Download', 'Upload', 'Edit', 'Trash',
  'Eye', 'EyeOff', 'Copy', 'AlertCircle', 'Info', 'HelpCircle', 'Settings'
]

const spacingValues = [
  { name: 'px', value: '1px' },
  { name: '0.5', value: '2px' },
  { name: '1', value: '4px' },
  { name: '2', value: '8px' },
  { name: '3', value: '12px' },
  { name: '4', value: '16px' },
  { name: '5', value: '20px' },
  { name: '6', value: '24px' },
  { name: '8', value: '32px' },
  { name: '10', value: '40px' },
  { name: '12', value: '48px' },
  { name: '16', value: '64px' },
]

const brandingDoAndDonts = {
  do: [
    { title: 'Use Primary Color', description: 'Use #00663d for primary actions, buttons, and highlights.' },
    { title: 'Maintain White Space', description: 'Keep content areas spacious to create a clean, professional look.' },
    { title: 'Use Outfit for Headings', description: 'Apply Outfit font family for all headings (h1-h6).' },
    { title: 'Use Inter for Body', description: 'Apply Inter font family for body text and paragraphs.' },
    { title: 'Consistent Border Radius', description: 'Use 8px (0.5rem) as the default border radius.' },
    { title: 'Use Semantic Colors', description: 'Apply destructive for errors, success for confirmations, warning for alerts.' },
    { title: 'Dark Mode Support', description: 'Ensure all components work in both light and dark themes.' },
  ],
  dont: [
    { title: 'Avoid Color Overrides', description: 'Do not change primary color from #00663d without approval.' },
    { title: 'No Custom Fonts', description: 'Do not add custom fonts outside of Outfit and Inter.' },
    { title: 'Avoid Fixed Heights', description: 'Do not use fixed pixel heights on containers; use padding instead.' },
    { title: 'No Unapproved Icons', description: 'Do not use icons outside of the Lucide React library.' },
    { title: 'Avoid Excessive Bold', description: 'Do not use bold on text that should be regular weight.' },
    { title: 'No Hardcoded Colors', description: 'Do not use hex colors directly; use CSS variables instead.' },
    { title: 'Avoid Inline Styles', description: 'Do not use inline styles; use Tailwind classes or CSS variables.' },
  ]
}

const assets = [
  { name: 'Logo (Primary)', format: 'SVG', size: '4KB', description: 'Forest green logo for light backgrounds' },
  { name: 'Logo (White)', format: 'SVG', size: '4KB', description: 'White logo for dark backgrounds' },
  { name: 'Logo (Favicon)', format: 'SVG', size: '2KB', description: '32x32 favicon version' },
  { name: 'Brand Icon', format: 'SVG', size: '3KB', description: 'Tooth icon for app icons' },
  { name: 'Hero Images', format: 'JPG', size: '500KB', description: 'Dental clinic photography set' },
  { name: 'Social Media Kit', format: 'ZIP', size: '2MB', description: 'Instagram, Facebook, LinkedIn templates' },
]

const externalResources = [
  { name: 'Figma Design System', description: 'Complete UI kit and component library', icon: PenTool, link: '#', color: 'bg-purple-500' },
  { name: 'Storybook Components', description: 'Interactive component documentation', icon: ExternalLink, link: '#', color: 'bg-pink-500' },
  { name: 'GitHub Repository', description: 'Source code and contribution guidelines', icon: GitBranch, link: 'https://github.com', color: 'bg-gray-800' },
]

function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])
}

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState('colors')
  
  useScrollAnimation()

  const ColorSection = () => (
    <div className="space-y-8">
      {colorCategories.map((category) => (
        <div key={category.name} className="scroll-animate animate-fade-in-up">
          <h3 className="text-lg font-semibold mb-4">{category.name}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.colors.map((color) => (
              <div key={color.name} className="bg-muted/30 rounded-lg p-4">
                <div 
                  className="h-20 rounded-lg mb-3 shadow-inner"
                  style={{ 
                    backgroundColor: color.variable.startsWith('--primary') ? '#00663d' : 
                                    color.variable.includes('foreground') && !color.variable.includes('destructive') ? '#0f172a' :
                                    color.name.toLowerCase().includes('destructive') ? '#dc2626' :
                                    color.name.toLowerCase().includes('ring') ? '#00663d' :
                                    color.name.toLowerCase().includes('border') ? '#e2e8f0' :
                                    'var(' + color.variable + ')'
                  }}
                />
                <p className="font-medium text-sm mb-1">{color.name}</p>
                <p className="text-xs text-muted-foreground mb-2">var({color.variable})</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded">{color.light}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  const TypographySection = () => (
    <div className="space-y-8">
      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4">Font Families</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Outfit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Headings font</p>
              <div className="space-y-2">
                <p className="text-4xl font-bold">Heading 1 - Bold</p>
                <p className="text-3xl font-bold">Heading 2 - Bold</p>
                <p className="text-2xl font-bold">Heading 3 - Bold</p>
                <p className="text-xl font-semibold">Heading 4 - Semibold</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Inter</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Body font</p>
              <div className="space-y-2">
                <p className="text-base">Body text - Regular</p>
                <p className="text-sm">Small text - Regular</p>
                <p className="text-xs">Caption text - Regular</p>
                <p className="text-lg">Large body text</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4">Heading Scale</h3>
        <div className="space-y-4">
          {[ 
            { tag: 'h1', size: '2.5rem (40px)', weight: '700' },
            { tag: 'h2', size: '2rem (32px)', weight: '700' },
            { tag: 'h3', size: '1.5rem (24px)', weight: '700' },
            { tag: 'h4', size: '1.25rem (20px)', weight: '600' },
            { tag: 'h5', size: '1.125rem (18px)', weight: '600' },
            { tag: 'h6', size: '1rem (16px)', weight: '600' },
          ].map((heading) => (
            <div key={heading.tag} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <span className="font-mono text-sm text-muted-foreground w-16">{heading.tag}</span>
              <span className="font-semibold">{heading.size}</span>
              <span className="text-muted-foreground text-sm">Weight: {heading.weight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const ComponentsSection = () => (
    <div className="space-y-8">
      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4">Buttons</h3>
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-3">Variants</p>
              <div className="flex flex-wrap gap-3">
                {buttonVariants.map((btn) => (
                  <Button key={btn.variant} variant={btn.variant}>
                    {btn.label}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-3">Sizes</p>
              <div className="flex flex-wrap items-center gap-3">
                {buttonSizes.map((btn) => (
                  <Button key={btn.size} size={btn.size}>
                    {btn.label}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-3">States</p>
              <div className="flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button disabled>Disabled</Button>
                <Button className="animate-pulse">Loading</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4">Form Elements</h3>
        <Card className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="input">Input</Label>
                <Input id="input" placeholder="Enter text..." />
              </div>
              <div>
                <Label htmlFor="textarea">Textarea</Label>
                <Textarea id="textarea" placeholder="Enter description..." />
              </div>
              <div>
                <Label>Checkbox</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Checkbox id="checkbox" />
                  <label htmlFor="checkbox" className="text-sm">Accept terms</label>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Select</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Option 1</SelectItem>
                    <SelectItem value="2">Option 2</SelectItem>
                    <SelectItem value="3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Disabled Input</Label>
                <Input placeholder="Disabled" disabled />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4">Badges</h3>
        <Card className="p-6">
          <div className="flex flex-wrap gap-3">
            {badgeVariants.map((badge) => (
              <Badge key={badge.variant} variant={badge.variant}>
                {badge.label}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4">Cards</h3>
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This is the card content. Cards are used to group related content.</p>
          </CardContent>
        </Card>
      </div>

      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4">Avatar</h3>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>DS</AvatarFallback>
            </Avatar>
            <Avatar className="h-12 w-12">
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <Avatar className="h-16 w-16">
              <AvatarFallback>XL</AvatarFallback>
            </Avatar>
          </div>
        </Card>
      </div>

      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4">Table</h3>
        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>John Doe</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell><Badge variant="success">Active</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jane Smith</TableCell>
                <TableCell>Dentist</TableCell>
                <TableCell><Badge variant="default">Active</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>

      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4">Tabs</h3>
        <Card className="p-6">
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4">
              <p className="text-muted-foreground">Content for Tab 1</p>
            </TabsContent>
            <TabsContent value="tab2" className="mt-4">
              <p className="text-muted-foreground">Content for Tab 2</p>
            </TabsContent>
            <TabsContent value="tab3" className="mt-4">
              <p className="text-muted-foreground">Content for Tab 3</p>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4">Separator & Skeleton</h3>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Separator />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )

  const IconsSection = () => (
    <div className="space-y-8">
      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4">Available Icons (Lucide React)</h3>
        <Card className="p-6">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {iconList.map((icon) => (
              <div key={icon} className="flex flex-col items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Box className="w-6 h-6 text-primary" />
                <span className="text-xs text-muted-foreground">{icon}</span>
              </div>
            ))}
          </div>
        </Card>
        <p className="mt-4 text-sm text-muted-foreground">
          All icons from <a href="https://lucide.dev/icons/" target="_blank" className="text-primary hover:underline">Lucide Icon Library</a> are available.
        </p>
      </div>

      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4">Usage Example</h3>
        <Card className="p-6">
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`import { Heart, Star, Shield } from 'lucide-react'

// Basic usage
<Heart className="w-6 h-6 text-primary" />

// With size variants
<Star className="w-4 h-4" />
<Star className="w-8 h-8" />

// With color
<Shield className="w-6 h-6 text-destructive" />`}
          </pre>
        </Card>
      </div>
    </div>
  )

  const SpacingSection = () => (
    <div className="space-y-8">
      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4">Tailwind Spacing Scale</h3>
        <Card className="p-6">
          <div className="space-y-3">
            {spacingValues.map((space) => (
              <div key={space.name} className="flex items-center gap-4">
                <span className="font-mono text-sm text-muted-foreground w-16">space-{space.name}</span>
                <div className="flex items-center gap-3">
                  <div 
                    className="bg-primary h-8 rounded"
                    style={{ width: space.value }}
                  />
                  <span className="text-sm text-muted-foreground w-20">{space.value}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4">Border Radius</h3>
        <Card className="p-6">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'none', value: '0' },
              { name: 'sm', value: '2px' },
              { name: 'default', value: '8px (0.5rem)' },
              { name: 'lg', value: '12px' },
              { name: 'xl', value: '16px' },
              { name: '2xl', value: '24px' },
              { name: 'full', value: '9999px (pill)' },
            ].map((radius) => (
              <div key={radius.name} className="text-center">
                <div 
                  className="bg-primary h-16 w-full mx-auto mb-2"
                  style={{ borderRadius: radius.value }}
                />
                <p className="font-medium text-sm">{radius.name}</p>
                <p className="text-xs text-muted-foreground">{radius.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4">Shadows</h3>
        <Card className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'sm', class: 'shadow-sm', desc: 'Subtle elevation' },
              { name: 'default', class: 'shadow', desc: 'Standard shadow' },
              { name: 'lg', class: 'shadow-lg', desc: 'Elevated elements' },
            ].map((shadow) => (
              <div key={shadow.name} className="text-center">
                <div className={`bg-background h-20 w-full mx-auto mb-2 rounded-lg border ${shadow.class}`} />
                <p className="font-medium text-sm">{shadow.name}</p>
                <p className="text-xs text-muted-foreground">{shadow.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )

  const BrandingSection = () => (
    <div className="space-y-8">
      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4">Brand Identity</h3>
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-32 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-primary-foreground">
                  <path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 1.5.5 2.8 1.3 3.8-.3.5-.5 1-.5 1.7 0 1.9 1.6 3.5 3.7 3.5s3.7-1.6 3.7-3.5c0-.7-.2-1.2-.5-1.7.8-1 1.3-2.3 1.3-3.8C16.5 4 14.5 2 12 2z"/>
                </svg>
              </div>
              <div>
                <h4 className="font-medium">AZ Hospital Logo</h4>
                <p className="text-sm text-muted-foreground">Primary logo using forest green (#00663d) on light backgrounds</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-16 w-32 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
                  <path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 1.5.5 2.8 1.3 3.8-.3.5-.5 1-.5 1.7 0 1.9 1.6 3.5 3.7 3.5s3.7-1.6 3.7-3.5c0-.7-.2-1.2-.5-1.7.8-1 1.3-2.3 1.3-3.8C16.5 4 14.5 2 12 2z"/>
                </svg>
              </div>
              <div>
                <h4 className="font-medium">AZ Hospital Logo (Dark)</h4>
                <p className="text-sm text-muted-foreground">White logo for dark backgrounds and dark mode</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4">Brand Voice & Tone</h3>
        <Card className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Voice Characteristics</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Professional yet approachable</li>
                <li>Compassionate and caring</li>
                <li>Trustworthy and reliable</li>
                <li>Expert and knowledgeable</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Tone Guidelines</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Use clear, simple language</li>
                <li>Avoid overly technical terms</li>
                <li>Be encouraging, not alarmist</li>
                <li>Maintain positivity throughout</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Do&apos;s
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {brandingDoAndDonts.do.map((item, index) => (
            <Card key={index} className="p-4 border-green-500/30 bg-green-500/5">
              <h4 className="font-medium mb-1">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-600" />
          Don&apos;ts
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {brandingDoAndDonts.dont.map((item, index) => (
            <Card key={index} className="p-4 border-red-500/30 bg-red-500/5">
              <h4 className="font-medium mb-1">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  const AssetsSection = () => (
    <div className="space-y-8">
      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4">Downloadable Assets</h3>
        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Name</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.name}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell><Badge variant="outline">{asset.format}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{asset.size}</TableCell>
                  <TableCell className="text-muted-foreground">{asset.description}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4">Logo Usage Guidelines</h3>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <div className="h-12 w-24 mx-auto bg-background border rounded flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#00663d" className="w-6 h-6">
                    <path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 1.5.5 2.8 1.3 3.8-.3.5-.5 1-.5 1.7 0 1.9 1.6 3.5 3.7 3.5s3.7-1.6 3.7-3.5c0-.7-.2-1.2-.5-1.7.8-1 1.3-2.3 1.3-3.8C16.5 4 14.5 2 12 2z"/>
                  </svg>
                </div>
                <p className="text-sm font-medium">Minimum clear space</p>
                <p className="text-xs text-muted-foreground">Keep 1x height margin</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <div className="h-12 w-24 mx-auto bg-primary rounded flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                    <path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 1.5.5 2.8 1.3 3.8-.3.5-.5 1-.5 1.7 0 1.9 1.6 3.5 3.7 3.5s3.7-1.6 3.7-3.5c0-.7-.2-1.2-.5-1.7.8-1 1.3-2.3 1.3-3.8C16.5 4 14.5 2 12 2z"/>
                  </svg>
                </div>
                <p className="text-sm font-medium">Light background</p>
                <p className="text-xs text-muted-foreground">Use primary green</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <div className="h-12 w-24 mx-auto bg-slate-900 rounded flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                    <path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 1.5.5 2.8 1.3 3.8-.3.5-.5 1-.5 1.7 0 1.9 1.6 3.5 3.7 3.5s3.7-1.6 3.7-3.5c0-.7-.2-1.2-.5-1.7.8-1 1.3-2.3 1.3-3.8C16.5 4 14.5 2 12 2z"/>
                  </svg>
                </div>
                <p className="text-sm font-medium">Dark background</p>
                <p className="text-xs text-muted-foreground">Use white version</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )

  const ResourcesSection = () => (
    <div className="space-y-8">
      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4">External Resources</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {externalResources.map((resource) => (
            <a 
              key={resource.name}
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="p-6 h-full transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                <div className={`w-12 h-12 ${resource.color} rounded-lg flex items-center justify-center mb-4`}>
                  <resource.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {resource.name}
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {resource.description}
                </p>
                <div className="flex items-center text-primary text-sm font-medium">
                  Open <ExternalLink className="w-4 h-4 ml-1" />
                </div>
              </Card>
            </a>
          ))}
        </div>
      </div>

      <div className="scroll-animate animate-fade-in-up">
        <h3 className="text-lg font-semibold mb-4">Development Resources</h3>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <h4 className="font-medium">NPM Package</h4>
                <p className="text-sm text-muted-foreground">@az-hospital/ui - Component library</p>
              </div>
              <Badge variant="outline">Coming Soon</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <h4 className="font-medium">Figma Tokens</h4>
                <p className="text-sm text-muted-foreground">Design tokens synced from code</p>
              </div>
              <Badge variant="outline">Coming Soon</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <h4 className="font-medium">Component Tests</h4>
                <p className="text-sm text-muted-foreground">Playwright test suite</p>
              </div>
              <Badge variant="outline">Coming Soon</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )

  const renderSection = () => {
    switch (activeTab) {
      case 'colors': return <ColorSection />
      case 'typography': return <TypographySection />
      case 'components': return <ComponentsSection />
      case 'icons': return <IconsSection />
      case 'spacing': return <SpacingSection />
      case 'branding': return <BrandingSection />
      case 'assets': return <AssetsSection />
      case 'resources': return <ResourcesSection />
      default: return <ColorSection />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-muted/30 to-background">
      <SimpleHeader />
      
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="scroll-animate text-primary-foreground/70 font-semibold text-sm tracking-wider uppercase">Documentation</span>
            <h1 className="scroll-animate animate-fade-in-up text-4xl md:text-5xl font-bold mt-2 mb-4">
              Design System
            </h1>
            <p className="scroll-animate text-xl text-primary-foreground/80">
              Complete guide to AZ Hospital&apos;s visual language, components, and brand guidelines.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-2">
              <p className="font-semibold text-foreground mb-4 px-2">Contents</p>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                    activeTab === tab.id 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {renderSection()}
          </main>
        </div>
      </div>

      <SimpleFooter />
    </div>
  )
}