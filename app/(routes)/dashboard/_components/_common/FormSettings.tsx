"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, AlertCircle, CheckCircle2, Settings, Timer, Zap } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FormSettingsProps {
  formId: string;
  currentSettings?: {
    id?: number;
    primaryColor?: string;
    backgroundColor?: string;
    validUpto?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  };
  onSave?: (settings: FormSettingsData) => Promise<void>;
  loading?: boolean;
}

interface FormSettingsData {
  formId: string;
  primaryColor?: string;
  backgroundColor?: string;
  validUpto?: Date | null;
}

const FormSettings = ({ formId, currentSettings, onSave, loading = false }: FormSettingsProps) => {
  const [hasTimeLimit, setHasTimeLimit] = useState<boolean>(
    !!currentSettings?.validUpto
  );
  
  const [selectedDate, setSelectedDate] = useState<string>(
    currentSettings?.validUpto 
      ? new Date(currentSettings.validUpto).toISOString().slice(0, 10)
      : ""
  );
  
  const [selectedTime, setSelectedTime] = useState<string>(
    currentSettings?.validUpto 
      ? new Date(currentSettings.validUpto).toTimeString().slice(0, 5)
      : "12:00"
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Get current date and time for validation
  const now = new Date();
  const currentDate = now.toISOString().slice(0, 10);
  const currentTime = now.toTimeString().slice(0, 5);

  // Combine date and time into a single Date object
  const getSelectedDateTime = (): Date | null => {
    if (!hasTimeLimit || !selectedDate) return null;
    
    const dateTime = new Date(`${selectedDate}T${selectedTime}`);
    return dateTime;
  };

  // Check if selected date/time is valid (not in the past)
  const isValidDateTime = (): boolean => {
    const selectedDateTime = getSelectedDateTime();
    if (!selectedDateTime) return true;
    
    return selectedDateTime > now;
  };

  const handleSave = async () => {
    if (!isValidDateTime()) {
      setSaveStatus('error');
      return;
    }

    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      const settings: FormSettingsData = {
        formId,
        validUpto: getSelectedDateTime(),
        // Preserve existing color settings if they exist
        primaryColor: currentSettings?.primaryColor,
        backgroundColor: currentSettings?.backgroundColor,
      };
      
      await onSave?.(settings);
      setSaveStatus('success');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving form settings:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDateTime = (date: Date): string => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeUntilExpiry = (expiryDate: Date): string => {
    const diffMs = expiryDate.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} and ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else {
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="p-7 space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-2">Form Settings</h2>
        <p className="text-muted-foreground">
          Configure advanced settings for your form (Form ID: {formId})
        </p>
      </div>

      {/* Status Messages */}
      {saveStatus === 'success' && (
        <Alert className="border-green-200 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Form settings saved successfully!
          </AlertDescription>
        </Alert>
      )}
      
      {saveStatus === 'error' && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {!isValidDateTime() 
              ? "Please select a future date and time"
              : "Failed to save settings. Please try again."
            }
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Form Expiry Settings
          </CardTitle>
          <CardDescription>
            Set an expiry date and time after which the form will be automatically unpublished
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="time-limit-toggle" className="text-sm font-medium">
                Enable Time Limit
              </Label>
              <p className="text-xs text-muted-foreground">
                Automatically unpublish form after a specific date and time
              </p>
            </div>
            <Switch
              id="time-limit-toggle"
              checked={hasTimeLimit}
              onCheckedChange={(checked) => {
                setHasTimeLimit(checked);
                if (!checked) {
                  setSelectedDate("");
                  setSelectedTime("12:00");
                }
              }}
            />
          </div>

          {hasTimeLimit && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry-date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Expiry Date
                  </Label>
                  <input
                    id="expiry-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={currentDate}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiry-time" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Expiry Time
                  </Label>
                  <input
                    id="expiry-time"
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    min={selectedDate === currentDate ? currentTime : undefined}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              {selectedDate && (
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">
                        Form will expire on: {formatDateTime(getSelectedDateTime()!)}
                      </p>
                      {isValidDateTime() && getSelectedDateTime() && (
                        <p className="text-xs text-muted-foreground">
                          That's {getTimeUntilExpiry(getSelectedDateTime()!)} from now
                        </p>
                      )}
                      {!isValidDateTime() && (
                        <p className="text-xs text-red-600">
                          ⚠️ Selected time is in the past. Please choose a future date and time.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t">
            <Button 
              onClick={handleSave} 
              className="w-full"
              disabled={isSaving || loading || (hasTimeLimit && (!selectedDate || !isValidDateTime()))}
            >
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      {currentSettings?.validUpto && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Current Expiry Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Expires on:</span>
                <span className="text-sm">
                  {formatDateTime(new Date(currentSettings.validUpto))}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  new Date(currentSettings.validUpto) > new Date()
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {new Date(currentSettings.validUpto) > new Date()
                    ? "Active"
                    : "Expired"}
                </span>
              </div>
              
              {new Date(currentSettings.validUpto) > new Date() && (
                <p className="text-xs text-muted-foreground">
                  Time remaining: {getTimeUntilExpiry(new Date(currentSettings.validUpto))}
                </p>
              )}
              
              {currentSettings.updatedAt && (
                <p className="text-xs text-muted-foreground">
                  Last updated: {formatDateTime(new Date(currentSettings.updatedAt))}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FormSettings;