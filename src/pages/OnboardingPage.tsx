import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, AlertCircle, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../shared/components/ui/Button';
import { Card, CardContent } from '../shared/components/ui/Card';
import { useUserStore, createUserProfile } from '../stores';
import { parseCalendarDate, calculatePregnancyInfo } from '../stores/userStore';
import { cn } from '../shared/utils/cn';

const STEPS = ['welcome', 'name', 'due-date', 'health', 'complete'] as const;
type Step = (typeof STEPS)[number];

function OnboardingPage() {
  const navigate = useNavigate();
  const setProfile = useUserStore((state) => state.setProfile);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);

  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [doctorApproved, setDoctorApproved] = useState(false);

  const goBack = () => {
    const currentIndex = STEPS.indexOf(step);
    if (currentIndex > 0) {
      setStep(STEPS[currentIndex - 1]);
    }
  };

  const handleComplete = () => {
    const profile = createUserProfile({
      displayName: name.trim(),
      dueDate: parseCalendarDate(dueDate),
      doctorApproved
    });

    setProfile(profile);
    completeOnboarding();
    navigate('/');
  };

  const showBackButton = step !== 'welcome';

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-sage-50 flex flex-col">
      {/* Header with back button and progress dots */}
      <div className="relative flex items-center justify-center pt-8 pb-4 px-4">
        {showBackButton && (
          <button
            onClick={goBack}
            className="absolute left-4 p-2 rounded-full text-gray-500 hover:bg-white/50 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex gap-2">
          {STEPS.map((s) => (
            <div
              key={s}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                step === s ? 'bg-primary-600' : 'bg-gray-300'
              )}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        {step === 'welcome' && (
          <WelcomeStep onNext={() => setStep('name')} />
        )}

        {step === 'name' && (
          <NameStep
            value={name}
            onChange={setName}
            onNext={() => setStep('due-date')}
          />
        )}

        {step === 'due-date' && (
          <DueDateStep
            value={dueDate}
            onChange={setDueDate}
            onNext={() => setStep('health')}
          />
        )}

        {step === 'health' && (
          <HealthStep
            doctorApproved={doctorApproved}
            onDoctorApprovedChange={setDoctorApproved}
            onNext={() => setStep('complete')}
          />
        )}

        {step === 'complete' && (
          <CompleteStep onComplete={handleComplete} />
        )}
      </div>
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center max-w-md animate-fade-in">
      <img src="/media/prego-studio.webp" alt="A calm studio space with a pregnant woman resting" className="mb-8 aspect-[4/3] w-full rounded-3xl object-cover" />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome to Prego
      </h1>
      <p className="text-gray-600 mb-8">
        Movement for every stage of pregnancy. A little space for you,
        with clear information and no pressure.
      </p>
      <Button size="lg" onClick={onNext} fullWidth className="gap-2">
        Get Started
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );
}

function NameStep({
  value,
  onChange,
  onNext
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}) {
  const isValid = value.trim().length >= 2;

  return (
    <div className="w-full max-w-md animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        What's your name?
      </h2>
      <p className="text-gray-600 mb-8">
        We'll use this to personalize your experience.
      </p>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your name"
        className="input mb-6 text-lg"
        aria-label="Your name"
        autoFocus
      />

      <Button
        size="lg"
        onClick={onNext}
        fullWidth
        disabled={!isValid}
        className="gap-2"
      >
        Continue
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );
}

function DueDateStep({
  value,
  onChange,
  onNext
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}) {
  const isValid = calculatePregnancyInfo(parseCalendarDate(value)).status === 'pregnancy';

  // Calculate min and max dates (roughly 9 months range)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDate = new Date(today.getTime() + 280 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
        <Calendar className="w-7 h-7 text-primary-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        When is your due date?
      </h2>
      <p className="text-gray-600 mb-8">
        This helps organise your stage information. It does not determine exercise eligibility.
      </p>

      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={minDate}
        max={maxDate}
        className="input mb-6 text-lg"
        aria-label="Due date"
      />

      <Button
        size="lg"
        onClick={onNext}
        fullWidth
        disabled={!isValid}
        className="gap-2"
      >
        Continue
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );
}

function HealthStep({
  doctorApproved,
  onDoctorApprovedChange,
  onNext
}: {
  doctorApproved: boolean;
  onDoctorApprovedChange: (v: boolean) => void;
  onNext: () => void;
}) {
  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
        <AlertCircle className="w-7 h-7 text-amber-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Important Health Notice
      </h2>
      <p className="text-gray-600 mb-6">
        Before starting any exercise program during pregnancy, please consult
        with your healthcare provider.
      </p>

      <Card className="mb-6">
        <CardContent>
          <label className="flex items-start gap-4 cursor-pointer">
            <input
              type="checkbox"
              checked={doctorApproved}
              onChange={(e) => onDoctorApprovedChange(e.target.checked)}
              className="mt-1 w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
            />
            <div>
              <p className="font-medium text-gray-900">
                I understand Prego does not provide medical clearance
              </p>
              <p className="text-sm text-gray-500">
                A checkbox cannot assess whether exercise is appropriate for me. I will follow individual advice from my healthcare professional.
              </p>
            </div>
          </label>
        </CardContent>
      </Card>

      {!doctorApproved && (
        <p className="text-sm text-amber-600 mb-4 text-center">
          Please read this notice before continuing. Guided workouts remain unavailable until professional review.
        </p>
      )}

      <Button
        size="lg"
        onClick={onNext}
        disabled={!doctorApproved}
        fullWidth
        className="gap-2"
      >
        Continue
        <ArrowRight className="w-5 h-5" />
      </Button>

      <p className="text-xs text-gray-400 text-center mt-4">
        You can update this later in Settings.
      </p>
    </div>
  );
}

function CompleteStep({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="text-center max-w-md animate-fade-in">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle className="w-10 h-10 text-emerald-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        You're all set!
      </h2>
      <p className="text-gray-600 mb-8">
        Your space is ready. Explore the app, your preferences and trusted
        resources while the guided library is reviewed.
      </p>

      <Button size="lg" onClick={onComplete} fullWidth className="gap-2">
        Explore Prego
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );
}

export { OnboardingPage };
