import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { db, storage } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { Facebook, Twitter, Linkedin, Instagram, Github, Youtube } from 'lucide-react'
import { FaTiktok, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa'


const categories = [
  'Technology', 'Health', 'Finance', 'Education', 'Social', 'Travel', 
  'E-commerce', 'Real Estate', 'Entertainment', 'SaaS', 'Website', 
  'AI', 'Others'
]

interface StartupData {
  name: string;
  description: string;
  category: string;
  images: string[];
  socialLinks: Record<string, string>;
}

interface StartupFormProps {
  initialData?: StartupData; 
  onSubmit: (data: StartupData) => void;
}

const AddStartup: React.FC<StartupFormProps> = ({ initialData, onSubmit }) => {
  const [name, setName] = useState(initialData?.name || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [category, setCategory] = useState(initialData?.category || '')
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [error, setError] = useState('')
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    github: '',
    youtube: '',
    tiktok: '',
    website: '',
    googleMaps: ''
  })
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePicture(file)
      const previewURL = URL.createObjectURL(file)
      setProfilePicturePreview(previewURL)
    }
  }

  const handleSocialLinkChange = (platform: keyof typeof socialLinks, value: string) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      setError('You must be logged in to add a startup.')
      return
    }
    if (images.length > 3) {
      setError('You can only upload up to 3 images.')
      return
    }

    setLoading(true); // Set loading to true when submitting

    try {
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const imageRef = ref(storage, `startups/${currentUser.uid}/${image.name}`)
          await uploadBytes(imageRef, image)
          return getDownloadURL(imageRef)
        })
      )

      if (profilePicture) {
        const profilePictureRef = ref(storage, `startups/${currentUser.uid}/profile_picture`)
        await uploadBytes(profilePictureRef, profilePicture)
        const profilePictureUrl = await getDownloadURL(profilePictureRef)
        imageUrls.unshift(profilePictureUrl)
      }

      await addDoc(collection(db, 'startups'), {
        name,
        description,
        category,
        images: imageUrls,
        socialLinks,
        createdBy: currentUser.uid,
        creatorDisplayName: currentUser.displayName || '',
        createdAt: new Date(),
      })

     
      onSubmit({ name, description, category, images: imageUrls, socialLinks });
      navigate('/startups');
    } catch (error) {
      console.error(error)
      setError('Failed to add startup. Please try again.')
    } finally {
      setLoading(false); // Reset loading state
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="p-6">
          <h2 className="text-3xl font-bold text-center text-primary mb-6">Add Your Startup</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-8">


            
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32">
                <img
                  src={profilePicturePreview || '/placeholder.svg?height=128&width=128'}
                  alt=""
                  className="w-full h-full object-cover rounded-full border-4 border-primary"
                />
                <label htmlFor="profilePicture" className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer">
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                  
                </label>
              </div>


              <button
    type="button"
    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
    onClick={() => document.getElementById('profilePicture')?.click()}
  >
    Upload
  </button>


</div>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your startup name"
                className="text-center text-2xl font-bold w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
   

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Enter a brief description of your startup..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

            
           

              <div className="space-y-2">
                <label htmlFor="images" className="block text-sm font-medium text-gray-700">Additional Images (Max 3)</label>
                <input
                  type="file"
                  id="images"
                  onChange={(e) => setImages(Array.from(e.target.files || []))}
                  multiple
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(socialLinks).map(([platform, value]) => (
                  <div key={platform} className="flex items-center space-x-2">
                    {platform === 'facebook' && <Facebook className="w-6 h-6 text-blue-600" />}
                    {platform === 'twitter' && <Twitter className="w-6 h-6 text-blue-400" />}
                    {platform === 'linkedin' && <Linkedin className="w-6 h-6 text-blue-700" />}
                    {platform === 'instagram' && <Instagram className="w-6 h-6 text-pink-600" />}
                    {platform === 'github' && <Github className="w-6 h-6" />}
                    {platform === 'youtube' && <Youtube className="w-6 h-6 text-red-600" />}
                    {platform === 'tiktok' && <FaTiktok className="w-6 h-6 text-black" />}
                    {platform === 'googleMaps' && <FaMapMarkerAlt className="w-6 h-6 text-green-600" />} {/* Google Maps icon */}
                    {platform === 'website' && <FaGlobe className="w-6 h-6 text-gray-600" />} {/* Globe icon for website */}
                    
                    <input
                      type="url"
                      placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                      value={value}
                      onChange={(e) => handleSocialLinkChange(platform as keyof typeof socialLinks, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg relative overflow-hidden transition duration-300 group"
              disabled={loading} 
            >
              {loading ? (
                <span>Adding your Startup...</span>
              ) : (
                <span className="relative z-10">Add Startup</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddStartup
