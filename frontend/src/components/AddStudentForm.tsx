import { useState } from 'react';
import { useAddStudent } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AddStudentForm() {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [course, setCourse] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const addStudent = useAddStudent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!name.trim() || !studentId.trim() || !course.trim()) {
      setErrorMsg('All fields are required.');
      return;
    }

    try {
      await addStudent.mutateAsync({ studentId: studentId.trim(), name: name.trim(), course: course.trim() });
      setSuccessMsg(`Student "${name}" added successfully!`);
      setName('');
      setStudentId('');
      setCourse('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add student.';
      setErrorMsg(msg.includes('already exists') ? `Student ID "${studentId}" already exists.` : msg);
    }
  };

  return (
    <Card className="border border-border shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 font-display text-base">
          <UserPlus className="h-4 w-4 text-primary" />
          Add New Student
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="add-name" className="text-xs font-medium">Full Name</Label>
              <Input
                id="add-name"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={addStudent.isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-sid" className="text-xs font-medium">Student ID</Label>
              <Input
                id="add-sid"
                placeholder="STU-001"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                disabled={addStudent.isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-course" className="text-xs font-medium">Course</Label>
              <Input
                id="add-course"
                placeholder="Computer Science"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                disabled={addStudent.isPending}
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
            disabled={addStudent.isPending}
            className="gradient-amber-teal text-white border-0 hover:opacity-90 font-semibold"
          >
            {addStudent.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding…
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Student
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
