"use client"
import { Button } from "@/components/ui/button"
import { IconBrandNotion, IconDeviceFloppy, IconFileExport } from '@tabler/icons-react'
import { useToast } from "@/hooks/use-toast"

interface HeaderProps {
  title: string;
  isConnected: boolean;
  isExporting: boolean;
  onConnectNotion: () => void;
  onExportToNotion: () => void;
  onSave: () => void;
}

export default function Header({ 
  title, 
  isConnected, 
  isExporting, 
  onConnectNotion, 
  onExportToNotion, 
  onSave 
}: HeaderProps) {
  const { toast } = useToast();
  const formattedTitle = title.split(" ").slice(0, 5).join(" ") + "...";

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">{formattedTitle}</h1>
        <div className="space-x-2">
          {!isConnected ? (
            <Button 
              variant="default" 
              size="sm"
              onClick={onConnectNotion}
            >
              <IconBrandNotion className="w-4 h-4 mr-2" stroke={1.5} />
              Connect to Notion
            </Button>
          ) : (
            <Button 
              variant="default" 
              size="sm"
              onClick={onExportToNotion}
              disabled={isExporting}
            >
              <IconFileExport className="w-4 h-4 mr-2" stroke={1.5} />
              {isExporting ? 'Exporting...' : 'Export to Notion'}
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={onSave}
          >
            <IconDeviceFloppy className="w-4 h-4 mr-2" stroke={1.5} />
            Save
          </Button>
        </div>
      </div>
    </header>
  )
}