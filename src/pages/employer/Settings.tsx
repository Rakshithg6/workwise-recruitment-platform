
import { useState, useEffect, useRef } from 'react';
import { User, Shield, Bell, Globe, Lock, Moon, Smartphone, Mail, Save, Upload, RefreshCw, X, Plus, Briefcase as BriefcaseIcon } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Define education and experience types
interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrentPosition: boolean;
}

const Settings = () => {
  useEffect(() => {
    document.title = 'Settings | WorkWise';
  }, []);

  const { userData, updateUserData } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(userData.photoUrl || null);
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string | null>(null);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    ...userData,
    firstName: userData.firstName || '',
    lastName: userData.lastName || '',
    email: userData.email || '',
    phone: userData.phone || '',
    jobTitle: userData.jobTitle || '',
  });
  const [isCompanyLogoDialogOpen, setIsCompanyLogoDialogOpen] = useState(false);
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null);
  const [tempCompanyLogoUrl, setTempCompanyLogoUrl] = useState<string | null>(null);
  
  // Education and Experience state
  const [educations, setEducations] = useState<Education[]>([
    {
      id: '1',
      institution: 'Indian Institute of Technology, Delhi',
      degree: 'Bachelor of Technology',
      field: 'Computer Science',
      startDate: '2010-08',
      endDate: '2014-05',
      description: 'Graduated with honors. Specialized in machine learning and data structures.'
    }
  ]);
  
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: '1',
      company: 'Infosys',
      position: 'Software Engineer',
      startDate: '2014-06',
      endDate: '2018-04',
      description: 'Worked on enterprise web applications using React and Node.js.',
      isCurrentPosition: false
    }
  ]);
  
  // Dialog states for education and experience
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  
  // Form states
  const [newEducation, setNewEducation] = useState<Omit<Education, 'id'>>({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  
  const [newExperience, setNewExperience] = useState<Omit<Experience, 'id'>>({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
    isCurrentPosition: false
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      // Update user data in context and localStorage
      const updatedData = {
        ...userData,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        jobTitle: formData.jobTitle,
        photoUrl: avatarUrl || undefined
      };
      
      // Save to localStorage first
      localStorage.setItem('workwise-user-data', JSON.stringify(updatedData));
      
      // Keep the form data in sync
      setFormData(currentForm => ({
        ...currentForm,
        ...updatedData
      }));
      
      // Then update context
      updateUserData(updatedData);
      
      setSaving(false);
      toast({
        title: "Settings saved successfully",
        description: "Your preferences have been updated.",
      });
    }, 1000);
  };

  const handleAvatarClick = () => {
    setIsAvatarDialogOpen(true);
  };

  const handleCompanyLogoClick = () => {
    setIsCompanyLogoDialogOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'logo') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or JPG image file.",
        variant: "destructive"
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'avatar') {
        setTempAvatarUrl(result);
      } else {
        setTempCompanyLogoUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = () => {
    setAvatarUrl(tempAvatarUrl);
    setIsAvatarDialogOpen(false);
    toast({
      title: "Avatar updated",
      description: "Your profile picture has been updated successfully."
    });
  };

  const handleLogoUpload = () => {
    setCompanyLogoUrl(tempCompanyLogoUrl);
    setIsCompanyLogoDialogOpen(false);
    toast({
      title: "Company logo updated",
      description: "Your company logo has been updated successfully."
    });
  };

  const triggerFileInput = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  const handleAddEducation = () => {
    if (editingEducation) {
      setEducations(prev => prev.map(edu => 
        edu.id === editingEducation.id ? { ...editingEducation } : edu
      ));
      setEditingEducation(null);
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      setEducations(prev => [...prev, { ...newEducation, id: newId }]);
    }
    setNewEducation({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: ''
    });
    setIsEducationDialogOpen(false);
  };

  const handleAddExperience = () => {
    if (editingExperience) {
      setExperiences(prev => prev.map(exp => 
        exp.id === editingExperience.id ? { ...editingExperience } : exp
      ));
      setEditingExperience(null);
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      setExperiences(prev => [...prev, { ...newExperience, id: newId }]);
    }
    setNewExperience({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      isCurrentPosition: false
    });
    setIsExperienceDialogOpen(false);
  };

  const handleEditEducation = (education: Education) => {
    setEditingEducation(education);
    setNewEducation(education);
    setIsEducationDialogOpen(true);
  };

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience);
    setNewExperience(experience);
    setIsExperienceDialogOpen(true);
  };

  const handleDeleteEducation = (id: string) => {
    setEducations(prev => prev.filter(edu => edu.id !== id));
  };

  const handleDeleteExperience = (id: string) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id));
  };

  return (
    <DashboardLayout type="employer">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Account Settings</h1>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 font-medium"
            disabled={saving}
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Saving...</span>
              </div>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <div className={`bg-gradient-to-b ${theme === 'dark' ? 'from-gray-800/80 to-black/90' : 'from-gray-100 to-white'} border ${theme === 'dark' ? 'border-indigo-500/20' : 'border-gray-200'} rounded-xl p-6 shadow-xl`}>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8 bg-transparent">
              <TabsTrigger value="profile" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <Shield className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="education" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <User className="mr-2 h-4 w-4" />
                Education
              </TabsTrigger>
              <TabsTrigger value="experience" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <BriefcaseIcon className="mr-2 h-4 w-4" />
                Experience
              </TabsTrigger>
              <TabsTrigger value="company" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <Globe className="mr-2 h-4 w-4" />
                Company
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className={`w-32 h-32 ${theme === 'dark' ? 'border-4 border-indigo-500/30' : 'border-4 border-indigo-200/50'}`}>
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt="Profile" />
                    ) : (
                      <AvatarFallback className={`${theme === 'dark' ? 'bg-indigo-500/20 text-white' : 'bg-indigo-100 text-indigo-600'} text-xl`}>
                        {formData.firstName && formData.lastName ? 
                          `${formData.firstName[0]}${formData.lastName[0]}` : 
                          "SJ"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Button 
                    variant="outline" 
                    className={`${theme === 'dark' ? 'border-indigo-500/30 text-white hover:bg-indigo-600/20' : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'}`} 
                    onClick={handleAvatarClick}
                  >
                    <Upload size={16} className="mr-2" />
                    Change Avatar
                  </Button>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>First Name</label>
                      <input 
                        type="text" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full ${theme === 'dark' ? 'bg-black/50 border-indigo-500/30 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Last Name</label>
                      <input 
                        type="text" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full ${theme === 'dark' ? 'bg-black/50 border-indigo-500/30 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full ${theme === 'dark' ? 'bg-black/50 border-indigo-500/30 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className={`w-full ${theme === 'dark' ? 'bg-black/50 border-indigo-500/30 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Job Title</label>
                    <input 
                      type="text" 
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      placeholder="HR Manager"
                      className={`w-full ${theme === 'dark' ? 'bg-black/50 border-indigo-500/30 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none`}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-white">Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/90">Current Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter current password" 
                      className="w-full bg-black/50 border border-indigo-500/30 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/90">New Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter new password" 
                      className="w-full bg-black/50 border border-indigo-500/30 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/90">Confirm New Password</label>
                    <input 
                      type="password" 
                      placeholder="Confirm new password" 
                      className="w-full bg-black/50 border border-indigo-500/30 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-indigo-500/20">
                <h3 className="text-lg font-medium text-white">Two-Factor Authentication</h3>
                <p className="text-sm text-white/70">Add an extra layer of security to your account</p>
                <div className="flex items-center space-x-2 mt-4">
                  <Switch id="2fa" />
                  <label htmlFor="2fa" className="text-sm font-medium text-white">Enable Two-Factor Authentication</label>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="theme" className="space-y-6">
              <div className="space-y-6 max-w-2xl">
                <div className="space-y-4">
                  <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Appearance Settings</h3>
                  <p className={theme === 'dark' ? 'text-white/70 text-sm' : 'text-gray-600 text-sm'}>Customize the look and feel of your WorkWise experience.</p>
                  
                  <div className={`flex items-center justify-between p-4 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'} rounded-lg border`}>
                    <div className="flex items-center gap-3">
                      {theme === 'light' ? (
                        <Moon className="h-6 w-6 text-yellow-500" />
                      ) : (
                        <Moon className="h-6 w-6 text-blue-300" />
                      )}
                      <div>
                        <h4 className={theme === 'dark' ? 'text-white font-medium' : 'text-gray-900 font-medium'}>Theme Mode</h4>
                        <p className={theme === 'dark' ? 'text-white/70 text-sm' : 'text-gray-600 text-sm'}>Switch between dark and light mode</p>
                      </div>
                    </div>
                    <Switch 
                      id="theme-toggle"
                      checked={theme === 'dark'}
                      onCheckedChange={toggleTheme}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="education" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Education</h3>
                <Button 
                  onClick={() => setIsEducationDialogOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Plus size={16} className="mr-2" />
                  Add Education
                </Button>
              </div>
              
              <div className="space-y-4">
                {educations.length > 0 ? (
                  educations.map((edu) => (
                    <div key={edu.id} className="bg-black/50 border border-indigo-500/20 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-medium">{edu.institution}</h4>
                          <p className="text-white/80 text-sm mt-1">{edu.degree} in {edu.field}</p>
                          <p className="text-white/60 text-xs mt-1">
                            {new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                            {new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                          </p>
                          {edu.description && (
                            <p className="text-white/70 text-sm mt-2">{edu.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditEducation(edu)}
                            className="text-white hover:bg-white/10"
                          >
                            <RefreshCw size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteEducation(edu.id)}
                            className="text-red-400 hover:bg-red-900/20"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-black/30 rounded-lg border border-indigo-500/10">
                    <p className="text-white/50">No education entries yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="experience" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Work Experience</h3>
                <Button 
                  onClick={() => setIsExperienceDialogOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Plus size={16} className="mr-2" />
                  Add Experience
                </Button>
              </div>
              
              <div className="space-y-4">
                {experiences.length > 0 ? (
                  experiences.map((exp) => (
                    <div key={exp.id} className="bg-black/50 border border-indigo-500/20 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-medium">{exp.position}</h4>
                          <p className="text-white/80 text-sm mt-1">{exp.company}</p>
                          <p className="text-white/60 text-xs mt-1">
                            {new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                            {exp.isCurrentPosition ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                          </p>
                          {exp.description && (
                            <p className="text-white/70 text-sm mt-2">{exp.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditExperience(exp)}
                            className="text-white hover:bg-white/10"
                          >
                            <RefreshCw size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteExperience(exp.id)}
                            className="text-red-400 hover:bg-red-900/20"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-black/30 rounded-lg border border-indigo-500/10">
                    <p className="text-white/50">No experience entries yet</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="company" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Company Name</label>
                    <input 
                      type="text" 
                      defaultValue="TechCorp" 
                      className="w-full bg-black/50 border border-indigo-500/30 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Industry</label>
                    <select className="w-full bg-black/50 border border-indigo-500/30 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none">
                      <option>Technology</option>
                      <option>Finance</option>
                      <option>Healthcare</option>
                      <option>Education</option>
                      <option>Manufacturing</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Company Size</label>
                    <select className="w-full bg-black/50 border border-indigo-500/30 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none">
                      <option>1-10 employees</option>
                      <option>11-50 employees</option>
                      <option selected>51-200 employees</option>
                      <option>201-500 employees</option>
                      <option>501-1000 employees</option>
                      <option>1000+ employees</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Website</label>
                    <input 
                      type="url" 
                      defaultValue="https://techcorp.example.com" 
                      className="w-full bg-black/50 border border-indigo-500/30 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-indigo-500/20">
                <h3 className="text-lg font-medium text-white">Company Logo</h3>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-indigo-500/20 rounded-md flex items-center justify-center border border-indigo-500/30 overflow-hidden">
                    {companyLogoUrl ? (
                      <img src={companyLogoUrl} alt="Company Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-white">TC</span>
                    )}
                  </div>
                  <Button variant="outline" className="border-indigo-500/30 text-white hover:bg-indigo-600/20" onClick={handleCompanyLogoClick}>
                    <Upload size={16} className="mr-2" />
                    Upload New Logo
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Avatar Upload Dialog */}
      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <DialogContent className="bg-gradient-to-b from-gray-800 to-black border-indigo-500/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Profile Picture</DialogTitle>
            <DialogDescription className="text-white/70">
              Choose a profile picture to upload. The file should be a JPEG, PNG, or JPG image.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <Avatar className={`w-32 h-32 border-4 border-indigo-500/30`}>
                {tempAvatarUrl ? (
                  <AvatarImage src={tempAvatarUrl} alt="Preview" />
                ) : avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Current" />
                ) : (
                  <AvatarFallback className={`${theme === 'dark' ? 'bg-indigo-500/20 text-white' : 'bg-indigo-100 text-indigo-600'} text-xl`}>SJ</AvatarFallback>
                )}
              </Avatar>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="border-indigo-500/30 text-white hover:bg-indigo-600/20"
                  onClick={() => triggerFileInput(fileInputRef)}
                >
                  <Upload size={16} className="mr-2" />
                  Browse Files
                </Button>
                
                {tempAvatarUrl && (
                  <Button 
                    variant="outline" 
                    className="border-red-500/30 text-red-400 hover:bg-red-900/20"
                    onClick={() => setTempAvatarUrl(null)}
                  >
                    <X size={16} className="mr-2" />
                    Clear
                  </Button>
                )}
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e, 'avatar')}
                accept="image/jpeg,image/jpg,image/png"
                className="hidden"
              />
              
              <p className="text-xs text-white/50 text-center mt-2">
                Supported formats: JPEG, PNG, JPG. Max size: 5MB.
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setIsAvatarDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAvatarUpload}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
              disabled={!tempAvatarUrl}
            >
              Save Avatar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Company Logo Upload Dialog */}
      <Dialog open={isCompanyLogoDialogOpen} onOpenChange={setIsCompanyLogoDialogOpen}>
        <DialogContent className="bg-gradient-to-b from-gray-800 to-black border-indigo-500/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Company Logo</DialogTitle>
            <DialogDescription className="text-white/70">
              Choose a logo for your company
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 bg-indigo-500/20 rounded-lg flex items-center justify-center border-4 border-indigo-500/30 overflow-hidden">
                {tempCompanyLogoUrl ? (
                  <img src={tempCompanyLogoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : companyLogoUrl ? (
                  <img src={companyLogoUrl} alt="Current" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-white">TC</span>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="border-indigo-500/30 text-white hover:bg-indigo-600/20"
                  onClick={() => triggerFileInput(logoFileInputRef)}
                >
                  <Upload size={16} className="mr-2" />
                  Browse Files
                </Button>
                
                {tempCompanyLogoUrl && (
                  <Button 
                    variant="outline" 
                    className="border-red-500/30 text-red-400 hover:bg-red-900/20"
                    onClick={() => setTempCompanyLogoUrl(null)}
                  >
                    <X size={16} className="mr-2" />
                    Clear
                  </Button>
                )}
              </div>
              
              <input
                type="file"
                ref={logoFileInputRef}
                onChange={(e) => handleFileChange(e, 'logo')}
                accept="image/jpeg,image/jpg,image/png"
                className="hidden"
              />
              
              <p className="text-xs text-white/50 text-center mt-2">
                Supported formats: JPEG, PNG, JPG. Max size: 5MB.
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setIsCompanyLogoDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleLogoUpload}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
              disabled={!tempCompanyLogoUrl}
            >
              Save Logo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Education Dialog */}
      <Dialog open={isEducationDialogOpen} onOpenChange={setIsEducationDialogOpen}>
        <DialogContent className="bg-gradient-to-b from-gray-800 to-black border-indigo-500/30 text-white">
          <DialogHeader>
            <DialogTitle>{editingEducation ? 'Edit Education' : 'Add Education'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Institution</label>
              <input
                type="text"
                value={newEducation.institution}
                onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                className="w-full px-3 py-2 bg-black/30 border border-indigo-500/30 rounded-lg focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-white/50"
                placeholder="Enter institution name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Degree</label>
                <input
                  type="text"
                  value={newEducation.degree}
                  onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                  className="w-full px-3 py-2 bg-black/30 border border-indigo-500/30 rounded-lg focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-white/50"
                  placeholder="Enter degree"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Field of Study</label>
                <input
                  type="text"
                  value={newEducation.field}
                  onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
                  className="w-full px-3 py-2 bg-black/30 border border-indigo-500/30 rounded-lg focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-white/50"
                  placeholder="Enter field of study"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Start Date</label>
                <input
                  type="month"
                  value={newEducation.startDate}
                  onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
                  className="w-full px-3 py-2 bg-black/30 border border-indigo-500/30 rounded-lg focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-white/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">End Date</label>
                <input
                  type="month"
                  value={newEducation.endDate}
                  onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
                  className="w-full px-3 py-2 bg-black/30 border border-indigo-500/30 rounded-lg focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Description</label>
              <textarea
                value={newEducation.description}
                onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
                className="w-full px-3 py-2 bg-black/30 border border-indigo-500/30 rounded-lg focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-white/50 min-h-[100px]"
                placeholder="Enter description"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setIsEducationDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddEducation}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
            >
              {editingEducation ? 'Save Changes' : 'Add Education'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Experience Dialog */}
      <Dialog open={isExperienceDialogOpen} onOpenChange={setIsExperienceDialogOpen}>
        <DialogContent className="bg-gradient-to-b from-gray-800 to-black border-indigo-500/30 text-white">
          <DialogHeader>
            <DialogTitle>{editingExperience ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Company</label>
              <input
                type="text"
                value={newExperience.company}
                onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                className="w-full px-3 py-2 bg-black/30 border border-indigo-500/30 rounded-lg focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-white/50"
                placeholder="Enter company name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Position</label>
              <input
                type="text"
                value={newExperience.position}
                onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                className="w-full px-3 py-2 bg-black/30 border border-indigo-500/30 rounded-lg focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-white/50"
                placeholder="Enter position"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Start Date</label>
                <input
                  type="month"
                  value={newExperience.startDate}
                  onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                  className="w-full px-3 py-2 bg-black/30 border border-indigo-500/30 rounded-lg focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-white/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">End Date</label>
                <input
                  type="month"
                  value={newExperience.endDate}
                  onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                  className="w-full px-3 py-2 bg-black/30 border border-indigo-500/30 rounded-lg focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-white/50"
                  disabled={newExperience.isCurrentPosition}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="currentPosition"
                checked={newExperience.isCurrentPosition}
                onChange={(e) => setNewExperience({ ...newExperience, isCurrentPosition: e.target.checked })}
                className="w-4 h-4 bg-black/30 border border-indigo-500/30 rounded focus:ring-1 focus:ring-indigo-500/50"
              />
              <label htmlFor="currentPosition" className="text-sm font-medium text-white">
                This is my current position
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Description</label>
              <textarea
                value={newExperience.description}
                onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                className="w-full px-3 py-2 bg-black/30 border border-indigo-500/30 rounded-lg focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-white/50 min-h-[100px]"
                placeholder="Enter description"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setIsExperienceDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddExperience}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
            >
              {editingExperience ? 'Save Changes' : 'Add Experience'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
};

export default Settings;
