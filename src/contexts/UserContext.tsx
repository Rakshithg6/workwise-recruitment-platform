import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  photoUrl?: string;
  jobTitle?: string;
  companyName?: string;
  role?: string;
  phone?: string;
  linkedIn?: string;
  summary?: string;
  skills?: Array<{ name: string; proficiency: number }>;
  experiences?: Array<{
    id: string;
    company: string;
    role: string;
    duration: string;
    startDate: string;
    endDate: string;
    isCurrentPosition: boolean;
    description: string;
  }>;
  education?: Array<{
    id: string;
    degree: string;
    institution: string;
    year: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
}

interface UserContextType {
  userName: string;
  userRole: string;
  userEmail: string;
  userData: UserData;
  updateUserInfo: (name: string, role: string, email: string) => void;
  updateUserData: (data: UserData) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Export the useUserContext as useUser to fix the import issues
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Keep the original hook name for backward compatibility
export const useUserContext = useUser;

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Try to load user info from localStorage if available
  const initialName = localStorage.getItem('workwise-user-name') || '';
  const initialRole = localStorage.getItem('workwise-user-role') || '';
  const initialEmail = localStorage.getItem('workwise-user-email') || '';
  
  const [userName, setUserName] = useState(initialName);
  const [userRole, setUserRole] = useState(initialRole);
  const [userEmail, setUserEmail] = useState(initialEmail);
  const [userData, setUserData] = useState<UserData>(() => {
    // Helper function to safely parse JSON data from localStorage
    const getStoredJson = (key: string) => {
      try {
        const item = localStorage.getItem(`workwise-user-${key}`);
        return item ? JSON.parse(item) : null;
      } catch {
        return null;
      }
    };

    return {
      firstName: localStorage.getItem('workwise-user-firstName') || '',
      lastName: localStorage.getItem('workwise-user-lastName') || '',
      email: initialEmail,
      photoUrl: localStorage.getItem('workwise-user-photoUrl') || '',
      jobTitle: localStorage.getItem('workwise-user-jobTitle') || '',
      companyName: localStorage.getItem('workwise-user-companyName') || '',
      role: initialRole,
      phone: localStorage.getItem('workwise-user-phone') || '',
      linkedIn: localStorage.getItem('workwise-user-linkedIn') || '',
      summary: localStorage.getItem('workwise-user-summary') || '',
      skills: getStoredJson('skills') || [],
      experiences: getStoredJson('experiences') || [],
      education: getStoredJson('education') || []
    };
  });

  // Update localStorage whenever userData changes
  useEffect(() => {
    Object.entries(userData).forEach(([key, value]) => {
      if (value) {
        // Handle arrays and objects by converting to JSON
        const storageValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        localStorage.setItem(`workwise-user-${key}`, storageValue);
      } else {
        // Remove the key if value is null/undefined
        localStorage.removeItem(`workwise-user-${key}`);
      }
    });
  }, [userData]);

  const updateUserInfo = (name: string, role: string, email: string) => {
    setUserName(name);
    setUserRole(role);
    setUserEmail(email);
    
    // Save to localStorage for persistence
    localStorage.setItem('workwise-user-name', name);
    localStorage.setItem('workwise-user-role', role);
    localStorage.setItem('workwise-user-email', email);
  };
  
  const updateUserData = (data: UserData) => {
    setUserData(prevData => {
      const newData = { ...prevData, ...data };
      
      // Update the legacy fields as well for backward compatibility
      if (data.firstName && data.lastName) {
        const fullName = `${data.firstName} ${data.lastName}`;
        setUserName(fullName);
        localStorage.setItem('workwise-user-name', fullName);
      }
      
      if (data.email) {
        setUserEmail(data.email);
        localStorage.setItem('workwise-user-email', data.email);
      }
      
      if (data.role) {
        setUserRole(data.role);
        localStorage.setItem('workwise-user-role', data.role);
      }
      
      // Save each field to localStorage
      Object.entries(newData).forEach(([key, value]) => {
        if (value) {
          // Handle arrays and objects by converting to JSON
          const storageValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
          localStorage.setItem(`workwise-user-${key}`, storageValue);
        } else {
          localStorage.removeItem(`workwise-user-${key}`);
        }
      });
      
      return newData;
    });
  };

  const logout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('workwise-user-name');
    localStorage.removeItem('workwise-user-role');
    localStorage.removeItem('workwise-user-email');
    localStorage.removeItem('workwise-user-firstName');
    localStorage.removeItem('workwise-user-lastName');
    localStorage.removeItem('workwise-user-photoUrl');
    localStorage.removeItem('workwise-user-jobTitle');
    localStorage.removeItem('workwise-user-companyName');
    localStorage.removeItem('workwise-user-phone');

    // Reset state
    setUserName('');
    setUserRole('');
    setUserEmail('');
    setUserData({});
  };

  const value = {
    userName,
    userRole,
    userEmail,
    userData,
    updateUserInfo,
    updateUserData,
    logout
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
