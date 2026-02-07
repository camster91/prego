import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Calendar,
  Bell,
  Volume2,
  Heart,
  Shield,
  FileText,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { PageLayout } from '../shared/components/layout/PageLayout';
import { Card, CardContent } from '../shared/components/ui/Card';
import { Button } from '../shared/components/ui/Button';
import { TrimesterBadge } from '../shared/components/ui/Badge';
import { Modal } from '../shared/components/ui/Modal';
import { useUserStore } from '../stores';
import { format, differenceInDays } from 'date-fns';
import { cn } from '../shared/utils/cn';

function SettingsPage() {
  const navigate = useNavigate();
  const profile = useUserStore((state) => state.profile);
  const updatePreferences = useUserStore((state) => state.updatePreferences);
  const updateDueDate = useUserStore((state) => state.updateDueDate);
  const clearProfile = useUserStore((state) => state.clearProfile);

  const [showDueDateModal, setShowDueDateModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [newDueDate, setNewDueDate] = useState(
    profile?.dueDate ? format(new Date(profile.dueDate), 'yyyy-MM-dd') : ''
  );

  if (!profile) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Please complete onboarding first.</p>
          <Button onClick={() => navigate('/onboarding')} className="mt-4">
            Get Started
          </Button>
        </div>
      </PageLayout>
    );
  }

  const daysUntilDue = differenceInDays(new Date(profile.dueDate), new Date());

  const handleSaveDueDate = () => {
    if (newDueDate) {
      updateDueDate(new Date(newDueDate));
      setShowDueDateModal(false);
    }
  };

  const handleReset = () => {
    clearProfile();
    navigate('/onboarding');
  };

  return (
    <PageLayout title="Settings" subtitle="Manage your profile and preferences">
      {/* Profile Summary */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {profile.displayName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <TrimesterBadge trimester={profile.currentTrimester} />
                <span className="text-sm text-gray-500">
                  Week {profile.currentWeek}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-primary-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-600 font-medium">Due Date</p>
                <p className="text-lg font-bold text-primary-800">
                  {format(new Date(profile.dueDate), 'MMMM d, yyyy')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-primary-600 font-medium">Days to go</p>
                <p className="text-2xl font-bold text-primary-800">
                  {Math.max(0, daysUntilDue)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pregnancy Settings */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
          Pregnancy
        </h3>
        <Card padding="none">
          <SettingsItem
            icon={Calendar}
            label="Due Date"
            value={format(new Date(profile.dueDate), 'MMM d, yyyy')}
            onClick={() => setShowDueDateModal(true)}
          />
          <SettingsItem
            icon={Shield}
            label="Doctor Approved"
            value={profile.doctorApproved ? 'Yes' : 'Not yet'}
            isLast
          />
        </Card>
      </div>

      {/* Preferences */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
          Preferences
        </h3>
        <Card padding="none">
          <SettingsToggle
            icon={Volume2}
            label="Workout Sounds"
            description="Play audio cues during workouts"
            enabled={profile.preferences.soundEnabled}
            onToggle={(enabled) => updatePreferences({ soundEnabled: enabled })}
          />
          <SettingsToggle
            icon={Bell}
            label="Vibration"
            description="Vibrate device for alerts"
            enabled={profile.preferences.vibrationEnabled}
            onToggle={(enabled) => updatePreferences({ vibrationEnabled: enabled })}
            isLast
          />
        </Card>
      </div>

      {/* Workout Preferences */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
          Workout Preferences
        </h3>
        <Card>
          <CardContent>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Intensity
              </label>
              <div className="flex gap-2">
                {(['low', 'moderate', 'high'] as const).map((intensity) => (
                  <button
                    key={intensity}
                    onClick={() => updatePreferences({ preferredIntensity: intensity })}
                    className={cn(
                      'flex-1 py-2 rounded-xl font-medium text-sm capitalize transition-colors',
                      profile.preferences.preferredIntensity === intensity
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {intensity}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Duration: {profile.preferences.preferredDuration} min
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={profile.preferences.preferredDuration}
                onChange={(e) =>
                  updatePreferences({ preferredDuration: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>5 min</span>
                <span>30 min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* About */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
          About
        </h3>
        <Card padding="none">
          <SettingsItem
            icon={Shield}
            label="Privacy Policy"
            onClick={() => navigate('/privacy')}
          />
          <SettingsItem
            icon={FileText}
            label="Terms of Service"
            onClick={() => navigate('/terms')}
          />
          <SettingsItem
            icon={Heart}
            label="App Version"
            value="1.0.0"
            showArrow={false}
            isLast
          />
        </Card>
      </div>

      {/* Danger Zone */}
      <div>
        <h3 className="text-sm font-medium text-red-500 uppercase tracking-wider mb-3">
          Danger Zone
        </h3>
        <Card padding="none">
          <button
            onClick={() => setShowResetModal(true)}
            className="w-full flex items-center gap-4 p-4 text-left hover:bg-red-50 transition-colors"
          >
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-red-600">Reset App</p>
              <p className="text-sm text-gray-500">
                Delete all data and start fresh
              </p>
            </div>
          </button>
        </Card>
      </div>

      {/* Due Date Modal */}
      <Modal
        isOpen={showDueDateModal}
        onClose={() => setShowDueDateModal(false)}
        title="Update Due Date"
      >
        <p className="text-gray-600 mb-4">
          Updating your due date will recalculate your current trimester and week.
        </p>
        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
          className="input mb-6"
        />
        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setShowDueDateModal(false)}
          >
            Cancel
          </Button>
          <Button fullWidth onClick={handleSaveDueDate}>
            Save
          </Button>
        </div>
      </Modal>

      {/* Reset Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset App?"
      >
        <p className="text-gray-600 mb-6">
          This will delete all your data including workout history and progress.
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setShowResetModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" fullWidth onClick={handleReset}>
            Reset Everything
          </Button>
        </div>
      </Modal>
    </PageLayout>
  );
}

interface SettingsItemProps {
  icon: React.ElementType;
  label: string;
  value?: string;
  onClick?: () => void;
  showArrow?: boolean;
  isLast?: boolean;
}

function SettingsItem({
  icon: Icon,
  label,
  value,
  onClick,
  showArrow = true,
  isLast = false
}: SettingsItemProps) {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-4 p-4 text-left',
        onClick && 'hover:bg-gray-50 transition-colors',
        !isLast && 'border-b border-gray-100'
      )}
    >
      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
      </div>
      {value && <span className="text-gray-500">{value}</span>}
      {showArrow && onClick && <ChevronRight className="w-5 h-5 text-gray-400" />}
    </Component>
  );
}

interface SettingsToggleProps {
  icon: React.ElementType;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  isLast?: boolean;
}

function SettingsToggle({
  icon: Icon,
  label,
  description,
  enabled,
  onToggle,
  isLast = false
}: SettingsToggleProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4',
        !isLast && 'border-b border-gray-100'
      )}
    >
      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        onClick={() => onToggle(!enabled)}
        className={cn(
          'w-12 h-7 rounded-full transition-colors relative',
          enabled ? 'bg-primary-600' : 'bg-gray-300'
        )}
      >
        <span
          className={cn(
            'absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform',
            enabled ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  );
}

export { SettingsPage };
