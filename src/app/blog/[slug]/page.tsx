'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { PublicHeader, PublicFooter } from '@/components/layout/public-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Link as LinkIcon,
  Link2,
} from 'lucide-react'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  author: { name: string; role: string; avatar: string; bio: string }
  publishedDate: string
  updatedDate: string
  readTime: number
  image: string
  featured: boolean
  views: number
}

const blogPosts: Record<string, BlogPost> = {
  'importance-regular-dental-checkups': {
    slug: 'importance-regular-dental-checkups',
    title: 'Why Regular Dental Checkups Are Essential for Your Health',
    excerpt: 'Many people avoid the dentist until they have a problem, but regular checkups are key to preventing issues before they start. Learn why twice-yearly visits matter.',
    content: `
      <p>Regular dental checkups are the foundation of good oral health. While many people only visit the dentist when they experience pain or discomfort, this reactive approach can lead to more serious and costly problems down the road.</p>
      
      <h2>The Benefits of Prevention</h2>
      <p>During a routine checkup, your dentist can identify potential issues before they become serious. Cavities, gum disease, and even oral cancer can be detected early, making treatment simpler and more effective.</p>
      <p>Early detection not only saves you from potential pain but can also save thousands of dollars in extensive treatments. A small cavity treated promptly is far less expensive than a root canal or tooth extraction needed after years of neglect.</p>
      
      <h2>What Happens During a Checkup?</h2>
      <ul>
        <li><strong>Professional teeth cleaning:</strong> Even with excellent home care, plaque and tartar can build up in hard-to-reach areas. Professional cleaning removes these deposits and polishes your teeth.</li>
        <li><strong>Thorough examination:</strong> Your dentist will examine each tooth for signs of decay, cracks, or wear, as well as check your gums for signs of disease.</li>
        <li><strong>Digital X-rays:</strong> These allow your dentist to see what's happening beneath the surface, detecting issues not visible to the naked eye.</li>
        <li><strong>Oral cancer screening:</strong> Early detection of oral cancer dramatically improves treatment outcomes. Your dentist will check for unusual lumps, patches, or sores.</li>
        <li><strong>Personalized advice:</strong> Your dentist can provide specific recommendations based on your unique oral health needs and risk factors.</li>
      </ul>
      
      <h2>How Often Should You Visit?</h2>
      <p>The American Dental Association recommends visiting your dentist at least twice a year for checkups and cleanings. However, some patients with specific conditions may need more frequent visits as recommended by their dentist.</p>
      <p>These conditions may include:</p>
      <ul>
        <li>Pregnancy (hormonal changes can affect gum health)</li>
        <li>Diabetes (increased risk of gum disease)</li>
        <li>Smokers (higher risk of gum disease and oral cancer)</li>
        <li>Weakened immune systems</li>
        <li>History of cavities or gum disease</li>
      </ul>
      
      <h2>Don't Wait for Pain</h2>
      <p>By the time you experience tooth pain, the problem has often progressed significantly. Many dental issues are painless in their early stages, which is why regular checkups are so important.</p>
      <p>Remember: Prevention is always better than cure. By committing to regular dental visits, you're investing in your long-term oral health and overall well-being.</p>
      
      <h2>Making the Most of Your Visit</h2>
      <p>To get the most out of your dental checkups:</p>
      <ul>
        <li>Be honest about your oral hygiene habits</li>
        <li>Discuss any concerns or symptoms you've noticed</li>
        <li>Ask questions about treatments or procedures</li>
        <li>Follow through on recommended follow-up appointments</li>
        <li>Maintain good oral hygiene between visits</li>
      </ul>
    `,
    category: 'Oral Health',
    author: { 
      name: 'Dr. Sarah Johnson', 
      role: 'Chief Dentist', 
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop',
      bio: 'Dr. Sarah Johnson has over 20 years of experience in general and cosmetic dentistry. She is passionate about patient education and preventive care.'
    },
    publishedDate: '2026-04-05',
    updatedDate: '2026-04-05',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&h=600&fit=crop',
    featured: true,
    views: 2450,
  },
  'childrens-dental-care-guide': {
    slug: 'childrens-dental-care-guide',
    title: 'A Parent\'s Guide to Children\'s Dental Care',
    excerpt: 'Setting your child up for a lifetime of healthy smiles starts early. Here are essential tips for maintaining your child\'s oral health from infancy through the teen years.',
    content: `
      <p>Good dental habits start young. As a parent, you play a crucial role in establishing healthy oral care routines for your children that will last a lifetime.</p>
      
      <h2>Baby Teeth Matter</h2>
      <p>Some parents wonder why baby teeth need care if they're going to fall out anyway. The truth is, baby teeth serve important purposes: they help children chew properly, speak clearly, and hold space for permanent teeth. Premature loss of baby teeth can lead to alignment issues with permanent teeth.</p>
      
      <h2>Age-Appropriate Care</h2>
      <p>Your child's dental care needs change as they grow:</p>
      <ul>
        <li><strong>0-2 years:</strong> Clean gums with a soft, damp cloth after feeding. Use a tiny smear of fluoride toothpaste (about the size of a grain of rice) when the first tooth appears.</li>
        <li><strong>2-5 years:</strong> Brush twice daily with a pea-sized amount of fluoride toothpaste. Supervise brushing to ensure they don't swallow toothpaste.</li>
        <li><strong>6-12 years:</strong> Encourage independence while maintaining some supervision. This is when permanent teeth start coming in.</li>
        <li><strong>Teens:</strong> Emphasize responsibility for their own oral health. Address cosmetic concerns about braces or whitening.</li>
      </ul>
      
      <h2>Making Dental Visits Positive</h2>
      <p>Start dental visits early—around age one or when the first tooth appears. Choose a pediatric dentist who specializes in children's care and can make visits fun and educational.</p>
      <p>Tips for positive dental experiences:</p>
      <ul>
        <li>Talk about the dentist positively</li>
        <li>Read children's books about dental visits</li>
        <li>Never use the dentist as a threat</li>
        <li>Lead by example with your own dental care</li>
      </ul>
      
      <h2>Nutrition for Healthy Teeth</h2>
      <p>What your child eats affects their dental health. Limit sugary snacks and drinks, encourage water intake, and provide calcium-rich foods for strong teeth and bones.</p>
    `,
    category: 'Pediatric Dentistry',
    author: { 
      name: 'Dr. Emily Rodriguez', 
      role: 'Pediatric Dentist', 
      avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop',
      bio: 'Dr. Emily Rodriguez specializes in pediatric dentistry and is known for her gentle, patient-centered approach with children of all ages.'
    },
    publishedDate: '2026-03-28',
    updatedDate: '2026-03-28',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?w=1200&h=600&fit=crop',
    featured: false,
    views: 1890,
  },
  'teeth-whitening-options': {
    slug: 'teeth-whitening-options',
    title: 'Teeth Whitening: Professional vs. Over-the-Counter Options',
    excerpt: 'Want a brighter smile? We compare professional whitening treatments with store-bought alternatives to help you make an informed decision.',
    content: `
      <p>A bright, white smile can boost your confidence and make you look younger. When it comes to teeth whitening, you have several options, each with pros and cons.</p>
      
      <h2>Professional In-Office Whitening</h2>
      <p>Professional whitening performed by a dentist offers the fastest and most dramatic results. Using stronger bleaching agents under professional supervision, you can achieve teeth up to 8 shades lighter in just one visit.</p>
      <p>Benefits include:</p>
      <ul>
        <li>Immediate results</li>
        <li>Dentist-supervised for safety</li>
        <li>Customized treatment</li>
        <li>Protection for sensitive areas</li>
      </ul>
      
      <h2>Professional Take-Home Kits</h2>
      <p>Dentist-provided take-home kits offer a middle ground. These custom-fitted trays ensure even application and typically deliver results within 1-2 weeks of daily use.</p>
      <p>Advantages:</p>
      <ul>
        <li>Convenience of home treatment</li>
        <li>Professional-grade results</li>
        <li>Custom trays for better fit</li>
        <li>More control over whitening level</li>
      </ul>
      
      <h2>Over-the-Counter Products</h2>
      <p>Whitening strips, toothpastes, and kits from the drugstore are more affordable but generally less effective. Results vary and it may take longer to see changes.</p>
      
      <h2>Is Whitening Right for You?</h2>
      <p>Whitening works best on natural teeth that have become discolored from food, drinks, or smoking. It doesn't work on crowns, veneers, or fillings. A consultation with your dentist can determine the best approach for your smile.</p>
    `,
    category: 'Cosmetic Dentistry',
    author: { 
      name: 'Dr. Sarah Johnson', 
      role: 'Chief Dentist', 
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop',
      bio: 'Dr. Sarah Johnson has over 20 years of experience in general and cosmetic dentistry.'
    },
    publishedDate: '2026-03-20',
    updatedDate: '2026-03-20',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1606265752439-1ca187a9e2a5?w=1200&h=600&fit=crop',
    featured: false,
    views: 3200,
  },
  'gum-disease-prevention': {
    slug: 'gum-disease-prevention',
    title: 'Understanding and Preventing Gum Disease',
    excerpt: 'Gum disease affects nearly half of adults over 30. Learn the warning signs and prevention strategies to keep your gums healthy.',
    content: `
      <p>Gum disease, also known as periodontal disease, is a silent epidemic affecting millions. Understanding this condition is the first step toward prevention.</p>
      
      <h2>What Is Gum Disease?</h2>
      <p>Gum disease begins with plaque—a sticky film of bacteria that forms on teeth. If not removed through proper brushing and flossing, plaque hardens into tartar, causing inflammation of the gums. This early stage is called gingivitis.</p>
      <p>If left untreated, gingivitis can progress to periodontitis, a more serious infection that can damage the bones supporting your teeth.</p>
      
      <h2>Warning Signs</h2>
      <ul>
        <li>Red, swollen, or tender gums</li>
        <li>Bleeding while brushing or flossing</li>
        <li>Persistent bad breath</li>
        <li>Receding gums</li>
        <li>Loose teeth</li>
        <li>Changes in bite or tooth alignment</li>
      </ul>
      
      <h2>Prevention Tips</h2>
      <p>The good news is that gum disease is largely preventable:</p>
      <ul>
        <li>Brush twice daily for two minutes</li>
        <li>Floss daily to remove plaque between teeth</li>
        <li>Use an antibacterial mouthwash</li>
        <li>Quit smoking or using tobacco</li>
        <li>Manage stress levels</li>
        <li>Visit your dentist regularly for cleanings</li>
      </ul>
      
      <h2>Treatment Options</h2>
      <p>If you already have gum disease, treatments range from deep cleaning (scaling and root planing) to surgical procedures for advanced cases. Early intervention is key to preventing tooth loss.</p>
    `,
    category: 'Oral Health',
    author: { 
      name: 'Dr. Michael Chen', 
      role: 'Orthodontist', 
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop',
      bio: 'Dr. Michael Chen specializes in orthodontics and is passionate about helping patients achieve healthy, beautiful smiles.'
    },
    publishedDate: '2026-03-15',
    updatedDate: '2026-03-15',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1200&h=600&fit=crop',
    featured: false,
    views: 2100,
  },
  'dental-implants-guide': {
    slug: 'dental-implants-guide',
    title: 'Dental Implants: A Comprehensive Guide',
    excerpt: 'Considering dental implants to replace missing teeth? Learn everything you need to know about this popular and effective tooth replacement option.',
    content: `
      <p>Dental implants have revolutionized tooth replacement, offering a permanent solution that looks, feels, and functions like natural teeth.</p>
      
      <h2>What Are Dental Implants?</h2>
      <p>A dental implant is a titanium post surgically placed into the jawbone beneath the gum line. This post acts as a replacement root, providing a stable foundation for a crown, bridge, or denture.</p>
      <p>Over time, the implant fuses with the bone in a process called osseointegration, creating a strong, stable base for artificial teeth.</p>
      
      <h2>The Implant Process</h2>
      <p>Getting a dental implant typically involves several steps over a few months:</p>
      <ul>
        <li><strong>Consultation:</strong> Your dentist evaluates your oral health and creates a treatment plan</li>
        <li><strong>Implant placement:</strong> The titanium post is surgically placed into the jawbone</li>
        <li><strong>Healing period:</strong> Several months for the implant to fuse with the bone</li>
        <li><strong>Abutment attachment:</strong> A small connector is placed on top of the implant</li>
        <li><strong>Crown placement:</strong> The custom-made artificial tooth is attached</li>
      </ul>
      
      <h2>Benefits of Implants</h2>
      <ul>
        <li>Natural appearance and function</li>
        <li>Preserve jawbone health</li>
        <li>Don't require altering adjacent teeth</li>
        <li>Can last a lifetime with proper care</li>
        <li>Improve confidence and quality of life</li>
      </ul>
      
      <h2>Are You a Candidate?</h2>
      <p>Most adults with good general health are candidates for dental implants. Factors like adequate bone density, healthy gums, and commitment to oral hygiene are important for success.</p>
    `,
    category: 'Restorative Dentistry',
    author: { 
      name: 'Dr. James Williams', 
      role: 'Oral Surgeon', 
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop',
      bio: 'Dr. James Williams is an oral surgeon with expertise in dental implants and complex surgical procedures.'
    },
    publishedDate: '2026-03-10',
    updatedDate: '2026-03-10',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&h=600&fit=crop',
    featured: false,
    views: 2800,
  },
  'braces-vs-invisalign': {
    slug: 'braces-vs-invisalign',
    title: 'Braces vs. Invisalign: Which Is Right for You?',
    excerpt: 'Straighten your smile with confidence. We compare traditional braces with clear aligners to help you choose the best orthodontic treatment.',
    content: `
      <p>When it comes to straightening teeth, you have more options than ever. Traditional braces and clear aligners like Invisalign are both effective, but the best choice depends on your specific needs.</p>
      
      <h2>Traditional Braces</h2>
      <p>Metal or ceramic braces have been correcting teeth alignment for decades. They're fixed to your teeth and work continuously to move teeth into proper position.</p>
      <p>Advantages:</p>
      <ul>
        <li>Highly effective for complex cases</li>
        <li>No patient compliance required</li>
        <li>Can treat severe misalignment</li>
        <li>Generally more affordable</li>
      </ul>
      
      <h2>Invisalign Clear Aligners</h2>
      <p>Invisalign uses a series of custom-made, removable clear aligners that gradually shift teeth. They're nearly invisible and can be removed for eating and cleaning.</p>
      <p>Advantages:</p>
      <ul>
        <li>Virtually invisible appearance</li>
        <li>Removable for eating and cleaning</li>
        <li>More comfortable than braces</li>
        <li>No food restrictions</li>
        <li>Easier oral hygiene maintenance</li>
      </ul>
      
      <h2>Which Is Better?</h2>
      <p>The answer depends on your situation. Complex cases often respond better to traditional braces, while mild to moderate issues can be effectively treated with Invisalign. Your orthodontist can recommend the best option for your smile goals.</p>
      
      <h2>Making Your Decision</h2>
      <p>Consider these factors:</p>
      <ul>
        <li>Severity of misalignment</li>
        <li>Budget considerations</li>
        <li>Lifestyle preferences</li>
        <li>Commitment to wearing aligners</li>
        <li>Treatment duration expectations</li>
      </ul>
    `,
    category: 'Orthodontics',
    author: { 
      name: 'Dr. Michael Chen', 
      role: 'Orthodontist', 
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop',
      bio: 'Dr. Michael Chen specializes in orthodontics and is passionate about helping patients achieve healthy, beautiful smiles.'
    },
    publishedDate: '2026-03-05',
    updatedDate: '2026-03-05',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=600&fit=crop',
    featured: false,
    views: 1950,
  },
}

