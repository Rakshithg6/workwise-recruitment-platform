
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Bell, Globe, Lock, Upload, X, Award, Briefcase, GraduationCap, Code, Calendar as CalendarIcon } from 'lucide-react';
import ThemeAwareDashboardLayout from '@/components/dashboard/ThemeAwareDashboardLayout';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Skill {
  name: string;
  proficiency: number;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  startDate: string;
  endDate: string;
  isCurrentPosition: boolean;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  startDate: string;
  endDate: string;
  description: string;
}

export default function Settings() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'Settings | WorkWise';
  }, []);

  const { theme, toggleTheme } = useTheme();
  const { userData, updateUserData } = useUser();
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(userData.photoUrl || null);
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string | null>(null);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userData.firstName || '',
    lastName: userData.lastName || '',
    email: userData.email || '',
    phone: userData.phone || '',
    jobTitle: userData.jobTitle || '',
    linkedIn: userData.linkedIn || '',
    summary: userData.summary || ''
  });

  // Update form data when userData changes (e.g., after Google sign-in)
  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      firstName: userData.firstName || prevData.firstName,
      lastName: userData.lastName || prevData.lastName,
      email: userData.email || prevData.email,
      phone: userData.phone || prevData.phone,
      jobTitle: userData.jobTitle || prevData.jobTitle,
      linkedIn: userData.linkedIn || prevData.linkedIn,
      summary: userData.summary || prevData.summary
    }));
    
    // Update avatar if user has a Google profile photo
    if (userData.photoUrl) {
      setAvatarUrl(userData.photoUrl);
    }
  }, [userData]);
  
  const [skills, setSkills] = useState<Skill[]>([
    { name: "React", proficiency: 90 },
    { name: "TypeScript", proficiency: 85 },
    { name: "Node.js", proficiency: 75 },
    { name: "HTML/CSS", proficiency: 95 },
    { name: "Redux", proficiency: 80 },
  ]);
  const [newSkill, setNewSkill] = useState({ name: "", proficiency: 70 });
  
  // Experience state
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      company: "TechInnovate",
      role: "Senior Frontend Developer",
      duration: "Jan 2021 - Present",
      startDate: "2021-01",
      endDate: "",
      isCurrentPosition: true,
      description: "Leading frontend development for multiple client projects using React, TypeScript, and modern web technologies. Mentoring junior developers and implementing best practices."
    },
    {
      id: "2",
      company: "CodeCraft Solutions",
      role: "Frontend Developer",
      duration: "Jun 2019 - Dec 2020",
      startDate: "2019-06",
      endDate: "2020-12",
      isCurrentPosition: false,
      description: "Developed responsive web applications with React and Redux. Collaborated with designers and backend developers to deliver high-quality products."
    }
  ]);
  
  // Education state
  const [education, setEducation] = useState<Education[]>([
    {
      id: "1",
      degree: "B.Tech in Computer Science",
      institution: "IIT Delhi",
      year: "2015-2019",
      startDate: "2015-08",
      endDate: "2019-05",
      description: "Major in Computer Science with specialization in Web Technologies and Artificial Intelligence."
    },
    {
      id: "2",
      degree: "Higher Secondary",
      institution: "Delhi Public School",
      year: "2013-2015",
      startDate: "2013-04",
      endDate: "2015-03",
      description: "Science stream with Computer Science as an elective."
    }
  ]);
  
  // Dialog states
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);

  // Experience handling functions
  const handleExperienceChange = (field: keyof Experience, value: any) => {
    if (currentExperience) {
      const updatedExperience = { ...currentExperience };

      if (field === 'startDate' || field === 'endDate') {
        updatedExperience[field] = value ? format(value, 'yyyy-MM-dd') : '';
      } else if (field === 'isCurrentPosition') {
        updatedExperience.isCurrentPosition = value;
        if (value) {
          updatedExperience.endDate = '';
        }
      } else {
        updatedExperience[field] = value;
      }

      setCurrentExperience(updatedExperience);
    }
  };

  const saveExperience = () => {
    if (!currentExperience) return;

    // Validate required fields
    if (!currentExperience.company.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter the company name.",
        variant: "destructive"
      });
      return;
    }

    if (!currentExperience.role.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter your role.",
        variant: "destructive"
      });
      return;
    }

    if (!currentExperience.startDate) {
      toast({
        title: "Missing information",
        description: "Please select a start date.",
        variant: "destructive"
      });
      return;
    }

    // Create a clean copy of the experience
    const experienceToSave = {
      ...currentExperience,
      startDate: currentExperience.startDate,
      endDate: currentExperience.isCurrentPosition ? '' : currentExperience.endDate,
      isCurrentPosition: currentExperience.isCurrentPosition || false
    };

    // Update experiences array
    if (isEditMode) {
      setExperiences(prevExperiences => 
        prevExperiences.map(exp => 
          exp.id === experienceToSave.id ? experienceToSave : exp
        )
      );
    } else {
      setExperiences(prevExperiences => [...prevExperiences, experienceToSave]);
    }

    // Reset states
    setIsExperienceDialogOpen(false);
    setCurrentExperience(null);
    setIsEditMode(false);

    // Show success message
    toast({
      title: 'Success',
      description: isEditMode ? 'Experience updated successfully' : 'Experience added successfully',
    });
  };

  const deleteExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
    toast({
      title: 'Success',
      description: 'Experience deleted successfully',
    });
  };
  
  // New and edit form states
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
  const [currentEducation, setCurrentEducation] = useState<Education | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      // Update user data in context and localStorage
      updateUserData({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        photoUrl: avatarUrl || undefined,
        jobTitle: formData.jobTitle,
        phone: formData.phone
      });

      setSaving(false);
      toast({
        title: "Profile updated successfully",
        description: "Your changes have been saved.",
      });
    }, 1500);
  };

  const handleAvatarClick = () => {
    setIsAvatarDialogOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setTempAvatarUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = () => {
    setAvatarUrl(tempAvatarUrl);
    setIsAvatarDialogOpen(false);
    // Update user context with new avatar
    updateUserData({
      photoUrl: tempAvatarUrl || undefined
    });
    toast({
      title: "Profile picture updated",
      description: "Your profile picture has been updated successfully."
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const addSkill = () => {
    if (newSkill.name.trim() === "") {
      toast({
        title: "Skill name required",
        description: "Please enter a skill name.",
        variant: "destructive"
      });
      return;
    }
    
    setSkills([...skills, { ...newSkill }]);
    setNewSkill({ name: "", proficiency: 70 });
    
    toast({
      title: "Skill added",
      description: `${newSkill.name} has been added to your skills.`
    });
  };

  const removeSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const getProficiencyLabel = (proficiency: number) => {
    if (proficiency >= 90) return "Expert";
    if (proficiency >= 75) return "Advanced";
    if (proficiency >= 50) return "Intermediate";
    return "Beginner";
  };

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 90) return "bg-green-500";
    if (proficiency >= 75) return "bg-blue-500";
    if (proficiency >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Experience Handlers
  const handleCloseExperienceDialog = () => {
    setIsExperienceDialogOpen(false);
    setIsEditMode(false);
    setCurrentExperience({
      id: '',
      company: '',
      role: '',
      duration: '',
      startDate: '',
      endDate: '',
      isCurrentPosition: false,
      description: ''
    });
  };

  const openAddExperienceDialog = () => {
    setIsEditMode(false);
    setCurrentExperience({
      id: Math.random().toString(),
      company: '',
      role: '',
      duration: '',
      startDate: '',
      endDate: '',
      isCurrentPosition: false,
      description: ''
    });
    setIsExperienceDialogOpen(true);
  };

  const openEditExperienceDialog = (experience: Experience) => {
    setIsEditMode(true);
    setCurrentExperience({
      ...experience,
      startDate: experience.startDate || '',
      endDate: experience.endDate || '',
      isCurrentPosition: experience.isCurrentPosition || false
    });
    setIsExperienceDialogOpen(true);
  };

  // Education Handlers
  const openAddEducationDialog = () => {
    setIsEditMode(false);
    setCurrentEducation({
      id: "",
      degree: "",
      institution: "",
      year: "",
      startDate: "",
      endDate: "",
      description: ""
    });
    setIsEducationDialogOpen(true);
  };

  const openEditEducationDialog = (edu: Education) => {
    setIsEditMode(true);
    setCurrentEducation(edu);
    setIsEducationDialogOpen(true);
  };

  const handleEducationChange = (field: keyof Education, value: string | Date) => {
    if (currentEducation) {
      if (field === 'startDate' || field === 'endDate') {
        setCurrentEducation({
          ...currentEducation,
          [field]: value instanceof Date ? format(value, 'yyyy-MM-dd') : value
        });
      } else {
        setCurrentEducation({
          ...currentEducation,
          [field]: value
        });
      }
    }
  };

  const saveEducation = () => {
    if (!currentEducation) return;

    // Validate required fields
    if (!currentEducation.degree.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter your degree.",
        variant: "destructive"
      });
      return;
    }

    if (!currentEducation.institution.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter the institution name.",
        variant: "destructive"
      });
      return;
    }

    if (!currentEducation.startDate) {
      toast({
        title: "Missing information",
        description: "Please select a start date.",
        variant: "destructive"
      });
      return;
    }

    if (!currentEducation.endDate) {
      toast({
        title: "Missing information",
        description: "Please select an end date.",
        variant: "destructive"
      });
      return;
    }
    
    const newEdu = {
      ...currentEducation,
      id: isEditMode ? currentEducation.id : Date.now().toString(),
      year: `${new Date(currentEducation.startDate).getFullYear()}-${new Date(currentEducation.endDate).getFullYear()}`
    };
    
    if (isEditMode) {
      setEducation(prev => prev.map(edu => edu.id === newEdu.id ? newEdu : edu));
      toast({
        title: "Success",
        description: "Your education has been updated successfully."
      });
    } else {
      setEducation(prev => [...prev, newEdu]);
      toast({
        title: "Success",
        description: "Your education has been added successfully."
      });
    }
    
    setIsEducationDialogOpen(false);
  };

  const deleteEducation = (id: string) => {
    setEducation(prev => prev.filter(edu => edu.id !== id));
    toast({
      title: "Education removed",
      description: "Your education has been removed successfully."
    });
  };

  return (
    <ThemeAwareDashboardLayout type="candidate">
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Account Settings</h1>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 font-medium"
            disabled={saving}
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Saving Changes...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>

        <div className={`bg-gradient-to-b ${theme === 'dark' ? 'from-gray-800/80 to-black/90' : 'from-gray-100 to-white'} border ${theme === 'dark' ? 'border-indigo-500/20' : 'border-gray-200'} rounded-xl p-6 shadow-xl w-full`}>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8 bg-transparent">
              <TabsTrigger value="profile" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="experience" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <Briefcase className="mr-2 h-4 w-4" />
                Experience
              </TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <Code className="mr-2 h-4 w-4" />
                Skills
              </TabsTrigger>
              <TabsTrigger value="education" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <GraduationCap className="mr-2 h-4 w-4" />
                Education
              </TabsTrigger>

              <TabsTrigger value="security" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <Shield className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className={`w-32 h-32 border-4 ${theme === 'dark' ? 'border-indigo-500/30' : 'border-indigo-500/20'}`}>
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt="Profile" />
                    ) : (
                      <AvatarFallback className={`${theme === 'dark' ? 'bg-indigo-500/20 text-white' : 'bg-indigo-100 text-indigo-600'} text-xl`}>
                        {formData.firstName && formData.lastName ? 
                          `${formData.firstName[0]}${formData.lastName[0]}` : 
                          "JD"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Button 
                    variant="outline" 
                    className={`${theme === 'dark' ? 'border-indigo-500/30 text-white hover:bg-indigo-600/20' : 'border-indigo-200 text-indigo-700 hover:bg-indigo-50'}`} 
                    onClick={handleAvatarClick}
                  >
                    <Upload size={16} className="mr-2" />
                    Change Photo
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
                        placeholder="+91 9876543210"
                        className={`w-full ${theme === 'dark' ? 'bg-black/50 border-indigo-500/30 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Current Job Title</label>
                    <input 
                      type="text" 
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className={`w-full ${theme === 'dark' ? 'bg-black/50 border-indigo-500/30 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>LinkedIn Profile</label>
                    <input 
                      type="url" 
                      name="linkedIn"
                      value={formData.linkedIn}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/johndoe"
                      className={`w-full ${theme === 'dark' ? 'bg-black/50 border-indigo-500/30 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Professional Summary</label>
                    <textarea 
                      rows={4}
                      name="summary"
                      value={formData.summary}
                      onChange={handleInputChange}
                      placeholder="Experienced frontend developer with 4+ years of experience in building responsive web applications using React, TypeScript, and modern JavaScript frameworks. Passionate about creating intuitive user interfaces and optimizing application performance."
                      className={`w-full ${theme === 'dark' ? 'bg-black/50 border-indigo-500/30 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none resize-none`}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="experience" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Work Experience</h3>
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={openAddExperienceDialog}
                >
                  Add Experience
                </Button>
              </div>

              <Dialog open={isExperienceDialogOpen} onOpenChange={setIsExperienceDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Company</label>
                      <input
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={currentExperience?.company || ''}
                        onChange={(e) => handleExperienceChange('company', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Role</label>
                      <input
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={currentExperience?.role || ''}
                        onChange={(e) => handleExperienceChange('role', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Start Date</label>
                      <div className="col-span-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={"w-full justify-start text-left font-normal"}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {currentExperience?.startDate ? format(new Date(currentExperience.startDate), 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={currentExperience?.startDate ? new Date(currentExperience.startDate) : undefined}
                              onSelect={(date) => date && handleExperienceChange('startDate', date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">End Date</label>
                      <div className="col-span-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={"w-full justify-start text-left font-normal"}
                              disabled={currentExperience?.isCurrentPosition}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {currentExperience?.endDate ? format(new Date(currentExperience.endDate), 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={currentExperience?.endDate ? new Date(currentExperience.endDate) : undefined}
                              onSelect={(date) => date && handleExperienceChange('endDate', date)}
                              initialFocus
                              disabled={(date) =>
                                currentExperience?.startDate ? date < new Date(currentExperience.startDate) : false
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Current Position</label>
                      <div className="col-span-3 flex items-center space-x-2">
                        <Switch
                          checked={currentExperience?.isCurrentPosition || false}
                          onCheckedChange={(checked) => {
                            const updatedExperience = {
                              ...currentExperience,
                              isCurrentPosition: checked,
                              endDate: checked ? '' : currentExperience?.endDate
                            };
                            setCurrentExperience(updatedExperience);
                          }}
                          className="bg-gray-300 hover:bg-gray-400 data-[state=checked]:bg-blue-500 data-[state=checked]:hover:bg-blue-600"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {currentExperience?.isCurrentPosition ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Description</label>
                      <textarea
                        className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={currentExperience?.description || ''}
                        onChange={(e) => handleExperienceChange('description', e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsExperienceDialogOpen(false)}>Cancel</Button>
                    <Button variant="default" className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={saveExperience}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {experiences.map((exp, index) => (
                <div key={exp.id} className="bg-white/5 rounded-lg p-5 border border-white/10 space-y-3">
                  <div className="flex justify-between">
                    <h4 className="text-white font-medium text-lg">{exp.role}</h4>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-white/50 hover:text-white hover:bg-white/10"
                        onClick={() => openEditExperienceDialog(exp)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => deleteExperience(exp.id)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center text-white/70">
                    <Briefcase size={16} className="mr-2" />
                    <span>{exp.company}</span>
                    <span className="mx-2">•</span>
                    <span>
                      {format(new Date(exp.startDate), 'MMM yyyy')} - {exp.isCurrentPosition ? 'Present' : exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : ''}
                    </span>
                  </div>

                  <p className="text-white/80">{exp.description}</p>
                </div>
              ))}

              <Button 
                variant="outline" 
                className="w-full border-dashed border-white/30 hover:bg-white/5 text-white/70"
                onClick={openAddExperienceDialog}
              >
                + Add Another Experience
              </Button>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Skills</h3>
              </div>
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-5 border border-white/10 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-white font-medium">{skill.name}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 px-2 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => removeSkill(index)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                    <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full ${getProficiencyColor(skill.proficiency)}`}
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-white/70">
                      <span>{skill.proficiency}%</span>
                      <span>{getProficiencyLabel(skill.proficiency)}</span>
                    </div>
                  </div>
                ))}

                <div className="bg-white/5 rounded-lg p-5 border border-white/10 space-y-4">
                  <h4 className="text-white font-medium">Add New Skill</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Skill name"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      className="bg-black/50 border border-indigo-500/30 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none"
                    />
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={newSkill.proficiency}
                        onChange={(e) => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) })}
                        className="flex-1"
                      />
                      <span className="text-white/70 w-12">{newSkill.proficiency}%</span>
                    </div>
                  </div>
                  <Button
                    onClick={addSkill}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-2"
                  >
                    Add Skill
                  </Button>
                </div>
              </div>


              <Dialog open={isExperienceDialogOpen} onOpenChange={setIsExperienceDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Company</label>
                      <input
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={currentExperience?.company || ''}
                        onChange={(e) => handleExperienceChange('company', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Role</label>
                      <input
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={currentExperience?.role || ''}
                        onChange={(e) => handleExperienceChange('role', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Start Date</label>
                      <div className="col-span-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={"w-full justify-start text-left font-normal"}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {currentExperience?.startDate ? format(new Date(currentExperience.startDate), 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={currentExperience?.startDate ? new Date(currentExperience.startDate) : undefined}
                              onSelect={(date) => date && handleExperienceChange('startDate', date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">End Date</label>
                      <div className="col-span-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={"w-full justify-start text-left font-normal"}
                              disabled={currentExperience?.isCurrentPosition}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {currentExperience?.endDate ? format(new Date(currentExperience.endDate), 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={currentExperience?.endDate ? new Date(currentExperience.endDate) : undefined}
                              onSelect={(date) => date && handleExperienceChange('endDate', date)}
                              initialFocus
                              disabled={(date) =>
                                currentExperience?.startDate ? date < new Date(currentExperience.startDate) : false
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Current Position</label>
                      <div className="col-span-3 flex items-center space-x-2">
                        <Switch
                          checked={currentExperience?.isCurrentPosition || false}
                          onCheckedChange={(checked) => {
                            const updatedExperience = {
                              ...currentExperience,
                              isCurrentPosition: checked,
                              endDate: checked ? '' : currentExperience?.endDate
                            };
                            setCurrentExperience(updatedExperience);
                          }}
                          className="bg-gray-300 hover:bg-gray-400 data-[state=checked]:bg-blue-500 data-[state=checked]:hover:bg-blue-600"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {currentExperience?.isCurrentPosition ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Description</label>
                      <textarea
                        className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={currentExperience?.description || ''}
                        onChange={(e) => handleExperienceChange('description', e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsExperienceDialogOpen(false)}>Cancel</Button>
                    <Button variant="default" className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={saveExperience}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="education" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Education</h3>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={openAddEducationDialog}>
                  Add Education
                </Button>
              </div>

              <Dialog open={isEducationDialogOpen} onOpenChange={setIsEducationDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Education' : 'Add Education'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Degree</label>
                      <input
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={currentEducation?.degree || ''}
                        onChange={(e) => handleEducationChange('degree', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Institution</label>
                      <input
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={currentEducation?.institution || ''}
                        onChange={(e) => handleEducationChange('institution', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Start Date</label>
                      <div className="col-span-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={"w-full justify-start text-left font-normal"}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {currentEducation?.startDate ? format(new Date(currentEducation.startDate), 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={currentEducation?.startDate ? new Date(currentEducation.startDate) : undefined}
                              onSelect={(date) => date && handleEducationChange('startDate', date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">End Date</label>
                      <div className="col-span-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={"w-full justify-start text-left font-normal"}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {currentEducation?.endDate ? format(new Date(currentEducation.endDate), 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={currentEducation?.endDate ? new Date(currentEducation.endDate) : undefined}
                              onSelect={(date) => date && handleEducationChange('endDate', date)}
                              initialFocus
                              disabled={(date) =>
                                currentEducation?.startDate ? date < new Date(currentEducation.startDate) : false
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Description</label>
                      <textarea
                        className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={currentEducation?.description || ''}
                        onChange={(e) => handleEducationChange('description', e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEducationDialogOpen(false)}>Cancel</Button>
                    <Button variant="default" className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={saveEducation}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {education.map((edu) => (
                <div key={edu.id} className="bg-white/5 rounded-lg p-5 border border-white/10 space-y-3">
                  <div className="flex justify-between">
                    <h4 className="text-white font-medium text-lg">{edu.degree}</h4>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-white/50 hover:text-white hover:bg-white/10"
                        onClick={() => openEditEducationDialog(edu)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => deleteEducation(edu.id)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center text-white/70">
                    <GraduationCap size={16} className="mr-2" />
                    <span>{edu.institution}</span>
                    <span className="mx-2">•</span>
                    <span>{edu.year}</span>
                  </div>

                  <p className="text-white/80">{edu.description}</p>
                </div>
              ))}
            </TabsContent>



            <TabsContent value="security" className="space-y-6">
              <div className="space-y-6 max-w-2xl">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Current Password</label>
                      <input 
                        type="password" 
                        placeholder="Enter current password" 
                        className="w-full bg-black/50 border border-indigo-500/30 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">New Password</label>
                      <input 
                        type="password" 
                        placeholder="Enter new password" 
                        className="w-full bg-black/50 border border-indigo-500/30 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Confirm New Password</label>
                      <input 
                        type="password" 
                        placeholder="Confirm new password" 
                        className="w-full bg-black/50 border border-indigo-500/30 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Security Settings</h3>
              </div>
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                  <h4 className="text-white font-medium mb-4">Change Password</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Current Password</label>
                      <input 
                        type="password" 
                        placeholder="Enter current password" 
                        className="w-full bg-black/50 border border-indigo-500/30 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">New Password</label>
                      <input 
                        type="password" 
                        placeholder="Enter new password" 
                        className="w-full bg-black/50 border border-indigo-500/30 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Confirm New Password</label>
                      <input 
                        type="password" 
                        placeholder="Confirm new password" 
                        className="w-full bg-black/50 border border-indigo-500/30 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-2">
                      Update Password
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Avatar Upload Dialog */}
      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Avatar</DialogTitle>
            <DialogDescription>
              Choose a profile picture to upload
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex justify-center items-center">
              <Avatar className="w-32 h-32">
                {tempAvatarUrl ? (
                  <AvatarImage src={tempAvatarUrl} alt="Preview" />
                ) : avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Current" />
                ) : (
                  <AvatarFallback>JD</AvatarFallback>
                )}
              </Avatar>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/jpg,image/png"
              className="hidden"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAvatarDialogOpen(false)}>Cancel</Button>
            <Button onClick={triggerFileInput}>Browse...</Button>
            <Button onClick={handleAvatarUpload} disabled={!tempAvatarUrl}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ThemeAwareDashboardLayout>
  );
};


