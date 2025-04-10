import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Gemini API key not found. Please check your .env file.');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  status: 'active' | 'closed';
  postedDate: string;
  applications: number;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: number;
  skills: string[];
  status: 'new' | 'screening' | 'interviewing' | 'offered' | 'hired' | 'rejected';
  appliedFor: string;
  resumeUrl?: string;
}

interface Interview {
  id: string;
  candidateId: string;
  jobId: string;
  date: string;
  time: string;
  type: 'phone' | 'video' | 'onsite';
  status: 'scheduled' | 'completed' | 'cancelled';
  feedback?: string;
  meetingLink?: string;
}

// Function to generate response using Gemini
export async function generateResponse(
  userInput: string,
  context: {
    jobListings?: JobListing[];
    candidates?: Candidate[];
    interviews?: Interview[];
    userData?: any;
  }
) {
  try {
    if (!API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    // Handle specific queries without using Gemini API
    const inputLower = userInput.toLowerCase();
    
    // Job listings related queries
    if (inputLower.includes('job') || inputLower.includes('listing') || inputLower.includes('position')) {
      const activeJobs = context.jobListings?.filter(job => job.status === 'active') || [];
      if (activeJobs.length > 0) {
        let response = `Here are the active job listings:\n\n`;
        activeJobs.forEach(job => {
          response += ` ${job.title} at ${job.company}\n`;
          response += ` Location: ${job.location}\n`;
          response += ` Type: ${job.type}\n`;
          response += ` Requirements: ${job.requirements.join(', ')}\n`;
          response += ` Applications received: ${job.applications}\n\n`;
        });
        return response;
      }
      return "There are currently no active job listings.";
    }

    // Candidate related queries
    if (inputLower.includes('candidate') || inputLower.includes('applicant')) {
      if (context.candidates && context.candidates.length > 0) {
        let response = `Here are the current candidates:\n\n`;
        context.candidates.forEach(candidate => {
          response += ` ${candidate.name}\n`;
          response += ` Email: ${candidate.email}\n`;
          response += ` Experience: ${candidate.experience} years\n`;
          response += ` Skills: ${candidate.skills.join(', ')}\n`;
          response += ` Status: ${candidate.status}\n\n`;
        });
        return response;
      }
      return "There are currently no candidates in the system.";
    }

    // Interview related queries
    if (inputLower.includes('interview') || inputLower.includes('schedule')) {
      const upcomingInterviews = context.interviews?.filter(interview => interview.status === 'scheduled') || [];
      if (upcomingInterviews.length > 0) {
        let response = `Here are the upcoming interviews:\n\n`;
        upcomingInterviews.forEach(interview => {
          const candidate = context.candidates?.find(c => c.id === interview.candidateId);
          response += ` Date: ${interview.date} at ${interview.time}\n`;
          response += ` Candidate: ${candidate?.name || 'Unknown'}\n`;
          response += ` Type: ${interview.type} interview\n`;
          if (interview.meetingLink) {
            response += ` Meeting Link: ${interview.meetingLink}\n`;
          }
          response += '\n';
        });
        return response;
      }
      return "There are no upcoming interviews scheduled.";
    }

    // If no specific query matches, use Gemini API
    const prompt = `
      You are Eva, an AI assistant for the WorkWise HR portal. You help employers manage their recruitment process.
      You have access to real-time data about job listings, candidates, and interviews. Always be professional and concise.

      Current context:
      ${context.jobListings ? `Job Listings (${context.jobListings.length}):
${context.jobListings.map(job => `- ${job.title} at ${job.company} (${job.status}, ${job.applications} applications)`).join('\n')}` : 'No job listings available.'}

      ${context.candidates ? `Candidates (${context.candidates.length}):
${context.candidates.map(candidate => `- ${candidate.name}: ${candidate.skills.join(', ')} (Status: ${candidate.status})`).join('\n')}` : 'No candidate data available.'}

      ${context.interviews ? `Upcoming Interviews (${context.interviews.length}):
${context.interviews.filter(i => i.status === 'scheduled').map(interview => `- ${interview.date} ${interview.time}: ${interview.type} interview`).join('\n')}` : 'No scheduled interviews.'}

      User Query: ${userInput}

      Instructions:
      1. If the query is about specific data, provide precise information from the context
      2. If asked about statistics or trends, analyze the available data
      3. For process questions, explain the relevant workflow
      4. If data is missing, suggest how to find or add it
      5. Keep responses professional and action-oriented

      Respond in a helpful, professional manner focusing on actionable insights and specific data from the context.
    `;

    // Get response from Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    return text;
  } catch (error) {
    console.error('Error generating response:', error);
    // Return data from context instead of error message
    if (context.jobListings && context.jobListings.length > 0) {
      let response = `Here are the current job listings:\n\n`;
      context.jobListings.forEach(job => {
        response += ` ${job.title} at ${job.company}\n`;
        response += ` Location: ${job.location}\n`;
        response += ` Type: ${job.type}\n`;
        response += ` Applications: ${job.applications}\n\n`;
      });
      return response;
    }
    return "I apologize for the technical difficulty. Let me show you what I have:\n\nThere are currently no job listings in the system. Would you like to post a new job?";
  }
}
