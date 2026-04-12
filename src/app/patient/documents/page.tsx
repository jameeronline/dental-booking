'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Document {
  id: string
  type: string
  title: string
  fileUrl: string
  description: string | null
  createdAt: string
}

export default function PatientDocumentsPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/patient/documents')
      if (res.ok) {
        setDocuments(await res.json())
      } else {
        router.push('/patient/profile')
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/patient/profile" className="inline-block mb-4">
        <Button variant="ghost" size="sm" className="gap-1">
          ← Back to Profile
        </Button>
      </Link>
      
      <h1 className="text-2xl font-bold mb-8">My Documents</h1>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-slate-500">
            No documents uploaded yet
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map(doc => (
            <Card key={doc.id}>
              <CardHeader>
                <Badge className="w-fit mb-2">{doc.type}</Badge>
                <CardTitle className="text-lg">{doc.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-500 mb-4">
                  {new Date(doc.createdAt).toLocaleDateString()}
                </div>
                {doc.description && (
                  <div className="text-sm mb-4">{doc.description}</div>
                )}
                <a 
                  href={doc.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View Document →
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}