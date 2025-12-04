export const getGradeColor = (grade: string) => {
  const colors: { [key: string]: string } = {
    'A': 'bg-green-100 text-green-700',
    'B': 'bg-primary-100 text-primary-700',
    'C': 'bg-yellow-100 text-yellow-700',
    'D': 'bg-orange-100 text-orange-700',
    'F': 'bg-red-100 text-red-700',
    'P': 'bg-stone-100 text-stone-700',
  }
  return colors[grade] || 'bg-stone-100 text-stone-700'
}
