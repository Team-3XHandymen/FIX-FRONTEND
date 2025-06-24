
import HandymanDashboardLayout from "@/components/handyman/HandymanDashboardLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calendar, Globe, Bell, Lock } from "lucide-react";
import React, { useState } from "react";

const HandymanSettings = () => {
  // Example states (for demonstration; real logic/data/fetching isn't needed per instructions)
  const [calendarView, setCalendarView] = useState("daily");
  const [completedColor, setCompletedColor] = useState("#10B981");
  const [inProgressColor, setInProgressColor] = useState("#F5E90B");
  const [showCompleted, setShowCompleted] = useState(false);
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("est");
  const [dateFormat, setDateFormat] = useState("us");
  const [timeFormat, setTimeFormat] = useState("12h");
  // Notifications
  const [emailOpts, setEmailOpts] = useState({
    newJob: true,
    jobReminders: true,
    payment: true,
    marketing: false,
  });
  const [smsOpts, setSmsOpts] = useState({
    jobReminders: true,
    newJob: false,
  });
  // Privacy
  const [privacy, setPrivacy] = useState({
    stats: true,
    publicProfile: false,
  });

  // Handlers
  const handleEmailChange = (key: string) => setEmailOpts(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev]}));
  const handleSmsChange = (key: string) => setSmsOpts(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev]}));
  const handlePrivacyChange = (key: string) => setPrivacy(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev]}));

  return (
    <HandymanDashboardLayout title="Settings">
      <div className="flex flex-col gap-8 pb-8">
        {/* General Settings */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Calendar className="text-green-600" size={22} />
            <CardTitle className="text-base font-semibold">General Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-5 md:gap-8 mb-5">
              <div className="flex-1 flex flex-col gap-2">
                <Label htmlFor="calendar-view" className="font-medium">Default Calendar View</Label>
                <Select value={calendarView} onValueChange={setCalendarView}>
                  <SelectTrigger id="calendar-view" className="w-full max-w-xs">
                    <SelectValue placeholder="Select view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <Label className="font-medium">Job Status Colors</Label>
                <div className="flex flex-wrap items-center gap-5">
                  <div>
                    <Label className="text-xs mb-1 block">Completed</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="color"
                        className="h-9 w-12 border"
                        value={completedColor}
                        onChange={e => setCompletedColor(e.target.value)}
                        aria-label="Completed Color"
                      />
                      <Input
                        className="w-28"
                        value={completedColor}
                        onChange={e => setCompletedColor(e.target.value)}
                        maxLength={8}
                        aria-label="Completed Color Hex"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">In Progress</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="color"
                        className="h-9 w-12 border"
                        value={inProgressColor}
                        onChange={e => setInProgressColor(e.target.value)}
                        aria-label="In Progress Color"
                      />
                      <Input
                        className="w-28"
                        value={inProgressColor}
                        onChange={e => setInProgressColor(e.target.value)}
                        maxLength={8}
                        aria-label="InProgress Color Hex"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Checkbox
                    id="show-completed"
                    checked={showCompleted}
                    onCheckedChange={checked => setShowCompleted(Boolean(checked))}
                  />
                  <Label htmlFor="show-completed" className="text-gray-600 text-sm">
                    Show completed jobs in calendar
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end pt-2">
            <Button className="bg-[#14B22D] hover:bg-[#13a428] px-6" type="button">
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        {/* Regional Settings */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Globe className="text-green-600" size={22} />
            <CardTitle className="text-base font-semibold">Regional Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-5 mb-5">
              {/* Language */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="language" className="font-medium">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (US)</SelectItem>
                    <SelectItem value="es">Spanish (ES)</SelectItem>
                    <SelectItem value="fr">French (FR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Timezone */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="tz" className="font-medium">Time Zone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger id="tz">
                    <SelectValue placeholder="Timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="est">Eastern Time (US & Canada)</SelectItem>
                    <SelectItem value="cst">Central Time (US & Canada)</SelectItem>
                    <SelectItem value="pst">Pacific Time (US & Canada)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Date Format */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="date-fmt" className="font-medium">Date Format</Label>
                <Select value={dateFormat} onValueChange={setDateFormat}>
                  <SelectTrigger id="date-fmt">
                    <SelectValue placeholder="Date Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">MM/DD/YYYY</SelectItem>
                    <SelectItem value="intl">DD/MM/YYYY</SelectItem>
                    <SelectItem value="iso">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Time Format */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="time-fmt" className="font-medium">Time Format</Label>
                <Select value={timeFormat} onValueChange={setTimeFormat}>
                  <SelectTrigger id="time-fmt">
                    <SelectValue placeholder="Time Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                    <SelectItem value="24h">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end pt-2">
            <Button className="bg-[#14B22D] hover:bg-[#13a428] px-6" type="button">
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Bell className="text-green-600" size={22} />
            <CardTitle className="text-base font-semibold">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Email Notifications */}
            <div className="mb-4">
              <div className="font-semibold text-green-900 text-sm mb-2">Email Notifications</div>
              <div className="flex flex-col gap-2 pl-2">
                <label className="flex items-center gap-2 text-green-800">
                  <Checkbox checked={emailOpts.newJob} onCheckedChange={() => handleEmailChange("newJob")} />
                  <span className="text-green-800 text-base font-medium">New job requests</span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox checked={emailOpts.jobReminders} onCheckedChange={() => handleEmailChange("jobReminders")} />
                  <span className="text-gray-700 text-base font-normal">Job reminders (24h before)</span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox checked={emailOpts.payment} onCheckedChange={() => handleEmailChange("payment")} />
                  <span className="text-gray-700 text-base font-normal">Payment received</span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox checked={emailOpts.marketing} onCheckedChange={() => handleEmailChange("marketing")} />
                  <span className="text-gray-700 text-base font-normal">Marketing updates</span>
                </label>
              </div>
            </div>
            {/* SMS Notifications */}
            <div>
              <div className="font-semibold text-green-900 text-sm mb-2">SMS Notifications</div>
              <div className="flex flex-col gap-2 pl-2">
                <label className="flex items-center gap-2">
                  <Checkbox checked={smsOpts.jobReminders} onCheckedChange={() => handleSmsChange("jobReminders")} />
                  <span className="text-gray-700 text-base font-normal">Job reminders (2h before)</span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox checked={smsOpts.newJob} onCheckedChange={() => handleSmsChange("newJob")} />
                  <span className="text-gray-700 text-base font-normal">New job requests</span>
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end pt-2">
            <Button className="bg-[#14B22D] hover:bg-[#13a428] px-6" type="button">
              Save Preferences
            </Button>
          </CardFooter>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Lock className="text-green-600" size={22} />
            <CardTitle className="text-base font-semibold">Privacy Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-green-900 text-sm mb-1">Data Sharing</div>
              <label className="flex items-center gap-2">
                <Switch checked={privacy.stats} onCheckedChange={() => handlePrivacyChange("stats")} />
                <span className="text-gray-700 text-base font-normal">Share job statistics anonymously to improve the service</span>
              </label>
              <label className="flex items-center gap-2">
                <Switch checked={privacy.publicProfile} onCheckedChange={() => handlePrivacyChange("publicProfile")} />
                <span className="text-gray-700 text-base font-normal">Allow my profile to be discoverable in public directory</span>
              </label>
            </div>
          </CardContent>
          <CardFooter className="justify-end pt-2">
            <Button className="bg-[#14B22D] hover:bg-[#13a428] px-6" type="button">
              Save Preferences
            </Button>
          </CardFooter>
        </Card>
      </div>
    </HandymanDashboardLayout>
  );
};

export default HandymanSettings;
