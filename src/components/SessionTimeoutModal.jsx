// components/SessionTimeoutModal.jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock } from "lucide-react"

export const SessionTimeoutModal = ({ 
  isOpen, 
  timeLeft, 
  onExtend, 
  onLogout 
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <DialogTitle>Session Expiring Soon</DialogTitle>
          </div>
          <DialogDescription>
            Your session will expire due to inactivity. You will be automatically logged out in:
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex items-center gap-2 text-2xl font-mono font-bold text-red-600">
            <Clock className="h-6 w-6" />
            {formatTime(timeLeft)}
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Click "Stay Logged In" to extend your session, or "Logout" to end your session now.
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="flex-1"
          >
            Logout Now
          </Button>
          <Button 
            onClick={onExtend}
            className="flex-1"
          >
            Stay Logged In
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}