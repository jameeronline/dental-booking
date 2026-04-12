'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PublicHeader, PublicFooter } from '@/components/layout/public-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ArrowRight,
  Search,
  Calendar,
  Clock,
} from 'lucide-react'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  author: { name: string; role: string; avatar: string }
  publishedDate: string
  readTime: number
  image: string
  featured: boolean
}

const blogPosts: BlogPost[] = [
  {
    slug: 'importance-regular-dental-checkups',
    title: 'Why Regular Dental Checkups Are Essential for Your Health',
    excerpt: 'Many people avoid the dentist until they have a problem, but regular checkups are key to preventing issues before they start. Learn why twice-yearly visits matter.',
    content: `
      <p>Regular dental checkups are the foundation of good oral health. While many people only visit the dentist when they experience pain or discomfort, this reactive approach can lead to more serious and costly problems down the road.</p>
      
      <h2>The Benefits of Prevention</h2>
      <p>During a routine checkup, your dentist can identify potential issues before they become serious. Cavities, gum disease, and even oral cancer can be detected early, making treatment simpler and more effective.</p>
      
      <h2>What Happens During a Checkup?</h2>
      <ul>
        <li>Professional teeth cleaning to remove plaque and tartar</li>
        <li>Thorough examination of teeth and gums</li>
        <li>Digital X-rays to detect hidden problems</li>
        <li>Oral cancer screening</li>
        <li>Personalized advice on oral hygiene</li>
      </ul>
      
      <h2>How Often Should You Visit?</h2>
      <p>The American Dental Association recommends visiting your dentist at least twice a year. However, some patients with specific conditions may need more frequent visits as recommended by their dentist.</p>
      
      <h2>Don't Wait for Pain</h2>
      <p>By the time you experience tooth pain, the problem has often progressed significantly. Regular checkups catch issues early, saving you time, money, and discomfort in the long run.</p>
    `,
    category: 'Oral Health',
    author: { name: 'Dr. Sarah Johnson', role: 'Chief Dentist', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop' },
    publishedDate: '2026-04-05',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&h=500&fit=crop',
    featured: true,
  },
  {
    slug: 'childrens-dental-care-guide',
    title: 'A Parent\'s Guide to Children\'s Dental Care',
    excerpt: 'Setting your child up for a lifetime of healthy smiles starts early. Here are essential tips for maintaining your child\'s oral health from infancy through the teen years.',
    content: `
      <p>Good dental habits start young. As a parent, you play a crucial role in establishing healthy oral care routines for your children that will last a lifetime.</p>
      
      <h2>Baby Teeth Matter</h2>
      <p>Some parents wonder why baby teeth need care if they're going to fall out anyway. The truth is, baby teeth serve important purposes: they help children chew properly, speak clearly, and hold space for permanent teeth.</p>
      
      <h2>Age-Appropriate Care</h2>
      <ul>
        <li><strong>0-2 years:</strong> Clean gums with a soft cloth, use a tiny smear of fluoride toothpaste</li>
        <li><strong>2-5 years:</strong> Brush twice daily with pea-sized toothpaste, supervise brushing</li>
        <li><strong>6-12 years:</strong> Encourage independence while maintaining supervision</li>
        <li><strong>Teens:</strong> Emphasize responsibility for their own oral health</li>
      </ul>
      
      <h2>Making Dental Visits Positive</h2>
      <p>Start dental visits early—around age one or when the first tooth appears. Choose a pediatric dentist who specializes in children's care and can make visits fun and educational.</p>
    `,
    category: 'Pediatric Dentistry',
    author: { name: 'Dr. Emily Rodriguez', role: 'Pediatric Dentist', avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop' },
    publishedDate: '2026-03-28',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?w=800&h=500&fit=crop',
    featured: false,
  },
  {
    slug: 'teeth-whitening-options',
    title: 'Teeth Whitening: Professional vs. Over-the-Counter Options',
    excerpt: 'Want a brighter smile? We compare professional whitening treatments with store-bought alternatives to help you make an informed decision.',
    content: `
      <p>A bright, white smile can boost your confidence and make you look younger. When it comes to teeth whitening, you have several options, each with pros and cons.</p>
      
      <h2>Professional In-Office Whitening</h2>
      <p>Professional whitening performed by a dentist offers the fastest and most dramatic results. Using stronger bleaching agents under professional supervision, you can achieve teeth up to 8 shades lighter in just one visit.</p>
      
      <h2>Professional Take-Home Kits</h2>
      <p>Dentist-provided take-home kits offer a middle ground. These custom-fitted trays ensure even application and typically deliver results within 1-2 weeks of daily use.</p>
      
      <h2>Over-the-Counter Products</h2>
      <p>Whitening strips, toothpastes, and kits from the drugstore are more affordable but generally less effective. Results vary and it may take longer to see changes.</p>
      
      <h2>Is Whitening Right for You?</h2>
      <p>Whitening works best on natural teeth that have become discolored from food, drinks, or smoking. It doesn't work on crowns, veneers, or fillings. A consultation with your dentist can determine the best approach for your smile.</p>
    `,
    category: 'Cosmetic Dentistry',
    author: { name: 'Dr. Sarah Johnson', role: 'Chief Dentist', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop' },
    publishedDate: '2026-03-20',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1606265752439-1ca187a9e2a5?w=800&h=500&fit=crop',
    featured: false,
  },
  {
    slug: 'gum-disease-prevention',
    title: 'Understanding and Preventing Gum Disease',
    excerpt: 'Gum disease affects nearly half of adults over 30. Learn the warning signs and prevention strategies to keep your gums healthy.',
    content: `
      <p>Gum disease, also known as periodontal disease, is a silent epidemic affecting millions. Understanding this condition is the first step toward prevention.</p>
      
      <h2>What Is Gum Disease?</h2>
      <p>Gum disease begins with plaque—a sticky film of bacteria that forms on teeth. If not removed through proper brushing and flossing, plaque hardens into tartar, causing inflammation of the gums.</p>
      
      <h2>Warning Signs</h2>
      <ul>
        <li>Red, swollen, or tender gums</li>
        <li>Bleeding while brushing or flossing</li>
        <li>Persistent bad breath</li>
        <li>Receding gums</li>
        <li>Loose teeth</li>
      </ul>
      
      <h2>Prevention Tips</h2>
      <p>The good news is that gum disease is largely preventable. Brush twice daily, floss regularly, quit smoking, and visit your dentist for regular cleanings.</p>
    `,
    category: 'Oral Health',
    author: { name: 'Dr. Michael Chen', role: 'Orthodontist', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop' },
    publishedDate: '2026-03-15',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&h=500&fit=crop',
    featured: false,
  },
  {
    slug: 'dental-implants-guide',
    title: 'Dental Implants: A Comprehensive Guide',
    excerpt: 'Considering dental implants to replace missing teeth? Learn everything you need to know about this popular and effective tooth replacement option.',
    content: `
      <p>Dental implants have revolutionized tooth replacement, offering a permanent solution that looks, feels, and functions like natural teeth.</p>
      
      <h2>What Are Dental Implants?</h2>
      <p>A dental implant is a titanium post surgically placed into the jawbone beneath the gum line. This post acts as a replacement root, providing a stable foundation for a crown, bridge, or denture.</p>
      
      <h2>The Implant Process</h2>
      <p>Getting a dental implant typically involves several steps over a few months: consultation, implant placement, healing period, abutment attachment, and finally, the crown placement.</p>
      
      <h2>Benefits of Implants</h2>
      <ul>
        <li>Natural appearance and function</li>
        <li>Preserve jawbone health</li>
        <li>Don't require altering adjacent teeth</li>
        <li>Can last a lifetime with proper care</li>
        <li>Improve confidence and quality of life</li>
      </ul>
    `,
    category: 'Restorative Dentistry',
    author: { name: 'Dr. James Williams', role: 'Oral Surgeon', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop' },
    publishedDate: '2026-03-10',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=500&fit=crop',
    featured: false,
  },
  {
    slug: 'braces-vs-invisalign',
    title: 'Braces vs. Invisalign: Which Is Right for You?',
    excerpt: 'Straighten your smile with confidence. We compare traditional braces with clear aligners to help you choose the best orthodontic treatment.',
    content: `
      <p>When it comes to straightening teeth, you have more options than ever. Traditional braces and clear aligners like Invisalign are both effective, but the best choice depends on your specific needs.</p>
      
      <h2>Traditional Braces</h2>
      <p>Metal or ceramic braces have been correcting teeth alignment for decades. They're fixed to your teeth and work continuously to move teeth into proper position.</p>
      
      <h2>Invisalign Clear Aligners</h2>
      <p>Invisalign uses a series of custom-made, removable clear aligners that gradually shift teeth. They're nearly invisible and can be removed for eating and cleaning.</p>
      
      <h2>Which Is Better?</h2>
      <p>The answer depends on your situation. Complex cases often respond better to traditional braces, while mild to moderate issues can be effectively treated with Invisalign. Your orthodontist can recommend the best option for your smile goals.</p>
    `,
    category: 'Orthodontics',
    author: { name: 'Dr. Michael Chen', role: 'Orthodontist', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop' },
    publishedDate: '2026-03-05',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=500&fit=crop',
    featured: false,
  },
]

const categories = ['all', 'Oral Health', 'Pediatric Dentistry', 'Cosmetic Dentistry', 'Restorative Dentistry', 'Orthodontics']

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredPost = blogPosts.find(p => p.featured && selectedCategory === 'all' && !searchQuery)
  const postsToShow = filteredPosts

  return (
    <>
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Dental Health Blog
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Expert advice, tips, and insights from our dental professionals to help you maintain a healthy, beautiful smile.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'All Posts' : cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && selectedCategory === 'all' && !searchQuery && (
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <Link href={`/blog/${featuredPost.slug}`} className="block">
              <Card className="overflow-hidden hover:shadow-xl transition-all group">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 md:h-auto min-h-[300px]">
                    <Image 
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <Badge className="absolute top-4 left-4 bg-primary">Featured</Badge>
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    <Badge variant="outline" className="w-fit mb-4">{featuredPost.category}</Badge>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-2">
                        <img src={featuredPost.author.avatar} alt={featuredPost.author.name} className="w-8 h-8 rounded-full object-cover" />
                        <span>{featuredPost.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(featuredPost.publishedDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime} min read
                      </div>
                    </div>
                    <Button className="w-fit gap-2">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <p className="text-muted-foreground">{filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found</p>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No articles match your search.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {postsToShow.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-2 overflow-hidden group">
                    <div className="h-48 relative">
                      <Image 
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <Badge className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground">
                        {post.category}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full object-cover" />
                          <span>{post.author.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
                          <span>{post.readTime} min</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
            <p className="text-primary-foreground/80 mb-8">
              Subscribe to our newsletter for the latest dental health tips and practice updates.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
              />
              <Button variant="secondary">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </>
  )
}

export const dynamic = 'force-dynamic'
