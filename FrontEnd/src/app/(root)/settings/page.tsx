'use client'

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useRecoilState } from 'recoil';
import { modeState, activeServiceState ,apiKeyDataState} from '@/app/recoilContextProvider';
import { storeApiKey, getApiKey } from '@/app/actions/apiKeyActions';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { set } from "date-fns";
import DataManagementCard from "@/components/ui/data-management-card";

type ServiceType = "gemini" | "graq" | null;

export default function SettingsPage() {
  const [activeService, setActiveService] = useRecoilState<ServiceType>(activeServiceState);
  const [mode, setMode] = useRecoilState(modeState);
  const [apikey,setApiKey] = useRecoilState(apiKeyDataState);
  const { toast } = useToast();

  const toggleService = async (service: ServiceType) => {
    if (activeService === service) {
      setActiveService(null);
      setMode("public");
    } else if (activeService === null) {
      // Fetch the API key when toggling
      const result = await getApiKey(service!);
      //  console.log(result.apiKey)
      setApiKey(result.apiKey !)
      if (result.success && result.apiKey) {
        setActiveService(service);
        setMode("private");
        toast({
          title:"API Key Found",
          description:`API key is present for ${service}`,
          variant:"default"
        })
      } else {
        toast({
          title: "Missing API Key",
          description: `Please add an API key for ${service} .`,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error 😐",
        description: `Please deactivate ${activeService} before activating ${service}.`,
        variant: "destructive",
      });
    }
  };

  return (
    <>
    <div className="w-screen bg-slate-50 p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold   text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Settings
        </h1>
      </header>
      <div className="grid gap-8 md:grid-cols-2">
        <ServiceCard
          title="Gemini"
          description="Activate Gemini service"
          isActive={activeService === "gemini"}
          onToggle={() => toggleService("gemini")}
        />
        <ServiceCard
          title="Graq"
          description="Activate Graq service"
          isActive={activeService === "graq"}
          onToggle={() => toggleService("graq")}
        />
      </div>
      <Toaster />

    <DataManagementCard/>
      
    </div>
    
    
    </>
  );
}


interface ServiceCardProps {
  title: string;
  description: string;
  isActive: boolean;
  onToggle: () => void;
}

export function ServiceCard({ title, description, isActive, onToggle }: ServiceCardProps) {
  const [apiKey, setApiKey] = useState<string>("");
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const result = await storeApiKey(title.toLowerCase(), apiKey);
      if (result.success) {
        toast({
          title: "Success",
          description: `API key for ${title} saved successfully.`,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save API key for ${title}.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 from-5% via-purple-600 via-40% to-pink-400 to to-80%">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300'} transition-colors duration-200`} />
            <span className="text-sm">{isActive ? 'Active' : 'Inactive'}</span>
          </div>
          <Switch checked={isActive} onCheckedChange={onToggle} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <Input
          type="text"
          placeholder={isActive ? "Api key found" : "Please  enter your Api key if you haven't"}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          disabled={isActive}  // Disable input if the service is inactive
        />
        <Button onClick={handleSave} className="w-full" disabled={isActive}>
          Save
        </Button>
      </CardContent>
    </Card>
  );
}
