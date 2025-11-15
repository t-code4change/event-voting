/**
 * POPUP COMPONENTS - USAGE EXAMPLES
 *
 * This file contains comprehensive examples of BasePopup and LogoutConfirmPopup usage.
 * Copy and adapt these examples for your own use cases.
 */

"use client"

import { useState } from "react"
import { BasePopup, LogoutConfirmPopup } from "@/components/admin"
import { logoutUser } from "@/lib/auth-utils"
import { toast } from "sonner"
import { Trash2, Download, Upload, Settings } from "lucide-react"

// ============================================================================
// EXAMPLE 1: Delete Confirmation (Danger Variant)
// ============================================================================

export function DeleteConfirmationExample() {
  const [showDeletePopup, setShowDeletePopup] = useState(false)

  const handleDelete = () => {
    // Your delete logic here
    console.log("Item deleted")
    toast.success("Item deleted successfully")
    setShowDeletePopup(false)
  }

  return (
    <>
      <button
        onClick={() => setShowDeletePopup(true)}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        Delete Item
      </button>

      <BasePopup
        isOpen={showDeletePopup}
        title="Delete Item?"
        description="This action cannot be undone. The item will be permanently removed from the database."
        variant="danger"
        confirmLabel="Delete Permanently"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeletePopup(false)}
      />
    </>
  )
}

// ============================================================================
// EXAMPLE 2: Success Notification (Success Variant)
// ============================================================================

export function SuccessNotificationExample() {
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = () => {
    // Simulate save operation
    setTimeout(() => {
      setShowSuccess(true)
    }, 1000)
  }

  return (
    <>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Save Changes
      </button>

      <BasePopup
        isOpen={showSuccess}
        title="Changes Saved!"
        description="Your changes have been saved successfully and are now live."
        variant="success"
        confirmLabel="OK"
        cancelLabel="Close"
        onConfirm={() => setShowSuccess(false)}
        onCancel={() => setShowSuccess(false)}
        showCloseIcon={true}
      />
    </>
  )
}

// ============================================================================
// EXAMPLE 3: Warning with Custom Content (Warning Variant)
// ============================================================================

export function UnsavedChangesExample() {
  const [showWarning, setShowWarning] = useState(false)

  const handleLeave = () => {
    console.log("Leaving without saving")
    setShowWarning(false)
    // Navigate away
  }

  return (
    <>
      <button
        onClick={() => setShowWarning(true)}
        className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600"
      >
        Leave Page
      </button>

      <BasePopup
        isOpen={showWarning}
        title="Unsaved Changes"
        variant="warning"
        confirmLabel="Leave Anyway"
        cancelLabel="Stay"
        onConfirm={handleLeave}
        onCancel={() => setShowWarning(false)}
      >
        <div className="space-y-3 text-center">
          <p className="text-white/80">
            You have unsaved changes that will be lost if you leave.
          </p>
          <div className="p-3 bg-white/5 rounded-lg">
            <ul className="text-sm text-white/70 space-y-1">
              <li>• Event name modified</li>
              <li>• 3 candidates added</li>
              <li>• Settings changed</li>
            </ul>
          </div>
          <p className="text-white/60 text-xs">
            Are you sure you want to discard these changes?
          </p>
        </div>
      </BasePopup>
    </>
  )
}

// ============================================================================
// EXAMPLE 4: Async Operation with Loading (Info Variant)
// ============================================================================

