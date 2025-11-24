import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./client";
import { Database } from "./types";

type Profile = Database['public']['Tables']['profiles']['Row'];
type Skill = Database['public']['Tables']['skills']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];
type Experience = Database['public']['Tables']['experience']['Row'];
type Certification = Database['public']['Tables']['certifications']['Row'];
type AIKnowledge = Database['public']['Tables']['ai_knowledge']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];

// --- PROFILES ---
export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .single();
      
      if (error) {
        // If no profile exists, return null or a default object to avoid crashing
        if (error.code === 'PGRST116') return null; 
        throw error;
      }
      return data;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: Database['public']['Tables']['profiles']['Insert']) => {
      // Check if profile exists
      const { data: existing } = await supabase.from("profiles").select("id").single();
      
      if (existing) {
        const { data, error } = await supabase
          .from("profiles")
          .update(profile)
          .eq("id", existing.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("profiles")
          .insert(profile)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

// --- SKILLS ---
export const useSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

export const useAddSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (skill: Database['public']['Tables']['skills']['Insert']) => {
      const { data, error } = await supabase.from("skills").insert(skill).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...skill }: Database['public']['Tables']['skills']['Update'] & { id: string }) => {
      const { data, error } = await supabase.from("skills").update(skill).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });
};

// --- PROJECTS ---
export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useAddProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project: Database['public']['Tables']['projects']['Insert']) => {
      const { data, error } = await supabase.from("projects").insert(project).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...project }: Database['public']['Tables']['projects']['Update'] & { id: string }) => {
      const { data, error } = await supabase.from("projects").update(project).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

// --- EXPERIENCE ---
export const useExperience = () => {
  return useQuery({
    queryKey: ["experience"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useAddExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (experience: Database['public']['Tables']['experience']['Insert']) => {
      const { data, error } = await supabase.from("experience").insert(experience).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
    },
  });
};

export const useUpdateExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...experience }: Database['public']['Tables']['experience']['Update'] & { id: string }) => {
      const { data, error } = await supabase.from("experience").update(experience).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
    },
  });
};

export const useDeleteExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("experience").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
    },
  });
};

// --- EDUCATION ---
export const useEducation = () => {
  return useQuery({
    queryKey: ["education"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useAddEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (education: Database['public']['Tables']['education']['Insert']) => {
      const { data, error } = await supabase.from("education").insert(education).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
    },
  });
};

export const useUpdateEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...education }: Database['public']['Tables']['education']['Update'] & { id: string }) => {
      const { data, error } = await supabase.from("education").update(education).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
    },
  });
};

export const useDeleteEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("education").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
    },
  });
};

// --- CERTIFICATIONS ---
export const useCertifications = () => {
  return useQuery({
    queryKey: ["certifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .order("issue_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useAddCertification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (certification: Database['public']['Tables']['certifications']['Insert']) => {
      const { data, error } = await supabase.from("certifications").insert(certification).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
    },
  });
};

export const useUpdateCertification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...certification }: Database['public']['Tables']['certifications']['Update'] & { id: string }) => {
      const { data, error } = await supabase.from("certifications").update(certification).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
    },
  });
};

export const useDeleteCertification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("certifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
    },
  });
};

// --- AI KNOWLEDGE ---
export const useAIKnowledge = () => {
  return useQuery({
    queryKey: ["ai_knowledge"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_knowledge")
        .select("*")
        .order("proficiency", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useAddAIKnowledge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (knowledge: Database['public']['Tables']['ai_knowledge']['Insert']) => {
      const { data, error } = await supabase.from("ai_knowledge").insert(knowledge).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai_knowledge"] });
    },
  });
};

export const useUpdateAIKnowledge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...knowledge }: Database['public']['Tables']['ai_knowledge']['Update'] & { id: string }) => {
      const { data, error } = await supabase.from("ai_knowledge").update(knowledge).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai_knowledge"] });
    },
  });
};

export const useDeleteAIKnowledge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ai_knowledge").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai_knowledge"] });
    },
  });
};

// --- MESSAGES ---
export const useMessages = () => {
  return useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async (message: Database['public']['Tables']['messages']['Insert']) => {
      const { data, error } = await supabase.from("messages").insert(message).select().single();
      if (error) throw error;
      return data;
    },
  });
};

export const useMarkMessageRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.from("messages").update({ read: true }).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};

// --- STORAGE ---
export const useUploadImage = () => {
  return useMutation({
    mutationFn: async ({ file, bucket }: { file: File; bucket: string }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return data.publicUrl;
    },
  });
};