const relatedPosts = [
  {
    slug: 'importance-regular-dental-checkups',
    title: 'Why Regular Dental Checkups Are Essential',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=250&fit=crop',
    category: 'Oral Health'
  },
  {
    slug: 'gum-disease-prevention',
    title: 'Understanding and Preventing Gum Disease',
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=250&fit=crop',
    category: 'Oral Health'
  },
  {
    slug: 'teeth-whitening-options',
    title: 'Teeth Whitening Options Compared',
    image: 'https://images.unsplash.com/photo-1606265752439-1ca187a9e2a5?w=400&h=250&fit=crop',
    category: 'Cosmetic Dentistry'
  },
]

export default function BlogPostPage() {
  const params = useParams()
  const post = blogPosts[params.slug as string]

  if (!post) {
    return (
      <>
        <PublicHeader />
        <div className="min-h-screen bg-muted/30 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">This article doesn't exist or has been removed.</p>
            <Link href="/blog">
              <Button>View All Articles</Button>
            </Link>
          </div>
        </div>
        <PublicFooter />
      </>
    )
  }

  return (
    <>
      <PublicHeader />
      
      <article className="min-h-screen bg-muted/30">
        {/* Hero Image */}
        <div className="relative h-80 md:h-96">
          <Image 
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 mb-4">
                {post.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-4xl">
                {post.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Meta */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-foreground">{post.author.name}</p>
                        <p className="text-xs">{post.author.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime} min read
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.views.toLocaleString()} views
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none prose-gray prose-headings:scroll-mt-20 prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-li:text-muted-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-img:rounded-xl prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Share */}
              <Card className="mt-8">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground mb-1">Share this article</p>
                      <p className="text-sm text-muted-foreground">Help others learn about dental health</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Link2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Link2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Link2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <LinkIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Author Bio */}
              <Card className="mt-8">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img src={post.author.avatar} alt={post.author.name} className="w-16 h-16 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-foreground text-lg">{post.author.name}</p>
                      <p className="text-primary text-sm mb-2">{post.author.role}</p>
                      <p className="text-sm text-muted-foreground">{post.author.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Related Posts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Related Articles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {relatedPosts.map((related, i) => (
                      <Link key={i} href={`/blog/${related.slug}`} className="flex gap-3 group">
                        <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image 
                            src={related.image}
                            alt={related.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-primary mb-1">{related.category}</p>
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {related.title}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>

                {/* Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {['Oral Health', 'Pediatric Dentistry', 'Cosmetic Dentistry', 'Restorative Dentistry', 'Orthodontics'].map((cat, i) => (
                        <Badge key={i} variant={cat === post.category ? 'default' : 'outline'} className="cursor-pointer">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* CTA */}
                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-10 h-10 mx-auto mb-4 opacity-80" />
                    <h3 className="font-bold text-lg mb-2">Book an Appointment</h3>
                    <p className="text-sm text-primary-foreground/80 mb-4">
                      Have questions? Schedule a consultation with our experts.
                    </p>
                    <Link href="/book">
                      <Button variant="secondary" className="w-full">
                        Book Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </article>

      <PublicFooter />
    </>
  )
}