export function AsyncOperationExample() {
  const [showPopup, setShowPopup] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleExport = async () => {
    setIsProcessing(true)

    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast.success("Export completed successfully")
      setShowPopup(false)
    } catch (error) {
      toast.error("Export failed")
      // Keep popup open so user can retry
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowPopup(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Export Data
      </button>

      <BasePopup
        isOpen={showPopup}
        title="Export Data"
        description="This will export all event data to a CSV file. This may take a few moments."
        variant="info"
        confirmLabel={isProcessing ? "Exporting..." : "Export"}
        cancelLabel="Cancel"
        onConfirm={handleExport}
        onCancel={() => setShowPopup(false)}
        confirmLoading={isProcessing}
        confirmDisabled={isProcessing}
      />
    </>
  )
}

// ============================================================================
// EXAMPLE 5: Multi-step with Custom Content
// ============================================================================

export function MultiStepExample() {
  const [showPopup, setShowPopup] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "pro" | "enterprise">("basic")

  const plans = {
    basic: { name: "Basic", price: "$10/mo" },
    pro: { name: "Pro", price: "$29/mo" },
    enterprise: { name: "Enterprise", price: "$99/mo" }
  }

  const handleSubscribe = () => {
    console.log("Subscribing to:", selectedPlan)
    toast.success(`Subscribed to ${plans[selectedPlan].name} plan`)
    setShowPopup(false)
  }

  return (
    <>
      <button
        onClick={() => setShowPopup(true)}
        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
      >
        Subscribe
      </button>

      <BasePopup
        isOpen={showPopup}
        title="Choose Your Plan"
        variant="info"
        confirmLabel="Subscribe Now"
        cancelLabel="Cancel"
        onConfirm={handleSubscribe}
        onCancel={() => setShowPopup(false)}
      >
        <div className="space-y-4">
          <p className="text-white/80 text-center">
            Select the plan that best fits your needs:
          </p>

          <div className="space-y-2">
            {(["basic", "pro", "enterprise"] as const).map((plan) => (
              <button
                key={plan}
                onClick={() => setSelectedPlan(plan)}
                className={`w-full p-3 rounded-lg border-2 transition-all ${
                  selectedPlan === plan
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">
                    {plans[plan].name}
                  </span>
                  <span className="text-white/70">
                    {plans[plan].price}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <p className="text-white/60 text-xs text-center">
            You can cancel or change your plan anytime.
          </p>
        </div>
      </BasePopup>
    </>
  )
}

// ============================================================================
// EXAMPLE 6: Logout Confirmation (Pre-made Component)
// ============================================================================

export function LogoutExample() {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      const { success, error } = await logoutUser()

      if (!success) {
        toast.error(error || "Logout failed")
        return
      }

      toast.success("Logged out successfully")
      setShowLogoutPopup(false)

      // Redirect or refresh
      window.location.href = "/"
    } catch (error) {
      toast.error("An error occurred during logout")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowLogoutPopup(true)}
        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
      >
        Logout
      </button>

      <LogoutConfirmPopup
        isOpen={showLogoutPopup}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutPopup(false)}
        isLoading={isLoggingOut}
      />
    </>
  )
}

// ============================================================================
// EXAMPLE 7: Upload Confirmation with File Info
// ============================================================================

export function UploadConfirmationExample() {
  const [showUploadPopup, setShowUploadPopup] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setShowUploadPopup(true)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    console.log("Uploading:", selectedFile.name)
    toast.success("File uploaded successfully")
    setShowUploadPopup(false)
    setSelectedFile(null)
  }

  return (
    <>
      <label className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 cursor-pointer inline-flex items-center gap-2">
        <Upload className="w-4 h-4" />
        Choose File
        <input
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept=".csv,.xlsx"
        />
      </label>

      {selectedFile && (
        <BasePopup
          isOpen={showUploadPopup}
          title="Upload File"
          variant="info"
          confirmLabel="Upload"
          cancelLabel="Cancel"
          onConfirm={handleUpload}
          onCancel={() => {
            setShowUploadPopup(false)
            setSelectedFile(null)
          }}
        >
          <div className="space-y-3">
            <p className="text-white/80 text-center">
              You are about to upload:
            </p>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">
                    {selectedFile.name}
                  </p>
                  <p className="text-white/60 text-sm">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Upload className="w-8 h-8 text-indigo-500" />
              </div>
            </div>
            <p className="text-white/60 text-xs text-center">
              Make sure the file format is correct before uploading.
            </p>
          </div>
        </BasePopup>
      )}
    </>
  )
}

// ============================================================================
// EXAMPLE 8: Settings Reset with Custom Icon
// ============================================================================

export function ResetSettingsExample() {
  const [showResetPopup, setShowResetPopup] = useState(false)

  const handleReset = () => {
    console.log("Settings reset to default")
    toast.info("Settings have been reset to default values")
    setShowResetPopup(false)
  }

  return (
    <>
      <button
        onClick={() => setShowResetPopup(true)}
        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
      >
        <Settings className="w-4 h-4" />
        Reset Settings
      </button>

      <BasePopup
        isOpen={showResetPopup}
        title="Reset Settings?"
        description="This will restore all settings to their default values. Your custom configurations will be lost."
        variant="warning"
        confirmLabel="Reset to Default"
        cancelLabel="Keep Current Settings"
        onConfirm={handleReset}
        onCancel={() => setShowResetPopup(false)}
      />
    </>
  )
}

// ============================================================================
// DEMO PAGE - Display all examples
// ============================================================================

export default function PopupExamplesPage() {
  return (
    <div className="min-h-screen bg-[#0C0F15] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">
            Popup Components Examples
          </h1>
          <p className="text-white/60">
            Interactive examples of BasePopup and LogoutConfirmPopup
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-white font-semibold mb-3">Delete Confirmation</h3>
            <DeleteConfirmationExample />
          </div>

          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-white font-semibold mb-3">Success Notification</h3>
            <SuccessNotificationExample />
          </div>

          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-white font-semibold mb-3">Unsaved Changes</h3>
            <UnsavedChangesExample />
          </div>

          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-white font-semibold mb-3">Async Operation</h3>
            <AsyncOperationExample />
          </div>

          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-white font-semibold mb-3">Multi-step</h3>
            <MultiStepExample />
          </div>

          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-white font-semibold mb-3">Logout</h3>
            <LogoutExample />
          </div>

          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-white font-semibold mb-3">Upload</h3>
            <UploadConfirmationExample />
          </div>

          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-white font-semibold mb-3">Reset Settings</h3>
            <ResetSettingsExample />
          </div>
        </div>
      </div>
    </div>
  )
}
