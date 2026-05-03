export type NormalizedCourseCode = {
  id: string;
  code: string;
  department: string;
};

const courseCodePattern = /^\s*([a-zA-Z]{2,8})[\s-]*([0-9]{2,4}[a-zA-Z]?)\s*$/;

export function normalizeCourseCode(input: string): NormalizedCourseCode | null {
  const match = input.match(courseCodePattern);

  if (!match) {
    return null;
  }

  const department = match[1].toUpperCase();
  const number = match[2].toUpperCase();

  return {
    id: `${department}-${number}`,
    code: `${department} ${number}`,
    department
  };
}

export function normalizeCourseId(input: string) {
  return normalizeCourseCode(input)?.id ?? input.trim().toUpperCase();
}

export function formatCourseCode(input: string) {
  return normalizeCourseCode(input)?.code ?? input.trim().toUpperCase();
}
