"use client"

import { Check, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCustomTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"
import type { ThemeName } from "@/lib/themes"

export function ThemeSelector() {
  const { theme, setTheme, themeNames } = useCustomTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Select theme">
          <Palette className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          {Object.entries(themeNames).map(([themeName, displayName]) => (
            <DropdownMenuItem
              key={themeName}
              className={cn("flex items-center justify-between cursor-pointer", theme === themeName && "bg-accent")}
              onClick={() => setTheme(themeName as ThemeName)}
            >
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full bg-${themeName}-theme`} />
                <span>{displayName}</span>
              </div>
              {theme === themeName && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
