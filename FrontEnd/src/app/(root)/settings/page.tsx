'use client'

import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useRecoilState } from 'recoil';
import { modeState, activeServiceState, apiKeyDataState } from '@/app/recoilContextProvider';
import { getApiKey } from '@/app/actions/apiKeyActions';
import DataManagementCard from "@/components/ui/data-management-card";
import { ServiceCard } from "@/components/ui/serviceCard";

type ServiceType = "gemini" | "graq" | null;

export default function SettingsPage() {
  const [activeService, setActiveService] = useRecoilState<ServiceType>(activeServiceState);
  const [mode, setMode] = useRecoilState(modeState);
  const [apikey, setApiKey] = useRecoilState(apiKeyDataState);
  const { toast } = useToast();

  const toggleService = async (service: ServiceType) => {
    if (activeService === service) {
      setActiveService(null);
      setMode("public");
    } else if (activeService === null) {
      const result = await getApiKey(service!);
      setApiKey(result.apiKey!)
      if (result.success && result.apiKey) {
        setActiveService(service);
        setMode("private");
        toast({
          title: "API Key Found",
          description: `API key is present for ${service}`,
          variant: "default"
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
    <div className="w-screen bg-slate-50 p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
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
      <DataManagementCard />
    </div>
  );
}