import { useState } from 'react';
import { useAddInstructor } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AddInstructorForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [pin, setPin] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const addInstructor = useAddInstructor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !department.trim() || !pin.trim()) {
      setErrorMsg('All fields are required.');
      return;
    }
    if (pin.length < 4) {
      setErrorMsg('PIN must be at least 4 characters.');
      return;
    }

    try {
      const newId = await addInstructor.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        department: department.trim(),
        pin: pin.trim(),
      });
      setSuccessMsg(`Instructor "${name}" added with ID #${String(newId)}.`);
      setName('');
      setEmail('');
      setDepartment('');
      setPin('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add instructor.';
      setErrorMsg(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="ins-name" className="text-xs font-medium text-au-navy">
            Full Name
          </Label>
          <Input
            id="ins-name"
            placeholder="Dr. Priya Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={addInstructor.isPending}
            className="border-red-100 focus-visible:ring-au-red/30"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ins-email" className="text-xs font-medium text-au-navy">
            Email
          </Label>
          <Input
            id="ins-email"
            type="email"
            placeholder="priya@anurag.edu.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={addInstructor.isPending}
            className="border-red-100 focus-visible:ring-au-red/30"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ins-dept" className="text-xs font-medium text-au-navy">
            Department
          </Label>
          <Input
            id="ins-dept"
            placeholder="Computer Science"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            disabled={addInstructor.isPending}
            className="border-red-100 focus-visible:ring-au-red/30"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ins-pin" className="text-xs font-medium text-au-navy">
            PIN / Password
          </Label>
          <Input
            id="ins-pin"
            type="password"
            placeholder="Min. 4 characters"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            disabled={addInstructor.isPending}
            className="border-red-100 focus-visible:ring-au-red/30"
          />
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <Button
        type="submit"
        disabled={addInstructor.isPending}
        className="bg-au-red hover:bg-au-red-dark text-white border-0 font-semibold"
      >
        {addInstructor.isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Adding…
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Instructor
          </>
        )}
      </Button>
    </form>
  );
}
