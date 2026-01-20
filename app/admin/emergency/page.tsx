"use client"

import { useState } from "react"
import { useAuth, lockSystem, unlockSystem, clearAllData, isSystemLocked } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Lock, Unlock, Trash2, CheckCircle } from "lucide-react"
import { useDatabase } from "@/lib/database-context"

export default function EmergencyPanel() {
  const { user } = useAuth()
  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showLockConfirm, setShowLockConfirm] = useState(false)
  const [systemLocked, setSystemLocked] = useState(() => isSystemLocked())
  const [successMessage, setSuccessMessage] = useState("")
  const { destinations, hotels } = useDatabase()

  // Only admin can access this page
  if (!user || user.role !== "admin") {
    router.push("/dashboard")
    return null
  }

  const handleDeleteAllData = () => {
    clearAllData()
    setSuccessMessage("All database data has been permanently deleted!")
    setShowDeleteConfirm(false)
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  const handleToggleLock = () => {
    if (systemLocked) {
      unlockSystem()
      setSystemLocked(false)
      setSuccessMessage("System has been unlocked successfully!")
    } else {
      lockSystem()
      setSystemLocked(true)
      setSuccessMessage("System has been locked successfully!")
    }
    setShowLockConfirm(false)
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Emergency Control Panel</h1>
        <p className="text-gray-600 mt-2">Admin-only access. Handle with care.</p>
      </div>

      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Lock/Unlock */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              {systemLocked ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
              System Lock Control
            </CardTitle>
            <CardDescription>Lock or unlock the entire system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-700 mb-4">
                Current Status:{" "}
                <span className={`font-bold ${systemLocked ? "text-red-600" : "text-green-600"}`}>
                  {systemLocked ? "LOCKED" : "UNLOCKED"}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                When locked, regular users cannot access the system. Admin can always access.
              </p>
            </div>

            {!showLockConfirm ? (
              <Button
                onClick={() => setShowLockConfirm(true)}
                className={`w-full ${systemLocked ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}`}
              >
                {systemLocked ? "Unlock System" : "Lock System"}
              </Button>
            ) : (
              <div className="space-y-2">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Are you sure? This will {systemLocked ? "enable" : "disable"} access for all users.
                  </AlertDescription>
                </Alert>
                <div className="flex gap-2">
                  <Button onClick={handleToggleLock} className="flex-1 bg-red-600 hover:bg-red-700">
                    Confirm
                  </Button>
                  <Button onClick={() => setShowLockConfirm(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete All Data */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete All Database
            </CardTitle>
            <CardDescription>Permanently delete all system data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-700 mb-4">
                <span className="font-bold text-red-600">WARNING:</span> This action is permanent and cannot be undone.
              </p>
              <p className="text-sm text-gray-600">
                Total Records: {destinations.length} destinations, {hotels.length} hotels
              </p>
            </div>

            {!showDeleteConfirm ? (
              <Button onClick={() => setShowDeleteConfirm(true)} className="w-full bg-red-600 hover:bg-red-700">
                Delete All Data
              </Button>
            ) : (
              <div className="space-y-2">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This will permanently delete all destinations, hotels, and trips. This cannot be undone!
                  </AlertDescription>
                </Alert>
                <div className="flex gap-2">
                  <Button onClick={handleDeleteAllData} className="flex-1 bg-red-600 hover:bg-red-700">
                    Delete Everything
                  </Button>
                  <Button onClick={() => setShowDeleteConfirm(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Admin User:</span>
              <span className="font-semibold">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">System Status:</span>
              <span className={`font-semibold ${systemLocked ? "text-red-600" : "text-green-600"}`}>
                {systemLocked ? "LOCKED" : "OPERATIONAL"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Destinations:</span>
              <span className="font-semibold">{destinations.length}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Hotels:</span>
              <span className="font-semibold">{hotels.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
